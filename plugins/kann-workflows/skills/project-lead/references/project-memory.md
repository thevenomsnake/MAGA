# Project Memory Contract

Use this contract when onboarding a product, forming roles, creating Tickets, recording consequential decisions, completing work, or recovering a project. Keep every path relative to the project root.

## Minimal Layout

Create only records the project currently needs:

```text
.ai-workflow/
|-- PROJECT.md
|-- roles/
|   `-- <role-key>.md
|-- tickets/
|   `-- T001-<outcome-key>.md
|-- decisions/       # only for consequential decisions
`-- archive/         # only after something completes
```

`PROJECT.md` is the small current-state index. Role files hold durable responsibility. Ticket files hold bounded work and their execution authorization. Do not use chat transcripts, task IDs, host IDs, usernames, absolute paths, or worktree locations as project memory.

## Onboarding Completion

Leave `status: onboarding` until these facts are clear enough for one inspectable slice:

- intended user;
- problem or job;
- first observable value;
- delivery or inspection form;
- material cost, account, privacy, permission, destructive, or release boundaries.

Update `PROJECT.md` to `status: active` when the first Ticket is ready or running. Create a Ticket with `authorization: pending` unless the Product Owner has already authorized that clearly described result.

Use this shape:

```markdown
---
schema_version: 2
workflow_version: <installed version>
status: active
project_name: "<product name>"
---

# <Product name>

## Product Direction

- Intended user: <who>
- Problem: <job or pain>
- First value: <observable behavior>
- Delivery: <how the result is used or inspected>
- Boundaries: <material constraints or none known>

## Current State

<What exists, what is next, and what is blocked.>

## Roles

- [<Role>](roles/<role-key>.md): <purpose>

## Active Tickets

- [T001 <Outcome>](tickets/T001-<outcome-key>.md): <status>, <authorization>

## Decisions

None, or repository-relative links to consequential decision records.
```

## Role Contract

Always materialize the Project Lead during onboarding. Add another role only when it meets the role boundary in the parent skill. Use product responsibilities rather than framework layers.

```markdown
# <Role>

- Status: active
- Purpose: <why this responsibility exists>
- Owns: <decisions, artifacts, or actions>
- Does not own: <explicit boundary>
- Reads first: <small repository-relative entrypoints>
- Produces: <result and evidence>
- Authority: <allowed side effects and required approvals>
- Session shape: direct execution | managed queue
```

Use `managed queue` only for multiple approved Tickets, independent long-lived professional context, or distinct permissions. Otherwise use `direct execution`.

## Ticket Contract

Scan existing Ticket keys and allocate the next `T###` key. Use a short outcome slug. A Ticket is ready only when its product result and one completion check are concrete.

```markdown
---
key: T001
status: ready
authorization: pending
role: <role-key>
workspace: <optional research | prototype | delivery | diagnosis | review | release>
---

# <User-visible outcome>

## Outcome

<What the user can observe or do when complete.>

## Acceptance

- <Concise behavior example or observable criterion.>

## Boundaries

- <Non-goal, product constraint, or write boundary.>

## Reads First

- `<repository-relative path>`

## Completion Check

<One risk-matched preview, command, or inspectable fact.>

## Execution

- Task title: pending
- Attempt: pending

## Completion

- Behavior: pending
- Validation: pending
- Evidence: pending
- Commit or artifact: pending
- Blocker: none
```

Use status `ready`, `creating`, `running`, `needs-decision`, `completed`, `integrated`, `failed`, or `deferred`. Move Ticket detail out of the active working set only after it is `integrated` or explicitly `deferred`. Archive a worker task only after its result is durably recorded as integrated, deferred, or superseded; keep `PROJECT.md` focused on current work.

Leave `Task title` and `Attempt` as `pending` while the Ticket is unclaimed or
stays in the current focused task. Before creating a fresh task, persist its
deterministic title and a positive attempt number. Record the observed validation
fact and commit or artifact identity before marking the worker completed.

Omit `workspace` when the Ticket stays in the current focused task. When a fresh
task is useful, set it to the smallest stable capability label needed for a
specific task title; it describes the attention workspace, not a permanent role.

## Authorization

Treat authorization as part of each Ticket, not as permission to create Codex tasks:

- Use `pending` before the Ticket's research, prototype, diagnosis, review, delivery, or release work is authorized; use `approved` for an explicitly authorized Ticket and `revoked` when the Product Owner withdraws authorization.
- Accept natural language such as "start", "build it", or "continue" as approval for the currently described Ticket set. Update every Ticket in that set together; do not ask once per worker.
- Do not copy approval to a future Ticket. If an approved Ticket's outcome, acceptance, boundaries, cost, private-data use, external effect, destructive action, or release scope materially expands, return it to `pending`.
- Choose whether to work in the current task or create a fresh Codex task internally after approval. Task creation does not require a second permission.
- Keep `approved` for a same-scope retry. Return a deferred Ticket to `pending` before resuming it later.
- Do not dispatch or continue new side effects for a `pending` or `revoked` Ticket. When authorization is revoked during execution, stop at a safe boundary and return control to the Product Owner.
- Treat approval as authority only for the Ticket's written scope. It does not implicitly allow accounts, costs, sensitive data, external publication, destructive actions, migration, production changes, or release.

Treat legacy `task_creation` fields as migration input only; they never authorize execution. When a legacy `missions/` record becomes active again, migrate it to a `tickets/T###-*.md` Ticket, preserve its result and evidence, remove the old active pointer, and require current Ticket authorization before new work. Do not rewrite archived history merely to rename it.
