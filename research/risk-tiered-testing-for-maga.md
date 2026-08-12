# MAGA 风险分层测试策略研究

> 研究日期：2026-08-12
> 目标：让 MAGA 按当前用途和风险选择“刚好足够”的验证，而不是默认扩张测试。

## 推荐结论

MAGA 不应建立“个人 / 小范围 / 公开 × 本地 / 内网 / 互联网”的固定 3×3 测试矩阵。推荐组合模型：

1. 以**当前实际受众**选择基础 lane：Personal、Controlled、Public。
2. 以**暴露面、交付方式、具体高风险因素**追加最少 modifier。
3. 以**项目规模**选择更便宜的执行方式，不改变保证深度。
4. 把每个 Ticket 的聚焦验证与实际扩大边界时的 promotion/release gate 分开。
5. 当前最高风险得到一次直接证据后停止；覆盖率、测试层数和组合数量不是默认交付目标。

未来可能公开，不等于今天的个人原型必须承担公开发布成本。只有真的开始分享、部署或发布时，才复用已有 Ticket 证据并补目标边界的差额。

## 为什么不能用一个测试等级

| 维度 | 决定什么 |
| --- | --- |
| 受众 | 失败影响谁，反馈和恢复是否受控 |
| 暴露面 | 输入和访问者是否可信，需要哪些安全边界 |
| 交付方式 | 要证明源码、共享制品还是公开制品 |
| 具体风险 | 权限、敏感数据、资金、迁移、并发、不可逆副作用等失败模式 |
| 规模 | 测试如何选择、缓存、并行和缩短 |

一个很小的个人转账脚本仍可能需要高保证；一个很大的离线可视化仓库改样式仍可能只需直接预览。规模只能影响成本，不能替代风险。

## 一手资料中的可吸收机制

