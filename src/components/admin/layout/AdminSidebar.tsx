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
  ExternalLink,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useLanguage } from '@/context/LanguageContext';
import { AdminRole, AdminTabKey } from '@/types/admin';

interface AdminSidebarProps {
  onCloseMobile?: () => void;
}

export function AdminSidebar({ onCloseMobile }: AdminSidebarProps) {
  const { currentRole, activeTab, setActiveTab, notifications } = useAdmin();
  const { isRTL, language } = useLanguage();

  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length;

  // Clean, professional navigation categories & clear titles
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
      titleAr: 'الإدارة والتشغيل',
      titleEn: 'MANAGEMENT',
      titleFr: 'GESTION',
      items: [
        {
          key: 'overview',
          labelAr: 'لوحة القيادة',
          labelEn: 'Dashboard',
          labelFr: 'Tableau de bord',
          icon: LayoutDashboard,
          allowedRoles: ['super_admin', 'administrator', 'teacher'],
        },
        {
          key: 'students',
          labelAr: 'الطلاب',
          labelEn: 'Students',
          labelFr: 'Élèves',
          icon: Users,
          allowedRoles: ['super_admin', 'administrator', 'teacher'],
        },
        {
          key: 'parents',
          labelAr: 'أولياء الأمور',
          labelEn: 'Parents',
          labelFr: 'Parents',
          icon: UserCheck,
          allowedRoles: ['super_admin', 'administrator'],
        },
        {
          key: 'teachers',
          labelAr: 'المعلمين',
          labelEn: 'Teachers',
          labelFr: 'Enseignants',
          icon: GraduationCap,
          allowedRoles: ['super_admin', 'administrator'],
        },
        {
          key: 'groups',
          labelAr: 'الأفواج والحصص',
          labelEn: 'Groups & Classes',
          labelFr: 'Groupes & Classes',
          icon: School,
          allowedRoles: ['super_admin', 'administrator', 'teacher'],
        },
      ],
    },
    {
      titleAr: 'الشؤون الأكاديمية',
      titleEn: 'ACADEMIC',
      titleFr: 'ACADÉMIQUE',
      items: [
        {
          key: 'academic',
          labelAr: 'المسار الأكاديمي',
          labelEn: 'Academic Path',
          labelFr: 'Programme Académique',
          icon: BookOpen,
          allowedRoles: ['super_admin', 'administrator', 'teacher'],
        },
        {
          key: 'attendance',
          labelAr: 'الحضور والغياب',
          labelEn: 'Attendance',
          labelFr: 'Présence',
          icon: CalendarCheck2,
          allowedRoles: ['super_admin', 'administrator', 'teacher'],
        },
        {
          key: 'performance',
          labelAr: 'الأداء والتقييمات',
          labelEn: 'Performance & Scores',
          labelFr: 'Performance & Notes',
          icon: Award,
          allowedRoles: ['super_admin', 'administrator', 'teacher'],
        },
      ],
    },
    {
      titleAr: 'الإدارة والرقابة',
      titleEn: 'ADMINISTRATION',
      titleFr: 'ADMINISTRATION',
      items: [
        {
          key: 'roles',
          labelAr: 'صلاحيات المدراء',
          labelEn: 'Admin Roles',
          labelFr: 'Rôles & Accès',
          icon: ShieldCheck,
          allowedRoles: ['super_admin'],
        },
        {
          key: 'notifications',
          labelAr: 'الإشعارات والتنبيهات',
          labelEn: 'Notifications',
          labelFr: 'Notifications',
          icon: Bell,
          allowedRoles: ['super_admin', 'administrator', 'teacher'],
          badgeCount: unreadNotifsCount > 0 ? unreadNotifsCount : undefined,
        },
        {
          key: 'audit',
          labelAr: 'سجل العمليات',
          labelEn: 'Audit Logs',
          labelFr: 'Journal d\'audit',
          icon: History,
          allowedRoles: ['super_admin'],
        },
        {
          key: 'settings',
          labelAr: 'إعدادات المنظومة',
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
      className={`hidden lg:flex flex-col w-[280px] min-w-[280px] max-w-[280px] shrink-0 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 ${
        isRTL ? 'border-l' : 'border-r'
      } border-slate-200/80 dark:border-slate-800 min-h-screen sticky top-0 h-screen z-30 justify-between select-none transition-colors duration-200 ${
        isRTL ? 'text-right' : 'text-left'
      }`}
      suppressHydrationWarning
    >
      <div className="flex flex-col overflow-y-auto flex-1 pb-4">
        {/* 1. Brand Header */}
        <div
          className="h-[70px] border-b border-slate-200/80 dark:border-slate-800 flex items-center gap-3 shrink-0"
          style={{
            paddingRight: isRTL ? '22px' : '16px',
            paddingLeft: isRTL ? '16px' : '22px',
          }}
        >
          <div className="h-10 px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-white border border-slate-200/80 dark:border-transparent flex items-center justify-center shadow-xs shrink-0">
            <img src="/myschool-logo.png" alt="My School" className="h-7 w-auto object-contain" />
          </div>
          <div className="min-w-0">
            <div className="font-black text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>My School</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-purple-500/15 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 font-bold border border-purple-500/30 dark:border-purple-500/40">
                Back Office
              </span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
              {language === 'ar' ? 'لوحة التحكم والمتابعة' : language === 'fr' ? 'Panneau de Contrôle & Suivi' : 'Control & Analytics Panel'}
            </div>
          </div>
        </div>

        {/* 2. Navigation List grouped into Categories with generous spacing */}
        <div className="space-y-6 px-3.5 mt-5">
          {navigationCategories.map((cat, catIdx) => {
            const visibleItems = cat.items.filter((item) => item.allowedRoles.includes(currentRole));
            if (visibleItems.length === 0) return null;

            return (
              <div key={catIdx}>
                {/* Category Title */}
                <div
                  className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 px-3"
                >
                  {language === 'ar' ? cat.titleAr : language === 'fr' ? cat.titleFr : cat.titleEn}
                </div>

                {/* Category Items */}
                <div className="space-y-1.5">
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
                        className={`w-full flex items-center justify-between rounded-xl font-bold text-xs transition-all cursor-pointer group ${
                          isActive
                            ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/90 dark:hover:bg-slate-800/80'
                        }`}
                        style={{
                          height: '42px',
                          paddingLeft: '14px',
                          paddingRight: '14px',
                        }}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Icon
                            size={18}
                            className={
                              isActive
                                ? 'text-white shrink-0'
                                : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-200 shrink-0 transition-colors'
                            }
                          />
                          <span className="truncate text-xs sm:text-[13px] font-bold">
                            {language === 'ar' ? item.labelAr : language === 'fr' ? item.labelFr : item.labelEn}
                          </span>
                        </div>

                        {item.badgeCount !== undefined && item.badgeCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-mono font-black text-[10px] shadow-xs shrink-0">
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

      {/* 3. Bottom Footer Link */}
      <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 shrink-0">
        <Link
          href="/"
          className="w-full py-2.5 px-3.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/70 hover:bg-slate-200/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-bold flex items-center justify-between transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700/50 shadow-2xs"
        >
          <div className="flex items-center gap-2.5">
            <School size={16} className="text-purple-600 dark:text-purple-400 shrink-0" />
            <span className="truncate">
              {language === 'ar' ? 'بوابة أولياء الأمور' : language === 'fr' ? 'Portail Parents' : 'Parent Portal'}
            </span>
          </div>
          <ExternalLink size={14} className="text-slate-400 dark:text-slate-500 shrink-0" />
        </Link>
      </div>
    </aside>
  );
}

