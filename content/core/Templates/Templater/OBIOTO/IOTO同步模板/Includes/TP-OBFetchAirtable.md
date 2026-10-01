<%*
/*
** type: fetch
** for: airtable
*/
const {airtableAPIKeyForFetch, airtableBaseIDForFetch, airtableTableIDForFetch} = app.plugins.plugins["ioto-settings"].settings;

const airtable = {
	apiKey: `${airtableAPIKeyForFetch}`,
	defaultBaseID: `${airtableBaseIDForFetch}`,
	defaultTableID: `${airtableTableIDForFetch}`,
	tables: [
		{
			sourceName: "Demo1",
			targetFolderPath: "AirtableDemo1",
			baseID: "xxxxbaseIDxxxx",
			tableID: "xxxxtableIDxxxx",
			viewID: "xxxxviewIDxxxx",
		}
	]
}

await tp.user.ObSyncAirtable(tp, this.app, airtable, {
fetchOnly: true
});
_%>