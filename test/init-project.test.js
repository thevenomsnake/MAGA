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
  assert.equal(fs.existsSync(path.join(targetDir, ".gitattributes")), true);
  assert.equal(fs.existsSync(path.join(targetDir, ".gitignore")), true);
  assert.equal(fs.existsSync(path.join(targetDir, ".ai-workflow", "PROJECT.md")), true);
  assert.equal(fs.existsSync(path.join(targetDir, ".ai-workflow", "design")), false);
  const project = fs.readFileSync(path.join(targetDir, ".ai-workflow", "PROJECT.md"), "utf8");
  assert.match(project, /schema_version: 2/);
  assert.match(project, /workflow_version: 0\.14\.1/);
  assert.match(project, /status: onboarding/);
  assert.match(project, /## Project Profile/);
  assert.match(project, /recommend a profile, and ask the Product Owner to confirm or correct/);
  assert.match(project, /Validation profile has not been confirmed/);
  assert.match(project, /## Autonomy Policy/);
  assert.match(project, /bounded number\s+of named workers inside already approved Tickets/);
  assert.match(project, /## Active Tickets/);
  assert.doesNotMatch(project, /task_creation|Active Missions/);
  const agents = fs.readFileSync(path.join(targetDir, "AGENTS.md"), "utf8");
  assert.match(agents, /Never ask the user to invoke a Skill/);
  assert.match(agents, /request to discuss, explore, or research an unresolved product direction/);
  assert.match(agents, /Do not ask a second task-creation question/);
  assert.match(agents, /never recursively open another exploration task/);
  assert.match(agents, /A Ticket worker returns a new product question to the Project Lead/);
  assert.match(agents, /return its accepted decision to the Project Lead before creating Tickets or writing code/);
  assert.match(agents, /For Ticket workers[\s\S]+Autonomy Policy/);
  assert.match(agents, /recommend current use, exposure, delivery, and system size/);
  assert.match(agents, /ask the Product Owner to confirm or correct the profile/);
  assert.match(agents, /record the current branch, full HEAD, and dirty file set/);
  assert.match(agents, /git -c core\.autocrlf=false archive/);
  assert.equal(
    fs.readFileSync(path.join(targetDir, ".gitattributes"), "utf8"),
    "# Canonical text bytes for worktrees, Git blobs, generated artifacts, and release archives.\n* text=auto eol=lf\n",
  );
  for (const file of ["AGENTS.md", ".gitattributes", ".gitignore", ".ai-workflow/PROJECT.md"]) {
    assert.doesNotMatch(fs.readFileSync(path.join(targetDir, file), "utf8"), /\r\n/, file);
  }
});

test("ships per-Ticket execution authorization", () => {
  const projectLead = fs.readFileSync(
    path.join(REPOSITORY_ROOT, "plugins", "maga", "skills", "project-lead", "SKILL.md"),
    "utf8",
  );
  const memory = fs.readFileSync(
    path.join(REPOSITORY_ROOT, "plugins", "maga", "skills", "project-lead", "references", "project-memory.md"),
    "utf8",
  );
  const orchestration = fs.readFileSync(
    path.join(REPOSITORY_ROOT, "plugins", "maga", "skills", "orchestrate-tickets", "SKILL.md"),
    "utf8",
  );

  assert.match(memory, /key: T001[\s\S]+authorization: pending/);
  assert.match(memory, /## Autonomy Policy[\s\S]+Dispatch: approved \| pending/);
  assert.match(memory, /Task opening: standing-policy/);
  assert.match(memory, /future Ticket/);
  assert.match(projectLead, /Set `authorization: approved` on exactly those Tickets/);
  assert.match(orchestration, /every selected Ticket records `authorization: approved`/);
  assert.doesNotMatch(projectLead, /task_creation/);
  assert.doesNotMatch(orchestration, /task_creation: approved/);
});

test("routes specifically named professional workspaces on demand", () => {
  const pluginRoot = path.join(REPOSITORY_ROOT, "plugins", "maga");
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
  const exploration = fs.readFileSync(
    path.join(projectLeadRoot, "references", "exploration-loop.md"),
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
  assert.match(projectLead, /references\/exploration-loop\.md/);
  assert.match(routing, /Never initialize empty tasks named only/);
  assert.match(routing, /Name The Work, Not The Capability/);
  assert.match(routing, /Leave bounded workers unpinned and archive them/);
  assert.match(routing, /Load Internal Methods By Exact Path/);
  assert.match(routing, /Never synthesize a `\$<method-name>` invocation/);
  assert.match(routing, /methods\/implement\/METHOD\.md/);
  assert.match(routing, /real managed queue/);
  assert.match(nativeLoop, /Never pre-create empty capability tasks/);
  assert.match(nativeLoop, /specific object is not authoritative/);
  assert.match(exploration, /Route by meaning, not keywords/);
  assert.match(exploration, /thin brief/);
  assert.match(exploration, /Never create an[\s\S]+chain of exploration tasks/);
  assert.match(exploration, /Do not edit local files, create Tickets,[\s\S]+create another task/);
  assert.match(exploration, /Implementation authorization: approved \| pending/);
  assert.match(exploration, /match the canonical Project Lead title[\s\S]+send the packet there/);
  assert.match(exploration, /normal named-worker approval and orchestration rules/);
  assert.match(memory, /workspace: <optional research \| prototype \| delivery/);
  assert.match(memory, /## Execution[\s\S]+Task title: pending[\s\S]+Attempt: pending/);
  assert.match(memory, /Validation: pending/);
  assert.match(memory, /integrated, deferred, or superseded/);
  assert.match(orchestration, /approved research, prototype, diagnosis, review, delivery, or release Tickets/);
  assert.match(orchestration, /Never create or keep a worker titled only with a generic capability/);
  assert.match(orchestration, /every selected Ticket records `authorization: approved`/);
  assert.equal(manifest.interface.defaultPrompt.length, 3);
  assert.equal(manifest.mcpServers, "./.mcp.json");
  assert.match(manifest.interface.defaultPrompt.join(" "), /model and reasoning depth/);
});

test("ships localized product guides, beginner manuals, and one English comparison", () => {
  const readmeFiles = [
    "README.md",
    "README.zh-CN.md",
    "README.ja.md",
    "README.ko.md",
    "README.es.md",
  ];
  const readmes = readmeFiles.map((file) =>
    fs.readFileSync(path.join(REPOSITORY_ROOT, file), "utf8")
  );
  const guideFiles = [
    "docs/getting-started.md",
    "docs/getting-started.zh-CN.md",
    "docs/getting-started.ja.md",
    "docs/getting-started.ko.md",
    "docs/getting-started.es.md",
  ];
  const guides = guideFiles.map((file) =>
    fs.readFileSync(path.join(REPOSITORY_ROOT, file), "utf8")
  );
  const readme = readmes[0];
  const guide = guides[0];
  const publicSurfaceContract = fs.readFileSync(
    path.join(REPOSITORY_ROOT, "docs", "public-surface-contract.md"),
    "utf8",
  );
  const comparison = fs.readFileSync(
    path.join(REPOSITORY_ROOT, "assets", "maga-operating-model.svg"),
    "utf8",
  );

  for (const [index, localizedReadme] of readmes.entries()) {
    assert.match(localizedReadme, /assets\/maga-operating-model\.svg/);
    assert.match(localizedReadme, /website\/design\/hero-concept\.png/);
    assert.match(localizedReadme, /https:\/\/maga\.sumimi\.jp\//);
    assert.match(localizedReadme, /Sol · xhigh/);
    assert.match(localizedReadme, /Luna · max/);
    assert.ok(localizedReadme.includes(guideFiles[index]));
    assert.doesNotMatch(localizedReadme, /npx github:thevenomsnake\/MAGA/);
    assert.doesNotMatch(localizedReadme, /玩梗|带梗|竞选承诺|No rallies|explaining the joke/i);
  }

  for (const localizedGuide of guides) {
    assert.match(localizedGuide, /github\.com\/thevenomsnake\/MAGA/);
    assert.match(localizedGuide, /Uninstall plugin/);
    assert.match(localizedGuide, /agent-approvals-security/);
    assert.match(localizedGuide, /Project Lead/);
    assert.doesNotMatch(
      localizedGuide,
      /new (?:Codex )?chat|chat nuevo|新しい[^\n]*チャット|새 [^\n]*채팅|新建[^\n]*聊天/i,
    );
  }

  const loopsByLocale = new Map(
    [...publicSurfaceContract.matchAll(/^\| (English|简体中文|繁體中文|日本語|한국어|Español) \| `([^`]+)` \|$/gm)]
      .map((match) => [match[1], match[2]]),
  );
  const readmeLocales = ["English", "简体中文", "日本語", "한국어", "Español"];
  assert.equal(loopsByLocale.size, 6);
  for (const [index, locale] of readmeLocales.entries()) {
    assert.ok(readmes[index].includes(loopsByLocale.get(locale)));
  }

  const canonicalPrompt = publicSurfaceContract.match(
    /The canonical English request is:\r?\n\r?\n> ([^\r\n]+)/,
  )?.[1];
  assert.ok(canonicalPrompt);
  assert.ok(readme.includes(`> ${canonicalPrompt}`));
  assert.ok(guide.includes(`> ${canonicalPrompt}`));

  assert.match(readme, /Build the software you have in mind/);
  assert.match(readme, /one product-facing Project Lead/);
  assert.match(readme, /You do not need to choose Skills[\s\S]+or review code/);
  assert.match(readme, /No terminal experience is required/);
  assert.match(readme, /Perform the technical steps yourself/);
  assert.match(guide, /This guide assumes you have never used Codex/);
  assert.match(guide, /Inspect the product without reviewing code/);
  assert.match(guide, /Graduate from MAGA/);
  assert.match(readme, /## Why MAGA/);
  assert.match(readme, /## How MAGA works/);
  assert.match(readme, /Why a plugin instead of a wrapper app\?/);
  assert.match(readme, /Codex is strongest at the implementation layer/);
  assert.match(readme, /an on-ramp, not a permanent layer/);
  assert.match(readme, /greater autonomy, not permanent dependence/);
  assert.match(readme, /the plugin has done its job/);
  assert.match(readme, /Direct without restraint\. Accept with judgment\./);
  assert.match(readme, /Pro · quality first[\s\S]+Plus · regular use[\s\S]+Free \/ Go · quota saver/);
  assert.match(readme, /\*\*Luna\*\* is only recommended at \*\*max\*\*/);
  assert.doesNotMatch(readme, /The wrapper is the installed working contract/);
  assert.doesNotMatch(readme, /```mermaid|maga-product-vision-hero|maga-routing-hero/);

  for (const label of [
    "ENTRY",
    "ORCHESTRATION",
    "TECHNICAL WORK",
    "ACCEPTANCE",
    "CONTINUITY",
  ]) {
    assert.match(comparison, new RegExp(`>${label}<`));
  }
  assert.match(comparison, /THE SAME CODEX\. A DIFFERENT OPERATING MODEL\./);
  assert.match(comparison, /YOU OPERATE THE TOOLCHAIN/);
  assert.match(comparison, /YOU OWN THE PRODUCT/);
  assert.match(comparison, /viewBox="0 0 1600 1040"/);
  assert.deepEqual(
    fs.readdirSync(path.join(REPOSITORY_ROOT, "assets")).sort(),
    ["maga-operating-model.svg"],
  );
});

test("keeps package, plugin, workflow, bridge, and MCP versions aligned", () => {
  const packageVersion = JSON.parse(
    fs.readFileSync(path.join(REPOSITORY_ROOT, "package.json"), "utf8"),
  ).version;
  const pluginVersion = JSON.parse(
    fs.readFileSync(
      path.join(REPOSITORY_ROOT, "plugins", "maga", ".codex-plugin", "plugin.json"),
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
  assert.match(
    fs.readFileSync(
      path.join(REPOSITORY_ROOT, "plugins", "maga", "mcp", "server.mjs"),
      "utf8",
    ),
    new RegExp(`SERVER_VERSION = "${escapedVersion}"`),
  );
  assert.match(
    fs.readFileSync(path.join(REPOSITORY_ROOT, "src", "codex-bridge.js"), "utf8"),
    /clientInfo:\s*\{\s*name: "maga",\s*title: "MAGA"/,
  );
});

test("ships MIT and upstream notices with the package and plugin", () => {
  const packageMetadata = JSON.parse(
    fs.readFileSync(path.join(REPOSITORY_ROOT, "package.json"), "utf8"),
  );
  const pluginRoot = path.join(REPOSITORY_ROOT, "plugins", "maga");
  const pluginMetadata = JSON.parse(
    fs.readFileSync(path.join(pluginRoot, ".codex-plugin", "plugin.json"), "utf8"),
  );

  assert.equal(packageMetadata.license, "MIT");
  assert.equal(pluginMetadata.license, "MIT");
  assert.equal(packageMetadata.files.includes("THIRD_PARTY_NOTICES.md"), true);
  for (const documentationRoot of ["design/", "playbooks/", "research/"]) {
    assert.equal(packageMetadata.files.includes(documentationRoot), true, documentationRoot);
  }

  for (const root of [REPOSITORY_ROOT, pluginRoot]) {
    const license = fs.readFileSync(path.join(root, "LICENSE"), "utf8");
    const notices = fs.readFileSync(path.join(root, "THIRD_PARTY_NOTICES.md"), "utf8");

    assert.match(license, /^MIT License/);
    assert.match(notices, /Copyright \(c\) 2026 Matt Pocock/);
    assert.match(notices, /Copyright \(c\) 2026 DietrichGebert/);
    assert.match(notices, /Copyright \(c\) 2026 Human Writing Skill contributors/);
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
