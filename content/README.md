# content/ — IOTO 框架内容包（随仓库分发）

这个目录是「下载即用」的核心：**IOTO 框架的全部内容直接放在仓库里，用户部署时从本地拷贝，零网络、零凭据、零 API。**

## 目录结构与去向

| 子目录 | 内容 | 部署目标（Deploy 时拷贝到） |
|---|---|---|
| `core/` | IOTO 框架核心（Scripts 核心脚本、Templates 模板） | `{IOTO 框架路径}/` |
| `myioto/` | MYIOTO 个人模板 | `{IOTO 框架路径}/` |
| `help/` | 帮助文档 | `{IOTO 框架路径}/` |
| `css/` | CSS snippets（SubFolder 对应 `.obsidian/snippets/` 下的相对路径） | `.obsidian/snippets/` |
| `skills/` | AI Agent 技能（SubFolder 相对平台根，见下方说明） | 用户选择的平台文件夹（`.trae/`、`.claude/` 等） |
| `settings-plugin/` | ioto-settings 插件三件套（main.js/manifest.json/styles.css，若有） | `.obsidian/plugins/ioto-settings/` |

**skills 的旧版语义**：选择平台后，把全部技能记录同步到该平台文件夹——技能文件不按平台分目录，`skills/` 内的子目录结构与各平台通用（SubFolder 字段决定平台内的相对路径）。

## 维护者：一键导出 Airtable 全部内容（一次性，只需一个 PAT）

导出脚本已预填内容库全部真实 ID（主表 + 帮助表 + 7 个 view），你只需要建一个只读 PAT：

1. 打开 <https://airtable.com/create/tokens> 新建 token
2. Scope 勾选 **data.records:read**；Base 范围勾选 **IOTO 内容库**（app 开头 q2MtxkPBdZc3Sc 那个）
3. 运行：

```bash
IOTO_PAT="pat你的token" node scripts/export-content.mjs
```

默认三语言全导出（zh 原名，en/tw 加 `.en`/`.tw` 后缀）。可选：

```bash
IOTO_LANG=zh   IOTO_PAT=... node scripts/export-content.mjs   # 只导中文
IOTO_PACKS=core,help IOTO_PAT=... node scripts/export-content.mjs  # 只导部分包
```

4. 检查导出结果（重点：`css/` 里的文件应落在 `snippets/…` 子路径下、`settings-plugin/` 应含插件三件套）
5. `git add content/ && git commit -m "feat: bundle all IOTO content" && git push`
6. 回 Airtable：**revoke 这个 PAT**，内容库归档——Airtable 正式退役

> 已知边界：内容库表里若存在非框架内容的杂项记录（如作者个人草稿），导出后手工删除对应文件即可——view 已经圈定了范围，正常不会有。

## 维护者：以后如何更新内容

1. 直接编辑本目录下的文件（就是普通 Markdown/文件，Airtable 时代结束）
2. 内容变动无需重建插件；改了 `src/` 才需要 `npm run build`
3. 提交 + 打 tag 发 release（`npm run deploy` 会把 content/ 一起打包）
4. 用户通过「Plugins Center → Check for Updates」或重新下载获得新内容
