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
} from 'lucide-react';
import { useStudent } from '@/context/StudentContext';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { PerformanceTabKey } from '@/lib/constants';
import { Homework } from '@/types';
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
  onOpenAddStudent: () => void;
}

export function PerformanceScreen({
  initialTab = 'homework',
  onOpenAddStudent,
}: PerformanceScreenProps) {
  const { activeStudent, homeworkList, attendanceData, assessments, teacherFeedback } = useStudent();
  const { theme } = useTheme();
  const { t, isRTL, language } = useLanguage();

  const [activeTab, setActiveTab] = useState<PerformanceTabKey>(initialTab);
  const [selectedHomework, setSelectedHomework] = useState<Homework | null>(null);
  const [homeworkFilter, setHomeworkFilter] = useState<'all' | 'needs_revision' | 'completed'>('all');
  const [selectedWeekIndex, setSelectedWeekIndex] = useState<number>(0);

  const getDynamicWeekRange = (weeksAgo: number, lang: string) => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diffToSaturday = (dayOfWeek + 1) % 7;
    
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - diffToSaturday - (weeksAgo * 7));
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 5);

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

  const WEEKS_LIST = useMemo(() => [
    {
      index: 0,
      label: t.currentWeek,
      range: getDynamicWeekRange(0, language),
    },
    {
      index: 1,
      label: t.lastWeek,
      range: getDynamicWeekRange(1, language),
    },
    {
      index: 2,
      label: t.previousWeek,
      range: getDynamicWeekRange(2, language),
    },
  ], [t, language]);

  const performanceTabs: { key: PerformanceTabKey; label: string }[] = [
    { key: 'homework', label: t.tabHomework },
    { key: 'attendance', label: t.tabAttendance },
    { key: 'assessments', label: t.tabAssessments },
    { key: 'feedback', label: t.tabTeacherFeedback },
  ];

  // Weekly Attendance calculations
  const currentWeekRecords = attendanceData.records.filter(
    (r) => (r.weekIndex ?? 0) === selectedWeekIndex
  );
  const weekPresentCount = currentWeekRecords.filter((r) => r.status === 'present').length;
  const weekLateCount = currentWeekRecords.filter((r) => r.status === 'late').length;
  const weekAbsentCount = currentWeekRecords.filter((r) => r.status === 'absent').length;
  const weekExcusedCount = currentWeekRecords.filter((r) => r.status === 'excused').length;
  const weekTotal = currentWeekRecords.length || 1;
  const weekPercentage = Math.round(((weekPresentCount + weekExcusedCount) / weekTotal) * 100);

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
              onClick={() => setActiveTab(tab.key)}
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

          {/* Weekly Timetable Schedule Section */}
          <div className="space-y-10" style={{ marginTop: '36px' }}>
            {/* Week Switcher Banner */}
            <div
              className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3"
              style={{
                padding: '18px 22px',
                borderRadius: '20px',
              }}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <CalendarDays size={18} className="text-slate-500 shrink-0" />
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                    {language === 'ar' ? 'جدول الحضور الأسبوعي للدروس والحلقات' : language === 'fr' ? 'Emploi du temps hebdomadaire des séances' : 'Weekly Attendance & Class Schedule'}
                  </h3>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-400 font-medium">
                  {language === 'ar' ? 'توزيع الحصص الأسبوعية مع إمكانية التنقل بين الأسابيع' : language === 'fr' ? 'Répartition des cours avec navigation entre les semaines' : 'Weekly session distribution with week navigation'}
                </p>
              </div>

              {/* Week Switcher Controls */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-700/60">
                  {WEEKS_LIST.map((wk) => {
                    const isSelected = selectedWeekIndex === wk.index;
                    return (
                      <button
                        key={wk.index}
                        type="button"
                        onClick={() => setSelectedWeekIndex(wk.index)}
                        className={`rounded-lg font-black text-xs transition-all cursor-pointer select-none ${
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
                        <span>{wk.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-1">
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
                    {language === 'ar' ? 'طالب مسجل حديثاً — الحضور 0%' : 'Newly Enrolled Student — 0% Attendance'}
                  </h4>
                  <p className="text-xs text-slate-400 max-w-md leading-relaxed">
                    {language === 'ar'
                      ? 'لم يتم تسجيل أي حصص دراسية سابقة لهذا الطالب بعد، وتبدأ نسبة الحضور في الاحتساب فور بدء الجلسات.'
                      : 'No previous class sessions have been recorded for this student yet. Attendance will begin calculating once sessions commence.'}
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
                    const themeStyles =
                      SUBJECT_CONTAINER_THEMES[subjectAr] || langBadge;

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
                              {rec.sessionTimeAr || '04:30 PM - 06:00 PM'}
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
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 4: Teacher Feedback */}
      {/* ============================================================ */}
      {activeTab === 'feedback' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 animate-fade-in" style={{ paddingBottom: '40px' }}>
          {teacherFeedback.map((fb) => {
            let formattedDate = fb.date;
            let formattedTime = '';
            try {
              const d = new Date(fb.date);
              if (!isNaN(d.getTime())) {
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                formattedDate = `${year}-${month}-${day}`;

                let hours = d.getHours();
                const minutes = String(d.getMinutes()).padStart(2, '0');
                const ampm = language === 'ar' ? (hours >= 12 ? 'م' : 'ص') : (hours >= 12 ? 'PM' : 'AM');
                hours = hours % 12;
                hours = hours ? hours : 12;
                formattedTime = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
              }
            } catch {
              // fallback
            }

            return (
              <div
                key={fb.id}
                className={`bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between ${isRTL ? 'text-right' : 'text-left'}`}
                style={{
                  padding: '16px 20px',
                  borderRadius: '18px',
                }}
              >
                <div>
                  {/* Teacher Info */}
                  <div
                    className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5"
                    style={{ marginBottom: '12px' }}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-xs shrink-0 mt-0.5"
                        style={{ backgroundColor: theme.primaryDark }}
                      >
                        {fb.teacherNameAr.split(' ').slice(-1)[0]?.[0] || 'T'}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-x-2 gap-y-1 flex-wrap" style={{ marginBottom: '2px' }}>
                          <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white whitespace-nowrap">
                            {fb.teacherNameAr}
                          </span>
                          {fb.badgeAr && (
                            <span
                              className="inline-flex items-center rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300 shadow-2xs whitespace-nowrap px-2 py-0.5"
                              style={{
                                height: '22px',
                              }}
                            >
                              {fb.badgeAr}
                            </span>
                          )}
                        </div>
                        <span
                          className="text-[11px] text-slate-400 font-medium block"
                          style={{ marginTop: '1px' }}
                        >
                          {fb.teacherRoleAr || (language === 'ar' ? 'معلم المسار الأكاديمي' : language === 'fr' ? 'Enseignant Pédagogique' : 'Academic Course Teacher')}
                        </span>
                      </div>
                    </div>

                    {/* Date and Time (Aligned to top) */}
                    <div className="flex items-center gap-1 shrink-0 self-start pt-0.5">
                      <span className="text-[11px] text-slate-600 dark:text-slate-300 font-mono font-bold bg-slate-100 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/60 px-2 py-0.5 rounded-md shadow-2xs">
                        {formattedDate}
                      </span>
                      {formattedTime && (
                        <span className="text-[11px] text-slate-600 dark:text-slate-300 font-mono font-bold bg-slate-100 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/60 px-2 py-0.5 rounded-md shadow-2xs">
                          {formattedTime}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Message Content */}
                  <div
                    className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-750 text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium"
                    style={{
                      padding: '10px 14px',
                      borderRadius: '12px',
                      margin: '8px 0',
                    }}
                  >
                    "{translateTeacherNote(fb.messageAr, language)}"
                  </div>
                </div>
              </div>
            );
          })}
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
