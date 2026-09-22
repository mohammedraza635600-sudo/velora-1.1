import { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { supabase, configured } from '../lib/supabase'
import { useSettings } from '../lib/cms'
import { Placeholder } from './ProductCard'
const FALLBACK={headline:'Defined by detail.',subheading:'Contemporary menswear designed for a refined everyday wardrobe.',cta_text:'Explore collection',cta_link:'/shop',cta2_text:'New arrivals',cta2_link:'/shop?new=1',overlay_opacity:.4,overlay_tone:'dark',autoplay:true,loop:true}
const A=({to,children,cls}:{to:string;children:string;cls:string})=>to.startsWith('/')?<Link to={to} className={cls}>{children}</Link>:<a href={to} className={cls}>{children}</a>
export default function Hero({fallbackImg}:{fallbackImg?:string}){
  const an=useSettings('animations',{}) as any;const [slides,set]=useState<any[]>([]);const [i,setI]=useState(0);const {scrollY}=useScroll();const y=useTransform(scrollY,[0,800],[0,120])
  useEffect(()=>{if(configured)supabase.from('hero_slides').select('*').eq('active',true).order('position').then(({data})=>set(data||[]))},[])
  const s=slides.length?slides[i%slides.length]:{...FALLBACK,image_url:fallbackImg}
  useEffect(()=>{if(slides.length<2||!s.autoplay)return;const t=setTimeout(()=>setI(v=>v+1),7000);return()=>clearTimeout(t)},[i,slides.length,s.autoplay])
  const light=s.overlay_tone==='light',ov=`rgb(var(--${light?'ivory':'forest'}) / ${s.overlay_opacity})`
  return <section className={`relative h-[100svh] min-h-[560px] overflow-hidden ${light?'text-forest bg-ivory':'text-ivory bg-forest'}`}>
    <motion.div key={s.id||'d'} style={{y:an.parallax===false?0:y}} initial={an.hero===false?false:{scale:1.15,opacity:0}} animate={{scale:1.04,opacity:1}} transition={{duration:2.2,ease:[.2,.7,.2,1]}} className="absolute inset-0">
      {s.video_url?<video src={s.video_url} autoPlay muted loop={s.loop} playsInline className="w-full h-full object-cover"/>:s.image_url?<img src={s.image_url} alt="VELORA campaign" className="w-full h-full object-cover object-top"/>:<Placeholder label="Campaign image — add a hero slide in Admin"/>}</motion.div>
    <div className="absolute inset-0" style={{background:ov}}/>
    <div key={'t'+(s.id||'d')} className="absolute bottom-0 left-0 px-5 md:px-10 pb-14 md:pb-20 max-w-4xl">
      <h2 className="font-serif text-6xl md:text-[9rem] leading-[.9]">{String(s.headline||'').split(' ').map((w,k)=><Fragment key={k}><span className="inline-block overflow-hidden align-bottom"><motion.span className="inline-block" initial={{y:'110%'}} animate={{y:0}} transition={{duration:1.1,delay:.3+k*.18,ease:[.2,.7,.2,1]}}>{w}</motion.span></span>{' '}</Fragment>)}</h2>
      <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.2,duration:1}} className="mt-6 max-w-md opacity-90">{s.subheading}</motion.p>
      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.5,duration:1}} className="mt-8 flex flex-wrap gap-4">
        {s.cta_text&&<A to={s.cta_link||'/shop'} cls={`btn ${light?'bg-forest text-ivory border-forest':'bg-ivory text-forest border-ivory hover:bg-soft'}`}>{s.cta_text}</A>}
        {s.cta2_text&&<A to={s.cta2_link||'/shop'} cls="btn border-current hover:opacity-70">{s.cta2_text}</A>}</motion.div></div>
    {slides.length>1&&<div className="absolute bottom-6 right-5 md:right-10 flex gap-2">{slides.map((_,k)=><button key={k} aria-label={`Slide ${k+1}`} onClick={()=>setI(k)} className={`h-px w-8 bg-current ${k===i%slides.length?'':'opacity-40'}`}/>)}</div>}</section>}
