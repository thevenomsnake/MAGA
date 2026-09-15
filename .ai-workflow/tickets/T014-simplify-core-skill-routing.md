---
key: T014
status: integrated
authorization: approved
role: project-lead
workspace: delivery
---

# T014: 精简核心 Skill 并保留已更新的行为

## What to build

Project Lead、Orchestrate Tickets 和 Humanization 通过简洁入口按需加载规则，保留前序 Ticket 的完整行为。

## Blocked by

T010、T011、T012（先固定模型建议移除、置顶和异步提问规则，再整理其共同入口）

## Acceptance criteria

- [x] 三个 description 只保留职责、准确触发条件与必要排除边界；不新注册 Skill。
- [x] 入口保留共同步骤与完成条件，多分支执行细节迁入有明确触发条件的参考，不机械限定字符或行数。
- [x] 保留本地文件触发、聊天输出排除、旧命令兼容与完整审计显式触发。
- [x] 保留前序置顶与异步提问行为、全部模型建议已移除的边界、Ticket 授权和已有任务复用。
- [x] 保留只读子代理与独立任务的区别、宿主创建任务限制、来源和资源保护、一次定向验证。

## Verification

复用现有 Skill 打包/路由检查做一次直接相关验证，覆盖参考可达及关键触发/授权规则；不重跑未被修改影响的桥接或配置测试。

先实现再验证；每个实际改动只做一次直接相关验证。无 TDD、全量回归、双轴 review 或新测试框架。若必须改动权限、并发或迁移边界，先说明具体风险与最小额外验证并等候确认。

## Boundaries

不扩张至其他 Skill，不新增模型建议、权限、审计门禁或完整 Humanization manifest。

## Source

Triage: ready-for-agent. Ticket breakdown and dependencies approved by the Product Owner.

《Codex 能力兼容、轻量工作流与模型建议移除》规格及既有原生子代理接受记录。项目索引提供入口。

## Delivery

通过本 Ticket 的定向验证后提交、合入并推送 main，清理已合并工作分支。复用未受改动影响的已有验证结果，不追加统一全量回归；不发布 npm、网站或 GitHub Release。

## Execution

- Task opening: not-needed
- Implementation: complete; three core entries now route to scoped supporting references.
- Completion evidence: bundled Skill checks 15/15, affected initialization routing checks 2/2, and native execution-shape check 1/1 passed. Prior configuration and bridge results reused; no full regression.

## Integration

- Integrated into main through PR #1, merge commit `56bc0ee`.
- Validation evidence above is retained; no unaffected checks were repeated.
