# Expressive text

Use `format=copy` for bounded, non-GUI text such as product descriptions, documentation, help content, release notes, email, social posts, campaign copy, and captions. A string attached to a control or product state uses `format=web-microcopy` regardless of whether it lives in HTML, JSON, YAML, ARB, PO, source code, or a design file.

## Input

Use the ledger from `../core.md` and add the surface, audience, user goal, channel, desired length, and delivery constraint. Decide whether each candidate earns a place before rewriting it. Read exactly one locale profile.

## Output

- Keep one primary job per string or paragraph; do not force every surface into a headline, slogan, and CTA bundle.
- Treat internal capability inventories as evidence for the ledger, not as a public copy outline. Publish a limitation only when it changes a user's decision, expectation, privacy or permission choice, legal or safety obligation, or real recovery path.
- Preserve the source meaning, scope, uncertainty, register, valid structure, and deliberate voice unless the user asks to change them.
- Let the locale profile decide word order, punctuation, regional vocabulary, translationese, template signals, and rhythm.
- Do not apply long-form material counts to short copy. A claim still needs a source or explicit product contract.
- Keep working CTA, deadline, offer, link, contact, price, limitation, and recovery information. Removing filler must not remove the copy's function.
- When no user-facing job or supported next step exists, return `remove`, `move`, or `needs_product_decision` instead of polishing the sentence.
- If the input already works, return it unchanged. If an ambiguity changes the action or promise, ask the author instead of choosing a polished guess.
