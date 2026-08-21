'use client';

import React from 'react';
import {
  Users,
  BookOpen,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Award,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Languages,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useStudent } from '@/context/StudentContext';

export function SuperAdminOverview() {
  const { currentRole, pendingApprovals, activityLogs, setActiveTab } = useAdmin();
  const { students } = useStudent();

  const pendingCount = pendingApprovals.filter((a) => a.status === 'pending').length;
  const activeStudentsCount = students.filter((s) => s.status !== 'pending').length;

  const englishCount = students.filter((s) => s.enrolledPathAr?.includes('الإنجليزية') || s.enrolledPathAr?.includes('English')).length;
  const frenchCount = students.filter((s) => s.enrolledPathAr?.includes('الفرنسية') || s.enrolledPathAr?.includes('French')).length;

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* 1. Top Welcome Banner with Refined Spacing and Dedicated Action Row */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white shadow-xl border border-purple-900/50 relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          {/* Role Badge */}
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-black border border-purple-500/30">
              <Sparkles size={14} className="text-amber-400 shrink-0" />
              <span>
                {currentRole === 'super_admin'
                  ? 'بصلاحيات المدير العام التنفيذي • Full Access'
                  : currentRole === 'administrator'
                  ? 'بصلاحيات إدارة التسجيل والشؤون الأكاديمية'
                  : 'بصلاحيات هيئة التدريس وإدارة الواجبات'}
              </span>
            </span>
          </div>

          {/* Heading */}
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-snug text-white">
              مرحباً بك في لوحة تحكم أكاديمية{' '}
              <span dir="ltr" className="inline-block px-2.5 py-0.5 rounded-xl bg-white/10 text-white font-black text-lg sm:text-2xl align-middle">
                My School
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-2xl mt-2">
              متابعة آنية لمسارات اللغتين الإنجليزية والفرنسية، إدارة طلبات أولياء الأمور، تصحيح الواجبات اللغوية، ورصد الحضور بدقة متناهية.
            </p>
          </div>

          {/* Dedicated Action Buttons Row with Safe Spacing */}
          <div className="flex flex-wrap items-center gap-3.5 pt-4 border-t border-purple-800/40">
            {pendingCount > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab('approvals')}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer whitespace-nowrap hover:scale-105 active:scale-95"
              >
                <Clock size={16} />
                <span>مراجعة طلبات التسجيل ({pendingCount})</span>
              </button>
            )}

            {currentRole === 'teacher' ? (
              <button
                type="button"
                onClick={() => setActiveTab('gradebook')}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer whitespace-nowrap hover:scale-105 active:scale-95"
              >
                <BookOpen size={16} />
                <span>فتح دفتر الواجبات والدرجات</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveTab('students')}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer whitespace-nowrap hover:scale-105 active:scale-95"
              >
                <Users size={16} />
                <span>إدارة شؤون الطلاب</span>
              </button>
            )}
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-rose-600/20 blur-3xl pointer-events-none" />
      </div>

      {/* 2. Key Metrics Grid (4 Stat Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Active Students */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">الطلاب النشطون</span>
            <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-2xs">
              <Users size={22} />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
            {activeStudentsCount}
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 pt-1">
            <TrendingUp size={14} />
            <span>100% نسبة استيعاب المقاعد</span>
          </div>
        </div>

        {/* Card 2: Pending Approvals */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">طلبات التسجيل المعلقة</span>
            <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-2xs">
              <Clock size={22} />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
            {pendingCount}
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 pt-1">
            <AlertCircle size={14} />
            <span>بانتظار المراجعة والاعتماد</span>
          </div>
        </div>

        {/* Card 3: Language Tracks */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">مسارات اللغات المعتمدة</span>
            <div className="w-11 h-11 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-2xs">
              <Languages size={22} />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
            2
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 pt-1">
            <span className="text-blue-600 dark:text-blue-400">إنجليزية ({englishCount || 2})</span>
            <span>•</span>
            <span className="text-purple-600 dark:text-purple-400">فرنسية ({frenchCount || 1})</span>
          </div>
        </div>

        {/* Card 4: Certified Levels Completed */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">الشهادات الصادرة (CEFR)</span>
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-2xs">
              <Award size={22} />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
            24
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 pt-1">
            <CheckCircle2 size={14} />
            <span>معتمدة من My School</span>
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Pending Approvals & Live Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left 2 Cols: Pending Approvals Preview */}
        <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold shadow-2xs">
                <Clock size={20} />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  طلبات التسجيل المعلقة ({pendingCount})
                </h3>
                <p className="text-xs text-slate-400 font-medium">مراجعة سريعة لطلبات أولياء الأمور الجديدة</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('approvals')}
              className="text-xs sm:text-sm font-extrabold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>عرض كل الطلبات</span>
              <ArrowUpRight size={15} />
            </button>
          </div>

          {pendingCount === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm font-semibold">
              لا توجد طلبات تسجيل معلقة حالياً
            </div>
          ) : (
            <div className="space-y-3.5">
              {pendingApprovals
                .filter((a) => a.status === 'pending')
                .slice(0, 3)
                .map((appr) => (
                  <div
                    key={appr.id}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-slate-300 dark:hover:border-slate-650"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-rose-500 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-2xs">
                        {appr.studentNameAr[0]}
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <div className="font-black text-sm text-slate-900 dark:text-white truncate">
                          {appr.studentNameAr}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          ولي الأمر: <strong className="text-slate-700 dark:text-slate-200">{appr.parentNameAr}</strong> • {appr.enrolledPathAr}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => setActiveTab('approvals')}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all shadow-2xs cursor-pointer hover:scale-105 active:scale-95 whitespace-nowrap"
                      >
                        معاينة وقبول
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Live Activity Stream */}
        <div className="rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-2xs flex flex-col justify-between space-y-5">
          <div className="space-y-5">
            <div className="flex items-center gap-3.5 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shadow-2xs">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">سجل العمليات</h3>
                <p className="text-xs text-slate-400 font-medium">النشاط الإداري والأكاديمي المباشر</p>
              </div>
            </div>

            <div className="space-y-3.5">
              {activityLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="text-xs space-y-1 pb-3.5 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="font-bold text-slate-700 dark:text-slate-200">{log.actorName}</span>
                    <span className="font-mono text-[11px]">{log.timestamp.split(' ')[1] || log.timestamp}</span>
                  </div>
                  <div className="font-medium text-slate-800 dark:text-slate-300 leading-snug">{log.actionAr}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[11px] text-slate-400 font-medium">سجل العمليات محدث تلقائياً</span>
          </div>
        </div>
      </div>
    </div>
  );
}
