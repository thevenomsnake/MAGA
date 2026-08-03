# Capability And Workspace Routing

Use this reference when product language could map to discussion, research,
prototype, specification, delivery, diagnosis, review, or a fresh Codex task.
Keep the routing invisible unless the Product Owner asks how the work is organized.

## Keep One Front Door

- Keep the named, pinned Project Lead as the only generic product entry.
- Keep ordinary product discussion in the Project Lead.
- Never initialize empty tasks named only `Idea discussion`, `Research`,
  `Prototype`, `Implementation`, or similar capability labels.
- Treat a Codex task as an attention workspace for one concrete object, not as a
  menu item or permanent department.

## Route From Evidence

| Signal in the request or durable state | Internal method | Default workspace |
| --- | --- | --- |
| Product behavior, audience, or value is materially unclear | Apply grilling and domain-modeling methods; ask one product question at a time | Current Project Lead |
| A missing external fact could change a product decision | Apply the bundled research method against primary or authoritative sources | Fresh research task when the question is bounded and substantial; otherwise current task |
| A behavior, interaction, or state must be experienced to decide | Apply the bundled prototype method to answer one named question | Fresh prototype task when it produces an inspectable artifact |
| The destination is clear but the route is too large for one attention window | Apply the wayfinding method to resolve decision fog before delivery | Bounded decision tasks; do not create a generic planning room |
| Decisions are sufficiently closed | Apply the specification method to synthesize what is already known | Current Project Lead unless publication needs an independent boundary |
| An accepted result must survive the current conversation or cross responsibilities | Form product Tickets with explicit blockers and authorization | Durable project state first; tasks only for approved Tickets |
| An approved Ticket is ready | Apply the minimum implementation method and any risk-justified specialist capability | Current task or a fresh delivery task |
| A concrete failure is observed | Apply diagnosis before proposing a fix | Fresh diagnosis task only when isolation or a long evidence trail helps |
| A result is ready for independent acceptance | Apply the smallest review needed for the documented risk | Fresh review task only when independence is material |
| Context is polluted or a branch of work needs isolation | Recover from durable project state in a fresh task | Replacement or bounded worker, never a generic handoff room |

When the selected bundled upstream Skill is explicit-only, load its instructions
as an internal workflow reference instead of asking the Product Owner to type a
Skill command. Keep the original explicit entry available for expert direct use,
and do not change its invocation metadata. MAGA's Ticket authorization, product
boundaries, and repository instructions still govern any adapted method.

Do not automatically enter setup, teaching, skill-authoring, opportunistic
architecture-audit, or external issue-triage flows without matching user intent.
Do not let a manual upstream implementation flow bypass a pending or revoked MAGA
Ticket.

## Open A Fresh Workspace Only When It Pays

Create a same-project task only after its work object and completion boundary are
concrete and at least one condition holds:

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
