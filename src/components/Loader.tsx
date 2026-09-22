import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSettings } from '../lib/cms'
export default function Loader(){const an=useSettings('animations',{}) as any;
  const [n,setN]=useState(0);const [done,setDone]=useState(sessionStorage.getItem('v_seen')==='1')
  useEffect(()=>{if(an.loader===false)setDone(true)},[an.loader])
  useEffect(()=>{if(done)return;const t=setInterval(()=>setN(v=>Math.min(100,v+4)),45);return()=>clearInterval(t)},[done])
  useEffect(()=>{if(n===100){const t=setTimeout(()=>{sessionStorage.setItem('v_seen','1');setDone(true)},350);return()=>clearTimeout(t)}},[n])
  return <AnimatePresence>{!done&&<motion.div exit={{y:'-100%'}} transition={{duration:.9,ease:[.76,0,.24,1]}} className="fixed inset-0 z-[100] bg-forest text-ivory flex flex-col items-center justify-center">
    <motion.h1 initial={{opacity:0,letterSpacing:'.1em'}} animate={{opacity:1,letterSpacing:'.5em'}} transition={{duration:1.4}} className="font-serif text-4xl md:text-6xl pl-[.5em]">VELORA</motion.h1>
    <div className="mt-10 h-px w-48 bg-olive"><div className="h-px bg-soft" style={{width:`${n}%`}}/></div>
    <p className="mt-4 text-xs tracking-[.3em] text-soft">{n}%</p></motion.div>}</AnimatePresence>}
