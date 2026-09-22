import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useProducts } from '../hooks/useProducts'
import ProductCard from '../components/ProductCard'
import { Notice, ProductGridSkeleton } from '../components/State'
import { CATEGORIES } from '../types'
import { useSettings, lines, useSeo } from '../lib/cms'
import { supabase, configured } from '../lib/supabase'
export default function Shop(){
  const {products,loading,error}=useProducts();const st=useSettings('search',{}) as any;const [cr,setCr]=useState<any>(null);const [sp,setSp]=useSearchParams();const ref=useRef<HTMLInputElement>(null)
  const q=sp.get('q')||'',cat=sp.get('cat')||'',size=sp.get('size')||'',color=sp.get('color')||'',max=Number(sp.get('max')||0),sort=sp.get('sort')||'',isNew=sp.get('new')==='1'
  const set=(k:string,v:string)=>{const n=new URLSearchParams(sp);v?n.set(k,v):n.delete(k);setSp(n,{replace:true})}
  useEffect(()=>{const c=sp.get('cat');if(!c||!configured){setCr(null);return}supabase.from('categories').select('*').eq('slug',c).maybeSingle().then(({data})=>setCr(data))},[sp])
  useSeo(cr?.seo_title||`${cat||'Clothing'} | VELORA`,cr?.seo_description||undefined)
  useEffect(()=>{if(sp.get('focus'))ref.current?.focus()},[sp])
  const colors=useMemo(()=>[...new Set(products.map(p=>p.color))],[products]);const sizes=useMemo(()=>[...new Set(products.flatMap(p=>p.sizes||[]))],[products])
  const list=products.filter(p=>(!cat||p.category===cat)&&(!isNew||p.is_new)&&(!size||p.sizes?.includes(size))&&(!color||p.color===color)&&(!max||p.price<=max)&&(!q||`${p.name} ${p.category} ${p.color}`.toLowerCase().includes(q.toLowerCase())))
    .sort((a,b)=>sort==='low'?a.price-b.price:sort==='high'?b.price-a.price:0)
  const sel="bg-transparent border-b border-sage py-2 text-sm"
  return <div className="pt-28 px-5 md:px-10">{cr?.banner_url&&<img src={cr.banner_url} alt="" className="w-full h-48 md:h-72 object-cover mb-8"/>}<h1 className="font-serif text-5xl md:text-7xl capitalize">{isNew?'New arrivals':cat?cat.replace('-',' '):'Clothing'}</h1>{cr?.description&&<p className="mt-4 max-w-xl text-olive">{cr.description}</p>}
    <div className="mt-10 flex flex-wrap gap-x-6 gap-y-4 items-end border-b border-soft pb-6">
      <input ref={ref} value={q} onChange={e=>set('q',e.target.value)} placeholder="Search VELORA" aria-label="Search" className={`${sel} w-full md:w-64`}/>
      {lines(st.trending+'\n'+st.suggested).length>0&&<div className="w-full flex flex-wrap gap-4 text-xs">{lines(st.trending+'\n'+st.suggested).map(t=><button key={t} onClick={()=>set('q',t)} className="underline underline-offset-4">{t}</button>)}</div>}
      <select aria-label="Category" value={cat} onChange={e=>set('cat',e.target.value)} className={sel}><option value="">All categories</option>{CATEGORIES.map(c=><option key={c} value={c}>{c.replace('-',' ')}</option>)}</select>
      <select aria-label="Size" value={size} onChange={e=>set('size',e.target.value)} className={sel}><option value="">Any size</option>{sizes.map(s=><option key={s}>{s}</option>)}</select>
      <select aria-label="Color" value={color} onChange={e=>set('color',e.target.value)} className={sel}><option value="">Any color</option>{colors.map(s=><option key={s}>{s}</option>)}</select>
      <select aria-label="Price" value={max||''} onChange={e=>set('max',e.target.value)} className={sel}><option value="">Any price</option><option value="3000">Up to ₹3,000</option><option value="6000">Up to ₹6,000</option><option value="10000">Up to ₹10,000</option></select>
      <select aria-label="Sort" value={sort} onChange={e=>set('sort',e.target.value)} className={sel}><option value="">Featured</option><option value="low">Price, low to high</option><option value="high">Price, high to low</option></select></div>
    {loading?<div className="mt-10"><ProductGridSkeleton/></div>:error?<Notice title="Collection unavailable" text={error}/>:!list.length?<Notice title="Nothing matches" text="Clear a filter or try another search."/>:
    <motion.div layout className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-12">{list.map(p=><motion.div layout key={p.id} initial={{opacity:0}} animate={{opacity:1}}><ProductCard p={p}/></motion.div>)}</motion.div>}</div>}
