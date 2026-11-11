import { ArrowLink, DataRows, InfoCard, PageIntro } from './InfoPageShared';
import './InfoPages.css';

const preparation = [
  'Номер замовлення або інформація про покупку',
  'Назва товару та доступний серійний номер',
  'Опис проблеми або причина повернення',
  'Фото чи відео, якщо допомагають пояснити ситуацію',
  'Доступний документ про придбання',
  'Контакт для відповіді',
];

const steps = [
  ['01', 'Напиши в підтримку', 'Скористайся формою контактів та обери тему звернення.'],
  ['02', 'Уточни необхідні дані', 'Перелік документів і спосіб передачі товару потребують підтвердження.'],
  ['03', 'Узгодь подальші дії', 'Строк розгляду, діагностика й можливі рішення уточнюються окремо.'],
];

export default function WarrantyPage() {
  return (
    <main className="info-page">
      <div className="info-container">
        <PageIntro current="Гарантія та повернення" title="ГАРАНТІЯ ТА ПОВЕРНЕННЯ" subtitle="Зручна структура для звернення щодо товару та документів." />

        <section className="info-card-grid info-card-grid-2 warranty-top-grid">
          <InfoCard icon={<span>♢</span>} title="ГАРАНТІЙНЕ ОБСЛУГОВУВАННЯ">
            <p>На зібраний ПК MATRIXPC пропонує 12 місяців гарантійного обслуговування. Для окремих комплектуючих діє строк, зазначений у картці товару та документах виробника.</p>
            <DataRows rows={[["Строк гарантії", "Потребує перевірки для конкретного товару"], ["Умови та виключення", "Уточнюються після юридичної перевірки"]]} />
            <ArrowLink to="/contacts?topic=warranty#contact-form" variant="primary">ЗВЕРНУТИСЯ ЩОДО ГАРАНТІЇ</ArrowLink>
          </InfoCard>

          <InfoCard icon={<span>↶</span>} title="ПОВЕРНЕННЯ ТОВАРУ">
            <p>Звернися з назвою товару, номером замовлення та причиною повернення. Обмін і повернення проводяться відповідно до чинного законодавства України.</p>
            <DataRows rows={[["Строк звернення", "Потребує юридичного підтвердження"], ["Вимоги до товару", "Потребують юридичного підтвердження"]]} />
            <ArrowLink to="/contacts?topic=return#contact-form">ЗАПИТАТИ ПРО ПОВЕРНЕННЯ</ArrowLink>
          </InfoCard>
        </section>

        <section className="warranty-guide info-section">
          <InfoCard title="ЩО ПІДГОТУВАТИ">
            <p>Орієнтовний перелік для опису звернення. Обов’язковість кожного документа та порядок передачі даних потребують перевірки.</p>
            <ul className="checklist">
              {preparation.map((item) => <li key={item}><span aria-hidden="true" />{item}</li>)}
            </ul>
          </InfoCard>
          <div className="warranty-steps">
            <h2 className="info-subheading">ЯК ПОЧАТИ</h2>
            {steps.map(([number, title, text]) => (
              <article className="warranty-step" key={number}>
                <span>{number}</span><div><h3>{title}</h3><p>{text}</p></div>
              </article>
            ))}
            <p className="info-note">Перед відправленням товару узгодь із підтримкою спосіб і адресу передачі. Напиши на matrixpc.infoua@gmail.com або зателефонуй +380 123 456 7890.</p>
          </div>
        </section>

        <InfoCard className="legal-details" title="ЮРИДИЧНІ ДЕТАЛІ ДЛЯ ПЕРЕВІРКИ">
          <DataRows rows={[["Правові підстави та сфера застосування", "Відповідно до чинного законодавства України"], ["Строки розгляду й повернення коштів", "Визначаються чинним законодавством України"], ["Доставка товару та можливі витрати", "Умови передачі узгоджуються з підтримкою до відправлення"]]} />
        </InfoCard>
      </div>
    </main>
  );
}

