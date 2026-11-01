import { useEffect, useState } from 'react';
import {
  categories,
  options,
  formatPrice,
} from './configuratorData';

import './Configurator.css';
import { checkCompatibility } from './compatibility';
export default function Configurator() {
  const [selected, setSelected] = useState({});
  const [activeCategory, setActiveCategory] = useState(null);
  const [pendingId, setPendingId] = useState(null);
  const [search, setSearch] = useState('');
  const [showSummary, setShowSummary] = useState(false);

  const selectedCount = Object.keys(selected).length;

  const total = Object.values(selected).reduce(
    (sum, item) => sum + item.price,
    0
  );
const compatibilityErrors = checkCompatibility(selected);
const isComplete =
    selectedCount === categories.length &&
    compatibilityErrors.length === 0;
  const openPicker = (id) => {
    setActiveCategory(id);
    setPendingId(selected[id]?.id ?? null);
    setSearch('');
  };

  const closePicker = () => {
    setActiveCategory(null);
    setPendingId(null);
  };

  
  const getProductErrors = (categoryId, product) => {
    const testSelected = {
      ...selected,
      [categoryId]: product
    };

    return checkCompatibility(testSelected);
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
      <button
        type="button"
        key={category.id}
        className={`config-choice ${item ? 'chosen' : ''}`}
        onClick={() => openPicker(category.id)}
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
          {item ? 'Змінити' : 'Обрати'}
        </span>
      </button>
    );
  };

  const currentCategory = categories.find(
    (category) => category.id === activeCategory
  );

  const filteredOptions = activeCategory
    ? options[activeCategory].filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      )
    : [];

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
            >
              {selected.case
                ? 'ЗМІНИТИ КОРПУС'
                : '+ ОБРАТИ КОРПУС'}
            </button>
          </div>

          <div className="configurator-side">
            {categories
              .filter((category) => category.side === 'right')
              .map(renderChoice)}
          </div>
        </div>
        {compatibilityErrors.length > 0 && (
    <div className="compatibility-warning">
        <strong>Увага! Несумісні комплектуючі:</strong>

        {compatibilityErrors.map((error, index) => (
            <p key={index}>{error}</p>
        ))}
    </div>
    )}
        <div className="configurator-summary">
          <div>
            <span>Обрано комплектуючих</span>
            <strong>{selectedCount} / 9</strong>
          </div>

          <div>
            <span>Орієнтовна вартість</span>
            <strong>{formatPrice(total)}</strong>
          </div>

          <button
            type="button"
            disabled={!isComplete}
            onClick={() => setShowSummary(true)}
          >
            ПРОДОВЖИТИ ЗБІРКУ
          </button>
        </div>

        <p className="configurator-demo-note">
          Демонстраційні товари та ціни.
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
                      disabled={isIncompatible}
                      onClick={() => setPendingId(item.id)}
                    >
                      {isIncompatible
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
                  {options[activeCategory].find(
                    (item) => item.id === pendingId
                  )?.name ?? 'Нічого не обрано'}
                </strong>
              </div>

              <button
                type="button"
                disabled={!pendingId || getProductErrors(
                  activeCategory,
                  options[activeCategory].find((item) => item.id === pendingId)
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
              {categories.map((category) => (
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
              Збірка сформована в деморежимі.
            </p>

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
    </section>
  );
}