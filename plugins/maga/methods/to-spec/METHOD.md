---
name: to-spec
description: Synthesize closed product decisions into one focused, implementation-neutral specification without restarting the interview.
---

> **MAGA internal method:** Project Lead reads and executes this file inline.
> It is not a registered Skill; never turn its name into a Skill command.

# Synthesize A Product Specification

Turn what is already known from the conversation, repository, prototypes, and
durable decisions into a specification. Do not repeat discovery or ask the user
to approve technical seams, file layout, test tooling, or Ticket mechanics.

If a missing answer materially changes product behavior, experience, cost,
privacy, permissions, irreversible action, or release risk, return that one
decision to the Project Lead. Otherwise choose a reversible default and keep
moving.

## Storage Authority

- In a MAGA project, follow the Project Memory Contract. Reuse an established
  repository spec location when one exists; otherwise write one focused file at
  `.ai-workflow/specs/<outcome-key>.md` and link it from downstream Tickets.
- Do not configure an issue tracker merely to publish the specification.
- Publish to an external tracker only when the project already uses it and the
  current authorization covers that external effect.

## Process

1. Read the current product direction, relevant decisions, prototype evidence,
   existing behavior, domain language, and constraints.
2. Reconcile contradictions. Preserve the newest explicit product decision and
   surface any unresolved material conflict instead of silently choosing sides.
3. Describe observable behavior before implementation. Record a technical
   constraint only when an existing contract requires it or its consequence is
   itself a product decision.
4. For software work, apply registered `bar-tester`. Require the
   Product Owner-confirmed Project Profile before choosing verification; return
   a missing or drifting profile to the Project Lead instead of inferring it.
   Prefer the highest existing seam and external behavior selected by that
   profile; do not make the Product Owner design test mechanics.
5. Write the smallest specification that can guide Ticket formation. A long
   backlog of speculative user stories is not completeness.

Use this shape, omitting empty sections:

```markdown
# <Outcome>

## Problem And Intended User

<Who has what problem, and why it matters now.>

## Observable Result

<What the user can do, see, or verify when this works.>

## Behavior Examples

- Given <context>, when <action>, then <observable result>.

## Product Boundaries

- In scope: <current slice>.
- Out of scope: <explicit non-goal>.

## Decisions And Constraints

- <Closed decision or existing contract that downstream work must preserve.>

## Verification Boundary

<One profile-matched preview, behavior check, artifact, or target surface.>

## Open Product Questions

None, or only questions that genuinely require Product Owner judgment.
```

Avoid specific file paths and code snippets because they decay quickly. A short
prototype-derived state machine, schema, or type shape may be included when it
captures a closed decision more precisely than prose; label its origin and trim
it to the decision-rich part.
