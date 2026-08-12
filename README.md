<h1 align="center">MAGA</h1>

<p align="center">
  <strong>Make Apps Great Again</strong><br>
  Build the software you have in mind—without turning product work into a second career in engineering.<br>
  You make the product decisions. MAGA turns them into working, inspectable software.
</p>

<p align="center">
  <a href="https://maga.sumimi.jp/"><strong>Website</strong></a> ·
  <a href="./docs/getting-started.md"><strong>Get started</strong></a> ·
  <a href="#how-maga-works"><strong>How it works</strong></a> ·
  <a href="./LICENSE">MIT License</a>
</p>

<p align="center">
  <strong>English</strong> ·
  <a href="./README.zh-CN.md">简体中文</a> ·
  <a href="./README.ja.md">日本語</a> ·
  <a href="./README.ko.md">한국어</a> ·
  <a href="./README.es.md">Español</a>
</p>

<p align="center">
  <a href="https://maga.sumimi.jp/">
    <img src="./website/design/hero-concept.png" alt="MAGA website showing the product-owner workflow from decision to acceptance" width="100%">
  </a>
</p>

MAGA is a product-building plugin and on-ramp to Codex in the ChatGPT desktop app. It gives a project one product-facing Project Lead that turns ordinary product language into the next useful piece of evidence: research, a prototype, a working slice, a diagnosis, or an independent review.

You describe the user, problem, experience, constraints, and trade-offs. MAGA chooses the internal methods, keeps decisions in the project, coordinates bounded Codex tasks when needed, and returns working results for product acceptance. You do not need to choose Skills, manage engineering tasks, or review code.

> [!NOTE]
> MAGA is not a visual no-code builder. The product still has code. Codex owns that implementation layer; you retain product intent, priorities, constraints, and acceptance.

## Start in two stages

No terminal experience is required. If you have never used Codex before, follow the **[complete beginner guide](./docs/getting-started.md)** from installing the desktop app through accepting your first working result.

### 1. Set up MAGA

