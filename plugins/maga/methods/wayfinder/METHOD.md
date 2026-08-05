---
name: wayfinder
description: Map a genuinely large, foggy effort as dependent decision Tickets until the route to a buildable destination is clear.
---

> **MAGA internal method:** Project Lead reads and executes this file inline.
> It is not a registered Skill; never turn its name into a Skill command.

# Wayfinder

Use Wayfinder only when the destination is meaningful but the route cannot fit
in one coherent attention window. It resolves **decisions**, not deliverables.
A scoped feature that can be clarified with ordinary grilling does not need a
map.

## The Map

The map is a low-resolution index in durable project memory. Reuse the
repository's decision-record location; otherwise write
`.ai-workflow/decisions/<effort>-map.md`. Keep full answers in their linked
Tickets or decision records and only a one-line gist in the map.

```markdown
# <Destination>

## Destination

<What will be clear or buildable when wayfinding is complete.>

## Notes

<Standing boundaries and the small context pointers every decision needs.>

## Decisions So Far

- [<decision title>](<repository-relative path>) — <one-line answer>

## Fog

<In-scope questions visible but not yet precise enough to become Tickets.>

## Out Of Scope

<Boundaries ruled beyond this destination, with a short reason.>
```

The map is an index, not a second source of truth. Refer to decisions by their
names; use Ticket keys only as supporting identity.

## Decision Tickets

Create each resolvable question as a normal MAGA Ticket under
`.ai-workflow/tickets/`, using the Project Memory Contract. Its outcome is the
decision that will become possible, its blockers are other decision Tickets,
and its completion evidence is the answer plus source or product judgment.

Each Ticket has one type:

- **Research** (`workspace: research`, AFK): an external or repository fact is
  missing. Use authoritative sources and return a cited finding.
- **Prototype** (`workspace: prototype`, HITL): behavior or appearance must be
  experienced. Use a cheap artifact and preserve the Product Owner's judgment.
- **Grilling** (Project Lead, HITL): a consequential product decision needs
  discussion. Apply `grilling` with `domain-modeling`; ask one frontier question
  at a time.
- **Task** (AFK or HITL): a bounded action must happen before a decision is
  possible. The agent performs only authorized work it can safely own. A
  human-only step uses Project Lead's manual gate and records no secret value.

Every new Ticket starts with `authorization: pending`. A worker also needs the
Product Owner's approval for its exact deterministic task title. Visibility on
the frontier is not execution authorization.

## Frontier And Fog

The **frontier** is every open decision Ticket whose blockers are integrated.
The **fog** contains questions that are visible but still depend on unresolved
answers and cannot yet be written honestly as Tickets.

Resolve one chosen frontier decision, update the map, and recompute both sets.
Independent approved research may run in parallel; interactive decisions remain
with the Product Owner. Stop charting when the current destination is clear,
not when every hypothetical future branch has been explored.

## Process

1. Name the destination in one sentence and confirm it is too large or uncertain
   for ordinary grilling.
2. Read Project Memory, existing specs, decisions, and relevant repository
   context. Create or update the map without duplicating those sources.
3. Create only the decision Tickets visible now. Record blockers and leave later
   uncertainty in Fog.
4. Present the frontier and recommend the highest-leverage next decision. Obtain
   authorization for the exact Ticket and any named worker before execution.
5. Resolve it with the smallest fitting capability. Put the full answer and
   evidence in its Ticket or linked decision record; mark it integrated only
   after that result is present in project history.
6. Add a one-line context pointer under Decisions So Far, graduate newly visible
   questions from Fog, and repeat.
7. Finish when no material decision blocks a buildable route. Use `to-spec` to
   synthesize the linked decisions when a specification is useful; then use
   `to-tickets` for delivery work.

## External Trackers

Project Memory is the default authority. Mirror a map or Ticket to GitHub,
GitLab, or another tracker only when the project already uses that surface and
the Product Owner explicitly authorizes the external write. Connector or CLI
operations, claiming, comments, labels, links, and closure inherit that
authorization boundary; the upstream method never grants it implicitly.
