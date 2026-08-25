# Native Subagent Runtime Adapter

## Problem And Intended User

MAGA now knows when a short investigation should use a native subagent, but its
app-server bridge has no small runtime interface for starting that bounded
collaboration turn or recovering the child threads it creates. Without that
interface, the routing contract remains guidance rather than usable behavior.

## Observable Result

For an approved read-only investigation, the Project Lead can ask the bridge to
run one bounded collaboration turn. The bridge negotiates the native
experimental capability, sends a read-only sandbox and bounded instructions,
waits for the parent turn, and returns the parent result plus any child threads
whose native lineage points to it. Hosts or models without the capability return
a safe fallback instead of creating a generic worker or changing project state.

## Behavior Examples

- Given a connected bridge, an existing thread, a supported model, and a short
  question, `delegateReadOnly` starts a collaboration turn with
  `collaborationMode`, `approvalPolicy: never`, and a read-only sandbox.
- Given a parent thread with two active native children, another delegation is
  rejected at the MAGA admission seam before a new turn starts.
- Given a host initialized without the experimental capability, delegation returns
  `supported: false` and a repository-memory fallback.
- Given a model whose `multiAgentVersion` is `disabled` or absent, delegation
  returns `supported: false` without sending a turn.
- Given a completed parent turn, `listSubagentThreads` returns only native
  subagent sources linked to that parent and keeps runtime identifiers in the
  returned process value rather than durable project files.

## Product Boundaries

- In scope: the bridge adapter, capability detection, bounded read-only turn
  parameters, child-lineage reconciliation, focused bridge tests, and durable
  spec/design/Ticket evidence.
- Out of scope: a scheduler, telemetry pipeline, dashboard, daemon, direct
  `agent/start` RPC, arbitrary subagent writes, external actions, or host-memory
  synchronization.

## Decisions And Constraints

- The native seam is `turn/start.collaborationMode`; Codex app-server does not
  expose a public `agent/start` client method for this flow.
- The bridge opts into `experimentalApi` during `initialize` so the native
  collaboration field is legal. This opt-in does not authorize filesystem,
  network, account, release, or external actions.
- The adapter sends `sandboxPolicy.type = readOnly`, disables approval escalation
  with `approvalPolicy = never`, and gives the model positive instructions to
  inspect only, return a finding, and avoid writes, commits, task creation, or
  external actions.
- `maxAgents` is an admission limit owned by MAGA and capped at two. Existing
  child lineage is reconciled before a new delegation. New Project Lead threads
  may also pass the same limit to native `agents.max_concurrent_threads_per_session`
  through the app-server thread config.
- Model capability comes from `model/list.multiAgentVersion`; only `v1` and `v2`
  are eligible. Unknown host/model state falls back safely.
- Child discovery uses stable `thread/list` source kinds and local `parentThreadId`
  filtering. The adapter does not require experimental parent-filter fields.
- Runtime thread IDs, child IDs, host IDs, cursors, and transcripts never enter
  `.ai-workflow`.
- Protocol reference: [OpenAI Codex App Server](https://learn.chatgpt.com/docs/app-server).

## Verification Boundary

Run the focused bridge adapter smoke and the existing bridge smoke once. The
checks must cover handshake capability opt-in, exact collaboration parameters,
read-only admission, model capability fallback, and parent-lineage filtering.

## Open Product Questions

None. The Product Owner authorized the smallest runtime adapter; telemetry and a
long-running service remain separate future decisions.
