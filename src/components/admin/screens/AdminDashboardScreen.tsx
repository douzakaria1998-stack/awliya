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
    curricula,
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

  // Level Progress Distribution (derived strictly from active curriculum levels)
  const levelProgressData = curricula.map((curricLevel) => {
    const studentsInLevel = visibleStudents.filter(
      (s) => s.cefrLevel === curricLevel.cefrCode || s.currentLevel === curricLevel.levelNumber
    );
    const count = studentsInLevel.length;
    const progress = count > 0
      ? Math.round(studentsInLevel.reduce((sum, s) => sum + (s.overallProgress || 0), 0) / count)
      : 0;
    return {
      level: curricLevel.cefrCode,
      levelNumber: curricLevel.levelNumber,
      nameAr: curricLevel.nameAr,
      nameEn: curricLevel.nameEn,
      language: curricLevel.language,
      count,
      progress,
    };
  });

  // Real Attendance Calculations from attendanceSessions
  const allAttendanceRecords = attendanceSessions.flatMap((s) => s.records || []);
  const totalAttendanceCount = allAttendanceRecords.length;
  
  const presentOrLateCount = allAttendanceRecords.filter((r) => r.status === 'present' || r.status === 'late').length;
  const overallWeekAttendanceRate = totalAttendanceCount > 0
    ? Math.round((presentOrLateCount / totalAttendanceCount) * 100)
    : (students.length > 0 ? avgAttendance : 0);

  const todayStr = new Date().toISOString().split('T')[0];
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

  const todaySessions = attendanceSessions.filter((s) => s.date === todayStr);
  const todayRecords = todaySessions.flatMap((s) => s.records || []);
  const todayAttendanceRate = todayRecords.length > 0
    ? Math.round((todayRecords.filter((r) => r.status === 'present' || r.status === 'late').length / todayRecords.length) * 100)
    : (attendanceSessions.length > 0 ? overallWeekAttendanceRate : 0);

  const yesterdaySessions = attendanceSessions.filter((s) => s.date === yesterdayStr);
  const yesterdayRecords = yesterdaySessions.flatMap((s) => s.records || []);
  const yesterdayAttendanceRate = yesterdayRecords.length > 0
    ? Math.round((yesterdayRecords.filter((r) => r.status === 'present' || r.status === 'late').length / yesterdayRecords.length) * 100)
    : (attendanceSessions.length > 0 ? overallWeekAttendanceRate : 0);

  const totalSessionsCompleted = attendanceSessions.length;
  const totalExcusedAbsences = allAttendanceRecords.filter((r) => r.status === 'excused').length;

  const attendanceSubtext = students.length === 0
    ? (language === 'ar' ? 'لا توجد بيانات حضور' : 'No attendance data')
    : avgAttendance >= 85
    ? (language === 'ar' ? 'متوسط انضباط ممتاز' : 'High engagement')
    : avgAttendance >= 70
    ? (language === 'ar' ? 'انضباط متوسط' : 'Average engagement')
    : (language === 'ar' ? 'بحاجة إلى متابعة' : 'Needs attention');

  const performanceSubtext = students.length === 0
    ? (language === 'ar' ? 'لا توجد بيانات تقييم' : 'No evaluation data')
    : avgPerformance >= 85
    ? (language === 'ar' ? 'تقدير عام: ممتاز' : 'Excellent Overall')
    : avgPerformance >= 70
    ? (language === 'ar' ? 'تقدير عام: جيد جداً' : 'Very Good Overall')
    : (language === 'ar' ? 'بحاجة إلى تعزيز' : 'Needs improvement');

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
            style={{ padding: '26px 28px' }}
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
              {attendanceSubtext}
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
              {performanceSubtext}
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ marginBottom: '48px' }}>
        {/* Student Progress By Level */}
        <div
          className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-[32px] shadow-xs flex flex-col justify-between"
          style={{ padding: '44px 48px' }}
        >
          <div>
            <div
              className="flex items-center justify-between gap-4 flex-wrap"
              style={{ marginBottom: '32px' }}
            >
              <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                <TrendingUp size={24} className="text-indigo-600 shrink-0" />
                <span>{language === 'ar' ? 'نسبة الإنجاز الأكاديمي حسب المستويات' : 'Student Progress by Level'}</span>
              </h4>
              <button
                type="button"
                onClick={() => setActiveTab('academic')}
                className="text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                {language === 'ar' ? 'عرض المسار' : 'View Path'} →
              </button>
            </div>

            {levelProgressData.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 dark:text-indigo-400 flex items-center justify-center mb-3">
                  <TrendingUp size={28} />
                </div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-1">
                  {language === 'ar' ? 'لا توجد مستويات أكاديمية مضافة' : 'No curriculum levels added yet'}
                </p>
                <p className="text-xs text-slate-400 max-w-xs mb-4">
                  {language === 'ar'
                    ? 'قم بإضافة المستويات والوحدات والدروس من شاشة المسار الأكاديمي للبدء في تتبع الإنجاز.'
                    : 'Add levels, units, and lessons in Academic Path to start tracking progress.'}
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('academic')}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  {language === 'ar' ? 'إضافة مستوى أكاديمي' : 'Add Academic Level'}
                </button>
              </div>
            ) : (
              <div className="space-y-7">
                {levelProgressData.map((item) => (
                  <div key={`${item.level}-${item.levelNumber}-${item.language}`} className="space-y-3">
                    <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                      <span className="text-slate-700 dark:text-slate-200 font-mono text-sm sm:text-base">
                        {item.level} — {language === 'ar' ? item.nameAr : item.nameEn} ({item.count} {language === 'ar' ? 'طلاب' : 'students'})
                      </span>
                      <span className="font-mono font-black text-indigo-600 text-sm sm:text-base">{item.progress}%</span>
                    </div>
                    <div className="w-full h-3.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/40 dark:border-slate-700/40">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-purple-600 rounded-full transition-all"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Attendance Breakdown (Today, Yesterday, This Week) */}
        <div
          className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-[32px] shadow-xs flex flex-col justify-between"
          style={{ padding: '44px 48px' }}
        >
          <div>
            <div
              className="flex items-center justify-between gap-4 flex-wrap"
              style={{ marginBottom: '32px' }}
            >
              <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                <CalendarCheck2 size={24} className="text-emerald-600 shrink-0" />
                <span>{language === 'ar' ? 'مؤشرات الحضور الأسبوعي' : 'Attendance Overview'}</span>
              </h4>
              <button
                type="button"
                onClick={() => setActiveTab('attendance')}
                className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                {language === 'ar' ? 'دفتر الحضور' : 'Attendance Sheet'} →
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4" style={{ marginBottom: '32px' }}>
              <div
                className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 rounded-2xl text-center flex flex-col justify-center"
                style={{ padding: '24px 18px' }}
              >
                <span className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-300 font-bold block mb-2">
                  {language === 'ar' ? 'اليوم (Today)' : 'Today'}
                </span>
                <span className="text-3xl font-black text-emerald-800 dark:text-emerald-200 font-mono block">
                  {todayAttendanceRate}%
                </span>
              </div>
              <div
                className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/40 rounded-2xl text-center flex flex-col justify-center"
                style={{ padding: '24px 18px' }}
              >
                <span className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 font-bold block mb-2">
                  {language === 'ar' ? 'أمس (Yesterday)' : 'Yesterday'}
                </span>
                <span className="text-3xl font-black text-blue-800 dark:text-blue-200 font-mono block">
                  {yesterdayAttendanceRate}%
                </span>
              </div>
              <div
                className="bg-purple-50 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-800/40 rounded-2xl text-center flex flex-col justify-center"
                style={{ padding: '24px 18px' }}
              >
                <span className="text-xs sm:text-sm text-purple-700 dark:text-purple-300 font-bold block mb-2">
                  {language === 'ar' ? 'هذا الأسبوع' : 'This Week'}
                </span>
                <span className="text-3xl font-black text-purple-800 dark:text-purple-200 font-mono block">
                  {overallWeekAttendanceRate}%
                </span>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
              <div
                className="flex items-center justify-between rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800"
                style={{ padding: '18px 24px' }}
              >
                <span className="text-slate-700 dark:text-slate-200 font-bold">
                  {language === 'ar' ? 'إجمالي الحصص المنجزة:' : 'Completed Sessions:'}
                </span>
                <span className="font-mono font-black text-slate-900 dark:text-white text-base">
                  {totalSessionsCompleted} {language === 'ar' ? 'حصة' : 'sessions'}
                </span>
              </div>
              <div
                className="flex items-center justify-between rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800"
                style={{ padding: '18px 24px' }}
              >
                <span className="text-slate-700 dark:text-slate-200 font-bold">
                  {language === 'ar' ? 'عدد حالات الغياب المبرر:' : 'Excused Absences:'}
                </span>
                <span className="font-mono font-black text-blue-600 dark:text-blue-400 text-base">
                  {totalExcusedAbsences} {language === 'ar' ? 'حالات' : 'cases'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Groups Performance Matrix (Section 4, 39) */}
      <div
        className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-[32px] shadow-xs"
        style={{
          padding: '44px 48px',
          marginBottom: '48px',
        }}
      >
        <div
          className="flex items-center justify-between gap-4 flex-wrap"
          style={{ marginBottom: '32px' }}
        >
          <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <School size={24} className="text-amber-500 shrink-0" />
            <span>{language === 'ar' ? 'مؤشرات أداء الأفواج التعليمية (Groups Performance)' : 'Class Groups Performance'}</span>
          </h4>
          <button
            type="button"
            onClick={() => setActiveTab('groups')}
            className="text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
          >
            {language === 'ar' ? 'إدارة جميع الأفواج' : 'Manage All Groups'} →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-right">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold">
                <th className="pb-5 pt-2 px-6 text-right font-extrabold">{language === 'ar' ? 'الفوج والكود' : 'Group Code & Name'}</th>
                <th className="pb-5 pt-2 px-6 text-center font-extrabold">{language === 'ar' ? 'المعلم المسند' : 'Teacher'}</th>
                <th className="pb-5 pt-2 px-6 text-center font-extrabold">{language === 'ar' ? 'الطلاب / السعة' : 'Students / Capacity'}</th>
                <th className="pb-5 pt-2 px-6 text-center font-extrabold">{language === 'ar' ? 'نسبة الحضور' : 'Attendance'}</th>
                <th className="pb-5 pt-2 px-6 text-center font-extrabold">{language === 'ar' ? 'التقدم الأكاديمي' : 'Progress'}</th>
                <th className="pb-5 pt-2 px-6 text-center font-extrabold">{language === 'ar' ? 'المعدل العام' : 'Performance'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {visibleGroups.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-medium text-xs sm:text-sm">
                    {language === 'ar' ? 'لا توجد أفواج تعليمية مضافة حالياً' : 'No class groups available'}
                  </td>
                </tr>
              ) : (
                visibleGroups.map((grp) => (
                  <tr key={grp.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-7 px-6 font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-4">
                        <span
                          className="rounded-xl bg-slate-100 dark:bg-slate-800 font-mono text-xs font-black text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80"
                          style={{ padding: '6px 14px' }}
                        >
                          {grp.code}
                        </span>
                        <span className="text-sm sm:text-base font-bold">{grp.name}</span>
                      </div>
                    </td>
                    <td className="py-7 px-6 text-center font-medium text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
                      {grp.teacherName || '—'}
                    </td>
                    <td className="py-7 px-6 text-center font-mono font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
                      {grp.studentIds.length} / {grp.maxCapacity}
                    </td>
                    <td className="py-7 px-6 text-center font-mono font-black text-emerald-600 dark:text-emerald-400 text-base">
                      {grp.attendanceRate}%
                    </td>
                    <td className="py-7 px-6 text-center font-mono font-black text-blue-600 dark:text-blue-400 text-base">
                      {grp.averageProgress}%
                    </td>
                    <td className="py-7 px-6 text-center font-mono font-black text-purple-600 dark:text-purple-400 text-base">
                      {grp.averagePerformance}%
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Students Falling Behind Alert Table (Section 4) */}
      {fallingBehindStudents.length > 0 && (
        <div
          className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700/80 rounded-[32px] shadow-xs"
          style={{
            padding: '44px 48px',
            marginBottom: '48px',
          }}
        >
          <div
            className="flex items-center justify-between gap-4 flex-wrap"
            style={{ marginBottom: '36px' }}
          >
            <div className="flex items-center gap-3.5 text-amber-950 dark:text-amber-200">
              <AlertTriangle size={26} className="text-amber-600 shrink-0" />
              <h4 className="text-lg sm:text-xl font-black leading-normal">
                {language === 'ar' ? 'تنبيه: طلاب بحاجة إلى متابعة واهتمام خاص (Falling Behind)' : 'Students Needing Attention'}
              </h4>
            </div>
            <span
              className="font-bold text-amber-800 dark:text-amber-200 bg-amber-200/70 dark:bg-amber-900/70 border border-amber-300/80 dark:border-amber-700/80 rounded-full font-mono shrink-0 leading-normal"
              style={{ padding: '10px 24px', fontSize: '13px' }}
            >
              {fallingBehindStudents.length} {language === 'ar' ? 'طلاب' : 'students'}
            </span>
          </div>

          <div className="space-y-5 sm:space-y-6">
            {fallingBehindStudents.map((st) => (
              <div
                key={st.id}
                className="bg-white dark:bg-slate-850 rounded-2xl border border-amber-200 dark:border-amber-800/60 flex items-center justify-between gap-4 flex-wrap shadow-2xs"
                style={{ padding: '26px 32px' }}
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-snug">
                    {st.fullNameAr} ({st.fullNameEn})
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    {st.groupName} • {language === 'ar' ? 'المعلم:' : 'Teacher:'} {st.teacherName} • {language === 'ar' ? 'ولي الأمر:' : 'Parent:'} {st.parentName} ({st.parentPhone})
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div
                    className="text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/60 rounded-xl"
                    style={{ padding: '8px 14px' }}
                  >
                    {language === 'ar' ? 'حضور:' : 'Att:'} {st.attendanceRate}%
                  </div>
                  <div
                    className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/60 rounded-xl"
                    style={{ padding: '8px 14px' }}
                  >
                    {language === 'ar' ? 'إنجاز:' : 'Prog:'} {st.overallProgress}%
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('students')}
                    className="rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                    style={{ padding: '10px 18px' }}
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
