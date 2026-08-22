'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Menu,
  Sun,
  Moon,
  Shield,
  User,
  ChevronDown,
  Check,
  ExternalLink,
  Bell,
  Languages,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { AdminRole } from '@/types/admin';

interface AdminHeaderProps {
  onOpenMobileMenu: () => void;
}

export function AdminHeader({ onOpenMobileMenu }: AdminHeaderProps) {
  const { currentAdmin, currentRole, adminUsers, switchRole, activeTab, setActiveTab, notifications } = useAdmin();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { isRTL, language, setLanguage } = useLanguage();

  const [isRolePickerOpen, setIsRolePickerOpen] = useState(false);
  const rolePickerRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (rolePickerRef.current && !rolePickerRef.current.contains(e.target as Node)) {
        setIsRolePickerOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const tabTitles: Record<string, { ar: string; en: string }> = {
    overview: { ar: 'لوحة القيادة والمؤشرات العامة', en: 'Platform Executive Dashboard' },
    students: { ar: 'قاعدة بيانات وملفات الطلاب', en: 'Students Directory & Academic Profiles' },
    parents: { ar: 'سجل أولياء الأمور وإدارة الأبناء', en: 'Parents Management & Child Linking' },
    teachers: { ar: 'هيئة التدريس وتوزيع الأفواج', en: 'Faculty & Teachers Directory' },
    groups: { ar: 'سجل الأفواج والحصص الدراسية', en: 'Class Groups & Sessions Hub' },
    academic: { ar: 'المسار الأكاديمي وهيكل المناهج', en: 'Academic Path & Curriculum' },
    attendance: { ar: 'رصد الحضور والانضباط اليومي', en: 'Attendance Sheet & Daily Sessions' },
    performance: { ar: 'الواجبات، تقييم المهارات والتوجيه', en: 'Performance, Homework & Assessments' },
    roles: { ar: 'إدارة الأدوار ومصفوفة الصلاحيات', en: 'Admin Roles & Security Matrix' },
    notifications: { ar: 'مركز الإشعارات والتعميمات', en: 'Notifications & Alerts Center' },
    audit: { ar: 'سجل التدقيق والرقابة الإدارية', en: 'Administrative Audit Trail' },
    settings: { ar: 'إعدادات المنظومة والشهادات', en: 'Academy & System Settings' },
    approvals: { ar: 'إدارة طلبات التسجيل المعلقة', en: 'Pending Student Approvals' },
  };

  const roleLabels: Record<AdminRole, { title: string; badge: string; color: string }> = {
    super_admin: {
      title: 'المدير العام (Super Admin)',
      badge: 'صلاحيات كاملة',
      color: 'bg-purple-600',
    },
    administrator: {
      title: 'إداري (Operations Admin)',
      badge: 'القبول والتسجيل',
      color: 'bg-blue-600',
    },
    teacher: {
      title: 'معلم (Teacher)',
      badge: 'هيئة التدريس',
      color: 'bg-emerald-600',
    },
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20 select-none">
      {/* Section Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          aria-label="Open Navigation"
        >
          <Menu size={20} />
        </button>

        <div className="min-w-0">
          <h1 className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate">
            {language === 'ar' ? tabTitles[activeTab]?.ar : tabTitles[activeTab]?.en || 'Back Office'}
          </h1>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5 truncate">
            <span>My School Control Panel</span>
            <span>•</span>
            <span className="text-purple-600 dark:text-purple-400 font-bold">
              {currentRole === 'super_admin' ? 'Super Admin Mode' : currentRole === 'administrator' ? 'Admin Mode' : 'Teacher View'}
            </span>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications Bell */}
        <button
          type="button"
          onClick={() => setActiveTab('notifications')}
          className="relative w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="Notifications"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
          )}
        </button>

        {/* Quick Role Switcher */}
        <div className="relative" ref={rolePickerRef}>
          <button
            type="button"
            onClick={() => setIsRolePickerOpen(!isRolePickerOpen)}
            className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 transition-colors cursor-pointer text-xs font-bold"
          >
            <div className={`w-6 h-6 rounded-full ${roleLabels[currentRole].color} text-white flex items-center justify-center font-bold text-[10px]`}>
              {currentAdmin.fullNameAr[0]}
            </div>
            <span className="hidden sm:inline text-slate-800 dark:text-slate-200 truncate max-w-[130px]">
              {currentAdmin.fullNameAr.split(' ')[0]}
            </span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {isRolePickerOpen && (
            <div
              className={`absolute top-full mt-2 w-64 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 shadow-xl rounded-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 ${
                isRTL ? 'left-0' : 'right-0'
              }`}
            >
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700/60 mb-1">
                <span className="text-[11px] font-bold text-slate-400 block">تبديل الحساب والدور:</span>
              </div>

              <div className="space-y-1">
                {adminUsers.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => {
                      switchRole(user.role, user.id);
                      setIsRolePickerOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      currentAdmin.id === user.id
                        ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] shrink-0 font-black">
                        {user.fullNameAr[0]}
                      </div>
                      <div className="min-w-0 text-right">
                        <div className="truncate text-slate-900 dark:text-white font-bold">{user.fullNameAr}</div>
                        <div className="text-[10px] text-slate-400 font-normal truncate">
                          {user.role === 'super_admin' ? 'Super Admin' : user.role === 'administrator' ? 'Admin' : 'Teacher'}
                        </div>
                      </div>
                    </div>
                    {currentAdmin.id === user.id && <Check size={14} className="text-purple-600 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleDarkMode}
          className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="Toggle Theme"
        >
          {isDarkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
