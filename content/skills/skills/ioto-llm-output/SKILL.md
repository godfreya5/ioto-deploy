---
name: ioto-llm-output
description: "This skill should be used when the user wants to extract fleeting notes (闪念笔记) into card notes (卡片笔记) in the IOTO vault. It clusters, refines, and deduplicates loose daily jottings by theme into sustainable cards with source backlinks. Supports three run modes: incremental (default), range, full. Triggers: 闪念提取成卡片, 闪念聚类, 卡片化, 提取闪念, ioto-llm-output."
agent_created: true
dateCreated: 2026-08-08 21-25-57
dateModified: 2026-08-08 21-50-33
---

# IOTO LLM Output — 闪念提取成卡片笔记

把一批零散、随意的闪念笔记（命名形如 `{前缀}-{日期}.md`，前缀取自 IOTO Framework Settings 的 `fleetingNotePrefix`，中文默认 `闪念`；「日期」部分由 `fleetingNoteDateFormat` 决定、**格式不固定**）按主题聚类、提炼、去重，归并成可持续生长的卡片笔记（`2-输出/卡片笔记/`）。每张卡片文末用 `[[{前缀}-{日期}]]` 回链来源（即源闪念的**真实文件名**），保证可追溯、可增量。

> 第一版：实现「三模式 + 增量优先」的核心流程，覆盖增量判定、幂等并卡、两遍法聚类、落位与回链。prompt 调优与更复杂的正交主题拆分可后续迭代。

## Vault 根目录（动态获取，勿硬编码）

Vault 根目录**不要写死**，应在运行时动态解析。本技能始终在 Vault 内部运行，因此只需**从当前工作目录向上查找包含 `.obsidian` 设置目录的文件夹，其所在目录即为 Vault 根目录**：

```bash
# 从当前工作目录向上查找 .obsidian，定位 Vault 根目录
vault_root="$(pwd)"
while [ ! -d "$vault_root/.obsidian" ]; do
  parent="$(dirname "$vault_root")"
  [ "$parent" = "$vault_root" ] && break   # 已到文件系统根仍未找到，停止
  vault_root="$parent"
done
echo "Vault 根目录: $vault_root"
```

若使用 obsidian-cli，也可直接以其报告的当前 Vault 为准，无需自行解析路径。

> 本技能下文所有相对路径（如 `2-输出/闪念笔记/`、`2-输出/卡片笔记/`、`0-辅助/IOTO/闪念卡片化状态.md`）均相对于上述动态解析出的 Vault 根目录。

## 闪念命名约定（来自 IOTO Framework Settings）

闪念笔记的命名**不应写死**，全部取自 ioto-settings 插件的用户配置，运行时应动态读取，不要假设固定字符串：

| 配置项 | 含义 | 中文默认值 | 本技能怎么用 |
|--------|------|-----------|-------------|
| `fleetingNoteFolder` | 闪念笔记所在文件夹 | `2-输出/1-闪念笔记` | 作为扫描根目录（下文 `2-输出/闪念笔记/` 仅为示例，实际以该配置为准） |
| `fleetingNotePrefix` | 闪念笔记文件名前缀 | `闪念` | 匹配文件用 `{前缀}-*`；回链 wikilink 为 `[[{前缀}-{日期}]]` |
| `fleetingNoteDateFormat` | 日期部分格式 | `YYYY-MM-DD` | **格式不固定**，仅用于生成新闪念；匹配与回链一律以真实文件名为准 |

关键修正点：

- **文件名 = `{前缀}-{日期}.md`**，如中文默认下为 `闪念-2024-01-01.md`。其中「日期」部分由 `fleetingNoteDateFormat` 决定，**不保证是 `YYYY-MM-DD`**（也可能是 `YYYYMMDD`、`MM-DD`、`DD` 等）。
- **严禁**用 `闪念-YYYY-MM-DD` 这类写死的日期去匹配或回链 —— 这会漏掉非 `YYYY-MM-DD` 格式的闪念。
- **扫描 / 匹配**一律按前缀通配：`{前缀}-*.md`（中文即 `闪念-*.md`），`*` 自然覆盖任意日期格式。
- **回链**一律用源闪念的**真实文件名**（去掉 `.md`）作为 wikilink，如 `[[闪念-2024-01-01]]`；用户改了前缀就把 `闪念` 换成对应前缀、改了日期格式就照搬真实文件名。
- 读取配置：直接读 ioto-settings 的 `data.json`，或运行时通过 obsidian-cli / 插件接口获取设置。

## 硬约束

