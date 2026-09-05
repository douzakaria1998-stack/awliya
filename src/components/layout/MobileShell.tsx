'use client';

import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Smartphone, Monitor } from 'lucide-react';
import { NavTabKey, PerformanceTabKey, STORAGE_KEYS } from '@/lib/constants';
import { useStudent } from '@/context/StudentContext';
import { useTheme } from '@/context/ThemeContext';
import { BottomNavigation } from './BottomNavigation';
import { LevelThemeTester } from '../common/LevelThemeTester';
import { AddStudentModal } from '../modals/AddStudentModal';
import { DashboardScreen } from '../screens/DashboardScreen';
import { AcademicPathScreen } from '../screens/AcademicPathScreen';
import { PerformanceScreen } from '../screens/PerformanceScreen';
import { FinancialsScreen } from '../screens/FinancialsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

export function MobileShell() {
  const { activeStudent } = useStudent();
  const { theme } = useTheme();

  const [activeTab, setActiveTab] = useState<NavTabKey>('dashboard');
  const [performanceSubTab, setPerformanceSubTab] = useState<PerformanceTabKey>('homework');
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isFullWidth, setIsFullWidth] = useState(false);
  const [currentTime, setCurrentTime] = useState('09:41');

  // Hydrate activeTab & performanceSubTab from URL / localStorage
  useEffect(() => {
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
        // ignore
      }
    };

    syncFromLocation();
    window.addEventListener('popstate', syncFromLocation);
    return () => window.removeEventListener('popstate', syncFromLocation);
  }, []);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
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
      } catch {}
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
      } catch {}
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

  return (
    <div className="device-wrapper">
      {/* Desktop Controls Bar (Device Viewport Mode Toggle) */}
      <aside aria-label="شريط التحكم في نمط العرض" className="w-full max-w-md mb-2 px-3 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5 font-bold text-slate-300">
          <span
            className="w-2.5 h-2.5 rounded-full shadow-xs"
            style={{ backgroundColor: theme.primary }}
          />
          <span>بوابة أولياء الأمور (المستوى {activeStudent.currentLevel})</span>
        </div>

        <button
          type="button"
          onClick={() => setIsFullWidth(!isFullWidth)}
          className="flex items-center gap-1 py-1 px-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
        >
          {isFullWidth ? <Smartphone size={13} /> : <Monitor size={13} />}
          <span>{isFullWidth ? 'إطار الجوال' : 'عرض واسع'}</span>
        </button>
      </aside>

      {/* Main Device Frame */}
      <div className={`device-frame ${isFullWidth ? 'full-width' : ''}`}>
        {/* Interactive 10-Level Theme Tester Bar */}
        <LevelThemeTester />

        {/* Mobile Status Bar (iOS / Android Style) */}
        <header className="w-full pt-3 px-6 pb-2 flex items-center justify-between text-xs font-black text-slate-900 dark:text-white select-none z-20 shrink-0">
          {/* Time (Left in LTR, Right in RTL) */}
          <span className="font-mono text-xs tracking-tight" suppressHydrationWarning>
            {currentTime}
          </span>

          {/* Dynamic Island / Notch */}
          <div className="w-24 h-4 bg-black rounded-full flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 ring-1 ring-slate-800" />
          </div>

          {/* Status Icons */}
          <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
            <span className="text-[10px] font-mono font-bold">5G</span>
            <Wifi size={13} strokeWidth={2.5} />
            <Battery size={15} strokeWidth={2.5} className="text-emerald-500 fill-emerald-500" />
          </div>
        </header>

        {/* Scrollable Screen Content */}
        <main className="app-screen-content">
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

          {activeTab === 'profile' && (
            <ProfileScreen onOpenAddStudent={() => setIsAddStudentOpen(true)} />
          )}
        </main>

        {/* Bottom Navigation (5 Sections RTL) */}
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
