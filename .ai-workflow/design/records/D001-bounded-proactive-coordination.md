---
schema_version: 1
key: D001
kind: system
status: accepted
title: "Bounded proactive coordination"
---

# Bounded proactive coordination

## Question

How can MAGA create and coordinate fresh Codex tasks without making task
transcripts or host state the project's source of truth?

## Current Shape

The Project Lead may continue current work and dispatch up to two named workers
inside an already approved Ticket. Each worker receives repository-relative
context pointers. The coordinator reconciles existing tasks before creation,
retry, or archive. Product memory remains in `.ai-workflow`; Codex threads are
replaceable attention workspaces.

## Constraints

- New Tickets and expanded outcomes require Product Owner authorization.
- External, account, paid, release, migration, destructive, and irreversible
  actions require a fresh decision.
- Runtime task IDs, host IDs, cursors, machine paths, and transcripts do not enter
  tracked project memory.
- Shared-checkout writers remain serialized because project content stays under
  the repository root.

## Evidence

- `.ai-workflow/specs/proactive-task-dispatch-and-design-memory.md`
- `.ai-workflow/tickets/T003-proactive-task-dispatch.md`
- `research/codex-task-memory-design-audit.md`

## Relationships

- Supersedes: none
- Related Ticket: `.ai-workflow/tickets/T003-proactive-task-dispatch.md`
- Related ADR: none
