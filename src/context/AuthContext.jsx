import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";

import {
  registerUser as registerUserApi,
  loginUser as loginUserApi,
  getCurrentUser,
  updateCurrentUser,
} from "../services/authApi";

const AuthContext = createContext(null);

export const AUTH_STORAGE_KEY = "matrixpc-token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() =>
    localStorage.getItem(AUTH_STORAGE_KEY),
  );
  const [authLoading, setAuthLoading] = useState(true);

  // Відновлення сесії при завантаженні сторінки
  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      if (!token) {
        setAuthLoading(false);
        return;
      }

      try {
        const result = await getCurrentUser(token);
        if (isMounted) {
          setUser(result.user);
        }
      } catch (error) {
        console.error("Session restoration error:", error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
        if (isMounted) {
          setUser(null);
          setToken(null);
        }
      } finally {
        if (isMounted) {
          setAuthLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, [token]);

  // Реєстрація
  const register = useCallback(async (userData) => {
    const result = await registerUserApi(userData);
    localStorage.setItem(AUTH_STORAGE_KEY, result.token);
    setToken(result.token);
    setUser(result.user);
    return result.user;
  }, []);

  // Авторизація
  const login = useCallback(async (credentials) => {
    const result = await loginUserApi(credentials);
    localStorage.setItem(AUTH_STORAGE_KEY, result.token);
    setToken(result.token);
    setUser(result.user);
    return result.user;
  }, []);

  const updateProfile = useCallback(async (data) => {
    if (!token) throw new Error('Потрібно увійти в акаунт');
    const result = await updateCurrentUser(token, data);
    setUser(result.user);
    return result.user;
  }, [token]);

  // Вихід з акаунта
  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  // Мемоізація контексту
  const value = useMemo(
    () => ({
      user,
      token,
      authLoading,
      isAuthenticated: Boolean(user && token),
      register,
      login,
      updateProfile,
      logout,
    }),
    [user, token, authLoading, register, login, updateProfile, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
