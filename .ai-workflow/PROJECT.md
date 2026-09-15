---
schema_version: 2
workflow_version: 0.16.0
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
- Delegate: approved
- Max active subagents: 2
- Dispatch: approved
- Max active workers: 2
- Scope: approved Tickets in this repository only
- Context: pass repository-relative pointers and bounded summaries; do not copy transcripts.
- Subagent side effects: read-only; no writes, commits, task creation, external actions, or scope expansion.
- Release: proposal-only; external, irreversible, account, payment, migration, and release actions require a fresh decision.
- Change rule: Product Owner approval is required before widening scope, worker limit, or side-effect authority.

## Current State

MAGA 0.16.0 combines bounded proactive task coordination, native read-only subagent delegation, a CodexBridge runtime adapter, durable context packets, accepted design records, and optional thread Goal continuation. T003 through T009 are integrated. The code repository and GitHub release are synchronized; website, npm, and Cloudflare delivery remain outside this release.

## Roles

- [Project Lead](roles/project-lead.md): Owns product decisions, Ticket formation, integration, and the exploration boundary.

## Design

- [Design Index](design/INDEX.md): accepted product and system shape records used during recovery.

## Active Tickets

- [T010: 删除全部模型选择建议并默认继承宿主](tickets/T010-remove-model-recommendations.md) — approved; ready.
- [T011: 使用当前宿主能力置顶任务](tickets/T011-native-task-pinning.md) — approved; ready.
- [T012: 让普通澄清与独立工作并行推进](tickets/T012-native-async-questions.md) — approved; ready.
- [T013: 提供实际桥接版本与能力诊断](tickets/T013-runtime-capability-diagnostics.md) — approved; ready.
- [T014: 精简核心 Skill 并保留已更新的行为](tickets/T014-simplify-core-skill-routing.md) — approved; blocked by T010, T011, T012.

Shared-file writers run serially. Each Ticket carries its own focused verification and Git delivery boundary; implementation has not started.

## Ready Specifications

- [Codex capability compatibility and removal of model recommendations](specs/codex-capability-compatibility.md): ready-for-agent; bounded compatibility changes and complete removal of model-selection recommendations, implementation not started.

## Decisions

- [D002 Native subagent delegation topology](design/records/D002-native-subagent-delegation.md): accepted.
- [D003 Native subagent runtime adapter](design/records/D003-native-subagent-runtime-adapter.md): accepted.
