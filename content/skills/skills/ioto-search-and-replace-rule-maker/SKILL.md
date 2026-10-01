---
name: ioto-search-and-replace-rule-maker
description: "把用户的自然语言描述转换成 IOTOSearchAndReplace.js 可直接读取的查找替换规则文件（TP-SR-*.md），写入 IOTO 规则目录。当用户说「帮我做一个查找替换规则」「批量把 X 换成 Y」「移除笔记里的 XXX」「把列表变成任务」「生成 SR 规则」「search and replace 规则」时使用。同样用于检查、修正、解释已有的 TP-SR-* 规则文件。"
agent_created: true
---

# IOTO 查找替换规则生成器

把「我想把 A 变成 B」这类自然语言需求，翻译成 [[IOTOSearchAndReplace.js]] 能直接消费的规则文件。

- **规则目录**：`0-辅助/IOTO/Templates/Templater/MyIOTO/辅助工具/查找替换规则`
  （对应 ioto-settings 的 `iotoUtilsSnRRulesFolder`，不要写死到别处；若用户改过设置，以 `.obsidian/plugins/ioto-settings/data.json` 里的值为准）
- **执行入口**：Templater 模板 [[IOTO-查找替换]]，内容为 `tR += await tp.user.IOTOSearchAndReplace(tp, tR);`
- **运行时选择作用域**（不写进规则文件）：当前笔记 / 当前文件夹 / 当前文件夹及子文件夹 / 选中文本

## 规则文件规格

规则**全部写在 YAML frontmatter 里**，正文只作说明与示例，脚本不读取正文。

```markdown
---
search1: 要找的内容
replace1: 要换成的内容
search2: 第二条
replace2: 第二条的替换
ignoreCase: true
globalReplace: true
useRegex: true
multilineMode: false
---
一句话说明这条规则干什么，可选：几行示例文本供当场试跑。
```

### 键名规则

| 键 | 说明 |
|----|------|
| `searchN` / `replaceN` | N 为数字，**必须成对出现**，缺一个脚本会报「rules do not match」并整体放弃 |
| `multilineMode` | 可选开关，见下方「四个开关」；缺省按 `false` 处理 |
| 顺序 | 按 N 从小到大**依次执行**，后一条作用在前一条的结果上 |
| 空值 | `replaceN:` 留空 = 替换为空字符串（删除）；`searchN` 留空则该条被跳过，但配对仍需存在 |
| 编号 | 建议从 1 连续编号，便于阅读 |

### 四个开关（对文件内**所有**规则统一生效，不能逐条设置）

| 开关 | 作用 |
|------|------|
| `useRegex` | `true` 时 `searchN` 按正则解析，`replaceN` 支持 `$1` `$&`；同时给正则加 `u`（Unicode）标志 |
| `ignoreCase` | 忽略大小写。**注意**：只要它为 `true`，即使 `useRegex: false`，搜索串也会走正则通道（内容被自动转义，仍按字面匹配） |
| `globalReplace` | `true` 替换全部匹配；`false` 只替换第一处 |
| `multilineMode` | `true` 时给正则加 `m` 标志，`^` 匹配每行行首、`$` 匹配每行行尾（默认 `false` 只匹配整篇首尾）。**只对走正则通道的规则生效**——即 `useRegex: true` 或 `ignoreCase: true`；纯字面替换时正则引擎不参与，`m` 不起作用 |

行为矩阵（源码 `searchAndReplaceInContent`）：

`flags = g`(globalReplace) + `i`(ignoreCase) + `m`(multilineMode) + `u`(useRegex)。其中 `m` / `u` 只在对应开关为 `true` 时拼入。

| useRegex | ignoreCase | 实际行为 |
|---|---|---|
| true | 任意 | `new RegExp(search, flags)`，flags 含 `g`+`i`+`m`(若开)+`u` |
| false | true | 搜索串先转义再编译成正则 → 字面匹配 + 忽略大小写；flags 含 `g`+`i`+`m`(若开) |
| false | false, global=true | `replaceAll(字面串)`（无正则，无 `m`） |
| false | false, global=false | `replace(字面串)`，只换第一处（无正则，无 `m`） |

