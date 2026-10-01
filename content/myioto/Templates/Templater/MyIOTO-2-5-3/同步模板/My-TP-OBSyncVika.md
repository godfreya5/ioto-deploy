<%*
/*
** type: sync
** for: vika
*/
const {vikaAPIKeyForSync, vikaTableIDForSync} = app.plugins.plugins["ioto-settings"].settings;

const vika = {
	apiKey: `${vikaAPIKeyForSync}`,
	defaultTableID: `${vikaTableIDForSync}`,
}

await tp.user.ObSyncVika(tp, this.app, vika);
_%>