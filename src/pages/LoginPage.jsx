import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

import './RegisterPage.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setError('');

      // Авторизація через Backend API
      await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      // Перехід до особистого кабінету
      navigate('/account', { replace: true });

    } catch (error) {
      setError(
        error.message || 'Не вдалося увійти в акаунт.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-heading">
          <h1>ВХІД ДО АКАУНТА</h1>
          <p>
            Раді знову бачити тебе в MATRIXPC.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="login-email">
              Електронна пошта
            </label>

            <input
              id="login-email"
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
            <label htmlFor="login-password">
              Пароль
            </label>

            <input
              id="login-password"
              type="password"
              name="password"
              placeholder="Введи свій пароль"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="auth-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'ВХІД...' : 'УВІЙТИ'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Ще не маєш акаунта?</p>
          <Link to="/register">Зареєструватися</Link>
        </div>
      </div>
    </main>
  );
}