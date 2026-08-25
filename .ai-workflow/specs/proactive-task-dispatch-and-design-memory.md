# MAGA 主动任务协调与项目设计记忆

## Problem Statement

Product Owner 现在可以通过 Project Lead 获得研究、原型、诊断和交付结果，
但跨 Codex task 的切换仍然依赖逐次确认和人工搬运上下文。Project Lead 能创建
初始 task，Ticket worker 也能按明确标题启动，但它还不能在一个已批准的 Ticket
范围内可靠地判断何时应该新建 task、恢复已有 task、传递最小上下文并收口结果。

项目 memory 目前能保存方向、角色、Ticket、decision 和 release evidence，
但没有专门记录产品形状如何演进的 design record。产品设计、状态流转和 prototype
结论容易重新进入聊天，而不是成为新 Project Lead 可以读取的持久事实。

目标不是让 MAGA 获得无限后台权限，而是减少 Product Owner 搬运上下文的工作，
同时让每次自动动作都有明确的范围、证据和停止条件。

## Solution

增加一个 bounded Coordinator 能力，作为 Project Lead 在安全 phase boundary
上的内部行为：

1. 读取项目 memory 和当前 Ticket，判断继续当前 task 还是需要新的 attention workspace。
2. 在 standing authorization 允许且 Ticket 已批准时，创建具名 Codex worker，传递
   repository-relative context packet，并等待其结果。
3. 在创建、等待、timeout、断线、完成和 archive 前后重新 reconcile host task 状态，
   防止重复创建或错误重试。
4. 把 design decision 保存为 repository-local design record，并让 Project Lead 从
   `PROJECT.md` 的小索引恢复它。
5. 对同一 thread 的长任务可选使用 Codex Goal；Goal 只负责 thread continuation，
   Product memory 仍然是仓库内真源。

## User Stories

1. As a Product Owner, I want MAGA to decide whether work stays in the current Project Lead or needs a separate task, so that I do not have to manage attention-workspace mechanics.
2. As a Product Owner, I want to approve a bounded project policy for automatic task dispatch, so that repeated same-scope approvals are not required while material authority remains mine.
3. As a Product Owner, I want every automatically created task to have a meaningful title and visible product outcome, so that I can understand it from the Codex task list.
4. As a Product Owner, I want a new task to receive the current Ticket, role, design pointers, acceptance boundary, and validation proof, so that I do not need to repeat the project context.
5. As a Project Lead, I want to resume an existing matching task after reconnecting, so that a delayed response does not create a duplicate worker.
6. As a Project Lead, I want to detect duplicate titles, archived tasks, paginated results, and stale attempts, so that task identity is not inferred from the first matching title.
7. As a Worker, I want to stop and return `needs-decision` when the approved boundary is insufficient, so that I do not invent product scope or permissions.
8. As a Project Lead, I want a completed worker's behavior, validation, commit or artifact, and blocker state recorded before archiving it, so that the task transcript is not the only evidence.
9. As a Product Owner, I want accepted product and system design decisions to survive a new Project Lead task, so that design discussions do not have to be replayed.
10. As a Product Owner, I want a design record to show whether it is draft, accepted, superseded, or rejected and where its evidence came from, so that provisional ideas are not treated as settled requirements.
11. As a Product Owner, I want external writes, accounts, costs, releases, migrations, destructive actions, and sensitive-data use to remain explicit gates, so that greater initiative does not silently expand authority.
12. As a maintainer, I want runtime thread IDs, host IDs, cursors, machine paths, and transcripts to stay out of tracked project memory, so that the repository remains portable and privacy-safe.

## Implementation Decisions

### Coordinator module

Create a deep coordination module with a small interface for:

- reconciling project-scoped tasks and returning canonical, recoverable, duplicate, and stale candidates;
- building a context packet from durable pointers;
- dispatching one approved Ticket under a bounded policy;
- resuming, waiting, integrating, and archiving a worker;
- reporting `completed`, `needs-decision`, `failed`, or `blocked` without guessing.

The module uses the Codex App Server adapter for runtime operations. The adapter must
support cursor pagination, resume/unarchive, status/read reconciliation, bounded retry
with backoff, and server-initiated approval/request handling. A local promise timeout is
not evidence that the remote turn failed.

### Task identity and lifecycle

The deterministic title remains a human-facing lookup aid, not a unique database key.
Candidate selection must combine project/cwd, task source, title, pin state, runtime
status, Ticket key, and attempt. Runtime IDs remain in the coordinator process only.

Default task creation starts a fresh task with the repository as its source. A history
fork is reserved for an explicit request to preserve the parent transcript. Shared
checkout writers remain serialized because project files must stay under the repository
root; an external worktree is not an implicit default.

