/*
 ** Script Name: IOTO Create Project Name
 ** Author: Johnny
 ** Bilibili: https://space.bilibili.com/432408734
 ** Version: 2.5.0
 */

var f=Object.defineProperty;var a=(t,s)=>f(t,"name",{value:s,configurable:!0});function p(t,s){if(!t||!s)return!1;const l=t.replace(/\\/g,"/"),r=s.replace(/\\/g,"/").replace(/\/$/,"");return l===r||l.startsWith(r+"/")}a(p,"isPathUnder");async function d(t,s){const{projectNameSource:l="first",outcomeFolder:r=""}=app.plugins.plugins["ioto-settings"]?.settings??{},c=l==="first",n=t.split("/").filter(Boolean);let e;c||p(t,r)?e=n[1]||n[n.length-1]||"":e=n[n.length-1]||"";let o=e;if(s==="firstDash"){const i=e.indexOf("-");o=i!==-1?e.slice(i+1):e}else if(s==="lastDash"){const i=e.lastIndexOf("-");o=i!==-1?e.slice(i+1):e}return o}a(d,"IOTOCreateProjectName"),module.exports=d;
