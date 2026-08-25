---
schema_version: 2
workflow_version: 0.14.1
status: active
project_name: "MAGA"
---

# MAGA

## Product Direction

- Intended user: Product designers who direct Codex through product language.
- Problem: Open-ended discussion can fill the long-lived Project Lead with rejected paths and weaken later decisions.
- First value: A product exploration gets its own native Codex task and returns one accepted decision to the Project Lead before delivery begins.
- Delivery: MAGA's Project Lead lifecycle and newly initialized project contract.
- Boundaries: Plugin behavior only; no launcher, website, external installation, or release changes.

## Project Profile

- Current use: public
- Exposure: internet
- Delivery: public-release
- System size: medium
- Risk modifiers: permissions | concurrency
- Selection: Product Owner confirmed
- Change rule: Product Owner will report a material profile change before the next implementation or release.

## Autonomy Policy

- Continue: approved within the current Ticket or Goal boundary.
- Dispatch: approved for up to two named workers inside an already approved Ticket.
- Context: pass repository-relative pointers and bounded summaries; do not copy transcripts.
- Release: proposal-only; external, irreversible, account, payment, migration, and release actions require a fresh decision.
- Change rule: Product Owner approval is required before widening scope, worker limit, or side-effect authority.

## Current State

MAGA separates likely multi-turn product exploration from the long-lived Project Lead and keeps the existing Ticket delivery lifecycle unchanged. `wait-what` is now a visible, internationally triggered Skill with automatic communication recovery. The Product Owner has confirmed bounded automatic dispatch for up to two workers within approved Tickets; T003 and T004 are integrated. The current project shape is recorded in accepted design record D001, and T005 adds bounded thread Goal continuation.

## Roles

- [Project Lead](roles/project-lead.md): Owns product decisions, Ticket formation, integration, and the exploration boundary.

## Design

- [Design Index](design/INDEX.md): accepted product and system shape records used during recovery.

## Active Tickets

- [T005](tickets/T005-thread-goal-continuation.md): ready, authorization approved

## Decisions

None.
