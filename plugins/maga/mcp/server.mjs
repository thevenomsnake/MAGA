import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";
import {
  computeSettingsSnapshot,
  loadComputeSettings,
  resolveComputeProfile,
  saveComputeSettings,
} from "../runtime/compute-profiles.mjs";

const SERVER_NAME = "MAGA Responsibility Settings";
const SERVER_VERSION = "0.13.1";
const TEMPLATE_URI = "ui://maga/compute-settings-v1.html";
const JsonRpcError = {
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
  INTERNAL_ERROR: -32603,
};

const widgetHtml = fs.readFileSync(
  path.join(path.dirname(fileURLToPath(import.meta.url)), "compute-settings.html"),
  "utf8",
);

function send(message) {
  process.stdout.write(`${JSON.stringify(message)}\n`);
}

function sendResult(id, result) {
  send({ jsonrpc: "2.0", id, result });
}

function sendError(id, code, message) {
  send({ jsonrpc: "2.0", id, error: { code, message } });
}

class AppServerCatalogClient {
  constructor({ command = process.env.MAGA_CODEX_BINARY || "codex", timeoutMs = 15_000 } = {}) {
    this.command = command;
    this.timeoutMs = timeoutMs;
    this.pending = new Map();
    this.nextId = 0;
    this.stderr = "";
  }

  async connect() {
    this.process = spawn(this.command, ["app-server"], {
      stdio: ["pipe", "pipe", "pipe"],
      windowsHide: true,
      shell: false,
    });
    this.process.on("error", (error) => this.#fail(error));
    this.process.on("exit", (code) => this.#fail(new Error(
      `codex app-server exited with code ${code ?? "unknown"}${this.stderr ? `: ${this.stderr}` : ""}`,
    )));
    this.process.stderr.on("data", (chunk) => {
      this.stderr = `${this.stderr}${chunk}`.slice(-8_000).trim();
    });
    readline.createInterface({ input: this.process.stdout, crlfDelay: Infinity }).on("line", (line) => {
      let message;
      try {
        message = JSON.parse(line);
      } catch {
        return;
      }
      if (message.id === undefined || message.method) return;
      const pending = this.pending.get(message.id);
      if (!pending) return;
      this.pending.delete(message.id);
      clearTimeout(pending.timer);
      if (message.error) pending.reject(new Error(message.error.message || "app-server request failed"));
      else pending.resolve(message.result);
    });

    await this.request("initialize", {
      clientInfo: { name: "maga-settings", title: SERVER_NAME, version: SERVER_VERSION },
    });
    this.process.stdin.write(`${JSON.stringify({ method: "initialized", params: {} })}\n`);
  }

  request(method, params = {}) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`${method} timed out`));
      }, this.timeoutMs);
      this.pending.set(id, { resolve, reject, timer });
      this.process.stdin.write(`${JSON.stringify({ method, id, params })}\n`);
    });
  }

  async close() {
    if (!this.process || this.process.exitCode !== null) return;
    this.process.stdin.end();
    await new Promise((resolve) => {
      const timer = setTimeout(() => {
        if (this.process.exitCode === null) this.process.kill();
        resolve();
      }, 500);
      this.process.once("exit", () => {
        clearTimeout(timer);
        resolve();
      });
    });
  }

  #fail(error) {
    for (const { reject, timer } of this.pending.values()) {
      clearTimeout(timer);
      reject(error);
    }
    this.pending.clear();
  }
}

async function listModels() {
  if (process.env.MAGA_MODEL_CATALOG_JSON) {
    const injected = JSON.parse(process.env.MAGA_MODEL_CATALOG_JSON);
    return Array.isArray(injected) ? injected : injected.data || [];
  }

  const client = new AppServerCatalogClient();
  try {
    await client.connect();
    const result = await client.request("model/list", { includeHidden: false, limit: 100 });
    return result.data || [];
  } finally {
    await client.close();
  }
}

async function snapshot() {
  let models = [];
  let catalogWarning = null;
  try {
    models = await listModels();
  } catch (error) {
    catalogWarning = error instanceof Error ? error.message : String(error);
  }
  return {
    ...computeSettingsSnapshot({ settings: loadComputeSettings(), models }),
    catalogWarning,
  };
}

function toolResult(structuredContent, text) {
  return {
    structuredContent,
    content: [{ type: "text", text }],
  };
}

async function handleToolCall(id, params) {
  const args = params?.arguments || {};
  if (params?.name === "show_maga_compute_settings") {
    sendResult(id, toolResult(
      await snapshot(),
      "MAGA responsibility recommendations are ready. Save the panel once before MAGA applies them to explicitly approved new tasks.",
    ));
    return;
  }

  if (params?.name === "save_maga_compute_profiles") {
    if (!args.profiles || typeof args.profiles !== "object" || Array.isArray(args.profiles)) {
      throw new Error("profiles must be an object keyed by MAGA responsibility");
    }
    if (typeof args.expectedRevision !== "string") {
      throw new Error("expectedRevision is required; reopen MAGA settings before saving");
    }
    saveComputeSettings(args.profiles, { expectedRevision: args.expectedRevision });
    sendResult(id, toolResult(
      await snapshot(),
      "Saved MAGA responsibility settings. Explicitly approved new tasks use them; running tasks keep their current model.",
    ));
    return;
  }

  if (params?.name === "resolve_maga_compute_profile") {
    if (typeof args.responsibility !== "string") {
      throw new Error("responsibility is required");
    }
    let models = [];
    try {
      models = await listModels();
    } catch {
      // Resolution intentionally falls back to the host default when discovery fails.
    }
    const resolved = resolveComputeProfile(args.responsibility, {
      settings: loadComputeSettings(),
      models,
      override: {
        ...(typeof args.model === "string" ? { model: args.model } : {}),
        ...(typeof args.effort === "string" ? { effort: args.effort } : {}),
      },
    });
    const fallback = resolved.fallback.length > 0
      ? ` Fallback: ${resolved.fallback.join(" ")}`
      : "";
    sendResult(id, toolResult(
      resolved,
      `Use ${resolved.actual.model || "the host default"}${resolved.actual.effort ? ` at ${resolved.actual.effort} reasoning` : ""} for ${resolved.label}.${fallback}`,
    ));
    return;
  }

  sendError(id, JsonRpcError.INVALID_PARAMS, `Unknown tool: ${params?.name || ""}`);
}

