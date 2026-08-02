---
name: orchestrate-tickets
description: Internal Codex execution workflow for coordinating and recovering approved Tickets by naming and creating fresh same-project tasks, continuing them with messages, waiting for results, preventing duplicate dispatch, integrating outcomes, and archiving finished tasks. Use when an approved durable Ticket needs a fresh attention workspace or when a durable role needs a management task. Do not use for product discovery, an unapproved plan, or work that is cheaper to finish in the current focused task.
---

# Orchestrate Tickets

Run approved Ticket contracts through fresh Codex project tasks. This is an internal execution capability, not the normal product-facing entry. Keep product decisions visible and keep skill names, Git mechanics, validation tools, and task routing internal unless the user asks.

## Preconditions

Proceed only when:

- The Product Owner approved the currently described Ticket set and every selected Ticket records `authorization: approved`. Natural language is sufficient; if approval is expressed in the current turn, persist it on exactly those Tickets before dispatch.
- Each Ticket is a durable work contract with a user-visible outcome, acceptance criteria, blockers, authorization, and status.
- The contract is reachable from the worker's starting repository state or issue tracker.
- Codex task coordination tools are available.

If task tools are unavailable, say automatic dispatch is unavailable and provide the next ticket pointer. Do not pretend a task was created.

Follow `AGENTS.md` and narrower ticket instructions. Never persist machine paths, usernames, `threadId`, `hostId`, `clientThreadId`, or wait cursors in tracked files.

## Name Tasks Deterministically

Use the project's language and these title shapes:

```text
Coordinator: <project> · <localized "project lead">
Manager:     <project> · <role> · <localized "management">
Worker:      <project> · <role> · <ticket-key> <user-visible outcome>
Replacement:<worker title> · <localized "retry N">
```

For example: `Inventory · Stock experience · T002 Record stock movement`.

- Derive the project, role, Ticket key, and outcome from durable contracts. Name roles by responsibility, not generic code layers.
- Keep the stable ticket key. Do not put status, branch, worktree, thread IDs, or commit hashes in a title.
- Keep one active task per ticket. Increment the retry suffix only when replacing an unusable task.
- Do not rename workers as their status changes.
- Rename the current task with `codex_app__set_thread_title` when it is the coordinator and still has a generic title.

## Manage Durable Roles

For a role whose contract says `Session shape: managed queue`:

1. Reuse an active same-project task with the deterministic manager title.
2. If none exists, create one, pin it with `codex_app__set_thread_pinned`, and give it the role contract plus current project index as its only durable entrypoints.
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
Task title: <deterministic title>
Attempt: <positive integer>
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

1. Implement one small, self-contained ticket in the current task when its attention workspace is still focused.
2. Use a fresh project task when a Ticket needs a distinct professional context, write boundary, permission boundary, or clean recovery point.
3. Run tickets sequentially by default.
4. Run tickets in parallel only when their blockers are complete, their write scopes do not conflict, and each task has an isolated worktree.

Do not create tasks merely because the plan contains several bullets. Split on attention and ownership boundaries. Do not dispatch more live tasks than can be tracked in one `codex_app__wait_threads` batch.

## Find The Frontier

Select Tickets with `authorization: approved` that are `ready`, unclaimed, unblocked, and small enough for one fresh context. Read the index first, then open only the selected Ticket and its explicit references. A new, split, derived, materially expanded, resumed-deferred, or reauthorized-revoked Ticket is not executable until its own authorization is current; do not inherit approval from another Ticket or the legacy `task_creation` field.

If no ticket is ready, report the blocking product decision, dependency, permission, or external condition. Downstream tickets become ready only after every blocker is `integrated`, not merely `completed`.

## Create A Worker

1. Resolve the current saved project with `codex_app__list_projects`. Stop rather than selecting an ambiguous or different project.
2. Confirm no active task already has the deterministic title.
3. Set the ticket to `creating`, record its task title and attempt, then call `codex_app__create_thread` with that title and the initial prompt below.
4. For a Git repository, use an isolated worktree only when repository rules permit its location. If project files must remain in the saved project directory, use that checkout and serialize every writer.
5. If creation returns a real `threadId`, retain it only at runtime. Set the ticket to `running` when the tracker can be updated without touching the worker's checkout. With a file-backed tracker in the shared checkout, leave it at `creating` and keep the coordinator read-only until the worker stops.
6. If creation returns only `clientThreadId`, leave the ticket at `creating`. Never pass a client ID to read, send, wait, archive, or other tools that require `threadId`. Resolve the real task later by its deterministic title through `codex_app__list_threads`.
7. If creation fails, set the ticket to `failed` with the concrete reason.

Use this initial prompt:

```text
Implement the Ticket at: <repository-relative path or issue URL>

Read AGENTS.md and the contract's explicit references. Do not read sibling tickets
unless this contract links them. Do not create more tasks or update orchestration
state. Stay inside the approved product behavior and write boundary. If a product
decision or permission is missing, stop and return needs-decision instead of inventing
scope.

Produce the shortest runnable vertical slice, perform the one risk-matched validation
required by the contract, and commit the result. Do not introduce TDD, a full regression
run, or additional review stages unless the contract or repository rules require them.

Return exactly these fields:
Status: completed | needs-decision | failed
Behavior: <user-visible result or none>
Validation: <command and observed fact or none>
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

1. Require a resolvable commit and a concrete validation fact. Otherwise continue the same task for correction.
2. Set the ticket to `completed` and record the worker commit and validation.
3. Integrate the commit in dependency order using the repository's established Git workflow. A worker using the target checkout may already have committed directly to the target branch; verify that identity instead of cherry-picking it again.
4. Set the ticket to `integrated` only after integration succeeds. Release newly unblocked tickets at that point.
5. Archive the worker with `codex_app__set_thread_archived` after the durable record is complete.

Do not call the overall plan complete until every accepted ticket is integrated or explicitly deferred.

## Handle Failure And Replacement

Prefer continuing the existing worker when a focused follow-up can fix the problem. Create a replacement only when the original context or worktree is unusable.

Before replacement, record the failed attempt, treat the old worker as superseded, archive it, increment `Attempt`, and use the retry title. A replacement receives the original ticket pointer plus only the durable failure fact needed to avoid repetition; it does not receive the old transcript.

## Keep The Product Conversation Clean

Report what behavior is being built, what is ready to try, and what decision is blocked. Do not ask the user to choose skills, testing styles, ticket order, branches, worktrees, retry mechanics, or review modes unless one materially changes product behavior or risk.
