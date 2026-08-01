# Project Memory Contract

Use this contract when onboarding a product, forming roles, creating missions, recording consequential decisions, completing work, or recovering a project. Keep every path relative to the project root.

## Minimal Layout

Create only records the project currently needs:

```text
.ai-workflow/
|-- PROJECT.md
|-- roles/
|   `-- <role-key>.md
|-- missions/
|   `-- M001-<outcome-key>.md
|-- decisions/       # only for consequential decisions
`-- archive/         # only after something completes
```

`PROJECT.md` is the small current-state index. Role files hold durable responsibility. Mission files hold bounded work. Do not use chat transcripts, task IDs, host IDs, usernames, absolute paths, or worktree locations as project memory.

## Onboarding Completion

Leave `status: onboarding` until these facts are clear enough for one inspectable slice:

- intended user;
- problem or job;
- first observable value;
- delivery or inspection form;
- material cost, account, privacy, permission, destructive, or release boundaries.

Update `PROJECT.md` to `status: active` when the first mission is ready or running. Set `task_creation` to `approved` only after the user authorizes the described mission set; use `pending` before that and `revoked` when withdrawn.

Use this shape:

```markdown
---
schema_version: 1
workflow_version: <installed version>
status: active
project_name: "<product name>"
task_creation: pending | approved | revoked
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

## Active Missions

- [M001 <Outcome>](missions/M001-<outcome-key>.md): <status>

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

Use `managed queue` only for multiple approved missions, independent long-lived professional context, or distinct permissions. Otherwise use `direct execution`.

## Mission Contract

Scan existing mission keys and allocate the next `M###` key. Use a short outcome slug. A mission is ready only when its product result and one completion check are concrete.

```markdown
---
key: M001
status: ready
role: <role-key>
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

## Completion

- Behavior: pending
- Evidence: pending
- Commit or artifact: pending
- Blocker: none
```

Use status `ready`, `creating`, `running`, `needs-decision`, `completed`, `integrated`, `failed`, or `deferred`. Archive detail only after the result is accepted or explicitly deferred; keep `PROJECT.md` focused on current work.
