import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

export default function AccountPage() {
  const navigate = useNavigate();

  const {
    user,
    logout,
    authLoading,
  } = useAuth();

  // Перевіряємо авторизацію
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { replace: true });
    }
  }, [authLoading, user, navigate]);

  // Очікуємо завершення перевірки JWT
  if (authLoading) {
    return (
      <main className="page-content">
        <h1>Завантаження кабінету...</h1>
      </main>
    );
  }

  // Не показуємо кабінет неавторизованому користувачу
  if (!user) {
    return null;
  }

  // Формуємо повне ім'я
  const fullName = [
    user.firstName,
    user.lastName,
  ].filter(Boolean).join(' ') || 'Користувач MATRIXPC';

  // Перекладаємо роль
  const roleName = user.role === 'ADMIN'
    ? 'Адміністратор'
    : 'Клієнт';

  // Форматуємо дату реєстрації
  const registrationDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('uk-UA')
    : 'Не вказано';

  // Вихід з акаунта
  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <main className="page-content">
      <section className="account-page">

        <div className="account-header">
          <h1>ОСОБИСТИЙ КАБІНЕТ</h1>
          <p>
            Вітаємо в MATRIXPC, {fullName}!
          </p>
        </div>

        <div className="account-card">
          <h2>Інформація про акаунт</h2>

          <div className="account-info">
            <div className="account-info-item">
              <span>Ім'я та прізвище</span>
              <strong>{fullName}</strong>
            </div>

            <div className="account-info-item">
              <span>Електронна пошта</span>
              <strong>{user.email}</strong>
            </div>

            <div className="account-info-item">
              <span>Роль</span>
              <strong>{roleName}</strong>
            </div>

            <div className="account-info-item">
              <span>Дата реєстрації</span>
              <strong>{registrationDate}</strong>
            </div>

            <div className="account-info-item">
              <span>ID користувача</span>
              <strong>{user.id}</strong>
            </div>
          </div>

          <button
            type="button"
            className="account-logout-button"
            onClick={handleLogout}
          >
            ВИЙТИ З АКАУНТА
          </button>
        </div>

      </section>
    </main>
  );
}