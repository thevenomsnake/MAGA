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

export function installPlugin(execute = run) {
  const configured = JSON.parse(execute("codex", ["plugin", "marketplace", "list", "--json"]));
  if (configured.marketplaces?.some(({ name }) => name === "kann-workflows")) {
    execute("codex", ["plugin", "marketplace", "upgrade", "kann-workflows", "--json"]);
  } else {
    execute("codex", ["plugin", "marketplace", "add", MARKETPLACE, "--ref", "main", "--json"]);
  }
  return JSON.parse(execute("codex", ["plugin", "add", PLUGIN, "--json"]));
}

function usage() {
  return `Usage:
  kann-workflows install [--json]
  kann-workflows init [directory] [--name <project-name>] [--skip-plugin] [--no-git] [--no-commit] [--no-launch] [--no-open] [--json]
  kann-workflows start [directory] [--name <project-name>] [--no-open] [--json]

Use install to install only the Codex plugin. Use init to initialize an empty directory
with durable project state, install the plugin, create the Project Lead task, and open
the project in Codex. Use start to restore or create the Project Lead for an already
initialized project.`;
}

export function parseArgs(argv) {
  if (argv.length === 0 || argv.includes("--help") || argv.includes("-h")) {
    return { help: true };
  }

  if (!["install", "init", "start"].includes(argv[0])) {
    throw new Error(`unknown command: ${argv[0]}\n\n${usage()}`);
  }

  if (argv[0] === "install") {
    const invalid = argv.slice(1).filter((arg) => arg !== "--json");
    if (invalid.length > 0) throw new Error(`unknown option: ${invalid[0]}`);
    return { command: "install", json: argv.includes("--json") };
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

export async function runCli(argv, dependencies = {}) {
  const options = parseArgs(argv);
  const install = dependencies.installPlugin || installPlugin;
  const write = dependencies.write || ((output) => process.stdout.write(output));
  if (options.help) {
    write(`${usage()}\n`);
    return;
  }

  if (options.command === "install") {
    const plugin = install();
    write(options.json
      ? `${JSON.stringify(plugin)}\n`
      : `Installed Kann Workflows${plugin.version ? ` ${plugin.version}` : ""}.\n`);
    return;
  }

  options.targetDir = path.resolve(options.targetDir);

  if (options.command === "start") {
    const projectName = options.projectName?.trim() || readProjectName(options.targetDir);
    const projectLead = await startProjectLead(options, projectName);
    if (options.json) {
      write(`${JSON.stringify({ targetDir: options.targetDir, projectLead })}\n`);
    } else {
      write(`${projectLead.reused ? "Opened" : "Created"} ${projectLead.title}.\n`);
    }
    return;
  }

  if (options.installPlugin) install();
  const result = initProject(options);
  const projectLead = options.launch
    ? await startProjectLead(options, result.projectName)
    : null;

  if (options.json) {
    write(`${JSON.stringify({ ...result, projectLead })}\n`);
    return;
  }

  write(
    result.alreadyInitialized
      ? `Kann Workflows is already initialized in ${result.targetDir}.\n`
      : `Initialized ${result.projectName} in ${result.targetDir}.\n`,
  );

  if (projectLead) {
    write(`${projectLead.reused ? "Opened" : "Created"} ${projectLead.title}.\n`);
  }

  if (result.commit === "skipped-no-identity") {
    write("Git was initialized, but the first commit was skipped because no Git identity is configured.\n");
  }
}
