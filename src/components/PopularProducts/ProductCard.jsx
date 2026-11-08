import { Link } from 'react-router-dom';

export default function ProductCard({
  product,
  isFavorite,
  isInCart,
  onToggleFavorite,
  onAddToCart,
}) {
  return (
    <article className="product-card">
      <div className="product-image">
        <Link
          to={`/product/${product.id}`}
          className="product-image-link"
          aria-label={`Переглянути ${product.name}`}
        >
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
          />
        </Link>

        <button
          type="button"
          className={`favorite-btn ${
            isFavorite ? 'is-favorite' : ''
          }`}
          onClick={() => onToggleFavorite(product.id)}
          aria-label={
            isFavorite
              ? `Прибрати ${product.name} з обраного`
              : `Додати ${product.name} в обране`
          }
          aria-pressed={isFavorite}
        >
          {isFavorite ? '♥' : '♡'}
        </button>
      </div>

      <h3 className="product-name">
        <Link to={`/product/${product.id}`}>
          {product.name}
        </Link>
      </h3>

      <p className="product-specs">
        {product.specs}
      </p>

      <p className="product-stock">
        {product.inStock === false
          ? 'Немає в наявності'
          : 'В наявності'}
      </p>

      <Link
        to={`/product/${product.id}`}
        className="product-details-link"
      >
        ДЕТАЛЬНІШЕ →
      </Link>

      <div className="product-price">
        {product.price.toLocaleString('uk-UA')} ₴
      </div>

      <button
        type="button"
        className={`cart-btn ${isInCart ? 'in-cart' : ''}`}
        onClick={() => onAddToCart(product.id)}
        disabled={product.inStock === false || isInCart}
      >
        {product.inStock === false
          ? 'НЕМАЄ В НАЯВНОСТІ'
          : isInCart
            ? '✓ У КОШИКУ'
            : 'ДО КОШИКА'}
      </button>
    </article>
  );
}