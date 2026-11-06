import { Link, useParams } from "react-router-dom";
import ProductCard from "../components/PopularProducts/ProductCard";
import { productCategories } from "../data/catalogProducts";
import { useShop } from "../context/ShopContext";

import "../components/PopularProducts/PopularProducts.css";
import "./ProductPage.css";

// Компонент для відображення рядка характеристик, щоб уникнути дублювання
const SpecRow = ({ label, value }) => (
  <div className="product-specification-row">
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);

export default function ProductPage() {
  const { id } = useParams();
  const {
    products,
    productsLoading,
    productsError,
    isFavorite,
    isInCart,
    toggleFavorite,
    addToCart,
  } = useShop();

  if (productsLoading) {
    return (
      <main className="product-not-found">
        <h1>Завантаження товару...</h1>
      </main>
    );
  }

  if (productsError) {
    return (
      <main className="product-not-found">
        <h1>Не вдалося завантажити товар</h1>
        <p>{productsError}</p>
        <Link to="/catalog">Повернутися до каталогу</Link>
      </main>
    );
  }

  const product = products.find((item) => item.id === id);

  if (!product) {
    return (
      <main className="product-not-found">
        <h1>Товар не знайдено</h1>
        <p>Можливо, товар був видалений або посилання неправильне.</p>
        <Link to="/catalog">Повернутися до каталогу</Link>
      </main>
    );
  }

  const category = productCategories.find(
    (item) => item.id === product.category,
  );
  const favorite = isFavorite(product.id);
  const inCart = isInCart(product.id);

  // Оптимізований пошук схожих товарів: спочатку тієї ж категорії, якщо не вистачає - беремо інші
  const relatedProducts = products
    .filter((item) => item.id !== product.id)
    .sort((a, b) => {
      if (a.category === product.category && b.category !== product.category)
        return -1;
      if (a.category !== product.category && b.category === product.category)
        return 1;
      return 0;
    })
    .slice(0, 4);

  return (
    <main className="product-page">
      <div className="product-breadcrumbs">
        <Link to="/">Головна</Link>
        <span>/</span>
        <Link to={`/catalog?category=${product.category}`}>
          {category?.name || "Каталог"}
        </Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      <section className="product-details">
        <div className="product-gallery">
          <div className="product-main-image">
            <img src={product.image} alt={product.name} />
          </div>
        </div>

        <div className="product-information">
          <span className="product-category-label">
            {category?.name || "Комплектуючі"}
          </span>

          <h1>{product.name}</h1>

          <p className="product-manufacturer">
            Виробник: <strong>{product.manufacturer}</strong>
          </p>

          <div className="product-detail-divider" />

          <div className="product-detail-specs">
            <h2>Основні характеристики</h2>
            <p>{product.specs}</p>
          </div>

          <div className="product-detail-divider" />

          <div className="product-purchase">
            <div className="product-detail-price">
              {product.price.toLocaleString("uk-UA")} ₴
            </div>

            <p
              className={`product-availability ${product.inStock ? "available" : "unavailable"}`}
            >
              {product.inStock ? "✓ В наявності" : "Немає в наявності"}
            </p>

            <button
              type="button"
              className="product-buy-button"
              disabled={!product.inStock || inCart}
              onClick={() => addToCart(product.id)}
            >
              {inCart ? "✓ ДОДАНО ДО КОШИКА" : "ДОДАТИ ДО КОШИКА"}
            </button>

            <button
              type="button"
              className={`product-favorite-button ${favorite ? "active" : ""}`}
              onClick={() => toggleFavorite(product.id)}
            >
              {favorite ? "♥ В ОБРАНОМУ" : "♡ ДОДАТИ В ОБРАНЕ"}
            </button>
          </div>

          <div className="product-delivery">
            <h3>Інформація про товар</h3>
            <SpecRow label="Код товару" value={product.sku || product.id} />
            <SpecRow
              label="Категорія"
              value={category?.name || "Комплектуючі"}
            />
            <SpecRow label="Виробник" value={product.manufacturer} />
          </div>
        </div>
      </section>

      <section className="product-description">
        <h2>Характеристики товару</h2>
        <SpecRow label="Назва" value={product.name} />
        <SpecRow label="Виробник" value={product.manufacturer} />
        <SpecRow label="Основні характеристики" value={product.specs} />
        <SpecRow
          label="Наявність"
          value={product.inStock ? "В наявності" : "Немає в наявності"}
        />
      </section>

      {relatedProducts.length > 0 && (
        <section className="related-products">
          <div className="related-products-heading">
            <h2>СХОЖІ ТОВАРИ</h2>
            <Link to="/catalog">Усі товари →</Link>
          </div>

          <div className="related-products-grid">
            {relatedProducts.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                isFavorite={isFavorite(item.id)}
                isInCart={isInCart(item.id)}
                onToggleFavorite={toggleFavorite}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
