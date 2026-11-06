import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';

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

function NotFoundPage() {
  return (
    <main className="page-content">
      <h1>404 — Сторінку не знайдено</h1>
      <p>На жаль, такої сторінки не існує.</p>
      <Link to="/">Повернутися на головну</Link>
    </main>
  );
}

export default function App() {
  return (
  <ShopProvider>
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
      </Routes>

      <Footer />
    </BrowserRouter>
    </ShopProvider>
  );
}