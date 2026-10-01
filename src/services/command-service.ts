import { App, Command, Notice } from "obsidian";
import { t } from "../lang/helpers";
import { IOTOUpdateSettings } from "../types";
import { TemplaterService } from "./templater-service";
import { GithubService } from "./github-service";
import { GiteeService } from "./gitee-service";
import { PluginService } from "./plugin-service";
import { IOTO_PLUGINS } from "./plugin-registry";
import { ContentDeployService } from "./content-deploy-service";
import { CONTENT_DIRS } from "../constants";

export class CommandService {
	private app: App;
	private plugin: any;
	private addCommand: (command: Command) => void;
	private settings: IOTOUpdateSettings;
	private templaterService: TemplaterService;
	private deployService: ContentDeployService;

	constructor(
		app: App,
		plugin: any,
		addCommand: (command: Command) => void,
		settings: IOTOUpdateSettings,
		templaterService: TemplaterService,
		deployService: ContentDeployService,
	) {
		this.app = app;
		this.plugin = plugin;
		this.addCommand = addCommand;
		this.settings = settings;
		this.templaterService = templaterService;
		this.deployService = deployService;
	}

	registerCommands() {
		// ===== 本地内容部署（离线核心） =====
		this.addCommand({
			id: "deploy-ioto",
			name: t("Deploy IOTO With One Click"),
			callback: async () => this.deployAll(),
		});

		this.addCommand({
			id: "get-core-files",
			name: t("Update Core Files"),
			callback: async () =>
				this.deploySingle(CONTENT_DIRS.core, this.settings.iotoFrameworkPath),
		});

		this.addCommand({
			name: t("Update Help Docs"),
			id: "get-help-doc",
			callback: async () =>
				this.deploySingle(CONTENT_DIRS.help, this.settings.iotoFrameworkPath),
		});

		this.addCommand({
			id: "get-myioto",
			name: t("Update MYIOTO Templates"),
			callback: async () =>
				this.deploySingle(CONTENT_DIRS.myioto, this.settings.iotoFrameworkPath),
		});

		this.addCommand({
			id: "get-css",
			name: t("Update CSS Snippets"),
			callback: async () => {
				await this.deploySingle(
					CONTENT_DIRS.css,
					`${this.app.vault.configDir}/snippets`,
				);
				this.app.commands.executeCommandById("app:reload");
			},
		});

		this.addCommand({
			id: "get-setting-plugin",
			name: t("Update IOTO Framwork Setting Plugin"),
			callback: async () => {
				await this.deploySingle(
					CONTENT_DIRS.settingsPlugin,
					`${this.app.vault.configDir}/plugins/ioto-settings`,
				);
				await this.enableIotoSettingsPlugin();
				this.app.commands.executeCommandById("app:reload");
			},
		});

		// ===== 技能部署（本地，带平台选择） =====
		this.addCommand({
			id: "get-skills",
			name: t("Update Skills"),
			callback: async () => this.deploySkills(),
		});

		// ===== 配套插件安装（公开 GitHub/Gitee，无需凭据） =====
		for (const entry of IOTO_PLUGINS) {
			this.addCommand({
				id: `install-${entry.key}`,
				name: t(entry.nameKey) + t("PluginIndicator"),
				icon: "puzzle",
				callback: async () => {
					await this.installPluginByKey(entry.key);
				},
			});
		}
	}

	/** 一键部署：本地拷贝全部内容包 */
	private async deployAll() {
		new Notice(t("Deploying IOTO..."));
		const targets = [
			{ id: CONTENT_DIRS.core, path: this.settings.iotoFrameworkPath },
			{ id: CONTENT_DIRS.myioto, path: this.settings.iotoFrameworkPath },
			{ id: CONTENT_DIRS.help, path: this.settings.iotoFrameworkPath },
			{
				id: CONTENT_DIRS.css,
				path: `${this.app.vault.configDir}/snippets`,
			},
		];

		let ok = 0;
		for (const tgt of targets) {
			try {
				const r = await this.deployService.deployPack(tgt.id, tgt.path);
				ok++;
				console.log(
					`[IOTO] ${tgt.id}: ${r.filesCopied} files, ${r.foldersCreated} folders`,
				);
			} catch (e) {
				new Notice(`${tgt.id}: ${(e as Error).message}`);
			}
		}

		if (ok === targets.length) {
			try {
				await this.tryEnableSettingsPlugin();
			} catch (e) {
				console.warn("[IOTO] settings plugin not deployed", e);
			}
			new Notice(t("IOTO deployed successfully"));
			setTimeout(() => this.app.commands.executeCommandById("app:reload"), 800);
		} else {
			new Notice(t("Deploy failed, see console for details"));
		}
	}

