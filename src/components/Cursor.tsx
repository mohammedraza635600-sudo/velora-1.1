import { useEffect, useRef } from 'react'
export default function Cursor(){const r=useRef<HTMLDivElement>(null)
  useEffect(()=>{if(!matchMedia('(pointer:fine)').matches||matchMedia('(prefers-reduced-motion:reduce)').matches)return;const el=r.current!;let x=0,y=0,tx=0,ty=0,id=0,big=false
    const mv=(e:MouseEvent)=>{tx=e.clientX;ty=e.clientY;el.style.opacity='1';big=!!(e.target as Element).closest('a,button,.group,img,video')}
    const tick=()=>{x+=(tx-x)*.18;y+=(ty-y)*.18;el.style.transform=`translate(${x-16}px,${y-16}px) scale(${big?1.8:1})`;id=requestAnimationFrame(tick)}
    addEventListener('mousemove',mv);id=requestAnimationFrame(tick);return()=>{removeEventListener('mousemove',mv);cancelAnimationFrame(id)}},[])
  return <div ref={r} aria-hidden="true" className="pointer-events-none fixed top-0 left-0 z-[90] h-8 w-8 rounded-full border border-soft mix-blend-difference opacity-0 hidden md:block"/>}
