---
name: grilling
description: "Stress-test a product plan, decision, or idea through a relentless one-question-at-a-time interview. Use when the user asks to be grilled, wants assumptions challenged, has a vague or risky plan that needs sharper decisions, or needs a project discussion turned into durable context. Automatically use a standalone mode for conversation-only work and a documented mode with domain modeling when a repository should retain decisions."
---

# Grilling

Interview the user relentlessly until the important branches and dependencies
reach a shared understanding. For every question, recommend an answer rather
than acting like a neutral questionnaire.

Ask exactly one question at a time and wait for the answer. If a fact can be
found from the environment or authoritative sources, find it instead of asking.
Product decisions remain the user's.

## Choose The Mode Automatically

- **Standalone:** use for an idea or plan with no repository, or when the user
  only wants conversational challenge. Do not create project documents.
- **Documented:** use when the work belongs to a repository and resolved terms
  or hard-to-reverse decisions should survive the conversation. Apply
  `domain-modeling` as needed to update the repository's established context or
  decision records; do not invent a parallel document system.

Do not ask the user to choose a mode or invoke another Skill. Switch from
standalone to documented only when durable project context becomes useful.

## Finish Deliberately

Do not implement the plan during the interview. When the important decisions
are resolved, summarize the shared understanding, remaining uncertainty, and
recommended next product step. Continue into action only after the user has
authorized that next step or their original request already did so.
