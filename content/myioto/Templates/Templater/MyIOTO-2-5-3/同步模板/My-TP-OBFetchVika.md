<%*
/*
** type: fetch
** for: vika
*/
const {vikaAPIKeyForFetch, vikaTableIDForFetch} = app.plugins.plugins["ioto-settings"].settings;

const vika = {
	apiKey: `${vikaAPIKeyForFetch}`,
	defaultTableID: `${vikaTableIDForFetch}`,
	tables: [
		{
			sourceName: "Demo1",
			targetFolderPath: "VikaDemo1",
			tableID: "xxxxtableIDxxxx",
			viewID: "xxxxviewIDxxxx",
		}
	]
}

await tp.user.ObSyncVika(tp, this.app, vika, {
fetchOnly: true
});
_%>