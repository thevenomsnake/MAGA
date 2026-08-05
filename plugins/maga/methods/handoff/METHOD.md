---
name: handoff
description: Compact the current conversation into a handoff document for another agent to pick up.
argument-hint: "What will the next session be used for?"
---

> **MAGA internal method:** Project Lead reads and executes this file inline.
> It is not a registered Skill; never turn its name into a Skill command.

Use a handoff only when context must travel to another harness, repository,
directory, colleague, or isolated mid-phase fork. Normal same-project recovery
comes from durable project memory and the native Codex loop.

When a portable document is genuinely required, write a sanitized file under
`.ai-workflow/handoffs/<topic>.md` or the repository's existing handoff location.
Keep it inside the repository. Do not use an operating-system temporary
directory or another workspace.

Include a "suggested next capabilities" section in product language. Let the
next Project Lead resolve registered Skills and internal method paths from the
current routing reference; do not invent commands for internal methods.

Do not duplicate content already captured in other artifacts (specs, plans, ADRs, issues, commits, diffs). Reference them by path or URL instead.

Redact secrets, personal or account identifiers, machine paths, private project
names, and Codex task or thread identifiers. Prefer generic roles and resolvable
repository paths.

If the user passed arguments, treat them as a description of what the next session will focus on and tailor the doc accordingly.
