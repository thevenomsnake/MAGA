import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const REPOSITORY_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PLUGIN_ROOT = path.join(REPOSITORY_ROOT, "plugins", "maga");
const HOOK = path.join(PLUGIN_ROOT, "hooks", "git-discipline.js");
const RELEASE = path.join(PLUGIN_ROOT, "scripts", "git-release.js");
const TEST_ROOT = path.join(REPOSITORY_ROOT, "tmp", "tests");

function run(command, args, cwd, options = {}) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    shell: false,
    ...options,
  });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout;
}

test("records the protected Git baseline and archives one explicit LF commit", (t) => {
  const hooks = JSON.parse(fs.readFileSync(path.join(PLUGIN_ROOT, "hooks", "hooks.json"), "utf8"));
  assert.match(JSON.stringify(hooks.hooks.SessionStart), /git-discipline\.js/);
  assert.match(JSON.stringify(hooks.hooks.SubagentStart), /git-discipline\.js/);

  fs.mkdirSync(TEST_ROOT, { recursive: true });
  const root = fs.mkdtempSync(path.join(TEST_ROOT, "git-discipline-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  run("git", ["init", "-b", "main"], root);
  run("git", ["config", "user.name", "MAGA Smoke"], root);
  run("git", ["config", "user.email", "maga@example.invalid"], root);
  fs.writeFileSync(path.join(root, ".gitattributes"), "* text=auto eol=lf\n", "utf8");
  fs.writeFileSync(path.join(root, "artifact.txt"), "alpha\r\nbeta\r\n", "utf8");
  run("git", ["add", "."], root);
  run("git", ["commit", "-m", "add frozen artifact"], root);
  const commit = run("git", ["rev-parse", "HEAD"], root).trim();

  fs.writeFileSync(path.join(root, "existing-work.md"), "keep\n", "utf8");
  const hookOutput = JSON.parse(run(process.execPath, [HOOK, "SessionStart"], root, {
    env: {
      ...process.env,
      PLUGIN_DATA: path.join(root, ".plugin-data"),
      COPILOT_PLUGIN_DATA: "",
      QODER_SESSION_ID: "",
    },
  }));
  assert.equal(hookOutput.systemMessage, "MAGA:GIT-BASELINE");
  assert.match(hookOutput.hookSpecificOutput.additionalContext, /1 pre-existing dirty record/);
  assert.match(hookOutput.hookSpecificOutput.additionalContext, /core\.autocrlf=false archive/);

  const baseline = fs.readFileSync(path.join(root, ".git", "maga", "baselines.ndjson"), "utf8")
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line))
    .at(-1);
  assert.equal(baseline.branch, "main");
  assert.equal(baseline.head, commit);
  assert.deepEqual(baseline.dirty, ["?? existing-work.md"]);

  fs.rmSync(path.join(root, "existing-work.md"));
  const prepared = JSON.parse(run(
    process.execPath,
    [RELEASE, "prepare", "--commit", commit],
    root,
  ));
  assert.deepEqual(prepared, { commit, previousKnownGood: null });

  const archived = JSON.parse(run(
    process.execPath,
    [RELEASE, "archive", "--commit", commit, "--output", "release/artifact.tar"],
    root,
  ));
  const archiveBytes = fs.readFileSync(path.join(root, archived.archive));
  assert.equal(archived.commit, commit);
  assert.equal(archiveBytes.includes(Buffer.from("alpha\nbeta\n")), true);
  assert.equal(archiveBytes.includes(Buffer.from("alpha\r\nbeta\r\n")), false);

  const succeeded = JSON.parse(run(
    process.execPath,
    [RELEASE, "record", "--commit", commit, "--status", "succeeded"],
    root,
  ));
  const failed = JSON.parse(run(
    process.execPath,
    [RELEASE, "record", "--commit", commit, "--status", "failed"],
    root,
  ));
  assert.equal(succeeded.deployedCommit, commit);
  assert.equal(succeeded.previousKnownGood, null);
  assert.equal(failed.deployedCommit, commit);
  assert.equal(failed.rollbackCommit, commit);
});
