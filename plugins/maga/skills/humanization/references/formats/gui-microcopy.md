# GUI microcopy

Use this module for text attached to an interface or product state. The public format name remains `web-microcopy` for compatibility, but the rules apply to HTML, JSON, YAML, ARB, PO, source code, design files, desktop apps, mobile apps, and web apps.

## Content gate

Run the common content existence gate before choosing a component sentence. A fact can be true and still belong in an internal capability ledger, developer diagnostic, help article, or policy document rather than in the current UI.

Keep a visible string only when it names the current action or state, helps the user make a consequential choice, explains a result, enables recovery, supports navigation or identification, or provides a required privacy, permission, legal, safety, or accessibility disclosure. If the string has no such job, return `remove` or `move`. If the candidate also exposes a missing capability, state, CTA, or recovery path for the intended journey, return `needs_product_decision` alongside the copy disposition.

For capability limits, describe the user-facing consequence and a real next step when one exists. Keep implementation details such as backend components, API topology, logs, and error codes in developer-facing diagnostics. Do not turn a list of absent features into public promotion or pre-emptive warning copy.

## Input and resource ledger

Record the selected locale, component, current state, user goal, supported action, consequence, available space, facts, CTA, brand terms, privacy/capability claims, and source resource. Before editing a structured resource, inventory:

- key path, nesting, collection shape, value type, and meaningful order;
- placeholders, variable names, positional arguments, ICU arguments, types, selectors, categories, and exact branches;
- markup, links, attributes, access keys, escapes, comments, and interpolation delimiters;
- permissions, amounts, dates, state names, error codes, destructive effects, and recovery paths.

Only edit translatable values. Do not add, remove, rename, translate, or reorder protected structure unless the resource contract explicitly permits it.

## Component jobs

| Component | Text job | Required check |
| --- | --- | --- |
| Navigation or tab | Name the destination or view. | Use the approved term consistently; do not disguise an action as navigation. |
| Page introduction or feature summary | State what the visitor can do here and why it matters. | Lead with a supported outcome or action; disclose a limitation only when it changes an informed choice or expectation. |
| Button or menu item | Name the outcome of the action. | Prefer the exact outcome over vague `OK`; make destructive actions explicit. |
| Label or help text | Name the control or supply a needed condition. | Do not use placeholder text as the only label. |
| Error or validation | State what happened and enable recovery. | Give a cause only when known; keep implementation details in diagnostics; offer only a real next step. |
| Empty or no-results state | Explain the current state and orient the next action. | Distinguish first use, no results, loading, permission failure, and system failure when the product does; do not invent a CTA when no action exists. |
| Confirmation | Support an informed choice. | Name the effect, cost, scope, and irreversibility; label both choices by outcome. |
| Status or notification | Report a current or completed change. | Keep it timely and non-blocking unless the user must decide; expose meaningful text to assistive technology. |
| Privacy or permission | Explain actual collection, use, sharing, storage, or access. | Do not expand the product's legal or technical promise. |
| Page metadata | Identify the same page and offer shown on screen. | Align title, description, Open Graph, visible CTA, and accessible names to the same facts and brand terms. |

## Language realization

Read the selected locale profile after identifying the component job. The profile decides whether the natural realization is a verb, noun phrase, complete sentence, honorific form, regional term, or another construction. Do not force English word order or a universal “short verb” rule onto every locale.

Short strings bypass long-form material counts and paragraph rules. Minimal editing still applies: preserve a working control label or state when it already fits the product and locale. For a structured resource, report a `remove` disposition without blanking the value or deleting the key; preserve the current nesting and runtime shape until the resource owner approves a schema change.

## Resource validation

With `--source`, `scripts/check_writing.py` deterministically compares common protected tokens. JSON and ARB inputs also compare keys, nesting, collection lengths, value types, and non-string values. HTML inputs compare markup structure plus non-translatable attribute names and values.

For a complete HTML page, the checker also requires matching `lang`, a non-empty title and description, accessible control names, text for status/error roles, and a complete Open Graph core when any `og:*` field is present. HTML fragments and non-HTML resources do not need page metadata.

The checker does not parse YAML or PO structure and cannot judge tone, legal sufficiency, product truth, or visual truncation. Run the project's own parser/localization compiler, then inspect the rendered component for wrapping, clipping, state accuracy, accessible names, and variable substitution.

Visual style such as color, font, layout, card shape, icon style, and animation is outside this Skill.
