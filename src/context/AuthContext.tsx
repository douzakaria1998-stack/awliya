'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Parent } from '@/types';
import { getItem, setItem, removeItem } from '@/lib/localStorage';
import { STORAGE_KEYS } from '@/lib/constants';
import { mockParent } from '@/data/mock';

interface AuthContextType {
  parent: Parent;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateParent: (data: Partial<Parent>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [parent, setParent] = useState<Parent>(mockParent);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedStatus = getItem<string>(STORAGE_KEYS.AUTH_STATUS);
    if (storedStatus === 'logged_out') {
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }

    const storedParent = getItem<Parent>(STORAGE_KEYS.AUTH_USER);
    if (storedParent) {
      setParent(storedParent);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    if (email) {
      setItem(STORAGE_KEYS.AUTH_USER, mockParent);
      setItem(STORAGE_KEYS.AUTH_STATUS, 'logged_in');
      setParent(mockParent);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setItem(STORAGE_KEYS.AUTH_STATUS, 'logged_out');
    setIsAuthenticated(false);
  }, []);

  const updateParent = useCallback((data: Partial<Parent>) => {
    setParent((prev) => {
      const updated = { ...prev, ...data };
      setItem(STORAGE_KEYS.AUTH_USER, updated);
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        parent,
        isAuthenticated,
        isLoading,
        login,
        logout,
        updateParent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
