'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authUtils, useSession as useSessionHook } from '@/lib/auth';

interface AuthContextType {
  user: any;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const session = useSessionHook();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Update authentication status based on session
    const authenticated = !session.isLoading && session.user && session.user.user_id;
    setIsAuthenticated(authenticated);

    console.log('AuthProvider - session updated:', session, 'authenticated:', authenticated);
  }, [session]);

  const login = async (email: string, password: string) => {
    try {
      await authUtils.loginUser(email, password);
      // The session hook will automatically update due to localStorage changes
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      await authUtils.registerUser(name, email, password);
      // The session hook will automatically update due to localStorage changes
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authUtils.logoutUser();
      // The session hook will automatically update due to localStorage changes
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const value = {
    user: session.user,
    isLoading: session.isLoading,
    isAuthenticated,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}