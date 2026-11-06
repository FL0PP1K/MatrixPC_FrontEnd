import { useState } from 'react';
import { Link } from 'react-router-dom';

import './RegisterPage.css';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setError('');
    setNotice('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (formData.password.length < 8) {
      setError('Пароль повинен містити щонайменше 8 символів.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Паролі не збігаються.');
      return;
    }

    setError('');
    setNotice(
      'Форма заповнена правильно. Наступний крок — підключення сервера.'
    );
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-heading">
          <h1>СТВОРИТИ АКАУНТ</h1>
          <p>
            Приєднуйся до MATRIXPC та збирай свій ідеальний ПК.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="register-name">Ім'я</label>
            <input
              id="register-name"
              type="text"
              name="name"
              placeholder="Введи своє ім'я"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="register-email">Електронна пошта</label>
            <input
              id="register-email"
              type="email"
              name="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="register-password">Пароль</label>
            <input
              id="register-password"
              type="password"
              name="password"
              placeholder="Мінімум 8 символів"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="register-confirm-password">
              Підтвердження пароля
            </label>
            <input
              id="register-confirm-password"
              type="password"
              name="confirmPassword"
              placeholder="Повтори пароль"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </div>

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          {notice && (
            <p className="auth-notice" role="status">
              {notice}
            </p>
          )}

          <button type="submit" className="auth-submit">
            СТВОРИТИ АКАУНТ
          </button>
        </form>

        <div className="auth-footer">
          <p>Вже маєш акаунт?</p>
          <Link to="/login">Увійти</Link>
        </div>
      </div>
    </main>
  );
}