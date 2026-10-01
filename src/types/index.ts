import { App } from "obsidian";

// 扩展 App 类型以包含 commands 属性
declare module "obsidian" {
	interface App {
		commands: {
			executeCommandById(id: string): void;
		};
		plugins: {
			plugins: {
				[key: string]: any;
			};
			manifests: {
				[key: string]: {
					id: string;
					name: string;
					version: string;
					[k: string]: any;
				};
			};
		};
		dom: {
			appContainerEl: HTMLElement;
		};
	}
}

export interface IOTOUpdateSettings {
	iotoRunningLanguage: string;
	pluginDownloadSource?: "github" | "gitee";
	iotoFrameworkPath: string;
}
