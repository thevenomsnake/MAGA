# 面向 MAGA 的轻量测试设计：成熟项目与可吸收机制研究

研究日期：2026-08-12

## 结论先行

不建议把任何一个外部项目整包融合进 MAGA，也不建议新增一个要求用户手动选择测试类型的公开 Skill。

最适合 MAGA 的方案仍然是自己实现一个很小的内部 `validation-design` 方法，但它不必从零发明。最值得吸收的是三组已经被成熟项目验证过的机制：

1. 从 Superpowers `writing-good-tests` 吸收“先说出这条测试能抓住哪一种真实破坏”“预期值不得由被测代码自己算出”“测试真实行为，不测试源码存在或 mock 本身”；
2. 从 Spec Kit 吸收“每个可独立交付的用户故事都要有独立可验证结果”，但保留 MAGA 的风险判断，不采用 Spec Kit 的完整 artifact pipeline，也不把测试一律排到实现之前；
3. 从 Nx、Jest、Vitest、pytest-testmon 和 Bazel 吸收“按改动及依赖关系缩小执行集合”的工具发现策略：项目已经具备相关能力时使用，项目没有时不为了测试而安装和初始化大型基础设施。

Testing Library、Pact 和 MSW 进一步证明了正确的测试 seam：越接近真实消费者行为越有价值；mock 应放在慢、外部或不可控的边界，而不是替换本次真正要验证的代码。

这套结论与用户当前规范一致：**先完成最短可运行纵向切片，再做一次最直接、足以证伪本次行为的验证，然后提交**。工具只帮助缩小验证，不得反过来制造全量回归、测试矩阵或多阶段门禁。

## 一、筛选标准

本研究没有按流行度寻找测试框架，而是问每个候选六件事：

- 它能否把一条产品验收翻译成可观察失败；
- 它能否帮助找到最低成本但可信的测试边界；
- 它是否允许先实现纵向切片，而不是默认强制 TDD；
- 它是否能缩小本次需要运行的测试集合；
- 它是否会引入新的框架、服务、缓存、清单或 CI 仪式；
- 它的机制能否跨技术栈表达，而不要求产品用户理解 unit、integration、E2E 等术语。

适配度分数评价的是“对 MAGA 工作流的适配”，不是项目本身的质量。

## 二、Agent Skills 与工作流

### 1. Superpowers v6.2.0：机制第一名，整包拒绝

