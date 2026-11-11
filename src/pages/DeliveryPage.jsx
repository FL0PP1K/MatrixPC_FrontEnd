import { ContactCta, DataRows, InfoCard, PageIntro } from './InfoPageShared';
import './InfoPages.css';

const delivery = [
  { icon: '⬡', title: 'До відділення', text: 'Доставка Укрпоштою або Новою поштою до обраного відділення.', rows: [['Вартість', 'За тарифами перевізника'], ['Строк', 'Орієнтовно до 4 днів']] },
  { icon: '↗', title: 'За адресою', text: 'Доставка кур’єром Укрпошти або Нової пошти за адресою отримувача.', rows: [['Вартість', 'За тарифами перевізника'], ['Строк', 'Орієнтовно до 4 днів']] },
  { icon: '◎', title: 'Самовивіз', text: 'Самовивіз у м. Коломия. Точне місце отримання узгоджується під час підтвердження замовлення.', rows: [['Вартість', 'Без оплати за доставку'], ['Строк', 'За домовленістю']] },
];

const payments = [
  ['Карткою', 'Оплата банківською карткою.'],
  ['За реквізитами', 'Переказ на банківські реквізити надаються під час оформлення замовлення.'],
  ['Післяплата', 'Оплата під час отримання; можлива комісія перевізника згідно з його тарифами.'],
  ['Розстрочка', 'Доступність і графік платежів залежать від умов банку або платіжного сервісу.'],
];

const questions = [
  ['Яким перевізником відправляєте?', 'Укрпоштою або Новою поштою.'],
  ['Коли отримаю замовлення?', 'Орієнтовно до 4 днів після відправлення; точний строк залежить від перевізника та населеного пункту.'],
  ['Чи можна сплатити частинами?', 'Доступність такого способу не підтверджена.'],
  ['Чи входить доставка в ціну ПК?', 'Ні, у макеті вона показана окремо як «Уточнюється».'],
];

export default function DeliveryPage() {
  return (
    <main className="info-page">
      <div className="info-container">
        <PageIntro current="Доставка та оплата" title="ДОСТАВКА ТА ОПЛАТА" subtitle="Що потрібно узгодити перед оформленням покупки." />

        <section className="info-section delivery-section">
          <h2 className="info-subheading">ВАРІАНТИ ОТРИМАННЯ</h2>
          <div className="info-card-grid info-card-grid-3">
            {delivery.map((item) => (
              <InfoCard className="delivery-card" icon={<span>{item.icon}</span>} title={item.title} key={item.title}>
                <p>{item.text}</p><DataRows rows={item.rows} />
              </InfoCard>
            ))}
          </div>
        </section>

        <section className="info-section">
          <h2 className="info-subheading">ВАРІАНТИ ОПЛАТИ</h2>
          <div className="info-card-grid info-card-grid-3">
            {payments.map(([title, text]) => (
              <InfoCard title={title} key={title}>
                <p>{text}</p><p className="info-status">Потребує підтвердження</p>
              </InfoCard>
            ))}
          </div>
        </section>

        <div className="info-card-grid info-card-grid-2 info-section delivery-detail-grid">
          <InfoCard title="ЯК ФОРМУЄТЬСЯ СУМА">
            <p>Вартість товарів і доставки показуються окремо. Доставка розраховується за актуальними тарифами Укрпошти або Нової пошти.</p>
            <DataRows rows={[["Товари", "За обраною конфігурацією"], ["Доставка та комісії", "Уточнюється"]]} />
          </InfoCard>
          <InfoCard title="ПЕРЕД ОТРИМАННЯМ">
            <p>Перевір склад замовлення, контактні дані та обраний спосіб отримання. Порядок огляду пакування й товару слід уточнити після підтвердження способу доставки.</p>
            <p className="info-status">Орієнтовний строк доставки — до 4 днів; точний строк підтверджує перевізник.</p>
          </InfoCard>
        </div>

        <section className="info-section">
          <h2 className="info-subheading">ПОШИРЕНІ ЗАПИТАННЯ</h2>
          <div className="info-card faq-card">
            {questions.map(([question, answer]) => (
              <div className="faq-row" key={question}><h3>{question}</h3><p>{answer}</p></div>
            ))}
          </div>
        </section>

        <ContactCta />
      </div>
    </main>
  );
}

