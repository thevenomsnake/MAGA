# Design Record Contract

Use this contract when an accepted product or system shape must survive a task
replacement or a later Project Lead recovery. Create the design directory only
when the first record is needed.

## Layout

```text
.ai-workflow/design/
├── INDEX.md
└── records/
    └── D001-<design-key>.md
```

`INDEX.md` contains the current shape summary and one pointer per record. It is
an index, not a second source of truth. The record owns the detail.

## Record

```markdown
---
schema_version: 1
key: D001
kind: product | system
status: draft | accepted | rejected | superseded
title: "<short design decision>"
---

# <short design decision>

## Question

<The design question this record answers.>

## Current Shape

<The accepted or proposed product flow, state model, module shape, or interface.>

## Constraints

- <Non-negotiable behavior, permission, privacy, or compatibility rule.>

## Evidence

- <Repository-relative Ticket, prototype, research, or validation pointer.>

## Relationships

- Supersedes: none | <repository-relative design record>
- Related Ticket: none | <repository-relative Ticket>
- Related ADR: none | <repository-relative ADR>
```

`status: accepted` requires Product Owner acceptance or an already accepted
durable decision. A draft or rejected record can inform discussion but cannot
authorize implementation. Superseding a record keeps the old file and adds a
new record with a `Supersedes` pointer.

## Recovery

A Project Lead reads `INDEX.md` first, then opens only accepted records relevant
to the current Ticket or product question. It must preserve the record's status,
evidence, and relationships when summarizing it. Do not copy task transcripts,
runtime IDs, machine paths, secrets, or unverified assumptions into a record.
