/*
 ** Script Name: OB Sync To Notion
 ** Author: Johnny
 ** Bilibili: https://space.bilibili.com/432408734
 ** Version: 2.5.0
 */

var u=Object.defineProperty;var O=(n,e)=>u(n,"name",{value:e,configurable:!0});async function I(n,e,c,o={fetchOnly:!1,updateNotesInOB:!0,defaultSyncOption:0}){if(!new(n.user.IOTOUtility(n,e))(n,e).checkDBSettings(c,"notion"))return;n.IOTOConfigText=n.user.IOTOConfigText();const t=n.user.IOTOObSyncer(n),y=n.user.IOTONotionDB(n),r=n.user.IOTONotionSyncer(n),s=new y(c),i=new r(s,n,e,o.updateNotesInOB??!0);return await new t(n,e,i).syncWithNocoDB(o.fetchOnly??!1,o.defaultSyncOption??0)}O(I,"obSyncNotion"),module.exports=I;
