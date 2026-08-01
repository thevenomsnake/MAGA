# V2 Task Lifecycle Smoke

## Purpose

Verify one complete same-project task lifecycle: deterministic creation, an initial blocked result, a follow-up message to the same task, completion with a commit, coordinator integration, and archive.

## Initial Project Lead Smoke

Before dispatching the worker below, the V2 initializer was exercised against an ignored project under this repository's `tmp/` directory:

- `start` created a persistent, named, pinned Project Lead at the exact project root.
- The Codex App listed the task with the expected title and completed first turn.
- The first response used the system locale and asked only what product to build and who would use it.
- A second `start` reused the existing title and project root instead of creating another task.
- In the observed Desktop host, App Server threads inherited the `vscode` source even though the standalone protocol documents `appServer`; recovery therefore accepts `appServer`, `vscode`, or `cli` and still requires exact root and title matches.
- Canary tasks were archived after inspection. No runtime task identifier or machine path was persisted.

## Worker Contract

Create `experiments/task-lifecycle-v2/evidence.md`, but only after the coordinator sends a follow-up message containing:

```text
Public label: <value>
```

The initial prompt deliberately does not contain that value. On the first turn, do not invent it and do not edit files. Return:

```text
Status: needs-decision
Behavior: none
Validation: none
Commit: none
Blocker: Public label is required from the coordinator.
```

After the follow-up arrives, write exactly this durable evidence without any task IDs, usernames, or machine paths:

```markdown
# V2 Task Lifecycle

- Public label: <value>
- Initial contract: received
- Follow-up message: received
- Result: completed in the same Codex task
```

Inspect that single file, commit it, and return the standard five completion fields. Do not create another task or modify any other file.

## Observed Worker Result

- The fresh same-project task first returned `needs-decision` without editing files or inventing the missing label.
- The coordinator sent `Public label: same-task-follow-up-confirmed` to that same task.
- The continued turn created only `evidence.md`, inspected it once, and committed `903e74c`.
- The worker was archived only after this durable result was recorded.
