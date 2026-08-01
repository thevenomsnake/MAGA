# 01 - Record A Worker Result

**Status:** ready

**Task title:** Orchestration smoke - 01 Record worker result

**Attempt:** 1

**Result commit:** None

**Validation:** None

**Blocker:** None

## What To Build

Create `experiments/orchestrate-tickets-smoke/worker-result.md` as evidence that a fresh Codex project task can read this contract, make one bounded change, validate it, and commit it.

The file must contain:

```markdown
# Worker Result

- Ticket: 01
- Outcome: Fresh Codex task completed the bounded contract.
```

## Acceptance Criteria

- Only `experiments/orchestrate-tickets-smoke/worker-result.md` is added by the worker.
- The content matches the required Markdown exactly.
- The worker performs one direct verification and commits the result.
- The worker returns the required status, behavior, validation, commit, and blocker fields.

## Boundaries

- Do not modify this ticket or any other project file.
- Do not include machine paths, user information, thread IDs, task IDs, or private data.
- Do not create another task, run a broad test suite, or review unrelated files.

## Blocking

None.
