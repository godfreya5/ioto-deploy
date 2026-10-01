/*
 ** Script Name: OB Sync To Feishu
 ** Author: Johnny
 ** Bilibili: https://space.bilibili.com/432408734
 ** Version: 2.5.0
 */

var i=Object.defineProperty;var o=(e,n)=>i(e,"name",{value:n,configurable:!0});async function I(e,n,O,c={fetchOnly:!1,updateNotesInOB:!0,defaultSyncOption:0}){if(!new(e.user.IOTOUtility(e,n))(e,n).checkDBSettings(O,"feishu"))return;e.IOTOConfigText=e.user.IOTOConfigText();const y=e.user.IOTOObSyncer(e),s=e.user.IOTOFeishuDB(e),t=e.user.IOTOFeishuSyncer(e),r=new s(O),u=new t(r,e,n,c.updateNotesInOB??!0);return await new y(e,n,u).syncWithNocoDB(c.fetchOnly??!1,c.defaultSyncOption??0)}o(I,"obSyncFeishu"),module.exports=I;