### 多行模式（`m` 标志，新增）

脚本现在会拼 `g` / `i` / `m` / `u` 四个标志（见 `searchAndReplaceInContent` 里的 `flags`）：

```js
const flags = `${globalReplace ? "g" : ""}${ignoreCase ? "i" : ""}${multilineMode ? "m" : ""}${useRegex ? "u" : ""}`;
```

- `multilineMode: true` 时，`^` 匹配**每一行的行首**、`$` 匹配**每一行的行尾**（默认 `false` 只匹配整篇首尾）
- `useRegex: true` 时额外加 `u`（Unicode）标志
- 该标志**只对走正则通道的规则生效**，即 `useRegex: true` 或 `ignoreCase: true`；`useRegex: false` 且 `ignoreCase: false` 时是正文字面替换，没有正则引擎，`m` 不起作用

**有 `multilineMode` 时**，行首行尾可以直接用 `^` / `$`：

```yaml
# 每行行首的裸列表项加待办框
search1: ^-\s(?!\[)
replace1: "- [ ] "
multilineMode: true
```

```yaml
# 删除每行尾的 Block ID
search1: \s\^[A-Za-z0-9-]+$
replace1:
multilineMode: true
```

**没有 `multilineMode`（默认）时**，`^`/`$` 仍只匹配整篇首尾。想按行处理要用兼容写法：

- 行首用 `(^|\n)`，并在替换串里用 `$1` 把换行还回去：

```yaml
search1: (^|\n)-\s(?!\[)
replace1: "$1- [ ] "
```

- 行尾用前瞻 `(?=\n|$)`：

```yaml
search1: \s\^[A-Za-z0-9-]+(?=\n|$)
replace1:
```

> 两种写法都正确：兼容写法在所有版本都能用；新写法在 `multilineMode: true` 下更直观。注意 `.` 始终不跨行（脚本没有 `s` 标志），所以「整行匹配」写 `\- \[ \] .*` 不论开不开 `m` 都只作用于本行。

### 替换串里的转义

脚本在应用前会做两步字符串替换：

- `\n` → 真正的换行
- `\s` → 一个空格

所以「在每个中文段后加空行」写成 `replace1: $&\n\n`；「补两个空格」写成 `replace1: $&\s\s`。

`$` 系列在**所有模式**下都会被 JS 解释（`replaceAll` 也会处理 `$&`）：

- `$&` 整个匹配内容
- `$1` `$2` 正则捕获组（仅 `useRegex: true` 时有捕获组）
- `$$` 输出一个字面 `$`

### 作用范围

`IOTONoteMaker.prepareNoteContent()` 会**先剥掉 frontmatter**，替换完再原样拼回。所以规则只作用于**正文**，不会误伤笔记属性。

## YAML 书写陷阱（最容易出错的地方）

写正则时，**不要用双引号**。YAML 双引号串里 `\d` `\s` `\-` 都是非法/被吞掉的转义。

