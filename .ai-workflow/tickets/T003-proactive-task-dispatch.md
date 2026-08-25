---
key: T003
status: integrated
authorization: approved
role: project-lead
---

# Automatically dispatch approved Ticket work with durable context

## Outcome

Within an already approved Ticket, MAGA can choose a fresh Codex worker when a
separate attention workspace is useful, provide a bounded repository-relative
context packet, and reconcile existing tasks before creating or retrying one.

## Acceptance

- The Project Lead reads the confirmed Autonomy Policy and may dispatch at most two
  named workers for an approved Ticket without asking for a second title approval.
- A new worker receives pointers to the project index, role, Ticket, linked design
  records, acceptance, and proof; it does not receive runtime IDs or a copied transcript.
- Task reconciliation handles paginated results, duplicate titles, archived candidates,
  and a remote turn that remains active after a local timeout.
- New Ticket creation, expanded outcomes, external effects, irreversible actions,
  accounts, costs, and releases still return to the Product Owner.
- Runtime thread IDs, host IDs, cursors, and machine paths remain outside tracked files.

## Boundaries

- In scope: Project Lead/orchestration instructions, the CodexBridge reconciliation
  seam, the context packet builder, project initialization guidance, and focused tests.
- Out of scope: design record storage, Codex Goal continuation, remote WebSocket,
  permanent daemon, vector memory, website, npm, and external tracker changes.
- Shared-checkout writers remain serialized because project content must stay under
  the repository root.

## Blocked By

- None.

## Reads First

- `.ai-workflow/PROJECT.md`
- `.ai-workflow/specs/proactive-task-dispatch-and-design-memory.md`
- `plugins/maga/skills/project-lead/references/native-codex-loop.md`
- `plugins/maga/skills/project-lead/references/project-memory.md`
- `plugins/maga/skills/orchestrate-tickets/SKILL.md`
- `src/codex-bridge.js`

## Proof

- Break to catch: a duplicate or late Codex task is selected as canonical, or a worker
  prompt omits the approved Ticket boundary and durable context pointers.
- Evidence: focused Node tests using a fake App Server response stream for pagination,
  duplicate/archived candidates, timeout reconciliation, and context packet generation.
- Persistent regression: yes — task duplication and context loss recur at every dispatch.
- Risk delta: permissions/concurrency -> fail closed on unhandled server requests and
  never retry until remote status is reconciled.
- Stop when: the focused tests show one deterministic candidate or an explicit blocked
  result, and the generated worker packet contains only repository-relative pointers.

## Execution

- Task opening: not-needed
- Task title: not-needed
- Attempt: 1
- Git branch: codex/t003-coordinator-context
- Start commit: 281f330
- Starting dirty files: none

## Completion

- Behavior: Project Lead and orchestration instructions now honor the confirmed bounded dispatch policy; CodexBridge reconciles paginated/archived candidates and active timeout state; worker prompts can receive repository-relative context packets without runtime IDs.
- Validation: `node --test test/codex-bridge.test.js test/init-project.test.js` passed 22/22.
- Evidence: `src/codex-bridge.js`, `src/context-packet.js`, generated project autonomy policy, and focused bridge/initializer tests.
- Commit or artifact: c2aad67
- Blocker: none
