---
schema_version: 1
key: D002
kind: system
status: accepted
title: "Native subagent delegation topology"
---

# Native subagent delegation topology

## Question

How should MAGA use Codex's native subagents without turning short-lived work
into user-visible task clutter or weakening project authorization?

## Current Shape

The Project Lead chooses `continue`, bounded read-only `subagent`, named worker
task, explicit `fork`, isolated `worktree`, or portable `handoff` at a phase
boundary. `Delegate` allows at most two ephemeral read-only subagents inside an
already approved Ticket. `Dispatch` remains the authority for named workers.

## Constraints

- Subagents do not write, commit, create tasks, approve requests, publish, or
  expand scope.
- Durable artifacts, source changes, commits, independent acceptance, and distinct
  permissions use named workers.
- `.ai-workflow` remains product memory; native thread state and host Memories are
  replaceable or advisory only.
- New Tickets, expanded outcomes, external effects, and irreversible actions need
  a fresh Product Owner decision.
- Shared-checkout writers remain serialized; worktrees are used only for proven
  non-overlapping parallel writes.

## Evidence

- `.ai-workflow/specs/native-subagent-delegation.md`
- `.ai-workflow/tickets/T007-native-subagent-delegation.md`
- OpenAI Codex configuration reference: `features.multi_agent`, `features.goals`,
  and `features.memories`.

## Relationships

- Supersedes: none
- Related record: `D001-bounded-proactive-coordination`
- Related Ticket: `.ai-workflow/tickets/T007-native-subagent-delegation.md`
