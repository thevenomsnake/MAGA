import path from "node:path";

const ABSOLUTE_WINDOWS_PATH = /^[A-Za-z]:[\\/]/;

export function normalizeRepositoryPointer(pointer) {
  if (typeof pointer !== "string" || !pointer.trim()) {
    throw new Error("context pointer must be a non-empty repository-relative path");
  }

  const normalized = pointer.trim().replaceAll("\\", "/");
  if (
    path.isAbsolute(pointer)
    || normalized.startsWith("/")
    || ABSOLUTE_WINDOWS_PATH.test(normalized)
    || normalized.split("/").includes("..")
  ) {
    throw new Error(`context pointer must be repository-relative and stay inside the repository: ${pointer}`);
  }
  return normalized;
}

function uniquePointers(pointers) {
  return [...new Set(pointers.filter(Boolean).map(normalizeRepositoryPointer))];
}

export function buildContextPacket({
  outcome,
  projectPath = ".ai-workflow/PROJECT.md",
  rolePath,
  ticketPath,
  designPaths = [],
  references = [],
} = {}) {
  if (!ticketPath) throw new Error("context packet requires a Ticket pointer");

  const pointers = uniquePointers([
    projectPath,
    rolePath,
    ticketPath,
    ...designPaths,
    ...references,
  ]);

  return [
    "MAGA context packet",
    `Outcome: ${outcome || "Complete the linked Ticket within its recorded boundary."}`,
    "",
    "Read these repository-relative sources before acting:",
    ...pointers.map((pointer) => `- ${pointer}`),
    "",
    "Execution rules:",
    "- Treat the Ticket and its linked acceptance/proof as the work authority.",
    "- Keep product decisions, permissions, and expanded scope with the Project Lead.",
    "- Do not create another task or persist runtime IDs, machine paths, or transcripts.",
    "- Return behavior, validation, branch, commit, and blocker facts.",
  ].join("\n");
}
