# Capability And Workspace Routing

Use this reference when product language could map to discussion, local-file text production,
research, prototype, specification, delivery, diagnosis, review, or a fresh Codex task.
Keep the routing invisible unless the Product Owner asks how the work is organized.

## Keep One Front Door

- Keep the named, pinned Project Lead as the only generic product entry.
- Keep ordinary product discussion in the Project Lead.
- Never initialize empty tasks named only `Idea discussion`, `Research`,
  `Prototype`, `Implementation`, or similar capability labels.
- Treat a Codex task as an attention workspace for one concrete object, not as a
  menu item or permanent department.

## Use Stable Responsibility Profiles

MAGA exposes seven settings slots. They are stable routing keys, not an org chart
and not one setting per Skill:

| Work responsibility | Profile key | Plus / regular-use recommendation |
| --- | --- | --- |
| Product conversation, decisions, and integration | `project-lead` | Sol / xhigh |
| Source-backed external facts | `research` | Sol / max |
| Interaction and visual exploration | `prototype` | Terra / high |
| Bounded product implementation | `delivery` | Luna / max |
| Evidence-led failure investigation | `diagnosis` | Terra / xhigh |
| Independent acceptance and quality review | `review` | Sol / high |
| Privacy, migration, permissions, and release | `release` | Sol / high |

The Product Owner may change every row in MAGA's settings panel. Recommended values
remain recommendations until the complete panel is explicitly saved. Resolve an
explicitly saved profile immediately before an approved task creation and pass
non-null model and thinking values to the native task tool. If nothing was saved,
omit both so the host defaults apply. Do not select compute from perceived task
difficulty, and do not store environment-specific model names in project files.
Direct manual invocation of a registered Skill inherits its current task.

The panel also offers a `pro-quality` profile that uses Sol for open-ended judgment
and Terra for scoped delivery, plus a `quota-saver` profile that uses Terra broadly.
Luna appears only for clearly bounded delivery and only at `max`. The authoritative
profile definitions live in `runtime/compute-profiles.mjs`; this routing table shows
the default `plus-standard` starting point only.

## Load Internal Methods By Exact Path

MAGA distributes thirteen upstream workflows as internal method resources, not
registered Skills. When a route below selects one, read its linked `METHOD.md`
before acting and execute the method inline under the current product, Ticket,
permission, and repository boundaries. Load only the selected method and the
supporting files it directly requires.

Never synthesize a `$<method-name>` invocation, claim the method is installed as
a Skill, or ask the Product Owner to invoke it. The paths in this index are
relative to this reference file:

When `.ai-workflow/PROJECT.md` exists, the Project Memory Contract is the
default authority for specs, roles, Tickets, status, and authorization. Adapt
upstream issue-tracker wording to that native contract. Do not run the setup
method or ask the Product Owner to choose a tracker merely because an upstream
method mentions one. Configure or publish to an external tracker only when the
project already uses it or the user explicitly intends that external effect.

| Internal method | Load when |
| --- | --- |
| [ask-matt](../../../methods/ask-matt/METHOD.md) | A maintainer needs the upstream workflow map or no narrower method explains the engineering route |
| [grill-me](../../../methods/grill-me/METHOD.md) | An idea needs conversational challenge without durable project documents |
| [grill-with-docs](../../../methods/grill-with-docs/METHOD.md) | Product language or decisions should survive in the repository |
| [handoff](../../../methods/handoff/METHOD.md) | Context must travel across a harness, repository, directory, colleague, or isolated mid-phase fork |
| [implement](../../../methods/implement/METHOD.md) | A bounded, authorized Ticket is ready for the smallest working slice |
| [improve-codebase-architecture](../../../methods/improve-codebase-architecture/METHOD.md) | The user asks for an architecture audit, or diagnosis exposes a concrete missing seam |
| [setup-matt-pocock-skills](../../../methods/setup-matt-pocock-skills/METHOD.md) | The user intends to configure an external issue tracker or the upstream document conventions |
| [teach](../../../methods/teach/METHOD.md) | The user explicitly wants a durable, guided learning workspace |
| [to-questionnaire](../../../methods/to-questionnaire/METHOD.md) | A decision depends on knowledge held by one external stakeholder |
| [to-spec](../../../methods/to-spec/METHOD.md) | Known decisions need synthesis into an implementation-neutral specification |
| [to-tickets](../../../methods/to-tickets/METHOD.md) | An accepted specification must become bounded, blocked, authorized work contracts |
| [triage](../../../methods/triage/METHOD.md) | Raw incoming bug reports or feature requests need product and reproduction triage |
| [wayfinder](../../../methods/wayfinder/METHOD.md) | A genuinely large effort is blocked by decision fog rather than implementation |

## Route From Evidence

