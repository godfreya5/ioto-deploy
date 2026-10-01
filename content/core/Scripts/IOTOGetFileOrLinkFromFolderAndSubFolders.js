/*
 ** Script Name: IOTO Get File Or Link From Folder And Sub Folders
 ** Author: Johnny
 ** Bilibili: https://space.bilibili.com/432408734
 ** Version: 2.5.0
 */

var u=Object.defineProperty;var p=(t,e)=>u(t,"name",{value:e,configurable:!0});async function h(t,e,r=!1){const a=app.vault.getMarkdownFiles().filter(n=>n.parent.path.startsWith(e));let o=[],l=[];a.forEach((n,i)=>{const c=`${i+1}. ${n.basename}`;o.push(c),l.push(i)});const s=await t.system.suggester(o,l);return s===null?null:r?`[[${app.metadataCache.fileToLinktext(a[s],app.vault.getName())}]]`:a[s]}p(h,"IOTOGetFileOrLinkFromFolderAndSubFolders"),module.exports=h;
