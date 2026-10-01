<%*
/*
** type: sync
** for: feishu
*/
const {feishuAppIDForSync, feishuAppSecretForSync, feishuBaseIDForSync, feishuTableIDForSync} = app.plugins.plugins["ioto-settings"].settings;

const feishu = {
	appID: `${feishuAppIDForSync}`,
	appSecret: `${feishuAppSecretForSync}`,
	defaultAppToken: `${feishuBaseIDForSync}`,
	defaultTableID: `${feishuTableIDForSync}`,
}

await tp.user.ObSyncFeishu(tp, this.app, feishu);
_%>