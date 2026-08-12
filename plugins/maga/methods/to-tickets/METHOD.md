---
name: to-tickets
description: Turn an accepted product outcome or specification into the fewest durable tracer-bullet Tickets with explicit blockers and authorization.
---

> **MAGA internal method:** Project Lead reads and executes this file inline.
> It is not a registered Skill; never turn its name into a Skill command.

# Form Product Tickets

Create the fewest durable work contracts needed to deliver the accepted
outcome. Tickets are product slices, not a layer-by-layer engineering plan and
not a checklist for keeping agents busy.

## Authority

In a MAGA project, read and follow
[the Project Memory Contract](../../skills/project-lead/references/project-memory.md).
Its `.ai-workflow/tickets/` records remain the execution and authorization
authority even when the project also mirrors work to an external tracker. Do
not configure or publish to an external tracker unless it is already part of
the project or the user explicitly authorized that external effect.

## Ticket Rules

- Each Ticket delivers one narrow, observable end-to-end behavior and fits in
  one focused context window.
- Prefer one Ticket when one coherent slice can be built and checked safely.
- Add another Ticket only for a real dependency, independent product outcome,
  permission boundary, write conflict, or context boundary.
- Record explicit blocking edges. A Ticket is executable only after all blockers
  are `integrated`, not merely implemented.
- Keep implementation choices with the responsible role. File lists, framework
  choices, and speculative test seams do not belong in product acceptance.
- Apply registered `bar-tester` and give every Ticket either its one-line
  Completion Check or the smallest structured Proof selected by the current
  Project Profile. Never write both.

For a wide mechanical refactor that cannot land as a green vertical slice, use
the minimum expand–migrate–contract sequence: add the compatible new form,
migrate callers in independently safe batches only when necessary, then remove
the old form after every migration blocker integrates.

## Process

1. Read the accepted outcome, current state, relevant spec, decisions, and any
   existing Tickets. Reuse the project's domain language.
2. Draft the minimum tracer-bullet set and its dependency graph. Do not create
   separate frontend, backend, database, testing, and review Tickets for one
   behavior.
3. For software work, confirm that `PROJECT.md` contains the Product Owner's
   current use, exposure, delivery, and system-size selection. If it is missing
   or the requested outcome crosses it, return to the Project Lead for the
   compact selection question before writing Tickets.
4. Resolve Ticket mechanics internally. Ask the Product Owner only if the split
   exposes a material product trade-off, changes what will be delivered, or
   changes cost, permissions, privacy, irreversible action, or release risk.
   Prior natural-language authorization for the clearly described outcome is
   sufficient; do not add a ceremonial breakdown approval.
5. Allocate the next `T###` keys and write one Project Memory Ticket file per
   slice. Link the source specification and durable decisions under `Reads
   First`; list blocker keys under `Blocked By`.
6. Set `authorization: approved` only for Tickets clearly covered by current
   user authorization. New, expanded, derived, future, or deferred work starts
   as `pending`.
7. Update `PROJECT.md` with the active Ticket set. If an external tracker is
   authorized, mirror the same outcome and dependencies there and retain its
   URL as a pointer; never replace the local authorization record with a remote
   label.
8. Expose the frontier to orchestration: approved, `ready`, unclaimed Tickets
   whose blockers are all `integrated`. Do not start pending or blocked work.

Use the Ticket shape from the Project Memory Contract without inventing a
second local template. A prototype-derived state machine or schema may be linked
or quoted only when it captures a closed behavior decision more precisely than
prose.
