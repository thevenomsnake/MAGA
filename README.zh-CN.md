<h1 align="center">MAGA</h1>

<p align="center"><strong>Make Apps Great Again</strong></p>

<p align="center">把你心目中的软件做出来。</p>

<p align="center">
  面向产品设计者、产品负责人和第一次做软件的人。<br>
  你负责产品判断；MAGA 把判断转成可运行、可检查的软件。
</p>

<p align="center">
  <a href="https://maga.sumimi.jp/"><strong>官方网站</strong></a> ·
  <a href="./docs/getting-started.zh-CN.md"><strong>开始使用</strong></a> ·
  <a href="./assets/maga-operating-model.svg"><strong>工作原理</strong></a> ·
  <a href="./LICENSE">MIT License</a>
</p>

<p align="center">
  <a href="./README.md">English</a> ·
  <strong>简体中文</strong> ·
  <a href="./README.ja.md">日本語</a> ·
  <a href="./README.ko.md">한국어</a> ·
  <a href="./README.es.md">Español</a>
</p>

<p align="center">
  <a href="https://maga.sumimi.jp/">
    <img src="./website/design/hero-concept.png" alt="MAGA 网站展示从产品判断到验收的工作流程" width="100%">
  </a>
</p>

MAGA 是一个帮助产品人上手 ChatGPT 桌面客户端中 Codex 的产品构建过渡插件。你用产品语言描述用户、问题、体验、限制和取舍；一个持续工作的 Project Lead 会选择合适的方法，组织研究、原型、实现、验证和修复，同时让你逐步理解这些工作背后的实践。

你不需要了解代码，不需要选择 Skills，不需要管理工程任务，也不需要 review 代码。你通过产品行为、使用体验和业务结果进行验收。

> [!NOTE]
> MAGA 不是可视化 no-code 平台。产品仍然由代码构成，但实现层由 Codex 负责；产品意图、优先级、约束和验收仍由你掌握。

## 分两个阶段开始

不需要懂终端。如果你从来没有用过 Codex，请从安装桌面客户端开始，跟着 **[完整新手指引](./docs/getting-started.zh-CN.md)** 一直做到第一次产品验收。

### 1. 设置 MAGA

