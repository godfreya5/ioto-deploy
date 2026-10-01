<%*
/*
** type: sync
** for: baserow
*/
const {baserowAPIKeyForSync, baserowBaseIDForSync, baserowTableIDForSync, baserowUserEmailForSync, baserowUserPasswordForSync} = app.plugins.plugins["ioto-settings"].settings;

const baserow = {
	apiKey: `${baserowAPIKeyForSync}`,
	defaultBaseID: `${baserowBaseIDForSync}`,
	defaultTableID: `${baserowTableIDForSync}`,
	email: `${baserowUserEmailForSync}`,
	password: `${baserowUserPasswordForSync}`,
}

await tp.user.ObSyncBaserow(tp, this.app, baserow);
_%>