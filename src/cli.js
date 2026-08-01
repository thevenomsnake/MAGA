import { spawnSync } from "node:child_process";
import path from "node:path";
import { initProject } from "./init-project.js";

const MARKETPLACE = "thevenomsnake/kann_workflows";
const PLUGIN = "kann-workflows@kann-workflows";

function run(command, args) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    shell: false,
  });

  if (result.error || result.status !== 0) {
    const detail = result.stderr?.trim() || result.stdout?.trim() || result.error?.message;
    throw new Error(`${command} ${args.join(" ")} failed${detail ? `: ${detail}` : ""}`);
  }

  return result.stdout.trim();
}

export function installPlugin() {
  const configured = JSON.parse(run("codex", ["plugin", "marketplace", "list", "--json"]));
  if (configured.marketplaces?.some(({ name }) => name === "kann-workflows")) {
    run("codex", ["plugin", "marketplace", "upgrade", "kann-workflows", "--json"]);
  } else {
    run("codex", ["plugin", "marketplace", "add", MARKETPLACE, "--ref", "main", "--json"]);
  }
  run("codex", ["plugin", "add", PLUGIN, "--json"]);
}

function usage() {
  return `Usage:
  kann-workflows init [directory] [--name <project-name>] [--skip-plugin] [--no-git] [--no-commit] [--json]

Initializes an empty directory with the minimum durable project state. By default,
the command installs the Kann Workflows Codex plugin and initializes Git.`;
}

function parseArgs(argv) {
  if (argv.length === 0 || argv.includes("--help") || argv.includes("-h")) {
    return { help: true };
  }

  if (argv[0] !== "init") {
    throw new Error(`unknown command: ${argv[0]}\n\n${usage()}`);
  }

  const options = {
    targetDir: process.cwd(),
    installPlugin: true,
    git: true,
    commit: true,
    json: false,
  };

  let positionalSeen = false;
  for (let index = 1; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--name") {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) throw new Error("--name requires a value");
      options.projectName = value;
      index += 1;
    } else if (arg === "--skip-plugin") {
      options.installPlugin = false;
    } else if (arg === "--no-git") {
      options.git = false;
      options.commit = false;
    } else if (arg === "--no-commit") {
      options.commit = false;
    } else if (arg === "--json") {
      options.json = true;
    } else if (arg.startsWith("--")) {
      throw new Error(`unknown option: ${arg}`);
    } else if (!positionalSeen) {
      options.targetDir = path.resolve(arg);
      positionalSeen = true;
    } else {
      throw new Error(`unexpected argument: ${arg}`);
    }
  }

  return options;
}

export async function runCli(argv) {
  const options = parseArgs(argv);
  if (options.help) {
    process.stdout.write(`${usage()}\n`);
    return;
  }

  if (options.installPlugin) installPlugin();
  const result = initProject(options);

  if (options.json) {
    process.stdout.write(`${JSON.stringify(result)}\n`);
    return;
  }

  process.stdout.write(
    result.alreadyInitialized
      ? `Kann Workflows is already initialized in ${result.targetDir}.\n`
      : `Initialized ${result.projectName} in ${result.targetDir}.\n`,
  );

  if (result.commit === "skipped-no-identity") {
    process.stdout.write("Git was initialized, but the first commit was skipped because no Git identity is configured.\n");
  }
}
