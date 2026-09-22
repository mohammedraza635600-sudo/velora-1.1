export type Img={url:string;position:number}
export type Product={id:string;slug:string;name:string;category:string;price:number;color:string;description:string;
sizes:string[];stock:number;is_new:boolean;is_featured:boolean;video_url?:string;discount_price?:number|null;sku?:string;video_thumb?:string;sold?:number;product_images:Img[]}
export const CATEGORIES=['t-shirts','shirts','jeans','trousers','joggers','jackets']
export const imgs=(p:Product)=>[...(p.product_images||[])].sort((a,b)=>a.position-b.position).map(i=>i.url)
export const inr=(n:number)=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n)
