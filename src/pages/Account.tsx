import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useStore } from '../store'
import { inr } from '../types'
const box="w-full bg-transparent border-b border-sage py-3"
export default function Account(){const {wish}=useStore();const [u,setU]=useState<any>(null);const [o,setO]=useState<any[]>([]);const [err,setErr]=useState('');const [up,setUp]=useState(false)
  const refresh=()=>supabase.auth.getUser().then(({data})=>{setU(data.user);if(data.user)supabase.from('orders').select('*').eq('user_id',data.user.id).order('created_at',{ascending:false}).then(({data})=>setO(data||[]))})
  useEffect(()=>{refresh()},[])
  const go=async(e:React.FormEvent<HTMLFormElement>)=>{e.preventDefault();setErr('');const f=new FormData(e.currentTarget),email=String(f.get('email')),password=String(f.get('password'))
    const r=up?await supabase.auth.signUp({email,password,options:{data:{full_name:String(f.get('name'))}}}):await supabase.auth.signInWithPassword({email,password})
    if(r.error)return setErr(r.error.message);if(up&&!r.data.session)return setErr('Check your email to confirm your account, then sign in.');refresh()}
  if(!u)return <form onSubmit={go} className="pt-32 px-5 max-w-sm mx-auto min-h-[70vh] space-y-6"><h1 className="font-serif text-5xl">{up?'Create account':'Sign in'}</h1>{up&&<input name="name" required placeholder="Full name" aria-label="Full name" className={box}/>}
    <input name="email" type="email" required placeholder="Email" aria-label="Email" className={box}/><input name="password" type="password" minLength={6} required placeholder="Password" aria-label="Password" className={box}/>{err&&<p role="alert" className="text-sm text-olive">{err}</p>}
    <button className="btn btn-dark w-full">{up?'Create account':'Sign in'}</button><button type="button" onClick={()=>setUp(!up)} className="text-sm underline">{up?'I already have an account':'Create an account'}</button></form>
  return <div className="pt-32 px-5 md:px-10 min-h-[70vh]"><h1 className="font-serif text-5xl md:text-7xl">Account</h1><p className="mt-2 text-olive">{u.email} · <Link className="underline" to="/wishlist">{wish.length} saved</Link> · <button className="underline" onClick={async()=>{await supabase.auth.signOut();setU(null)}}>Sign out</button></p>
    <h2 className="font-serif text-3xl mt-12 mb-4">Orders</h2>{!o.length&&<p className="text-olive">No orders yet.</p>}{o.map(x=><div key={x.id} className="py-4 border-b border-soft text-sm"><p>{x.order_number} · {inr(x.total)} · {new Date(x.created_at).toLocaleDateString()}</p><p className="capitalize">Status: {x.status.replace(/_/g,' ')}</p>{x.tracking_number&&<p>Tracking: {x.courier} {x.tracking_number}</p>}</div>)}</div>}
