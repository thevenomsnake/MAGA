import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const REPOSITORY_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PLUGIN_ROOT = path.join(REPOSITORY_ROOT, "plugins", "maga");
const SKILLS_ROOT = path.join(PLUGIN_ROOT, "skills");
const METHODS_ROOT = path.join(PLUGIN_ROOT, "methods");

const MAGA_SKILLS = ["bar-tester", "orchestrate-tickets", "project-lead"];
const HUMANIZATION_SKILLS = ["humanization"];
const MATT_INTERNAL_METHODS = [
  "ask-matt",
  "grill-me",
  "grill-with-docs",
  "handoff",
  "implement",
  "improve-codebase-architecture",
  "setup-matt-pocock-skills",
  "teach",
  "to-questionnaire",
  "to-spec",
  "to-tickets",
  "triage",
  "wayfinder",
];
const MATT_REGISTERED_SKILLS = [
  "code-review",
  "codebase-design",
  "diagnosing-bugs",
  "domain-modeling",
  "grilling",
  "prototype",
  "research",
  "resolving-merge-conflicts",
  "tdd",
  "wait-what",
  "writing-for-agents",
];
const PONYTAIL_SKILLS = [
  "ponytail",
  "ponytail-audit",
  "ponytail-debt",
  "ponytail-review",
];
const ABSORBED_PONYTAIL_SKILLS = ["ponytail-gain", "ponytail-help"];
const ABSORBED_MATT_CAPABILITIES = ["wizard"];
const ABSORBED_UPSTREAM_CAPABILITIES = [
  ...ABSORBED_MATT_CAPABILITIES,
  ...ABSORBED_PONYTAIL_SKILLS,
];
const REGISTERED_SKILLS = [
  ...MAGA_SKILLS,
  ...HUMANIZATION_SKILLS,
  ...MATT_REGISTERED_SKILLS,
  ...PONYTAIL_SKILLS,
];

function read(...segments) {
  return fs.readFileSync(path.join(...segments), "utf8");
}

function childDirectories(root) {
  return fs.readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function quotedMetadataValue(metadata, key) {
  return metadata.match(new RegExp(`^\\s*${key}:\\s*"([^"]+)"\\s*$`, "m"))?.[1];
}

function repositoryFiles(root) {
  const files = [];
  const ignoredDirectories = new Set([
    ".git",
    ".tmp",
    ".cache",
    "tmp",
    "node_modules",
    "dist",
    ".wrangler",
  ]);
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const target = path.join(root, entry.name);
    if (entry.isDirectory()) files.push(...repositoryFiles(target));
    else files.push(target);
  }
  return files;
}

test("hard-cuts the retired plugin identity", () => {
  const retiredBrand = ["ka", "nn"].join("");
  const packageMetadata = JSON.parse(read(REPOSITORY_ROOT, "package.json"));
  const pluginMetadata = JSON.parse(read(PLUGIN_ROOT, ".codex-plugin", "plugin.json"));
  const marketplace = JSON.parse(read(REPOSITORY_ROOT, ".agents", "plugins", "marketplace.json"));

  assert.equal(packageMetadata.name, "maga");
  assert.deepEqual(Object.keys(packageMetadata.bin), ["maga"]);
  assert.equal(pluginMetadata.name, "maga");
  assert.equal(pluginMetadata.interface.displayName, "MAGA");
  assert.match(pluginMetadata.interface.shortDescription, /Make Apps Great Again/);
  assert.equal(marketplace.name, "maga");
  assert.equal(marketplace.plugins[0].name, "maga");
  assert.equal(marketplace.plugins[0].source.path, "./plugins/maga");

  for (const file of repositoryFiles(REPOSITORY_ROOT)) {
    assert.doesNotMatch(path.relative(REPOSITORY_ROOT, file), new RegExp(retiredBrand, "i"));
    if (path.extname(file).toLowerCase() === ".png") continue;
    const content = fs.readFileSync(file);
    if (content.includes(0)) continue;
    assert.doesNotMatch(content.toString("utf8"), new RegExp(retiredBrand, "i"), file);
  }
});

