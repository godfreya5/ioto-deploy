<%*
/*
** type: fetch
** for: baserow
*/
const {baserowAPIKeyForFetch, baserowBaseIDForFetch, baserowTableIDForFetch} = app.plugins.plugins["ioto-settings"].settings;

const baserow = {
	apiKey: `${baserowAPIKeyForFetch}`,
	defaultBaseID: `${baserowBaseIDForFetch}`,
	defaultTableID: `${baserowTableIDForFetch}`,
	tables: [
		{
			sourceName: "Demo1",
			targetFolderPath: "BaserowDemo1",
			baseID: "xxxxbaseIDxxxx",
			tableID: "xxxxtableIDxxxx",
			viewID: "xxxxviewIDxxxx",
		}
	]
}

await tp.user.ObSyncBaserow(tp, this.app, baserow, {
fetchOnly: true
});
_%>