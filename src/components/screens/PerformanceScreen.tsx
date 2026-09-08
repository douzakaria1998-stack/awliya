'use client';

import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  BookOpenCheck,
  Calendar,
  Award,
  MessageSquareQuote,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Check,
  Filter,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  CalendarDays,
  CalendarRange,
  History,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Layers,
} from 'lucide-react';
import { useStudent } from '@/context/StudentContext';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { PerformanceTabKey } from '@/lib/constants';
import { Homework, AttendanceRecord } from '@/types';
import { StudentSwitcher } from '../layout/StudentSwitcher';
import { HomeworkDetailModal } from '../modals/HomeworkDetailModal';
import {
  translateSubject,
  translateHomeworkTitle,
  translateTeacherNote,
} from '@/lib/translations';

const getLanguageBadgeTheme = (subjectOrLang: string = '') => {
  const str = subjectOrLang.toLowerCase();
  // French (Red)
  if (
    str.includes('french') ||
    str.includes('français') ||
    str.includes('فرنسية') ||
    str.includes('فرنسي') ||
    str.includes('delf') ||
    str.includes('dalf') ||
    str.includes('نطق')
  ) {
    return {
      bgClass: 'bg-red-50/60 dark:bg-red-950/25',
      borderClass: 'border-red-200/80 dark:border-red-800/50',
      badgeContainer: 'bg-red-100/90 dark:bg-red-950/70 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/70',
      iconClass: 'text-red-600 dark:text-red-400',
    };
  }
  // Spanish (Orange)
  if (
    str.includes('spanish') ||
    str.includes('español') ||
    str.includes('إسبانية') ||
    str.includes('اسبانية') ||
    str.includes('إسباني') ||
    str.includes('dele')
  ) {
    return {
      bgClass: 'bg-orange-50/60 dark:bg-orange-950/25',
      borderClass: 'border-orange-200/80 dark:border-orange-800/50',
      badgeContainer: 'bg-orange-100/90 dark:bg-orange-950/70 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800/70',
      iconClass: 'text-orange-600 dark:text-orange-400',
    };
  }
  // German (Yellow)
  if (
    str.includes('german') ||
    str.includes('germany') ||
    str.includes('deutsch') ||
    str.includes('ألمانية') ||
    str.includes('المانية') ||
    str.includes('ألماني') ||
    str.includes('goethe')
  ) {
    return {
      bgClass: 'bg-yellow-50/60 dark:bg-yellow-950/25',
      borderClass: 'border-yellow-300/80 dark:border-yellow-700/50',
      badgeContainer: 'bg-yellow-100/90 dark:bg-yellow-950/70 text-yellow-800 dark:text-yellow-200 border border-yellow-300 dark:border-yellow-700/70',
      iconClass: 'text-yellow-600 dark:text-yellow-400',
    };
  }
  // English (Blue) - Default
  return {
    bgClass: 'bg-blue-50/60 dark:bg-blue-950/25',
    borderClass: 'border-blue-200/80 dark:border-blue-800/50',
    badgeContainer: 'bg-blue-100/90 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/70',
    iconClass: 'text-blue-600 dark:text-blue-400',
  };
};

const SUBJECT_CONTAINER_THEMES: Record<
  string,
  {
    bgClass: string;
    borderClass: string;
    badgeBg: string;
  }
> = {
  'اللغة الإنجليزية': {
    bgClass: 'bg-blue-50/70 dark:bg-blue-950/30',
    borderClass: 'border-blue-200/90 dark:border-blue-800/60',
    badgeBg: 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200',
  },
  'اللغة الفرنسية': {
    bgClass: 'bg-red-50/70 dark:bg-red-950/30',
    borderClass: 'border-red-200/90 dark:border-red-800/60',
    badgeBg: 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-200',
  },
  'محادثة إنجليزية': {
    bgClass: 'bg-blue-50/70 dark:bg-blue-950/30',
    borderClass: 'border-blue-200/90 dark:border-blue-800/60',
    badgeBg: 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200',
  },
  'ورشة النطق الفرنسي': {
    bgClass: 'bg-red-50/70 dark:bg-red-950/30',
    borderClass: 'border-red-200/90 dark:border-red-800/60',
    badgeBg: 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-200',
  },
  'قواعد وتراكيب': {
    bgClass: 'bg-indigo-50/70 dark:bg-indigo-950/30',
    borderClass: 'border-indigo-200/90 dark:border-indigo-800/60',
    badgeBg: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-200',
  },
  'استماع ومناقشة': {
    bgClass: 'bg-amber-50/70 dark:bg-amber-950/30',
    borderClass: 'border-amber-200/90 dark:border-amber-800/60',
    badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200',
  },
  'قراءة وفهم نصوص': {
    bgClass: 'bg-teal-50/70 dark:bg-teal-950/30',
    borderClass: 'border-teal-200/90 dark:border-teal-800/60',
    badgeBg: 'bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-200',
  },
  'تعبير وكتابة': {
    bgClass: 'bg-rose-50/70 dark:bg-rose-950/30',
    borderClass: 'border-rose-200/90 dark:border-rose-800/60',
    badgeBg: 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200',
  },
  'محادثة وتطبيق': {
    bgClass: 'bg-sky-50/70 dark:bg-sky-950/30',
    borderClass: 'border-sky-200/90 dark:border-sky-800/60',
    badgeBg: 'bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-200',
  },
};

interface PerformanceScreenProps {
  initialTab?: PerformanceTabKey;
  onTabChange?: (tab: PerformanceTabKey) => void;
  onOpenAddStudent: () => void;
}

