/*
 ** Script Name: IOTO YAML Cooker
 ** Author: Johnny
 ** Bilibili: https://space.bilibili.com/432408734
 ** Version: 2.5.0
 */

var p=Object.defineProperty;var a=(i,l)=>p(i,"name",{value:l,configurable:!0});function c(){var i;return i=class{constructor(e){this.tp=e,this.forceQuotesProperties=["defaultTemplate"]}parseFmDict(e){if(!e)return{};const n=["position","Tags","tag","Aliases","Alias","alias"];return Object.entries(e).filter(([t])=>!n.includes(t)).reduce((t,[r,o])=>{const s=this.tp.obsidian.parseFrontMatterEntry(e,r);return o instanceof Array?t[r]=this.tp.obsidian.parseFrontMatterStringArray(e,r)||"":this.forceQuotesProperties.includes(r)?t[r]=`"${s}"`||"":s===0?t[r]=s:typeof s=="string"&&s.includes(`
`)?t[r]=`|-
`+s.split(`
`).map(u=>" "+u).join(`
`):typeof s=="boolean"?t[r]=s:t[r]=s||"",t},{})}addQuotationInFrontMatter(e){for(let[n,t]of Object.entries(e))t instanceof Array?e[n]=t.map(r=>r!==""?`"${r}"`:r):e[n]=t!==""?`"${t}"`:t}dumpsFm(e,n=!1){let t=n?this.sortFmDict(e):e,r=Object.entries(t).map(([o,s])=>o+": "+this.makeFmValue(s)).join(`
`);return r=r?`---
`+r+`
---
`:"",r}sortFmDict(e){return Object.keys(e).sort().reduce((t,r)=>(t[r]=e[r],t),{})}makeFmValue(e){if(e instanceof Array){const n=e.map(t=>typeof t=="object"&&t!==null?"":" - "+this.addQuotesForSpecialValue(t)).join(`
`);return e.length?`
`+n:e}else return typeof e=="string"?this.addQuotesForSpecialValue(e):typeof e<"u"?e:""}isNumericString(e){return!isNaN(e)&&!isNaN(parseFloat(e))}addQuotesForSpecialValue(e){return e.includes(": ")&&!e.startsWith("|-")||e.startsWith("[[")||e.startsWith("#")||this.isNumericString(e)?`"${e}"`:e}},a(i,"YAMLCooker"),i}a(c,"IOTOYAMLCooker"),module.exports=c;
