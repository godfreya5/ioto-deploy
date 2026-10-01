/**
 * IOTO Update 常量配置（离线开源版）
 *
 * 2026-10 彻底开源化：
 * - 所有验证（API Key / 邮箱 / Match 判定 / webhook）已移除
 * - 所有 Airtable / NocoDB 网络同步已移除
 * - 框架内容随本插件仓库的 content/ 目录分发，部署 = 本地拷贝
 * - 唯一保留的网络功能：从 GitHub / Gitee 公开仓库安装配套插件与自更新（无需任何凭据）
 */

import { App } from "obsidian";

/** 各内容包在插件 content/ 下的子目录名 */
export const CONTENT_DIRS = {
	core: "core",
	myioto: "myioto",
	help: "help",
	css: "css",
	skills: "skills",
	settingsPlugin: "settings-plugin",
} as const;

/** 插件自身安装目录（vault 内） */
export function pluginContentRoot(app: App): string {
	return `${app.vault.configDir}/plugins/ioto-update/content`;
}
