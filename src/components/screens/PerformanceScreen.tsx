'use client';

import React, { useState } from 'react';
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
    bgClass: 'bg-purple-50/70 dark:bg-purple-950/30',
    borderClass: 'border-purple-200/90 dark:border-purple-800/60',
    badgeBg: 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200',
  },
  'محادثة إنجليزية': {
    bgClass: 'bg-emerald-50/70 dark:bg-emerald-950/30',
    borderClass: 'border-emerald-200/90 dark:border-emerald-800/60',
    badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200',
  },
  'ورشة النطق الفرنسي': {
    bgClass: 'bg-violet-50/70 dark:bg-violet-950/30',
    borderClass: 'border-violet-200/90 dark:border-violet-800/60',
    badgeBg: 'bg-violet-100 text-violet-800 dark:bg-violet-900/60 dark:text-violet-200',
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

  const WEEKS_LIST = [
    {
      index: 0,
      label: t.currentWeek,
      range: language === 'ar' ? '15 - 20 فبراير 2025' : language === 'fr' ? '15 - 20 Février 2025' : 'Feb 15 - 20, 2025',
    },
    {
      index: 1,
      label: t.lastWeek,
      range: language === 'ar' ? '08 - 13 فبراير 2025' : language === 'fr' ? '08 - 13 Février 2025' : 'Feb 08 - 13, 2025',
    },
    {
      index: 2,
      label: t.previousWeek,
      range: language === 'ar' ? '01 - 06 فبراير 2025' : language === 'fr' ? '01 - 06 Février 2025' : 'Feb 01 - 06, 2025',
    },
  ];

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
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{
          marginTop: '28px',
          marginBottom: '20px',
        }}
      >
        <div>
          <span className="text-xs sm:text-sm font-bold text-slate-400 block mb-0.5">
            {t.performanceSubtitle}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t.performanceTitle}
          </h1>
        </div>

        <div className="self-start sm:self-auto shrink-0">
          <span
            className="inline-flex items-center rounded-full font-bold text-white shadow-xs select-none"
            style={{
              backgroundColor: theme.primary,
              height: '36px',
              paddingRight: '18px',
              paddingLeft: '18px',
              fontSize: '13px',
            }}
          >
            {t.level} {activeStudent.currentLevel}
          </span>
        </div>
      </div>

      {/* Mobile-only student switcher */}
      <div className="block md:hidden mb-6">
        <StudentSwitcher onOpenAddStudent={onOpenAddStudent} />
      </div>

      {/* Top Segmented Tab Navigation */}
      <div
        className="rounded-2xl bg-slate-100 dark:bg-slate-850 flex gap-2 border border-slate-200/80 dark:border-slate-800 shadow-2xs"
        style={{
          marginBottom: '28px',
          padding: '8px',
          minHeight: '62px',
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
              className={`flex-1 rounded-xl transition-all relative flex items-center justify-center gap-2.5 cursor-pointer select-none ${
                isActive
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
              }`}
              style={{
                height: '46px',
                padding: '0 16px',
                fontSize: '15px',
                color: isActive ? theme.primary : undefined,
              }}
            >
              <span className="font-black tracking-tight">{tab.label}</span>
              {showBadge && (
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* TAB 1: Homework */}
      {/* ============================================================ */}
      {activeTab === 'homework' && (
        <div className="space-y-4 animate-fade-in">
          {/* Filter Pills */}
          <div
            className="flex items-center gap-3 flex-wrap"
            style={{ marginBottom: '24px' }}
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
                height: '36px',
                paddingRight: '18px',
                paddingLeft: '18px',
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
                height: '36px',
                paddingRight: '18px',
                paddingLeft: '18px',
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
                height: '36px',
                paddingRight: '18px',
                paddingLeft: '18px',
              }}
            >
              {t.completed}
            </button>
          </div>

          {/* Homework Items List */}
          <div className="flex flex-col gap-4">
            {filteredHomework.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm font-semibold bg-white dark:bg-slate-850 rounded-3xl border border-slate-200/80 dark:border-slate-800">
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
                      padding: '26px 30px',
                      borderRadius: '24px',
                    }}
                  >
                    <div>
                      {/* Top Bar */}
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <span className="text-xs font-bold text-slate-400">
                          {t.level} {hw.level} • {translateSubject(hw.subjectAr, language)}
                        </span>

                        {isRevision && (
                          <span
                            className="inline-flex items-center rounded-full text-xs font-bold bg-amber-500 text-white shadow-xs animate-pulse"
                            style={{
                              height: '30px',
                              paddingRight: '14px',
                              paddingLeft: '14px',
                            }}
                          >
                            {t.needsRevision}
                          </span>
                        )}

                        {isCompleted && (
                          <span
                            className="inline-flex items-center rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                            style={{
                              height: '30px',
                              paddingRight: '14px',
                              paddingLeft: '14px',
                            }}
                          >
                            {t.completed} ✓
                          </span>
                        )}

                        {!isRevision && !isCompleted && (
                          <span
                            className="inline-flex items-center rounded-full text-xs font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                            style={{
                              height: '30px',
                              paddingRight: '14px',
                              paddingLeft: '14px',
                            }}
                          >
                            {t.pending}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3
                        className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug"
                        style={{ margin: '8px 0 12px 0' }}
                      >
                        {translateHomeworkTitle(hw.titleAr, language)}
                      </h3>

                      {/* Teacher Feedback Alert if needs revision */}
                      {hw.teacherNote && isRevision && (
                        <div
                          className="rounded-2xl bg-amber-100/70 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-800 text-xs sm:text-sm text-amber-900 dark:text-amber-200 leading-relaxed font-medium"
                          style={{
                            padding: '14px 18px',
                            marginTop: '12px',
                          }}
                        >
                          <span className="font-bold">{t.teacherNoteLabel} </span>
                          {translateTeacherNote(hw.teacherNote, language)}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Clock size={14} />
                        {t.dueDateLabel} {hw.dueDate}
                      </span>

                      {hw.score !== undefined && (
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-sm font-mono">
                          {t.scoreLabel} {hw.score} / {hw.totalScore || 100}
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div
              className="rounded-[24px] bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between"
              style={{ padding: '24px 28px' }}
            >
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-400">{t.overallAttendanceRate}</span>
                <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono">
                  {attendanceData.summary.attendancePercentage}%
                </div>
                <span className="text-xs font-bold text-emerald-600 block">
                  {language === 'ar' ? 'معدل انضباط متميز' : language === 'fr' ? 'Excellent taux de présence' : 'Excellent Discipline Rate'}
                </span>
              </div>

              {/* Circular Ring Visual */}
              <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
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
                <div className="absolute font-black text-xs text-slate-900 dark:text-white font-mono">
                  {attendanceData.summary.presentDays} / {attendanceData.summary.totalDays}
                </div>
              </div>
            </div>

            {/* Breakdown Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:col-span-2">
              <div
                className="rounded-[22px] bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 text-center flex flex-col justify-center"
                style={{ padding: '18px 16px' }}
              >
                <span className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-300">
                  {attendanceData.summary.presentDays}
                </span>
                <span className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 block mt-1.5">
                  {t.present}
                </span>
              </div>

              <div
                className="rounded-[22px] bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-800/40 text-center flex flex-col justify-center"
                style={{ padding: '18px 16px' }}
              >
                <span className="text-2xl sm:text-3xl font-black text-rose-700 dark:text-rose-300">
                  {attendanceData.summary.absentDays}
                </span>
                <span className="text-xs sm:text-sm font-bold text-rose-600 dark:text-rose-400 block mt-1.5">
                  {t.absent}
                </span>
              </div>

              <div
                className="rounded-[22px] bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 text-center flex flex-col justify-center"
                style={{ padding: '18px 16px' }}
              >
                <span className="text-2xl sm:text-3xl font-black text-amber-700 dark:text-amber-300">
                  {attendanceData.summary.lateDays}
                </span>
                <span className="text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400 block mt-1.5">
                  {t.late}
                </span>
              </div>

              <div
                className="rounded-[22px] bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/40 text-center flex flex-col justify-center"
                style={{ padding: '18px 16px' }}
              >
                <span className="text-2xl sm:text-3xl font-black text-blue-700 dark:text-blue-300">
                  {attendanceData.summary.excusedDays}
                </span>
                <span className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 block mt-1.5">
                  {t.excused}
                </span>
              </div>
            </div>
          </div>

          {/* Weekly Timetable Schedule Section */}
          <div className="space-y-4" style={{ marginTop: '32px' }}>
            {/* Week Switcher Banner */}
            <div
              className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              style={{
                padding: '24px 28px',
                borderRadius: '24px',
              }}
            >
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <CalendarDays size={22} className="text-slate-500 shrink-0" />
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    {language === 'ar' ? 'جدول الحضور الأسبوعي للدروس والحلقات' : language === 'fr' ? 'Emploi du temps hebdomadaire des séances' : 'Weekly Attendance & Class Schedule'}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 font-medium">
                  {language === 'ar' ? 'توزيع الحصص الأسبوعية مع إمكانية التنقل بين الأسابيع' : language === 'fr' ? 'Répartition des cours avec navigation entre les semaines' : 'Weekly session distribution with week navigation'}
                </p>
              </div>

              {/* Week Switcher Controls */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-700/60">
                  {WEEKS_LIST.map((wk) => {
                    const isSelected = selectedWeekIndex === wk.index;
                    return (
                      <button
                        key={wk.index}
                        type="button"
                        onClick={() => setSelectedWeekIndex(wk.index)}
                        className={`rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer select-none ${
                          isSelected
                            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                        style={{
                          height: '38px',
                          paddingRight: '18px',
                          paddingLeft: '18px',
                          color: isSelected ? theme.primary : undefined,
                        }}
                      >
                        <span>{wk.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={selectedWeekIndex >= WEEKS_LIST.length - 1}
                    onClick={() => setSelectedWeekIndex((prev) => Math.min(WEEKS_LIST.length - 1, prev + 1))}
                    className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    title={isRTL ? 'الأسبوع السابق' : 'Previous Week'}
                  >
                    {isRTL ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                  </button>

                  <button
                    type="button"
                    disabled={selectedWeekIndex <= 0}
                    onClick={() => setSelectedWeekIndex((prev) => Math.max(0, prev - 1))}
                    className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    title={isRTL ? 'الأسبوع التالي' : 'Next Week'}
                  >
                    {isRTL ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Active Week Status & Date Range Bar */}
            <div
              className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-750 flex items-center justify-between flex-wrap gap-3.5 text-xs font-bold"
              style={{
                padding: '16px 24px',
                borderRadius: '20px',
              }}
            >
              <div className="flex items-center gap-2.5 text-slate-800 dark:text-slate-200">
                <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                  {WEEKS_LIST[selectedWeekIndex]?.label}:
                </span>
                <span className="font-mono text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  ({WEEKS_LIST[selectedWeekIndex]?.range})
                </span>
              </div>

              <div className="flex items-center gap-3.5 text-xs sm:text-sm flex-wrap">
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
                  className="inline-flex items-center rounded-full text-white font-black shadow-2xs select-none"
                  style={{
                    backgroundColor: theme.primary,
                    height: '32px',
                    paddingRight: '16px',
                    paddingLeft: '16px',
                  }}
                >
                  {language === 'ar' ? `نسبة الأسبوع: ${weekPercentage}%` : language === 'fr' ? `Taux hebdo: ${weekPercentage}%` : `Week Rate: ${weekPercentage}%`}
                </span>
              </div>
            </div>

            {/* Weekly Timetable Schedule Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" style={{ paddingBottom: '48px' }}>
              {currentWeekRecords.map((rec) => {
                const isPresent = rec.status === 'present';
                const isAbsent = rec.status === 'absent';
                const isLate = rec.status === 'late';

                const subjectAr = rec.subjectAr || 'اللغة الإنجليزية';
                const translatedSubject = translateSubject(subjectAr, language);
                const dayLabel = translateDayName(rec.dayNameAr);
                const themeStyles =
                  SUBJECT_CONTAINER_THEMES[subjectAr] || SUBJECT_CONTAINER_THEMES['اللغة الإنجليزية'];

                return (
                  <div
                    key={rec.id}
                    className={`rounded-[24px] border ${themeStyles.bgClass} ${themeStyles.borderClass} flex flex-col justify-between shadow-2xs select-none transition-all hover:shadow-md`}
                    style={{
                      paddingTop: '22px',
                      paddingRight: '26px',
                      paddingLeft: '26px',
                      paddingBottom: '26px',
                      minHeight: '155px',
                    }}
                  >
                    <div>
                      {/* Top Row: Day Title + Status Badge */}
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                            {dayLabel}
                          </span>
                          <span className="text-xs text-slate-400 font-mono font-bold">
                            {rec.date}
                          </span>
                        </div>

                        <span
                          className={`inline-flex items-center justify-center rounded-full text-xs font-black shadow-2xs select-none ${
                            isPresent
                              ? 'bg-emerald-500 text-white'
                              : isAbsent
                              ? 'bg-rose-500 text-white'
                              : isLate
                              ? 'bg-amber-500 text-white'
                              : 'bg-blue-500 text-white'
                          }`}
                          style={{
                            height: '32px',
                            paddingRight: '16px',
                            paddingLeft: '16px',
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

                      {/* Middle Row: Subject Pill + Time */}
                      <div className="flex items-center justify-between gap-2.5 my-2.5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full font-black text-xs shadow-2xs select-none ${themeStyles.badgeBg}`}
                          style={{
                            height: '34px',
                            paddingRight: '16px',
                            paddingLeft: '16px',
                          }}
                        >
                          <BookOpen size={14} className="shrink-0" />
                          <span>{translatedSubject}</span>
                        </span>

                        <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-300 font-bold flex items-center gap-1.5">
                          <Clock size={14} />
                          <span>{rec.sessionTimeAr || '04:30 PM'}</span>
                        </span>
                      </div>
                    </div>

                    {/* Note / Excuse Footer if present */}
                    {rec.noteAr && (
                      <div
                        className="mt-3 p-3 px-4 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 text-xs text-slate-700 dark:text-slate-300 font-medium"
                        style={{ marginBottom: '2px' }}
                      >
                        <span className="font-bold">{language === 'ar' ? 'ملاحظة: ' : language === 'fr' ? 'Remarque : ' : 'Note: '}</span>
                        {rec.noteAr}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: Assessments */}
      {/* ============================================================ */}
      {activeTab === 'assessments' && (
        <div className="space-y-6 animate-fade-in" style={{ paddingBottom: '48px' }}>
          {/* Skill Radar / Bars Breakdown */}
          <div
            className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-xs"
            style={{
              padding: '28px 32px',
              borderRadius: '24px',
            }}
          >
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white" style={{ marginBottom: '18px' }}>
              {language === 'ar'
                ? `تقييم المهارات التراكمي (المستوى ${activeStudent.currentLevel})`
                : language === 'fr'
                ? `Évaluation cumulative des compétences (${t.level} ${activeStudent.currentLevel})`
                : `Cumulative Skills Evaluation (${t.level} ${activeStudent.currentLevel})`}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  name: language === 'ar' ? 'المحادثة والطلاقة الشفهية (Speaking Fluency)' : language === 'fr' ? 'Expression Orale & Fluidité (Speaking Fluency)' : 'Speaking & Verbal Fluency',
                  score: 94,
                },
                {
                  name: language === 'ar' ? 'الفهم السمعي والاستيعاب (Listening Comprehension)' : language === 'fr' ? 'Compréhension Orale (Listening Comprehension)' : 'Listening & Comprehension',
                  score: 92,
                },
                {
                  name: language === 'ar' ? 'القواعد وبناء التراكيب (Grammar & Structure)' : language === 'fr' ? 'Grammaire & Structures (Grammar & Structure)' : 'Grammar & Syntax Structures',
                  score: 88,
                },
                {
                  name: language === 'ar' ? 'القراءة والتعبير الكتابي (Reading & Writing)' : language === 'fr' ? 'Lecture & Expression Écrite (Reading & Writing)' : 'Reading & Essay Writing',
                  score: 85,
                },
              ].map((skill, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-750 flex flex-col justify-center"
                  style={{
                    padding: '18px 22px',
                    borderRadius: '20px',
                  }}
                >
                  <div className="flex items-center justify-between text-xs sm:text-sm font-bold" style={{ marginBottom: '10px' }}>
                    <span className="text-slate-800 dark:text-slate-200 font-extrabold">{skill.name}</span>
                    <span style={{ color: theme.primary }} className="font-mono font-black text-sm sm:text-base">
                      {skill.score}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
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
          <div className="space-y-4" style={{ marginTop: '32px' }}>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              {t.periodicAssessments}:
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {assessments.map((asm) => (
                <div
                  key={asm.id}
                  className={`bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between ${isRTL ? 'text-right' : 'text-left'}`}
                  style={{
                    padding: '28px 32px',
                    borderRadius: '24px',
                  }}
                >
                  <div>
                    {/* Top Row: Level/Type + Score Badge */}
                    <div className="flex items-center justify-between gap-3" style={{ marginBottom: '14px' }}>
                      <span className="text-xs sm:text-sm font-bold text-slate-400">
                        {t.level} {asm.level} • {translateSubject(asm.typeAr, language)}
                      </span>
                      <span
                        className="inline-flex items-center justify-center rounded-full text-xs sm:text-sm font-black text-white shadow-2xs select-none"
                        style={{
                          backgroundColor: theme.primary,
                          height: '34px',
                          paddingRight: '16px',
                          paddingLeft: '16px',
                        }}
                      >
                        {asm.score}% ({language === 'ar' ? asm.gradeLetterAr || 'ممتاز' : asm.score >= 90 ? 'A+' : 'A'})
                      </span>
                    </div>

                    <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug" style={{ margin: '10px 0' }}>
                      {translateHomeworkTitle(asm.titleAr, language)}
                    </h4>

                    {asm.teacherComments && (
                      <div
                        className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-750"
                        style={{
                          padding: '16px 20px',
                          borderRadius: '18px',
                          margin: '14px 0',
                        }}
                      >
                        "{translateTeacherNote(asm.teacherComments, language)}"
                      </div>
                    )}
                  </div>

                  <div
                    className="border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs sm:text-sm text-slate-400 font-bold"
                    style={{
                      paddingTop: '16px',
                      marginTop: '16px',
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-in" style={{ paddingBottom: '48px' }}>
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
                className={`bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between ${isRTL ? 'text-right' : 'text-left'}`}
                style={{
                  padding: '28px 32px',
                  borderRadius: '24px',
                }}
              >
                <div>
                  {/* Teacher Info */}
                  <div
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5"
                    style={{ marginBottom: '18px' }}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-xs shrink-0"
                        style={{ backgroundColor: theme.primaryDark }}
                      >
                        {fb.teacherNameAr.split(' ').slice(-1)[0]?.[0] || 'T'}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-x-2.5 gap-y-2 flex-wrap" style={{ marginBottom: '4px' }}>
                          <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white whitespace-nowrap">
                            {fb.teacherNameAr}
                          </span>
                          {fb.badgeAr && (
                            <span
                              className="inline-flex items-center rounded-full text-xs font-black bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300 shadow-2xs whitespace-nowrap"
                              style={{
                                height: '28px',
                                paddingRight: '12px',
                                paddingLeft: '12px',
                              }}
                            >
                              {fb.badgeAr}
                            </span>
                          )}
                        </div>
                        <span
                          className="text-xs text-slate-400 font-medium block"
                          style={{ marginTop: '8px' }}
                        >
                          {fb.teacherRoleAr || (language === 'ar' ? 'معلم المسار الأكاديمي' : language === 'fr' ? 'Enseignant Pédagogique' : 'Academic Course Teacher')}
                        </span>
                      </div>
                    </div>

                    {/* Date and Time */}
                    <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                      <span className="text-xs text-slate-600 dark:text-slate-300 font-mono font-bold bg-slate-100 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/60 px-3 py-1.5 rounded-xl shadow-2xs">
                        {formattedDate}
                      </span>
                      {formattedTime && (
                        <span className="text-xs text-slate-600 dark:text-slate-300 font-mono font-bold bg-slate-100 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/60 px-3 py-1.5 rounded-xl shadow-2xs">
                          {formattedTime}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Message Content */}
                  <div
                    className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-750 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 leading-relaxed"
                    style={{
                      padding: '18px 22px',
                      borderRadius: '18px',
                      margin: '14px 0',
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
