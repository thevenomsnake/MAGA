#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const event = process.argv[2] === 'SubagentStart' ? 'SubagentStart' : 'SessionStart';

function git(cwd, args) {
  return spawnSync('git', args, {
    cwd,
    encoding: 'utf8',
    shell: false,
    windowsHide: true,
  });
}

function hookOutput(context) {
  const isCopilot = Boolean(process.env.COPILOT_PLUGIN_DATA);
  const isCodex = !isCopilot && Boolean(process.env.PLUGIN_DATA);
  const isQoder = !isCopilot && !isCodex && Boolean(process.env.QODER_SESSION_ID);

  if (isCopilot) {
    return event === 'SessionStart' ? { additionalContext: context } : {};
  }
  if (isCodex) {
    return {
      systemMessage: 'MAGA:GIT-BASELINE',
      hookSpecificOutput: { hookEventName: event, additionalContext: context },
    };
  }
  if (isQoder || event === 'SubagentStart') {
    return {
      hookSpecificOutput: { hookEventName: event, additionalContext: context },
    };
  }
  return context;
}

try {
  const rootResult = git(process.cwd(), ['rev-parse', '--show-toplevel']);
  if (rootResult.status !== 0) process.exit(0);

  const root = rootResult.stdout.trim();
  const headResult = git(root, ['rev-parse', 'HEAD']);
  const branchResult = git(root, ['symbolic-ref', '--quiet', '--short', 'HEAD']);
  const statusResult = git(root, ['status', '--porcelain=v1', '-z', '--untracked-files=all']);
  const commonDirResult = git(root, ['rev-parse', '--git-common-dir']);
  if (headResult.status !== 0 || statusResult.status !== 0 || commonDirResult.status !== 0) {
    process.exit(0);
  }

  const head = headResult.stdout.trim();
  const branch = branchResult.status === 0 ? branchResult.stdout.trim() : null;
  const dirty = statusResult.stdout.split('\0').filter(Boolean);
  const commonDirValue = commonDirResult.stdout.trim();
  const commonDir = path.isAbsolute(commonDirValue)
    ? commonDirValue
    : path.resolve(root, commonDirValue);
  const magaDir = path.join(commonDir, 'maga');
  const ledgerPath = path.join(magaDir, 'baselines.ndjson');

  fs.mkdirSync(magaDir, { recursive: true });
  fs.appendFileSync(ledgerPath, `${JSON.stringify({
    recordedAt: new Date().toISOString(),
    event,
    branch,
    head,
    dirty,
  })}\n`, 'utf8');

  const releaseTool = path.resolve(__dirname, '..', 'scripts', 'git-release.js');
  const dirtySummary = dirty.length === 0
    ? 'clean'
    : `${dirty.length} pre-existing dirty record(s); treat every listed path as protected work`;
  const context = `MAGA GIT BASELINE RECORDED

Branch: ${branch || '(detached)'}
HEAD: ${head}
Starting state: ${dirtySummary}
Local ledger: ${ledgerPath}

Before writing, keep work on an explicit branch or permitted isolated worktree and do not overwrite pre-existing dirty paths. Serialize writers in a shared checkout. After the smallest runnable vertical slice, run one directly relevant smoke and commit it. Before switching, syncing, or cleaning, preserve current work in a commit or another recoverable Git form. Never use reset --hard or checkout to discard changes.

Deploy only a full commit from a clean tree. Treat .gitattributes with "* text=auto eol=lf" as the text-byte authority. Generators must write LF bytes first, then read those final bytes to calculate byteLength and sha256 for every manifest or catalog entry. Build release archives with git -c core.autocrlf=false archive; never repair line endings with server-side override files. Use the MAGA release helper at ${releaseTool} for commit validation, archives, and deployment records.`;

  const output = hookOutput(context);
  process.stdout.write(typeof output === 'string' ? output : JSON.stringify(output));
} catch {
  process.exit(0);
}
