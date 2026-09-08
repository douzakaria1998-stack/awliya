'use client';

import React, { useState, useEffect } from 'react';
import { NavTabKey, PerformanceTabKey, STORAGE_KEYS } from '@/lib/constants';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { BottomNavigation } from './BottomNavigation';
import { AddStudentModal } from '../modals/AddStudentModal';
import { DashboardScreen } from '../screens/DashboardScreen';
import { AcademicPathScreen } from '../screens/AcademicPathScreen';
import { PerformanceScreen } from '../screens/PerformanceScreen';
import { FinancialsScreen } from '../screens/FinancialsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { NoLinkedStudentsScreen } from '../screens/NoLinkedStudentsScreen';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useStudent } from '@/context/StudentContext';

export function AppLayout() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<NavTabKey>('dashboard');
  const [performanceSubTab, setPerformanceSubTab] = useState<PerformanceTabKey>('homework');
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const { dir, isRTL } = useLanguage();
  const { isAuthenticated, isLoading } = useAuth();
  const { students } = useStudent();

  // 1. Hydrate activeTab and performanceSubTab from URL search params or localStorage on mount
  useEffect(() => {
    setMounted(true);
    if (typeof window === 'undefined') return;

    const validTabs: NavTabKey[] = ['dashboard', 'academic', 'performance', 'financials', 'profile'];
    const validSubTabs: PerformanceTabKey[] = ['homework', 'attendance', 'assessments', 'feedback'];

    const syncFromLocation = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const urlTab = params.get('tab') as NavTabKey | null;
        const urlSubTab = params.get('subTab') as PerformanceTabKey | null;
        const savedTab = localStorage.getItem(STORAGE_KEYS.ACTIVE_TAB) as NavTabKey | null;
        const savedSubTab = localStorage.getItem(STORAGE_KEYS.ACTIVE_PERFORMANCE_SUBTAB) as PerformanceTabKey | null;

        const resolvedTab = (urlTab && validTabs.includes(urlTab))
          ? urlTab
          : (savedTab && validTabs.includes(savedTab))
            ? savedTab
            : 'dashboard';

        const resolvedSubTab = (urlSubTab && validSubTabs.includes(urlSubTab))
          ? urlSubTab
          : (savedSubTab && validSubTabs.includes(savedSubTab))
            ? savedSubTab
            : 'homework';

        setActiveTab(resolvedTab);
        setPerformanceSubTab(resolvedSubTab);
      } catch {
        // ignore storage/url errors
      }
    };

    syncFromLocation();
    window.addEventListener('popstate', syncFromLocation);
    return () => window.removeEventListener('popstate', syncFromLocation);
  }, []);

  const handleTabChange = (tab: NavTabKey) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_TAB, tab);
        const url = new URL(window.location.href);
        url.searchParams.set('tab', tab);
        if (tab !== 'performance') {
          url.searchParams.delete('subTab');
        }
        window.history.replaceState({}, '', url.toString());
      } catch {
        // ignore
      }
    }
  };

  const handlePerformanceSubTabChange = (subTab: PerformanceTabKey) => {
    setPerformanceSubTab(subTab);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_PERFORMANCE_SUBTAB, subTab);
        const url = new URL(window.location.href);
        url.searchParams.set('tab', 'performance');
        url.searchParams.set('subTab', subTab);
        window.history.replaceState({}, '', url.toString());
      } catch {
        // ignore
      }
    }
  };

  const handleNavigate = (tab: NavTabKey, subTab?: PerformanceTabKey) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_TAB, tab);
      } catch {}
    }
    if (subTab) {
      setPerformanceSubTab(subTab);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEYS.ACTIVE_PERFORMANCE_SUBTAB, subTab);
        } catch {}
      }
    }
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('tab', tab);
        if (subTab) {
          url.searchParams.set('subTab', subTab);
        } else if (tab !== 'performance') {
          url.searchParams.delete('subTab');
        }
        window.history.replaceState({}, '', url.toString());
      } catch {}
    }
  };


  if (!mounted || isLoading) {
    return (
      <div
        className="min-h-screen w-full bg-slate-50/70 dark:bg-slate-950 flex items-center justify-center"
        suppressHydrationWarning
      >
        <div
          className="w-8 h-8 rounded-full border-2 border-rose-500 border-t-transparent animate-spin"
          suppressHydrationWarning
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <div
      className="min-h-screen w-full bg-slate-50/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-row justify-start items-stretch"
      dir={dir}
      style={{ direction: dir }}
      suppressHydrationWarning
    >
      {/* 1. Desktop Sidebar (Exact 300px width with comfortable padding) */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpenAddStudent={() => setIsAddStudentOpen(true)}
      />

      {/* 2. Main Content Column */}
      <div
        className="flex-1 min-w-0 flex flex-col min-h-screen bg-slate-50/70 dark:bg-slate-950"
        style={{ flex: 1, minWidth: 0 }}
      >
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          onOpenAddStudent={() => setIsAddStudentOpen(true)}
          onNavigate={handleNavigate}
        />

        {/* Dynamic Screen Content: Generous 32px top padding & 56px margin from sidebar */}
        <main
          className="w-full pb-28 md:pb-16"
          style={{
            width: '100%',
            paddingTop: '32px',
            paddingRight: isRTL ? '56px' : '48px',
            paddingLeft: isRTL ? '48px' : '56px',
          }}
        >
          <div className="w-full max-w-5xl">
            {activeTab === 'profile' ? (
              <ProfileScreen onOpenAddStudent={() => setIsAddStudentOpen(true)} />
            ) : students.length === 0 ? (
              <NoLinkedStudentsScreen />
            ) : (
              <>
                {activeTab === 'dashboard' && (
                  <DashboardScreen
                    onNavigate={handleNavigate}
                    onOpenAddStudent={() => setIsAddStudentOpen(true)}
                  />
                )}

                {activeTab === 'academic' && (
                  <AcademicPathScreen onOpenAddStudent={() => setIsAddStudentOpen(true)} />
                )}

                {activeTab === 'performance' && (
                  <PerformanceScreen
                    initialTab={performanceSubTab}
                    onTabChange={handlePerformanceSubTabChange}
                    onOpenAddStudent={() => setIsAddStudentOpen(true)}
                  />
                )}

                {activeTab === 'financials' && (
                  <FinancialsScreen onOpenAddStudent={() => setIsAddStudentOpen(true)} />
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* 3. Mobile Bottom Navigation */}
      <div className="block md:hidden">
        <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      </div>

      {/* Global Add Student Modal */}
      <AddStudentModal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
      />
    </div>
  );
}