	/** 单包部署，带 Notice 反馈 */
	private async deploySingle(packDir: string, targetPath: string) {
		try {
			new Notice(`${t("Executing")} ${packDir}...`);
			const r = await this.deployService.deployPack(packDir, targetPath);
			new Notice(
				`${t("completed")}: ${r.filesCopied} files → ${targetPath}`,
			);
		} catch (error) {
			new Notice(`${t("failed")}: ${(error as Error).message}`);
		}
	}

	/** 技能部署：平台选择 → 拷贝 skills/<platform> 到目标文件夹 */
	private async deploySkills() {
		const { AIPlatformSuggester } = await import("../suggesters/ai-platform-suggester");
		const suggester = new AIPlatformSuggester(this.app);
		suggester.setPlaceholder(t("Select AI Agent Platform"));
		const platform = await new Promise((resolve) => {
			suggester.onChooseItem = (item) => {
				resolve(item);
				return item;
			};
			suggester.open();
		});
		if (!platform) {
			new Notice(t("No platform selected"));
			return;
		}

		const platformDir = (platform as any).value as string;
		try {
			// 旧版语义：全部技能记录同步到所选平台文件夹（SubFolder 相对平台根）
			const r = await this.deployService.deployPack(
				CONTENT_DIRS.skills,
				platformDir,
			);
			new Notice(`${t("Update Skills")} ${t("completed")}: ${r.filesCopied} files → ${platformDir}`);
		} catch (error) {
			new Notice(`${t("Update Skills")} ${t("failed")}: ${(error as Error).message}`);
		}
	}

	/** 尝试启用 settings 插件（内容包没带就静默跳过） */
	private async tryEnableSettingsPlugin() {
		const pluginDir = `${this.app.vault.configDir}/plugins/ioto-settings`;
		if (await this.app.vault.adapter.exists(pluginDir)) {
			await this.enableIotoSettingsPlugin();
		}
	}

	private async withDisabledTemplaterTrigger(
		action: () => Promise<void>,
	): Promise<void> {
		const templaterTrigerAtCreate = this.templaterService.getPluginSetting(
			"trigger_on_file_creation",
		);
		try {
			if (templaterTrigerAtCreate) {
				await this.templaterService.setTemplaterSetting(
					"trigger_on_file_creation",
					false,
				);
			}
			await action();
		} finally {
			if (templaterTrigerAtCreate) {
				await this.templaterService.setTemplaterSetting(
					"trigger_on_file_creation",
					true,
				);
			}
		}
	}

	private async executeWithReload(callback: () => Promise<void>): Promise<void> {
		await callback();
		setTimeout(() => {
			this.app.commands.executeCommandById("app:reload");
		}, 1000);
	}

	private async enableIotoSettingsPlugin() {
		const pluginId = "ioto-settings";
		try {
			await PluginService.reloadAndEnablePlugin(this.app, pluginId);
		} catch (e) {
			console.error("Failed to enable ioto-settings", e);
		}
	}

	/**
	 * 根据插件注册表中的 key 安装对应的 IOTO 辅助插件。
	 * 下载源由 settings.pluginDownloadSource 决定（github / gitee）。
	 */
	private async installPluginByKey(key: string): Promise<void> {
		const entry = IOTO_PLUGINS.find((p) => p.key === key);
		if (!entry) {
			new Notice(`Unknown plugin: ${key}`);
			return;
		}
		const source = this.settings.pluginDownloadSource || "gitee";
		const repoUrl =
			source === "github" ? entry.githubUrl : entry.giteeUrl;
		if (source === "github") {
			await GithubService.installPluginFrom(this.app, repoUrl);
		} else {
			await GiteeService.installPluginFrom(this.app, repoUrl);
		}
	}
}
