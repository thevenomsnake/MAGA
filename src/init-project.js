import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const WORKFLOW_VERSION = "0.11.0";

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

export function readProjectName(targetDir) {
  const marker = path.join(path.resolve(targetDir), ".ai-workflow", "PROJECT.md");
  if (!fs.existsSync(marker)) {
    throw new Error(`MAGA is not initialized in ${path.resolve(targetDir)}`);
  }

  const match = fs.readFileSync(marker, "utf8").match(/^project_name:\s*(.+)$/m);
  if (!match) return path.basename(path.resolve(targetDir));
  try {
    return String(JSON.parse(match[1]));
  } catch {
    return match[1].replace(/^['"]|['"]$/g, "");
  }
}

function projectDocument(projectName) {
  return `---
schema_version: 2
workflow_version: ${WORKFLOW_VERSION}
status: onboarding
project_name: ${JSON.stringify(projectName)}
---

# ${projectName}

## Product Direction

Pending the Product Owner's first description. Establish the intended user, problem,
first observable value, delivery form, and material risk boundaries before dispatching work.

## Current State

- MAGA initialized.
- Product onboarding has not started.

## Roles

- **Project Lead**: single product-facing entry; materialize its role contract during onboarding.

## Active Tickets

None.

## Durable Pointers

Create role, ticket, decision, and archive records lazily as the project requires them.
Use repository-relative links; never persist local task identifiers or machine paths.
`;
}

function agentsDocument() {
  return `# Project Instructions

## Product Collaboration

- Treat the user as Product Owner and keep one Project Lead as the product-facing entry.
- Treat natural-language requests to build, change, continue, or recover the product as Project Lead work. Never ask the user to invoke a Skill or workflow command.
- Do not pre-create generic discussion, research, prototype, or implementation tasks. Keep product discussion in the Project Lead; propose a specifically named task only after its work object and boundary are concrete, and create it only after the Product Owner explicitly approves that title.
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

  const commit = runGit(targetDir, ["commit", "-m", "chore: initialize maga"]);
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
      projectName: readProjectName(targetDir),
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
