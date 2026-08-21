'use client';

import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  UserCheck,
  Users,
  BookOpenCheck,
  CalendarCheck2,
  ShieldCheck,
  Settings,
  ExternalLink,
  School,
  GraduationCap,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useLanguage } from '@/context/LanguageContext';
import { AdminRole, AdminTabKey } from '@/types/admin';

interface AdminSidebarProps {
  onCloseMobile?: () => void;
}

export function AdminSidebar({ onCloseMobile }: AdminSidebarProps) {
  const { currentAdmin, currentRole, activeTab, setActiveTab, pendingApprovals } = useAdmin();
  const { isRTL } = useLanguage();

  const pendingCount = pendingApprovals.filter((a) => a.status === 'pending').length;

  const roleConfig = {
    super_admin: {
      labelAr: 'المدير العام',
      badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      dotClass: 'bg-purple-400',
    },
    administrator: {
      labelAr: 'الإدارة والقبول',
      badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      dotClass: 'bg-blue-400',
    },
    teacher: {
      labelAr: 'هيئة التدريس',
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      dotClass: 'bg-emerald-400',
    },
  };

  const navItems: {
    key: AdminTabKey;
    labelAr: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    allowedRoles: AdminRole[];
    countBadge?: number;
  }[] = [
    {
      key: 'overview',
      labelAr: 'لوحة القيادة والمؤشرات',
      icon: LayoutDashboard,
      allowedRoles: ['super_admin', 'administrator', 'teacher'],
    },
    {
      key: 'approvals',
      labelAr: 'طلبات التسجيل المعلقة',
      icon: UserCheck,
      allowedRoles: ['super_admin', 'administrator'],
      countBadge: pendingCount > 0 ? pendingCount : undefined,
    },
    {
      key: 'students',
      labelAr: 'إدارة شؤون الطلاب',
      icon: Users,
      allowedRoles: ['super_admin', 'administrator'],
    },
    {
      key: 'gradebook',
      labelAr: 'دفتر الدرجات والواجبات',
      icon: BookOpenCheck,
      allowedRoles: ['super_admin', 'teacher'],
    },
    {
      key: 'attendance',
      labelAr: 'رصد الحضور والورش',
      icon: CalendarCheck2,
      allowedRoles: ['super_admin', 'teacher'],
    },
    {
      key: 'users',
      labelAr: 'فريق العمل والصلاحيات',
      icon: ShieldCheck,
      allowedRoles: ['super_admin'],
    },
    {
      key: 'settings',
      labelAr: 'إعدادات الأكاديمية والشهادات',
      icon: Settings,
      allowedRoles: ['super_admin', 'administrator'],
    },
  ];

  const visibleNavItems = navItems.filter((item) => item.allowedRoles.includes(currentRole));

  return (
    <aside
      className={`hidden lg:flex flex-col w-[300px] min-w-[300px] max-w-[300px] shrink-0 bg-slate-900 text-slate-100 ${
        isRTL ? 'border-l' : 'border-r'
      } border-slate-800 min-h-screen sticky top-0 h-screen z-30 justify-between select-none ${
        isRTL ? 'text-right' : 'text-left'
      }`}
      suppressHydrationWarning
    >
      <div className="flex flex-col overflow-y-auto">
        {/* 1. Brand Header */}
        <div
          className="h-16 border-b border-slate-800 flex items-center gap-3 shrink-0"
          style={{
            paddingRight: isRTL ? '32px' : '20px',
            paddingLeft: isRTL ? '20px' : '32px',
          }}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md shrink-0">
            <School size={20} />
          </div>
          <div className="min-w-0">
            <div className="font-black text-sm text-white flex items-center gap-1.5">
              <span>My School</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40">
                Admin
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium">لوحة التحكم الإدارية</div>
          </div>
        </div>

        {/* 2. Admin User Profile Banner */}
        <div
          className="rounded-2xl bg-slate-800/90 border border-slate-700/70 shadow-sm shrink-0"
          style={{
            margin: '16px 20px',
            padding: '14px 16px',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
              {currentAdmin.fullNameAr.split(' ')[0][0]}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-black text-xs sm:text-sm text-white truncate">
                {currentAdmin.fullNameAr}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${roleConfig[currentRole].dotClass} animate-pulse`} />
                <span className={`text-[10.5px] font-extrabold px-2 py-0.5 rounded-full border ${roleConfig[currentRole].badgeClass}`}>
                  {roleConfig[currentRole].labelAr}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-700/60 text-[11px] text-slate-400 truncate flex items-center gap-1.5">
            <GraduationCap size={13} className="text-slate-400 shrink-0" />
            <span className="truncate">{currentAdmin.departmentAr}</span>
          </div>
        </div>

        {/* 3. Navigation List */}
        <div
          className="flex flex-col gap-1.5"
          style={{
            paddingRight: isRTL ? '20px' : '16px',
            paddingLeft: isRTL ? '16px' : '20px',
          }}
        >
          {visibleNavItems.map((item) => {
            const isActive = activeTab === item.key;
            const Icon = item.icon;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  setActiveTab(item.key);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between h-11 px-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25 font-black'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                  <span className="truncate">{item.labelAr}</span>
                </div>

                {item.countBadge && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-black ${
                      isActive ? 'bg-white text-rose-600' : 'bg-amber-500 text-slate-950 shadow-xs'
                    }`}
                  >
                    {item.countBadge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Bottom Link to Parent Portal */}
      <div
        className="border-t border-slate-800 bg-slate-950/60 shrink-0"
        style={{
          padding: '16px 20px',
        }}
      >
        <Link
          href="/"
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-750 text-slate-200 hover:text-white font-bold text-xs transition-all border border-slate-700/60 shadow-xs"
        >
          <ExternalLink size={14} className="text-rose-400" />
          <span>العودة لبوابة ولي الأمر</span>
        </Link>
      </div>
    </aside>
  );
}
