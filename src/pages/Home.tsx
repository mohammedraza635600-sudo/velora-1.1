import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import { supabase, configured } from '../lib/supabase'
import { subscribe, useSeo } from '../lib/cms'
import Hero from '../components/Hero'
import ProductCard, { Placeholder } from '../components/ProductCard'
import { Notice, ProductGridSkeleton } from '../components/State'
import { CATEGORIES, imgs } from '../types'
const DEF:any[]=['new_arrivals','featured','categories','story','philosophy','campaign','newsletter'].map(key=>({key,visible:true,padding_y:96}))
const CLS:Record<string,string>={philosophy:'bg-olive text-ivory',campaign:'bg-forest text-ivory text-center relative overflow-hidden',newsletter:'bg-soft/50 text-center'}
const H=({s,d}:{s:any;d:string})=><div className="mb-10"><h2 className="font-serif text-5xl md:text-7xl">{s.title||d}</h2>{s.subtitle&&<p className="mt-3 text-olive max-w-xl">{s.subtitle}</p>}</div>
export default function Home(){
  const {products,loading,error}=useProducts();const [secs,setSecs]=useState<any[]>(DEF);const [ok,setOk]=useState('');useSeo("VELORA — Premium Men's Clothing",'Luxury menswear designed for a refined everyday wardrobe.')
  useEffect(()=>{if(configured)supabase.from('homepage_sections').select('*').order('position').then(({data})=>data?.length&&setSecs(data))},[])
  useEffect(()=>{const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.1});document.querySelectorAll('.rv').forEach(n=>io.observe(n));return()=>io.disconnect()},[secs,products.length])
  const hero=products.find(p=>p.is_featured)||products[0]
  const grid=(l:typeof products,scroll=false)=>loading?<ProductGridSkeleton count={4}/>:error?<Notice title="Collection unavailable" text={error}/>:!l.length?<Notice title="Nothing here yet" text="Add products in Admin."/>:
    scroll?<div className="flex gap-6 overflow-x-auto snap-x pb-4">{l.map(p=><div key={p.id} className="w-64 shrink-0 snap-start"><ProductCard p={p}/></div>)}</div>:<div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-12">{l.map(p=><ProductCard key={p.id} p={p}/>)}</div>
  const body=(s:any)=>{switch(s.key){
    case 'new_arrivals':return <><H s={s} d="The latest edit"/>{grid(products.filter(p=>p.is_new).slice(0,4))}</>
    case 'featured':return <><H s={s} d="Featured collection"/>{grid(products.filter(p=>p.is_featured),true)}</>
    case 'categories':return <><H s={s} d="Shop by category"/><div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">{CATEGORIES.map((c,i)=>{const p=products.find(x=>x.category===c),im=p&&imgs(p)[0]
      return <Link key={c} to={`/shop?cat=${c}`} className={`group relative overflow-hidden bg-soft/50 ${i%3===1?'aspect-[3/4] md:mt-12':'aspect-[4/5]'}`}>{im?<img src={im} alt={c} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition duration-1000 group-hover:scale-105"/>:<Placeholder label={c}/>}<span className="absolute left-4 bottom-4 font-serif text-2xl md:text-4xl text-ivory capitalize">{c.replace('-',' ')}</span></Link>})}</div></>
    case 'story':return <div className="grid md:grid-cols-2 gap-10 items-center"><div className="aspect-[4/5] bg-soft/50">{s.video_url?<video src={s.video_url} autoPlay muted loop playsInline className="w-full h-full object-cover"/>:s.image_url?<img src={s.image_url} alt="" loading="lazy" className="w-full h-full object-cover"/>:<Placeholder label="Story image"/>}</div><div><H s={s} d="Built for the way you move."/><Link to="/about" className="btn btn-line">Our story</Link></div></div>
    case 'philosophy':return <><H s={s} d="Philosophy"/><div className="grid md:grid-cols-5 gap-10">{[['Precision','Patterns cut and checked to the millimetre.'],['Quality','Fabrics chosen for how they age.'],['Form','A silhouette that holds its line.'],['Comfort','Made to be worn every day.'],['Craftsmanship','Finished by hand where it matters.']].map(([t,d])=><div key={t}><h3 className="font-serif text-3xl">{t}</h3><p className="mt-3 text-soft text-sm">{d}</p></div>)}</div></>
    case 'campaign':return <>{s.video_url?<video src={s.video_url} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-50"/>:s.image_url&&<img src={s.image_url} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-50"/>}<div className="relative"><p className="font-serif text-4xl tracking-[.4em]">VELORA</p><h2 className="font-serif text-5xl md:text-8xl mt-6">{s.title||'Essentials, redefined.'}</h2><Link to="/shop" className="btn border-ivory hover:bg-ivory hover:text-forest mt-10">Shop now</Link></div></>
    case 'newsletter':return <><H s={s} d="Join the VELORA list"/><form className="max-w-md mx-auto flex gap-3" onSubmit={async e=>{e.preventDefault();const f=e.currentTarget;setOk(await subscribe(String(new FormData(f).get('email')))?'Thank you. You are on the list.':'Could not sign you up. Try again.');f.reset()}}><input name="email" type="email" required placeholder="Email address" aria-label="Email" className="flex-1 bg-transparent border-b border-forest py-2"/><button className="btn btn-dark">Join</button></form>{ok&&<p role="status" className="mt-4 text-sm">{ok}</p>}</>
    default:return null}}
  return <><Hero fallbackImg={hero&&imgs(hero)[0]}/>{secs.filter(s=>s.visible).map(s=><section key={s.key} style={{background:s.bg_color||undefined,paddingTop:s.padding_y,paddingBottom:s.padding_y}} className={`rv px-5 md:px-10 ${CLS[s.key]||''}`}>{body(s)}</section>)}</>}
