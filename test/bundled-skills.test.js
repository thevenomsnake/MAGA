import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const REPOSITORY_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PLUGIN_ROOT = path.join(REPOSITORY_ROOT, "plugins", "maga");
const SKILLS_ROOT = path.join(PLUGIN_ROOT, "skills");

const MAGA_SKILLS = ["orchestrate-tickets", "project-lead"];
const MATT_USER_INVOKED = [
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
  "ponytail-gain",
  "ponytail-help",
  "ponytail-review",
];

function read(...segments) {
  return fs.readFileSync(path.join(...segments), "utf8");
}

function repositoryFiles(root) {
  const files = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "tmp") continue;
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

test("bundles exactly 30 immediate-child Skills", () => {
  const actual = fs.readdirSync(SKILLS_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  const expected = [
    ...MAGA_SKILLS,
    ...MATT_USER_INVOKED,
    ...MATT_MODEL_INVOKED,
    ...PONYTAIL_SKILLS,
  ].sort();

  assert.deepEqual(actual, expected);
  for (const skill of actual) {
    assert.equal(fs.existsSync(path.join(SKILLS_ROOT, skill, "SKILL.md")), true, skill);
  }
});

test("preserves Matt's 13 manual and 9 automatic Codex invocation policies", () => {
  for (const skill of MATT_USER_INVOKED) {
    const instructions = read(SKILLS_ROOT, skill, "SKILL.md");
    const metadata = read(SKILLS_ROOT, skill, "agents", "openai.yaml");

    assert.doesNotMatch(instructions.split("---", 3)[1], /disable-model-invocation/, skill);
    assert.match(metadata, /policy:\s*\r?\n\s*allow_implicit_invocation: false/, skill);
  }

  for (const skill of MATT_MODEL_INVOKED) {
    const instructions = read(SKILLS_ROOT, skill, "SKILL.md");
    const metadata = read(SKILLS_ROOT, skill, "agents", "openai.yaml");

    assert.doesNotMatch(instructions.split("---", 3)[1], /disable-model-invocation/, skill);
    assert.doesNotMatch(metadata, /^policy:/m, skill);
    assert.doesNotMatch(metadata, /allow_implicit_invocation/, skill);
  }
});

test("keeps MAGA and all six Ponytail Skills available for implicit invocation", () => {
  for (const skill of MAGA_SKILLS) {
    const metadata = read(SKILLS_ROOT, skill, "agents", "openai.yaml");
    assert.match(metadata, /policy:\s*\r?\n\s*allow_implicit_invocation: true/, skill);
  }

  for (const skill of PONYTAIL_SKILLS) {
    const instructions = read(SKILLS_ROOT, skill, "SKILL.md");
    const metadataPath = path.join(SKILLS_ROOT, skill, "agents", "openai.yaml");

    assert.doesNotMatch(instructions.split("---", 3)[1], /disable-model-invocation/, skill);
    if (fs.existsSync(metadataPath)) {
      assert.doesNotMatch(read(metadataPath), /allow_implicit_invocation:\s*false/, skill);
    }
  }
});

test("ships every Matt supporting file used by the formal Skills", () => {
  const required = {
    "codebase-design": ["DEEPENING.md", "DESIGN-IT-TWICE.md"],
    "diagnosing-bugs": ["scripts/hitl-loop.template.sh"],
    "domain-modeling": ["ADR-FORMAT.md", "CONTEXT-FORMAT.md"],
    "improve-codebase-architecture": ["HTML-REPORT.md"],
    prototype: ["LOGIC.md", "UI.md"],
    "setup-matt-pocock-skills": [
      "domain.md",
      "issue-tracker-github.md",
      "issue-tracker-gitlab.md",
      "issue-tracker-local.md",
      "triage-labels.md",
    ],
    tdd: ["mocking.md", "tests.md"],
    triage: ["AGENT-BRIEF.md", "OUT-OF-SCOPE.md"],
    teach: [
      "GLOSSARY-FORMAT.md",
      "LEARNING-RECORD-FORMAT.md",
      "MISSION-FORMAT.md",
      "RESOURCES-FORMAT.md",
    ],
    "writing-great-skills": ["GLOSSARY.md"],
  };

  for (const [skill, files] of Object.entries(required)) {
    for (const file of files) {
      assert.equal(fs.existsSync(path.join(SKILLS_ROOT, skill, file)), true, `${skill}/${file}`);
    }
  }
});

test("pins both upstream snapshots in distributed notices", () => {
  const notices = read(PLUGIN_ROOT, "THIRD_PARTY_NOTICES.md");

  assert.match(notices, /2ab958093e83e0ec752e6c1c5932da465bf23e0c/);
  assert.match(notices, /16f29800fd2681bdf24f3eb4ccffe38be3baec6b/);
  assert.match(notices, /automatic routing belongs to MAGA/);
  assert.match(notices, /does not change the preserved 13 manual \/ 9\s+implicit registered entry policies/);
});
