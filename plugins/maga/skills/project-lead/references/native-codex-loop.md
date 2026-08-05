# Native Codex Loop

Use this reference after a product Ticket is approved and work crosses Codex tasks. Codex in the ChatGPT desktop app is the sole user interface. Project files are durable memory; Codex tasks are replaceable attention workspaces.

## Invariants

- Keep one product-facing Project Lead task, named and pinned.
- Never pre-create empty capability tasks. Create a worker only for a concrete research question, prototype decision, diagnosis, review, or delivery outcome.
- A new Codex task requires explicit Product Owner approval for its deterministic title and attempt. MAGA chooses the useful responsibility automatically; work authorization alone is not task-creation permission.
- Keep durable roles in `.ai-workflow/roles/`; never use a task transcript as role memory.
- Pin a role-management task only for a `managed queue` role.
- Leave Ticket workers unpinned and archive them after their result is durably integrated, deferred, or superseded.
- Never persist `threadId`, `hostId`, `clientThreadId`, `turnId`, or wait cursors; rediscover tasks by saved project plus deterministic title.
- Resolve each specialist Ticket's explicitly saved MAGA responsibility profile immediately before creation, pass non-null model and thinking values to the native task tool, and keep machine-specific settings out of project memory. Unsaved MAGA values are recommendations; omit overrides and use the host default.
- Do not expose task choreography, Skills, Git, or validation machinery in normal product conversation.
- Do not create a separate UI, dashboard, task panel, or App Server service. The initializer bridge exits after establishing the Project Lead.

## Create Professional Workspaces On Demand

Keep product discussion in the Project Lead. When a bounded capability or delivery
Ticket benefits from fresh attention, use a title shaped as:

```text
<project> · <localized workspace or role> · <ticket-key> <specific outcome>
```

Prefer a fresh task only for an independent artifact, a materially different
source set or professional context, safe parallel work, context pressure, or a
separate permission, write, or acceptance boundary. Leave workers unpinned and
archive them after integration. A generic `Research` or `Prototype` task with no
specific object is not authoritative and should not be created.

## Choose At A Phase Boundary

A phase boundary is the point where one coherent unit of discussion, research,
delivery, or acceptance has finished. Decide there, not mid-phase:

1. **Continue in the Project Lead** when the next product decision needs the
   reasoning already present and attention remains coherent.
2. **Reuse or open an approved bounded worker** when the next outcome is
   independent, safely AFK, or needs a distinct evidence, permission, write, or
   acceptance boundary.
3. **Recover from durable project state** when the current attention workspace
   is polluted and repository truth is cheaper than carrying the transcript.
4. **Write a portable handoff** only when context must cross a harness,
   repository, directory, colleague, or an isolated mid-phase fork.

The host may compact conversation history automatically. Do not expose token
thresholds, `/clear`, `/compact`, or other session mechanics to the Product
Owner as workflow choices. Durable project state and the native task loop are
the recovery authority.

## Reconcile Before Acting

1. Read `AGENTS.md`, `.ai-workflow/PROJECT.md`, linked active roles, and active Tickets.
2. List current Codex tasks for the saved project.
3. Match deterministic titles to active Tickets and managed roles.
4. Resume or message a matching task instead of creating a duplicate.
5. Integrate completed results and archive workers before dispatching newly unblocked Tickets.
6. Treat a task with no durable role or Ticket contract as non-authoritative.

## Run One Closure Cycle

```text
approved Ticket + explicitly approved named task
  -> durable contract committed
  -> responsibility profile resolved against the destination host
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
2. Update the Ticket completion fields and set it to `integrated` only after the result is present in project history.
3. Update `PROJECT.md` with what is usable now and remove the Ticket from active work.
4. Move completed detail to archive only when that reduces the active working set; do not create empty archive structure.
5. Commit the state update, then archive the worker task.
6. Tell the Product Owner what they can use or inspect. Do not call the entire product complete unless every approved Ticket is integrated or explicitly deferred.

## Continue The Product

Keep the Project Lead task open after a slice completes. A new product request creates the next Ticket from current durable state. Replace the Project Lead task only when its attention workspace is polluted, recovery from the repository is cheaper, or the Product Owner explicitly asks the saved new Project Lead configuration to take over. Start the replacement under a unique temporary takeover title and leave it unpinned. After it recovers read-only from durable state, archive the old Project Lead, rename the replacement to the canonical title, and pin it. If recovery fails, archive the temporary task and keep the old Project Lead authoritative.
