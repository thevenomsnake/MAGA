# Native Codex Loop

Use this reference after a product mission is approved and work crosses Codex tasks. Codex Desktop is the sole user interface. Project files are durable memory; Codex tasks are replaceable attention workspaces.

## Invariants

- Keep one product-facing Project Lead task, named and pinned.
- Keep durable roles in `.ai-workflow/roles/`; never use a task transcript as role memory.
- Pin a role-management task only for a `managed queue` role.
- Leave mission workers unpinned and archive them after their result is durably integrated, deferred, or superseded.
- Never persist `threadId`, `hostId`, `clientThreadId`, `turnId`, or wait cursors; rediscover tasks by saved project plus deterministic title.
- Do not expose task choreography, Skills, Git, or validation machinery in normal product conversation.
- Do not create a separate UI, dashboard, task panel, or App Server service. The initializer bridge exits after establishing the Project Lead.

## Reconcile Before Acting

1. Read `AGENTS.md`, `.ai-workflow/PROJECT.md`, linked active roles, and active missions.
2. List current Codex tasks for the saved project.
3. Match deterministic titles to active missions and managed roles.
4. Resume or message a matching task instead of creating a duplicate.
5. Integrate completed results and archive workers before dispatching newly unblocked missions.
6. Treat a task with no durable role or mission contract as non-authoritative.

## Run One Closure Cycle

```text
approved mission
  -> durable contract committed
  -> native task creating/running
  -> completed or needs-decision
  -> result integrated
  -> durable state updated
  -> worker archived
  -> usable result returned through Project Lead
```

Keep the coordinator read-only while a shared-checkout worker writes. A worker commit on the target branch is already integrated when its returned commit resolves to the current history; do not cherry-pick it again.

When a worker returns `needs-decision`:

- answer an engineering clarification inside the approved boundary by messaging the same task;
- write a consequential product decision to durable state before messaging it;
- ask the Product Owner only for behavior, experience, cost, permission, private-data, destructive, release, or unverifiable judgment;
- create a replacement only when the original task or checkout is unusable.

When a worker returns `completed`:

1. Require a concrete behavior or artifact, one focused validation fact, and a resolvable commit or artifact identity.
2. Update the mission completion fields and set it to `integrated` only after the result is present in project history.
3. Update `PROJECT.md` with what is usable now and remove the mission from active work.
4. Move completed detail to archive only when that reduces the active working set; do not create empty archive structure.
5. Commit the state update, then archive the worker task.
6. Tell the Product Owner what they can use or inspect. Do not call the entire product complete unless every approved mission is integrated or explicitly deferred.

## Continue The Product

Keep the Project Lead task open after a slice completes. A new product request creates the next mission from current durable state. Replace the Project Lead task only when its attention workspace is polluted or recovery from the repository is cheaper; give the replacement the same deterministic title and archive the old task after the new one has recovered.
