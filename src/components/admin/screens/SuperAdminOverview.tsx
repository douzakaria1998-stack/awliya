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
    <div className="w-full pb-8">
      {/* 1. Top Welcome Banner with Generous 4-Side Padding & Margins */}
      <div
        className="rounded-[32px] bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white shadow-xl border border-purple-900/50 relative overflow-hidden"
        style={{
          padding: '36px 40px',
          marginBottom: '32px',
        }}
      >
        <div className="relative z-10 space-y-5">
          {/* Role Badge */}
          <div>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-black border border-purple-500/30">
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

          {/* Heading & Subtitle */}
          <div className="space-y-2.5">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-snug text-white">
              مرحباً بك في لوحة تحكم أكاديمية{' '}
              <span dir="ltr" className="inline-block px-2.5 py-0.5 rounded-xl bg-white/10 text-white font-black text-lg sm:text-2xl align-middle">
                My School
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-2xl">
              متابعة آنية لمسارات اللغتين الإنجليزية والفرنسية، إدارة طلبات أولياء الأمور، تصحيح الواجبات اللغوية، ورصد الحضور بدقة متناهية.
            </p>
          </div>

          {/* Dedicated Action Buttons Row */}
          <div className="flex flex-wrap items-center gap-4 pt-5 border-t border-purple-800/40">
            {pendingCount > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab('approvals')}
                className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-md flex items-center gap-2.5 cursor-pointer whitespace-nowrap hover:scale-105 active:scale-95 shrink-0"
              >
                <Clock size={18} className="shrink-0" />
                <span>مراجعة طلبات التسجيل ({pendingCount})</span>
              </button>
            )}

            {currentRole === 'teacher' ? (
              <button
                type="button"
                onClick={() => setActiveTab('gradebook')}
                className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2.5 cursor-pointer whitespace-nowrap hover:scale-105 active:scale-95 shrink-0"
              >
                <BookOpen size={18} className="shrink-0" />
                <span>فتح دفتر الواجبات والدرجات</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveTab('students')}
                className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2.5 cursor-pointer whitespace-nowrap hover:scale-105 active:scale-95 shrink-0"
              >
                <Users size={18} className="shrink-0" />
                <span>إدارة شؤون الطلاب</span>
              </button>
            )}
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-rose-600/20 blur-3xl pointer-events-none" />
      </div>

      {/* 2. Key Metrics Grid (4 Stat Cards with Generous 4-Side Padding & Margins) */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        style={{
          gap: '24px',
          marginBottom: '32px',
        }}
      >
        {/* Card 1: Active Students */}
        <div
          className="rounded-[28px] bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3.5 transition-all hover:shadow-md"
          style={{
            padding: '28px 32px',
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">الطلاب النشطون</span>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-2xs">
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
        <div
          className="rounded-[28px] bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3.5 transition-all hover:shadow-md"
          style={{
            padding: '28px 32px',
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">طلبات التسجيل المعلقة</span>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-2xs">
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
        <div
          className="rounded-[28px] bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3.5 transition-all hover:shadow-md"
          style={{
            padding: '28px 32px',
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">مسارات اللغات المعتمدة</span>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-2xs">
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
        <div
          className="rounded-[28px] bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3.5 transition-all hover:shadow-md"
          style={{
            padding: '28px 32px',
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">الشهادات الصادرة (CEFR)</span>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-2xs">
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

      {/* 3. Middle Section: Pending Approvals & Live Activity Stream with Generous 4-Side Padding */}
      <div
        className="grid grid-cols-1 lg:grid-cols-3"
        style={{
          gap: '28px',
        }}
      >
        {/* Left 2 Cols: Pending Approvals Container with Generous 4-Side Padding */}
        <div
          className="lg:col-span-2 rounded-[32px] bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6"
          style={{
            padding: '32px 36px',
          }}
        >
          {/* Header Row */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold shadow-2xs shrink-0">
                <Clock size={22} />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  طلبات التسجيل المعلقة ({pendingCount})
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">مراجعة سريعة لطلبات أولياء الأمور الجديدة</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('approvals')}
              className="text-xs sm:text-sm font-extrabold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <span>عرض كل الطلبات</span>
              <ArrowUpRight size={15} />
            </button>
          </div>

          {/* Pending List */}
          {pendingCount === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm font-semibold">
              لا توجد طلبات تسجيل معلقة حالياً
            </div>
          ) : (
            <div className="space-y-4">
              {pendingApprovals
                .filter((a) => a.status === 'pending')
                .slice(0, 3)
                .map((appr) => (
                  <div
                    key={appr.id}
                    className="rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-slate-300 dark:hover:border-slate-650 hover:shadow-xs"
                    style={{
                      padding: '18px 24px',
                    }}
                  >
                    {/* Student Info with Avatar */}
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-rose-500 text-white font-black text-base flex items-center justify-center shrink-0 shadow-xs">
                        {appr.studentNameAr[0]}
                      </div>
                      <div className="min-w-0 space-y-1">
                        <div className="font-black text-sm sm:text-base text-slate-900 dark:text-white truncate">
                          {appr.studentNameAr}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          ولي الأمر: <strong className="text-slate-700 dark:text-slate-200">{appr.parentNameAr}</strong> • {appr.enrolledPathAr}
                        </div>
                      </div>
                    </div>

                    {/* Action Button with safe margins */}
                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => setActiveTab('approvals')}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer hover:scale-105 active:scale-95 whitespace-nowrap"
                      >
                        معاينة وقبول
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Live Activity Stream with Generous 4-Side Padding */}
        <div
          className="rounded-[32px] bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between"
          style={{
            padding: '32px 36px',
          }}
        >
          <div className="space-y-6">
            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="w-11 h-11 rounded-2xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shadow-2xs shrink-0">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">سجل العمليات</h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">النشاط الإداري والأكاديمي المباشر</p>
              </div>
            </div>

            {/* List of activity items with generous internal and external margins */}
            <div className="space-y-3.5">
              {activityLogs.slice(0, 4).map((log) => (
                <div
                  key={log.id}
                  className="rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/60 transition-all hover:border-slate-300 dark:hover:border-slate-650"
                  style={{
                    padding: '16px 20px',
                  }}
                >
                  <div className="flex items-center justify-between text-slate-400 pb-1.5 border-b border-slate-100 dark:border-slate-750/70 mb-2">
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200">{log.actorName}</span>
                    <span className="font-mono text-[11px] text-slate-400 font-semibold">{log.timestamp.split(' ')[1] || log.timestamp}</span>
                  </div>
                  <div className="font-medium text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed">
                    {log.actionAr}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <span className="text-xs text-slate-400 font-medium">سجل العمليات محدث تلقائياً</span>
          </div>
        </div>
      </div>
    </div>
  );
}
