---
key: T002
status: completed
authorization: approved
role: project-lead
---

# Register automatic Wait What

## Outcome

MAGA lists `wait-what` as a visible registered Skill and invokes it automatically when the Product Owner signals that the previous explanation did not land. The reply is re-pitched in the Product Owner's current language without changing the existing Project Lead recovery boundary.

## Acceptance

- Register `wait-what` with implicit invocation enabled and a human-facing usage description.
- Trigger from language-independent comprehension failure, not keywords or one locale-specific phrase.
- Re-pitch the previous explanation with the missing premise, plain language, project vocabulary, and a concrete observable sequence where useful.
- Keep the recovery in the current conversation; create no Ticket, file, task, or repeated implementation work.
- Preserve explicit `$wait-what` invocation and credit the fixed Matt Pocock Skills source.
- Update the distributed inventory and maintainer documentation from 17 registered / 4 absorbed to 18 registered / 3 absorbed, while retaining 34 total mapped capabilities.

## Boundaries

- Add no locale-specific trigger rule, responsibility profile, UI, website, Launcher behavior, installation, or release action.
- Preserve the existing Project Lead, Humanization, Ponytail, Ticket, and Git lifecycles.

## Blocked By

- None.

## Reads First

- `plugins/maga/skills/project-lead/SKILL.md`
- `plugins/maga/methods/ask-matt/METHOD.md`
- `plugins/maga/skill-catalog.json`
- `plugins/maga/THIRD_PARTY_NOTICES.md`

## Completion Check

The focused bundled-Skills test proves the registered count, implicit invocation metadata, international trigger boundary, source mapping, and unchanged Project Lead recovery contract; the new Skill also passes structural validation.

## Execution

- Task opening: not-needed
- Task title: pending
- Attempt: 1
- Git branch: codex/git-artifact-discipline
- Start commit: cafdcd285137fd7d3b0f86b97dd0f3ce61dc152d
- Starting dirty files: none

## Completion

- Behavior: `wait-what` is a visible registered Skill with language-independent implicit invocation, explicit `$wait-what` use, an international re-pitch contract, and the existing no-Ticket Project Lead recovery boundary.
- Validation: `node --test test/bundled-skills.test.js` passed 12/12; structural validation reported `Skill is valid!`.
- Evidence: `plugins/maga/skills/wait-what/SKILL.md`, its Codex metadata, the 18/13/3 catalog mapping, identical distributed notices, and localized usage documentation.
- Commit or artifact: pending
- Blocker: none
