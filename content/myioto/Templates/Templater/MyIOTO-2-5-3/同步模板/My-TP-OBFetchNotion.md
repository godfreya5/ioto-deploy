<%*
/*
** type: fetch
** for: notion
*/
const {notionAPIKeyForFetch, notionDataSourceIDForFetch} = app.plugins.plugins["ioto-settings"].settings;

const notion = {
	apiKey: `${notionAPIKeyForFetch}`,
	defaultDataSourceID: `${notionDataSourceIDForFetch}`,
	tables: [
		{
			sourceName: "Demo1",
			targetFolderPath: "NotionDemo1",
			dataSourceID: "",
		}
	]
}

await tp.user.ObSyncNotion(tp, this.app, notion, {
fetchOnly: true
});
_%>
