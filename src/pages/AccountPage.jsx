import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { getMyOrders } from '../services/orderApi';
import './AccountPage.css';

const statusNames={PENDING:'Нове',CONFIRMED:'Підтверджене',PROCESSING:'Комплектується',SHIPPED:'Відправлене',COMPLETED:'Завершене',CANCELLED:'Скасоване'};
const money=n=>`${Number(n||0).toLocaleString('uk-UA')} ₴`;
export default function AccountPage(){
 const nav=useNavigate(),[params]=useSearchParams(),{user,token,logout,authLoading,updateProfile}=useAuth(),{cartCount,favoriteItems}=useShop();
 const [tab,setTab]=useState(params.get('tab')==='orders'?'orders':'overview'),[orders,setOrders]=useState([]),[loading,setLoading]=useState(false),[error,setError]=useState(''),[saving,setSaving]=useState(false),[message,setMessage]=useState(''),[form,setForm]=useState({firstName:'',lastName:'',email:'',phone:''});
 useEffect(()=>{if(!authLoading&&!user)nav('/login',{replace:true})},[authLoading,user,nav]);
 useEffect(()=>{if(user)setForm({firstName:user.firstName||'',lastName:user.lastName||'',email:user.email||'',phone:user.phone||''})},[user]);
 useEffect(()=>{if(params.get('tab')==='orders')setTab('orders')},[params]);
 useEffect(()=>{if(tab!=='orders'||!token)return;let live=true;setLoading(true);setError('');getMyOrders(token).then(x=>live&&setOrders(Array.isArray(x)?x:[])).catch(e=>live&&setError(e.message)).finally(()=>live&&setLoading(false));return()=>{live=false}},[tab,token]);
 if(authLoading)return <main className="account-page"><p>Завантаження кабінету…</p></main>;
 if(!user)return null;
 const fullName=[user.firstName,user.lastName].filter(Boolean).join(' ')||'Користувач MATRIXPC';
 async function save(e){e.preventDefault();setSaving(true);setMessage('');setError('');try{await updateProfile(form);setMessage('Профіль збережено.')}catch(err){setError(err.message)}finally{setSaving(false)}}
 return <main className="account-page"><div className="account-wrap">
  <div className="account-crumb"><Link to="/">Головна</Link><span>/</span><span>Кабінет</span></div>
  <header className="account-head"><div><small>MATRIXPC</small><h1>ОСОБИСТИЙ КАБІНЕТ</h1><p>Вітаємо, {fullName}. Керуй профілем і замовленнями.</p></div><button onClick={()=>{logout();nav('/login',{replace:true})}}>Вийти</button></header>
  <div className="account-layout"><nav className="account-menu"><button className={tab==='overview'?'selected':''} onClick={()=>setTab('overview')}>Огляд</button><button className={tab==='profile'?'selected':''} onClick={()=>setTab('profile')}>Особисті дані</button><button className={tab==='orders'?'selected':''} onClick={()=>setTab('orders')}>Мої замовлення</button><Link to="/favorites">Обране · {favoriteItems.length}</Link><Link to="/cart">Кошик · {cartCount}</Link></nav>
  <section className="account-main">
   {tab==='overview'&&<><article className="account-welcome"><small>ВАШ ПРОФІЛЬ</small><h2>{fullName}</h2><p>{user.email}</p><p>{user.phone||'Додайте телефон, щоб оформити замовлення.'}</p><button onClick={()=>setTab('profile')}>РЕДАГУВАТИ ПРОФІЛЬ</button></article><div className="account-tiles"><button onClick={()=>setTab('orders')}><small>ПОКУПКИ</small><strong>Історія замовлень</strong><span>Статуси та склад замовлення</span></button><Link to="/favorites"><small>ОБРАНЕ</small><strong>{favoriteItems.length} товарів</strong><span>Збережені товари</span></Link><Link to="/cart"><small>КОШИК</small><strong>{cartCount} товарів</strong><span>Продовжити оформлення</span></Link></div><div className="account-callout"><h3>Потрібен новий ПК?</h3><p>Переглянь каталог комплектуючих і готових збірок.</p><Link to="/catalog">ПЕРЕГЛЯНУТИ КАТАЛОГ</Link></div></>}
   {tab==='profile'&&<article className="account-panel"><h2>Особисті дані</h2><p>Ці дані використовуються для зв’язку та оформлення замовлень.</p><form className="account-form" onSubmit={save}><label>Ім’я<input required maxLength={50} autoComplete="given-name" value={form.firstName} onChange={e=>setForm({...form,firstName:e.target.value})}/></label><label>Прізвище<input required maxLength={50} autoComplete="family-name" value={form.lastName} onChange={e=>setForm({...form,lastName:e.target.value})}/></label><label>Email<input required type="email" maxLength={254} autoComplete="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label><label>Телефон<input required type="tel" autoComplete="tel" placeholder="+380 XX XXX XX XX" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></label>{message&&<p className="account-ok">{message}</p>}{error&&<p className="account-error" role="alert">{error}</p>}<button disabled={saving}>{saving?'ЗБЕРЕЖЕННЯ…':'ЗБЕРЕГТИ ЗМІНИ'}</button></form></article>}
   {tab==='orders'&&<article className="account-panel"><div className="account-panel-title"><div><h2>Мої замовлення</h2><p>Замовлення цього акаунта.</p></div><button onClick={()=>setTab('orders')}>Оновити</button></div>{loading&&<p>Завантаження…</p>}{error&&<p className="account-error" role="alert">{error}</p>}{!loading&&!error&&!orders.length&&<div className="account-empty"><h3>Замовлень поки немає</h3><p>Після оформлення покупки вона з’явиться тут.</p><Link to="/catalog">ПЕРЕГЛЯНУТИ КАТАЛОГ</Link></div>}{!loading&&orders.map(o=><section className="account-order" key={o.id}><div className="account-panel-title"><div><strong>{o.orderNumber}</strong><small>{new Date(o.createdAt).toLocaleDateString('uk-UA')}</small></div><b>{statusNames[o.status]||'В обробці'}</b></div>{o.items?.map(i=><div className="account-line" key={i.id}><span>{i.productName} × {i.quantity}</span><strong>{money(i.lineTotal)}</strong></div>)}<div className="account-line total"><span>{o.deliveryMethod==='pickup'?'Самовивіз · Коломия':`${o.carrier==='nova_poshta'?'Нова пошта':'Укрпошта'} · ${o.deliveryAddress}`}</span><strong>{money(o.total)}</strong></div></section>)}</article>}
  </section></div>
 </div></main>
}
