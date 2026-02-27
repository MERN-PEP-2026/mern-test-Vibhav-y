import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const STORAGE_KEY = 'task-manager-token';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY));
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setUser(null);
        setInitializing(false);
        return;
      }
      try {
        const { data } = await api.get('/auth/me');
        setUser(data);
      } catch (err) {
        logout();
      } finally {
        setInitializing(false);
      }
    };
    loadUser();
  }, [token]);

  const persistToken = (newToken) => {
    localStorage.setItem(STORAGE_KEY, newToken);
    setToken(newToken);
  };

  const register = async (payload) => {
    setError(null);
    const { data } = await api.post('/auth/register', payload);
    persistToken(data.token);
    setUser({ _id: data._id, name: data.name, email: data.email });
  };

  const login = async (payload) => {
    setError(null);
    const { data } = await api.post('/auth/login', payload);
    persistToken(data.token);
    setUser({ _id: data._id, name: data.name, email: data.email });
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      initializing,
      error,
      setError,
      register,
      login,
      logout
    }),
    [token, user, initializing, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};
