<%*
/*
** type: fetch
** for: ding
*/
const {dingAppIDForFetch, dingAppSecretForFetch, dingBaseIDForFetch, dingTableIDForFetch, dingUserIDForFetch} = app.plugins.plugins["ioto-settings"].settings;

const ding = {
	appID: `${dingAppIDForFetch}`,
	userID: `${dingUserIDForFetch}`,
	appSecret: `${dingAppSecretForFetch}`,
	defaultBaseID: `${dingBaseIDForFetch}`,
	defaultSheetID: `${dingTableIDForFetch}`,
	tables: [
		{
			sourceName: "Demo",
			targetFolderPath: "Demo/Ding/Fetch",
			viewID: "xxxxviewIDxxxx",
		}
	]
}

await tp.user.ObSyncDing(tp, this.app, ding, {
fetchOnly: true
});
_%>