import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './AdminProductsPage.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const emptyForm = {
  name: '',
  categoryId: '',
  price: '',
  stock: '',
  imageUrl: '',
};

async function apiRequest(path, { token, ...options } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const result = await response.json().catch(() => null);
  if (!response.ok || !result?.success) {
    throw new Error(result?.message || `Помилка запиту (${response.status})`);
  }
  return result.data;
}

function normalizeProduct(product) {
  return {
    ...product,
    price: Number(product.price),
    stock: Number(product.stock),
    categoryId: product.categoryId || product.category?.id || '',
    category: product.category?.name || 'Без категорії',
    image: product.imageUrl || '',
  };
}

export default function AdminProductsPage() {
  const { user, token, authLoading } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [productData, categoryData] = await Promise.all([
        apiRequest('/products'),
        apiRequest('/categories'),
      ]);
      setProducts((Array.isArray(productData) ? productData : []).map(normalizeProduct));
      setCategories(Array.isArray(categoryData) ? categoryData : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()),
  );

  function handleAdd() {
    setError('');
    setEditingId(null);
    setForm({ ...emptyForm, categoryId: categories[0]?.id || '' });
    setShowForm(true);
  }

  function handleEdit(product) {
    setError('');
    setEditingId(product.id);
    setForm({
      name: product.name,
      categoryId: product.categoryId,
      price: String(product.price),
      stock: String(product.stock),
      imageUrl: product.imageUrl || '',
    });
    setShowForm(true);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function handleCancel() {
    if (saving) return;
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setError('');
  }

  async function handleSave(event) {
    event.preventDefault();
    if (!token || user?.role !== 'ADMIN') {
      setError('Для збереження потрібно увійти як адміністратор.');
      return;
    }

    const name = form.name.trim();
    const price = Number(form.price);
    const stock = Number(form.stock);
    if (!name || !form.categoryId || !Number.isFinite(price) || price < 0 ||
        !Number.isInteger(stock) || stock < 0) {
      setError('Перевір назву, категорію, ціну та залишок товару.');
      return;
    }

    const payload = {
      name,
      categoryId: form.categoryId,
      price,
      stock,
      imageUrl: form.imageUrl.trim() || null,
    };

    // Backend вимагає унікальні slug і SKU для нового товару.
    if (editingId === null) {
      const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      payload.slug = `product-${uniqueId}`;
      payload.sku = `MPC-${uniqueId}`;
    }

    setSaving(true);
    setError('');
    try {
      await apiRequest(editingId === null ? '/products' : `/products/${editingId}`, {
        token,
        method: editingId === null ? 'POST' : 'PATCH',
        body: JSON.stringify(payload),
      });
      await loadData();
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Видалити цей товар?')) return;
    if (!token || user?.role !== 'ADMIN') {
      setError('Для видалення потрібно увійти як адміністратор.');
      return;
    }
    try {
      setError('');
      await apiRequest(`/products/${id}`, { token, method: 'DELETE' });
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="admin-products">
      <div className="admin-products-header">
        <div>
          <h1>КЕРУВАННЯ ТОВАРАМИ</h1>
          <p>Перегляд і редагування каталогу MatrixPC</p>
        </div>
        <button className="admin-add-button" onClick={handleAdd} disabled={authLoading || user?.role !== 'ADMIN'}>
          + Додати товар
        </button>
      </div>

      {error && !showForm && <p role="alert" style={{ color: '#ff7777' }}>{error}</p>}

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
                <th>Фото</th>
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
                  <td title={product.id}>#{product.id.slice(0, 8)}</td>
                  <td>
                    {product.image ? (
                      <img className="admin-product-thumbnail" src={product.image} alt={product.name} />
                    ) : (
                      <div className="admin-product-no-image">Нема фото</div>
                    )}
                  </td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.price.toLocaleString('uk-UA')} ₴</td>
                  <td>{product.stock} шт.</td>
                  <td>
                    <div className="admin-products-actions">
                      <button onClick={() => handleEdit(product)} disabled={authLoading || user?.role !== 'ADMIN'}>
                        Редагувати
                      </button>
                      <button
                        className="admin-delete-button"
                        onClick={() => handleDelete(product.id)}
                        disabled={authLoading || user?.role !== 'ADMIN'}
                      >
                        Видалити
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filteredProducts.length === 0 && (
                <tr><td colSpan="7">Товарів не знайдено</td></tr>
              )}
              {loading && <tr><td colSpan="7">Завантаження...</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="admin-modal-overlay">
          <form className="admin-product-form" onSubmit={handleSave}>
            <h2>{editingId !== null ? 'Редагування товару' : 'Додавання товару'}</h2>
            {error && <p role="alert" style={{ color: '#ff7777' }}>{error}</p>}

            <label>
              Назва товару
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>

            <label>
              Категорія
              <select name="categoryId" value={form.categoryId} onChange={handleChange} required>
                <option value="">Вибери категорію</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </label>

            <label>
              Ціна (₴)
              <input type="number" name="price" min="0" step="0.01" value={form.price} onChange={handleChange} required />
            </label>

            <label>
              Кількість на складі
              <input type="number" name="stock" min="0" step="1" value={form.stock} onChange={handleChange} required />
            </label>

            <label>
              URL зображення товару (необов'язково)
              <input type="url" name="imageUrl" placeholder="https://..." value={form.imageUrl} onChange={handleChange} />
            </label>

            {form.imageUrl && (
              <div className="admin-product-image-preview">
                <img src={form.imageUrl} alt="Попередній перегляд товару" />
              </div>
            )}

            <div className="admin-form-actions">
              <button type="button" onClick={handleCancel} disabled={saving}>Скасувати</button>
              <button type="submit" className="admin-add-button" disabled={saving}>
                {saving ? 'Збереження...' : 'Зберегти'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
