---
key: T006
status: ready
authorization: approved
role: project-lead
workspace: release
---

# Publish MAGA 0.15.0 as the proactive coordination release

## Outcome

MAGA 0.15.0 is consistently identified across the package, plugin, bridge,
initializer, MCP server, public documentation, and GitHub release. Users can see
the new bounded coordination and project-memory capabilities before installation.

## Acceptance

- Package, plugin, workflow, bridge, and MCP versions are `0.15.0`.
- English, Simplified Chinese, Japanese, Korean, and Spanish README files describe
  bounded worker dispatch, durable context/design memory, optional thread Goals,
  and the unchanged permission gates.
- Beginner guides explain the project-scoped task-coordination decision.
- The canonical public-surface contract defines Autonomy Policy, design records,
  bounded continuity, and Goal scope.
- A GitHub `v0.15.0` release points to the explicit clean commit and contains a
  Git archive whose SHA-256 is recorded in release state.

## Boundaries

- In scope: repository documentation, version metadata, GitHub release, release state.
- Out of scope: npm publication, Cloudflare deployment, website redesign, new runtime
  behavior, and changes to the accepted coordination/design architecture.

## Blocked By

- T003, T004, and T005 (integrated).

## Reads First

- `.ai-workflow/PROJECT.md`
- `.ai-workflow/design/records/D001-bounded-proactive-coordination.md`
- `docs/public-surface-contract.md`
- `plugins/maga/skills/project-lead/references/git-and-release.md`

## Proof

- Break to catch: public copy or package metadata describes the old capability set,
  or the release artifact does not match the tagged commit.
- Evidence: localized Humanization checks, focused initializer/public-surface test,
  version identity check, Git archive SHA, and GitHub release metadata.
- Persistent regression: yes — localized surfaces and runtime versions can drift.
- Risk delta: public release -> explicit commit, immutable archive identity, provider
  result, and previous known-good release.
- Stop when: every public version is 0.15.0, the focused checks pass, and GitHub reports
  a non-draft, non-prerelease release with the recorded artifact.

## Execution

- Task opening: not-needed
- Task title: not-needed
- Attempt: 1
- Git branch: codex/release-0150
- Start commit: d518585
- Starting dirty files: none

## Completion

- Behavior: pending
- Validation: pending
- Evidence: pending
- Commit or artifact: pending
- Blocker: none
