---
name: orchestrate-tickets
description: Coordinate and recover an approved multi-ticket implementation in Codex by naming and creating fresh same-project tasks, preventing duplicate dispatch, sending each task only its ticket pointer, managing blockers and retries, integrating results, and archiving finished tasks. Use when the user asks in natural language to start, continue, or recover an approved ticket plan with separate Codex tasks or background sessions. Do not use for an unapproved plan or a single small implementation.
---

# Orchestrate Tickets

Run approved task contracts through fresh Codex project tasks. Keep product decisions visible to the user and keep skill names, Git mechanics, validation tools, and task routing internal unless the user asks.

## Preconditions

Proceed only when:

- The user approved the ticket breakdown and explicitly asked to execute it using separate Codex tasks or sessions. Natural language is sufficient; no skill command is required.
- Each ticket is a durable task contract with a user-visible outcome, acceptance criteria, blockers, and status.
- The contract is reachable from the worker's starting repository state or issue tracker.
- Codex task coordination tools are available.

If task tools are unavailable, say automatic dispatch is unavailable and provide the next ticket pointer. Do not pretend a task was created.

Follow `AGENTS.md` and narrower ticket instructions. Never persist machine paths, usernames, `threadId`, `hostId`, `clientThreadId`, or wait cursors in tracked files.

## Name Tasks Deterministically

Use the project's language and these title shapes:

```text
Coordinator: <feature> · <localized "build coordination">
Worker:      <feature> · <ticket-key> <user-visible outcome>
Replacement:<worker title> · <localized "retry N">
```

For example: `Inventory · 02 Record stock movement`.

- Derive the feature from the parent spec or epic and the outcome from the ticket.
- Keep the stable ticket key. Do not put status, branch, worktree, thread IDs, or commit hashes in a title.
- Keep one active task per ticket. Increment the retry suffix only when replacing an unusable task.
- Do not rename workers as their status changes.
- Rename the current task with `codex_app__set_thread_title` when it is the coordinator and still has a generic title.

## Separate Durable And Runtime State

Keep the ticket or tracker as the durable source of truth:

```text
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

1. Implement one small, self-contained ticket in the current task.
2. Use a fresh project task when a ticket needs a distinct attention workspace.
3. Run tickets sequentially by default.
4. Run tickets in parallel only when their blockers are complete, their write scopes do not conflict, and each task has an isolated worktree.

Do not create tasks merely because the plan contains several bullets. Split on attention and ownership boundaries. Do not dispatch more live tasks than can be tracked in one `codex_app__wait_threads` batch.

## Find The Frontier

Select tickets that are approved, `ready`, unclaimed, unblocked, and small enough for one fresh context. Read the index first, then open only the selected ticket and its explicit references.

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
Implement the task contract at: <repository-relative path or issue URL>

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
- Continue the same task with `codex_app__send_message_to_thread` when an engineering clarification can unblock it inside the approved scope.
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
