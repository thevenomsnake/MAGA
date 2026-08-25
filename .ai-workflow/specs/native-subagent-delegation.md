# Native Subagent Delegation

## Problem And Intended User

The Product Owner wants MAGA to keep moving proactively without opening a
user-visible Codex task for every short-lived investigation. The current
coordination contract has a useful named-worker boundary, but it does not
describe when native subagents are the smaller attention shape.

## Observable Result

The Project Lead chooses the smallest native execution shape at a real phase
boundary. Short, read-only work inside an approved Ticket runs as a bounded
subagent when the host supports it. Work that needs a durable artifact, source
changes, a commit, an independent acceptance boundary, or user follow-up still
runs as a named worker task. Product memory, Ticket authorization, and side
effect gates remain unchanged.

## Behavior Examples

- Given an approved Ticket and a narrow read-only question, when the answer can
  return to the current context, then continue the current task or delegate one
  bounded subagent without creating a user-visible worker task.
- Given an approved Ticket whose outcome requires code, a durable file, a commit,
  independent acceptance, or a distinct permission boundary, when fresh attention
  is useful, then create or reuse the deterministic named worker task under the
  existing `Dispatch` policy.
- Given a request to preserve the parent's transcript while exploring an
  alternative, then use a native thread fork only when the Product Owner has
  explicitly asked for that history-preserving branch.
- Given parallel writers with non-overlapping scopes, then use an isolated
  worktree; otherwise serialize writers in the project checkout.
- Given a portability boundary across a harness, repository, directory, or
  colleague, then use a repository-relative handoff; same-project recovery uses
  durable project memory and deterministic task titles.
- Given a bounded approved objective that should survive turns in one task, then
  use a native Goal with a finite budget; Goal state never authorizes scope,
  permissions, release, or completion.
- Given no confirmed `Delegate` policy or a subagent limit at capacity, then keep
  the work in the current task or return a named worker proposal instead of
  silently widening authority.

## Product Boundaries

- In scope: native subagent routing guidance, a project-scoped `Delegate` policy,
  initializer templates, durable design/spec/Ticket records, and focused contract
  checks.
- Out of scope: a MAGA scheduler, dashboard, daemon, vector memory, host-memory
  synchronization, automatic new Tickets, automatic external actions, or a public
  user-facing subagent control surface.

## Decisions And Constraints

- `Delegate` is separate from `Dispatch`. `Delegate` covers at most two ephemeral,
  read-only subagents inside an already approved Ticket. `Dispatch` continues to
  govern named worker tasks and their active-worker limit.
- A subagent may inspect and reason, but it does not edit project files, commit,
  create another task, approve a request, publish, or expand the Ticket.
- A result that must persist, be integrated, or be independently accepted is a
  named worker outcome even when the native host can technically run it as a
  subagent.
- Runtime task IDs, subagent IDs, host IDs, cursors, transcripts, absolute paths,
  and host Memories remain outside tracked project memory.
- Native Codex tools own runtime task lifecycle. MAGA owns product language,
  authorization, durable context, design records, and side-effect boundaries.
- Existing host compatibility fallbacks remain valid. When a native capability is
  unavailable, MAGA chooses the next safe shape rather than inventing a parallel
  runtime.

## Verification Boundary

Run the focused initializer and bundled-contract smoke once. It must prove that
new projects receive the `Delegate` policy, the Project Lead and orchestration
references describe the execution ladder, and no instruction grants subagents
write or external authority.

## Open Product Questions

None. The Product Owner's "那就做" confirms the bounded default of two read-only
subagents; widening that limit or allowing writes requires a new decision.
