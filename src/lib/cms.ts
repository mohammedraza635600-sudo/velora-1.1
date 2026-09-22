import { useEffect, useState } from 'react'
import { supabase, configured } from './supabase'
const rgb=(h:string)=>{const n=parseInt(h.slice(1),16);return `${(n>>16)&255} ${(n>>8)&255} ${n&255}`}
export const DEFAULT_THEME={primary:'#0F2A1D',secondary:'#375534',accent:'#6B9071',soft:'#AEC3B0',background:'#E3EED4',radius:0}
export const SERIF=['Instrument Serif','Cormorant Garamond','Playfair Display','DM Serif Display'],SANS=['Hanken Grotesk','Inter','Manrope','DM Sans']
const font=(n:string,wt:boolean)=>{const id='f-'+n.replace(/ /g,'');if(document.getElementById(id))return;const l=document.createElement('link');l.id=id;l.rel='stylesheet';l.href=`https://fonts.googleapis.com/css2?family=${n.replace(/ /g,'+')}${wt?':wght@300;400;500':''}&display=swap`;document.head.appendChild(l)}
export function applyTheme(t:any){const r=document.documentElement.style,d=document.documentElement.dataset
  if(SERIF.includes(t?.fontSerif)){font(t.fontSerif,false);r.setProperty('--font-serif',`"${t.fontSerif}"`)}
  if(SANS.includes(t?.fontSans)){font(t.fontSans,true);r.setProperty('--font-sans',`"${t.fontSans}"`)}
  d.btn=t?.buttonStyle||'outline';d.header=t?.headerStyle||'transparent';d.footer=t?.footerStyle||'dark'
  if(t?.favicon_url){let l=document.querySelector("link[rel~='icon']") as HTMLLinkElement|null;if(!l){l=document.createElement('link');l.rel='icon';document.head.appendChild(l)}l.href=t.favicon_url}
  const m:Record<string,string>={primary:'forest',secondary:'olive',accent:'sage',soft:'soft',background:'ivory'}
  for(const k in m)if(/^#[0-9a-f]{6}$/i.test(t?.[k]||''))r.setProperty('--'+m[k],rgb(t[k]));if(t?.radius!=null)r.setProperty('--radius',Number(t.radius)+'px')}

export function useSettings<T=any>(key:string,d:T):T{const [v,set]=useState<T>(d);useEffect(()=>{if(configured)supabase.from('theme_settings').select('value').eq('key',key).maybeSingle().then(({data})=>data&&set({...d,...data.value}))},[key]);return v}
export const lines=(s?:string)=>(s||'').split('\n').map(x=>x.trim()).filter(Boolean)
export const subscribe=async(email:string)=>{if(!configured)return false;const {error}=await supabase.from('subscribers').insert({email});return !error||error.code==='23505'}
export const useSeo=(title:string,desc?:string)=>useEffect(()=>{document.title=title;const meta=(sel:string,attr:string,key:string,val:string)=>{let e=document.querySelector(sel) as HTMLMetaElement|null;if(!e){e=document.createElement('meta');e.setAttribute(attr,key);document.head.appendChild(e)}e.content=val}
  meta('meta[property="og:title"]','property','og:title',title);if(desc){meta('meta[name=description]','name','description',desc);meta('meta[property="og:description"]','property','og:description',desc)}},[title,desc])
export const waLink=(phone:string|null|undefined,text:string)=>{let d=(phone||'').replace(/\D/g,'');if(d.length===10)d='91'+d;return `https://wa.me/${d}?text=${encodeURIComponent(text)}`}
