import { createContext, useContext, useEffect, useState } from 'react';
import { DEMO_USERS } from '../data/mockData.js';
import { safeGetFromStorage, safeSetToStorage, safeClearStorage } from '../utils/storage.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = safeGetFromStorage('crm_user', null);
    if (saved) setUser(saved);
  }, []);

  const login = (loginValue, password) => {
    try {
      const found = DEMO_USERS.find(
        (u) => u.login === loginValue && u.password === password
      );
      if (!found) {
        return { ok: false, error: 'Login yoki parol xato' };
      }

      const safe = {
        id: found.id,
        login: found.login,
        name: found.name,
        role: found.role,
        roleLabel: found.roleLabel,
        organization: found.organization || '',
        stir: found.stir || '',
        region: found.region || '',
        status: found.status || 'active',
      };

      setUser(safe);
      safeSetToStorage('crm_user', safe);
      return { ok: true };
    } catch (error) {
      console.error('Login xatosi:', error);
      return { ok: false, error: 'Login xatosi yuz berdi' };
    }
  };

  const logout = () => {
    setUser(null);
    safeClearStorage('crm_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth faqat AuthProvider ichida ishlatilishi kerak');
  }
  return ctx;
}

export default AuthContext;