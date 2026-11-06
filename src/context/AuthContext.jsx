import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  registerUser as registerUserApi,
  loginUser as loginUserApi,
  getCurrentUser,
} from '../services/authApi';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'matrixpc-token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(
    () => localStorage.getItem(AUTH_STORAGE_KEY)
  );

  const [authLoading, setAuthLoading] = useState(true);

  // Відновлення авторизації після перезавантаження сторінки
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
        console.error('Session restoration error:', error);

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
  }, []);

  // Реєстрація
  const register = async (userData) => {
    const result = await registerUserApi(userData);

    localStorage.setItem(AUTH_STORAGE_KEY, result.token);

    setToken(result.token);
    setUser(result.user);

    return result.user;
  };

  // Авторизація
  const login = async (credentials) => {
    const result = await loginUserApi(credentials);

    localStorage.setItem(AUTH_STORAGE_KEY, result.token);

    setToken(result.token);
    setUser(result.user);

    return result.user;
  };

  // Вихід з акаунта
  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);

    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    authLoading,
    isAuthenticated: Boolean(user && token),
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Хук для використання авторизації
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }

  return context;
}
