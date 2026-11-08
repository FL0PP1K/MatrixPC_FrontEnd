
import { useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from 'react-router-dom';

import { ShopProvider } from './context/ShopContext';
import { useAuth } from './context/AuthContext';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductPage from './pages/ProductPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AccountPage from './pages/AccountPage';
import CartPage from './pages/CartPage';
import FavoritesPage from './pages/FavoritesPage';

import './App.css';

// Прокручування до потрібної секції сторінки
function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash || pathname === '/cart') return;

    const element = document.getElementById(
      decodeURIComponent(hash.slice(1))
    );

    if (element) {
      requestAnimationFrame(() => {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      });
    }
  }, [pathname, hash]);

  return null;
}

// Захищений маршрут
function ProtectedRoute({ children }) {
  const { isAuthenticated, authLoading } = useAuth();

  if (authLoading) {
    return (
      <main className="page-content">
        <h1>Перевірка авторизації...</h1>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Сторінка 404
function NotFoundPage() {
  return (
    <main className="page-content">
      <h1>404 — Сторінку не знайдено</h1>
      <p>На жаль, такої сторінки не існує.</p>
      <Link to="/">Повернутися на головну</Link>
    </main>
  );
}

// Головний компонент застосунку
export default function App() {
  return (
    <ShopProvider>
      <BrowserRouter>
        <ScrollToHash />

        <Header />

        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/catalog" element={<CatalogPage />} />

          <Route path="/product/:id" element={<ProductPage />} />

          <Route path="/login" element={<LoginPage />} />

          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            }
          />

          <Route path="/cart" element={<CartPage />} />

          <Route path="/favorites" element={<FavoritesPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </ShopProvider>
  );
}
