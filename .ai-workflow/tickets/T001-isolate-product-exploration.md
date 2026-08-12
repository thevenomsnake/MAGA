---
key: T001
status: integrated
authorization: approved
role: project-lead
---

# Isolate open-ended product exploration

## Outcome

When the Product Owner starts an unresolved product discussion, idea exploration, or decision-oriented research, MAGA opens one specifically named exploration task. That task carries the back-and-forth, then returns the accepted decision to the original Project Lead, which forms Tickets and resumes the existing delivery workflow.

## Acceptance

- Route from semantic intent, not a keyword match; keep quick explanations and already-bounded requests in their current task.
- Give the exploration task only the decision frontier and durable constraints, not the full transcript or implementation plan.
- Keep Tickets, source edits, commits, and delivery dispatch out of exploration until the Product Owner accepts a decision.
- Never recursively open another exploration task from an exploration task.
- Return the decision, reasons, rejected alternatives, remaining unknowns, acceptance boundary, and implementation authorization to the canonical Project Lead.
- Let the Project Lead create the minimum Ticket set and use the existing implementation lifecycle.

## Boundaries

- Add no registered Skill, responsibility profile, custom UI, launcher behavior, or website change.
- Preserve existing Ticket authorization, named-task approval, Git, validation, integration, and archive rules.
- Keep task identifiers and machine paths out of tracked project memory.

## Blocked By

- None.

## Reads First

- `plugins/maga/skills/project-lead/SKILL.md`
- `plugins/maga/skills/project-lead/references/capability-routing.md`
- `plugins/maga/skills/project-lead/references/native-codex-loop.md`
- `src/init-project.js`

## Completion Check

The focused initializer test proves that new projects receive the exploration boundary, and the Project Lead Skill passes structural validation.

## Execution

- Task opening: not-needed
- Task title: pending
- Attempt: 1
- Git branch: codex/git-artifact-discipline
- Start commit: 2fc6ac43c5ab6115b77b7a77ebe8004b493d2f86
- Starting dirty files: none

## Completion

- Behavior: Open-ended product exploration uses a clean, specifically named pre-Ticket task, returns one accepted decision packet to the canonical Project Lead, and leaves implementation on the existing Ticket worker lifecycle.
- Validation: `node --test test/init-project.test.js` passed 9/9; Project Lead structural validation reported `Skill is valid!`.
- Evidence: `plugins/maga/skills/project-lead/references/exploration-loop.md` and the generated project contract in `src/init-project.js`.
- Commit or artifact: `d5c19c67ddc8cd71c5661cfeb6797b29807d5de3`
- Blocker: none
