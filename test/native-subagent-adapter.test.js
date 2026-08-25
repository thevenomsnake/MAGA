import assert from "node:assert/strict";
import test from "node:test";
import {
  CodexBridge,
  CodexNativeSubagentUnsupportedError,
} from "../src/codex-bridge.js";

test("detects the model's native multi-agent runtime", async () => {
  const bridge = new CodexBridge({ cwd: process.cwd() });
  bridge.listModels = async () => [
    { id: "gpt-5.6-sol", isDefault: true, multiAgentVersion: "v2" },
  ];

  const capabilities = await bridge.nativeSubagentCapabilities({ maxAgents: 2 });
  assert.deepEqual(capabilities, {
    supported: true,
    experimentalApi: true,
    model: "gpt-5.6-sol",
    multiAgentVersion: "v2",
    maxAgents: 2,
  });
});

test("falls back for a model without native multi-agent support", async () => {
  const bridge = new CodexBridge({ cwd: process.cwd() });
  bridge.listModels = async () => [
    { id: "legacy", isDefault: true, multiAgentVersion: "disabled" },
  ];

  const capabilities = await bridge.nativeSubagentCapabilities();
  assert.equal(capabilities.supported, false);
  assert.match(capabilities.fallback, /does not expose the native multi-agent runtime/);
});

test("reconciles direct and nested native child threads by lineage", async () => {
  const bridge = new CodexBridge({ cwd: process.cwd() });
  bridge.listThreads = async (options) => {
    assert.deepEqual(options.sourceKinds, [
      "subAgent",
      "subAgentReview",
      "subAgentCompact",
      "subAgentThreadSpawn",
      "subAgentOther",
    ]);
    return [
      { id: "child", parentThreadId: "parent" },
      { id: "grandchild", parentThreadId: "child" },
      { id: "unrelated", parentThreadId: "other" },
    ];
  };

  const result = await bridge.listSubagentThreads("parent");
  assert.deepEqual(result.map(({ id }) => id), ["child", "grandchild"]);
});

test("passes a bounded native config when creating a new thread", async () => {
  const calls = [];
  const bridge = new CodexBridge({ cwd: process.cwd() });
  bridge.request = async (method, params) => {
    calls.push({ method, params });
    if (method === "thread/start") return { thread: { id: "thread-1" } };
    return {};
  };

  await bridge.createThread({
    title: "Product · Lead",
    pinned: false,
    subagentLimit: 2,
  });

  assert.deepEqual(calls[0], {
    method: "thread/start",
    params: {
      cwd: process.cwd(),
      model: undefined,
      config: {
        features: { multi_agent: true },
        agents: {
          enabled: true,
          max_concurrent_threads_per_session: 2,
        },
      },
    },
  });
});

test("starts a read-only collaboration turn and returns child lineage", async () => {
  const calls = [];
  let listCount = 0;
  const bridge = new CodexBridge({ cwd: process.cwd() });
  bridge.listSubagentThreads = async () => {
    listCount += 1;
    return listCount === 1 ? [] : [{ id: "child", parentThreadId: "parent", status: "completed" }];
  };
  bridge.nativeSubagentCapabilities = async () => ({
    supported: true,
    experimentalApi: true,
    model: "gpt-5.6-sol",
    multiAgentVersion: "v2",
    maxAgents: 2,
  });
  bridge.readThread = async () => ({ model: "gpt-5.6-sol" });
  bridge.sendMessage = async (threadId, prompt, options) => {
    calls.push({ threadId, prompt, options });
    return { thread: { id: threadId } };
  };

  const result = await bridge.delegateReadOnly(
    "parent",
    "Compare the accepted design record with the current routing contract.",
    { contextPacket: "Read .ai-workflow/design/INDEX.md only.", effort: "low" },
  );

  assert.equal(result.admitted, true);
  assert.deepEqual(result.subagents.map(({ id }) => id), ["child"]);
  assert.equal(calls.length, 1);
  assert.match(calls[0].prompt, /Compare the accepted design record/);
  assert.deepEqual(calls[0].options.collaborationMode, {
    mode: "default",
    settings: {
      model: "gpt-5.6-sol",
      reasoning_effort: "low",
      developer_instructions: "This is a bounded MAGA read-only delegation. Use native multi-agent tools only when they materially help, and use at most 2 child agents. Inspect and reason only. Do not edit files, commit, create tasks or subagents, approve requests, publish, access accounts, or expand the approved question. Return a concise finding, uncertainty, or blocker to the parent.",
    },
  });
  assert.deepEqual(calls[0].options.sandboxPolicy, { type: "readOnly", networkAccess: false });
  assert.equal(calls[0].options.approvalPolicy, "never");
});

test("does not start a turn when the Delegate capacity is full", async () => {
  const bridge = new CodexBridge({ cwd: process.cwd() });
  bridge.listSubagentThreads = async () => [
    { id: "child-1", status: "active" },
    { id: "child-2", status: { type: "active" } },
  ];
  bridge.nativeSubagentCapabilities = async () => {
    throw new Error("capability probe should not run at capacity");
  };

  const result = await bridge.delegateReadOnly("parent", "Inspect the current state.");
  assert.equal(result.admitted, false);
  assert.equal(result.activeSubagents.length, 2);
  assert.match(result.fallback, /Delegate limit/);
});

test("returns a safe fallback when experimental API is disabled", async () => {
  const bridge = new CodexBridge({ cwd: process.cwd(), experimentalApi: false });
  const result = await bridge.tryDelegateReadOnly("parent", "Inspect the current state.");
  assert.equal(result.supported, false);
  assert.match(result.fallback, /experimental API capability/);
});

test("keeps unsupported delegation errors typed for direct callers", async () => {
  const bridge = new CodexBridge({ cwd: process.cwd() });
  bridge.listSubagentThreads = async () => [];
  bridge.nativeSubagentCapabilities = async () => ({
    supported: false,
    fallback: "unsupported native multi-agent runtime",
  });

  await assert.rejects(
    bridge.delegateReadOnly("parent", "Inspect the current state."),
    (error) => error instanceof CodexNativeSubagentUnsupportedError,
  );
});
