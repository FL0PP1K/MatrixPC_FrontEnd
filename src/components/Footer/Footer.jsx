Simport './Footer.css';

const navigation = [
  { name: 'Головна', href: '#home' },
  { name: 'Комплектуючі', href: '#components' },
  { name: 'Популярні товари', href: '#popular' },
  { name: 'Готові збірки', href: '#builds' },
  { name: 'Конфігуратор ПК', href: '#assembly' },
];

const information = [
  'Про нас',
  'Доставка та оплата',
  'Гарантія',
  'Повернення товару',
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">

          <div className="footer-brand">
            <a href="#home" className="footer-logo">
              <span>MATRIX</span>
              <span className="footer-logo-green">PC</span>
            </a>

            <p>Твій ПК. Твої правила.</p>
          </div>

          <nav className="footer-column" aria-label="Навігація футера">
            <h3>НАВІГАЦІЯ</h3>

            {navigation.map((link) => (
              <a key={link.href} href={link.href}>
                {link.name}
              </a>
            ))}
          </nav>

          <div className="footer-column">
            <h3>ІНФОРМАЦІЯ</h3>

            {information.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>

          <div className="footer-column">
            <h3>КОНТАКТИ</h3>
            <p>
              Контактні дані та посилання на соцмережі
              додамо перед запуском магазину.
            </p>
          </div>

        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} MATRIXPC. Всі права захищені.</p>

          <a href="#home">
            Повернутися нагору ↑
          </a>
        </div>
      </div>
    </footer>
  );
}