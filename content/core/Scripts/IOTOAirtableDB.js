/*
 ** Script Name: IOTO Airtable DB
 ** Author: Johnny
 ** Bilibili: https://space.bilibili.com/432408734
 ** Version: 2.5.0
 */

var d=Object.defineProperty;var r=(a,t)=>d(a,"name",{value:t,configurable:!0});function c(a){var e;let t=a.user.IOTONoCodeDB(a);return e=class extends t{constructor(o){super(o,{dbName:"Airtable",recordIdPropertyName:"airtableRecordID",recordIdPropertyNameForDownload:"airtableDownloadRecordID",recordIdName:"id",useDate:!1,apiUrlRoot:"https://api.airtable.com/v0/",recordUrlRoot:"https://airtable.com/"},{baseIDName:"baseID",defaultBaseIDName:"defaultBaseID",downloadBaseIDName:"downloadBaseID",tableIDName:"tableID",defaultTableIDName:"defaultTableID",downloadTableIDName:"downloadTableID"}),this.extractKeyPointsAsText=!1,this.extractBlocksAsText=!1,this.extractTagLinesAsText=!1,this.extractSectionsAsText=!0,this.contentMaxLength=99900}makeApiUrl(o,s,l){return`${o}${s}/${l}`}},r(e,"MyAirtableDB"),e}r(c,"IOTOAirtableDB"),module.exports=c;