test("exposes exactly 19 product Skills and keeps 13 methods internal", () => {
  assert.deepEqual(childDirectories(SKILLS_ROOT), [...REGISTERED_SKILLS].sort());
  assert.deepEqual(childDirectories(METHODS_ROOT), [...MATT_INTERNAL_METHODS].sort());

  for (const skill of REGISTERED_SKILLS) {
    assert.equal(fs.existsSync(path.join(SKILLS_ROOT, skill, "SKILL.md")), true, skill);
  }

  for (const method of MATT_INTERNAL_METHODS) {
    assert.equal(fs.existsSync(path.join(METHODS_ROOT, method, "METHOD.md")), true, method);
    assert.equal(fs.existsSync(path.join(METHODS_ROOT, method, "SKILL.md")), false, method);
    assert.equal(fs.existsSync(path.join(METHODS_ROOT, method, "agents", "openai.yaml")), false, method);
    assert.equal(fs.existsSync(path.join(SKILLS_ROOT, method)), false, method);
  }
});

test("gives every registered Skill a product label and implicit routing contract", () => {
  const catalog = JSON.parse(read(PLUGIN_ROOT, "skill-catalog.json"));
  const registeredCatalog = catalog.skills.filter((entry) => entry.status === "registered");

  assert.equal(registeredCatalog.length, 19);
  for (const skill of REGISTERED_SKILLS) {
    const instructions = read(SKILLS_ROOT, skill, "SKILL.md");
    const metadata = read(SKILLS_ROOT, skill, "agents", "openai.yaml");
    const displayName = quotedMetadataValue(metadata, "display_name");
    const shortDescription = quotedMetadataValue(metadata, "short_description");
    const defaultPrompt = quotedMetadataValue(metadata, "default_prompt");
    const catalogEntry = registeredCatalog.find((entry) => entry.id === skill);

    assert.match(instructions, new RegExp(`^---[\\s\\S]*?^name:\\s*${skill}\\s*$`, "m"), skill);
    assert.match(displayName, /^MAGA [A-Z]/, skill);
    assert.ok(shortDescription.length >= 25 && shortDescription.length <= 64, skill);
    assert.match(defaultPrompt, new RegExp(`\\$${skill}(?:\\s|$)`), skill);
    assert.match(metadata, /policy:\s*\r?\n\s*allow_implicit_invocation:\s*true/, skill);
    assert.equal(catalogEntry?.display_name, displayName, skill);
    assert.equal(catalogEntry?.invocation, "implicit", skill);
  }
});

test("routes local-file text through Humanization without touching chat-only output", () => {
  const root = path.join(SKILLS_ROOT, "humanization");
  const instructions = read(root, "SKILL.md");
  const metadata = read(root, "agents", "openai.yaml");

  assert.equal(read(root, "VERSION").trim(), "3.0.0");
  assert.match(instructions, /Use automatically only when a task will create or update a local file containing prose or audience-facing copy/);
  assert.match(instructions, /唯一的自动判据是：本次工作是否会产生本地文件变更/);
  assert.match(instructions, /仅在聊天中返回的普通问答、解释、文章、邮件\s*草稿/);
  assert.match(instructions, /可直接复制或以后可能被分享/);
  assert.match(instructions, /不声明、引用或解释本 Skill 已运行/);
  assert.match(instructions, /不为本 Skill 单独追问/);
  assert.match(instructions, /代码、命令、路径、URL/);
  assert.match(instructions, /author_sample/);
  assert.match(read(root, "references", "core.md"), /任务内作者样本校准/);
  assert.match(read(root, "references", "core.md"), /不要保存或跨任务复用校准记录/);
  assert.doesNotMatch(metadata, /Humanize answers/);
  assert.match(metadata, /allow_implicit_invocation:\s*true/);
  assert.match(read(root, "LICENSE"), /Human Writing Skill contributors/);
  for (const relative of [
    "references/core.md",
    "references/formats/gui-microcopy.md",
    "references/locales/zh-CN.md",
    "references/locales/en.md",
    "scripts/check_writing.py",
    "scripts/check_writing_smoke.py",
    "assets/icon-small.png",
    "assets/icon-large.svg",
  ]) {
    assert.equal(fs.existsSync(path.join(root, relative)), true, relative);
  }
});

