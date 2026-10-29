import { useState } from 'react';
import ProductCard from './ProductCard';
import './PopularProducts.css';

const products = [
  {
    id: 'gpu-5070',
    name: 'MSI GeForce RTX 5070 12GB',
    specs: '12 GB GDDR7 • PCIe 5.0',
    price: 47999,
    image: '/image/Vidiokarta 1.png',
  },
  {
    id: 'cpu-9700x',
    name: 'AMD Ryzen 7 9700X',
    specs: '8 ядер • 16 потоків',
    price: 14499,
    image: '/image/Procesor (pop.item) 1.png',
  },
  {
    id: 'ram-kingston',
    name: 'Kingston Fury 32GB DDR5',
    specs: '32 GB • DDR5 • 6000 MHz',
    price: 24999,
    image: '/image/Kingston RAM 1.png',
  },
  {
    id: 'ssd-990pro',
    name: 'Samsung 990 PRO 1TB',
    specs: '1 TB • NVMe • PCIe 4.0',
    price: 11499,
    image: '/image/Samsung 990  PRO 1 TB 1.png',
  },
];

export default function PopularProducts() {
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);

  const toggleFavorite = (id) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const addToCart = (id) => {
    setCart((current) =>
      current.includes(id)
        ? current
        : [...current, id]
    );
  };

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
            Товарів у кошику: {cart.length}
          </p>
        </div>

        <div className="popular-grid">
          {products.map((product) => (
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
      </div>
    </section>
  );
}
