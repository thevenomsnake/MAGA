# Issue Tracker: GitHub

Issues and specs for this repository live as GitHub issues. Use the connected
GitHub capability for issue and pull-request reads and writes. Use local Git with
the repository's existing HTTPS credential manager for branch fetch and push;
tracker setup never changes remotes or authentication.

## Conventions

- Read issue or pull-request metadata, bodies, comments, labels, and review state
  through the GitHub connector.
- Create, comment, label, close, or otherwise mutate an issue or pull request only
  within the Product Owner's explicit external-action authorization.
- Resolve a bare `#42` as either an issue or pull request before acting because
  GitHub shares one number space.
- Use generic public examples and never put credentials, private account data,
  machine paths, or Codex task identifiers in tracker content.

Do not run `gh auth login`, request or store a PAT, change an HTTPS remote to SSH,
or print credential content. If a current-branch fetch or push reports a local
`.git` permission error, retry the same Git operation with the narrow filesystem
permission required; this is not an authentication migration.

## Pull Requests As A Triage Surface

**PRs as a request surface: no.** Set this to `yes` only when the repository
explicitly treats external pull requests as incoming product requests. When
enabled, keep contributor requests and maintainer work distinct using the
author's repository relationship.

## Publishing And Fetching

“Publish to the issue tracker” means create a GitHub issue after authorization.
“Fetch the relevant ticket” means read the issue and its discussion through the
connector without changing it.

## Wayfinding Operations

Use one issue labelled `wayfinder:map` as the map and child issues as decision
tickets. Prefer GitHub's native sub-issue and blocking relationships when the
repository supports them; otherwise keep explicit `Part of #<map>` and
`Blocked by: #<n>` lines. A frontier item is open, unblocked, and unclaimed.

Claiming, resolving, linking, commenting, or closing is an external write. It
requires the current MAGA Ticket and external-action authorization; an upstream
method's mention of a tracker is not authorization by itself.
