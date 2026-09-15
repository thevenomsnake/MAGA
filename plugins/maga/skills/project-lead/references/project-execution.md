# Project Execution

Read when an accepted product outcome needs durable roles, Tickets, dispatch, or integration. Host task-creation restrictions take precedence over general MAGA dispatch guidance; if the host requires an explicit new-task request, keep work here until that requirement is met.

## Run The Native Codex Loop

Use Codex in the ChatGPT desktop app as the only project interface. Do not build or propose a separate chat surface, dashboard, launcher UI, or task panel. The bundled responsibility-settings panel is configuration, not a second project interface. The initializer's App Server bridge may create, name, pin, and apply the configured compute profile to this first Project Lead task, then it exits; all later coordination uses native same-project Codex tasks.

Keep this Project Lead as the only generic pinned entry. Never pre-create empty idea, research, prototype, implementation, or review tasks. Keep quick clarification and already-bounded product choices here. When the Product Owner opens an unresolved discussion, idea, or decision-oriented research branch that is likely to need back-and-forth, use a specifically named pre-Ticket exploration task so rejected paths do not consume the Project Lead's long-lived attention.

For that pre-Ticket branch, read [references/exploration-loop.md](exploration-loop.md) and follow it through return to this Project Lead. The exploration request itself authorizes that one concretely titled exploration task; do not add a second task-creation question. An exploration task never opens another exploration task.

At the start of every project turn, reconcile durable project state with visible Codex tasks before creating anything. Read the confirmed Autonomy Policy and enforce both its subagent and worker limits. After exploration returns an accepted decision, or when approved work already exists, run the entire native loop rather than stopping after delegation or dispatch:

1. Persist the current product outcome, minimum roles, and Ticket contract.
2. Choose `continue`, a bounded native subagent, or `orchestrate-tickets` for an appropriate named manager or worker task according to [the native execution shape](native-codex-loop.md).
3. Wait for the result; continue the same task for in-scope clarification and route only irreducible product judgment to the user.
4. Integrate the result, update project and Ticket state, then archive completed workers.
5. Return to the Product Owner with what is usable, what they can inspect, and the next product decision if one remains.

For Ticket dispatch, recovery, integration, or closure across tasks, read [references/native-codex-loop.md](native-codex-loop.md). Do not apply its worker lifecycle to a pre-Ticket exploration task.

## Orient From Durable State

Read `AGENTS.md`, the current product direction, current state, active decisions, role registry, open Tickets, and `.ai-workflow/design/INDEX.md` when it exists. Reuse existing project documents and naming; do not create a parallel management system.

When onboarding, forming a role, creating a Ticket, completing work, or recovering state, read [references/project-memory.md](project-memory.md) and follow its file contract. Do not load it for a self-contained response that does not change project memory.

Before source changes, branch or worktree operations, portable handoff,
frozen-artifact generation, deployment, or rollback, read
[references/git-and-release.md](git-and-release.md). The session hook's
recorded branch, `HEAD`, and dirty set are the starting boundary; do not replace
that fact with a later clean-looking status.

Maintain these logical records only when the project needs them:

- **Product direction**: user, problem, desired behavior, and current success boundary.
- **Current state**: what is usable now, what is being built, and what is blocked.
- **Role registry**: durable responsibilities, ownership, authority, and context entrypoints.
- **Ticket contracts**: bounded outcomes assigned to roles, with authorization, acceptance, and completion evidence.
- **Project profile**: the Product Owner's current use, exposure, delivery, and system-size selection that governs validation depth.
- **Decision records**: only consequential product choices and hard-to-reverse trade-offs.
- **Archive**: completed history kept out of the active working set.

Keep stable rules separate from current state and completed history. Never use a growing handoff file as the whole project memory.

## Form Roles Lazily

Keep the Project Lead role. Add another role only when at least one boundary is real:

1. It needs a substantially different professional context.
2. It owns a distinct artifact or write boundary.
3. It has different permissions or side effects.
4. Independent acceptance or authority separation matters.

