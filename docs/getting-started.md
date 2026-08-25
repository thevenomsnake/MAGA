# Getting started with MAGA

**English** · [简体中文](./getting-started.zh-CN.md) · [日本語](./getting-started.ja.md) · [한국어](./getting-started.ko.md) · [Español](./getting-started.es.md)

This guide assumes you have never used Codex, opened a terminal, or reviewed code. By the end, MAGA will be installed in one local project and you will have asked for your first inspectable product result.

## What you need

- A Windows or macOS computer.
- A ChatGPT account with access to Codex.
- An internet connection.
- A product idea. One sentence is enough.
- An empty folder where the product can live.

You do **not** need to install developer tools yourself. Codex can check for Node.js, Git, and other prerequisites, explain what is missing, and request approval before installing anything.

## 1. Open Codex for the first time

1. Install the [ChatGPT desktop app](https://learn.chatgpt.com/docs/quickstart?setup=app).
2. Open it and sign in with your ChatGPT account.
3. Choose **Codex** from the ChatGPT selector.

If Codex is not listed, check that your account or workspace includes Codex access. You do not need the command-line version for this guide.

## 2. Give the product a home

Create an empty folder in File Explorer or Finder. Give it a plain product name such as `client-feedback` or `weekly-planning`. The name can change later.

In the desktop app, create a local project or open that folder as the project. Confirm that the folder shown in Codex is the one you just created. Codex can read and change files in folders attached to the project, so do not select a broad folder containing unrelated personal files.

## 3. Ask Codex to install MAGA

Paste this into the current Codex task:

> Set up this project with the MAGA plugin from https://github.com/thevenomsnake/MAGA. Check and install any missing prerequisites, initialize or restore MAGA in this folder, create or restore its named Project Lead task, verify that it works, and tell me the exact Project Lead task to open when it is ready. Perform the technical steps yourself and ask me only for approvals that are actually required. Do not ask me to copy commands into a terminal unless you are genuinely blocked.

Codex should inspect the environment, obtain MAGA, initialize the project, and verify the result. You can let Codex choose the commands; your job is to judge the approval requests.

### How to judge an approval request

Approve only when the request clearly matches the step Codex just explained.

| Request mentions | Usually means | What to do |
| --- | --- | --- |
| The project folder you selected | Create or update product files | Approve if the path is correct |
| GitHub or the MAGA repository | Download the plugin | Approve if the destination is this project or the Codex plugin area |
| Node.js or Git | Install a missing prerequisite | Approve after Codex explains why it is needed |
| A browser sign-in | Authenticate an account | Sign in in the browser; never paste a password or access token into a task |
| An unrelated folder, account, payment, or destructive deletion | Work outside setup | Stop and ask Codex why it is necessary |

GitHub sign-in, account or repository settings, pushes, and Issue or Pull Request writes are not part of default setup authority. Downloading the specified MAGA repository is the only GitHub operation this setup request assumes.

If the wording is unclear, reply:

> Explain in product language what this approval changes, where it changes it, and whether it is reversible.

## 4. Open the Project Lead task

MAGA initialization creates or restores one named, pinned Project Lead task. When Codex says setup is complete:

1. Stay inside the same project.
2. Open the **Project Lead task** that setup identified, normally named `<project> · Project Lead`.
3. Leave the setup task available in case you need its error details later.

Do not create an arbitrary task in its place. If the Project Lead task is not visible, ask Codex to restore the Project Lead for this same project and identify the exact task to open.

### Optional: choose models by responsibility

Open the MAGA plugin detail page and select its **Configure** starter prompt. Codex will start a MAGA task and open an in-task configuration panel. Choose the starting profile that best matches your current allowance, then adjust any row if needed:

| Responsibility | Pro · quality first | Plus · regular use | Free / Go · quota saver |
| --- | --- | --- | --- |
| Project Lead | Sol · xhigh | Sol · xhigh | Terra · xhigh |
| Research | Sol · max | Sol · max | Terra · max |
| Prototype | Sol · xhigh | Terra · high | Terra · high |
| Delivery | Terra · xhigh | Luna · max | Luna · max |
| Diagnosis | Sol · max | Terra · xhigh | Terra · high |
| Review | Sol · xhigh | Sol · high | Terra · high |
| Release | Sol · xhigh | Sol · high | Sol · high |

Business, Enterprise, and Edu workspaces can start with Plus and move to Pro when their allowance and workspace policy support it. API-key users should choose by token budget. Sol handles ambiguity and assurance, Terra is the everyday workhorse, and Luna is recommended only at **max** for clear, repeatable delivery. Higher reasoning can take longer and use more tokens.

Until you click **Save**, the profile is only a recommendation and MAGA uses the Codex host defaults. The first save confirms all seven rows in the current Codex Home, not this product folder or its Git history; later saves merge only the rows you changed. Saved choices apply only to new tasks covered by explicit approval or the project's confirmed Autonomy Policy. Existing tasks stay unchanged, and Project Lead adopts them only when newly created or explicitly replaced at your request. The panel's `model/list` is only a reference catalog. The destination host performs final validation when MAGA creates an approved task; if it rejects the saved choice, MAGA retries once without overrides and tells you that the host default was used.

## 5. Describe the first product

You can begin with one sentence:

The client-feedback tool below is another product-description example. The small interest-community app used in MAGA's responsibility guide remains the canonical explanatory example.

> Use MAGA as my Project Lead. I want to make a tool that helps independent designers organize client feedback. I do not know code, so keep questions in product language and give me working results I can inspect.

If you already know more, use this copy-ready structure:

> Use MAGA as my Project Lead. I want to build **[what]** for **[which people]**. Today they struggle with **[problem]**. The first useful result should let them **[observable outcome]**. The things we must not trade away are **[constraints]**. I do not know code; ask only questions that can change the product direction, risk, or permission boundary.

Do not delay because some blanks are unknown. MAGA should help you discover them.

## 6. Answer product questions, not engineering questions

MAGA may ask a small number of questions before building. Answer with what you know.

| MAGA asks about | What it means | Example answer |
| --- | --- | --- |
| User | Who experiences the problem | Independent designers managing 3–10 clients |
| Problem | What is difficult today | Feedback is scattered across chat, email, and documents |
| First useful result | The earliest behavior worth inspecting | Add feedback to a project and see what blocks delivery |
| Constraint | What cannot be traded away | A designer must understand the screen without training |
| Trade-off | What can wait | Team permissions can wait; project-level organization cannot |
| Permission | What Codex may do now | Build the local prototype, but do not publish or contact anyone |
| Task coordination | Whether MAGA may open named workers inside approved work | Yes, with a confirmed limit of two; new scope and external actions still require approval |

You can always say, “I do not know yet. Show me the smallest example that would help me decide.”

## 7. Inspect the product without reviewing code

When Codex returns a working result, ignore the code diff unless you want to see it. Review the product through behavior and experience:

1. Can the intended user complete the main task?
2. Is the first useful value visible quickly?
3. Does the result use the user's language rather than internal technical terms?
4. What happens when information is missing, wrong, or empty?
5. Which part feels slower, less clear, or less trustworthy than expected?
6. Does it solve the product problem, or merely demonstrate technology?

Give feedback in observations:

> I can add feedback, but the result still feels like a generic task manager. I expected project changes and delivery blockers to be visible first. Keep the underlying data, change the information hierarchy, and show me the revised flow before adding more features.

You do not need to name a component, framework, database, or line of code.

When the slice is good enough, say so explicitly:

> I accept this product slice. Record what was accepted, what remains open, and the next smallest useful outcome. Do not start the next outcome until you show me the boundary.

## 8. Continue tomorrow

Open the same project and return to its named, pinned Project Lead task. Say:

> Continue this MAGA project from its saved state. First summarize the accepted decisions, open questions, current product behavior, and the next proposed outcome. Do not change anything until I confirm that summary.

MAGA stores durable decisions in the project so you are not dependent on one long task transcript. Keep product discussion in the Project Lead task. MAGA proposes a separate, specifically named task only when a concrete piece of work benefits from its own boundary and you approve it.

## 9. Common problems

| Problem | What to say or do |
| --- | --- |
| Codex asks you to run a terminal command | “Please run that step yourself. If you need permission, explain the narrowest approval required.” |
| A prerequisite is missing | Ask Codex to install it, verify the version, and retry the interrupted step |
| MAGA is not recognized | Confirm setup finished, then ask Codex to restore the named Project Lead task; installed plugins are loaded into newly created tasks |
| The download cannot reach GitHub | Check the internet connection and GitHub access, then ask Codex to retry only the failed download |
| Installation fails | Paste the complete error back to Codex and ask it to diagnose, repair, and verify instead of giving you commands |
| Codex asks too many questions | “Ask only questions whose answers can change the direction, risk, or permission boundary. Use a reversible default for the rest.” |
| The result is technically impressive but product-wrong | Describe what you observed, what you expected, and which user outcome matters |
| The Project Lead task seems to forget the project | Confirm it is inside the same local project, then ask it to read the saved project state before acting |
| An approval reaches outside the selected folder | Decline it and ask for a project-scoped alternative |

## 10. Small glossary

- **Project:** the folder, tasks, and durable context for one product.
- **Task:** a visible Codex work unit inside a project. MAGA keeps one named Project Lead task as the main product entry.
- **Plugin:** an installable bundle that gives Codex reusable workflows and tools.
- **Project Lead:** MAGA's product-facing coordinator. It selects the next useful practice and keeps project state.
- **Approval:** your permission for a concrete action, such as downloading a dependency or writing files.
- **Acceptance:** your judgment that a working product slice solves the intended problem well enough to keep.

## 11. Graduate from MAGA

MAGA is an on-ramp, not a permanent layer. You may be ready to use Codex directly when you can:

- Describe a user, problem, intended outcome, and non-negotiable constraints.
- Ask for the smallest evidence that would reduce uncertainty.
- Separate product acceptance from engineering verification.
- Give feedback through observed behavior instead of implementation instructions.
- Understand which actions are reversible and which need explicit permission.
- Resume work from durable project decisions instead of one task transcript.

To remove MAGA, open **Plugins**, find MAGA under **Installed**, and choose **Uninstall plugin**. Then start a new Codex task. Uninstalling the plugin does not delete your product files.

If you also want to remove MAGA-specific guidance from the project, ask Codex:

> I am graduating this project from MAGA. First identify every MAGA-specific project file or instruction, explain what will stop working if it is removed, and show me the exact cleanup list. Do not delete anything until I approve that list. Preserve all product files, product decisions, and working software.

Needing less MAGA is the intended outcome.

## Official Codex help

- [Desktop app quickstart](https://learn.chatgpt.com/docs/quickstart?setup=app)
- [Projects and chats](https://learn.chatgpt.com/docs/projects)
- [Install and use plugins](https://learn.chatgpt.com/docs/plugins)
- [Approvals and security](https://learn.chatgpt.com/docs/agent-approvals-security)
