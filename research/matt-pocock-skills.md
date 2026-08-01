# Matt Pocock Skills：把工程判断写成可组合的 Agent 工作流

## 研究对象与证据纪律

- 官方仓库：[mattpocock/skills](https://github.com/mattpocock/skills)
- 固定快照：[`2ab958093e83e0ec752e6c1c5932da465bf23e0c`](https://github.com/mattpocock/skills/commit/2ab958093e83e0ec752e6c1c5932da465bf23e0c)，提交日期 2026-07-28。
- 资料边界：只采用该仓库在固定快照中的 README、`SKILL.md`、辅助文件、仓库规则、ADR、Changelog 和提交记录。
- 研究范围：官方标为 promoted 的 `engineering` 与 `productivity` 两组 skill。草稿、个人、少用和弃用目录不进入正式清单。

全文使用三种证据标签：

- **[官方自述]**：作者或项目文档对目标、理念、效果和用法的陈述。
- **[可验证事实]**：可以直接从固定 commit 的文件、目录、配置或 Git blob 验证的事实。
- **[分析判断]**：基于上述材料作出的解释、价值判断、风险判断或可迁移推论，不代表作者原话，也不等于实验结论。

## 结论摘要

**[官方自述]** 项目把自己定位为 “Skills For Real Engineers”：作者日常用于真实工程、反对 vibe coding 的 Agent skills。README 认为 GSD、BMAD、Spec-Kit 一类方案试图拥有整个过程，可能削弱使用者控制力；本项目选择小型、易修改、可组合、模型无关的 skill。[README](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/README.md)

**[可验证事实]** 固定快照正式推广 22 个 skill，其中 17 个属于 engineering，5 个属于 productivity；按调用权分为 13 个用户调用和 9 个模型可调用。它们覆盖需求访谈、领域建模、研究、原型、规格、拆票、实现、TDD、调试、审查、合并冲突、triage、架构改进、交接、教学和 skill 写作。[Engineering index](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/skills/engineering/README.md) · [Productivity index](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/skills/productivity/README.md)

**[分析判断]** 它更接近一套“可组合的工程行为规约”，不是拥有数据库、调度器、事务和运行时状态的 Agent 编排引擎。它的核心贡献有两层：一层把传统工程实践压缩成模型可执行的提示模块；另一层把注意力衰减当作协作设计约束，用会话切分和仓库工件维持长期连续性。

## 它要解决什么问题

**[官方自述]** README 将 AI 编程的主要失败归纳为四类：[README: Why These Skills Exist](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/README.md#why-these-skills-exist)

1. **Agent 没做出用户真正想要的东西**：根因是人和 Agent 没有对齐。
2. **Agent 太啰嗦**：根因是项目缺少双方共享的领域语言。
3. **代码不能工作**：根因是缺少类型、测试、浏览器等反馈回路。
4. **代码变成大泥球**：代码生成提速也会加速熵增和结构恶化。

**[可验证事实]** 仓库针对这四类问题提供了对应机制：

- `grilling`、`grill-with-docs` 和 `prototype` 用于提高目标清晰度。
- `domain-modeling`、`CONTEXT.md`、ADR 与 `codebase-design` 用于统一语言和结构概念。
- `tdd`、`diagnosing-bugs`、`code-review` 与 `resolving-merge-conflicts` 用于建立反馈和校验。
- `to-spec`、`to-tickets`、`wayfinder` 与 `improve-codebase-architecture` 用于控制范围、依赖和复杂度。

**[分析判断]** 项目没有发明新的软件工程理论。它的价值主要在于选择、压缩、组合和触发已有实践，使模型更稳定地在正确时机采用它们。

## 项目形态与分发方式

### 小型 skill，而不是单一大流程

**[官方自述]** README 强调 skill 应当小、可改、可组合，用户可以取用、修改或只安装需要的部分。`writing-great-skills` 把 skill 的根本目标定义为：从随机系统中获得“过程可预测性”，而不是要求每次输出完全相同。[README](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/README.md) · [writing-great-skills](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/skills/productivity/writing-great-skills/SKILL.md)

**[可验证事实]** 每个正式 skill 以独立目录存在，至少包含 `SKILL.md` 和 `agents/openai.yaml`；需要时再带模板、参考文档、脚本或资产。skill 之间主要通过 `/skill-name` 式文字调用，而不是共享运行时对象。[Invocation model](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/.agents/invocation.md)

### 两种安装哲学

**[官方自述]** README 区分两种安装方式：[Installation](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/README.md#installation-30-second-setup)

- Claude Code plugin：把正式集合当作托管、只读、随发布更新的订阅。
- `skills.sh`：把可编辑副本复制给 Codex 或其他兼容 Agent，使用者拥有这些文件并自行决定何时更新。

**[可验证事实]** 固定快照的 Claude plugin manifest 显式列出全部 22 个正式 skill。仓库 ADR 记录了原生 Codex plugin 当时被推迟的原因：该 manifest 只能指定单一路径，无法从多个 bucket 精确选择 promoted 子集，又不愿引入重复副本或重构整个目录。[plugin.json](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/.claude-plugin/plugin.json) · [ADR-0002](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/.agents/adr/0002-ship-as-a-claude-code-plugin.md)

**[分析判断]** 托管安装优化一致性，可编辑安装优化控制权。二者无法同时最大化：复制后的自由会带来版本分叉，自动更新则会让行为随上游发布变化。

## 调用架构

**[可验证事实]** 官方只用一个维度划分 skill：谁有权调用。[Invocation model](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/.agents/invocation.md)

- **用户调用**：只有人显式输入名字才能启动。Claude frontmatter 使用 `disable-model-invocation: true`，Codex 元数据使用 `policy.allow_implicit_invocation: false`。这些 skill 主要负责编排。
- **模型调用**：人和模型都能触达，也能被其他 skill 调用。其 description 保留丰富触发语句，以便模型判断何时自动采用。
- 用户调用 skill 可以调用模型调用 skill，但不能调用另一个用户调用 skill。

**[官方自述]** `writing-great-skills` 将二者解释为两种负载交换：模型调用会让 description 长期占用 context load；用户调用不占这部分上下文，但把“记得哪个 skill 存在”的 cognitive load 交给人。skill 太多时，用 `ask-matt` 这样的用户调用路由器降低记忆成本。[writing-great-skills: Invocation](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/skills/productivity/writing-great-skills/SKILL.md#invocation)

**[分析判断]** 这是一种注意力预算管理：让编排流程按需加载，让少量高价值触发词常驻。代价是自动触发仍依赖模型理解 description，不是确定性路由。

## 完整工作模型

### 初始化

**[可验证事实]** `setup-matt-pocock-skills` 是工程流程的前置步骤。它探索仓库后，与用户确认三类配置：Issue tracker、triage 标签词汇、领域文档布局；随后把选择写入 Agent 指令和 `docs/agents/*.md`。它明确说明自己是 prompt-driven skill，不是确定性脚本。[setup-matt-pocock-skills](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/skills/engineering/setup-matt-pocock-skills/SKILL.md)

### 主流程：idea 到 ship

**[可验证事实]** `ask-matt` 给出的常规路径如下：[ask-matt](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/skills/engineering/ask-matt/SKILL.md)

```text
idea
  -> grill-with-docs
  -> 必要时 handoff -> prototype -> handoff 返回
  -> 多会话工作：to-spec -> to-tickets
  -> 每张 ticket 启动新的 implement 会话
  -> implement 内部采用 tdd
  -> code-review 检查 Standards 与 Spec
  -> commit
```

如果工作足够小，主流程允许跳过 spec 和 tickets，在当前会话直接 `implement`。如果问题必须通过可运行状态或可见 UI 才能回答，则用 `prototype` 建立独立实验会话，再把结论带回原设计会话。

**[可验证事实]** `implement` 的完整默认要求是：尽可能在预先约定的 seam 上使用 TDD；经常运行 typecheck 和单测试文件；结束时运行一次全量测试；再调用 `code-review`；最后提交当前分支。[implement](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/skills/engineering/implement/SKILL.md)

### 三条主流程入口

**[可验证事实]** `ask-matt` 还定义了三条 on-ramp：

- 外部 bug、需求或 PR 堆积：先用 `triage` 形成 agent-ready brief，再进入实现。
- 难以快速定位的故障或性能回退：先用 `diagnosing-bugs` 建立准确复现，再修复。
- 单会话容纳不了的巨大且模糊工作：先用 `wayfinder` 清除决策迷雾，清晰后进入 `to-spec`。

### 代码库健康与独立用途

**[可验证事实]** `improve-codebase-architecture` 不属于功能主线。它扫描近期热点，寻找 deepening opportunity，生成可视报告，再让用户选择一个候选继续 grilling。`research`、`teach`、`grill-me`、`prototype` 和 `writing-great-skills` 也可独立使用；`resolving-merge-conflicts` 专门处理已开始的 merge/rebase 冲突。[ask-matt](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/skills/engineering/ask-matt/SKILL.md)

## 22 个正式 Skill

**[可验证事实]** 下表概括固定快照的全部正式集合，没有省略上游默认采用的 TDD、全量测试、双轴 review、Issue tracker 状态机或 merge/rebase 完成规则。

| Skill | 分组 | 调用 | 源码定义的职责 |
| --- | --- | --- | --- |
| `ask-matt` | Engineering | 用户 | 根据当前处境选择 skill 和流程，是正式集合的总路由。 |
| `grill-with-docs` | Engineering | 用户 | 运行 grilling，同时用 domain-modeling 维护 glossary 和 ADR。 |
| `triage` | Engineering | 用户 | 让外来 Issue/PR 经过分类、验证、补信息和 agent-ready brief 状态机。 |
| `improve-codebase-architecture` | Engineering | 用户 | 寻找 deep module 改进候选，生成可视报告，再与用户讨论选中项。 |
| `setup-matt-pocock-skills` | Engineering | 用户 | 配置 tracker、triage 标签和领域文档布局。 |
| `to-spec` | Engineering | 用户 | 将当前讨论综合为规格，包括大量 user stories、实现与测试决策、范围。 |
| `to-tickets` | Engineering | 用户 | 将规格拆成可独立验证的 tracer-bullet 纵向切片，并声明 blocking edges。 |
| `implement` | Engineering | 用户 | 按规格或票据实现，采用 TDD、验证、双轴 review，并提交。 |
| `wayfinder` | Engineering | 用户 | 为单会话容纳不了的工作建立共享决策地图，逐票清除到达 destination 的迷雾。 |
| `prototype` | Engineering | 模型 | 用可丢弃的逻辑终端程序或多方案 UI 回答一个设计问题。 |
| `diagnosing-bugs` | Engineering | 模型 | 建反馈回路、复现、最小化、列假设、插桩、修复、回归与复盘。 |
| `research` | Engineering | 模型 | 让后台 Agent 查一手来源，并写一份带引用的 Markdown 研究文档。 |
| `tdd` | Engineering | 模型 | 在预先确认的公共 seam 上，以一个测试、一个最小实现的 red-green 纵向循环推进。 |
| `domain-modeling` | Engineering | 模型 | 澄清领域词汇、用具体场景施压、对照代码，并即时维护 glossary 与少量 ADR。 |
| `codebase-design` | Engineering | 模型 | 提供 module、interface、depth、seam、adapter、leverage、locality 的共享设计语言。 |
| `code-review` | Engineering | 模型 | 用两个并行子 Agent 分别审查 Standards 与 Spec，并列报告而不合并重排。 |
| `resolving-merge-conflicts` | Engineering | 模型 | 追溯两侧原始意图，逐 hunk 解决冲突，运行检查并完成 merge/rebase。 |
| `grill-me` | Productivity | 用户 | 在不需要仓库文档化时启动纯 grilling 访谈。 |
| `handoff` | Productivity | 用户 | 将当前会话压缩给新 Agent，引用已有工件并删除敏感信息。 |
| `teach` | Productivity | 用户 | 用 mission、资料、课程、学习记录和复用资产维持多会话教学空间。 |
| `writing-great-skills` | Productivity | 用户 | 定义可预测 skill 的触发、信息层级、渐进披露、单一真源和删减方法。 |
| `grilling` | Productivity | 模型 | 逐个追问决策树；自行查事实，把真实决策留给人，并在确认前不执行。 |

### 各能力组如何配合

**[分析判断]** 22 个 skill 可以理解为六个能力组：

1. **对齐**：`grilling`、`grill-me`、`grill-with-docs`、`prototype`。
2. **知识与语言**：`research`、`domain-modeling`、`codebase-design`。
3. **规划与分解**：`to-spec`、`to-tickets`、`wayfinder`。
4. **实现与反馈**：`implement`、`tdd`、`diagnosing-bugs`、`code-review`、`resolving-merge-conflicts`。
5. **入口与治理**：`ask-matt`、`setup-matt-pocock-skills`、`triage`、`improve-codebase-architecture`。
6. **跨会话连续性**：`handoff`、`teach`，以及前述流程共同维护的 Issue、地图、规格、研究文档和提交。

## 注意力衰减为什么导致分会话

### 官方明确写出的假设

**[官方自述]** `ask-matt` 将模型仍能敏锐推理的区域称为 smart zone，并给出约 120K tokens 的经验性描述。它要求 grilling、spec、tickets 这组高度耦合的规划步骤尽量留在一个未中断的上下文中；如果接近 smart zone 边缘，则应 handoff 到新会话，而不是在退化状态下继续。[ask-matt: Context hygiene](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/skills/engineering/ask-matt/SKILL.md#context-hygiene)

**[可验证事实]** 同一文件要求每个 `implement` 从 fresh context 开始，只读取当前 ticket。`wayfinder` 则要求除并行 research 外，一个会话最多解决一个 decision ticket；每次只加载地图的低分辨率视图，再按需打开票据。提交记录明确写道，这套 session machinery 来自 Agent 的 smart/dumb zones，而不是具体业务领域。[wayfinder](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/skills/engineering/wayfinder/SKILL.md) · [相关提交](https://github.com/mattpocock/skills/commit/3dc68005505bbcb9eb8317132eb50231df53a457)

### 从源码可以归纳出的会话原则

**[分析判断]** 这套设计不是简单主张“上下文越新越好”，而是同时做两件看似相反的事：

- **保留高耦合推理**：需求访谈、规格和拆票互相依赖，过早换会话会损失尚未固化的决策，因此先留在同一窗口。
- **隔离低耦合执行**：票据一旦足够自包含，实现会话不再需要整段设计历史。新窗口能减少无关历史、旧假设和下一阶段目标对当前实现的干扰。

所以会话边界应放在“上下文已经被压缩成稳定工件”的位置，而不是按时间、代码目录或固定角色机械切分。

### 注意力退化的两种表现

**[分析判断]** 从 `writing-great-skills` 的 failure modes 可以看到，项目实际防的并不只有 token 上限：

- **容量退化**：上下文过长，关键事实难以维持足够权重。
- **方向污染**：后续步骤过早出现，使 Agent 为了“完成整条流程”而草率结束当前步骤。项目称之为 premature completion，并建议先强化 completion criterion，必要时按 sequence 拆 skill。[writing-great-skills](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/skills/productivity/writing-great-skills/SKILL.md#failure-modes)

这说明分会话的核心不是制造多个身份，而是恢复当前任务在注意力中的主导地位。

### 证据边界

**[分析判断]** 仓库证明了作者确实按 smart/dumb zone 组织工作流，但没有提供模型对照实验、重复测量或跨模型基准来证明 120K 是普遍阈值。因此，应将“存在注意力衰减，需要主动控制会话边界”视为该项目的工程假设；不能把具体阈值当作已由该仓库验证的科学定律。

## 持久化协作记忆

**[可验证事实]** 项目不依赖聊天记录独自承担长期状态，而是把不同信息写入不同工件：

| 工件 | 保存内容 | 主要生产者 |
| --- | --- | --- |
| `CONTEXT.md` | 稳定领域术语和关系，不放实现细节 | `domain-modeling` |
| ADR | 难以逆转、缺少背景会令人意外、存在真实取舍的决策 | `domain-modeling` |
| Spec | 问题、用户方案、user stories、实现决策、测试决策、范围 | `to-spec` |
| Ticket / Issue | 一个上下文可完成的端到端行为、验收标准、阻塞边 | `to-tickets` |
| Wayfinder map | destination、低分辨率决策索引、尚未清晰区域、范围外内容 | `wayfinder` |
| Decision ticket | 一个待解决问题及最终 resolution | `wayfinder` |
| Research note | 一手来源支持的事实与引用 | `research` |
| Prototype branch | 可运行实验和它回答的问题，主分支只保留已验证决策 | `prototype` |
| Handoff | 尚未由其他工件承载的会话剩余上下文 | `handoff` |
| Commit / diff | 已经发生的代码变化 | `implement` 等 |

**[可验证事实]** `handoff` 要求不要复制 spec、plan、ADR、Issue、commit 或 diff，而要引用它们。`wayfinder` 要求 map 是 index 而不是 store，完整决定只存在对应 ticket。`writing-great-skills` 将相同原则命名为 single source of truth、progressive disclosure 和 context pointer。[handoff](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/skills/productivity/handoff/SKILL.md) · [wayfinder: The Map](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/skills/engineering/wayfinder/SKILL.md#the-map) · [writing-great-skills: Information hierarchy](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/skills/productivity/writing-great-skills/SKILL.md#information-hierarchy)

**[分析判断]** 这是一套分层记忆架构：新会话先读低分辨率索引，再按当前任务打开高分辨率来源。它减少恢复成本，也减少同一事实被多次摘要后逐渐变形。

## 多会话并发模型

**[可验证事实]** `wayfinder` 用 tracker 的原生 blocking relationship 表示依赖。所有 blockers 都关闭后，ticket 才进入 frontier；开放、无阻塞、未领取的 ticket 才可开始。会话先用 assignee claim 再工作。Research ticket 可由多个后台 Agent 并行处理；HITL 的 grilling/prototype 则必须保留真实用户参与。[wayfinder](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/skills/engineering/wayfinder/SKILL.md)

**[可验证事实]** `code-review` 也使用并行，但目的不同：Standards 和 Spec 两个判断轴放进独立子 Agent，避免一条轴的结论污染另一条轴，最终并列报告且不跨轴重排。[code-review](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/skills/engineering/code-review/SKILL.md)

**[分析判断]** 项目的并行原则可归纳为：

- 独立事实查询可以并行。
- 无阻塞的决策票据可以由不同会话并行领取。
- 互相独立的审查维度可以并行，以保护判断纯度。
- 需要人作出选择的 HITL 工作不能让 Agent 代答。
- 是否可并行由依赖和认知独立性决定，不由 Agent 数量决定。

## 关键工程方法

### 对齐：事实由 Agent 查，决策由人作

**[可验证事实]** `grilling` 要求一次只问一个问题，先自行探索可查事实，对真正的决定给出推荐但等待用户回答，并在用户确认达成共同理解前不执行。[grilling](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/skills/productivity/grilling/SKILL.md)

**[分析判断]** 这避免了两种常见浪费：把可搜索事实推回给用户，以及 Agent 在缺少授权时替用户完成价值取舍。

### 共享语言：同时压缩沟通和代码导航

**[官方自述]** README 认为统一领域语言能让 Agent 用更少词表达，也能使变量、函数和文件命名一致，降低思考 token 消耗。[README: shared language](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/README.md#2-the-agent-is-way-too-verbose)

**[可验证事实]** `domain-modeling` 规定 `CONTEXT.md` 只做 glossary，不做规格或实现记录；`codebase-design` 则单独维护 module、interface、depth、seam 等代码结构词汇。[domain-modeling](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/skills/engineering/domain-modeling/SKILL.md) · [codebase-design](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/skills/engineering/codebase-design/SKILL.md)

### 垂直切片与显式阻塞

**[可验证事实]** `to-tickets` 要求普通 ticket 是贯穿 schema、API、UI、测试等层次的完整 tracer bullet，每个切片可独立演示或验证，并适合一个新上下文完成。wide refactor 是例外，使用 expand-contract：先兼容扩展，再分批迁移，最后删除旧形态。[to-tickets](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/skills/engineering/to-tickets/SKILL.md)

**[分析判断]** 纵向切片同时服务三件事：快速得到真实反馈、限制会话规模、让 blocker 图表达可交付依赖而非代码层次。

### 紧反馈优先于代码猜测

**[可验证事实]** `diagnosing-bugs` 将构造能对准确症状变红的紧反馈命令视为整个诊断的核心。没有已经运行过、快速、确定、Agent 可独立执行的 red-capable loop，就不进入假设阶段。[diagnosing-bugs](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/skills/engineering/diagnosing-bugs/SKILL.md)

**[可验证事实]** `tdd` 要求先与用户确认测试 seam，再以一个失败测试、一个最小实现逐步 red-green。它明确反对实现耦合、tautological test 和先写完全部测试的水平切片。[tdd](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/skills/engineering/tdd/SKILL.md)

### 深模块作为可维护性与可测试性的共同目标

**[可验证事实]** `codebase-design` 把深模块定义为：调用者只需学习小 interface，就能获得大量行为；interface 同时是测试面。其原则包括 deletion test、接受依赖而不是内部创建、返回结果而不是隐藏副作用、两个 adapter 才证明 seam 真实存在。[codebase-design](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/skills/engineering/codebase-design/SKILL.md)

**[分析判断]** 项目试图让“易测试”和“结构好”指向同一件事，而不是为了测试额外暴露内部实现。

### 双轴审查防止正确性被单一标准掩盖

**[可验证事实]** `code-review` 将仓库标准和规格符合度分开：代码可以符合规范却实现错需求，也可以满足需求却破坏项目标准。固定 diff 起点后，两轴由独立 Agent 评估；Standards 还带一组 Fowler smell baseline，但仓库明确标准优先，smell 只能作为判断项。[code-review](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/skills/engineering/code-review/SKILL.md)

## Skill 自身的设计方法

**[官方自述]** `writing-great-skills` 认为 predictability 是根本价值，并给出以下写法：[writing-great-skills](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/skills/productivity/writing-great-skills/SKILL.md)

- 用可检查、必要时穷尽的 completion criterion 防止提前结束。
- 将信息分成 in-skill step、in-skill reference、external reference 三层。
- 所有分支都需要的内容内联，只有某一分支需要的内容放到 context pointer 后面。
- 一个含义只保留一个 source of truth。
- 逐句删除 no-op、duplication、sediment 和失效内容。
- 用模型预训练中已有的 leading word 压缩重复解释，并提高触发稳定性。
- 只有独立调用价值或 sequence 隔离价值足够高时才拆 skill。

**[分析判断]** 这套元方法与多会话方法使用同一个底层原则：有限注意力必须投给当前分支真正需要的信息。渐进披露用于文件层，fresh session 用于会话层，ticket sizing 用于任务层。

## 核心价值

### 官方主张的价值

**[官方自述]** 项目声称这些 skill 能提高人与 Agent 的对齐、建立共享语言、加强反馈回路，并抑制 Agent 加速带来的软件熵增。它认为软件工程基本功在 AI 时代更重要，而不是更不重要。[README](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/README.md)

### 从源码可验证的机制价值

**[可验证事实]** 项目确实把以下机制写成了可重复调用的规则：单问题访谈、领域 glossary、稀疏 ADR、原型分支、带测试决策的 spec、纵向 ticket、blocking frontier、fresh implementation context、red-capable diagnosis、双轴 review 和 compact handoff。

### 分析判断

**[分析判断]** 最有迁移价值的并不是 22 个名字，而是五个结构性设计：

1. **把隐含工程判断变成显式过程**，让模型更少依赖临场猜测。
2. **把会话视为可替换的工作内存**，把仓库工件视为持久记忆。
3. **用共享语言压缩上下文**，同时改善代码和文档的可导航性。
4. **用垂直切片和反馈命令产生可观察事实**，避免长期在抽象计划中漂移。
5. **让并行服从依赖图和判断独立性**，而不是把多 Agent 本身当作价值。

## 局限与风险

### 1. 注意力阈值缺少仓库内实证

**[官方自述]** `ask-matt` 给出约 120K tokens 的 smart zone 说法。

**[分析判断]** 固定快照没有实验设计、数据或跨模型对照来验证该数字。会话边界理念可以成立，但阈值需要按模型、任务和工具反馈重新观察。

### 2. 它是提示规约，不是强一致性引擎

**[可验证事实]** `setup` 明确称自己为 prompt-driven；claim、frontier、状态迁移和 completion criterion 都由 Agent 按文字执行。

**[分析判断]** 没有事务和锁意味着重复领取、过期读取、部分写入仍可能发生。重要流程需要 tracker 权限、仓库保护和人工检查补足。

### 3. 完整默认流程成本较高

**[可验证事实]** `to-spec` 要求极其完整的 user stories；`implement` 包含 TDD、频繁 typecheck/单测、末尾全量测试、双轴 review 和 commit；`triage`、`wayfinder` 依赖较完整的 tracker 约定。

**[分析判断]** 这些做法适合需要高可追踪性和反馈强度的工程工作，但其时间、token、Issue 和审查成本真实存在。项目提供了“小任务直接 implement”和“没有 fog 就不建 map”的早退路径，但没有自动成本模型替用户选择流程强度。

### 4. 工件可能沉积或互相失配

**[可验证事实]** `writing-great-skills` 明确把 duplication、sediment 和 sprawl 列为失败模式；提交历史也曾删除 `wayfinder` 每轮固定 handoff，因为下一会话已经能从 map 恢复，额外交接只是 token 成本。[删除冗余 handoff 的提交](https://github.com/mattpocock/skills/commit/1f16ea94999086c05c3484c897161cbcbeff2862)

**[分析判断]** glossary、ADR、spec、ticket、map、research、prototype branch 和 handoff 都需要生命周期治理，否则“外置记忆”会变成新的过期上下文。

### 5. Handoff 是有损压缩

**[可验证事实]** `handoff` 要求摘要当前会话、引用已有工件、删敏感信息，并默认写到操作系统临时目录。[handoff](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/skills/productivity/handoff/SKILL.md)

**[分析判断]** 摘要无法保证保留被否决方案、语气和隐含约束；临时目录也不天然提供团队可见性和长期追踪。高价值决定仍应进入正式工件，而不能只存在于 handoff。

### 6. 并发协议没有覆盖代码工作区隔离

**[可验证事实]** `wayfinder` 详细规定 tracker claim 和 blocking frontier，但没有规定并行实现会话如何隔离同一 Git working tree。

**[分析判断]** tracker 层可并行不代表文件系统和 Git index 层可安全并行。这是使用者仍需补充的操作边界。

### 7. 隐私保护不是全局策略

**[可验证事实]** `handoff` 明确要求 redaction，`triage` 要求 AI 生成免责声明；其他会产生 Issue、ADR、研究文档、原型分支的 skill 没有统一的发布前隐私检查。

**[分析判断]** 在公开仓库中使用时，需要额外防止路径、身份、组织、客户和未公开业务信息进入 Issue、分支与 Git 历史。

### 8. `resolving-merge-conflicts` 的“never abort”过于绝对

**[可验证事实]** 该 skill 要求总是解决冲突、永不 `--abort`，并完成 merge/rebase。[resolving-merge-conflicts](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/skills/engineering/resolving-merge-conflicts/SKILL.md)

**[分析判断]** 当操作目标错误、基础分支选错或用户只想诊断冲突时，abort 可能是正确动作。该规则适合作为“已确认应完成本次操作”的局部前提，不宜脱离前提普遍化。

### 9. 固定快照存在版本元数据不一致

**[可验证事实]** `2ab9580` 中 `.claude-plugin/plugin.json` 是 `1.2.0`，`package.json` 是 `1.1.0`；仓库自己的 AGENTS/ADR 又要求两者同步。[plugin.json](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/.claude-plugin/plugin.json) · [package.json](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/package.json) · [AGENTS.md](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/AGENTS.md)

**[分析判断]** 该 commit 更像处于 v1.2 分发改造过程中的源码快照，不能仅凭 manifest 版本推断正式 Release 状态。研究和安装记录应固定 commit，而不是只写版本号。

## 可迁移原则

以下均为从该项目单独归纳出的**分析判断**，不是上游原文，也没有与其他项目合并比较：

1. **先按注意力质量划定会话边界**：高耦合决策留在同一窗口，已经压缩成自包含任务的执行使用 fresh context。
2. **会话是临时工作内存，工件是持久协作记忆**：新会话应从明确工件恢复，而不是依赖聊天原文。
3. **一个事实只保留一个完整来源**：地图、交接和总览只做索引，细节按需打开。
4. **共享语言是上下文压缩机制**：术语统一既减少解释 token，也提高代码、Issue 和文档的检索一致性。
5. **事实查询和价值决策分离**：Agent 主动查事实，人保留真正的取舍权。
6. **任务切片必须适合一个有效上下文**：普通功能优先端到端 tracer bullet，wide refactor 使用 expand-contract。
7. **并发由阻塞关系和判断独立性决定**：不是所有任务都因存在多个 Agent 而值得并行。
8. **先建立能暴露事实的反馈回路**：诊断和实现都需要可观察的红/绿或验收信号。
9. **提示本身也需要信息架构**：短触发、渐进披露、可检查完成条件和持续删减共同保护注意力。
10. **重流程需要早退路径**：没有 fog 就不建 map，小任务可以跳过 spec/tickets，避免形式超过问题本身。

## 本地快照核验

**[可验证事实]** 更新后的本地正式集合已与官方固定 commit 逐文件核对：

- 22 个正式 skill 全部存在，包括 `resolving-merge-conflicts`。
- 22 个目录共有 66 个文件。
- 66 个本地文件的 Git blob SHA 与官方 commit 对应文件全部一致。
- 缺失文件：0。
- 额外文件：0。
- 内容不同文件：0。

因此，旧稿关于“仅安装 21 个”“缺少 `resolving-merge-conflicts`”“5 个主文件存在漂移”的说法已经失效，不再保留。此结论只针对上述固定 commit 和正式 22 个 skill，不推断其他本地 skill 的来源或状态。

## 主要一手来源

- [项目 README](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/README.md)
- [仓库维护规则](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/AGENTS.md)
- [调用模型](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/.agents/invocation.md)
- [Engineering 正式目录](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/skills/engineering/README.md)
- [Productivity 正式目录](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/skills/productivity/README.md)
- [官方流程路由](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/skills/engineering/ask-matt/SKILL.md)
- [多会话决策地图](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/skills/engineering/wayfinder/SKILL.md)
- [skill 写作方法](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/skills/productivity/writing-great-skills/SKILL.md)
- [Changelog](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/CHANGELOG.md)
- [Claude plugin 分发 ADR](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/.agents/adr/0002-ship-as-a-claude-code-plugin.md)
- [MIT License](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/LICENSE)
