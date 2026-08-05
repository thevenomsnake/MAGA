# Skill Mechanics

Use this branch of `writing-for-agents` when the document is a Skill.

## Invocation

A **model-invoked** Skill keeps a model-facing `description`, so Codex can select
it automatically and other Skills can reach it. The description is an
always-loaded context pointer, so it must carry the real trigger branches and
earn its context cost.

A **user-invoked** upstream workflow may deliberately remove model discovery.
MAGA normally keeps those workflows as Project Lead internal methods instead of
registered commands, preserving one product front door and loading the method
only when product intent selects it.

Choose model invocation only when independent automatic reach is valuable. A
human-facing picker entry alone is not enough reason to spend context load.

## Splitting

Split by invocation only when a distinct leading word should trigger the new
Skill on its own or another Skill must reach it. Split by sequence only when a
real context boundary prevents later steps from causing premature completion.

## Router Skills

When several deliberate workflows must remain user-controlled, use one router
or product lead to map intent to them. The router is an index, not a second copy
of each workflow. In MAGA, `project-lead` owns that routing and internal methods
remain plain `METHOD.md` resources.

## Codex Metadata

Every registered MAGA Skill includes `agents/openai.yaml` with a product-facing
display name, a concise description, a default prompt containing the Skill's
`$name`, and an explicit implicit-invocation policy. Repository and public
privacy rules remain authoritative over upstream metadata conventions.
