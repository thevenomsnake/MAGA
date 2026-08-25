import { spawn } from "node:child_process";
import { EventEmitter, once } from "node:events";
import path from "node:path";
import readline from "node:readline";
import {
  loadComputeSettings,
  resolveComputeProfile,
} from "../plugins/maga/runtime/compute-profiles.mjs";
import { buildContextPacket } from "./context-packet.js";

const BRIDGE_VERSION = "0.16.0";
const NATIVE_SUBAGENT_MAX = 2;
const NATIVE_SUBAGENT_SOURCE_KINDS = [
  "subAgent",
  "subAgentReview",
  "subAgentCompact",
  "subAgentThreadSpawn",
  "subAgentOther",
];
const NATIVE_MULTI_AGENT_VERSIONS = new Set(["v1", "v2"]);

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isComputeSelectionError(error) {
  const message = error instanceof Error ? error.message : String(error);
  return /\b(model|reasoning|effort|thinking)\b/i.test(message)
    && /\b(invalid|unsupported|unavailable|unknown|not allowed|does not support|reject)/i.test(message);
}

const THREAD_GOAL_STATUSES = new Set([
  "active",
  "paused",
  "blocked",
  "budgetLimited",
  "usageLimited",
  "complete",
]);

function isUnsupportedGoalError(error) {
  const message = error instanceof Error ? error.message : String(error);
  return /method not found|unknown method|unsupported|experimentalApi|not available/i.test(message);
}

function isUnsupportedSubagentError(error) {
  const message = error instanceof Error ? error.message : String(error);
  return /experimentalApi|method not found|unknown method|unsupported native multi.?agent|does not expose the native multi.?agent|not available/i.test(message);
}

function threadModel(snapshot) {
  return snapshot?.model
    || snapshot?.thread?.model
    || snapshot?.thread?.settings?.model
    || null;
}

function validateSubagentLimit(maxAgents) {
  if (!Number.isInteger(maxAgents) || maxAgents < 1 || maxAgents > NATIVE_SUBAGENT_MAX) {
    throw new Error(`native subagent limit must be an integer from 1 to ${NATIVE_SUBAGENT_MAX}`);
  }
}

