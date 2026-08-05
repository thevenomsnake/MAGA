import fs from "node:fs";
import { createHash, randomUUID } from "node:crypto";
import os from "node:os";
import path from "node:path";

export const COMPUTE_SCHEMA_VERSION = 1;

export const REASONING_EFFORTS = Object.freeze([
  "none",
  "minimal",
  "low",
  "medium",
  "high",
  "xhigh",
  "max",
  "ultra",
]);

export const RESPONSIBILITIES = Object.freeze([
  {
    key: "project-lead",
    label: "Project Lead",
    description: "Product conversation, decisions, orchestration, and integration.",
    model: "gpt-5.6-sol",
    effort: "xhigh",
  },
  {
    key: "research",
    label: "External Research",
    description: "Source-backed facts that can change a product decision.",
    model: "gpt-5.6-sol",
    effort: "max",
  },
  {
    key: "prototype",
    label: "Experience Prototype",
    description: "Interaction and visual judgment before committing to delivery.",
    model: "gpt-5.6-terra",
    effort: "high",
  },
  {
    key: "delivery",
    label: "Product Delivery",
    description: "Bounded implementation after the product result is clear.",
    model: "gpt-5.6-luna",
    effort: "max",
  },
  {
    key: "diagnosis",
    label: "Diagnosis",
    description: "Evidence-led investigation of concrete failures.",
    model: "gpt-5.6-terra",
    effort: "xhigh",
  },
  {
    key: "review",
    label: "Independent Review",
    description: "Risk-matched acceptance and quality review.",
    model: "gpt-5.6-sol",
    effort: "high",
  },
  {
    key: "release",
    label: "Release And Risk",
    description: "Privacy, permissions, migration, and external release boundaries.",
    model: "gpt-5.6-sol",
    effort: "high",
  },
]);

const RESPONSIBILITY_BY_KEY = new Map(
  RESPONSIBILITIES.map((responsibility) => [responsibility.key, responsibility]),
);

export const BALANCED_DEFAULTS = Object.freeze(Object.fromEntries(
  RESPONSIBILITIES.map(({ key, model, effort }) => [
    key,
    Object.freeze({ model, effort }),
  ]),
));

function freezeProfiles(profiles) {
  return Object.freeze(Object.fromEntries(
    Object.entries(profiles).map(([key, profile]) => [key, Object.freeze({ ...profile })]),
  ));
}

export const COMPUTE_PRESETS = Object.freeze([
  Object.freeze({
    key: "pro-quality",
    label: "Pro · quality first",
    description: "For ChatGPT Pro or a high workspace allowance. Uses Sol for judgment and Terra for implementation.",
    profiles: freezeProfiles({
      "project-lead": { model: "gpt-5.6-sol", effort: "xhigh" },
      research: { model: "gpt-5.6-sol", effort: "max" },
      prototype: { model: "gpt-5.6-sol", effort: "xhigh" },
      delivery: { model: "gpt-5.6-terra", effort: "xhigh" },
      diagnosis: { model: "gpt-5.6-sol", effort: "max" },
      review: { model: "gpt-5.6-sol", effort: "xhigh" },
      release: { model: "gpt-5.6-sol", effort: "xhigh" },
    }),
  }),
  Object.freeze({
    key: "plus-standard",
    label: "Plus · regular use",
    description: "For focused weekly work. Mixes Sol judgment, Terra execution, and Luna Max delivery.",
    profiles: BALANCED_DEFAULTS,
  }),
  Object.freeze({
    key: "quota-saver",
    label: "Free / Go · quota saver",
    description: "For lightweight use or a tight remaining allowance. Uses Terra broadly, Sol for release, and Luna Max for delivery.",
    profiles: freezeProfiles({
      "project-lead": { model: "gpt-5.6-terra", effort: "xhigh" },
      research: { model: "gpt-5.6-terra", effort: "max" },
      prototype: { model: "gpt-5.6-terra", effort: "high" },
      delivery: { model: "gpt-5.6-luna", effort: "max" },
      diagnosis: { model: "gpt-5.6-terra", effort: "high" },
      review: { model: "gpt-5.6-terra", effort: "high" },
      release: { model: "gpt-5.6-sol", effort: "high" },
    }),
  }),
]);

