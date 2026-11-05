import './Cart.css';

export default function Cart() {
  return (
    <section className="cart-page">
      <div className="cart-container">
        <div className="cart-breadcrumb">
          <a href="/">Головна</a>
          <span>/</span>
          <span>Кошик</span>
        </div>

        <h1 className="cart-title">КОШИК</h1>
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
      </div>
    </section>
  );
}