import { Link } from 'react-router-dom';

import ProductCard from '../components/PopularProducts/ProductCard';
import { useShop } from '../context/ShopContext';

import '../components/PopularProducts/PopularProducts.css';
import './FavoritesPage.css';

export default function FavoritesPage() {
  const {
    favoriteItems,
    isFavorite,
    isInCart,
    toggleFavorite,
    addToCart,
  } = useShop();

  return (
    <main className="favorites-page">
      <div className="favorites-heading">
        <div>
          <p className="favorites-breadcrumb">
            Головна / Обране
          </p>

          <h1>ОБРАНІ ТОВАРИ</h1>

          <p>
            Збережені комплектуючі, які тебе зацікавили.
          </p>
        </div>

        <span className="favorites-count">
          Товарів: {favoriteItems.length}
        </span>
      </div>

      {favoriteItems.length > 0 ? (
        <div className="favorites-grid">
          {favoriteItems.map((product) => (
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
        <div className="favorites-empty">
          <h2>ТУТ ПОКИ ЩО ПОРОЖНЬО</h2>

          <p>
            Додай товари в обране, щоб швидко знайти їх пізніше.
          </p>

          <Link
            to="/catalog"
            className="favorites-catalog-button"
          >
            ПЕРЕЙТИ ДО КАТАЛОГУ
          </Link>
        </div>
      )}
    </main>
  );
}