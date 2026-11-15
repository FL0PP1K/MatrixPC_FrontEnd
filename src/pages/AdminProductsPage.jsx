
import { useState } from 'react';
import './AdminProductsPage.css';

const initialProducts = [
  {
    id: 1,
    name: 'AMD Ryzen 5 5600',
    category: 'Процесори',
    price: 4999,
    stock: 12,
  },
  {
    id: 2,
    name: 'GeForce RTX 4060',
    category: 'Відеокарти',
    price: 13999,
    stock: 5,
  },
  {
    id: 3,
    name: 'Kingston Fury 16GB',
    category: 'Оперативна пам’ять',
    price: 1899,
    stock: 2,
  },
];

const emptyForm = {
  name: '',
  category: '',
  price: '',
  stock: '',
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  function handleAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function handleEdit(product) {
    setEditingId(product.id);

    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
    });

    setShowForm(true);
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleSave(event) {
    event.preventDefault();

    const productData = {
      name: form.name.trim(),
      category: form.category.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
    };

    if (editingId !== null) {
      setProducts((previous) =>
        previous.map((product) =>
          product.id === editingId
            ? { ...product, ...productData }
            : product
        )
      );
    } else {
      const newProduct = {
        id: Date.now(),
        ...productData,
      };

      setProducts((previous) => [...previous, newProduct]);
    }

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  function handleDelete(id) {
    if (!window.confirm('Видалити цей товар?')) {
      return;
    }

    setProducts((previous) =>
      previous.filter((product) => product.id !== id)
    );
  }

  return (
    <div className="admin-products">
      <div className="admin-products-header">
        <div>
          <h1>КЕРУВАННЯ ТОВАРАМИ</h1>
          <p>Перегляд і редагування каталогу MatrixPC</p>
        </div>

        <button
          className="admin-add-button"
          onClick={handleAdd}
        >
          + Додати товар
        </button>
      </div>

      <div className="admin-products-panel">
        <input
          type="text"
          placeholder="Пошук товарів..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <div className="admin-products-table-wrap">
          <table className="admin-products-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Назва товару</th>
                <th>Категорія</th>
                <th>Ціна</th>
                <th>Залишок</th>
                <th>Дії</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>#{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.price.toLocaleString('uk-UA')} ₴</td>
                  <td>{product.stock} шт.</td>

                  <td>
                    <div className="admin-products-actions">
                      <button
                        onClick={() => handleEdit(product)}
                      >
                        Редагувати
                      </button>

                      <button
                        className="admin-delete-button"
                        onClick={() => handleDelete(product.id)}
                      >
                        Видалити
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="6">Товарів не знайдено</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="admin-modal-overlay">
          <form
            className="admin-product-form"
            onSubmit={handleSave}
          >
            <h2>
              {editingId !== null
                ? 'Редагування товару'
                : 'Додавання товару'}
            </h2>

            <label>
              Назва товару
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Категорія
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Ціна (₴)
              <input
                type="number"
                name="price"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Кількість на складі
              <input
                type="number"
                name="stock"
                min="0"
                step="1"
                value={form.stock}
                onChange={handleChange}
                required
              />
            </label>

            <div className="admin-form-actions">
              <button
                type="button"
                onClick={() => setShowForm(false)}
              >
                Скасувати
              </button>

              <button
                type="submit"
                className="admin-add-button"
              >
                Зберегти
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
