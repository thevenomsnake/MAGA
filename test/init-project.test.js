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
  assert.match(project, /workflow_version: 0\.7\.0/);
  assert.match(project, /status: onboarding/);
  assert.match(project, /## Active Tickets/);
  assert.doesNotMatch(project, /task_creation|Active Missions/);
  const agents = fs.readFileSync(path.join(targetDir, "AGENTS.md"), "utf8");
  assert.match(agents, /Never ask the user to invoke a Skill/);
  assert.match(agents, /Do not pre-create generic discussion, research, prototype, or implementation tasks/);
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

test("routes specifically named professional workspaces on demand", () => {
  const pluginRoot = path.join(REPOSITORY_ROOT, "plugins", "kann-workflows");
  const projectLeadRoot = path.join(pluginRoot, "skills", "project-lead");
  const projectLead = fs.readFileSync(path.join(projectLeadRoot, "SKILL.md"), "utf8");
  const routing = fs.readFileSync(
    path.join(projectLeadRoot, "references", "capability-routing.md"),
    "utf8",
  );
  const nativeLoop = fs.readFileSync(
    path.join(projectLeadRoot, "references", "native-codex-loop.md"),
    "utf8",
  );
  const memory = fs.readFileSync(
    path.join(projectLeadRoot, "references", "project-memory.md"),
    "utf8",
  );
  const orchestration = fs.readFileSync(
    path.join(pluginRoot, "skills", "orchestrate-tickets", "SKILL.md"),
    "utf8",
  );
  const manifest = JSON.parse(
    fs.readFileSync(path.join(pluginRoot, ".codex-plugin", "plugin.json"), "utf8"),
  );

  assert.match(projectLead, /only generic pinned entry/);
  assert.match(projectLead, /references\/capability-routing\.md/);
  assert.match(routing, /Never initialize empty tasks named only/);
  assert.match(routing, /Name The Work, Not The Capability/);
  assert.match(routing, /Leave bounded workers unpinned and archive them/);
  assert.match(routing, /do not change its invocation metadata/);
  assert.match(routing, /real managed queue/);
  assert.match(nativeLoop, /Never pre-create empty capability tasks/);
  assert.match(nativeLoop, /specific object is not authoritative/);
  assert.match(memory, /workspace: <optional research \| prototype \| delivery/);
  assert.match(memory, /## Execution[\s\S]+Task title: pending[\s\S]+Attempt: pending/);
  assert.match(memory, /Validation: pending/);
  assert.match(memory, /integrated, deferred, or superseded/);
  assert.match(orchestration, /approved research, prototype, diagnosis, review, delivery, or release Tickets/);
  assert.match(orchestration, /Never create or keep a worker titled only with a generic capability/);
  assert.match(orchestration, /every selected Ticket records `authorization: approved`/);
  assert.equal(manifest.interface.defaultPrompt.length, 4);
});

test("ships the GitHub routing guide and hero", () => {
  const readme = fs.readFileSync(path.join(REPOSITORY_ROOT, "README.md"), "utf8");
  const diagram = readme.match(/```mermaid\n([\s\S]+?)```/)?.[1];
  const hero = fs.readFileSync(
    path.join(REPOSITORY_ROOT, "assets", "kann-workflows-routing-hero.png"),
  );

  assert.match(readme, /assets\/kann-workflows-routing-hero\.png/);
  assert.match(readme, /## 自动路由如何工作/);
  assert.match(readme, /### Project Lead 完整路由表/);
  assert.match(readme, /### 授权如何约束自动路由/);
  assert.match(readme, /### 自动路由的现实边界/);
  assert.match(readme, /同一 Ticket 在范围不变时[\s\S]+保留原有 `approved`/);
  assert.match(readme, /执行中被撤销时，在安全[\s\S]+边界停止/);
  assert.match(readme, /共享 checkout[\s\S]+协调者保持只读/);
  assert.match(readme, /visual critique/);
  assert.match(readme, /release handoff/);
  assert.ok(diagram);
  const shapedNodeIds = [...diagram.matchAll(/\b([A-Z][A-Z0-9]*)\s*(?=\[|\{)/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(
    shapedNodeIds.filter((id, index) => shapedNodeIds.indexOf(id) !== index),
    [],
  );
  assert.deepEqual(
    [...hero.subarray(0, 8)],
    [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
  );
  assert.ok(hero.readUInt32BE(16) >= 1600);
  assert.ok(hero.readUInt32BE(20) >= 500);
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
