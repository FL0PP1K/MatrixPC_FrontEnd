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
            Комплектуючі та готові ПК для ігор, роботи й навчання.
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
            alt="Ігровий комп'ютер MATRIX ULTRA"
            className="hero-image"
          />

          <div className="spec-card">
            <div className="spec-header">
              <span className="status-dot"></span>
              MATRIX ULTRA
            </div>

            <div className="spec-title">
              RTX 5090 • Ryzen 9
            </div>

            <div className="spec-details">
              64 GB RAM • 2 TB SSD
            </div>

            <div className="spec-price">
              від 129 999 ₴
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}