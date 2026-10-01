/**
 * 本地内容部署服务（离线开源版核心）
 *
 * 职责：把插件自带的 content/ 目录中的框架内容拷贝到 vault 对应位置。
 * 替代原 Airtable/NocoDB 网络同步——零网络、零凭据、下载即用。
 *
 * 内容包结构（随仓库分发，见仓库根 content/ 目录）：
 *   content/core/          → IOTO 框架核心（Scripts/Templates 等）
 *   content/myioto/        → MYIOTO 模板
 *   content/help/          → 帮助文档
 *   content/css/           → CSS snippets（拷到 .obsidian/snippets）
 *   content/skills/        → AI Agent 技能（拷到用户选定的平台文件夹）
 *   content/settings-plugin/ → ioto-settings 插件三件套（若有）
 */

import { App, Notice, TFile, TFolder, normalizePath } from "obsidian";
import { t } from "../lang/helpers";

export interface ContentDeployResult {
	filesCopied: number;
	foldersCreated: number;
}

export class ContentDeployService {
	constructor(private app: App) {}

	/** 递归拷贝插件 content/<pack> 到 vault 目标文件夹 */
	async deployPack(
		packDirName: string,
		targetFolderPath: string,
		options: { overwrite?: boolean; skipPattern?: RegExp } = {},
	): Promise<ContentDeployResult> {
		const sourceRoot = `${this.app.vault.configDir}/plugins/ioto-update/content/${packDirName}`;
		const exists = await this.app.vault.adapter.exists(sourceRoot);
		if (!exists) {
			throw new Error(
				t("Content pack not found") +
					`: content/${packDirName}/` +
					t("Please reinstall this plugin"),
			);
		}

		const { overwrite = true } = options;
		const result: ContentDeployResult = { filesCopied: 0, foldersCreated: 0 };

		await this.ensureFolder(targetFolderPath);
		await this.copyFolderRecursive(sourceRoot, targetFolderPath, overwrite, result, options.skipPattern);
		return result;
	}

	/** 列出技能包下所有子目录（诊断用） */
	async listSkillPlatforms(): Promise<string[]> {
		const skillsRoot = `${this.app.vault.configDir}/plugins/ioto-update/content/skills`;
		const exists = await this.app.vault.adapter.exists(skillsRoot);
		if (!exists) return [];
		const listing = await this.app.vault.adapter.list(skillsRoot);
		return listing.folders
			.map((f) => f.split("/").pop() || f)
			.filter((n) => !n.startsWith("."));
	}

	/** 读取技能包清单（若打包了 manifest） */
	async readSkillsManifest(): Promise<any | null> {
		const manifestPath = `${this.app.vault.configDir}/plugins/ioto-update/content/skills/manifest.json`;
		try {
			const raw = await this.app.vault.adapter.read(manifestPath);
			return JSON.parse(raw);
		} catch {
			return null;
		}
	}

	private async ensureFolder(path: string): Promise<void> {
		const normalized = normalizePath(path);
		if (!(await this.app.vault.adapter.exists(normalized))) {
			await this.app.vault.adapter.mkdir(normalized);
		}
	}

	private async copyFolderRecursive(
		sourceDir: string,
		targetDir: string,
		overwrite: boolean,
		result: ContentDeployResult,
		skipPattern?: RegExp,
	): Promise<void> {
		const listing = await this.app.vault.adapter.list(sourceDir);

		for (const subFolder of listing.folders) {
			const name = subFolder.split("/").pop() || subFolder;
			if (skipPattern && skipPattern.test(name)) continue;
			const targetSub = `${targetDir}/${name}`;
			await this.ensureFolder(targetSub);
			result.foldersCreated += 1;
			await this.copyFolderRecursive(subFolder, targetSub, overwrite, result, skipPattern);
		}

		for (const file of listing.files) {
			const name = file.split("/").pop() || file;
			if (skipPattern && skipPattern.test(name)) continue;
			const targetFile = `${targetDir}/${name}`;
			const data = await this.app.vault.adapter.readBinary(file);
			const targetExists = await this.app.vault.adapter.exists(targetFile);
			if (targetExists && !overwrite) continue;
			await this.app.vault.adapter.writeBinary(targetFile, data);
			result.filesCopied++;
		}
	}
}
