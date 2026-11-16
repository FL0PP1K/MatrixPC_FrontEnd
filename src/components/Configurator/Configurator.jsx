import { useEffect, useState } from 'react';
import {
  categories,
  formatPrice,
} from './configuratorData';

import './Configurator.css';
import { checkCompatibility } from './compatibility';
import { useShop } from '../../context/ShopContext';
export default function Configurator() {
  const { products, productsLoading, productsError, addToCart: addCatalogProduct } = useShop();
  const categorySlugs = {
    gpu: ['graphics-cards', 'gpu'],
    cpu: ['processors', 'cpu'],
    motherboard: ['motherboards', 'motherboard'],
    cooler: ['cooling', 'coolers', 'cooler'],
    case: ['cases', 'case'],
    ram: ['ram'],
    ssd: ['ssd', 'storage'],
    psu: ['power-supplies', 'power-supply', 'psu'],
    fans: ['fans', 'fan'],
  };
  const options = Object.fromEntries(categories.map((category) => [
    category.id,
    products
      .filter((product) => categorySlugs[category.id]?.includes(product.category))
      .map((product) => ({ ...product, price: Number(product.price) })),
  ]));
  const categoriesWithInventory = categories.filter((category) =>
    options[category.id]?.some((product) => product.inStock),
  );
  const [selected, setSelected] = useState({});
  const [activeCategory, setActiveCategory] = useState(null);
  const [pendingId, setPendingId] = useState(null);
  const [search, setSearch] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');
  const [addedToCart, setAddedToCart] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    setAddedToCart(false);
  }, [selected]);

  const saveBuild = () => {
    const buildData = {
      components: Object.fromEntries(
        Object.entries(selected).map(([categoryId, item]) => [
          categoryId,
          item.id
        ])
      ),
      savedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem('matrixpc-saved-build', JSON.stringify(buildData));
      setSavedMessage('Збірку успішно збережено!');
    } catch {
      setSavedMessage('Не вдалося зберегти збірку.');
    }
  };
  
  const restoreBuild = () => {
    try {
      const saved = localStorage.getItem('matrixpc-saved-build');

      if (!saved) {
        setSavedMessage('Збереженої збірки немає.');
        return;
      }

      const buildData = JSON.parse(saved);
      const restored = {};

      for (const category of categories) {
        const productId = buildData.components?.[category.id];

        const product = options[category.id]?.find(
          (item) => item.id === productId
        );

        if (product) {
          restored[category.id] = product;
        }
      }

      if (Object.keys(restored).length === 0) {
        setSavedMessage('Не вдалося відновити комплектуючі.');
        return;
      }

      setSelected(restored);
      setSavedMessage('Збірку відновлено!');
      setShowSummary(false);
    } catch {
      setSavedMessage('Помилка під час відновлення збірки.');
    }
  };
  // втПливабче повідомлення
  useEffect(() => {
    if (!savedMessage) return;

    const timer = setTimeout(() => {
      setSavedMessage('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [savedMessage]);

  const selectedCount = Object.keys(selected).length;
  const total = Object.values(selected).reduce(
    (sum, item) => sum + item.price,
    0
  );
const compatibilityErrors = checkCompatibility(selected);
const isComplete =
    categoriesWithInventory.length > 0 &&
    selectedCount === categoriesWithInventory.length &&
    compatibilityErrors.length === 0;
    // ДОДАЄ КОМПЛЕКТУЮЧІ ДО КОШИКУ
  const addBuildToCart = () => {
    if (productsLoading || productsError) {
      setSavedMessage('Каталог недоступний. Онови сторінку та спробуй ще раз.');
      return;
    }
    if (!isComplete) {
      setSavedMessage('Обери комплектуючі, які є в наявності, та перевір сумісність.');
      return;
    }

    const chosenProducts = categoriesWithInventory.map((category) => {
      const selectedId = selected[category.id]?.id;
      return products.find((product) => product.id === selectedId && product.inStock);
    });
    if (chosenProducts.some((product) => !product?.id)) {
      setSavedMessage('Одна з позицій більше не доступна. Онови сторінку та збірку.');
      return;
    }

    chosenProducts.forEach((product) => addCatalogProduct(product.id));
    setSavedMessage('Комплектуючі збірки додано до кошика для оформлення.');
    setAddedToCart(true);
  };

  const openPicker = (id) => {
    setActiveCategory(id);
    setPendingId(selected[id]?.id ?? null);
    setSearch('');
  };

  const closePicker = () => {
    setActiveCategory(null);
    setPendingId(null);
  };
  // Ця функція видаляє один вибраний компонент Ціна і кількість комплектуючих перерахуються автоматично.
  const removeComponent = (categoryId) => {
    setSelected((current) => {
      const updated = { ...current };
      delete updated[categoryId];
      return updated;
    });
  };
  const clearBuild = () => {
    if (Object.keys(selected).length === 0) {
      setSavedMessage('Збірка вже порожня.');
      return;
    }

    setShowClearConfirm(true);
  };

  const confirmClearBuild = () => {
    setSelected({});
    setActiveCategory(null);
    setPendingId(null);
    setSearch('');
    setShowSummary(false);
    setAddedToCart(false);
    setShowClearConfirm(false);
    setSavedMessage('Збірку очищено!');
  };
  
  const getProductErrors = (categoryId, product) => {
    const candidateSelection = {
      ...selected,
      [categoryId]: product
    };

    return checkCompatibility(candidateSelection);
  };

  const confirmSelection = () => {
    const item = options[activeCategory]?.find(
      (product) => product.id === pendingId
    );
    if (!item) return;
    const errors = getProductErrors(activeCategory, item);
    if (errors.length > 0) return;
    setSelected((current) => ({
      ...current,
      [activeCategory]: item,
    }));

    closePicker();
  };
  useEffect(() => {
    if (!activeCategory && !showSummary) return;

    const onEscape = (event) => {
      if (event.key === 'Escape') {
        setActiveCategory(null);
        setShowSummary(false);
      }
    };

    window.addEventListener('keydown', onEscape);

    return () => {
      window.removeEventListener('keydown', onEscape);
    };
  }, [activeCategory, showSummary]);

  
  const renderChoice = (category) => {
    const item = selected[category.id];

    return (
      <div
        key={category.id}
        className={`config-choice-wrapper ${item ? 'has-item' : ''}`}
      >
        <button
          type="button"
          className={`config-choice ${item ? 'chosen' : ''}`}
          onClick={() => openPicker(category.id)}
          disabled={productsLoading || !options[category.id]?.some((product) => product.inStock)}
          title={!options[category.id]?.some((product) => product.inStock) ? 'Немає товарів цієї категорії в наявності в каталозі' : undefined}
        >
          <span className="config-choice-icon">
            {item ? '✓' : '+'}
          </span>

          <span className="config-choice-content">
            <span className="config-choice-label">
              {category.name}
            </span>

            {item && (
              <span className="config-choice-selected">
                {item.name}
              </span>
            )}
          </span>

          <span className="config-choice-action">
            {item ? 'Змінити' : options[category.id]?.some((product) => product.inStock) ? 'Обрати' : 'Немає в наявності'}
          </span>
        </button>

        {item && (
          <button
            type="button"
            className="config-choice-remove"
            onClick={() => removeComponent(category.id)}
            aria-label={`Видалити ${category.name}`}
            title="Видалити комплектуючий"
          >
            ✕
          </button>
        )}
      </div>
    );
  };


  const currentCategory = categories.find(
    (category) => category.id === activeCategory
  );
  const activeOptions = activeCategory ? options[activeCategory] || [] : [];
  const pendingProduct = activeOptions.find((item) => item.id === pendingId);

  const filteredOptions = activeOptions.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section id="assembly" className="configurator-section">
      <div className="configurator-container">
        <div className="configurator-heading">
          <p className="configurator-eyebrow">
            MATRIXPC CONFIGURATOR
          </p>

          <h2>ЗБЕРИ СВІЙ ПК</h2>

          <p>
            Обери комплектуючі та збери оптимальну
            конфігурацію під свої задачі й бюджет.
          </p>
        </div>

        <div className="configurator-layout">
          <div className="configurator-side">
            {categories
              .filter((category) => category.side === 'left')
              .map(renderChoice)}
          </div>

          <div className="configurator-center">
            <img
              src="/image/PC_Case 1.png"
              alt="Корпус комп'ютера MATRIXPC"
              className="configurator-case-image"
            />

            <p className="configurator-case-status">
              {selected.case?.name ?? 'Корпус не обрано'}
            </p>

            <button
              type="button"
              className="configurator-case-button"
              onClick={() => openPicker('case')}
              disabled={productsLoading || !options.case?.some((product) => product.inStock)}
              title={!options.case?.some((product) => product.inStock) ? 'Немає корпусів у наявності в каталозі' : undefined}
            >
              {!options.case?.some((product) => product.inStock)
                ? 'КОРПУСУ НЕМАЄ В НАЯВНОСТІ'
                : selected.case
                  ? 'ЗМІНИТИ КОРПУС'
                  : '+ ОБРАТИ КОРПУС'}
            </button>
            
            {selected.case && (
                <button
                  type="button"
                  className="configurator-case-button configurator-case-remove"
                  onClick={() => removeComponent('case')}
                >
                  ✕ ВИДАЛИТИ КОРПУС
                </button>
              )}

          </div>

          <div className="configurator-side">
            {categories
              .filter((category) => category.side === 'right')
              .map(renderChoice)}
          </div>
        </div>
        {productsLoading && (
          <p className="configurator-note" role="status">Завантажуємо каталог комплектуючих…</p>
        )}
        {productsError && (
          <p className="compatibility-warning" role="alert">
            Не вдалося завантажити каталог: {productsError}
          </p>
        )}
        {!productsLoading && !productsError && categoriesWithInventory.length === 0 && (
          <p className="compatibility-warning" role="status">
            У каталозі поки немає комплектуючих у наявності.
          </p>
        )}
        {compatibilityErrors.length > 0 && (
          <div className="compatibility-warning">
            <strong>Перевір сумісність комплектуючих:</strong>
            {compatibilityErrors.map((error, index) => <p key={index}>{error}</p>)}
          </div>
        )}
        {!productsLoading && !productsError && categoriesWithInventory.length > 0 && (
          <p className="configurator-note">
            У каталозі є товари в наявності для {categoriesWithInventory.length} із {categories.length} категорій.
            Перевірка сумісності спирається на характеристики, додані до карток товарів. Якщо даних бракує, узгодь сумісність із консультантом перед оформленням.
            Під час замовлення бекенд перевірить актуальну наявність і ціну кожного товару.
          </p>
        )}
         
        <div className="configurator-summary">
          <div>
            <span>Обрано комплектуючих</span>
            <strong>{selectedCount} / {categoriesWithInventory.length}</strong>
          </div>

          <div>
            <span>Орієнтовна вартість</span>
            <strong>{formatPrice(total)}</strong>
          </div>

          <div className="config-summary-actions">
          <button
                type="button"
                className="config-clear-button"
                onClick={clearBuild}
                disabled={selectedCount === 0}
              >
                ОЧИСТИТИ ЗБІРКУ
              </button>
            <button
              type="button"
              className="config-restore-button"
              onClick={restoreBuild}
            >
              ВІДНОВИТИ ЗБІРКУ
            </button>

            <button
              type="button"
              disabled={productsLoading || Boolean(productsError) || !isComplete}
              onClick={() => setShowSummary(true)}
            >
              ПРОДОВЖИТИ ЗБІРКУ
            </button>
          </div>
        </div>

        <p className="configurator-note">
          У кошик додаються реальні товари з каталогу; наявність і остаточну суму бекенд перевіряє під час оформлення.
        </p>
      </div>
      {activeCategory && (
        <div
          className="config-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closePicker();
            }
          }}
        >
          <div
            className="config-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="config-modal-title"
          >
            <div className="config-modal-header">
              <h3 id="config-modal-title">
                ОБЕРИ {currentCategory.name.toUpperCase()}
              </h3>

              <button
                type="button"
                className="config-modal-close"
                onClick={closePicker}
                aria-label="Закрити"
              >
                ✕
              </button>
            </div>

            <input
              className="config-search"
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Пошук комплектуючих..."
              aria-label="Пошук комплектуючих"
            />

            <h4 className="config-list-heading">
              Доступні комплектуючі
            </h4>

           
            <div className="config-product-list">
              {filteredOptions.map((item) => {
                const productErrors = getProductErrors(activeCategory, item);
                const isIncompatible = productErrors.length > 0;

                return (
                  <div
                    key={item.id}
                    className={`config-product ${
                      pendingId === item.id
                        ? 'config-product-active'
                        : ''
                    } ${isIncompatible ? 'config-product-incompatible' : ''}`}
                  >
                    <div className="config-product-placeholder">
                      PC
                    </div>

                    <div className="config-product-info">
                      <strong>{item.name}</strong>
                      <span>{formatPrice(item.price)}</span>

                      {isIncompatible && (
                        <div className="config-product-error">
                          {productErrors.map((error, index) => (
                            <p key={index}>⚠ {error}</p>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      className="config-select-button"
                      disabled={isIncompatible || !item.inStock}
                      onClick={() => setPendingId(item.id)}
                    >
                      {!item.inStock
                        ? 'НЕМАЄ В НАЯВНОСТІ'
                        : isIncompatible
                        ? 'НЕСУМІСНО'
                        : pendingId === item.id
                          ? 'ОБРАНО'
                          : 'ОБРАТИ'}
                    </button>
                  </div>
                );
              })}
              {filteredOptions.length === 0 && (
                <p className="config-no-results">
                  Комплектуючих не знайдено.
                </p>
              )}
            </div>

            <div className="config-modal-footer">
              <div>
                <small>Обраний компонент</small>
                <strong>
                  {pendingProduct?.name ?? 'Нічого не обрано'}
                </strong>
              </div>

              <button
                type="button"
                disabled={!pendingProduct || !pendingProduct.inStock || getProductErrors(
                  activeCategory,
                  pendingProduct
                ).length > 0}
                onClick={confirmSelection}
              >
                ПІДТВЕРДИТИ
              </button>
            </div>
          </div>
        </div>
      )}

      {showSummary && (
        <div className="config-modal-overlay">
          <div
            className="config-modal config-result-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="config-result-title"
          >
            <div className="config-modal-header">
              <h3 id="config-result-title">
                ТВОЯ ЗБІРКА ПК
              </h3>
              <button
                type="button"
                className="config-modal-close"
                onClick={() => setShowSummary(false)}
                aria-label="Закрити"
              >
                ✕
              </button>
            </div>

            <div className="config-result-list">
              {categoriesWithInventory.map((category) => (
                <div key={category.id}>
                  <span>{category.name}</span>
                  <strong>
                    {selected[category.id]?.name}
                  </strong>
                </div>
              ))}
            </div>

            <div className="config-result-total">
              Разом: {formatPrice(total)}
            </div>

            <p className="config-result-note">
              До кошика буде додано обрані товари з каталогу. Підсумкова ціна та залишки перевіряються бекендом під час оформлення.
            </p>
            <button
                type="button"
                className="config-save-button"
                onClick={saveBuild}
              >
                ЗБЕРЕГТИ ЗБІРКУ
              </button>

              <button
                type="button"
                className="config-save-button"
                onClick={addBuildToCart}
                disabled={!isComplete}
              >
                ДОДАТИ В КОШИК
              </button>
              
              {addedToCart && (
                <button
                  type="button"
                  className="config-save-button"
                  onClick={() => window.location.assign('/cart')}
                >
                  ПЕРЕЙТИ В КОШИК
                </button>
              )}

            <button
              type="button"
              className="config-result-close"
              onClick={() => setShowSummary(false)}
            >
              ПОВЕРНУТИСЯ ДО КОНФІГУРАТОРА
            </button>
          </div>
        </div>
      )}
      
      {showClearConfirm && (
        <div className="config-modal-overlay">
          <div
            className="config-modal config-clear-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="config-clear-title"
          >
            <div className="config-modal-header">
              <h3 id="config-clear-title">
                ОЧИСТИТИ ЗБІРКУ?
              </h3>

              <button
                type="button"
                className="config-modal-close"
                onClick={() => setShowClearConfirm(false)}
                aria-label="Закрити"
              >
                ✕
              </button>
            </div>

            <p className="config-clear-description">
              Усі вибрані комплектуючі будуть видалені
              з поточного конфігуратора.
            </p>

            <div className="config-clear-actions">
              <button
                type="button"
                className="config-clear-cancel"
                onClick={() => setShowClearConfirm(false)}
              >
                СКАСУВАТИ
              </button>

              <button
                type="button"
                className="config-clear-confirm"
                onClick={confirmClearBuild}
              >
                ТАК, ОЧИСТИТИ
              </button>
            </div>
          </div>
        </div>
      )}

      {savedMessage && (
        <div
          className={`config-toast ${
            savedMessage.includes('збережено') ||
            savedMessage.includes('відновлено') ||
            savedMessage.includes('додано')||
            savedMessage.includes('очищено')
              ? 'config-toast-success'
              : 'config-toast-error'
          }`}
          role="status"
        >
          <span>
          {savedMessage.includes('збережено') ||
          savedMessage.includes('відновлено') ||
          savedMessage.includes('додано') ||
          savedMessage.includes('очищено') ? '✓' : '!'}
          </span>
          <span>{savedMessage}</span>
        </div>
      )}
    </section>
  );
}