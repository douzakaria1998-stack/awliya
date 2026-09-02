'use client';

import React, { useState, useEffect } from 'react';
import { NavTabKey, PerformanceTabKey } from '@/lib/constants';
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

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNavigate = (tab: NavTabKey, subTab?: PerformanceTabKey) => {
    setActiveTab(tab);
    if (subTab) {
      setPerformanceSubTab(subTab);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen w-full bg-slate-50/70 dark:bg-slate-950 flex items-center justify-center" dir="rtl" suppressHydrationWarning>
        <div className="flex flex-col items-center gap-4" suppressHydrationWarning>
          <div className="w-10 h-10 rounded-full border-3 border-rose-500 border-t-transparent animate-spin" />
          <span className="text-xs font-bold text-slate-400">جاري تحميل بوابة ولي الأمر...</span>
        </div>
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
        onTabChange={setActiveTab}
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
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Global Add Student Modal */}
      <AddStudentModal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
      />
    </div>
  );
}
