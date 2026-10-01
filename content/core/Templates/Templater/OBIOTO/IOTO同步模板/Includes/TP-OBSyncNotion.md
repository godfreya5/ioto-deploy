<%*
/*
** type: sync
** for: notion
*/
const {notionAPIKeyForSync, notionDataSourceIDForSync} = app.plugins.plugins["ioto-settings"].settings;

const notion = {
	apiKey: `${notionAPIKeyForSync}`,
	defaultDataSourceID: `${notionDataSourceIDForSync}`,
}

await tp.user.ObSyncNotion(tp, this.app, notion);
_%>
