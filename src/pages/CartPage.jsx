import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useShop } from "../context/ShopContext";

import "./CartPage.css";

export default function CartPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    cartItems,
    cartCount,
    cartTotal,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useShop();

  const [expandedBuilds, setExpandedBuilds] = useState([]);

  const formatPrice = (price) => `${Number(price).toLocaleString("uk-UA")} ₴`;

  const toggleBuildDetails = (id) => {
    setExpandedBuilds((previous) =>
      previous.includes(id)
        ? previous.filter((buildId) => buildId !== id)
        : [...previous, id],
    );
  };


  return (
    <main className="cart-page">
      <div className="cart-container">
        <div className="cart-breadcrumb">
          <Link to="/">Головна</Link>
          <span>/</span>
          <span>Кошик</span>
        </div>

        <h1 className="cart-title">КОШИК</h1>
        <p className="cart-subtitle">
          Перевір товари перед оформленням замовлення.
        </p>

        {cartItems.length > 0 ? (
          <div className="cart-layout">
            <div className="cart-left">
              <div className="cart-items-header">
                <h2>Товари у кошику</h2>
                <span>
                  {cartCount}{" "}
                  {cartCount === 1
                    ? "товар"
                    : cartCount >= 2 && cartCount <= 4
                      ? "товари"
                      : "товарів"}
                </span>
              </div>

              <div className="cart-items-list">
                {cartItems.map((item) => (
                  <article className="cart-item" key={item.id}>
                    <Link
                      to={`/product/${item.id}`}
                      className="cart-item-image-wrap"
                    >
                      <img
                        className="cart-item-image"
                        src={item.image}
                        alt={item.name}
                      />
                    </Link>

                    <div className="cart-item-info">
                      <Link to={`/product/${item.id}`}>
                        <h3>{item.name}</h3>
                      </Link>
                      <p className="cart-item-specs">{item.specs}</p>
                      <p className="cart-item-status">
                        Наявність і кількість буде перевірено під час оформлення.
                      </p>

                      {Array.isArray(item.components) &&
                        item.components.length > 0 && (
                          <div className="cart-build-details">
                            <button
                              type="button"
                              className="cart-details-button"
                              onClick={() => toggleBuildDetails(item.id)}
                              aria-expanded={expandedBuilds.includes(item.id)}
                            >
                              {expandedBuilds.includes(item.id)
                                ? "СХОВАТИ КОМПЛЕКТУЮЧІ ▲"
                                : "ПЕРЕГЛЯНУТИ КОМПЛЕКТУЮЧІ ▼"}
                            </button>
                            {expandedBuilds.includes(item.id) && (
                              <div className="cart-components-list">
                                {item.components.map((component) => (
                                  <div
                                    className="cart-component-row"
                                    key={component.category}
                                  >
                                    <span>{component.category}</span>
                                    <div className="cart-component-info">
                                      <strong>{component.name}</strong>
                                      <span>
                                        {formatPrice(component.price)}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                      <div className="cart-quantity-line">
                        <div className="cart-quantity">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            aria-label={`Зменшити кількість ${item.name}`}
                          >
                            −
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            aria-label={`Збільшити кількість ${item.name}`}
                          >
                            +
                          </button>
                        </div>
                        <span className="cart-unit-price">
                          за 1 шт. · {formatPrice(item.price)}
                        </span>
                      </div>
                    </div>

                    <div className="cart-item-side">
                      <strong className="cart-item-price">
                        {formatPrice(item.price * item.quantity)}
                      </strong>
                      <button
                        type="button"
                        className="cart-remove-button"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Видалити
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              <div className="cart-below-actions">
                <Link to="/catalog" className="cart-continue-button">
                  ← ПРОДОВЖИТИ ПОКУПКИ
                </Link>
                <button
                  type="button"
                  className="cart-clear-button"
                  onClick={clearCart}
                >
                  ОЧИСТИТИ КОШИК
                </button>
              </div>
            </div>

            <div className="cart-right">
              <aside className="cart-summary">
                <h2>ПІДСУМОК</h2>
                <div className="cart-summary-row">
                  <span>Товарів</span>
                  <span>{cartCount} шт.</span>
                </div>
                <div className="cart-summary-row">
                  <span>Вартість товарів</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="cart-summary-row">
                  <span>Доставка</span>
                  <span>За тарифом перевізника</span>
                </div>
                <div className="cart-summary-divider" />
                <p className="cart-total-label">Загалом за товари</p>
                <strong className="cart-summary-price">
                  {formatPrice(cartTotal)}
                </strong>
                <p className="cart-summary-note">
                  Доставка оплачується окремо за тарифом Укрпошти або Нової пошти. Строк — орієнтовно до 4 днів.
                </p>
                <button type="button" className="cart-checkout-button" onClick={() => navigate(isAuthenticated ? "/checkout" : "/login")}>
                  {isAuthenticated ? "ОФОРМИТИ ЗАМОВЛЕННЯ" : "УВІЙТИ ДЛЯ ОФОРМЛЕННЯ"}
                </button>
              </aside>
            </div>
          </div>
        ) : (
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
                Додай комплектуючі з каталогу або створи власну конфігурацію ПК.
              </p>
              <div className="cart-empty-actions">
                <Link to="/catalog" className="cart-primary-button">
                  ПЕРЕГЛЯНУТИ КАТАЛОГ
                </Link>
                <Link to="/" className="cart-secondary-button">
                  ЗІБРАТИ ПК
                </Link>
              </div>
            </div>

            <div className="cart-links">
              <Link to="/#assembly" className="cart-link-card">
                <h3>ПІДБІР ПК</h3>
                <p>Обери комплектуючі відповідно до своїх задач і бюджету.</p>
                <span>Перейти до конфігуратора →</span>
              </Link>
              <Link to="/catalog" className="cart-link-card">
                <h3>КОМПЛЕКТУЮЧІ</h3>
                <p>
                  Відеокарти, процесори, пам'ять, накопичувачі та інші
                  категорії.
                </p>
                <span>Обрати комплектуючі →</span>
              </Link>
              <Link to="/" className="cart-link-card">
                <h3>ВЛАСНА КОНФІГУРАЦІЯ</h3>
                <p>
                  Збери основу ПК під свої задачі та бюджет у конфігураторі.
                </p>
                <span>Перейти до конфігуратора →</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
