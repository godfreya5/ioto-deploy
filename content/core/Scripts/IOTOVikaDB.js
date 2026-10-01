/*
 ** Script Name: IOTO Vika DB
 ** Author: Johnny
 ** Bilibili: https://space.bilibili.com/432408734
 ** Version: 2.5.0
 */

var d=Object.defineProperty;var s=(r,a)=>d(r,"name",{value:a,configurable:!0});function i(r){var t;let a=r.user.IOTONoCodeDB(r);return t=class extends a{constructor(e){super(e,{dbName:"VIKA",recordIdPropertyName:"vikaRecordID",recordIdPropertyNameForDownload:"vikaDownloadRecordID",recordIdName:"recordId",useDate:!1,apiUrlRoot:e.apiUrlRoot??"https://api.vika.cn/fusion/v1/datasheets/",recordUrlRoot:e.recordUrlRoot??"https://vika.cn/workbench/"},{tableIDName:"tableID",defaultTableIDName:"defaultTableID",downloadTableIDName:"downloadTableID"}),delete this.defaultBaseID,this.apiUrlBase=this.apiUrlRoot,this.apiUrl=this.apiUrlBase+`${this.defaultTableID}/records?fieldKey=name`,this.recordUrlBase=this.recordUrlRoot,this.extractKeyPointsAsText=!0,this.extractBlocksAsText=!0,this.extractTagLinesAsText=!0,this.extractSectionsAsText=!0,this.contentMaxLength=99e3}setSyncFolderRecordTableUrlBase(e,l="upload"){let o=this.findSyncFolderNocodDBTableID(e,l);return this.recordUrlRoot+o+"/"}makeApiUrl(e,l,o){return`${e}${o}/records?fieldKey=name`}},s(t,"MyVikaDB"),t}s(i,"IOTOVikaDB"),module.exports=i;
