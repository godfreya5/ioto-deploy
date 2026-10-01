---
Advanced: true
ForOBSync: false
OpenArticle: false
Pro: true
Product: IOTO
Project: 
 - IOTO-V2
dateCreated: 2026-08-29 18-03-17
dateModified: 2026-08-30 20-22-10
---
# IOTO AI 执行任务的设置项速查

> [!info] 写给面对一堆 AI 开关、不知道该动哪个的你
> 设置页里 AI 相关的选项有二十来个，其中大部分保持默认就好。本文按**设置页的分组**把每一项列成「设置页名称 / 默认值 / 作用 / 建议」四栏，方便你照着调。
> 适用版本：2.3.1。

---

## 一句话先记住

> [!tip] 核心结论
> 默认配置已经能跑。真正值得你动的，只有三个**默认关闭**的开关：
> - `aiVerifyDeliverables` 完成验证 —— 建议**常开**，让「做完了」有证据
> - `aiShowCostStatusBar` 成本状态栏 —— 关心花费就开（**设置页暂无开关**，见下文）
> - `aiItemSessionContinuation` 条目级会话续接 —— 迭代型任务（写长文、调代码）开
>
> 其余保持默认即可。**V231 的绝大部分新能力是「写在任务条目里」的语法，设置页里根本没有对应开关**——别去设置页找。

---

## 一、状态栏

| 设置项 | 设置页名称 | 默认 | 建议 |
| --- | --- | --- | --- |
| `aiAgentSwitcherStatusBar` | 在状态栏显示 Agent 切换器 | 开 | 只用一两个 Agent 可以关掉，状态栏更清爽 |
| `aiModeSwitcherStatusBar` | 在状态栏显示任务模式切换器 | 开 | **保持默认**：Legacy / 串行 / 并行一键切换很方便 |
| `aiShowCostStatusBar` | （设置页暂无此项） | 关 | 关心每批花了多少就开，见下文「怎么改」 |

---

## 二、默认 Agent 与模型

| 设置项 | 设置页名称 | 默认 | 建议 |
| --- | --- | --- | --- |
| `aiAgent` | AI Agent | `claude` | 保持；日常用状态栏切换即可 |
| `aiEnabledAgents` | 启用的 Agents | 11 个全开 | 用不到的关掉，路径与模型配置会一起隐藏（数据保留） |
| 各 Agent 路径 | `<Agent> 路径` | 空 | 留空会自动查找；只有装在非标准位置时才手动填 |
| `aiModelSelectMode` | 启用自定义模型选择 | 关（`default`） | 想在状态栏切模型就开；**条目级换模型不依赖它** |
| `aiAgentModelLists` / `aiActiveModel` | 每个 Agent 的模型清单 / 当前模型 | 内置清单 | 按你的订阅增删，并设一个常用模型为默认 |

> [!note] 「启用自定义模型选择」管的是全局
> 它只影响**状态栏的模型切换器**。想给单条任务换模型，直接在条目上写 `#ioto/model/<id>` 或 `[model:: <id>]` 就行（见 [[S3-如何为单条任务指定不同的Agent和模型]]）。

---

## 三、会话与日志

| 设置项 | 设置页名称 | 默认 | 建议 |
| --- | --- | --- | --- |
| `aiSkillName` | Skill 名称 | `obsidian-task-executor` | 换成自研 Skill 才改 |
| `aiLogEnabled` | 写入日志文件 | 关 | 排查问题时临时打开 |
| `aiDebugLog` | 调试控制台日志 | 关 | 同上，日志会更啰嗦 |
| `aiBypassPermissions` | 绕过 Agent 权限模式 | 开 | **保持默认**：关掉后 AI 会频繁等你点确认 |
| `continueSessionDefault` | 默认启用 Session 延续 | 关 | 想让整份任务文件共用一个会话才开 |
| `aiItemSessionContinuation` | 条目级会话续接 | 关 | **迭代型任务建议开**；也可在任务文件 frontmatter 写 `ItemSessionContinuation: true` 只对这一批生效 |
| `aiItemInternalFanout` | 条目内部 fan-out | 关 | 大多用条目上的 `#ioto/fanout` 单独开，更精准 |
| `sessionTTLDays` | Session 保留天数 | 7 | 保持（0 = 永不清理） |
| `claudeTimeoutMinutes` | 超时时间（分钟） | 5 | 长任务调到 10–20 |

