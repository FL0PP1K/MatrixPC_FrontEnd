import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import "./RegisterPage.css";

// Конфігурація полів для форми входу
const formFields = [
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
    placeholder: "Введи свій пароль",
    autoComplete: "current-password",
    required: true,
  },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsSubmitting(true);
      setError("");

      await login({
        email: formData.email.trim(),
        password: formData.password,
      });
      navigate("/account", { replace: true });
    } catch (err) {
      setError(err.message || "Не вдалося увійти в акаунт.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-heading">
          <h1>ВХІД ДО АКАУНТА</h1>
          <p>Раді знову бачити тебе в MATRIXPC.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {formFields.map((field) => (
            <div className="auth-field" key={field.name}>
              <label htmlFor={`login-${field.name}`}>{field.label}</label>
              <input
                id={`login-${field.name}`}
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

          <button type="submit" className="auth-submit" disabled={isSubmitting}>
            {isSubmitting ? "ВХІД..." : "УВІЙТИ"}
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
