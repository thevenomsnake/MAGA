import { spawn } from "node:child_process";
import { EventEmitter, once } from "node:events";
import path from "node:path";
import readline from "node:readline";
import {
  loadComputeSettings,
  resolveComputeProfile,
} from "../plugins/maga/runtime/compute-profiles.mjs";

const BRIDGE_VERSION = "0.11.0";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isComputeSelectionError(error) {
  const message = error instanceof Error ? error.message : String(error);
  return /\b(model|reasoning|effort|thinking)\b/i.test(message)
    && /\b(invalid|unsupported|unavailable|unknown|not allowed|does not support|reject)/i.test(message);
}

function withHostComputeFallback(compute) {
  return {
    ...compute,
    actual: { model: null, effort: null },
    fallback: [
      ...(compute.fallback || []),
      "The destination host rejected the configured model or reasoning depth; using its defaults.",
    ],
  };
}

export class CodexBridge {
  constructor({ cwd, command = "codex", timeoutMs = 120_000 } = {}) {
    this.cwd = path.resolve(cwd || process.cwd());
    this.command = command;
    this.timeoutMs = timeoutMs;
    this.nextId = 0;
    this.pending = new Map();
    this.notifications = [];
    this.events = new EventEmitter();
    this.stderr = "";
  }

  async connect() {
    if (this.process) return;

    this.process = spawn(this.command, ["app-server"], {
      cwd: this.cwd,
      stdio: ["pipe", "pipe", "pipe"],
      windowsHide: true,
      shell: false,
    });

    this.process.on("error", (error) => this.#fail(error));
    this.process.on("exit", (code) => {
      this.exited = true;
      if (this.pending.size > 0) {
        this.#fail(new Error(`codex app-server exited with code ${code ?? "unknown"}${this.stderr ? `: ${this.stderr}` : ""}`));
      }
    });

    readline.createInterface({ input: this.process.stdout }).on("line", (line) => {
      let message;
      try {
        message = JSON.parse(line);
      } catch {
        return;
      }

      if (message.id !== undefined && !message.method) {
        const pending = this.pending.get(message.id);
        if (!pending) return;
        this.pending.delete(message.id);
        clearTimeout(pending.timer);
        if (message.error) {
          pending.reject(new Error(message.error.message || JSON.stringify(message.error)));
        } else {
          pending.resolve(message.result);
        }
        return;
      }

      if (message.method) {
        this.notifications.push(message);
        if (this.notifications.length > 100) this.notifications.shift();
        this.events.emit("notification", message);
      }
    });

    this.process.stderr.on("data", (chunk) => {
      this.stderr = `${this.stderr}${chunk}`.slice(-8_000).trim();
    });

    await this.request("initialize", {
      clientInfo: {
        name: "maga",
        title: "MAGA",
        version: BRIDGE_VERSION,
      },
    });
    this.notify("initialized", {});
  }

  request(method, params = {}) {
    if (!this.process || this.exited) throw new Error("codex app-server is not running");

    const id = this.nextId;
    this.nextId += 1;

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`${method} timed out`));
      }, this.timeoutMs);
      this.pending.set(id, { resolve, reject, timer });
      this.process.stdin.write(`${JSON.stringify({ method, id, params })}\n`);
    });
  }

  notify(method, params = {}) {
    this.process.stdin.write(`${JSON.stringify({ method, params })}\n`);
  }

  async listThreads({ cwd = this.cwd, title, archived = false } = {}) {
    const result = await this.request("thread/list", {
      // Desktop-hosted app-server processes can inherit the host's interactive source.
      sourceKinds: ["appServer", "vscode", "cli"],
      cwd: path.resolve(cwd),
      archived,
      searchTerm: title,
      limit: 50,
    });
    return result.data || [];
  }

  async listModels({ includeHidden = false } = {}) {
    const result = await this.request("model/list", { includeHidden, limit: 100 });
    return result.data || [];
  }

  async createThread({ cwd = this.cwd, title, pinned = true, model } = {}) {
    const result = await this.request("thread/start", {
      cwd: path.resolve(cwd),
      model,
    });
    const threadId = result.thread?.id;
    if (!threadId) throw new Error("thread/start returned no thread id");

    await this.request("thread/name/set", { threadId, name: title });
    if (pinned) await this.request("thread/metadata/update", { threadId, isPinned: true });
    return { ...result.thread, id: threadId, name: title, isPinned: pinned };
  }

  pinThread(threadId) {
    return this.request("thread/metadata/update", { threadId, isPinned: true });
  }

  async sendMessage(threadId, text, { model, effort } = {}) {
    const result = await this.request("turn/start", {
      threadId,
      input: [{ type: "text", text }],
      model,
      effort,
    });
    const turnId = result.turn?.id;
    if (!turnId) throw new Error("turn/start returned no turn id");

    const completed = await this.waitForTurn(threadId, turnId);
    if (completed.params.turn?.status !== "completed") {
      throw new Error(completed.params.turn?.error?.message || `Codex turn ${completed.params.turn?.status || "failed"}`);
    }
    return this.readThread(threadId);
  }

  readThread(threadId) {
    return this.request("thread/read", { threadId, includeTurns: true });
  }

  archiveThread(threadId) {
    return this.request("thread/archive", { threadId });
  }

  waitForTurn(threadId, turnId) {
    const matches = ({ method, params }) => method === "turn/completed"
      && (!params.threadId || params.threadId === threadId)
      && params.turn?.id === turnId;
    const existing = this.notifications.find(matches);
    if (existing) return Promise.resolve(existing);

    return new Promise((resolve, reject) => {
      const onNotification = (message) => {
        if (!matches(message)) return;
        clearTimeout(timer);
        this.events.off("notification", onNotification);
        resolve(message);
      };
      const timer = setTimeout(() => {
        this.events.off("notification", onNotification);
        reject(new Error("Codex turn timed out"));
      }, this.timeoutMs);
      this.events.on("notification", onNotification);
    });
  }

  async close() {
    if (!this.process || this.exited) return;
    this.process.stdin.end();
    await Promise.race([once(this.process, "exit"), delay(1_000)]);
    if (!this.exited) this.process.kill();
  }

  #fail(error) {
    for (const { reject, timer } of this.pending.values()) {
      clearTimeout(timer);
      reject(error);
    }
    this.pending.clear();
    this.events.emit("failure", error);
  }
}

