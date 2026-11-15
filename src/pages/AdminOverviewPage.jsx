import { useEffect, useState } from 'react';
import { getAdminCategories, getAdminOrders, getAdminProducts } from '../services/adminApi';
import { useAuth } from '../context/AuthContext';
import './AdminOverviewPage.css';

const money = (value) => Number(value || 0).toLocaleString('uk-UA');

export default function AdminOverviewPage() {
  const { token } = useAuth();
  const [data, setData] = useState({ products: [], categories: [], orders: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const [products, categories, orders] = await Promise.all([
          getAdminProducts(),
          getAdminCategories(),
          token ? getAdminOrders(token) : Promise.reject(new Error('Потрібна авторизація адміністратора')),
        ]);
        if (active) setData({
          products: Array.isArray(products) ? products : [],
          categories: Array.isArray(categories) ? categories : [],
          orders: Array.isArray(orders) ? orders : [],
        });
      } catch (err) {
        if (active) setError(err.message || 'Не вдалося завантажити статистику');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [token]);

  const stats = [
    { title: 'Усього товарів', value: data.products.length },
    { title: 'Категорії', value: data.categories.length },
    { title: 'Нові замовлення', value: data.orders.filter((order) => order.status === 'PENDING').length },
    { title: 'Низькі залишки', value: data.products.filter((product) => Number(product.stock) <= 5).length },
  ];

  return (
    <section className="admin-overview">
      <div className="admin-overview-header">
        <h1>ОГЛЯД МАГАЗИНУ</h1>
        <p>Статистика та керування MatrixPC</p>
      </div>

      {error && <p className="admin-error" role="alert">{error}</p>}
      <div className="admin-overview-stats">
        {stats.map((stat) => (
          <div className="admin-overview-card" key={stat.title}>
            <span>{stat.title}</span>
            <strong>{loading ? '…' : stat.value}</strong>
          </div>
        ))}
      </div>

      <div className="admin-overview-content">
        <h2>ОСТАННІ ЗАМОВЛЕННЯ</h2>
        {loading ? <p>Завантаження…</p> : data.orders.length === 0 ? (
          <p>Замовлень поки немає.</p>
        ) : (
          <div className="admin-overview-orders">
            {data.orders.slice(0, 5).map((order) => (
              <div className="admin-overview-order" key={order.id}>
                <strong>#{order.orderNumber || order.id}</strong>
                <span>{order.customerName || order.customerEmail || 'Клієнт'}</span>
                <span>{order.status}</span>
                <span>{money(order.total)} ₴</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
