---
key: T011
status: integrated
authorization: approved
role: project-lead
workspace: delivery
---

# T011: 使用当前宿主能力置顶任务

## What to build

Project Lead 和职责管理任务通过宿主实际提供的操作置顶；不可用时返回准确任务入口，避免虚假成功或重复创建。

## Blocked by

None（可立即开始）

## Acceptance criteria

- [x] 编排指导使用当前 move_thread_to_sidebar_section 的 pinned 分区映射，执行前核对真实工具定义。
- [x] 只有宿主操作成功后才报告已置顶；不可用或失败时保留现有任务并报告准确标题与未完成状态。
- [x] 移除运行时指导中的 set_thread_pinned 旧引用；不机械改名独立的桥接元数据协议。
- [x] 保留任务创建授权、已有任务复用和仓库目录边界。

## Verification

复用 Skill 打包/路由检查做一次定向检查，覆盖可用工具映射与失败回退规则；不创建真实任务来验证文案。

先实现再验证；每个实际改动只做一次直接相关验证。无 TDD、全量回归、双轴 review 或新测试框架。若必须改动权限、并发或迁移边界，先说明具体风险与最小额外验证并等候确认。

## Boundaries

不新建兼容服务、不调整任务创建权限或桥接协议。

## Source

Triage: ready-for-agent. Ticket breakdown and dependencies approved by the Product Owner.

《Codex 能力兼容、轻量工作流与模型建议移除》规格及既有原生子代理接受记录。项目索引提供入口。

## Delivery

通过本 Ticket 的定向验证后提交、合入并推送 main，清理已合并工作分支。复用未受改动影响的已有验证结果，不追加统一全量回归；不发布 npm、网站或 GitHub Release。

## Execution

- Task opening: not-needed
- Implementation: completed on the integration branch
- Completion evidence: Skill routing implemented; focused bundled-skills check passed 14/14. Native host interaction was not exercised.

## Integration

- Integrated into main through PR #1, merge commit `56bc0ee`.
- Validation evidence above is retained; no unaffected checks were repeated.
