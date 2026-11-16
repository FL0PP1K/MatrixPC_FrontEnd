import { Link } from 'react-router-dom';
import './Builds.css';

const scenarios = [
  {
    id: 'gaming',
    title: 'ІГРИ',
    description: 'Підбери компоненти для улюблених ігор, роздільної здатності монітора та бажаної частоти кадрів.',
    image: '/image/PC_1.png',
    link: '/#assembly',
    action: 'ЗІБРАТИ В КОНФІГУРАТОРІ',
  },
  {
    id: 'work',
    title: 'РОБОТА Й НАВЧАННЯ',
    description: 'Визнач потрібний обсяг пам’яті та продуктивність під програми, з якими працюєш щодня.',
    image: '/image/PC_2.png',
    link: '/contacts?topic=pc_selection#contact-form',
    action: 'ОБГОВОРИТИ ЗАДАЧУ',
  },
  {
    id: 'creator',
    title: 'ТВОРЧІ ЗАДАЧІ',
    description: 'Розкажи, з якими відео, графікою чи проєктами працюєш — допоможемо визначити пріоритети конфігурації.',
    image: '/image/PC_3.png',
    link: '/contacts?topic=pc_selection#contact-form',
    action: 'ОБГОВОРИТИ КОНФІГУРАЦІЮ',
  },
];

export default function Builds() {
  return (
    <section className="builds-section" id="builds">
      <div className="builds-container">
        <div className="builds-header">
          <h2 className="builds-title">ПІДБІР ПК ПІД ТВОЇ ЗАДАЧІ</h2>
          <p className="builds-subtitle">
            Вкажи, для чого потрібен комп’ютер. Актуальний склад, ціни та наявність обираються з каталогу.
          </p>
        </div>

        <div className="builds-grid">
          {scenarios.map((scenario) => (
            <article className="build-card" key={scenario.id}>
              <div className="build-card-image">
                <img src={scenario.image} alt={scenario.title} loading="lazy" />
              </div>
              <div className="build-card-content">
                <h3 className="build-card-title">{scenario.title}</h3>
                <p className="build-card-desc">{scenario.description}</p>
                <Link className="build-card-button" to={scenario.link}>
                  {scenario.action}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
