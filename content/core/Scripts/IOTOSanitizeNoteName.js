/*
 ** Script Name: Sanitize Note Name
 ** Author: Johnny
 ** Bilibili: https://space.bilibili.com/432408734
 ** Version: 2.5.0
 */

var o=Object.defineProperty;var s=(n,p)=>o(n,"name",{value:p,configurable:!0});const u=/[\\/:*?"<>|#^[\]]/g,l=/[\u0000-\u001F\u007F\u00A0\u200B-\u200D\uFEFF]/g,m=/[|[\]]/g;function A(n){return n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}s(A,"escapeRegExp");function $(n,p={}){const{replacement:c="-",maxLength:g=100}=p||{},a=A(c),t=String(n??"").trim(),r=t.length>=4&&t.startsWith("[[")&&t.endsWith("]]")?t.slice(2,-2).trim():t;let e=r.replace(/[\r\n\t]+/g," ").replace(l,"").replace(u,c).replace(new RegExp(`${a}{2,}`,"g"),c).replace(/ {2,}/g," ").trim().replace(/[. ]+$/g,"").replace(new RegExp(`^${a}+|${a}+$`,"g"),"");e.length>g&&(e=e.slice(0,g).replace(new RegExp(`[.\\s${a}]+$`,"g"),""));const i=r.replace(/[\r\n\t]+/g," ").replace(l,"").replace(m,c).replace(/ {2,}/g," ").trim();return{name:e,original:r,alias:i,changed:e!==r,needsAlias:!!e&&!!i&&e!==r&&i!==e,isEmpty:!e}}s($,"IOTOSanitizeNoteName"),module.exports=$;
