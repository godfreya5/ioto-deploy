<%*
/*
** type: sync
** for: airtable
*/
const {airtableAPIKeyForSync, airtableBaseIDForSync, airtableTableIDForSync} = app.plugins.plugins["ioto-settings"].settings;

const airtable = {
	apiKey: `${airtableAPIKeyForSync}`,
	defaultBaseID: `${airtableBaseIDForSync}`,
	defaultTableID: `${airtableTableIDForSync}`,
}

await tp.user.ObSyncAirtable(tp, this.app, airtable);
_%>