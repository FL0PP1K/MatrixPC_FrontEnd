import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { submitContactInquiry } from '../services/contactApi';
import { InfoCard, PageIntro } from './InfoPageShared';
import './InfoPages.css';

const topics = [
  ['pc_selection', 'Підбір ПК'],
  ['order', 'Питання щодо замовлення'],
  ['warranty', 'Гарантія'],
  ['return', 'Повернення товару'],
  ['other', 'Інше'],
];

function HeadsetIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 13v-1a9 9 0 0 1 18 0v1"/><path d="M3 13h4v7H6a3 3 0 0 1-3-3zM21 13h-4v7h1a3 3 0 0 0 3-3zM17 20a5 5 0 0 1-5 2"/></svg>;
}

export default function ContactsPage() {
  const [searchParams] = useSearchParams();
  const requestedTopic = searchParams.get('topic');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const validTopic = topics.some(([value]) => value === requestedTopic);
    setTopic(validTopic ? requestedTopic : '');
  }, [requestedTopic]);

  async function handleSubmit(event) {
    event.preventDefault();
    setFeedback(null);
    setSubmitting(true);

    try {
      await submitContactInquiry({ name, email, topic, message, consent });
      setFeedback({ type: 'success', text: 'Звернення прийнято й зареєстровано. Дякуємо за повідомлення.' });
      setName('');
      setEmail('');
      setTopic('');
      setMessage('');
      setConsent(false);
    } catch (error) {
      const errorMessage = error instanceof TypeError
        ? 'Не вдалося з’єднатися з сервером. Перевір підключення та спробуй ще раз.'
        : error.message;
      setFeedback({ type: 'error', text: errorMessage });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="info-page contacts-page">
      <div className="info-container">
        <PageIntro current="Контакти" section={null} title="КОНТАКТИ" subtitle="Поговоримо про твій майбутній ПК або питання щодо покупки." />

        <div className="contacts-layout">
          <section className="info-card contact-form-card" id="contact-form">
            <h2>НАПИСАТИ НАМ</h2>
            <p className="contact-form-intro">Обери тему та опиши запит. Поля з * обов’язкові.</p>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-fields-row">
                <label className="contact-field">
                  <span>Ім’я *</span>
                  <input autoComplete="name" name="name" minLength={2} maxLength={80} placeholder="Як до Вас звертатися?" value={name} onChange={(event) => setName(event.target.value)} required />
                </label>
                <label className="contact-field">
                  <span>Електронна пошта для відповіді *</span>
                  <input autoComplete="email" name="email" type="email" maxLength={254} placeholder="name@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
                </label>
              </div>
              <label className="contact-field">
                <span>Тема звернення *</span>
                <select name="topic" value={topic} onChange={(event) => setTopic(event.target.value)} required>
                  <option value="" disabled>Оберіть тему звернення</option>
                  {topics.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
                </select>
              </label>
              <label className="contact-field">
                <span>Повідомлення *</span>
                <textarea name="message" minLength={10} maxLength={3000} placeholder="Опиши задачі та бюджет або питання щодо замовлення. Не додавай платіжні дані чи паролі." value={message} onChange={(event) => setMessage(event.target.value)} required />
              </label>
              <label className="contact-consent">
                <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} required />
                <span>Погоджуюся на обробку даних для відповіді на звернення. Обов’язково *</span>
              </label>
              {feedback && <p className={`contact-feedback ${feedback.type}`} role={feedback.type === 'error' ? 'alert' : 'status'}>{feedback.text}</p>}
              <button className="info-button info-button-primary" type="submit" disabled={submitting}>
                {submitting ? 'НАДСИЛАННЯ…' : 'НАДІСЛАТИ ЗВЕРНЕННЯ'}
              </button>
            </form>
          </section>

          <aside className="contacts-aside">
            <InfoCard className="support-card" title="ПІДТРИМКА MATRIXPC">
              <div className="info-card-icon"><HeadsetIcon /></div>
              <p className="support-line">Електронна пошта — уточнюється</p>
              <p className="support-line">Телефон — уточнюється</p>
              <dl className="info-data-rows">
                <div className="info-data-row"><dt>Години підтримки</dt><dd>Уточнюються</dd></div>
                <div className="info-data-row"><dt>Адреса</dt><dd>Не додана, потребує підтвердження</dd></div>
              </dl>
            </InfoCard>

            <InfoCard className="social-card" title="СОЦІАЛЬНІ МЕРЕЖІ" >
              <div id="socials" className="social-placeholder-rows">
                <div className="info-data-row"><span>Telegram</span><span>Посилання ще не додано</span></div>
                <div className="info-data-row"><span>Instagram</span><span>Посилання ще не додано</span></div>
              </div>
            </InfoCard>

            <InfoCard title="ПРО ЩО МОЖНА ЗАПИТАТИ">
              <p>Підбір комплектуючих, порівняння готових ПК, уточнення конфігурації або підготовка звернення щодо сервісу.</p>
            </InfoCard>
          </aside>
        </div>

        <section className="info-card-grid info-card-grid-3 contact-topic-cards">
          <InfoCard title="ПІДБІР КОНФІГУРАЦІЇ"><p>Вкажи бюджет, основні ігри або програми й побажання до формату ПК.</p></InfoCard>
          <InfoCard title="ПИТАННЯ ЩОДО ЗАМОВЛЕННЯ"><p>Підготуй номер замовлення та назву товару. Не надсилай дані картки.</p></InfoCard>
          <InfoCard title="ГАРАНТІЯ ТА ПОВЕРНЕННЯ"><p>Опиши проблему. Конкретний порядок звернення потребує підтвердження.</p></InfoCard>
        </section>
      </div>
    </main>
  );
}

