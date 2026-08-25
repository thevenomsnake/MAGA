---
name: orchestrate-tickets
description: Internal Codex execution workflow for coordinating and recovering approved research, prototype, diagnosis, review, delivery, or release Tickets by resolving their saved responsibility model and reasoning depth, naming and creating fresh same-project tasks, continuing them with messages, waiting for results, preventing duplicate dispatch, integrating outcomes, and archiving finished tasks. Use when an approved durable Ticket has a specialist workspace or when a durable role needs a management task. Do not use for vague product discovery or an unapproved plan.
---

# Orchestrate Tickets

Run approved Ticket contracts through fresh Codex project tasks. A Ticket may
produce a finding, prototype, diagnosis, review, delivery, or release result; it
does not have to be source-code implementation. This is an internal execution
capability, not the normal product-facing entry. Keep product decisions visible
and keep skill names, Git mechanics, validation tools, and task routing internal
unless the user asks.

## Preconditions

Proceed only when:

- The Product Owner approved the currently described Ticket set and every selected Ticket records `authorization: approved`.
- For every task that does not already exist, either the Product Owner explicitly
  approved its deterministic title or the project Autonomy Policy authorizes
  dispatch inside this already approved Ticket and its active-worker limit. Record
  `Task opening: approved` or `Task opening: standing-policy` for the exact title
  and attempt before dispatch.
- Each Ticket is a durable work contract with a user-visible outcome, acceptance criteria, blockers, authorization, and status.
- The contract is reachable from the worker's starting repository state or issue tracker.
- Codex task coordination tools are available.
- The project's Autonomy Policy has been read; it does not authorize new Tickets,
  expanded outcomes, or external/irreversible side effects.
- Short-lived read-only investigation may use a native subagent only when the
  project's `Delegate` policy has capacity. A subagent cannot write, commit,
  create another task, approve a request, or expand the Ticket.
- A thread Goal, when available, is only a bounded continuation aid. It never
  authorizes a Ticket, permission, release, or expanded outcome.

If task tools are unavailable, say automatic dispatch is unavailable and provide the next ticket pointer. Do not pretend a task was created.

Follow `AGENTS.md` and narrower ticket instructions. Never persist machine paths, usernames, `threadId`, `hostId`, `clientThreadId`, or wait cursors in tracked files.

## Name Tasks Deterministically

Use the project's language and these title shapes:

```text
Coordinator: <project> · <localized "project lead">
Manager:     <project> · <role> · <localized "management">
Worker:      <project> · <localized workspace or role> · <ticket-key> <user-visible outcome>
Replacement:<worker title> · <localized "retry N">
```

For example: `Inventory · Prototype · T002 Mobile stock adjustment flow`.

- Derive the project, workspace or role, Ticket key, and outcome from durable contracts. Prefer the Ticket's optional `workspace` value for bounded capability work; otherwise use its role. Name roles by responsibility, not generic code layers.
- Keep the stable ticket key. Do not put status, branch, worktree, thread IDs, or commit hashes in a title.
- Keep one active task per ticket. Increment the retry suffix only when replacing an unusable task.
- Do not rename workers as their status changes.
- Rename the current task with `codex_app__set_thread_title` when it is the coordinator and still has a generic title.
- Never create or keep a worker titled only with a generic capability such as `Research`, `Prototype`, or `Implementation`; the Ticket key and specific outcome are required.

## Manage Durable Roles

For a role whose contract says `Session shape: managed queue`:

1. Reuse an active same-project task with the deterministic manager title.
2. If none exists, propose its deterministic manager title and create it only when
   the project's Autonomy Policy covers that role queue or the Product Owner has
   approved the exact title; then pin it with `codex_app__set_thread_pinned` and
   give it the role contract plus current project index as its only durable entrypoints.
3. Send newly approved Ticket pointers to that manager instead of creating another manager.
4. Let the manager apply this worker lifecycle within its role boundary; it must return product decisions and cross-role conflicts to the Project Lead.
5. Keep the role in repository state. Archive its manager task only when the role is retired or replaced, and record that durable fact first.

Use this manager prompt:

```text
Carry the durable role at: <repository-relative role contract>

Read AGENTS.md, .ai-workflow/PROJECT.md, and that role contract. Coordinate only
approved Tickets owned by this role. Apply the installed task-orchestration
capability internally. Do not broaden product scope, store task identifiers in the
repository, or implement every Ticket in this management context. Return product
decisions and cross-role conflicts to the Project Lead.
```

Do not create a management task for `direct execution` roles. Dispatch their approved fresh Tickets directly from the Project Lead.

## Separate Durable And Runtime State

Keep the ticket or tracker as the durable source of truth:

```text
Authorization: pending | approved | revoked
Status: ready | creating | running | needs-decision | completed | integrated | failed | deferred
Task opening: pending | approved | standing-policy | not-needed
Task title: <deterministic title>
Attempt: <positive integer>
Git branch: <explicit branch>
Start commit: <full commit>
Starting dirty files: <repository-relative set or none>
Result commit: <set on completion>
Validation: <set on completion>
Blocker: <set only while blocked or failed>
```

