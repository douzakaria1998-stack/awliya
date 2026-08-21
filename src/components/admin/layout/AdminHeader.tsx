'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Menu,
  Sun,
  Moon,
  Globe,
  Bell,
  Shield,
  User,
  GraduationCap,
  Sparkles,
  ChevronDown,
  Check,
  Search,
  ExternalLink,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { AdminRole } from '@/types/admin';

interface AdminHeaderProps {
  onOpenMobileMenu: () => void;
}

export function AdminHeader({ onOpenMobileMenu }: AdminHeaderProps) {
  const { currentAdmin, currentRole, adminUsers, switchRole, activeTab } = useAdmin();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { language, setLanguage, isRTL } = useLanguage();

  const [isRolePickerOpen, setIsRolePickerOpen] = useState(false);
  const [isLangPickerOpen, setIsLangPickerOpen] = useState(false);

  const rolePickerRef = useRef<HTMLDivElement>(null);
  const langPickerRef = useRef<HTMLDivElement>(null);

  // Click-outside listener
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (rolePickerRef.current && !rolePickerRef.current.contains(e.target as Node)) {
        setIsRolePickerOpen(false);
      }
      if (langPickerRef.current && !langPickerRef.current.contains(e.target as Node)) {
        setIsLangPickerOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const tabTitles: Record<string, string> = {
    overview: 'لوحة القيادة والمؤشرات العامة',
    approvals: 'إدارة طلبات تسجيل الأبناء المعلقة',
    students: 'قاعدة بيانات وملفات الطلاب',
    gradebook: 'دفتر تصحيح الواجبات والمهام اللغوية',
    attendance: 'رصد حضور ورش العمل والمحادثة',
    users: 'إدارة فريق العمل والصلاحيات',
    settings: 'إعدادات الأكاديمية والشهادات',
  };

  const roleLabels: Record<AdminRole, { title: string; badge: string; color: string }> = {
    super_admin: {
      title: 'المدير العام (Super Admin)',
      badge: 'صلاحيات كاملة',
      color: 'bg-purple-600',
    },
    administrator: {
      title: 'إداري (Administrator)',
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
    <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Left: Mobile trigger & Current Section Title */}
      <div className="flex items-center gap-4 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Open Navigation"
        >
          <Menu size={22} />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate">
            {tabTitles[activeTab] || 'لوحة التحكم الإدارية'}
          </h1>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2">
            <span>أكاديمية اللغات الدولية</span>
            <span>•</span>
            <span className="text-rose-600 dark:text-rose-400 font-bold">My School Management</span>
          </div>
        </div>
      </div>

      {/* Right Actions: Quick Role Switcher, Theme, Language, Profile */}
      <div className="flex items-center gap-3">
        {/* Quick Role Switcher (Crucial for pair programming & easy review) */}
        <div className="relative" ref={rolePickerRef}>
          <button
            type="button"
            onClick={() => setIsRolePickerOpen(!isRolePickerOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-100 transition-all cursor-pointer shadow-2xs"
          >
            <Shield size={16} className="text-rose-600 dark:text-rose-400" />
            <div className="text-right hidden sm:block">
              <div className="text-[11px] text-slate-400 font-bold leading-tight">تبديل الحساب والدور</div>
              <div className="text-xs font-black truncate max-w-[130px]">{currentAdmin.fullNameAr}</div>
            </div>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {/* Role Switcher Dropdown */}
          {isRolePickerOpen && (
            <div
              className={`absolute top-full mt-2 w-80 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 ${
                isRTL ? 'left-0' : 'right-0'
              }`}
            >
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                <div className="text-xs font-black text-slate-900 dark:text-white">تبديل مستخدم لوحة التحكم</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  اختر أي دور لتجربة الصلاحيات والشاشات المخصصة
                </div>
              </div>

              <div className="space-y-1.5 max-h-[340px] overflow-y-auto">
                {adminUsers.map((user) => {
                  const isCurrent = user.id === currentAdmin.id;
                  const roleMeta = roleLabels[user.role];

                  return (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => {
                        switchRole(user.role, user.id);
                        setIsRolePickerOpen(false);
                      }}
                      className={`w-full p-2.5 rounded-xl flex items-center justify-between gap-3 text-right transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${roleMeta.color}`}
                        >
                          {user.role === 'super_admin' ? <Shield size={14} /> : <User size={14} />}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                            {user.fullNameAr}
                          </div>
                          <div className="text-[10.5px] text-slate-500 dark:text-slate-400 truncate">
                            {user.departmentAr}
                          </div>
                        </div>
                      </div>

                      {isCurrent && <Check size={16} className="text-rose-600 dark:text-rose-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Dark Mode Toggle */}
        <button
          type="button"
          onClick={toggleDarkMode}
          className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700/60"
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
        </button>

        {/* Portal Home Direct Link */}
        <Link
          href="/"
          title="العودة لبوابة ولي الأمر"
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-800 text-xs font-bold transition-all"
        >
          <ExternalLink size={14} />
          <span>بوابة ولي الأمر</span>
        </Link>
      </div>
    </header>
  );
}