### Bounded autonomy policy

The project policy has three independent capabilities:

- `continue`: continue the current Ticket or Goal in the current task;
- `dispatch`: create a named worker only for an already approved Ticket;
- `release`: summarize and propose release work, but never perform a release without its gate.

The default policy is conservative until the Product Owner confirms it. A proposed
starting limit is at most two active workers, no automatic creation of new Tickets, and
no automatic approval of server requests. A policy approval applies only to the named
project, the current repository scope, and the stated Ticket boundary.

### Context packet

The packet is a short, generated pointer set, not a copied transcript. It names the
current project index, role contract, selected Ticket, linked design records, acceptance
criteria, completion proof, and any required handoff. The worker reads those sources from
the repository and receives only the execution rules needed for its role.

When context must cross a harness or repository, use a repository-relative handoff record.
Do not persist a host thread ID, turn ID, cursor, absolute path, or model setting in the
packet.

### Design persistence

Create the design layer lazily under the project memory root:

```text
.ai-workflow/
|-- PROJECT.md
|-- design/
|   |-- INDEX.md
|   `-- records/D###-<design-decision>.md
|-- decisions/
|-- tickets/
`-- archive/
```

`INDEX.md` is the current design-shape index. A design record contains the question,
current shape, important states or transitions, constraints, evidence pointers, status,
supersedes/parent links, and related Ticket or ADR. It does not duplicate a full chat,
replace Ticket acceptance, or turn an unaccepted prototype opinion into a requirement.
Additional `flows/` and `surfaces/` directories are deferred until one accepted design
record demonstrates that the distinction is needed.

### Memory layers

- Product memory: repository-tracked `.ai-workflow` records; normative and auditable.
- Runtime attention: Codex thread/turn/item/Goal state; replaceable and recoverable.
- Host memory: optional Codex memory or compaction; advisory only and never authoritative.

Do not introduce vector search, a second project database, or a permanent App Server daemon
for this slice.

### Highest seams

The highest verification seam is the Coordinator's observable lifecycle adapter: given a
durable Project/Ticket state and a fake or controlled App Server event stream, it must
choose the correct existing/new task, emit the context packet, and produce the correct
durable outcome. Tests should not inspect private helper calls or depend on a particular
JSON-RPC implementation beyond the adapter contract.

## Testing Decisions

- Test external behavior at the Coordinator/App Server adapter seam, not private helper
  functions or prompt wording alone.
- Reuse the existing bridge, initializer, and lifecycle test style already used for
  `CodexBridge`, project initialization, and Ponytail hooks.
- The first focused smoke should cover: a duplicate title candidate, a paginated task
  list, an archived canonical task, a timeout while the remote turn is still active, a
  server approval request, and a context packet that points only to repository files.
- A second focused smoke should prove that a design record is discoverable by a new
  Project Lead and that runtime IDs do not enter tracked files.
- Verification depth remains subject to the Product Owner-confirmed Bar Tester Project
  Profile before an implementation Ticket is formed. This spec does not authorize a
  full regression suite, browser matrix, or default TDD cycle.

## Out of Scope

- Unrestricted autonomous background work or a permanent `--yolo` mode.
- A new dashboard, task panel, remote WebSocket service, or long-running App Server daemon.
- Automatic creation of new Tickets, expansion of approved outcomes, or automatic approval
  of filesystem, network, account, payment, release, migration, or destructive actions.
- Treating Codex host memory, persisted Goals, task transcripts, or host SQLite as Product
  memory.
- A vector database, semantic memory search, automatic transcript deletion, or irreversible
  summarization of normative records.
- External issue-tracker writes, npm publishing, website deployment, or changes to the
  existing public release surface.

## Further Notes

The OpenAI App Server documentation confirms that `thread/start`, `thread/resume`,
`thread/fork`, `thread/list`, `thread/read`, `thread/name/set`, `thread/metadata/update`,
`thread/archive`, `thread/unarchive`, `thread/compact/start`, and thread Goal methods are
available across different stability levels. Experimental methods and fields require an
explicit capability opt-in and version-matched schema; the implementation must probe or
degrade rather than assume every Codex host supports them.

MAGA's current repository contract already establishes `.ai-workflow` as the durable
authority. The recommended architecture therefore deepens the existing Coordinator and
design seams instead of introducing a parallel memory product.

Open Product Questions:

1. Confirm or correct the standing policy: may MAGA automatically create up to two named
   workers inside already approved Tickets, pass context, wait, recover, integrate, and
   archive, while all new scope and external or irreversible actions still require a
   fresh decision?
2. Unless corrected, design records cover both product shape and system design, while
   hard-to-reverse choices continue to use the existing `decisions/` / ADR path.
