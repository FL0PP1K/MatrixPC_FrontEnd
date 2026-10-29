import { useState } from 'react';
import './Header.css';
const navigation = [
  { label: 'Головна', href: '#home' },
  { label: 'Комплектуючі', href: '#components' },
  { label: 'Конфігуратор', href: '#assembly' },
  { label: 'Збірки ПК', href: '#builds' },
  { label: 'Про нас', href: '#why-us' },
];
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-container">
        <a href="#home" className="logo">
          <span className="logo-white">MATRIX</span>
          <span className="logo-green">PC</span>
        </a>

        <nav
          id="main-navigation"
          className={`nav-menu ${menuOpen ? 'is-open' : ''}`}
          aria-label="Головна навігація"
        >
          {navigation.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              className={`nav-link ${index === 0 ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="header-icon-btn"
            aria-label="Пошук товарів"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <svg viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m16 16 5 5" />
            </svg>
          </button>

          <button
            type="button"
            className="header-icon-btn profile-action"
            aria-label="Особистий кабінет"
            title="Підключимо на наступному етапі"
          >
            <svg viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
            </svg>
          </button>

          <button
            type="button"
            className="header-icon-btn"
            aria-label="Кошик"
            title="Підключимо на наступному етапі"
          >
            <svg viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <path d="M3 4h2l2 12h12l2-9H6" />
              <circle cx="9" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
            </svg>
          </button>

          <a href="#assembly" className="header-build-btn">
            ЗІБРАТИ ПК
          </a>

          <button
            type="button"
            className="mobile-menu-btn"
            aria-label="Відкрити меню"
            aria-controls="main-navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="header-search-panel">
          <input
            type="search"
            aria-label="Пошук товарів"
            placeholder="Пошук товарів..."
            autoFocus
          />
          <button
            type="button"
            onClick={() => setSearchOpen(false)}
            aria-label="Закрити пошук"
          >
            ✕
          </button>
        </div>
      )}
    </header>
  );
}