import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Product, imgs } from './types'
import { supabase } from './lib/supabase'
export type Line={id:string;slug:string;name:string;price:number;size:string;qty:number;image?:string}
const S=createContext<any>(null); export const useStore=()=>useContext(S)
const load=<T,>(k:string,d:T):T=>{try{return JSON.parse(localStorage.getItem(k)||'')}catch{return d}}
export function StoreProvider({children}:{children:ReactNode}){
  const [cart,setCart]=useState<Line[]>(()=>load('v_cart',[]));const [wish,setWish]=useState<string[]>(()=>load('v_wish',[]))
  useEffect(()=>localStorage.setItem('v_cart',JSON.stringify(cart)),[cart]);useEffect(()=>localStorage.setItem('v_wish',JSON.stringify(wish)),[wish])
  const add=(p:Product,size:string,qty=1)=>setCart(c=>{const l=c.find(x=>x.id===p.id&&x.size===size)
    return l?c.map(x=>x===l?{...x,qty:x.qty+qty}:x):[...c,{id:p.id,slug:p.slug,name:p.name,price:p.discount_price??p.price,size,qty,image:imgs(p)[0]}]})
  const setQty=(id:string,size:string,qty:number)=>setCart(c=>c.map(x=>x.id===id&&x.size===size?{...x,qty:Math.max(1,qty)}:x))
  const remove=(id:string,size:string)=>setCart(c=>c.filter(x=>!(x.id===id&&x.size===size)))
  const [uid,setUid]=useState<string|null>(null)
  useEffect(()=>{const sync=async(id:string|null)=>{setUid(id);if(!id)return;const {data}=await supabase.from('wishlist').select('product_id').eq('user_id',id);const db=(data||[]).map((r:any)=>r.product_id),loc:string[]=load('v_wish',[])
    const extra=loc.filter(x=>!db.includes(x));if(extra.length)await supabase.from('wishlist').upsert(extra.map(p=>({user_id:id,product_id:p})));setWish([...new Set([...db,...loc])])}
    supabase.auth.getUser().then(({data})=>sync(data.user?.id??null));const {data:sub}=supabase.auth.onAuthStateChange((_e,se)=>{sync(se?.user?.id??null)});return()=>sub.subscription.unsubscribe()},[])
  const toggleWish=(id:string)=>{const has=wish.includes(id);setWish(w=>has?w.filter(x=>x!==id):[...w,id]);if(uid){if(has)supabase.from('wishlist').delete().eq('user_id',uid).eq('product_id',id).then(()=>{});else supabase.from('wishlist').insert({user_id:uid,product_id:id}).then(()=>{})}}
  const subtotal=cart.reduce((s,l)=>s+l.price*l.qty,0), shipping=subtotal>0&&subtotal<5000?250:0
  return <S.Provider value={{cart,add,setQty,remove,clear:()=>setCart([]),wish,toggleWish,subtotal,shipping,total:subtotal+shipping,count:cart.reduce((s,l)=>s+l.qty,0)}}>{children}</S.Provider>}