Do not pre-create frontend, backend, QA, research, or design roles from a generic org chart. Research, prototyping, diagnosis, review, minimal implementation, and visual critique are capabilities by default, not permanent jobs.

Use direct execution for a role with one bounded Ticket. Create a durable role-management task only when that role has multiple approved Tickets to coordinate, owns independent long-lived context, or carries distinct permissions. The management task coordinates that role's queue; it is not the role's memory and can be replaced.

Describe each durable role with:

```text
Role: <stable product-language name>
Purpose: <why this responsibility exists>
Owns: <decisions, artifacts, or actions>
Does not own: <explicit boundary>
Reads first: <small durable context entrypoints>
Produces: <result and evidence>
Authority: <allowed side effects and required approvals>
```

Roles persist in the repository. A Codex task is only a replaceable session instance carrying a role for one Ticket.

## Write Product Tickets, Not Coding Orders

Create a Ticket only when work must survive the current conversation or move to another role. Include:

- the user-visible outcome;
- behavior examples or acceptance criteria;
- non-goals and product boundaries;
- the responsible role and blockers;
- durable context pointers;
- one validation requirement shaped by the Product Owner-confirmed Project Profile;
- completion fields for result, evidence, and commit or artifact identity.

Do not require the Product Owner to provide API shapes, file lists, architecture, or test seams. Record those only when an existing contract constrains them or the technical consequence is itself a product decision. Let the responsible engineering role choose local implementation details.

## Use Fresh Sessions Without Losing Roles

Keep the role address stable and replace its session instance when a Ticket changes, the attention workspace has accumulated unrelated history, permissions differ, or recovery from durable state is cheaper than continuing.

Use deterministic titles in the project's language:

```text
Project lead: <project> · <localized "project lead">
Exploration:  <project> · <localized "exploration"> · <concrete decision frontier>
Worker:       <project> · <localized workspace or role> · <ticket-key> <user-visible outcome>
```

Do not persist task IDs, host IDs, machine paths, or worktree locations in tracked project memory. A new session must recover from role and Ticket contracts, not an old transcript.

## Deliver A Product Slice

1. Restate the current product outcome and acceptance boundary in plain language.
2. Reconcile the recorded Git baseline and protect pre-existing dirty paths before any write.
3. Resolve only blocking product decisions; use a prototype when behavior or visual quality must be experienced rather than discussed.
4. Choose the smallest runnable or inspectable vertical slice.
5. Decide which existing role owns it, or create the one new role justified by a real boundary.
6. Persist the Ticket before cross-session execution.
7. Obtain one product-level authorization to execute the work. Natural language such as "research this", "prototype it", "start", "build it", or "continue" is sufficient for the currently described Ticket set. Set `authorization: approved` on exactly those Tickets; do not extend approval to future Tickets or materially expanded outcomes.
8. Keep Project Lead work with no specialist `workspace` in this task. For a short read-only question inside an approved Ticket, use a native subagent when the confirmed `Delegate` policy has capacity. For an approved Ticket with `workspace: research`, `prototype`, `delivery`, `diagnosis`, `review`, or `release`, use a named worker when the outcome needs a durable artifact, source change, commit, independent acceptance, distinct permission, or user-visible follow-up. If the confirmed `Dispatch` policy covers the Ticket and its worker limit has capacity, create the task directly; otherwise ask once for the exact deterministic title. Record `Task opening: standing-policy` or `Task opening: approved`, then apply `orchestrate-tickets`. Do not ask the user to choose a Skill, model, or technical role.
9. After the slice works, run its one risk-matched smoke and commit it before integration, switching context, or starting another slice.
10. Present a runnable preview, inspectable artifact, or concrete behavior plus the focused validation fact and commit identity.
11. Update current state and archive completed Ticket detail. Ask the user for acceptance only where product judgment remains necessary.
12. Release only an explicit commit from a clean tree under explicit or durable standing authorization and the release role's authority boundary. Record the deployment and previous known-good commit.

