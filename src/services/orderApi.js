const API=import.meta.env.VITE_API_URL||'/api';
async function request(path,token,options={}){const r=await fetch(API+path,{...options,headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`,...options.headers}});const d=await r.json();if(!r.ok||!d.success)throw new Error(d.message||'Помилка запиту');return d.data}
export const getMyOrders=token=>request('/orders/mine',token);
export const submitOrder=(token,body)=>request('/orders',token,{method:'POST',body:JSON.stringify(body)});
