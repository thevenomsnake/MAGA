# 01 - Record A Worker Result

**Status:** integrated

**Task title:** Orchestration smoke · 01 Record worker result

**Attempt:** 1

**Result commit:** `7fc7b00`

**Validation:** PowerShell exact-content and sole-change check; PASS.

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

## Experiment Result

- Codex created a same-project task with the deterministic title and returned a usable thread identifier immediately.
- The worker read only this contract and project instructions, added the one allowed file, ran one focused verification, and committed it.
- The coordinator received the structured result through task waiting without replaying the worker transcript.
- Because the worker used the saved checkout, its commit became the target branch result directly; no separate integration operation was required.
- A file-backed ticket cannot be committed from the coordinator while a shared-checkout worker may be using Git. In this mode, `creating` remains the durable claim while Codex runtime state represents active execution.
