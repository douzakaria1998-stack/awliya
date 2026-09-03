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
  const [isLangOpen, setIsLangOpen] = useState(false);

  const rolePickerRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const languagesList: { code: 'ar' | 'en' | 'fr'; label: string; flagUrl: string }[] = [
    { code: 'ar', label: 'العربية', flagUrl: 'https://flagcdn.com/w80/sa.png' },
    { code: 'en', label: 'English', flagUrl: 'https://flagcdn.com/w80/gb.png' },
    { code: 'fr', label: 'Français', flagUrl: 'https://flagcdn.com/w80/fr.png' },
  ];

  const currentLangObj = languagesList.find((l) => l.code === language) || languagesList[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (rolePickerRef.current && !rolePickerRef.current.contains(e.target as Node)) {
        setIsRolePickerOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const tabTitles: Record<string, { ar: string; en: string; fr: string }> = {
    overview: { ar: 'لوحة القيادة والمؤشرات العامة', en: 'Platform Executive Dashboard', fr: 'Tableau de Bord Exécutif' },
    students: { ar: 'قاعدة بيانات وملفات الطلاب', en: 'Students Directory & Academic Profiles', fr: 'Annuaire des Élèves & Profils' },
    parents: { ar: 'سجل أولياء الأمور وإدارة الأبناء', en: 'Parents Management & Child Linking', fr: 'Gestion des Parents & Enfants' },
    teachers: { ar: 'هيئة التدريس وتوزيع الأفواج', en: 'Faculty & Teachers Directory', fr: 'Corps Enseignant & Répartition' },
    groups: { ar: 'سجل الأفواج والحصص الدراسية', en: 'Class Groups & Sessions Hub', fr: 'Groupes & Séances de Cours' },
    academic: { ar: 'المسار الأكاديمي وهيكل المناهج', en: 'Academic Path & Curriculum', fr: 'Parcours Académique & Programmes' },
    attendance: { ar: 'رصد الحضور والانضباط اليومي', en: 'Attendance Sheet & Daily Sessions', fr: 'Feuille de Présence & Séances' },
    performance: { ar: 'الواجبات، تقييم المهارات والتوجيه', en: 'Performance, Homework & Assessments', fr: 'Performance, Devoirs & Évaluations' },
    roles: { ar: 'إدارة الأدوار ومصفوفة الصلاحيات', en: 'Admin Roles & Security Matrix', fr: 'Rôles Administrateurs & Sécurité' },
    notifications: { ar: 'مركز الإشعارات والتعميمات', en: 'Notifications & Alerts Center', fr: 'Centre des Notifications & Alertes' },
    audit: { ar: 'سجل التدقيق والرقابة الإدارية', en: 'Administrative Audit Trail', fr: 'Journal d\'Audit & Surveillance' },
    settings: { ar: 'إعدادات المنظومة والشهادات', en: 'Academy & System Settings', fr: 'Paramètres & Certificats' },
    approvals: { ar: 'إدارة طلبات التسجيل المعلقة', en: 'Pending Student Approvals', fr: 'Demandes d\'Inscription en Attente' },
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
    <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 flex items-center sticky top-0 z-20 select-none w-full">
      <div
        className="w-full flex items-center justify-between mx-auto"
        style={{
          maxWidth: '1650px',
          paddingRight: '44px',
          paddingLeft: '44px',
        }}
      >
        {/* Section Title */}
        <div className="flex items-center gap-3.5 min-w-0">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            aria-label="Open Navigation"
          >
            <Menu size={22} />
          </button>

          <div className="min-w-0 space-y-0.5">
            <h1 className="text-sm sm:text-base md:text-lg font-black text-slate-900 dark:text-white truncate leading-snug">
              {tabTitles[activeTab]?.[language] || tabTitles[activeTab]?.en || 'Back Office'}
            </h1>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-2 truncate">
              <span>My School Control Panel</span>
              <span>•</span>
              <span className="text-purple-600 dark:text-purple-400 font-bold">
                {currentRole === 'super_admin' ? 'Super Admin Mode' : currentRole === 'administrator' ? 'Admin Mode' : 'Teacher View'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
          {/* Language Switcher with Flags */}
          <div className="relative" ref={langRef}>
            <button
              type="button"
              onClick={() => {
                setIsLangOpen(!isLangOpen);
                setIsRolePickerOpen(false);
              }}
              className="flex items-center gap-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 transition-colors cursor-pointer text-xs font-bold border border-slate-200/60 dark:border-slate-700/60"
              style={{ padding: '8px 14px', height: '44px' }}
              title="Change Language / تغيير اللغة / Changer la langue"
            >
              <img
                src={currentLangObj.flagUrl}
                alt={currentLangObj.label}
                className="w-5 h-5 rounded-full object-cover shrink-0 shadow-2xs border border-slate-200 dark:border-slate-700"
              />
              <span className="font-extrabold uppercase font-mono text-slate-800 dark:text-slate-200 text-xs">
                {currentLangObj.code}
              </span>
              <ChevronDown size={14} className={`text-slate-400 shrink-0 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLangOpen && (
              <div
                className={`absolute top-full mt-2.5 min-w-[210px] bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 ${
                  isRTL ? 'left-0 text-right' : 'right-0 text-left'
                }`}
                style={{
                  padding: '8px',
                  borderRadius: '20px',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {languagesList.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => {
                        setLanguage(item.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full flex items-center justify-between text-xs font-bold transition-colors cursor-pointer ${
                        language === item.code
                          ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 font-black'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      style={{
                        padding: '10px 16px',
                        borderRadius: '14px',
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.flagUrl}
                          alt={item.label}
                          className="w-5 h-5 rounded-full object-cover shrink-0 shadow-2xs border border-slate-200 dark:border-slate-700"
                        />
                        <span className="font-bold text-xs sm:text-sm">{item.label}</span>
                      </div>
                      {language === item.code && <Check size={16} className="text-purple-600 stroke-[3] shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <button
            type="button"
            onClick={() => setActiveTab('notifications')}
            className="relative w-11 h-11 rounded-2xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700/60"
            title="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {/* Quick Role Switcher */}
          <div className="relative" ref={rolePickerRef}>
            <button
              type="button"
              onClick={() => {
                setIsRolePickerOpen(!isRolePickerOpen);
                setIsLangOpen(false);
              }}
              className="flex items-center gap-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 transition-colors cursor-pointer text-xs font-bold border border-slate-200/60 dark:border-slate-700/60"
              style={{ padding: '8px 16px', height: '44px' }}
            >
              <div className={`w-7 h-7 rounded-xl ${roleLabels[currentRole].color} text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs`}>
                {currentAdmin.fullNameAr[0]}
              </div>
              <span className="hidden sm:inline text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm truncate max-w-[160px]">
                {currentAdmin.fullNameAr}
              </span>
              <ChevronDown size={16} className="text-slate-400 shrink-0" />
            </button>

            {isRolePickerOpen && (
              <div
                className={`absolute top-full mt-2 w-72 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-2xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2 ${
                  isRTL ? 'left-0 text-right' : 'right-0 text-left'
                }`}
              >
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700/60 mb-2">
                  <span className="text-xs font-bold text-slate-400 block">
                    {language === 'ar' ? 'تبديل الحساب والدور:' : language === 'fr' ? 'Changer de compte & rôle:' : 'Switch Account & Role:'}
                  </span>
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
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        currentAdmin.id === user.id
                          ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs shrink-0 font-black text-slate-800 dark:text-white">
                          {user.fullNameAr[0]}
                        </div>
                        <div className="min-w-0 text-right">
                          <div className="truncate text-slate-900 dark:text-white font-bold text-xs">{user.fullNameAr}</div>
                          <div className="text-[11px] text-slate-400 font-normal truncate">
                            {user.role === 'super_admin' ? 'Super Admin' : user.role === 'administrator' ? 'Admin' : 'Teacher'}
                          </div>
                        </div>
                      </div>
                      {currentAdmin.id === user.id && <Check size={16} className="text-purple-600 shrink-0" />}
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
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700/60"
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
