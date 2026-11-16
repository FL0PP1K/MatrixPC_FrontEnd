import './WhyUs.css';

const advantages = [
  {
    id: 'selection',
    title: 'ПІД ТВОЇ ЗАДАЧІ',
    description: 'Конфігуратор і консультація допоможуть визначити потрібні комплектуючі та бюджет.',
    icon: '/image/wrench 1.png',
  },
  {
    id: 'catalog',
    title: 'ДАНІ З КАТАЛОГУ',
    description: 'Картки товарів показують назви, ціни, залишки та характеристики, які додані до каталогу.',
    icon: '/image/monitor-check 1.png',
  },
  {
    id: 'order',
    title: 'ЗАМОВЛЕННЯ В КАБІНЕТІ',
    description: 'Після входу в акаунт оформлені замовлення зберігаються у твоєму профілі.',
    icon: '/image/Icon_garantiya.png',
  },
  {
    id: 'delivery',
    title: 'ДОСТАВКА ПО УКРАЇНІ',
    description: 'Обери Укрпошту, Нову пошту або самовивіз у Коломиї під час оформлення.',
    icon: '/image/truck 1.png',
  },
];

export default function WhyUs() {
  return (
    <section className="why-section" id="why-us">
      <div className="why-container">
        <div className="why-header">
          <h2 className="why-title">ЗРУЧНО ОБРАТИ Й ЗАМОВИТИ</h2>
          <p className="why-subtitle">
            Каталог, конфігуратор і кабінет користувача зібрані на одному сайті.
          </p>
        </div>
        <div className="why-grid">
          {advantages.map((item) => (
            <article className="why-card" key={item.id}>
              <div className="why-icon">
                <img src={item.icon} alt="" loading="lazy" />
              </div>
              <h3 className="why-card-title">{item.title}</h3>
              <p className="why-card-description">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
