# AI Workflow

一本面向实际项目的 AI 协作手册，也包含由研究结果改造出的实验性 Codex skills。它从 GitHub 项目、公开资料和亲身实践中提炼可复用、可验证的方法，目标是让不同技术栈、规模和团队都能按需采用。

## 核心问题

AI 协作的主要限制不只是模型能力，而是**注意力衰减**：随着会话变长、目标增多，早期约束、全局目标和关键边界会与大量局部细节竞争，因而更容易被遗漏、误读或覆盖。

因此，本手册不把一个长会话当作项目记忆。它采用两个基本判断：

- **会话是有边界的注意力工作区**：一个会话只承担一组内聚目标和职责。
- **仓库是可持久的协作记忆**：事实、决策、Ticket、状态和结果必须写入可版本化的载体。

分会话不是目的。只有当隔离上下文能减少注意力竞争、职责漂移或操作风险时才拆分；否则保持单会话更简单。

## 内容

- `research/`：外部项目与资料的观察记录
- `design/`：尚在讨论和验证中的产品设计草案
- `experiences/`：真实任务中的实践与复盘
- `experiments/`：对改造后 skills 进行可重复验证的公开安全实验
- `playbooks/`：跨项目可直接采用的协作手册
- `plugins/kann-workflows/skills/`：融合并改造公开方法后形成的可安装 Codex skills
- `CONTEXT.md`：本手册使用的统一术语
- `templates/entry.md`：新增记录的统一入口

## 手册入口

- [多会话协作：用上下文隔离对抗注意力衰减](playbooks/multi-session-collaboration.md)
- [Matt Pocock Skills 与 Ponytail 使用手册](playbooks/matt-skills-and-ponytail-guide.md)
- [面向产品构建者的 Project Lead](playbooks/product-oriented-project-lead.md)
- [Codex 原生 Ticket 编排](playbooks/codex-ticket-orchestration.md)

## 设计草案

- [安装与项目启动体验](design/installation-and-project-bootstrap.md)

## 实验性 Skills

- [`project-lead`](plugins/kann-workflows/skills/project-lead/SKILL.md)：面向产品构建者的自然语言入口，负责产品决定、职责形成、Ticket 契约、交付和收口。
- [`orchestrate-tickets`](plugins/kann-workflows/skills/orchestrate-tickets/SKILL.md)：内部执行能力，在 Ticket 获批后使用 Codex 原生项目任务完成投递、等待、恢复与归档。
- Matt Pocock Skills：固定快照中的 22 个正式 Skills；13 个保持只能由用户显式调用，9 个保持可由模型根据任务自动调用。
- Ponytail：6 个原版 Skills，以及会话启动、恢复、清空、压缩、模式切换和子任务继承所需的原版生命周期 hooks。

插件合计提供 30 个 Skills。Kann 不会把 Matt 的显式入口改成自动入口，也不会把原本允许自动匹配的能力降级为手动入口。Ponytail 默认以 `full` 模式启动；用户仍可使用原版命令切换 `lite`、`full`、`ultra` 或 `off`。

## 初始化一个项目

在空文件夹中运行：

```powershell
npx github:thevenomsnake/kann_workflows init
```

命令会安装 Kann Workflows 插件、创建最小项目状态、初始化 Git，并创建和打开置顶的 Project Lead 任务。用户直接在这个入口描述想做的产品即可；后续职责与 Ticket 由系统按逐 Ticket 记录的批准范围创建、续发、等待和归档，正常路径不需要输入 Skill、Git 或测试命令。私有仓库安装需要本机 Git 已具备对应 GitHub 访问权限。

Ponytail 的持久默认模式由插件生命周期 hooks 提供，并要求非交互命令环境的 `PATH` 中存在 Node.js 18 或更高版本。Codex 不会自动信任任何第三方插件 hook；首次安装或 hook 内容变化后，必须在 Codex 中使用 `/hooks`（或当前界面提供的 hook review 入口）审阅并信任它们。未信任、禁用 hooks 或找不到 Node.js 时，30 个 Skills 仍可使用，但 Ponytail 的会话自动激活、压缩后重注入和子任务继承不会运行。

Codex Desktop 是唯一用户界面。初始化器只通过一次性 App Server bridge 建立首个原生 Project Lead，随后退出；项目对话、职责管理和 Ticket 执行全部留在 Codex 原生同项目任务中，不另建聊天 UI、Dashboard 或任务面板。

## 当前实现

| 方法版本 | 包版本 | 已完成的纵向切片 |
| --- | --- | --- |
| V1 | `0.1.0` | 插件分发、空目录初始化、Git 与最小项目内核 |
| V1.5 | `0.2.0` | 自然语言入职、最少职责和首个有边界工作的持久化 |
| V2 | `0.3.0` | 首个 Project Lead bridge，以及原生任务的创建、续发、等待和归档 |
| V3 | `0.4.0` | Codex Desktop 内从产品入职到工作集成与状态收口的机械闭环 |
| V3.1 | `0.5.0` | 统一 Ticket 真源，并将执行授权限定到明确的 Ticket 集合 |
| V3.2 | `0.6.0` | 内置 Matt 22 个 Skills 与 Ponytail 6 个 Skills，并保留原调用分类和生命周期 hooks |

每一版都有仓库内匿名实验记录；V3 的 Project Lead 还实际创建并收口了一个原生同项目 worker，而不是只验证提示词文本。这些版本表示能力切片，不代表产品成熟度认证。

`0.6.0` 继续使用 schema v2，只用于新初始化项目。初始化器不会静默重写已有 schema v1 项目；Project Lead 在旧工作重新进入活跃状态时按 Ticket 契约保守迁移，并要求当前授权。批量升级旧项目不属于这一切片。

## 工作流

1. **记录事实**：写清来源、场景和发生了什么，不急于总结规律。
2. **提炼判断**：区分观察、推断和个人偏好，注明适用边界。
3. **形成流程**：把反复有效的方法整理为 `playbooks/` 中可执行的步骤。
4. **实际验证**：在真实任务中使用，记录结果与失败条件。
5. **持续修订**：新证据推翻旧结论时，直接更新并保留变更历史。

## 新增内容

复制 `templates/entry.md` 到对应目录，文件名使用简短的 kebab-case，例如：

```text
research/github-agent-memory.md
experiences/debugging-with-ai.md
playbooks/reviewing-ai-changes.md
```

一条内容至少应包含：来源或场景、观察、结论、适用边界、下一步验证。

本仓库默认面向公开发布。只记录可公开验证的来源；来自私人项目或亲身经历的方法必须匿名化，不得出现项目名、本机路径、会话 ID、账号、内部系统名或可反推身份与业务的信息。

## 原则

- 证据先于观点，具体案例先于抽象口号。
- 先解释要解决的机制，再介绍流程和工具。
- 区分通用原则与某个项目的具体实现。
- 将“有效过一次”和“稳定可复用”明确区分。
- 流程应能执行和验证，而不只是读起来正确。
- 优先沉淀短小、独立、可链接的条目。
- 不收录密钥、私人数据或无权再发布的内容。
- 私人案例只贡献抽象方法，不保留可识别来源。

## License

Kann Workflows 采用 [MIT License](LICENSE)。项目融合并改造了 Matt Pocock
Skills 与 Ponytail 的部分工作流思想；相应上游版本、版权与 MIT 许可声明见
[Third-Party Notices](THIRD_PARTY_NOTICES.md)。上游作者不为 Kann Workflows
提供赞助或背书。
