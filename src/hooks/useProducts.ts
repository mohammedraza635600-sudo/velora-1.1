import { useEffect, useState } from 'react'
import { supabase, configured } from '../lib/supabase'
import type { Product } from '../types'
export function useProducts(){
  const [products,set]=useState<Product[]>([]);const [loading,setL]=useState(true);const [error,setE]=useState('')
  useEffect(()=>{ if(!configured){setE('Connect Supabase: add your keys to .env, then reload.');setL(false);return}
    supabase.from('products').select('*, product_images(url,position)').eq('published',true).order('created_at',{ascending:false})
    .then(({data,error})=>{ if(error)setE('We could not load the collection. Check your connection and try again.'); else set(data as Product[]); setL(false)})},[])
  return {products,loading,error}
}
