import type IOTOUpdate from "../main";
import { CommandService } from "./command-service";
import { SettingsManager } from "../models/settings";
import { TemplaterService } from "./templater-service";
import { ContentDeployService } from "./content-deploy-service";

export class ServiceContainer {
	private _plugin: IOTOUpdate;
	private _settingsManager: SettingsManager;

	private _deployService: ContentDeployService;
	private _templaterService: TemplaterService;
	private _commandService: CommandService;

	constructor(plugin: IOTOUpdate) {
		this._plugin = plugin;
	}

	public get settingsManager(): SettingsManager {
		if (!this._settingsManager) {
			this._settingsManager = new SettingsManager(
				() => this._plugin.loadData(),
				(data) => this._plugin.saveData(data),
				this._plugin.app
			);
		}
		return this._settingsManager;
	}

	public get deployService(): ContentDeployService {
		if (!this._deployService) {
			this._deployService = new ContentDeployService(this._plugin.app);
		}
		return this._deployService;
	}

	public get templaterService(): TemplaterService {
		if (!this._templaterService) {
			this._templaterService = new TemplaterService(this._plugin.app);
		}
		return this._templaterService;
	}

	public get commandService(): CommandService {
		if (!this._commandService) {
			this._commandService = new CommandService(
				this._plugin.app,
				this._plugin,
				this._plugin.addCommand.bind(this._plugin),
				this._plugin.settings,
				this.templaterService,
				this.deployService
			);
		}
		return this._commandService;
	}
}
