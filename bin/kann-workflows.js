#!/usr/bin/env node

import { runCli } from "../src/cli.js";

runCli(process.argv.slice(2)).catch((error) => {
  process.stderr.write(`kann-workflows: ${error.message}\n`);
  process.exitCode = 1;
});
