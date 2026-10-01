/*
 ** Script Name: OB Sync To Dingtalk AITable
 ** Author: Johnny
 ** Bilibili: https://space.bilibili.com/432408734
 ** Version: 2.5.0
 */

var u=Object.defineProperty;var o=(e,n)=>u(e,"name",{value:n,configurable:!0});async function I(e,n,O,c={fetchOnly:!1,updateNotesInOB:!0,defaultSyncOption:0}){if(!new(e.user.IOTOUtility(e,n))(e,n).checkDBSettings(O,"ding"))return;e.IOTOConfigText=e.user.IOTOConfigText();const y=e.user.IOTOObSyncer(e),t=e.user.IOTODingDB(e),r=e.user.IOTODingSyncer(e),s=new t(O),i=new r(s,e,n,c.updateNotesInOB??!0);return await new y(e,n,i).syncWithNocoDB(c.fetchOnly??!1,c.defaultSyncOption??0)}o(I,"obSyncDing"),module.exports=I;
