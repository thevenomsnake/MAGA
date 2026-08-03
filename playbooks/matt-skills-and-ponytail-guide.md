# Matt Pocock Skills 与 Ponytail 使用手册

> 面向能理解产品、前后端和数据库等基本概念，但不以写代码为主要工作的人。
>
> 核对版本：Matt Pocock Skills [`2ab9580`](https://github.com/mattpocock/skills/commit/2ab958093e83e0ec752e6c1c5932da465bf23e0c)，Ponytail [`16f2980`](https://github.com/DietrichGebert/ponytail/commit/16f29800fd2681bdf24f3eb4ccffe38be3baec6b)。

## 先回答：一定要输入 skill 名称吗

**不一定。** Codex 有两种 skill 调用方式：

1. **隐式调用**：你直接描述目标，Codex 根据 skill 的 `description` 判断是否使用。
2. **显式调用**：你明确选择某个 skill，确保本次使用它。

不同宿主的显式语法不同：

| 使用位置 | 显式调用方式 |
| --- | --- |
| Codex Desktop、CLI 或 IDE 扩展 | 输入 `$skill-name`，或用 `/skills` 选择 |
| Claude Code | 上游文档通常写成 `/skill-name` |

所以，在 Matt 或 Ponytail README 中看到 `/xxx`，不要直接照抄到 Codex。MAGA 包内面向 Codex 的引用统一写成 `$skill-name`。

但是，**没有输入名称**和**完全自动触发原版 Skill**不是一回事。Matt 有 13 个
Skill 明确禁止宿主隐式调用；直接使用这些原版入口时，仍然需要人显式选择。
MAGA 的 Project Lead 可以根据产品状态在内部采用相应方法，但不会修改这些原版
入口的调用元数据。

来源：[OpenAI Skills 文档](https://learn.chatgpt.com/docs/build-skills#how-chatgpt-and-codex-use-skills)、[Matt 调用模型](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/.agents/invocation.md)。

## MAGA 0.8.0 包含什么

| 来源 | MAGA 内置内容 | 调用与生命周期 |
| --- | --- | --- |
| MAGA | 2 个入口 skills | `project-lead` 与 `orchestrate-tickets` 均允许隐式调用 |
| Matt Pocock Skills | 22 个正式 skills | 13 个必须显式调用，9 个允许隐式调用 |
| Ponytail | 6 个 Skills，以及基于固定上游 commit、经 MAGA 宿主适配的生命周期 hooks | 6 个 Skills 允许隐式调用；hooks 保留上游生命周期语义，适配项见 Third-Party Notices |

因此，一个隔离实例只需安装 MAGA，就能获得上述 30 个 skills，不需要再分别安装 Matt 或 Ponytail。这里的“内置”不表示跳过 Matt 原有的项目配置：首次在某个仓库采用 Matt 的 tracker/spec/ticket 流程时，仍需手动运行 `$setup-matt-pocock-skills`。它生成项目内配置，不会联网安装外部 skills，MAGA 也不会替用户自动触发它。

## 最简单的使用方法

下面这些请求可以直接用自然语言说，不需要记 skill 名称：

| 你想做什么 | 可以直接说 | 可能隐式使用 |
| --- | --- | --- |
| 查资料 | “去官方资料研究这个问题，整理成文档” | `research` |
| 排查故障 | “这个功能报错了，找出根因并修复” | `diagnosing-bugs` |
| 做原型 | “先做几个可以操作的界面方案让我比较” | `prototype` |
| 审查代码 | “review 这个分支是否符合需求和项目规范” | `code-review` |
| 整理术语 | “把这些容易混淆的业务概念定义清楚” | `domain-modeling` |
| 讨论模块边界 | “这个模块接口是否太复杂，应该如何收口” | `codebase-design` |
| 压测想法 | “先挑战一下这个计划，找出没想清楚的地方” | `grilling` |
| 最小实现 | “用最简单、能工作的方式完成，不要过度设计” | `ponytail` |
| 简化当前改动 | “检查这次改动是否过度工程，有什么能删” | `ponytail-review` |

以下原版 Matt 入口不会仅靠普通自然语言由 Codex 宿主自动启动：

- 把完整讨论发布为 spec；
- 把 spec 拆成 tickets；
- 按 ticket 进入 Matt 的完整实现流程；
- 建立跨会话 Wayfinder 地图；
- 生成 handoff 并切换会话。

要直接运行这些原版流程，需要显式选择对应 Matt Skill。通过 MAGA Project Lead
工作时，用户仍可只说产品目标；Project Lead 会自动决定是否在当前任务采用其中
的方法，或为具体问题建立按需调研、原型、诊断、审查或交付任务。

## Matt Pocock Skills 是什么

Matt Pocock Skills 是一组可组合的工程流程，不是自动运行的开发流水线。它试图把需求澄清、领域建模、研究、规格、拆票、实现、TDD、审查和交接做成可以重复调用的工作方法。

它的典型完整路线是：

```text
想法
-> grill-with-docs
-> 必要时 prototype
-> to-spec
-> to-tickets
-> 每张 ticket 使用新的 implement 会话
-> implement 内部调用 TDD 和 code-review
-> commit
```

这套路线上最重要的限制是：流程入口大多要求人显式调用。`ask-matt` 可以推荐下一步，却不能替用户启动另一个显式 skill。

### 13 个显式调用 Skills

这些 skill 的 Codex 元数据设置了 `allow_implicit_invocation: false`。普通自然语言不会可靠地让 Codex 自动进入它们。

| Skill | 具体做什么 | 什么时候使用 | Codex Desktop 示例 |
| --- | --- | --- | --- |
| `ask-matt` | 根据当前处境推荐 skill 和路线 | 不知道下一步该用什么 | `$ask-matt 我有一个产品想法` |
| `grill-with-docs` | 深入追问设计，同时维护术语表和必要 ADR | 想法仍有大量产品决定 | `$grill-with-docs 帮我把这个设计问清楚` |
| `triage` | 分类、验证 Issue 或外部 PR，形成可执行 brief | 有一批外来需求、Bug 或 PR | `$triage 处理待办 Issue` |
| `improve-codebase-architecture` | 扫描架构问题，生成候选报告，再讨论一个改进点 | 想改善已有代码库结构 | `$improve-codebase-architecture` |
| `setup-matt-pocock-skills` | 配置 tracker、triage 标签和领域文档位置 | 每个仓库首次使用这套体系 | `$setup-matt-pocock-skills` |
| `to-spec` | 将已经讨论清楚的内容整理并发布为 spec | 讨论完成，需要固定需求 | `$to-spec` |
| `to-tickets` | 将计划或 spec 拆成可独立验收的纵向 tickets | 工作超出一个会话 | `$to-tickets` |
| `implement` | 根据 spec/tickets 实现、验证、review 并提交 | 已有清晰执行源 | `$implement 执行 ticket 12` |
| `wayfinder` | 将超大、模糊工作拆成决策地图，逐项消除未知 | 单个会话无法容纳的问题 | `$wayfinder 规划这次大型改造` |
| `grill-me` | 只做深入访谈，不维护仓库文档 | 想压力测试想法但不写文档 | `$grill-me` |
| `handoff` | 将当前会话压缩成下一会话可读取的交接 | 当前上下文过长或需要换会话 | `$handoff` |
| `teach` | 建立可跨会话持续的教学空间 | 想系统学习一个主题 | `$teach 教我理解事件驱动架构` |
| `writing-great-skills` | 指导创建或改进 skill | 正在设计自己的 skill | `$writing-great-skills` |

### 9 个允许隐式调用的 Skills

这些 skill 可以根据自然语言自动匹配。显式选择仍可用于确保一定调用。

| Skill | 具体做什么 | 常见自然语言触发 |
| --- | --- | --- |
| `prototype` | 建立可丢弃的逻辑或 UI 原型，回答设计问题 | “做几个能操作的方案让我试” |
| `diagnosing-bugs` | 建立复现、提出假设、定位根因并验证修复 | “这个功能坏了”“为什么变慢了” |
| `research` | 后台查一手来源，生成有引用的研究文档 | “研究官方文档”“查清这个 API” |
| `tdd` | 采用 red-green-refactor 开发 | “使用 TDD”“先写失败测试” |
| `domain-modeling` | 澄清领域术语，维护 `CONTEXT.md` 和少量 ADR | “统一这些业务术语” |
| `codebase-design` | 用深模块、interface、seam 等方法讨论代码结构 | “这个模块边界应该怎么设计” |
| `code-review` | 分别检查项目规范与需求符合度 | “review 这个分支”“检查当前改动” |
| `resolving-merge-conflicts` | 处理正在进行的 merge/rebase 冲突 | “解决当前 Git 冲突” |
| `grilling` | 逐个追问真正需要人决定的问题 | “挑战这个计划”“把没想清楚的问出来” |

本项目的额外规则是：TDD 只有在用户明确要求时使用。上游允许 `tdd` 隐式匹配，不表示每个项目都应把它设为默认流程。

### `ask-matt` 到底是不是自动路由器

不是。它是一个导航入口：

1. 你显式调用 `ask-matt`。
2. 它分析当前情况并告诉你推荐路线。
3. 你再显式选择下一个流程 skill。

它把“记住 13 个名字”缩小成“先记住一个入口”，但没有自动执行完整路线，也不保存当前工作流状态。

### 哪些内容对产品人员不友好

Matt 的上游定位本来就是 “Skills For Real Engineers”。完整流程会直接出现：

- spec、ticket、tracer bullet 和 blocking edge；
- TDD、test seam 和 red-green；
- branch、diff、commit 和 merge-base；
- handoff、fresh context 和 smart zone；
- domain model、deep module 和 interface。

大量机械工作确实由 Agent 完成，但使用者仍要管理研发阶段。对略懂技术但不写代码的人，它更适合作为工程团队手册，而不是完全无感的产品构建流程。

## Ponytail 是什么

Ponytail 是一套“先证明复杂度有必要，再写代码”的实现策略。它要求代理依次检查：

```text
是否需要做
-> 项目里是否已经有
-> 标准库是否支持
-> 平台是否原生支持
-> 已装依赖是否支持
-> 能否用清晰的一行完成
-> 最后才写最少的新代码
```

它约束的是实现选择，不负责需求澄清、项目记忆、权限、安全设计或最终产品验收。

### 6 个 Ponytail Skills

这 6 个 skill 都允许通过自然语言描述任务，不强制使用命令。

| Skill | 具体做什么 | 自然语言触发示例 | 是否日常需要 |
| --- | --- | --- | --- |
| `ponytail` | 在编码任务中优先不做、复用、标准库和原生能力 | “用最简单方式实现”“不要引入多余依赖” | 是，主要能力 |
| `ponytail-review` | 只检查当前 diff 是否过度工程 | “看看这次改动有什么可以删” | 实现后按需 |
| `ponytail-audit` | 对整个仓库做复杂度专项检查 | “审计整个项目有哪些过度设计” | 低频维护 |
| `ponytail-debt` | 收集源码中的 `ponytail:` 简化标记 | “列出之前刻意留下的简化和升级条件” | 维护者使用 |
| `ponytail-gain` | 展示项目自带的 benchmark 指标卡 | “Ponytail 声称节省多少” | 非交付能力 |
| `ponytail-help` | 展示模式、命令和配置帮助 | “Ponytail 怎么用” | 管理和帮助 |

对普通产品人员来说，只需要知道主 `ponytail` 的效果。其余五个更接近维护和诊断工具，不必学习。

### 原版生命周期在 MAGA 中如何运行

完整 Ponytail 插件包含 skills 和 lifecycle hooks。hooks 负责：

- 新会话默认加载 `full`；
- 恢复或压缩上下文后重新注入规则；
- 让子代理继承规则；
- 保存 `lite/full/ultra/off` 模式状态。

MAGA 已内置这套 hooks，并保留原版三个事件契约：

- `SessionStart`：在 `startup`、`resume`、`clear`、`compact` 时按持久默认值重新注入规则；
- `SubagentStart`：向匹配的子代理再次注入当前规则；
- `UserPromptSubmit`：处理原版 `$ponytail`、`$ponytail-review` 及 MAGA 命名空间下的模式命令。

Codex 不会让第三方插件自行取得 hook 信任。安装 MAGA 后需要在 `/hooks` 中审阅并信任，运行环境的非交互 `PATH` 还必须能找到 Node.js 18 或更高版本。如果 hooks 未获信任、被宿主禁用或找不到 Node.js，六个 Ponytail skills 仍可被显式或隐式调用，但 always-on 生命周期不会运行。

MAGA 保留固定上游版本的实际语义，而不虚构更强的持久化能力：`lite` 或 `ultra` 会在下一次 `resume`、`clear` 或 `compact` 重新加载持久默认值；同一插件数据目录中的并发任务共用当前模式文件。要改变这两点属于后续 MAGA 扩展，不是“保留原版”。

### 隔离 Codex 实例的最小验收

仓库测试可以验证打包结构、调用元数据和 hook 脚本，却不能替 Codex 宿主授予信任或证明宿主实际派发了事件。发布前应在只安装 MAGA 的隔离实例中做一次宿主验收：

1. 安装 MAGA 后确认界面列出 30 个 skills，并在 `/hooks` 中审阅、信任三个 Ponytail 事件；
2. 新建任务，确认 `SessionStart` 以默认 `full` 注入；
3. 运行 `$ponytail ultra` 和 `$ponytail-review`，确认原版模式命令仍有效；
4. 启动一个子任务，确认 `SubagentStart` 继承当前模式；
5. 分别触发 resume 或 compact，确认会按持久默认值重注入，而不是错误保留临时模式；
6. 用自然语言分别试一次 `research` 等自动 skill，并确认 `$implement` 等手动 skill 只有显式选择后才进入。

前五项是确定性的生命周期验收；第六项中的自然语言自动匹配包含模型调度判断，应验证“允许自动调用且没有被错误禁用”，不应把每一种措辞都必须命中写成保证。

### 是否需要理解 `lite/full/ultra`

普通用户不需要。

- `lite`：照需求实现，同时指出更简单选项。
- `full`：默认执行完整最小化决策梯。
- `ultra`：更积极地删除并挑战需求。
- `off`：关闭。

这些等级适合维护者调试实现策略。产品人员只需要用普通语言纠正结果，例如“这次不要省略扩展能力”或“先做最简单版本”。

### Ponytail 的风险边界

- “最小实现”可能被误读成“少做需求”。
- 用户没说清楚的真实业务约束可能被判成不必要。
- `audit` 只检查复杂度，不代表完整质量审计。
- `ponytail-gain` 使用的旧指标不能视为当前项目收益。
- 自动匹配取决于 Codex 对 description 的判断，并非确定性保证。

## 面向产品人员的使用建议

### 日常产品修改

直接描述想要的产品行为即可。Ponytail 和适合的隐式 Matt skill 可能自动加载：

```text
给库存列表增加批量调整功能。先做最小可运行版本，不增加新的框架。
```

### 想法还不清楚

如果愿意使用 Matt 的原始流程，显式选择：

```text
$grill-with-docs
```

随后用产品语言描述目标。你仍需要回答产品决定，但不需要自己写代码。

### 不知道该走哪个流程

显式选择：

```text
$ask-matt
```

它会推荐路线，但不会替你自动启动下一项。

### 已经讨论清楚，准备实现

Matt 的原始完整流程需要依次显式进入：

```text
$to-spec
$to-tickets
$implement
```

小任务可以直接使用 `$implement`。进入后，代码、测试、review 和 commit 由 Agent 处理。

### 发现 Bug

直接说：

```text
这个操作偶尔会保存两次，找出根因并修复。
```

`diagnosing-bugs` 可以隐式触发，不需要先运行 Matt 主流程。

### 只想防止过度设计

直接说：

```text
用最简单能工作的方式完成，不要增加没必要的抽象。
```

这比要求产品人员学习 Ponytail 的模式和辅助命令更直接。

## 常见误解

### “安装后所有 skills 都会自动运行”

错误。宿主先看到名称和 description，只在匹配时加载完整内容；Matt 还有 13 个明确禁止隐式调用的 skill。

### “隐式调用一定会命中”

错误。它依赖 description、用户表述、宿主调度和可用的 skill 元数据。重要任务应显式选择。

### “`ask-matt` 会自动执行完整工作流”

错误。它只推荐路线，不能调用另一个 user-invoked skill。

### “安装 MAGA 后 Ponytail hooks 会直接运行”

错误。完整 hooks 已包含在 MAGA 中，但 Codex 要求用户先在 `/hooks` 中审阅并信任；Node.js 和宿主 hook 开关也必须可用。

### “用了 `implement` 就要自己再调用 TDD 和 review”

不需要。上游 `implement` 会在内部调用 `tdd` 和 `code-review`。但它默认的完整测试和双轴 review 可能比某些窄改动需要的更重。

### “Ponytail 越强越好”

错误。`ultra` 会更积极质疑需求；权限、安全、数据迁移、并发和不可逆操作仍需要风险驱动的完整设计。

## 一页速查

| 情况 | 是否需要显式 skill | 推荐入口 |
| --- | --- | --- |
| 普通研究、诊断、原型、术语整理、review | 通常不需要 | 直接说目标 |
| 普通编码，希望避免过度设计 | 通常不需要 | 直接说明产品行为和“最小正确实现” |
| 不知道 Matt 里该用哪个流程 | 需要 | `$ask-matt` |
| 深入澄清并同步文档 | 需要 | `$grill-with-docs` |
| 将讨论转成正式规格 | 需要 | `$to-spec` |
| 将规格拆成跨会话工作 | 需要 | `$to-tickets` |
| 按 spec/ticket 执行完整实现 | 需要 | `$implement` |
| 巨大且模糊的长期工作 | 需要 | `$wayfinder` |
| 只检查当前改动是否过度工程 | 不一定 | 自然语言或 `$ponytail-review` |
| 希望 Ponytail 在宿主事件后重新注入 | 需要一次信任 | 安装 MAGA 后用 `/hooks` 审阅；确保 Node.js 18+ 可用 |

## 延伸阅读

- [Matt Pocock Skills 独立研究](../research/matt-pocock-skills.md)
- [Ponytail 独立研究](../research/ponytail.md)
- [Matt 官方 README](https://github.com/mattpocock/skills/blob/2ab958093e83e0ec752e6c1c5932da465bf23e0c/README.md)
- [Ponytail 官方 README](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/README.md)
- [OpenAI Skills 文档](https://learn.chatgpt.com/docs/build-skills)
