/*
 ** Script Name: IOTO Load Template
 ** Author: Johnny
 ** Bilibili: https://space.bilibili.com/432408734
 ** Version: 2.5.0
 */

var M=Object.defineProperty;var l=(i,n)=>M(i,"name",{value:n,configurable:!0});async function m(i,n,e,s,u=!0){const f=new(i.user.IOTOMultiLangs(i))(i),o=new(i.user.IOTOUtility(i,e))(i,e),O=!!e.plugins.plugins["ioto-update"]?.settings,g=!!e.plugins.plugins["ob-sync-with-mdb"]?.settings;if(O&&!o.checkIOTOUserPermission()||g&&!o.checkOBSyncWithMDBUserPermission())return"";const{useUserTemplate:y=!0,userTemplatePrefix:h="My"}=e.plugins.plugins["ioto-settings"]?.settings??{},r=h||"My",t=y?i.file.find_tfile(`${r}-${s}`)?`${r}-${s}`:i.file.find_tfile(`My-${s}`)?`My-${s}`:s:s;if(u){const c=i.file.find_tfile(t);return c?(n+=await i.file.include(c),n):(new i.obsidian.Notice(f.t("TemplateNotExist",{template:t})),"")}else return t}l(m,"IOTOLoadTemplate"),module.exports=m;
