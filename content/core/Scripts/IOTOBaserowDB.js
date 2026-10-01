/*
 ** Script Name: IOTO Baserow DB
 ** Author: Johnny
 ** Bilibili: https://space.bilibili.com/432408734
 ** Version: 2.5.0
 */

var c=Object.defineProperty;var d=(r,s)=>c(r,"name",{value:s,configurable:!0});function n(r){var a;let s=r.user.IOTONoCodeDB(r);return a=class extends s{constructor(e){super(e,{dbName:"Baserow",recordIdPropertyName:"baserowRecordID",recordIdPropertyNameForDownload:"baserowDownloadRecordID",recordIdName:"id",useDate:!1,apiUrlRoot:e.apiUrlRoot||"https://api.baserow.io/api/",recordUrlRoot:e.recordUrlRoot||"https://baserow.io/"},{baseIDName:"databaseID",defaultBaseIDName:"defaultBaseID",downloadBaseIDName:"downloadBaseID",tableIDName:"tableID",defaultTableIDName:"defaultTableID",downloadTableIDName:"downloadTableID"}),this.email=e.email||"",this.password=e.password||"",this.contentMaxLength=1e5,this.extractKeyPointsAsText=!0,this.extractBlocksAsText=!0,this.extractTagLinesAsText=!0,this.extractSectionsAsText=!0}makeApiUrl(e,t,o){return`${e.replace(/\/$/,"")}/database/rows/table/${o}/`}makeFieldsApiUrl(e,t,o){return`${e.replace(/\/$/,"")}/database/fields/table/${o}/`}makeUpdateFieldApiUrl(e,t){return`${e.replace(/\/$/,"")}/database/fields/`}setSyncFolderRecordTableUrlBase(e,t="upload"){const o=this.findSyncFolderNocodDBTableID(e,t),l=this.findSyncFolderNocodDBBaseID(e,t);return`${this.recordUrlRoot.replace(/\/$/,"")}/database/${l}/table/${o}/row/`}},d(a,"MyBaserowDB"),a}d(n,"IOTOBaserowDB"),module.exports=n;
