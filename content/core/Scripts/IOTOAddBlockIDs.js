/*
 ** Script Name: IOTO Add Block IDs
 ** Author: Johnny
 ** Bilibili: https://space.bilibili.com/432408734
 ** Version: 2.5.0
 */

var P=Object.defineProperty;var s=(e,w)=>P(e,"name",{value:w,configurable:!0});async function Y(e,w,C={}){const D=new(e.user.IOTOMultiLangs(e))(e);let{date:r,prefix:a,useSingleLineAsSeparator:u}=C;const g=app.plugins.plugins["ioto-settings"]?.settings;if(r=r||await e.system.prompt(D.t("InputDate"),e.date.now(g?.iotoUtilsQuickBlockIdDateFormat||"YYYYMMDDHHmmss")),!r||(a=a||await e.system.suggester(t=>t,(g?.iotoUtilsQuickBlockTypes||"").trim().split(`
`).filter(Boolean)),!a))return"";u=u||g?.iotoUtilsQuickBlockIdUseSingleLineAsSeparator;const y=app.vault,l=app.workspace.getActiveFile(),L=e.file.content,d=app.metadataCache.getFileCache(l)?.frontmatterPosition,S=/\s\^[^\s]+/g,m=u?`
`:`

`,T=s(t=>t.trim()!==""&&!t.trim().startsWith("#")&&!t.trim().match(/^>\s*$/g),"shouldAddBlockID"),A=s(t=>t.replace(S,""),"stripExistingBlockIDs"),b=s((t,n)=>m===`
`?`${t} ${n}`:`${t}
${n}`,"formatBlockWithId"),v=s(t=>t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"escapeRegExp"),I=s(t=>{const n=`#IOTO_CODE_BLOCK_PLACEHOLDER_${Math.random().toString(36).slice(2)}_`,i=[],F=t.replace(/```[\s\S]*?```/g,o=>{const c=i.length;return i.push(o),`${n}${c}`}).split(m);let $=0;const h=[],M=F.map(o=>{if(!T(o))return o;$+=1;const c=A(o),p=`^${a}-${r}-${$}`;return h.push(p),b(c,p)}).join(m),_=new RegExp(`${v(n)}(\\d+)`,"g");return{content:M.replace(_,(o,c)=>{const p=Number(c);return i[p]??o}),blockIds:h}},"addBlockIDsToContent"),k=e.file.selection();if(k&&k.trim()!==""){const n=app.workspace.getActiveViewOfType(e.obsidian.MarkdownView)?.editor;if(!n)return"";const{content:i,blockIds:O}=I(k);return n.replaceSelection(i),await e.user.IOTOUtility.waitForBlocks(app,l,O),""}const f=L.split(`
`),E=d?f.slice(d.end.line+1):f,B=d?f.slice(0,d.end.line+1):[],{content:R,blockIds:U}=I(E.join(`
`)),x=B.length?B.join(`
`)+`
`:"";await y.modify(l,x+R),await e.user.IOTOUtility.waitForBlocks(app,l,U)}s(Y,"IOTOAddBlockIDs"),module.exports=Y;
