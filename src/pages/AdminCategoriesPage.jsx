import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  createCategory,
  deleteCategory,
  getAdminCategories,
  updateCategory,
} from '../services/adminApi';
import './AdminCategoriesPage.css';

const emptyForm = { name: '', slug: '' };

export default function AdminCategoriesPage() {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAdminCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Не вдалося завантажити категорії');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadCategories(); }, [loadCategories]);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase()) ||
    category.slug.toLowerCase().includes(search.toLowerCase())
  );

  function handleAdd() {
    setError('');
    setNotice('');
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function handleEdit(category) {
    setError('');
    setNotice('');
    setEditingId(category.id);
    setForm({ name: category.name, slug: category.slug });
    setShowForm(true);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSave(event) {
    event.preventDefault();
    if (!token) {
      setError('Сесія адміністратора відсутня. Увійдіть повторно.');
      return;
    }

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim().toLowerCase(),
    };
    if (!payload.name || !payload.slug) {
      setError('Вкажіть назву та slug категорії.');
      return;
    }

    setSaving(true);
    setError('');
    setNotice('');
    try {
      if (editingId === null) {
        await createCategory(token, payload);
        setNotice('Категорію створено.');
      } else {
        await updateCategory(token, editingId, payload);
        setNotice('Категорію оновлено.');
      }
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      await loadCategories();
    } catch (err) {
      setError(err.message || 'Не вдалося зберегти категорію');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(category) {
    if (!window.confirm(`Видалити категорію «${category.name}»?`)) return;
    if (!token) {
      setError('Сесія адміністратора відсутня. Увійдіть повторно.');
      return;
    }

    setError('');
    setNotice('');
    try {
      await deleteCategory(token, category.id);
      setNotice('Категорію видалено.');
      await loadCategories();
    } catch (err) {
      setError(err.message || 'Не вдалося видалити категорію');
    }
  }

  return (
    <div className="admin-categories">
      <div className="admin-categories-header">
        <div>
          <h1>КЕРУВАННЯ КАТЕГОРІЯМИ</h1>
          <p>Створення та редагування категорій MatrixPC</p>
        </div>
        <button className="admin-category-add" onClick={handleAdd}>
          + Додати категорію
        </button>
      </div>

      {error && <p className="admin-error" role="alert">{error}</p>}
      {notice && <p className="admin-success" role="status">{notice}</p>}

      <div className="admin-categories-panel">
        <input
          className="admin-categories-search"
          type="search"
          placeholder="Пошук категорій..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <div className="admin-categories-table-wrap">
          <table className="admin-categories-table">
            <thead><tr><th>ID</th><th>Назва категорії</th><th>Slug</th><th>Дії</th></tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4">Завантаження категорій…</td></tr>
              ) : filteredCategories.map((category) => (
                <tr key={category.id}>
                  <td>#{category.id}</td>
                  <td>{category.name}</td>
                  <td>{category.slug}</td>
                  <td>
                    <div className="admin-categories-actions">
                      <button onClick={() => handleEdit(category)}>Редагувати</button>
                      <button className="admin-category-delete" onClick={() => handleDelete(category)}>Видалити</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filteredCategories.length === 0 && (
                <tr><td colSpan="4">Категорій не знайдено</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="admin-modal-overlay">
          <form className="admin-category-form" onSubmit={handleSave}>
            <h2>{editingId !== null ? 'Редагування категорії' : 'Додавання категорії'}</h2>
            <label>
              Назва категорії
              <input name="name" value={form.name} onChange={handleChange} placeholder="Наприклад, Процесори" required maxLength="100" />
            </label>
            <label>
              Slug
              <input name="slug" value={form.slug} onChange={handleChange} placeholder="Наприклад, processors" pattern="[a-z0-9-]+" title="Латинські маленькі літери, цифри та дефіс" required maxLength="100" />
            </label>
            <div className="admin-category-form-actions">
              <button type="button" onClick={() => setShowForm(false)} disabled={saving}>Скасувати</button>
              <button type="submit" className="admin-category-add" disabled={saving}>
                {saving ? 'Збереження…' : 'Зберегти'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
