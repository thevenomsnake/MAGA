import fs from "node:fs";
import path from "node:path";

const DESIGN_SCHEMA_VERSION = 1;
const KEY_PATTERN = /^D\d{3,}$/;
const KINDS = new Set(["product", "system"]);
const STATUSES = new Set(["draft", "accepted", "rejected", "superseded"]);

function assertText(value, label) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${label} is required`);
  return value.trim();
}

function normalizeList(value, label) {
  if (value === undefined) return [];
  if (!Array.isArray(value)) throw new Error(`${label} must be an array`);
  return value.map((item) => assertText(item, `${label} item`));
}

function normalizePointer(value, label) {
  const pointer = assertText(value, label).replaceAll("\\", "/");
  if (path.isAbsolute(value) || pointer.startsWith("/") || pointer.split("/").includes("..")) {
    throw new Error(`${label} must be repository-relative`);
  }
  return pointer;
}

function slugify(value) {
  const slug = value
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || "design-record";
}

function layout(projectRoot) {
  const root = path.resolve(projectRoot);
  const designRoot = path.join(root, ".ai-workflow", "design");
  return {
    root,
    designRoot,
    indexPath: path.join(designRoot, "INDEX.md"),
    recordsRoot: path.join(designRoot, "records"),
  };
}

export function designLayout(projectRoot) {
  const paths = layout(projectRoot);
  return {
    indexPath: path.relative(paths.root, paths.indexPath).replaceAll(path.sep, "/"),
    recordsPath: path.relative(paths.root, paths.recordsRoot).replaceAll(path.sep, "/"),
    exists: fs.existsSync(paths.indexPath),
  };
}

function validateRecord(record) {
  const key = assertText(record?.key, "design key");
  if (!KEY_PATTERN.test(key)) throw new Error("design key must match D###");
  const kind = assertText(record?.kind || "product", "design kind");
  if (!KINDS.has(kind)) throw new Error(`unsupported design kind: ${kind}`);
  const status = assertText(record?.status || "draft", "design status");
  if (!STATUSES.has(status)) throw new Error(`unsupported design status: ${status}`);
  const title = assertText(record?.title, "design title");
  const question = assertText(record?.question, "design question");
  const currentShape = assertText(record?.currentShape, "design current shape");
  const constraints = normalizeList(record?.constraints, "constraints");
  const evidence = normalizeList(record?.evidence, "evidence")
    .map((pointer) => normalizePointer(pointer, "evidence pointer"));
  const relationships = record?.relationships || {};
  const supersedes = relationships.supersedes
    ? normalizePointer(relationships.supersedes, "supersedes pointer")
    : null;
  const relatedTicket = relationships.relatedTicket
    ? normalizePointer(relationships.relatedTicket, "related Ticket pointer")
    : null;
  const relatedAdr = relationships.relatedAdr
    ? normalizePointer(relationships.relatedAdr, "related ADR pointer")
    : null;
  return {
    key,
    kind,
    status,
    title,
    question,
    currentShape,
    constraints,
    evidence,
    relationships: { supersedes, relatedTicket, relatedAdr },
  };
}

function bulletList(items, fallback = "- None recorded.") {
  return items.length > 0 ? items.map((item) => `- ${item}`).join("\n") : fallback;
}

export function renderDesignRecord(record) {
  const normalized = validateRecord(record);
  const { relationships } = normalized;
  return `${[
    "---",
    `schema_version: ${DESIGN_SCHEMA_VERSION}`,
    `key: ${normalized.key}`,
    `kind: ${normalized.kind}`,
    `status: ${normalized.status}`,
    `title: ${JSON.stringify(normalized.title)}`,
    "---",
    "",
    `# ${normalized.title}`,
    "",
    "## Question",
    "",
    normalized.question,
    "",
    "## Current Shape",
    "",
    normalized.currentShape,
    "",
    "## Constraints",
    "",
    bulletList(normalized.constraints),
    "",
    "## Evidence",
    "",
    bulletList(normalized.evidence),
    "",
    "## Relationships",
    "",
    `- Supersedes: ${relationships.supersedes || "none"}`,
    `- Related Ticket: ${relationships.relatedTicket || "none"}`,
    `- Related ADR: ${relationships.relatedAdr || "none"}`,
    "",
  ].join("\n")}`;
}

function renderIndex(records = []) {
  const lines = [
    "# Design Index",
    "",
    "Accepted records describe the current product or system shape. Draft, rejected,",
    "and superseded records remain discoverable but are not authoritative.",
    "",
    "## Records",
    "",
  ];
  if (records.length === 0) lines.push("- None recorded.");
  else {
    for (const record of records.sort((left, right) => left.key.localeCompare(right.key))) {
      lines.push(`- [${record.key}: ${record.title}](records/${record.filename}) - ${record.status} - ${record.kind}`);
    }
  }
  return `${lines.join("\n")}\n`;
}

function readIndexRecords(indexPath) {
  if (!fs.existsSync(indexPath)) return [];
  const records = [];
  const pattern = /^- \[(D\d{3,}): ([^\]]+)\]\(records\/([^\)]+)\) - (draft|accepted|rejected|superseded) - (product|system)$/gm;
  for (const match of fs.readFileSync(indexPath, "utf8").matchAll(pattern)) {
    records.push({
      key: match[1],
      title: match[2],
      filename: match[3],
      status: match[4],
      kind: match[5],
    });
  }
  return records;
}

export function writeDesignRecord(projectRoot, record, { slug } = {}) {
  const paths = layout(projectRoot);
  const normalized = validateRecord(record);
  const filename = `${normalized.key}-${slugify(slug || normalized.title)}.md`;
  fs.mkdirSync(paths.recordsRoot, { recursive: true });
  fs.writeFileSync(path.join(paths.recordsRoot, filename), renderDesignRecord(normalized), "utf8");

  const records = readIndexRecords(paths.indexPath)
    .filter((entry) => entry.key !== normalized.key);
  records.push({
    key: normalized.key,
    title: normalized.title,
    filename,
    status: normalized.status,
    kind: normalized.kind,
  });
  fs.writeFileSync(paths.indexPath, renderIndex(records), "utf8");
  return {
    indexPath: path.relative(paths.root, paths.indexPath).replaceAll(path.sep, "/"),
    recordPath: path.relative(paths.root, path.join(paths.recordsRoot, filename)).replaceAll(path.sep, "/"),
  };
}

export function readDesignIndex(projectRoot) {
  const paths = layout(projectRoot);
  return {
    ...designLayout(projectRoot),
    records: readIndexRecords(paths.indexPath),
  };
}

export function readAcceptedDesignRecords(projectRoot) {
  const paths = layout(projectRoot);
  return readIndexRecords(paths.indexPath)
    .filter((record) => record.status === "accepted")
    .map((record) => ({
      ...record,
      content: fs.readFileSync(path.join(paths.recordsRoot, record.filename), "utf8"),
    }));
}
