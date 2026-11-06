import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

import './CartPage.css';

export default function CartPage() {
  const {
    cartItems,
    cartCount,
    cartTotal,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useShop();

  const formatPrice = (price) =>
    `${price.toLocaleString('uk-UA')} ₴`;

  if (cartItems.length === 0) {
    return (
      <main className="cart-page">
        <div className="cart-empty">
          <h1>ТВІЙ КОШИК ПОРОЖНІЙ</h1>
          <p>Додай комплектуючі, які хочеш придбати.</p>

          <Link to="/catalog" className="cart-continue-button">
            ПЕРЕЙТИ ДО КАТАЛОГУ
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="cart-heading">
        <div>
          <p className="cart-breadcrumb">
            Головна / Кошик
          </p>

          <h1>КОШИК</h1>
          <p>Товарів у кошику: {cartCount}</p>
        </div>

        <button
          type="button"
          className="cart-clear-button"
          onClick={clearCart}
        >
          Очистити кошик
        </button>
      </div>

      <div className="cart-layout">
        <section className="cart-items">
          {cartItems.map((item) => (
            <article className="cart-item" key={item.id}>
              <Link
                to={`/product/${item.id}`}
                className="cart-item-image"
              >
                <img src={item.image} alt={item.name} />
              </Link>

              <div className="cart-item-info">
                <Link
                  to={`/product/${item.id}`}
                  className="cart-item-name"
                >
                  {item.name}
                </Link>

                <p>{item.specs}</p>

                <strong>{formatPrice(item.price)}</strong>
              </div>

              <div className="cart-item-actions">
                <div className="cart-quantity">
                  <button
                    type="button"
                    disabled={item.quantity <= 1}
                    onClick={() =>
                      updateQuantity(item.id, item.quantity - 1)
                    }
                    aria-label="Зменшити кількість"
                  >
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(item.id, item.quantity + 1)
                    }
                    aria-label="Збільшити кількість"
                  >
                    +
                  </button>
                </div>

                <strong className="cart-item-total">
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
        </section>

        <aside className="cart-summary">
          <h2>ПІДСУМОК ЗАМОВЛЕННЯ</h2>

          <div>
            <span>Кількість товарів</span>
            <strong>{cartCount}</strong>
          </div>

          <div className="cart-summary-total">
            <span>До сплати</span>
            <strong>{formatPrice(cartTotal)}</strong>
          </div>

          <button
            type="button"
            className="cart-checkout-button"
            disabled
          >
            ОФОРМИТИ ЗАМОВЛЕННЯ
          </button>

          <p>
            Оформлення замовлення буде доступне після
            підключення серверної частини.
          </p>

          <Link to="/catalog">
            Продовжити покупки
          </Link>
        </aside>
      </div>
    </main>
  );
}