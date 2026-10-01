/*
 ** Script Name: IOTO Quick Image
 ** Author: Johnny
 ** Bilibili: https://space.bilibili.com/432408734
 ** Version: 2.5.0
 */

var g=Object.defineProperty;var o=(i,t)=>g(i,"name",{value:t,configurable:!0});const r=class r{constructor(t,s,e={}){this.tp=t,this.tR=s,this.iotoSettings=app.plugins.plugins["ioto-settings"]?.settings,this.settings=Object.assign({size:(this.iotoSettings?.iotoUtilsQuickImageSize||"").trim().split(`
`).filter(Boolean),useMask:this.iotoSettings?.iotoUtilsQuickImageMask,maskType:0},e),this.ml=new(t.user.IOTOMultiLangs(t))(t)}async makeImage(){const{size:t=["1920x1080","500x500"],useMask:s}=this.settings,e=await this.tp.system.suggester(t,t,!1,this.ml.t("Please select the size of the image you want to insert"));if(!e)return"";let m="&mask=";if(s){const c={1:"corners",2:"ellipse"},p=await this.tp.system.suggester([this.ml.t("No mask"),this.ml.t("Round mask"),this.ml.t("Circle mask")],[0,1,2],!1,this.ml.t("Please select the mask type you want to use"));m+=c[p]||""}const l=await this.tp.system.prompt(this.ml.t("Please input the keywords of the image you want to find (English)"));if(!l)return"";let a=await this.tp.web.random_picture(e,l);return a=a.replace(/\)$/g,`&fit=crop${m})`).replace("crop=entropy","crop=faces,focalpoint,center,entropy").replace("fm=jpg","fm=png"),this.tR+=a,this.tR}};o(r,"QuickImage");let n=r;async function h(i,t,s){return new n(i,t,s).makeImage()}o(h,"IOTOQuickImage"),module.exports=h;
