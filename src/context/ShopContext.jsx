import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

import { getProducts } from "../services/productApi";

const ShopContext = createContext(null);

const CART_STORAGE_KEY = "matrixpc-cart";
const FAVORITES_STORAGE_KEY = "matrixpc-favorites";

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
  const [productsError, setProductsError] = useState("");

  const [cart, setCart] = useState(() => {
    const saved = readStorage(CART_STORAGE_KEY);
    return Array.isArray(saved)
      ? saved.filter(
          (item) =>
            item &&
            typeof item.productId === "string" &&
            Number.isInteger(item.quantity) &&
            item.quantity > 0,
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
        setProductsError("");
        const data = await getProducts();
        if (isMounted) {
          setProducts(data);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Products loading error:", error);
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

  // Поєднання товарів із бд та тимчасових локальних товарів
  const availableProducts = products;

  // Збереження кошика у localStorage
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  // Збереження обраного у localStorage
  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  // Додавання товару в кошик
  const addToCart = useCallback(
    (productId) => {
      const product = availableProducts.find((item) => item.id === productId);
      if (!product || !product.inStock) return;

      setCart((current) => {
        const existing = current.find((item) => item.productId === productId);
        if (existing) {
          return current.map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          );
        }
        return [...current, { productId, quantity: 1 }];
      });
    },
    [availableProducts],
  );

  // Видалення товару з кошика
  const removeFromCart = useCallback((productId) => {
    setCart((current) =>
      current.filter((item) => item.productId !== productId),
    );
  }, []);

  // Зміна кількості товару
  const updateQuantity = useCallback((productId, quantity) => {
    const newQuantity = Math.floor(Number(quantity));
    if (!Number.isFinite(newQuantity) || newQuantity < 1) return;

    setCart((current) =>
      current.map((item) =>
        item.productId === productId
          ? { ...item, quantity: newQuantity }
          : item,
      ),
    );
  }, []);

  // Очищення кошика
  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Перемикання стану обраного
  const toggleFavorite = useCallback((productId) => {
    setFavorites((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    );
  }, []);

  // Перевірки наявності у списку
  const isFavorite = useCallback((id) => favorites.includes(id), [favorites]);

  const isInCart = useCallback(
    (id) => cart.some((item) => item.productId === id),
    [cart],
  );

  // Товари кошика з актуальними даними
  const cartItems = useMemo(() => {
    return cart
      .map((item) => {
        const product = availableProducts.find((p) => p.id === item.productId);
        return product ? { ...product, quantity: item.quantity } : null;
      })
      .filter(Boolean);
  }, [cart, availableProducts]);

  // Товари обраного
  const favoriteItems = useMemo(() => {
    return availableProducts.filter((product) =>
      favorites.includes(product.id),
    );
  }, [favorites, availableProducts]);

  // Загальна кількість товарів у кошику
  const cartCount = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart],
  );

  // Загальна сума кошика
  const cartTotal = useMemo(
    () =>
      cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems],
  );

  const value = useMemo(
    () => ({
      products: availableProducts,
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
      isFavorite,
      isInCart,
    }),
    [
      availableProducts,
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
      isFavorite,
      isInCart,
    ],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used inside ShopProvider");
  }
  return context;
}