export function PerformanceScreen({
  initialTab = 'homework',
  onTabChange,
  onOpenAddStudent,
}: PerformanceScreenProps) {
  const { activeStudent, homeworkList, attendanceData, assessments, teacherFeedback } = useStudent();
  const { theme } = useTheme();
  const { t, isRTL, language } = useLanguage();

  const [activeTab, setActiveTab] = useState<PerformanceTabKey>(initialTab);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  const [selectedHomework, setSelectedHomework] = useState<Homework | null>(null);
  const [homeworkFilter, setHomeworkFilter] = useState<'all' | 'needs_revision' | 'completed'>('all');
  const [selectedWeekIndex, setSelectedWeekIndex] = useState<number>(0);
  const [attendanceViewMode, setAttendanceViewMode] = useState<'timeline' | 'history'>('timeline');
  const [historyFilter, setHistoryFilter] = useState<'all' | 'present' | 'late' | 'absent' | 'excused'>('all');
  const [expandedMonths, setExpandedMonths] = useState<Record<string, boolean>>({});

  const toggleMonthExpand = (key: string) => {
    setExpandedMonths((prev) => ({
      ...prev,
      [key]: prev[key] === undefined ? false : !prev[key],
    }));
  };

  // Helper to safely parse local date from string YYYY-MM-DD or Date object without UTC timezone drift
  const parseLocalDate = (dateInput: Date | string): Date => {
    if (dateInput instanceof Date) {
      const d = new Date(dateInput);
      d.setHours(0, 0, 0, 0);
      return d;
    }
    if (typeof dateInput === 'string') {
      const str = dateInput.trim();
      const match = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
      if (match) {
        const [, y, m, d] = match;
        return new Date(Number(y), Number(m) - 1, Number(d), 0, 0, 0, 0);
      }
    }
    const d = new Date(dateInput);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  // Helper to format a week's Saturday-to-Thursday date range string
  const formatWeekRange = (startOfWeek: Date, endOfWeek: Date, lang: string) => {
    const startDay = String(startOfWeek.getDate()).padStart(2, '0');
    const endDay = String(endOfWeek.getDate()).padStart(2, '0');

    const monthNamesAr = [
      'جانفي', 'فيفري', 'مارس', 'أفريل', 'ماي', 'جوان',
      'جويلية', 'أوت', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    const monthNamesFr = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    const monthNamesEn = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const startMonthIdx = startOfWeek.getMonth();
    const endMonthIdx = endOfWeek.getMonth();
    const year = endOfWeek.getFullYear();

    if (lang === 'ar') {
      if (startMonthIdx === endMonthIdx) {
        return `${startDay} - ${endDay} ${monthNamesAr[endMonthIdx]} ${year}`;
      }
      return `${startDay} ${monthNamesAr[startMonthIdx]} - ${endDay} ${monthNamesAr[endMonthIdx]} ${year}`;
    } else if (lang === 'fr') {
      if (startMonthIdx === endMonthIdx) {
        return `${startDay} - ${endDay} ${monthNamesFr[endMonthIdx]} ${year}`;
      }
      return `${startDay} ${monthNamesFr[startMonthIdx]} - ${endDay} ${monthNamesFr[endMonthIdx]} ${year}`;
    } else {
      if (startMonthIdx === endMonthIdx) {
        return `${monthNamesEn[endMonthIdx]} ${startDay} - ${endDay}, ${year}`;
      }
      return `${monthNamesEn[startMonthIdx]} ${startDay} - ${monthNamesEn[endMonthIdx]} ${endDay}, ${year}`;
    }
  };

  // Helper to get the Saturday start of any date
  const getSaturdayOfWeek = (dateInput: Date | string): Date => {
    const d = parseLocalDate(dateInput);
    const day = d.getDay(); // 0: Sun, 1: Mon, ..., 6: Sat
    const diffToSaturday = (day + 1) % 7;
    const sat = new Date(d);
    sat.setDate(d.getDate() - diffToSaturday);
    sat.setHours(0, 0, 0, 0);
    return sat;
  };

  // Formats Saturday as deterministic YYYY-MM-DD key
  const getSaturdayKey = (dateInput: Date | string): string => {
    const sat = getSaturdayOfWeek(dateInput);
    const y = sat.getFullYear();
    const m = String(sat.getMonth() + 1).padStart(2, '0');
    const d = String(sat.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // Build dynamic, chronologically ordered weeks from both current date and recorded attendance sessions
  const WEEKS_LIST = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const currentSat = getSaturdayOfWeek(now);
    const currentSatKey = getSaturdayKey(now);

    const nextSat = new Date(currentSat);
    nextSat.setDate(currentSat.getDate() + 7);
    const nextSatKey = getSaturdayKey(nextSat);

    const lastSat = new Date(currentSat);
    lastSat.setDate(currentSat.getDate() - 7);
    const lastSatKey = getSaturdayKey(lastSat);

    const prevSat = new Date(currentSat);
    prevSat.setDate(currentSat.getDate() - 14);
    const prevSatKey = getSaturdayKey(prevSat);

    // Map of unique Saturday key ('YYYY-MM-DD') -> { start, end, satTimestamp }
    const weeksMap = new Map<string, { start: Date; end: Date; satTimestamp: number }>();

    // 1. Incorporate any actual recorded attendance sessions for the student first
    (attendanceData?.records || []).forEach((rec) => {
      if (rec.date) {
        try {
          const sat = getSaturdayOfWeek(rec.date);
          const thu = new Date(sat);
          thu.setDate(sat.getDate() + 5);
          thu.setHours(0, 0, 0, 0);
          const key = getSaturdayKey(rec.date);
          if (!weeksMap.has(key)) {
            weeksMap.set(key, { start: sat, end: thu, satTimestamp: sat.getTime() });
          }
        } catch {}
      }
    });

    // 2. Always include Next Week, Current Week, and Previous Week relative to today
    [nextSat, currentSat, lastSat].forEach((sat) => {
      const thu = new Date(sat);
      thu.setDate(sat.getDate() + 5);
      thu.setHours(0, 0, 0, 0);
      const key = getSaturdayKey(sat);
      if (!weeksMap.has(key)) {
        weeksMap.set(key, { start: sat, end: thu, satTimestamp: sat.getTime() });
      }
    });

    // 3. Sort weeks descending (future -> current -> past)
    const sortedWeeks = Array.from(weeksMap.entries()).sort((a, b) => b[1].satTimestamp - a[1].satTimestamp);

    return sortedWeeks.map(([key, { start, end, satTimestamp }], index) => {
      let label = '';
      if (key === nextSatKey) {
        label = t.nextWeek;
      } else if (key === currentSatKey) {
        label = t.currentWeek;
      } else if (key === lastSatKey) {
        label = t.previousWeek;
      } else if (key === prevSatKey) {
        label = language === 'ar' ? 'الأسبوع الأسبق' : 'Previous Week';
      } else {
        const startDay = String(start.getDate()).padStart(2, '0');
        const endDay = String(end.getDate()).padStart(2, '0');
        const mAr = ['جانفي', 'فيفري', 'مارس', 'أفريل', 'ماي', 'جوان', 'جويلية', 'أوت', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'][end.getMonth()];
        label = language === 'ar' ? `أسبوع ${startDay} - ${endDay} ${mAr}` : `Week ${startDay}-${endDay}`;
      }

      return {
        key,
        index,
        satTimestamp,
        start,
        end,
        label,
        isCurrent: key === currentSatKey,
        isNext: key === nextSatKey,
        isLast: key === lastSatKey,
        range: formatWeekRange(start, end, language),
      };
    });
  }, [attendanceData?.records, language, t]);

  const performanceTabs: { key: PerformanceTabKey; label: string }[] = [
    { key: 'homework', label: t.tabHomework },
    { key: 'attendance', label: t.tabAttendance },
    { key: 'assessments', label: t.tabAssessments },
    { key: 'feedback', label: t.tabTeacherFeedback },
  ];

  // Weekly Attendance calculations for the selected week
  const selectedWeek = WEEKS_LIST[selectedWeekIndex] || WEEKS_LIST[0];

  const currentWeekRecords = useMemo(() => {
    if (!selectedWeek) return [];
    return (attendanceData?.records || []).filter((r) => {
      if (!r.date) return false;
      try {
        const rKey = getSaturdayKey(r.date);
        return rKey === selectedWeek.key;
      } catch {
        return false;
      }
    });
  }, [attendanceData?.records, selectedWeek]);

  const weekPresentCount = currentWeekRecords.filter((r) => r.status === 'present').length;
  const weekLateCount = currentWeekRecords.filter((r) => r.status === 'late').length;
  const weekAbsentCount = currentWeekRecords.filter((r) => r.status === 'absent').length;
  const weekExcusedCount = currentWeekRecords.filter((r) => r.status === 'excused').length;
  const weekTotal = currentWeekRecords.length || 1;
  const weekPercentage = Math.round(((weekPresentCount + weekExcusedCount) / weekTotal) * 100);

  // Group all historical attendance records by Year and Month for the full history archive
  const historyYearGroups = useMemo(() => {
    const allRecords = attendanceData?.records || [];
    if (allRecords.length === 0) return [];

    const monthNamesAr = [
      'جانفي', 'فيفري', 'مارس', 'أفريل', 'ماي', 'جوان',
      'جويلية', 'أوت', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    const monthNamesFr = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    const monthNamesEn = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const yearMap = new Map<number, Map<string, {
      monthKey: string;
      year: number;
      monthIndex: number;
      monthName: string;
      records: AttendanceRecord[];
      presentCount: number;
      lateCount: number;
      absentCount: number;
      excusedCount: number;
      total: number;
      percentage: number;
    }>>();

    allRecords.forEach((r) => {
      if (!r.date) return;
      try {
        const d = parseLocalDate(r.date);
        const y = d.getFullYear();
        const m = d.getMonth();
        const monthKey = `${y}-${String(m + 1).padStart(2, '0')}`;

        if (!yearMap.has(y)) {
          yearMap.set(y, new Map());
        }
        const mGroups = yearMap.get(y)!;
        if (!mGroups.has(monthKey)) {
          const mName = language === 'ar'
            ? `${monthNamesAr[m]} ${y}`
            : language === 'fr'
            ? `${monthNamesFr[m]} ${y}`
            : `${monthNamesEn[m]} ${y}`;

          mGroups.set(monthKey, {
            monthKey,
            year: y,
            monthIndex: m,
            monthName: mName,
            records: [],
            presentCount: 0,
            lateCount: 0,
            absentCount: 0,
            excusedCount: 0,
            total: 0,
            percentage: 0,
          });
        }

        const mg = mGroups.get(monthKey)!;
        mg.records.push(r);
        if (r.status === 'present') mg.presentCount++;
        else if (r.status === 'late') mg.lateCount++;
        else if (r.status === 'absent') mg.absentCount++;
        else if (r.status === 'excused') mg.excusedCount++;
        mg.total++;
        mg.percentage = Math.round(((mg.presentCount + mg.lateCount) / mg.total) * 100);
      } catch {}
    });

    const sortedYears = Array.from(yearMap.keys()).sort((a, b) => b - a);

    return sortedYears.map((year) => {
      const mGroups = yearMap.get(year)!;
      const sortedMonths = Array.from(mGroups.values()).sort((a, b) => b.monthIndex - a.monthIndex);

      const monthsWithFilteredRecords = sortedMonths.map((m) => ({
        ...m,
        displayedRecords: m.records
          .filter((r) => historyFilter === 'all' || r.status === historyFilter)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      })).filter((m) => m.displayedRecords.length > 0);

      const totalYearSessions = sortedMonths.reduce((acc, m) => acc + m.total, 0);
      const totalYearAttended = sortedMonths.reduce((acc, m) => acc + m.presentCount + m.lateCount, 0);
      const yearPercentage = totalYearSessions > 0 ? Math.round((totalYearAttended / totalYearSessions) * 100) : 0;

      return {
        year,
        months: monthsWithFilteredRecords,
        totalSessions: totalYearSessions,
        percentage: yearPercentage,
      };
    }).filter((yg) => yg.months.length > 0);
  }, [attendanceData?.records, historyFilter, language]);

  // Homework filter
  const filteredHomework = homeworkList.filter((h) => {
    if (homeworkFilter === 'needs_revision') return h.status === 'needs_revision';
    if (homeworkFilter === 'completed') return h.status === 'completed';
    return true;
  });

  const needsRevisionCount = homeworkList.filter((h) => h.status === 'needs_revision').length;
  const completedCount = homeworkList.filter((h) => h.status === 'completed').length;

  const translateDayName = (dayAr?: string) => {
    if (!dayAr) return '';
    if (language === 'ar') return dayAr;
    const daysEn: Record<string, string> = {
      السبت: 'Saturday',
      الأحد: 'Sunday',
      الإثنين: 'Monday',
      الثلاثاء: 'Tuesday',
      الأربعاء: 'Wednesday',
      الخميس: 'Thursday',
      الجمعة: 'Friday',
    };
    const daysFr: Record<string, string> = {
      السبت: 'Samedi',
      الأحد: 'Dimanche',
      الإثنين: 'Lundi',
      الثلاثاء: 'Mardi',
      الأربعاء: 'Mercredi',
      الخميس: 'Jeudi',
      الجمعة: 'Vendredi',
    };
    return language === 'fr' ? daysFr[dayAr] || dayAr : daysEn[dayAr] || dayAr;
  };

  return (
    <div className={`space-y-6 animate-fade-in ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        style={{
          marginTop: '16px',
          marginBottom: '14px',
        }}
      >
        <div>
          <span className="text-xs font-semibold text-slate-400 block mb-0.5">
            {t.performanceSubtitle}
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t.performanceTitle}
          </h1>
        </div>

        <div className="self-start sm:self-auto shrink-0">
          <span
            className="inline-flex items-center rounded-full font-bold text-white shadow-xs select-none"
            style={{
              backgroundColor: theme.primary,
              height: '30px',
              paddingRight: '14px',
              paddingLeft: '14px',
              fontSize: '12px',
            }}
          >
            {t.level} {activeStudent.currentLevel}
          </span>
        </div>
      </div>

      {/* Mobile-only student switcher */}
      <div className="block md:hidden mb-4">
        <StudentSwitcher onOpenAddStudent={onOpenAddStudent} />
      </div>

      {/* Top Segmented Tab Navigation */}
      <div
        className="rounded-xl bg-slate-100 dark:bg-slate-850 flex gap-1 border border-slate-200/80 dark:border-slate-800 shadow-2xs"
        style={{
          marginBottom: '16px',
          padding: '3px',
          minHeight: '38px',
        }}
      >
        {performanceTabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const showBadge = tab.key === 'homework' && needsRevisionCount > 0;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                setActiveTab(tab.key);
                onTabChange?.(tab.key);
              }}
              className={`flex-1 rounded-lg transition-all relative flex items-center justify-center gap-2 cursor-pointer select-none ${
                isActive
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
              }`}
              style={{
                height: '32px',
                padding: '0 10px',
                fontSize: '12px',
                color: isActive ? theme.primary : undefined,
              }}
            >
              <span className="font-black tracking-tight">{tab.label}</span>
              {showBadge && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* TAB 1: Homework */}
      {/* ============================================================ */}
      {activeTab === 'homework' && (
        <div className="space-y-3.5 animate-fade-in">
          {/* Filter Pills */}
          <div
            className="flex items-center gap-2.5 flex-wrap"
            style={{ marginBottom: '16px' }}
          >
            <button
              type="button"
              onClick={() => setHomeworkFilter('all')}
              className={`rounded-full font-bold text-xs transition-colors cursor-pointer select-none shadow-2xs ${
                homeworkFilter === 'all'
                  ? 'text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
              style={{
                backgroundColor: homeworkFilter === 'all' ? theme.primary : undefined,
                height: '30px',
                paddingRight: '14px',
                paddingLeft: '14px',
              }}
            >
              {t.filterAll} ({homeworkList.length})
            </button>

            <button
              type="button"
              onClick={() => setHomeworkFilter('needs_revision')}
              className={`rounded-full font-bold text-xs transition-colors cursor-pointer select-none shadow-2xs ${
                homeworkFilter === 'needs_revision'
                  ? 'bg-amber-500 text-white'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100'
              }`}
              style={{
                height: '30px',
                paddingRight: '14px',
                paddingLeft: '14px',
              }}
            >
              {t.needsRevision} ({needsRevisionCount})
            </button>

            <button
              type="button"
              onClick={() => setHomeworkFilter('completed')}
              className={`rounded-full font-bold text-xs transition-colors cursor-pointer select-none shadow-2xs ${
                homeworkFilter === 'completed'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100'
              }`}
              style={{
                height: '30px',
                paddingRight: '14px',
                paddingLeft: '14px',
              }}
            >
              {t.completed} ({completedCount})
            </button>
          </div>

          {/* Homework Items List */}
          <div className="flex flex-col gap-3">
            {filteredHomework.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs font-semibold bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                {t.noHomeworkFound}
              </div>
            ) : (
              filteredHomework.map((hw) => {
                const isRevision = hw.status === 'needs_revision';
                const isCompleted = hw.status === 'completed';

                return (
                  <div
                    key={hw.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedHomework(hw)}
                    onKeyDown={(e) => e.key === 'Enter' && setSelectedHomework(hw)}
                    className={`border transition-all cursor-pointer flex flex-col justify-between select-none ${
                      isRevision
                        ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700/70 shadow-sm ring-1 ring-amber-400/20'
                        : isCompleted
                        ? 'bg-white dark:bg-slate-850 border-slate-200/80 dark:border-slate-800 hover:border-emerald-300 shadow-2xs'
                        : 'bg-white dark:bg-slate-850 border-slate-200/80 dark:border-slate-800 shadow-2xs'
                    }`}
                    style={{
                      padding: '16px 20px',
                      borderRadius: '18px',
                    }}
                  >
                    <div>
                      {/* Top Bar */}
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <span className="text-xs font-bold text-slate-400">
                          {t.level} {hw.level} • {translateSubject(hw.subjectAr, language)}
                        </span>

                        {isRevision && (
                          <span
                            className="inline-flex items-center rounded-full text-xs font-bold bg-amber-500 text-white shadow-xs animate-pulse"
                            style={{
                              height: '26px',
                              paddingRight: '12px',
                              paddingLeft: '12px',
                            }}
                          >
                            {t.needsRevision}
                          </span>
                        )}

                        {isCompleted && (
                          <span
                            className="inline-flex items-center rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                            style={{
                              height: '26px',
                              paddingRight: '12px',
                              paddingLeft: '12px',
                            }}
                          >
                            {t.completed} ✓
                          </span>
                        )}

                        {!isRevision && !isCompleted && (
                          <span
                            className="inline-flex items-center rounded-full text-xs font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                            style={{
                              height: '26px',
                              paddingRight: '12px',
                              paddingLeft: '12px',
                            }}
                          >
                            {t.pending}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3
                        className="text-base font-bold text-slate-900 dark:text-white leading-snug"
                        style={{ margin: '4px 0 8px 0' }}
                      >
                        {translateHomeworkTitle(hw.titleAr, language)}
                      </h3>

                      {/* Teacher Feedback Alert if needs revision */}
                      {hw.teacherNote && isRevision && (
                        <div
                          className="rounded-xl bg-amber-100/70 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 leading-relaxed font-medium"
                          style={{
                            padding: '10px 14px',
                            marginTop: '8px',
                          }}
                        >
                          <span className="font-bold">{t.teacherNoteLabel} </span>
                          {translateTeacherNote(hw.teacherNote, language)}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="mt-3.5 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Clock size={13} />
                        {t.dueDateLabel} {hw.dueDate}
                      </span>

                      {hw.score !== undefined && (
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-mono">
                          {t.scoreLabel} {hw.score} / {hw.totalScore || (hw as any).maxScore || 20}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: Attendance */}
      {/* ============================================================ */}
      {activeTab === 'attendance' && (
        <div className="space-y-6 animate-fade-in">
          {/* Main Attendance Percentage Hero + Stats Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5">
            <div
              className="rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center justify-between"
              style={{ padding: '10px 16px' }}
            >
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400">{t.overallAttendanceRate}</span>
                <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono leading-none">
                  {attendanceData.summary.attendancePercentage}%
                </div>
                <span className="text-[10px] font-bold text-slate-400 block pt-0.5">
                  {attendanceData.summary.totalDays === 0
                    ? (language === 'ar' ? 'طالب مسجل حديثاً (لم تسجل حصص بعد)' : 'Newly enrolled student (No sessions yet)')
                    : attendanceData.summary.attendancePercentage >= 90
                    ? (language === 'ar' ? 'معدل انضباط متميز' : 'Excellent Discipline Rate')
                    : (language === 'ar' ? 'معدل انضباط جيد' : 'Good Discipline Rate')}
                </span>
              </div>

              {/* Circular Ring Visual */}
              <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100 dark:text-slate-800"
                    strokeWidth="3.8"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    strokeDasharray={`${attendanceData.summary.attendancePercentage}, 100`}
                    strokeWidth="3.8"
                    strokeLinecap="round"
                    style={{ stroke: theme.primary }}
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute font-black text-[10px] text-slate-900 dark:text-white font-mono">
                  {attendanceData.summary.presentDays} / {attendanceData.summary.totalDays}
                </div>
              </div>
            </div>

            {/* Breakdown Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 lg:col-span-2">
              <div
                className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 text-center flex flex-col justify-center"
                style={{ padding: '8px 10px' }}
              >
                <span className="text-lg sm:text-xl font-black text-emerald-700 dark:text-emerald-300 leading-tight">
                  {attendanceData.summary.presentDays}
                </span>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">
                  {t.present}
                </span>
              </div>

              <div
                className="rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-800/40 text-center flex flex-col justify-center"
                style={{ padding: '8px 10px' }}
              >
                <span className="text-lg sm:text-xl font-black text-rose-700 dark:text-rose-300 leading-tight">
                  {attendanceData.summary.absentDays}
                </span>
                <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 block mt-0.5">
                  {t.absent}
                </span>
              </div>

              <div
                className="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 text-center flex flex-col justify-center"
                style={{ padding: '8px 10px' }}
              >
                <span className="text-lg sm:text-xl font-black text-amber-700 dark:text-amber-300 leading-tight">
                  {attendanceData.summary.lateDays}
                </span>
                <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 block mt-0.5">
                  {t.late}
                </span>
              </div>

              <div
                className="rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/40 text-center flex flex-col justify-center"
                style={{ padding: '8px 10px' }}
              >
                <span className="text-lg sm:text-xl font-black text-blue-700 dark:text-blue-300 leading-tight">
                  {attendanceData.summary.excusedDays}
                </span>
                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 block mt-0.5">
                  {t.excused}
                </span>
              </div>
            </div>
          </div>

          {/* View Mode Switcher Header: Weekly Timeline vs Full History Archive */}
          <div
            className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            style={{
              marginTop: '28px',
              padding: '16px 20px',
              borderRadius: '20px',
            }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                style={{
                  backgroundColor: `${theme.primary}15`,
                  color: theme.primary,
                }}
              >
                {attendanceViewMode === 'timeline' ? <CalendarRange size={20} /> : <History size={20} />}
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                  {attendanceViewMode === 'timeline'
                    ? (language === 'ar' ? 'الجدول الزمني الأسبوعي للحصص' : language === 'fr' ? 'Chronologie Hebdomadaire des Séances' : 'Weekly Class Timeline')
                    : (language === 'ar' ? 'سجل الحضور والأرشيف الزمني الشامل' : language === 'fr' ? 'Historique et Archives des Séances' : 'Full Attendance History & Archive')}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-400 font-medium">
                  {attendanceViewMode === 'timeline'
                    ? (language === 'ar' ? 'استعراض الحصص حسب الأسابيع (القادم، الحالي، السابق)' : 'Navigate sessions by timeline weeks')
                    : (language === 'ar' ? 'سجل شامل مصنف حسب الأشهر والسنوات الدراسية' : 'Comprehensive archive grouped by months and years')}
                </p>
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 shrink-0">
              <button
                type="button"
                onClick={() => setAttendanceViewMode('timeline')}
                className={`inline-flex items-center gap-1.5 rounded-lg text-xs font-black transition-all cursor-pointer select-none ${
                  attendanceViewMode === 'timeline'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                style={{
                  height: '32px',
                  padding: '0 12px',
                  color: attendanceViewMode === 'timeline' ? theme.primary : undefined,
                }}
              >
                <CalendarRange size={14} />
                <span>{language === 'ar' ? 'الجدول الأسبوعي' : 'Weekly View'}</span>
              </button>

              <button
                type="button"
                onClick={() => setAttendanceViewMode('history')}
                className={`inline-flex items-center gap-1.5 rounded-lg text-xs font-black transition-all cursor-pointer select-none ${
                  attendanceViewMode === 'history'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                style={{
                  height: '32px',
                  padding: '0 12px',
                  color: attendanceViewMode === 'history' ? theme.primary : undefined,
                }}
              >
                <History size={14} />
                <span>{language === 'ar' ? 'سجل الأرشيف' : 'Full History'}</span>
              </button>
            </div>
          </div>

          {/* ============================================================ */}
          {/* VIEW A: Weekly Timeline */}
          {/* ============================================================ */}
          {attendanceViewMode === 'timeline' && (
            <div className="space-y-6 animate-fade-in">
              {/* Timeline Week Switcher Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* 3 Quick Timeline Buttons */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-700/60 flex-wrap">
                  {WEEKS_LIST.map((wk) => {
                    const isSelected = selectedWeekIndex === wk.index;
                    return (
                      <button
                        key={wk.key}
                        type="button"
                        onClick={() => setSelectedWeekIndex(wk.index)}
                        className={`rounded-lg font-black text-xs transition-all cursor-pointer select-none inline-flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                        style={{
                          height: '32px',
                          paddingRight: '14px',
                          paddingLeft: '14px',
                          color: isSelected ? theme.primary : undefined,
                        }}
                      >
                        {wk.isCurrent && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 ring-2 ring-emerald-300 dark:ring-emerald-900 animate-pulse" />
                        )}
                        <span>{wk.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Left / Right Chronological Navigation */}
                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <span className="text-xs text-slate-400 font-medium">
                    {selectedWeekIndex + 1} / {WEEKS_LIST.length}
                  </span>
                  <button
                    type="button"
                    disabled={selectedWeekIndex >= WEEKS_LIST.length - 1}
                    onClick={() => setSelectedWeekIndex((prev) => Math.min(WEEKS_LIST.length - 1, prev + 1))}
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    title={isRTL ? 'الأسبوع السابق' : 'Previous Week'}
                  >
                    {isRTL ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                  </button>

                  <button
                    type="button"
                    disabled={selectedWeekIndex <= 0}
                    onClick={() => setSelectedWeekIndex((prev) => Math.max(0, prev - 1))}
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    title={isRTL ? 'الأسبوع التالي' : 'Next Week'}
                  >
                    {isRTL ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                  </button>
                </div>
              </div>

              {/* Active Week Status & Date Range Bar */}
              <div
                className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-750 flex items-center justify-between flex-wrap gap-2.5 text-xs font-bold"
                style={{
                  padding: '12px 20px',
                  borderRadius: '16px',
                }}
              >
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                    {WEEKS_LIST[selectedWeekIndex]?.label}:
                  </span>
                  <span className="font-mono text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                    ({WEEKS_LIST[selectedWeekIndex]?.range})
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs flex-wrap">
                  <span className="text-emerald-600 font-black">
                    {t.present}: {weekPresentCount} {language === 'ar' ? 'أيام' : language === 'fr' ? 'jours' : 'days'}
                  </span>
                  {weekLateCount > 0 && (
                    <span className="text-amber-600 font-black">
                      {t.late}: {weekLateCount}
                    </span>
                  )}
                  {weekAbsentCount > 0 && (
                    <span className="text-rose-600 font-black">
                      {t.absent}: {weekAbsentCount}
                    </span>
                  )}
                  {weekExcusedCount > 0 && (
                    <span className="text-blue-600 font-black">
                      {t.excused}: {weekExcusedCount}
                    </span>
                  )}
                  <span
                    className="inline-flex items-center rounded-full text-white font-black shadow-2xs select-none text-xs"
                    style={{
                      backgroundColor: theme.primary,
                      height: '28px',
                      paddingRight: '12px',
                      paddingLeft: '12px',
                    }}
                  >
                    {language === 'ar'
                        ? `نسبة الأسبوع: ${currentWeekRecords.length === 0 ? 0 : weekPercentage}%`
                        : language === 'fr'
                        ? `Taux hebdo: ${currentWeekRecords.length === 0 ? 0 : weekPercentage}%`
                        : `Week Rate: ${currentWeekRecords.length === 0 ? 0 : weekPercentage}%`}
                  </span>
                </div>
              </div>

              {/* Weekly Timetable Schedule Grid */}
              {currentWeekRecords.length === 0 ? (
                <div
                  className="rounded-[20px] bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-center flex flex-col items-center justify-center shadow-xs"
                  style={{ padding: '36px 20px', marginBottom: '36px' }}
                >
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 shadow-xs">
                    <CalendarDays size={24} />
                  </div>
                  <h4 className="font-black text-sm sm:text-base text-slate-900 dark:text-white mb-1">
                    {language === 'ar' ? 'لا توجد حصص مسجلة في هذا الأسبوع' : 'No sessions recorded for this week'}
                  </h4>
                  <p className="text-xs text-slate-400 max-w-md leading-relaxed">
                    {language === 'ar'
                      ? 'يمكنك التنقل بين الأسابيع الأخرى أو التبديل إلى "سجل الأرشيف" للاطلاع على كامل الحصص التاريخية للطالب.'
                      : 'You can navigate to other weeks or switch to the Full History tab to view all past records.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" style={{ paddingBottom: '36px' }}>
                  {currentWeekRecords.map((rec) => {
                    const isPresent = rec.status === 'present';
                    const isAbsent = rec.status === 'absent';
                    const isLate = rec.status === 'late';

                    const subjectAr = rec.subjectAr || 'اللغة الإنجليزية';
                    const translatedSubject = translateSubject(subjectAr, language);
                    const dayLabel = translateDayName(rec.dayNameAr);
                    const langBadge = getLanguageBadgeTheme(subjectAr);

                    return (
                      <div
                        key={rec.id}
                        className={`rounded-2xl border ${langBadge.bgClass} ${langBadge.borderClass} flex flex-col justify-between shadow-2xs select-none transition-all hover:shadow-md`}
                        style={{
                          padding: '12px 14px',
                        }}
                      >
                        <div>
                          {/* Top Row: Day Title + Status Badge */}
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                                {dayLabel}
                              </span>
                              <span dir="ltr" className="text-[11px] text-slate-400 font-mono font-bold">
                                {rec.date}
                              </span>
                            </div>

                            <span
                              className={`inline-flex items-center justify-center rounded-full text-[11px] font-black shadow-2xs select-none ${
                                isPresent
                                  ? 'bg-emerald-500 text-white'
                                  : isAbsent
                                  ? 'bg-rose-500 text-white'
                                  : isLate
                                  ? 'bg-amber-500 text-white'
                                  : 'bg-blue-500 text-white'
                              }`}
                              style={{
                                height: '22px',
                                paddingRight: '10px',
                                paddingLeft: '10px',
                              }}
                            >
                              {isPresent
                                ? `${t.present} ✓`
                                : isAbsent
                                ? `${t.absent} ✕`
                                : isLate
                                ? `${t.late} ⏱`
                                : `${t.excused} ✉`}
                            </span>
                          </div>

                          {/* Subject Pill in Colored Container */}
                          <div className="flex items-center mb-2">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold shadow-2xs ${langBadge.badgeContainer}`}
                            >
                              <BookOpen size={13} className={`${langBadge.iconClass} shrink-0`} />
                              <span>{translatedSubject}</span>
                            </span>
                          </div>

                          {/* Session Time */}
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
                            <Clock size={13} className="shrink-0 text-slate-400" />
                            <span dir="ltr" className="font-mono font-bold text-[11px]">
                              {(() => {
                                const raw = rec.sessionTimeAr || '04:30 PM - 06:00 PM';
                                if (raw.includes(' / ')) {
                                  const parts = raw.split(' - ');
                                  if (parts.length === 2) {
                                    const startParts = parts[0].split(' / ');
                                    return `${startParts[startParts.length - 1].trim()} - ${parts[1].trim()}`;
                                  }
                                  const slashParts = raw.split(' / ');
                                  return slashParts[slashParts.length - 1].trim();
                                }
                                return raw;
                              })()}
                            </span>
                          </div>
                        </div>

                        {/* Note / Excuse Footer if present */}
                        {rec.noteAr && (
                          <div
                            className="mt-2.5 p-2 px-3 rounded-lg bg-white/70 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 text-[11px] text-slate-700 dark:text-slate-300 font-medium"
                          >
                            <span className="font-bold">{language === 'ar' ? 'ملاحظة: ' : language === 'fr' ? 'Remarque : ' : 'Note: '}</span>
                            {rec.noteAr}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* VIEW B: Full Attendance History Archive (Grouped by Month & Year) */}
          {/* ============================================================ */}
          {attendanceViewMode === 'history' && (
            <div className="space-y-6 animate-fade-in" style={{ paddingBottom: '40px' }}>
              {/* History Filter Pills */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setHistoryFilter('all')}
                  className={`rounded-full font-bold text-xs transition-colors cursor-pointer select-none shadow-2xs ${
                    historyFilter === 'all'
                      ? 'text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                  style={{
                    backgroundColor: historyFilter === 'all' ? theme.primary : undefined,
                    height: '30px',
                    paddingRight: '14px',
                    paddingLeft: '14px',
                  }}
                >
                  {t.filterAll} ({attendanceData.records.length})
                </button>

                <button
                  type="button"
                  onClick={() => setHistoryFilter('present')}
                  className={`rounded-full font-bold text-xs transition-colors cursor-pointer select-none shadow-2xs ${
                    historyFilter === 'present'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100'
                  }`}
                  style={{
                    height: '30px',
                    paddingRight: '14px',
                    paddingLeft: '14px',
                  }}
                >
                  {t.present} ({attendanceData.records.filter((r) => r.status === 'present').length})
                </button>

                <button
                  type="button"
                  onClick={() => setHistoryFilter('late')}
                  className={`rounded-full font-bold text-xs transition-colors cursor-pointer select-none shadow-2xs ${
                    historyFilter === 'late'
                      ? 'bg-amber-500 text-white'
                      : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100'
                  }`}
                  style={{
                    height: '30px',
                    paddingRight: '14px',
                    paddingLeft: '14px',
                  }}
                >
                  {t.late} ({attendanceData.records.filter((r) => r.status === 'late').length})
                </button>

                <button
                  type="button"
                  onClick={() => setHistoryFilter('absent')}
                  className={`rounded-full font-bold text-xs transition-colors cursor-pointer select-none shadow-2xs ${
                    historyFilter === 'absent'
                      ? 'bg-rose-600 text-white'
                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 hover:bg-rose-100'
                  }`}
                  style={{
                    height: '30px',
                    paddingRight: '14px',
                    paddingLeft: '14px',
                  }}
                >
                  {t.absent} ({attendanceData.records.filter((r) => r.status === 'absent').length})
                </button>

                <button
                  type="button"
                  onClick={() => setHistoryFilter('excused')}
                  className={`rounded-full font-bold text-xs transition-colors cursor-pointer select-none shadow-2xs ${
                    historyFilter === 'excused'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 hover:bg-blue-100'
                  }`}
                  style={{
                    height: '30px',
                    paddingRight: '14px',
                    paddingLeft: '14px',
                  }}
                >
                  {t.excused} ({attendanceData.records.filter((r) => r.status === 'excused').length})
                </button>
              </div>

              {/* History Grouped by Year and Month */}
              {historyYearGroups.length === 0 ? (
                <div
                  className="rounded-[20px] bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-center flex flex-col items-center justify-center shadow-xs"
                  style={{ padding: '40px 20px' }}
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-3">
                    <History size={24} />
                  </div>
                  <h4 className="font-black text-sm sm:text-base text-slate-900 dark:text-white mb-1">
                    {language === 'ar' ? 'لا يوجد سجل حصص تاريخي مطابق' : 'No historical session records found'}
                  </h4>
                  <p className="text-xs text-slate-400 max-w-md leading-relaxed">
                    {language === 'ar'
                      ? 'سيتم تسجيل وحفظ جميع الحصص الدراسية وتصنيفها تلقائياً حسب الأشهر والسنوات فور انعقادها.'
                      : 'All attended sessions will be archived here by month and year automatically as they occur.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {historyYearGroups.map((yearGroup) => (
                    <div key={yearGroup.year} className="space-y-4">
                      {/* Year Section Header Badge */}
                      <div className="flex items-center justify-between gap-3 px-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.primary }} />
                          <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-mono">
                            {language === 'ar' ? `السنة الدراسية ${yearGroup.year}` : `Academic Year ${yearGroup.year}`}
                          </h4>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-400">
                            {yearGroup.totalSessions} {language === 'ar' ? 'حصص مسجلة' : 'sessions'}
                          </span>
                          <span
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-black shadow-2xs"
                            style={{
                              backgroundColor: `${theme.primary}18`,
                              color: theme.primary,
                            }}
                          >
                            {language === 'ar' ? `الانضباط السنوي: ${yearGroup.percentage}%` : `Discipline: ${yearGroup.percentage}%`}
                          </span>
                        </div>
                      </div>

                      {/* Months Accordions in this Year */}
                      <div className="space-y-3">
                        {yearGroup.months.map((monthGroup) => {
                          const isExpanded = expandedMonths[monthGroup.monthKey] !== false; // default expanded

                          return (
                            <div
                              key={monthGroup.monthKey}
                              className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-2xs overflow-hidden transition-all"
                            >
                              {/* Month Accordion Header */}
                              <button
                                type="button"
                                onClick={() => toggleMonthExpand(monthGroup.monthKey)}
                                className="w-full flex items-center justify-between gap-3 p-4 text-right cursor-pointer select-none hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs"
                                    style={{
                                      backgroundColor: `${theme.primary}12`,
                                      color: theme.primary,
                                    }}
                                  >
                                    <CalendarDays size={18} />
                                  </div>
                                  <div>
                                    <h5 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                                      {monthGroup.monthName}
                                    </h5>
                                    <span className="text-[11px] text-slate-400 font-medium block">
                                      {monthGroup.displayedRecords.length} {language === 'ar' ? 'حصص دراسية' : 'sessions'}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 sm:gap-3">
                                  {/* Stats Pills */}
                                  <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold">
                                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300">
                                      {monthGroup.presentCount} {t.present}
                                    </span>
                                    {monthGroup.lateCount > 0 && (
                                      <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300">
                                        {monthGroup.lateCount} {t.late}
                                      </span>
                                    )}
                                    {monthGroup.absentCount > 0 && (
                                      <span className="px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300">
                                        {monthGroup.absentCount} {t.absent}
                                      </span>
                                    )}
                                  </div>

                                  <span
                                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black"
                                    style={{
                                      backgroundColor: `${theme.primary}15`,
                                      color: theme.primary,
                                    }}
                                  >
                                    {monthGroup.percentage}%
                                  </span>

                                  <div className="p-1 rounded-lg text-slate-400">
                                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                  </div>
                                </div>
                              </button>

                              {/* Expanded Month Sessions Timeline */}
                              {isExpanded && (
                                <div className="p-4 pt-1 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
                                  <div className="relative pl-3 pr-3 pt-2 space-y-3.5">
                                    {monthGroup.displayedRecords.map((rec, idx) => {
                                      const isPresent = rec.status === 'present';
                                      const isAbsent = rec.status === 'absent';
                                      const isLate = rec.status === 'late';
                                      const subjectAr = rec.subjectAr || 'اللغة الإنجليزية';
                                      const translatedSubject = translateSubject(subjectAr, language);
                                      const dayLabel = translateDayName(rec.dayNameAr);
                                      const langBadge = getLanguageBadgeTheme(subjectAr);

                                      return (
                                        <div
                                          key={rec.id}
                                          className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-white dark:bg-slate-850 border border-slate-200/70 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-all"
                                        >
                                          <div className="flex items-center gap-3">
                                            {/* Status Node Circle */}
                                            <div
                                              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs ${
                                                isPresent
                                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                                  : isAbsent
                                                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                                                  : isLate
                                                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                                                  : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                                              }`}
                                            >
                                              {isPresent ? '✓' : isAbsent ? '✕' : isLate ? '⏱' : '✉'}
                                            </div>

                                            <div>
                                              <div className="flex items-center gap-2">
                                                <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                                                  {dayLabel}
                                                </span>
                                                <span dir="ltr" className="text-[11px] text-slate-400 font-mono font-bold">
                                                  {rec.date}
                                                </span>
                                              </div>

                                              <div className="flex items-center gap-2 mt-1">
                                                <span
                                                  className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold ${langBadge.badgeContainer}`}
                                                >
                                                  <BookOpen size={11} className={langBadge.iconClass} />
                                                  <span>{translatedSubject}</span>
                                                </span>

                                                <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                                                  <Clock size={11} />
                                                  {(() => {
                                                    const raw = rec.sessionTimeAr || '04:30 PM - 06:00 PM';
                                                    if (raw.includes(' / ')) {
                                                      const parts = raw.split(' - ');
                                                      if (parts.length === 2) {
                                                        const startParts = parts[0].split(' / ');
                                                        return `${startParts[startParts.length - 1].trim()} - ${parts[1].trim()}`;
                                                      }
                                                      const slashParts = raw.split(' / ');
                                                      return slashParts[slashParts.length - 1].trim();
                                                    }
                                                    return raw;
                                                  })()}
                                                </span>
                                              </div>
                                            </div>
                                          </div>

                                          <div className="flex items-center gap-2 self-end sm:self-center">
                                            {rec.noteAr && (
                                              <span className="text-[11px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 px-2 py-0.5 rounded-md font-medium">
                                                {rec.noteAr}
                                              </span>
                                            )}

                                            <span
                                              className={`inline-flex items-center justify-center rounded-full text-[11px] font-black px-2.5 py-0.5 shadow-2xs ${
                                                isPresent
                                                  ? 'bg-emerald-500 text-white'
                                                  : isAbsent
                                                  ? 'bg-rose-500 text-white'
                                                  : isLate
                                                  ? 'bg-amber-500 text-white'
                                                  : 'bg-blue-500 text-white'
                                              }`}
                                            >
                                              {isPresent
                                                ? `${t.present} ✓`
                                                : isAbsent
                                                ? `${t.absent} ✕`
                                                : isLate
                                                ? `${t.late} ⏱`
                                                : `${t.excused} ✉`}
                                            </span>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: Assessments */}
      {/* ============================================================ */}
      {activeTab === 'assessments' && (
        <div className="space-y-4 animate-fade-in" style={{ paddingBottom: '40px' }}>
          {/* Skill Radar / Bars Breakdown */}
          <div
            className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-2xs"
            style={{
              padding: '16px 20px',
              borderRadius: '18px',
            }}
          >
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white" style={{ marginBottom: '12px' }}>
              {language === 'ar'
                ? `تقييم المهارات التراكمي (المستوى ${activeStudent.currentLevel})`
                : language === 'fr'
                ? `Évaluation cumulative des compétences (${t.level} ${activeStudent.currentLevel})`
                : `Cumulative Skills Evaluation (${t.level} ${activeStudent.currentLevel})`}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                {
                  name: language === 'ar' ? 'المحادثة والطلاقة الشفهية (Speaking Fluency)' : language === 'fr' ? 'Expression Orale & Fluidité (Speaking Fluency)' : 'Speaking & Verbal Fluency',
                  score: activeStudent?.skills?.speaking !== undefined ? activeStudent.skills.speaking : 0,
                },
                {
                  name: language === 'ar' ? 'الفهم السمعي والاستيعاب (Listening Comprehension)' : language === 'fr' ? 'Compréhension Orale (Listening Comprehension)' : 'Listening & Comprehension',
                  score: activeStudent?.skills?.listening !== undefined ? activeStudent.skills.listening : 0,
                },
                {
                  name: language === 'ar' ? 'القراءة والفهم القرائي (Reading Comprehension)' : language === 'fr' ? 'Lecture & Compréhension (Reading Comprehension)' : 'Reading & Text Comprehension',
                  score: activeStudent?.skills?.reading !== undefined ? activeStudent.skills.reading : 0,
                },
                {
                  name: language === 'ar' ? 'الكتابة والتعبير الكتابي (Writing & Composition)' : language === 'fr' ? 'Expression Écrite (Writing & Composition)' : 'Writing & Composition',
                  score: activeStudent?.skills?.writing !== undefined ? activeStudent.skills.writing : 0,
                },
              ].map((skill, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-750 flex flex-col justify-center"
                  style={{
                    padding: '10px 14px',
                    borderRadius: '12px',
                  }}
                >
                  <div className="flex items-center justify-between text-xs font-bold" style={{ marginBottom: '6px' }}>
                    <span className="text-slate-800 dark:text-slate-200 font-bold text-[11px] sm:text-xs truncate">{skill.name}</span>
                    <span style={{ color: theme.primary }} className="font-mono font-bold text-xs sm:text-sm shrink-0">
                      {skill.score}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${skill.score}%`,
                        backgroundColor: theme.primary,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assessments History Cards Grid */}
          <div className="space-y-3" style={{ marginTop: '18px' }}>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {t.periodicAssessments}:
            </h3>

            {assessments.length === 0 ? (
              <div
                className="rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-center flex flex-col items-center justify-center shadow-2xs"
                style={{ padding: '36px 20px' }}
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
                  <Award size={24} />
                </div>
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  {language === 'ar' ? 'لا توجد تقييمات دورية مسجلة بعد' : 'No Periodic Assessments Yet'}
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  {language === 'ar'
                    ? 'ستظهر هنا نتائج الاختبارات الدورية وتقييمات المهارات فور رصدها من قبل المعلم في الإدارة.'
                    : 'Assessment scores and skill evaluations will appear here once recorded by teachers.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {assessments.map((asm) => (
                  <div
                    key={asm.id}
                    className={`bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between ${isRTL ? 'text-right' : 'text-left'}`}
                    style={{
                      padding: '16px 20px',
                      borderRadius: '18px',
                    }}
                  >
                    <div>
                      {/* Top Row: Level/Type + Score Badge */}
                      <div className="flex items-center justify-between gap-2" style={{ marginBottom: '8px' }}>
                        <span className="text-xs font-bold text-slate-400">
                          {t.level} {asm.level} • {translateSubject(asm.typeAr, language)}
                        </span>
                        <span
                          className="inline-flex items-center justify-center rounded-full text-[11px] font-bold text-white shadow-2xs select-none"
                          style={{
                            backgroundColor: theme.primary,
                            height: '26px',
                            paddingRight: '12px',
                            paddingLeft: '12px',
                          }}
                        >
                          {asm.score}% ({language === 'ar' ? asm.gradeLetterAr || 'ممتاز' : asm.score >= 90 ? 'A+' : 'A'})
                        </span>
                      </div>

                      <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug" style={{ margin: '4px 0 6px 0' }}>
                        {translateHomeworkTitle(asm.titleAr, language)}
                      </h4>

                      {asm.teacherComments && (
                        <div
                          className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-750"
                          style={{
                            padding: '10px 14px',
                            borderRadius: '12px',
                            margin: '8px 0',
                          }}
                        >
                          "{translateTeacherNote(asm.teacherComments, language)}"
                        </div>
                      )}
                    </div>

                    <div
                      className="border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 font-bold"
                      style={{
                        paddingTop: '10px',
                        marginTop: '10px',
                      }}
                    >
                      <span>{language === 'ar' ? 'المادة: ' : language === 'fr' ? 'Matière : ' : 'Subject: '}{translateSubject(asm.subjectAr, language)}</span>
                      <span className="font-mono">{asm.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 4: Teacher Feedback */}
      {/* ============================================================ */}
      {activeTab === 'feedback' && (
        <div className="flex flex-col gap-4 animate-fade-in" style={{ paddingBottom: '40px' }}>
          {teacherFeedback.length === 0 ? (
            <div
              className="rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-center flex flex-col items-center justify-center shadow-2xs"
              style={{ padding: '40px 20px' }}
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
                <MessageSquareQuote size={24} />
              </div>
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">
                {language === 'ar' ? 'لا توجد توجيهات أو ملاحظات من المعلم حالياً' : 'No Teacher Guidance Recorded Yet'}
              </h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                {language === 'ar'
                  ? 'لم يقم المعلم بإضافة توجيهات أو ملاحظات خاصة لهذا الطالب بعد.'
                  : 'No teacher notes or personal recommendations have been added for this student yet.'}
              </p>
            </div>
          ) : (
            teacherFeedback.map((fb) => {
              let formattedDate = fb.date;
              let formattedTime = '';
              try {
                if (/^\d{4}-\d{2}-\d{2}$/.test((fb.date || '').trim())) {
                  formattedDate = fb.date.trim();
                  formattedTime = '';
                } else {
                  const d = new Date(fb.date);
                  if (!isNaN(d.getTime())) {
                    const year = d.getFullYear();
                    const month = String(d.getMonth() + 1).padStart(2, '0');
                    const day = String(d.getDate()).padStart(2, '0');
                    formattedDate = `${year}-${month}-${day}`;

                    if (fb.date.includes('T') || fb.date.includes(':')) {
                      let hours = d.getHours();
                      const minutes = String(d.getMinutes()).padStart(2, '0');
                      const ampm = language === 'ar' ? (hours >= 12 ? 'م' : 'ص') : (hours >= 12 ? 'PM' : 'AM');
                      hours = hours % 12;
                      hours = hours ? hours : 12;
                      formattedTime = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
                    }
                  }
                }
              } catch {
                // fallback
              }

              return (
                <div
                  key={fb.id}
                  className="relative transition-all shadow-xs border"
                  style={{
                    backgroundColor: `${theme.primary}0C`,
                    borderColor: `${theme.primary}26`,
                    padding: '18px 22px',
                    borderRadius: '18px',
                  }}
                >
                  {/* Teacher Header */}
                  <div className="flex items-center justify-between gap-2.5" style={{ marginBottom: '12px' }}>
                    <div className="flex items-center gap-2.5">
                      <div
                        className="rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs"
                        style={{
                          backgroundColor: theme.primary,
                          width: '38px',
                          height: '38px',
                          minWidth: '38px',
                        }}
                      >
                        {language === 'ar' ? 'أ.س' : 'T.M'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                            {fb.teacherNameAr || (language === 'ar' ? 'المعلم' : 'Teacher')}
                          </h4>
                          {fb.badgeAr && (
                            <span
                              className="inline-flex items-center rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300 shadow-2xs px-2 py-0.5"
                            >
                              {fb.badgeAr}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium">
                          {fb.teacherRoleAr || t.quranSubject || (language === 'ar' ? 'اللغة الإنجليزية واللغة الفرنسية' : 'English & French Languages')}
                        </p>
                      </div>
                    </div>

                    {/* Date Badge */}
                    <div className="flex items-center gap-1 shrink-0 self-start pt-0.5">
                      <span className="text-[11px] text-slate-600 dark:text-slate-300 font-mono font-bold bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 px-2.5 py-0.5 rounded-md shadow-2xs">
                        {formattedDate}
                      </span>
                      {formattedTime && (
                        <span className="text-[11px] text-slate-600 dark:text-slate-300 font-mono font-bold bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 px-2.5 py-0.5 rounded-md shadow-2xs">
                          {formattedTime}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Note Bubble or Structured Teacher Guidance */}
                  {fb.teacherFeedbackDetails && (fb.teacherFeedbackDetails.strengths?.length || fb.teacherFeedbackDetails.needsImprovement?.length || fb.teacherFeedbackDetails.recommendations) ? (
                    <div
                      className="bg-emerald-50/70 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200/70 dark:border-emerald-800/50 space-y-2.5"
                      style={{ padding: '16px 20px' }}
                    >
                      <span className="font-bold text-emerald-800 dark:text-emerald-300 block text-xs sm:text-sm">
                        {language === 'ar' ? `توجيه المعلم (${fb.teacherNameAr}):` : `Teacher Guidance (${fb.teacherNameAr}):`}
                      </span>
                      <div className="space-y-1.5 text-slate-700 dark:text-slate-300 leading-relaxed text-xs sm:text-sm">
                        {fb.teacherFeedbackDetails.strengths && fb.teacherFeedbackDetails.strengths.length > 0 && (
                          <div>• <span className="font-bold">{language === 'ar' ? 'نقاط القوة:' : 'Strengths:'}</span> {Array.isArray(fb.teacherFeedbackDetails.strengths) ? fb.teacherFeedbackDetails.strengths.join(', ') : fb.teacherFeedbackDetails.strengths}</div>
                        )}
                        {fb.teacherFeedbackDetails.needsImprovement && fb.teacherFeedbackDetails.needsImprovement.length > 0 && (
                          <div>• <span className="font-bold">{language === 'ar' ? 'بحاجة لتطوير:' : 'Needs Improvement:'}</span> {Array.isArray(fb.teacherFeedbackDetails.needsImprovement) ? fb.teacherFeedbackDetails.needsImprovement.join(', ') : fb.teacherFeedbackDetails.needsImprovement}</div>
                        )}
                        {fb.teacherFeedbackDetails.recommendations && (
                          <div>• <span className="font-bold">{language === 'ar' ? 'توصية للمنزل:' : 'Home Recommendation:'}</span> "{fb.teacherFeedbackDetails.recommendations}"</div>
                        )}
                        {fb.teacherFeedbackDetails.generalComments && (
                          <div className="pt-1 text-slate-600 dark:text-slate-300 italic">
                            "{fb.teacherFeedbackDetails.generalComments}"
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div
                      className="bg-white dark:bg-slate-850 border border-slate-100 dark:border-slate-800 shadow-2xs relative flex items-center"
                      style={{ padding: '14px 18px', borderRadius: '14px' }}
                    >
                      <div
                        className="rounded-full shrink-0"
                        style={{
                          backgroundColor: theme.primary,
                          width: '4px',
                          height: '28px',
                          marginLeft: isRTL ? '12px' : '0',
                          marginRight: isRTL ? '0' : '12px',
                        }}
                      />
                      <p className="text-slate-700 dark:text-slate-200 font-medium text-xs sm:text-sm leading-relaxed">
                        {translateTeacherNote(fb.messageAr || t.teacherDefaultNote, language)}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Homework Detail Modal */}
      <HomeworkDetailModal
        homework={selectedHomework}
        isOpen={!!selectedHomework}
        onClose={() => setSelectedHomework(null)}
      />
    </div>
  );
}
