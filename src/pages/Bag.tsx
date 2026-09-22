import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import { useProducts } from '../hooks/useProducts'
import ProductCard from '../components/ProductCard'
import { Notice } from '../components/State'
import { inr } from '../types'
import { supabase, configured } from '../lib/supabase'
import { useSettings, waLink } from '../lib/cms'
const W="pt-28 px-5 md:px-10 min-h-[70vh]"
export function Cart(){const s=useStore()
  if(!s.cart.length)return <div className={W}><Notice title="Your cart is empty" text="Pieces you add will wait for you here."/><p className="text-center"><Link to="/shop" className="btn btn-dark">Shop the collection</Link></p></div>
  return <div className={W}><h1 className="font-serif text-5xl md:text-7xl">Cart</h1><div className="mt-10 grid md:grid-cols-[2fr_1fr] gap-16"><div className="divide-y divide-soft">{s.cart.map((l:any)=>
    <div key={l.id+l.size} className="flex gap-5 py-6"><Link to={`/product/${l.slug}`} className="w-24 aspect-[3/4] bg-soft/50 shrink-0">{l.image&&<img src={l.image} alt={l.name} className="w-full h-full object-cover"/>}</Link>
    <div className="flex-1"><p>{l.name}</p><p className="text-sm text-sage">Size {l.size}</p><div className="mt-3 flex items-center gap-3"><button aria-label="Less" onClick={()=>s.setQty(l.id,l.size,l.qty-1)} className="w-8 h-8 border border-sage">−</button>{l.qty}<button aria-label="More" onClick={()=>s.setQty(l.id,l.size,l.qty+1)} className="w-8 h-8 border border-sage">+</button>
    <button onClick={()=>s.remove(l.id,l.size)} className="ml-4 text-xs underline">Remove</button></div></div><p>{inr(l.price*l.qty)}</p></div>)}</div>
    <aside className="self-start bg-soft/40 p-8 space-y-3"><p className="flex justify-between"><span>Subtotal</span>{inr(s.subtotal)}</p><p className="flex justify-between"><span>Shipping</span>{s.shipping?inr(s.shipping):'Free'}</p><p className="flex justify-between font-serif text-2xl pt-3 border-t border-sage"><span>Total</span>{inr(s.total)}</p><Link to="/checkout" className="btn btn-dark w-full text-center">Checkout</Link></aside></div></div>}
export function Checkout(){const s=useStore();const nv=useNavigate();const [err,setErr]=useState('');const [busy,setBusy]=useState(false);const [code,setCode]=useState('');const [disc,setDisc]=useState(0)
  if(!s.cart.length)return <div className={W}><Notice title="Nothing to check out" text="Add a piece to your cart first."/></div>
  const submit=async(e:React.FormEvent<HTMLFormElement>)=>{e.preventDefault();setErr('');if(!configured)return setErr('Store is not connected to Supabase yet.')
    const f=Object.fromEntries(new FormData(e.currentTarget)) as Record<string,string>;if(!/^\d{6}$/.test(f.pincode))return setErr('Enter a 6-digit pincode.')
    setBusy(true)
    const {data,error}=await supabase.rpc('place_order',{p_name:f.name,p_email:f.email,p_phone:f.phone,p_address:`${f.address}, ${f.city}, ${f.state} ${f.pincode}, ${f.country}`,p_items:s.cart.map((l:any)=>({product_id:l.id,size:l.size,qty:l.qty})),p_coupon:disc?code:null})
    if(error)return fail(error.message)
    const id=(data as any).id,num=(data as any).order_number
    // PAYMENT INTEGRATION POINT: create a payment session for order `id` on your server (e.g. Razorpay/Stripe edge function),
    // redirect the customer to it, and let the gateway webhook set payment_status='Paid'. No payment is faked here.
    const wa=`Hello VELORA, I placed order ${num}.\n\n${s.cart.map((l:any)=>`- ${l.name} (${l.size}) x ${l.qty}`).join('\n')}\n\nTotal: ${inr((data as any).total)}\nName: ${f.name}\nPhone: ${f.phone}\nAddress: ${f.address}, ${f.city}, ${f.state} ${f.pincode}\n\nPlease share the payment details.`
    s.clear();nv('/order/success',{state:{id,num,wa}})
    function fail(m?:string){setBusy(false);setErr(m||'We could not place your order. Please try again.')}}
  const f="w-full bg-transparent border-b border-sage py-3"
  return <form onSubmit={submit} className={`${W} grid md:grid-cols-[2fr_1fr] gap-16`}><div><h1 className="font-serif text-5xl md:text-7xl mb-10">Checkout</h1><div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
    {[['name','Full name'],['email','Email'],['phone','Phone'],['address','Address'],['city','City'],['state','State'],['pincode','Pincode'],['country','Country']].map(([k,l])=><input key={k} name={k} required placeholder={l} aria-label={l} type={k==='email'?'email':'text'} defaultValue={k==='country'?'India':''} className={f}/>)}</div>
    {err&&<p role="alert" className="mt-6 text-olive border-l-2 border-olive pl-3">{err}</p>}</div>
    <aside className="self-start bg-soft/40 p-8 space-y-3">{s.cart.map((l:any)=><p key={l.id+l.size} className="flex justify-between text-sm"><span>{l.name} · {l.size} × {l.qty}</span>{inr(l.price*l.qty)}</p>)}<p className="flex justify-between font-serif text-2xl pt-3 border-t border-sage"><span>Total</span>{inr(s.total-disc)}</p><div className="flex gap-2"><input value={code} onChange={e=>setCode(e.target.value)} placeholder="Coupon code" aria-label="Coupon code" className="flex-1 bg-transparent border-b border-sage py-2 text-sm"/><button type="button" className="text-xs uppercase tracking-widest" onClick={async()=>{const {data}=await supabase.rpc('apply_coupon',{p_code:code,p_subtotal:s.subtotal});const d=Number(data)||0;setDisc(d);setErr(d?'':'That coupon is not valid for this order.')}}>Apply</button></div>{disc>0&&<p className="text-sm">Coupon saves {inr(disc)}</p>}
    <button disabled={busy} className="btn btn-dark w-full">{busy?'Placing order…':'Place order'}</button><p className="text-xs text-olive">After you place the order, you will confirm and pay with us on WhatsApp.</p></aside></form>}
export function Wishlist(){const {wish}=useStore();const {products}=useProducts();const l=products.filter(p=>wish.includes(p.id))
  return <div className={W}><h1 className="font-serif text-5xl md:text-7xl mb-10">Wishlist</h1>{!l.length?<Notice title="Nothing saved yet" text="Tap Save on any piece to keep it here."/>:<div className="grid grid-cols-2 md:grid-cols-4 gap-6">{l.map(p=><ProductCard key={p.id} p={p}/>)}</div>}</div>}
export function Success(){const st=useLocation().state as any;const store=useSettings('store',{}) as any;return <div className={W}><Notice title="Order received" text={st?.num?`Your order number is ${st.num}. Send it to us on WhatsApp to confirm and pay.`:'We have your order.'}/>{st?.wa&&(store.whatsapp?<p className="text-center mb-6"><a href={waLink(store.whatsapp,st.wa)} target="_blank" rel="noreferrer" className="btn btn-dark">Send order on WhatsApp</a></p>:<p className="text-center text-olive mb-6">Your order is saved. Our team will contact you to confirm.</p>)}<p className="text-center"><Link to="/shop" className="btn btn-dark">Continue shopping</Link></p></div>}
