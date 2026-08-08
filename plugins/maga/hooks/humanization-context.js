#!/usr/bin/env node

const event = process.argv[2] === 'SubagentStart' ? 'SubagentStart' : 'SessionStart';

const context = `HUMANIZATION TEXT ROUTING ACTIVE

When the task's deliverable includes authored user-facing text, apply the registered $humanization Skill as its final editorial pass. This includes substantive answers and explanations, articles, documentation, email, product or marketing copy, and visible webpage or app text.

Use the requested locale when one is explicit; otherwise use the conversation's clear active locale. Route articles and explanations as prose, bounded product or communication text as copy, and interface text as web-microcopy. Ask one focused question only when an unresolved locale or content choice would change facts, promises, privacy, or the CTA.

Preserve facts, source boundaries, uncertainty, capabilities, privacy claims, CTA, brand terms, citations, and the user's deliberate voice. Keep code, commands, paths, URLs, identifiers, placeholders, variables, ICU messages, markup, data, machine-readable syntax, and verbatim quotations exact unless the user explicitly asks to change them.

Humanization governs text-production work, not routine collaboration chatter or technical payloads. Do not invoke it for brief acknowledgements, progress updates, tool results, Git status, or raw code, commands, configuration, data, and machine protocols. A short accurate answer may remain short; no_change is a valid result.`;

const isCopilot = Boolean(process.env.COPILOT_PLUGIN_DATA);
const isCodex = !isCopilot && Boolean(process.env.PLUGIN_DATA);
const isQoder = !isCopilot && !isCodex && Boolean(process.env.QODER_SESSION_ID);

if (isCopilot) {
  process.stdout.write(JSON.stringify(
    event === 'SessionStart' ? { additionalContext: context } : {},
  ));
} else if (isCodex) {
  process.stdout.write(JSON.stringify({
    systemMessage: 'HUMANIZATION:TEXT-ROUTING',
    hookSpecificOutput: {
      hookEventName: event,
      additionalContext: context,
    },
  }));
} else if (isQoder || event === 'SubagentStart') {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: event,
      additionalContext: context,
    },
  }));
} else {
  process.stdout.write(context);
}
