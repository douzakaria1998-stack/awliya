'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Parent } from '@/types';
import { AdminParent } from '@/types/admin';
import { getItem, setItem, removeItem } from '@/lib/localStorage';
import { STORAGE_KEYS } from '@/lib/constants';
import { mockParent } from '@/data/mock';
import { mockAdminParents } from '@/data/adminMock';
import { supabase } from '@/lib/supabase/client';
import { fetchParentsFromDb } from '@/services/parentService';

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
  const [dbParentsList, setDbParentsList] = useState<Parent[]>([]);

  // Helper to get all registered parents from Supabase + backoffice storage + mocks
  const getAllParents = useCallback((): Parent[] => {
    const storedAdminParents = getItem<AdminParent[]>(STORAGE_KEYS.ADMIN_PARENTS) || [];
    const combinedMap = new Map<string, Parent>();

    // 1. Base mock parent
    combinedMap.set(mockParent.id, {
      ...mockParent,
      password: 'Awliya@2026',
      linkedStudentIds: [],
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

    // 4. Supabase DB Parents
    dbParentsList.forEach((p) => {
      combinedMap.set(p.id, p);
    });

    return Array.from(combinedMap.values());
  }, [dbParentsList]);

  useEffect(() => {
    const syncAuth = async () => {
      const storedStatus = getItem<string>(STORAGE_KEYS.AUTH_STATUS);
      if (storedStatus === 'logged_out') {
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }

      // Fetch live parents from Supabase
      try {
        const liveParents = await fetchParentsFromDb();
        if (liveParents && liveParents.length > 0) {
          const mapped: Parent[] = liveParents.map((p) => ({
            id: p.id,
            fullNameAr: p.fullNameAr,
            fullNameEn: p.fullNameEn,
            email: p.email,
            phone: p.phone,
            password: p.password || 'Awliya@2026',
            address: p.address,
            nationalId: p.nationalId || '1098765432',
            linkedStudentIds: p.linkedStudentIds || [],
          }));
          setDbParentsList(mapped);
        }
      } catch (err) {
        console.warn('Supabase auth parents fetch notice:', err);
      }

      const storedParent = getItem<Parent>(STORAGE_KEYS.AUTH_USER);
      if (storedParent) {
        setParent(storedParent);
      }
      setIsLoading(false);
    };

    const handleSyncEvent = () => {
      setTimeout(syncAuth, 0);
    };

    syncAuth();

    if (typeof window !== 'undefined') {
      window.addEventListener('awliya-data-sync', handleSyncEvent);
      window.addEventListener('storage', handleSyncEvent);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('awliya-data-sync', handleSyncEvent);
        window.removeEventListener('storage', handleSyncEvent);
      }
    };
  }, []);

  const login = useCallback(
    async (emailOrPhone: string, inputPassword: string): Promise<{ success: boolean; message?: string }> => {
      const cleanId = (emailOrPhone || '').trim().toLowerCase();
      const cleanPhone = (emailOrPhone || '').replace(/[\s\-+()]/g, '');
      const cleanPass = (inputPassword || '').trim();

      if (!cleanId || !cleanPass) {
        return { success: false, message: 'missing_credentials' };
      }

      // 1. Direct Supabase Query Check
      let matched: Parent | undefined;

      try {
        const { data: dbRows } = await supabase
          .from('parents')
          .select(`
            *,
            parent_students (
              student_id
            )
          `);

        if (dbRows && dbRows.length > 0) {
          const found = dbRows.find((p: any) => {
            const pEmail = (p.email || '').toLowerCase().trim();
            const pPhone = (p.phone || '').replace(/[\s\-+()]/g, '');
            const pNameAr = (p.full_name_ar || '').toLowerCase().trim();
            const pNameEn = (p.full_name_en || '').toLowerCase().trim();

            return (
              pEmail === cleanId ||
              (cleanPhone.length > 5 && (pPhone.includes(cleanPhone) || cleanPhone.includes(pPhone))) ||
              pNameAr === cleanId ||
              pNameEn === cleanId
            );
          });

          if (found) {
            matched = {
              id: found.id,
              fullNameAr: found.full_name_ar,
              fullNameEn: found.full_name_en || found.full_name_ar,
              email: found.email || '',
              phone: found.phone || '',
              password: 'Awliya@2026',
              address: found.address || '',
              nationalId: found.national_id || '1098765432',
              linkedStudentIds: (found.parent_students || []).map((ps: any) => ps.student_id),
            };
          }
        }
      } catch (err) {
        console.warn('Direct Supabase parent query fallback:', err);
      }

      // 2. Fallback to cached / local parents
      if (!matched) {
        const allParents = getAllParents();
        matched = allParents.find((p) => {
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
      }

      if (!matched) {
        return { success: false, message: 'parent_not_found' };
      }

      const expectedPassword = matched.password || 'Awliya@2026';

      // Allow default portal password, user password, or standard mock passwords
      if (
        cleanPass !== expectedPassword &&
        cleanPass !== 'Awliya@2026' &&
        cleanPass !== '123456' &&
        cleanPass !== 'admin123'
      ) {
        return { success: false, message: 'invalid_password' };
      }

      // Success
      setItem(STORAGE_KEYS.AUTH_USER, matched);
      setItem(STORAGE_KEYS.AUTH_STATUS, 'logged_in');
      setParent(matched);
      setIsAuthenticated(true);

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('awliya-data-sync'));
      }

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
      const updated: Parent = { ...prev, ...data };
      setItem(STORAGE_KEYS.AUTH_USER, updated);

      const storedAdminParents = getItem<AdminParent[]>(STORAGE_KEYS.ADMIN_PARENTS) || [];
      const parentIndex = storedAdminParents.findIndex(
        (p) =>
          p.id === updated.id ||
          (updated.email && p.email?.toLowerCase() === updated.email.toLowerCase()) ||
          (updated.phone && p.phone.replace(/\D/g, '') === (updated.phone || '').replace(/\D/g, ''))
      );

      let newAdminParents = [...storedAdminParents];
      if (parentIndex !== -1) {
        newAdminParents[parentIndex] = {
          ...newAdminParents[parentIndex],
          fullNameAr: updated.fullNameAr || newAdminParents[parentIndex].fullNameAr,
          fullNameEn: updated.fullNameEn || newAdminParents[parentIndex].fullNameEn,
          phone: updated.phone || newAdminParents[parentIndex].phone,
          email: updated.email || newAdminParents[parentIndex].email,
          address: updated.address !== undefined ? updated.address : newAdminParents[parentIndex].address,
        };
        setItem(STORAGE_KEYS.ADMIN_PARENTS, newAdminParents);
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('awliya-data-sync'));
      }

      return updated;
    });
  }, []);

  const allRegisteredParents = getAllParents();

  return (
    <AuthContext.Provider
      value={{
        parent,
        isAuthenticated,
        isLoading,
        login,
        logout,
        updateParent,
        allRegisteredParents,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
