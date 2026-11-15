
import { useState } from 'react';
import './AdminCategoriesPage.css';

const initialCategories = [
  { id: 1, name: 'Процесори', slug: 'processors' },
  { id: 2, name: 'Відеокарти', slug: 'graphics-cards' },
  { id: 3, name: 'Материнські плати', slug: 'motherboards' },
  { id: 4, name: 'Оперативна пам’ять', slug: 'ram' },
  { id: 5, name: 'SSD накопичувачі', slug: 'ssd' },
  { id: 6, name: 'Блоки живлення', slug: 'power-supplies' },
  { id: 7, name: 'Корпуси', slug: 'cases' },
  { id: 8, name: 'Охолодження', slug: 'cooling' },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(initialCategories);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', slug: '' });

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase()) ||
    category.slug.toLowerCase().includes(search.toLowerCase())
  );

  function handleAdd() {
    setEditingId(null);
    setForm({ name: '', slug: '' });
    setShowForm(true);
  }

  function handleEdit(category) {
    setEditingId(category.id);
    setForm({
      name: category.name,
      slug: category.slug,
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

    const name = form.name.trim();
    const slug = form.slug.trim().toLowerCase();

    if (!name || !slug) {
      return;
    }

    const slugExists = categories.some(
      (category) =>
        category.slug === slug && category.id !== editingId
    );

    if (slugExists) {
      alert('Категорія з таким slug уже існує');
      return;
    }

    if (editingId !== null) {
      setCategories((previous) =>
        previous.map((category) =>
          category.id === editingId
            ? { ...category, name, slug }
            : category
        )
      );
    } else {
      setCategories((previous) => [
        ...previous,
        {
          id: Date.now(),
          name,
          slug,
        },
      ]);
    }

    setShowForm(false);
    setEditingId(null);
    setForm({ name: '', slug: '' });
  }

  function handleDelete(id) {
    if (!window.confirm('Видалити цю категорію?')) {
      return;
    }

    setCategories((previous) =>
      previous.filter((category) => category.id !== id)
    );
  }

  return (
    <div className="admin-categories">
      <div className="admin-categories-header">
        <div>
          <h1>КЕРУВАННЯ КАТЕГОРІЯМИ</h1>
          <p>Створення та редагування категорій MatrixPC</p>
        </div>

        <button
          className="admin-category-add"
          onClick={handleAdd}
        >
          + Додати категорію
        </button>
      </div>

      <div className="admin-categories-panel">
        <input
          className="admin-categories-search"
          type="text"
          placeholder="Пошук категорій..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <div className="admin-categories-table-wrap">
          <table className="admin-categories-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Назва категорії</th>
                <th>Slug</th>
                <th>Дії</th>
              </tr>
            </thead>

            <tbody>
              {filteredCategories.map((category) => (
                <tr key={category.id}>
                  <td>#{category.id}</td>
                  <td>{category.name}</td>
                  <td>{category.slug}</td>
                  <td>
                    <div className="admin-categories-actions">
                      <button
                        onClick={() => handleEdit(category)}
                      >
                        Редагувати
                      </button>

                      <button
                        className="admin-category-delete"
                        onClick={() => handleDelete(category.id)}
                      >
                        Видалити
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredCategories.length === 0 && (
                <tr>
                  <td colSpan="4">Категорій не знайдено</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="admin-modal-overlay">
          <form
            className="admin-category-form"
            onSubmit={handleSave}
          >
            <h2>
              {editingId !== null
                ? 'Редагування категорії'
                : 'Додавання категорії'}
            </h2>

            <label>
              Назва категорії
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Наприклад, Процесори"
                required
              />
            </label>

            <label>
              Slug
              <input
                name="slug"
                value={form.slug}
                onChange={handleChange}
                placeholder="Наприклад, processors"
                pattern="[a-z0-9-]+"
                title="Латинські маленькі літери, цифри та дефіс"
                required
              />
            </label>

            <div className="admin-category-form-actions">
              <button
                type="button"
                onClick={() => setShowForm(false)}
              >
                Скасувати
              </button>

              <button
                type="submit"
                className="admin-category-add"
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
