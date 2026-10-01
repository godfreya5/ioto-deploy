<%*
/*
** type: sync
** for: ding
*/
const {dingAppIDForSync, dingAppSecretForSync, dingBaseIDForSync, dingTableIDForSync, dingViewIDForSync, dingUserIDForSync} = app.plugins.plugins["ioto-settings"].settings;

const ding = {
	appID: `${dingAppIDForSync}`,
    appSecret: `${dingAppSecretForSync}`,
    defaultBaseID: `${dingBaseIDForSync}`,
    defaultSheetID: `${dingTableIDForSync}`,
	defaultViewID: `${dingViewIDForSync}`,
    userID: `${dingUserIDForSync}`,
}

await tp.user.ObSyncDing(tp, this.app, ding);
_%>