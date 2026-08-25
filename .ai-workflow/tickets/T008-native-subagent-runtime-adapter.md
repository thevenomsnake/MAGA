---
key: T008
status: integrated
authorization: approved
role: project-lead
workspace: delivery
---

# Make bounded native subagent delegation executable

## Outcome

MAGA's Codex bridge can run an approved short read-only collaboration turn and
recover its native child threads without introducing a second agent runtime.

## Acceptance

- The bridge opts into the required native capability and passes the exact
  read-only collaboration parameters.
- The bridge detects model support, caps admission at two, and refuses a new
  delegation when active child capacity is exhausted.
- The bridge returns a safe unsupported result for hosts or models without native
  multi-agent support.
- Child threads are recovered by native source and parent lineage, with runtime
  identifiers kept out of durable project memory.
- Existing Project Lead initialization, Goals, named-worker dispatch, and release
  boundaries remain compatible.

## Boundaries

- No telemetry, dashboard, daemon, scheduler, direct `agent/start` RPC, or external
  service.
- No subagent writes, commits, task creation, approval, publication, or scope
  expansion.
- No package version bump or release publication in this Ticket.

## Blocked By

- T007 (integrated): native subagent policy and execution-shape contract.

## Reads First

- `.ai-workflow/specs/native-subagent-runtime-adapter.md`
- `.ai-workflow/design/records/D002-native-subagent-delegation.md`
- `.ai-workflow/design/records/D003-native-subagent-runtime-adapter.md`
- `src/codex-bridge.js`
- `test/codex-bridge.test.js`

## Proof

- Break to catch: a bridge turn omits the experimental handshake or read-only
  sandbox, delegates to an unsupported model, exceeds the two-agent limit, or
  selects an unrelated thread as a child.
- Evidence: `node --test test/native-subagent-adapter.test.js test/codex-bridge.test.js`.
- Persistent regression: yes - app-server protocol fields and host capabilities
  can drift.
- Risk delta: concurrency and permissions -> capability fallback, read-only
  sandbox, admission check, and lineage filtering.
- Stop when: the focused bridge smoke passes and all acceptance boundaries are
  represented in the adapter and durable records.

## Execution

- Task opening: not-needed
- Task title: not-needed
- Attempt: 1
- Git branch: codex/native-subagent-runtime
- Start commit: b42d82b
- Starting dirty files: none

## Completion

- Behavior: CodexBridge now negotiates native multi-agent capability, starts bounded read-only collaboration turns, enforces a two-agent admission limit, and reconciles child thread lineage with safe fallbacks.
- Validation: `node --test test/native-subagent-adapter.test.js test/codex-bridge.test.js test/native-subagent-routing.test.js test/init-project.test.js test/bundled-skills.test.js` passed 48/48; live 0.148.0 protocol smoke accepted the experimental collaboration turn and interrupted it without persistent side effects.
- Evidence: `.ai-workflow/specs/native-subagent-runtime-adapter.md`, D003, `src/codex-bridge.js`, and `test/native-subagent-adapter.test.js`.
- Commit or artifact: 044a287a7d5425b55b4e60e6b3b28d379359ce84
- Blocker: none
