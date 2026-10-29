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
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
        />

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
        {product.name}
      </h3>

      <p className="product-specs">
        {product.specs}
      </p>

      <p className="product-stock">
        В наявності
      </p>

      <div className="product-price">
        {product.price.toLocaleString('uk-UA')} ₴
      </div>

      <button
        type="button"
        className={`cart-btn ${isInCart ? 'in-cart' : ''}`}
        onClick={() => onAddToCart(product.id)}
      >
        {isInCart ? '✓ У КОШИКУ' : 'ДО КОШИКА'}
      </button>
    </article>
  );
}
