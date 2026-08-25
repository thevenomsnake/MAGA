# Native Codex Loop

Use this reference after a product Ticket is approved and work crosses Codex tasks. Use [exploration-loop.md](exploration-loop.md) instead for the pre-Ticket discussion boundary. Codex in the ChatGPT desktop app is the sole user interface. Project files are durable memory; Codex tasks are replaceable attention workspaces.

## Invariants

- Keep one product-facing Project Lead task, named and pinned.
- Never pre-create empty capability tasks. A pre-Ticket exploration has one concrete decision frontier; a Ticket worker has one concrete research question, prototype decision, diagnosis, review, or delivery outcome.
- A new Ticket worker requires either explicit Product Owner approval for its deterministic title and attempt or a confirmed project Autonomy Policy whose `Dispatch` scope covers the already approved Ticket. The pre-Ticket exploration loop carries its own one-task permission. MAGA chooses the useful responsibility automatically; work authorization alone is not Ticket-worker creation permission.
- Keep durable roles in `.ai-workflow/roles/`; never use a task transcript as role memory.
- Read the project's Autonomy Policy before dispatching; enforce its active-worker limit and side-effect gates.
- Use the project's `Delegate` policy for ephemeral read-only subagents and its
  `Dispatch` policy for named workers; never treat one as the other.
- Start each worker with a context packet containing repository-relative pointers to the project index, role, Ticket, design records, acceptance, and proof; do not copy the parent transcript.
- During recovery, read `.ai-workflow/design/INDEX.md` when it exists, then open only accepted records relevant to the current Ticket or product question.
- A persisted Codex Goal may mirror the current Ticket's short objective and budget; Goal state controls continuation only, while Ticket status and project memory control authorization and completion.
- Pin a role-management task only for a `managed queue` role.
- Leave Ticket workers unpinned and archive them after their result is durably integrated, deferred, or superseded.
- Never persist `threadId`, `hostId`, `clientThreadId`, `turnId`, or wait cursors; rediscover tasks by saved project plus deterministic title.
- Preserve the session hook's branch, full `HEAD`, and dirty set as the Git baseline. Use explicit branches or permitted worktrees, serialize shared-checkout writers, and protect pre-existing dirty paths.
- Resolve each specialist Ticket's explicitly saved MAGA responsibility profile immediately before creation, pass non-null model and thinking values to the native task tool, and keep machine-specific settings out of project memory. Unsaved MAGA values are recommendations; omit overrides and use the host default.
- Do not expose task choreography, Skills, Git, or validation machinery in normal product conversation.
- Do not create a separate UI, dashboard, task panel, or App Server service. The initializer bridge exits after establishing the Project Lead.

## Choose The Smallest Native Shape

At a phase boundary, choose the first shape that satisfies the outcome:

1. **Continue** in the current task for coupled product reasoning or a quick
   in-scope clarification.
2. **Delegate** to a native subagent for a short, read-only question inside the
   current approved Ticket. Return its finding to the parent and discard the
   attention workspace after the result is used. Use the `CodexBridge` native
   runtime adapter when MAGA is driving app-server directly; it negotiates the
   experimental capability, read-only sandbox, model support, and child lineage.
3. **Dispatch** a named worker task when the outcome needs code, a durable
   artifact, a commit, independent acceptance, a distinct permission boundary,
   or user-visible follow-up. Apply the existing reconciliation and integration
   lifecycle.
4. **Fork** only when the Product Owner explicitly wants the parent transcript
   preserved in an alternative branch.
5. **Use a worktree** only for proven non-overlapping parallel writers; otherwise
   serialize writes in the project checkout.
6. **Write a handoff** only when context must cross a harness, repository,
   directory, colleague, or isolated mid-phase fork.

Subagents never edit, commit, create tasks, approve requests, publish, or broaden
the Ticket. A native Goal may keep the current approved objective visible across
turns with a finite budget; Goal state remains continuation state, not project
authorization. The adapter returns an explicit unsupported fallback when the host
or selected model cannot provide native multi-agent support.

