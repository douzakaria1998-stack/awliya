'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { useLanguage } from '@/context/LanguageContext';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AdminDashboardScreen } from '../screens/AdminDashboardScreen';
import { StudentsManagementScreen } from '../screens/StudentsManagementScreen';
import { AdminParentsScreen } from '../screens/AdminParentsScreen';
import { AdminTeachersScreen } from '../screens/AdminTeachersScreen';
import { AdminGroupsScreen } from '../screens/AdminGroupsScreen';
import { AdminAcademicPathScreen } from '../screens/AdminAcademicPathScreen';
import { AdminAttendanceScreen } from '../screens/AdminAttendanceScreen';
import { AdminPerformanceScreen } from '../screens/AdminPerformanceScreen';
import { AdminRolesScreen } from '../screens/AdminRolesScreen';
import { AdminNotificationsScreen } from '../screens/AdminNotificationsScreen';
import { AdminAuditLogsScreen } from '../screens/AdminAuditLogsScreen';
import { SystemSettingsScreen } from '../screens/SystemSettingsScreen';
import { StudentApprovalsScreen } from '../screens/StudentApprovalsScreen';
import { X } from 'lucide-react';

export function AdminShell() {
  const [mounted, setMounted] = useState(false);
  const { activeTab } = useAdmin();
  const { dir } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminDashboardScreen />;
      case 'students':
        return <StudentsManagementScreen />;
      case 'parents':
        return <AdminParentsScreen />;
      case 'teachers':
        return <AdminTeachersScreen />;
      case 'groups':
        return <AdminGroupsScreen />;
      case 'academic':
        return <AdminAcademicPathScreen />;
      case 'attendance':
        return <AdminAttendanceScreen />;
      case 'performance':
        return <AdminPerformanceScreen />;
      case 'roles':
        return <AdminRolesScreen />;
      case 'notifications':
        return <AdminNotificationsScreen />;
      case 'audit':
        return <AdminAuditLogsScreen />;
      case 'settings':
        return <SystemSettingsScreen />;
      case 'approvals':
        return <StudentApprovalsScreen />;
      default:
        return <AdminDashboardScreen />;
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen w-full bg-slate-900 flex items-center justify-center" dir="rtl" suppressHydrationWarning>
        <div className="flex flex-col items-center gap-4" suppressHydrationWarning>
          <div className="w-10 h-10 rounded-full border-3 border-purple-500 border-t-transparent animate-spin" />
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
          <div className="relative z-10 w-[300px] h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 left-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors z-50 cursor-pointer"
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
          className="w-full"
          style={{
            paddingTop: '36px',
            paddingRight: '44px',
            paddingLeft: '44px',
            paddingBottom: '80px',
            maxWidth: '1650px',
            margin: '0 auto',
          }}
        >
          {renderActiveScreen()}
        </main>
      </div>
    </div>
  );
}
