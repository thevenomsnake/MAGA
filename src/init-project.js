import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const WORKFLOW_VERSION = "0.1.0";

function runGit(targetDir, args) {
  return spawnSync("git", args, {
    cwd: targetDir,
    encoding: "utf8",
    shell: false,
  });
}

function assertSafeTarget(targetDir) {
  const resolved = path.resolve(targetDir);
  if (resolved === path.parse(resolved).root) {
    throw new Error("refusing to initialize a filesystem root");
  }
  if (fs.existsSync(resolved) && fs.lstatSync(resolved).isSymbolicLink()) {
    throw new Error("refusing to initialize through a symbolic link");
  }
  return resolved;
}

function requireGit() {
  const result = spawnSync("git", ["--version"], { encoding: "utf8", shell: false });
  if (result.error || result.status !== 0) {
    throw new Error("Git is required unless --no-git is used");
  }
}

function projectDocument(projectName) {
  return `---
schema_version: 1
workflow_version: ${WORKFLOW_VERSION}
status: onboarding
project_name: ${JSON.stringify(projectName)}
task_creation: ask-once
---

# ${projectName}

## Product Direction

Pending the Product Owner's first description.

## Current State

- Kann Workflows initialized.
- Product onboarding has not started.

## Roles

- **Project Lead**: single product-facing entry; responsibilities will be refined after onboarding.

## Active Missions

None.

## Durable Pointers

Create role, mission, decision, and archive records lazily as the project requires them.
`;
}

function agentsDocument() {
  return `# Project Instructions

## Product Collaboration

- Treat the user as Product Owner and keep one Project Lead as the product-facing entry.
- Read \`.ai-workflow/PROJECT.md\` before planning or dispatching work.
- Ask only product decisions that materially change behavior, experience, cost, permissions, privacy, irreversible actions, or release risk.
- Keep roles durable and Codex task instances replaceable. Do not store task IDs or machine paths in tracked files.

## Delivery

For software changes, clarify the observable outcome, implement the shortest runnable vertical slice, run one risk-matched focused verification, and commit.

Do not default to TDD, BDD, full regression suites, multi-viewport matrices, dual-axis review, or repeated validation unless the user explicitly requests them or a documented high-risk boundary requires them.

## Filesystem And Privacy

- Keep all project files, generated artifacts, caches, and temporary files under this repository root.
- Do not expose private paths, usernames, account details, task IDs, internal systems, secrets, or identifiable business data in public artifacts.
`;
}

const GITIGNORE = `.env
.env.*
!.env.example
tmp/
.ai-workflow/runtime.json
`;

function hasGitIdentity(targetDir) {
  const name = runGit(targetDir, ["config", "user.name"]);
  const email = runGit(targetDir, ["config", "user.email"]);
  return name.status === 0 && name.stdout.trim() && email.status === 0 && email.stdout.trim();
}

function initializeGit(targetDir) {
  if (fs.existsSync(path.join(targetDir, ".git"))) return "existing";

  let result = runGit(targetDir, ["init", "-b", "main"]);
  if (result.status !== 0) {
    result = runGit(targetDir, ["init"]);
    if (result.status === 0) runGit(targetDir, ["branch", "-M", "main"]);
  }
  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || "git init failed");
  }
  return "initialized";
}

function commitInitialState(targetDir) {
  if (!hasGitIdentity(targetDir)) return "skipped-no-identity";

  const add = runGit(targetDir, ["add", "--", "AGENTS.md", ".gitignore", ".ai-workflow/PROJECT.md"]);
  if (add.status !== 0) throw new Error(add.stderr.trim() || "git add failed");

  const commit = runGit(targetDir, ["commit", "-m", "chore: initialize kann workflows"]);
  if (commit.status !== 0) throw new Error(commit.stderr.trim() || "git commit failed");
  return "created";
}

export function initProject(options = {}) {
  const targetDir = assertSafeTarget(options.targetDir || process.cwd());
  if (options.git !== false) requireGit();
  fs.mkdirSync(targetDir, { recursive: true });

  const marker = path.join(targetDir, ".ai-workflow", "PROJECT.md");
  if (fs.existsSync(marker)) {
    return {
      targetDir,
      projectName: options.projectName || path.basename(targetDir),
      alreadyInitialized: true,
      git: fs.existsSync(path.join(targetDir, ".git")) ? "existing" : "disabled",
      commit: "unchanged",
    };
  }

  const entries = fs.readdirSync(targetDir).filter((entry) => entry !== ".git");
  if (entries.length > 0) {
    throw new Error(`target directory must be empty; found: ${entries.join(", ")}`);
  }

  const projectName = options.projectName?.trim() || path.basename(targetDir);
  if (!projectName) throw new Error("project name cannot be empty");

  fs.mkdirSync(path.join(targetDir, ".ai-workflow"), { recursive: true });
  fs.writeFileSync(path.join(targetDir, "AGENTS.md"), agentsDocument(), "utf8");
  fs.writeFileSync(path.join(targetDir, ".gitignore"), GITIGNORE, "utf8");
  fs.writeFileSync(marker, projectDocument(projectName), "utf8");

  const git = options.git === false ? "disabled" : initializeGit(targetDir);
  const commit = options.git === false || options.commit === false
    ? "skipped"
    : commitInitialState(targetDir);

  return { targetDir, projectName, alreadyInitialized: false, git, commit };
}
