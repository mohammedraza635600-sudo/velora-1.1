import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import { useStore } from '../store'
import ProductCard, { Placeholder } from '../components/ProductCard'
import { Notice } from '../components/State'
import { imgs, inr } from '../types'
import { useSeo } from '../lib/cms'
export default function ProductPage(){
  const {slug}=useParams();const {products,loading,error}=useProducts();const {add,wish,toggleWish}=useStore();const nv=useNavigate()
  const [i,setI]=useState(0);const [size,setSize]=useState('');const [qty,setQty]=useState(1);const [zoom,setZoom]=useState(false)
  const cur=products.find(x=>x.slug===slug);useSeo(cur?`${cur.name} | VELORA`:'VELORA',cur?.description)
  useEffect(()=>{if(!cur)return;const sc=document.createElement('script');sc.type='application/ld+json';sc.text=JSON.stringify({'@context':'https://schema.org','@type':'Product',name:cur.name,description:cur.description,image:imgs(cur),sku:cur.sku,offers:{'@type':'Offer',priceCurrency:'INR',price:cur.discount_price??cur.price,availability:cur.stock>0?'https://schema.org/InStock':'https://schema.org/OutOfStock'}});document.head.appendChild(sc);return()=>{sc.remove()}},[cur])
  if(loading)return <p className="pt-40 text-center text-olive">Loading…</p>
  if(error)return <div className="pt-20"><Notice title="Product unavailable" text={error}/></div>
  const p=products.find(x=>x.slug===slug);if(!p)return <div className="pt-20"><Notice title="Product not found" text="It may have sold out or been removed."/></div>
  const im=imgs(p),s=size||''
  const go=(buy:boolean)=>{if(!s)return alert('Please choose a size.');add(p,s,qty);if(buy)nv('/checkout')}
  return <div className="pt-24 md:pt-32 px-5 md:px-10 grid md:grid-cols-[1.4fr_1fr] gap-10 md:gap-16">
    <div className="grid md:grid-cols-[80px_1fr] gap-4"><div className="order-2 md:order-1 flex md:flex-col gap-2 overflow-x-auto">{im.map((u,k)=><button key={u} onClick={()=>setI(k)} aria-label={`Image ${k+1}`} className={`shrink-0 w-16 md:w-full aspect-[3/4] border ${k===i?'border-forest':'border-transparent'}`}><img src={u} alt="" loading="lazy" className="w-full h-full object-cover"/></button>)}</div>
      <div onClick={()=>setZoom(!zoom)} className={`order-1 md:order-2 aspect-[3/4] overflow-hidden bg-soft/40 ${zoom?'cursor-zoom-out':'cursor-zoom-in'}`}>{im[i]?<img src={im[i]} alt={p.name} className={`w-full h-full object-cover transition duration-500 ${zoom?'scale-150':''}`}/>:<Placeholder/>}</div></div>
    <div className="md:sticky md:top-28 self-start"><p className="text-xs tracking-[.2em] uppercase text-sage">{p.category.replace('-',' ')} · {p.color}</p>
      <h1 className="font-serif text-5xl mt-2">{p.name}</h1><p className="mt-3 text-xl">{p.discount_price?<><s className="text-sage mr-2">{inr(p.price)}</s>{inr(p.discount_price)}</>:inr(p.price)}</p><p className="mt-6 text-olive leading-relaxed">{p.description}</p>
      <p className="mt-8 text-xs tracking-[.2em] uppercase">Size</p><div className="mt-3 flex flex-wrap gap-2">{p.sizes?.map(z=><button key={z} onClick={()=>setSize(z)} aria-pressed={s===z} className={`min-w-12 border px-3 py-2 text-sm ${s===z?'bg-forest text-ivory border-forest':'border-sage'}`}>{z}</button>)}</div>
      <div className="mt-6 flex items-center gap-4"><button aria-label="Less" onClick={()=>setQty(Math.max(1,qty-1))} className="w-9 h-9 border border-sage">−</button><span>{qty}</span><button aria-label="More" onClick={()=>setQty(qty+1)} className="w-9 h-9 border border-sage">+</button></div>
      <div className="mt-8 grid gap-3"><button className="btn btn-dark" onClick={()=>go(false)}>Add to cart</button><button className="btn btn-line" onClick={()=>go(true)}>Buy now</button>
        <button className="text-xs tracking-[.2em] uppercase underline underline-offset-8" onClick={()=>toggleWish(p.id)}>{wish.includes(p.id)?'Remove from wishlist':'Add to wishlist'}</button></div>
      <dl className="mt-10 border-t border-soft text-sm divide-y divide-soft"><div className="py-3"><dt>Shipping</dt><dd className="text-olive">Free above ₹5,000. Dispatched in 2 business days.</dd></div><div className="py-3"><dt>Returns</dt><dd className="text-olive">Unworn items, within 14 days.</dd></div></dl></div>
    {p.video_url&&<video src={p.video_url} controls playsInline poster={p.video_thumb||undefined} className="md:col-span-2 w-full max-h-[70vh] bg-forest"/>}
    <section className="md:col-span-2 mt-10"><h2 className="font-serif text-4xl mb-8">You may also like</h2><div className="grid grid-cols-2 md:grid-cols-4 gap-6">{products.filter(x=>x.id!==p.id&&x.category===p.category).slice(0,4).map(x=><ProductCard key={x.id} p={x}/>)}</div></section></div>}