| Signal in the request or durable state | Internal method | Default workspace |
| --- | --- | --- |
| Product behavior, audience, or value is materially unclear | Apply registered `grilling`; load [grill-me](../../../methods/grill-me/METHOD.md) or [grill-with-docs](../../../methods/grill-with-docs/METHOD.md) for the appropriate persistence mode | Current Project Lead |
| The task will create or update a local file containing human-readable prose or copy: Markdown or another document, report, article, saved communication draft, release note, or visible GUI text in source or resource files | Apply registered `humanization` silently to the file content with an inferred locale, format, and surface; never announce the route or ask a configuration question; preserve code, commands, data, quotations, placeholders, markup, and machine structure | Current task; local-file text alone does not justify a fresh workspace |
| The generated text remains only in chat, including an answer, explanation, article, email draft, diagnosis, status summary, recommendation, or next step, even when detailed, Markdown-formatted, copy-ready, or potentially shareable | Continue ordinary Project Lead communication without automatic Humanization | Current Project Lead |
| A missing external fact could change a product decision | Apply the bundled research method against primary or authoritative sources | Fresh `research` task for an approved bounded Ticket |
| A decision depends on another person's knowledge | Load [to-questionnaire](../../../methods/to-questionnaire/METHOD.md) and draft a role-based repository-local questionnaire; sending it remains a separate external action | Current Project Lead |
| A behavior, interaction, or state must be experienced to decide | Apply the bundled prototype method to answer one named question | Fresh `prototype` task for an approved bounded Ticket |
| The destination is clear but the route is too large for one attention window | Load [wayfinder](../../../methods/wayfinder/METHOD.md) to resolve decision fog before delivery | Bounded decision tasks; do not create a generic planning room |
| Decisions are sufficiently closed | Load [to-spec](../../../methods/to-spec/METHOD.md) to synthesize what is already known | Current Project Lead unless publication needs an independent boundary |
| An accepted result must survive the current conversation or cross responsibilities | Load [to-tickets](../../../methods/to-tickets/METHOD.md) and form product Tickets with explicit blockers and authorization | Durable project state first; tasks only for approved Tickets |
| An approved implementation Ticket is ready | Load [implement](../../../methods/implement/METHOD.md) and apply any risk-justified registered capability | Fresh `delivery` task |
| A concrete failure is observed | Apply diagnosis before proposing a fix | Fresh `diagnosis` task for an approved bounded Ticket |
| A result is ready for independent acceptance | Apply the smallest review needed for the documented risk | Fresh `review` task when independent acceptance is material |
| Context is polluted or same-project work needs isolation | Recover from durable state or use an approved bounded worker; load [handoff](../../../methods/handoff/METHOD.md) only when the context itself must travel across its portability boundary | Replacement or bounded worker, never a generic handoff room |
| Work reaches an authenticated, secret, paid, migration, cutover, or irreversible human-only step | Read [manual-gates.md](manual-gates.md), guide one recoverable stage, and preserve the existing authorization boundary | Current Project Lead |

If the user says the explanation did not land, apply Project Lead's communication
recovery rule immediately. This is the absorbed `wait-what` behavior, not a
separate method, task, command, or document.

Registered specialist Skills may still be selected normally. Internal methods
have no compatibility aliases: their original technical identities exist only
in this method index and the distributed provenance catalog. MAGA's Ticket
authorization, product boundaries, and repository instructions govern every
adapted method.

Do not automatically enter setup, teaching, skill-authoring, opportunistic
architecture-audit, or external issue-triage flows without matching user intent.
Do not let a manual upstream implementation flow bypass a pending or revoked MAGA
Ticket.

## Open A Fresh Workspace Only When It Pays

Propose a same-project task only after its work object and completion boundary are
concrete and at least one condition holds. Create it only after the Product Owner
explicitly requests or approves that deterministic task title:

- it produces an independent artifact or finding;
- it needs a substantially different source set or professional context;
- it can run in parallel without conflicting writes;
- it is long enough to pollute the Project Lead's attention window;
- it needs a separate permission, write, or acceptance boundary;
- a clean recovery point is cheaper than continuing the current task.

Several bullets in a plan are not a reason to create several tasks. Keep writers
serialized unless isolated worktrees and non-overlapping write scopes are proven.

## Name The Work, Not The Capability

Use the project's language and include the concrete object:

```text
<project> · <localized workspace> · <ticket-key> <specific outcome>
```

Examples:

```text
Atlas · External research · T002 Why teams abandon first-run setup
Atlas · Prototype · T003 Mobile editing flow
Atlas · Delivery · T004 Save a reusable view
```

Do not use titles such as `External research` or `Prototype` without the object.
Leave bounded workers unpinned and archive them after their result is integrated,
deferred, or superseded. Pin a specialist manager only after its durable role has
a real managed queue.

## Teach Through Product Language

At first entry, teach only that the Product Owner may describe an idea, ask an
external question, request an experience prototype, or continue the product.
Do not teach Skill names or commands on the default path. Explain original Matt or
Ponytail entrypoints only when the user asks for advanced manual control.
