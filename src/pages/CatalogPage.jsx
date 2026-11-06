import ProductCard from "../components/PopularProducts/ProductCard";
import { useShop } from "../context/ShopContext";
import { useCatalogFilters } from "../hooks/useCatalogFilters";

import "../components/PopularProducts/PopularProducts.css";
import "./CatalogPage.css";

export default function CatalogPage() {
  const {
    products,
    productsLoading,
    productsError,
    cartCount,
    isFavorite,
    isInCart,
    toggleFavorite,
    addToCart,
  } = useShop();

  const {
    categories,
    category,
    search,
    setSearch,
    manufacturer,
    setManufacturer,
    sortBy,
    setSortBy,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    availability,
    setAvailability,
    manufacturers,
    filteredProducts,
    handleCategoryChange,
    resetFilters,
  } = useCatalogFilters(products);

  return (
    <main className="catalog-page">
      <div className="catalog-heading">
        <div>
          <p className="catalog-breadcrumb">Головна / Каталог</p>
          <h1>КАТАЛОГ КОМПЛЕКТУЮЧИХ</h1>
          <p className="catalog-description">
            Обирай комплектуючі для свого ідеального ПК.
          </p>
        </div>

        <div className="catalog-cart-count" role="status">
          У кошику: {cartCount}
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

        <button type="button" onClick={() => setSearch("")} disabled={!search}>
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
              {categories.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className={category === item.id ? "active" : ""}
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
                onChange={(event) => setMinPrice(event.target.value)}
                aria-label="Мінімальна ціна"
              />

              <input
                type="number"
                min="0"
                placeholder="До"
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
                aria-label="Максимальна ціна"
              />
            </div>
          </div>

          <div className="catalog-filter-group">
            <h3>Виробник</h3>

            <select
              value={manufacturer}
              onChange={(event) => setManufacturer(event.target.value)}
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
              onChange={(event) => setAvailability(event.target.value)}
            >
              <option value="all">Усі товари</option>
              <option value="in-stock">В наявності</option>
            </select>
          </div>
        </aside>

        <section className="catalog-results">
          <div className="catalog-toolbar">
            <p>
              Знайдено товарів: <strong>{filteredProducts.length}</strong>
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

          {productsLoading ? (
            <div className="catalog-empty">
              <h2>Завантаження товарів...</h2>
            </div>
          ) : productsError ? (
            <div className="catalog-empty">
              <h2>Не вдалося завантажити товари</h2>
              <p>{productsError}</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="catalog-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isFavorite={isFavorite(product.id)}
                  isInCart={isInCart(product.id)}
                  onToggleFavorite={toggleFavorite}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          ) : (
            <div className="catalog-empty">
              <h2>Товарів не знайдено</h2>
              <p>Спробуй змінити пошуковий запит або фільтри.</p>

              <button type="button" onClick={resetFilters}>
                Скинути фільтри
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
