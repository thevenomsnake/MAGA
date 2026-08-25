---
schema_version: 1
key: D003
kind: system
status: accepted
title: "Native subagent runtime adapter"
---

# Native subagent runtime adapter

## Question

How can MAGA make its bounded subagent routing contract executable without
duplicating Codex's native multi-agent runtime?

## Current Shape

`CodexBridge` is the adapter seam. It opts into the app-server experimental
capability, sends `turn/start.collaborationMode` with a read-only sandbox and a
finite admission limit, and reconciles child threads by native source and
`parentThreadId`. Unsupported hosts and models return a safe fallback.

## Constraints

- No direct `agent/start` RPC, scheduler, daemon, telemetry service, or dashboard.
- Subagents are read-only and cannot approve, publish, commit, create tasks, or
  expand a Ticket.
- `.ai-workflow` remains the durable authority; runtime lineage stays in memory.
- The limit is capped at two and is checked before delegation.
- Existing Goal, Dispatch, worktree, handoff, privacy, and release gates remain
  unchanged.

## Evidence

- `.ai-workflow/specs/native-subagent-runtime-adapter.md`
- `.ai-workflow/design/records/D002-native-subagent-delegation.md`
- OpenAI Codex App Server documentation: `turn/start.collaborationMode`,
  `model/list.multiAgentVersion`, and subagent thread lineage.
- https://learn.chatgpt.com/docs/app-server

## Relationships

- Supersedes: none
- Related record: `D002-native-subagent-delegation`
- Related Ticket: `.ai-workflow/tickets/T008-native-subagent-runtime-adapter.md`
