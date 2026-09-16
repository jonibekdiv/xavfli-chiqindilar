import { createContext, useContext, useEffect, useState } from 'react';
import { DEMO_USERS } from '../data/mockData.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('crm_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem('crm_user');
      }
    }
  }, []);

  const login = (loginValue, password) => {
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
      organization: found.organization,
      stir: found.stir,
      region: found.region
    };
    setUser(safe);
    localStorage.setItem('crm_user', JSON.stringify(safe));
    return { ok: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('crm_user');
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