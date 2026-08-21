'use client';

import React, { useState } from 'react';
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
  const { activeTab } = useAdmin();
  const { dir, isRTL } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

        <main className="flex-1 p-8 sm:p-12 lg:p-14 max-w-[1450px] w-full mx-auto animate-in fade-in duration-200">
          {renderActiveScreen()}
        </main>
      </div>
    </div>
  );
}
