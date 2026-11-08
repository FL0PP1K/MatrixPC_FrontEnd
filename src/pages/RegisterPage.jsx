import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import "./RegisterPage.css";

// Виносимо конфігурацію полів, щоб не дублювати HTML
const formFields = [
  {
    name: "name",
    label: "Ім'я",
    type: "text",
    placeholder: "Введи своє ім'я",
    autoComplete: "given-name",
    required: true,
    maxLength: 50,
  },
  {
    name: "email",
    label: "Електронна пошта",
    type: "email",
    placeholder: "example@email.com",
    autoComplete: "email",
    required: true,
  },
  {
    name: "password",
    label: "Пароль",
    type: "password",
    placeholder: "Мінімум 8 символів",
    autoComplete: "new-password",
    required: true,
    minLength: 8,
  },
  {
    name: "confirmPassword",
    label: "Підтвердження пароля",
    type: "password",
    placeholder: "Повтори пароль",
    autoComplete: "new-password",
    required: true,
  },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
    setError("");
    setNotice("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    // Спрощена перевірка помилок
    if (!name.trim()) return setError("Введи своє ім'я.");
    if (password.length < 8)
      return setError("Пароль повинен містити щонайменше 8 символів.");
    if (password !== confirmPassword) return setError("Паролі не збігаються.");

    try {
      setIsSubmitting(true);
      setError("");

      await register({ firstName: name.trim(), email: email.trim(), password });

      setNotice("Реєстрація успішна!");
      navigate("/account", { replace: true });
    } catch (err) {
      setError(err.message || "Помилка під час реєстрації.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-heading">
          <h1>СТВОРИТИ АКАУНТ</h1>
          <p>Приєднуйся до MATRIXPC та збирай свій ідеальний ПК.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Генеруємо інпути циклом */}
          {formFields.map((field) => (
            <div className="auth-field" key={field.name}>
              <label htmlFor={`register-${field.name}`}>{field.label}</label>
              <input
                id={`register-${field.name}`}
                value={formData[field.name]}
                onChange={handleChange}
                {...field}
              />
            </div>
          ))}

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

          <button type="submit" className="auth-submit" disabled={isSubmitting}>
            {isSubmitting ? "РЕЄСТРАЦІЯ..." : "СТВОРИТИ АКАУНТ"}
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
