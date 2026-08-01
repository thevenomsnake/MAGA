# AI Workflow

一本面向实际项目的 AI 协作手册，也包含由研究结果改造出的实验性 Codex skills。它从 GitHub 项目、公开资料和亲身实践中提炼可复用、可验证的方法，目标是让不同技术栈、规模和团队都能按需采用。

## 核心问题

AI 协作的主要限制不只是模型能力，而是**注意力衰减**：随着会话变长、目标增多，早期约束、全局目标和关键边界会与大量局部细节竞争，因而更容易被遗漏、误读或覆盖。

因此，本手册不把一个长会话当作项目记忆。它采用两个基本判断：

- **会话是有边界的注意力工作区**：一个会话只承担一组内聚目标和职责。
- **仓库是可持久的协作记忆**：事实、决策、任务契约、状态和结果必须写入可版本化的载体。

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

- [`project-lead`](plugins/kann-workflows/skills/project-lead/SKILL.md)：面向产品构建者的自然语言入口，负责产品决定、职责形成、使命契约、交付和收口。
- [`orchestrate-tickets`](plugins/kann-workflows/skills/orchestrate-tickets/SKILL.md)：内部执行能力，在使命获批后使用 Codex 原生项目任务完成投递、等待、恢复与归档。

## 初始化一个项目

在空文件夹中运行：

```powershell
npx github:thevenomsnake/kann_workflows init
```

命令会安装 Kann Workflows 插件、创建最小项目状态、初始化 Git，并创建和打开置顶的 Project Lead 任务。用户直接在这个入口描述想做的产品即可；后续岗位与使命任务由系统按已批准范围创建、续发、等待和归档，正常路径不需要输入 Skill、Git 或测试命令。私有仓库安装需要本机 Git 已具备对应 GitHub 访问权限。

Codex Desktop 是唯一用户界面。初始化器只通过一次性 App Server bridge 建立首个原生 Project Lead，随后退出；项目对话、岗位管理和使命执行全部留在 Codex 原生同项目任务中，不另建聊天 UI、Dashboard 或任务面板。

## 当前实现

| 方法版本 | 包版本 | 已完成的纵向切片 |
| --- | --- | --- |
| V1 | `0.1.0` | 插件分发、空目录初始化、Git 与最小项目内核 |
| V1.5 | `0.2.0` | 自然语言入职、最少职责和首个使命的持久化 |
| V2 | `0.3.0` | 首个 Project Lead bridge，以及原生任务的创建、续发、等待和归档 |
| V3 | `0.4.0` | Codex Desktop 内从产品入职到使命集成与状态收口的完整闭环 |

每一版都有仓库内匿名实验记录；V3 的 Project Lead 还实际创建并收口了一个原生同项目 worker，而不是只验证提示词文本。

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

除另有说明外，项目原创文字采用 [CC BY 4.0](LICENSE) 许可。
