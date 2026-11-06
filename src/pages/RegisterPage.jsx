import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

import './RegisterPage.css';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setError('');
    setNotice('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.name.trim().length === 0) {
      setError("Введи своє ім'я.");
      return;
    }

    if (formData.password.length < 8) {
      setError('Пароль повинен містити щонайменше 8 символів.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Паролі не збігаються.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      setNotice('');

      // Реєстрація через Backend API
      await register({
        firstName: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      setNotice('Реєстрація успішна!');

      // Перехід до особистого кабінету
      navigate('/account', { replace: true });

    } catch (error) {
      setError(error.message || 'Помилка під час реєстрації.');
    } finally {
      setIsSubmitting(false);
    }
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
              autoComplete="given-name"
              maxLength={50}
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

          <button
            type="submit"
            className="auth-submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'РЕЄСТРАЦІЯ...'
              : 'СТВОРИТИ АКАУНТ'}
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