| 来源（固定版本） | 许可 | 吸收什么 | 不直接融合什么 |
| --- | --- | --- | --- |
| [OWASP ASVS 5.0.0](https://github.com/OWASP/ASVS/tree/v5.0.0_release)（`5cf9b03`） | CC BY-SA 4.0 | 按敏感度和相关功能筛选、逐层加深保证 | 不把约 350 条要求变成默认清单，也不把 ASVS 层级映射为项目规模 |
| [OWASP SAMM 2.2.0](https://github.com/owaspsamm/core/releases/tag/v2.2.0)（`21352e0`） | CC BY-SA 4.0 | 只在改动影响控制时验证相关安全要求，成熟度随实际发布能力提高 | 组织级成熟度模型不能成为单 Ticket 模板 |
| [OpenSSF OSPS Baseline 2026-02-19](https://baseline.openssf.org/versions/2026-02-19) | Apache-2.0 | 公开项目随用户和维护规模增加测试、发布完整性、威胁与供应链要求 | 公开仓库不等于公开产品，不能把所有控制塞进日常 Ticket |
| [OpenSSF Scorecard 5.5.0](https://github.com/ossf/scorecard/releases/tag/v5.5.0)（`c395761`） | Apache-2.0 | 独立探针按适用性评估供应链风险 | 不是功能测试选择器，也不应成为默认依赖 |
| [SLSA 1.2](https://slsa.dev/spec/v1.2/) | Community Specification License 1.0 | 对公开制品逐步加强 provenance、托管与隔离构建 | 不能证明功能正确，本地 Ticket 不需要默认 provenance |
| [Bazel Test Encyclopedia](https://bazel.build/reference/test-encyclopedia) | Bazel 仓库 Apache-2.0 | test size 表达时间、资源和环境成本 | small/medium/large 不是风险或保证等级 |
| [GitHub Spec Kit 0.16.2](https://github.com/github/spec-kit/releases/tag/v0.16.2)（`4871b48`） | MIT | 用户故事可独立实现和验证 | 完整 constitution/spec/plan/tasks/analyze 流程对 MAGA 过重 |
| [Superpowers 6.2.0](https://github.com/obra/superpowers/releases/tag/v6.2.0)（`3dcbd5c`） | MIT | 完成声明必须有修改后的新鲜证据 | 默认 TDD、工作树、评审、全套测试生命周期不能整体移植 |
| [Matt Pocock Skills 1.2.3](https://github.com/mattpocock/skills/releases/tag/v1.2.3)（`6acc160`；MAGA 当前快照 1.2.2 / `8b36d4f`） | MIT | 验证公共 seam、可观察行为和独立预期 | 不继承默认 TDD、频繁检查、全套验证与 review |
| [Nx affected](https://nx.dev/docs/features/ci-features/affected)、[Jest related tests](https://jestjs.io/docs/cli#--findrelatedtests-spaceseparatedlistofsourcefiles)、[pytest-testmon 2.2.0](https://github.com/tarpas/pytest-testmon/releases/tag/2.2.0) | MIT | 由 diff、依赖图或覆盖关系选择受影响测试 | 只优化执行成本，不能判断权限、资金或发布风险；项目没有时不自动安装 |

ASVS/SAMM 为 CC BY-SA。MAGA 可引用其版本和抽象决策思想，但不应把条款复制进 MIT 插件。

## 三条 audience base lane

### A. Personal

适用：仅作者本人当前使用，反馈直接，失败可本地发现和恢复。

- 做出最短可运行纵向切片。
- 从真实入口立即试一次，观察本次改变的事实。
- 稳定逻辑或 Bug 修复优先运行一个精确现有测试；只有明确复发价值才新增回归测试。
- 形成可追溯提交。
- 默认不加 CI、全量回归、多浏览器/多视口矩阵、安全扫描、双人 review 或测试基础设施。

### B. Controlled

适用：固定、已知的小范围用户或操作者，分享渠道受控。

- 包含 Personal 的直接验证。
- 对稳定且多人重复使用的行为，留下一个公共 seam 上的可重复聚焦证据。
- 共享环境不同才做一次环境 smoke。
- 触及访问控制或持久状态时，验证相应允许/拒绝或写入/读取事实。
- 交付安装包或压缩包时，从确切共享制品做一次干净安装/启动。
- 不自动引入公共 OSS 治理、供应链评分或完整安全基线。

### C. Public

适用：未知用户可访问、安装或依赖，反馈和恢复不可控。

- 包含 Controlled 的可重复证据。
- 为本次改变涉及的关键路径留一个集成或 E2E 证据，不覆盖所有路径。
- 对本次触及的安全控制增加相关反例，如未授权访问或异常输入；过滤 ASVS 相关控制，不跑整套标准。
- 从明确 commit 构建最终制品，并做一次干净安装/启动或生产 smoke。
- 按交付成熟度记录版本、哈希、许可/NOTICE、deployed commit、known-good 与 rollback。
- 公开分发时才按成熟度考虑 OSPS、Scorecard、SLSA。

## Modifiers

### Exposure

| 暴露面 | 最少追加项 |
| --- | --- |
| Local / offline | 默认不加网络安全套餐；功能自己联网时才验证超时、失败或不可信响应 |
| Internal network | 触及身份、权限、配置、网络边界或敏感数据时追加相应证据；“内网”不能抵消高权限风险 |
| Internet | 对触及入口考虑不可信输入、认证/授权、会话、输出编码、错误泄露和滥用路径，不自动整站扫描 |

### Delivery

| 交付方式 | 最少追加项 |
| --- | --- |
| Run from source | 证明最终代码可从真实入口运行 |
| Controlled artifact | 从确切制品干净安装/启动；需要时记录版本或哈希 |
| Public release | 只接受干净明确 commit；验证最终 archive/package/image；记录制品身份、known-good 与 rollback |

### Risk override

| 风险 | 最少升级的证据 |
| --- | --- |
| 认证、角色、权限 | 在公共 seam 验证代表性的应允许与应拒绝路径 |
| 敏感数据、密钥、隐私 | 验证相关存储、日志/错误脱敏、导出/删除或权限边界，不使用真实秘密 |
| 资金、额度、计费 | 在 sandbox 验证金额/币种、幂等、失败/重试和对账；保留人工授权 gate |
| 数据迁移、格式升级 | 使用生产形状副本或 dry-run，验证兼容、备份和 rollback；不可逆前停下确认 |
| 并发、队列、重复提交 | 验证实际涉及的重复、竞态、顺序或幂等风险 |
| 不可逆或外部副作用 | 优先 simulation/sandbox，验证确认、结果和恢复；不为测试真实发送、删除或收费 |
| 互联网不可信输入 | 验证触及入口的校验、编码、授权或滥用路径 |
| 公开包/镜像/可执行文件 | 验证最终制品、依赖/许可和完整性；成熟后再增加 provenance 或 SBOM |

高风险需要扩测时，MAGA 应先说明“具体风险 → 最少新增证据”并等待用户确认，不能自行展开全量矩阵。

### Scale selector

- 小项目：精确测试名、单文件命令或真实入口 smoke。
- 多模块项目：受影响 package，加一个真正跨边界的集成证据。
- 大型 monorepo：若已有 affected/related、依赖图、缓存或分片则复用；没有时不为窄改动先建设选择系统。
- 全量回归只在既有发布政策要求，或存在无法由影响分析隔离的独立风险时进入 promotion gate。

## Project Profile：先推断，实质歧义才问

先读取 `AGENTS.md`、项目记忆、README、package 的 `private`/publish 信息、部署配置，以及认证、数据库、外部 API、付款、迁移或不可逆操作迹象。

不要把公开仓库、存在 deploy 文件或“未来要上网”误判为当前公开产品。若没有外部动作，可暂按 Personal + Local 工作并记录假设；首次分享、部署或出现高风险能力前再确认。

只有歧义会改变必需证据或授权边界时才一次问清：

> 这个结果目前只给你本机用、给固定几个人用，还是任何人都能访问/安装？它会接触登录、敏感数据、付款或不可逆操作吗？

用户回答后不重复询问，只有 Profile drift 才更新。建议在 `.ai-workflow/PROJECT.md` 保存：

```markdown
## Project Profile
- Audience now: personal | controlled | public
- Exposure now: local | internal | internet
- Delivery now: source | shared-artifact | public-release
- System shape: single-runtime | multi-component | graph-managed
- Risk modifiers: none | auth | sensitive-data | money | migration | concurrency | irreversible | untrusted-input | other
- Basis: <project facts or user answer>
- Next promotion: <optional planning note; not current Ticket requirements>
```

`System shape` 只帮助 worker 在当前 Ticket 选择 exact、package-affected 或 graph-affected；具体命令由改动范围和仓库已有能力即时决定，不把容易过期的测试命令固化进 Project Profile。

## 两个时钟

### 每个 Ticket 的自适应 Completion Check

Ticket 只证明当前代码和当前 Profile 下的改变，不因未来公开目标升级。Personal + Local 且无风险修饰时，继续使用现有的一行 `Completion Check`，例如“从真实入口运行一次，看到修改后的结果”，不强迫用户或 agent 填写测试表。

只有 Controlled、Public 或风险修饰使证明理由需要留存时，才扩展成结构化 `Proof`：

```markdown
## Proof
- Break to catch: <one relevant failure>
- Evidence: <exact smoke, command, or inspection>
- Persistent regression: no | yes — <why>
- Risk delta: <minimum added evidence, only when applicable>
- Stop when: <observable pass condition>
```

Outcome、Acceptance 和 Project Profile 已经记录产品事实、公共边界及使用场景，`Proof` 不重复抄写它们。Product Lead 定义要防止的失败、风险和 stop condition；worker 看过代码后补精确命令。多个独立高风险事实应拆 Ticket 或显式列出，不得悄悄扩成矩阵。

### Promotion/release gate

仅在个人→共享/公开、本地→内网/互联网、源码→制品/发布，或新增高风险能力时触发。它复用仍有效的 Ticket 证据，只补新边界差额：

```markdown
## Promotion Gate
- From / To: <profile transition>
- Reused evidence: <still-valid Ticket commits and proof>
- New exposure/delivery risks: <delta only>
- Target artifact/environment: <exact commit, artifact, destination>
- Required delta proof: <minimum new evidence>
- Release identity: <version/hash/deployed commit when applicable>
- Known-good / rollback: <previous commit and recovery>
- Stop when: <target boundary proven and rollback known>
```

例如，本地 CSS 已预览，首次发给同事只补共享制品启动与目标环境 smoke；内网登录已有允许/拒绝证据，首次上互联网只补不可信入口和真实部署配置。不要重跑全部历史验证。

## Stop condition

满足以下条件立即停止：

- Ticket 验收事实可观察；
- 当前最高风险有一个直接证据；
- 证据来自最终代码，promotion 时则来自最终制品/目标环境；
- 若发生晋升，新增边界差额已证明；
- 没有独立、具体、未解决的发布阻断风险。

覆盖率数字、单元/集成/E2E 层数、浏览器/视口矩阵、可重复运行刚通过且未受后续修改影响的命令，以及“以后可能公开”都不是继续测试的默认理由。测试设施失败时改用项目内最小 smoke；仍无法验证则如实报告，不扩大产品改造。

## MAGA 文件改造清单

1. 新增 `plugins/maga/methods/validation-design/METHOD.md`：推断 Profile；低风险 Ticket 保留一行 Completion Check，只有共享/公开/风险修饰时才扩展 Proof；按系统形态和改动范围选 exact/affected；写 stop condition。
2. 新增 `plugins/maga/methods/promotion-gate/METHOD.md`：只在分享/部署/发布/Profile drift 触发；比较 From/To、复用证据、补差额，纳入最终制品和 rollback。
3. 修改 `plugins/maga/skills/project-lead/references/project-memory.md`：加入 Project Profile；保留单行 `Completion Check` 作为最轻默认值，并允许按需扩展为 Proof；只在晋升时创建 Promotion Gate。
4. 修改 `plugins/maga/skills/project-lead/SKILL.md`：先无感推断；仅实质歧义问一次；未来目标不升级当前 Ticket。
5. 修改 `plugins/maga/methods/to-spec/METHOD.md`：验收边界记录受众、暴露面、交付和具体风险，不预选测试类型矩阵。
6. 修改 `plugins/maga/methods/to-tickets/METHOD.md`：调用 validation-design 选择一行 Completion Check 或结构化 Proof；多个独立高风险事实优先拆分。
7. 修改 `plugins/maga/methods/implement/METHOD.md`：只执行 Ticket Proof；最终代码取一次新鲜证据；发现 drift 转 promotion gate，不静默扩测。
8. 修改 `plugins/maga/skills/project-lead/references/git-and-release.md`：外部制品/部署前调用 promotion gate；保留干净明确 commit、deployed commit、known-good、rollback 和差额证据。
9. 修改 `plugins/maga/skills/project-lead/references/capability-routing.md` 与 `plugins/maga/skill-catalog.json`：登记两个 Internal method；不新增用户需手动启用的 Skill。
10. 在 `test/bundled-skills.test.js` 增加一次聚焦契约验证：用两组对照例覆盖 Personal+Local 与 Public+Internet、Controlled+Internal 权限与大型 Local affected；这是四个代表性决策边界，不是 3×3 矩阵。

最短实现分两个可运行提交：先做 Ticket slice（Profile + validation-design + adaptive Completion Check/Proof），再做 Promotion slice（promotion-gate + release 接入）。每个 slice 只运行一个最直接的现有测试文件或对应 smoke。

## 明确非目标

- 不新增默认 TDD/BDD/ATDD，不自建 runner、覆盖率或 CI 编排器。
- 不自动安装 Nx、Jest、testmon、Scorecard 或扫描器，只复用项目已有设施。
- 不让公开仓库、deploy 配置或项目规模单独触发最高套餐。
- 不让 promotion 目标倒灌到尚未分享的早期 Ticket。
- 不用测试通过替代部署、付款、删除或迁移所需的用户授权。

## 主要一手资料

- [OWASP ASVS 5.0.0：Verification Levels](https://github.com/OWASP/ASVS/blob/v5.0.0_release/5.0/en/0x03-What-is-the-ASVS.md)
- [OWASP SAMM 2.2.0：Security Testing](https://owaspsamm.org/model/verification/security-testing/)；[Control Verification](https://owaspsamm.org/model/verification/requirements-driven-testing/stream-a/)
- [OpenSSF OSPS Baseline 2026-02-19](https://baseline.openssf.org/versions/2026-02-19)
- [SLSA 1.2 Build Requirements](https://slsa.dev/spec/v1.2/build-requirements)
- [Bazel Test Encyclopedia](https://bazel.build/reference/test-encyclopedia)；[Google Test Sizes](https://testing.googleblog.com/2010/12/test-sizes.html)
- [Superpowers 6.2.0 Verification Before Completion](https://github.com/obra/superpowers/blob/v6.2.0/skills/verification-before-completion/SKILL.md)
- [Matt Pocock Skills 1.2.3 TDD](https://github.com/mattpocock/skills/blob/v1.2.3/skills/engineering/tdd/SKILL.md)；[Implement](https://github.com/mattpocock/skills/blob/v1.2.3/skills/engineering/implement/SKILL.md)
- [Nx affected](https://nx.dev/docs/features/ci-features/affected)；[Jest related tests](https://jestjs.io/docs/cli#--findrelatedtests-spaceseparatedlistofsourcefiles)；[pytest-testmon 2.2.0](https://github.com/tarpas/pytest-testmon/releases/tag/2.2.0)
