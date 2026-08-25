# Matt Pocock Skills 上游审计：2026-08-25

> 比较范围：[`5b15a47...6654f6b`](https://github.com/mattpocock/skills/compare/5b15a47f2d7150f545fbcacbfe381787fc0230dc...6654f6b60cd9d5be8b54c6fafe44346dabeb3b76)
>
> 审计日期：2026-08-25
>
> 证据边界：只使用 `mattpocock/skills` 官方仓库的 compare、commit 和固定 commit 文件。本文只记录公开安全的事实和 MAGA 适配判断，不修改或检查任何外部 Skill 安装。

## 结论

**推荐的最小采用集是：不更新代码、不新增 Skill、不移动 vendor pin。**

从 MAGA 当前固定的 `5b15a47f2d7150f545fbcacbfe381787fc0230dc` 到指定 HEAD `6654f6b60cd9d5be8b54c6fafe44346dabeb3b76`，上游只有 3 个提交、3 个变更文件、50 行新增、0 行删除。它们只新增了 `skills/in-progress/retro` 及其索引和 Codex 卡片；没有修改任何 promoted Engineering/Productivity Skill、正式插件清单、`ask-matt` 路由或既有实现流程。

上游自己仍把 `retro` 标为 **in-progress、STUB、未包含在插件、可随时变更或消失**。因此，MAGA 不应把一次 beta 设计草稿伪装成已吸收的正式能力，也不应把所有 Matt catalog SHA 从 `5b15a47` 机械更新到 `6654f6b`。

`retro` 有三个值得保留为未来设计素材的内核：基于具体 session 证据、把问题分类到最合适的环境层、只提出按严重度排序的改进候选。但必须加上 MAGA 的边界：只在明确请求或重复摩擦后运行；只读当前项目授权范围；不默认扫描机器日志或全局配置；不假设每次实现都经过独立 review；不因一次失误扩张测试门禁；任何信息访问都先过隐私和权限决策。

## 1. 上游差异完整清单

### 比较事实

官方 compare 显示：

- status 为 `ahead`，HEAD 比固定点前进 3 个提交、没有分叉；
- 只改动 [`skills/in-progress/README.md`](https://github.com/mattpocock/skills/blob/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76/skills/in-progress/README.md)、新增 [`retro/SKILL.md`](https://github.com/mattpocock/skills/blob/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76/skills/in-progress/retro/SKILL.md) 和 [`retro/agents/openai.yaml`](https://github.com/mattpocock/skills/blob/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76/skills/in-progress/retro/agents/openai.yaml)；
- [`skills/engineering/README.md`](https://github.com/mattpocock/skills/blob/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76/skills/engineering/README.md)、[`skills/productivity/README.md`](https://github.com/mattpocock/skills/blob/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76/skills/productivity/README.md) 和 [正式 Claude plugin manifest](https://github.com/mattpocock/skills/blob/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76/.claude-plugin/plugin.json) 没有进入 diff。

正式 plugin manifest 仍列出 25 个 Skill：18 个 Engineering、7 个 Productivity；没有 `retro`。因此本轮“变更到的正式 Skill/flow”数量是 **0**；唯一值得审计的是未毕业候选 `retro`。

### 三个提交

| 提交 | 官方变化 | 行为含义 |
| --- | --- | --- |
| [`8fa1886`](https://github.com/mattpocock/skills/commit/8fa188659c5f102894807854bed9d2eee4a711f4) | 初次加入 `retro/SKILL.md` 与 `agents/openai.yaml`。Skill description 和卡片都明确写 `STUB` / `not functional`。 | 建立回顾流程草稿：读取指定 session 一手资料，寻找环境改进候选，按严重度报告。 |
| [`3ec8e23`](https://github.com/mattpocock/skills/commit/3ec8e2399438cd5603324df8263acf3b64cf69b8) | 把 Skill description 从“STUB”改成 `Conduct a retrospective on a coding session.`，卡片也去掉 stub 字样，并加入 in-progress README。 | 直接安装后的 UI 看起来像可用 Skill，但 bucket README 仍明确称其为 STUB。这是成熟度信号不一致，不是毕业。 |
| [`6654f6b`](https://github.com/mattpocock/skills/commit/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76) | 增加第七类候选 `Information access`：缺信息时考虑 tee dev-server logs 或第三方服务只读访问。 | 将回顾从提示/检查/工具优化扩展到信息权限和可观测性；同时扩大隐私与授权风险。 |

## 2. `retro` 的真实流程

### 调用与成熟度

当前 [`retro/SKILL.md`](https://github.com/mattpocock/skills/blob/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76/skills/in-progress/retro/SKILL.md#L1-L44) 使用 `disable-model-invocation: true`；[`agents/openai.yaml`](https://github.com/mattpocock/skills/blob/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76/skills/in-progress/retro/agents/openai.yaml#L1-L5) 同时设 `policy.allow_implicit_invocation: false`，所以它是明确的 user-invoked Skill。

这与上游的 [invocation contract](https://github.com/mattpocock/skills/blob/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76/.agents/invocation.md) 一致。第一步调用 model-invoked 的 `writing-for-agents` 也符合“用户调用 Skill 可以调用模型调用 Skill”的上游规则。

但成熟度边界更重要。当前 [`skills/in-progress/README.md`](https://github.com/mattpocock/skills/blob/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76/skills/in-progress/README.md#L1-L18) 明确说明该 bucket：

- 是 beta；
- 排除在插件和顶层 README 之外；
- 没有 docs page；
- 可无预警改变或消失；
- `retro` 本身是 `STUB: design notes only, not functional yet`。

因此，description/card 去掉 `STUB` 不能覆盖 bucket 的正式状态。

### 四步流程

1. 调用 `writing-for-agents` 获取 Agent 文档写作纪律。
2. 读取用户指定 session 的一手资料；未指定时默认当前 session，并允许“搜索本机 session logs”。
3. 从七个类别寻找环境改进候选。
4. 按严重度向用户呈现候选。

Skill 的动作是“suggest improvements”和“present candidates”，没有要求直接修改文件、安装工具或授予访问。因此最合理的解释是**只读诊断**。但它没有显式写出“不修改”“不读取未授权范围”“先清理私密信息”等硬边界；MAGA 不能依靠动词语气推断权限。

## 3. 七类候选与 MAGA 取舍

| 上游类别 | 值得保留的机制 | MAGA 冲突/风险 | 最小适配判断 |
| --- | --- | --- | --- |
| Navigation | 从“找信息花了太久”反推 context pointer、入口文档或隐藏依赖。 | 一次搜索慢不证明需要新文档；新增 pointer 也会增加常驻 context load。 | **概念吸收。** 先确认问题重复且现有入口无法廉价发现，再用 `writing-for-agents` 修最窄 pointer。 |
| Automated checks | 将已发生、可机械检测的错误移到 lint、typecheck、test 或 filesystem check。 | 与 MAGA 的 lean-validation 边界冲突：一次失误不能自动扩张为新框架、全量回归或永久门禁。 | **条件吸收。** 只有复发成本真实、检查能直接捕捉该错误且维护成本低时，才提一个最小 check；由 Bar Tester 决定证据范围。 |
| Coding standards | reviewer 漏掉问题时，检查规则是否缺失、含糊或应删除。 | 上游同时宣称所有工作都经过 implementation + review，并把标准主要交给 reviewer；MAGA 不默认双轴 review，且写入时必须知道的安全/产品约束不能延后到 review。 | **部分吸收。** 只评估规则归属；跨所有写任务的不变量留在 AGENTS/项目契约，纯 review smell 才进入 review reference。 |
| Global AGENTS.md | 识别过长 steering，把条件性内容移到 pointer、标准或自动检查。 | 默认检查/建议用户全局 AGENTS 超出当前项目范围，可能暴露其他项目、用户名、路径或私人工作习惯；本仓库还明确禁止修改外部 Skill 安装。 | **只保留项目内原则。** 除非用户明确指定，不读、不评、不改全局范围。 |
| Tool economy | 找出昂贵、重复或 token-inefficient 的 CLI/MCP 调用。 | 单次长调用可能是任务必要成本；追求 token 数会诱发少读上下文、跳过根因或削弱证据。 | **条件吸收。** 只优化可重复且输出确实大部分无用的调用；保留正确性、隐私和可恢复性。 |
| No-ops | 删除对 Agent 行为没有可观察影响的 steering sediment。 | 一次 session 没触发某规则不等于规则无效；安全、隐私和权限 guardrail 即使重复也可能有意。 | **条件吸收。** 需要跨相应场景的行为证据；硬 guardrail 不按文风或单次未触发删除。 |
| Information access | 缺关键信息时考虑日志 tee 或第三方只读数据源。 | “只读”仍可能暴露 secrets、个人数据、内部系统、未授权账户或跨项目资料；新增 connector/MCP 也扩大供应链和权限表面。 | **仅作为权限缺口分类。** 先说明缺失信息、最小读取范围、数据敏感性和替代方案，再由 Product Owner 明确授权；retro 自己绝不连接或配置。 |

## 4. 与 MAGA 模型的冲突

### 产品语言

上游要求人记住并显式调用 `retro`，输出对象是 coding agent environment、reviewer agent、MCP、steering files 和 token economy。它适合工程操作者，但不是 MAGA Product Owner 的默认词汇。

MAGA 若未来吸收，应接受普通问题，例如“我们这次为什么这么费劲，下次怎么少走弯路？”Project Lead 在当前任务内返回可评估的改进候选，不要求用户学习新 Skill 名称。没有必要新增第 20 个公开 Skill 或另开通用 `Retro` task。

### Lean validation

上游把 automated checks 视为七个主要改进通道之一，还假定所有工作都有 implementation/review 两阶段。MAGA 当前只运行一次风险匹配的定向验证，不默认 TDD、全量回归或双轴 review。

适配时必须把问题写成：

```text
observed failure -> smallest repeatable prevention -> add only when recurrence cost exceeds ownership cost
```

不能写成：

```text
agent once failed -> add a permanent test/reviewer rule/gate
```

### Native Codex task

上游允许搜索机器 session logs，未定义 Codex thread/list/read/wait 的边界，也不区分 durable project state 与运行时 transcript。MAGA 已规定：项目文件是 durable memory，Codex tasks 是可替换 attention workspace，运行时 ID 不进入 Git。

因此，回顾的 source order 应是：

1. 当前任务中用户明确提供的观察；
2. `.ai-workflow` 的 Ticket、decision、validation 和 commit；
3. 用户明确指定且当前宿主允许读取的一个 task/thread；
4. 其他本机或外部日志默认不进入范围。

不应为 retrospective 建立新的 task registry、复制完整 transcript 或扫描 Codex Home。

### Privacy 与 information access

`retro` 当前没有 redaction、data minimization、project isolation 或 secret 规则。尤其“searching through session logs on this machine”“Global AGENTS.md”和第三方 read-only access 都会跨过 MAGA 的 public-privacy 边界。

任何适配版都必须：

- 只读取当前仓库和用户明确指定的 session/object；
- 在公开报告中删除账号、路径、任务 ID、内部系统、业务标识和 secrets；
- 把“缺信息”与“获准取得信息”当成两个独立事实；
- 不自动安装 connector、MCP、日志 tee 或新权限；
- 无法在授权范围内取得证据时，报告 evidence gap，而不是扩大访问。

### Authorization

上游步骤 4 只要求呈现候选，但未把“建议”“批准”“修改”“验证”拆开。MAGA 应保留四段边界：

```text
observe -> propose -> Product Owner approves a bounded change -> normal Ticket implements and verifies
```

retro 分析本身不授权修改 AGENTS、CODING_STANDARDS、tests、CI、tools、MCP 或第三方访问。每个真正改动仍需普通 Product Ticket、明确 write boundary 和风险匹配验证。

## 5. 推荐的最小采用集

### 现在

1. **保持 Matt vendor pin 为 `5b15a47`.** 正式 25-Skill 集合没有变化，更新全部 catalog/notices/README SHA 只会制造无行为价值的 churn，并可能让读者误以为 MAGA 已 vendor `retro`。
2. **不复制或注册 `retro`.** 它仍是上游明确的 in-progress STUB，且 description/card 与 bucket 成熟度信号不一致。
3. **不新增默认 retrospective 阶段.** 每个 slice 完成后自动回顾会增加 ceremony，违反 MAGA “先交付、一次定向验证、提交”的默认流程。
4. **只在本报告记录观察。** 等上游毕业、MAGA 用户出现真实重复摩擦，或 Product Owner 明确请求回顾时再形成 Ticket。

### 未来确有需求时

把它实现为 Project Lead 的一个只读内部方法，而不是公开 Skill。最小输入和输出可采用：

```text
Input
- scope: current project + explicitly named session/slice
- evidence: durable Ticket/decision/validation/commit plus user observation
- privacy: redacted, no unrelated machine/global sources

Candidate
- severity: blocker | recurring cost | minor
- evidence: one observable event
- layer: navigation | instruction | check | tool | information access
- smallest change: one bounded proposal
- do not change: protected product/privacy/authorization boundary
- adopt when: recurrence or risk trigger
```

只输出候选，不修改环境。用户选中一项后，Project Lead 再按正常 Ticket 流程实施。自动 check 由 Bar Tester 收窄；第三方信息访问先走授权；涉及 Agent 文档时调用已注册的 `writing-for-agents`；不假定需要 code review。

## 6. 明确不采用

- 不采用“每次工作都必须 implementation + review”的全局流程假设。
- 不把 coding standards 一律推迟给 reviewer；写前必须知道的产品、安全、隐私和权限规则保留在正确入口。
- 不默认搜索机器 session logs、Codex Home、全局 AGENTS 或其他仓库。
- 不因 retrospective 建议自动修改文件、安装工具、启用日志、创建 CI gate 或连接第三方服务。
- 不把 read-only access 当作无风险；读取敏感或跨账户数据仍需明确授权。
- 不依据一次 session 删除 steering guardrail 或新增永久测试。
- 不把 `CODING_STANDARDS.md` 当所有项目都必须拥有的固定文件名；复用仓库现有约定。

## 7. 重新审计触发器

满足任一条件时再审：

- `retro` 从 `skills/in-progress` 晋升到 Engineering/Productivity 或进入正式 plugin manifest；
- 上游补齐明确的 read-only、privacy、authorization、evidence 和 completion contract；
- MAGA 用户反复提出协作回顾需求，现有 Project Lead 无法用产品语言完成；
- MAGA 已有可复现证据表明导航、工具调用或信息访问摩擦跨多个任务重复出现。

在此之前，MAGA 当前 `5b15a47` 适配不缺少任何新的正式 Matt Skill 行为。

## 来源索引

- [官方 compare：`5b15a47...6654f6b`](https://github.com/mattpocock/skills/compare/5b15a47f2d7150f545fbcacbfe381787fc0230dc...6654f6b60cd9d5be8b54c6fafe44346dabeb3b76)
- [初始 retro 提交 `8fa1886`](https://github.com/mattpocock/skills/commit/8fa188659c5f102894807854bed9d2eee4a711f4)
- [描述与索引提交 `3ec8e23`](https://github.com/mattpocock/skills/commit/3ec8e2399438cd5603324df8263acf3b64cf69b8)
- [Information access 提交 `6654f6b`](https://github.com/mattpocock/skills/commit/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76)
- [当前 `retro/SKILL.md`](https://github.com/mattpocock/skills/blob/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76/skills/in-progress/retro/SKILL.md)
- [当前 Codex card](https://github.com/mattpocock/skills/blob/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76/skills/in-progress/retro/agents/openai.yaml)
- [In-progress bucket contract](https://github.com/mattpocock/skills/blob/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76/skills/in-progress/README.md)
- [正式 plugin manifest](https://github.com/mattpocock/skills/blob/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76/.claude-plugin/plugin.json)
- [Upstream invocation contract](https://github.com/mattpocock/skills/blob/6654f6b60cd9d5be8b54c6fafe44346dabeb3b76/.agents/invocation.md)
