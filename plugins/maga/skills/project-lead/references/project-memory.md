# Project Memory Contract

Use this contract when onboarding a product, forming roles, creating Tickets, recording consequential decisions, completing work, or recovering a project. Keep every path relative to the project root.

## Minimal Layout

Create only records the project currently needs:

```text
.ai-workflow/
|-- PROJECT.md
|-- roles/
|   `-- <role-key>.md
|-- specs/           # only when several closed decisions need one durable synthesis
|-- questionnaires/  # only when an external knowledge holder blocks a decision
|-- tickets/
|   `-- T001-<outcome-key>.md
|-- decisions/       # only for consequential decisions
|-- RELEASES.md      # only after the first deployment attempt
`-- archive/         # only after something completes
```

`PROJECT.md` is the small current-state index. Role files hold durable responsibility. Ticket files hold bounded work and their execution authorization. Do not use chat transcripts, task IDs, host IDs, usernames, absolute paths, or worktree locations as project memory.

When a specification is useful, write one focused file under
`.ai-workflow/specs/` (or reuse an established repository specification
location) and link it from the relevant Tickets. Do not create a specification
merely to satisfy a phase name.

## Onboarding Completion

Leave `status: onboarding` until these facts are clear enough for one inspectable slice:

- intended user;
- problem or job;
- first observable value;
- delivery or inspection form;
- material cost, account, privacy, permission, destructive, or release boundaries.
- For software work, the Product Owner's current use, exposure, delivery, and system-size selection.

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

## Project Profile

- Current use: personal | controlled | public
- Exposure: local | internal | internet
- Delivery: source | shared-artifact | public-release
- System size: small | medium | large
- Risk modifiers: none | auth | sensitive-data | money | migration | concurrency | irreversible | untrusted-input | other
- Selection: Product Owner confirmed
- Change rule: Product Owner will report a material profile change before implementation or release.

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
- Primary workspace: project-lead | research | prototype | delivery | diagnosis | review | release
- Session shape: direct execution | managed queue
```

Use `managed queue` only for multiple approved Tickets, independent long-lived professional context, or distinct permissions. Otherwise use `direct execution`. `Primary workspace` selects a stable MAGA responsibility profile; it never stores a model name or reasoning depth in Git.

## Ticket Contract

Scan existing Ticket keys and allocate the next `T###` key. Use a short outcome
slug. A Ticket is ready only when its product result and one completion check
or structured proof is concrete and every listed blocker is already `integrated`
(or it has no blockers). Apply registered `bar-tester` before forming a
software Ticket. If the Project Profile is missing, return to the Project Lead
for the Product Owner's selection rather than choosing a profile internally.

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

## Blocked By

- None, or `<T###>` plus the outcome it must integrate first.

## Reads First

- `<repository-relative path>`

## Completion Check

<For Personal + Local + Source without a risk modifier: one direct preview,
command, or observable fact.>

## Execution

- Task opening: pending | approved | not-needed
- Task title: pending
- Attempt: pending
- Git branch: pending
- Start commit: pending
- Starting dirty files: pending

## Completion

- Behavior: pending
- Validation: pending
- Evidence: pending
- Commit or artifact: pending
- Blocker: none
```

For Controlled, Public, artifact delivery, Internet exposure, or a concrete
risk modifier, replace `## Completion Check` with:

```markdown
## Proof

- Break to catch: <one relevant failure>
- Evidence: <exact smoke, command, inspection, artifact, or target environment>
- Persistent regression: no | yes — <why>
- Risk delta: none | <risk → minimum added evidence>
- Stop when: <observable pass condition>
```

Do not add both forms. System size selects the cheapest relevant scope: exact
for Small, affected component plus a touched boundary for Medium, and existing
affected/related graph selection for Large. It does not independently raise the
assurance level.

Use status `ready`, `creating`, `running`, `needs-decision`, `completed`, `integrated`, `failed`, or `deferred`. Move Ticket detail out of the active working set only after it is `integrated` or explicitly `deferred`. Archive a worker task only after its result is durably recorded as integrated, deferred, or superseded; keep `PROJECT.md` focused on current work.

