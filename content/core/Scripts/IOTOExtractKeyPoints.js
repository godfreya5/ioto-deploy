/*
 ** Script Name: IOTO Extract Key Points
 ** Author: Johnny
 ** Bilibili: https://space.bilibili.com/432408734
 ** Version: 2.5.0
 */

var T=Object.defineProperty;var l=(o,t)=>T(o,"name",{value:t,configurable:!0});function C(o){return String(o??"").replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}l(C,"escapeRegExp");function K(o){const t=`IOTOEKPPLACEHOLDER.${Math.random().toString(36).slice(2)}.`,i=[];return{text:String(o??"").replace(/```[\s\S]*?```/g,r=>`${t}${i.push(r)-1}`).replace(/`[^`\n]*`/g,r=>`${t}${i.push(r)-1}`),restore:l(r=>String(r??"").replace(new RegExp(`${C(t)}(\\d+)`,"g"),(s,u)=>i[Number(u)]??s),"restore")}}l(K,"protectCodeSpans");async function N(o,t,i){const e=new(t.user.IOTOMultiLangs(t))(t),w={strong:/\*\*([^\n]+?)\*\*/g,highlight:/==([^\n]+?)==/g,italic:/(?<![*_])(?:\*([^*\n]+)\*|_([^_\n]+)_)(?![*_])/g,underline:/<u>([^\n]*?)<\/u>/g,heading:/^(#{1,6}\s.+)/gm,keyword:null},r=[e.t("ExtractBoldContent"),e.t("ExtractHighlightContent"),e.t("ExtractItalicContent"),e.t("ExtractUnderlineContent"),e.t("ExtractHeadings"),e.t("ExtractLinesContainingKeyword")],s=await t.system.suggester(r.map((n,c)=>`${c+1}. ${n}`),Object.keys(w));if(!s)return"";const u=l(n=>{t?.obsidian?.Notice&&new t.obsidian.Notice(n)},"notify"),{text:x,restore:y}=K(o);if(s==="keyword"){const n=await t.system.prompt(e.t("PleaseInputKeyword"));if(!n)return e.t("KeywordNotInput");const c=new RegExp(`^.*${C(n)}.*$`,"gm"),h=[...new Set(x.match(c)||[])];return h.length?y(h.join(`

`)):e.t("NoLinesContainingKeyword")}const E=w[s],a=[];let g;for(;(g=E.exec(x))!==null;){const n=y(g[1]||g[2]||g[0]);a.includes(n)||a.push(n)}if(!a.length)return e.t("NoMatchingContent");const f=s==="heading"?a.join(`
`):a.map(n=>"- "+n.trim()).join(`
`),p=await t.system.suggester([e.t("OutputToKeyPointsFile"),e.t("OutputToCurrentFile")],["new","current"]);if(p==="new"){const n=`${t.file.title} - ${e.t("KeyPoints")}`,c=t.user.IOTOSanitizeNoteName,d=(typeof c=="function"?c(n)?.name:"")||n,m=app.vault.getAbstractFileByPath(`${t.file.folder(!0)}/${d}.md`);try{if(m){const $=await app.vault.read(m),O=t.date.now("YYYY-MM-DD HH:mm");await app.vault.modify(m,`${$}

## ${O}

${f}`)}else await t.file.create_new(f,d,!0,t.file.folder(!0))}catch{return u(e.t("KeyPointsCreateFailed",{title:d})),i}u(e.t("KeyPointsSavedToNote",{count:a.length,title:d})),i=""}else p==="current"&&(i=f);return i}l(N,"IOTOExtractKeyPoints"),module.exports=N;
