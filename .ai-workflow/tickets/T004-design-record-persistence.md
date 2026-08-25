---
key: T004
status: ready
authorization: approved
role: project-lead
---

# Persist accepted design decisions for Project Lead recovery

## Outcome

MAGA projects can create a repository-local design index and typed `D###` design
records lazily. A new Project Lead can discover accepted product or system design
decisions without replaying the source task transcript.

## Acceptance

- No design directory is generated for a project that has no design record.
- The first record creates `.ai-workflow/design/INDEX.md` and
  `.ai-workflow/design/records/` with LF text and repository-relative links.
- A design record has a stable `D###` key, kind, lifecycle status, question,
  current shape, constraints, evidence, and supersedes/related pointers.
- Draft, rejected, and superseded records are discoverable but are not presented
  as accepted decisions.
- Rewriting the same key is deterministic and does not duplicate its index entry.
- Runtime task IDs, host IDs, machine paths, secrets, and full transcripts never
  enter the design index or record template.

## Boundaries

- In scope: design record schema, lazy writer/index helper, Project Memory contract,
  Project Lead recovery pointers, and focused tests.
- Out of scope: vector memory, automatic summarization, design UI, Figma/MCP
  integration, visual asset storage, ADR replacement, and automatic acceptance of
  Product Owner decisions.

## Blocked By

- T003 — Automatically dispatch approved Ticket work with durable context (integrated).

## Reads First

- `.ai-workflow/PROJECT.md`
- `.ai-workflow/specs/proactive-task-dispatch-and-design-memory.md`
- `plugins/maga/skills/project-lead/references/project-memory.md`
- `plugins/maga/skills/project-lead/references/native-codex-loop.md`
- `plugins/maga/skills/domain-modeling/SKILL.md`

## Proof

- Break to catch: a new Project Lead cannot find an accepted design decision, or a
  draft/rejected record is treated as authoritative.
- Evidence: focused Node tests create a temporary project, write one record, reload
  the index, rewrite the same key, and verify status/pointer behavior.
- Persistent regression: yes — design drift and duplicate index entries recur across
  task replacement and recovery.
- Risk delta: permissions/concurrency -> writes stay inside the project root and
  same-key updates are deterministic.
- Stop when: the helper produces the expected LF files, one index entry per key, and
  accepted-only recovery output.

## Execution

- Task opening: not-needed
- Task title: not-needed
- Attempt: 1
- Git branch: codex/t004-design-memory
- Start commit: e46af52
- Starting dirty files: none

## Completion

- Behavior: pending
- Validation: pending
- Evidence: pending
- Commit or artifact: pending
- Blocker: none
