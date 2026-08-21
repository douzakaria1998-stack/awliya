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
  const { currentAdmin, currentRole, activeTab, setActiveTab, pendingApprovals } = useAdmin();

  const pendingCount = pendingApprovals.filter((a) => a.status === 'pending').length;

  const roleConfig = {
    super_admin: {
      labelAr: 'المدير العام',
      labelEn: 'Super Admin',
      badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      dotClass: 'bg-purple-400',
    },
    administrator: {
      labelAr: 'الإدارة والقبول',
      labelEn: 'Administrator',
      badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      dotClass: 'bg-blue-400',
    },
    teacher: {
      labelAr: 'هيئة التدريس',
      labelEn: 'Teacher',
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      dotClass: 'bg-emerald-400',
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
    <aside className="w-80 bg-slate-900 text-slate-100 flex flex-col justify-between border-l border-slate-800/80 shrink-0 select-none z-40 h-full min-h-screen">
      {/* Top Branding & User Info */}
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="py-6 px-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20 shrink-0">
              <School size={24} />
            </div>
            <div>
              <div className="font-black text-base tracking-tight text-white flex items-center gap-2">
                <span>My School</span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 font-black border border-rose-500/40 uppercase">
                  Admin
                </span>
              </div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">لوحة التحكم الإدارية</div>
            </div>
          </div>
        </div>

        {/* Current Active Admin Profile Banner */}
        <div className="mx-5 my-5 p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-black text-base shadow-sm shrink-0">
              {currentAdmin.fullNameAr.split(' ')[0][0]}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-black text-sm text-white truncate">{currentAdmin.fullNameAr}</div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className={`w-2 h-2 rounded-full ${roleConfig[currentRole].dotClass} animate-pulse`} />
                <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${roleConfig[currentRole].badgeClass}`}>
                  {roleConfig[currentRole].labelAr}
                </span>
              </div>
            </div>
          </div>

          {/* Specialization / Department */}
          <div className="mt-3 pt-3 border-t border-slate-700/60 text-xs text-slate-400 truncate flex items-center gap-1.5">
            <GraduationCap size={14} className="text-slate-400 shrink-0" />
            <span className="truncate">{currentAdmin.departmentAr}</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="px-4 space-y-1.5">
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
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 font-black'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <Icon size={19} className={isActive ? 'text-white' : 'text-slate-400'} />
                  <span className="truncate">{item.labelAr}</span>
                </div>

                {item.countBadge && (
                  <span
                    className={`text-[11px] px-2.5 py-0.5 rounded-full font-black ${
                      isActive ? 'bg-white text-rose-600' : 'bg-amber-500 text-slate-950 shadow-xs'
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

      {/* Bottom Switch to Parent Portal */}
      <div className="p-5 border-t border-slate-800 bg-slate-950/50 mt-4">
        <Link
          href="/"
          className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl bg-slate-800/90 hover:bg-slate-750 text-slate-200 hover:text-white font-bold text-xs transition-all border border-slate-700/70 shadow-sm"
        >
          <ExternalLink size={15} className="text-rose-400" />
          <span>العودة لبوابة ولي الأمر</span>
        </Link>
      </div>
    </aside>
  );
}
