import { useEffect } from 'react'
import { supabase, configured } from './lib/supabase'
import { applyTheme, useSettings } from './lib/cms'
import Cursor from './components/Cursor'
import { Route, Routes, Link } from 'react-router-dom'
import Layout from './components/Layout'
import Loader from './components/Loader'
import { Notice } from './components/State'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductPage from './pages/ProductPage'
import Admin, { AdminLogin } from './pages/Admin'
import Account from './pages/Account'
import { About, Contact, Policy } from './pages/Info'
import { Cart, Checkout, Wishlist, Success } from './pages/Bag'
export default function App(){
  useEffect(()=>{if(configured)supabase.from('theme_settings').select('value').eq('key','theme').maybeSingle().then(({data})=>data&&applyTheme(data.value))},[])
  const an=useSettings('animations',{}) as any
  useEffect(()=>{const d=document.documentElement.dataset;d.reveal=an.reveal===false?'off':'on';d.hover=an.productHover===false?'off':'on'},[an])
  return <><Cursor/><Loader/><Routes><Route path="/admin" element={<Admin/>}/><Route path="/admin/login" element={<AdminLogin/>}/><Route element={<Layout/>}>
  <Route path="/" element={<Home/>}/><Route path="/shop" element={<Shop/>}/><Route path="/product/:slug" element={<ProductPage/>}/>
  <Route path="/account" element={<Account/>}/><Route path="/policy/:slug" element={<Policy/>}/><Route path="/about" element={<About/>}/><Route path="/contact" element={<Contact/>}/><Route path="/cart" element={<Cart/>}/><Route path="/checkout" element={<Checkout/>}/><Route path="/wishlist" element={<Wishlist/>}/><Route path="/order/success" element={<Success/>}/>
  <Route path="*" element={<div className="pt-20"><Notice title="Page not found" text="This page has moved or never existed."/><p className="text-center"><Link className="btn btn-dark" to="/shop">Shop the collection</Link></p></div>}/></Route></Routes></>}
