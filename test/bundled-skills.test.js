import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const REPOSITORY_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PLUGIN_ROOT = path.join(REPOSITORY_ROOT, "plugins", "maga");
const SKILLS_ROOT = path.join(PLUGIN_ROOT, "skills");
const METHODS_ROOT = path.join(PLUGIN_ROOT, "methods");

const MAGA_SKILLS = ["orchestrate-tickets", "project-lead"];
const MATT_INTERNAL_METHODS = [
  "ask-matt",
  "grill-me",
  "grill-with-docs",
  "handoff",
  "implement",
  "improve-codebase-architecture",
  "setup-matt-pocock-skills",
  "teach",
  "to-spec",
  "to-tickets",
  "triage",
  "wayfinder",
  "writing-great-skills",
];
const MATT_MODEL_INVOKED = [
  "code-review",
  "codebase-design",
  "diagnosing-bugs",
  "domain-modeling",
  "grilling",
  "prototype",
  "research",
  "resolving-merge-conflicts",
  "tdd",
];
const PONYTAIL_SKILLS = [
  "ponytail",
  "ponytail-audit",
  "ponytail-debt",
  "ponytail-review",
];
const ABSORBED_PONYTAIL_SKILLS = ["ponytail-gain", "ponytail-help"];
const REGISTERED_SKILLS = [
  ...MAGA_SKILLS,
  ...MATT_MODEL_INVOKED,
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

test("exposes exactly 15 product Skills and keeps 13 methods internal", () => {
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

  assert.equal(registeredCatalog.length, 15);
  for (const skill of REGISTERED_SKILLS) {
    const instructions = read(SKILLS_ROOT, skill, "SKILL.md");
    const metadata = read(SKILLS_ROOT, skill, "agents", "openai.yaml");
    const displayName = quotedMetadataValue(metadata, "display_name");
    const shortDescription = quotedMetadataValue(metadata, "short_description");
    const defaultPrompt = quotedMetadataValue(metadata, "default_prompt");
    const catalogEntry = registeredCatalog.find((entry) => entry.id === skill);

    assert.match(instructions, new RegExp(`^---[\\s\\S]*?^name:\\s*${skill}\\s*$`, "m"), skill);
    assert.match(displayName, /^MAGA · /, skill);
    assert.ok(shortDescription.length >= 25 && shortDescription.length <= 64, skill);
    assert.match(defaultPrompt, new RegExp(`\\$${skill}(?:\\s|$)`), skill);
    assert.match(metadata, /policy:\s*\r?\n\s*allow_implicit_invocation:\s*true/, skill);
    assert.equal(catalogEntry?.display_name, displayName, skill);
    assert.equal(catalogEntry?.invocation, "implicit", skill);
  }
});

test("preserves Matt's nine automatic capabilities without old command aliases", () => {
  const removedCommand = new RegExp(`\\$(?:${MATT_INTERNAL_METHODS.join("|")})\\b`);
  const routing = read(
    SKILLS_ROOT,
    "project-lead",
    "references",
    "capability-routing.md",
  );

  for (const skill of MATT_MODEL_INVOKED) {
    const instructions = read(SKILLS_ROOT, skill, "SKILL.md");
    assert.doesNotMatch(instructions.split("---", 3)[1], /disable-model-invocation/, skill);
  }

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
    "writing-great-skills": ["GLOSSARY.md"],
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

test("publishes a complete upstream mapping and identical distributed notices", () => {
  const catalog = JSON.parse(read(PLUGIN_ROOT, "skill-catalog.json"));
  const notices = read(PLUGIN_ROOT, "THIRD_PARTY_NOTICES.md");
  const registered = catalog.skills.filter((entry) => entry.status === "registered");
  const internalMethods = catalog.skills.filter((entry) => entry.status === "internal-method");
  const absorbed = catalog.skills.filter((entry) => entry.status === "absorbed");

  assert.equal(catalog.schema_version, 1);
  assert.deepEqual(catalog.target_counts, {
    registered: 15,
    internal_method: 13,
    absorbed: 2,
  });
  assert.equal(new Set(catalog.skills.map((entry) => entry.id)).size, 30);
  assert.equal(registered.length, 15);
  assert.equal(internalMethods.length, 13);
  assert.equal(absorbed.length, 2);
  assert.deepEqual(
    internalMethods.map((entry) => entry.id).sort(),
    [...MATT_INTERNAL_METHODS].sort(),
  );
  assert.deepEqual(
    absorbed.map((entry) => entry.id).sort(),
    [...ABSORBED_PONYTAIL_SKILLS].sort(),
  );
  assert.match(notices, /2ab958093e83e0ec752e6c1c5932da465bf23e0c/);
  assert.match(notices, /16f29800fd2681bdf24f3eb4ccffe38be3baec6b/);
  assert.match(notices, /Nine upstream model-invoked Skills remain\s+registered/);
  assert.match(notices, /thirteen upstream user-invoked workflows are distributed as internal MAGA/);
  assert.match(notices, /four registered Skills, the help and benchmark material/);
  assert.equal(notices, read(REPOSITORY_ROOT, "THIRD_PARTY_NOTICES.md"));
});
