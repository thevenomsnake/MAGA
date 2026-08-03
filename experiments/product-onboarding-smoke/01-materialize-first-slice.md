# Product Onboarding Smoke

## Purpose

Check whether a fresh Codex project task can apply the Project Lead skill to a complete natural-language product request and materialize useful durable state without exposing engineering workflow to the product owner.

## Product Message

Build a small browser-based shift board for volunteer coordinators. One coordinator should be able to add a volunteer name and shift time, then see the current schedule on a phone. The first version is local-only, has no accounts, uses no paid services, and does not need publishing yet. Start with that first usable slice; you may create the project tasks needed for this approved scope.

## Execution Contract

1. Read `AGENTS.md` and `plugins/maga/skills/project-lead/SKILL.md`, including only the reference it routes to for onboarding.
2. Treat the Product Message as the user's first turn for the initialized project under `experiments/product-onboarding-smoke/workspace/`.
3. Perform onboarding state materialization only. Do not implement the shift board and do not create another task.
4. Keep every change under `experiments/product-onboarding-smoke/workspace/.ai-workflow/`.
5. Commit the result with one focused inspection fact.

Return:

```text
Status: completed | needs-decision | failed
Behavior: <what durable product state now expresses>
Validation: <one inspection and observed fact>
Commit: <hash or none>
Blocker: <reason or none>
```

## Observed Result

- Status: completed.
- The fresh task changed only three files under the experiment's `.ai-workflow/` directory.
- Product direction captured the intended user, problem, first value, delivery form, and explicit local-only boundaries.
- Only the Project Lead role was materialized, with `direct execution` rather than an unnecessary management layer.
- Mission `M001` described the add-and-view behavior, phone-sized acceptance, local data boundary, and one focused completion check.
- Evidence commit: `3d9db37`.
