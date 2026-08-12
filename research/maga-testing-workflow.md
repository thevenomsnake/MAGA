# MAGA 的测试环节：从产品验收到最小充分证据

研究日期：2026-08-12

研究对象：MAGA `0.13.1` 工作区、OpenAI 官方 Codex / Skills / Plugins 文档、Node.js 官方测试文档、Playwright 官方文档，以及 Matt Pocock Skills `1.2.2` 固定提交 `8b36d4fb2635b3c21998dcd8144439c9e5ba7302`。

## 结论

MAGA **已经涉及测试，但还没有形成完整的“测试设计”能力**。

现在已经有四块基础：

1. Project Lead 要求每张 Ticket 写一个风险匹配的完成检查，并在纵向切片完成后运行一次直接相关的 smoke；
2. `implement` 会在用户要求、仓库规则要求或风险有充分理由时采用 TDD，普通交付只做一次聚焦验证；
3. 已融合的 `tdd` 会约束测试写在公共 seam、验证行为而不是实现，并用一次一个纵向切片的 red-green 循环推进；
4. MAGA 自己已有 Node.js 测试，覆盖初始化、App Server 桥接、Git 纪律、Skill 清单与生命周期 Hook。

这些能力分别回答了“完成前要验证”“何时采用 TDD”“TDD 怎么写”和“MAGA 自己怎么防回归”，但没有统一回答：

> 这张产品 Ticket 最可能坏在哪里？最低成本的哪一种证据足以发现它？是否值得留下一个自动化回归测试？

因此，最佳补法不是把 TDD 变成默认流程，也不是新增一个要求产品用户手动调用的公开 Skill，而是增加一个 **Project Lead 自动使用的内部 `validation-design` 方法**。它在 Ticket 形成时把产品验收翻译成一个最小 Proof Plan；执行者读完代码后再校准一次，然后只写或运行能够覆盖真实风险的最少测试。`tdd` 继续保持原本的窄职责：需要 test-first 时才进入 red-green。

