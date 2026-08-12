#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const event = process.argv[2] === 'SubagentStart' ? 'SubagentStart' : 'SessionStart';

function hookOutput(context) {
  const isCopilot = Boolean(process.env.COPILOT_PLUGIN_DATA);
  const isCodex = !isCopilot && Boolean(process.env.PLUGIN_DATA);
  const isQoder = !isCopilot && !isCodex && Boolean(process.env.QODER_SESSION_ID);

  if (isCopilot) return event === 'SessionStart' ? { additionalContext: context } : {};
  if (isCodex) {
    return {
      systemMessage: 'MAGA:SKILL-LABELS',
      hookSpecificOutput: { hookEventName: event, additionalContext: context },
    };
  }
  if (isQoder || event === 'SubagentStart') {
    return { hookSpecificOutput: { hookEventName: event, additionalContext: context } };
  }
  return context;
}

try {
  const catalog = JSON.parse(fs.readFileSync(
    path.resolve(__dirname, '..', 'skill-catalog.json'),
    'utf8',
  ));
  const labels = catalog.skills
    .filter(({ status }) => status === 'registered')
    .map(({ id, display_name: displayName }) => `${id} -> ${displayName}`)
    .join('\n');
  const context = `MAGA SKILL LABELS ACTIVE

When user-facing progress, explanations, or results name a registered MAGA Skill, use its exact display label below instead of a bare technical ID:
${labels}

Keep technical IDs such as $project-lead only in explicit invocation syntax, configuration, paths, code, or debugging. Skill routing and invocation continue to use the technical IDs.`;

  const output = hookOutput(context);
  process.stdout.write(typeof output === 'string' ? output : JSON.stringify(output));
} catch {
  process.exit(0);
}
