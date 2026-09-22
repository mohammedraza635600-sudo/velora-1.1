import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStore } from '../store'
import { CATEGORIES } from '../types'
import { useSettings, lines, subscribe, waLink } from '../lib/cms'
const L=({v}:{v:string})=>{const [a,b='/']=v.split('|');return b.startsWith('http')?<a href={b} className="block" target="_blank" rel="noreferrer">{a}</a>:<Link className="block" to={b}>{a}</Link>}
const nav=[['New arrivals','/shop?new=1'],['Clothing','/shop'],...CATEGORIES.map(c=>[c.replace('-',' '),`/shop?cat=${c}`])]
export default function Layout(){
  const {count,wish}=useStore();const st=useSettings('store',{}) as any,th=useSettings('theme',{}) as any,ft=useSettings('footer',{}) as any,an=useSettings('animations',{}) as any;const loc=useLocation();const nv=useNavigate()
  const [y,setY]=useState(0);const [open,setOpen]=useState(false)
  useEffect(()=>{const f=()=>setY(scrollY);f();addEventListener('scroll',f,{passive:true});return()=>removeEventListener('scroll',f)},[])
  useEffect(()=>{setOpen(false);scrollTo(0,0)},[loc.pathname,loc.search])
  const solid=y>40||loc.pathname!=='/'||open||th.headerStyle==='solid'||th.headerStyle==='solid'
  return <>
  <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${solid?'bg-ivory/85 backdrop-blur-md border-b border-soft/60 text-forest':'text-ivory'}`}>
    <div className="flex items-center justify-between px-5 md:px-10 h-16 md:h-20">
      <Link to="/" className="font-serif text-2xl md:text-3xl tracking-[.35em]" aria-label="VELORA home">{th.logo_url?<img src={th.logo_url} alt="VELORA" className="h-7 md:h-9"/>:'VELORA'}</Link>
      <nav className="hidden xl:flex gap-7 text-[11px] tracking-[.18em] uppercase" aria-label="Main">
        {nav.map(([l,h])=><NavLink key={l} to={h} className="relative py-1 after:absolute after:left-0 after:bottom-0 after:h-px after:w-0 after:bg-current after:transition-all hover:after:w-full">{l}</NavLink>)}</nav>
      <div className="flex items-center gap-5 text-[11px] tracking-[.18em] uppercase">
        <button onClick={()=>nv('/shop?focus=1')}>Search</button>
        <Link to="/account" className="hidden md:block">Account</Link>
        <Link to="/wishlist" className="hidden md:block">Wishlist{wish.length?` (${wish.length})`:''}</Link>
        <Link to="/cart">Cart ({count})</Link>
        <button className="xl:hidden" aria-expanded={open} onClick={()=>setOpen(!open)}>{open?'Close':'Menu'}</button></div></div>
    <motion.nav initial={false} animate={{height:open?'auto':0}} className="xl:hidden overflow-hidden bg-ivory text-forest" aria-label="Mobile">
      <div className="flex flex-col gap-4 px-5 pb-8 pt-2 font-serif text-3xl capitalize">{nav.map(([l,h])=><Link key={l} to={h}>{l}</Link>)}
      <Link to="/wishlist" className="text-lg font-sans">Wishlist ({wish.length})</Link></div></motion.nav>
  </header>
  <motion.main key={loc.pathname} initial={an.pageTransition===false?false:{opacity:0}} animate={{opacity:1}} transition={{duration:.5}}><Outlet/></motion.main>
  <footer className="bg-forest text-ivory mt-32 px-5 md:px-10 pt-20 pb-10">
    <div className="grid md:grid-cols-4 gap-12"><div><p className="font-serif text-4xl tracking-[.3em]">VELORA</p><p className="mt-4 text-soft max-w-xs">Menswear designed for a refined everyday wardrobe.</p></div>
      <div className="space-y-2"><p className="text-soft mb-3">Shop</p>{CATEGORIES.map(c=><Link key={c} className="block capitalize" to={`/shop?cat=${c}`}>{c.replace('-',' ')}</Link>)}</div>
      <div className="space-y-2"><p className="text-soft mb-3">Customer care</p><Link className="block" to="/cart">Cart</Link><Link className="block" to="/wishlist">Wishlist</Link><Link className="block" to="/checkout">Checkout</Link><Link className="block" to="/about">About</Link><Link className="block" to="/contact">Contact</Link>{['shipping','returns','privacy','terms'].map(x=><Link key={x} className="block capitalize" to={`/policy/${x}`}>{x}</Link>)}{lines(ft.links).map(x=><L key={x} v={x}/>)}</div>
      <form onSubmit={async e=>{e.preventDefault();const f=e.currentTarget,em=String(new FormData(f).get('email'));alert(await subscribe(em)?'Thank you. You are on the list.':'Could not sign you up. Try again.');f.reset()}}>
        <p className="text-soft mb-3">Join the VELORA list</p><input name="email" required type="email" placeholder="Email address" aria-label="Email" className="w-full bg-transparent border-b border-sage py-2 placeholder:text-sage"/>
        <button className="mt-4 text-xs tracking-[.2em] uppercase">Subscribe</button></form></div>
    <div className="mt-12 text-sm text-soft flex flex-wrap gap-x-8 gap-y-2">{ft.email&&<a href={'mailto:'+ft.email}>{ft.email}</a>}{ft.phone&&<a href={'tel:'+ft.phone}>{ft.phone}</a>}{lines(ft.socials).map(x=><L key={x} v={x}/>)}{lines(ft.policies).map(x=><L key={x} v={x}/>)}</div>
    <p className="mt-6 text-xs text-sage">{ft.copyright||`© ${new Date().getFullYear()} VELORA. All rights reserved.`}</p></footer>
  {st.whatsapp&&<a href={waLink(st.whatsapp,'Hello VELORA, I have a question.')} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp" className="fixed bottom-5 right-5 z-40 bg-forest text-ivory px-5 py-3 text-xs tracking-[.2em] uppercase shadow-lg">WhatsApp</a>}</>}
