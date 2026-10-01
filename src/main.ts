import { Plugin } from "obsidian";
import { IOTOUpdateSettings } from "./types";
import { SettingsManager } from "./models/settings";
import { IOTOUpdateSettingTab } from "./ui/settings-tab";
import { CommandService } from "./services/command-service";
import { TemplaterService } from "./services/templater-service";
import { ContentDeployService } from "./services/content-deploy-service";
import { ServiceContainer } from "./services/service-container";

export default class IOTOUpdate extends Plugin {
	settings: IOTOUpdateSettings;
	settingsManager: SettingsManager;
	private services: ServiceContainer;
	public deployService: ContentDeployService;
	private templaterService: TemplaterService;
	private commandService: CommandService;

	async onload() {
		this.services = new ServiceContainer(this);
		this.settingsManager = this.services.settingsManager;
		await this.loadSettings();

		this.deployService = this.services.deployService;
		this.templaterService = this.services.templaterService;
		this.commandService = this.services.commandService;

		this.commandService.registerCommands();

		this.addSettingTab(new IOTOUpdateSettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = await this.settingsManager.load();
	}

	async saveSettings() {
		this.settingsManager.update(this.settings);
		await this.settingsManager.save();
	}
}