function tools() {
  return [
    {
      name: "show_maga_compute_settings",
      title: "Configure MAGA Responsibilities",
      description: "Open MAGA's settings panel for the model and reasoning depth used by each responsibility. Use when the user asks to configure MAGA's model choices or tune the AI work's reasoning quality, speed, or cost.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
      _meta: {
        ui: { resourceUri: TEMPLATE_URI },
        "openai/outputTemplate": TEMPLATE_URI,
        "openai/toolInvocation/invoking": "Opening MAGA settings…",
        "openai/toolInvocation/invoked": "MAGA settings ready.",
      },
    },
    {
      name: "save_maga_compute_profiles",
      title: "Save MAGA Responsibility Settings",
      description: "Persist explicit per-responsibility model and reasoning-depth choices for this Codex Home. Call only after the user uses the MAGA panel or explicitly asks to save. The first save must include all seven profiles; later saves may include only changed rows. Always pass the revision returned by show_maga_compute_settings.",
      inputSchema: {
        type: "object",
        properties: {
          expectedRevision: {
            type: "string",
            minLength: 1,
            description: "Revision returned by the settings panel. A stale revision is rejected instead of overwriting newer choices.",
          },
          profiles: {
            type: "object",
            description: "One or more MAGA responsibility profiles keyed by responsibility id. Omitted responsibilities keep their saved values.",
            minProperties: 1,
            propertyNames: {
              enum: ["project-lead", "research", "prototype", "delivery", "diagnosis", "review", "release"],
            },
            additionalProperties: {
              type: "object",
              properties: {
                model: { type: "string", minLength: 1, maxLength: 120 },
                effort: {
                  type: "string",
                  enum: ["none", "minimal", "low", "medium", "high", "xhigh", "max", "ultra"],
                },
              },
              required: ["model", "effort"],
              additionalProperties: false,
            },
          },
        },
        required: ["expectedRevision", "profiles"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
      _meta: {
        "openai/toolInvocation/invoking": "Saving MAGA settings…",
        "openai/toolInvocation/invoked": "MAGA settings saved.",
      },
    },
    {
      name: "resolve_maga_compute_profile",
      title: "Resolve MAGA Responsibility Profile",
      description: "Resolve one MAGA responsibility to the user's configured model and reasoning depth, comparing it with a reference catalog while leaving final validation to the new task's destination host. An explicit per-task model or effort supplied by the user overrides the saved choice. Project Lead and ticket orchestration should call this immediately before an explicitly approved responsibility task is created.",
      inputSchema: {
        type: "object",
        properties: {
          responsibility: {
            type: "string",
            enum: ["project-lead", "research", "prototype", "delivery", "diagnosis", "review", "release"],
          },
          model: {
            type: "string",
            minLength: 1,
            maxLength: 120,
            description: "Optional one-task override explicitly requested by the user.",
          },
          effort: {
            type: "string",
            enum: ["none", "minimal", "low", "medium", "high", "xhigh", "max", "ultra"],
            description: "Optional one-task reasoning override explicitly requested by the user.",
          },
        },
        required: ["responsibility"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    },
  ];
}

async function handleRequest(message) {
  const { id, method, params } = message;
  if (method === "initialize") {
    sendResult(id, {
      protocolVersion: params?.protocolVersion || "2025-11-25",
      capabilities: { tools: {}, resources: {} },
      serverInfo: { name: SERVER_NAME, version: SERVER_VERSION },
      instructions: "Use show_maga_compute_settings for the user-facing responsibility panel and resolve_maga_compute_profile immediately before MAGA creates a configured task.",
    });
    return;
  }
  if (method === "ping") {
    sendResult(id, {});
    return;
  }
  if (method === "tools/list") {
    sendResult(id, { tools: tools() });
    return;
  }
  if (method === "resources/list") {
    sendResult(id, {
      resources: [{ name: "MAGA responsibility settings", uri: TEMPLATE_URI, mimeType: "text/html;profile=mcp-app" }],
    });
    return;
  }
  if (method === "resources/read") {
    if (params?.uri !== TEMPLATE_URI) {
      sendError(id, JsonRpcError.INVALID_PARAMS, `Unknown resource: ${params?.uri || ""}`);
      return;
    }
    sendResult(id, {
      contents: [{
        uri: TEMPLATE_URI,
        mimeType: "text/html;profile=mcp-app",
        text: widgetHtml,
        _meta: { ui: { prefersBorder: true } },
      }],
    });
    return;
  }
  if (method === "tools/call") {
    try {
      await handleToolCall(id, params);
    } catch (error) {
      sendError(id, JsonRpcError.INVALID_PARAMS, error instanceof Error ? error.message : String(error));
    }
    return;
  }
  if (id !== undefined) sendError(id, JsonRpcError.METHOD_NOT_FOUND, `Method not found: ${method}`);
}

const lines = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });
lines.on("line", (line) => {
  if (!line.trim()) return;
  try {
    void handleRequest(JSON.parse(line));
  } catch (error) {
    sendError(null, JsonRpcError.INTERNAL_ERROR, error instanceof Error ? error.message : String(error));
  }
});
