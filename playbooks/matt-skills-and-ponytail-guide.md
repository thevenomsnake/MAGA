# MAGA 内置方法、Humanization 与 Ponytail 使用手册

> 适用版本：MAGA `0.12.2`

Matt Pocock Skills 固定到 `1.2.2`，commit
`8b36d4fb2635b3c21998dcd8144439c9e5ba7302`。上游 25 个正式 Skills 在
MAGA 中逐项映射为 10 个注册 Skills、13 个内部方法和 2 个吸收能力；没有未记录的
上游入口。

MAGA 基于 Matt Pocock Skills、Humanization 与 Ponytail 的固定 MIT 快照进行 Codex 适配，
但不再把上游的每一个文件夹都暴露成同级产品入口。当前分发形态是：

- 17 个注册 Skills，供 Codex 宿主识别和按需加载；
- 13 个 Matt 原手动流程，作为 Project Lead 的内部方法；
- 4 个吸收能力：Ponytail 的 help、gain 信息卡，`wait-what` 的重讲规则，以及
  `wizard` 的人工门禁内核；
- Humanization 实际文本产出自动路由，以及 Ponytail 会话启动、恢复、清空、压缩、模式切换
  和子任务继承 hooks。

维护 catalog 共记录 34 个能力：17 个 registered、13 个 internal method 和 4 个
absorbed。

完整来源、固定 commit、修改范围和 MIT 文本见
[Third-Party Notices](../THIRD_PARTY_NOTICES.md)。上游作者没有赞助、认可或背书
MAGA。

## 用户需要记住什么

只需要从 Project Lead 开始，并用产品语言说明目标：

```text
我想做一个帮助独立设计师整理客户反馈的工具。
先研究竞品怎样处理重复反馈，再做一个能点的归并原型。
继续推进当前项目。
这个保存流程不稳定，先找出原因。
```

用户不需要先选择 spec、ticket、implementation 或 handoff 命令。Project Lead 会
根据当前意图和项目状态选择内部方法；只有形成了具体、已授权的工作边界，才会
创建新的 Codex 任务。

## 17 个注册 Skills

### MAGA 核心

| Skill | 用途 | 默认入口 |
| --- | --- | --- |
| `project-lead` | 唯一产品入口、能力路由、验收与恢复 | 自然语言自动匹配 |
| `orchestrate-tickets` | 协调已批准 Ticket、fresh task、等待、整合和归档 | 内部窄触发 |

### Humanization 实际文本产出路由

`humanization` 在文章、解释、实质性问答、文档、邮件以及网页或应用中的用户可见文字上
自动触发。简短确认、进度播报、工具结果和 Git 状态不会触发。会话和子任务 hooks
会注入简短的文本产出路由契约；Skill 本体再按 locale、
format 和 surface 加载完整规则。代码、命令、引用、数据、placeholder、变量、markup
和机器协议保持原样。

### 保留独立自动触发的 Matt 方法

这 10 个能力仍保留上游技术 ID 与隐式调用语义，因为它们拥有不同的输入、证据和
完成边界：

| Skill | 何时适用 |
| --- | --- |
| `research` | 缺少可能改变产品决定的外部事实 |
| `prototype` | 必须看到或体验行为后才能决定 |
| `diagnosing-bugs` | 已观察到具体故障、回归或性能问题 |
| `grilling` | 需要逐项压力测试一个想法或决定 |
| `domain-modeling` | 需要澄清领域术语、场景或难以逆转的决定 |
| `codebase-design` | 需要设计模块接口、seam 或架构形状 |
| `code-review` | 需要按规格和仓库标准独立验收变更 |
| `resolving-merge-conflicts` | 正在处理 Git merge/rebase 冲突 |
| `tdd` | 用户明确要求 test-first 或风险边界确实需要 |
| `writing-for-agents` | 创建或修改 Skill、`AGENTS.md` 或其他供 agent 读取的指引 |

普通 MAGA 交付不会因为 `tdd` 存在就默认采用完整 TDD。项目级 `AGENTS.md`、
已批准 Ticket 和用户明确要求始终优先。

### Ponytail

| Skill | 用途 |
| --- | --- |
| `ponytail` | 最小可行实现策略、模式控制、帮助与 benchmark 信息 |
| `ponytail-review` | 只审查当前 diff 中可删除的过度设计 |
| `ponytail-audit` | 对整个仓库执行一次复杂度审计 |
| `ponytail-debt` | 汇总 `ponytail:` 注释形成显式债务账本 |