function readOnlyDelegationInstructions(maxAgents) {
  return `This is a bounded MAGA read-only delegation. Use native multi-agent tools only when they materially help, and use at most ${maxAgents} child agents. Inspect and reason only. Do not edit files, commit, create tasks or subagents, approve requests, publish, access accounts, or expand the approved question. Return a concise finding, uncertainty, or blocker to the parent.`;
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

function threadStatus(thread) {
  const status = thread?.status;
  if (typeof status === "string") return status.toLowerCase();
  return String(status?.type || status?.status || "").toLowerCase();
}

function statusRank(thread) {
  return {
    active: 5,
    running: 5,
    idle: 4,
    waiting: 3,
    notloaded: 2,
    completed: 1,
    failed: 0,
  }[threadStatus(thread)] ?? 2;
}

export function findCanonicalThread(threads, { cwd, title } = {}) {
  const resolvedCwd = cwd ? path.resolve(cwd) : null;
  const matches = (threads || []).filter((thread) => {
    if (thread?.name !== title) return false;
    if (!resolvedCwd || !thread?.cwd) return true;
    return path.resolve(thread.cwd) === resolvedCwd;
  });
  return [...matches].sort((left, right) => {
    const pinDelta = Number(Boolean(right.isPinned)) - Number(Boolean(left.isPinned));
    if (pinDelta !== 0) return pinDelta;
    const statusDelta = statusRank(right) - statusRank(left);
    if (statusDelta !== 0) return statusDelta;
    return Number(right.updatedAt || right.recencyAt || 0)
      - Number(left.updatedAt || left.recencyAt || 0);
  })[0] || null;
}

export class CodexTurnStillRunningError extends Error {
  constructor(threadId, turnId) {
    super(`Codex turn ${turnId} is still active after the local timeout`);
    this.name = "CodexTurnStillRunningError";
    this.threadId = threadId;
    this.turnId = turnId;
    this.remoteStatus = "active";
  }
}

export class CodexNativeSubagentUnsupportedError extends Error {
  constructor(reason) {
    super(reason);
    this.name = "CodexNativeSubagentUnsupportedError";
  }
}

export class CodexBridge {
  constructor({
    cwd,
    command = "codex",
    timeoutMs = 120_000,
    serverRequestHandler,
    experimentalApi = true,
  } = {}) {
    this.cwd = path.resolve(cwd || process.cwd());
    this.command = command;
    this.timeoutMs = timeoutMs;
    this.nextId = 0;
    this.pending = new Map();
    this.notifications = [];
    this.events = new EventEmitter();
    this.stderr = "";
    this.serverRequestHandler = serverRequestHandler;
    this.experimentalApi = experimentalApi;
    this.initializeResult = null;
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

      if (message.id !== undefined && message.method) {
        this.events.emit("server-request", message);
        const handler = this.serverRequestHandler;
        if (!handler) {
          this.respondError(message.id, -32000, "MAGA bridge cannot approve or answer this server request");
        } else {
          Promise.resolve(handler(message))
            .then((result) => this.respond(message.id, result))
            .catch((error) => this.respondError(
              message.id,
              -32000,
              error instanceof Error ? error.message : String(error),
            ));
        }
        return;
      }

      if (message.id !== undefined && !message.method) {
        const pending = this.pending.get(message.id);
        if (!pending) return;
        this.pending.delete(message.id);
        clearTimeout(pending.timer);
        if (message.error) {
          const error = new Error(message.error.message || JSON.stringify(message.error));
          error.code = message.error.code;
          pending.reject(error);
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

    const initializeParams = {
      clientInfo: {
        name: "maga",
        title: "MAGA",
        version: BRIDGE_VERSION,
      },
    };
    if (this.experimentalApi) initializeParams.capabilities = { experimentalApi: true };
    this.initializeResult = await this.request("initialize", initializeParams);
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

  respond(id, result) {
    this.process.stdin.write(`${JSON.stringify({ id, result })}\n`);
  }

  respondError(id, code, message) {
    this.process.stdin.write(`${JSON.stringify({ id, error: { code, message } })}\n`);
  }

  async requestWithRetry(method, params = {}, { attempts = 2, baseDelayMs = 50 } = {}) {
    for (let attempt = 0; attempt < attempts; attempt += 1) {
      try {
        return await this.request(method, params);
      } catch (error) {
        if (error?.code !== -32001 || attempt === attempts - 1) throw error;
        await delay(baseDelayMs * (2 ** attempt));
      }
    }
    throw new Error(`${method} failed without a response`);
  }

  async listThreads({
    cwd = this.cwd,
    title,
    archived = false,
    all = false,
    maxPages = 20,
    sourceKinds = ["appServer", "vscode", "cli"],
    parentThreadId,
  } = {}) {
    const threads = [];
    let cursor;
    for (let page = 0; page < (all ? maxPages : 1); page += 1) {
      const params = {
        // Desktop-hosted app-server processes can inherit the host's interactive source.
        sourceKinds,
        cwd: path.resolve(cwd),
        archived,
        searchTerm: title,
        limit: 50,
      };
      if (cursor) params.cursor = cursor;
      const result = await this.requestWithRetry("thread/list", params);
      const pageData = Array.isArray(result.data) ? result.data : result.data?.data || [];
      threads.push(...pageData.filter((thread) => !parentThreadId
        || thread.parentThreadId === parentThreadId));
      if (!all) break;
      const nextCursor = result.nextCursor || result.next_cursor || null;
      if (!nextCursor || nextCursor === cursor) break;
      cursor = nextCursor;
    }
    return threads;
  }

  async listModels({ includeHidden = false } = {}) {
    const result = await this.request("model/list", { includeHidden, limit: 100 });
    return result.data || [];
  }

  async listSubagentThreads(parentThreadId, { cwd = this.cwd, archived = false } = {}) {
    if (typeof parentThreadId !== "string" || !parentThreadId.trim()) {
      throw new Error("parent thread id must be non-empty");
    }
    const threads = await this.listThreads({
      cwd,
      archived,
      all: true,
      sourceKinds: NATIVE_SUBAGENT_SOURCE_KINDS,
    });
    const byParent = new Map();
    for (const thread of threads) {
      const parent = thread?.parentThreadId;
      if (!parent) continue;
      const children = byParent.get(parent) || [];
      children.push(thread);
      byParent.set(parent, children);
    }
    const descendants = [];
    const queue = [parentThreadId];
    const seen = new Set(queue);
    while (queue.length) {
      const parent = queue.shift();
      for (const child of byParent.get(parent) || []) {
        if (seen.has(child.id)) continue;
        seen.add(child.id);
        descendants.push(child);
        queue.push(child.id);
      }
    }
    return descendants;
  }

  async nativeSubagentCapabilities({ model, maxAgents = NATIVE_SUBAGENT_MAX } = {}) {
    validateSubagentLimit(maxAgents);
    if (!this.experimentalApi) {
      return {
        supported: false,
        experimentalApi: false,
        model: model || null,
        multiAgentVersion: null,
        maxAgents,
        fallback: "The Codex host was opened without experimental API capability; repository project memory remains authoritative.",
      };
    }

    let models;
    try {
      models = await this.listModels();
    } catch (error) {
      return {
        supported: false,
        experimentalApi: true,
        model: model || null,
        multiAgentVersion: null,
        maxAgents,
        fallback: `The Codex host could not expose its model catalog: ${error.message}`,
      };
    }
    const selected = (model && models.find((entry) => entry.id === model))
      || (!model && (models.find((entry) => entry.isDefault) || models[0]))
      || null;
    const selectedModel = model || selected?.id || null;
    const multiAgentVersion = selected?.multiAgentVersion || null;
    if (!selected || !NATIVE_MULTI_AGENT_VERSIONS.has(multiAgentVersion)) {
      return {
        supported: false,
        experimentalApi: true,
        model: selectedModel,
        multiAgentVersion,
        maxAgents,
        fallback: "The selected Codex model does not expose the native multi-agent runtime; use a named worker or repository project memory.",
      };
    }
    return {
      supported: true,
      experimentalApi: true,
      model: selectedModel,
      multiAgentVersion,
      maxAgents,
    };
  }

  async createThread({
    cwd = this.cwd,
    title,
    pinned = true,
    model,
    subagentLimit,
  } = {}) {
    if (subagentLimit !== undefined) validateSubagentLimit(subagentLimit);
    const params = {
      cwd: path.resolve(cwd),
      model,
    };
    if (subagentLimit !== undefined) {
      params.config = {
        features: { multi_agent: true },
        agents: {
          enabled: true,
          max_concurrent_threads_per_session: subagentLimit,
        },
      };
    }
    const result = await this.request("thread/start", params);
    const threadId = result.thread?.id;
    if (!threadId) throw new Error("thread/start returned no thread id");

    await this.request("thread/name/set", { threadId, name: title });
    if (pinned) await this.request("thread/metadata/update", { threadId, isPinned: true });
    return { ...result.thread, id: threadId, name: title, isPinned: pinned };
  }

  pinThread(threadId) {
    return this.request("thread/metadata/update", { threadId, isPinned: true });
  }

  resumeThread(threadId, options = {}) {
    return this.request("thread/resume", { threadId, ...options });
  }

  async unarchiveThread(threadId) {
    const result = await this.request("thread/unarchive", { threadId });
    return result.thread || result;
  }

  setThreadGoal(threadId, { objective, status, tokenBudget } = {}) {
    if (typeof objective !== "string" || !objective.trim()) {
      throw new Error("thread Goal objective must be non-empty");
    }
    if (objective.length > 4_000) {
      throw new Error("thread Goal objective must be 4000 characters or shorter");
    }
    if (status !== undefined && !THREAD_GOAL_STATUSES.has(status)) {
      throw new Error(`unsupported thread Goal status: ${status}`);
    }
    if (tokenBudget !== undefined && tokenBudget !== null
      && (!Number.isInteger(tokenBudget) || tokenBudget <= 0)) {
      throw new Error("thread Goal token budget must be a positive integer");
    }
    const params = { threadId, objective: objective.trim() };
    if (status !== undefined) params.status = status;
    if (tokenBudget !== undefined) params.tokenBudget = tokenBudget;
    return this.request("thread/goal/set", params);
  }

  getThreadGoal(threadId) {
    return this.request("thread/goal/get", { threadId });
  }

  clearThreadGoal(threadId) {
    return this.request("thread/goal/clear", { threadId });
  }

  async trySetThreadGoal(threadId, options = {}) {
    try {
      const result = await this.setThreadGoal(threadId, options);
      return { supported: true, ...result };
    } catch (error) {
      if (!isUnsupportedGoalError(error)) throw error;
      return {
        supported: false,
        fallback: "The Codex host does not support persisted thread Goals; repository project memory remains authoritative.",
      };
    }
  }

  async sendMessage(
    threadId,
    text,
    {
      model,
      effort,
      contextPacket,
      collaborationMode,
      sandboxPolicy,
      approvalPolicy,
      outputSchema,
    } = {},
  ) {
    const prompt = contextPacket ? `${contextPacket}\n\n${text}` : text;
    const params = {
      threadId,
      input: [{ type: "text", text: prompt }],
      model,
      effort,
    };
    if (collaborationMode !== undefined) params.collaborationMode = collaborationMode;
    if (sandboxPolicy !== undefined) params.sandboxPolicy = sandboxPolicy;
    if (approvalPolicy !== undefined) params.approvalPolicy = approvalPolicy;
    if (outputSchema !== undefined) params.outputSchema = outputSchema;
    const result = await this.request("turn/start", params);
    const turnId = result.turn?.id;
    if (!turnId) throw new Error("turn/start returned no turn id");

    const completed = await this.waitForTurn(threadId, turnId);
    if (completed.params.turn?.status !== "completed") {
      throw new Error(completed.params.turn?.error?.message || `Codex turn ${completed.params.turn?.status || "failed"}`);
    }
    return this.readThread(threadId);
  }

  async delegateReadOnly(
    threadId,
    question,
    {
      contextPacket,
      model,
      effort,
      maxAgents = NATIVE_SUBAGENT_MAX,
    } = {},
  ) {
    if (typeof question !== "string" || !question.trim()) {
      throw new Error("native subagent question must be non-empty");
    }
    if (question.length > 4_000) {
      throw new Error("native subagent question must be 4000 characters or shorter");
    }
    validateSubagentLimit(maxAgents);

    if (!this.experimentalApi) {
      throw new CodexNativeSubagentUnsupportedError(
        "The Codex host was opened without experimental API capability; repository project memory remains authoritative.",
      );
    }

    const existing = await this.listSubagentThreads(threadId);
    const active = existing.filter((thread) => ["active", "running", "inprogress", "waiting"]
      .includes(threadStatus(thread)));
    if (active.length >= maxAgents) {
      return {
        supported: true,
        admitted: false,
        maxAgents,
        activeSubagents: active,
        fallback: "The MAGA Delegate limit is currently full; continue the existing subagent or use project memory.",
      };
    }

    const capabilities = await this.nativeSubagentCapabilities({ model, maxAgents });
    if (!capabilities.supported) throw new CodexNativeSubagentUnsupportedError(capabilities.fallback);

    const snapshot = await this.readThread(threadId);
    const effectiveModel = model || threadModel(snapshot) || capabilities.model;
    if (!effectiveModel) {
      throw new CodexNativeSubagentUnsupportedError("The Codex host did not expose a model for the native collaboration turn.");
    }
    const prompt = [
      contextPacket,
      `Investigate this bounded question and return the result to the Project Lead: ${question.trim()}`,
    ].filter(Boolean).join("\n\n");
    const result = await this.sendMessage(threadId, prompt, {
      model: effectiveModel,
      effort,
      collaborationMode: {
        mode: "default",
        settings: {
          model: effectiveModel,
          reasoning_effort: effort || null,
          developer_instructions: readOnlyDelegationInstructions(maxAgents),
        },
      },
      sandboxPolicy: { type: "readOnly", networkAccess: false },
      approvalPolicy: "never",
    });
    return {
      supported: true,
      admitted: true,
      maxAgents,
      activeSubagents: [],
      capabilities,
      thread: result,
      subagents: await this.listSubagentThreads(threadId),
    };
  }

  async tryDelegateReadOnly(threadId, question, options = {}) {
    try {
      return await this.delegateReadOnly(threadId, question, options);
    } catch (error) {
      if (!(error instanceof CodexNativeSubagentUnsupportedError) && !isUnsupportedSubagentError(error)) {
        throw error;
      }
      return {
        supported: false,
        admitted: false,
        fallback: error instanceof Error ? error.message : String(error),
      };
    }
  }

  readThread(threadId) {
    return this.request("thread/read", { threadId, includeTurns: true });
  }

  buildContextPacket(options = {}) {
    return buildContextPacket(options);
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
      const timer = setTimeout(async () => {
        this.events.off("notification", onNotification);
        try {
          const snapshot = await this.readThread(threadId);
          const turns = snapshot?.thread?.turns || snapshot?.turns || [];
          const remoteTurn = turns.find((turn) => turn.id === turnId);
          const status = threadStatus(remoteTurn);
          if (status === "completed") {
            resolve({ params: { threadId, turn: remoteTurn } });
            return;
          }
          if (["active", "running", "inprogress", "started", "waiting"].includes(status)) {
            reject(new CodexTurnStillRunningError(threadId, turnId));
            return;
          }
        } catch {
          // Preserve the local timeout when the reconciliation read also fails.
        }
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
to recover the current product direction, accepted design shape, decisions, open
questions, active work, and evidence. Do not modify files, dispatch tasks, or perform external actions
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

async function applyLaunchGoal(bridge, threadId, goal, goalTokenBudget) {
  if (!goal || typeof bridge.trySetThreadGoal !== "function") return null;
  return bridge.trySetThreadGoal(threadId, {
    objective: goal,
    tokenBudget: goalTokenBudget,
  });
}

export async function launchProjectLead({
  targetDir,
  projectName,
  entryMode = "onboarding",
  timeoutMs,
  onReady,
  bridgeFactory,
  computeSettings,
  goal,
  goalTokenBudget,
  subagentLimit,
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
    const existing = findCanonicalThread(
      await bridge.listThreads({ cwd, title, all: true }),
      { cwd, title },
    );
    if (existing) {
      await bridge.pinThread(existing.id);
      const goalResult = await applyLaunchGoal(bridge, existing.id, goal, goalTokenBudget);
      await onReady?.({ title, reused: true });
      return { threadId: existing.id, title, reused: true, compute: null, goal: goalResult };
    }

    const archived = findCanonicalThread(
      await bridge.listThreads({ cwd, title, archived: true, all: true }),
      { cwd, title },
    );
    if (archived && bridge.unarchiveThread) {
      const restored = await bridge.unarchiveThread(archived.id);
      const restoredId = restored.id || archived.id;
      await bridge.pinThread(restoredId);
      const goalResult = await applyLaunchGoal(bridge, restoredId, goal, goalTokenBudget);
      await onReady?.({ title, reused: true });
      return { threadId: restoredId, title, reused: true, compute: null, goal: goalResult };
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
        subagentLimit,
      });
    } catch (error) {
      if (!compute.actual.model || !isComputeSelectionError(error)) throw error;
      compute = withHostComputeFallback(compute);
      usingHostDefaults = true;
      thread = await bridge.createThread({ cwd, title, pinned: true, subagentLimit });
    }

    let readyNotified = false;
    let goalResult = null;
    try {
      goalResult = await applyLaunchGoal(bridge, thread.id, goal, goalTokenBudget);
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
      if (error instanceof CodexTurnStillRunningError) throw error;
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
        goalResult = await applyLaunchGoal(bridge, thread.id, goal, goalTokenBudget);
        if (!readyNotified) await onReady?.({ title, reused: false });
        await bridge.sendMessage(thread.id, projectLeadPrompt(entryMode));
      } catch (retryError) {
        await bridge.archiveThread(thread.id).catch(() => {});
        throw retryError;
      }
    }
    return { threadId: thread.id, title, reused: false, compute, goal: goalResult };
  } finally {
    await bridge.close();
  }
}
