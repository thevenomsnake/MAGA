import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  BALANCED_DEFAULTS,
  RESPONSIBILITIES,
  computeConfigPath,
  loadComputeSettings,
  resolveComputeProfile,
  saveComputeSettings,
} from "../plugins/maga/runtime/compute-profiles.mjs";

const REPOSITORY_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TEST_ROOT = path.join(REPOSITORY_ROOT, "tmp", "tests");

function workspace(t) {
  fs.mkdirSync(TEST_ROOT, { recursive: true });
  const root = fs.mkdtempSync(path.join(TEST_ROOT, "compute-profiles-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}

const MODELS = [
  {
    id: "gpt-5.6-sol",
    displayName: "GPT-5.6-Sol",
    supportedReasoningEfforts: ["low", "medium", "high", "xhigh", "max", "ultra"],
    defaultReasoningEffort: "medium",
  },
  {
    id: "gpt-5.6-terra",
    displayName: "GPT-5.6-Terra",
    isDefault: true,
    supportedReasoningEfforts: ["low", "medium", "high"],
    defaultReasoningEffort: "medium",
  },
  {
    id: "gpt-5.6-luna",
    displayName: "GPT-5.6-Luna",
    supportedReasoningEfforts: ["low", "medium"],
    defaultReasoningEffort: "low",
  },
];

test("ships seven balanced responsibility defaults", () => {
  assert.deepEqual(
    RESPONSIBILITIES.map(({ key }) => key),
    ["project-lead", "research", "prototype", "delivery", "diagnosis", "review", "release"],
  );
  assert.deepEqual(BALANCED_DEFAULTS, {
    "project-lead": { model: "gpt-5.6-sol", effort: "medium" },
    research: { model: "gpt-5.6-terra", effort: "medium" },
    prototype: { model: "gpt-5.6-sol", effort: "medium" },
    delivery: { model: "gpt-5.6-terra", effort: "medium" },
    diagnosis: { model: "gpt-5.6-sol", effort: "high" },
    review: { model: "gpt-5.6-sol", effort: "high" },
    release: { model: "gpt-5.6-sol", effort: "high" },
  });
});

test("stores a complete explicit selection inside the selected Codex Home", (t) => {
  const codexHome = workspace(t);
  const configPath = computeConfigPath({ env: { CODEX_HOME: codexHome } });
  const profiles = {
    ...BALANCED_DEFAULTS,
    research: { model: "gpt-5.6-luna", effort: "low" },
  };

  saveComputeSettings(profiles, { configPath });

  assert.equal(configPath, path.join(codexHome, "maga", "compute-profiles.json"));
  assert.deepEqual(JSON.parse(fs.readFileSync(configPath, "utf8")), {
    schemaVersion: 1,
    profiles,
  });
  assert.equal(loadComputeSettings({ configPath }).profiles.research.model, "gpt-5.6-luna");

  saveComputeSettings({
    review: { model: "gpt-5.6-terra", effort: "medium" },
  }, { configPath });
  assert.deepEqual(loadComputeSettings({ configPath }).profiles.review, {
    model: "gpt-5.6-terra",
    effort: "medium",
  });
  assert.deepEqual(loadComputeSettings({ configPath }).profiles.research, {
    model: "gpt-5.6-luna",
    effort: "low",
  });
});

test("requires all seven recommendations to be confirmed on first save", (t) => {
  const configPath = path.join(workspace(t), "maga", "compute-profiles.json");

  assert.throws(
    () => saveComputeSettings({
      research: { model: "gpt-5.6-luna", effort: "low" },
    }, { configPath }),
    /first save must confirm all MAGA responsibilities/,
  );
  assert.equal(fs.existsSync(configPath), false);
});

test("rejects a stale panel revision instead of overwriting newer choices", (t) => {
  const configPath = path.join(workspace(t), "maga", "compute-profiles.json");
  const initial = loadComputeSettings({ configPath });
  const first = saveComputeSettings(BALANCED_DEFAULTS, {
    configPath,
    expectedRevision: initial.revision,
  });

  assert.throws(
    () => saveComputeSettings(BALANCED_DEFAULTS, {
      configPath,
      expectedRevision: initial.revision,
    }),
    /changed in another panel/,
  );
  assert.equal(loadComputeSettings({ configPath }).revision, first.revision);
});

test("rejects structurally invalid saved settings instead of activating recommendations", (t) => {
  const root = workspace(t);
  const configPath = path.join(root, "maga", "compute-profiles.json");
  fs.mkdirSync(path.dirname(configPath), { recursive: true });
  fs.writeFileSync(configPath, JSON.stringify({ schemaVersion: 1, profiles: {} }));

  const settings = loadComputeSettings({ configPath });
  assert.equal(settings.source, "invalid-fallback");
  assert.match(settings.warning, /could not be read/);
  const resolved = resolveComputeProfile("project-lead", { settings, models: MODELS });
  assert.deepEqual(resolved.actual, { model: null, effort: null });
});

test("falls back visibly when a configured model or depth is unavailable", () => {
  const missingModel = resolveComputeProfile("project-lead", {
    settings: { source: "saved", profiles: BALANCED_DEFAULTS },
    models: MODELS.filter(({ id }) => id !== "gpt-5.6-sol"),
  });
  assert.deepEqual(missingModel.actual, { model: "gpt-5.6-sol", effort: "medium" });
  assert.match(missingModel.fallback.join(" "), /gpt-5\.6-sol is not listed/);

  const unsupportedDepth = resolveComputeProfile("delivery", {
    settings: {
      source: "saved",
      profiles: {
        ...BALANCED_DEFAULTS,
        delivery: { model: "gpt-5.6-luna", effort: "high" },
      },
    },
    models: MODELS,
  });
  assert.deepEqual(unsupportedDepth.actual, { model: "gpt-5.6-luna", effort: "high" });
  assert.match(unsupportedDepth.fallback.join(" "), /destination host will validate/);
});

test("keeps Balanced values as recommendations until the user saves them", () => {
  const resolved = resolveComputeProfile("project-lead", {
    settings: { source: "balanced-defaults", profiles: BALANCED_DEFAULTS },
    models: MODELS,
  });

  assert.deepEqual(resolved.preferred, BALANCED_DEFAULTS["project-lead"]);
  assert.deepEqual(resolved.actual, { model: null, effort: null });
  assert.match(resolved.fallback[0], /not active until it is saved/);
});

test("keeps explicit choices for destination validation when the reference catalog is unavailable", () => {
  const resolved = resolveComputeProfile("release", {
    settings: { source: "saved", profiles: BALANCED_DEFAULTS },
    models: [],
  });
  assert.deepEqual(resolved.actual, { model: "gpt-5.6-sol", effort: "high" });
  assert.match(resolved.fallback[0], /destination host will validate/);
});

test("uses host defaults when the destination's authoritative catalog rejects a choice", () => {
  const resolved = resolveComputeProfile("project-lead", {
    settings: { source: "saved", profiles: BALANCED_DEFAULTS },
    models: MODELS.filter(({ id }) => id !== "gpt-5.6-sol"),
    catalogMode: "authoritative",
  });

  assert.deepEqual(resolved.actual, { model: null, effort: null });
  assert.match(resolved.fallback[0], /unavailable on the destination/);
});

test("an explicit one-task choice wins without changing saved defaults", () => {
  const settings = { profiles: BALANCED_DEFAULTS };
  const resolved = resolveComputeProfile("research", {
    settings,
    models: MODELS,
    override: { model: "gpt-5.6-luna", effort: "low" },
  });

  assert.deepEqual(resolved.actual, { model: "gpt-5.6-luna", effort: "low" });
  assert.equal(resolved.source, "task-override");
  assert.deepEqual(settings.profiles.research, BALANCED_DEFAULTS.research);
});

test("an unsaved one-task override applies only fields the user chose", () => {
  const settings = { source: "balanced-defaults", profiles: BALANCED_DEFAULTS };
  const modelOnly = resolveComputeProfile("research", {
    settings,
    models: MODELS,
    override: { model: "gpt-5.6-luna" },
  });
  const effortOnly = resolveComputeProfile("research", {
    settings,
    models: MODELS,
    override: { effort: "high" },
  });

  assert.deepEqual(modelOnly.actual, { model: "gpt-5.6-luna", effort: null });
  assert.deepEqual(effortOnly.actual, { model: null, effort: "high" });
});
