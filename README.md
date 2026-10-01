# IOTO Update

IOTO 框架的部署/更新器——在 Obsidian 内**一键部署 IOTO 框架内容、AI Agent 技能与配套插件**。完全开源、完全离线：**无需任何 API Key、账号或配置，下载即用。**

> 💡 快速上手：克隆 [ioto-starter](https://github.com/shawndotty/ioto-starter)（含本插件的启动库），或手动安装本插件后运行命令 `IOTO Update: Deploy IOTO With One Click`。

## 功能

### 一键部署（离线核心）

- **Deploy IOTO With One Click** — 把框架全部内容（核心脚本、模板、帮助文档、CSS）从插件自带的 `content/` 目录一键拷贝进你的 vault。零网络请求，无需任何 Key。

### 单项更新

- **Update Core Files** — 框架核心文件
- **Update Help Docs** — 帮助文档
- **Update MYIOTO Templates** — MYIOTO 个人模板
- **Update CSS Snippets** — CSS 片段 → `.obsidian/snippets`
- **Update IOTO Framework Setting Plugin** — IOTO Settings 插件（若 content 带）

### AI Agent 技能

- **Update Skills** — 选择平台后把技能文件部署到对应文件夹：

    | 平台         | 文件夹      |
    | ------------ | ----------- |
    | TRAE         | `.trae`     |
    | Claude Code  | `.claude`   |
    | OpenCode     | `.opencode` |
    | OpenAI Codex | `.agents`   |
    | Mimo Code    | `.mimocode` |
    | Hermes       | `.hermes`   |

    技能文件同样随仓库分发（`content/skills/`），离线可用。

### 配套插件安装（公开仓库，无需凭据）

- IOTO Tasks Center / Template Generator / Dashboard / Sync Scripts Generator
- Text Popup / My Text Tools / SlidesRup
- Airtable Fetcher / Feishu Fetcher / Vika Fetcher

下载源可选 GitHub 或 Gitee（设置 → Plugins Center），仅访问公开仓库，无任何鉴权。

### 自更新

设置面板检查并安装本插件新版本（公开仓库拉取）。

## 安装

### 方式 A：ioto-starter 启动库（推荐）

下载 [ioto-starter](https://github.com/shawndotty/ioto-starter)，用 Obsidian 打开即已预装本插件。

### 方式 B：手动安装

1. 下载本仓库 Release（或 clone），把 `main.js`、`manifest.json`、`styles.css`、`content/` 整个文件夹放进 `.obsidian/plugins/ioto-update/`
2. 启用社区插件 → 开启 IOTO Update
3. `Ctrl/Cmd+P` → **Deploy IOTO With One Click**

> ⚠️ `content/` 文件夹必须随插件一起分发——部署功能靠它本地拷贝，没有它 Deploy 会提示「内容包缺失」。

## 内容维护（给贡献者）

框架内容全部在仓库 `content/` 目录（结构与维护说明见 [content/README.md](./content/README.md)）。从 Airtable 一次性导出用 `scripts/export-content.mjs`；此后更新内容 = 改文件 + 发 release。

## 设置

- **Plugin Download Source** — GitHub / Gitee（仅影响配套插件下载与自更新）
- **IOTO Running Language** — 自动 / 简体中文 / 繁體中文 / English
- **IOTO Framework Path** — 框架根目录（默认 IOTO 标准路径）

## 语言

- English / 简体中文 / 繁體中文

## 环境要求

- Obsidian **0.15.0+**
- 无其他依赖。无 API、无账号、无网络要求（除可选的插件安装/更新）。

## 作者与链接

- **Author:** Johnny
- **Repository:** https://github.com/shawndotty/ioto-update
- **Funding:** https://space.bilibili.com/432408734
- **教程：** https://www.pursueideal.com/guides/ioto
