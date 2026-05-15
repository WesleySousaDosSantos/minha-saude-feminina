import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { setAuthToken } from './api';
import {
  clearSession,
  loadSession,
  saveSession,
  updateStoredUser,
} from './storage';
import { authService } from '../services/auth';
import { queryKeys } from '../services/queries';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    let cancelled = false;
    loadSession()
      .then((session) => {
        if (cancelled || !session) return;
        setAuthToken(session.token);
        setUser(session.user);
        setToken(session.token);
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const applySession = async (nextToken, nextUser) => {
    setAuthToken(nextToken);
    setUser(nextUser);
    setToken(nextToken);
    await saveSession(nextToken, nextUser);
    queryClient.setQueryData(queryKeys.me, nextUser);
  };

  const login = async ({ email, password }) => {
    const data = await authService.login({ email, password });
    await applySession(data.token, data.user);
    return data.user;
  };

  const register = async ({ name, email, password, termsAccepted }) => {
    const data = await authService.register({
      name,
      email,
      password,
      termsAccepted,
    });
    await applySession(data.token, data.user);
    return data.user;
  };

  const logout = async () => {
    setAuthToken(null);
    setUser(null);
    setToken(null);
    await clearSession();
    queryClient.clear();
  };

  const refreshUser = async () => {
    const data = await authService.me();
    setUser(data.user);
    await updateStoredUser(data.user);
    queryClient.setQueryData(queryKeys.me, data.user);
    return data.user;
  };

  const patchUser = (partial) => {
    setUser((prev) => {
      const next = prev ? { ...prev, ...partial } : prev;
      if (next) {
        updateStoredUser(next).catch(() => {});
        queryClient.setQueryData(queryKeys.me, next);
      }
      return next;
    });
  };

  const value = useMemo(
    () => ({
      user,
      token,
      ready,
      isAuthenticated: !!token,
      login,
      register,
      logout,
      refreshUser,
      patchUser,
    }),
    [user, token, ready]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return ctx;
}