帮助和 benchmark 卡不再是独立 Skill。使用自然语言询问，或在主入口下使用：

```text
$ponytail help
$ponytail gain
```

这两个信息型操作不会改变当前模式或持久默认值。

## 13 个内部方法

以下上游流程的核心方法与支持资源仍随插件分发，并经过 MAGA 产品边界适配；它们
位于 `plugins/maga/methods/`，不会出现在宿主 Skill 列表中：

| 内部方法 | MAGA 怎样采用 |
| --- | --- |
| `ask-matt` | 路由知识被 Project Lead 的能力路由取代 |
| `grill-me` | `grilling` 的无持久记录模式 |
| `grill-with-docs` | `grilling` 与 `domain-modeling` 联合模式 |
| `handoff` | 只在上下文必须跨 harness、仓库、目录、同事或独立的 mid-phase fork 时生成可移植交接 |
| `implement` | 在已批准 Ticket 内作为最小交付方法 |
| `improve-codebase-architecture` | `codebase-design` 的全仓审计方法 |
| `setup-matt-pocock-skills` | 由项目初始化和按需项目配置吸收 |
| `to-spec` | 决策充分闭合后综合规格 |
| `to-tickets` | 把已接受范围形成可验收纵向 Tickets |
| `wayfinder` | 只在目标清楚、路线超出一个注意力窗口时建立决策地图 |
| `triage` | 用户明确要求处理外来 Issue/PR 时进入 |
| `teach` | 用户明确要求建立持续学习工作区时进入 |
| `to-questionnaire` | 关键事实掌握在外部参与者手中时，形成不含私人身份的异步问卷 |

融合指的是减少注册入口，不是把方法内容拼进一个巨大的 `SKILL.md`。每个方法仍
保留独立文件和支持资源，Project Lead 只在当前工作需要时读取。

标准 MAGA 项目以 `.ai-workflow/PROJECT.md`、`specs/` 与 `tickets/` 为本地真源，
不会因为上游方法提到 issue tracker 就额外要求用户初始化或选择平台。只有项目本来
就在使用外部 tracker，或用户明确希望配置、发布到外部 tracker 时，才进入对应的
setup 方法与外部副作用授权。

## 4 个吸收能力

吸收表示保留有用行为，但不再分发同名独立 Skill：

| 上游能力 | MAGA 怎样吸收 |
| --- | --- |
| `ponytail-help` | 作为主 `ponytail` Skill 的帮助 reference，通过 `$ponytail help` 读取 |
| `ponytail-gain` | 作为主 `ponytail` Skill 的 benchmark reference，通过 `$ponytail gain` 读取 |
| `wait-what` | 用户表示上一段没有讲清时，Project Lead 用当前语言和产品词汇重新解释 |
| `wizard` | Project Lead 识别只有人能完成的步骤，提供可恢复的人工门禁清单 |

`wizard` 只吸收“判断 human-only 步骤并分阶段说明”的内核。MAGA 不分发上游 Bash
模板，不接收或持久化 secret，不调用 `gh auth`、`gh secret` 或 `gh variable`，也不
使用 `mktemp` 把项目临时内容写到仓库外。需要登录或操作认证网页时，只能在用户
授权后使用 Chrome；外部写入、迁移、切换和不可逆动作仍各自受 Project Lead 的
权限门禁约束。

## 1.2.2 的核心适配取舍

- **Prototype：采用单文件 HTML。** 逻辑或状态问题用一个可直接打开的
  HTML/CSS/JavaScript 文件表达，包含领域语言状态面板、自由操作和引导场景。它仍是
  回答一个问题的轻量原型，不增加框架、持久化或测试负担；所有文件和临时产物留在
  项目仓库内。
- **Grilling：采用 design tree 与 frontier。** Project Lead 用它们判断哪些决定已
  解锁，并并行查找可自行取得的事实。普通 MAGA 对话仍一次只问一个真正阻塞交付的
  产品问题；只有用户明确要求集中 stress-test 且问题彼此独立时，才使用小批量问题，
  不以穷尽所有想象分支为完成标准。
- **Phase boundary：改用 Codex 原生生命周期。** 先判断是否继续当前任务，再依据
  durable project state 决定复用、建立具名 worker、替换任务或生成可移植 handoff。
  不把 Claude 的 `/clear`、`/compact`、固定 token 阈值或跨 harness 命令暴露给用户，
  也不让会话操作取代仓库中的角色和 Ticket 契约。

