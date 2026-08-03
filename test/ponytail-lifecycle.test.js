import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const REPOSITORY_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PLUGIN_ROOT = path.join(REPOSITORY_ROOT, "plugins", "maga");
const HOOKS_ROOT = path.join(PLUGIN_ROOT, "hooks");
const TEST_ROOT = path.join(REPOSITORY_ROOT, "tmp", "tests");

function workspace(t) {
  fs.mkdirSync(TEST_ROOT, { recursive: true });
  const root = fs.mkdtempSync(path.join(TEST_ROOT, "ponytail-lifecycle-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}

function codexEnvironment(root, overrides = {}) {
  const home = path.join(root, "home");
  const pluginData = path.join(root, "plugin-data");
  const appData = path.join(root, "app-data");
  const xdgConfig = path.join(root, "xdg-config");
  fs.mkdirSync(home, { recursive: true });

  return {
    ...process.env,
    HOME: home,
    USERPROFILE: home,
    APPDATA: appData,
    XDG_CONFIG_HOME: xdgConfig,
    PLUGIN_DATA: pluginData,
    CLAUDE_PLUGIN_DATA: pluginData,
    CLAUDE_PLUGIN_ROOT: PLUGIN_ROOT,
    COPILOT_PLUGIN_DATA: "",
    QODER_SESSION_ID: "",
    PONYTAIL_DEFAULT_MODE: "",
    PONYTAIL_SUBAGENT_MATCHER: "",
    ...overrides,
  };
}

function runHook(script, env, input = "") {
  const result = spawnSync(process.execPath, [path.join(HOOKS_ROOT, script)], {
    env,
    input,
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout;
}

test("registers Ponytail's original Codex lifecycle events", () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(PLUGIN_ROOT, ".codex-plugin", "plugin.json")));
  const localPackage = JSON.parse(fs.readFileSync(path.join(PLUGIN_ROOT, "package.json")));
  const config = JSON.parse(fs.readFileSync(path.join(HOOKS_ROOT, "hooks.json")));

  assert.equal(manifest.hooks, undefined, "Codex should discover hooks/hooks.json by default");
  assert.equal(localPackage.type, "commonjs");
  assert.deepEqual(Object.keys(config.hooks).sort(), [
    "SessionStart",
    "SubagentStart",
    "UserPromptSubmit",
  ]);
  assert.equal(config.hooks.SessionStart[0].matcher, "startup|resume|clear|compact");

  for (const groups of Object.values(config.hooks)) {
    for (const group of groups) {
      for (const hook of group.hooks) {
        assert.match(hook.command, /^node /);
        assert.match(hook.commandWindows, /\$env:CLAUDE_PLUGIN_ROOT/);
        assert.doesNotMatch(hook.commandWindows, /%CLAUDE_PLUGIN_ROOT%/);
        const script = hook.command.match(/hooks\/([\w.-]+\.js)/)?.[1];
        assert.ok(script, hook.command);
        assert.equal(fs.existsSync(path.join(HOOKS_ROOT, script)), true, script);
      }
    }
  }
});

test("activates, switches, reinjects, and disables Ponytail in isolated Codex data", (t) => {
  const root = workspace(t);
  const env = codexEnvironment(root);
  const state = path.join(env.PLUGIN_DATA, ".ponytail-active");

  let output = JSON.parse(runHook("ponytail-activate.js", env));
  assert.equal(fs.readFileSync(state, "utf8"), "full");
  assert.equal(output.systemMessage, "PONYTAIL:FULL");
  assert.equal(output.hookSpecificOutput.hookEventName, "SessionStart");
  assert.match(output.hookSpecificOutput.additionalContext, /PONYTAIL MODE ACTIVE — level: full/);

  output = JSON.parse(runHook(
    "ponytail-mode-tracker.js",
    env,
    JSON.stringify({ prompt: "$ponytail ultra" }),
  ));
  assert.equal(fs.readFileSync(state, "utf8"), "ultra");
  assert.equal(output.systemMessage, "PONYTAIL:ULTRA");

  output = JSON.parse(runHook(
    "ponytail-mode-tracker.js",
    env,
    JSON.stringify({ prompt: "$ponytail-review" }),
  ));
  assert.equal(fs.readFileSync(state, "utf8"), "review");
  assert.equal(output.systemMessage, "PONYTAIL:REVIEW");

  output = JSON.parse(runHook(
    "ponytail-mode-tracker.js",
    env,
    JSON.stringify({ prompt: "$maga:ponytail lite" }),
  ));
  assert.equal(fs.readFileSync(state, "utf8"), "lite");
  assert.equal(output.systemMessage, "PONYTAIL:LITE");

  output = JSON.parse(runHook("ponytail-subagent.js", env));
  assert.equal(output.systemMessage, "PONYTAIL:LITE");
  assert.equal(output.hookSpecificOutput.hookEventName, "SubagentStart");
  assert.match(output.hookSpecificOutput.additionalContext, /PONYTAIL MODE ACTIVE — level: lite/);

  output = JSON.parse(runHook(
    "ponytail-mode-tracker.js",
    env,
    JSON.stringify({ prompt: "normal mode" }),
  ));
  assert.equal(fs.existsSync(state), false);
  assert.equal(output.systemMessage, "PONYTAIL:OFF");
});

test("persists a namespaced default inside this MAGA installation", (t) => {
  const root = workspace(t);
  const env = codexEnvironment(root);
  const configPath = path.join(env.PLUGIN_DATA, "ponytail", "config.json");

  const output = JSON.parse(runHook(
    "ponytail-mode-tracker.js",
    env,
    JSON.stringify({ prompt: "$maga:ponytail default ultra" }),
  ));
  assert.equal(output.systemMessage, "PONYTAIL:ULTRA");
  assert.equal(JSON.parse(fs.readFileSync(configPath, "utf8")).defaultMode, "ultra");
  assert.equal(fs.existsSync(path.join(env.APPDATA, "ponytail", "config.json")), false);
  assert.equal(fs.existsSync(path.join(env.XDG_CONFIG_HOME, "ponytail", "config.json")), false);

  const activated = JSON.parse(runHook("ponytail-activate.js", env));
  assert.equal(activated.systemMessage, "PONYTAIL:ULTRA");
  assert.match(activated.hookSpecificOutput.additionalContext, /PONYTAIL MODE ACTIVE — level: ultra/);
});

test("keeps help and gain routes informational without changing mode or default", (t) => {
  const root = workspace(t);
  const env = codexEnvironment(root);
  const state = path.join(env.PLUGIN_DATA, ".ponytail-active");
  const configPath = path.join(env.PLUGIN_DATA, "ponytail", "config.json");

  runHook("ponytail-activate.js", env);
  runHook(
    "ponytail-mode-tracker.js",
    env,
    JSON.stringify({ prompt: "$ponytail ultra" }),
  );
  runHook(
    "ponytail-mode-tracker.js",
    env,
    JSON.stringify({ prompt: "$ponytail default lite" }),
  );
  assert.equal(fs.readFileSync(state, "utf8"), "ultra");
  assert.equal(JSON.parse(fs.readFileSync(configPath, "utf8")).defaultMode, "lite");

  for (const prompt of [
    "$ponytail help",
    "$ponytail gain",
    "$maga:ponytail help",
    "$maga:ponytail gain",
  ]) {
    const output = JSON.parse(runHook(
      "ponytail-mode-tracker.js",
      env,
      JSON.stringify({ prompt }),
    ));
    assert.equal(output.systemMessage, "PONYTAIL:ULTRA", prompt);
    assert.equal(fs.readFileSync(state, "utf8"), "ultra", prompt);
    assert.equal(JSON.parse(fs.readFileSync(configPath, "utf8")).defaultMode, "lite", prompt);
  }

  for (const prompt of ["ponytail help", "show ponytail impact"]) {
    assert.equal(runHook(
      "ponytail-mode-tracker.js",
      env,
      JSON.stringify({ prompt }),
    ), "", prompt);
    assert.equal(fs.readFileSync(state, "utf8"), "ultra", prompt);
    assert.equal(JSON.parse(fs.readFileSync(configPath, "utf8")).defaultMode, "lite", prompt);
  }
});

test("mode tracker self-exits when Windows wrappers leave stdin open", async (t) => {
  const root = workspace(t);
  const child = spawn(process.execPath, [path.join(HOOKS_ROOT, "ponytail-mode-tracker.js")], {
    env: codexEnvironment(root),
    stdio: ["pipe", "ignore", "ignore"],
  });
  t.after(() => child.kill("SIGKILL"));

  const exitCode = await new Promise((resolve, reject) => {
    const guard = setTimeout(() => reject(new Error("mode tracker did not self-exit")), 3000);
    child.once("exit", (code) => {
      clearTimeout(guard);
      resolve(code);
    });
    child.once("error", reject);
  });

  assert.equal(exitCode, 0);
});
