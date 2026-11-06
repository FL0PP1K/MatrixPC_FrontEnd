
import { Link, useParams } from 'react-router-dom';

import ProductCard from '../components/PopularProducts/ProductCard';

import { productCategories } from '../data/catalogProducts';

import { useShop } from '../context/ShopContext';

import '../components/PopularProducts/PopularProducts.css';
import './ProductPage.css';

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

  // Знаходимо товар серед товарів, отриманих з API
  const product = products.find(
    (item) => item.id === id
  );

  // Визначаємо категорію товару
  const category = product
    ? productCategories.find(
        (item) => item.id === product.category
      )
    : null;

  // Стан завантаження
  if (productsLoading) {
    return (
      <main className="product-not-found">
        <h1>Завантаження товару...</h1>
      </main>
    );
  }

  // Помилка завантаження
  if (productsError) {
    return (
      <main className="product-not-found">
        <h1>Не вдалося завантажити товар</h1>
        <p>{productsError}</p>
        <Link to="/catalog">Повернутися до каталогу</Link>
      </main>
    );
  }

  // Якщо товар не знайдено
  if (!product) {
    return (
      <main className="product-not-found">
        <h1>Товар не знайдено</h1>
        <p>
          Можливо, товар був видалений або посилання неправильне.
        </p>
        <Link to="/catalog">Повернутися до каталогу</Link>
      </main>
    );
  }

  const favorite = isFavorite(product.id);
  const inCart = isInCart(product.id);

  // Знаходимо товари тієї самої категорії
  const sameCategoryProducts = products.filter(
    (item) =>
      item.category === product.category &&
      item.id !== product.id
  );

  // Якщо товарів тієї самої категорії немає,
  // показуємо інші доступні товари
  const relatedProducts = (
    sameCategoryProducts.length > 0
      ? sameCategoryProducts
      : products.filter(
          (item) => item.id !== product.id
        )
  ).slice(0, 4);

  return (
    <main className="product-page">

      <div className="product-breadcrumbs">
        <Link to="/">Головна</Link>
        <span>/</span>
        <Link to={`/catalog?category=${product.category}`}>
          {category?.name || 'Каталог'}
        </Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      <section className="product-details">

        <div className="product-gallery">
          <div className="product-main-image">
            <img
              src={product.image}
              alt={product.name}
            />
          </div>
        </div>

        <div className="product-information">

          <span className="product-category-label">
            {category?.name || 'Комплектуючі'}
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
              {product.price.toLocaleString('uk-UA')} ₴
            </div>

            <p
              className={
                product.inStock
                  ? 'product-availability available'
                  : 'product-availability unavailable'
              }
            >
              {product.inStock
                ? '✓ В наявності'
                : 'Немає в наявності'}
            </p>

            <button
              type="button"
              className="product-buy-button"
              disabled={!product.inStock || inCart}
              onClick={() => addToCart(product.id)}
            >
              {inCart
                ? '✓ ДОДАНО ДО КОШИКА'
                : 'ДОДАТИ ДО КОШИКА'}
            </button>

            <button
              type="button"
              className={`product-favorite-button ${
                favorite ? 'active' : ''
              }`}
              onClick={() => toggleFavorite(product.id)}
            >
              {favorite
                ? '♥ В ОБРАНОМУ'
                : '♡ ДОДАТИ В ОБРАНЕ'}
            </button>

          </div>

          <div className="product-delivery">
            <h3>Інформація про товар</h3>

            <div>
              <span>Код товару</span>
              <strong>{product.sku || product.id}</strong>
            </div>

            <div>
              <span>Категорія</span>
              <strong>{category?.name || 'Комплектуючі'}</strong>
            </div>

            <div>
              <span>Виробник</span>
              <strong>{product.manufacturer}</strong>
            </div>
          </div>

        </div>
      </section>

      <section className="product-description">
        <h2>Характеристики товару</h2>

        <div className="product-specification-row">
          <span>Назва</span>
          <strong>{product.name}</strong>
        </div>

        <div className="product-specification-row">
          <span>Виробник</span>
          <strong>{product.manufacturer}</strong>
        </div>

        <div className="product-specification-row">
          <span>Основні характеристики</span>
          <strong>{product.specs}</strong>
        </div>

        <div className="product-specification-row">
          <span>Наявність</span>
          <strong>
            {product.inStock ? 'В наявності' : 'Немає в наявності'}
          </strong>
        </div>
      </section>

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

    </main>
  );
}