test("registers Matt's eleven automatic capabilities without internal or retired command aliases", () => {
  const removedCommand = new RegExp(
    `\\$(?:${[
      ...MATT_INTERNAL_METHODS,
      ...ABSORBED_MATT_CAPABILITIES,
      "writing-great-skills",
    ].join("|")})\\b`,
  );
  const routing = read(
    SKILLS_ROOT,
    "project-lead",
    "references",
    "capability-routing.md",
  );

  for (const skill of MATT_REGISTERED_SKILLS) {
    const instructions = read(SKILLS_ROOT, skill, "SKILL.md");
    assert.doesNotMatch(instructions.split("---", 3)[1], /disable-model-invocation/, skill);
  }

  assert.match(read(SKILLS_ROOT, "diagnosing-bugs", "SKILL.md"), /## Redact/);
  assert.match(read(SKILLS_ROOT, "diagnosing-bugs", "SKILL.md"), /redacted captured artifact/);

  for (const skill of REGISTERED_SKILLS) {
    assert.doesNotMatch(read(SKILLS_ROOT, skill, "SKILL.md"), removedCommand, skill);
  }

  for (const file of repositoryFiles(METHODS_ROOT).filter((file) => file.endsWith(".md"))) {
    assert.doesNotMatch(read(file), removedCommand, path.relative(METHODS_ROOT, file));
  }

  assert.match(routing, /read its linked `METHOD\.md`\s+before acting/);
  assert.match(routing, /Never synthesize a `\$<method-name>` invocation/);
  assert.doesNotMatch(routing, /original explicit entry available/i);
  for (const method of MATT_INTERNAL_METHODS) {
    assert.match(routing, new RegExp(`\\.\\.\\/\\.\\.\\/\\.\\.\\/methods/${method}/METHOD\\.md`), method);
  }
});

test("ships every Matt supporting file from both registered Skills and internal methods", () => {
  const registeredSupport = {
    "codebase-design": ["DEEPENING.md", "DESIGN-IT-TWICE.md"],
    "diagnosing-bugs": ["scripts/hitl-loop.template.sh"],
    "domain-modeling": ["ADR-FORMAT.md", "CONTEXT-FORMAT.md"],
    prototype: ["LOGIC.md", "UI.md"],
    tdd: ["mocking.md", "tests.md"],
    "writing-for-agents": ["SKILL-MECHANICS.md"],
  };
  const methodSupport = {
    "improve-codebase-architecture": ["HTML-REPORT.md"],
    "setup-matt-pocock-skills": [
      "domain.md",
      "issue-tracker-github.md",
      "issue-tracker-gitlab.md",
      "issue-tracker-local.md",
      "triage-labels.md",
    ],
    teach: [
      "GLOSSARY-FORMAT.md",
      "LEARNING-RECORD-FORMAT.md",
      "MISSION-FORMAT.md",
      "RESOURCES-FORMAT.md",
    ],
    triage: ["AGENT-BRIEF.md", "OUT-OF-SCOPE.md"],
  };

  for (const [skill, files] of Object.entries(registeredSupport)) {
    for (const file of files) {
      assert.equal(fs.existsSync(path.join(SKILLS_ROOT, skill, file)), true, `${skill}/${file}`);
    }
  }
  for (const [method, files] of Object.entries(methodSupport)) {
    for (const file of files) {
      assert.equal(fs.existsSync(path.join(METHODS_ROOT, method, file)), true, `${method}/${file}`);
    }
  }
});

test("adapts specification and delivery methods to MAGA's native project memory", () => {
  const routing = read(
    SKILLS_ROOT,
    "project-lead",
    "references",
    "capability-routing.md",
  );
  const memory = read(
    SKILLS_ROOT,
    "project-lead",
    "references",
    "project-memory.md",
  );
  const specification = read(METHODS_ROOT, "to-spec", "METHOD.md");
  const tickets = read(METHODS_ROOT, "to-tickets", "METHOD.md");
  const implementation = read(METHODS_ROOT, "implement", "METHOD.md");

  assert.match(routing, /\.ai-workflow\/PROJECT\.md[\s\S]+default authority/);
  assert.match(routing, /Do not run the setup\s+method or ask the Product Owner to choose a tracker/);
  assert.match(memory, /specs\/\s+# only when several closed decisions/);
  assert.match(memory, /## Blocked By/);
  assert.match(specification, /\.ai-workflow\/specs\/<outcome-key>\.md/);
  assert.doesNotMatch(specification, /setup-matt-pocock-skills/);
  assert.match(tickets, /Project Memory Contract/);
  assert.match(tickets, /\.ai-workflow\/tickets\//);
  assert.match(tickets, /authorization: approved/);
  assert.doesNotMatch(tickets, /setup-matt-pocock-skills/);
  assert.match(implementation, /registered `tdd` only when/);
  assert.match(implementation, /independent `code-review` only when/);
  assert.doesNotMatch(implementation, /Use \$tdd where possible/);
});

test("uses Bar Tester to catch the fried-rice boundary and confirm the profile", () => {
  const validation = read(SKILLS_ROOT, "bar-tester", "SKILL.md");
  const projectLead = read(SKILLS_ROOT, "project-lead", "SKILL.md");
  const memory = read(
    SKILLS_ROOT,
    "project-lead",
    "references",
    "project-memory.md",
  );
  const specification = read(METHODS_ROOT, "to-spec", "METHOD.md");
  const tickets = read(METHODS_ROOT, "to-tickets", "METHOD.md");
  const implementation = read(METHODS_ROOT, "implement", "METHOD.md");

  assert.match(validation, /recommended profile instead of handing classification work back to the user/);
  assert.match(validation, /My current recommendation: <Use> \/ <Exposure> \/ <Delivery> \/ <Size>/);
  assert.match(validation, /Confirm this recommendation or correct any item/);
  assert.match(validation, /Personal \/ Controlled group \/ Public/);
  assert.match(validation, /Local or offline \/ Internal network \/ Internet/);
  assert.match(validation, /Run from source \/ Shared artifact \/ Public release/);
  assert.match(validation, /Size: Small \/ Medium \/ Large/);
  assert.match(validation, /still summarize the mapping once and obtain confirmation/);
  assert.match(validation, /If any of these changes later/);
  assert.match(validation, /Personal \+ Local \+ Source/);
  assert.match(validation, /For Controlled, Public, artifact delivery, Internet exposure/);
  assert.match(validation, /system size only to select work economically/i);
  assert.match(projectLead, /Vague input requires a reasoned recommendation plus confirmation/);
  assert.match(memory, /## Project Profile[\s\S]+Selection: Product Owner confirmed/);
  assert.match(memory, /replace `## Completion Check` with:[\s\S]+## Proof/);
  assert.match(validation, /^name: bar-tester$/m);
  assert.match(validation, /^# Bar Tester$/m);
  assert.match(validation, /real customer who orders fried rice/);
  assert.match(specification, /registered `bar-tester`/);
  assert.match(tickets, /registered `bar-tester`/);
  assert.match(implementation, /registered `bar-tester`/);
});

test("keeps tracker writes and portable handoffs behind MAGA boundaries", () => {
  const setup = read(METHODS_ROOT, "setup-matt-pocock-skills", "METHOD.md");
  const github = read(
    METHODS_ROOT,
    "setup-matt-pocock-skills",
    "issue-tracker-github.md",
  );
  const wayfinder = read(METHODS_ROOT, "wayfinder", "METHOD.md");
  const handoff = read(METHODS_ROOT, "handoff", "METHOD.md");
  const routing = read(
    SKILLS_ROOT,
    "project-lead",
    "references",
    "capability-routing.md",
  );

  assert.doesNotMatch(setup, /gh issue create/);
  assert.match(github, /connected\s+GitHub capability/);
  assert.match(github, /local Git[\s\S]+fetch and push/);
  assert.match(wayfinder, /Project Memory is the default authority/);
  assert.match(wayfinder, /authorization: pending/);
  assert.match(handoff, /\.ai-workflow\/handoffs\/<topic>\.md/);
  assert.match(handoff, /another harness, repository,[\s\S]+colleague/);
  assert.doesNotMatch(routing, /Context must cross into a clean task/);
});

test("absorbs Ponytail help and gain without changing its execution lifecycle", () => {
  assert.equal(fs.existsSync(path.join(SKILLS_ROOT, "ponytail", "references", "help.md")), true);
  assert.equal(fs.existsSync(path.join(SKILLS_ROOT, "ponytail", "references", "gain.md")), true);
  for (const skill of ABSORBED_PONYTAIL_SKILLS) {
    assert.equal(fs.existsSync(path.join(SKILLS_ROOT, skill)), false, skill);
  }

  const ponytail = read(SKILLS_ROOT, "ponytail", "SKILL.md");
  assert.match(ponytail, /one-shot information routes/);
  assert.match(ponytail, /Do not switch the current mode/);
});

test("registers automatic communication recovery and absorbs only the manual gate", () => {
  const catalog = JSON.parse(read(PLUGIN_ROOT, "skill-catalog.json"));
  const absorbed = catalog.skills.filter((entry) => entry.status === "absorbed");
  const projectLead = read(SKILLS_ROOT, "project-lead", "SKILL.md");
  const routing = read(
    SKILLS_ROOT,
    "project-lead",
    "references",
    "capability-routing.md",
  );
  const manualGates = read(
    SKILLS_ROOT,
    "project-lead",
    "references",
    "manual-gates.md",
  );
  const waitWhat = read(SKILLS_ROOT, "wait-what", "SKILL.md");
  const waitWhatMetadata = read(SKILLS_ROOT, "wait-what", "agents", "openai.yaml");

  for (const capability of ABSORBED_MATT_CAPABILITIES) {
    assert.equal(fs.existsSync(path.join(SKILLS_ROOT, capability)), false, capability);
    assert.equal(fs.existsSync(path.join(METHODS_ROOT, capability)), false, capability);
  }
  assert.equal(
    absorbed.find((entry) => entry.id === "wizard")?.mapping,
    "project-lead-manual-gate",
  );
  assert.equal(
    catalog.skills.find((entry) => entry.id === "wait-what")?.mapping,
    "registered-entry-adapted-implicit",
  );
  assert.equal(absorbed.find((entry) => entry.id === "wait-what"), undefined);
  assert.match(routing, /\[manual-gates\.md\]\(manual-gates\.md\)/);
  assert.match(manualGates, /Keep temporary working material inside the\s+repository/);
  assert.match(manualGates, /does not generate Bash, capture secrets/);
  assert.match(waitWhat, /user signals that they did not understand the previous explanation/);
  assert.match(waitWhat, /ordinary follow-up that asks for new information/);
  assert.match(waitWhat, /listener's current language/);
  assert.match(waitWhat, /CONTEXT-MAP\.md/);
  assert.match(waitWhat, /create no Ticket, file, task/);
  assert.doesNotMatch(waitWhat.split("---", 3)[1], /disable-model-invocation/);
  assert.match(waitWhatMetadata, /display_name: "MAGA Wait What"/);
  assert.match(waitWhatMetadata, /allow_implicit_invocation:\s*true/);
  assert.match(projectLead, /registered `wait-what` Skill immediately/);
  assert.match(projectLead, /creates no Ticket, file, task, or repeated work/);
});

test("ships the shareable HTML logic prototype and removes the retired writing identity", () => {
  const logicPrototype = read(SKILLS_ROOT, "prototype", "LOGIC.md");

  assert.match(logicPrototype, /one self-contained HTML file/i);
  assert.doesNotMatch(logicPrototype, /interactive terminal app/i);
  assert.equal(
    fs.existsSync(path.join(METHODS_ROOT, "writing-great-skills", "METHOD.md")),
    false,
  );
  assert.equal(
    fs.existsSync(path.join(SKILLS_ROOT, "writing-great-skills", "SKILL.md")),
    false,
  );
});

test("publishes a complete upstream mapping and identical distributed notices", () => {
  const catalog = JSON.parse(read(PLUGIN_ROOT, "skill-catalog.json"));
  const notices = read(PLUGIN_ROOT, "THIRD_PARTY_NOTICES.md");
  const registered = catalog.skills.filter((entry) => entry.status === "registered");
  const internalMethods = catalog.skills.filter((entry) => entry.status === "internal-method");
  const absorbed = catalog.skills.filter((entry) => entry.status === "absorbed");

  assert.equal(catalog.schema_version, 1);
  assert.deepEqual(catalog.target_counts, {
    registered: 19,
    internal_method: 13,
    absorbed: 3,
  });
  assert.equal(new Set(catalog.skills.map((entry) => entry.id)).size, 35);
  assert.equal(registered.length, 19);
  assert.equal(internalMethods.length, 13);
  assert.equal(absorbed.length, 3);
  assert.deepEqual(
    internalMethods.map((entry) => entry.id).sort(),
    [...MATT_INTERNAL_METHODS].sort(),
  );
  assert.deepEqual(
    absorbed.map((entry) => entry.id).sort(),
    [...ABSORBED_UPSTREAM_CAPABILITIES].sort(),
  );
  assert.match(notices, /5b15a47f2d7150f545fbcacbfe381787fc0230dc/);
  assert.match(notices, /2ed6c52c9d7e5e56942508591085fd45dea277d3/);
  assert.match(notices, /c38b5b6d0878ee06b899213d4003e694cece5e0c/);
  assert.match(notices, /Eleven are registered with their technical identities/);
  assert.match(notices, /ten upstream\s+model-invoked Skills retain implicit invocation/);
  assert.match(notices, /wait-what[\s\S]+adapted from user-only invocation\s+to implicit Codex routing/);
  assert.match(notices, /Thirteen upstream\s+user-invoked workflows are\s+distributed as internal MAGA/);
  assert.match(notices, /remaining upstream capability is absorbed into Project Lead/);
  assert.match(notices, /nineteen registered product Skills/);
  assert.match(notices, /four registered Skills, the help and benchmark material/);
  assert.match(notices, /complete Humanization Skill/);
  assert.match(notices, /task-scoped author-sample calibration/);
  assert.match(notices, /Human Writing Skill contributors/);
  assert.equal(notices, read(REPOSITORY_ROOT, "THIRD_PARTY_NOTICES.md"));
});
