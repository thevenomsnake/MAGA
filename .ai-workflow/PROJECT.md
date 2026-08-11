---
schema_version: 2
workflow_version: 0.13.0
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

## Current State

MAGA separates likely multi-turn product exploration from the long-lived Project Lead and keeps the existing Ticket delivery lifecycle unchanged. T002 restores `wait-what` as a visible, internationally triggered Skill while preserving automatic communication recovery; the slice is implemented and awaiting its integration record.

## Roles

- [Project Lead](roles/project-lead.md): Owns product decisions, Ticket formation, integration, and the exploration boundary.

## Active Tickets

- [T002 Register automatic Wait What](tickets/T002-register-automatic-wait-what.md): completed, approved.

## Decisions

None.