Leave `Task opening`, `Task title`, and `Attempt` as `pending` while the Ticket is
unclaimed. Use `Task opening: not-needed` when work stays in the current focused
task. Before creating a fresh task, persist its deterministic title, a positive
attempt number, and the Product Owner's explicit approval for that exact task.
Record the observed validation
fact and commit or artifact identity before marking the worker completed.

Before the first write, fill `Git branch`, `Start commit`, and
`Starting dirty files` from the session baseline. Use repository-relative dirty
paths or `none`; never store a worktree's absolute path. These values describe
the worker's protected starting boundary and do not change when another session
later commits, moves, or cleans those files.

Omit `workspace` only when the Ticket stays as Project Lead work in the current
focused task. Set `workspace` to the smallest stable responsibility label for
research, prototype, delivery, diagnosis, review, or release work. A specialist
workspace requires a configured fresh task so its model and reasoning depth can
take effect. The label describes attention and compute routing, not a permanent
role. Keep the actual model, depth, availability, and fallback out of tracked
project memory.

## Project Profile Changes

Treat Personal to Controlled/Public, Local to Internal/Internet, source to an
artifact/release, or a material system-size change as profile drift. The Product
Owner must select the new value before the next implementation or release.
Update `PROJECT.md`, preserve still-valid Ticket evidence, and add only the proof
needed for the new boundary. Do not retrofit completed Tickets or promote a
current profile merely because the product may grow later.

## Authorization

Treat execution authorization and permission to open a Codex task as separate facts:

These fields govern Ticket workers and durable role tasks. A pre-Ticket
exploration creates no Ticket record; its one-task permission and return boundary
live in [exploration-loop.md](exploration-loop.md). Apply the rules below after an
accepted decision becomes durable work.

- Use `pending` before the Ticket's research, prototype, diagnosis, review, delivery, or release work is authorized; use `approved` for an explicitly authorized Ticket and `revoked` when the Product Owner withdraws authorization.
- Accept natural language such as "start", "build it", or "continue" as execution approval for the currently described Ticket set. Update every Ticket in that set together.
- Do not copy approval to a future Ticket. If an approved Ticket's outcome, acceptance, boundaries, cost, private-data use, external effect, destructive action, or release scope materially expands, return it to `pending`.
- Decide internally whether fresh attention is useful, but do not create a new Codex task unless the Product Owner explicitly requested one or approves the proposed deterministic title. Ask once for a clearly listed batch rather than once per worker. Record that permission as `Task opening: approved` for the exact title and attempt; it does not carry to replacements or future Tickets.
- Keep `approved` for a same-scope retry. Return a deferred Ticket to `pending` before resuming it later.
- Do not dispatch or continue new side effects for a `pending` or `revoked` Ticket. When authorization is revoked during execution, stop at a safe boundary and return control to the Product Owner.
- Treat approval as authority only for the Ticket's written scope. It does not implicitly allow accounts, costs, sensitive data, external publication, destructive actions, migration, production changes, or release.

Treat legacy `task_creation` fields as migration input only; they never authorize execution. When a legacy `missions/` record becomes active again, migrate it to a `tickets/T###-*.md` Ticket, preserve its result and evidence, remove the old active pointer, and require current Ticket authorization before new work. Do not rewrite archived history merely to rename it.

## Release State

Create `.ai-workflow/RELEASES.md` only after the first real deployment attempt.
Keep one current block and a short append-only history:

```markdown
# Release State

- Status: succeeded | failed | rolled-back
- Attempted commit: <full commit>
- Deployed commit: <full commit or none>
- Previous known-good: <full commit or none>
- Rollback commit: <full commit or none>
- Evidence: <one focused production fact>
```

Update this file from the provider's observed result, then commit the state
update. A failed attempt does not become the deployed commit. Roll back by
redeploying `Rollback commit` through the same pipeline; do not rewrite the
branch or patch server files.
