# Pre-Ticket Exploration Loop

Use this loop when the Product Owner opens an unresolved product discussion,
idea, or decision-oriented research branch that is likely to require repeated
questions or changing positions. Its purpose is attention isolation: keep
rejected paths, temporary assumptions, and conversational pull away from the
long-lived Project Lead.

## Qualify The Exploration

Route by meaning, not keywords. Open an exploration task when all are true:

- the Product Owner wants to explore rather than execute a settled outcome;
- more than one plausible product direction remains;
- several conversational turns, source checks, or trade-off comparisons are
  likely before the choice is stable.

Keep a quick explanation, one local clarification, a self-contained factual
answer, and an already-bounded deliverable in the current task. If the current
task is already the bounded exploration workspace, continue there. A materially
different question returns to the Project Lead for a new boundary.

## Open One Clean Attention Workspace

Only the canonical Project Lead opens this workspace. A Ticket worker returns a
new product question to the Project Lead instead of branching its own workflow.
Treat the qualifying request as explicit permission for one specifically named
exploration task. Do not ask a second task-creation question. Never create an
empty generic room or a chain of exploration tasks.

1. Name it `<project> · <localized "exploration"> · <concrete decision frontier>`.
2. Reuse an active exact-title match in the saved project. Otherwise create one
   unpinned native Codex task and surface it to the Product Owner.
3. Use the saved `project-lead` responsibility profile for product conversation
   and the saved `research` profile when source-backed external evidence is the
   primary work. Use the host default when MAGA settings cannot be resolved.
4. Pass a thin brief: the decision frontier, why it matters, accepted constraints,
   relevant durable pointers, and the canonical Project Lead title. Leave the
   full transcript, rejected possibilities, implementation plan, task IDs, and
   unrelated source context behind.
5. Navigate to the new task after it has a real task ID. If task tools are
   unavailable, keep the same no-write exploration boundary in the Project Lead
   and report the fallback once.

Use this initial prompt:

```text
Explore this product decision: <decision frontier>

Read AGENTS.md and only these durable pointers: <paths or none>. The accepted
constraints are: <constraints>. The canonical return task is named: <title>.

Keep this task in product exploration. Ask one material question at a time,
state your recommendation and its trade-off, and use primary sources when an
external fact can change the decision. Do not edit local files, create Tickets,
write code, commit, deploy, or create another task. When the Product Owner
accepts a direction, produce and return the decision packet below.
```

## Hold The Decision Frontier

Keep rejected options and provisional reasoning inside this task. Re-read the
accepted constraints before each recommendation. Ask only where a wrong
assumption changes observable behavior, audience, scope, commitment, cost,
permission, privacy, reversibility, or release. Resolve technical and reversible
details internally.

Close only when the Product Owner accepts a direction and the first observable
success boundary is concrete. If they ask to implement before that boundary is
stable, explain the missing decision and continue the exploration. If they
explicitly approve implementation after the boundary is stable, record that
authorization without implementing here.

## Return One Decision Packet

Return exactly this compact packet:

```text
Status: decision-ready | still-exploring
Decision: <accepted product direction or none>
Why: <decisive reasons>
Rejected: <alternatives and load-bearing reasons, or none>
Open: <remaining non-blocking unknowns, or none>
Acceptance: <first observable success boundary or none>
Implementation authorization: approved | pending
```

For `decision-ready`, list current tasks, match the canonical Project Lead title
exactly inside the same saved project, and send the packet there. Navigate the
Product Owner back after delivery. If the match is absent or ambiguous, show the
packet and tell the Product Owner to return to the pinned Project Lead; never
guess a destination.

The Project Lead persists any consequential decision, forms the minimum Ticket
set, and applies the normal named-worker approval and orchestration rules. It
archives the exploration task only after the returned decision is safely
recorded. The exploration transcript never becomes project memory.
