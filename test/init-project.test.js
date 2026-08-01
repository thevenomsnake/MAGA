import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { initProject } from "../src/init-project.js";

const REPOSITORY_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TEST_ROOT = path.join(REPOSITORY_ROOT, "tmp", "tests");

function workspace(t) {
  fs.mkdirSync(TEST_ROOT, { recursive: true });
  const root = fs.mkdtempSync(path.join(TEST_ROOT, "init-project-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}

test("initializes the minimum project kernel", (t) => {
  const targetDir = workspace(t);
  const result = initProject({ targetDir, projectName: "Studio Scheduler", git: false });

  assert.equal(result.alreadyInitialized, false);
  assert.equal(result.projectName, "Studio Scheduler");
  assert.equal(fs.existsSync(path.join(targetDir, "AGENTS.md")), true);
  assert.equal(fs.existsSync(path.join(targetDir, ".gitignore")), true);
  assert.equal(fs.existsSync(path.join(targetDir, ".ai-workflow", "PROJECT.md")), true);
  assert.match(
    fs.readFileSync(path.join(targetDir, ".ai-workflow", "PROJECT.md"), "utf8"),
    /status: onboarding/,
  );
});

test("initializes a repository at the project root", (t) => {
  const targetDir = workspace(t);
  const result = initProject({ targetDir, commit: false });

  assert.equal(result.git, "initialized");
  assert.equal(fs.existsSync(path.join(targetDir, ".git")), true);
});

test("is idempotent after initialization", (t) => {
  const targetDir = workspace(t);
  initProject({ targetDir, git: false });
  const first = fs.readFileSync(path.join(targetDir, ".ai-workflow", "PROJECT.md"), "utf8");
  const result = initProject({ targetDir, projectName: "Changed", git: false });

  assert.equal(result.alreadyInitialized, true);
  assert.equal(
    fs.readFileSync(path.join(targetDir, ".ai-workflow", "PROJECT.md"), "utf8"),
    first,
  );
});

test("refuses to scaffold an unknown non-empty directory", (t) => {
  const targetDir = workspace(t);
  fs.writeFileSync(path.join(targetDir, "existing.txt"), "keep", "utf8");

  assert.throws(
    () => initProject({ targetDir, git: false }),
    /target directory must be empty/,
  );
  assert.equal(fs.readFileSync(path.join(targetDir, "existing.txt"), "utf8"), "keep");
});
