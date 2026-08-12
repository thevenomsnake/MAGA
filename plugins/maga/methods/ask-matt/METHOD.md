---
name: ask-matt
description: Ask which skill or flow fits your situation. A router over the skills in this repo.
---

> **MAGA internal method:** Project Lead reads and executes this file inline.
> It is not a registered Skill; never turn its name into a Skill command.

In this upstream workflow map, names without a `$` prefix are sibling internal
methods. Before applying one, read `../<name>/METHOD.md`. Names that retain a
`$` prefix are still registered Skills and may be selected normally.

# Ask Matt

Use this map when no narrower route already explains the work.

A **flow** is a path through the skills. Most paths run along one **main flow**, and two **on-ramps** merge onto it. Everything else is standalone, or a vocabulary layer that runs underneath.

## The main flow: idea → ship

The route most work travels. You have an idea and want it built.

1. **`grill-with-docs`** — sharpen the idea by interview. Start here when you **have a codebase**: it's stateful, retaining what it learns in `CONTEXT.md` and ADRs. (No codebase? Use `grill-me` — see Standalone. Both run the same `$grilling` primitive; `grill-with-docs` is the one that leaves a paper trail.)
2. **Branch — can you settle every question in conversation?** If a question needs a runnable answer (state, business logic, or a UI that must be experienced), use **`$prototype`**. Keep it in the Project Lead for a tiny artifact or open an explicitly approved prototype worker for an independent result. Integrate the answer through the current Ticket and durable state rather than manufacturing handoff files.
3. **Branch — is this a multi-session build?**
   - **Yes** → **`to-spec`** (synthesize the closed decisions), then **`to-tickets`** to create tracer-bullet Tickets with explicit blockers in MAGA Project Memory. Run `implement` only for approved Tickets, reusing or opening a specifically approved native worker for each independent outcome.
   - **No** → **`implement`** right here, in the same context window.

   Either way, **`implement`** builds the smallest accepted slice and performs one risk-matched verification before committing. Use **`$tdd`** when the user explicitly requests test-first work or the documented risk requires it. Use independent **`$code-review`** when requested or when a material acceptance boundary justifies the two-axis review.

### Attention boundaries

Keep coupled product reasoning in the Project Lead while it remains coherent.
At a real phase boundary, follow the native Codex loop: continue, use an approved
bounded worker, recover from durable project state, or write a portable handoff
only when context must cross a harness, directory, repository, colleague, or an
isolated mid-phase fork. Do not expose token thresholds or session commands as
choices the Product Owner must manage.

## On-ramps

A starting situation that generates work, then merges onto the main flow.

- **Bugs and requests piling up** → **`triage`**. It moves issues through triage roles and produces agent-ready issues, which **`implement`** later picks up.

  Triage is only for issues **you didn't create** — bug reports, incoming feature requests, anything that arrives raw. Tickets that `to-tickets` produced are already agent-ready, so **don't triage them**.

- **Something's broken** → **`$diagnosing-bugs`**. For the hard ones: the bug that resists a first glance, the intermittent flake, the regression that crept in between two known-good states. It refuses to theorise until it has a **tight feedback loop** — one command that already goes red on *this* bug — then fixes with a regression test. Its post-mortem hands off to **`improve-codebase-architecture`** when the real finding is that there's no good seam to lock the bug down.

- **A huge, foggy effort — a greenfield project or a huge feature build, too big for one session** → **`wayfinder`**, the most cognitively demanding flow here. When the way from here to the destination isn't visible yet, it charts a **shared map** of **decision tickets** in MAGA Project Memory and resolves them one at a time — producing **decisions, not deliverables** — until the fog is pushed back and the way is clear. Publish the map to an external tracker only when the project already uses it and the Product Owner authorizes that write. Where **`grill-with-docs`** sharpens an idea you can hold in one session, wayfinder is for the idea you can't — and it's slower and denser, so save it for exactly that, never a well-scoped feature.

  When the map clears, **it hands off, it doesn't build**: merge onto the main flow at **`to-spec`**, which collapses the map's linked decisions into a buildable plan, then `to-tickets` and `implement` as usual. Looping the map straight into `implement` skips that collapse and throws the linked detail away — go straight to `implement` only when the effort turned out genuinely small.

## Codebase health

Not feature work — upkeep.

- **`improve-codebase-architecture`** — run when the user asks for an architecture audit or diagnosis identifies a concrete missing seam. It surfaces **deepening opportunities**; an accepted candidate becomes an idea for the main flow at `grill-with-docs`. It is not opportunistic cleanup.

## Vocabulary underneath

Two model-invoked references that run *beneath* the other skills — each the single source of truth for its vocabulary. Reach for them directly when the **words**, not the process, are the problem; or let the skills above pull them in.

- **`$domain-modeling`** — sharpen the project's *domain* language: challenge a fuzzy term, resolve an overloaded word ("account" doing three jobs), record a hard-to-reverse decision as an ADR. It's the active discipline `grill-with-docs` drives to keep `CONTEXT.md` a clean glossary.
- **`$codebase-design`** — the deep-module vocabulary (module, interface, depth, seam, adapter, leverage, locality) for designing a module's *shape*: a lot of behaviour behind a small interface at a clean seam. `$tdd` and `improve-codebase-architecture` both speak it.

## Crossing boundaries

- **`handoff`** — narrow portability method for another harness, repository,
  directory, colleague, or isolated mid-phase fork. Same-project Codex work
  recovers from committed project memory and deterministic task titles.
- **Native worker** — the default for an approved independent research,
  prototype, delivery, diagnosis, review, or release outcome. The Product Owner
  approves its concrete title; Project Lead integrates and archives it.

## Standalone

Off the main flow entirely.

- **`grill-me`** — the same relentless interview as `grill-with-docs`, but for when you have **no codebase**. Stateless: it saves nothing locally, builds no `CONTEXT.md`. Reach for it to sharpen any plan or design that doesn't live in a repo.
- **`$prototype`** — a small, throwaway artifact that answers one design question: does this state model feel right, or what should this UI look like. Keep the answer in the Ticket; retain the runnable artifact only when it remains useful evidence. It's the detour in step 2 of the main flow, but reach for it any time a design question is hard to settle on paper.
- **`$research`** — delegate reading legwork to a **background agent**: it investigates a question against **primary sources**, then leaves a cited Markdown file in the repo. Keep working while it reads. The file it produces is something to take *into* the main flow at `grill-with-docs` — research feeds the thinking, it doesn't replace it.
- **`to-questionnaire`** — when a decision depends on knowledge held by one
  external stakeholder, draft a role-based repository-local questionnaire.
  Sending it remains a separate authorized external action.
- **`teach`** — learn a concept over multiple sessions, using the current directory as a stateful workspace.
- **`$writing-for-agents`** — reference for Skills, `AGENTS.md`, `CLAUDE.md`,
  and documents reached through agent context pointers.
- **`$wait-what`** — automatically re-pitch an explanation that did not land;
  it may also be invoked explicitly at any point in another flow.

Project Lead applies registered `$wait-what` for communication recovery and
absorbs the remaining human-only gate as safe staged guidance for authenticated
or irreversible steps without Bash or secret capture.

## Precondition

**`setup-matt-pocock-skills`** is an upstream precondition, not a MAGA one. Run
it only when the Product Owner explicitly wants to configure an external tracker
or adopt the upstream document layout. A project with `.ai-workflow/PROJECT.md`
already has its native authority and does not need setup before engineering work.
