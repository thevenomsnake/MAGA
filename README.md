<h1 align="center">MAGA</h1>

<p align="center"><strong>Make Apps Great Again</strong></p>

<p align="center">Build the software you have in mind.</p>

<p align="center">
  For product designers, product leaders, and first-time builders.<br>
  You make the product decisions. MAGA turns them into working, inspectable software.
</p>

<p align="center">
  <strong>English</strong> ·
  <a href="./README.zh-CN.md">简体中文</a> ·
  <a href="./README.ja.md">日本語</a> ·
  <a href="./README.ko.md">한국어</a> ·
  <a href="./README.es.md">Español</a>
</p>

MAGA is a product-building plugin and on-ramp to Codex in the ChatGPT desktop app. You describe the user, problem, experience, constraints, and trade-offs in product language. A persistent Project Lead selects the right methods and coordinates research, prototyping, implementation, validation, and repair while you learn the practices behind that work.

You do not need to understand code, choose Skills, manage engineering sessions, or review code. You accept the product by inspecting its behavior, experience, and business result.

> [!NOTE]
> MAGA is not a visual no-code builder. The product still has code. Codex owns that implementation layer; you retain product intent, priorities, constraints, and acceptance.

## Start here

No terminal experience is required. If you have never used Codex before, follow the **[complete beginner guide](./docs/getting-started.md)** from installing the desktop app through accepting your first working result.

