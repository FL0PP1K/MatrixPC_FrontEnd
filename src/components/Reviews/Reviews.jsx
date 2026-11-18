import './Reviews.css';

const guidance = [
  {
    title: 'ПІДБІР КОМПЛЕКТУЮЧИХ',
    description: 'Почни з бюджету, програм та ігор, якими користуєшся. Це допоможе визначити пріоритети конфігурації.',
  },
  {
    title: 'ПЕРЕВІРКА ЗАМОВЛЕННЯ',
    description: 'Перед оформленням переглянь склад кошика, кількість товарів і дані доставки.',
  },
  {
    title: 'ПИТАННЯ ПІСЛЯ ПОКУПКИ',
    description: 'Для запитань щодо товару, гарантії чи замовлення напиши через форму контактів.',
  },
];

export default function Reviews() {
  return (
    <section className="reviews-section" id="reviews">
      <div className="reviews-container">
        <div className="reviews-header">
          <h2 className="reviews-title">ПОТРІБНА ДОПОМОГА З ВИБОРОМ?</h2>
          <p className="reviews-subtitle">
            Корисна інформація перед вибором і оформленням замовлення.
          </p>
        </div>
        <div className="reviews-grid">
          {guidance.map((item) => (
            <article className="review-card" key={item.title}>
              <h3 className="review-card-heading">{item.title}</h3>
              <p className="review-text">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
