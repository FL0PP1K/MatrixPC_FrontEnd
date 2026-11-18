import { ContactCta, DataRows, InfoCard, PageIntro } from './InfoPageShared';
import './InfoPages.css';

const delivery = [
  { icon: '⬡', title: 'До відділення', text: 'Доставка Укрпоштою або Новою поштою до обраного відділення.', rows: [['Вартість', 'За тарифами перевізника'], ['Строк', 'Орієнтовно до 4 днів']] },
  { icon: '↗', title: 'За адресою', text: 'Доставка кур’єром Укрпошти або Нової пошти за адресою отримувача.', rows: [['Вартість', 'За тарифами перевізника'], ['Строк', 'Орієнтовно до 4 днів']] },
  { icon: '◎', title: 'Самовивіз', text: 'Самовивіз у м. Коломия. Точне місце отримання узгоджується під час підтвердження замовлення.', rows: [['Вартість', 'Без оплати за доставку'], ['Строк', 'За домовленістю']] },
];

const payments = [
  ['Карткою', 'Оплата банківською карткою.'],
  ['За реквізитами', 'Після підтвердження замовлення надішлемо реквізити для банківського переказу.'],
  ['Післяплата', 'Оплата під час отримання; можлива комісія перевізника згідно з його тарифами.'],
  ['Розстрочка', 'Оформлення та графік платежів залежать від умов банку або платіжного сервісу.'],
];

const questions = [
  ['Яким перевізником відправляєте?', 'Укрпоштою або Новою поштою.'],
  ['Коли отримаю замовлення?', 'Орієнтовно до 4 днів після відправлення; точний строк залежить від перевізника та населеного пункту.'],
  ['Чи можна сплатити частинами?', 'Так, якщо послуга доступна для обраного банку та замовлення. Умови погоджуються під час оформлення.'],
  ['Чи входить доставка в ціну ПК?', 'Ні. Вартість доставки оплачується окремо за тарифом обраного перевізника.'],
];

export default function DeliveryPage() {
  return (
    <main className="info-page">
      <div className="info-container">
        <PageIntro current="Доставка та оплата" title="ДОСТАВКА ТА ОПЛАТА" subtitle="Варіанти доставки та оплати замовлень MATRIXPC." />

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
          <div className="info-card-grid info-card-grid-4">
            {payments.map(([title, text]) => (
              <InfoCard title={title} key={title}>
                <p>{text}</p>
              </InfoCard>
            ))}
          </div>
        </section>

        <div className="info-card-grid info-card-grid-2 info-section delivery-detail-grid">
          <InfoCard title="ЯК ФОРМУЄТЬСЯ СУМА">
            <p>Вартість товарів і доставки показуються окремо. Доставка розраховується за актуальними тарифами Укрпошти або Нової пошти.</p>
            <DataRows rows={[["Товари", "За цінами каталогу на момент оформлення"], ["Доставка та комісії", "За актуальними тарифами перевізника"]]} />
          </InfoCard>
          <InfoCard title="ПЕРЕД ОТРИМАННЯМ">
            <p>Перед отриманням звір дані одержувача. Оглянь пакування та товар у присутності представника перевізника й зафіксуй пошкодження за його правилами.</p>
            <p className="info-status">Доступні картка, переказ за реквізитами, післяплата та розстрочка. Онлайн-списання на сайті не виконується: деталі оплати узгоджуються під час підтвердження замовлення.</p>
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

