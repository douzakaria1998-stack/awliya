'use client';

import React from 'react';
import {
  Users,
  UserCheck,
  GraduationCap,
  School,
  CalendarCheck2,
  TrendingUp,
  AlertTriangle,
  Award,
  BookOpen,
  Sparkles,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  ChevronRight,
  Languages,
  Activity,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useLanguage } from '@/context/LanguageContext';

export function AdminDashboardScreen() {
  const {
    currentRole,
    students,
    parents,
    teachers,
    groups,
    pendingApprovals,
    attendanceSessions,
    setActiveTab,
    visibleStudents,
    visibleGroups,
  } = useAdmin();
  const { isRTL, language } = useLanguage();

  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === 'active').length;
  const totalParents = parents.length;
  const totalTeachers = teachers.length;
  const totalGroups = groups.length;
  const activeGroups = groups.filter((g) => g.status === 'active').length;

  const avgAttendance = Math.round(
    students.reduce((acc, s) => acc + s.attendanceRate, 0) / (students.length || 1)
  );
  const avgPerformance = Math.round(
    students.reduce((acc, s) => acc + s.averagePerformance, 0) / (students.length || 1)
  );

  const pendingCount = pendingApprovals.filter((a) => a.status === 'pending').length;
  const fallingBehindStudents = visibleStudents.filter((s) => s.isFallingBehind || s.attendanceRate < 75 || s.overallProgress < 50);

  // Level Progress Distribution (CEFR Levels)
  const levelProgressData = [
    { level: 'A1', nameAr: 'المبتدئ والتأسيس', nameEn: 'Beginner A1', count: students.filter((s) => s.cefrLevel === 'A1').length, progress: 82 },
    { level: 'A2', nameAr: 'الأساسي والتطبيق', nameEn: 'Elementary A2', count: students.filter((s) => s.cefrLevel === 'A2').length, progress: 76 },
    { level: 'B1', nameAr: 'المتوسط والاستقلالية', nameEn: 'Intermediate B1', count: students.filter((s) => s.cefrLevel === 'B1').length, progress: 84 },
    { level: 'B2', nameAr: 'فوق المتوسط والطلاقة', nameEn: 'Upper Intermediate B2', count: students.filter((s) => s.cefrLevel === 'B2').length, progress: 90 },
    { level: 'C1', nameAr: 'المتقدم والاحترافي', nameEn: 'Advanced C1', count: 0, progress: 95 },
  ];

  return (
    <div className={`w-full select-none ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* 1. Welcome Banner */}
      <div
        className="rounded-[32px] bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white shadow-xl border border-purple-900/50 relative overflow-hidden"
        style={{
          padding: '36px 40px',
          marginBottom: '36px',
        }}
      >
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-black border border-purple-500/30">
              <Sparkles size={14} className="text-amber-400 shrink-0" />
              <span>
                {currentRole === 'super_admin'
                  ? 'Super Admin Dashboard • Full Platform Access'
                  : currentRole === 'administrator'
                  ? 'Academic & Operations Admin Dashboard'
                  : 'Teacher Dashboard • My Groups & Classes'}
              </span>
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {language === 'ar' ? 'لوحة المتابعة الشاملة والمؤشرات الأكاديمية' : language === 'fr' ? 'Tableau de Bord & Indicateurs Globaux' : 'Platform Executive Overview & Analytics'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl leading-relaxed">
              {language === 'ar'
                ? 'نظرة عامة متكاملة على إحصائيات الطلاب، الأفواج التعليمية، معدلات الحضور والتقدم في مساري الإنجليزية والفرنسية.'
                : 'Real-time monitoring of students, class groups, attendance rates, and curriculum progress across languages.'}
            </p>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-purple-800/40">
            {pendingCount > 0 && currentRole !== 'teacher' && (
              <button
                type="button"
                onClick={() => setActiveTab('approvals')}
                className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Clock size={16} />
                <span>{language === 'ar' ? `طلبات التسجيل المعلقة (${pendingCount})` : `Pending Approvals (${pendingCount})`}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setActiveTab('groups')}
              className="px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition-all border border-white/20 flex items-center gap-2 cursor-pointer"
            >
              <School size={16} />
              <span>{language === 'ar' ? 'استعراض الأفواج والحصص' : 'View Groups & Sessions'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top 8 KPI Statistics Cards (Section 4, 39) */}
      <div style={{ marginBottom: '36px' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Activity size={20} className="text-purple-600 dark:text-purple-400" />
            <span>{language === 'ar' ? 'المؤشرات الرئيسية للمنصة (Platform KPIs)' : 'Platform Key Statistics'}</span>
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {/* Total Students */}
          <div
            onClick={() => setActiveTab('students')}
            className="rounded-[24px] bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-blue-400 transition-all cursor-pointer flex flex-col justify-between"
            style={{ padding: '24px 26px' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400">{language === 'ar' ? 'إجمالي الطلاب' : 'Total Students'}</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
                <Users size={16} />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
              {totalStudents}
            </div>
            <span className="text-[11px] font-bold text-emerald-600 mt-1 block">
              {activeStudents} {language === 'ar' ? 'طالب نشط' : 'active'}
            </span>
          </div>

          {/* Total Parents */}
          <div
            onClick={() => setActiveTab('parents')}
            className="rounded-[24px] bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-purple-400 transition-all cursor-pointer flex flex-col justify-between"
            style={{ padding: '24px 26px' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400">{language === 'ar' ? 'أولياء الأمور' : 'Total Parents'}</span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
                <UserCheck size={16} />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
              {totalParents}
            </div>
            <span className="text-[11px] font-bold text-slate-400 mt-1 block">
              {language === 'ar' ? 'حسابات مربوطة بالأبناء' : 'Linked parent accounts'}
            </span>
          </div>

          {/* Total Teachers */}
          <div
            onClick={() => setActiveTab('teachers')}
            className="rounded-[24px] bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-emerald-400 transition-all cursor-pointer flex flex-col justify-between"
            style={{ padding: '24px 26px' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400">{language === 'ar' ? 'هيئة التدريس' : 'Total Teachers'}</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                <GraduationCap size={16} />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
              {totalTeachers}
            </div>
            <span className="text-[11px] font-bold text-slate-400 mt-1 block">
              {language === 'ar' ? 'معلمين معتمدين' : 'Certified instructors'}
            </span>
          </div>

          {/* Total Groups */}
          <div
            onClick={() => setActiveTab('groups')}
            className="rounded-[24px] bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-amber-400 transition-all cursor-pointer flex flex-col justify-between"
            style={{ padding: '24px 26px' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400">{language === 'ar' ? 'الأفواج النشطة' : 'Active Groups'}</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                <School size={16} />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
              {activeGroups} / {totalGroups}
            </div>
            <span className="text-[11px] font-bold text-amber-600 mt-1 block">
              {language === 'ar' ? 'فوج دراسي نشط' : 'Active classes'}
            </span>
          </div>

          {/* Attendance Rate */}
          <div
            onClick={() => setActiveTab('attendance')}
            className="rounded-[24px] bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-teal-400 transition-all cursor-pointer flex flex-col justify-between"
            style={{ padding: '24px 26px' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400">{language === 'ar' ? 'نسبة الانضباط والحضور' : 'Attendance Rate'}</span>
              <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center">
                <CalendarCheck2 size={16} />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
              {avgAttendance}%
            </div>
            <span className="text-[11px] font-bold text-teal-600 mt-1 block">
              {language === 'ar' ? 'متوسط انضباط ممتاز' : 'High engagement'}
            </span>
          </div>

          {/* Average Performance */}
          <div
            onClick={() => setActiveTab('performance')}
            className="rounded-[24px] bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-rose-400 transition-all cursor-pointer flex flex-col justify-between"
            style={{ padding: '24px 26px' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400">{language === 'ar' ? 'المعدل العام للأداء' : 'Average Performance'}</span>
              <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
                <Award size={16} />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
              {avgPerformance}%
            </div>
            <span className="text-[11px] font-bold text-rose-600 mt-1 block">
              {language === 'ar' ? 'تقدير عام: جيد جداً' : 'Very Good Overall'}
            </span>
          </div>

          {/* English Track Students */}
          <div
            onClick={() => setActiveTab('students')}
            className="rounded-[24px] bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-indigo-400 transition-all cursor-pointer flex flex-col justify-between"
            style={{ padding: '24px 26px' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400">{language === 'ar' ? 'مسار الإنجليزية' : 'English Track'}</span>
              <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
                <BookOpen size={16} />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-indigo-600 font-mono">
              {students.filter((s) => s.language === 'English' || s.language === 'Dual').length}
            </div>
            <span className="text-[11px] font-bold text-slate-400 mt-1 block">
              CEFR A1–B2
            </span>
          </div>

          {/* French Track Students */}
          <div
            onClick={() => setActiveTab('students')}
            className="rounded-[24px] bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-violet-400 transition-all cursor-pointer flex flex-col justify-between"
            style={{ padding: '24px 26px' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400">{language === 'ar' ? 'مسار الفرنسية' : 'French Track'}</span>
              <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 flex items-center justify-center">
                <Languages size={16} />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-violet-600 font-mono">
              {students.filter((s) => s.language === 'French' || s.language === 'Dual').length}
            </div>
            <span className="text-[11px] font-bold text-slate-400 mt-1 block">
              DELF / DALF
            </span>
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Student Progress by Level + Attendance Breakdown (Section 39) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ marginBottom: '36px' }}>
        {/* Student Progress By Level */}
        <div
          className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-[28px] shadow-xs flex flex-col justify-between"
          style={{ padding: '32px 36px' }}
        >
          <div>
            <div className="flex items-center justify-between mb-5">
              <h4 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp size={18} className="text-indigo-600" />
                <span>{language === 'ar' ? 'نسبة الإنجاز الأكاديمي حسب المستويات' : 'Student Progress by Level'}</span>
              </h4>
              <button
                type="button"
                onClick={() => setActiveTab('academic')}
                className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
              >
                {language === 'ar' ? 'عرض المسار' : 'View Path'} →
              </button>
            </div>

            <div className="space-y-4">
              {levelProgressData.map((item) => (
                <div key={item.level} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                    <span className="text-slate-700 dark:text-slate-200 font-mono">
                      {item.level} — {language === 'ar' ? item.nameAr : item.nameEn} ({item.count} {language === 'ar' ? 'طلاب' : 'students'})
                    </span>
                    <span className="font-mono font-black text-indigo-600">{item.progress}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Attendance Breakdown (Today, Yesterday, This Week) */}
        <div
          className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-[28px] shadow-xs flex flex-col justify-between"
          style={{ padding: '32px 36px' }}
        >
          <div>
            <div className="flex items-center justify-between mb-5">
              <h4 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarCheck2 size={18} className="text-emerald-600" />
                <span>{language === 'ar' ? 'مؤشرات الحضور الأسبوعي' : 'Attendance Overview'}</span>
              </h4>
              <button
                type="button"
                onClick={() => setActiveTab('attendance')}
                className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
              >
                {language === 'ar' ? 'دفتر الحضور' : 'Attendance Sheet'} →
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 rounded-2xl p-4 text-center">
                <span className="text-xs text-emerald-700 dark:text-emerald-300 font-bold block">
                  {language === 'ar' ? 'اليوم (Today)' : 'Today'}
                </span>
                <span className="text-2xl font-black text-emerald-800 dark:text-emerald-200 font-mono mt-1 block">
                  94%
                </span>
              </div>
              <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/40 rounded-2xl p-4 text-center">
                <span className="text-xs text-blue-700 dark:text-blue-300 font-bold block">
                  {language === 'ar' ? 'أمس (Yesterday)' : 'Yesterday'}
                </span>
                <span className="text-2xl font-black text-blue-800 dark:text-blue-200 font-mono mt-1 block">
                  91%
                </span>
              </div>
              <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-800/40 rounded-2xl p-4 text-center">
                <span className="text-xs text-purple-700 dark:text-purple-300 font-bold block">
                  {language === 'ar' ? 'هذا الأسبوع' : 'This Week'}
                </span>
                <span className="text-2xl font-black text-purple-800 dark:text-purple-200 font-mono mt-1 block">
                  92%
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span>{language === 'ar' ? 'إجمالي الحصص المنجزة هذا الأسبوع:' : 'Sessions Completed This Week:'}</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">18 حصة</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span>{language === 'ar' ? 'عدد حالات الغياب المبرر:' : 'Excused Absences:'}</span>
                <span className="font-mono font-bold text-blue-600">2 حالات</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Groups Performance Matrix (Section 4, 39) */}
      <div
        className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-[28px] shadow-xs"
        style={{
          padding: '32px 36px',
          marginBottom: '36px',
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <h4 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <School size={18} className="text-amber-500" />
            <span>{language === 'ar' ? 'مؤشرات أداء الأفواج التعليمية (Groups Performance)' : 'Class Groups Performance'}</span>
          </h4>
          <button
            type="button"
            onClick={() => setActiveTab('groups')}
            className="text-xs font-bold text-amber-600 hover:underline cursor-pointer"
          >
            {language === 'ar' ? 'إدارة جميع الأفواج' : 'Manage All Groups'} →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-right">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold">
                <th className="pb-3 text-right">{language === 'ar' ? 'الفوج والكود' : 'Group Code & Name'}</th>
                <th className="pb-3 text-center">{language === 'ar' ? 'المعلم المسند' : 'Teacher'}</th>
                <th className="pb-3 text-center">{language === 'ar' ? 'الطلاب / السعة' : 'Students / Capacity'}</th>
                <th className="pb-3 text-center">{language === 'ar' ? 'نسبة الحضور' : 'Attendance'}</th>
                <th className="pb-3 text-center">{language === 'ar' ? 'التقدم الأكاديمي' : 'Progress'}</th>
                <th className="pb-3 text-center">{language === 'ar' ? 'المعدل العام' : 'Performance'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {visibleGroups.map((grp) => (
                <tr key={grp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 font-bold text-slate-900 dark:text-white">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-xs font-black">
                        {grp.code}
                      </span>
                      <span>{grp.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 text-center font-medium text-slate-600 dark:text-slate-300">
                    {grp.teacherName}
                  </td>
                  <td className="py-3.5 text-center font-mono font-bold text-slate-800 dark:text-slate-200">
                    {grp.studentIds.length} / {grp.maxCapacity}
                  </td>
                  <td className="py-3.5 text-center font-mono font-bold text-emerald-600">
                    {grp.attendanceRate}%
                  </td>
                  <td className="py-3.5 text-center font-mono font-bold text-blue-600">
                    {grp.averageProgress}%
                  </td>
                  <td className="py-3.5 text-center font-mono font-bold text-purple-600">
                    {grp.averagePerformance}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Students Falling Behind Alert Table (Section 4) */}
      {fallingBehindStudents.length > 0 && (
        <div
          className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700/80 rounded-[28px] shadow-xs"
          style={{ padding: '28px 32px' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5 text-amber-950 dark:text-amber-200">
              <AlertTriangle size={22} className="text-amber-600 shrink-0" />
              <h4 className="text-base font-black">
                {language === 'ar' ? 'تنبيه: طلاب بحاجة إلى متابعة واهتمام خاص (Falling Behind)' : 'Students Needing Attention'}
              </h4>
            </div>
            <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-200/60 dark:bg-amber-900/60 px-3 py-1 rounded-full font-mono">
              {fallingBehindStudents.length} {language === 'ar' ? 'طلاب' : 'students'}
            </span>
          </div>

          <div className="space-y-3">
            {fallingBehindStudents.map((st) => (
              <div
                key={st.id}
                className="bg-white dark:bg-slate-850 p-4 rounded-2xl border border-amber-200 dark:border-amber-800/60 flex items-center justify-between gap-4 flex-wrap shadow-2xs"
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900 dark:text-white text-sm">
                    {st.fullNameAr} ({st.fullNameEn})
                  </div>
                  <div className="text-xs text-slate-400">
                    {st.groupName} • {language === 'ar' ? 'المعلم:' : 'Teacher:'} {st.teacherName} • {language === 'ar' ? 'ولي الأمر:' : 'Parent:'} {st.parentName} ({st.parentPhone})
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-1 rounded-xl">
                    {language === 'ar' ? 'حضور:' : 'Att:'} {st.attendanceRate}%
                  </div>
                  <div className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-xl">
                    {language === 'ar' ? 'إنجاز:' : 'Prog:'} {st.overallProgress}%
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('students')}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                  >
                    {language === 'ar' ? 'فتح الملف' : 'Profile'} →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
