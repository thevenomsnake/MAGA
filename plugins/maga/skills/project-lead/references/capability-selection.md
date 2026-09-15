# Capability Selection And Explicit Settings

Read when choosing an internal method or when the user explicitly requests configuration or takeover.

## Route Capabilities Internally

Select installed skills and tools without asking the user to name them. For the
full routing and workspace split, read
[references/capability-routing.md](capability-routing.md). Load it when
the request could require discussion, research, a prototype, specification,
delivery, diagnosis, review, or a fresh Codex task.

Only when the user explicitly asks to configure MAGA's models or reasoning
depth—or enters through the plugin's Configure starter prompt—call the bundled
`show_maga_compute_settings` tool and present its panel. Do not turn this into a
project Ticket. Do not offer model, reasoning-depth, or plan-selection advice.
Saved choices are authoritative for explicitly created new tasks;
without saved choices, omit model and reasoning overrides so Codex uses its host
defaults. Do not infer a different model because a task appears easy or difficult.

Do not switch the model of an existing Project Lead in place. When the Product
Owner explicitly asks to "use the new configuration to take over this project":

1. Bring durable project state up to date and commit it before handoff.
2. Resolve the saved `project-lead` profile. Unconfigured fields inherit the host
   default; do not prompt for a model selection.
3. Create one unpinned replacement Project Lead in the same saved project and
   local environment under a unique temporary title shaped as
   `<project> · Project Lead · takeover <short-id>`, passing the resolved non-null
   model and thinking values. The explicit takeover request authorizes this new
   task and refers to the saved concrete configuration.
4. Give the replacement only a read-only recovery prompt: read `AGENTS.md`,
   `.ai-workflow/PROJECT.md`, linked active roles, and active Tickets; report the
   current product state and next decision without modifying or dispatching work.
5. Wait for successful recovery. Then retire this Project Lead, rename the
   replacement to the canonical `<project> · Project Lead` title, and pin it. If
   recovery fails, keep this Project Lead authoritative and archive the temporary
   replacement. Never leave two active tasks with the canonical title.

This replacement path preserves conversation history as history while making the
new responsibility setting real. Never claim that saving the panel changed a
running task.

In particular:

- keep quick clarification in this task and isolate likely multi-turn product exploration through the exploration loop;
- apply Humanization silently only when the task writes or edits human-readable
  text in a local file, while leaving every chat-only response and technical
  payload unchanged;
- use research for missing external facts;
- use domain modeling for overloaded product language;
- use a throwaway prototype for experiential uncertainty;
- use minimal implementation constraints for ordinary building;
- use diagnosis for observed failures;
- use visual critique when a real interface looks generic or incoherent;
- use the human-only gate reference for authenticated, secret, payment,
  migration, cutover, or irreversible steps the agent cannot own;
- use stronger testing or review only when requested or justified by a documented risk.

Quick product clarification and specification synthesis may run inside the
Project Lead. Pre-Ticket exploration runs in its bounded read-only task and
returns an accepted decision here. Configured research, prototype, delivery,
diagnosis, review, and release Tickets run in their responsibility worker.
Direct manual Skill use outside that route inherits the current task's model and
preserves the original Skill behavior. Capabilities do not become roles unless
they acquire durable context, ownership, or authority.

