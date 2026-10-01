/*
 ** Script Name: IOTO Notion Request Scheduler
 ** Author: Johnny
 ** Bilibili: https://space.bilibili.com/432408734
 ** Version: 2.5.0
 */

var h=Object.defineProperty;var n=(u,s)=>h(u,"name",{value:s,configurable:!0});function a(u){var s;return s=class{constructor({minIntervalMs:t=0,maxConcurrency:e=1}={}){this.minIntervalMs=Number(t)>0?Number(t):0,this.maxConcurrency=Number(e)>=1?Math.floor(Number(e)):1,this.queue=[],this.activeCount=0,this.lastStartAt=0,this.pauseUntil=0,this.timer=null}updateConfig({minIntervalMs:t,maxConcurrency:e}={}){t!==void 0&&(this.minIntervalMs=Number(t)>0?Number(t):0),e!==void 0&&(this.maxConcurrency=Number(e)>=1?Math.floor(Number(e)):1),this._drain()}pause(t){const e=Number(t)>0?Number(t):0;if(!e)return;const i=Date.now()+e;i>this.pauseUntil&&(this.pauseUntil=i),this._drain()}schedule(t){return new Promise((e,i)=>{this.queue.push({task:t,resolve:e,reject:i}),this._drain()})}_drain(){if(!this.timer)for(;this.activeCount<this.maxConcurrency&&this.queue.length;){const t=Date.now(),e=Math.max(this.lastStartAt+this.minIntervalMs,this.pauseUntil)||0;if(e>t){this.timer=setTimeout(()=>{this.timer=null,this._drain()},e-t);return}const i=this.queue.shift();if(!i)return;this.activeCount++,this.lastStartAt=Date.now(),Promise.resolve().then(()=>i.task()).then(r=>i.resolve(r)).catch(r=>i.reject(r)).finally(()=>{this.activeCount--,this._drain()})}}},n(s,"NotionRequestScheduler"),s}n(a,"IOTONotionRequestScheduler"),module.exports=a;
