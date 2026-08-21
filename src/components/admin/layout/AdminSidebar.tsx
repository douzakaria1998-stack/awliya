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
  ChevronRight,
  Sparkles,
  School,
  LogOut,
  GraduationCap,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { AdminRole, AdminTabKey } from '@/types/admin';

interface AdminSidebarProps {
  onCloseMobile?: () => void;
}

export function AdminSidebar({ onCloseMobile }: AdminSidebarProps) {
  const { currentAdmin, currentRole, activeTab, setActiveTab, pendingApprovals, switchRole } = useAdmin();

  const pendingCount = pendingApprovals.filter((a) => a.status === 'pending').length;

  const roleConfig = {
    super_admin: {
      labelAr: 'المدير العام',
      labelEn: 'Super Admin',
      badgeClass: 'bg-purple-500/15 text-purple-600 dark:text-purple-300 border-purple-500/30',
      dotClass: 'bg-purple-500',
    },
    administrator: {
      labelAr: 'الإدارة والقبول',
      labelEn: 'Administrator',
      badgeClass: 'bg-blue-500/15 text-blue-600 dark:text-blue-300 border-blue-500/30',
      dotClass: 'bg-blue-500',
    },
    teacher: {
      labelAr: 'هيئة التدريس',
      labelEn: 'Teacher',
      badgeClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30',
      dotClass: 'bg-emerald-500',
    },
  };

  const navItems: {
    key: AdminTabKey;
    labelAr: string;
    labelEn: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    allowedRoles: AdminRole[];
    countBadge?: number;
  }[] = [
    {
      key: 'overview',
      labelAr: 'لوحة القيادة والمؤشرات',
      labelEn: 'Dashboard Overview',
      icon: LayoutDashboard,
      allowedRoles: ['super_admin', 'administrator', 'teacher'],
    },
    {
      key: 'approvals',
      labelAr: 'طلبات التسجيل المعلقة',
      labelEn: 'Pending Approvals',
      icon: UserCheck,
      allowedRoles: ['super_admin', 'administrator'],
      countBadge: pendingCount > 0 ? pendingCount : undefined,
    },
    {
      key: 'students',
      labelAr: 'إدارة شؤون الطلاب',
      labelEn: 'Students Management',
      icon: Users,
      allowedRoles: ['super_admin', 'administrator'],
    },
    {
      key: 'gradebook',
      labelAr: 'دفتر الدرجات والواجبات',
      labelEn: 'Gradebook & Homework',
      icon: BookOpenCheck,
      allowedRoles: ['super_admin', 'teacher'],
    },
    {
      key: 'attendance',
      labelAr: 'رصد الحضور والورش',
      labelEn: 'Attendance Logger',
      icon: CalendarCheck2,
      allowedRoles: ['super_admin', 'teacher'],
    },
    {
      key: 'users',
      labelAr: 'فريق العمل والصلاحيات',
      labelEn: 'Users & Permissions',
      icon: ShieldCheck,
      allowedRoles: ['super_admin'],
    },
    {
      key: 'settings',
      labelAr: 'إعدادات الأكاديمية والشهادات',
      labelEn: 'Academy Settings',
      icon: Settings,
      allowedRoles: ['super_admin', 'administrator'],
    },
  ];

  const visibleNavItems = navItems.filter((item) => item.allowedRoles.includes(currentRole));

  return (
    <aside className="w-72 bg-slate-900 text-slate-100 flex flex-col justify-between border-l border-slate-800 shrink-0 select-none z-40 h-full min-h-screen">
      {/* Top Branding & User Info */}
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md">
              <School size={22} />
            </div>
            <div>
              <div className="font-black text-base tracking-tight text-white flex items-center gap-1.5">
                <span>My School</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                  Admin
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium">لوحة التحكم الإدارية</div>
            </div>
          </div>
        </div>

        {/* Current Active Admin Profile Banner */}
        <div className="p-4 mx-4 mt-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 shadow-inner">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
              {currentAdmin.fullNameAr.split(' ')[0][0]}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-sm text-white truncate">{currentAdmin.fullNameAr}</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${roleConfig[currentRole].dotClass} animate-pulse`} />
                <span className={`text-[10.5px] font-extrabold px-2 py-0.5 rounded-full border ${roleConfig[currentRole].badgeClass}`}>
                  {roleConfig[currentRole].labelAr}
                </span>
              </div>
            </div>
          </div>

          {/* Specialization / Department */}
          <div className="mt-3 pt-2.5 border-t border-slate-700/50 text-[11px] text-slate-400 truncate flex items-center gap-1">
            <GraduationCap size={13} className="text-slate-500 shrink-0" />
            <span className="truncate">{currentAdmin.departmentAr}</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5 mt-2">
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
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                    : 'text-slate-300 hover:bg-slate-800/90 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                  <span className="truncate">{item.labelAr}</span>
                </div>

                {item.countBadge && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-black ${
                      isActive ? 'bg-white text-rose-600' : 'bg-rose-500 text-white shadow-xs'
                    }`}
                  >
                    {item.countBadge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Role Switcher & Return to Parent Portal */}
      <div className="p-4 border-t border-slate-800 space-y-2 bg-slate-950/40">
        {/* Switch to Parent Portal */}
        <Link
          href="/"
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs transition-all border border-slate-700/60"
        >
          <ExternalLink size={14} />
          <span>العودة لبوابة ولي الأمر (Parent Portal)</span>
        </Link>
      </div>
    </aside>
  );
}