- **解决什么**：约束 agent 写出能够真实失败、验证真实行为的测试，并禁止没有新鲜证据就宣称完成。
- **核心机制**：`writing-good-tests` 要求写测试前先回答“哪一种生产代码破坏会让它失败”；expected 必须来自手算字面量或独立 fixture；脚本、Skill 和配置应运行后检查输出、side effect 或 exit code，不能只 grep 源码；trivial forwarding 和供人阅读的 prose 不必测试；mock 只放在慢或外部边界。[固定版本源码](https://github.com/obra/superpowers/blob/v6.2.0/skills/test-driven-development/writing-good-tests.md) · [v6.2.0 release](https://github.com/obra/superpowers/releases/tag/v6.2.0)
- **是否默认 TDD**：是。其 TDD Skill 对 feature、bugfix、refactor 和 behavior change 都要求 test-first，先写代码甚至要求删除重来。[TDD Skill](https://github.com/obra/superpowers/blob/v6.2.0/skills/test-driven-development/SKILL.md)
- **膨胀风险**：高。全套流程还包含强制 worktree、详细 plan、逐任务 subagent、双阶段 review、每次完成前 fresh full verification；这与 MAGA 的“一次风险匹配定向验证”冲突。[README 工作流](https://github.com/obra/superpowers/tree/v6.2.0#the-basic-workflow) · [verification-before-completion](https://github.com/obra/superpowers/blob/v6.2.0/skills/verification-before-completion/SKILL.md)
- **可吸收点**：`name the break`、独立 expected、真实行为优先、mock 必须说明理由、复杂 mock 升级为真实 integration seam、完成陈述必须绑定刚运行的证据。其 mutation check 可压缩成一句内部自问：“如果把关键分支、参数或 side effect 改错，选中的检查会失败吗？”不需要真的再做一次 mutation run。
- **拒绝点**：强制 TDD、删除先写代码、每步 red-green、所有测试重跑、双 review、逐任务 agent 与 full-command fresh gate。
- **许可/版本**：MIT，固定 `v6.2.0`。
- **MAGA 适配度**：机制 `9/10`；整包 `2/10`。

### 2. Matt Pocock Skills v1.2.3：已经融合较早快照，不吸收原版验证节奏

- **解决什么**：把 TDD、实现、诊断和 ticket 拆成可路由 Skills；TDD 强调 public seam、行为命名以及不要测试内部调用。
- **核心机制**：一条测试验证一个可观察行为；测试名表达意图；不测试 private method、实现调用次数或用同一算法计算 expected。[v1.2.3 TDD](https://github.com/mattpocock/skills/blob/v1.2.3/skills/engineering/tdd/SKILL.md) · [Bug feedback loop](https://github.com/mattpocock/skills/blob/v1.2.3/skills/engineering/diagnosing-bugs/SKILL.md)
- **是否默认 TDD**：TDD Skill 在用户要求 test-first、red-green-refactor 或 integration tests 时触发；但原版 `implement` 倾向尽可能 TDD，并要求定期单文件测试、结束时全量测试和 review。[v1.2.3 implement](https://github.com/mattpocock/skills/blob/v1.2.3/skills/engineering/implement/SKILL.md)
- **膨胀风险**：中高。测试怎么写很好，但原版实现节奏会把一次验证扩成多次验证。
- **可吸收点**：public seam、行为命名、独立 expected、一个测试只覆盖一个失败原因。这些 MAGA 已部分融合，应由新的 `validation-design` 调度，而不是改回默认 TDD。
- **拒绝点**：频繁验证、末尾全量回归、默认 code review，以及把 TDD 当成普通实现的默认入口。
- **许可/版本**：MIT；当前研究基线 [v1.2.3 / `6acc160`](https://github.com/mattpocock/skills/releases/tag/v1.2.3)。MAGA 当前融合的是较早的 1.2.2 固定提交 `8b36d4fb2635b3c21998dcd8144439c9e5ba7302`，升级必须单独比较差异，不能把本研究变成静默更新。
- **MAGA 适配度**：方法 `8/10`；原版节奏 `3/10`。

### 3. GitHub Spec Kit v0.16.2：吸收“独立验证”，拒绝完整文档流水线

- **解决什么**：从 specification、plan 到 tasks 和 implementation 建立可追踪的 spec-driven workflow。
- **核心机制**：任务按 user story 分组，每个 story 写 `Independent Test`，以便独立交付和验证；模板明确“测试任务只有在 specification 明确要求时才加入”。[固定版本 tasks template](https://github.com/github/spec-kit/blob/v0.16.2/templates/tasks-template.md) · [v0.16.2 release](https://github.com/github/spec-kit/releases/tag/v0.16.2)
- **是否默认 TDD**：不是全局默认；但一旦要求测试，模板要求测试任务先于实现并先看到失败。
- **膨胀风险**：中高。完整流程需要 constitution、spec、plan、tasks、analyze、implement 等多个 artifact 和 command；对 MAGA 的窄改动过重。[官方 README](https://github.com/github/spec-kit/tree/v0.16.2)
- **可吸收点**：每个纵向切片必须能独立展示“用户现在可以做什么”；Ticket 不按前端、后端、测试层拆开，而按可独立验证的产品行为组织。
- **拒绝点**：完整 `.specify` 目录、command pipeline、每个任务都产生 artifact、测试一旦存在就固定 test-first，以及“只有显式要求才有测试”这一过窄条件。MAGA 还需要让 bug、权限、迁移等高风险行为即使用户没说“测试”也留下最小证据。
- **许可/版本**：MIT，固定 `v0.16.2`。
- **MAGA 适配度**：机制 `7/10`；整包 `3/10`。

### 4. OpenAI Codex Skill Creator 0.147.0：用于测试 Skill 路由，不是产品测试策略

- **解决什么**：定义 Skill 的触发 description、渐进加载、结构校验和真实任务迭代。
- **核心机制**：Skill metadata 是触发边界；`quick_validate.py` 只验证 frontmatter、必需字段和命名；复杂 Skill 才用 fresh agent 做 forward-test，并把原始请求与原始制品交给测试者，不泄露期望答案。相似脚本只抽代表样本。[Codex 0.147.0 Skill Creator](https://github.com/openai/codex/blob/rust-v0.147.0/codex-rs/skills/src/assets/samples/skill-creator/SKILL.md)
- **是否默认 TDD**：否。官方 `skill-creator` 是实现—校验—真实使用—迭代，不是 product code 的 test-first 流程。
- **膨胀风险**：低，但覆盖面也窄。`openai/skills` 已明确 deprecated，当前示例转移到 `openai/plugins`，且每个 Skill 有自己的 license，不存在可整体融合的统一 testing package。[deprecated notice](https://github.com/openai/skills)
- **可吸收点**：MAGA 自身发布时保留一个应触发、一个近似但不应触发的 prompt pair；结构校验只证明文件契约，不能冒充真实语义路由通过。
- **拒绝点**：把 Skill validator 当成产品测试设计；从已 deprecated catalog 继续复制 Skill。
- **许可/版本**：Codex 为 Apache-2.0，固定 [rust-v0.147.0](https://github.com/openai/codex/releases/tag/rust-v0.147.0)；旧 `openai/skills` 没有统一 Skill license，且已 deprecated。
- **MAGA 适配度**：MAGA 自测 `8/10`；用户产品测试 `2/10`。

## 三、按改动选择测试：只做工具发现，不做 MAGA 依赖

这一类工具解决的是“已经知道要跑测试后，如何只运行可能受影响的集合”。它们不能决定产品风险，也不能代替 acceptance。MAGA 应按当前仓库已经安装的技术栈选择，不应主动把它们加入新项目。

| 候选 | 核心机制 | 默认 TDD | 膨胀与盲区 | 可吸收/使用条件 | 许可、版本、适配度 |
| --- | --- | --- | --- | --- | --- |
| [Nx affected](https://nx.dev/docs/features/ci-features/affected) | 用 Git diff 找 changed files，再用 project graph 加上依赖这些项目的 downstream projects，只对集合运行 `test` 等 target；CI 可显式指定 base/head。 | 否 | 需要 Nx workspace 与维护正确的 project graph；一个大 project 内仍会运行该 project 的全部 tests；不适合为单仓窄改动临时初始化 Nx。 | 若仓库已有 Nx，优先 `nx affected -t test --base=<known-good> --head=<commit>`；吸收“改动 + 反向依赖”模型。 | MIT；[23.1.1](https://github.com/nrwl/nx/releases/tag/23.1.1)；工作流 `7/10`，通用安装 `2/10`。 |
| [Jest `--findRelatedTests`](https://jestjs.io/docs/cli#--findrelatedtests-spaceseparatedlistofsourcefiles) | 从给定 source files 找覆盖/依赖相关的 test files；官方说明适合 pre-commit 的最小测试集合。 | 否 | 仅 Jest；静态依赖看不到运行时配置、外部服务和未声明关系。 | 仓库已有 Jest 且改动文件明确时使用；若已知一个更窄 test path 或 name，仍优先直接运行它。 | MIT；[30.4.2](https://github.com/jestjs/jest/releases/tag/v30.4.2)；技术栈 `8/10`。 |
| [Vitest `--changed`](https://vitest.dev/guide/cli.html#changed) | 按未提交改动、commit 或 branch 找 changed files，再运行相关 test files；配置或 `package.json` 改动默认触发全套作为保守 fallback。 | 否 | 仅 Vitest/Vite；不是跨历史运行缓存，第二次仍会重跑相关 tests；依赖图无法证明外部行为。 | 仓库已有 Vitest 时用 `vitest --changed <base>`；吸收“全局配置变化才升级范围”的 fallback 思想。 | MIT；稳定 [v4.1.7](https://github.com/vitest-dev/vitest/releases/tag/v4.1.7)；技术栈 `8/10`。 |
| [pytest-testmon](https://www.testmon.org/) | 首次全量运行用 Coverage.py 收集“每个 test 实际执行了哪些代码”并存入 `.testmondata`；以后比较代码变化，只运行受影响 tests，且总会重跑上次失败的 tests。 | 否 | 需要先建立数据库；不跟踪 static files 和 external services；动态环境可能暴露 hidden test dependencies。官方提供 `--testmon-noselect` 只排序不跳过，可作为低风险导入阶段。[README](https://github.com/tarpas/pytest-testmon/blob/v2.2.0/README.md) | Python/pytest 且已有稳定 suite 时可选；高风险或刚导入时先 `noselect`，不能把“未选中”解释为业务无风险。 | MIT；[v2.2.0](https://github.com/tarpas/pytest-testmon/releases/tag/v2.2.0)；技术栈 `8/10`，通用工作流 `5/10`。 |
| [Bazel test result cache](https://bazel.build/reference/command-line-reference#flag--cache_test_results) | `--cache_test_results=auto` 只在 test 或其 declared dependencies 改变、上次失败、external 或多次运行时重跑；其余复用结果。 | 否 | 依赖严谨 BUILD graph、hermetic inputs 与 Bazel 基础设施；建立成本远高于 MAGA 的普通项目需求。它缩小执行，不负责选择应写什么测试。 | 仅当仓库已使用 Bazel 时尊重其 cache；吸收“证据必须绑定声明依赖和明确输入”，不引入 Bazel。 | Apache-2.0；[9.2.0](https://github.com/bazelbuild/bazel/releases/tag/9.2.0)；既有 Bazel 仓库 `8/10`，通用融合 `1/10`。 |

这些工具共同给出一个重要边界：**affected selection 是执行优化，不是正确性证明**。当本次风险位于静态资源、运行时配置、权限、数据库迁移、外部服务或未建模依赖时，MAGA 仍要选一条直接观察该风险的 smoke/integration evidence，不能仅报告“related tests passed”。

## 四、真实行为与契约：吸收 seam 选择，不默认装工具

### Testing Library v10.4.1

Testing Library 的核心不是 matcher，而是指导原则：“测试越像软件真实使用方式，越能提供信心”；它明确反对把组件内部 state、method、lifecycle 或 child structure 当作主要断言，并让 query 优先靠 role、label 和 text 等用户可感知契约。[官方介绍](https://testing-library.com/docs/) · [query priority](https://testing-library.com/docs/queries/about/) · [v10.4.1](https://github.com/testing-library/dom-testing-library/releases/tag/v10.4.1)

- **默认 TDD**：否。
- **膨胀风险**：工具本身轻量，但仅适合 DOM/UI；若机械地把每个 component 都写一套测试，仍会臃肿。
- **MAGA 吸收**：选择 seam 时先问“实际消费者怎么感知结果”；Web 测试优先用户可见的 role、label、state 和 persisted result。
- **拒绝**：把 DOM Testing Library 加到所有项目，或用 component tree 覆盖率代替产品流程。
- **许可/适配**：MIT；理念 `9/10`，通用工具融合 `3/10`。

### Pact JS v17.1.2

Pact 让 API consumer 用真实 client code 生成交互 contract，再由 provider replay 验证。它的官方规则尤其值得吸收：每个 example 都必须能回答“如果不测，会漏掉哪一个 consumer bug 或 provider misunderstanding”；答案为 none 就不该加入；contract test 应尽可能宽松但仍能阻止真实 breaking change。[Pact introduction](https://docs.pact.io/) · [Writing consumer tests](https://docs.pact.io/consumer) · [v17.1.2](https://github.com/pact-foundation/pact-js/releases/tag/v17.1.2)

- **默认 TDD**：否，但采用 code-first consumer test。
- **膨胀风险**：中高；多服务、broker、provider verification 和版本协调对普通项目过重。
- **MAGA 吸收**：跨服务时只保护当前 consumer 实际依赖的 contract；用真实 API client，不绕过产品代码直接调用 `fetch`。
- **拒绝**：默认安装 Pact、默认建立 broker、把所有 provider 字段都冻结成 contract。
- **许可/适配**：MIT；跨服务项目 `8/10`，普通项目 `2/10`。

### Mock Service Worker v2.15.0

MSW 在 network layer 拦截已经从应用发出的 request，因此应用仍运行真实 request client 和上层逻辑；相同 handlers 可复用于浏览器、Node 测试和本地开发。[官方仓库机制](https://github.com/mswjs/msw) · [v2.15.0](https://github.com/mswjs/msw/releases/tag/v2.15.0)

- **默认 TDD**：否。
- **膨胀风险**：低到中，但仅限 JavaScript/TypeScript 网络边界；mock handler 仍可能与真实 API 漂移。
- **MAGA 吸收**：mock 放在网络外部边界，让本次要验证的应用代码保持真实；相同 fixture/handler 尽量只维护一份。
- **拒绝**：遇到任何 HTTP 就自动安装；把 mock 返回成功当成生产 integration 已验证。
- **许可/适配**：MIT；已有 Web/Node 项目 `7/10`，通用融合 `2/10`。

### Qodo Cover 0.3.10：明确拒绝

Qodo Cover 以 coverage report 和目标覆盖率驱动 LLM 多轮生成测试。其官方仓库已声明自 2025-06-15 起不再维护，版本 0.3.10 使用 AGPL-3.0。[官方仓库](https://github.com/qodo-ai/qodo-cover) · [0.3.10 release](https://github.com/qodo-ai/qodo-cover/releases/tag/0.3.10)

- **默认 TDD**：否，但默认目标是提高覆盖率，而不是证明当前纵向切片。
- **膨胀风险**：很高；coverage threshold、报告格式、LLM API、多轮迭代和生成日志会把“最小充分证据”替换成“追覆盖率”。
- **可吸收点**：没有 MAGA 当前缺失且值得引入的核心机制。
- **拒绝点**：不维护、AGPL-3.0、覆盖率导向、多轮自动生成以及额外服务配置。
- **MAGA 适配度**：`0/10`，不融合。

## 五、MAGA 应实现的最小 `validation-design`

这不是新的公开 Skill，不新增用户入口，也不要求产品设计者学习测试术语。Project Lead 在软件 Ticket 成形时自动使用它；worker 读完仓库后可以把命令和 seam 校准一次。

### 最小字段

只保留五个字段，避免形成测试矩阵：

```markdown
## Proof

- Changed fact: 用户关闭周报后，刷新仍保持关闭。
- Break to catch: UI 显示保存成功，但值没有持久化。
- Seam and evidence: 通过真实设置接口保存并重新读取的一条现有集成检查。
- Escalate only if: 改动触及权限或迁移；先向用户说明新增的一条最小验证。
- Stop when: 该检查在最终代码上通过并记录结果；不运行无关全量或浏览器矩阵。
```

字段含义：

- `Changed fact` 只写本切片新成立的可观察事实，不复制整份 Acceptance；
- `Break to catch` 必须是一种错误行为，不是“代码行被改了”或“函数没被调用”；
- `Seam and evidence` 同时写最低稳定 public seam 和一次实际可运行的检查；已有测试、直接 smoke 或人工验收都可以，不保证新增测试文件；
- `Escalate only if` 只记录当前已识别的高风险触发器，不预建所有可能矩阵；
- `Stop when` 是硬边界，防止 agent 在已经证明本次改变后继续测试。

`Persistent regression test` 不必再做第六个常驻字段。MAGA 可以在 `Seam and evidence` 内部判断：bug、稳定业务规则、权限、状态机、序列化、持久化或曾经复发的边界通常留下测试；文档、metadata、小样式和一次性 release 操作通常复用现有检查或 smoke。

### 内部决策顺序

1. 先写 `Changed fact`，确保它是一个最短纵向切片，而不是代码层任务清单。
2. 写一句 `Break to catch`。如果说不出真实失败，就不新增测试；改为最小 smoke、人工验收或直接检查产物。
3. 找最低稳定 public seam。优先用户或 consumer 能观察到的 output、state、side effect、exit code 或 contract。
4. 先复用仓库现有能力：精确 test path/name > 已有 related/changed/affected selection > 一条直接 integration/smoke。不要为了获得选择器安装 Nx、Bazel 或新框架。
5. 写测试时套用三个 gate：expected 独立推导；真实业务代码保持真实；mock 只隔离慢、外部或不可控边界。
6. 默认只运行一次。若失败，修复后重跑同一条检查属于完成本次验证，不算扩张；不得顺手新增 lint、full suite、review 或 viewport matrix。
7. 只有权限、安全、并发、数据迁移、不可逆操作、资金或已确认跨环境风险才提出扩大；先说明具体风险和最少新增验证，等待用户确认。
8. 证据来自最终代码/明确 commit 后，达到 `Stop when` 就提交。

### 工具路由表

| 仓库已有事实 | MAGA 默认动作 |
| --- | --- |
| 用户或项目给出更窄的测试命令 | 原样采用，不升级范围。 |
| 已知一个直接相关 test file/name | 只运行该 file/name。 |
| 已有 Jest/Vitest/Nx/testmon/Bazel affected 能力，但具体测试未知 | 用已存在的 change selection 缩小集合，并检查其已知盲区。 |
| 改动跨 UI/API/persistence，窄层无法观察用户结果 | 写或运行一条 critical-path integration/E2E，不生成组合矩阵。 |
| 是已复现 bug | 在稳定 seam 留一条 regression test，并重跑原始复现。 |
| 是文档、metadata、小样式或人类措辞判断 | 检查最终 artifact 或做一次人工 acceptance；不为过程文字造测试。 |
| 测试设施坏了 | 尝试仓库内最小 smoke；仍无法验证就报告，不扩大产品改造。 |

## 六、明确不做什么

- 不融合 Superpowers、Spec Kit 或 OpenAI Skills 的整套 lifecycle；
- 不新增一个 `testing` 公开 Skill 让产品用户手动选择；
- 不把 TDD、BDD、ATDD 或 red-green 设为默认；
- 不把 Nx、Bazel、Pact、MSW、Jest、Vitest 或 pytest-testmon 变成 MAGA 依赖；
- 不要求每张 Ticket 新增测试文件、达到覆盖率百分比或执行全量 suite；
- 不用 source-string assertion、mock call count 或 snapshot 大面积变化冒充真实行为证据；
- 不把 affected test selector 的“没有选择测试”解释成“产品没有风险”；
- 不重复运行已经通过、且后续修改没有影响的验证；
- 不因为测试工具初始化失败去重构产品或增加基础设施。

## 七、推荐排名

### 适合吸收到 MAGA 工作流

1. **Superpowers `writing-good-tests` 的 falsifiability gate**：最直接补上 MAGA “如何写一条有价值测试”的缺口，但必须剥离其默认 TDD 与 full verification lifecycle。
2. **Testing Library 的 consumer-observable seam**：把测试对象从内部组件/调用转回用户结果，可跨技术栈表达为原则。
3. **Spec Kit 的 independent test per vertical slice**：适合 Ticket 组织，但只吸收一句 independent evidence，不引入 artifact pipeline。
4. **Pact 的 `what bug would be missed?` 过滤器**：适合跨服务 contract 决策，可泛化成 `Break to catch`。
5. **OpenAI Skill 的正反 prompt routing acceptance**：只用于 MAGA 自己的 Skill 语义触发测试。

### 仅适合某技术栈的工具选择

1. Jest `--findRelatedTests` / Vitest `--changed`：已有 JS test runner 时最轻；
2. Nx affected：已有 monorepo project graph 时可靠；
3. pytest-testmon：已有稳定 Python suite 且接受先建立 dependency DB 时有效；
4. Bazel cache：已有 hermetic Bazel graph 时有效，绝不为普通项目新增；
5. MSW / Pact：只有本次风险明确落在网络或服务 contract seam 时选择。

## 最终推荐

**自己实现最小内部 `validation-design`，吸收机制，不融合任何项目整包。**

它只需要把 Acceptance 编译成 `Changed fact → Break to catch → Seam and evidence → Escalate only if → Stop when`。执行时优先使用项目已有的精准命令或 affected-test 功能；没有时就运行一条直接 smoke。这样既补足“测试该怎么写”的判断能力，又不会破坏 MAGA 当前最重要的产品特征：实现优先、一次验证、风险才升级、及时提交。