---

## 四、任务编排

| 设置项 | 设置页名称 | 默认 | 建议 |
| --- | --- | --- | --- |
| `aiEnableSubtaskOrchestration` | 启用子任务编排 | 开 | **保持默认**；关掉 = Legacy 整份文件当一个任务跑 |
| `aiMaxParallelSubTasks` | 最大并行子任务数 | 3 | 机器好可 4–6；**设成 1 = 串行带记忆**（前向传递上限放宽到 20） |
| `aiMaxTaskTurns` | 最大任务轮数 | 90 | 简单任务 10–30；复杂编排 60–120+；0 = 不限（省略 `--max-turns`） |
| `aiRespectDependencies` | 尊重子任务依赖 | 开 | **保持默认**，否则条目上写的 `depends：` 不生效 |
| `aiIndentDependencies` | 缩进即依赖 | 关 | **保持关闭**：老文件里的偶发缩进会意外改变执行顺序 |
| `aiFeedForwardSubtasks` | 前向传递已完成子任务 | 开 | **保持默认**，后面条目才能看到前面条目的成果 |

> [!note] 最大任务轮数只对部分 Agent 生效
> 仅对支持 `--max-turns` 的 Agent 有效：claude / hermes / codebuddy / qoder / qodercn。

---

## 五、重试与验证

| 设置项 | 设置页名称 | 默认 | 建议 |
| --- | --- | --- | --- |
| `aiRetryFailedSubtasks` | 失败子任务自动重试 | 关 | 长批次**建议开**：AI 的很多失败（漏文件、路径拼错）可自我修复 |
| `aiRetryMaxAttempts` | 每个子任务最大重试次数 | 1 | 保持默认 |
| `aiVerifyDeliverables` | 完成验证：交付物存在性校验 | 关 | **建议常开**：exit 0 且交付物真的存在才打勾 |
| `aiVerifyRequireMtime` | 完成验证：要求交付物有更新（mtime） | 关 | 遇到「读到了但根本没改」再加严这一层 |

---

## 六、章节标题

| 设置项 | 设置页名称 | 默认 | 建议 |
| --- | --- | --- | --- |
| `aiTaskSectionHeadings` | 任务章节标题匹配 | `任务` | 只认**一级标题** `# 任务`；每行一个，可配多个 |
| `aiGoalSectionHeadings` | 目标章节标题匹配 | `目标` | 同上；改了标题名（如 `Goal`）要在这里同步 |

> [!warning] 只匹配一级标题
> `## 任务` 这种二级标题不会被识别。任务清单不在 `# 任务` 下，就一条都跑不起来——这是「文件没反应」最常见的原因。

---

## 七、三个「默认关、建议开」的开关

### 1. `aiVerifyDeliverables` —— 完成验证

- **为什么开**：默认的打勾条件是「AI 进程正常退出」。AI 说「做完了」但笔记根本没建，照样打勾。
- **开了之后**：exit 0 **且** `@[[交付物]]` 标注的笔记真的创建 / 更新，才打勾；没通过会把「交付物缺失」当失败原因，并计入重试预算重跑。
- **验收依据从哪来**：优先取条目里的 `@[[…]]`；没有就回退到条目第一个 wikilink；两者都没有则跳过验证（视为通过）。
- 详见 [[S3-如何让AI的「做完了」真的算数]]。

### 2. `aiShowCostStatusBar` —— 成本状态栏

- **为什么开**：它本身不产生成本——每条的 token 用量已经在控制台输出了。这个开关只是让**最近一次 run 的累计成本**在状态栏空闲时显示出来。
- **怎么开**：设置页暂无此开关，需改配置文件（见下）。
- 详见 [[S3-如何看懂AI执行任务的成本与结果摘要]]。

> [!warning] 改 `data.json` 前先退出 Obsidian
> 1. 完全退出 Obsidian（Obsidian 运行时会把你的改动覆盖掉）；
> 2. 编辑 `<vault>/.obsidian/plugins/ioto-settings/data.json`；
> 3. 把 `"aiShowCostStatusBar": false` 改成 `true`，保存后重新启动。
>
> 改之前建议先备份 `data.json`。

