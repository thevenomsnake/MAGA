import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  designLayout,
  readAcceptedDesignRecords,
  readDesignIndex,
  writeDesignRecord,
} from "../src/design-memory.js";

const REPOSITORY_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TEST_ROOT = path.join(REPOSITORY_ROOT, "tmp", "tests");

function workspace(t) {
  fs.mkdirSync(TEST_ROOT, { recursive: true });
  const root = fs.mkdtempSync(path.join(TEST_ROOT, "design-memory-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}

test("creates design storage lazily and exposes accepted records for recovery", (t) => {
  const root = workspace(t);
  assert.equal(designLayout(root).exists, false);

  const written = writeDesignRecord(root, {
    key: "D001",
    kind: "product",
    status: "accepted",
    title: "Bounded worker dispatch",
    question: "When should a Project Lead open a worker?",
    currentShape: "Dispatch only inside an approved Ticket and its worker limit.",
    constraints: ["New scope returns to the Product Owner."],
    evidence: [".ai-workflow/tickets/T003-proactive-task-dispatch.md"],
    relationships: { relatedTicket: ".ai-workflow/tickets/T003-proactive-task-dispatch.md" },
  });

  assert.equal(written.indexPath, ".ai-workflow/design/INDEX.md");
  assert.equal(written.recordPath, ".ai-workflow/design/records/D001-bounded-worker-dispatch.md");
  const index = readDesignIndex(root);
  assert.equal(index.records.length, 1);
  assert.equal(index.records[0].status, "accepted");
  assert.equal(readAcceptedDesignRecords(root).length, 1);
  assert.doesNotMatch(fs.readFileSync(path.join(root, written.indexPath), "utf8"), /threadId|hostId|C:\\\\/i);
  assert.doesNotMatch(fs.readFileSync(path.join(root, written.recordPath), "utf8"), /\r\n/);
});

test("rewriting a design key updates one index entry and preserves draft status", (t) => {
  const root = workspace(t);
  const base = {
    key: "D002",
    kind: "system",
    title: "Task context boundary",
    question: "What crosses into a worker?",
    currentShape: "Repository-relative pointers.",
  };
  writeDesignRecord(root, { ...base, status: "draft" });
  writeDesignRecord(root, { ...base, status: "superseded", currentShape: "A newer record owns this shape." });

  const index = readDesignIndex(root);
  assert.equal(index.records.length, 1);
  assert.equal(index.records[0].status, "superseded");
  assert.equal(readAcceptedDesignRecords(root).length, 0);
});

test("rejects invalid design keys and non-relative evidence pointers", (t) => {
  const root = workspace(t);
  assert.throws(
    () => writeDesignRecord(root, {
      key: "design-1",
      title: "Bad key",
      question: "x",
      currentShape: "y",
    }),
    /design key must match/,
  );
  assert.throws(
    () => writeDesignRecord(root, {
      key: "D003",
      title: "Bad pointer",
      question: "x",
      currentShape: "y",
      evidence: ["../outside.md"],
    }),
    /repository-relative/,
  );
});
