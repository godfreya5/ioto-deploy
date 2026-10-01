/*
 ** Script Name: IOTO Feishu DB
 ** Author: Johnny
 ** Bilibili: https://space.bilibili.com/432408734
 ** Version: 2.5.0
 */

var p=Object.defineProperty;var d=(a,s)=>p(a,"name",{value:s,configurable:!0});function i(a){var t;let s=a.user.IOTONoCodeDB(a);return t=class extends s{constructor(e){super(e,{dbName:"Feishu",recordIdPropertyName:"feishuRecordID",recordIdPropertyNameForDownload:"feishuDownloadRecordID",recordIdName:"record_id",useDate:!0,apiUrlRoot:"https://open.feishu.cn/open-apis/bitable/v1/",recordUrlRoot:"https://feishu.cn/base/"},{baseIDName:"appToken",defaultBaseIDName:"defaultAppToken",downloadBaseIDName:"downloadAppToken",tableIDName:"tableID",defaultTableIDName:"defaultTableID",downloadTableIDName:"downloadTableID"}),delete this.apiKey,delete this.defaultBaseID,this.appID=e.appID,this.appSecret=e.appSecret,this.defaultAppToken=e.defaultAppToken||e.appToken||"",this.apiUrlBase=this.apiUrlRoot+`apps/${this.defaultAppToken}/`,this.apiUrl=this.apiUrlBase+`tables/${this.defaultTableID}/records`,this.recordUrlBase=`${this.recordUrlRoot}${this.defaultAppToken}?table=`,this.extractKeyPointsAsText=!0,this.extractBlocksAsText=!0,this.extractTagLinesAsText=!0,this.extractSectionsAsText=!0,this.contentMaxLength=19900}makeApiUrl(e,r,o){return`${e}apps/${r}/tables/${o}/records`}setSyncFolderRecordTableUrlBase(e,r="upload"){const o=this.findSyncFolderNocodDBTableID(e,r),l=this.findSyncFolderNocodDBBaseID(e,r);return this.recordUrlRoot+l+"?table="+o+"&record_id="}},d(t,"MyFeishuDB"),t}d(i,"IOTOFeishuDB"),module.exports=i;
