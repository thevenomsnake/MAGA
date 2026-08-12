#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

function option(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? null : process.argv[index + 1];
}

function git(repo, args) {
  const result = spawnSync('git', args, {
    cwd: repo,
    encoding: 'utf8',
    shell: false,
    windowsHide: true,
  });
  if (result.status !== 0) fail(result.stderr.trim() || `git ${args.join(' ')} failed`);
  return result.stdout;
}

function repositoryRoot() {
  const requested = path.resolve(option('--repo') || process.cwd());
  return git(requested, ['rev-parse', '--show-toplevel']).trim();
}

function explicitCommit(repo) {
  const requested = option('--commit');
  if (!requested || !/^[0-9a-f]{40}$/i.test(requested)) {
    fail('--commit must be a full 40-character commit hash');
  }
  const resolved = git(repo, ['rev-parse', '--verify', `${requested}^{commit}`]).trim();
  if (resolved.toLowerCase() !== requested.toLowerCase()) fail('commit did not resolve exactly');
  return resolved;
}

function ensureClean(repo) {
  if (git(repo, ['status', '--porcelain=v1', '-z', '--untracked-files=all']).length > 0) {
    fail('release worktree is dirty; commit or preserve every change before deployment');
  }
}

function ensureLfAuthority(repo, commit) {
  const attributes = git(repo, ['show', `${commit}:.gitattributes`]);
  if (!attributes.split(/\r?\n/).includes('* text=auto eol=lf')) {
    fail('commit does not declare "* text=auto eol=lf" in .gitattributes');
  }
}

function commonMagaDir(repo) {
  const value = git(repo, ['rev-parse', '--git-common-dir']).trim();
  const common = path.isAbsolute(value) ? value : path.resolve(repo, value);
  const directory = path.join(common, 'maga');
  fs.mkdirSync(directory, { recursive: true });
  return directory;
}

function deploymentRecords(repo) {
  const ledger = path.join(commonMagaDir(repo), 'deployments.ndjson');
  if (!fs.existsSync(ledger)) return { ledger, records: [] };
  const records = fs.readFileSync(ledger, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line, index) => {
      try {
        return JSON.parse(line);
      } catch {
        fail(`invalid deployment ledger record at line ${index + 1}`);
      }
    });
  return { ledger, records };
}

function releasePreflight(repo, commit) {
  ensureClean(repo);
  ensureLfAuthority(repo, commit);
  const { records } = deploymentRecords(repo);
  const previous = [...records].reverse().find((record) => record.status === 'succeeded');
  return {
    commit,
    previousKnownGood: previous?.deployedCommit || null,
  };
}

function outputPath(repo) {
  const requested = option('--output');
  if (!requested || path.isAbsolute(requested)) {
    fail('--output must be a repository-relative path');
  }
  const resolved = path.resolve(repo, requested);
  const relative = path.relative(repo, resolved);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
    fail('--output must stay inside the repository');
  }
  if (fs.existsSync(resolved)) fail('refusing to overwrite an existing release archive');
  fs.mkdirSync(path.dirname(resolved), { recursive: true });
  return resolved;
}

function archive(repo, commit) {
  const preflight = releasePreflight(repo, commit);
  const output = outputPath(repo);
  git(repo, [
    '-c',
    'core.autocrlf=false',
    'archive',
    '--format=tar',
    `--output=${output}`,
    commit,
  ]);
  const bytes = fs.readFileSync(output);
  return {
    ...preflight,
    archive: path.relative(repo, output).replaceAll(path.sep, '/'),
    byteLength: bytes.byteLength,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
  };
}

function recordDeployment(repo, commit) {
  const status = option('--status');
  if (status !== 'succeeded' && status !== 'failed') {
    fail('--status must be succeeded or failed');
  }
  ensureLfAuthority(repo, commit);
  const { ledger, records } = deploymentRecords(repo);
  const previous = [...records].reverse().find((record) => record.status === 'succeeded');
  const previousKnownGood = previous?.deployedCommit || null;
  const record = {
    recordedAt: new Date().toISOString(),
    status,
    attemptedCommit: commit,
    deployedCommit: status === 'succeeded' ? commit : previousKnownGood,
    previousKnownGood,
    rollbackCommit: status === 'failed' ? previousKnownGood : null,
  };
  fs.appendFileSync(ledger, `${JSON.stringify(record)}\n`, 'utf8');
  return record;
}

function status(repo) {
  const branchResult = spawnSync('git', ['symbolic-ref', '--quiet', '--short', 'HEAD'], {
    cwd: repo,
    encoding: 'utf8',
    shell: false,
    windowsHide: true,
  });
  const { records } = deploymentRecords(repo);
  return {
    branch: branchResult.status === 0 ? branchResult.stdout.trim() : null,
    head: git(repo, ['rev-parse', 'HEAD']).trim(),
    dirty: git(repo, ['status', '--porcelain=v1', '-z', '--untracked-files=all'])
      .split('\0')
      .filter(Boolean),
    deployment: records.at(-1) || null,
  };
}

const command = process.argv[2];
const repo = repositoryRoot();
let result;

if (command === 'prepare') {
  result = releasePreflight(repo, explicitCommit(repo));
} else if (command === 'archive') {
  result = archive(repo, explicitCommit(repo));
} else if (command === 'record') {
  result = recordDeployment(repo, explicitCommit(repo));
} else if (command === 'status') {
  result = status(repo);
} else {
  fail('usage: git-release.js prepare|archive|record|status [--repo PATH] [--commit SHA] [--output PATH] [--status succeeded|failed]');
}

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
