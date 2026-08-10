# Git And Release Contract

Use this reference before source changes, branch or worktree changes, portable
handoffs, frozen-artifact generation, deployment, or rollback. Keep Git
mechanics internal unless the Product Owner asks for them.

## Protect The Starting State

The MAGA session hook records the current branch, full `HEAD`, and dirty file
set in `.git/maga/baselines.ndjson`. Treat every path dirty before this task as
protected existing work.

Before writing:

1. Confirm the current branch, full `HEAD`, and dirty set.
2. Use an explicit branch or a permitted isolated worktree. If work must share
   one checkout, serialize every writer.
3. Limit the write set to the authorized Ticket. Do not overwrite or stage
   unrelated dirty paths.

After the smallest runnable vertical slice, run its one directly relevant
smoke and commit it. Before switching branches, pulling, rebasing, cleaning, or
handing work elsewhere, preserve every current change in a commit or another
recoverable Git form. Never use `reset --hard` or `checkout` to discard work.

## Freeze Canonical Bytes

`.gitattributes` is the only line-ending authority:

```gitattributes
* text=auto eol=lf
```

For generated text and integrity metadata, normalize newlines to LF before the
final write. Then read the file back as bytes and calculate `byteLength` and
`sha256` from those final bytes. Use the same descriptors in every manifest and
catalog; do not hash a source string, a CRLF working copy, or an earlier buffer.

In Node.js, keep the sequence explicit:

```js
const bytes = Buffer.from(text.replace(/\r\n?/g, "\n"), "utf8");
fs.writeFileSync(target, bytes);
const finalBytes = fs.readFileSync(target);
const descriptor = {
  byteLength: finalBytes.byteLength,
  sha256: createHash("sha256").update(finalBytes).digest("hex"),
};
```

Generate once, verify the manifest or catalog against the files it names, and
commit both the final files and their descriptors. Fix the generator when they
disagree. Do not add server-side override files or patch deployed bytes.

## Deploy Commits, Not Directories

Release only with explicit authorization, a clean worktree, and a full
40-character commit hash. Use the helper path injected by the MAGA Git hook:

```text
node "<MAGA git-release.js>" prepare --commit <full-sha>
node "<MAGA git-release.js>" archive --commit <full-sha> --output <repo-relative.tar>
```

The archive command enforces the LF attribute and runs
`git -c core.autocrlf=false archive`. Deploy that commit through the project's
normal provider workflow; never package the mutable working directory.

After the provider result, record it locally:

```text
node "<MAGA git-release.js>" record --commit <full-sha> --status succeeded
node "<MAGA git-release.js>" record --commit <full-sha> --status failed
```

On the first real deployment, create `.ai-workflow/RELEASES.md`. Record the
deployed commit, the previous known-good commit, the attempted commit, status,
focused production evidence, and rollback commit. Commit that release-state
update as the next traceability slice.

If deployment fails, redeploy the recorded rollback commit through the same
pipeline. Do not reset the branch, rewrite working files, or repair the server
by hand.

## Hand Off Without Losing Work

Every cross-session handoff carries the explicit branch, current commit,
pre-existing and current dirty file sets, result commits, deployment status,
deployed commit, previous known-good commit, and whether rollback is pending.
Use repository-relative paths in tracked handoffs; keep machine paths and task
identifiers out of them.
