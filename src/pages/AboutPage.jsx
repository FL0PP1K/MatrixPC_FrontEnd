import { ArrowLink, ContactCta, InfoCard } from './InfoPageShared';
import { Link } from 'react-router-dom';
import './InfoPages.css';

const advantages = [
  ['sliders', 'ПІД ТВОЇ ЗАДАЧІ', 'Починаємо з ігор, робочих програм і бюджету, а не зі списку найдорожчих деталей.'],
  ['chip', 'ЗРОЗУМІЛИЙ ВИБІР', 'Пояснюємо роль компонентів та допомагаємо порівняти готові варіанти.'],
  ['wrench', 'ГНУЧКА КОНФІГУРАЦІЯ', 'Можна обрати готову збірку або почати власну в конфігураторі.'],
  ['chat', 'ДІАЛОГ ПРО ПК', 'Питання щодо комплектації, сумісності та сервісу зібрані в одному місці.'],
];

const steps = [
  ['01', 'Опиши задачі', 'Ігри, робочі програми, побажання до формату й бюджет.'],
  ['02', 'Порівняй варіанти', 'Готова збірка або власна конфігурація з потрібних категорій.'],
  ['03', 'Уточни склад', 'Конкретні моделі, сумісність, наявність і умови сервісу.'],
  ['04', 'Узгодь деталі', 'Доставка, оплата та остаточний склад потребують підтвердження.'],
];

const iconPaths = {
  sliders: <><path d="M4 6h16M4 12h16M4 18h16"/><path d="M8 4v4m8 2v4m-5 2v4"/></>,
  chip: <><rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 9h6v6H9zM9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m-4 6h4m12-6h4m-4 6h4"/></>,
  wrench: <><path d="M14.7 6.3a5 5 0 0 0-6.5 6.5L3 18l3 3 5.2-5.2a5 5 0 0 0 6.5-6.5L14 13l-3-3z"/></>,
  chat: <><path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5 8 8 0 0 1-3.5-.8L4 20l1.8-4.3A7.5 7.5 0 1 1 20 11.5Z"/></>,
};

function LineIcon({ name }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{iconPaths[name]}</svg>;
}

export default function AboutPage() {
  return (
    <main className="info-page about-page">
      <div className="info-container">
        <nav className="info-breadcrumb" aria-label="Навігаційний ланцюжок">
          <Link to="/">Головна</Link><span aria-hidden="true">/</span><span aria-current="page">Про нас</span>
        </nav>

        <section className="about-hero">
          <div className="about-hero-copy">
            <p className="info-eyebrow">ПРО MATRIXPC</p>
            <h1>Твій ПК.<br />Твої правила.</h1>
            <p className="about-lead">Комп’ютер має відповідати твоєму життю — іграм, роботі, навчанню та ідеям.</p>
            <p className="about-body">Тому MATRIXPC об’єднує комплектуючі, готові ПК і конфігуратор. Тут можна розібратися у варіантах, визначити пріоритети та підібрати основу для своєї збірки.</p>
            <div className="info-button-row">
              <ArrowLink to="/#builds" variant="primary">ОБРАТИ ГОТОВИЙ ПК</ArrowLink>
              <ArrowLink to="/#assembly">ЗІБРАТИ СВІЙ</ArrowLink>
            </div>
          </div>
          <div className="about-hero-image">
            <img src="/image/PC_ULTRA.png" alt="Ігровий комп’ютер з підсвічуванням MATRIXPC" />
          </div>
        </section>

        <section className="info-section">
          <h2 className="info-section-title">НЕ ПРОСТО ДЕТАЛІ. ТВОЯ КОНФІГУРАЦІЯ.</h2>
          <p className="info-section-subtitle">Важливо не лише що всередині, а й для чого ти використовуєш ПК.</p>
          <div className="info-card-grid info-card-grid-4">
            {advantages.map(([icon, title, text]) => (
              <InfoCard icon={<LineIcon name={icon} />} title={title} key={title}>
                <p>{text}</p>
              </InfoCard>
            ))}
          </div>
        </section>

        <section className="info-section about-steps-section">
          <h2 className="info-section-title info-section-title-small">ЯК ЗНАЙТИ СВІЙ ПК</h2>
          <div className="about-steps">
            {steps.map(([number, title, text]) => (
              <article className="about-step" key={number}>
                <span>{number}</span><h3>{title}</h3><p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <ContactCta />
      </div>
    </main>
  );
}

