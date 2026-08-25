---
key: T005
status: integrated
authorization: approved
role: project-lead
---

# Keep an approved Ticket objective across thread turns

## Outcome

MAGA can optionally mirror a short approved Ticket objective to the current Codex
thread Goal, with a bounded token budget and an explicit fallback when the host
does not support the Goal API. Project memory remains authoritative.

## Acceptance

- A caller can set, read, and clear a thread Goal through the bridge without
  persisting runtime IDs in project files.
- Goal objectives are bounded and reject empty or overlong values rather than
  silently truncating them.
- An unsupported/experimental-host error returns a visible fallback result and
  does not fail repository recovery or task creation.
- Goal status transitions are explicit (`active`, `paused`, `blocked`,
  `budgetLimited`, `usageLimited`, `complete`) and never authorize new Tickets
  or side effects.
- Project Lead/orchestration guidance treats Goal as thread continuation only and
  uses `.ai-workflow` records for product truth and completion evidence.

## Boundaries

- In scope: CodexBridge Goal adapter, optional Project Lead launch goal, guidance,
  and focused tests.
- Out of scope: automatic infinite loops, host memory APIs, Goal-based release
  authorization, scheduled tasks, UI, and external services.

## Blocked By

- T004 — Persist accepted design decisions for Project Lead recovery (integrated).

## Reads First

- `.ai-workflow/PROJECT.md`
- `.ai-workflow/specs/proactive-task-dispatch-and-design-memory.md`
- `src/codex-bridge.js`
- `plugins/maga/skills/project-lead/references/native-codex-loop.md`

## Proof

- Break to catch: an unsupported Goal API blocks recovery, or a Goal is mistaken
  for project authorization.
- Evidence: focused CodexBridge tests inspect set/get/clear params, bounded input,
  and unsupported-host fallback.
- Persistent regression: yes — host versions vary and Goal state is thread-scoped.
- Risk delta: permissions/concurrency -> no automatic approval or new Ticket is
  implied by a Goal, and token budget remains bounded.
- Stop when: supported hosts receive the exact Goal request, unsupported hosts
  return fallback, and repository state remains unchanged.

## Execution

- Task opening: not-needed
- Task title: not-needed
- Attempt: 1
- Git branch: codex/t005-thread-goal
- Start commit: 8b86644
- Starting dirty files: none

## Completion

- Behavior: CodexBridge can set, read, clear, and optionally apply a bounded thread Goal; unsupported hosts return a repository-memory fallback without blocking recovery.
- Validation: `node --test test/codex-bridge.test.js` passed 16/16.
- Evidence: Goal adapter methods and launch option in `src/codex-bridge.js`, orchestration guidance, and focused bridge tests.
- Commit or artifact: b0ebb24
- Blocker: none