## 自动路由边界

Codex 先根据注册 Skill 的 `name` 与 `description` 判断候选；只有触发后才读取完整
`SKILL.md`。Project Lead 进入后再从项目状态选择内部方法。两层路由都不是关键词
状态机，也不会扩大用户授权。

以下能力必须保持分开：

- research、prototype 与 diagnosis：分别产生事实、体验证据和故障证据；
- code-review 与 ponytail-review：分别审查正确性/规格和不必要复杂度；
- domain-modeling 与 codebase-design：分别管理业务语言和代码结构；
- spec 与 tickets：前者固定决定，后者创建可执行边界，不能跨过授权门禁合并执行。

## Ponytail 生命周期

Ponytail 默认以 `full` 模式启动，支持：

```text
$ponytail lite
$ponytail
$ponytail ultra
$ponytail off
$ponytail default lite
```

生命周期 hooks 只有在以下条件同时满足时才运行：

1. Codex 已启用 hooks；
2. 用户已经审阅并信任当前定义；
3. 非交互命令环境的 `PATH` 中存在 Node.js 18 或更高版本。

更新 MAGA 或 hook 内容变化后，需要重新通过 `/hooks` 或当前界面的 hook review
入口审阅。hooks 不可用时，Skills 和内部方法仍然可用；只是不再自动激活、恢复或
向子任务注入 Humanization 文本产出路由或 Ponytail 模式。

Ponytail 的技术 ID、状态目录、默认模式解析和生命周期事件保持不变。MAGA 只把
help/gain 两张信息卡并入主入口，没有把 Ponytail 改造成新的品牌或第二套模式。

## 隔离实例验收

在只安装 MAGA 的隔离 Codex 环境中至少验证：

1. 插件页面列出 17 个 Skills，展示名能够清楚识别 MAGA、Humanization 或 Ponytail；
2. catalog 精确包含 34 个能力：17 registered、13 internal method、4 absorbed；
3. `humanization`、`research`、`prototype`、`diagnosing-bugs`、`writing-for-agents` 各用一个自然语言
   正例触发；
4. 为每个正例加入一个相邻但不应触发的负例；
5. Project Lead 能从普通产品请求采用 spec、tickets、delivery 等内部方法，而不要求
   用户输入原阶段命令或先配置外部 issue tracker；
6. logic prototype 生成可直接打开的单文件 HTML，普通 grilling 一次只提出一个关键
   产品问题；
7. `wizard` 没有注册目录或 Bash 模板，分发内容不包含 secret、`gh auth`、
   `gh secret`、`gh variable` 或 `mktemp` 执行路径；
8. `$ponytail help` 与 `$ponytail gain` 不改变当前模式；
9. 启动、恢复、清空、压缩与子任务事件继续恢复配置的 Ponytail 默认模式；
10. 回答、解释、文章和网页文案经过 Humanization，代码、命令、数据和结构 token 不被改写；
11. 未信任 hooks 时插件仍可使用，且不会声称生命周期已经运行。

## 从 0.8.0 更新

`0.12.2` 不保留被收进内部方法库或吸收层的旧技术入口别名。别名会重新制造列表重复、
显式调用歧义和额外上下文成本。旧项目的 `.ai-workflow/` 状态不需要迁移；更新
插件后应在新任务中验证 Skill 列表，并重新审阅 Ponytail hooks。

## 上游更新策略

MAGA 不在安装时自动拉取上游最新版本。更新采用显式 vendor bump：

1. 选择并记录新的固定 commit；
2. 对比上游 Skill 与当前内部方法；
3. 重放 MAGA 的 Codex metadata、产品授权和生命周期适配；
4. 验证 17 个注册入口、13 个内部方法、4 个吸收映射、34 项 catalog、触发正反例与
   Humanization/Ponytail hooks；
5. 同步更新 catalog、Third-Party Notices 和发布说明。

## 延伸阅读

- [MAGA 能力与工作区路由](../plugins/maga/skills/project-lead/references/capability-routing.md)
- [Codex 原生 Ticket 编排](codex-ticket-orchestration.md)
- [Matt Pocock Skills 研究](../research/matt-pocock-skills.md)
- [Ponytail 研究](../research/ponytail.md)
- [Third-Party Notices](../THIRD_PARTY_NOTICES.md)
