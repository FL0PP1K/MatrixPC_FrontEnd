import './Footer.css';
import { Link } from 'react-router-dom';

const navigation = [
  { name: 'Головна', href: '/#home' },
  { name: 'Комплектуючі', href: '/#components' },
  { name: 'Готові збірки', href: '/#builds' },
  { name: 'Конфігуратор ПК', href: '/#assembly' },
];

const information = [
  { name: 'Про нас', href: '/about' },
  { name: 'Доставка та оплата', href: '/delivery' },
  { name: 'Гарантія та повернення', href: '/warranty' },
  { name: 'Контакти', href: '/contacts' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">

          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span>MATRIX</span>
              <span className="footer-logo-green">PC</span>
            </Link>

            <p>Твій ПК. Твої правила.</p>
          </div>

          <nav className="footer-column" aria-label="Навігація футера">
            <h3>НАВІГАЦІЯ</h3>

            {navigation.map((link) => (
              <Link key={link.href} to={link.href}>
                {link.name}
              </Link>
            ))}
          </nav>

          <nav className="footer-column" aria-label="Інформація">
            <h3>ІНФОРМАЦІЯ</h3>

            {information.map((item) => (
              <Link key={item.href} to={item.href}>
                {item.name}
              </Link>
            ))}
          </nav>

          <nav className="footer-column" aria-label="Контакти">
            <h3>КОНТАКТИ</h3>
            <Link to="/contacts#contact-form">Email</Link>
            <Link to="/contacts#socials">Telegram</Link>
            <Link to="/contacts#socials">Instagram</Link>
          </nav>

        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} MATRIXPC. Всі права захищені.</p>

          <div className="footer-social" aria-label="Соціальні мережі">
            <Link to="/contacts#socials" aria-label="Instagram MATRIXPC">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" />
              </svg>
            </Link>
            <Link to="/contacts#socials" aria-label="Telegram MATRIXPC">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m21 3-7.2 18-3.7-7.1L3 10.2 21 3Z" />
                <path d="m10.1 13.9 4.8-4.8" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

