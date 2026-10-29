import { useEffect, useState } from 'react';
import './Builds.css';

const builds = [
  {
    id: 'matrix-start',
    name: 'MATRIX START',
    description: 'Ідеальний старт для ігор та навчання',
    cpu: 'AMD Ryzen 5',
    gpu: 'GeForce RTX 5060',
    ram: '16 GB RAM',
    ssd: '1 TB SSD',
    price: 39999,
    image: '/image/PC_1.png',
  },
  {
    id: 'matrix-gaming',
    name: 'MATRIX GAMING',
    description: 'Потужний ПК для сучасних ігор',
    cpu: 'AMD Ryzen 7',
    gpu: 'GeForce RTX 5070',
    ram: '32 GB RAM',
    ssd: '1 TB SSD',
    price: 69999,
    image: '/image/PC_2.png',
  },
  {
    id: 'matrix-ultra',
    name: 'MATRIX ULTRA',
    description: 'Максимальна потужність без компромісів',
    cpu: 'AMD Ryzen 9',
    gpu: 'GeForce RTX 5090',
    ram: '64 GB RAM',
    ssd: '2 TB SSD',
    price: 129999,
    image: '/image/PC_3.png',
  },
];

const formatPrice = (price) =>
  `${price.toLocaleString('uk-UA')} ₴`;

function BuildCard({ build, onDetails }) {
  return (
    <article className="build-card">
      <div className="build-card-image">
        <img
          src={build.image}
          alt={build.name}
          loading="lazy"
        />
      </div>

      <div className="build-card-content">
        <h3 className="build-card-title">
          {build.name}
        </h3>

        <p className="build-card-desc">
          {build.description}
        </p>

        <p className="build-card-specs">
          {build.cpu} • {build.gpu}
          <br />
          {build.ram} • {build.ssd}
        </p>

        <div className="build-card-price">
          від {formatPrice(build.price)}
        </div>

        <button
          type="button"
          className="build-card-button"
          onClick={() => onDetails(build)}
        >
          ДЕТАЛЬНІШЕ
        </button>
      </div>
    </article>
  );
}

export default function Builds() {
  const [activeBuild, setActiveBuild] = useState(null);

  useEffect(() => {
    if (!activeBuild) return;

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setActiveBuild(null);
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [activeBuild]);

  return (
    <section className="builds-section" id="builds">
      <div className="builds-container">
        <div className="builds-header">
          <h2 className="builds-title">
            ГОТОВІ ЗБІРКИ ПК
          </h2>

          <p className="builds-subtitle">
            Обирай готовий комп'ютер для ігор,
            роботи та будь-яких завдань.
          </p>
        </div>

        <div className="builds-grid">
          {builds.map((build) => (
            <BuildCard
              key={build.id}
              build={build}
              onDetails={setActiveBuild}
            />
          ))}
        </div>
      </div>

      {activeBuild && (
        <div
          className="build-modal-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setActiveBuild(null);
            }
          }}
        >
          <div
            className="build-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="build-modal-title"
          >
            <div className="build-modal-header">
              <h2 id="build-modal-title">
                {activeBuild.name}
              </h2>

              <button
                type="button"
                className="build-modal-close"
                onClick={() => setActiveBuild(null)}
                aria-label="Закрити"
                autoFocus
              >
                ✕
              </button>
            </div>

            <img
              className="build-modal-image"
              src={activeBuild.image}
              alt={activeBuild.name}
            />

            <p className="build-modal-description">
              {activeBuild.description}
            </p>

            <div className="build-modal-specs">
              <p>Процесор: {activeBuild.cpu}</p>
              <p>Відеокарта: {activeBuild.gpu}</p>
              <p>Оперативна пам'ять: {activeBuild.ram}</p>
              <p>Накопичувач: {activeBuild.ssd}</p>
            </div>

            <div className="build-modal-price">
              від {formatPrice(activeBuild.price)}
            </div>

            <p className="build-modal-note">
              Демонстраційна конфігурація.
              Остаточні характеристики та ціну
              потрібно уточнити.
            </p>

            <button
              type="button"
              className="build-modal-button"
              onClick={() => setActiveBuild(null)}
            >
              ЗАКРИТИ
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
