import { spawn, spawnSync } from "node:child_process";
import path from "node:path";
import { launchProjectLead } from "./codex-bridge.js";
import { initProject, readProjectName } from "./init-project.js";

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
  kann-workflows init [directory] [--name <project-name>] [--skip-plugin] [--no-git] [--no-commit] [--no-launch] [--no-open] [--json]
  kann-workflows start [directory] [--name <project-name>] [--no-open] [--json]

Initializes an empty directory with durable project state, installs the Codex plugin,
creates the Project Lead task, and opens the project in Codex. Use start to restore or
create the Project Lead for an already initialized project.`;
}

function parseArgs(argv) {
  if (argv.length === 0 || argv.includes("--help") || argv.includes("-h")) {
    return { help: true };
  }

  if (!["init", "start"].includes(argv[0])) {
    throw new Error(`unknown command: ${argv[0]}\n\n${usage()}`);
  }

  const options = {
    command: argv[0],
    targetDir: process.cwd(),
    installPlugin: true,
    git: true,
    commit: true,
    launch: true,
    open: true,
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
    } else if (arg === "--skip-plugin" && options.command === "init") {
      options.installPlugin = false;
    } else if (arg === "--no-git" && options.command === "init") {
      options.git = false;
      options.commit = false;
    } else if (arg === "--no-commit" && options.command === "init") {
      options.commit = false;
    } else if (arg === "--no-launch" && options.command === "init") {
      options.launch = false;
      options.open = false;
    } else if (arg === "--no-open") {
      options.open = false;
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

function openCodex(targetDir) {
  return new Promise((resolve, reject) => {
    const child = spawn("codex", ["app", targetDir], {
      detached: true,
      stdio: "ignore",
      windowsHide: true,
      shell: false,
    });
    child.once("error", reject);
    child.once("spawn", () => {
      child.unref();
      resolve();
    });
  });
}

async function startProjectLead(options, projectName) {
  const onReady = options.open
    ? () => openCodex(options.targetDir)
    : undefined;
  const result = await launchProjectLead({
    targetDir: options.targetDir,
    projectName,
    onReady,
  });
  return { title: result.title, reused: result.reused, opened: options.open };
}

export async function runCli(argv) {
  const options = parseArgs(argv);
  if (options.help) {
    process.stdout.write(`${usage()}\n`);
    return;
  }

  options.targetDir = path.resolve(options.targetDir);

  if (options.command === "start") {
    const projectName = options.projectName?.trim() || readProjectName(options.targetDir);
    const projectLead = await startProjectLead(options, projectName);
    if (options.json) {
      process.stdout.write(`${JSON.stringify({ targetDir: options.targetDir, projectLead })}\n`);
    } else {
      process.stdout.write(`${projectLead.reused ? "Opened" : "Created"} ${projectLead.title}.\n`);
    }
    return;
  }

  if (options.installPlugin) installPlugin();
  const result = initProject(options);
  const projectLead = options.launch
    ? await startProjectLead(options, result.projectName)
    : null;

  if (options.json) {
    process.stdout.write(`${JSON.stringify({ ...result, projectLead })}\n`);
    return;
  }

  process.stdout.write(
    result.alreadyInitialized
      ? `Kann Workflows is already initialized in ${result.targetDir}.\n`
      : `Initialized ${result.projectName} in ${result.targetDir}.\n`,
  );

  if (projectLead) {
    process.stdout.write(`${projectLead.reused ? "Opened" : "Created"} ${projectLead.title}.\n`);
  }

  if (result.commit === "skipped-no-identity") {
    process.stdout.write("Git was initialized, but the first commit was skipped because no Git identity is configured.\n");
  }
}
