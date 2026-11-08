
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';

import './Header.css';

const navigation = [
  { label: 'Головна', section: 'home' },
  { label: 'Комплектуючі', section: 'components' },
  { label: 'Конфігуратор', section: 'assembly' },
  { label: 'Збірки ПК', section: 'builds' },
  { label: 'Про нас', section: 'why-us' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const [activeSection, setActiveSection] = useState(
    window.location.pathname === '/'
      ? window.location.hash || '#home'
      : ''
  );

  const navigate = useNavigate();
  const location = useLocation();

  const { cartCount = 0, favoriteItems = [] } = useShop();

  const closeMenu = () => setMenuOpen(false);

  // Відстеження активної секції
  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection('');
      return;
    }

    const updateActiveSection = () => {
      const sections = navigation
        .map(link => document.getElementById(link.section))
        .filter(Boolean);

      let currentSection = '#home';

      sections.forEach(section => {
        if (section.getBoundingClientRect().top <= 150) {
          currentSection = `#${section.id}`;
        }
      });

      setActiveSection(currentSection);
    };

    updateActiveSection();

    window.addEventListener('scroll', updateActiveSection, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', updateActiveSection);
    };
  }, [location.pathname]);

  // Перехід до секцій головної сторінки
  const handleSectionClick = (event, section) => {
    event.preventDefault();
    closeMenu();

    const targetHash = `#${section}`;

    if (
      location.pathname === '/' &&
      location.hash === targetHash
    ) {
      document.getElementById(section)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      return;
    }

    navigate(`/${targetHash}`);
  };

  // Пошук товарів
  const handleSearch = (event) => {
    event.preventDefault();

    const query = searchValue.trim();

    if (!query) return;

    navigate(`/catalog?search=${encodeURIComponent(query)}`);

    setSearchOpen(false);
    setSearchValue('');
    closeMenu();
  };

  return (
    <header className="header">
      <div className="header-container">

        {/* Логотип */}
        <Link to="/" className="logo" onClick={closeMenu}>
          <span className="logo-white">MATRIX</span>
          <span className="logo-green">PC</span>
        </Link>

        {/* Навігація */}
        <nav
          id="main-navigation"
          className={`nav-menu ${menuOpen ? 'is-open' : ''}`}
          aria-label="Головна навігація"
        >
          {navigation.map(link => (
            <a
              key={link.section}
              href={`/#${link.section}`}
              className={`nav-link ${
                activeSection === `#${link.section}` ? 'active' : ''
              }`}
              onClick={(event) =>
                handleSectionClick(event, link.section)
              }
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Кнопки та дії */}
        <div className="header-actions">

          {/* Пошук */}
          <button
            type="button"
            className="header-icon-btn"
            aria-label="Пошук товарів"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m16 16 5 5" />
            </svg>
          </button>

          {/* Особистий кабінет */}
          <Link
            to="/account"
            className="header-icon-btn profile-action"
            aria-label="Особистий кабінет"
            onClick={closeMenu}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
            </svg>
          </Link>

          {/* Обране */}
          <Link
            to="/favorites"
            className="header-icon-btn favorite-action"
            aria-label={`Обране, товарів: ${favoriteItems.length}`}
            title="Перейти до обраного"
            onClick={closeMenu}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
            </svg>

            {favoriteItems.length > 0 && (
              <span className="header-favorites-count">
                {favoriteItems.length}
              </span>
            )}
          </Link>

          {/* Кошик */}
          <Link
            to="/cart"
            className="header-icon-btn cart-action"
            aria-label={`Кошик, товарів: ${cartCount}`}
            title="Перейти до кошика"
            onClick={closeMenu}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 4h2l2 12h12l2-9H6" />
              <circle cx="9" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
            </svg>

            {cartCount > 0 && (
              <span className="header-cart-count">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>

          {/* Зібрати ПК */}
          <a
            href="/#assembly"
            className="header-build-btn"
            onClick={(event) =>
              handleSectionClick(event, 'assembly')
            }
          >
            ЗІБРАТИ ПК
          </a>

          {/* Мобільне меню */}
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

      {/* Панель пошуку */}
      {searchOpen && (
        <form
          className="header-search-panel"
          onSubmit={handleSearch}
        >
          <input
            type="search"
            aria-label="Пошук товарів"
            placeholder="Введіть назву товару..."
            autoFocus
            value={searchValue}
            onChange={(event) =>
              setSearchValue(event.target.value)
            }
          />

          <button type="submit">
            Знайти
          </button>

          <button
            type="button"
            onClick={() => setSearchOpen(false)}
            aria-label="Закрити пошук"
          >
            ✕
          </button>
        </form>
      )}
    </header>
  );
}
