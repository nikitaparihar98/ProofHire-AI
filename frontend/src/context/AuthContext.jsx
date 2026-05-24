import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getCurrentUser, getApiErrorMessage, login as loginRequest, signup as signupRequest } from '../services/api';

const AuthContext = createContext(null);

const STORAGE_TOKEN_KEY = 'access_token';
const STORAGE_USER_KEY = 'user';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_TOKEN_KEY));
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_USER_KEY) || 'null');
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(Boolean(localStorage.getItem(STORAGE_TOKEN_KEY)));
  const [error, setError] = useState(null);

  const persistSession = useCallback((authResponse) => {
    localStorage.setItem(STORAGE_TOKEN_KEY, authResponse.access_token);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(authResponse.user));
    setToken(authResponse.access_token);
    setUser(authResponse.user);
    setError(null);
    return authResponse.user;
  }, []);

  const refreshUser = useCallback(async () => {
    if (!localStorage.getItem(STORAGE_TOKEN_KEY)) {
      setLoading(false);
      return null;
    }

    try {
      setLoading(true);
      const currentUser = await getCurrentUser();
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(currentUser));
      setUser(currentUser);
      setError(null);
      return currentUser;
    } catch (err) {
      localStorage.removeItem(STORAGE_TOKEN_KEY);
      localStorage.removeItem(STORAGE_USER_KEY);
      setToken(null);
      setUser(null);
      setError(getApiErrorMessage(err, 'Failed to restore session'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback(async ({ email, password }) => {
    const authResponse = await loginRequest({ email, password });
    return persistSession(authResponse);
  }, [persistSession]);

  const signup = useCallback(async (payload) => {
    const authResponse = await signupRequest(payload);
    return persistSession(authResponse);
  }, [persistSession]);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);
    setToken(null);
    setUser(null);
    setError(null);
  }, []);

  const value = useMemo(() => ({
    token,
    user,
    userRole: user?.role || null,
    isAuthenticated: Boolean(token && user),
    loading,
    error,
    login,
    signup,
    logout,
    refreshUser,
  }), [token, user, loading, error, login, signup, logout, refreshUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
