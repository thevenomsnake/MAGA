# UI description

Use `format=ui-description` for text that describes an interface to designers, developers, QA, agents, or handoff readers. It covers screen overviews, component specifications, interaction flows, state maps, design handoff notes, acceptance criteria, and accessibility intent. It is a description of an interface contract, not a string rendered by that interface.

## Route boundary

- Text rendered to users or assistive technology belongs to `ui-microcopy`.
- Public product or marketing explanation that is not attached to a control, state, or metadata field belongs to `copy`.
- A tutorial, article, case study, or sustained argument about an interface belongs to `prose`.
- Layout, visual styling, interaction code, and component implementation are outside this text format.

If one file mixes a screen description with runtime strings, split it into input units and route each unit separately. Do not make a design note sound like visitor-facing promotion, and do not make a button label carry the detail that belongs in the description.

## Input contract

Record the audience, screen or component, user goal, entry point, current state, supported actions, transitions, outcomes, recovery or exit path, source of truth, and whether the behavior is current, planned, or unknown. Preserve component IDs, event names, state names, prop names, URLs, variables, measurements, acceptance criteria, and approved terminology.

When a screenshot or mockup is supplied, separate observable elements from inferred behavior. Keep an inference marked as an assumption or `needs_product_decision`; do not turn an imagined affordance into a stated capability.

## Staged review

1. **Scope**: identify the interface object and the reader. State whether this is a screen, component, flow, state, or handoff requirement.
2. **Contract**: check that every action, state, permission, data behavior, and outcome is supported by the source. Distinguish current behavior from planned behavior.
3. **Flow**: trace entry -> action -> feedback -> success, failure, recovery, or exit. Mark a missing transition as `needs_product_decision` instead of inventing a CTA or state.
4. **Content boundary**: keep user-facing text in `ui-microcopy`; keep implementation diagnostics and internal capability inventories out of visitor-facing copy.
5. **Locale and terminology**: use the selected locale for prose around the description, while preserving code tokens, product terms, IDs, and named states.
6. **Integrity**: verify that structured examples, keys, variables, markup, links, and acceptance conditions remain intact.

## Output

Prefer a compact structure that matches the handoff job: a heading plus bullets for a screen overview, a table for states, or ordered steps for an interaction flow. Report unknowns and product decisions explicitly. Do not add slogans, claims of capability, visual details, or accessibility behavior that the source does not support. A concise route and stage receipt is useful; hidden reasoning is not part of the deliverable.
