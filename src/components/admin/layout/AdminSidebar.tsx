'use client';

import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  GraduationCap,
  School,
  BookOpen,
  CalendarCheck2,
  Award,
  ShieldCheck,
  Bell,
  History,
  Settings,
  Sparkles,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useLanguage } from '@/context/LanguageContext';
import { AdminRole, AdminTabKey } from '@/types/admin';

interface AdminSidebarProps {
  onCloseMobile?: () => void;
}

export function AdminSidebar({ onCloseMobile }: AdminSidebarProps) {
  const { currentAdmin, currentRole, activeTab, setActiveTab, pendingApprovals, switchRole, notifications } = useAdmin();
  const { isRTL, language } = useLanguage();

  const pendingCount = pendingApprovals.filter((a) => a.status === 'pending').length;
  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length;

  const roleConfig = {
    super_admin: {
      labelAr: 'المدير العام التنفيذي',
      labelEn: 'Super Administrator',
      labelFr: 'Super Administrateur',
      badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      dotClass: 'bg-purple-400',
    },
    administrator: {
      labelAr: 'مدير العمليات والشؤون',
      labelEn: 'Academic Operations Admin',
      labelFr: 'Administrateur Académique',
      badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      dotClass: 'bg-blue-400',
    },
    teacher: {
      labelAr: 'هيئة التدريس (Teacher)',
      labelEn: 'Teacher / Instructor',
      labelFr: 'Enseignant / Formateur',
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      dotClass: 'bg-emerald-400',
    },
  };

  // Section 33 & 35: Recommended Navigation Structure
  const navigationCategories: {
    titleAr: string;
    titleEn: string;
    titleFr: string;
    items: {
      key: AdminTabKey;
      labelAr: string;
      labelEn: string;
      labelFr: string;
      icon: any;
      allowedRoles: AdminRole[];
      badgeCount?: number;
    }[];
  }[] = [
    {
      titleAr: 'الإدارة والتشغيل (Management)',
      titleEn: 'MANAGEMENT',
      titleFr: 'GESTION',
      items: [
        {
          key: 'overview',
          labelAr: 'لوحة القيادة (Dashboard)',
          labelEn: 'Dashboard',
          labelFr: 'Tableau de bord',
          icon: LayoutDashboard,
          allowedRoles: ['super_admin', 'administrator', 'teacher'],
        },
        {
          key: 'students',
          labelAr: 'الطلاب (Students)',
          labelEn: 'Students',
          labelFr: 'Élèves',
          icon: Users,
          allowedRoles: ['super_admin', 'administrator', 'teacher'],
        },
        {
          key: 'parents',
          labelAr: 'أولياء الأمور (Parents)',
          labelEn: 'Parents',
          labelFr: 'Parents',
          icon: UserCheck,
          allowedRoles: ['super_admin', 'administrator'],
        },
        {
          key: 'teachers',
          labelAr: 'المعلمين (Teachers)',
          labelEn: 'Teachers',
          labelFr: 'Enseignants',
          icon: GraduationCap,
          allowedRoles: ['super_admin', 'administrator'],
        },
        {
          key: 'groups',
          labelAr: 'الأفواج والحصص (Groups)',
          labelEn: 'Groups',
          labelFr: 'Groupes & Classes',
          icon: School,
          allowedRoles: ['super_admin', 'administrator', 'teacher'],
        },
      ],
    },
    {
      titleAr: 'الشؤون الأكاديمية (Academic)',
      titleEn: 'ACADEMIC',
      titleFr: 'ACADÉMIQUE',
      items: [
        {
          key: 'academic',
          labelAr: 'المسار الأكاديمي (Path)',
          labelEn: 'Academic Path',
          labelFr: 'Parcours Académique',
          icon: BookOpen,
          allowedRoles: ['super_admin', 'administrator', 'teacher'],
        },
        {
          key: 'attendance',
          labelAr: 'الحضور والغياب (Attendance)',
          labelEn: 'Attendance',
          labelFr: 'Présence',
          icon: CalendarCheck2,
          allowedRoles: ['super_admin', 'administrator', 'teacher'],
        },
        {
          key: 'performance',
          labelAr: 'الأداء والتقييمات (Performance)',
          labelEn: 'Performance',
          labelFr: 'Performance & Notes',
          icon: Award,
          allowedRoles: ['super_admin', 'administrator', 'teacher'],
        },
      ],
    },
    {
      titleAr: 'الإدارة العامة والرقابة (Admin)',
      titleEn: 'ADMINISTRATION',
      titleFr: 'ADMINISTRATION',
      items: [
        {
          key: 'roles',
          labelAr: 'الصلاحيات (Admin Roles)',
          labelEn: 'Admin Roles',
          labelFr: 'Rôles & Permissions',
          icon: ShieldCheck,
          allowedRoles: ['super_admin'],
        },
        {
          key: 'notifications',
          labelAr: 'الإشعارات (Notifications)',
          labelEn: 'Notifications',
          labelFr: 'Notifications',
          icon: Bell,
          allowedRoles: ['super_admin', 'administrator', 'teacher'],
          badgeCount: unreadNotifsCount > 0 ? unreadNotifsCount : undefined,
        },
        {
          key: 'audit',
          labelAr: 'سجل العمليات (Audit Logs)',
          labelEn: 'Audit Logs',
          labelFr: 'Journal d\'audit',
          icon: History,
          allowedRoles: ['super_admin'],
        },
        {
          key: 'settings',
          labelAr: 'إعدادات المنظومة (Settings)',
          labelEn: 'Settings',
          labelFr: 'Paramètres',
          icon: Settings,
          allowedRoles: ['super_admin', 'administrator'],
        },
      ],
    },
  ];

  return (
    <aside
      className={`hidden lg:flex flex-col w-[300px] min-w-[300px] max-w-[300px] shrink-0 bg-slate-900 text-slate-100 ${
        isRTL ? 'border-l' : 'border-r'
      } border-slate-800 min-h-screen sticky top-0 h-screen z-30 justify-between select-none ${
        isRTL ? 'text-right' : 'text-left'
      }`}
      suppressHydrationWarning
    >
      <div className="flex flex-col overflow-y-auto flex-1 pb-4">
        {/* 1. Brand Header */}
        <div
          className="h-20 border-b border-slate-800 flex items-center gap-3 shrink-0"
          style={{
            paddingRight: isRTL ? '24px' : '16px',
            paddingLeft: isRTL ? '16px' : '24px',
          }}
        >
          <div className="h-11 px-2.5 py-1 rounded-xl bg-white flex items-center justify-center shadow-xs shrink-0">
            <img src="/myschool-logo.png" alt="My School" className="h-8 w-auto object-contain" />
          </div>
          <div className="min-w-0">
            <div className="font-black text-sm text-white flex items-center gap-1.5">
              <span>My School</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40">
                Back Office
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              {language === 'ar' ? 'لوحة التحكم والمتابعة' : language === 'fr' ? 'Panneau de Contrôle & Suivi' : 'Control & Analytics Panel'}
            </div>
          </div>
        </div>

        {/* 2. Admin User Profile & Role Switcher Banner */}
        <div
          className="rounded-2xl bg-slate-800/90 border border-slate-700/70 shadow-sm shrink-0"
          style={{
            margin: '16px 20px',
            padding: '14px 16px',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
              {currentAdmin.fullNameAr[0]}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-black text-xs sm:text-sm text-white truncate">
                {currentAdmin.fullNameAr}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${roleConfig[currentRole].dotClass}`} />
                <span className="text-[11px] font-bold text-slate-300 truncate">
                  {language === 'ar' ? roleConfig[currentRole].labelAr : language === 'fr' ? roleConfig[currentRole].labelFr : roleConfig[currentRole].labelEn}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Interactive Role Switcher Pill */}
          <div className="mt-3 pt-2.5 border-t border-slate-700/70 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-bold">
              {language === 'ar' ? 'معاينة دور:' : language === 'fr' ? 'Tester un rôle:' : 'Preview role:'}
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => switchRole('super_admin')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                  currentRole === 'super_admin' ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-300 hover:text-white'
                }`}
                title="Super Admin"
              >
                Super
              </button>
              <button
                type="button"
                onClick={() => switchRole('administrator')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                  currentRole === 'administrator' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:text-white'
                }`}
                title="Admin"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => switchRole('teacher')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                  currentRole === 'teacher' ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300 hover:text-white'
                }`}
                title="Teacher (Sarah Benali)"
              >
                Teacher
              </button>
            </div>
          </div>
        </div>

        {/* 3. Navigation List grouped into 3 Categories (Section 33, 35) */}
        <div className="space-y-7 px-4">
          {navigationCategories.map((cat, catIdx) => {
            const visibleItems = cat.items.filter((item) => item.allowedRoles.includes(currentRole));
            if (visibleItems.length === 0) return null;

            return (
              <div key={catIdx}>
                <div className="px-3 text-[11px] font-black text-slate-400/80 uppercase tracking-wider mb-2.5">
                  {language === 'ar' ? cat.titleAr : language === 'fr' ? cat.titleFr : cat.titleEn}
                </div>

                <div className="space-y-2">
                  {visibleItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.key;
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => {
                          setActiveTab(item.key);
                          if (onCloseMobile) onCloseMobile();
                        }}
                        className={`w-full flex items-center justify-between rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                          isActive
                            ? 'bg-purple-600 text-white shadow-md'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                        }`}
                        style={{ padding: '12px 18px' }}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <Icon size={20} className={isActive ? 'text-white shrink-0' : 'text-slate-400 shrink-0'} />
                          <span className="truncate">
                            {language === 'ar' ? item.labelAr : language === 'fr' ? item.labelFr : item.labelEn}
                          </span>
                        </div>

                        {item.badgeCount !== undefined && item.badgeCount > 0 && (
                          <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white font-mono font-extrabold text-[11px] shadow-xs shrink-0">
                            {item.badgeCount}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Bottom Footer Link */}
      <div className="p-4 border-t border-slate-800 shrink-0">
        <Link
          href="/"
          className="w-full py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <School size={16} className="text-purple-400" />
            <span>
              {language === 'ar' ? 'بوابة أولياء الأمور' : language === 'fr' ? 'Portail Parents' : 'Parent Portal'}
            </span>
          </div>
          <ExternalLink size={14} className="text-slate-500" />
        </Link>
      </div>
    </aside>
  );
}
