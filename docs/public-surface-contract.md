# MAGA public surface contract

This document is the canonical contract for MAGA's public README files, beginner
guides, and promotional website. Its version is the Git commit that contains it;
do not maintain a separate manual version number.

## Product scale

MAGA helps a Product Owner take **a small but complete first release** from product
intent toward a running release. “Complete” means that the first release has one
useful end-to-end product journey that its intended users can finish. It does not mean
reproducing every feature, policy, or operational system of a mature platform, and it
does not by itself mean that the product is ready for unrestricted public launch.

Core-loop completeness and release readiness are separate claims. A real deployment
still needs risk-matched account, privacy, content-safety, recovery, and operational
boundaries. The public example may summarize those checks instead of expanding into a
large feature list, but the Release responsibility must assess them before launch.

An individual feature may be one delivery slice inside that journey, but public copy
must not describe MAGA as merely adding a feature to an existing product.

The canonical explanatory example is a small activity-sharing app for one interest
community. Its first release includes an account, a simple profile, posting, a home
timeline, and replies.

## Canonical core loop

Use the following labels whenever the example is presented as a sequence. Natural
prose may use nearby words such as “join” or “shared timeline,” but those variants
must not replace the canonical sequence labels.

| Locale | Canonical sequence |
| --- | --- |
| English | `sign up → profile → post → home timeline → reply` |
| 简体中文 | `注册 → 资料 → 发布 → 首页时间线 → 回复` |
| 繁體中文 | `註冊 → 資料 → 發布 → 首頁時間軸 → 回覆` |
| 日本語 | `登録 → プロフィール → 投稿 → ホームタイムライン → 返信` |
| 한국어 | `가입 → 프로필 → 게시 → 홈 타임라인 → 답글` |
| Español | `registrarse → perfil → publicar → cronología de inicio → responder` |

## Public terms

- **Product Owner** is the person who owns product direction, consequential
  trade-offs, and acceptance.
- **Project Lead** is MAGA's named product-facing role. Do not replace the role name
  with “product lead”; that phrase may appear only as an ordinary description.
- **Task / 任务** is the user-visible Codex work unit. Do not call it a chat, room, or
  session on public surfaces.
- **Project Lead task / Project Lead 任务** is the named, pinned task that `maga init`
  creates or reuses and `maga start` restores or creates. Internal documentation may
  distinguish the session instance carrying that task; beginner-facing copy must not.
- **Autonomy Policy** is the Product Owner's project-scoped permission for bounded
  continuation and task dispatch inside already approved Tickets. It does not authorize
  new scope, external effects, or irreversible actions.
- **Design record** is a repository-local record of an accepted or provisional product
  or system shape. Its status and evidence remain visible during recovery; it is not a
  transcript or a substitute for Ticket acceptance.

The domain definitions remain in [`CONTEXT.md`](../CONTEXT.md). This file controls
only their public presentation.

## Bounded continuity

MAGA may create clearly named worker tasks inside an already approved Ticket, up to
the project's confirmed worker limit, when the project has a confirmed Autonomy Policy.
The recommended starting limit is two. The worker receives durable,
repository-relative context pointers, and the Project Lead reconciles existing tasks
before creating or retrying one. Without that policy, MAGA asks for the specific task
title. New Tickets, expanded outcomes, external writes, accounts, payments, releases,
migrations, deletion, and other irreversible actions remain explicit decisions.

For a short read-only question inside an approved Ticket, MAGA may use up to two
native subagents through its CodexBridge runtime adapter. The adapter negotiates
the native capability, applies a read-only sandbox and no-approval policy, and
recovers child lineage. Subagents cannot write, commit, create tasks, publish, or
expand the Ticket; unsupported hosts and models fall back to the current task or a
named worker.

An optional Codex thread Goal can continue the current approved objective with a bounded
budget. Goal state is thread-scoped and does not replace project memory or authorization.
Accepted design records live under `.ai-workflow/design/` and are read during Project
Lead recovery; draft, rejected, and superseded records are not treated as accepted
requirements.

## Two-stage onboarding

Public onboarding must keep setup and product work visibly separate.

### 01 — Setup MAGA

The setup request asks Codex to:

1. check and install missing prerequisites;
2. install and initialize or restore MAGA in the selected project folder;
3. create or restore the named Project Lead task;
4. verify the result and identify that exact task for the user.

Do not tell the user to create an arbitrary new task after setup. If the Project Lead
task is not visible, ask Codex to restore it for the same project.

The canonical English request is:

> Set up this project with the MAGA plugin from https://github.com/thevenomsnake/MAGA. Check and install any missing prerequisites, initialize or restore MAGA in this folder, create or restore its named Project Lead task, verify that it works, and tell me the exact Project Lead task to open when it is ready. Perform the technical steps yourself and ask me only for approvals that are actually required.

Localized requests must preserve those outcomes rather than translate word for word.

Setup approval guidance is narrow: the selected project folder, downloading the
specified MAGA repository into that project or the Codex plugin area, and a prerequisite
Codex has just explained. GitHub sign-in, account or repository settings, pushes, and
Issue or Pull Request writes are not part of default setup authority.

### 02 — Start the product

The user opens the named Project Lead task and describes the product in ordinary
product language. Public surfaces may use this canonical example:

> Use MAGA as my Project Lead. Build a small but complete first release for an interest community: members can sign up, complete a simple profile, post updates, browse the home timeline, and reply. I do not know code, so keep questions in product language and give me working results I can inspect.

The independent-designer client-feedback tool may remain as **another product
description example**. It must not be presented as the continuation of the community
app story.

## Beginner guide URLs

Guide files may be prepared before public launch, but a website must not make a guide
its primary or only call to action until the URL is anonymously accessible and has
been checked in production.

| Locale | Repository source | Stable public URL |
| --- | --- | --- |
| English | `docs/getting-started.md` | Pending public access |
| 简体中文 | `docs/getting-started.zh-CN.md` | Pending public access |
| 繁體中文 | No independent guide yet | Pending fallback decision |
| 日本語 | `docs/getting-started.ja.md` | Pending public access |
| 한국어 | `docs/getting-started.ko.md` | Pending public access |
| Español | `docs/getting-started.es.md` | Pending public access |

Until every promoted route is ready:

- keep the inline two-stage onboarding usable without the guide;
- do not promise anonymous guide access;
- do not treat locale routing or the Traditional Chinese fallback as released;
- verify anonymous access before changing public calls to action.

## Downstream adoption

Downstream surfaces such as `sites/maga/` record the exact MAGA commit SHA they
adopted in their design record or handoff. They must not copy this contract into a
second independently maintained document. A release check compares the downstream
copy, onboarding behavior, and locale routes with that recorded commit.