1. Open the [ChatGPT desktop app](https://learn.chatgpt.com/docs/quickstart?setup=app), sign in, and choose **Codex**.
2. Create or open an empty local project folder.
3. Paste this message into Codex:

> Set up this project with the MAGA plugin from https://github.com/thevenomsnake/MAGA. Check and install any missing prerequisites, initialize MAGA in this folder, verify that it works, and tell me when to start a new chat. Perform the technical steps yourself and ask me only for approvals that are actually required.

Read each approval request and allow it only when it refers to this folder, GitHub, or a prerequisite Codex has just explained. You do not need to copy commands into a terminal.

When Codex confirms the setup is complete, start a **new chat in the same project** and describe the product:

> Use MAGA as my Project Lead. I want a tool that helps independent designers organize client feedback. Feedback should stay attached to a project, and I need to see which issues are blocking delivery. I do not know code, so keep questions in product language and give me working results I can inspect.

That is enough to begin. MAGA identifies the first useful outcome and asks only questions that can change the product direction or permission boundary.

## Why MAGA

### Why a plugin instead of a wrapper app?

Codex already performs difficult engineering work. It can inspect repositories, write and modify code, run checks, review changes, work across project chats, and apply reusable Skills. OpenAI's own guidance describes the same progression: give Codex durable context, encode repeatable work as Skills, and package stable capabilities as plugins. See the official [Codex best practices](https://learn.chatgpt.com/guides/best-practices), [Skills documentation](https://learn.chatgpt.com/docs/build-skills), and [plugin documentation](https://developers.openai.com/plugins/).

The name Codex makes its center of gravity clear: code. Its default vocabulary and extension model are easiest to operate when someone can frame work as engineering and inspect technical output.

Product people are often dismissed as "non-technical people who just tell engineers what to do." Fine. MAGA is the plugin that lets them do exactly that without restraint: they set the product goals and trade-offs; Codex handles the code.

> **Direct without restraint. Accept with judgment.**

You do not need another application between you and Codex. The company building both the model and the client is best positioned to keep them aligned, much as Apple can tune its chips and operating systems together: the product roadmap, capability boundaries, interface, and release cycle move as one. Codex will keep evolving. An independent wrapper must chase every new capability, interaction, and permission model; a plugin stays inside the native product, adds only the missing product practices, and can be uninstalled when you no longer need it.

MAGA is deliberately an on-ramp, not a permanent layer. It starts with language and decisions that product people already understand, then makes the underlying practices visible: framing outcomes, gathering evidence, setting constraints, managing trade-offs, and accepting working software. The intended end state is greater autonomy, not permanent dependence. If you eventually need less of MAGA—or none at all—because you can work with Codex directly, the plugin has done its job.

MAGA exists because model capability and product collaboration are different problems.

A conventional Skill usually makes one recurring job reliable. A collection of Skills still often assumes that the operator knows which job comes next, how to sequence technical workflows, what context each task needs, and how to judge a code diff.

MAGA adds an operating model above those capabilities:

- One product-facing Project Lead receives ordinary product language.
- Intent-based routing chooses Skills and methods from the current evidence.
- Durable project state preserves decisions, boundaries, roles, and approved work.
- Product acceptance replaces code review as the Product Owner's interface.

<p align="center">
  <img src="./assets/maga-operating-model.svg" alt="Behavior comparison between Traditional Skills and MAGA across entry, orchestration, technical work, acceptance, and continuity" width="100%">
</p>

## Who it is for

| You are | What you bring | What MAGA handles |
| --- | --- | --- |
| A first-time software builder | The problem, intended user, and basic expectation | Necessary clarification and the path to an inspectable result |
| A product designer | Experience standards, information structure, and interaction trade-offs | Research, prototyping, implementation, and validation methods |
| A product owner or manager | Goals, priorities, risks, resources, and decision boundaries | Persistent context, execution coordination, and escalation of real decisions |

If you already lead a product line or a cross-functional team, MAGA is often easier to use. You already have its most valuable inputs: goals, priorities, experience standards, risk judgment, and authority boundaries. MAGA does not require you to add programming expertise to that role.

## The working contract

| You do not need to | You still decide |
| --- | --- |
| Write, read, or review code | Which user and problem the product serves |
| Choose internal Skills or engineering workflows | Which experience and business constraints cannot be traded away |
| Split Tickets, name tasks, or manage sessions | Priority and acceptable trade-offs |
| Select test frameworks or implementation architecture | Whether the working result solves the product problem |

Code review, testing, debugging, and technical validation still happen. They become engineering evidence managed by the Project Lead, rather than a second profession imposed on the Product Owner.

## What happens after you describe a product

1. **Align the outcome.** MAGA identifies the user, problem, first observable value, delivery form, and material constraints.
2. **Choose the next evidence.** The Project Lead decides whether the product needs clarification, research, a prototype, implementation, validation, or diagnosis.
3. **Build the smallest inspectable slice.** Codex handles implementation choices and produces something you can run, view, or verify.
4. **Check the engineering work.** Tests, targeted review, and diagnostics establish whether the result is technically sound.
5. **Return to product judgment.** You evaluate behavior and experience, then describe the next decision in product language.

For example:

```text
This still feels like a task manager. I want the weekly changes to be visible first,
then let me trace a change to its owner.
```

That feedback changes the information architecture and the next delivery step. You do not need to name a component or point to a line of code.

## What MAGA keeps track of

1. **Intent:** user, problem, expected outcome, and constraints.
2. **Routing:** whether the next step is clarification, research, design, implementation, validation, or repair.
3. **State:** accepted decisions, open questions, active work, and the next useful result.
4. **Authority:** which actions are approved and which require a new decision.
5. **Evidence:** prototypes, working behavior, tests, diagnostics, and product acceptance.

This information lives in the project. A new chat can recover from durable state instead of treating the transcript as the product record.

## Product and permission boundaries

MAGA can advance authorized work without turning one natural-language request into unlimited permission.

- Reversible work inside the named project and risk-matched checks are normal execution.
- Publishing, payment, account actions, external messages, and irreversible deletion require explicit authority.
- Product trade-offs that cannot be inferred from existing decisions return to the Product Owner.
- Codex in the ChatGPT desktop app remains the user interface; MAGA does not create a parallel dashboard.

## What is inside

The current release is **v0.9.0**. It contains 15 registered Skills and an internal method library loaded only when needed.

| Layer | Responsibility |
| --- | --- |
| Project Lead | Receives product language, maintains state, selects methods, and coordinates tasks |
| Product discovery | Clarification, research, domain language, concepts, and prioritization |
| Design and delivery | Planning, prototyping, implementation, validation, and completion |
| Diagnosis and simplification | Debugging, code review, and removal of unnecessary complexity |
| Method library | Upstream workflows loaded on demand instead of occupying every conversation |

Explore the implementation: [Skill catalog](./plugins/maga/skill-catalog.json) · [Project Lead](./plugins/maga/skills/project-lead/SKILL.md) · [Product-oriented Project Lead](./playbooks/product-oriented-project-lead.md)

<details>
<summary><strong>Routing, tasks, and authorization</strong></summary>

### Routing

The Project Lead first identifies the type of evidence needed, then selects a registered Skill or an internal method. Users can explicitly invoke a Skill, but normal product work does not require it.

### Task boundaries

Work stays in the current task by default. MAGA creates a separate task only for a concrete object that benefits from parallel work, isolated context, a distinct permission boundary, or independent acceptance. It does not pre-create empty research, prototype, implementation, or review rooms.

### Authorization

Natural-language approval applies to the clearly described product slice. It does not automatically authorize later Tickets or materially expanded outcomes.

Read more: [Capability routing](./plugins/maga/skills/project-lead/references/capability-routing.md) · [Native Codex loop](./plugins/maga/skills/project-lead/references/native-codex-loop.md) · [Project memory](./plugins/maga/skills/project-lead/references/project-memory.md)

</details>

<details>
<summary><strong>Installation behavior</strong></summary>

`install` adds or updates the MAGA marketplace and installs `maga@maga`.

`init` accepts an empty directory and then:

1. Installs the plugin.
2. Writes `.ai-workflow/PROJECT.md`, `AGENTS.md`, and `.gitignore`.
3. Initializes Git and creates an initial commit when an identity is configured.
4. Creates or reuses one clearly named Project Lead task.
5. Opens the project in the ChatGPT desktop app with Codex.

`start` reads existing project state and restores the Project Lead without rewriting project files. These details are for maintainers; normal users can ask Codex to perform setup, recovery, or removal.

</details>

## Upstream work and licenses

MAGA adapts mature methods at fixed revisions:

- [mattpocock/skills](https://github.com/mattpocock/skills): workflow material from 22 formal Engineering and Productivity Skills, fixed at `2ab9580`.
- [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail): minimal implementation, complexity review, and lifecycle hooks, fixed at `16f2980`.

MAGA's routing, project state, installer, and Project Lead contract are local adaptations. Sources, modifications, and licenses are recorded in [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md).

## Research and playbooks

- [Research index](./research/README.md)
- [Product-oriented Project Lead](./playbooks/product-oriented-project-lead.md)
- [Multi-session collaboration](./playbooks/multi-session-collaboration.md)
- [Native Codex Ticket orchestration](./playbooks/codex-ticket-orchestration.md)
- [AI-slop research](./research/kill-ai-slop.md)

## License

MAGA is released under the [MIT License](./LICENSE). Third-party materials remain under their respective licenses; see [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md).