1. 卡片一律落在 `2-输出/卡片笔记/`，**禁止在其中新建子文件夹**，只写入现有目录。
2. 卡片标题沿用现有命名习惯，含「是什么 / 为什么 / 如何」等关键词（如 `IOTO的学思行框架是什么`）。
3. 内部链接一律用 `[[wikilink]]`，外部链接用标准 Markdown 链接。
4. 每张卡片**必须保留 `## 来源` 小节**，用 `[[{前缀}-{日期}]]`（即源闪念真实文件名，前缀取自 `fleetingNotePrefix`）回链全部派生它的闪念，不可丢失来源。
5. **幂等**：新闪念若匹配到已有卡片，应并入该卡片并追加回链，而不是另起一张新卡。
6. 默认**不改写源闪念笔记**；仅在用户显式要求做可视化兜底时，才在源笔记 frontmatter 加 `cardified: true`。

## 运行模式与参数

本技能不做「全量 / 增量 / 指定范围」三选一，而是做成三种运行模式，**默认增量**：

| 参数 | 取值 | 默认 | 说明 |
|------|------|------|------|
| `scope` | `incremental` / `range` / `full` | `incremental` | 运行模式 |
| `range` | 日期区间 / 文件列表 / 标签 | — | 仅 `scope=range` 时生效，用于指定要处理的闪念范围 |
| `since` | 日期 | 读处理清单里的最后处理时间 | 增量模式的基准；处理该时间之后的闪念 |
| `dryRun` | `true` / `false` | `false` | 只产出「哪些闪念 → 哪张卡」的计划，不改写任何笔记，便于先确认再执行 |
| `outputDir` | 路径 | `2-输出/卡片笔记/` | 卡片落位目录（一般固定） |

三种模式的取舍：

- **`incremental`（默认）**：只处理「处理清单」里缺失的闪念。快、省、幂等，适合日常高频触发。
- **`range`**：用户显式传日期区间 / 文件列表 / 标签，最精准，适合针对性补卡、回溯某段时期。
- **`full`**：全量重扫，看到全局、跨时间主题不漏，适合冷启动或调优 prompt 后的整体重聚。

## 工作流程

### 第 1 步：解析模式与范围

从用户输入或任务参数读取 `scope` / `range` / `since` / `dryRun`。未指定 `scope` 时按 `incremental` 处理。

### 第 2 步：确定待处理闪念集合

- `scope=incremental`：读取处理清单（`0-辅助/IOTO/闪念卡片化状态.md`，模板见 [templates.md](references/templates.md)），挑出清单中**缺失**的闪念，或 `since` 之后新增的闪念。
- `scope=range`：按用户传入的 `range`（日期区间 / 文件列表 / 标签）锁定闪念集合。
- `scope=full`：取闪念文件夹（来自 `fleetingNoteFolder`）下全部 `{前缀}-*.md`（中文即 `闪念-*.md`，`*` 覆盖任意日期格式）。

> 判定「已处理」以**独立处理清单**为权威依据（不靠每次全读目录比对，那是伪增量）。清单缺失或为空时走冷启动流程（见文末）。

### 第 3 步：两遍法聚类（省 token、控粒度）

闪念短、中文、数量多，直接全量丢给模型既贵又易丢主题，故分两遍：

- **第一遍（摘要）**：逐条（或分批）把每条闪念压成**一句话摘要**，保留其核心主题与立场。
- **第二遍（聚类）**：只对这些摘要做聚类归并，按主题分组；同组摘要归为一个潜在卡片主题。

### 第 4 步：幂等并卡

在生成卡片前，先读现有卡片索引（`2-输出/卡片笔记/` 下所有卡片的标题与主题摘要），把每个聚类主题与之匹配：

- **匹配上** → 把新闪念内容并入该卡片，在 `## 来源` 追加 `[[{前缀}-{日期}]]` 回链（用源闪念真实文件名）。
- **匹配不上** → 才新建卡片。

这样每次运行都只在「生长」知识树，而非每轮复制一棵新的。

### 第 5 步：落位与回链

按 [templates.md](references/templates.md) 的卡片模板写入 `2-输出/卡片笔记/{标题}.md`：

- frontmatter 含 `Project`（沿用源闪念 / 活动笔记的 `Project`）。
- 正文围绕一个主题组织，自包含，用清晰结构重写（不是摘抄）。
- 文末 `## 来源` 小节列出全部派生它的闪念 wikilink。

若 `dryRun=true`，本步仅输出「闪念 → 卡片」的映射计划，跳过实际写入。

### 第 6 步：更新处理清单

把本次「闪念 → 卡片」的映射写入 `0-辅助/IOTO/闪念卡片化状态.md`（追加表格行，模板见 [templates.md](references/templates.md)）。记录内容：

- 闪念 wikilink
- 对应卡片 wikilink
- 处理时间

清单是增量判定的权威依据，务必同步更新。

### 第 7 步：汇报

向用户列出：运行模式、本次处理的闪念数、新建 / 更新的卡片清单、复用的既有卡片、处理清单更新情况；`dryRun` 时改报映射计划供确认。

## 冷启动

- 当前已有一批卡片，其 `## 来源` 已写好回链。首跑前可**从这些卡片的来源反向推导出「已处理集合」**，直接回填处理清单，省去手动初始化。
- 之后按 `incremental` 日常运行即可。

