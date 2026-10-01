# 查找替换配方库

常见自然语言需求 → 规则片段。直接取用或组合。两个前提：

- 三个开关对整个文件统一生效，需要不同开关的需求要拆成多个规则文件
- 正则默认**不带 `m` 标志**，`^`/`$` 只对应整篇正文首尾；如需按行匹配可开启 `multilineMode: true`（见下方「多行模式」一节）。下面大多数配方沿用兼容写法 `(^|\n)` / `(?=\n|$)`，在旧版脚本（无 `m` 标志）和新版都能用

## Markdown 格式清理

### 移除高亮（保留文字）

```yaml
search1: ==(.+?)==
replace1: $1
ignoreCase: true
globalReplace: true
useRegex: true
```

比 `search1: =|_|\*` 安全得多——后者会误伤等号、下划线命名、数学式和所有加粗斜体。

### 移除加粗 / 斜体（保留文字）

```yaml
search1: \*\*(.+?)\*\*
replace1: $1
search2: (?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])
replace2: $1
ignoreCase: true
globalReplace: true
useRegex: true
```

先粗后斜，顺序不能反。斜体一条加了边界断言，避免命中 `2 * 3`、`a*b` 和列表符号 `* item`。

### 移除行内代码标记

```yaml
search1: '`([^`]+)`'
replace1: $1
ignoreCase: true
globalReplace: true
useRegex: true
```

### 去掉 HTML 标签残留

```yaml
search1: <\/?span>|<\/?code>
replace1:
search2: \&lt;
replace2: <
search3: \&gt;
replace3: ">"
ignoreCase: true
globalReplace: true
useRegex: true
```

### 压缩多余空行（3 行以上 → 1 个空行）

```yaml
search1: \n{3,}
replace1: \n\n
ignoreCase: false
globalReplace: true
useRegex: true
```

## 任务与列表

### 无序列表 → 未完成任务

```yaml
search1: (^|\n)-\s(?!\[)
replace1: "$1- [ ] "
ignoreCase: false
globalReplace: true
useRegex: true
```

`(?!\[)` 避免把已有的 `- [ ]` / `- [x]` 二次加工，`(^|\n)` 代替不可用的 `^`。若正文简单也可用字面版 `search1: "-"` + `useRegex: false`，但会误伤所有连字符。开启 `multilineMode: true` 时可直接把 `(^|\n)` 写成 `^`（见「多行模式」一节）。

### 未完成任务 → 已完成

```yaml
search1: "- [ ]"
replace1: "- [x]"
ignoreCase: true
globalReplace: true
useRegex: false
```

### 删除所有未完成任务行

```yaml
search1: \- \[ \] .*
replace1:
ignoreCase: true
globalReplace: true
useRegex: true
```

### 列表层级 → 标题层级

```yaml
search1: (^|\n)\t-\s(.+)
replace1: "$1## $2"
search2: (^|\n)-\s(.+)
replace2: "$1# $2"
ignoreCase: true
globalReplace: true
useRegex: true
```

先处理缩进层（子级），再处理顶层，顺序反了会全部变成一级标题。若只想转换特定文字（如 Dataview 输出的 `list`），把 `(.+)` 换成具体内容。

### 标题降级（全部下沉一级）

```yaml
search1: (^|\n)(#{1,5})\s
replace1: $1$2#\s
ignoreCase: false
globalReplace: true
useRegex: true
```

## 中英文排版

### 移除中文字之间的空格

```yaml
search1: ([\u4E00-\u9FFF])[ \t]+(?=[\u4E00-\u9FFF])
replace1: $1
ignoreCase: false
globalReplace: true
useRegex: true
```

用 `[ \t]+` 而不是 `\s+`：`\s` 含换行，会把两行中文黏成一行。前瞻 `(?=...)` 保证只在「中文 空格 中文」时才删，不影响中英文之间的空格。

### 中英文之间补空格

```yaml
search1: ([\u4E00-\u9FFF])([A-Za-z0-9])
replace1: $1\s$2
search2: ([A-Za-z0-9])([\u4E00-\u9FFF])
replace2: $1\s$2
ignoreCase: false
globalReplace: true
useRegex: true
```

### 英文标点 → 中文标点

```yaml
search1: ;
replace1: ；
search2: ","
replace2: ，
search3: ":"
replace3: ：
search4: \(
replace4: （
search5: \)
replace5: ）
ignoreCase: true
globalReplace: true
useRegex: true
```

会连同代码、链接、时间（`12:30`）一起替换，含代码的笔记不要用。

## Obsidian 专有

### 移除 Block ID

```yaml
search1: \s\^[A-Za-z0-9-]+(?=\n|$)
replace1:
ignoreCase: false
globalReplace: true
useRegex: true
```

用前瞻 `(?=\n|$)` 锁定行尾，在所有版本都能用；若开启 `multilineMode: true`，可直接写成 `\s\^[A-Za-z0-9-]+$`（见「多行模式」一节）。

### 内链转纯文本

```yaml
search1: \[\[([^\]|]+)\|([^\]]+)\]\]
replace1: $2
search2: \[\[([^\]]+)\]\]
replace2: $1
ignoreCase: false
globalReplace: true
useRegex: true
```

先处理带别名的 `[[A|B]]`，再处理普通 `[[A]]`。

### 嵌入转普通链接（去掉感叹号）

```yaml
search1: '!\[\['
replace1: "[["
ignoreCase: false
globalReplace: true
useRegex: false
```

### 移除标签

```yaml
search1: (^|\s)#[\w\u4E00-\u9FFF/-]+
replace1: $1
search2: "[ ]{2,}"
replace2: \s
ignoreCase: false
globalReplace: true
useRegex: true
```

前置 `(^|\s)` 避免命中 URL 锚点和 C# 之类；第二条收尾，把删标签后留下的连续空格压回一个。

## 多行模式（multilineMode: true）

开启后正则获得 `m` 标志，`^` 与 `$` 从「整篇首尾」变成「每行首尾」。这让行首/行尾规则可以写得和直觉一致，不必再用 `(^|\n)` / `(?=\n|$)` 的兼容写法。

**注意**：`multilineMode` 只对走正则通道的规则生效（`useRegex: true` 或 `ignoreCase: true`）；纯字面替换（`useRegex: false` 且 `ignoreCase: false`）没有正则引擎，`m` 不起作用。另外 `.` 始终不跨行（脚本没有 `s` 标志），所以 `.*` 不论开不开 `m` 都只吃本行——`m` 主要改变的是 `^`/`$` 的锚点。

### 每行行首加待办框（多行版）

```yaml
search1: ^-\s(?!\[)
replace1: "- [ ] "
multilineMode: true
ignoreCase: false
globalReplace: true
useRegex: true
```

等价兼容版（不依赖 `m`，所有版本可用）：

```yaml
search1: (^|\n)-\s(?!\[)
replace1: "$1- [ ] "
ignoreCase: false
globalReplace: true
useRegex: true
```

### 删除每行尾 Block ID（多行版）

```yaml
search1: \s\^[A-Za-z0-9-]+$
replace1:
multilineMode: true
ignoreCase: false
globalReplace: true
useRegex: true
```

等价兼容版（不依赖 `m`）：

```yaml
search1: \s\^[A-Za-z0-9-]+(?=\n|$)
replace1:
ignoreCase: false
globalReplace: true
useRegex: true
```

## 换行与拼接

### 每段后加空行

```yaml
search1: ([\u4E00-\u9FFF。！？])\n(?!\n)
replace1: $1\n\n
ignoreCase: false
globalReplace: true
useRegex: true
```

### 段内软换行合并成一行

```yaml
search1: ([^\n])\n(?!\n|[-*#>|\d])
replace1: $1
ignoreCase: false
globalReplace: true
useRegex: true
```

排除了列表、标题、引用、表格行开头，避免把结构行黏在一起。

## 误伤风险速查

写规则前对照检查：

| 危险写法 | 问题 | 更稳的写法 |
|---|---|---|
| `=` `_` `*` 单字符类 | 命中数学式、变量名、列表符号、分隔线 | 带成对边界的捕获，如 `==(.+?)==` |
| `.*` 无边界 | 贪婪吃到行尾 | 用 `.+?` 惰性匹配，或用 `(?=\n)` 等前瞻收边 |
| `-` 字面替换 | 命中日期、连字符单词、分隔线 `---` | 加 `(^|\n)` 锚点和否定前瞻 |
| `#` 无前置条件 | 命中 URL 锚点、C# 之类 | `(^|\s)#` |
| 用 `^` / `$` 当行首行尾（未开 `multilineMode`） | 默认 `m` 标志关闭，只匹配全文首尾，规则静默失效 | 开 `multilineMode: true`，或用兼容写法 `(^|\n)` / `(?=\n|$)` |
| 用 `\s` 表示「空格」 | `\s` 含 `\n`，会跨行吞掉换行 | 明确写 `[ \t]` |
| 多条规则顺序随意 | 后一条在前一条的产物上再匹配 | 先具体后宽泛，先深层后浅层 |
| 处理含代码块的笔记 | 代码里的符号被一并替换 | 提前告知用户，或先选中非代码部分用「选中文本」模式 |