1. 打开 [ChatGPT 桌面客户端](https://learn.chatgpt.com/docs/quickstart?setup=app)，登录，然后选择 **Codex**。
2. 新产品先建立一个空的本地项目文件夹；继续已有 MAGA 产品则打开原项目文件夹。
3. 把下面这段设置请求发给 Codex：

> 请帮我为这个项目安装并配置 MAGA 插件：https://github.com/thevenomsnake/MAGA 。检查并安装缺少的必要环境；如果当前文件夹尚未初始化，就初始化 MAGA，如果已有 MAGA 项目状态，就从中恢复。然后创建或复用一个名称明确的 Project Lead 任务。验证设置结果后，告诉我这个 Project Lead 任务的准确名称。技术步骤请由你完成，只在确实需要授权时让我确认。

阅读每一条授权请求。设置阶段只同意修改当前文件夹、把指定的 MAGA 仓库下载到当前项目或 Codex 插件区域，以及安装 Codex 刚刚解释过的必要环境。GitHub 登录、账号或仓库设置、推送，以及 Issue 或 Pull Request 写入都不属于默认设置授权。你不需要把命令复制到终端。

这是第一阶段：Codex 会初始化或恢复项目，并创建或复用一个具名的 Project Lead 任务。

### 2. 开始产品

请进入 Codex 刚刚报告的 **Project Lead 任务**，不要另外创建空白任务。然后用自己的产品语言描述想做的产品。下面是**另一个产品描述示例**：

> 请让 MAGA 担任我的 Project Lead。我想做一个帮助独立设计师整理客户反馈的工具。反馈需要按项目归档，并且让我一眼看出哪些问题正在阻塞交付。我不懂代码，请只用产品语言提问，并给我可以直接检查的运行结果。

这样就足够开始。MAGA 会识别第一个有用的结果，只询问会改变产品方向或授权边界的问题。

## 为什么会有 MAGA

### 为什么选择插件，而不是再做一个套壳应用？

Codex 已经能够完成复杂的工程工作：理解仓库、编写和修改代码、运行检查、review 变更、跨项目任务工作，以及应用可复用的 Skills。OpenAI 的官方建议也描述了同一条路径：为 Codex 提供持久上下文，把重复工作写成 Skills，再把稳定能力打包为插件。参见官方的 [Codex 最佳实践](https://learn.chatgpt.com/guides/best-practices)、[Skills 文档](https://learn.chatgpt.com/docs/build-skills)和[插件文档](https://developers.openai.com/plugins/)。

Codex 这个名字已经说明了它的重心：代码。它的默认词汇和扩展方式，在操作者能够把工作描述成工程任务、并检查技术结果时最容易发挥作用。

产品人经常被说“不懂技术、瞎指挥”。那就指挥到底。MAGA 是一个让你可以肆无忌惮提出产品要求的插件：你负责目标和取舍，Codex 负责代码。

> **肆无忌惮地指挥，认真负责地验收。**

你不需要另一个应用挡在你和 Codex 之间。模型和客户端由同一家公司打造，天然最有条件保持适配，就像苹果可以让自家芯片和操作系统围绕同一条产品路线协同演进：能力边界、交互方式和发布节奏都在一起。Codex 会持续更新；独立套壳必须不断追赶每一种新能力、交互方式和权限模型。插件则留在原生 Codex 里，只补上当前缺少的产品实践，并且在你不再需要时可以直接卸载。

MAGA 被刻意设计成一个过渡插件。它从产品人已经熟悉的语言和决策方式开始，再把背后的产品构建实践逐步显露出来：定义结果、收集证据、设定约束、处理取舍，以及验收可运行的软件。目标是让你越来越自主，而不是永久依赖 MAGA。如果有一天你能直接使用 Codex，只需要更少的 MAGA，甚至完全不再需要它，那正说明这个插件完成了任务。

MAGA 存在，是因为模型能力和产品协作是两个不同的问题。

传统 Skill 通常把一个重复任务做得更可靠。但一组 Skills 往往仍然假设操作者知道下一步该做什么、如何排列技术工作流、每个任务需要什么上下文，以及如何判断代码 diff。

MAGA 在这些能力之上增加了一套工作方式：

- 一个面向产品的 Project Lead 接收普通产品语言。
- 基于意图的路由根据当前证据选择 Skills 和方法。
- 持久项目状态保存决定、边界、角色和已批准工作。
- Product Owner 通过产品验收，而不是代码 review，完成判断。

<p align="center">
  <img src="./assets/maga-operating-model.svg" alt="传统 Skills 与 MAGA 在入口、编排、技术工作、验收和连续性上的行为对比" width="100%">
</p>

## 适合谁

| 你现在的位置 | 你带来的关键输入 | MAGA 承担的工作 |
| --- | --- | --- |
| 第一次做软件 | 想解决的问题、目标用户和基本期望 | 必要澄清，以及通往可检查结果的路径 |
| 产品设计者 | 体验标准、信息结构和交互取舍 | 研究、原型、实现和验证方法 |
| 产品负责人或管理者 | 目标、优先级、风险、资源和决策边界 | 持久上下文、执行协调，以及真正需要拍板的事项 |

如果你已经负责一条产品线或跨职能团队，MAGA 往往更容易使用。因为你已经拥有最重要的输入：目标、优先级、体验标准、风险判断和授权边界。MAGA 不要求你在此之外再补上一套编程能力。

## 工作契约

| 你不需要做 | 你仍然决定 |
| --- | --- |
| 编写、阅读或 review 代码 | 产品为哪个用户解决什么问题 |
| 选择内部 Skills 或工程流程 | 哪些体验和业务约束不能妥协 |
| 拆 Tickets、命名或管理工程任务 | 当前优先级和可接受的取舍 |
| 选择测试框架或实现架构 | 可运行结果是否真正解决产品问题 |

代码 review、测试、调试和技术验证仍然会发生。它们会成为 Project Lead 管理的工程证据，而不是强加给 Product Owner 的第二份职业。

## 描述产品之后会发生什么

1. **对齐结果。** MAGA 识别用户、问题、第一个可观察价值、交付形式和重要约束。
2. **选择下一份证据。** Project Lead 判断当前需要澄清、研究、原型、实现、验证还是诊断。
3. **构建最小可检查切片。** Codex 处理实现选择，交付可以运行、查看或验证的结果。
4. **检查工程质量。** 测试、针对性 review 和诊断用来确认结果在技术上是否成立。
5. **回到产品判断。** 你评估行为和体验，再用产品语言描述下一个决定。

例如：

```text
现在还是太像任务管理器。我希望先看到本周发生了哪些变化，
再从变化追到负责人。
```

这类反馈会改变信息架构和下一步交付。你不需要指出组件名称或代码行。

## MAGA 保存什么

1. **意图：** 用户、问题、期望结果和约束。
2. **路由：** 下一步应该澄清、研究、设计、实现、验证还是修复。
3. **状态：** 已确认决定、开放问题、进行中的工作和下一个有用结果。
4. **授权：** 哪些动作已经批准，哪些需要新决定。
5. **证据：** 原型、运行行为、测试、诊断和产品验收。

这些信息保存在项目中。新的任务可以从持久状态恢复，而不把任务对话记录当成产品档案。

## 产品与授权边界

MAGA 可以自主推进已经授权的工作，但不会把一句自然语言扩张成无限权限。

- 明确项目内的可逆修改和风险匹配的检查属于正常执行。
- 发布、付费、账户操作、外部消息和不可逆删除需要明确授权。
- 无法从现有决定中推断的产品取舍会交还 Product Owner。
- ChatGPT 桌面客户端中的 Codex 仍然是用户界面；MAGA 不会建立另一套仪表盘。

## 按职责配置模型

MAGA 面对的是一整个应用，但这个应用不必是一座庞大的平台。它会协调一个目标明确的小而完整的首版，从产品意图一直走到真实上线。你不需要把下面 7 个名称当成必须学习的岗位，也不需要自己管理 7 支团队；它们只是 MAGA 用来分工的内部标签。

### 用一个小而完整的首版理解 7 个职责

假设你想从零上线一个给小型兴趣社区使用的动态应用：用户可以注册、填写简单资料、发布短动态、在首页时间线看到社区的新内容并回复。它不是给现有产品增加一个按钮，也不是一开始就建造庞大的社交平台，而是一个目标明确、核心流程完整、可以交给真实用户使用的小而完整的首版。

- **Project Lead (`project-lead`) — 推进整个产品：**把你的产品方向整理成清楚的范围和验收标准，例如先完成“注册 → 资料 → 发布 → 首页时间线 → 回复”的核心闭环，再协调研究、原型、实现和验证。影响目标用户或体验方向的决定仍然由你做。
- **研究 (`research`) — 为产品决定寻找依据：**了解这个兴趣社区现在怎样交流、现有方式哪里不方便，以及成员对个人资料、短动态、首页内容和回复方式有什么真实预期，帮助你避免凭空设计。
- **原型 (`prototype`) — 在正式构建前看见并试用产品：**先做出可以操作的注册、资料、发布、首页时间线和回复流程，让你亲手检查信息是否清楚、步骤是否顺手、整个核心循环是否成立。
- **交付 (`delivery`) — 把确认过的体验做成真的：**逐步把原型变成可运行的应用，让账户、个人资料、动态和回复能够真实保存并正确连接，而不只是停留在图片或演示中。
- **诊断 (`diagnosis`) — 找出实际故障发生在哪里：**如果新发布的动态没有出现在首页、刷新后内容消失，或回复出现在错误的位置，它会重现问题并定位真正原因，而不是盲目重做整个产品。
- **审查 (`review`) — 独立检查产品是否完整可靠：**走完“注册 → 资料 → 发布 → 首页时间线 → 回复”的完整流程，检查结果是否符合你的要求，并确认账户资料和社区内容具备必要的无障碍、隐私与安全边界。
- **发布 (`release`) — 把产品可靠地交给真实用户：**确认线上设置、资料备份、运行观察和出现问题时的撤回方式已经准备好。得到你的上线批准后，再正式开放产品，并验证新用户能够完成“注册 → 资料 → 发布 → 首页时间线 → 回复”的核心流程。

配置模型时，你不是在雇用或管理 7 个人，而是在决定 MAGA 的每一类幕后工作可以使用多少判断与推理能力。职责识别、任务安排和协作推进仍由 MAGA 完成。

配置面板为同一组 7 个职责提供三套起始方案：

- **Pro · 质量优先：**开放式判断和把关使用 Sol，边界明确的实现使用 Terra，不使用 Luna。
- **Plus · 常规使用：**最高价值判断使用 Sol，日常推理与工具调用使用 Terra，有边界交付使用 Luna Max。
- **Free / Go · 节省额度：**大部分工作使用 Terra，发布风险保留 Sol，定义清楚的交付使用 Luna Max。

| 职责 | Pro · 质量优先 | Plus · 常规使用 | Free / Go · 节省额度 |
| --- | --- | --- | --- |
| Project Lead (`project-lead`) | Sol · xhigh | Sol · xhigh | Terra · xhigh |
| 研究 (`research`) | Sol · max | Sol · max | Terra · max |
| 原型 (`prototype`) | Sol · xhigh | Terra · high | Terra · high |
| 交付 (`delivery`) | Terra · xhigh | Luna · max | Luna · max |
| 诊断 (`diagnosis`) | Sol · max | Terra · xhigh | Terra · high |
| 审查 (`review`) | Sol · xhigh | Sol · high | Terra · high |
| 发布 (`release`) | Sol · xhigh | Sol · high | Sol · high |

Business、Enterprise 和 Edu 工作区可先使用 Plus 方案；当工作区额度与模型策略允许时再切换到 Pro。API key 用户按自己的 token 预算选择。订阅可用性与额度可能变化，请以最新的 [Codex 价格与订阅说明](https://learn.chatgpt.com/docs/pricing)为准。

三套方案按职责分工，而不是简单给模型排高低：**Sol** 负责模糊问题、判断和精修；**Terra** 是需要推理与工具调用的日常主力；**Luna** 只在验收标准清楚的交付中以 **max** 推荐。更高推理深度会花费更多时间和 token；套用方案后，每个职责仍可单独调整。

打开 MAGA 插件详情页，选择 **Configure** starter prompt。它会开启一个 MAGA 配置任务，并在任务中打开配置面板；当前 Codex 插件详情页还不能嵌入任意自定义表单。先选择方案，再调整个别职责并点击 **保存**。首次保存前，Codex 宿主默认值仍然生效；之后只更新你实际改动的职责。设置保存在当前 Codex Home，不写入产品仓库，也不进入 Git 历史。

保存后的修改只影响你用产品语言明确批准的新任务；MAGA 会自动判断职责并提出名称清楚的任务，但不会在你批准前创建。已有任务保持原设置。Project Lead 只会在首次新建，或你明确要求用新配置创建 replacement 接手项目时采用保存的配置。面板中的 `model/list` 只是参考目录，不代表每个目标环境的最终能力。MAGA 会把你保存的模型和深度交给新任务的目标宿主验证；若目标宿主拒绝，才省略 overrides 重试一次，并明确告知使用宿主默认值。它不会擅自换成另一档模型，也不会因为任务“看起来很难”就升级。

## 里面有什么

当前版本是 **v0.13.0**，包含 18 个注册 Skills、一套只在需要时加载的内部方法库、职责级计算配置、面向本地文件文字的 Humanization 自动路由，以及基于明确提交的 Git 交付保护。

| 层 | 职责 |
| --- | --- |
| Project Lead | 接收产品语言、维护状态、选择方法并协调任务 |
| 产品发现 | 澄清、研究、领域语言、概念和优先级 |
| 设计与交付 | 规划、原型、实现、验证和收尾 |
| 内容自然化 | 处理六种 locale 的文章、文档、消息、产品文案和 GUI 文案 |
| 诊断与简化 | 调试、代码 review 和削减不必要复杂度 |
| 方法库 | 按需加载上游工作流，避免占满每次对话的上下文 |

Humanization 使用确定的本地文件边界。只有 MAGA 将面向人阅读的文字写入或修改到本地文件时才自动触发，例如 Markdown 或其他文档、报告、文章、保存为文件的沟通草稿、发布说明，以及源码或资源文件中的产品可见文案。仅在聊天中返回的文字永不自动触发，无论长短、是否使用 Markdown、能否直接复制或以后是否可能分享。用户仍可显式调用，自动执行时完全静默。

`wait-what` 保持自动调用：只要用户以任何语言表示上一段解释没有讲明白，MAGA 就会在当前对话中补足缺失前提，换用更清楚的表达和项目词汇重新说明；用户也可以显式调用 `$wait-what`。Codex 宿主支持时可能显示 Skill 标记，但自动恢复行为不依赖这个界面标记。

查看实现：[Skill 目录](./plugins/maga/skill-catalog.json) · [Project Lead](./plugins/maga/skills/project-lead/SKILL.md) · [面向产品的 Project Lead](./playbooks/product-oriented-project-lead.md)

<details>
<summary><strong>路由、任务和授权</strong></summary>

### 路由

Project Lead 先判断需要哪类证据，再选择注册 Skill 或内部方法。用户可以显式调用 Skill，但普通产品工作不要求这样做。

### 任务边界

默认在当前任务继续工作。只有一个具体对象适合并行执行、隔离上下文、独立授权或独立验收时，MAGA 才会提出名称明确的新任务，并用产品语言向你确认；一次回答可以批准一组列清楚的任务。它不会预建空的研究、原型、实现或 review 房间。

### 授权

自然语言授权适用于当前清楚描述的产品切片，不会自动覆盖未来 Tickets 或范围明显扩张后的结果。

进一步阅读：[能力路由](./plugins/maga/skills/project-lead/references/capability-routing.md) · [原生 Codex 循环](./plugins/maga/skills/project-lead/references/native-codex-loop.md) · [项目记忆](./plugins/maga/skills/project-lead/references/project-memory.md)

</details>

<details>
<summary><strong>安装行为</strong></summary>

`install` 会添加或更新 MAGA marketplace，并安装 `maga@maga`。

`init` 只接受空目录，然后：

1. 安装插件。
2. 写入 `.ai-workflow/PROJECT.md`、`AGENTS.md` 和 `.gitignore`。
3. 初始化 Git；已配置身份时创建第一次提交。
4. 创建或复用一个名称明确的 Project Lead 任务。
5. 在 ChatGPT 桌面客户端的 Codex 中打开项目。

`start` 读取已有项目状态并恢复 Project Lead，不会重写项目文件。这些细节面向维护者；普通用户可以直接让 Codex 完成安装、恢复或卸载。

</details>

## 上游工作与许可

MAGA 在固定版本上改编了成熟方法：

- [mattpocock/skills](https://github.com/mattpocock/skills)：25 个正式 Engineering 与 Productivity Skills 的工作流材料，固定到 `8b36d4f`。
- [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail)：最小实现、复杂度 review 和生命周期 Hooks，固定到 `16f2980`。
- [thevenomsnake/humanization](https://github.com/thevenomsnake/humanization)：覆盖六种 locale 的自然文章与 GUI 文案，固定到 `d3b8f37`（Humanization `3.0.0`）。

MAGA 的路由、项目状态、安装器和 Project Lead 契约属于本地改编。来源、修改和许可证记录在 [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)。

## 研究与手册

- [研究索引](./research/README.md)
- [面向产品的 Project Lead](./playbooks/product-oriented-project-lead.md)
- [多任务协作](./playbooks/multi-session-collaboration.md)
- [原生 Codex Ticket 编排](./playbooks/codex-ticket-orchestration.md)
- [AI-slop 研究](./research/kill-ai-slop.md)

## License

MAGA 采用 [MIT License](./LICENSE)。第三方材料遵循各自许可证，详见 [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)。
