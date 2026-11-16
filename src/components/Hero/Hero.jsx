import './Hero.css';

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-container">
        
        <div className="hero-content">
          <p className="hero-subtitle">
            MATRIXPC — GAMING COMPUTERS
          </p>

          <h1 className="hero-title">
            ЗБЕРИ ПК БЕЗ
            <br />
            КОМПРОМІСІВ
          </h1>

          <p className="hero-description">
            Комплектуючі для ігор, роботи й навчання.
            <br />
            Допоможемо підібрати оптимальну конфігурацію
            під твій бюджет.
          </p>

          <div className="hero-buttons">
            <a href="#assembly" className="hero-btn-primary">
              ЗІБРАТИ ПК
            </a>

            <a href="#components" className="hero-btn-secondary">
              КАТАЛОГ
            </a>
          </div>
        </div>

        <div className="hero-visuals">
          <img
            src="/image/PC_ULTRA.png"
            alt="Персональний комп’ютер MATRIXPC"
            className="hero-image"
          />

          <div className="spec-card">
            <div className="spec-header">
              <span className="status-dot"></span>
              ПІДБІР КОНФІГУРАЦІЇ
            </div>

            <div className="spec-title">
              Комплектуючі з каталогу
            </div>

            <div className="spec-details">
              Під твої задачі та бюджет
            </div>

            <div className="spec-price">
              Ціна залежить від обраних товарів
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}