## Create Professional Workspaces On Demand

Keep quick product clarification in the Project Lead and use the pre-Ticket
exploration loop for likely multi-turn decision work. When a bounded capability
or delivery Ticket benefits from fresh attention, use a title shaped as:

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
   reasoning already present, is quick to close, and attention remains coherent.
2. **Open a bounded exploration** when a new unresolved product direction is
   likely to accumulate rejected paths or repeated discussion. Return its accepted
   decision before forming Tickets.
3. **Reuse or open an approved bounded worker** when the next outcome is
   independent, safely AFK, or needs a distinct evidence, permission, write, or
   acceptance boundary.
4. **Recover from durable project state** when the current attention workspace
   is polluted and repository truth is cheaper than carrying the transcript.
5. **Write a portable handoff** only when context must cross a harness,
   repository, directory, colleague, or an isolated mid-phase fork.

The host may compact conversation history automatically. Do not expose token
thresholds, `/clear`, `/compact`, or other session mechanics to the Product
Owner as workflow choices. Durable project state and the native task loop are
the recovery authority.

## Reconcile Before Acting

1. Read `AGENTS.md`, `.ai-workflow/PROJECT.md`, linked active roles, and active Tickets.
2. Read the recorded Git baseline and compare it with the current branch, `HEAD`, and dirty set before assigning a writer.
3. List current Codex tasks for the saved project.
4. Match deterministic titles to active Tickets, managed roles, and any one
   bounded exploration awaiting a decision packet.
5. Resume or message a matching task instead of creating a duplicate.
6. Integrate completed results and archive workers before dispatching newly unblocked Tickets.
7. Treat a task with no durable role or Ticket contract as non-authoritative.

## Run One Closure Cycle

```text
approved Ticket + explicit task approval or standing dispatch policy
  -> durable contract committed
  -> explicit branch/worktree + protected Git baseline
  -> responsibility profile resolved against the destination host
  -> native task creating/running
  -> completed or needs-decision
  -> result integrated
  -> durable state updated
  -> worker archived
  -> usable result returned through Project Lead
```

Keep the coordinator read-only while a shared-checkout worker writes. A worker
commit on the target branch is already integrated when its returned commit
resolves to the current history; do not cherry-pick it again. Before branch
switches, synchronization, cleanup, or replacement, preserve all current changes
recoverably. Never use `reset --hard` or `checkout` to discard another task's
work.

When a worker returns `needs-decision`:

- answer an engineering clarification inside the approved boundary by messaging the same task;
- write a consequential product decision to durable state before messaging it;
- ask the Product Owner only for behavior, experience, cost, permission, private-data, destructive, release, or unverifiable judgment;
- create a replacement only when the original task or checkout is unusable.

When a worker returns `completed`:

1. Require a concrete behavior or artifact, one focused validation fact, and a resolvable commit made from the worker's declared branch or worktree.
2. Update the Ticket completion fields and set it to `integrated` only after the result is present in project history.
3. Update `PROJECT.md` with what is usable now and remove the Ticket from active work.
4. Move completed detail to archive only when that reduces the active working set; do not create empty archive structure.
5. Commit the state update, then archive the worker task.
6. Tell the Product Owner what they can use or inspect. Do not call the entire product complete unless every approved Ticket is integrated or explicitly deferred.

## Continue The Product

Keep the Project Lead task open after a slice completes. A settled product request creates the next Ticket from current durable state; an unresolved likely multi-turn request first uses the exploration loop. Replace the Project Lead task only when its attention workspace is polluted, recovery from the repository is cheaper, or the Product Owner explicitly asks the saved new Project Lead configuration to take over. Start the replacement under a unique temporary takeover title and leave it unpinned. After it recovers read-only from durable state, archive the old Project Lead, rename the replacement to the canonical title, and pin it. If recovery fails, archive the temporary task and keep the old Project Lead authoritative.
