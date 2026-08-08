#!/usr/bin/env node

const event = process.argv[2] === 'SubagentStart' ? 'SubagentStart' : 'SessionStart';

const context = `HUMANIZATION LOCAL-FILE ROUTING ACTIVE

Apply the registered $humanization Skill automatically only when the current task will write or edit human-readable natural language in a local file. This includes Markdown and document files, reports, articles, saved email or message drafts, release notes, and visible webpage or app text in source or resource files.

Use one deterministic automatic boundary: will this work create or update a local file? If no, do not invoke Humanization automatically. If yes, apply it only to the file's human-readable prose or copy. Use the requested locale when one is explicit; otherwise use the conversation's clear active locale. Infer the format and surface silently. Route articles, stories, and reports as prose, bounded documents and communication text as copy, and interface text as web-microcopy.

Preserve facts, source boundaries, uncertainty, capabilities, privacy claims, CTA, brand terms, citations, and the user's deliberate voice. Keep code, commands, paths, URLs, identifiers, placeholders, variables, ICU messages, markup, data, machine-readable syntax, and verbatim quotations exact unless the user explicitly asks to change them.

Text returned only in chat stays outside automatic Humanization, including answers, explanations, articles, email drafts, diagnoses, status reports, recommendations, next steps, confirmations, progress updates, tool results, and Git status. Its length, Markdown formatting, copy-readiness, or possible later sharing does not change that boundary. Explicit user invocation remains valid. Keep raw code, commands, configuration, data, and machine protocols outside the editorial pass. Run silently: never announce, cite, or explain that MAGA, Humanization, routing, or an editorial pass was used, and never ask a question just to configure this pass. Preserve uncertain content or use no_change instead. Short file content may remain short.`;

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
