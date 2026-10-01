/*
 ** Script Name: IOTO Note Maker
 ** Author: Johnny
 ** Bilibili: https://space.bilibili.com/432408734
 ** Version: 2.5.0
 */

var m=Object.defineProperty;var n=(r,t)=>m(r,"name",{value:t,configurable:!0});const a=class a{constructor(t,e){this.tp=t,this.file=e,this.frontmatter=app.metadataCache.getFileCache(e)?.frontmatter,this.yamlCooker=new(t.user.IOTOYAMLCooker())(t),this.fmDict=this.yamlCooker.parseFmDict(this.frontmatter)}async prepareNoteFm(t,e=!1){this.fm=this.yamlCooker.dumpsFm(t,e)}async prepareNoteContent(){let t=await app.vault.read(this.file);this.fullContent=t,this.content=this.removeFrontMatterFromContent(this.fullContent)}removeFrontMatterFromContent(t){let e=t.split(`
`),i=0;if(this.frontmatter){for(let[s,l]of e.entries())if(s!==0&&l=="---"){i=s+1;break}}return e.slice(i).join(`
`).trim()}};n(a,"IOTONote");let o=a;function h(r,t){return new o(r,t)}n(h,"IOTONoteMaker"),module.exports=h;
