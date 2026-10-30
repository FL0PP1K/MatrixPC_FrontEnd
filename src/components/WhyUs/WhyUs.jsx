import './WhyUs.css';

const advantages = [
  {
    id: 'warranty',
    title: 'ГАРАНТІЯ ЯКОСТІ',
    description:
      'Гарантійна підтримка та допомога після покупки.',
    icon: '/image/Icon_garantiya.png',
  },
  {
    id: 'testing',
    title: 'ПЕРЕВІРКА ПК',
    description:
      'Тестування компонентів та готової збірки перед відправленням.',
    icon: '/image/monitor-check 1.png',
  },
  {
    id: 'assembly',
    title: 'ІНДИВІДУАЛЬНА ЗБІРКА',
    description:
      'Підбір комплектуючих відповідно до твоїх потреб і бюджету.',
    icon: '/image/wrench 1.png',
  },
  {
    id: 'delivery',
    title: 'ДОСТАВКА',
    description:
      'Надійне пакування та доставка замовлень по Україні.',
    icon: '/image/truck 1.png',
  },
];

export default function WhyUs() {
  return (
    <section className="why-section" id="why-us">
      <div className="why-container">
        <div className="why-header">
          <h2 className="why-title">
            ЧОМУ ОБИРАЮТЬ MATRIXPC
          </h2>

          <p className="why-subtitle">
            Ми допомагаємо зібрати надійний ПК
            під твої потреби та бюджет.
          </p>
        </div>

        <div className="why-grid">
          {advantages.map((item) => (
            <article className="why-card" key={item.id}>
              <div className="why-icon">
                <img src={item.icon} alt="" loading="lazy" />
              </div>

              <h3 className="why-card-title">
                {item.title}
              </h3>

              <p className="why-card-description">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}