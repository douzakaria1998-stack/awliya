'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-row antialiased font-sans">
      {/* Desktop Sidebar (Permanent) */}
      <div className="hidden lg:block shrink-0">
        <AdminSidebar />
      </div>

      {/* Mobile Drawer Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex animate-in fade-in">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative z-10 w-72 h-full bg-slate-900 shadow-2xl flex flex-col">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 left-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>
            <AdminSidebar onCloseMobile={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
          {renderActiveScreen()}
        </main>
      </div>
    </div>
  );
}