Use the tracker comment/history mechanism for prior attempts. Keep Codex-only runtime state in the coordinator context: `threadId`, `hostId`, `clientThreadId`, wait cursor, and worktree details.

The worker task lifecycle is:

```text
creating -> running -> completed -> archived
                <-> needs-decision
creating/running -> failed
failed/running -> superseded -> archived
```

`completed` means the worker returned a commit. `integrated` is a later durable ticket state. Archive a worker only after its result is integrated, deferred, or superseded and recorded.

For a file-backed tracker in a shared checkout, keep `creating` as the durable claim throughout worker execution. Use the Codex runtime task state as `running`; do not edit or commit tracker files concurrently with the worker.

## Recover Before Dispatching

Always reconcile existing state before creating tasks:

1. Read nonterminal tickets from the tracker.
2. Call `codex_app__list_threads` and match the current project, host, and deterministic task title.
3. Resume waiting for an existing active task instead of creating a duplicate.
4. Inspect completed-but-not-integrated tasks and integrate them before releasing dependants.
5. Archive integrated tasks that remain open in the task list.
6. If duplicate workers exist, keep the task for the current attempt, stop treating the others as authoritative, record them as superseded, and archive them.

For a ticket stuck at `creating` with no matching thread, perform one bounded refresh of the task list. If it still does not exist, record the attempt as failed before creating a replacement. Never create a duplicate merely because task setup is slow.

## Choose The Smallest Execution Shape

1. Keep a small, self-contained Ticket in the current task when it has no
   specialist `workspace` and remains Project Lead work.
2. Use a native subagent before opening a worker when the question is short,
   read-only, inside the approved Ticket, and its result can return to the
   parent without durable integration. Check `Delegate` capacity first.
3. Propose a fresh project task for a Ticket whose workspace is `research`,
   `prototype`, `delivery`, `diagnosis`, `review`, or `release` when the outcome
   needs a durable artifact, source change, commit, independent acceptance,
   distinct permission boundary, or user-visible follow-up. Create it when the
   project's confirmed `Dispatch` policy covers the approved Ticket and has
   capacity, or after explicit approval; the fresh task is required for its
   responsibility model and reasoning depth to take effect.
4. Run Tickets sequentially by default.
5. Run Tickets in parallel only when their blockers are complete, their write
   scopes do not conflict, and each task has an isolated worktree.

### Native subagent boundary

Give a subagent the smallest repository-relative pointers and one question. It
returns a finding, uncertainty, or blocker to its parent. Do not give it a
commit requirement, a task-creation instruction, an external connector, or a
permission escalation. If the question grows into a durable artifact, source
change, or independent acceptance result, stop the subagent and dispatch a
named worker through the normal Ticket lifecycle.

Do not create tasks merely because the plan contains several bullets. Split on attention and ownership boundaries. Do not dispatch more live tasks than can be tracked in one `codex_app__wait_threads` batch.

## Find The Frontier

Select Tickets with `authorization: approved` that are `ready`, unclaimed, unblocked, and small enough for one fresh context. Read the index first, then open only the selected Ticket and its explicit references. A new, split, derived, materially expanded, resumed-deferred, or reauthorized-revoked Ticket is not executable until its own authorization is current; do not inherit approval from another Ticket or the legacy `task_creation` field.

If no ticket is ready, report the blocking product decision, dependency, permission, or external condition. Downstream tickets become ready only after every blocker is `integrated`, not merely `completed`.

## Resolve The Responsibility Profile

The Ticket's `workspace` is its compute-profile key. Immediately before creating
a worker or manager, call the bundled `resolve_maga_compute_profile` tool with
that stable key. For a manager, use the role contract's `Primary workspace`.
If the Product Owner explicitly requested a model or depth for this task, pass
that as the resolver's one-task override; otherwise omit it.

- Pass `actual.model` to `codex_app__create_thread.model` and
  `actual.effort` to `codex_app__create_thread.thinking`. Omit a null value so
  the host applies its default.
- Use this precedence: explicit Product Owner choice for this task, then the
  saved responsibility setting, then the host default. The MAGA recommendation is the panel's
  recommendation until explicitly saved. Never upgrade or downgrade because the Ticket appears easy, hard,
  urgent, or important.
- Resolution compares the choice with a reference catalog only; task creation
  performs authoritative destination-host validation. A reference-catalog notice
  does not replace an explicitly saved choice. If the destination rejects model
  or thinking, apply the one bounded host-default retry below and tell the Project
  Lead before continuing; do not persist either choice in the Ticket or repository.
- A setting change affects newly created tasks. Continue an existing healthy
  task without switching its model; create a replacement only for the normal
  replacement reasons in this workflow.
- If the bundled resolver is unavailable, omit model and thinking, use the host
  default, and report that MAGA configuration could not be applied. Do not guess.

Direct manual use of a Matt or Ponytail Skill inherits the current task's model.
Do not wrap or rewrite those Skills to simulate responsibility routing.

