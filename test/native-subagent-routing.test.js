import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { initProject } from "../src/init-project.js";

const REPOSITORY_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TEST_ROOT = path.join(REPOSITORY_ROOT, "tmp", "tests");

function read(...segments) {
  return fs.readFileSync(path.join(REPOSITORY_ROOT, ...segments), "utf8");
}

test("keeps native execution shapes and authority separate", () => {
  const memory = read(
    "plugins",
    "maga",
    "skills",
    "project-lead",
    "references",
    "project-memory.md",
  );
  const nativeLoop = read(
    "plugins",
    "maga",
    "skills",
    "project-lead",
    "references",
    "native-codex-loop.md",
  );
  const routing = read(
    "plugins",
    "maga",
    "skills",
    "project-lead",
    "references",
    "capability-routing.md",
  );
  const orchestration = read(
    "plugins",
    "maga",
    "skills",
    "orchestrate-tickets",
    "SKILL.md",
  );

  assert.match(memory, /Delegate: approved \| pending/);
  assert.match(memory, /Max active subagents: <positive integer or none>/);
  assert.match(memory, /read-only native subagents/);
  assert.match(nativeLoop, /Choose The Smallest Native Shape/);
  assert.match(nativeLoop, /Subagents never edit, commit, create tasks/);
  assert.match(routing, /\| Native subagent \|/);
  assert.match(routing, /Do not use a subagent to bypass/);
  assert.match(orchestration, /native subagent before opening a worker/);
  assert.match(orchestration, /A subagent cannot write, commit/);
  assert.doesNotMatch(orchestration, /fresh project task for every Ticket/);
});

test("initializes the bounded Delegate policy for new projects", (t) => {
  fs.mkdirSync(TEST_ROOT, { recursive: true });
  const targetDir = fs.mkdtempSync(path.join(TEST_ROOT, "native-subagent-"));
  t.after(() => fs.rmSync(targetDir, { recursive: true, force: true }));

  initProject({ targetDir, projectName: "Native Shape", git: false });
  const project = fs.readFileSync(
    path.join(targetDir, ".ai-workflow", "PROJECT.md"),
    "utf8",
  );
  const agents = fs.readFileSync(path.join(targetDir, "AGENTS.md"), "utf8");

  assert.match(project, /delegate up to two ephemeral read-only subagents/);
  assert.match(project, /subagent cannot write,\s*commit,\s*create tasks/);
  assert.match(agents, /use a native subagent only when the confirmed `Delegate` policy/);
  assert.match(agents, /For Ticket workers, propose a specifically named task/);
});
