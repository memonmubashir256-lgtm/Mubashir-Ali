import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { DEMO_USERS } from '../data/initialData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: {
    email: string;
    password?: string;
    firstName: string;
    lastName: string;
    phone?: string;
    birthDate?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('vyro_auth_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('vyro_auth_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('vyro_auth_user');
      }
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  const login = async (email: string, _password?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    
    // Check known demo users
    const matched = DEMO_USERS.find((u) => u.email.toLowerCase() === cleanEmail);
    if (matched) {
      setUser(matched);
      return { success: true };
    }

    // Allow mock customer sign-in
    const role: Role = cleanEmail.includes('admin') ? 'ADMIN' : 'CUSTOMER';
    const newUser: User = {
      id: `user-${Date.now().toString(36)}`,
      email: cleanEmail,
      firstName: cleanEmail.split('@')[0],
      role,
      isAgeVerified: true,
      ageVerifiedAt: new Date().toISOString(),
    };
    setUser(newUser);
    return { success: true };
  };

  const register = async (data: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    birthDate?: string;
  }) => {
    const cleanEmail = data.email.trim().toLowerCase();
    const newUser: User = {
      id: `user-${Date.now().toString(36)}`,
      email: cleanEmail,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      role: 'CUSTOMER',
      isAgeVerified: true,
      ageVerifiedAt: new Date().toISOString(),
    };
    setUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'COMPLIANCE_OFFICER';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin,
        login,
        register,
        logout,
        showAuthModal,
        setShowAuthModal,
        authModalMode,
        setAuthModalMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
