---
key: T010
status: integrated
authorization: approved
role: project-lead
workspace: delivery
---

# T010: 删除全部模型选择建议并默认继承宿主

## What to build

从设置面板、配置接口到任务创建及所有公开资料，彻底移除模型推荐体系；未显式配置时继承宿主，已保存的用户选择继续有效。

## Blocked by

None（可立即开始）

## Acceptance criteria

- [x] 删除职责推荐值、套餐/额度/质量预设、推荐按钮与标签，以及接口返回的预设字段；同时删除失去调用方的实现。
- [x] 未配置与部分配置中的未设置职责显示继承宿主默认值，创建任务时省略相应 overrides；保存操作不把未设置职责补成具体模型。
- [x] 保留旧的完整显式配置与用户主动使用的中性配置入口；支持未配置职责的继承状态而不重置旧配置，不自动改写外部配置文件。
- [x] 中性模型列表只显示宿主实际支持的选项，不标首选、不做推荐排序；拒绝显式配置时保留原有有界回退，只说明事实。
- [x] 同步清理 README、全部语言指南、网站源文件、MCP 说明、Skill、模板及公开研究/设计资料中的选型建议，不重写 Git 历史。
- [x] 保留协议必需的模型标识与测试样例，取消任何新增推荐预设计划。

## Verification

复用现有职责配置与设置面板接口，完成一次定向验证，覆盖未配置继承、部分配置继承、旧显式配置保留与不再返回推荐；加一次仅针对模型建议的公开内容检索。

先实现再验证；每个实际改动只做一次直接相关验证。无 TDD、全量回归、双轴 review 或新测试框架。若必须改动权限、并发或迁移边界，先说明具体风险与最小额外验证并等候确认。

## Boundaries

不发布网站、不升级宿主、不改既有任务；无外部配置迁移、权限或并发改造。

## Source

Triage: ready-for-agent. Ticket breakdown and dependencies approved by the Product Owner.

《Codex 能力兼容、轻量工作流与模型建议移除》规格及既有原生子代理接受记录。项目索引提供入口。

## Delivery

通过本 Ticket 的定向验证后提交、合入并推送 main，清理已合并工作分支。复用未受改动影响的已有验证结果，不追加统一全量回归；不发布 npm、网站或 GitHub Release。

## Execution

- Task opening: authorized implementation in a repository-local worktree.
- Implementation: removed recommendation defaults, presets, UI guidance and localized public guidance; missing fields inherit the host and explicit settings remain intact.
- Completion evidence: `node --test test/compute-profiles.test.js test/mcp-settings.test.js` passed 12/12. One directed content search covered runtime, bundled skills, README/guides, website, templates and public research. Remaining model mentions are removal requirements, prohibited-advice rules, or historical benchmark evidence; no active model recommendation remains. Settings UI script syntax and MCP resource/snapshot were checked; this was not a real desktop end-to-end run.

## Integration

- Integrated into main through PR #1, merge commit `56bc0ee`.
- Validation evidence above is retained; no unaffected checks were repeated.
