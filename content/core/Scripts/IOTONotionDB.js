/*
 ** Script Name: IOTO Notion DB
 ** Author: Johnny
 ** Bilibili: https://space.bilibili.com/432408734
 ** Version: 2.5.0
 */

var l=Object.defineProperty;var d=(t,c)=>l(t,"name",{value:c,configurable:!0});function u(t){var o;let c=t.user.IOTONoCodeDB(t);return o=class extends c{constructor(e){super(e,{dbName:"Notion",recordIdPropertyName:"notionRecordID",recordIdPropertyNameForDownload:"notionDownloadRecordID",recordIdName:"id",useDate:!1,apiUrlRoot:"https://api.notion.com/v1/",recordUrlRoot:e.recordUrlRoot||"https://www.notion.so/"},{baseIDName:"dataSourceID",defaultBaseIDName:"defaultDataSourceID",downloadBaseIDName:"downloadDataSourceID",tableIDName:"dataSourceID",defaultTableIDName:"defaultDataSourceID",downloadTableIDName:"downloadDataSourceID"}),this.notionVersion=e.notionVersion||"2026-03-11",this.contentMaxLength=1900,this.extractKeyPointsAsText=!0,this.extractBlocksAsText=!0,this.extractTagLinesAsText=!0,this.extractSectionsAsText=!0}makeApiUrl(e,a,r){return`${e.replace(/\/$/,"")}/data_sources/${r||a}/query`}makeDataSourceApiUrl(e,a,r){return`${e.replace(/\/$/,"")}/data_sources/${r||a}`}setSyncFolderRecordTableUrlBase(e,a="upload"){return`${this.recordUrlRoot.replace(/\/$/,"")}/`}},d(o,"MyNotionDB"),o}d(u,"IOTONotionDB"),module.exports=u;
