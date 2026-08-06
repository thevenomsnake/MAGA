import assert from "node:assert/strict";
import test from "node:test";
import { CodexBridge, launchProjectLead } from "../src/codex-bridge.js";

test("passes a responsibility model into thread creation", async () => {
  const calls = [];
  const bridge = new CodexBridge({ cwd: process.cwd() });
  bridge.request = async (method, params) => {
    calls.push({ method, params });
    if (method === "thread/start") return { thread: { id: "thread-1" } };
    return {};
  };

  await bridge.createThread({
    title: "Product · Project Lead",
    pinned: true,
    model: "gpt-5.6-sol",
  });

  assert.equal(calls[0].method, "thread/start");
  assert.equal(calls[0].params.model, "gpt-5.6-sol");
});

test("passes model and reasoning depth into the first turn", async () => {
  const calls = [];
  const bridge = new CodexBridge({ cwd: process.cwd() });
  bridge.request = async (method, params) => {
    calls.push({ method, params });
    return { turn: { id: "turn-1" } };
  };
  bridge.waitForTurn = async () => ({ params: { turn: { status: "completed" } } });
  bridge.readThread = async () => ({ thread: { id: "thread-1" } });

  await bridge.sendMessage("thread-1", "Start", {
    model: "gpt-5.6-sol",
    effort: "medium",
  });

  assert.deepEqual(calls[0], {
    method: "turn/start",
    params: {
      threadId: "thread-1",
      input: [{ type: "text", text: "Start" }],
      model: "gpt-5.6-sol",
      effort: "medium",
    },
  });
});

test("keeps an existing Project Lead compute unchanged and restores its pin", async () => {
  const calls = [];
  const bridge = {
    connect: async () => {},
    close: async () => {},
    listModels: async () => calls.push("list-models"),
    listThreads: async () => [{ id: "lead-1", name: "Product · Project Lead" }],
    pinThread: async (threadId) => calls.push({ pin: threadId }),
  };

  const result = await launchProjectLead({
    targetDir: process.cwd(),
    projectName: "Product",
    bridgeFactory: () => bridge,
    computeSettings: {
      source: "saved",
      profiles: {
        "project-lead": { model: "gpt-5.6-luna", effort: "low" },
      },
    },
  });

  assert.equal(result.reused, true);
  assert.equal(result.compute, null);
  assert.deepEqual(calls, [{ pin: "lead-1" }]);
});

test("starts a missing Project Lead from durable recovery context", async () => {
  const sent = [];
  const bridge = {
    connect: async () => {},
    close: async () => {},
    listThreads: async () => [],
    listModels: async () => [],
    createThread: async () => ({ id: "lead-recovered" }),
    sendMessage: async (_threadId, prompt) => sent.push(prompt),
    archiveThread: async () => {},
  };

  await launchProjectLead({
    targetDir: process.cwd(),
    projectName: "Product",
    entryMode: "recovery",
    bridgeFactory: () => bridge,
  });

  assert.equal(sent.length, 1);
  assert.match(sent[0], /\.ai-workflow\/PROJECT\.md/);
  assert.match(sent[0], /recover the current product direction/);
  assert.match(sent[0], /Do not modify files, dispatch tasks, or perform external actions/);
  assert.doesNotMatch(sent[0], /just been initialized/);
});

test("archives an empty Project Lead when its onboarding turn fails", async () => {
  const calls = [];
  const bridge = {
    connect: async () => {},
    close: async () => {},
    listThreads: async () => [],
    listModels: async () => [],
    createThread: async () => ({ id: "lead-empty" }),
    sendMessage: async () => { throw new Error("onboarding failed"); },
    archiveThread: async (threadId) => calls.push(threadId),
  };

  await assert.rejects(
    launchProjectLead({
      targetDir: process.cwd(),
      projectName: "Product",
      bridgeFactory: () => bridge,
    }),
    /onboarding failed/,
  );
  assert.deepEqual(calls, ["lead-empty"]);
});

test("retries Project Lead creation once with host defaults after model rejection", async () => {
  const models = [];
  let attempts = 0;
  const bridge = {
    connect: async () => {},
    close: async () => {},
    listThreads: async () => [],
    listModels: async () => [{
      id: "gpt-future",
      supportedReasoningEfforts: ["high"],
      defaultReasoningEffort: "high",
    }],
    createThread: async ({ model }) => {
      models.push(model);
      attempts += 1;
      if (attempts === 1) throw new Error("unsupported model");
      return { id: "lead-host" };
    },
    sendMessage: async () => {},
    archiveThread: async () => {},
  };

  const result = await launchProjectLead({
    targetDir: process.cwd(),
    projectName: "Product",
    bridgeFactory: () => bridge,
    computeSettings: {
      source: "saved",
      profiles: { "project-lead": { model: "gpt-future", effort: "high" } },
    },
  });

  assert.deepEqual(models, ["gpt-future", undefined]);
  assert.deepEqual(result.compute.actual, { model: null, effort: null });
  assert.match(result.compute.fallback.at(-1), /destination host rejected/);
});

test("cleans up and retries onboarding once after reasoning rejection", async () => {
  const sent = [];
  const archived = [];
  let created = 0;
  const bridge = {
    connect: async () => {},
    close: async () => {},
    listThreads: async () => [],
    listModels: async () => [{
      id: "gpt-5.6-sol",
      supportedReasoningEfforts: ["medium"],
      defaultReasoningEffort: "medium",
    }],
    createThread: async () => ({ id: `lead-${++created}` }),
    sendMessage: async (threadId, _prompt, profile = {}) => {
      sent.push({ threadId, profile });
      if (sent.length === 1) throw new Error("reasoning effort unsupported");
    },
    archiveThread: async (threadId) => archived.push(threadId),
  };

  const result = await launchProjectLead({
    targetDir: process.cwd(),
    projectName: "Product",
    bridgeFactory: () => bridge,
    computeSettings: {
      source: "saved",
      profiles: { "project-lead": { model: "gpt-5.6-sol", effort: "medium" } },
    },
  });

  assert.deepEqual(archived, ["lead-1"]);
  assert.deepEqual(sent[0].profile, { model: "gpt-5.6-sol", effort: "medium" });
  assert.deepEqual(sent[1].profile, {});
  assert.deepEqual(result.compute.actual, { model: null, effort: null });
});
