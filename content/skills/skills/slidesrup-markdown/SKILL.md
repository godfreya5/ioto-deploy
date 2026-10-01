---
name: slidesrup-markdown
description: "将普通 Markdown 笔记转换为 SlidesRup 标准演示幻灯片格式的技能。分析笔记内容，梳理演示大纲，依据 SlidesRup 写作规范生成可直接被 Obsidian Slides Extended 或 Advanced Slides 插件使用的 Markdown 演示文件。适用于需要将知识笔记快速转化为结构化演示文稿的场景。"
agent_created: true
---

# SlidesRup-Markdown

## Overview

将普通 Markdown 笔记转换为 SlidesRup 标准演示幻灯片格式。分析源笔记的内容结构与核心信息，梳理成逻辑清晰的演示大纲，再依据 SlidesRup 写作规范生成标准 Markdown 演示文件——该文件可直接被 Obsidian 的 Slides Extended 或 Advanced Slides 插件渲染为幻灯片。

## When to Use

- 用户要求将某篇 Markdown 笔记转为演示幻灯片 / 演示文稿 / slides
- 用户要求把笔记内容整理成演示大纲并生成 SlidesRup 格式
- 用户提到 SlidesRup、Slides Extended、Advanced Slides 并需要生成演示内容
- 用户要求将知识笔记、会议记录、技术文档等转化为可演示的幻灯片结构

## Workflow

### Step 1: Read and Analyze the Source Note

1. Read the source Markdown note specified by the user.
2. Analyze the content to identify:
   - Core topic and main theme (candidate for H1 presentation title)
   - Natural chapter boundaries (candidate for H2 chapters)
   - Key points and sub-topics within each chapter (candidates for H3 pages)
   - Supporting details, examples, code blocks, images, lists (page content)
   - Any existing structural elements (headings, lists, code blocks, images, tables)
3. Determine the presentation's target audience and purpose from context or user instructions.

### Step 2: Design the Presentation Outline

Before writing any SlidesRup Markdown, design a clear outline:

1. **H1 — Presentation Title**: Extract or craft a concise, engaging title from the source content. Only ONE H1 in the entire document.
2. **H2 — Chapters**: Group the content into 2-7 logical chapters. Each chapter should cover a distinct theme or section of the source material.
3. **H3 — Pages**: Within each chapter, identify 2-6 content pages. Each page should focus on one key point or topic.
4. **H4-H6 — Sub-pages**: Reserve for content that needs step-by-step reveal or multi-page deep-dive within a single page topic. Only use when the content genuinely benefits from splitting.

Outline design principles:
- Each page (H3) should contain a digestible amount of content — not too dense, not too sparse.
- Logical flow: background/context → problem → solution → details → conclusion.
- If the source note has code blocks, decide whether to show them on dedicated pages.
- If the source note has images, plan which pages they belong to.
- Identify content suitable for fragment animations (lists, sequential points).

Present the outline to the user for confirmation before proceeding to format conversion, unless the user has already given clear direction on structure.

### Step 3: Convert to SlidesRup Markdown Format

Load the complete writing guide from `references/slidesrup-writing-guide.md` and apply the following rules during conversion:

#### 3.1 YAML Frontmatter

Generate appropriate frontmatter based on source content and user context:

```yaml
---
slideDesign: H
slideAuthor: (from user context or source note)
slideDate: (current date or source note date)
slideSlogan: (craft a concise subtitle from the content)
slideAutoConvertLinks: true
slideEnableParagraphFragments: true
---
```

Only include fields that have meaningful values. Do not include fields with unknown or empty values.

#### 3.2 Title Structure (Critical)

Adhere strictly to the heading hierarchy — this is the most important rule:

| Heading | Role | Quantity |
|---------|------|----------|
| H1 (`#`) | Presentation title | Exactly 1 |
| H2 (`##`) | Chapter | 2-7 recommended |
| H3 (`###`) | Content page | 2-6 per chapter |
| H4-H6 (`####`-`######`) | Sub-page (must include `%%...%%` marker to trigger) | As needed |

Never use multiple H1 headings. If the source note has multiple top-level headings, merge them into chapters under a single H1.

#### 3.3 Control Markers

Apply control markers on heading lines (at the end) to enhance pages:

- **TOC short name**: `%%|short name%%` — for chapters/pages with long titles, set a concise navigation name.
- **Background image**: `%%bg=path/to/image%%` — when a page has a relevant background image.
- **Custom class**: `%%class-name%%` — to apply specific styling (e.g., `%%two-columns%%`, `%%big-title%%`).
- **Override class**: `%%!class-name%%` — to completely replace default classes.
- **Template**: `%%[[Template-Name]]%%` — to specify a specific slide template.
- **No-navigation template**: `%%[[无导航]]%%` — for full-bleed image pages or special layouts.
- **Hidden page**: `%%?%%` — for backup/standby pages not shown by default.
- **Ignore heading** (no pagination): `%%@%%` — for headings used as in-page section titles, not new slides.

Only apply markers when they add value. Do not over-decorate every page.

