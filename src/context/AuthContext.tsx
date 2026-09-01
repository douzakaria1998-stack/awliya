'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Parent } from '@/types';
import { AdminParent } from '@/types/admin';
import { getItem, setItem, removeItem } from '@/lib/localStorage';
import { STORAGE_KEYS } from '@/lib/constants';
import { mockParent } from '@/data/mock';
import { mockAdminParents } from '@/data/adminMock';

interface AuthContextType {
  parent: Parent;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (emailOrPhone: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateParent: (data: Partial<Parent>) => void;
  allRegisteredParents: Parent[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [parent, setParent] = useState<Parent>(mockParent);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(false);

  // Helper to get all registered parents from backoffice storage + mocks
  const getAllParents = useCallback((): Parent[] => {
    const storedAdminParents = getItem<AdminParent[]>(STORAGE_KEYS.ADMIN_PARENTS) || [];
    
    // Merge stored backoffice parents with mock admin parents and mock parent
    const combinedMap = new Map<string, Parent>();

    // 1. Base mock parent
    combinedMap.set(mockParent.id, {
      ...mockParent,
      password: 'Awliya@2026',
      linkedStudentIds: ['student-001', 'student-002', 'student-003'],
    });

    // 2. Mock Admin Parents
    mockAdminParents.forEach((p) => {
      combinedMap.set(p.id, {
        id: p.id,
        fullNameAr: p.fullNameAr,
        fullNameEn: p.fullNameEn,
        email: p.email,
        phone: p.phone,
        password: p.password || 'Awliya@2026',
        address: p.address,
        nationalId: '1098765432',
        linkedStudentIds: p.linkedStudentIds,
      });
    });

    // 3. Stored Admin Parents (created/updated in backoffice)
    storedAdminParents.forEach((p) => {
      combinedMap.set(p.id, {
        id: p.id,
        fullNameAr: p.fullNameAr,
        fullNameEn: p.fullNameEn,
        email: p.email,
        phone: p.phone,
        password: p.password || 'Awliya@2026',
        address: p.address,
        nationalId: '1098765432',
        linkedStudentIds: p.linkedStudentIds,
      });
    });

    return Array.from(combinedMap.values());
  }, []);

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

  const login = useCallback(
    async (emailOrPhone: string, inputPassword: string): Promise<{ success: boolean; message?: string }> => {
      const cleanId = (emailOrPhone || '').trim().toLowerCase();
      const cleanPhone = (emailOrPhone || '').replace(/[\s\-+()]/g, '');
      const cleanPass = (inputPassword || '').trim();

      if (!cleanId || !cleanPass) {
        return { success: false, message: 'missing_credentials' };
      }

      const allParents = getAllParents();

      // Find matching parent by email or phone or name
      const matched = allParents.find((p) => {
        const pEmail = (p.email || '').toLowerCase().trim();
        const pPhone = (p.phone || '').replace(/[\s\-+()]/g, '');
        const pNameAr = (p.fullNameAr || '').toLowerCase().trim();
        const pNameEn = (p.fullNameEn || '').toLowerCase().trim();

        return (
          pEmail === cleanId ||
          (cleanPhone.length > 5 && (pPhone.includes(cleanPhone) || cleanPhone.includes(pPhone))) ||
          pNameAr === cleanId ||
          pNameEn === cleanId
        );
      });

      if (!matched) {
        return { success: false, message: 'parent_not_found' };
      }

      const expectedPassword = matched.password || 'Awliya@2026';

      if (cleanPass !== expectedPassword) {
        return { success: false, message: 'invalid_password' };
      }

      // Success
      setItem(STORAGE_KEYS.AUTH_USER, matched);
      setItem(STORAGE_KEYS.AUTH_STATUS, 'logged_in');
      setParent(matched);
      setIsAuthenticated(true);
      return { success: true };
    },
    [getAllParents]
  );

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
        allRegisteredParents: getAllParents(),
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
