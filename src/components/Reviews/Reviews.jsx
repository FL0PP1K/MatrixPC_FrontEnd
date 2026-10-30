import './Reviews.css';

const reviewPlaceholders = [
  {
    id: 1,
    title: 'Відгук про збірку ПК',
    description:
      'Тут з’явиться відгук покупця про якість зібраного комп’ютера.',
  },
  {
    id: 2,
    title: 'Відгук про обслуговування',
    description:
      'Тут з’явиться відгук про консультацію та підбір комплектуючих.',
  },
  {
    id: 3,
    title: 'Відгук про доставку',
    description:
      'Тут з’явиться відгук про пакування, доставку та отримання ПК.',
  },
];

export default function Reviews() {
  return (
    <section className="reviews-section" id="reviews">
      <div className="reviews-container">
        <div className="reviews-header">
          <h2 className="reviews-title">
            ВІДГУКИ КЛІЄНТІВ
          </h2>

          <p className="reviews-subtitle">
            Дізнайся, що говорять про MATRIXPC
            наші покупці.
          </p>
        </div>

        <div className="reviews-grid">
          {reviewPlaceholders.map((review) => (
            <article className="review-card" key={review.id}>
              <span className="review-placeholder-label">
                ДЕМО-КАРТКА
              </span>

              <div className="review-stars" aria-hidden="true">
                ☆☆☆☆☆
              </div>

              <h3 className="review-card-heading">
                {review.title}
              </h3>

              <p className="review-text">
                {review.description}
              </p>

              <div className="review-author">
                Майбутній відгук покупця
              </div>

              <p className="review-verified">
                Очікує публікації
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}