1. Open the [ChatGPT desktop app](https://learn.chatgpt.com/docs/quickstart?setup=app), sign in, and choose **Codex**.
2. Create or open an empty local project folder.
3. Paste this message into Codex:

> Set up this project with the MAGA plugin from https://github.com/thevenomsnake/MAGA. Check and install any missing prerequisites, initialize or restore MAGA in this folder, create or restore its named Project Lead task, verify that it works, and tell me the exact Project Lead task to open when it is ready. Perform the technical steps yourself and ask me only for approvals that are actually required.

Read each approval request. Allow setup only for this folder, downloading the specified MAGA repository into this project or the Codex plugin area, or a prerequisite Codex has just explained. GitHub sign-in, account or repository settings, pushes, and Issue or Pull Request writes are not part of setup. You do not need to copy commands into a terminal.

### 2. Start the product

When Codex confirms the setup is complete, open the named, pinned **Project Lead task** that MAGA created or restored for this project. Do not create an arbitrary task in its place. Describe the product there:

> Use MAGA as my Project Lead. I want a tool that helps independent designers organize client feedback. Feedback should stay attached to a project, and I need to see which issues are blocking delivery. I do not know code, so keep questions in product language and give me working results I can inspect.

That client-feedback tool is another product-description example; the small interest-community app later in this README is the canonical example used to explain MAGA's seven responsibilities.

That is enough to begin. MAGA identifies the first useful outcome and asks only questions that can change the product direction or permission boundary.

## How MAGA works

1. **You define the product outcome.** Describe the user, problem, experience, priorities, and limits in product language.
2. **The Project Lead chooses the next evidence.** MAGA decides whether the work needs clarification, research, a prototype, implementation, diagnosis, or review.
3. **Codex builds the smallest inspectable slice.** Engineering choices and risk-matched checks stay behind the product interface.
4. **You accept the result.** Inspect the behavior and experience, then accept it, adjust it, or set the next direction.

Product direction, active decisions, authority, Tickets, and evidence live in versionable project state. A restored Project Lead task can recover from that state instead of treating one long task transcript as the product record.

<p align="center">
  <img src="./assets/maga-operating-model.svg" alt="Behavior comparison between traditional Skills and MAGA across entry, orchestration, technical work, acceptance, and continuity" width="100%">
</p>

## Why MAGA

### Why a plugin instead of a wrapper app?

Codex already performs difficult engineering work. It can inspect repositories, write and modify code, run checks, review changes, work across project tasks, and apply reusable Skills. OpenAI's own guidance describes the same progression: give Codex durable context, encode repeatable work as Skills, and package stable capabilities as plugins. See the official [Codex best practices](https://learn.chatgpt.com/guides/best-practices), [Skills documentation](https://learn.chatgpt.com/docs/build-skills), and [plugin documentation](https://developers.openai.com/plugins/).

Codex is strongest at the implementation layer. Product builders still need an operating model for deciding what matters, choosing the next evidence, preserving decisions, and accepting the result. MAGA adds that product layer without placing another application between you and Codex.

> **Direct without restraint. Accept with judgment.**

MAGA is deliberately an on-ramp, not a permanent layer. It starts with language and decisions that product people already understand, then makes the underlying practices visible: framing outcomes, gathering evidence, setting constraints, managing trade-offs, and accepting working software. The intended end state is greater autonomy, not permanent dependence. If you eventually need less of MAGA—or none at all—because you can work with Codex directly, the plugin has done its job.

A conventional Skill makes one recurring job more reliable. MAGA adds an operating model above a collection of capabilities:

- One product-facing Project Lead receives ordinary product language.
- Intent-based routing chooses Skills and methods from the current evidence.
- Durable project state preserves decisions, boundaries, roles, and approved work.
- Product acceptance replaces code review as the Product Owner's interface.

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
| Split Tickets, name tasks, or manage engineering tasks | Priority and acceptable trade-offs |
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

This information lives in the project. The Project Lead task, or a restored replacement, can recover from durable state instead of treating one task transcript as the product record.

## Product and permission boundaries

MAGA can advance authorized work without turning one natural-language request into unlimited permission.

- Reversible work inside the named project and risk-matched checks are normal execution.
- Publishing, payment, account actions, external messages, and irreversible deletion require explicit authority.
- Product trade-offs that cannot be inferred from existing decisions return to the Product Owner.
- Codex in the ChatGPT desktop app remains the user interface; MAGA does not create a parallel dashboard.

## Models by responsibility

MAGA works at the scale of a complete application, but that application does not need to be a huge platform. It coordinates the work required to take a small but complete first release from intent to a working release. You do not need to learn the seven names below as job titles or manage seven separate teams; they are internal labels MAGA uses to divide the work.

### Understanding the seven responsibilities through a small but complete first release

Imagine you want to build and launch a small activity-sharing application for an interest community. People can sign up, add a name and short profile, publish brief updates, see the community’s latest posts on a home timeline, and reply. This is not a single feature added to an existing product, nor an attempt to build a huge social platform at once. It is a small but complete first release with a real core loop that can be placed in users’ hands.

- **Project Lead (`project-lead`) — moving the whole product forward:** Turns your product direction into a clear scope and acceptance criteria—for example, completing the loop of “sign up → profile → post → home timeline → reply”—then coordinates research, prototyping, implementation, and validation. Decisions that change the audience or experience direction remain yours.
- **Research (`research`) — finding evidence for product decisions:** Learns how the interest community communicates today, where the current experience falls short, and what members actually expect from profiles, short posts, the home timeline, and replies, so the product is not designed from assumptions alone.
- **Prototype (`prototype`) — making the product visible and usable before the full build:** Creates an interactive version of sign-up, profiles, publishing, the home timeline, and replies so you can inspect the information, try the sequence yourself, and decide whether the core loop works.
- **Delivery (`delivery`) — turning the accepted experience into a real product:** Builds the prototype into a working application in small slices so accounts, profiles, posts, and replies are genuinely saved and correctly connected instead of existing only as screens or a demonstration.
- **Diagnosis (`diagnosis`) — finding where real failures originate:** If a new post does not appear at home, content disappears after refresh, or a reply appears in the wrong place, it reproduces the behavior and isolates the actual cause instead of blindly rebuilding the product.
- **Review (`review`) — independently checking completeness and reliability:** Walks through the full journey from sign-up to publishing, browsing, and replying, checks the result against your requirements, and confirms that account information and community content have essential accessibility, privacy, and safety boundaries.
- **Release (`release`) — delivering the product reliably to real users:** Confirms that live settings, backups, operational visibility, and a rollback path are ready. After you approve the launch, it opens the product and verifies that a new user can complete the entire core journey.

When you configure models, you are not hiring or managing seven people. You are deciding how much judgment and reasoning capacity each kind of behind-the-scenes work can use. MAGA still handles responsibility selection, task routing, and coordination.

Its settings panel offers three starting profiles for the same seven responsibilities:

- **Pro · quality first:** Sol handles open-ended judgment and assurance; Terra handles scoped implementation. Luna is not used.
- **Plus · regular use:** Sol protects the highest-value decisions, Terra handles everyday reasoning and tools, and Luna Max handles bounded delivery.
- **Free / Go · quota saver:** Terra carries most work, Sol is reserved for release risk, and Luna Max handles clearly specified delivery.

| Responsibility | Pro · quality first | Plus · regular use | Free / Go · quota saver |
| --- | --- | --- | --- |
| Project Lead (`project-lead`) | Sol · xhigh | Sol · xhigh | Terra · xhigh |
| Research (`research`) | Sol · max | Sol · max | Terra · max |
| Prototype (`prototype`) | Sol · xhigh | Terra · high | Terra · high |
| Delivery (`delivery`) | Terra · xhigh | Luna · max | Luna · max |
| Diagnosis (`diagnosis`) | Sol · max | Terra · xhigh | Terra · high |
| Review (`review`) | Sol · xhigh | Sol · high | Terra · high |
| Release (`release`) | Sol · xhigh | Sol · high | Sol · high |

Business, Enterprise, and Edu workspaces can start with the Plus profile, then use the Pro profile when their workspace allowance and model policy support it. API-key users should choose by their own token budget. Plan access and limits can change; see the current [Codex pricing and plan guide](https://learn.chatgpt.com/docs/pricing).

The profiles follow the work rather than ranking the models: **Sol** is for ambiguity, judgment, and polish; **Terra** is the everyday workhorse for scoped work that still needs reasoning and tools; **Luna** is only recommended at **max**, for clear and repeatable delivery. Higher reasoning can take longer and use more tokens, and every row stays editable after a profile is applied.

Open the MAGA plugin detail page and select its **Configure** starter prompt. This starts a MAGA task with an in-task configuration panel; current Codex plugin detail pages do not support arbitrary embedded settings forms. Choose a profile, adjust any row, and click **Save**. Until that first save, the Codex host defaults stay active. Later saves update only the rows you changed. The choices live in the current Codex Home, outside the product repository and its Git history.

Saved changes apply only to new tasks that you explicitly approve in product language; MAGA may propose and route a clearly named task, but it does not create one without your approval. Existing tasks keep their settings. A Project Lead uses a saved profile when it is first created or when you explicitly request a replacement to take over. The panel's `model/list` is a reference catalog, not proof of what every destination supports. MAGA passes your saved model and depth to the new task's destination host for final validation; if that host rejects them, MAGA retries once without overrides, tells you it used the host default, and never silently chooses another tier. It also never upgrades a task merely because it looks difficult.

## What is inside

The current release is **v0.13.0**. It contains 18 registered Skills, an internal method library loaded only when needed, responsibility-level compute settings, Product Owner-confirmed validation profiles, and automatic Humanization routing for human-readable local-file content.

| Layer | Responsibility |
| --- | --- |
| Project Lead | Receives product language, maintains state, selects methods, and coordinates tasks |
| Adaptive validation | Recommends a test profile from current use, exposure, delivery, and system size, then asks the Product Owner to confirm it and report later changes |
| Product discovery | Clarification, research, domain language, concepts, and prioritization |
| Design and delivery | Planning, prototyping, implementation, validation, and completion |
| Content humanization | Natural articles, documents, messages, and product or GUI copy across six locales |
| Diagnosis and simplification | Debugging, code review, and removal of unnecessary complexity |
| Method library | Upstream workflows loaded on demand instead of occupying every task |

Humanization uses a deterministic local-file boundary. It runs automatically only when MAGA writes or edits human-readable text in a local file—for example, Markdown or another document, a report, article, saved communication draft, release note, or visible product copy in source or resource files. Text returned only in chat never triggers it automatically, regardless of length, Markdown formatting, copy-readiness, or possible later sharing. Explicit invocation remains available, and automatic runs stay silent.

Explore the implementation: [Skill catalog](./plugins/maga/skill-catalog.json) · [Project Lead](./plugins/maga/skills/project-lead/SKILL.md) · [Product-oriented Project Lead](./playbooks/product-oriented-project-lead.md)

<details>
<summary><strong>Routing, tasks, and authorization</strong></summary>

### Routing

The Project Lead first identifies the type of evidence needed, then selects a registered Skill or an internal method. Users can explicitly invoke a Skill, but normal product work does not require it.

### Task boundaries

Work stays in the current task by default. MAGA proposes a separate task only for a concrete object that benefits from parallel work, isolated context, a distinct permission boundary, or independent acceptance, then asks for your approval using its specific title. One answer can approve a clearly listed batch. It does not pre-create empty research, prototype, implementation, or review rooms.

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

- [mattpocock/skills](https://github.com/mattpocock/skills): workflow material from 25 formal Engineering and Productivity Skills, fixed at `8b36d4f`.
- [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail): minimal implementation, complexity review, and lifecycle hooks, fixed at `16f2980`.
- [thevenomsnake/humanization](https://github.com/thevenomsnake/humanization): natural prose and GUI copy across six locales, fixed at `d3b8f37` (Humanization `3.0.0`).

MAGA's routing, project state, installer, and Project Lead contract are local adaptations. Sources, modifications, and licenses are recorded in [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md).

## Research and playbooks

- [Research index](./research/README.md)
- [Product-oriented Project Lead](./playbooks/product-oriented-project-lead.md)
- [Multi-task collaboration](./playbooks/multi-session-collaboration.md)
- [Native Codex Ticket orchestration](./playbooks/codex-ticket-orchestration.md)
- [AI-slop research](./research/kill-ai-slop.md)

## Help and feedback

- Follow the [beginner guide](./docs/getting-started.md) for installation and first use.
- Open a [GitHub issue](https://github.com/thevenomsnake/MAGA/issues) for a reproducible bug or a focused proposal.
- Use the [MAGA website](https://maga.sumimi.jp/) for the product overview and current onboarding path.

## License

MAGA is released under the [MIT License](./LICENSE). Third-party materials remain under their respective licenses; see [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md).