function requireResponsibility(key) {
  const responsibility = RESPONSIBILITY_BY_KEY.get(key);
  if (!responsibility) {
    throw new Error(`unknown MAGA responsibility: ${key}`);
  }
  return responsibility;
}

function normalizeProfile(value, key) {
  const fallback = BALANCED_DEFAULTS[key];
  if (!value || typeof value !== "object" || Array.isArray(value)) return { ...fallback };

  const model = typeof value.model === "string" && value.model.trim()
    ? value.model.trim()
    : fallback.model;
  const effort = REASONING_EFFORTS.includes(value.effort)
    ? value.effort
    : fallback.effort;
  if (model.length > 120) throw new Error(`${key}.model is too long`);
  return { model, effort };
}

export function normalizeComputeSettings(value = {}) {
  const overrides = value?.profiles && typeof value.profiles === "object"
    ? value.profiles
    : {};
  const profiles = {};
  for (const { key } of RESPONSIBILITIES) {
    profiles[key] = normalizeProfile(overrides[key], key);
  }
  return {
    schemaVersion: COMPUTE_SCHEMA_VERSION,
    profiles,
  };
}

function validateStoredSettings(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("settings document must be an object");
  }
  if (value.schemaVersion !== COMPUTE_SCHEMA_VERSION) {
    throw new Error("unsupported settings schema version");
  }
  if (!value.profiles || typeof value.profiles !== "object" || Array.isArray(value.profiles)) {
    throw new Error("settings profiles must be an object");
  }

  const expected = new Set(RESPONSIBILITIES.map(({ key }) => key));
  for (const key of Object.keys(value.profiles)) requireResponsibility(key);
  for (const key of expected) {
    if (!Object.hasOwn(value.profiles, key)) throw new Error(`settings profile is missing: ${key}`);
    const profile = value.profiles[key];
    if (!profile || typeof profile !== "object" || Array.isArray(profile)) {
      throw new Error(`settings profile must be an object: ${key}`);
    }
    if (typeof profile.model !== "string" || !profile.model.trim() || profile.model.length > 120) {
      throw new Error(`settings model is invalid: ${key}`);
    }
    if (!REASONING_EFFORTS.includes(profile.effort)) {
      throw new Error(`settings reasoning depth is invalid: ${key}`);
    }
  }
  return normalizeComputeSettings(value);
}

function revisionFor(content) {
  return createHash("sha256").update(content).digest("hex").slice(0, 24);
}

export function computeConfigPath({ env = process.env, home = os.homedir() } = {}) {
  if (env.MAGA_COMPUTE_CONFIG?.trim()) return path.resolve(env.MAGA_COMPUTE_CONFIG);
  if (env.CODEX_HOME?.trim()) {
    return path.join(path.resolve(env.CODEX_HOME), "maga", "compute-profiles.json");
  }
  return path.join(path.resolve(home), ".codex", "maga", "compute-profiles.json");
}

export function loadComputeSettings({ configPath = computeConfigPath() } = {}) {
  if (!fs.existsSync(configPath)) {
    return {
      ...normalizeComputeSettings(),
      configPath,
      source: "balanced-defaults",
      revision: "missing",
    };
  }

  let content = null;
  try {
    content = fs.readFileSync(configPath, "utf8");
    const parsed = JSON.parse(content);
    return {
      ...validateStoredSettings(parsed),
      configPath,
      source: "saved",
      revision: revisionFor(content),
    };
  } catch (error) {
    return {
      ...normalizeComputeSettings(),
      configPath,
      source: "invalid-fallback",
      revision: content === null ? "unreadable" : revisionFor(content),
      warning: "Saved MAGA settings could not be read; the host default will be used until they are saved again.",
    };
  }
}

