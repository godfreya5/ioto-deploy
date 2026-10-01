/*
 ** Script Name: IOTO Get File or Link From Folder
 ** Author: Johnny
 ** Bilibili: https://space.bilibili.com/432408734
 ** Version: 2.5.0
 */

var u=Object.defineProperty;var i=(a,e)=>u(a,"name",{value:e,configurable:!0});async function f(a,e,r=!1){const n=app.vault.getMarkdownFiles().filter(t=>t.parent.path===e||t.parent.name===e);let s=[],l=[];n.forEach((t,p)=>{const c=`${p+1}. ${t.basename}`;s.push(c),l.push(p)});const o=await a.system.suggester(s,l);return o===null?null:r?`[[${app.metadataCache.fileToLinktext(n[o],app.vault.getName())}]]`:n[o]}i(f,"IOTOGetFileOrLinkFromFolder"),module.exports=f;
