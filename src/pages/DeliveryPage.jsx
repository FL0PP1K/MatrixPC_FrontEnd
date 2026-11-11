import { ContactCta, DataRows, InfoCard, PageIntro } from './InfoPageShared';
import './InfoPages.css';

const delivery = [
  { icon: '⬡', title: 'До відділення', text: 'Перевізник і перелік доступних відділень уточнюються.', rows: [['Вартість', 'Уточнюється'], ['Строк', 'Уточнюється']] },
  { icon: '↗', title: 'За адресою', text: 'Можливість доставки до дверей потребує підтвердження.', rows: [['Вартість', 'Уточнюється'], ['Строк', 'Уточнюється']] },
  { icon: '◎', title: 'Самовивіз', text: 'Доступність та місце отримання уточнюються; адресу ще не додано.', rows: [['Вартість', 'Уточнюється'], ['Строк', 'Уточнюється']] },
];

const payments = [
  ['Карткою', 'Платіжний сервіс та доступність онлайн-оплати потребують підтвердження.'],
  ['За реквізитами', 'Реквізити ще не опубліковано. Порядок і умови переказу уточнюються.'],
  ['При отриманні', 'Доступність післяплати, комісія та порядок розрахунку уточнюються.'],
];

const questions = [
  ['Яким перевізником відправляєте?', 'Перелік перевізників потребує підтвердження.'],
  ['Коли отримаю замовлення?', 'Строк уточнюється після узгодження складу та способу доставки.'],
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
            <p>Вартість товарів і доставки показуються окремо. Поки тариф перевезення не узгоджено, остаточна сума замовлення не визначена.</p>
            <DataRows rows={[["Товари", "За обраною конфігурацією"], ["Доставка та комісії", "Уточнюється"]]} />
          </InfoCard>
          <InfoCard title="ПЕРЕД ОТРИМАННЯМ">
            <p>Перевір склад замовлення, контактні дані та обраний спосіб отримання. Порядок огляду пакування й товару слід уточнити після підтвердження способу доставки.</p>
            <p className="info-status">Немає підтверджених строків або гарантій перевезення.</p>
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