function projectLeadPrompt(entryMode) {
  const locale = Intl.DateTimeFormat().resolvedOptions().locale;
  if (entryMode === "recovery") {
    return `This initialized MAGA project needs its single product-facing Project Lead restored.
Read .ai-workflow/PROJECT.md and only the repository-relative durable pointers needed
to recover the current product direction, accepted decisions, open questions, active
work, and evidence. Do not modify files, dispatch tasks, or perform external actions
in this first turn. In the Product Owner's system locale (${locale}), briefly summarize
the recovered product state and propose the next product-level decision or outcome. If
the durable state still says onboarding, say so and ask what they want to build and who
should use it. Do not mention Skills, commands, Git, testing, models, or internal
workflow unless one is itself an unresolved product risk.`;
  }
  return `This project has just been initialized with MAGA. Act as its single
product-facing Project Lead. The project is in onboarding state; do not inspect or
modify files and do not run tools in this first turn. In the Product Owner's system
locale (${locale}), briefly say they can describe a product idea, ask for external
research, request a small experience prototype, or continue an existing direction;
  MAGA will propose specifically named work tasks only when useful and open them only
  after the Product Owner approves. Then ask what they want
to build and who should use it. Do not mention Skills, commands, Git, testing, roles,
tickets, models, or internal workflow.`;
}

export async function launchProjectLead({
  targetDir,
  projectName,
  entryMode = "onboarding",
  timeoutMs,
  onReady,
  bridgeFactory,
  computeSettings,
} = {}) {
  if (!new Set(["onboarding", "recovery"]).has(entryMode)) {
    throw new Error(`unknown Project Lead entry mode: ${entryMode}`);
  }
  const cwd = path.resolve(targetDir || process.cwd());
  const title = `${projectName || path.basename(cwd)} · Project Lead`;
  const bridge = bridgeFactory
    ? bridgeFactory({ cwd, timeoutMs })
    : new CodexBridge({ cwd, timeoutMs });

  try {
    await bridge.connect();
    const existing = (await bridge.listThreads({ cwd, title }))
      .find((thread) => thread.name === title);
    if (existing) {
      await bridge.pinThread(existing.id);
      await onReady?.({ title, reused: true });
      return { threadId: existing.id, title, reused: true, compute: null };
    }

    let models = [];
    try {
      models = await bridge.listModels();
    } catch {
      // This bridge talks to the same app-server that will create the Project
      // Lead, so an unavailable catalog safely falls back to host defaults.
    }
    let compute = resolveComputeProfile("project-lead", {
      settings: computeSettings || loadComputeSettings(),
      models,
      catalogMode: "authoritative",
    });
    let usingHostDefaults = false;
    let thread;
    try {
      thread = await bridge.createThread({
        cwd,
        title,
        pinned: true,
        model: compute.actual.model || undefined,
      });
    } catch (error) {
      if (!compute.actual.model || !isComputeSelectionError(error)) throw error;
      compute = withHostComputeFallback(compute);
      usingHostDefaults = true;
      thread = await bridge.createThread({ cwd, title, pinned: true });
    }

    let readyNotified = false;
    try {
      await onReady?.({ title, reused: false });
      readyNotified = true;
      await bridge.sendMessage(thread.id, projectLeadPrompt(entryMode), {
        model: usingHostDefaults ? undefined : (compute.actual.model || undefined),
        effort: usingHostDefaults ? undefined : (compute.actual.effort || undefined),
      });
    } catch (error) {
      // A named, pinned task with no completed onboarding turn is not a valid
      // Project Lead. Remove it from active listings so a later start can retry.
      const canRetry = !usingHostDefaults
        && (compute.actual.model || compute.actual.effort)
        && isComputeSelectionError(error);
      if (!canRetry) {
        await bridge.archiveThread(thread.id).catch(() => {});
        throw error;
      }

      // Do not create a duplicate canonical title if the failed task could not
      // be retired. A retry is safe only after cleanup succeeds.
      await bridge.archiveThread(thread.id);
      compute = withHostComputeFallback(compute);
      usingHostDefaults = true;
      thread = await bridge.createThread({ cwd, title, pinned: true });
      try {
        if (!readyNotified) await onReady?.({ title, reused: false });
        await bridge.sendMessage(thread.id, projectLeadPrompt(entryMode));
      } catch (retryError) {
        await bridge.archiveThread(thread.id).catch(() => {});
        throw retryError;
      }
    }
    return { threadId: thread.id, title, reused: false, compute };
  } finally {
    await bridge.close();
  }
}
