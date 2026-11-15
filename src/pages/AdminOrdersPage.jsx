
import { useState } from 'react';
import './AdminOrdersPage.css';

const initialOrders = [
  {
    id: 101,
    customer: 'Андрій Коваль',
    phone: '+380671234567',
    date: '2026-11-15',
    total: 18998,
    status: 'PENDING',
    items: [
      { name: 'AMD Ryzen 5 5600', quantity: 1, price: 4999 },
      { name: 'GeForce RTX 4060', quantity: 1, price: 13999 },
    ],
  },
  {
    id: 102,
    customer: 'Олена Мельник',
    phone: '+380931234567',
    date: '2026-11-14',
    total: 4999,
    status: 'PROCESSING',
    items: [
      { name: 'AMD Ryzen 5 5600', quantity: 1, price: 4999 },
    ],
  },
  {
    id: 103,
    customer: 'Іван Петренко',
    phone: '+380501234567',
    date: '2026-11-13',
    total: 13999,
    status: 'COMPLETED',
    items: [
      { name: 'GeForce RTX 4060', quantity: 1, price: 13999 },
    ],
  },
];

const statuses = {
  PENDING: 'Нове',
  CONFIRMED: 'Підтверджено',
  PROCESSING: 'В обробці',
  SHIPPED: 'Відправлено',
  COMPLETED: 'Виконано',
  CANCELLED: 'Скасовано',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      String(order.id).includes(search) ||
      order.customer.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      filter === 'ALL' || order.status === filter;

    return matchesSearch && matchesStatus;
  });

  function handleStatusChange(id, status) {
    setOrders((previous) =>
      previous.map((order) =>
        order.id === id ? { ...order, status } : order
      )
    );

    setSelectedOrder((previous) =>
      previous && previous.id === id
        ? { ...previous, status }
        : previous
    );
  }

  return (
    <div className="admin-orders">
      <div className="admin-orders-header">
        <h1>КЕРУВАННЯ ЗАМОВЛЕННЯМИ</h1>
        <p>Перегляд і обробка замовлень MatrixPC</p>
      </div>

      <div className="admin-orders-panel">
        <div className="admin-orders-filters">
          <input
            type="text"
            placeholder="Пошук за номером або клієнтом..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="ALL">Усі статуси</option>

            {Object.entries(statuses).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-orders-table-wrap">
          <table className="admin-orders-table">
            <thead>
              <tr>
                <th>№</th>
                <th>Клієнт</th>
                <th>Дата</th>
                <th>Сума</th>
                <th>Статус</th>
                <th>Дії</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.date}</td>
                  <td>{order.total.toLocaleString('uk-UA')} ₴</td>

                  <td>
                    <select
                      className="admin-order-status"
                      value={order.status}
                      onChange={(event) =>
                        handleStatusChange(
                          order.id,
                          event.target.value
                        )
                      }
                    >
                      {Object.entries(statuses).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <button
                      className="admin-order-view"
                      onClick={() => setSelectedOrder(order)}
                    >
                      Деталі
                    </button>
                  </td>
                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="6">Замовлень не знайдено</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="admin-order-overlay">
          <div className="admin-order-modal">
            <h2>Замовлення #{selectedOrder.id}</h2>

            <p>
              <strong>Клієнт:</strong> {selectedOrder.customer}
            </p>

            <p>
              <strong>Телефон:</strong> {selectedOrder.phone}
            </p>

            <p>
              <strong>Дата:</strong> {selectedOrder.date}
            </p>

            <h3>Товари</h3>

            {selectedOrder.items.map((item, index) => (
              <div className="admin-order-item" key={index}>
                <span>
                  {item.name} × {item.quantity}
                </span>

                <span>
                  {(item.price * item.quantity).toLocaleString('uk-UA')} ₴
                </span>
              </div>
            ))}

            <div className="admin-order-total">
              Разом: {selectedOrder.total.toLocaleString('uk-UA')} ₴
            </div>

            <button
              className="admin-order-close"
              onClick={() => setSelectedOrder(null)}
            >
              Закрити
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
