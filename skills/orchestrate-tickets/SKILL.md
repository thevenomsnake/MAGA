---
name: orchestrate-tickets
description: Coordinate an approved multi-ticket implementation in Codex by finding unblocked task contracts, creating fresh same-project tasks, sending each task only its ticket pointer, waiting for results, and routing genuine product decisions back to the user. Use when the user asks in natural language to start or continue an approved ticket plan with separate Codex tasks or background sessions. Do not use for an unapproved plan or a single small implementation.
---

# Orchestrate Tickets

Run approved task contracts through fresh Codex project tasks. Keep product decisions visible to the user and keep skill names, Git mechanics, validation tools, and session routing internal unless the user asks.

## Preconditions

Proceed only when all of these are true:

- The user has approved the ticket breakdown and explicitly asked to execute it using separate Codex tasks or sessions. Natural language is sufficient; no skill command is required.
- Every dispatched ticket is a durable task contract with a user-visible outcome, acceptance criteria, blockers, and status.
- The contract is reachable from the worker's starting repository state or from the configured issue tracker.
- Codex task coordination tools are available.

If task tools are unavailable, say that automatic dispatch is unavailable and provide the next ticket pointer. Do not pretend another task was created.

Follow the repository's `AGENTS.md` and narrower ticket instructions. Never persist machine paths, usernames, thread IDs, or secrets in tracked project files.

## Choose The Smallest Execution Shape

1. Implement one small, self-contained ticket in the current task.
2. Use a fresh project task when a ticket needs a distinct attention workspace.
3. Run tickets sequentially by default.
4. Run tickets in parallel only when their blockers are complete, their write scopes do not conflict, and each task has an isolated worktree.

Do not create sessions merely because the plan contains several bullets. Split on attention and ownership boundaries, not ceremony.

## Find The Frontier

Read the ticket index or issue tracker and select tickets that are:

- approved and open;
- not already claimed;
- unblocked because every declared blocker is complete;
- small enough for one fresh context.

Do not load every ticket body. Read the index, then open only the selected ticket and its explicit references. If no ticket is ready, report the blocking product decision, dependency, permission, or external condition.

## Dispatch A Ticket

1. Resolve the current saved Codex project with `codex_app__list_projects`.
2. Create a project task with `codex_app__create_thread`. For a Git repository, use an isolated worktree unless the user explicitly requested the saved checkout.
3. Use the ticket title as the task title.
4. Put the ticket pointer in the initial prompt. Do not copy the planning conversation or sibling tickets into it.
5. Mark the ticket claimed or in progress using its existing tracker convention.

Use this prompt shape:

```text
Implement the task contract at: <repository-relative path or issue URL>

Read the repository AGENTS.md and the contract's explicit references. Do not read
sibling tickets unless this contract links them. Stay inside the approved product
behavior and file boundary. If a product decision or permission is missing, stop and
return the blocker instead of inventing scope.

Produce the shortest runnable vertical slice, perform the one risk-matched validation
required by the contract, and commit the result. Do not introduce TDD, a full regression
run, or additional review stages unless the contract or repository rules require them.

Return: status, behavior delivered, validation fact, commit, and any blocker.
```

The task prompt is a pointer plus execution policy, not a second source of requirements.

## Coordinate Results

- Wait with `codex_app__wait_threads`; use returned cursors so completed output is not processed twice.
- Inspect a result with `codex_app__read_thread` only when its summary is insufficient.
- Send engineering clarifications within the approved scope with `codex_app__send_message_to_thread`.
- Bring product ambiguity, cost, external access, sensitive data, destructive actions, releases, or unverifiable results back to the user.
- Do not repeat a validation that already passed unless integration changed the behavior it covered.

On completion, verify that the task returned a commit and a concrete validation fact. Integrate completed work in dependency order using the repository's established Git workflow, then update the ticket with the commit and result. Release newly unblocked tickets and continue.

Do not call the overall plan complete until all accepted tickets are integrated or explicitly deferred.

## Keep The Product Conversation Clean

Report progress in product language: what behavior is being built, what is ready to try, and what decision is blocked. Do not ask the user to choose skills, testing styles, ticket order, branches, worktrees, or review modes unless one of those choices materially changes product behavior or risk.
