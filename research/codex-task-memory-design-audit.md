# Codex Task 与项目记忆设计审计

> 审计日期：2026-08-25
>
> 研究问题：Codex App Server 对 thread/task 创建、命名、pin、续发、等待、归档、上下文注入和权限边界提供什么真实能力；成熟开源项目如何持久化项目 memory、设计决策和上下文恢复；MAGA 当前实现有哪些差距。
>
> 证据边界：OpenAI 部分使用官方 App Server 文档和 `openai/codex` 源码；开源模式只使用项目自己的文档或源码。没有连接真实 App Server，没有把任何运行时 ID、机器路径、账号或 secret 写入本报告。报告中的“建议”是 MAGA 的设计判断，不是平台承诺。

## 结论

MAGA 当前的核心判断仍然正确：**仓库内的项目状态是产品真源，Codex task/thread 只是可替换的注意力工作区。** Codex App Server 会持久化对话、turn、item、线程标题、pin、Git 元数据和部分 host 状态，但它不会理解 MAGA 的 Product Owner 授权、Ticket blocker、验收证据或集成状态。把 App Server transcript 当成项目记忆，会把可替换的运行时重新变成不可审计的产品真源。

最值得处理的差距有四个：

1. `CodexBridge` 用“当前目录 + 精确标题 + 返回列表第一项”认领 Project Lead；官方明确允许重复 thread name，且 `thread/list` 是分页的，因此旧任务或超过一页的任务可能被误认或漏掉。
2. bridge 没有处理 server-initiated approval、permission 或 `requestUserInput` 请求，也没有在 Project Lead 的首次恢复/启动 turn 上显式设定只读 sandbox。提示词说“不要修改文件”不等于权限边界。
3. bridge 把一个固定的 120 秒超时和最多 100 条内存 notification 当成完整生命周期；超时后没有先读取/重连/确认状态，就可能把仍在运行的任务当成失败并创建替代任务。
4. `.ai-workflow` 的产品状态和 Ticket 契约很强，但尚未把“运行状态、摘要边界、来源/父记录、压缩或遗忘证据”形成一个明确的小型恢复协议。应补协议和定向 bridge 行为，不应引入第二套 host memory 数据库。

## 1. OpenAI Codex App Server 的真实能力

### 证据版本与稳定性