export function saveComputeSettings(
  profiles,
  { configPath = computeConfigPath(), expectedRevision } = {},
) {
  if (!profiles || typeof profiles !== "object" || Array.isArray(profiles)) {
    throw new Error("profiles must be an object keyed by MAGA responsibility");
  }
  for (const key of Object.keys(profiles)) {
    requireResponsibility(key);
  }
  const existing = loadComputeSettings({ configPath });
  if (expectedRevision !== undefined && expectedRevision !== existing.revision) {
    throw new Error("MAGA settings changed in another panel; refresh before saving.");
  }
  if (existing.source !== "saved") {
    const supplied = new Set(Object.keys(profiles));
    const missing = RESPONSIBILITIES
      .map(({ key }) => key)
      .filter((key) => !supplied.has(key));
    if (missing.length > 0) {
      throw new Error(`first save must confirm all MAGA responsibilities; missing: ${missing.join(", ")}`);
    }
  }
  const merged = Object.fromEntries(RESPONSIBILITIES.map(({ key }) => [
    key,
    Object.hasOwn(profiles, key)
      ? { ...existing.profiles[key], ...profiles[key] }
      : existing.profiles[key],
  ]));
  const normalized = normalizeComputeSettings({ profiles: merged });
  const document = {
    schemaVersion: COMPUTE_SCHEMA_VERSION,
    // Saving is an explicit user confirmation. Persist the complete selection so
    // a later MAGA release cannot silently reinterpret an old empty override set
    // against a changed preset.
    profiles: normalized.profiles,
  };
  const content = `${JSON.stringify(document, null, 2)}\n`;
  fs.mkdirSync(path.dirname(configPath), { recursive: true });
  const temporaryPath = `${configPath}.${process.pid}.${randomUUID()}.tmp`;
  fs.writeFileSync(temporaryPath, content, "utf8");
  fs.renameSync(temporaryPath, configPath);
  return {
    ...normalized,
    configPath,
    source: "saved",
    revision: revisionFor(content),
  };
}

export function normalizeModelCatalog(models = []) {
  if (!Array.isArray(models)) return [];
  const seen = new Set();
  const normalized = [];
  for (const entry of models) {
    if (!entry || typeof entry !== "object") continue;
    if (entry.hidden === true) continue;
    const id = String(entry.id || entry.model || "").trim();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    const efforts = Array.isArray(entry.supportedReasoningEfforts)
      ? entry.supportedReasoningEfforts
        .map((item) => typeof item === "string" ? item : item?.reasoningEffort)
        .filter((effort) => REASONING_EFFORTS.includes(effort))
      : [];
    normalized.push({
      id,
      displayName: String(entry.displayName || id),
      hidden: entry.hidden === true,
      isDefault: entry.isDefault === true,
      defaultReasoningEffort: REASONING_EFFORTS.includes(entry.defaultReasoningEffort)
        ? entry.defaultReasoningEffort
        : null,
      supportedReasoningEfforts: [...new Set(efforts)],
      upgrade: typeof entry.upgrade === "string" ? entry.upgrade : null,
    });
  }
  return normalized;
}

function chooseEffort(preferred, model, catalogMode) {
  const supported = model.supportedReasoningEfforts;
  if (supported.length === 0) {
    if (catalogMode === "authoritative") {
      return {
        effort: null,
        fallback: "The destination catalog did not report reasoning-depth options; using the model's host default.",
      };
    }
    return {
      effort: preferred,
      fallback: "The reference catalog did not report reasoning-depth options; the destination host will validate the saved choice.",
    };
  }
  if (supported.includes(preferred)) return { effort: preferred, fallback: null };
  if (catalogMode === "authoritative") {
    return {
      effort: null,
      fallback: `Reasoning depth ${preferred} is unavailable on the destination; using the selected model's host default.`,
    };
  }
  return {
    effort: preferred,
    fallback: `Reasoning depth ${preferred} is not listed for this model in the reference catalog; the destination host will validate it.`,
  };
}

