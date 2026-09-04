'use client';

import React, { useMemo } from 'react';
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
import { formatStudentCount } from '@/lib/utils';

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

  // Level Progress Distribution (derived strictly from active curriculum levels and their enrolled groups/students)
  const levelProgressData = curricula.map((curricLevel) => {
    // 1. Find all groups matching this curriculum level
    const matchingGroups = visibleGroups.filter((g) => {
      if (g.curriculumLevelId && g.curriculumLevelId === curricLevel.id) return true;
      const gLevel = (g.level || '').trim().toLowerCase();
      const nameAr = (curricLevel.nameAr || '').trim().toLowerCase();
      const nameEn = (curricLevel.nameEn || '').trim().toLowerCase();
      const cefr = (curricLevel.cefrCode || '').trim().toLowerCase();
      const numStr = String(curricLevel.levelNumber);

      return (
        (nameAr && gLevel === nameAr) ||
        (nameEn && gLevel === nameEn) ||
        gLevel === `l${numStr}` ||
        gLevel === `level ${numStr}` ||
        gLevel === `المستوى ${numStr}` ||
        gLevel === numStr ||
        (cefr && gLevel === cefr)
      );
    });

    const matchingGroupIds = new Set(matchingGroups.map((g) => g.id));
    const studentsInMatchingGroups = new Set(matchingGroups.flatMap((g) => g.studentIds || []));

    // 2. Filter students that belong to this curriculum level
    const studentsInLevel = visibleStudents.filter((s) => {
      // If student is in one of the matching groups
      if (s.groupId && matchingGroupIds.has(s.groupId)) return true;
      if (studentsInMatchingGroups.has(s.id)) return true;

      // If student is not assigned to any group, match strictly by currentLevel number
      if (!s.groupId || s.groupId === '') {
        return s.currentLevel === curricLevel.levelNumber;
      }

      return false;
    });

    const count = studentsInLevel.length;
    const progress = count > 0
      ? Math.round(studentsInLevel.reduce((sum, s) => sum + (s.overallProgress || 0), 0) / count)
      : 0;

    return {
      level: language === 'ar' ? `المستوى ${curricLevel.levelNumber}` : `Level ${curricLevel.levelNumber}`,
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
  
  // 1. Calculate this week's records (sessions within the last 7 days)
  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);
  const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

  const thisWeekSessions = attendanceSessions.filter((s) => s.date >= sevenDaysAgoStr);
  const thisWeekRecords = thisWeekSessions.flatMap((s) => s.records || []);
  const overallWeekAttendanceRate = thisWeekRecords.length > 0
    ? Math.round(
        (thisWeekRecords.filter((r) => r.status === 'present' || r.status === 'late').length /
          thisWeekRecords.length) *
          100
      )
    : allAttendanceRecords.length > 0
    ? Math.round(
        (allAttendanceRecords.filter((r) => r.status === 'present' || r.status === 'late').length /
          allAttendanceRecords.length) *
          100
      )
    : students.length > 0
    ? avgAttendance
    : 0;

  const todayStr = new Date().toISOString().split('T')[0];
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

  const todaySessions = attendanceSessions.filter((s) => s.date === todayStr);
  const todayRecords = todaySessions.flatMap((s) => s.records || []);
  const todayAttendanceRate = todayRecords.length > 0
    ? Math.round(
        (todayRecords.filter((r) => r.status === 'present' || r.status === 'late').length /
          todayRecords.length) *
          100
      )
    : null;

  const yesterdaySessions = attendanceSessions.filter((s) => s.date === yesterdayStr);
  const yesterdayRecords = yesterdaySessions.flatMap((s) => s.records || []);
  const yesterdayAttendanceRate = yesterdayRecords.length > 0
    ? Math.round(
        (yesterdayRecords.filter((r) => r.status === 'present' || r.status === 'late').length /
          yesterdayRecords.length) *
          100
      )
    : null;

  const totalSessionsDone = attendanceSessions.length;

  // Calculate past/today scheduled sessions that have not been conducted/recorded yet (excluding future sessions)
  const totalSessionsNotDone = useMemo(() => {
    let unrecordedCount = 0;
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const dayMapEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayMapAr = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

    const isStudyDay = (grp: any, dateObj: Date) => {
      const dayIdx = dateObj.getDay();
      const enDay = dayMapEn[dayIdx].toLowerCase();
      const arDay = dayMapAr[dayIdx];

      if (grp.schedules && grp.schedules.length > 0) {
        return grp.schedules.some((s: any) => {
          const d = (s.day || '').toLowerCase();
          return d.includes(enDay) || d.includes(arDay);
        });
      }

      const daysEn = (grp.daysEn || '').toLowerCase();
      const daysAr = grp.daysAr || '';
      return daysEn.includes(enDay) || daysAr.includes(arDay);
    };

    visibleGroups.forEach((grp) => {
      if (grp.status === 'archived') return;

      // Group start date
      const groupStartDate = grp.startDate ? new Date(grp.startDate) : new Date(today.getTime() - 14 * 86400000);
      groupStartDate.setHours(0, 0, 0, 0);

      const maxSessions = grp.totalSessions || 24;
      let completedCount = 0;

      const cursor = new Date(groupStartDate);
      while (cursor <= today && completedCount < maxSessions) {
        if (isStudyDay(grp, cursor)) {
          const dateStr = cursor.toISOString().split('T')[0];
          const hasRecordedSession = attendanceSessions.some(
            (s) => s.groupId === grp.id && s.date === dateStr && (s.isLocked || (s.records && s.records.length > 0))
          );

          if (hasRecordedSession) {
            completedCount++;
          } else {
            unrecordedCount++;
          }
        }
        cursor.setDate(cursor.getDate() + 1);
      }
    });

    return unrecordedCount;
  }, [visibleGroups, attendanceSessions]);

  const totalPresentCount = allAttendanceRecords.filter((r) => r.status === 'present').length;
  const totalLateCount = allAttendanceRecords.filter((r) => r.status === 'late').length;
  const totalExcusedAbsences = allAttendanceRecords.filter((r) => r.status === 'excused').length;
  const totalUnexcusedAbsences = allAttendanceRecords.filter((r) => r.status === 'absent').length;

  const getDashboardGroupAttendanceRate = (grp: any) => {
    const groupConfirmedSessions = attendanceSessions.filter(
      (a) => a.groupId === grp.id && (a.isLocked || (a.records && a.records.length > 0))
    );
    if (!grp.studentIds || grp.studentIds.length === 0 || groupConfirmedSessions.length === 0) return 0;

    let totalPossible = 0;
    let totalAttended = 0;

    groupConfirmedSessions.forEach((sess) => {
      sess.records?.forEach((rec) => {
        totalPossible++;
        if (rec.status === 'present' || rec.status === 'late' || rec.status === 'excused') {
          totalAttended++;
        }
      });
    });

    return totalPossible > 0 ? Math.round((totalAttended / totalPossible) * 100) : 0;
  };

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
        className="rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white shadow-lg border border-purple-900/50 relative overflow-hidden"
        style={{
          padding: '18px 24px',
          marginBottom: '24px',
        }}
      >
        <div className="relative z-10 space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[11px] font-bold border border-purple-500/30">
              <Sparkles size={12} className="text-amber-400 shrink-0" />
              <span>
                {currentRole === 'super_admin'
                  ? 'Super Admin Dashboard • Full Platform Access'
                  : currentRole === 'administrator'
                  ? 'Academic & Operations Admin Dashboard'
                  : 'Teacher Dashboard • My Groups & Classes'}
              </span>
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
              {language === 'ar' ? 'لوحة المتابعة الشاملة والمؤشرات الأكاديمية' : language === 'fr' ? 'Tableau de Bord & Indicateurs Globaux' : 'Platform Executive Overview & Analytics'}
            </h2>
            <p className="text-xs text-slate-300 font-medium max-w-2xl leading-relaxed">
              {language === 'ar'
                ? 'نظرة عامة متكاملة على إحصائيات الطلاب، الأفواج التعليمية، معدلات الحضور والتقدم في مساري الإنجليزية والفرنسية.'
                : 'Real-time monitoring of students, class groups, attendance rates, and curriculum progress across languages.'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Top 8 KPI Statistics Cards (Section 4, 39) */}
      <div style={{ marginBottom: '28px' }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Activity size={16} className="text-purple-600 dark:text-purple-400" />
            <span>{language === 'ar' ? 'المؤشرات الرئيسية للمنصة (Platform KPIs)' : 'Platform Key Statistics'}</span>
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {/* Total Students */}
          <div
            onClick={() => setActiveTab('students')}
            className="rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-blue-400 transition-all cursor-pointer flex flex-col justify-between"
            style={{ padding: '14px 18px' }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-400">{language === 'ar' ? 'إجمالي الطلاب' : 'Total Students'}</span>
              <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
                <Users size={14} />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono leading-none">
              {totalStudents}
            </div>
            <span className="text-[11px] font-bold text-emerald-600 mt-1 block">
              {activeStudents} {language === 'ar' ? 'طالب نشط' : 'active'}
            </span>
          </div>

          {/* Total Parents */}
          <div
            onClick={() => setActiveTab('parents')}
            className="rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-purple-400 transition-all cursor-pointer flex flex-col justify-between"
            style={{ padding: '14px 18px' }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-400">{language === 'ar' ? 'أولياء الأمور' : 'Total Parents'}</span>
              <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
                <UserCheck size={14} />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono leading-none">
              {totalParents}
            </div>
            <span className="text-[11px] font-bold text-slate-400 mt-1 block">
              {language === 'ar' ? 'حسابات مربوطة بالأبناء' : 'Linked parent accounts'}
            </span>
          </div>

          {/* Total Teachers */}
          <div
            onClick={() => setActiveTab('teachers')}
            className="rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-emerald-400 transition-all cursor-pointer flex flex-col justify-between"
            style={{ padding: '14px 18px' }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-400">{language === 'ar' ? 'هيئة التدريس' : 'Total Teachers'}</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                <GraduationCap size={14} />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono leading-none">
              {totalTeachers}
            </div>
            <span className="text-[11px] font-bold text-slate-400 mt-1 block">
              {language === 'ar' ? 'معلمين معتمدين' : 'Certified instructors'}
            </span>
          </div>

          {/* Total Groups */}
          <div
            onClick={() => setActiveTab('groups')}
            className="rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-amber-400 transition-all cursor-pointer flex flex-col justify-between"
            style={{ padding: '14px 18px' }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-400">{language === 'ar' ? 'الأفواج النشطة' : 'Active Groups'}</span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                <School size={14} />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono leading-none">
              {activeGroups} / {totalGroups}
            </div>
            <span className="text-[11px] font-bold text-amber-600 mt-1 block">
              {language === 'ar' ? 'فوج دراسي نشط' : 'Active classes'}
            </span>
          </div>

          {/* Attendance Rate */}
          <div
            onClick={() => setActiveTab('attendance')}
            className="rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-teal-400 transition-all cursor-pointer flex flex-col justify-between"
            style={{ padding: '14px 18px' }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-400">{language === 'ar' ? 'نسبة الانضباط والحضور' : 'Attendance Rate'}</span>
              <div className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center">
                <CalendarCheck2 size={14} />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono leading-none">
              {avgAttendance}%
            </div>
            <span className="text-[11px] font-bold text-teal-600 mt-1 block">
              {attendanceSubtext}
            </span>
          </div>

          {/* Average Performance */}
          <div
            onClick={() => setActiveTab('performance')}
            className="rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-rose-400 transition-all cursor-pointer flex flex-col justify-between"
            style={{ padding: '14px 18px' }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-400">{language === 'ar' ? 'المعدل العام للأداء' : 'Average Performance'}</span>
              <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
                <Award size={14} />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono leading-none">
              {avgPerformance}%
            </div>
            <span className="text-[11px] font-bold text-rose-600 mt-1 block">
              {performanceSubtext}
            </span>
          </div>

          {/* English Track Students */}
          <div
            onClick={() => setActiveTab('students')}
            className="rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-indigo-400 transition-all cursor-pointer flex flex-col justify-between"
            style={{ padding: '14px 18px' }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-400">{language === 'ar' ? 'مسار الإنجليزية' : 'English Track'}</span>
              <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
                <BookOpen size={14} />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-indigo-600 font-mono leading-none">
              {students.filter((s) => s.language === 'English' || s.language === 'Dual').length}
            </div>
            <span className="text-[11px] font-bold text-slate-400 mt-1 block">
              {language === 'ar' ? 'المستويات 1 - 10' : 'Levels 1 - 10'}
            </span>
          </div>

          {/* French Track Students */}
          <div
            onClick={() => setActiveTab('students')}
            className="rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-violet-400 transition-all cursor-pointer flex flex-col justify-between"
            style={{ padding: '14px 18px' }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-400">{language === 'ar' ? 'مسار الفرنسية' : 'French Track'}</span>
              <div className="w-7 h-7 rounded-lg bg-violet-50 dark:bg-violet-950/60 text-violet-600 flex items-center justify-center">
                <Languages size={14} />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-violet-600 font-mono leading-none">
              {students.filter((s) => s.language === 'French' || s.language === 'Dual').length}
            </div>
            <span className="text-[11px] font-bold text-slate-400 mt-1 block">
              DELF / DALF
            </span>
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Student Progress by Level + Attendance Breakdown (Section 39) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5" style={{ marginBottom: '32px' }}>
        {/* Student Progress By Level */}
        <div
          className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-2xs flex flex-col justify-between"
          style={{ padding: '20px 24px' }}
        >
          <div>
            <div
              className="flex items-center justify-between gap-3 flex-wrap"
              style={{ marginBottom: '20px' }}
            >
              <h4 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp size={18} className="text-indigo-600 shrink-0" />
                <span>{language === 'ar' ? 'نسبة الإنجاز الأكاديمي حسب المستويات' : 'Student Progress by Level'}</span>
              </h4>
              <button
                type="button"
                onClick={() => setActiveTab('academic')}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                {language === 'ar' ? 'عرض المسار' : 'View Path'} →
              </button>
            </div>

            {levelProgressData.length === 0 ? (
              <div className="py-8 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 shadow-xs border border-indigo-100 dark:border-indigo-900/50">
                  <TrendingUp size={22} />
                </div>
                <h5 className="text-sm sm:text-base font-black text-slate-800 dark:text-slate-100 mb-1">
                  {language === 'ar' ? 'لا توجد مستويات أكاديمية مضافة' : 'No curriculum levels added yet'}
                </h5>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed mb-4 px-2">
                  {language === 'ar'
                    ? 'قم بإضافة المستويات والوحدات والدروس من شاشة المسار الأكاديمي للبدء في تتبع الإنجاز.'
                    : 'Add levels, units, and lessons in Academic Path to start tracking progress.'}
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('academic')}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold shadow-xs transition-all cursor-pointer whitespace-nowrap"
                  style={{ minHeight: '36px', padding: '8px 20px' }}
                >
                  <Sparkles size={14} className="shrink-0 text-amber-300" />
                  <span>{language === 'ar' ? 'إضافة مستوى أكاديمي' : 'Add Academic Level'}</span>
                  <span className="font-mono text-xs leading-none font-bold">{isRTL ? '←' : '→'}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {levelProgressData.map((item) => (
                  <div key={`${item.level}-${item.levelNumber}-${item.language}`} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-700 dark:text-slate-200 font-mono text-xs sm:text-sm">
                        {item.level} — {language === 'ar' ? item.nameAr : item.nameEn} ({formatStudentCount(item.count, language)})
                      </span>
                      <span className="font-mono font-black text-indigo-600 text-xs sm:text-sm">{item.progress}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/40 dark:border-slate-700/40">
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
          className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-2xs flex flex-col justify-between"
          style={{ padding: '20px 24px' }}
        >
          <div>
            <div
              className="flex items-center justify-between gap-3 flex-wrap"
              style={{ marginBottom: '20px' }}
            >
              <h4 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarCheck2 size={18} className="text-emerald-600 shrink-0" />
                <span>{language === 'ar' ? 'مؤشرات الحضور الأسبوعي' : 'Attendance Overview'}</span>
              </h4>
              <button
                type="button"
                onClick={() => setActiveTab('attendance')}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                {language === 'ar' ? 'دفتر الحضور' : 'Attendance Sheet'} →
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5" style={{ marginBottom: '20px' }}>
              <div
                className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 rounded-xl text-center flex flex-col justify-center"
                style={{ padding: '12px 10px' }}
              >
                <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-bold block mb-1">
                  {language === 'ar' ? 'اليوم (Today)' : 'Today'}
                </span>
                <span className="text-xl sm:text-2xl font-black text-emerald-800 dark:text-emerald-200 font-mono block leading-none">
                  {todayAttendanceRate !== null ? `${todayAttendanceRate}%` : '--'}
                </span>
              </div>
              <div
                className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/40 rounded-xl text-center flex flex-col justify-center"
                style={{ padding: '12px 10px' }}
              >
                <span className="text-[11px] text-blue-700 dark:text-blue-300 font-bold block mb-1">
                  {language === 'ar' ? 'أمس (Yesterday)' : 'Yesterday'}
                </span>
                <span className="text-xl sm:text-2xl font-black text-blue-800 dark:text-blue-200 font-mono block leading-none">
                  {yesterdayAttendanceRate !== null ? `${yesterdayAttendanceRate}%` : '--'}
                </span>
              </div>
              <div
                className="bg-purple-50 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-800/40 rounded-xl text-center flex flex-col justify-center"
                style={{ padding: '12px 10px' }}
              >
                <span className="text-[11px] text-purple-700 dark:text-purple-300 font-bold block mb-1">
                  {language === 'ar' ? 'هذا الأسبوع' : 'This Week'}
                </span>
                <span className="text-xl sm:text-2xl font-black text-purple-800 dark:text-purple-200 font-mono block leading-none">
                  {overallWeekAttendanceRate}%
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              {/* 1. Number session that done */}
              <div
                className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800"
                style={{ padding: '9px 16px' }}
              >
                <span className="text-slate-700 dark:text-slate-200 font-bold">
                  {language === 'ar' ? 'عدد الحصص المنجزة:' : 'Sessions Done (Completed):'}
                </span>
                <span className="font-mono font-black text-slate-900 dark:text-white text-xs sm:text-sm">
                  {totalSessionsDone} {language === 'ar' ? 'حصة' : 'sessions'}
                </span>
              </div>

              {/* 2. Session not done */}
              <div
                className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800"
                style={{ padding: '9px 16px' }}
              >
                <span className="text-slate-700 dark:text-slate-200 font-bold">
                  {language === 'ar' ? 'عدد الحصص غير المنجزة (حتى اليوم):' : 'Sessions Not Done (Up to Today):'}
                </span>
                <span className="font-mono font-black text-rose-600 dark:text-rose-400 text-xs sm:text-sm">
                  {totalSessionsNotDone} {language === 'ar' ? 'حصة' : 'sessions'}
                </span>
              </div>

              {/* 3. Present */}
              <div
                className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800"
                style={{ padding: '9px 16px' }}
              >
                <span className="text-slate-700 dark:text-slate-200 font-bold">
                  {language === 'ar' ? 'عدد حالات الحضور (Present):' : 'Present Count:'}
                </span>
                <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm">
                  {totalPresentCount} {language === 'ar' ? 'حالات' : 'cases'}
                </span>
              </div>

              {/* 4. Late */}
              <div
                className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800"
                style={{ padding: '9px 16px' }}
              >
                <span className="text-slate-700 dark:text-slate-200 font-bold">
                  {language === 'ar' ? 'عدد حالات التأخير (Late):' : 'Late Arrivals:'}
                </span>
                <span className="font-mono font-black text-amber-600 dark:text-amber-400 text-xs sm:text-sm">
                  {totalLateCount} {language === 'ar' ? 'حالات' : 'cases'}
                </span>
              </div>

              {/* 5. Absent with approve */}
              <div
                className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800"
                style={{ padding: '9px 16px' }}
              >
                <span className="text-slate-700 dark:text-slate-200 font-bold">
                  {language === 'ar' ? 'عدد حالات الغياب المبرر (بموافقة):' : 'Absent (With Approval):'}
                </span>
                <span className="font-mono font-black text-blue-600 dark:text-blue-400 text-xs sm:text-sm">
                  {totalExcusedAbsences} {language === 'ar' ? 'حالات' : 'cases'}
                </span>
              </div>

              {/* 6. Absent */}
              <div
                className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800"
                style={{ padding: '9px 16px' }}
              >
                <span className="text-slate-700 dark:text-slate-200 font-bold">
                  {language === 'ar' ? 'عدد حالات الغياب غير المبرر (Absent):' : 'Absent (Unexcused):'}
                </span>
                <span className="font-mono font-black text-rose-600 dark:text-rose-400 text-xs sm:text-sm">
                  {totalUnexcusedAbsences} {language === 'ar' ? 'حالات' : 'cases'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Groups Performance Matrix (Section 4, 39) */}
      <div
        className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-2xs"
        style={{
          padding: '20px 24px',
          marginBottom: '32px',
        }}
      >
        <div
          className="flex items-center justify-between gap-3 flex-wrap"
          style={{ marginBottom: '18px' }}
        >
          <h4 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <School size={18} className="text-amber-500 shrink-0" />
            <span>{language === 'ar' ? 'مؤشرات أداء الأفواج التعليمية (Groups Performance)' : 'Class Groups Performance'}</span>
          </h4>
          <button
            type="button"
            onClick={() => setActiveTab('groups')}
            className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
          >
            {language === 'ar' ? 'إدارة جميع الأفواج' : 'Manage All Groups'} →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-right">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold">
                <th className="pb-6 pt-2 px-5 text-right font-extrabold">{language === 'ar' ? 'الفوج والكود' : 'Group Code & Name'}</th>
                <th className="pb-6 pt-2 px-5 text-center font-extrabold">{language === 'ar' ? 'المعلم المسند' : 'Teacher'}</th>
                <th className="pb-6 pt-2 px-5 text-center font-extrabold">{language === 'ar' ? 'عدد الطلاب' : 'Students'}</th>
                <th className="pb-6 pt-2 px-5 text-center font-extrabold">{language === 'ar' ? 'نسبة الحضور' : 'Attendance'}</th>
                <th className="pb-6 pt-2 px-5 text-center font-extrabold">{language === 'ar' ? 'التقدم الأكاديمي' : 'Progress'}</th>
                <th className="pb-6 pt-2 px-5 text-center font-extrabold">{language === 'ar' ? 'المعدل العام' : 'Performance'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {visibleGroups.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400 font-medium text-xs sm:text-sm">
                    {language === 'ar' ? 'لا توجد أفواج تعليمية مضافة حالياً' : 'No class groups available'}
                  </td>
                </tr>
              ) : (
                visibleGroups.map((grp) => (
                  <tr key={grp.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-8 px-5 font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-3">
                        <span
                          className="rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-xs font-black text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80"
                          style={{ padding: '4px 12px' }}
                        >
                          {grp.code}
                        </span>
                        <span className="text-xs sm:text-sm font-bold">{grp.name}</span>
                      </div>
                    </td>
                    <td className="py-8 px-5 text-center font-medium text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
                      {grp.teacherName || '—'}
                    </td>
                    <td className="py-8 px-5 text-center font-mono font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
                      {grp.studentIds.length}
                    </td>
                    <td className="py-8 px-5 text-center font-mono font-black text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm">
                      {getDashboardGroupAttendanceRate(grp)}%
                    </td>
                    <td className="py-8 px-5 text-center font-mono font-black text-blue-600 dark:text-blue-400 text-xs sm:text-sm">
                      {grp.studentIds.length === 0 ? '0%' : `${grp.averageProgress}%`}
                    </td>
                    <td className="py-8 px-5 text-center font-mono font-black text-purple-600 dark:text-purple-400 text-xs sm:text-sm">
                      {grp.studentIds.length === 0 ? '0%' : `${grp.averagePerformance}%`}
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
          className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700/80 rounded-2xl shadow-2xs"
          style={{
            padding: '20px 24px',
            marginBottom: '32px',
          }}
        >
          <div
            className="flex items-center justify-between gap-3 flex-wrap"
            style={{ marginBottom: '18px' }}
          >
            <div className="flex items-center gap-2.5 text-amber-950 dark:text-amber-200">
              <AlertTriangle size={18} className="text-amber-600 shrink-0" />
              <h4 className="text-base font-black leading-normal">
                {language === 'ar' ? 'تنبيه: طلاب بحاجة إلى متابعة واهتمام خاص (Falling Behind)' : 'Students Needing Attention'}
              </h4>
            </div>
            <span
              className="font-bold text-amber-800 dark:text-amber-200 bg-amber-200/70 dark:bg-amber-900/70 border border-amber-300/80 dark:border-amber-700/80 rounded-full font-mono shrink-0 leading-normal"
              style={{ padding: '4px 14px', fontSize: '11px' }}
            >
              {formatStudentCount(fallingBehindStudents.length, language)}
            </span>
          </div>

          <div className="space-y-3">
            {fallingBehindStudents.map((st) => (
              <div
                key={st.id}
                className="bg-white dark:bg-slate-850 rounded-xl border border-amber-200 dark:border-amber-800/60 flex items-center justify-between gap-3 flex-wrap shadow-2xs"
                style={{ padding: '14px 18px' }}
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm leading-snug">
                    {st.fullNameAr} ({st.fullNameEn})
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    {st.groupName} • {language === 'ar' ? 'المعلم:' : 'Teacher:'} {st.teacherName} • {language === 'ar' ? 'ولي الأمر:' : 'Parent:'} {st.parentName} ({st.parentPhone})
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <div
                    className="text-[11px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/60 rounded-lg"
                    style={{ padding: '4px 10px' }}
                  >
                    {language === 'ar' ? 'حضور:' : 'Att:'} {st.attendanceRate}%
                  </div>
                  <div
                    className="text-[11px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/60 rounded-lg"
                    style={{ padding: '4px 10px' }}
                  >
                    {language === 'ar' ? 'إنجاز:' : 'Prog:'} {st.overallProgress}%
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('students')}
                    className="rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                    style={{ padding: '6px 14px' }}
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
