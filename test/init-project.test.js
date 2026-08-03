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
  const project = fs.readFileSync(path.join(targetDir, ".ai-workflow", "PROJECT.md"), "utf8");
  assert.match(project, /schema_version: 2/);
  assert.match(project, /workflow_version: 0\.6\.0/);
  assert.match(project, /status: onboarding/);
  assert.match(project, /## Active Tickets/);
  assert.doesNotMatch(project, /task_creation|Active Missions/);
  assert.match(
    fs.readFileSync(path.join(targetDir, "AGENTS.md"), "utf8"),
    /Never ask the user to invoke a Skill/,
  );
});

test("ships per-Ticket execution authorization", () => {
  const projectLead = fs.readFileSync(
    path.join(REPOSITORY_ROOT, "plugins", "kann-workflows", "skills", "project-lead", "SKILL.md"),
    "utf8",
  );
  const memory = fs.readFileSync(
    path.join(REPOSITORY_ROOT, "plugins", "kann-workflows", "skills", "project-lead", "references", "project-memory.md"),
    "utf8",
  );
  const orchestration = fs.readFileSync(
    path.join(REPOSITORY_ROOT, "plugins", "kann-workflows", "skills", "orchestrate-tickets", "SKILL.md"),
    "utf8",
  );

  assert.match(memory, /key: T001[\s\S]+authorization: pending/);
  assert.match(memory, /future Ticket/);
  assert.match(projectLead, /Set `authorization: approved` on exactly those Tickets/);
  assert.match(orchestration, /every selected Ticket records `authorization: approved`/);
  assert.doesNotMatch(projectLead, /task_creation/);
  assert.doesNotMatch(orchestration, /task_creation: approved/);
});

test("keeps package, plugin, workflow, and bridge versions aligned", () => {
  const packageVersion = JSON.parse(
    fs.readFileSync(path.join(REPOSITORY_ROOT, "package.json"), "utf8"),
  ).version;
  const pluginVersion = JSON.parse(
    fs.readFileSync(
      path.join(REPOSITORY_ROOT, "plugins", "kann-workflows", ".codex-plugin", "plugin.json"),
      "utf8",
    ),
  ).version;
  const escapedVersion = packageVersion.replaceAll(".", "\\.");

  assert.equal(pluginVersion, packageVersion);
  assert.match(
    fs.readFileSync(path.join(REPOSITORY_ROOT, "src", "init-project.js"), "utf8"),
    new RegExp(`WORKFLOW_VERSION = "${escapedVersion}"`),
  );
  assert.match(
    fs.readFileSync(path.join(REPOSITORY_ROOT, "src", "codex-bridge.js"), "utf8"),
    new RegExp(`BRIDGE_VERSION = "${escapedVersion}"`),
  );
});

test("ships MIT and upstream notices with the package and plugin", () => {
  const packageMetadata = JSON.parse(
    fs.readFileSync(path.join(REPOSITORY_ROOT, "package.json"), "utf8"),
  );
  const pluginRoot = path.join(REPOSITORY_ROOT, "plugins", "kann-workflows");
  const pluginMetadata = JSON.parse(
    fs.readFileSync(path.join(pluginRoot, ".codex-plugin", "plugin.json"), "utf8"),
  );

  assert.equal(packageMetadata.license, "MIT");
  assert.equal(pluginMetadata.license, "MIT");
  assert.equal(packageMetadata.files.includes("THIRD_PARTY_NOTICES.md"), true);

  for (const root of [REPOSITORY_ROOT, pluginRoot]) {
    const license = fs.readFileSync(path.join(root, "LICENSE"), "utf8");
    const notices = fs.readFileSync(path.join(root, "THIRD_PARTY_NOTICES.md"), "utf8");

    assert.match(license, /^MIT License/);
    assert.match(notices, /Copyright \(c\) 2026 Matt Pocock/);
    assert.match(notices, /Copyright \(c\) 2026 DietrichGebert/);
  }
});

test("initializes a repository at the project root", (t) => {
  const targetDir = workspace(t);
  const result = initProject({ targetDir, commit: false });

  assert.equal(result.git, "initialized");
  assert.equal(fs.existsSync(path.join(targetDir, ".git")), true);
});

test("is idempotent after initialization", (t) => {
  const targetDir = workspace(t);
  initProject({ targetDir, projectName: "Original", git: false });
  const first = fs.readFileSync(path.join(targetDir, ".ai-workflow", "PROJECT.md"), "utf8");
  const result = initProject({ targetDir, projectName: "Changed", git: false });

  assert.equal(result.alreadyInitialized, true);
  assert.equal(result.projectName, "Original");
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
