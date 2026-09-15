# Dispatch And Recovery

Read before recovering task state or creating an approved worker. Current host task-creation requirements override general standing-policy language below.

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
  saved responsibility setting, then the host default. Unconfigured fields inherit the host default.
  Do not recommend a model, reasoning depth, or plan. Never upgrade or downgrade because the Ticket appears easy, hard,
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

