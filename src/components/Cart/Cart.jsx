
import { useEffect, useState } from 'react';
import './Cart.css';

const formatPrice = price => `${price.toLocaleString('uk-UA')} ₴`;

export default function Cart() {
  const [items, setItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('matrixpc-cart');

      if (savedCart !== null) {
        const parsed = JSON.parse(savedCart);

        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {
      console.error('Не вдалося завантажити кошик');
    }

    return [];
  });

  const [expandedBuilds, setExpandedBuilds] = useState([]);

  const toggleBuildDetails = (id) => {
    setExpandedBuilds(prev =>
      prev.includes(id)
        ? prev.filter(buildId => buildId !== id)
        : [...prev, id]
    );
  };

  useEffect(() => {
    localStorage.setItem('matrixpc-cart', JSON.stringify(items));
  }, [items]);

  const increaseQuantity = id => {
    setItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = id => {
    setItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
  };

  const removeItem = id => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalQuantity = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <section className="cart-page">
      <div className="cart-container">
        <div className="cart-breadcrumb">
          <a href="/">Головна</a>
          <span>/</span>
          <span>Кошик</span>
        </div>

        <h1 className="cart-title">КОШИК</h1>

        {items.length > 0 && (
          <div className="cart-content">
            <div className="cart-items">
              <div className="cart-items-header">
                <h2>ТОВАРИ У КОШИКУ ({totalQuantity})</h2>

                <button
                  type="button"
                  className="cart-clear-button"
                  onClick={clearCart}
                >
                  ОЧИСТИТИ КОШИК
                </button>
              </div>

              {items.map(item => (
                <div className="cart-item" key={item.id}>
                  <img
                    className="cart-item-image"
                    src={item.image}
                    alt={item.name}
                  />

                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <p>{item.specs}</p>

                    {Array.isArray(item.components) && item.components.length > 0 && (
                      <div className="cart-build-details">
                        <button
                          type="button"
                          className="cart-details-button"
                          onClick={() => toggleBuildDetails(item.id)}
                          aria-expanded={expandedBuilds.includes(item.id)}
                        >
                          {expandedBuilds.includes(item.id)
                            ? 'СХОВАТИ КОМПЛЕКТУЮЧІ ▲'
                            : 'ПЕРЕГЛЯНУТИ КОМПЛЕКТУЮЧІ ▼'}
                        </button>

                        {expandedBuilds.includes(item.id) && (
                          <div className="cart-components-list">
                            {item.components.map(component => (
                              <div
                                className="cart-component-row"
                                key={component.category}
                              >
                                <span>{component.category}</span>

                                <div className="cart-component-info">
                                  <strong>{component.name}</strong>
                                  <span>{formatPrice(component.price)}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="cart-item-bottom">
                      <span className="cart-item-price">
                        {formatPrice(item.price * item.quantity)}
                      </span>

                      <div className="cart-quantity">
                        <button
                          type="button"
                          onClick={() => decreaseQuantity(item.id)}
                          disabled={item.quantity === 1}
                          aria-label={`Зменшити кількість ${item.name}`}
                        >
                          −
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          type="button"
                          onClick={() => increaseQuantity(item.id)}
                          aria-label={`Збільшити кількість ${item.name}`}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="cart-remove-button"
                      onClick={() => removeItem(item.id)}
                    >
                      ✕ Видалити
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <aside className="cart-summary">
              <h2>ВАШЕ ЗАМОВЛЕННЯ</h2>

              <div className="cart-summary-row">
                <span>Товари</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>

              <div className="cart-summary-row">
                <span>Доставка</span>
                <span>Розраховується при оформленні</span>
              </div>

              <div className="cart-summary-total">
                <span>Разом</span>
                <strong>{formatPrice(totalPrice)}</strong>
              </div>

              <button
                type="button"
                className="cart-checkout-button"
                disabled
              >
                ОФОРМИТИ ЗАМОВЛЕННЯ
              </button>

              <p className="cart-summary-note">
                Оформлення замовлення підключимо пізніше.
              </p>

              <div className="cart-promo">
                <label htmlFor="cart-promo-input">ПРОМОКОД</label>
                <input
                  id="cart-promo-input"
                  type="text"
                  placeholder="Введіть промокод"
                  disabled
                />
              </div>
            </aside>
          </div>
        )}

        {items.length === 0 && (
          <>
            <div className="cart-empty">
              <div className="cart-empty-icon">
                <svg
                  width="42"
                  height="42"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
                </svg>
              </div>

              <h2>ТВІЙ КОШИК ПОКИ ПОРОЖНІЙ</h2>

              <p>
                Тут з'являться товари, які ти додаси.
                Почни з готової збірки або обери
                комплектуючі для власного ПК.
              </p>

              <div className="cart-empty-actions">
                <a href="/#components" className="cart-primary-button">
                  ПЕРЕГЛЯНУТИ КАТАЛОГ
                </a>

                <a
                  href="/#assembly"
                  className="cart-secondary-button"
                  onClick={() => {
                    sessionStorage.setItem('scrollToConfigurator', 'true');
                  }}
                >
                  ЗІБРАТИ ПК
                </a>
              </div>
            </div>

            <div className="cart-links">
              <a href="/#builds" className="cart-link-card">
                <h3>ГОТОВІ ПК</h3>
                <p>
                  Порівняй MATRIX START, MATRIX GAMING
                  і MATRIX ULTRA.
                </p>
                <span>Переглянути збірки →</span>
              </a>

              <a href="/#components" className="cart-link-card">
                <h3>КОМПЛЕКТУЮЧІ</h3>
                <p>
                  Відеокарти, процесори, пам'ять,
                  накопичувачі та інші категорії.
                </p>
                <span>Обрати комплектуючі →</span>
              </a>

              <a href="/#assembly" className="cart-link-card">
                <h3>ВЛАСНА КОНФІГУРАЦІЯ</h3>
                <p>
                  Збери основу ПК під свої задачі
                  та бюджет у конфігураторі.
                </p>
                <span>Перейти до конфігуратора →</span>
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
