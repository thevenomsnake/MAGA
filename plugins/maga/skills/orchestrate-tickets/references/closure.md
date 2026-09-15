# Observe, Integrate, And Recover

Read while a worker is active or when it returns a result.

## Observe And Steer

- Wait with `codex_app__wait_threads`; reuse returned cursors so output is not processed twice.
- Inspect with `codex_app__read_thread` only when the returned summary is insufficient.
- Continue the same task with `codex_app__send_message_to_thread` when a clarification can unblock it inside the approved scope. Do not replace a healthy task just to send another message.
- Persist a product decision in the ticket or its referenced decision record before sending the worker a concise follow-up.
- Route product ambiguity, cost, external access, sensitive data, destructive actions, releases, or unverifiable results to the user.
- Do not repeat validation that already passed unless integration changed the behavior it covered.

## Complete, Integrate, And Archive

When a worker reports `completed`:

1. Require a resolvable commit, its explicit branch, a concrete validation fact, and no uncommitted Ticket changes left in the worker checkout. Otherwise continue the same task for correction.
2. Set the ticket to `completed` and record the worker commit and validation.
3. Integrate the commit in dependency order using the repository's established Git workflow. Preserve unrelated dirty paths before any switch or synchronization. A worker using the target checkout may already have committed directly to the target branch; verify that identity instead of cherry-picking it again.
4. Set the ticket to `integrated` only after integration succeeds. Release newly unblocked tickets at that point.
5. Archive the worker with `codex_app__set_thread_archived` after the durable record is complete.

Do not call the overall plan complete until every accepted ticket is integrated or explicitly deferred.

## Handle Failure And Replacement

Prefer continuing the existing worker when a focused follow-up can fix the problem. Create a replacement only when the original context or worktree is unusable.

Before replacement, record the failed attempt, treat the old worker as superseded, increment `Attempt`, and propose the retry title. A replacement is another new task and requires explicit Product Owner approval. After approval, archive the old worker and create the replacement with the original ticket pointer plus only the durable failure fact needed to avoid repetition; it does not receive the old transcript.