这个方向也符合 OpenAI 的 Skill 设计原则：Skill 应聚焦一个工作，隐式调用依赖清楚的 description 和边界；测试 Skill 时应使用提示词验证其触发行为，而不是让一个 Skill 承担所有相邻流程。[OpenAI：Build skills](https://developers.openai.com/codex/skills/#how-chatgpt-and-codex-use-skills) · [Best practices](https://developers.openai.com/codex/skills/#best-practices)

## 一、MAGA 当前已经做到什么

| 当前能力 | 已存在的行为 | 仍然缺少什么 |
| --- | --- | --- |
| Ticket 契约 | `Acceptance` 记录可观察标准，`Completion Check` 记录一个风险匹配的预览、命令或事实，完成时记录 Behavior、Validation、Evidence 与 commit/artifact。[Project Memory Contract](../plugins/maga/skills/project-lead/references/project-memory.md) | 没有要求明确写出“要防的失败”“为什么这项检查足够”“是否要留下回归测试”。 |
| Project Lead | 每个切片工作后运行一次风险匹配 smoke；只有风险或仓库规则要求时才扩大测试或 review。[Project Lead](../plugins/maga/skills/project-lead/SKILL.md) | 有验证强度原则，但没有测试类型选择算法。 |
| 实现方法 | 普通工作选择最小可运行纵向切片；TDD 只在显式要求、仓库规则或风险需要时启用；默认只运行一次聚焦验证。[Implement method](../plugins/maga/methods/implement/METHOD.md) | 没有规定何时应新增 unit、integration、E2E 或只复用现有检查。 |
| TDD | 测试公共接口和可观察行为；避免实现耦合、同义反复和一次写完整层测试；一次一个测试、一个最小实现。[MAGA TDD](../plugins/maga/skills/tdd/SKILL.md) | TDD 是一种实现循环，不是通用测试策略；它不负责决定“不做 TDD 时该验证什么”。 |
| 故障诊断 | 先建立复现和反馈回路，再最小化、验证假设、修复并回归。[Diagnosing Bugs](../plugins/maga/skills/diagnosing-bugs/SKILL.md) | 适合已经观察到的故障，不覆盖普通功能的预防性测试设计。 |
| MAGA 自测 | 根目录用 `node --test test/*.test.js`；测试覆盖 Skill 契约、初始化器、Git、计算配置、App Server 桥接和 Hook，另有 `smoke:init`。[package.json](../package.json) · [test/](../test/) | 主要是确定性源码/运行时契约测试；没有真实 Codex 宿主中的语义路由验收，也没有浏览器 E2E 依赖。 |

【判断】当前设计已经正确避免了上游默认的“经常跑单文件、结束跑全量、再做双轴 review”自动膨胀。上游固定版本的 `implement` 明确要求频繁 typecheck、频繁单文件测试、末尾一次全量测试和 code review；MAGA 已有意把它收窄为风险匹配验证。[上游 implement 固定源码](https://github.com/mattpocock/skills/blob/8b36d4fb2635b3c21998dcd8144439c9e5ba7302/skills/engineering/implement/SKILL.md) · [MAGA implement 适配](../plugins/maga/methods/implement/METHOD.md)

【判断】真正的缺口不是“没有测试工具”，而是**缺少测试意图的编译层**：从产品验收标准，推导到风险、测试 seam、证据类型和停止条件。

## 二、agentic coding 流程中，测试应该出现在哪些节点

测试不应只出现在“代码写完以后”。它应在六个不同节点承担不同职责，但每个节点都只产生当前需要的最小信息。

### 1. 探索阶段：先不写测试

如果产品行为还在讨论、原型或研究中，先澄清谁在什么情况下要得到什么结果。此时写测试会把未决定的行为提前冻结。MAGA 的 pre-Ticket exploration 本来就禁止修改项目文件和创建 Ticket，这个边界应继续保留。[Exploration Loop](../plugins/maga/skills/project-lead/references/exploration-loop.md)

输出只需要一句首个可观察成功边界，例如：“用户关闭周报后，重新打开设置仍显示关闭。”

### 2. Ticket 形成时：定义 proof obligation

Ticket 的 `Acceptance` 先写产品事实；随后为每个独立高风险事实选择一个能证伪它的检查。不是先选框架，也不是先列 unit / integration / E2E 矩阵。

推荐在 Ticket 中加入最小 Proof Plan：

```markdown
## Proof Plan

- Risk: 页面显示保存成功，但刷新后设置恢复原值。
- Evidence: 一个通过真实设置接口保存并重新读取的集成检查。
- Expected: 刷新后仍为关闭状态。
- Persistent regression: yes；这是稳定产品行为且曾经容易回退。
- Human acceptance: not-needed。
```

OpenAI 的 Codex 提示指南也要求任务同时说明目标行为、约束和“如何验证改变”；其 bug 流程先给出复现步骤，修复后重跑复现，并建议只运行最小相关测试套件。[OpenAI：Prompting Codex](https://developers.openai.com/codex/prompting/#prompting-codex) · [Fix a bug](https://developers.openai.com/codex/prompting/#fix-a-bug)

### 3. 第一次写代码前：选择最低有效 seam

执行者先读现有代码、测试约定和公开接口，再选择最接近风险、又不会绑定内部实现的 seam。测试名用产品或调用者能理解的行为，而不是函数内部步骤。

Matt 的固定 TDD 源码也把 seam 定义为能够从公共边界观察行为的位置，并明确反对测试私有方法、内部调用次数或重新计算同一预期值。[上游 TDD 固定源码](https://github.com/mattpocock/skills/blob/8b36d4fb2635b3c21998dcd8144439c9e5ba7302/skills/engineering/tdd/SKILL.md) · [Good and Bad Tests](https://github.com/mattpocock/skills/blob/8b36d4fb2635b3c21998dcd8144439c9e5ba7302/skills/engineering/tdd/tests.md)

这里应由 MAGA 自己作技术判断。只有 seam 的选择会改变产品行为、成本或风险时，才问产品用户；不要让用户选择测试框架或 mock 方式。[Project Lead 用户契约](../plugins/maga/skills/project-lead/SKILL.md)

### 4. 实现过程中：有理由才进入 red-green

以下情况适合写一个失败测试再修复：

- 已复现 bug，且这个失败可以在稳定公共 seam 上表达；
- 纯规则、状态机、权限、计算或序列化逻辑有多个边界条件；
- 需求本身就是一个长期不变量；
- 仓库明确要求 TDD；
- 用户明确要求 test-first。

其他窄改动可以先完成最小实现，再运行最近的现有检查。MAGA 当前 `implement` 已经采用这一边界，不应把已融合的 TDD 误改成所有工作默认仪式。[Implement method](../plugins/maga/methods/implement/METHOD.md)

### 5. 纵向切片完成后：运行一次聚焦技术验证

运行最直接覆盖本次改变的检查，并保存可复述的事实。Node.js 官方测试运行器支持通过 `--test-name-pattern` 只运行匹配名称的测试；失败会产生非零退出码，适合成为可追溯的 completion evidence。[Node.js：Test runner](https://nodejs.org/api/test.html#test-runner) · [Filtering tests by name](https://nodejs.org/api/test.html#filtering-tests-by-name)

“聚焦”表示：

- 改纯函数：目标测试文件或具体测试名；
- 改初始化/配置：在临时目录运行一次真实初始化 smoke；
- 修 bug：重跑原始复现，加最窄回归测试；
- 改用户流程：只跑受影响的关键路径；
- 改文本或元数据：验证最终文件和宿主可读契约，不启动无关浏览器矩阵。

### 6. 集成与发布前：区分工程完成、产品接受和发布证据

- **工程完成**：行为已实现，聚焦验证通过，有可解析 commit 或 artifact。
- **Ticket integrated**：结果已经进入项目历史，Ticket 的行为、验证和证据字段已更新。
- **产品接受**：当视觉、交互手感、措辞或业务判断无法由自动测试决定时，由产品用户查看真实结果。
- **发布证据**：从明确的干净 commit 生成或部署制品，对该制品执行一次生产/安装 smoke，并记录上一 known-good commit。[Native Codex Loop](../plugins/maga/skills/project-lead/references/native-codex-loop.md) · [Git and Release](../plugins/maga/skills/project-lead/references/git-and-release.md)

自动测试通过不等于产品已经接受；人工觉得“看起来不错”也不等于持久化、权限或部署正确。

## 三、如何按风险选择 unit、integration、E2E、smoke 和人工验收

先选**最低成本、能够真实证伪 Acceptance 的层级**。只有仍存在另一个独立且重要的失败模式时，才增加第二层。

| 风险形态 | 默认证据 | 什么时候升级 | 不应该做什么 |
| --- | --- | --- | --- |
| 纯计算、规则、状态转换、格式转换 | unit 或进程内公共 API 测试 | 规则还依赖存储、时间、协议或另一个真实模块时，升级为 integration | 测私有函数或把实现公式复制进 expected |
| 数据库、文件、队列、外部协议适配、配置加载 | integration，通过真实模块边界验证读写或契约 | 失败只会在完整进程、权限或真实运行环境出现时加 smoke/E2E | mock 掉正是本次要验证的边界 |
| 用户关键流程跨 UI、API 与持久化 | 一条 E2E happy path，必要时加一个关键失败分支 | 资金、权限、不可逆操作或多浏览器兼容是明确风险时才扩大 | 为每个控件、每个像素、每个浏览器自动生成矩阵 |
| 构建、安装、启动、部署、插件发现 | smoke：对最终 commit/artifact 走一次最短真实路径 | 打包和运行环境差异大，或历史上在边界处失败时，加 integration/E2E | 用源码目录的成功冒充发布制品成功 |
| 已观察 bug | 先重现，再在最窄稳定 seam 留一个回归测试，最后重跑真实复现 | 只有窄层无法覆盖根因时才增加高层验证 | 只验证“代码改了”或只看函数被调用 |
| 视觉质量、信息层级、措辞、可理解性、交互手感 | 可运行预览 + 人工产品验收 | 可访问名称、键盘操作、明确布局约束可以补自动检查 | 用截图 diff 代替全部设计判断 |
| 第三方站点或服务 | 测自己的适配契约；测试环境中控制或替代第三方响应 | 只有正式联调或发布 gate 才触达真实第三方 | 让日常测试依赖不可控网页、Cookie 弹窗或第三方稳定性 |

Playwright 官方明确建议 E2E 验证用户可见行为而不是实现细节，每个测试相互隔离，只测试自己控制的系统；定位元素时优先使用 role、label、text 等用户可见契约。[Playwright：Best Practices](https://playwright.dev/docs/best-practices#testing-philosophy) · [Use locators](https://playwright.dev/docs/best-practices#use-locators) · [Avoid testing third-party dependencies](https://playwright.dev/docs/best-practices#avoid-testing-third-party-dependencies)

### 一个可执行的风险算法

MAGA 可以内部按以下顺序判断，无需让产品用户回答技术问题：

1. 写出一个最可信的失败句：“如果这次改坏了，用户会看到什么？”
2. 找到能观察这个失败的最低稳定公共 seam。
3. 判断现有测试或一次 smoke 是否已经能够证伪它。
4. 只有当行为是稳定契约、复发成本高，或未来改动容易无意破坏时，新增持久自动化测试。
5. 如果一个检查不能覆盖跨边界失败，再增加一条 integration 或 E2E；不要因为存在更多测试类型就全部采用。
6. 当成功取决于人的视觉、语言或体验判断时，明确留下人工验收，不伪装成自动化已覆盖。
7. 到达 Ticket 预先写下的停止条件后结束，不主动扩张全量回归。

可以用三个因子判断是否升级验证：

- **爆炸半径**：只影响局部，还是跨模块、跨进程、跨设备；
- **失败代价**：易恢复，还是权限、金钱、数据、发布或不可逆影响；
- **证据距离**：当前测试看到的是用户结果，还是仅看到内部动作。

其中任一项高，不代表自动跑所有测试；它只说明需要选择更接近真实风险的证据，或请求最少必要的额外授权。

## 四、测试应该怎么写

### 通用结构

一个值得保留的测试应当具备：

- 名字描述行为和结果，例如“过期邀请不能被接受”；
- 只通过公共接口执行动作和观察结果；
- 测试数据最少且由该测试自己控制；
- expected 来自产品规则、已确认示例或固定事实，而不是复制实现算法；
- 与其他测试隔离，可以单独运行；
- 失败时能直接说明哪项产品事实不成立。

Node.js 的 `node:test` 是稳定测试运行器；同步测试抛错、异步测试 Promise reject 都会失败，测试文件默认可以进程隔离运行。[Node.js：Test runner](https://nodejs.org/api/test.html#test-runner) · [Execution model](https://nodejs.org/api/test.html#test-runner-execution-model)

```js
import assert from "node:assert/strict";
import test from "node:test";

test("expired invitation cannot be accepted", async () => {
  const result = await acceptInvitation({
    token: "known-token",
    expiresAt: "2026-08-01T00:00:00Z",
    now: "2026-08-02T00:00:00Z",
  });

  assert.deepEqual(result, { status: "expired" });
});
```

这个例子验证的是公共行为和独立固定结果。下面这种写法价值较低：

```js
test("calls validateExpiry once", async () => {
  await acceptInvitation(input);
  assert.equal(validateExpiry.mock.callCount(), 1);
});
```

它只能证明内部函数被调用，无法证明过期邀请真的被拒绝；重构内部结构也会无意义地打破测试。

### Web 用户流程

Playwright 测试由“执行用户动作 + 断言用户可见状态”组成，并会对动作条件和 web-first assertion 自动等待；不应手写固定 sleep。[Writing tests](https://playwright.dev/docs/writing-tests) · [Auto-retrying assertions](https://playwright.dev/docs/test-assertions#auto-retrying-assertions)

```ts
import { expect, test } from "@playwright/test";

test("notification preference survives reload", async ({ page }) => {
  await page.goto("/settings/notifications");
  await page.getByRole("checkbox", { name: "Weekly summary" }).uncheck();
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Settings saved")).toBeVisible();

  await page.reload();
  await expect(page.getByRole("checkbox", { name: "Weekly summary" })).not.toBeChecked();
});
```

这条 E2E 的价值不在于“点过按钮”，而在于它覆盖了一个真实历史风险：UI 显示保存成功，但状态没有持久化。若本次改动只影响内部格式转换，就不应该为此启动完整浏览器。

## 五、怎样让面向产品设计者的 MAGA 自动生成测试，又不过度测试

### 用户仍只说产品语言

产品用户提供或确认的是：

- 谁在使用；
- 什么行为算成功；
- 哪种失败不可接受；
- 必须由人感受或判断的体验标准。

MAGA 内部负责：

- 选择 unit、integration、E2E、smoke 或人工验收；
- 找现有测试约定和命令；
- 选择 seam、fixture、mock 与框架；
- 写测试、运行测试、保存证据；
- 判断何时停止。

这与 OpenAI 的 Codex 提示建议一致：用户说明目标行为、相关代码或复现、约束和验证方式；Codex 承担命令输出、调用位置、堆栈和实现细节。[OpenAI：Prompting Codex](https://developers.openai.com/codex/prompting/#prompting-codex) · [Write a test](https://developers.openai.com/codex/prompting/#write-a-test)

### 自动生成测试的默认规则

建议 MAGA 使用以下默认值：

1. 每张软件 Ticket 必须有一个 Proof Plan，但**不保证每张 Ticket 都新增测试文件**。
2. bug 修复、稳定业务规则、权限、状态机、序列化与持久化默认留下回归测试。
3. 文档、元数据、小范围样式和已有工具完全覆盖的改动，优先复用现有检查或一次 smoke。
4. E2E 只覆盖跨边界的关键用户结果，不把每个 acceptance criterion 都机械复制成浏览器脚本。
5. TDD 只在明确需要 test-first 时自动路由；它不是测试存在的前提。
6. 人工验收只用于自动化无法判断的产品质量，并且只问一个具体观察问题，例如“这个错误提示是否让首次使用者知道下一步？”
7. 不自动扩张为全量回归、多浏览器、多设备、多语言和多视口矩阵；只有 Ticket 写明对应风险才增加。
8. 测试命名始终使用产品领域语言，使产品用户即使不读代码，也能从证据名称理解覆盖了什么。

### 自动停止条件

满足以下四项就应停止测试工作：

- Ticket 的 Acceptance 已有对应的可观察证据；
- 本次改变的最高风险失败已被直接检查；
- 检查结果来自最终代码或制品，而不是修改前状态；
- 没有仍未覆盖、且足以阻止发布的独立风险。

测试数量、覆盖率百分比或“所有可能边界”不应成为默认完成标准。

## 六、Ticket 的 completion、acceptance 与测试证据应如何定义

当前 Ticket 模板的方向正确，但 `Completion Check` 太容易退化成“运行测试”四个字。推荐将它扩为以下最小结构，而不是建立测试矩阵：

```markdown
## Acceptance

- 用户关闭周报后，刷新页面仍保持关闭。
- 保存失败时不显示成功提示。

## Proof Plan

- Risk: UI 与持久化状态不一致。
- Seam: 用户可见的通知设置流程。
- Evidence: 一条保存后刷新页面的 E2E；失败响应使用现有集成测试。
- Expected: 两条 Acceptance 都能被直接观察。
- Human acceptance: not-needed。
- Stop when: 两项聚焦检查通过；不运行无关浏览器或全量视觉矩阵。

## Completion

- Behavior: 周报偏好通过现有设置接口持久化。
- Validation: `<exact focused command>`，exit 0，2 tests passed。
- Evidence: `<test name, report/artifact, or observed fact>`。
- Product acceptance: not-needed | pending | accepted。
- Commit or artifact: `<immutable identity>`。
- Blocker: none。
```

字段含义必须分开：

- `Acceptance`：产品契约，说明用户能观察什么；
- `Proof Plan`：实现前的证据设计，说明要防什么失败；
- `Validation`：实际执行过的命令/动作与结果，不能写计划；
- `Evidence`：别人可以复核的测试名、报告、截图、日志事实或制品；
- `Product acceptance`：只记录仍需要人的判断；
- `Commit or artifact`：把证据绑定到不可变结果。

MAGA 已经要求 worker 只有在记录实际 validation 和 commit/artifact 后才能完成，并且只有结果进入项目历史后才能标为 integrated；这个区分应保留。[Project Memory Contract](../plugins/maga/skills/project-lead/references/project-memory.md) · [Native Codex Loop](../plugins/maga/skills/project-lead/references/native-codex-loop.md)

## 七、MAGA 自己的插件与 Skill 应怎么测试

产品测试和 MAGA 自测是两件事。MAGA 自己建议保留三条证据通道：

### 1. 确定性仓库测试

继续用 Node.js 测试验证：

- plugin manifest、catalog、Skill 元数据和固定上游映射；
- 初始化器生成的文件与 LF/manifest 规则；
- MCP / App Server 参数和错误恢复；
- Ponytail 与 Humanization Hook 的生命周期；
- Git baseline、冻结制品和 commit 约束。

当前测试已经覆盖大部分这类契约。[Bundled Skills tests](../test/bundled-skills.test.js) · [Init Project tests](../test/init-project.test.js) · [Git discipline tests](../test/git-discipline.test.js) · [Ponytail lifecycle tests](../test/ponytail-lifecycle.test.js)

### 2. Skill 语义触发验收

静态测试能证明 description 和 `allow_implicit_invocation` 存在，却不能证明真实 Codex 会在正确语义下选择 Skill。OpenAI 官方明确建议“用提示词对照 Skill description 测试触发行为”。[OpenAI：Skill best practices](https://developers.openai.com/codex/skills/#best-practices)

每次修改自动触发边界时，只需要一组小型正反例：

- 一个应触发的真实表达；
- 一个很接近但不应触发的表达；
- 只有改动涉及特定语言时，才增加该语言样本。

例如 `wait-what`：

- 应触发：“我还是没明白，真正的问题是什么？”
- 不应触发：“明白了，那这个问题下一步怎么修？”

测试对象是语义类别，不是把某一句中文硬编码成国际插件的唯一触发词。

### 3. 安装候选 smoke

每个 release candidate 在干净隔离实例的新 Codex task 中做一次最短真实路径：安装明确 commit、确认 Skill 可见、发出一条自然语言产品请求、观察 Project Lead 是否形成正确的下一步和证据。插件官方文档说明，安装后的插件会把 Skills、connectors 和 MCP tools 提供给新的聊天/任务，因此宿主 smoke 应在新任务中进行。[OpenAI：Plugins](https://developers.openai.com/codex/plugins/#overview)

这条 smoke 不应在每个文本改动后重复，也不需要变成所有 Skills × 所有语言 × 所有模型的矩阵。

## 八、建议的最小 MAGA 改造

### 新增一个内部方法，而不是公开 Skill

建议内部名称：`validation-design`。它无需出现在用户的 Skills 列表，也无需用户记住命令。其职责只有五步：

1. 从 Ticket Acceptance 提取最可信失败；
2. 选择最低稳定 public seam；
3. 决定复用现有检查、写回归测试、做 E2E/smoke，还是保留人工验收；
4. 写入最小 Proof Plan 和停止条件；
5. 执行者读完代码后校准一次，不得无理由扩大。

它不负责写全部测试、不强制 TDD、不运行全量回归，也不替代 code review、diagnosis 或 release smoke。

### 建议修改位置

1. 在 `plugins/maga/methods/validation-design/METHOD.md` 定义上述风险算法；
2. 在 [project-memory.md](../plugins/maga/skills/project-lead/references/project-memory.md) 把单行 `Completion Check` 扩成最小 `Proof Plan`；
3. 在 [implement/METHOD.md](../plugins/maga/methods/implement/METHOD.md) 增加“写前选证据、读代码后校准、完成后只跑一次聚焦检查”；
4. 在 [capability-routing.md](../plugins/maga/skills/project-lead/references/capability-routing.md) 规定：普通软件 Ticket 自动使用内部 validation design；显式 test-first 或高风险 seam 才加载 `tdd`；已观察故障先走 diagnosis；
5. 在初始化模板和现有 Node 测试中验证新 Ticket 契约，但不增加新的测试框架；
6. 为自动 Skill 路由维护一份很小的正反 prompt acceptance 清单，release candidate 才做一次真实宿主 smoke。

### 不建议的方向

- 不把 `tdd` 扩成万能 testing Skill；
- 不让产品用户在 unit / integration / E2E 之间做技术选择；
- 不为每张 Ticket 自动创建 QA 角色或独立测试任务；
- 不把覆盖率百分比、全量回归或多视口矩阵设为默认 gate；
- 不把 exact prose regex 当成 Skill 真实语义触发已经通过的证明；
- 不用“测试通过”替代产品用户对视觉、语言和体验的接受。

## 最终判断

MAGA 当前测试能力可以评为：**执行纪律已经有 7/10，测试设计只有 4/10**。

它已经能防止最明显的两种问题：完全不验证，以及为了显得严谨而无限加测。但它还不能稳定地把一条产品 Acceptance 编译成“最小但足够的证据”。补上内部 `validation-design` 后，MAGA 才能真正做到：产品设计者只定义什么算好，MAGA 自己决定如何证明它，而且知道什么时候应该停。

## 主要一手来源

- [OpenAI：Build skills](https://developers.openai.com/codex/skills/)
- [OpenAI：Plugins](https://developers.openai.com/codex/plugins/)
- [OpenAI：Prompting Codex](https://developers.openai.com/codex/prompting/#prompting-codex)
- [OpenAI：Custom instructions with AGENTS.md](https://developers.openai.com/codex/guides/agents-md/)
- [Node.js：Test runner](https://nodejs.org/api/test.html)
- [Playwright：Writing tests](https://playwright.dev/docs/writing-tests)
- [Playwright：Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright：Assertions](https://playwright.dev/docs/test-assertions)
- [Matt Pocock Skills 1.2.2：TDD](https://github.com/mattpocock/skills/blob/8b36d4fb2635b3c21998dcd8144439c9e5ba7302/skills/engineering/tdd/SKILL.md)
- [Matt Pocock Skills 1.2.2：implement](https://github.com/mattpocock/skills/blob/8b36d4fb2635b3c21998dcd8144439c9e5ba7302/skills/engineering/implement/SKILL.md)
- [Matt Pocock Skills 1.2.2：to-tickets](https://github.com/mattpocock/skills/blob/8b36d4fb2635b3c21998dcd8144439c9e5ba7302/skills/engineering/to-tickets/SKILL.md)
- [MAGA：Project Lead](../plugins/maga/skills/project-lead/SKILL.md)
- [MAGA：Project Memory Contract](../plugins/maga/skills/project-lead/references/project-memory.md)
- [MAGA：Implement method](../plugins/maga/methods/implement/METHOD.md)
- [MAGA：TDD](../plugins/maga/skills/tdd/SKILL.md)
- [MAGA：当前测试入口](../package.json)
