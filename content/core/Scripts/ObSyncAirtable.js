/*
 ** Script Name: OB Sync To Airtable
 ** Author: Johnny
 ** Bilibili: https://space.bilibili.com/432408734
 ** Version: 2.5.0
 */

var u=Object.defineProperty;var t=(e,n)=>u(e,"name",{value:n,configurable:!0});async function l(e,n,O,c={fetchOnly:!1,updateNotesInOB:!0,defaultSyncOption:0}){if(!new(e.user.IOTOUtility(e,n))(e,n).checkDBSettings(O,"airtable"))return;e.IOTOConfigText=e.user.IOTOConfigText();const r=e.user.IOTOObSyncer(e),o=e.user.IOTOAirtableDB(e),y=e.user.IOTOAirtableSyncer(e),s=new o(O),i=new y(s,e,n,c.updateNotesInOB??!0);return await new r(e,n,i).syncWithNocoDB(c.fetchOnly??!1,c.defaultSyncOption??0)}t(l,"obSyncAirtable"),module.exports=l;