#### 3.4 Content Formatting

- **Lists with fragments**: Use `+` instead of `-` for list items that should appear one-by-one (fragment animation). Use `-` for static lists.
- **Reverse fragment**: Add `%%reverse-list-fragment%%` class to a page when list items should appear in reverse order.
- **Speaker notes**: Wrap presenter-only content with `%%&` and `%%`:
  ```markdown
  %%&
  Speaker notes here - only visible in presenter view
  %%
  ```
- **Images**: Use Obsidian image syntax with alignment/size control:
  ```markdown
  ![[path/to/image#center shadow|600]]
  ```
  Common alignment classes: `left`, `right`, `center`, `stretch`. Size format: `width` or `widthxheight`.
- **Block layouts**: Use for side-by-side content:
  ```markdown
  ::: lblock
  Left content
  :::
  ::: rblock
  Right content
  :::
  ```
  Supported: `block`, `lblock`, `cblock`, `rblock`.
- **Tooltips**: For term explanations:
  ```markdown
  [term](> "right-side tooltip")
  [term](^ "top tooltip")
  ```
- **Sub-page separators**: Use `%%---%%` to split a content page into sub-pages without a new heading.
- **Manual blank pages**: Use `---` or `***` on its own line to insert a blank/transition page. Control markers can be added on the next line.
- **Tags**: `#tag` syntax is automatically rendered as styled tag badges.

#### 3.5 Content Adaptation Guidelines

- **Condense**: Source notes often contain too much text for slides. Summarize and extract key points. Each slide page should have at most 5-7 bullet points or 3-4 short paragraphs.
- **Visualize**: Where the source has text descriptions that could be better expressed as lists, tables, or diagrams, convert them.
- **Code blocks**: Keep code blocks concise. If a code block is very long, show only the essential part and add speaker notes explaining the full version.
- **Preserve key information**: Do not lose critical data, conclusions, or insights from the source. Move detailed explanations to speaker notes if they would clutter the slide.
- **Flow**: Ensure smooth transitions between chapters and pages. Add a brief intro page if the source jumps directly into technical details.

### Step 4: Output and Verify

1. Output the complete SlidesRup Markdown content.
2. Verify the output meets these checklist items:
   - Exactly one H1 heading exists.
   - All H4-H6 sub-page headings include at least one `%%...%%` control marker.
   - YAML frontmatter contains `slideDesign` at minimum.
   - No raw HTML comment syntax (`<!-- -->`) is used — all control is via `%%...%%` markers.
   - Content is condensed appropriately for presentation format.
   - Speaker notes are added for pages that need additional context.
3. Present the result to the user, mentioning the number of chapters and pages generated.

## Reference

The complete SlidesRup writing guide is available at `references/slidesrup-writing-guide.md`. Load this file when needing detailed information about:
- All control marker syntax and behavior
- YAML frontmatter field definitions
- Fragment animation options
- Image alignment and sizing rules
- Block layout types
- Tooltip syntax
- Template naming conventions
- Blank page insertion rules

When unsure about any SlidesRup syntax, always consult the reference guide rather than guessing.

## Quick Reference: Control Markers

| Marker | Purpose | Example |
|--------|---------|---------|
| `%%class-a class-b%%` | Append CSS classes | `## Chapter %%big-title%%` |
| `%%!class-a%%` | Override (replace) CSS classes | `### Page %%!no-nav full-bleed%%` |
| `%%[[Template]]%%` | Specify slide template | `## Cover %%[[Chapter-H]]%%` |
| `%%[[WithoutNav]]%%` | Use no-navigation layout | `### Big Image %%[[WithoutNav]]%%` |
| `%%bg=path%%` | Set background | `### Page %%bg=assets/bg.jpg%%` |
| `%%?%%` | Hide page | `### Backup %%?%%` |
| `%%@%%` | Ignore heading (no slide/page) | `### In-page title %%@%%` |
| `%%\|short%%` | TOC/nav display name | `## Long Title %%\|Short%%` |
| `%%& ... %%` | Speaker notes | `%%& Notes here %%` |
| `%%---%%` | Sub-page separator | Splits content page into sub-pages |

## Quick Reference: Frontmatter Fields

| Field | Purpose |
|-------|---------|
| `slideDesign` | Design letter/name for template naming (e.g., `H`) |
| `slideAuthor` | Presenter name |
| `slideDate` | Presentation date |
| `slideSlogan` | Subtitle/tagline |
| `slideLocation` | Output folder (relative to vault root) |
| `slideName` | Output filename (without .md) |
| `slideWidth` / `slideHeight` | Slide dimensions in pixels |
| `slideTOCPageNumber` | Where to insert TOC page |
| `slideNavOn` | Enable navigation layout (true/false) |
| `slideAutoConvertLinks` | Enable link/image preview enhancement (true/false) |
| `slideEnableParagraphFragments` | Auto-add fragment animations to paragraphs (true/false) |
| `slideLogoOrTagline` | Logo image path/URL or text tagline |
| `slideLastButNotLeast` | Back cover title/content |
