import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as backend from '../services/index.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | signed-in | signed-out

  useEffect(() => {
    let unsub = () => {};
    (async () => {
      try {
        const current = await backend.getCurrentUser();
        setUser(current);
        setStatus(current ? 'signed-in' : 'signed-out');
      } catch (e) {
        setStatus('signed-out');
      }
      unsub = backend.onAuthStateChange((u) => {
        setUser(u);
        setStatus(u ? 'signed-in' : 'signed-out');
      });
    })();
    return () => unsub();
  }, []);

  const login = useCallback(async (email, password) => {
    const u = await backend.signIn(email, password);
    setUser(u);
    setStatus('signed-in');
    return u;
  }, []);

  const register = useCallback(async (email, password, displayName) => {
    const result = await backend.signUp(email, password, displayName);
    if (result.user) {
      setUser(result.user);
      setStatus('signed-in');
    }
    return result;
  }, []);

  const logout = useCallback(async () => {
    await backend.signOut();
    setUser(null);
    setStatus('signed-out');
  }, []);

  const changePassword = useCallback((currentPassword, newPassword) => {
    return backend.changePassword(currentPassword, newPassword);
  }, []);

  const withdraw = useCallback(async () => {
    await backend.withdrawAccount();
    setUser(null);
    setStatus('signed-out');
  }, []);

  const updateProfile = useCallback(
    async (patch) => {
      if (!user) return null;
      const updated = await backend.updateProfile(user.id, patch);
      setUser(updated);
      return updated;
    },
    [user]
  );

  const updateNotificationSettings = useCallback(
    async (settings) => {
      if (!user) return;
      await backend.updateNotificationSettings(user.id, settings);
      setUser((u) => (u ? { ...u, notificationSettings: settings } : u));
    },
    [user]
  );

  const hasRole = useCallback((...roles) => !!user && roles.some((r) => user.roles.includes(r)), [
    user
  ]);

  return (
    <AuthContext.Provider
      value={{
        user,
        status,
        login,
        register,
        logout,
        hasRole,
        changePassword,
        withdraw,
        updateProfile,
        updateNotificationSettings
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
