---
key: T009
status: ready
authorization: approved
role: project-lead
workspace: release
---

# Release MAGA 0.16.0 for code and GitHub

## Outcome

The code repository and GitHub release expose the native subagent runtime adapter
as MAGA 0.16.0 from one explicit, reproducible commit.

## Acceptance

- Package, plugin, workflow, bridge, and MCP versions are `0.16.0`.
- Current repository README surfaces describe the native read-only subagent
  runtime and bounded delegation without changing the website.
- A clean full commit produces an LF-normalized archive with recorded SHA-256.
- GitHub contains a non-draft, non-prerelease `v0.16.0` release pointing to that
  commit and attached archive.
- `.ai-workflow/RELEASES.md` records attempted commit, deployed commit, previous
  known-good commit, archive identity, and GitHub evidence.

## Boundaries

- In scope: repository code, package/plugin metadata, repository documentation,
  release archive, GitHub tag/release, and local release evidence.
- Out of scope: website, Cloudflare, npm, external trackers, accounts, payments,
  migrations, and unrelated refactors.

## Blocked By

- T008 (integrated): native subagent runtime adapter.

## Reads First

- `.ai-workflow/PROJECT.md`
- `.ai-workflow/design/records/D003-native-subagent-runtime-adapter.md`
- `plugins/maga/skills/project-lead/references/git-and-release.md`
- `.ai-workflow/RELEASES.md`

## Proof

- Break to catch: version surfaces disagree, the archive differs from the tagged
  commit, or GitHub release metadata points at the wrong commit.
- Evidence: focused public/version smoke, `git-release.js prepare/archive`, archive
  SHA-256, GitHub release JSON, and local release state.
- Persistent regression: yes - release metadata and public surfaces can drift.
- Risk delta: public release -> explicit commit, immutable archive, previous
  known-good, and provider evidence.
- Stop when: `v0.16.0` is published on GitHub and `.ai-workflow/RELEASES.md` is
  committed with the observed identities.

## Execution

- Task opening: not-needed
- Task title: not-needed
- Attempt: 1
- Git branch: codex/release-0160
- Start commit: 9105979
- Starting dirty files: none

## Completion

- Behavior: pending
- Validation: pending
- Evidence: pending
- Commit or artifact: pending
- Blocker: none
