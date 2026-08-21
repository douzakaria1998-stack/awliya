'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { useLanguage } from '@/context/LanguageContext';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { SuperAdminOverview } from '../screens/SuperAdminOverview';
import { StudentApprovalsScreen } from '../screens/StudentApprovalsScreen';
import { StudentsManagementScreen } from '../screens/StudentsManagementScreen';
import { TeacherGradebookScreen } from '../screens/TeacherGradebookScreen';
import { TeacherAttendanceScreen } from '../screens/TeacherAttendanceScreen';
import { AdminUsersScreen } from '../screens/AdminUsersScreen';
import { SystemSettingsScreen } from '../screens/SystemSettingsScreen';
import { X } from 'lucide-react';

export function AdminShell() {
  const [mounted, setMounted] = useState(false);
  const { activeTab } = useAdmin();
  const { dir, isRTL } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'overview':
        return <SuperAdminOverview />;
      case 'approvals':
        return <StudentApprovalsScreen />;
      case 'students':
        return <StudentsManagementScreen />;
      case 'gradebook':
        return <TeacherGradebookScreen />;
      case 'attendance':
        return <TeacherAttendanceScreen />;
      case 'users':
        return <AdminUsersScreen />;
      case 'settings':
        return <SystemSettingsScreen />;
      default:
        return <SuperAdminOverview />;
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen w-full bg-slate-900 flex items-center justify-center" dir="rtl">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-3 border-rose-500 border-t-transparent animate-spin" />
          <span className="text-xs font-bold text-slate-400">جاري تحميل لوحة التحكم...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full bg-slate-50/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-row justify-start items-stretch"
      dir={dir}
      style={{ direction: dir }}
      suppressHydrationWarning
    >
      {/* 1. Desktop Sidebar (Exact 300px width with comfortable sticky behavior) */}
      <AdminSidebar />

      {/* 2. Mobile Drawer Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex animate-in fade-in">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative z-10 w-[300px] h-full bg-slate-900 shadow-2xl flex flex-col">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 left-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white z-50"
            >
              <X size={18} />
            </button>
            <AdminSidebar onCloseMobile={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* 3. Main Content Column */}
      <div
        className="flex-1 min-w-0 flex flex-col min-h-screen bg-slate-50/70 dark:bg-slate-950"
        style={{ flex: 1, minWidth: 0 }}
      >
        <AdminHeader onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

        <main
          className="w-full pb-28 md:pb-16"
          style={{
            width: '100%',
            paddingTop: '32px',
            paddingRight: isRTL ? '56px' : '48px',
            paddingLeft: isRTL ? '48px' : '56px',
          }}
        >
          <div className="w-full max-w-6xl">
            {renderActiveScreen()}
          </div>
        </main>
      </div>
    </div>
  );
}
