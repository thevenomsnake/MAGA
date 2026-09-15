---
key: T012
status: completed
authorization: approved
role: project-lead
workspace: delivery
---

# T012: 让普通澄清与独立工作并行推进

## What to build

Project Lead 在宿主支持时用原生异步问题收集偏好，同时继续不依赖答案的工作；答案到达后收敛未完成工作。

## Blocked by

None（可立即开始）

## Acceptance criteria

- [x] 检查异步提问工具是否可用，普通问题优先只问一个；不可用时使用简短普通对话。
- [x] 非阻塞问题待答时可继续独立工作；影响正确性、行为或授权的依赖步骤保持待决。
- [x] 新答案先对照当前 Ticket、已完成事实和未完成工作，再继续；范围变化显式记录，不丢弃答案或擅自扩张。
- [x] 未回复、超时与预选项不构成同意；权限问题继续走宿主审批。
- [x] 文本工具不用于索要文件或截图；桥接未支持的宿主请求保持明确限制，不自动答复。

## Verification

用一个代表性行为示例定向核对规则：偏好待答时继续独立准备，答案到达后调整未完成结果；验证现有权限边界没有被改写。不搭建新框架。

先实现再验证；每个实际改动只做一次直接相关验证。无 TDD、全量回归、双轴 review 或新测试框架。若必须改动权限、并发或迁移边界，先说明具体风险与最小额外验证并等候确认。

## Boundaries

不实现问答 UI、消息队列、桥接输入协议或审批处理器。

## Source

Triage: ready-for-agent. Ticket breakdown and dependencies approved by the Product Owner.

《Codex 能力兼容、轻量工作流与模型建议移除》规格及既有原生子代理接受记录。项目索引提供入口。

## Delivery

通过本 Ticket 的定向验证后提交、合入并推送 main，清理已合并工作分支。复用未受改动影响的已有验证结果，不追加统一全量回归；不发布 npm、网站或 GitHub Release。

## Execution

- Task opening: not-needed
- Implementation: completed on the integration branch
- Completion evidence: Skill routing implemented; focused bundled-skills check passed 14/14. Native host interaction was not exercised.
