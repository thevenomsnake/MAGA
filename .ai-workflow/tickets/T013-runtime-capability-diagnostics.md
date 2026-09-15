---
key: T013
status: ready
authorization: approved
role: project-lead
workspace: delivery
---

# T013: 提供实际桥接版本与能力诊断

## What to build

维护者能经现有桥接获得实际配置命令的版本和有依据的能力状态，辨别宿主差异而无需安装或切换运行程序。

## Blocked by

None（可立即开始）

## Acceptance criteria

- [ ] 通过现有 CodexBridge 接口暴露小型只读诊断结果，说明配置命令身份、版本获取结果与能力依据。
- [ ] 版本来自实际配置命令；读取失败有原因并标为未知，不能借用桌面版本替代。
- [ ] 能力分别表示已确认可用、已确认不可用或未知；用现有握手、工具或模型元数据判断，不因版本新就推断支持。
- [ ] 0.154.0 仅作本轮兼容参考，不是所有功能的硬最低版本；现有子代理白名单、只读与数量限制不变。
- [ ] 诊断不改变配置、不安装、不隐式切换命令；需要但未确认的能力使用现有回退或返回明确限制。
- [ ] 本机路径和运行时标识只留在本次结果，不写入公开持久状态。

## Verification

复用可替换命令与协议测试接口做一次诊断 smoke，覆盖实际命令版本、版本失败及能力三态；明确区分替身证据与真实宿主观察。

先实现再验证；每个实际改动只做一次直接相关验证。无 TDD、全量回归、双轴 review 或新测试框架。若必须改动权限、并发或迁移边界，先说明具体风险与最小额外验证并等候确认。

## Boundaries

不新增 daemon、遥测、自动更新、模型推荐或子代理协议；不变更权限和并发逻辑。

## Source

Triage: ready-for-agent. Ticket breakdown and dependencies approved by the Product Owner.

《Codex 能力兼容、轻量工作流与模型建议移除》规格及既有原生子代理接受记录。项目索引提供入口。

## Delivery

通过本 Ticket 的定向验证后提交、合入并推送 main，清理已合并工作分支。复用未受改动影响的已有验证结果，不追加统一全量回归；不发布 npm、网站或 GitHub Release。

## Execution

- Task opening: pending
- Implementation: not started
- Completion evidence: none
