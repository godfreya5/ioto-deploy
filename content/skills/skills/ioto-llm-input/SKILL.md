---
name: ioto-llm-input
description: "This skill should be used when the user provides an article, web page URL, PDF, Word, PPT, or other source material and wants it organized into the IOTO vault (LLM Wiki style ingestion). It cleans the source into a raw-material note in 1-输入/1-原始资料, splits it into atomic fragment notes in 1-输入/2-碎片笔记 with bidirectional wikilinks, and appends links to the project's weekly task list. Triggers: 拆分这篇文章, 梳理这个网页/PDF/文档, 内容入库, 碎片化, LLM输入, ioto-llm-input."
agent_created: true
---

# IOTO LLM Input — 资料梳理与碎片化入库

把用户提供的任意来源内容（文章、网页、PDF、Word、PPT、纯文本）梳理后按 IOTO 目录架构入库：

- **原始资料**（清洗后的全文）→ `1-输入/原始资料/`
- **碎片笔记**（拆分出的原子概念）→ `1-输入/碎片笔记/`
- 两者之间建立**双向 wikilink**

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

> 本技能下文所有相对路径（如 `1-输入/原始资料/`、`1-输入/碎片笔记/`）均相对于上述动态解析出的 Vault 根目录。

## 硬约束

1. 禁止在 `1-输入/` 下新建任何子文件夹，只能写入现有的 `原始资料` 和 `碎片笔记`。
2. 笔记标题使用描述性名称，**不加日期前缀**（跟随目录内现有命名风格，如 `Airtable+AI.md`、`5W2H模型.md`）。
3. 内部链接一律用 `[[wikilink]]`，外部链接用标准 Markdown 链接。
4. 创建碎片笔记前必须先查重，避免与现有笔记重复。

## 工作流程

### 第 1 步：获取并清洗内容

按来源类型选择工具：

| 来源            | 处理方式                                               |
| ------------- | -------------------------------------------------- |
| 网页 URL        | 优先加载 `defuddle` skill 提取干净 markdown；不可用时用 WebFetch |
| PDF<br>(.pdf) | 加载 `pdf` 或 `pdfkit-py` skill 提取文本                  |
| Word (.docx)  | 加载 `docx` skill 读取内容                               |
| PPT (.pptx)   | 加载 `pptx` skill 读取内容                               |
| 纯文本/粘贴的文章     | 直接使用                                               |

清洗要求：去掉导航、广告、页眉页脚等噪音；保留标题层级、列表、代码块、表格；图片仅在有信息量时保留外链。

### 第 2 步：确定归属项目

1. 用 obsidian-cli 读取当前打开笔记的 `Project` 属性（不带 `file=` 参数即作用于活动文件）：
   ```bash
   obsidian read
   ```
   从其 frontmatter 中取 `Project` 值。
2. 若活动笔记没有 `Project` 属性或读取失败，询问用户归属哪个项目（项目列表见 `3-任务/` 下的目录名）。

### 第 3 步：创建原始资料笔记

写入 `1-输入/原始资料/{描述性标题}.md`，模板见 [templates.md](references/templates.md)。要点：

- frontmatter 含 `Project: ["项目名"]`；有来源 URL 时加 `SourceURL`
- 正文为清洗后的全文
- 末尾预留 `## 碎片笔记` 小节，第 5 步回填 wikilink 清单

### 第 4 步：拆分碎片笔记

按 LLM Wiki / 原子笔记原则拆分，详细原则见 [templates.md](references/templates.md)。核心规则：

- **一个概念一条笔记**：概念、模型、方法、函数、结论、案例均可独立成条
- **自包含**：脱离原文也能单独读懂
- **标题即概念名**：如 `5W2H模型`、`Dataview中的日期函数`，可直接作为 wikilink 被引用
- **数量适度**：一篇来源通常拆 3–10 条，不为拆而拆；无独立复用价值的内容留在原始资料中即可
- **先查重**：创建前用文件名和关键词搜索 `1-输入/碎片笔记/`，已有同概念笔记时不重复创建，直接引用现有笔记（必要时向其追加补充内容并注明来源）

每条碎片笔记写入 `1-输入/碎片笔记/{概念名}.md`，frontmatter 含 `Project`，末尾回链：`来源：[[原始资料标题]]`。

### 第 5 步：回填双向链接

在原始资料笔记的 `## 碎片笔记` 小节列出所有碎片笔记（含复用的既有笔记）：

```markdown
## 碎片笔记

- [[概念A]]
- [[概念B]]
```

### 第 6 步：汇报

向用户列出：原始资料笔记路径、新建的碎片笔记清单、复用的既有笔记、周任务更新情况。
