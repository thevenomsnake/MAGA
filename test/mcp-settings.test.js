import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import test from "node:test";
import { fileURLToPath } from "node:url";

const REPOSITORY_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TEST_ROOT = path.join(REPOSITORY_ROOT, "tmp", "tests");
const SERVER = path.join(REPOSITORY_ROOT, "plugins", "maga", "mcp", "server.mjs");
const MODELS = [
  {
    id: "gpt-5.6-sol",
    displayName: "GPT-5.6-Sol",
    supportedReasoningEfforts: ["low", "medium", "high"],
    defaultReasoningEffort: "medium",
  },
  {
    id: "gpt-5.6-terra",
    displayName: "GPT-5.6-Terra",
    isDefault: true,
    supportedReasoningEfforts: ["low", "medium", "high"],
    defaultReasoningEffort: "medium",
  },
  {
    id: "gpt-5.6-luna",
    displayName: "GPT-5.6-Luna",
    supportedReasoningEfforts: ["low", "medium"],
    defaultReasoningEffort: "low",
  },
];

function startServer(t) {
  fs.mkdirSync(TEST_ROOT, { recursive: true });
  const codexHome = fs.mkdtempSync(path.join(TEST_ROOT, "mcp-settings-"));
  const child = spawn(process.execPath, [SERVER], {
    cwd: REPOSITORY_ROOT,
    stdio: ["pipe", "pipe", "pipe"],
    windowsHide: true,
    env: {
      ...process.env,
      CODEX_HOME: codexHome,
      MAGA_MODEL_CATALOG_JSON: JSON.stringify(MODELS),
    },
  });
  const pending = new Map();
  let nextId = 1;
  let stderr = "";
  child.stderr.on("data", (chunk) => { stderr += chunk; });
  readline.createInterface({ input: child.stdout, crlfDelay: Infinity }).on("line", (line) => {
    const message = JSON.parse(line);
    const request = pending.get(message.id);
    if (!request) return;
    pending.delete(message.id);
    if (message.error) request.reject(new Error(message.error.message));
    else request.resolve(message.result);
  });

  function request(method, params = {}) {
    const id = nextId++;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        pending.delete(id);
        reject(new Error(`${method} timed out${stderr ? `: ${stderr}` : ""}`));
      }, 5_000);
      pending.set(id, {
        resolve: (value) => { clearTimeout(timer); resolve(value); },
        reject: (error) => { clearTimeout(timer); reject(error); },
      });
      child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", id, method, params })}\n`);
    });
  }

  t.after(async () => {
    child.stdin.end();
    if (child.exitCode === null) {
      await new Promise((resolve) => {
        const timer = setTimeout(() => { child.kill(); resolve(); }, 1_000);
        child.once("exit", () => { clearTimeout(timer); resolve(); });
      });
    }
    fs.rmSync(codexHome, { recursive: true, force: true });
  });
  return { codexHome, request };
}

test("MCP app renders, saves, and resolves responsibility settings", async (t) => {
  const server = startServer(t);
  await server.request("initialize", {
    protocolVersion: "2025-11-25",
    clientInfo: { name: "test", version: "1" },
  });

  const listed = await server.request("tools/list");
  assert.deepEqual(
    listed.tools.map(({ name }) => name),
    ["show_maga_compute_settings", "save_maga_compute_profiles", "resolve_maga_compute_profile"],
  );
  const resource = await server.request("resources/read", {
    uri: "ui://maga/compute-settings-v1.html",
  });
  assert.match(resource.contents[0].mimeType, /mcp-app/);
  assert.match(resource.contents[0].text, /Responsibility settings/);

  const shown = await server.request("tools/call", { name: "show_maga_compute_settings", arguments: {} });
  assert.equal(shown.structuredContent.responsibilities.length, 7);
  assert.equal(shown.structuredContent.source, "balanced-defaults");
  assert.deepEqual(shown.structuredContent.responsibilities[0].actual, {
    model: null,
    effort: null,
  });
  const profiles = Object.fromEntries(shown.structuredContent.responsibilities.map((role) => [
    role.key,
    role.preferred,
  ]));
  profiles.research = { model: "gpt-5.6-luna", effort: "low" };

  const saved = await server.request("tools/call", {
    name: "save_maga_compute_profiles",
    arguments: { expectedRevision: shown.structuredContent.revision, profiles },
  });
  const savedResearch = saved.structuredContent.responsibilities.find(({ key }) => key === "research");
  assert.equal(savedResearch.preferred.model, "gpt-5.6-luna");
  assert.deepEqual(savedResearch.actual, { model: "gpt-5.6-luna", effort: "low" });
  assert.equal(fs.existsSync(path.join(server.codexHome, "maga", "compute-profiles.json")), true);

  await assert.rejects(
    server.request("tools/call", {
      name: "save_maga_compute_profiles",
      arguments: {
        expectedRevision: shown.structuredContent.revision,
        profiles: { review: { model: "gpt-5.6-terra", effort: "medium" } },
      },
    }),
    /changed in another panel/,
  );

  const partial = await server.request("tools/call", {
    name: "save_maga_compute_profiles",
    arguments: {
      expectedRevision: saved.structuredContent.revision,
      profiles: { review: { model: "gpt-5.6-terra", effort: "medium" } },
    },
  });
  const partialResearch = partial.structuredContent.responsibilities
    .find(({ key }) => key === "research");
  assert.equal(partialResearch.preferred.model, "gpt-5.6-luna");

  const resolved = await server.request("tools/call", {
    name: "resolve_maga_compute_profile",
    arguments: { responsibility: "research" },
  });
  assert.deepEqual(resolved.structuredContent.actual, {
    model: "gpt-5.6-luna",
    effort: "low",
  });
});
