import assert from "node:assert/strict";
import test from "node:test";
import { installPlugin, runCli } from "../src/cli.js";

test("install command installs only the plugin", async () => {
  let installs = 0;
  let output = "";

  await runCli(["install"], {
    installPlugin: () => {
      installs += 1;
      return { name: "maga", version: "0.8.0" };
    },
    write: (value) => { output += value; },
  });

  assert.equal(installs, 1);
  assert.equal(output, "Installed MAGA 0.8.0.\n");
});

test("plugin installer configures its marketplace before installation", () => {
  const calls = [];
  const execute = (command, args) => {
    calls.push([command, ...args]);
    if (args.join(" ") === "plugin marketplace list --json") {
      return JSON.stringify({ marketplaces: [] });
    }
    if (args.join(" ") === "plugin add maga@maga --json") {
      return JSON.stringify({ name: "maga", version: "0.8.0" });
    }
    return "{}";
  };

  const result = installPlugin(execute);

  assert.deepEqual(result, { name: "maga", version: "0.8.0" });
  assert.deepEqual(calls, [
    ["codex", "plugin", "marketplace", "list", "--json"],
    ["codex", "plugin", "marketplace", "add", "thevenomsnake/MAGA", "--ref", "main", "--json"],
    ["codex", "plugin", "add", "maga@maga", "--json"],
  ]);
});
