# 上游 Vendor 审计：Matt Skills、Ponytail 与 Humanization

> 审计日期：2026-08-24
>
> 范围：比较 MAGA 当前记录的三个固定上游快照与指定的 `main` 对象；上游证据只采用各项目自己的 GitHub compare、commit 和文件页面。本文是适配决策记录；代码改动由对应 vendor commit 完成。

## 结论先行

| 上游 | 比较范围 | 会影响 MAGA 的变化 | 建议 |
| --- | --- | --- | --- |
| `DietrichGebert/ponytail` | [`16f2980...2ed6c52`](https://github.com/DietrichGebert/ponytail/compare/16f29800fd2681bdf24f3eb4ccffe38be3baec6b...2ed6c52c9d7e5e56942508591085fd45dea277d3)；4 个提交，`main` 只前进、没有落后 | VS Code Copilot 通过 `CLAUDE_PLUGIN_ROOT` 的宿主识别修复；Claude marketplace schema 不再接受 `commandWindows`；新增 Grok Build 打包；版本升至 4.9.0 | **有条件吸收前两项；不把 Grok 打包当作 MAGA 适配；版本只在真正同步实现后更新** |
| `thevenomsnake/humanization` | [`d3b8f37...c38b5b6`](https://github.com/thevenomsnake/humanization/compare/d3b8f3791fee58c030aa52539296ad361654f1c7...c38b5b6d0878ee06b899213d4003e694cece5e0c)；2 个提交，`main` 只前进、没有落后 | 当前任务限定的 `author_sample` 表达校准，以及与之配套的隐私、边界和优先级规则 | **吸收 `SKILL.md` 与 `references/core.md` 的规则；不自动收集样本、不建跨任务画像** |
| `mattpocock/skills` | [`8b36d4f...5b15a47`](https://github.com/mattpocock/skills/compare/8b36d4fb2635b3c21998dcd8144439c9e5ba7302...5b15a47f2d7150f545fbcacbfe381787fc0230dc)；47 个提交，含已发布 v1.2.3 后的 main 更新 | 诊断脱敏、直接文件操作触发、`CONTEXT-MAP.md` 指针、用户调用边界和 round 模板修订 | **吸收安全与路由修复；保留 MAGA 一问一答、内部方法和原生任务授权；不引入 beta `implement-spec`** |

审计时以 HEAD 中的 `16f2980`、`d3b8f37`、`8b36d4f` 为已发布锁定基线。工作树的适配已完成但尚未提交；只有本次变更提交后，新的 vendor SHA 才是发布事实。

## 1. Matt Pocock Skills

### 1.1 需要同步的变化

**[可验证事实]** [`diagnosing-bugs` 的脱敏提交](https://github.com/mattpocock/skills/commit/efce423018fc6468a3239621f1c1bcaacc723801) 要求在展示命令、输出和 captured artifacts 前先替换 API key、token、password、cookie、session ID、连接串和签名 URL；循环使用环境变量，引用 artifact 时只保留携带诊断信号的行。MAGA 已把这段规则放进注册的 `diagnosing-bugs` 和 HITL 模板。

**[可验证事实]** [`domain-modeling` 触发修订](https://github.com/mattpocock/skills/commit/54bc6b604075c18293d38e9e294a2c96f365f104) 把“讨论代码库术语、写入或编辑 `CONTEXT.md`、记录或编辑 ADR”写进 description。MAGA 已同步这条直接文件操作触发，同时保留自身的产品语言边界。

**[可验证事实]** [`wait-what` 多上下文修订](https://github.com/mattpocock/skills/commit/d6cd26f7f245e67ea7d0554a2fe468cd9def6e6f) 要求存在 `CONTEXT-MAP.md` 时先定位正确的 `CONTEXT.md`。MAGA 已同步该指针，并保留自动沟通恢复不创建 Ticket、文件或任务的契约。

**[可验证事实]** [`user-invoked` 调度修订](https://github.com/mattpocock/skills/commit/1dab98299c3b81f560026c01b7ebf55ed5d91373) 禁止 Skill 直接调用另一个 user-invoked Skill。MAGA 的 Project Lead 已把上游流程改成按路径读取内部 `METHOD.md`，并由其负责原生任务授权，因此不复制上游的 Skill 调度命令。

### 1.2 有意不照搬的变化

- [`grilling` round 分隔线](https://github.com/mattpocock/skills/commit/85f83d3fde1d3a90d5c9a657f6998c79a6c37308) 服务上游整轮问卷；MAGA 已有面向 Product Owner 的一问一答适配，只保留最多三个独立问题的显式批量例外。
- [`implement-spec`](https://github.com/mattpocock/skills/commit/84b5ee5afd738b6a3484e62509b84b3b573c5be3) 仍在 `in-progress` beta bucket，不改变 MAGA 的 13 个内部方法清单。
- 其余大量措辞和格式修订不改变 MAGA 的运行契约；只有涉及 YAML 可解析性或安全边界的内容才在本地适配。

## 2. Matt 适配边界

MAGA 现在将 Matt source reference 更新到 `5b15a47`，但没有声称复制上游整个仓库。保留的本地差异包括：Project Lead 是唯一产品入口，`to-spec`/`to-tickets`/`implement` 是内部方法，Ticket 授权和 Codex 原生任务状态是本地真源，验证深度由 Bar Tester 决定。

## 3. Ponytail

### 3.1 上游提交清单

比较 API 返回的四个提交依次为：

1. [`0a4dd63`](https://github.com/DietrichGebert/ponytail/commit/0a4dd63ad4541f4f655c4108a295916f3c1d8fda) `chore: release v4.9.0`：各发行清单和 `package.json` 的版本从 4.8.4 改为 4.9.0。
2. [`cc37a5d`](https://github.com/DietrichGebert/ponytail/commit/cc37a5d581916920519da9703b41cdeaaf015efa) `fix: drop commandWindows...`：删除 hooks 配置中的 `commandWindows`，并把回归测试改为确认字段缺席。
3. [`a2712bc`](https://github.com/DietrichGebert/ponytail/commit/a2712bc830c8553597e52e25a2ba0eeea18170aa) `fix: detect VS Code Copilot...`：根据 VS Code Copilot 的安装路径识别宿主，并在缺失 `COPILOT_PLUGIN_DATA` 时回退状态目录。
4. [`2ed6c52`](https://github.com/DietrichGebert/ponytail/commit/2ed6c52c9d7e5e56942508591085fd45dea277d3) `feat: add Grok Build native skills adapter`：增加 Grok 根清单、marketplace 清单和测试，并复用共享 hooks。

### 3.2 应吸收：VS Code Copilot 宿主识别与状态目录回退

**[可验证事实]** 新版 [`hooks/ponytail-runtime.js`](https://github.com/DietrichGebert/ponytail/blob/2ed6c52c9d7e5e56942508591085fd45dea277d3/hooks/ponytail-runtime.js) 增加 `isVsCodeCopilotRoot()`：当 `CLAUDE_PLUGIN_ROOT` 同时呈现 `.vscode` 与 `agent-plugins` 路径形状时，把宿主判为 Copilot。新版还把 `COPILOT_PLUGIN_DATA || getClaudeDir()` 作为 Copilot 的状态目录回退。官方提交说明指出，VS Code Copilot 不设置 `COPILOT_PLUGIN_DATA`；旧代码会误走原生 Claude 路径，输出不适用的 statusline 提示，并可能用未定义的目录构造状态路径。对应回归覆盖在 [`tests/hooks.test.js`](https://github.com/DietrichGebert/ponytail/blob/2ed6c52c9d7e5e56942508591085fd45dea277d3/tests/hooks.test.js)。

**[分析判断]** 这是宿主适配的正确性和低暴露改进，不改变 Ponytail 的模式语义。误判会让用户看到错误的 Claude 专用设置建议；在某些环境下，未定义的 Copilot 数据目录还会使 hook 直接失败。它不是权限边界的替代品，但能避免把宿主专属输出和路径信息注入错误的环境。

**MAGA 对照与动作：**

- 对照文件是 [`plugins/maga/hooks/ponytail-runtime.js`](../plugins/maga/hooks/ponytail-runtime.js)；MAGA 的 Codex 数据目录和 namespaced 配置仍是本地有意适配，不能整体替换成上游文件。
- 应保留上游的路径判定与 `getClaudeDir()` 回退思路，并继续让 `PLUGIN_DATA` 优先决定 Codex 状态目录。
- 不能只改 Ponytail runtime 而留下其他 hook 的旧宿主判定。MAGA 的 [`humanization-context.js`](../plugins/maga/hooks/humanization-context.js) 也根据 `COPILOT_PLUGIN_DATA` 判定宿主；若支持 VS Code Copilot，应让相关 hooks 的输出协议保持一致，至少做一次 SessionStart/SubagentStart smoke。
- 该变化不需要新增公开 Skill、命令或用户配置项。它是生命周期内部修复。

### 3.3 有条件吸收：移除 `commandWindows`

**[可验证事实]** [`cc37a5d`](https://github.com/DietrichGebert/ponytail/commit/cc37a5d581916920519da9703b41cdeaaf015efa) 修改 [`hooks/claude-codex-hooks.json`](https://github.com/DietrichGebert/ponytail/blob/2ed6c52c9d7e5e56942508591085fd45dea277d3/hooks/claude-codex-hooks.json)，从三个生命周期 hook 删除 `commandWindows`。提交说明给出的原因是 Claude.ai marketplace validator 将其视为不支持的字段；共享的 `command` 使用 `node` 与 `${CLAUDE_PLUGIN_ROOT}`，由目标宿主在 Windows 和 POSIX 上执行。新版 [`tests/hooks-windows.test.js`](https://github.com/DietrichGebert/ponytail/blob/2ed6c52c9d7e5e56942508591085fd45dea277d3/tests/hooks-windows.test.js) 也从检查 PowerShell 字符串改为检查字段不存在及命令不含 POSIX-only 语法。

**[分析判断]** 这首先是清单 schema 兼容修复，不是安全修复。保留未知字段可能导致 marketplace 安装或发布校验失败；直接删除则把 Windows 执行正确性完全交给宿主对 `${CLAUDE_PLUGIN_ROOT}` 的展开和 `node` 的可用性。

**MAGA 对照与决策：**

- MAGA 使用自定义 [`plugins/maga/hooks/hooks.json`](../plugins/maga/hooks/hooks.json)，除 Ponytail 外还包含 Git discipline、Humanization 和 skill labels；当前每个 command 都有 `commandWindows`，对应断言位于 [`test/ponytail-lifecycle.test.js`](../test/ponytail-lifecycle.test.js)。不能机械复制上游三行删除。
- 若 MAGA 要通过同一 marketplace schema，应把**全部**自定义 hook 的 `commandWindows` 一并移除，并把测试改为验证共享 `command` 在 Windows 上可执行；只删 Ponytail 条目会留下同样的 validator 失败。
- 在做该改动前，最少需要一次目标 Codex/Windows hook smoke：确认插件根路径含空格或常见 Windows 路径时，`${CLAUDE_PLUGIN_ROOT}` 仍被正确展开，Node 命令能启动每个脚本。若目标宿主仍依赖 `commandWindows`，保留它是 MAGA 的明确宿主适配，不应为了追随上游而破坏可运行性。
- 因此本审计把它标为“有条件吸收”，而不是当前无条件同步。验收边界应是“目标发布校验通过且 Windows 生命周期仍运行”，不是单纯 diff 与上游相同。

### 3.4 不应同步：Grok Build 打包

**[可验证事实]** [`2ed6c52`](https://github.com/DietrichGebert/ponytail/commit/2ed6c52c9d7e5e56942508591085fd45dea277d3) 新增根 [`plugin.json`](https://github.com/DietrichGebert/ponytail/blob/2ed6c52c9d7e5e56942508591085fd45dea277d3/plugin.json)、[`.grok-plugin/marketplace.json`](https://github.com/DietrichGebert/ponytail/blob/2ed6c52c9d7e5e56942508591085fd45dea277d3/.grok-plugin/marketplace.json) 和 [`tests/grok-plugin.test.js`](https://github.com/DietrichGebert/ponytail/blob/2ed6c52c9d7e5e56942508591085fd45dea277d3/tests/grok-plugin.test.js)，并在 README 与 [`docs/agent-portability.md`](https://github.com/DietrichGebert/ponytail/blob/2ed6c52c9d7e5e56942508591085fd45dea277d3/docs/agent-portability.md) 增加 Grok 安装说明。提交的后续修订明确删除了 Grok MCP wiring 和静态 plugin index，改为复用共享 hook map；这说明上游自身也把未随 Git 安装的 MCP 依赖视为不可接受的额外表面。

**[分析判断]** MAGA 当前公开产品是 Codex 插件，`plugins/maga/.codex-plugin/plugin.json`、安装器和项目文档没有 Grok 交付边界。加入 Grok 清单会扩大安装、测试、文档、支持和生命周期契约，不能由“上游新增一个适配器”自动推出产品需求。

**决策：** 不同步 Grok 根清单、marketplace 清单、README 入口或 MCP。若未来明确支持 Grok，应另开一个产品决策，沿用上游最终的“共享 hooks + 原生 skills、无未安装 MCP”边界，并为 MAGA 自己的 Git/Humanization hooks 设计宿主输出协议。

### 3.5 版本与 provenance

**[可验证事实]** `0a4dd63` 只把 Ponytail 包版本从 4.8.4 升至 4.9.0；它不等于 MAGA 已经拥有全部 4.9.0 行为。

**[建议]** 在实际吸收某个行为并完成定向验证后，再原子更新：

- [`plugins/maga/THIRD_PARTY_NOTICES.md`](../plugins/maga/THIRD_PARTY_NOTICES.md) 的 Ponytail reference commit；
- [`plugins/maga/skill-catalog.json`](../plugins/maga/skill-catalog.json) 中对应上游 SHA；
- README 或 playbook 中对固定版本的说明。

如果只吸收一个 bugfix 而保留 MAGA 的本地适配，记录“上游来源 + 本地差异”即可，不要声称 MAGA 是完整 Ponytail 4.9.0 vendor。

## 4. Humanization

### 4.1 上游提交清单

比较 API 返回两个提交：

1. [`ffe1f69`](https://github.com/thevenomsnake/humanization/commit/ffe1f6923078fd6ec0236a6b98968642e932c7c7) `research: audit blader humanizer`：只新增 [`research/blader-humanizer.md`](https://github.com/thevenomsnake/humanization/blob/ffe1f6923078fd6ec0236a6b98968642e932c7c7/research/blader-humanizer.md)，没有修改运行时 Skill 或 checker。
2. [`c38b5b6`](https://github.com/thevenomsnake/humanization/commit/c38b5b6d0878ee06b899213d4003e694cece5e0c) `feat: add task-scoped voice calibration`：修改 `humanization/SKILL.md`、`humanization/references/core.md`，并同步 README、六份语言文档和 CHANGELOG。

上游该提交没有改 `humanization/VERSION`，所以 Humanization 仍是 3.0.0；这是规则增量，不是一次新的版本号发布。

### 4.2 应吸收：任务内 `author_sample` 校准

**[可验证事实]** 新版 [`humanization/SKILL.md`](https://github.com/thevenomsnake/humanization/blob/c38b5b6d0878ee06b899213d4003e694cece5e0c/humanization/SKILL.md) 将 `author_sample` 定义为可选输入：只有用户明确指定样本，才为当前任务校准表达；新版 [`humanization/references/core.md`](https://github.com/thevenomsnake/humanization/blob/c38b5b6d0878ee06b899213d4003e694cece5e0c/humanization/references/core.md) 进一步规定：

- 样本是当前任务的表达证据，不是身份资料、事实来源或永久作者画像；不得推断身份、人格、经历、能力或 AI 使用，也不得保存或跨任务复用；
- 先排除直接引语、标题、专名、品牌词、批准术语、代码和嵌入示例，再观察句长、段落、词汇密度、正式程度、人称、标点、重复、转场、不确定性和明确声明的习惯；
- 单次出现、样本过短、多人混合、归属不清、内部冲突或不适合当前 surface 的内容是弱证据；跨 locale 最多借鉴兼容的正式程度和节奏，不迁移词汇、句法、标点、代词或敬语；
- 事实、来源、能力、隐私、CTA、目标 locale、组件职责、无障碍和运行时结构始终优先；样本不能提供新事实、经历、名称、观点或承诺，也不应复制样本错误。

**[分析判断]** 这项更新同时提升了表达质量与隐私边界：它允许用户要“像这段文字一样写”，但阻止模型把文本样本变成未经授权的作者画像或事实来源。它不改变 Humanization 的自动触发边界，也不授权把聊天输出自动改稿。

**MAGA 对照与动作：**

- [`plugins/maga/skills/humanization/SKILL.md`](../plugins/maga/skills/humanization/SKILL.md) 与 [`references/core.md`](../plugins/maga/skills/humanization/references/core.md) 已同步该规则；自动触发边界仍由 MAGA 本地 hook 约束。
- MAGA 的本地自动路由由 [`plugins/maga/hooks/humanization-context.js`](../plugins/maga/hooks/humanization-context.js) 约束为“写入或编辑本地文件”；同步时必须保留这个更窄边界。`author_sample` 只能在当前任务显式提供时启用，不得因为发现一段可读文本就自动提取样本。
- 不需要新增永久配置文件、作者 profile、跨任务缓存或用户必须学习的命令。若 Project Lead 传递样本，应把它作为当前任务上下文，并在交付后丢弃。
- 语言和格式模块仍按需加载；不要把作者样本规则复制到六个 locale，避免把某一种语言的语序、敬语或标点禁令错误提升为全局规则。

### 4.3 不应同步：研究材料和上游示例的整段复制

**[可验证事实]** `ffe1f69` 只增加研究文档，不增加 Humanization 执行行为。研究提交可以作为上游方法的 provenance 线索，但不是 MAGA 运行时依赖。

**[分析判断]** 将整份 `research/blader-humanizer.md`、上游 pattern 示例或外部项目原文复制进 MAGA 会扩大上下文、许可证和归属维护面，也会把英文 pattern 误当成六 locale 的通用规则。MAGA 已有 `core + locale + format` 分层与结构检查；应吸收可验证的安全原则，独立重写为本地规则，不复制整套英文规则目录。

## 5. 已完成的最小适配

下面是本次已完成的适配与保留事项：

1. **已同步 Copilot fallback。** Ponytail runtime 增加 VS Code Copilot 路径识别和状态目录回退，并有 path-shape smoke；MAGA 自定义 hook 的 `commandWindows` 仍保留，等待目标 validator/宿主契约明确后再单独决定。
2. **已提交 Humanization `author_sample` 规则。** 它保持显式 opt-in、任务范围、无画像、无事实迁移和 locale/结构优先级，不增加样本持久化。
3. **已更新锁定 SHA。** Ponytail、Humanization 和 Matt catalog、Third-Party Notices 与公开 README 已指向本次审计对象。
4. **不引入 Grok 适配或 Humanization 研究全文。** 两者超出当前 MAGA Codex 交付边界。

## 来源索引

- Ponytail compare：[`16f2980...2ed6c52`](https://github.com/DietrichGebert/ponytail/compare/16f29800fd2681bdf24f3eb4ccffe38be3baec6b...2ed6c52c9d7e5e56942508591085fd45dea277d3)
- Ponytail runtime：[`hooks/ponytail-runtime.js@2ed6c52`](https://github.com/DietrichGebert/ponytail/blob/2ed6c52c9d7e5e56942508591085fd45dea277d3/hooks/ponytail-runtime.js)
- Ponytail hook schema：[`hooks/claude-codex-hooks.json@2ed6c52`](https://github.com/DietrichGebert/ponytail/blob/2ed6c52c9d7e5e56942508591085fd45dea277d3/hooks/claude-codex-hooks.json)
- Ponytail Grok adapter：[`plugin.json@2ed6c52`](https://github.com/DietrichGebert/ponytail/blob/2ed6c52c9d7e5e56942508591085fd45dea277d3/plugin.json)
- Humanization compare：[`d3b8f37...c38b5b6`](https://github.com/thevenomsnake/humanization/compare/d3b8f3791fee58c030aa52539296ad361654f1c7...c38b5b6d0878ee06b899213d4003e694cece5e0c)
- Humanization Skill：[`humanization/SKILL.md@c38b5b6`](https://github.com/thevenomsnake/humanization/blob/c38b5b6d0878ee06b899213d4003e694cece5e0c/humanization/SKILL.md)
- Humanization core：[`humanization/references/core.md@c38b5b6`](https://github.com/thevenomsnake/humanization/blob/c38b5b6d0878ee06b899213d4003e694cece5e0c/humanization/references/core.md)
- Humanization research-only commit：[`research/blader-humanizer.md@ffe1f69`](https://github.com/thevenomsnake/humanization/blob/ffe1f6923078fd6ec0236a6b98968642e932c7c7/research/blader-humanizer.md)
- Matt compare：[`8b36d4f...5b15a47`](https://github.com/mattpocock/skills/compare/8b36d4fb2635b3c21998dcd8144439c9e5ba7302...5b15a47f2d7150f545fbcacbfe381787fc0230dc)
- Matt diagnosis redaction：[`efce423`](https://github.com/mattpocock/skills/commit/efce423018fc6468a3239621f1c1bcaacc723801)
- Matt wait-what context map：[`d6cd26f`](https://github.com/mattpocock/skills/commit/d6cd26f7f245e67ea7d0554a2fe468cd9def6e6f)
