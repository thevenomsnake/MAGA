---
key: T009
status: integrated
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

- Behavior: MAGA 0.16.0 code and repository documentation are synchronized, and GitHub publishes the native subagent runtime adapter from the explicit release commit.
- Validation: `node --test test/native-subagent-adapter.test.js test/codex-bridge.test.js test/native-subagent-routing.test.js test/init-project.test.js test/bundled-skills.test.js test/git-discipline.test.js` passed 49/49; all five README locale Humanization checks passed, with two non-blocking zh-CN review signals; archive preflight and SHA verification passed.
- Evidence: GitHub release `v0.16.0` at https://github.com/thevenomsnake/MAGA/releases/tag/v0.16.0; target commit `1c8630aef6795da38681bb4fe3df59609938b985`; archive `maga-0.16.0.tar`, `byteLength: 9779200`, SHA-256 `07846234e4da68e7d6a2a40c610105b96afc941849b9768cd3f957cb2a522643`.
- Commit or artifact: 1c8630aef6795da38681bb4fe3df59609938b985; `maga-0.16.0.tar`
- Blocker: none
