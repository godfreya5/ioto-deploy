<%*
/*
** type: fetch
** for: feishu
*/
const {feishuAppIDForFetch, feishuAppSecretForFetch, feishuBaseIDForFetch, feishuTableIDForFetch} = app.plugins.plugins["ioto-settings"].settings;

const feishu = {
	appID: `${feishuAppIDForFetch}`,
	appSecret: `${feishuAppSecretForFetch}`,
	defaultAppToken: `${feishuBaseIDForFetch}`,
	defaultTableID: `${feishuTableIDForFetch}`,
	tables: [
		{
			sourceName: "Demo1",
			targetFolderPath: "FeishuDemo1",
			appToken: "",
			tableID: "xxxxtableIDxxxx",
			viewID: "xxxxviewIDxxxx",
		}
	]
}

await tp.user.ObSyncFeishu(tp, this.app, feishu, {
fetchOnly: true
});
_%>