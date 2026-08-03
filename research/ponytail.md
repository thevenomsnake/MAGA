# Ponytail：约束编码代理过度工程倾向的决策规则

> 研究对象：[DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail)
> 固定源码快照：[commit `16f2980`](https://github.com/DietrichGebert/ponytail/commit/16f29800fd2681bdf24f3eb4ccffe38be3baec6b)
> 核对日期：2026-08-01
> 证据范围：官方 GitHub 仓库中的源码、skills、benchmark harness、结果说明和 release 元数据。
>
> 历史边界：文中的“当前本地安装”特指 2026-08-01 的核对环境，当时只有六个独立 Skills。Kann 0.6.0 后的产品状态与用法见[使用手册](../playbooks/matt-skills-and-ponytail-guide.md)，不要把下面的历史安装结论当成现状。

## 证据标记

本文严格区分三类内容：

- **官方自述**：项目作者对定位、效果或原因的陈述。它是理解设计意图的一手来源，但不自动等于独立验证结论。
- **可验证事实**：可以直接从固定 commit 的文件、Git 元数据或公开代码结构中核对的事实。
- **分析判断**：基于上述材料作出的解释、适用性判断和方法论提炼，不归因于项目作者。

Benchmark 的原始运行工作区和 eval 输出被 `.gitignore` 排除，仓库提交的是 harness 与结果报告，不是逐次运行的原始产物。因此，本文把具体效果数字称为**官方报告结果**；可以审计其方法和复现代码，但没有从仓库内原始数据独立重算这些数字。

来源：[`.gitignore`](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/.gitignore)、[agentic harness](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/benchmarks/agentic/run.py)。

## 版本与本地核对

### 可验证事实

- 共核对到 6 个本地 skills：`ponytail`、`ponytail-review`、`ponytail-audit`、`ponytail-debt`、`ponytail-gain`、`ponytail-help`。
- 逐个计算本地文件 Git blob SHA，并与官方 commit `16f2980` 对应文件比较，6/6 完全一致。
- 核对时 GitHub 最新正式 release 是 [v4.8.4](https://github.com/DietrichGebert/ponytail/releases/tag/v4.8.4)，发布于 2026-06-29，tag 指向 commit `bc9ee94`。
- 本次固定的 `16f2980` 提交于 2026-07-15，比 v4.8.4 tag 多 53 个 commit；其 `package.json` 版本字段仍是 `4.8.4`。
- 6 个 skills 中，`ponytail-review`、`ponytail-audit`、`ponytail-debt`、`ponytail-gain` 与 v4.8.4 tag 相同；`ponytail` 和 `ponytail-help` 已在 release 后修改。
- `ponytail` 的 release 后修改收紧了 `ponytail:` 注释规则，只要求给确实切了能力上限的简化加注释；`ponytail-help` 补全了 audit、debt 及 OpenCode 六个命令的说明。

来源：[固定 commit](https://github.com/DietrichGebert/ponytail/commit/16f29800fd2681bdf24f3eb4ccffe38be3baec6b)、[`package.json`](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/package.json)、[v4.8.4 release](https://github.com/DietrichGebert/ponytail/releases/tag/v4.8.4)、[v4.8.4 到固定 commit 的比较](https://github.com/DietrichGebert/ponytail/compare/v4.8.4...16f29800fd2681bdf24f3eb4ccffe38be3baec6b)。

### 分析判断

本地安装内容应称为“官方 commit `16f2980` 的 skill 快照”，不能称为“v4.8.4 release 原样内容”。`package.json` 没有随 main 上 release 后的改动升版，使版本号不足以唯一标识这 6 个文件；研究和复现时应固定 commit，而不是只写 `4.8.4`。

## 项目是什么

### 官方自述

项目将 Ponytail 定位为“lazy senior developer mode”：让编码代理优先质疑需求是否需要存在，依次寻找项目已有实现、标准库、平台原生能力和已安装依赖，最后才写最少的新代码。README 的口号是“最好的代码是从未写下的代码”。

来源：[README](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/README.md)、[主 skill](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/skills/ponytail/SKILL.md)。

### 可验证事实

Ponytail 不是一个业务代码框架或静态分析器。固定快照包含三类构件：

1. **声明式规则**：`SKILL.md`、`AGENTS.md` 和各宿主规则文件，以自然语言定义决策顺序、强度和边界。
2. **宿主适配与 hooks**：Node.js 脚本保存模式状态、构造规则文本，并按宿主支持的生命周期注入上下文。
3. **辅助 skills 与 benchmark**：提供复杂度 review、全库 audit、显式债务索引、指标卡、帮助，以及可复现的实验 harness。

skills 自身没有 AST、编译器或确定性重构逻辑。它们指示宿主模型调用搜索和编辑工具，实际判断仍由模型完成。只安装 6 个 `SKILL.md`，不代表 hooks 已经安装或受信任启用。

来源：[仓库树](https://github.com/DietrichGebert/ponytail/tree/16f29800fd2681bdf24f3eb4ccffe38be3baec6b)、[`AGENTS.md`](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/AGENTS.md)、[hooks 配置](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/hooks/claude-codex-hooks.json)。

### 分析判断

Ponytail 的核心产品不是某段算法，而是一个**方案选择策略**。它试图改变编码代理的默认动作：从“收到功能就生成结构”改成“先证明新增结构确有必要”。这使它更接近工程决策 policy，而不是实现工具。

## 核心机制

### 决策梯

#### 官方自述

主 skill 要求代理理解任务和真实调用流之后，停在第一个可行层级：

1. 需求是否需要存在；
2. 项目中是否已有可复用 helper、类型或模式；
3. 标准库是否覆盖；
4. 平台原生能力是否覆盖；
5. 已安装依赖是否覆盖；
6. 是否可以清晰地用一行实现；
7. 最后才写最少的新代码。

它同时要求先追踪真实流程。修 bug 时，应搜索待修改函数的所有调用方，把修复放到共享根因，而不是只修报告中出现的路径。

来源：[主 skill](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/skills/ponytail/SKILL.md)。

#### 分析判断

决策梯的价值不在于“少写”三个字，而在于**检索顺序**。生成新代码对模型很容易，查找并确认现有能力反而需要主动工具调用。把复用、标准库和原生能力放在创造之前，能纠正“生成优先”的默认偏差。

“一行实现”位于后段也很关键。如果把它提前成最高目标，会诱导代理删掉必要 guard；Ponytail 的规则文本明确试图阻止这种代码高尔夫式最小化。

### 不可削减边界与最小检查

#### 官方自述

主 skill 明确禁止以简化为由删除：

- 信任边界输入校验；
- 防止数据丢失的错误处理；
- 安全措施；
- 基本无障碍要求；
- 用户明确要求的内容；
- 真实硬件所需的校准能力。

非平凡分支、循环、解析器、资金或安全逻辑应留下一个最小可运行检查；平凡一行逻辑不强制测试。确实切了能力上限的有意简化，应通过 `ponytail:` 注释写明上限和升级路径。

来源：[主 skill](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/skills/ponytail/SKILL.md)。

#### 分析判断

Ponytail 的有效定义不是“LOC 最小”，而是“在必要约束和一个风险匹配检查仍成立时，拥有成本最小”。如果需求文本遗漏了真实产品约束，代理仍可能错误地把它判为不必要；skill 不能替代需求澄清和领域判断。

### 强度等级

#### 可验证事实

- `lite`：实现用户要求，同时用一句话指出更简单替代方案，由用户决定。
- `full`：默认等级，执行完整决策梯。
- `ultra`：更积极地删除和挑战需求，仍受不可削减边界约束。
- `off`：运行时支持关闭；它不是主 skill 表格中的构建强度。

来源：[主 skill](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/skills/ponytail/SKILL.md)、[模式配置源码](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/hooks/ponytail-config.js)。

#### 分析判断

`lite` 适合需求边界已经较强、团队仍要保留人工选择权的场景；`full` 适合常规编码；`ultra` 更适合明确的去复杂度任务。把 `ultra` 默认用于合规、迁移、并发、资金或不可逆操作，会让“挑战范围”与风险约束发生不必要冲突。

## 运行时如何保持规则生效

### 可验证事实

Claude Code/Codex 的 hook 配置包含：

- `SessionStart`：在 startup、resume、clear、compact 时运行 activation hook，写入模式状态并注入规则；
- `SubagentStart`：给子代理注入同一模式规则；
- `UserPromptSubmit`：识别模式切换、默认模式设置和关闭命令。

子代理注入可以通过正则按 `agent_type` 限定。未设置 matcher 时默认注入全部子代理；无效正则或无法解析类型时选择继续注入。OpenCode 适配器在每次 system prompt transform 时追加规则；Qoder 因没有 `SessionStart`，在每次用户提示时注入。不同宿主的重注入频率并不相同。

模式使用宿主配置目录中的小型状态文件持久化。规则正文仍从主 `SKILL.md` 构造，并按当前强度过滤；读取失败时有一份内置 fallback 文本。

来源：[hooks 配置](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/hooks/claude-codex-hooks.json)、[activation hook](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/hooks/ponytail-activate.js)、[模式追踪](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/hooks/ponytail-mode-tracker.js)、[规则构造](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/hooks/ponytail-instructions.js)、[子代理注入](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/hooks/ponytail-subagent.js)、[OpenCode 适配器](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/.opencode/plugins/ponytail.mjs)。

### 官方自述

主 skill 声明模式应在每个响应持续有效，不应随会话漂移。README 表示完整插件会自动激活模式，并把规则带入子代理。

### 分析判断

“每个响应持续有效”是给模型的行为指令，不是所有宿主都在每一轮物理重发全文。源码能证明的是各适配器在其事件边界注入。

运行时解决的是**过程 policy 的恢复**：新会话、压缩恢复和子代理不必依靠开场提示仍被模型记住。它不保存项目事实、需求决策或任务进度。

## 六个 skills 的职责和边界

| Skill | 可验证功能 | 官方边界 | 分析判断 |
| --- | --- | --- | --- |
| [`ponytail`](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/skills/ponytail/SKILL.md) | 持续的实现决策规则，含三档强度、不可削减边界和输出要求 | 用于编码、修改、修复、review 和设计；不用于一般知识、写作、翻译或总结 | 适合作为执行 policy，不是需求、架构或安全规范的替代品 |
| [`ponytail-review`](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/skills/ponytail-review/SKILL.md) | 检查当前 diff 的 delete、stdlib、native、YAGNI、shrink 机会，并估算可减少行数 | 只审过度工程；不审正确性、安全和性能；只报告不修改 | 是 LLM 专项提示，不是确定性扫描器；行数估算需要人工核对 |
| [`ponytail-audit`](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/skills/ponytail-audit/SKILL.md) | 把同一复杂度检查扩展到全仓库并按削减规模排序 | 只读、一次性；不处理正确性、安全和性能 | 适合有明确简化目标的遗留库，不宜成为每个窄改动的默认门禁 |
| [`ponytail-debt`](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/skills/ponytail-debt/SKILL.md) | 搜索 `ponytail:` 注释，提取能力上限和升级触发，并标记 `no-trigger` | 默认只读；只有用户要求才持久化台账 | 只能发现遵守标记约定的有意简化，不能发现所有技术债 |
| [`ponytail-gain`](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/skills/ponytail-gain/SKILL.md) | 显示固定的 5 任务、3 模型单轮 benchmark 指标卡 | 明确禁止把指标计算成当前仓库节省；一次性、只读 | 卡片口径已落后于同 commit 的 benchmark 说明，详见下文 |
| [`ponytail-help`](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/skills/ponytail-help/SKILL.md) | 展示等级、命令、配置、关闭和更新方式 | 一次性，不改变模式或文件 | 是操作索引；宿主支持范围应按固定 commit 阅读，不能假定永久有效 |

## Benchmark：方法、结果与证据边界

### 旧单轮生成 benchmark

#### 可验证事实

固定 commit 的 benchmark 文档描述了：5 个日常任务、3 个 Claude 模型、3 个实验臂、每格 10 次并报告中位数。LOC 来自回答中的代码块；token、成本和延迟来自 API。邮件、debounce、CSV 会执行代码检查，React countdown 与 FastAPI rate-limit 只做结构性正则检查。

来源：[benchmark README](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/benchmarks/README.md)、[correctness scorer](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/benchmarks/correctness.js)。

#### 官方报告结果

- 代码减少 80% 到 94%；
- Claude 成本复验后减少 42% 到 75%；
- Claude 延迟约快 3.1 到 5.8 倍。

项目自己的 README 已明确承认：无 skill 基线会输出解释和多个方案，旧 LOC 统计混入对话内容，因此 80% 到 94% 被聊天型基线放大，不应作为真实编码代理的一般收益。

#### 分析判断

该实验可以支持“详细 policy 会显著改变这些模型在小型生成题上的输出”，但不能支持“真实项目普遍减少 80% 到 94%”或“多轮代理一定更便宜”。结构性 scorer 也不足以证明对应前后端实现可运行。

### Agentic benchmark 的方法

#### 可验证事实

当前 harness 使用 headless Claude Code，在隔离工作区中让代理修改代码。它通过 `--setting-sources project,local` 排除全局插件，再只为目标实验臂传入 `--plugin-dir`；baseline 不加载 Ponytail。每个 cell 使用新鲜仓库副本和独立进程。

功能层包含 12 个公开 FastAPI + React 仓库任务，以 `git diff` 新增行计量。代理被禁用 Bash 和 MCP 浏览器，只写代码，不运行服务器、数据库或浏览器。安全层把生成函数直接放到确定性对抗输入下执行。

当前 harness 文档列出 7 个 safety 任务，并另外提供：

- 确定性 correct 和 safe gate；
- source LOC 与文件数；
- 一个 LLM over-engineering judge；
- 一个 LLM completeness judge；
- scorer 与 judge 的 self-test。

来源：[agentic README](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/benchmarks/agentic/README.md)、[run harness](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/benchmarks/agentic/run.py)、[任务定义](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/benchmarks/agentic/tasks.py)、[over-engineering judge](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/benchmarks/agentic/judge.py)、[completeness judge](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/benchmarks/agentic/complete.py)。

#### 官方报告结果

2026-06-18 的主结果使用 Haiku 4.5、12 个功能任务、4 个实验臂、每格 4 次。Ponytail 相对无 skill 基线的功能层平均为：

- 新增 LOC 减少 54%；
- tokens 减少 22%；
- 成本减少 20%；
- 时间减少 27%。

任务差异很大：日期输入减少 94%，颜色输入减少 92%，文件输入减少 62%；本来已很小的后端 CRUD 接近持平。报告称 Ponytail 在 12 项的均值上没有比基线写更多代码。

同一结果文件实际报告的是 6 个 surgical 任务，其中 5 个为安全任务，每臂各 20 次安全观测。Ponytail、baseline、caveman 均为 20/20；`yagni-oneliner` 为 19/20，曾漏掉一次路径穿越 guard。

来源：[2026-06-18 结果报告](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/benchmarks/results/2026-06-18-agentic.md)。

#### 分析判断

这是比单轮生成更合适的对照：使用同一代理产品、固定代码基线、隔离上下文并测量最终 diff。它最有力地支持一个条件性结论：**当任务有明显的原生能力替代过度实现时，Ponytail 能显著改变实现选择；当代码不可再约简时，实验臂会收敛。**

它仍有明显限制：

- 主结果只有一个模型、一个公开模板仓库和 `n=4`；
- 功能任务没有运行应用或浏览器；
- 主结果文件没有报告 completeness judge 分数，不能用当前 harness 后来具备的能力倒推当时 12 个功能实现均已完整；
- 4/192 个功能 run 遇到进程超时，LOC 被保留但成本和时间缺失；每个 task/arm 至少保留 2/4 次；
- “100% safe”只指这 5 个安全探针中的 20/20，不是产品级安全证明；
- 原始 run 工作区没有提交，本文无法独立重算均值和方差。

### 根因修复与项目内复用实验

#### 官方报告结果

项目后来用一个共享扣款函数的种子场景测试“先搜索所有调用方，再修共享根因”。在 Sonnet 4.6 和 Opus 4.8 上，baseline 各为 1/6，加入操作化规则的 Ponytail 为 6/6；Haiku baseline 为 0/6，Ponytail 结果仍接近噪声。

同一报告的两个“复用项目已有 helper”探针中，baseline 与 Ponytail 都是 1.0，未复现重复实现问题。官方报告因此将该新增 rung 的行为收益标为未证明，而不是成功。

来源：[comprehension & reuse 结果](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/benchmarks/results/2026-06-22-issue-245-217-comprehension.md)。

#### 分析判断

这里更有价值的不是 6/6 本身，而是规则形式：抽象口号“理解全局”没有改变行为，具体动作“搜索所有调用方并修共享函数”才改变较强模型结果。它说明 AI 协作规则应写成可执行动作，而不是价值观标语。样本是刻意构造的单一故障，不应外推为通用 root-cause 成功率。

### 成本与模型迁移

#### 官方报告结果

单轮成本复验报告：

- Claude Haiku、Sonnet、Opus 上便宜 42.3% 到 74.5%，使用每格 30 次的池化数据；
- OpenAI `gpt-4.1-mini` 便宜 39.6%；
- OpenAI `gpt-5.4-mini` 贵 26.2%，`gpt-5.5` 贵 38.7%，后者也略慢；
- Gemini 运行因配额问题未形成可用结果；
- 约 22/1350 个 Claude 响应为空并被排除。

本地 `llama3.2` 3.2B 量化模型实验只有 `n=5`，Ponytail LOC 中位数比 baseline 多 26%，另一组 `n=3` 又少 17%，方向随样本翻转；时间约慢 10% 到 15%。项目据此报告该模型上没有稳定 LOC 收益。

来源：[成本复验](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/benchmarks/results/2026-06-17-cost-verification.md)、[本地模型结果](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/benchmarks/results/2026-06-15-llama3.2-local.md)。

#### 分析判断

更短输出不保证更低成本。持续注入的规则增加输入，模型还可能用更多 reasoning token 执行决策梯。收益取决于模型遵循长指令的能力、基线本身是否简洁、任务是否允许原生替代，以及宿主是否重复注入。任何跨模型“必然省钱”说法都超出了证据。

## `ponytail-gain` 口径是否仍有冲突

### 可验证事实

固定 commit 的 `ponytail-gain` 指标卡写的是：

- LOC 减少 80% 到 94%；
- 成本减少 47% 到 77%；
- 速度快 3 到 6 倍；
- 数据来自 5 个任务、3 个模型的 benchmark 中位数；
- 明确禁止把这组数字说成当前仓库的节省。

同一 commit 的其他官方材料已经改为：

- README 主标题采用 agentic 均值：LOC 减少约 54%、成本约 20%、时间约 27%；
- README 和 benchmark README 把 80% 到 94% 标记为旧单轮结果，并承认其被聊天型基线放大；
- 成本复验把 Claude 单轮范围从 47% 到 77% 修正为 42% 到 75%；
- agentic 报告只在特定过度实现任务上保留 60% 到 94% 的任务级范围。

来源：[`ponytail-gain`](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/skills/ponytail-gain/SKILL.md)、[README](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/README.md)、[benchmark README](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/benchmarks/README.md)、[成本复验](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/benchmarks/results/2026-06-17-cost-verification.md)。

### 分析判断

冲突仍然存在，而且分两层：

1. **解释口径冲突**：80% 到 94% 仍是一次真实旧实验的报告值，但上游已承认它不是公平 agentic 基线。`ponytail-gain` 的“不是当前仓库收益”边界不足以告诉用户该数字已被官方降级为历史单轮结果。
2. **数值冲突**：成本卡仍写 47% 到 77%，同 commit 的成本复验和 benchmark README 已修正为 42% 到 75%。这不是单纯场景差异，而是未同步的旧数字。

速度 3 到 6 倍与 Claude 单轮复验的 3.1 到 5.8 倍大致一致，但仍不能代表真实多轮 session。公共文档不应直接复述 `ponytail-gain` 卡片；应优先引用 agentic 条件性结果，并同时保留模型和任务边界。

## 实际价值与适用边界

### 官方自述

项目主张 Ponytail 适用于编码、修复、review、设计和依赖选择；不用于非编码问答。它不允许为了最短代码牺牲校验、安全、错误处理和无障碍。用户坚持完整方案时，代理应执行而不是反复争辩。

### 分析判断：价值最高的场景

- 开放式功能容易诱发组件、框架、配置、wrapper 或单实现抽象；
- 项目有成熟 helper、标准库或平台原生能力，但代理需要被明确要求先检索；
- 团队希望减少生成代码的长期拥有成本；
- 实现完成后需要一次只关注复杂度的专项 review；
- 团队接受有上限的临时简化，并愿意记录升级触发器；
- 多会话执行需要相同的实现 policy 在新会话和子代理中恢复。

### 分析判断：不适合直接套用的场景

- 非编码任务；
- 需求明确要求完整框架、教学展开、兼容层或稳定扩展接口；
- 权限、安全、隐私、资金、迁移、并发和不可逆操作，需要风险驱动设计；
- 原生控件或标准库不满足真实产品体验、国际化、兼容性、性能或合规约束；
- 硬件、实时和高可靠系统需要冗余、校准或确定性保证；
- 模型不能稳定执行多步规则，注入只增加成本；
- 已经精简的代码仍被反复 audit，流程成本会超过收益。

真正的判断问题不是“还能删几行”，而是“删掉的是无必要拥有成本，还是未写进提示但真实存在的约束”。Ponytail 能提醒代理询问前者，不能自动发现后者。

## 与注意力衰减、多会话协作的关系

### 可验证事实

- 规则正文存放在仓库文件中，不依赖某个聊天记录；
- 完整插件在启动、恢复、清空、压缩和子代理边界重新注入规则；部分宿主每轮注入；
- 模式状态外置到小型文件，因此会话重启后可以恢复默认 policy；
- 子代理可以按类型选择是否接收规则；
- 这些文件不记录项目需求、任务状态、决策或交接内容。

### 分析判断

从注意力衰减角度看，Ponytail 处理的是**工程 policy 衰减**：会话变长或切换代理后，“先复用、不要虚构抽象、不能删安全 guard”容易被局部代码和工具输出淹没，生命周期注入把这些不变量重新放回可用上下文。

它不处理**项目事实衰减**。Skill 能让新会话获得相同判断顺序，却不能让新会话知道当前目标、已作决策、依赖状态和验收证据。多会话项目仍需把这些内容写入任务契约、版本化文档、提交和交接记录。

Ponytail 可能间接降低注意力压力：更少文件、依赖和抽象意味着后续会话要加载的代码表面积更小。但该因果链没有被现有 benchmark 直接测量，应视为待验证假设，而不是官方效果。

重复注入也有反作用：规则本身占用上下文和推理预算。合理做法是让短小、稳定的 policy 常驻，只给相关编码会话和子代理加载；大型手册和项目历史按需检索。

## 从 Ponytail 独立提炼出的可复用原则

以下均为本文分析判断，不是 Ponytail 官方承诺：

1. **先理解，再最小化。** 最小 diff 若落在错误层级，只会制造第二个 bug。
2. **把价值观写成有序动作。** “保持简单”不够；“搜索项目已有实现，再查标准库，再查平台能力”可以执行和审计。
3. **新增复杂度需要证明。** AI 生成代码便宜，不等于团队长期拥有代码便宜。
4. **最小实现和最小检查成对出现。** 检查范围按本次风险决定，不自动扩张为测试矩阵。
5. **有意债务同时写能力上限与升级触发器。** 只有 TODO 没有重新评估条件，容易永久化。
6. **复杂度 review 与正确性 review 正交。** 专项 review 的窄边界是优点，不能把它误称为完整质量审查。
7. **跨会话只重载稳定 policy。** 项目事实与状态应由持久协作记录承载。
8. **Benchmark 必须隔离宿主状态。** 全局 plugin、hook、缓存和共享上下文都会污染 baseline。
9. **测量最终工作产物，不测聊天长度。** 还要用正确性、安全或完整性门槛防止“少做”冒充“少过度工程”。
10. **报告任务分布和失败边界。** 峰值、均值、模型、技术栈、重复次数和未完成验证必须一起出现。

## 最终判断

### 可验证事实

Ponytail 将一套最小实现规则打包为多个宿主可加载的 skills 和 hooks，并配有复杂度 review、全库 audit、显式债务索引及公开 benchmark harness。本地 6 个 skills 与官方 commit `16f2980` 完全一致，但该快照不是 v4.8.4 release tag 的原样内容。

### 分析判断

Ponytail 最可靠的价值不是某个固定节省百分比，而是把资深工程师常用的“必要性审查”变成可重复加载的操作顺序。它最适合作为编码执行 policy，帮助代理减少无必要的新增表面积。

它的效力取决于模型是否能遵循多步规则、任务是否存在过度实现空间，以及需求边界是否足够真实。它不能替代需求澄清、领域模型、安全设计、项目记忆或验收。公开介绍时应使用条件性 agentic 结论，不应使用 `ponytail-gain` 的旧指标卡作为普遍承诺。

## 面向不写代码用户的调用体验

本节只讨论 Ponytail 自身的调用体验，不将它与其他 skills 综合，也不据此设计最终产品。目标问题是：一个能描述产品、但不写代码且不愿学习 `/xxx` 命令的用户，能否无感获得 Ponytail 的价值。

### 六个 `SKILL.md` 与完整插件不是同一种安装

#### 可验证事实

固定 commit 的 Codex 插件清单同时声明了 `skills: "./skills/"` 和 `hooks: "./hooks/claude-codex-hooks.json"`，并把自身能力标为 `Instructions` 与 `Lifecycle hooks`。完整插件因此包含两个彼此独立的层次：

1. 六个 `SKILL.md` 提供任务描述、触发语和模型应遵循的规则；
2. hooks 在会话生命周期中注入主规则、记录模式，并把规则带入子代理。

2026-08-01 核对时的本地安装只包含六个 skill 目录，每个目录只有一个 `SKILL.md`；当时的插件缓存、插件配置和运行时环境中没有 Ponytail 插件或 hook 的安装记录。因此，该历史环境安装的是**六个按任务发现的提示能力**，不是官方所说的完整 always-on 插件。

完整插件的 `SessionStart` hook 覆盖 startup、resume、clear 和 compact，默认读取 `full`，写入模式状态并注入主规则；`SubagentStart` 按当前状态向子代理注入相同规则；`UserPromptSubmit` 识别模式切换和关闭。Codex 路径把状态写在插件数据目录，并输出 `PONYTAIL:<MODE>` system message。官方 README 还要求 Codex 用户安装后在 `/hooks` 中审查并信任 hooks，并要求非交互 shell 的 `PATH` 中存在 Node.js；缺少 Node.js 时，skills 仍能使用，但 always-on 激活不会工作。

来源：[Codex 插件清单](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/.codex-plugin/plugin.json)、[hooks 配置](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/hooks/claude-codex-hooks.json)、[activation hook](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/hooks/ponytail-activate.js)、[模式追踪](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/hooks/ponytail-mode-tracker.js)、[运行时状态与输出](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/hooks/ponytail-runtime.js)、[README 安装说明](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/README.md)。

#### 分析判断

当时的六个独立 skills 可以做到“在宿主判断任务匹配时自动加载”，但做不到“无论宿主如何判断，规则在每个会话、压缩恢复和子代理中都持续存在”。`SKILL.md` 内的 `ACTIVE EVERY RESPONSE` 是给模型的指令，不是状态管理机制；没有 hooks 时，不能把它称为持久无感，只能称为**匹配任务时的无命令调用**。

### 不使用 `/xxx` 时，哪些任务仍可自动触发

#### 可验证事实

六个 skill 的 frontmatter 都包含自然语言用途或触发语，而不是只声明斜杠命令：

| Skill | 自然语言可表达的任务 | 是否必须使用命令 |
| --- | --- | --- |
| `ponytail` | 编写、增加、重构、修复、review、设计代码或选择依赖；也列出“最简单方案”“YAGNI”“减少样板”等说法 | 否；描述要求用于任何编码任务 |
| `ponytail-review` | review 当前改动是否过度工程、还能删除什么、能否简化 | 否；`/ponytail-review` 只是列出的一个触发方式 |
| `ponytail-audit` | 全库检查过度工程、寻找可删除内容或膨胀 | 否；但描述中的 `audit this codebase` 本身较宽泛 |
| `ponytail-debt` | 列出刻意推迟的简化、shortcut 或债务台账 | 否 |
| `ponytail-gain` | 询问 Ponytail 节省什么或查看影响指标 | 否 |
| `ponytail-help` | 询问 Ponytail 如何使用、有哪些能力 | 否 |

在采用描述驱动 skill 匹配的 Codex 宿主中，用户只要自然地表达上述任务，宿主就可以选择对应 skill。核对当时的官方 README 把 Codex 显式入口写成 `@ponytail`、`@ponytail-review` 等；Kann 当前面向 Codex 的使用说明统一采用 `$skill-name`。无论宿主采用哪种显式语法，显式入口都只是强制指定能力的专家入口，不是这些 skill 文本所允许的唯一入口。

来源：[主 skill](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/skills/ponytail/SKILL.md)、[`ponytail-review`](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/skills/ponytail-review/SKILL.md)、[`ponytail-audit`](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/skills/ponytail-audit/SKILL.md)、[`ponytail-debt`](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/skills/ponytail-debt/SKILL.md)、[`ponytail-gain`](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/skills/ponytail-gain/SKILL.md)、[`ponytail-help`](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/skills/ponytail-help/SKILL.md)、[README Commands](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/README.md#commands)。

#### 分析判断

自然语言触发对不写代码用户已经足够：他说“这个功能别搞得太复杂”或“看看这次改动有没有多余东西”，不必知道 skill 名称。真正仍需要显式操作的，是**强制选择某个内部处理器**，以及切换 `lite/full/ultra/off`、查询当前模式或持久修改默认模式。这些都是调试和工程治理需求，不是普通产品意图。

自动匹配也不是确定性保证。它取决于宿主是否支持 skills、是否读取 frontmatter，以及调度器是否把用户意图判给正确能力。只复制 skill 文件时，不能把“用户自然语言一定会触发”当作 Ponytail 自身提供的运行时保证。

### 用户是否需要理解等级和五个辅助 skills

#### 可验证事实

完整插件默认每个新会话启用 `full`。`lite`、`full`、`ultra` 改变的是代理挑战需求和执行决策梯的强度；`off` 关闭模式。默认值可由环境变量或配置文件改变，普通会话切换只持续到会话结束。`review` 不是可持久默认等级。

其余五个 skills 都是一次性工具：`review` 只看当前 diff 的复杂度，`audit` 扫描全库，`debt` 收集遵循特定注释约定的有意简化，`gain` 展示固定 benchmark 卡片，`help` 展示操作索引。它们都不是完成日常产品修改的必要前置步骤。

来源：[主 skill 的强度定义](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/skills/ponytail/SKILL.md)、[模式配置](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/hooks/ponytail-config.js)、[`ponytail-help`](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/skills/ponytail-help/SKILL.md)。

#### 分析判断

不写代码的用户不需要理解 `lite/full/ultra`。对这种用户，把 `full` 作为后台默认策略已经能表达“尽量采用最小正确实现”；让用户选择实现强度，等于把内部工程判断重新推回给他。只有当他明确感觉系统删减过多或过少时，才需要用普通语言纠正行为，不必先学习等级名称。

他也不需要知道 `review/audit/debt/gain/help`：

- `review` 和 `audit` 是维护者的复杂度诊断，不是用户验收产品行为的方式；
- `debt` 依赖源码中的 `ponytail:` 注释，对不读源码的用户没有直接操作价值；
- `gain` 是项目宣传数据，不会证明他的项目实际节省了什么，而且固定 commit 中仍有旧口径冲突；
- `help` 主要解释命令体系，反而会把本可隐藏的内部结构暴露给用户。

这些能力可以存在于后台，但“用户看不见 skill 名称”和“系统每次都自动运行全部 skills”不是一回事。尤其全库 audit 不应因为用户不懂代码就默认频繁执行。

### 常驻策略能否真正无感

#### 可验证事实

完整插件可以在不要求用户每轮输入命令的情况下默认启用 `full`，并在会话恢复、上下文压缩和子代理启动时重新注入。模式默认值可以由安装者预先配置。对 Codex，activation hook 不会触发 Claude 专用的 statusline 设置邀请。

它仍会留下可见痕迹：hook 配置提供“Loading ponytail mode...”和“Tracking ponytail mode...”状态消息；Codex hook 输出包含 `PONYTAIL:<MODE>` system message；README 明确说启动和模式切换文本会显示当前模式。主 skill 还要求实现后简短说明跳过了什么、何时再增加，并可能在交付简化版本时质疑复杂需求。

来源：[hooks 配置](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/hooks/claude-codex-hooks.json)、[activation hook](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/hooks/ponytail-activate.js)、[运行时状态与输出](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/hooks/ponytail-runtime.js)、[主 skill 的输出规则](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/skills/ponytail/SKILL.md)、[README](https://github.com/DietrichGebert/ponytail/blob/16f29800fd2681bdf24f3eb4ccffe38be3baec6b/README.md)。

#### 分析判断

“无命令”与“无感知”是两层目标。完整插件基本实现前者，但官方实现仍把模式名、加载状态和工程式的“跳过内容”暴露给直接使用 Codex 的人。它可以对熟悉代理工具的开发者做到低打扰，却不能直接证明面向普通产品构建者的界面已经无感。

如果把 Ponytail 放在后台执行会话，前台只呈现产品变化，这些痕迹可以被上层隐藏；这是宿主编排带来的体验，不是 Ponytail 六个 skills 自己提供的能力。

### 可见干扰与误触发风险

以下是基于固定源码的分析判断，不是官方承认的问题：

1. **宽泛 audit 触发可能错配范围。** `ponytail-audit` 把“audit this codebase”列为触发语，但其边界明确排除正确性、安全和性能。不了解该边界的用户说“全面审计项目”，可能期待的恰好是它不做的内容。
2. **“最小”可能被误读为“少做”。** 主规则会跳过被判断为 speculative 的需求，并允许先交付 lazy version。用户若不能完整表达领域约束，代理可能把未说清的必要行为当成多余复杂度；源码中的安全边界无法补齐模型尚不知道的业务事实。
3. **等级会制造不必要的选择负担。** `lite/full/ultra` 对工程师有调节价值，但名称无法让产品用户预判实际产品行为。尤其 `ultra` 会更积极挑战需求，不适合无条件默认。
4. **辅助输出可能泄漏工程语言。** `stdlib`、`native`、`YAGNI`、diff 行号、依赖数和 `ponytail:` 注释对维护者有用，对不写代码用户通常是噪声。
5. **help 会把自然语言体验重新包装成命令手册。** `ponytail-help` 的主要内容是命令、模式和配置；如果目标是不让用户学习 `/xxx`，它更适合管理员入口。
6. **gain 可能造成错误期待。** 它展示旧单轮 benchmark 卡片。即使声明不是当前仓库收益，不写代码的用户也容易把百分比理解成自己项目的交付承诺。
7. **自动触发仍依赖宿主判断。** 描述写“用于任何编码任务”可以提高主 skill 的覆盖率，也可能与项目自己的完整性、架构或风险策略发生冲突；六个文本文件没有优先级仲裁机制。

### 对 2026-08-01 核对环境的结论

#### 可验证事实

当时的安装能让支持描述匹配的 Codex 在相关任务中发现六个 skills；主 skill 的描述足以覆盖常见编码、修复、重构和依赖选择。当时没有安装或启用官方 hooks，因此没有 Ponytail 自己提供的会话启动激活、压缩后重注入、模式状态持久化或子代理继承。

#### 分析判断

对“不写代码、也不使用 `/xxx`”这一要求，该历史安装的准确评价是：

> **可以无命令地按任务触发，但不能称为持久无感。**

用户不需要学习六个命令，也不需要理解三个强度；默认编码任务可由宿主自动选择主 skill。可是这种效果来自 Codex 的 skill 发现规则，每轮是否加载仍依赖宿主和任务表述。只有安装并信任完整 hooks，才接近官方定义的 always-on；即使如此，模式状态和工程术语仍可能在直接界面中可见。
