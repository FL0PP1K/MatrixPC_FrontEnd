import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { catalogProducts } from '../data/catalogProducts';
import { getProducts } from '../services/productApi';

const ShopContext = createContext(null);

const CART_STORAGE_KEY = 'matrixpc-cart';
const FAVORITES_STORAGE_KEY = 'matrixpc-favorites';

function readStorage(key) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
}

export function ShopProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState('');

  const [cart, setCart] = useState(() => {
    const saved = readStorage(CART_STORAGE_KEY);

    return Array.isArray(saved)
      ? saved.filter(
          (item) =>
            item &&
            typeof item.productId === 'string' &&
            Number.isInteger(item.quantity) &&
            item.quantity > 0
        )
      : [];
  });

  const [favorites, setFavorites] = useState(() => {
    const saved = readStorage(FAVORITES_STORAGE_KEY);
    return Array.isArray(saved) ? saved : [];
  });

  // Завантаження товарів із Backend
  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        setProductsLoading(true);
        setProductsError('');

        const data = await getProducts();

        if (isMounted) {
          setProducts(data);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Products loading error:', error);
          setProductsError(error.message);
        }
      } finally {
        if (isMounted) {
          setProductsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  // Тимчасова сумісність зі старими демонстраційними товарами
  const availableProducts = useMemo(() => {
    const apiIds = new Set(products.map((product) => product.id));

    const fallbackProducts = catalogProducts.filter(
      (product) => !apiIds.has(product.id)
    );

    return [...products, ...fallbackProducts];
  }, [products]);

  // Зберігаємо кошик
  useEffect(() => {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(cart)
    );
  }, [cart]);

  // Зберігаємо обране
  useEffect(() => {
    localStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify(favorites)
    );
  }, [favorites]);

  // Додавання товару в кошик
  const addToCart = (productId) => {
    const product = availableProducts.find(
      (item) => item.id === productId
    );

    if (!product || !product.inStock) return;

    setCart((current) => {
      const existing = current.find(
        (item) => item.productId === productId
      );

      if (existing) {
        return current.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...current,
        { productId, quantity: 1 },
      ];
    });
  };

  // Видалення товару з кошика
  const removeFromCart = (productId) => {
    setCart((current) =>
      current.filter(
        (item) => item.productId !== productId
      )
    );
  };

  // Зміна кількості товару
  const updateQuantity = (productId, quantity) => {
    const newQuantity = Math.floor(Number(quantity));

    if (!Number.isFinite(newQuantity) || newQuantity < 1) {
      return;
    }

    setCart((current) =>
      current.map((item) =>
        item.productId === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Очищення кошика
  const clearCart = () => {
    setCart([]);
  };

  // Додавання та видалення з обраного
  const toggleFavorite = (productId) => {
    setFavorites((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId]
    );
  };

  // Товари кошика з актуальними даними
  const cartItems = useMemo(() => {
    return cart
      .map((item) => {
        const product = availableProducts.find(
          (product) => product.id === item.productId
        );

        return product
          ? { ...product, quantity: item.quantity }
          : null;
      })
      .filter(Boolean);
  }, [cart, availableProducts]);

  // Товари обраного
  const favoriteItems = useMemo(() => {
    return availableProducts.filter((product) =>
      favorites.includes(product.id)
    );
  }, [favorites, availableProducts]);

  // Загальна кількість товарів
  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Загальна сума
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const value = {
    products,
    productsLoading,
    productsError,

    cart,
    cartItems,
    cartCount,
    cartTotal,
    favorites,
    favoriteItems,

    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleFavorite,

    isFavorite: (id) => favorites.includes(id),

    isInCart: (id) =>
      cart.some((item) => item.productId === id),
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);

  if (!context) {
    throw new Error(
      'useShop must be used inside ShopProvider'
    );
  }

  return context;
}
