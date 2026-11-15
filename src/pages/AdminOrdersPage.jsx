import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAdminOrders, updateAdminOrderStatus } from '../services/adminApi';
import './AdminOrdersPage.css';

const statuses = {
  PENDING: 'Нове',
  CONFIRMED: 'Підтверджено',
  PROCESSING: 'В обробці',
  SHIPPED: 'Відправлено',
  COMPLETED: 'Виконано',
  CANCELLED: 'Скасовано',
};

const money = (value) => Number(value || 0).toLocaleString('uk-UA', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

function orderLabel(order) {
  return order.orderNumber || order.id;
}

export default function AdminOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');

  const loadOrders = useCallback(async () => {
    if (!token) {
      setError('Сесія адміністратора відсутня. Увійдіть повторно.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await getAdminOrders(token);
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Не вдалося завантажити замовлення');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  const filteredOrders = orders.filter((order) => {
    const haystack = [
      orderLabel(order),
      order.customerName,
      order.customerEmail,
      order.customerPhone,
    ].filter(Boolean).join(' ').toLowerCase();
    return haystack.includes(search.toLowerCase()) &&
      (filter === 'ALL' || order.status === filter);
  });

  async function handleStatusChange(order, status) {
    if (!token) return;
    setUpdatingId(order.id);
    setError('');
    try {
      const updated = await updateAdminOrderStatus(token, order.id, status);
      setOrders((previous) => previous.map((item) => item.id === order.id ? updated : item));
      setSelectedOrder((previous) => previous?.id === order.id ? updated : previous);
    } catch (err) {
      setError(err.message || 'Не вдалося оновити статус замовлення');
      await loadOrders();
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="admin-orders">
      <div className="admin-orders-header">
        <h1>КЕРУВАННЯ ЗАМОВЛЕННЯМИ</h1>
        <p>Перегляд і обробка замовлень MatrixPC</p>
      </div>
      {error && <p className="admin-error" role="alert">{error}</p>}

      <div className="admin-orders-panel">
        <div className="admin-orders-filters">
          <input type="search" placeholder="Пошук за номером або клієнтом..." value={search} onChange={(event) => setSearch(event.target.value)} />
          <select value={filter} onChange={(event) => setFilter(event.target.value)}>
            <option value="ALL">Усі статуси</option>
            {Object.entries(statuses).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>
        <div className="admin-orders-table-wrap">
          <table className="admin-orders-table">
            <thead><tr><th>№</th><th>Клієнт</th><th>Дата</th><th>Сума</th><th>Статус</th><th>Дії</th></tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6">Завантаження замовлень…</td></tr>
              ) : filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>#{orderLabel(order)}</td>
                  <td>{order.customerName || order.customerEmail || '—'}</td>
                  <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString('uk-UA') : '—'}</td>
                  <td>{money(order.total)} ₴</td>
                  <td>
                    <select className="admin-order-status" value={order.status} disabled={updatingId === order.id} onChange={(event) => handleStatusChange(order, event.target.value)}>
                      {Object.entries(statuses).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                  </td>
                  <td><button className="admin-order-view" onClick={() => setSelectedOrder(order)}>Деталі</button></td>
                </tr>
              ))}
              {!loading && filteredOrders.length === 0 && <tr><td colSpan="6">Замовлень не знайдено</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="admin-order-overlay">
          <div className="admin-order-modal" role="dialog" aria-modal="true" aria-labelledby="admin-order-title">
            <h2 id="admin-order-title">Замовлення #{orderLabel(selectedOrder)}</h2>
            <p><strong>Клієнт:</strong> {selectedOrder.customerName || '—'}</p>
            <p><strong>Email:</strong> {selectedOrder.customerEmail || '—'}</p>
            <p><strong>Телефон:</strong> {selectedOrder.customerPhone || '—'}</p>
            <p><strong>Дата:</strong> {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString('uk-UA') : '—'}</p>
            <p><strong>Доставка:</strong> {selectedOrder.deliveryMethod || '—'}{selectedOrder.carrier ? ` · ${selectedOrder.carrier}` : ''}{selectedOrder.deliveryAddress ? ` · ${selectedOrder.deliveryAddress}` : ''}</p>
            <p><strong>Оплата:</strong> {selectedOrder.paymentMethod || '—'}</p>
            <h3>Товари</h3>
            {(selectedOrder.items || []).map((item) => (
              <div className="admin-order-item" key={item.id}>
                <span>{item.productName || item.name} × {item.quantity}</span>
                <span>{money(item.lineTotal ?? (Number(item.unitPrice ?? item.price) * item.quantity))} ₴</span>
              </div>
            ))}
            <div className="admin-order-total">Разом: {money(selectedOrder.total)} ₴</div>
            <button className="admin-order-close" onClick={() => setSelectedOrder(null)}>Закрити</button>
          </div>
        </div>
      )}
    </div>
  );
}