## Create A Worker

1. Resolve the current saved project with `codex_app__list_projects`. Stop rather than selecting an ambiguous or different project.
2. Confirm no active task already has the deterministic title.
3. Confirm `Task opening: approved` or `Task opening: standing-policy` records
   permission for this exact title and attempt. If neither applies, return the
   named proposal to the Project Lead; do not call task creation tools.
4. Resolve the Ticket's responsibility profile as above.
5. Set the ticket to `creating`, record its task title and attempt, then call `codex_app__create_thread` with that title, the resolved model and thinking, and the initial prompt below.
6. For a Git repository, preserve the session baseline, use an explicit branch, and use an isolated worktree only when repository rules permit its location. If project files must remain in the saved project directory, use that checkout and serialize every writer. Record the branch, start commit, and starting dirty set before the worker writes.
7. If creation returns a real `threadId`, retain it only at runtime. Set the ticket to `running` when the tracker can be updated without touching the worker's checkout. With a file-backed tracker in the shared checkout, leave it at `creating` and keep the coordinator read-only until the worker stops.
8. If creation returns only `clientThreadId`, leave the ticket at `creating`. Never pass a client ID to read, send, wait, archive, or other tools that require `threadId`. Resolve the real task later by its deterministic title through `codex_app__list_threads`.
9. If creation fails, set the ticket to `failed` with the concrete reason.

If creation rejects only the selected model or thinking on a different
destination host, retry once with those overrides omitted, disclose that host
fallback, and then continue the normal lifecycle. Do not retry broader creation,
permission, project, or worktree failures under this exception.

Use this initial prompt:

```text
Complete the Ticket at: <repository-relative path or issue URL>

Read AGENTS.md and the contract's explicit references. Do not read sibling tickets
unless this contract links them. Do not create more tasks or update orchestration
state. Stay inside the approved product behavior and write boundary. If a product
decision or permission is missing, stop and return needs-decision instead of inventing
scope.

Use the context packet pointers from the Project Lead. Read the project index, role,
Ticket, `.ai-workflow/design/INDEX.md` when present, linked accepted design records,
acceptance, and proof before acting; do not copy or reconstruct the parent transcript.

Use the Ticket's workspace and completion check to select installed capabilities
internally; never ask the Product Owner to name a Skill. Produce the shortest runnable
or inspectable result, perform the one risk-matched validation required by the contract,
and commit the result before switching context. Protect every path that was already dirty
at session start. Do not introduce TDD, a full regression run, or additional review
stages unless the contract or repository rules require them.

Return exactly these fields:
Status: completed | needs-decision | failed
Behavior: <user-visible result or none>
Validation: <command and observed fact or none>
Branch: <explicit branch or none>
Commit: <hash or none>
Blocker: <decision, dependency, permission, or failure reason or none>
```

The prompt is a pointer plus execution policy, not a second source of requirements.

## Observe And Steer

- Wait with `codex_app__wait_threads`; reuse returned cursors so output is not processed twice.
- Inspect with `codex_app__read_thread` only when the returned summary is insufficient.
- Continue the same task with `codex_app__send_message_to_thread` when a clarification can unblock it inside the approved scope. Do not replace a healthy task just to send another message.
- Persist a product decision in the ticket or its referenced decision record before sending the worker a concise follow-up.
- Route product ambiguity, cost, external access, sensitive data, destructive actions, releases, or unverifiable results to the user.
- Do not repeat validation that already passed unless integration changed the behavior it covered.

## Complete, Integrate, And Archive

When a worker reports `completed`:

1. Require a resolvable commit, its explicit branch, a concrete validation fact, and no uncommitted Ticket changes left in the worker checkout. Otherwise continue the same task for correction.
2. Set the ticket to `completed` and record the worker commit and validation.
3. Integrate the commit in dependency order using the repository's established Git workflow. Preserve unrelated dirty paths before any switch or synchronization. A worker using the target checkout may already have committed directly to the target branch; verify that identity instead of cherry-picking it again.
4. Set the ticket to `integrated` only after integration succeeds. Release newly unblocked tickets at that point.
5. Archive the worker with `codex_app__set_thread_archived` after the durable record is complete.

Do not call the overall plan complete until every accepted ticket is integrated or explicitly deferred.

## Handle Failure And Replacement

Prefer continuing the existing worker when a focused follow-up can fix the problem. Create a replacement only when the original context or worktree is unusable.

Before replacement, record the failed attempt, treat the old worker as superseded, increment `Attempt`, and propose the retry title. A replacement is another new task and requires explicit Product Owner approval. After approval, archive the old worker and create the replacement with the original ticket pointer plus only the durable failure fact needed to avoid repetition; it does not receive the old transcript.

## Keep The Product Conversation Clean

Report what behavior is being built, what is ready to try, and what decision is blocked. Do not ask the user to choose skills, testing styles, ticket order, branches, worktrees, retry mechanics, or review modes unless one materially changes product behavior or risk.
