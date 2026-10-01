/*
 ** Script Name: OB Sync To Baserow
 ** Author: Johnny
 ** Bilibili: https://space.bilibili.com/432408734
 ** Version: 2.5.0
 */

var i=Object.defineProperty;var O=(e,n)=>i(e,"name",{value:n,configurable:!0});async function B(e,n,o,c={fetchOnly:!1,updateNotesInOB:!0,defaultSyncOption:0}){if(!new(e.user.IOTOUtility(e,n))(e,n).checkDBSettings(o,"baserow"))return;e.IOTOConfigText=e.user.IOTOConfigText();const r=e.user.IOTOObSyncer(e),y=e.user.IOTOBaserowDB(e),s=e.user.IOTOBaserowSyncer(e),t=new y(o),u=new s(t,e,n,c.updateNotesInOB??!0);return await new r(e,n,u).syncWithNocoDB(c.fetchOnly??!1,c.defaultSyncOption??0)}O(B,"obSyncBaserow"),module.exports=B;
