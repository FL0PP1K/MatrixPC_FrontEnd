import ProductCard from './ProductCard';
import { useShop } from '../../context/ShopContext';
import './PopularProducts.css';

export default function PopularProducts() {
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

  // Показуємо перші 4 товари з API
  const popularProducts = products.slice(0, 4);

  return (
    <section className="popular-section" id="popular">
      <div className="popular-container">
        <div className="section-header">
          <h2 className="section-title">
            ПОПУЛЯРНІ ТОВАРИ
          </h2>

          <p className="section-subtitle">
            Комплектуючі, які найчастіше обирають
            наші клієнти.
          </p>

          <p className="popular-cart-count" role="status">
            Товарів у кошику: {cartCount}
          </p>
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
        ) : popularProducts.length > 0 ? (
          <div className="popular-grid">
            {popularProducts.map((product) => (
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
            <h2>Поки що немає товарів</h2>
          </div>
        )}
      </div>
    </section>
  );
}