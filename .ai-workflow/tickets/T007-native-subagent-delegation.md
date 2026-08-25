---
key: T007
status: integrated
authorization: approved
role: project-lead
workspace: delivery
---

# Route short-lived work through native subagents

## Outcome

MAGA chooses native subagents for bounded, read-only work inside an approved
Ticket and reserves named worker tasks for durable or side-effecting outcomes.
Newly initialized projects receive the same policy and routing contract.

## Acceptance

- Project Memory records `Delegate` separately from `Dispatch`, with a maximum of
  two active read-only subagents.
- Project Lead routing describes the execution ladder and the write/authority
  boundary for each native shape.
- Orchestration reuses named workers for durable outcomes and does not treat a
  subagent as a substitute for integration or acceptance.
- Initializer-generated `PROJECT.md` and `AGENTS.md` contain the bounded policy.
- Existing Goal, design-memory, privacy, and release boundaries remain intact.

## Boundaries

- No new scheduler, dashboard, daemon, vector memory, host-memory sync, or public
  subagent UI.
- No subagent writes, commits, task creation, external actions, or scope changes.
- No version bump or release publication in this Ticket.

## Blocked By

- None.

## Reads First

- `.ai-workflow/specs/native-subagent-delegation.md`
- `.ai-workflow/design/records/D001-bounded-proactive-coordination.md`
- `.ai-workflow/design/records/D002-native-subagent-delegation.md`
- `plugins/maga/skills/project-lead/references/project-memory.md`
- `plugins/maga/skills/project-lead/references/native-codex-loop.md`
- `plugins/maga/skills/orchestrate-tickets/SKILL.md`
- `src/init-project.js`

## Proof

- Break to catch: a new project omits the subagent boundary, or a routing rule
  lets a read-only subagent write, commit, create tasks, or expand authority.
- Evidence: `node --test test/native-subagent-routing.test.js test/init-project.test.js test/bundled-skills.test.js`.
- Persistent regression: yes — initializer and agent-facing contracts can drift.
- Risk delta: concurrency -> explicit subagent limit, read-only side-effect gate,
  and one focused contract smoke.
- Stop when: the focused smoke passes and every acceptance boundary is visible in
  the generated and maintained contracts.

## Execution

- Task opening: not-needed
- Task title: not-needed
- Attempt: 1
- Git branch: main
- Start commit: a8e78c5
- Starting dirty files: none

## Completion

- Behavior: Project Lead and initialized projects now distinguish bounded read-only native subagents from named workers, with separate Delegate and Dispatch authority.
- Validation: `node --test test/native-subagent-routing.test.js test/init-project.test.js test/bundled-skills.test.js` passed 24/24.
- Evidence: `.ai-workflow/specs/native-subagent-delegation.md`, D002, Project Memory, native execution-shape routing, orchestration boundary, initializer templates, and `test/native-subagent-routing.test.js`.
- Commit or artifact: 17d631c463d904312851a122021fba3d65796ff0
- Blocker: none