本次源码核对固定在 OpenAI 官方 [`openai/codex@3a469a2`](https://github.com/openai/codex/commit/3a469a297daeab77a60c142669262366f344a830)，提交时间为 2026-08-25。官方文档的 Markdown 版本是 [`Codex App Server`](https://developers.openai.com/codex/app-server.md)，对应源码说明在 [`codex-rs/app-server/README.md`](https://github.com/openai/codex/blob/3a469a297daeab77a60c142669262366f344a830/codex-rs/app-server/README.md)。文档要求客户端用自己运行的 Codex 版本生成 schema；生成的 TypeScript/JSON Schema 只保证匹配该版本，而不是所有 App Server 版本都兼容（[官方文档 Message schema](https://developers.openai.com/codex/app-server.md#message-schema)）。

这意味着当前 `main` 的实验字段不能直接当成 MAGA 安装环境的稳定契约。尤其 `projectId`、分页 history、memory mode、goal、additional context 和 permission profile 都应先做能力探测或版本匹配，再决定是否使用。

术语也要分开：当前公开 App Server API 的顶层原语是 `thread`、`turn`、`item`，不是 MAGA 的 Product Ticket 或通用“task”对象。旧版 Codex [protocol v1](https://github.com/openai/codex/blob/3a469a297daeab77a60c142669262366f344a830/codex-rs/docs/protocol_v1.md) 把 task 描述为一次执行中的工作，但它仍属于运行时语义；本报告用“thread/task”只是在对照用户问题时并列说明，不把两者当同一个持久模型。

### 能力矩阵

| 能力 | 官方事实 | 真实限制/风险 | 对 MAGA 的含义 |
| --- | --- | --- | --- |
| 连接与事件 | App Server 是双向 JSON-RPC；默认 stdio JSONL，也支持 Unix socket；WebSocket 明确标为 experimental/unsupported。连接必须先 `initialize`，再发 `initialized`。[协议与握手](https://developers.openai.com/codex/app-server.md#protocol) · [初始化](https://developers.openai.com/codex/app-server.md#initialization) | 未完成握手的请求会被拒绝；请求入口使用有界队列，过载返回 `-32001`，官方要求指数退避加 jitter。[backpressure](https://developers.openai.com/codex/app-server.md#protocol) | MAGA 当前以本地 stdio 启动 bridge 是合理的，不应为了“任务服务”新增网络 server。bridge 应把过载视为可重试状态，而不是普通业务失败。 |
| Thread/turn/item | Thread 是对话，包含多个 turn；turn 包含 item，item（用户消息、agent 消息、命令、文件变更等）会持久化并用于后续上下文。[核心原语](https://developers.openai.com/codex/app-server.md#core-primitives) | 这些是 host 对话事实，不是 Product Ticket、授权或集成事实。一个 thread 的历史也可能被 compaction/rollback 处理。 | 把 thread 当注意力容器；产品状态仍回到 `.ai-workflow`。 |
| 等待 | App Server 没有一个“等待任务完成”的通用持久 RPC；`turn/start` 立即返回初始 turn，客户端持续消费 `turn/started`、item 事件和 `turn/completed`，也可监听 thread status。[生命周期](https://developers.openai.com/codex/app-server.md#lifecycle-overview) · [事件](https://developers.openai.com/codex/app-server.md#events) | 事件流是连接级的；断线、过载或未处理的 server request 不能靠本地 promise 自动补偿。等待必须和 read/list/status reconciliation 分开。 | `waitForTurn` 是 bridge 的本地便利层，不是 Codex 的 durable wait；超时后必须先重新读取远端状态。 |
| 创建 | `thread/start` 创建新 thread，返回对象并发 `thread/started`；可给 `cwd`、model、approval policy、sandbox、personality 等。[start/resume](https://developers.openai.com/codex/app-server.md#start-or-resume-a-thread) | `historyMode: "paginated"` 当前创建仍可能返回 unsupported；已有 paginated 记录的完整读取、turn pagination、resume 也可能 fail closed（同一节）。 | 不把 paginated history 或当前 host 的新字段当 MAGA 必需依赖；默认 legacy/稳定路径并保留降级。 |
| 续发与分支 | `thread/resume` 按 opaque thread ID 重新打开并让后续 `turn/start` 追加；`thread/fork` 复制历史，可用 `lastTurnId` 截断，或 `ephemeral: true` 做内存分支。[API overview](https://developers.openai.com/codex/app-server.md#api-overview) · [fork](https://developers.openai.com/codex/app-server.md#manage-a-thread-goal) | `thread/resume` 本身不更新 recency/modified time；进行中的 fork 边界有拒绝规则；ephemeral thread 不进入持久列表。 | Project Lead replacement 可以使用 fork/resume，但仍要先把 durable state 恢复成功，再切换 canonical task；不能把 fork ID 写入仓库。 |
| 读取与恢复 | `thread/read` 可在不 resume、不订阅事件的情况下读取 stored thread；`thread/turns/list`、`thread/items/list` 可分页读取（后两者 experimental）。[读取与分页](https://developers.openai.com/codex/app-server.md#read-a-stored-thread-without-resuming) | 读取摘要和完整 turns 是不同成本；某些历史模式不支持 full read；未加载 thread 的 runtime status 可能是 `notLoaded`。[thread/list](https://developers.openai.com/codex/app-server.md#list-threads-with-pagination--filters) | 恢复前应 read-only reconcile；不要只凭“列表里看见标题”判断 thread 健康。 |
| 命名 | `thread/name/set` 设置用户可见标题，标题会在后续 list/read/resume 等响应中 hydrate。[官方 Thread 数据结构](https://github.com/openai/codex/blob/3a469a297daeab77a60c142669262366f344a830/codex-rs/app-server-protocol/src/protocol/v2/thread_data.rs#L199-L271) | 标题不是唯一键；官方 App Server README 明确说 thread name 可以重复，按名称查找解析到最近更新的 thread。[命名规则](https://github.com/openai/codex/blob/3a469a297daeab77a60c142669262366f344a830/codex-rs/app-server/README.md#L199-L203) | MAGA 的 deterministic title 是人类识别和辅助筛选，不是唯一身份。必须结合 cwd/project/来源、pin、状态和 durable Ticket attempt。 |
| Pin 与列表 | `thread/list` 支持 cursor、archived、isPinned、cwd、searchTerm、sourceKinds 等过滤；`thread/metadata/update` 可更新持久 `isPinned` 和 `gitInfo`。[列表](https://developers.openai.com/codex/app-server.md#list-threads-with-pagination--filters) · [metadata](https://developers.openai.com/codex/app-server.md#update-stored-thread-metadata) | list 默认分页；`searchTerm` 是标题片段筛选，不是唯一约束。列表顺序和最近更新不能替代 durable reconciliation。 | bridge 需要 cursor 处理和重复候选判定；pin 是 host UI 元数据，不是 Product Lead 的授权状态。 |
| 归档与删除 | `thread/archive` 把持久 JSONL 移入 archived 目录，并尝试归档 spawned descendants；`thread/unarchive` 可恢复；`thread/delete` 是永久删除。[归档](https://developers.openai.com/codex/app-server.md#archive-a-thread) · [删除](https://developers.openai.com/codex/app-server.md#delete-a-thread) · [恢复](https://developers.openai.com/codex/app-server.md#unarchive-a-thread) | archive/delete 可能涉及子 thread；delete 不可逆，archive 不是 Ticket 集成记录。 | 先写入 Ticket 的 integrated/deferred/superseded 证据，再 archive；永远不要用 delete 代替项目状态迁移。 |
| Compaction/rollback | `thread/compact/start` 异步触发历史压缩；`thread/rollback` 已 deprecated，会写 rollback marker；`thread/inject_items` 可把 raw Responses items 追加到 loaded thread 的模型可见历史。[线程 API](https://developers.openai.com/codex/app-server.md#threads) | 压缩会改变上下文视图；rollback 将被移除；inject 只适合 loaded thread，且 raw item 不是产品事实账本。 | 需要可追溯的本地摘要/边界记录时再调用；不要把 host compaction 当成决策归档。 |
| Goal | `thread/goal/set/get/clear` 提供一个持久 goal；官方例子包含 objective、status、token budget，并发更新通知。[goal](https://developers.openai.com/codex/app-server.md#manage-a-thread-goal) | objective 非空且最多 4,000 字符；替换 objective 会重置 usage accounting；goal 属于 thread，不能替代多个 Ticket。[goal 限制](https://developers.openai.com/codex/app-server.md#manage-a-thread-goal) | 可把当前 Ticket 的短目标镜像到 Project Lead，不能把它当项目真源或跨 thread 的决策库。当前 bridge 未使用它。 |
| Host memory | 当前官方 App Server API overview 列出 `thread/memoryMode/set` 与 `memory/reset`，均为 experimental；reset 清理 host `CODEX_HOME/memories` 并重置 sqlite 阶段数据。[官方 API overview](https://github.com/openai/codex/blob/3a469a297daeab77a60c142669262366f344a830/codex-rs/app-server/README.md#L180-L187) | 这是 host 级 memory 生命周期，不是仓库中的 MAGA project memory；experimental 语义和存储位置不应成为公开项目契约。 | 不接入为第二真源。若未来使用，只做明确 opt-in 的辅助能力，并保留 repo 记录。 |
| 上下文输入 | `turn/start` 接受 text/image 等 input；`turn/steer` 可把输入追加到活动 turn；`thread/inject_items` 可追加持久、模型可见的 raw items；`additionalContext` 是 experimental source-keyed fragments。[turns](https://developers.openai.com/codex/app-server.md#turns) · [inject](https://developers.openai.com/codex/app-server.md#inject-items-into-a-thread) · [protocol schema](https://github.com/openai/codex/blob/3a469a297daeab77a60c142669262366f344a830/codex-rs/app-server-protocol/src/protocol/v2/turn.rs#L49-L121) | steer 只能作用于活动 turn，且不能带 turn-level overrides；additional context 需要 experimental opt-in，注入内容进入模型历史，不自动成为产品事实。 | Project Lead 首次恢复应继续使用 repository-relative pointers；不把大段 Ticket/聊天复制进 host transcript。需要注入时应标记来源、用途和是否 untrusted。 |
| 权限与审批 | turn/thread 可设置 approval policy、sandbox policy 或（experimental）named permission profile；命令、文件变更、permission request 可能触发 server-initiated JSON-RPC 请求，客户端必须回复决定。[turn/start](https://developers.openai.com/codex/app-server.md#start-a-turn) · [approvals](https://developers.openai.com/codex/app-server.md#approvals) | “模型被提示不要写”不等于拒绝权限。`thread/shellCommand` 明确绕过 thread sandbox，只应暴露给明确用户发起的命令。[shell command](https://developers.openai.com/codex/app-server.md#run-a-thread-shell-command) | bridge 若继续拥有启动/恢复 turn，必须设定最小权限或实现 server-request handler；否则应把 bridge 限制为只做生命周期控制并让宿主 UI 处理审批。 |
| 实验面 | 客户端必须在 initialize 中声明 `capabilities.experimentalApi: true` 才能使用实验 method/field；否则 server 拒绝。[Experimental API opt-in](https://developers.openai.com/codex/app-server.md#experimental-api-opt-in) | `main` 的新字段会先于发行版；没有 capability probe 就不能可靠区分“字段未知”和“真正失败”。 | MAGA 不应为了 memory/project APIs 全面开启 experimental；按具体需求、版本和回退路径逐项启用。 |

### 权限边界的关键事实

OpenAI 文档明确规定，命令执行和文件变更的 approval 请求是**服务端主动发给客户端的 JSON-RPC request**，请求包含 thread/turn 作用域，客户端回复后 turn 才继续（[Approvals](https://developers.openai.com/codex/app-server.md#approvals)）。这不是普通 notification。当前 [`CodexBridge`](../src/codex-bridge.js) 的 JSONL 读取器只处理“有 id 且没有 method”的 response，以及把有 method 的消息放进 notification 缓存；它没有向 App Server 回送 server request 的结果。因此，只要 Project Lead 的 turn 触发需要审批的命令、文件变更或 `requestUserInput`，bridge 可能一直等待到本地 timeout，而不是完成一次可审计的人工门。

官方还警告非 loopback WebSocket 在 rollout 期间默认可能没有认证，远程使用必须配置 auth/TLS；MAGA 当前启动本地 stdio，不应因为任务编排而新增远程监听（[官方 Protocol](https://developers.openai.com/codex/app-server.md#protocol)）。

## 2. 可借鉴的一手项目模式

### LangGraph：checkpoint 与长期 store 分层

LangGraph 的 [`langgraph-checkpoint` README](https://github.com/langchain-ai/langgraph/blob/38031739e551638e373fb553453256c23feeb41f/libs/checkpoint/README.md#L17-L67) 把 checkpoint 定义为每个 graph superstep 的状态快照；`thread_id` 是一系列 checkpoint 的隔离主键，`checkpoint_id` 可从 thread 中点恢复或 time-travel；失败 superstep 的 `pending writes` 让已经完成的节点不必重跑。其 `BaseCheckpointSaver` 接口要求显式的 put/get/list/delete_thread 语义。

同一项目的 [`BaseStore`](https://github.com/langchain-ai/langgraph/blob/38031739e551638e373fb553453256c23feeb41f/libs/checkpoint/langgraph/store/base/__init__.py#L708-L725) 明确把跨 threads/conversations 的长期 memory 作为另一层，使用层级 namespace、key、get/put/search/list；TTL 默认关闭，需显式启用。

**对 MAGA 的可借鉴点：**

- 明确区分 `project memory`（PROJECT、决策、Ticket、证据）和 `run/attention memory`（当前 Codex thread、turn、等待状态）。
- 当需要恢复、复制或压缩时，记录 source、step/attempt、parent 和边界，而不是只留下一个最新摘要。
- 长期 memory 的删除/导出语义应显式存在，但不必现在实现向量搜索或异步 checkpoint。

**不应照搬：** LangGraph 的 checkpoint graph、delta channel、异步 saver 和向量/TTL store 对 MAGA 当前文件型项目过重；MAGA 也不应把运行时 thread ID 写入公开仓库。

### OpenHands：tail + 增量、稳定事件 ID 和压缩协议

OpenHands 当前源码的 [`use-conversation-history.ts`](https://github.com/All-Hands-AI/OpenHands/blob/150e76046db026dd944df0506642dc9b7b99391e/src/hooks/query/use-conversation-history.ts#L6-L97) 首次只取最近 50 条（服务端上限 100），按时间倒序取 tail 后恢复为 chronological；向上滚动用 `next_page_id` 取旧页，WebSocket 用最新时间戳的 `since` 模式避免重复回放。缓存、focus/reconnect 和有限 retry 的策略也被写在源码注释中。

其 [`use-event-store.ts`](https://github.com/All-Hands-AI/OpenHands/blob/150e76046db026dd944df0506642dc9b7b99391e/src/stores/use-event-store.ts#L20-L205) 显式记录 `loadedConversationId`；普通事件按稳定 event ID 去重，streaming delta 单独合并，乱序时间戳重新排序，切换 conversation 时原子清空并绑定新 identity。

其 [`condensation-event.ts`](https://github.com/All-Hands-AI/OpenHands/blob/150e76046db026dd944df0506642dc9b7b99391e/src/types/agent-server/core/events/condensation-event.ts#L1-L48) 的压缩事件保留被遗忘事件 ID、可选 summary 和 summary offset；这使“上下文缩短了什么”仍可追踪。

**对 MAGA 的可借鉴点：** 恢复时先读取最近 durable state，再接增量；用稳定 Ticket/attempt/event 语义去重；长历史压缩要保留 summary、边界和被压缩对象的来源。

**不应照搬：** OpenHands 的 Zustand/WebSocket/cloud proxy 双 host 结构是前端产品实现，不应成为 MAGA 的第二个任务服务；压缩摘要不能覆盖原始规范性事实。

### Aider：相关项目地图与可逆摘要

Aider 的 [`repomap.md`](https://github.com/Aider-AI/aider/blob/5dc9490bb35f9729ef2c95d00a19ccd30c26339c/aider/website/docs/repomap.md#L1-L83) 用全仓库符号/依赖地图和 token budget 选择与当前请求最相关的文件，而不是每次把整个仓库塞入 prompt。其 [`context_prompts.py`](https://github.com/Aider-AI/aider/blob/5dc9490bb35f9729ef2c95d00a19ccd30c26339c/aider/coders/context_prompts.py#L5-L64) 要求先列已有文件/符号和外部依赖，避免分析阶段凭空创建对象。

Aider 的持久聊天恢复与摘要逻辑在 [`base_coder.py`](https://github.com/Aider-AI/aider/blob/5dc9490bb35f9729ef2c95d00a19ccd30c26339c/aider/coders/base_coder.py#L510-L524) 与 [`history.py`](https://github.com/Aider-AI/aider/blob/5dc9490bb35f9729ef2c95d00a19ccd30c26339c/aider/history.py#L7-L123)：达到 token 阈值才摘要，保留尾部；异步摘要只有在源消息未变化时才替换，失败则保留完整历史并告警。

**对 MAGA 的可借鉴点：** Project Lead 恢复前可以使用一个小型、稳定的 project map（PROJECT、active Tickets、当前决策、关键指针），再按当前问题裁剪；摘要必须是超预算后的可追溯缓存，不是新真源。

**不应照搬：** tree-sitter、NetworkX、每次请求全仓扫描和后台摘要线程都超过 MAGA 当前需要；先用现有 repository-relative pointers 和明确的摘要边界。

## 3. MAGA 当前差距

### 已经做对的部分

1. [`project-memory.md`](../plugins/maga/skills/project-lead/references/project-memory.md) 把 `PROJECT.md` 定义为小型 current-state index，把角色、Ticket、decision、release 和 archive 按需分层；同时明确禁止把 chat transcript、task/host ID、用户名、绝对路径和 worktree 作为项目记忆（见其 Minimal Layout）。这与 LangGraph 的“长期 store 与运行 checkpoint 分层”方向一致。
2. Ticket 已记录 `authorization`、`status`、`Task opening`、`Attempt`、Git baseline、validation、result commit 和 blocker；这比只保存对话摘要更接近可重建的 closure record。
3. [`native-codex-loop.md`](../plugins/maga/skills/project-lead/references/native-codex-loop.md) 已要求先读 durable state、列当前 tasks、按 deterministic title reconcile、完成 integration 后 archive，并明确不持久化 thread/host/client IDs 或 wait cursor。
4. [`projectLeadPrompt`](../src/codex-bridge.js) 的 onboarding/recovery 首 turn 要求只读恢复、禁止修改文件/派发任务/外部动作；产品界面也仍是 Codex task，不额外创建 dashboard 或 App Server service。

### 具体缺口

#### A. Bridge 的 thread 认领不是强身份匹配

[`CodexBridge.listThreads`](../src/codex-bridge.js) 只传 `cwd`、标题片段、`archived: false`、最多 50 条和 sourceKinds，然后 `launchProjectLead` 用 `find(thread.name === title)` 取第一项。官方允许同名 thread，且 `thread/list` 支持 cursor 分页；因此以下情况都没有明确处理：

- 同一目录有同名旧 Project Lead、replacement 或残留失败任务；
- 目标 thread 不在第一页；
- thread 已 archived 但应 unarchive/resume，而不是新建；
- 候选 status 是 active、waiting approval、system error 或 notLoaded；
- 列表返回顺序变化导致不同任务被认领。

这与 MAGA 自己的“deterministic title 不是运行时 ID、worker 可替换”原则并不矛盾，但 bridge 需要实现更严格的 reconciliation：分页查询、读取候选元数据、区分 canonical/attempt、确认状态后再 pin 或创建。

#### B. 首次 Project Lead turn 没有显式权限配置

[`createThread`](../src/codex-bridge.js) 只传 `cwd` 和 model，首次 [`sendMessage`](../src/codex-bridge.js) 只传 model/effort。没有传 `approvalPolicy`、`sandbox`/`sandboxPolicy`、permission profile 或 read-only roots。当前 prompt 的“不要写文件”是行为要求，不是 host 权限限制；如果 host 默认允许 workspace write，bridge 自己又不处理审批 request，就会出现“既没有明确拒绝，也没有明确批准”的不完整边界。

最小修复方向应二选一：

- bridge 继续负责 onboarding/recovery turn：传明确的只读/无外部副作用策略，并对任何 server request fail closed、返回 needs-decision；
- bridge 只负责创建/命名/pin，不主动发需要工具的首 turn，把审批和用户输入交给已打开的宿主 UI。

不要仅靠加长 prompt 来解决权限问题。

#### C. 事件等待与错误恢复不够 durable

[`waitForTurn`](../src/codex-bridge.js) 只等待匹配的 `turn/completed`，notification 缓存最多 100 条，bridge 默认 timeout 为 120 秒。它没有：

- `turn/started`、`thread/status/changed`、approval/requestUserInput 的状态机；
- reconnect 后从 `thread/read`/turn pagination 补齐事件；
- backpressure `-32001` 的退避；
- timeout 后先确认 thread/turn 是否仍 active，再决定 retry/archive；
- 区分“RPC 请求超时”和“长 turn 仍在运行”。

这会让一次网络/宿主延迟变成重复 task 或错误 archive。OpenHands 的 tail+增量和稳定 ID 去重、Aider 的“摘要源未变化才替换”都是同一类问题的成熟解法，MAGA 只需吸收其小部分原则。

#### D. Durable project state 缺少压缩/来源协议

当前 `.ai-workflow/PROJECT.md` 有方向、当前状态、角色、active Tickets 和 decisions 索引；它没有要求记录：

- 当前状态摘要对应的来源 Ticket/decision/commit；
- 某次 Project Lead replacement 或 context compaction 覆盖了哪一段历史；
- replacement/attempt 的 parent/supersedes 关系；
- 恢复前最后一次确认的 host 状态与验证时间。

这些不是立即要扩大的 schema。可以先在需要长周期/压缩的 Ticket 中记录一个 repository-relative recovery note；不要为所有项目预生成 `archive/`、向量索引或运行时数据库。

## 4. 建议路线

### P0：保持架构边界，补最小安全语义

1. 把以下映射写进实现设计和后续 Ticket：

   | 层 | 真源 | 可丢失/可重建内容 |
   | --- | --- | --- |
   | Product memory | `.ai-workflow/PROJECT.md`、roles、Tickets、decisions、RELEASES | 无；需 Git 追踪和验收证据 |
   | Runtime attention | Codex thread/turn/item、pin、goal、host status | 可由 deterministic title + project scope + Ticket attempt 重新发现 |
   | Host memory | Codex `CODEX_HOME` memory/compaction | 辅助；不覆盖 Product memory |

2. Project Lead 首次/恢复 turn 的权限边界必须是可验证策略：只读时明确 sandbox/approval，或让宿主 UI 接管所有 server requests。验收应证明没有未授权文件写入、外部动作或隐藏 approval。
3. timeout、archive 和 retry 前先做一次 status/read reconciliation；不能把本地 promise timeout 当成远端 turn failure。

### P1：bridge 的窄增量

当出现对应 Ticket 时，优先实现这些小方法，而不是重写编排层：

- `listThreads` cursor 分页，并支持 `isPinned`/精确 cwd/source 过滤；
- `readThread` 后的候选状态判定，以及 `resumeThread`/`unarchiveThread` 的显式生命周期；
- server-request 分发器：至少识别 approval、file-change approval、permission request、user input；Project Lead 的只读模式对未授权请求 fail closed；
- 将 RPC timeout、turn watchdog 和 retry/backoff 分开；对 `-32001` 做有限指数退避；
- 连接重建后按 thread/read 或 turns/items page 重新 reconcile，而不是依赖旧 notification buffer；
- 对同名候选记录运行时的 chosen candidate 原因，仍不把 ID 写入仓库。

这些改动的最小 smoke 应覆盖：空列表创建、同名旧任务、超过一页列表、archived canonical、turn timeout 后仍 active、server approval request。无需默认全量回归。

### P2：只在真实压力出现时补 memory 协议

当 Project Lead 历史或项目状态确实超过可读范围，再增加一个 repository-relative 的 recovery record，最少包含：

```text
summary source: PROJECT / decision / Ticket / commit
covered boundary: <what the summary replaces or indexes>
current decision: <one accepted fact>
open frontier: <one unresolved question>
supersedes/parent: <repository-relative record or none>
last known good: <commit or artifact, when relevant>
```

保留原始记录，不把摘要写成唯一真源；摘要失败时保持原文。不要现在接入 Codex `memory/reset`、vector search、host project SQLite 或完整 checkpoint graph，除非明确的产品 Ticket 证明仓库文件无法满足恢复需求，并先定义导出、删除、权限和回滚边界。

## 5. 明确不做的事

- 不把 Codex thread ID、turn ID、host ID、client ID、cursor 或 machine path 写进 `.ai-workflow`、README 或公开研究。
- 不把 Codex persisted goal、host memory 或 thread transcript 当 Product Owner 决策、Ticket authorization 或 release evidence。
- 不为“看起来更像平台”而新增 dashboard、常驻 App Server、远程 WebSocket、vector database 或自动 task registry。
- 不全面开启 `experimentalApi`，也不把当前 `main` 的 experimental project/history/memory APIs 当作所有发行版必有。
- 不自动压缩或删除规范性事实；任何 summary/forgotten boundary 都必须保留来源并可回到原文。
- 不在 bridge timeout 后盲目 archive/retry；先观察远端状态并让 durable Ticket 决定是否替代。

## 6. 后续 Ticket 的验收边界

如果要把本审计转成代码 Ticket，最小可验收结果应是：

1. Project Lead 在重复标题、分页列表和 archived/replacement 候选存在时，不会静默认领错误 thread 或创建重复 canonical task。
2. 首次/恢复 turn 的权限策略与 Product Lead 的只读提示一致；任何需要人工决定的 server request 都能停在明确的 needs-decision，而不是超时或默认放行。
3. 连接断开、过载或单次 timeout 后，bridge 能通过 host read/list 与 `.ai-workflow` 状态恢复；不会仅凭本地 timeout 把仍运行的任务标成失败。
4. 所有持久化产品事实仍在 repository-relative `.ai-workflow` 记录，运行时 ID 只留在当前协调上下文。
5. 只运行一组针对上述风险的 focused smoke，并记录 observed behavior；不自动扩张为全量回归或多视口矩阵。

## 7. 针对本次两个诉求的判断

### 7.1 “自动创建新的 chat/task”有必要，但不是无限自治

**结论：必要，且 MAGA 已经拥有最小能力；缺的是可恢复的协调策略和明确的 standing authorization。**

产品价值不在于让 Lead 不停地开 chat，而在于把一个已批准、可独立验收的工作交给新的 attention workspace，同时把最小、可追溯的上下文带过去。新 task 的触发条件应是：独立 artifact/finding、不同 source set、不会冲突的写入、上下文压力，或不同 permission/acceptance boundary。单纯“下一个步骤”仍留在当前 Lead。

建议把主动性分成三层，而不是一个全局开关：

| 层 | Lead 可以自动做什么 | 必须停下来的情况 |
| --- | --- | --- |
| `continue` | 在当前 thread/Goal 内继续当前 Ticket，直到 evidence 或 blocker 明确 | 新产品方向、费用、账号、敏感数据、外部写入、不可逆动作 |
| `dispatch` | 在当前已批准 Ticket 内，自动创建具名 worker，发送 Ticket pointer 和 context packet，等待并收口 | 新 Ticket、扩大的 outcome、冲突写入、需要 Product Owner 判断 |
| `release` | 汇总已集成结果并建议下一步 | 发布、迁移、删除、付款、真实用户开放必须逐项授权 |

项目应保存的是这项 standing policy 的产品表达和限额，例如“允许 MAGA 在当前项目和已批准 Ticket 范围内自动创建最多两个具名 worker；新范围和外部副作用仍需确认”，而不是把权限隐藏在一个永久 `--yolo` 进程里。

### 7.2 “设计持久化”需要单独记录层，但不需要第二个 memory system

当前 `.ai-workflow/PROJECT.md` 是 current-state index，Ticket/decision/role 是工作契约；它还没有一个能表达“产品形状如何演进”的 design record。建议增加一个**惰性**的 repository-local design 层，而不是预生成整套目录：

```text
.ai-workflow/
|-- PROJECT.md                 # 当前索引和主动策略
|-- design/                    # 只有出现设计记录时才创建
|   |-- INDEX.md               # 当前产品形状、入口和记录指针
|   |-- flows/                 # 用户流程、状态和关键转移
|   |-- surfaces/              # 页面/交互表面及其验收证据
|   `-- records/                # D### 设计决定，链接 Ticket/ADR/Prototype
|-- decisions/                 # 难逆的架构/产品决策
|-- tickets/                   # 可执行工作契约
`-- archive/                   # 已完成记录按需归档
```

Design record 只应保存：问题、当前形状、关键状态/流程、不可违背约束、来源证据、接受/废弃状态、supersedes 指针和相关 Ticket/ADR。它不复制完整聊天，不保存 thread ID，不替代 Ticket acceptance，也不把截图或 prototype 的临时意见伪装成决定。

### 7.3 推荐的最小纵向切片

不要一次实现“超级 Agent 平台”。按下面顺序验证真实杠杆：

1. **Coordinator reconciliation**：扩展 bridge/协调能力，支持 cursor 分页、resume/unarchive、同名候选判定、timeout 后 read/status 恢复和有限 backoff。
2. **Context packet**：从 `PROJECT.md`、角色、选定 Ticket、相关 design record 和 completion proof 生成一个 repository-relative pointer 包；worker 默认读源文件，不复制 transcript。
3. **Bounded dispatch policy**：在 Product Owner 明确确认 standing policy 后，允许当前 Lead 在已批准 Ticket 范围内自动创建具名 worker；记录 title/attempt/authorization，不记录 runtime IDs。
4. **Design record**：先只支持一个 `INDEX.md` 和一种 `D###` record，证明 design decision 能被新 Lead 恢复并反向链接到 Ticket；真实压力出现后再增加 flows/surfaces 分类。
5. **Goal integration**：把当前 Ticket 的短目标镜像到 Lead thread 的 persisted Goal，用于同一 thread 的安全 continuation；Goal 过期、暂停或完成时，以 repository Ticket 状态为准。

每一片都应有一个 focused smoke。只有当这些切片证明当前仓库文件无法支撑恢复，才考虑 SQLite/vector/host memory adapter；在此之前它们只会增加第二套真源和权限/删除/导出问题。

### 7.4 不建议采用的“看似超级进化”

- 常驻 App Server daemon 或远程 WebSocket：官方把远程 WebSocket 标为 experimental/unsupported，且引入新的认证和暴露面；本地 stdio bridge + native task tools 足够。
- 把每个设计讨论自动 fork 成 chat：fork 会带入已完成历史，可能重新带入被拒绝路径；默认应新建 fresh thread，只传 durable pointers。只有用户明确要保留上下文时才 fork。
- 全局 `MEMORY.md`、自动向量化和 transcript 自动摘要：它们把缓存误当真源，且无法表达 Ticket authorization、阻塞边和 acceptance evidence。
- 让 Lead 自动批准审批请求：server-initiated approval 必须回到宿主/用户授权；主动性不能跨越权限 seam。

这条路线把“更主动”定义为**更少地让 Product Owner 搬运上下文，更严格地在边界处停下**，而不是让系统拥有不受限的后台权限。

## 来源索引

### OpenAI / Codex

- [Codex App Server 官方文档（Markdown）](https://developers.openai.com/codex/app-server.md)
- [官方 App Server README，固定 commit `3a469a2`](https://github.com/openai/codex/blob/3a469a297daeab77a60c142669262366f344a830/codex-rs/app-server/README.md)
- [官方 thread protocol schema](https://github.com/openai/codex/blob/3a469a297daeab77a60c142669262366f344a830/codex-rs/app-server-protocol/src/protocol/v2/thread.rs)
- [官方 thread data schema](https://github.com/openai/codex/blob/3a469a297daeab77a60c142669262366f344a830/codex-rs/app-server-protocol/src/protocol/v2/thread_data.rs)
- [官方 turn schema（additional context、权限和 input）](https://github.com/openai/codex/blob/3a469a297daeab77a60c142669262366f344a830/codex-rs/app-server-protocol/src/protocol/v2/turn.rs)
- [官方 commit `3a469a2`](https://github.com/openai/codex/commit/3a469a297daeab77a60c142669262366f344a830)

### Mature open-source primary sources

- [LangGraph checkpoint README](https://github.com/langchain-ai/langgraph/blob/38031739e551638e373fb553453256c23feeb41f/libs/checkpoint/README.md#L17-L67)
- [LangGraph `BaseCheckpointSaver`](https://github.com/langchain-ai/langgraph/blob/38031739e551638e373fb553453256c23feeb41f/libs/checkpoint/langgraph/checkpoint/base/__init__.py#L176-L206)
- [LangGraph `BaseStore`](https://github.com/langchain-ai/langgraph/blob/38031739e551638e373fb553453256c23feeb41f/libs/checkpoint/langgraph/store/base/__init__.py#L708-L725)
- [OpenHands history loader at commit `150e760`](https://github.com/All-Hands-AI/OpenHands/blob/150e76046db026dd944df0506642dc9b7b99391e/src/hooks/query/use-conversation-history.ts#L6-L97)
- [OpenHands event store](https://github.com/All-Hands-AI/OpenHands/blob/150e76046db026dd944df0506642dc9b7b99391e/src/stores/use-event-store.ts#L20-L205)
- [OpenHands condensation event](https://github.com/All-Hands-AI/OpenHands/blob/150e76046db026dd944df0506642dc9b7b99391e/src/types/agent-server/core/events/condensation-event.ts#L1-L48)
- [Aider repo map](https://github.com/Aider-AI/aider/blob/5dc9490bb35f9729ef2c95d00a19ccd30c26339c/aider/website/docs/repomap.md#L1-L83)
- [Aider context analyst prompt](https://github.com/Aider-AI/aider/blob/5dc9490bb35f9729ef2c95d00a19ccd30c26339c/aider/coders/context_prompts.py#L5-L64)
- [Aider persistent chat restore](https://github.com/Aider-AI/aider/blob/5dc9490bb35f9729ef2c95d00a19ccd30c26339c/aider/coders/base_coder.py#L510-L524)
- [Aider history summarization](https://github.com/Aider-AI/aider/blob/5dc9490bb35f9729ef2c95d00a19ccd30c26339c/aider/history.py#L7-L123)

### MAGA files reviewed

- [`src/codex-bridge.js`](../src/codex-bridge.js)
- [`src/init-project.js`](../src/init-project.js)
- [`.ai-workflow/PROJECT.md`](../.ai-workflow/PROJECT.md)
- [`project-memory.md`](../plugins/maga/skills/project-lead/references/project-memory.md)
- [`native-codex-loop.md`](../plugins/maga/skills/project-lead/references/native-codex-loop.md)
- [`orchestrate-tickets/SKILL.md`](../plugins/maga/skills/orchestrate-tickets/SKILL.md)
