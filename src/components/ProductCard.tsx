import { Link } from 'react-router-dom'
import { Product, imgs, inr } from '../types'
import { useStore } from '../store'
export function Placeholder({label='Image'}:{label?:string}){return <div className="w-full h-full bg-soft/60 grid place-items-center text-xs tracking-[.3em] text-olive uppercase">{label}</div>}
export default function ProductCard({p}:{p:Product}){
  const {add,wish,toggleWish}=useStore();const im=imgs(p);const liked=wish.includes(p.id)
  return <article className="group">
    <div className="relative aspect-[3/4] overflow-hidden bg-soft/40">
      <Link to={`/product/${p.slug}`} aria-label={p.name}>{im[0]?<>
        <img src={im[0]} alt={p.name} loading="lazy" className="pc-a absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-[1.03] group-hover:opacity-0"/>
        <img src={im[1]||im[0]} alt="" loading="lazy" className="pc-b absolute inset-0 w-full h-full object-cover opacity-0 transition duration-700 group-hover:opacity-100 group-hover:scale-[1.03]"/></>:<Placeholder/>}</Link>
      <button onClick={()=>toggleWish(p.id)} aria-pressed={liked} aria-label={liked?`Remove ${p.name} from wishlist`:`Add ${p.name} to wishlist`} className={`absolute top-3 right-3 flex items-center gap-1 text-xs tracking-widest uppercase px-3 py-1.5 border transition-colors bg-ivory/90 hover:bg-ivory ${liked?'border-olive text-olive':'border-transparent text-forest'}`}><span aria-hidden="true">{liked?'♥':'♡'}</span>{liked?'Saved':'Save'}</button>
      <div className="pc-actions absolute inset-x-0 bottom-0 flex translate-y-full group-hover:translate-y-0 focus-within:translate-y-0 transition duration-500 text-xs tracking-[.15em] uppercase">
        <Link to={`/product/${p.slug}`} className="flex-1 bg-ivory/95 py-3 text-center">Quick view</Link>
        <button onClick={()=>add(p,p.sizes?.[0]||'M')} className="flex-1 bg-forest text-ivory py-3">Add to cart</button></div></div>
    <div className="relative z-10 mt-5 flex justify-between gap-4"><div><p className="text-sm font-medium">{p.name}</p><p className="text-xs text-sage capitalize">{p.category.replace('-',' ')} · {p.color}</p></div><p className="text-sm">{p.discount_price?<><s className="text-sage mr-2">{inr(p.price)}</s>{inr(p.discount_price)}</>:inr(p.price)}</p></div></article>}
