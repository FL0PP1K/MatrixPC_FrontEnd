import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import ProductCard from '../components/PopularProducts/ProductCard';
import {
  catalogProducts,
  productCategories,
} from '../data/catalogProducts';

import '../components/PopularProducts/PopularProducts.css';
import './CatalogPage.css';

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryFromUrl = searchParams.get('category') || 'all';
  const searchFromUrl = searchParams.get('search') || '';

  const [category, setCategory] = useState(categoryFromUrl);
  const [search, setSearch] = useState(searchFromUrl);
  const [manufacturer, setManufacturer] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [availability, setAvailability] = useState('all');

  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);

  // Синхронізація фільтрів з адресою сторінки
  useEffect(() => {
    const validCategory = productCategories.some(
      (item) => item.id === categoryFromUrl
    );

    setCategory(validCategory ? categoryFromUrl : 'all');
    setSearch(searchFromUrl);
  }, [categoryFromUrl, searchFromUrl]);

  // Список виробників
  const manufacturers = useMemo(() => {
    const products = category === 'all'
      ? catalogProducts
      : catalogProducts.filter(
          (product) => product.category === category
        );

    return [...new Set(
      products.map((product) => product.manufacturer)
    )].sort();
  }, [category]);

  // Фільтрація та сортування товарів
  const filteredProducts = useMemo(() => {
    let result = [...catalogProducts];

    if (category !== 'all') {
      result = result.filter(
        (product) => product.category === category
      );
    }

    if (search.trim()) {
      const query = search.trim().toLowerCase();

      result = result.filter((product) =>
        `${product.name} ${product.specs} ${product.manufacturer}`
          .toLowerCase()
          .includes(query)
      );
    }

    if (manufacturer !== 'all') {
      result = result.filter(
        (product) => product.manufacturer === manufacturer
      );
    }

    if (minPrice !== '') {
      result = result.filter(
        (product) => product.price >= Number(minPrice)
      );
    }

    if (maxPrice !== '') {
      result = result.filter(
        (product) => product.price <= Number(maxPrice)
      );
    }

    if (availability === 'in-stock') {
      result = result.filter((product) => product.inStock);
    }

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;

      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;

      case 'name':
        result.sort((a, b) =>
          a.name.localeCompare(b.name, 'uk')
        );
        break;

      default:
        result.sort((a, b) => a.popularity - b.popularity);
    }

    return result;
  }, [
    category,
    search,
    manufacturer,
    minPrice,
    maxPrice,
    availability,
    sortBy,
  ]);

  const handleCategoryChange = (categoryId) => {
    setCategory(categoryId);

    setSearchParams((current) => {
      const next = new URLSearchParams(current);

      if (categoryId === 'all') {
        next.delete('category');
      } else {
        next.set('category', categoryId);
      }

      return next;
    });
  };

  const resetFilters = () => {
    setCategory('all');
    setSearch('');
    setManufacturer('all');
    setSortBy('popular');
    setMinPrice('');
    setMaxPrice('');
    setAvailability('all');
    setSearchParams({});
  };

  const toggleFavorite = (id) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const addToCart = (id) => {
    setCart((current) =>
      current.includes(id) ? current : [...current, id]
    );
  };

  return (
    <main className="catalog-page">
      <div className="catalog-heading">
        <div>
          <p className="catalog-breadcrumb">
            Головна / Каталог
          </p>

          <h1>КАТАЛОГ КОМПЛЕКТУЮЧИХ</h1>

          <p className="catalog-description">
            Обирай комплектуючі для свого ідеального ПК.
          </p>
        </div>

        <div className="catalog-cart-count" role="status">
          У кошику: {cart.length}
        </div>
      </div>

      <div className="catalog-search">
        <input
          type="search"
          placeholder="Пошук комплектуючих..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Пошук комплектуючих"
        />

        <button
          type="button"
          onClick={() => setSearch('')}
          disabled={!search}
        >
          Очистити
        </button>
      </div>

      <div className="catalog-layout">
        <aside className="catalog-sidebar">
          <div className="catalog-filter-heading">
            <h2>ФІЛЬТРИ</h2>

            <button type="button" onClick={resetFilters}>
              Скинути
            </button>
          </div>

          <div className="catalog-filter-group">
            <h3>Категорії</h3>

            <div className="catalog-category-list">
              {productCategories.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className={
                    category === item.id ? 'active' : ''
                  }
                  onClick={() => handleCategoryChange(item.id)}
                  aria-pressed={category === item.id}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          <div className="catalog-filter-group">
            <h3>Ціна, ₴</h3>

            <div className="catalog-price-inputs">
              <input
                type="number"
                min="0"
                placeholder="Від"
                value={minPrice}
                onChange={(event) =>
                  setMinPrice(event.target.value)
                }
                aria-label="Мінімальна ціна"
              />

              <input
                type="number"
                min="0"
                placeholder="До"
                value={maxPrice}
                onChange={(event) =>
                  setMaxPrice(event.target.value)
                }
                aria-label="Максимальна ціна"
              />
            </div>
          </div>

          <div className="catalog-filter-group">
            <h3>Виробник</h3>

            <select
              value={manufacturer}
              onChange={(event) =>
                setManufacturer(event.target.value)
              }
            >
              <option value="all">Усі виробники</option>

              {manufacturers.map((name) => (
                <option value={name} key={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="catalog-filter-group">
            <h3>Наявність</h3>

            <select
              value={availability}
              onChange={(event) =>
                setAvailability(event.target.value)
              }
            >
              <option value="all">Усі товари</option>
              <option value="in-stock">В наявності</option>
            </select>
          </div>
        </aside>

        <section className="catalog-results">
          <div className="catalog-toolbar">
            <p>
              Знайдено товарів:{' '}
              <strong>{filteredProducts.length}</strong>
            </p>

            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              aria-label="Сортування товарів"
            >
              <option value="popular">За популярністю</option>
              <option value="price-asc">Спочатку дешевші</option>
              <option value="price-desc">Спочатку дорожчі</option>
              <option value="name">За назвою</option>
            </select>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="catalog-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isFavorite={favorites.includes(product.id)}
                  isInCart={cart.includes(product.id)}
                  onToggleFavorite={toggleFavorite}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          ) : (
            <div className="catalog-empty">
              <h2>Товарів не знайдено</h2>

              <p>
                Спробуй змінити пошуковий запит або фільтри.
              </p>

              <button type="button" onClick={resetFilters}>
                Скинути фільтри
              </button>
            </div>
          )}

          <p className="catalog-demo-note">
            Демонстраційні товари. Каталог буде підключено до бази даних.
          </p>
        </section>
      </div>
    </main>
  );
}