| 情况 | 写法 |
|------|------|
| 含反斜杠的正则 | 不加引号：`search1: \s\^MLBC.+`；必须加引号时用**单引号**：`search1: '\d+\.'` |
| 以 `-` `?` `:` `[` `{` `#` `>` `|` `*` `&` `!` `%` `@` `` ` `` 开头 | 加双引号：`replace1: "- [ ]"`、`replace4: ">"`、`replace1: "## $1"` |
| 值就是 `,` `:` `-` 等单字符 | 加引号：`search2: ","` |
| **替换值**以空格开头/结尾 | 写 `\s` 代替真实空格（YAML 会裁掉首尾空白），如 `replace1: $1\s` |
| **搜索值**要匹配空格 | 正则模式下写 `[ ]` 或 `[ \t]`（`\s` 会跨行）；字面模式下加引号保留空格 |
| 值为空（删除） | 键后留空即可：`replace1:` |

写完后**逐行自查**：这一行如果被 YAML 解析，得到的字符串是否和我想要的正则字面量一致？

## 工作流程

### 1. 澄清需求

从用户描述里抽出这几项，缺的就问（能合理推断的不要多问）：

- 要找什么、换成什么（可能有多条）
- 是否区分大小写 → 默认 `ignoreCase: true`
- 换全部还是只换第一处 → 默认 `globalReplace: true`
- 是否需要正则 → 需要通配、捕获、锚点、字符类时为 `true`；纯字面串替换用 `false` 更安全
- 文件名叫什么

### 2. 命名文件

格式 `TP-SR-{分组}-{中文描述}.md`：

- `TP-SR-JL-*` — 用户自己的常用规则（**默认用这个**）
- `TP-SR-Dataview-*` — 处理 Dataview 渲染结果
- `TP-SR-Demo-*` — 教学演示

先列目录查重；同名已存在时读出来在原文件上改，不要新建同名副本。

### 3. 写规则

优先选**最保守**的实现：

- 能用字面替换就不要开正则
- 正则要尽量收紧边界，避免误伤（例如删高亮用 `==(.+?)==` → `$1`，而不是把所有 `=` 都删掉）
- 多步转换拆成多条按顺序执行的规则，比一条巨型正则好读好调

常见需求配方见 [RECIPES.md](references/RECIPES.md)。

### 4. 自检

写入前逐条核对：

- [ ] 每个 `searchN` 都有对应的 `replaceN`，数量一致
- [ ] 正则没有被双引号包住
- [ ] 需要引号的特殊起始字符已加引号
- [ ] 需要按行匹配 `^` / `$` 时，已开启 `multilineMode: true`；或改用兼容写法 `(^|\n)` / `(?=\n|$)`（所有版本通用）
- [ ] 表示「空格」的地方没有误用会跨行的 `\s`
- [ ] 正则语法能被 `new RegExp()` 接受
- [ ] 想清楚规则顺序，确认前一条不会破坏后一条的匹配前提

**写入前必须用 node 实跑一遍**，标志只能用 `g`/`i`/`m`/`u`，与脚本保持一致：

```bash
# 普通规则
node -e 'const s=`第一行\n第二行`; console.log(JSON.stringify(s.replace(/正则/gi, "替换")))'
# 多行模式：开 m 标志验证 ^/$ 是否按行生效
node -e 'const s=`a\n-b\nc`; console.log(JSON.stringify(s.replace(/^-\s/gm, "- [ ] ")))'
```

测试文本要覆盖多行、已处理过的内容、以及最容易误伤的边界情况。

### 5. 写入并说明

- 文件写入规则目录
- 正文写一行说明；如果规则有误伤风险，把风险和适用范围也写进正文
- 回复用户时给出 `[[TP-SR-xxx]]` wikilink，并说明使用方式：打开目标笔记 → 运行 [[IOTO-查找替换]] 模板 → 选作用域 → 选这个规则文件

## 完整示例

**用户说**：「帮我把笔记里的英文标点换成中文标点」

```markdown
---
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
---
把正文中的英文标点批量替换为中文全角标点。注意：会一并替换代码块与链接里的标点，含代码的笔记慎用。
```

**用户说**：「把无序列表变成待办」

```markdown
---
search1: "-"
replace1: "- [ ]"
ignoreCase: false
globalReplace: true
useRegex: false
---
把 `-` 转成 `- [ ]`。字面替换，正文中所有连字符都会被命中，仅适合纯列表笔记。
```

**用户说**：「移除所有未完成任务」

```markdown
---
search1: \- \[ \] .*
replace1:
ignoreCase: true
globalReplace: true
useRegex: true
---
删除笔记中所有未完成任务行的内容（保留空行）。
```

## 安全约束

- 只写入规则目录，不改动 `IOTOSearchAndReplace.js` 或 Templater 模板
- 不要替用户在真实笔记上执行替换；本 skill 只负责**生成规则文件**
- 规则存在误伤风险时（暴力字符类、无边界的 `.*`、裸 `-`/`=`/`*`），必须在回复和正文里明确提示，并给出更稳妥的备选写法