### 3. `aiItemSessionContinuation` —— 条目级会话续接

- **为什么开**：写长文、调代码这类迭代型任务，每次重跑都从零开始，白白重复前面的探索。
- **开了之后**：每个条目以「文件路径 + 行号」为 key 维护自己的 CLI 会话，重跑 / 重试时续接它自己的会话。
- **安全阀**：条目文字改了会自动销毁重建，不会续接到已经改写的旧上下文。
- **不想全局开**：在任务文件 frontmatter 写 `ItemSessionContinuation: true`，只对这一批生效。
- 详见 [[S3-如何让单条任务跨多次执行保持记忆]]。

---

## 八、设置页里没有的能力（别去找了）

V231 的新能力大多是**写在任务条目里的语法**，没有任何设置项：

| 能力 | 怎么写 | 详见 |
| --- | --- | --- |
| 标注交付物 | 条目里写 `@[[笔记]]` | [[S3-如何用ioto标签在一行任务里下达控制指令]] |
| 声明依赖 | `depends：[[前置笔记]]` 或 `#ioto/depends/N` | [[S3-如何让AI按你规定的先后顺序执行任务]] |
| 单条换 Agent / 模型 | `#ioto/agent/<id>` · `#ioto/model/<id>` · `[model:: <id>]` | [[S3-如何为单条任务指定不同的Agent和模型]] |
| 授权 AI 自己拆活 | `#ioto/fanout` / `#ioto/fanout/N` | [[S3-如何让AI自己在一个任务里并行拆解重活]] |
| 写补充要求 | 条目下方缩进续行 | [[S3-如何在任务清单里给单条任务写清楚补充要求]] |
| 预演一批任务 | 命令面板「预演 AI 任务（Dry Run）」 | [[S3-如何在真正执行前先预演一遍AI任务]] |
| 按文件覆盖续接 / fan-out | frontmatter `ItemSessionContinuation` / `ItemInternalFanout` | [[S3-如何把任务文件当成AI的调度台来写]] |

> [!note] 结果摘要展示也是「无开关」的
> 每条任务收尾的「── 结果摘要 · 条目 N ──」是自动打印的，纯展示、零 token 成本，没有开关。

---

## 九、「我该调什么」速查表

| 你的情况 | 改这个 |
| --- | --- |
| AI 说做完了，但笔记根本没变 | 开 `aiVerifyDeliverables`（严重再加 `aiVerifyRequireMtime`） |
| 想知道每批花了多少钱 | 开 `aiShowCostStatusBar`（需改 `data.json`） |
| 写长文 / 调代码，每次重跑都从头探索 | 开 `aiItemSessionContinuation`，或 frontmatter 写 `ItemSessionContinuation: true` |
| 一批任务必须按顺序来 | **别动并行度**，在条目上写 `depends：` |
| 想让整批共享上下文 | 并行度设 1（串行带记忆，前向传递上限 20） |
| 任务卡住不结束 | 调大「超时时间（分钟）」；`aiMaxTaskTurns` 别设太大 |
| 电脑吃不消 / API 限流 | 调小 `aiMaxParallelSubTasks` |
| 长批次里偶尔失败一条 | 开 `aiRetryFailedSubtasks` |
| 任务文件一条都没跑 | 检查是不是用了 `## 任务`，或改 `aiTaskSectionHeadings` |
| 目标没被注入 | 检查 `# 目标` 是不是一级标题，或改 `aiGoalSectionHeadings` |

---

## 延伸阅读

- [[S3-如何把任务文件当成AI的调度台来写]] — 一份任务文件怎么用满这些设置
- [[S3-如何用ioto标签在一行任务里下达控制指令]] — 条目控制标记总表（无设置项）
- [[S3-如何让AI的「做完了」真的算数]] — 完成验证的两个开关
- [[S3-如何看懂AI执行任务的成本与结果摘要]] — 结果摘要与成本账本
- [[S3-如何让单条任务跨多次执行保持记忆]] — 条目级会话续接
- [[S3-如何让AI自己在一个任务里并行拆解重活]] — fan-out 的三级开关
- [[S3-IOTO中AI执行任务功能的三种不同模式]] — Legacy / 串行 / 并行