export function resolveComputeProfile(
  responsibilityKey,
  {
    settings = loadComputeSettings(),
    models = [],
    override = null,
    catalogMode = "reference",
  } = {},
) {
  const responsibility = requireResponsibility(responsibilityKey);
  const configured = normalizeProfile(settings.profiles?.[responsibilityKey], responsibilityKey);
  const hasModelOverride = override && typeof override === "object"
    && typeof override.model === "string" && override.model.trim();
  const hasEffortOverride = override && typeof override === "object"
    && REASONING_EFFORTS.includes(override.effort);
  const hasTaskOverride = Boolean(hasModelOverride || hasEffortOverride);
  const preferred = hasTaskOverride
    ? normalizeProfile({ ...configured, ...override }, responsibilityKey)
    : configured;
  const source = hasTaskOverride ? "task-override" : (settings.source || "saved");
  const resultBase = {
    responsibility: responsibilityKey,
    label: responsibility.label,
    source,
    preferred,
    configWarning: settings.warning || null,
  };
  const savedProfile = settings.source === "saved" || (!settings.source && source === "saved");
  const applyModel = savedProfile || Boolean(hasModelOverride);
  const applyEffort = savedProfile || Boolean(hasEffortOverride);
  if (!applyModel && !applyEffort) {
    return {
      ...resultBase,
      actual: { model: null, effort: null },
      fallback: ["The MAGA recommendation is not active until it is saved; using the host default."],
    };
  }
  const catalog = normalizeModelCatalog(models);
  if (catalog.length === 0) {
    if (catalogMode === "authoritative") {
      return {
        ...resultBase,
        actual: { model: null, effort: null },
        fallback: ["The destination model catalog is unavailable; using the host default."],
      };
    }
    return {
      ...resultBase,
      actual: {
        model: applyModel ? preferred.model : null,
        effort: applyEffort ? preferred.effort : null,
      },
      fallback: ["The reference model catalog is unavailable; the destination host will validate the explicit choice."],
    };
  }

  const selectedModel = applyModel
    ? catalog.find((entry) => entry.id === preferred.model)
    : catalog.find((entry) => entry.isDefault);
  const fallback = [];
  if (!selectedModel) {
    if (catalogMode === "authoritative") {
      return {
        ...resultBase,
        actual: { model: null, effort: null },
        fallback: [applyModel
          ? `Model ${preferred.model} is unavailable on the destination; using the host default.`
          : "The destination did not identify its default model; using host defaults."],
      };
    }
    return {
      ...resultBase,
      actual: {
        model: applyModel ? preferred.model : null,
        effort: applyEffort ? preferred.effort : null,
      },
      fallback: [applyModel
        ? `Model ${preferred.model} is not listed in the reference catalog; the destination host will validate it.`
        : "The reference catalog did not identify the host default model; the destination host will validate the reasoning choice."],
    };
  }

  const effort = applyEffort
    ? chooseEffort(preferred.effort, selectedModel, catalogMode)
    : { effort: null, fallback: null };
  if (effort.fallback) fallback.push(effort.fallback);
  return {
    ...resultBase,
    actual: { model: applyModel ? selectedModel.id : null, effort: effort.effort },
    fallback,
  };
}

export function computeSettingsSnapshot({ settings = loadComputeSettings(), models = [] } = {}) {
  const catalog = normalizeModelCatalog(models);
  return {
    schemaVersion: COMPUTE_SCHEMA_VERSION,
    source: settings.source || "saved",
    revision: settings.revision || null,
    configWarning: settings.warning || null,
    defaults: BALANCED_DEFAULTS,
    presets: COMPUTE_PRESETS,
    models: catalog,
    responsibilities: RESPONSIBILITIES.map((responsibility) => ({
      key: responsibility.key,
      label: responsibility.label,
      description: responsibility.description,
      ...resolveComputeProfile(responsibility.key, { settings, models: catalog }),
    })),
    appliesTo: "new-tasks-only",
  };
}
