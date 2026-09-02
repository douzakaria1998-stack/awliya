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
    const syncAuth = () => {
      const storedStatus = getItem<string>(STORAGE_KEYS.AUTH_STATUS);
      if (storedStatus === 'logged_out') {
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }

      const storedParent = getItem<Parent>(STORAGE_KEYS.AUTH_USER);
      if (storedParent) {
        // Refresh with latest parent record from admin parents if available
        const storedAdminParents = getItem<AdminParent[]>(STORAGE_KEYS.ADMIN_PARENTS) || [];
        const matchingAdminParent =
          storedAdminParents.find((p) => p.id === storedParent.id) ||
          mockAdminParents.find((p) => p.id === storedParent.id) ||
          storedAdminParents.find(
            (p) =>
              (storedParent.email && p.email?.toLowerCase() === storedParent.email.toLowerCase()) ||
              (storedParent.phone && p.phone === storedParent.phone)
          );
        if (matchingAdminParent) {
          const synced: Parent = {
            ...storedParent,
            id: matchingAdminParent.id,
            fullNameAr: matchingAdminParent.fullNameAr,
            fullNameEn: matchingAdminParent.fullNameEn,
            email: matchingAdminParent.email,
            phone: matchingAdminParent.phone,
            password: matchingAdminParent.password || storedParent.password,
            address: matchingAdminParent.address || storedParent.address,
            linkedStudentIds: matchingAdminParent.linkedStudentIds || storedParent.linkedStudentIds || [],
          };
          setParent(synced);
        } else {
          setParent(storedParent);
        }
      }
      setIsLoading(false);
    };

    syncAuth();

    if (typeof window !== 'undefined') {
      window.addEventListener('awliya-data-sync', syncAuth);
      window.addEventListener('storage', syncAuth);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('awliya-data-sync', syncAuth);
        window.removeEventListener('storage', syncAuth);
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
      const updated: Parent = { ...prev, ...data };
      setItem(STORAGE_KEYS.AUTH_USER, updated);

      // 1. Sync into Backoffice Admin Parents (myschool_admin_parents_v2)
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
      } else {
        // If not yet in storedAdminParents, check mockAdminParents to seed and update
        const matchedMock = mockAdminParents.find(
          (p) =>
            p.id === updated.id ||
            (updated.email && p.email?.toLowerCase() === updated.email.toLowerCase()) ||
            (updated.phone && p.phone.replace(/\D/g, '') === (updated.phone || '').replace(/\D/g, ''))
        );
        if (matchedMock) {
          const syncedMock: AdminParent = {
            ...matchedMock,
            fullNameAr: updated.fullNameAr || matchedMock.fullNameAr,
            fullNameEn: updated.fullNameEn || matchedMock.fullNameEn,
            phone: updated.phone || matchedMock.phone,
            email: updated.email || matchedMock.email,
            address: updated.address !== undefined ? updated.address : matchedMock.address,
          };
          newAdminParents.push(syncedMock);
          setItem(STORAGE_KEYS.ADMIN_PARENTS, newAdminParents);
        }
      }

      // 2. Sync linked students' parentName, parentPhone, parentEmail in Admin Students
      const storedAdminStudents = getItem<any[]>(STORAGE_KEYS.ADMIN_STUDENTS);
      if (storedAdminStudents && storedAdminStudents.length > 0) {
        const updatedStudents = storedAdminStudents.map((st) => {
          const isLinked =
            st.parentId === updated.id ||
            (updated.linkedStudentIds && updated.linkedStudentIds.includes(st.id));
          if (isLinked) {
            return {
              ...st,
              parentName: updated.fullNameAr || st.parentName,
              parentPhone: updated.phone || st.parentPhone,
              parentEmail: updated.email !== undefined ? updated.email : st.parentEmail,
            };
          }
          return st;
        });
        setItem(STORAGE_KEYS.ADMIN_STUDENTS, updatedStudents);
      }

      // 3. Dispatch cross-context synchronization event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('awliya-data-sync'));
      }

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
