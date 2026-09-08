'use client';

import React, { useState, useMemo } from 'react';
import {
  Check,
  FileText,
  Clock,
  Layers,
  BookOpen,
  Award,
  Bell,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  ArrowUpRight,
} from 'lucide-react';
import { useStudent } from '@/context/StudentContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { NavTabKey, PerformanceTabKey, SHOW_FINANCIALS_TAB, getStudentGenderNoun } from '@/lib/constants';
import { levelThemes, getThemeForLevel } from '@/lib/themes';
import { translateHomeworkTitle, translateTeacherNote, translateSubject } from '@/lib/translations';

interface DashboardScreenProps {
  onNavigate: (tab: NavTabKey, subTab?: PerformanceTabKey) => void;
  onOpenAddStudent: () => void;
  onOpenHomeworkDetail?: (hwId: string) => void;
}

export function DashboardScreen({
  onNavigate,
  onOpenHomeworkDetail,
}: DashboardScreenProps) {
  const { parent } = useAuth();
  const {
    activeStudent,
    homeworkList,
    teacherFeedback,
    academicLevels,
    notifications,
    markNotificationRead,
  } = useStudent();
  const { theme } = useTheme();
  const { t, language, isRTL } = useLanguage();
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  const currentLevelObj = academicLevels.find((l) => Number(l.level) === Number(activeStudent.currentLevel));
  const activeLevelTheme = getThemeForLevel(
    activeStudent.currentLevel,
    currentLevelObj?.color || (currentLevelObj as any)?.themeColor
  );

  // Derive rich, dynamic notifications linked directly with Homework and Student updates
  const recentHomeworkNotifications = useMemo(() => {
    // 1. Revision homework (highest priority)
    const revision = (homeworkList || [])
      .filter((h) => h.status === 'needs_revision')
      .map((h) => ({
        id: `hw-rev-${h.id}`,
        homeworkId: h.id,
        type: 'revision' as const,
        title: language === 'ar' ? 'واجب يحتاج إلى مراجعة وتعديل' : language === 'fr' ? 'Devoir à réviser' : 'Homework Needs Revision',
        description: h.titleAr || t.homeworkNeedsRevisionDesc,
        time: h.dueDate ? (language === 'ar' ? `الموعد: ${h.dueDate}` : `Due: ${h.dueDate}`) : t.twoHoursAgo,
        icon: AlertCircle,
        colorClass: 'bg-amber-50 dark:bg-amber-950/40 text-amber-500 border-amber-200/70 dark:border-amber-800/60',
        badgeText: language === 'ar' ? 'مراجعة' : language === 'fr' ? 'À réviser' : 'Revision',
        badgeClass: 'bg-amber-500 text-white',
      }));

    // 2. Pending & Not Started Homework
    const pending = (homeworkList || [])
      .filter((h) => h.status === 'pending' || h.status === 'not_started')
      .map((h) => ({
        id: `hw-pen-${h.id}`,
        homeworkId: h.id,
        type: 'pending' as const,
        title: language === 'ar' ? 'واجب منزلي مطلوب تسليمه' : language === 'fr' ? 'Devoir à rendre' : 'Homework Assigned',
        description: `${h.titleAr} • ${h.subjectAr || (language === 'ar' ? 'اللغة الإنجليزية' : 'English')}`,
        time: h.dueDate ? (language === 'ar' ? `الموعد: ${h.dueDate}` : `Due: ${h.dueDate}`) : (language === 'ar' ? 'قريباً' : 'Soon'),
        icon: BookOpen,
        colorClass: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200/70 dark:border-indigo-800/60',
        badgeText: language === 'ar' ? 'مطلوب' : language === 'fr' ? 'Requis' : 'Pending',
        badgeClass: 'bg-indigo-600 text-white',
      }));

    // 3. Completed & Evaluated Homework
    const completed = (homeworkList || [])
      .filter((h) => h.status === 'completed')
      .map((h) => ({
        id: `hw-comp-${h.id}`,
        homeworkId: h.id,
        type: 'completed' as const,
        title: language === 'ar' ? 'تم تقييم واعتماد الواجب المنزلي' : language === 'fr' ? 'Devoir évalué' : 'Homework Evaluated',
        description: `${h.titleAr} • ${h.score !== undefined ? (language === 'ar' ? `الدرجة: ${h.score}/${h.totalScore || 20}` : `Score: ${h.score}/${h.totalScore || 20}`) : (language === 'ar' ? 'مكتمل بنجاح' : 'Completed')}`,
        time: h.dueDate || (language === 'ar' ? 'مكتمل' : 'Completed'),
        icon: Award,
        colorClass: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/70 dark:border-emerald-800/60',
        badgeText: h.score !== undefined ? `${h.score}/${h.totalScore || 20}` : (language === 'ar' ? 'مكتمل' : 'Done'),
        badgeClass: 'bg-emerald-600 text-white',
      }));

    // 4. System notifications for this student
    const studentNotifs = (notifications || [])
      .filter(
        (n) =>
          (!n.studentId || n.studentId === activeStudent.id) &&
          !n.isRead &&
          !dismissedIds.includes(n.id) &&
          !dismissedIds.includes(`sys-${n.id}`)
      )
      .map((n) => ({
        id: `sys-${n.id}`,
        rawNotifId: n.id,
        homeworkId: (n.actionPayload as any)?.homeworkId || (n.actionPayload as any)?.itemId,
        type: 'system' as const,
        title: n.titleAr || (language === 'ar' ? 'إشعار جديد' : 'New Notification'),
        description: n.messageAr || '',
        time: n.date || (language === 'ar' ? 'اليوم' : 'Today'),
        icon: Bell,
        colorClass: 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 border-cyan-200/70 dark:border-cyan-800/60',
        badgeText: language === 'ar' ? 'إشعار' : 'Notice',
        badgeClass: 'bg-cyan-600 text-white',
        routeTo: n.routeTo,
        actionPayload: n.actionPayload,
      }));

    const all = [...revision, ...pending, ...completed, ...studentNotifs].filter(
      (item) => !dismissedIds.includes(item.id)
    );
    return all.slice(0, 3);
  }, [homeworkList, notifications, activeStudent.id, language, t, dismissedIds]);

  const latestFeedback = teacherFeedback[0];

  const studentFirstName = activeStudent.fullNameAr.split(' ')[0] || 'Youssef';
  const parentFirstName = parent.fullNameAr.split(' ')[0] || 'Ahmed';

  const levelNamesArabic: Record<number, string> = {
    1: 'الأول',
    2: 'الثاني',
    3: 'الثالث',
    4: 'الرابع',
    5: 'الخامس',
    6: 'السادس',
    7: 'السابع',
    8: 'الثامن',
    9: 'التاسع',
    10: 'العاشر',
  };

  const levelNamesEnglish: Record<number, string> = {
    1: 'Level 1',
    2: 'Level 2',
    3: 'Level 3',
    4: 'Level 4',
    5: 'Level 5',
    6: 'Level 6',
    7: 'Level 7',
    8: 'Level 8',
    9: 'Level 9',
    10: 'Level 10',
  };

  const levelNamesFrench: Record<number, string> = {
    1: 'Niveau 1',
    2: 'Niveau 2',
    3: 'Niveau 3',
    4: 'Niveau 4',
    5: 'Niveau 5',
    6: 'Niveau 6',
    7: 'Niveau 7',
    8: 'Niveau 8',
    9: 'Niveau 9',
    10: 'Niveau 10',
  };

  const levelWord =
    language === 'ar'
      ? levelNamesArabic[activeStudent.currentLevel] || `المستوى ${activeStudent.currentLevel}`
      : language === 'fr'
      ? levelNamesFrench[activeStudent.currentLevel] || `Niveau ${activeStudent.currentLevel}`
      : levelNamesEnglish[activeStudent.currentLevel] || `Level ${activeStudent.currentLevel}`;

  return (
    <div
      className={`w-full animate-fade-in select-none space-y-5 sm:space-y-7 ${isRTL ? 'text-right' : 'text-left'}`}
      style={{ paddingBottom: '70px' }}
    >
      {/* =========================================================================
          1. Welcome Card
          ========================================================================= */}
      <div
        className="relative overflow-hidden p-5 sm:p-6 rounded-3xl shadow-sm transition-all border border-black/5 dark:border-white/10"
        style={{
          background: `linear-gradient(135deg, ${activeLevelTheme.primary} 0%, ${activeLevelTheme.primaryDark || activeLevelTheme.primary} 100%)`,
        }}
      >
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
          <div>
            <span className="text-xs sm:text-sm font-bold text-black/75 dark:text-black/85 block mb-1">
              {t.greeting}, {parentFirstName} 👋
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight leading-tight">
              {t.parentOf} {studentFirstName}
            </h2>
          </div>

          <div className="self-start sm:self-auto shrink-0">
            {activeStudent.status === 'pending' ? (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-500 text-white text-xs font-black shadow-md">
                <Clock size={14} />
                <span>{language === 'ar' ? 'طلب قيد المراجعة' : 'Pending Review'}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-950/85 text-white text-xs font-black shadow-md backdrop-blur-md">
                <Layers size={15} className="text-lime-400" />
                <span>{t.level} {levelWord}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Pending Account Notice Banner */}
      {activeStudent.status === 'pending' && (
        <div
          className={`bg-amber-50/90 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/80 rounded-3xl flex items-start gap-3.5 p-4 sm:p-5 shadow-xs ${isRTL ? 'text-right' : 'text-left'} animate-fade-in`}
        >
          <div className="w-9 h-9 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Clock size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-amber-950 dark:text-amber-100 text-sm mb-1">
              {language === 'ar' ? `طلب تسجيل ${getStudentGenderNoun(activeStudent)} قيد المراجعة لدى الإدارة` : language === 'fr' ? "Demande d'inscription en cours d'examen" : 'Registration Request Under Review'}
            </h4>
            <p className="text-xs sm:text-sm text-amber-800/90 dark:text-amber-300/90 leading-relaxed font-medium">
              {language === 'ar'
                ? `تم استلام طلب تسجيل ${getStudentGenderNoun(activeStudent)} (${activeStudent.fullNameAr}) بنجاح. سيقوم فريق الإدارة بالتواصل لتحديد موعد اختبار تحديد المستوى.`
                : language === 'fr'
                ? `La demande d'inscription pour (${activeStudent.fullNameAr}) a été reçue avec succès.`
                : `The registration request for (${activeStudent.fullNameAr}) is under review.`}
            </p>
          </div>
        </div>
      )}

      {/* =========================================================================
          2. Progress Card
          ========================================================================= */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => onNavigate('academic')}
        onKeyDown={(e) => e.key === 'Enter' && onNavigate('academic')}
        className="bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer p-5 sm:p-6 rounded-3xl"
      >
        <div className="flex items-center justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3.5 min-w-0">
            <div
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-slate-950 shrink-0 shadow-xs"
              style={{
                backgroundColor: activeLevelTheme.primary,
              }}
            >
              <Check size={22} strokeWidth={3} />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight truncate">
                {activeStudent.gender === 'female' ? t.daughterProgress : t.sonProgress}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold mt-0.5 truncate">
                {t.level} {levelWord} • {language === 'ar' ? `من ${academicLevels.length} مستويات` : `of ${academicLevels.length} levels`}
              </p>
            </div>
          </div>

          <div
            className="text-2xl sm:text-3xl font-black font-mono tracking-tight shrink-0 whitespace-nowrap"
            style={{ color: activeLevelTheme.primary }}
          >
            {activeStudent.currentLevelProgress ?? 0}%
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 overflow-hidden h-3 rounded-full">
          <div
            className="h-full transition-all duration-700 rounded-full"
            style={{
              width: `${activeStudent.currentLevelProgress ?? 0}%`,
              backgroundColor: activeLevelTheme.primary,
            }}
          />
        </div>
      </div>

      {/* =========================================================================
          3. Notifications & Homework Alerts Section
          ========================================================================= */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
            {t.recentNotifications}
          </h3>

          <button
            type="button"
            onClick={() => onNavigate('performance', 'homework')}
            className="text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>{language === 'ar' ? 'عرض الكل' : 'View All'}</span>
            {isRTL ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        {/* Notification Cards */}
        <div className="space-y-3.5">
          {recentHomeworkNotifications.length > 0 ? (
            recentHomeworkNotifications.map((notif) => {
              const IconComp = notif.icon;
              return (
                <div
                  key={notif.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setDismissedIds((prev) => [...prev, notif.id, (notif as any).rawNotifId].filter(Boolean));
                    if ((notif as any).rawNotifId) {
                      markNotificationRead((notif as any).rawNotifId);
                    }
                    if (notif.homeworkId && onOpenHomeworkDetail) {
                      onOpenHomeworkDetail(notif.homeworkId);
                    } else if ((notif as any).routeTo) {
                      const subTab = (notif as any).actionPayload?.tab as PerformanceTabKey | undefined;
                      onNavigate((notif as any).routeTo as NavTabKey, subTab);
                    } else {
                      onNavigate('performance', 'homework');
                    }
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && onNavigate('performance', 'homework')}
                  className="bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-pointer p-4 sm:p-5 rounded-3xl flex flex-col gap-2.5"
                >
                  {/* Top Header Row: Icon + Badge + Date */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${notif.colorClass}`}
                      >
                        <IconComp size={14} />
                      </div>
                      {notif.badgeText && (
                        <span
                          className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-black ${notif.badgeClass} shadow-2xs`}
                        >
                          {notif.badgeText}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">
                      {notif.time}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="pt-0.5">
                    <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {notif.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mt-0.5">
                      {notif.description}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div
              role="button"
              tabIndex={0}
              onClick={() => onNavigate('performance', 'homework')}
              onKeyDown={(e) => e.key === 'Enter' && onNavigate('performance', 'homework')}
              className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all p-5 rounded-3xl flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div
                  className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 border border-indigo-200/70 dark:border-indigo-800/60 flex items-center justify-center shrink-0"
                >
                  <BookOpen size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                    {language === 'ar' ? 'قسم الواجبات والأنشطة' : 'Homework & Activities'}
                  </h4>
                  <p className="text-slate-400 font-medium text-xs sm:text-sm mt-0.5">
                    {language === 'ar' ? 'اضغط لمتابعة الواجبات والمهام لهذا الأسبوع' : 'Click to view assigned tasks'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 text-xs sm:text-sm font-bold shrink-0">
                <span>{language === 'ar' ? 'فتح' : 'Open'}</span>
                {isRTL ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          4. Teacher Notes Section
          ========================================================================= */}
      <div className="space-y-3.5">
        <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white px-1">
          {t.latestTeacherNote}
        </h3>

        {latestFeedback ? (
          <div
            role="button"
            tabIndex={0}
            onClick={() => onNavigate('performance', 'feedback')}
            onKeyDown={(e) => e.key === 'Enter' && onNavigate('performance', 'feedback')}
            className="bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer p-5 sm:p-6 rounded-3xl"
          >
            {/* Teacher Header */}
            <div className="flex items-center gap-3.5 mb-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-slate-950 font-black text-xs shrink-0 shadow-xs"
                style={{ backgroundColor: activeLevelTheme.primary }}
              >
                {language === 'ar' ? 'أ.س' : 'T.M'}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                  {latestFeedback.teacherNameAr || 'معلم المادة'}
                </h4>
                <p className="text-xs text-slate-400 font-medium">
                  {latestFeedback.subjectAr || t.quranSubject}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {translateTeacherNote(latestFeedback.messageAr || t.teacherDefaultNote, language)}
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-850 border border-slate-200/70 dark:border-slate-800 shadow-sm rounded-3xl p-6 text-center text-xs sm:text-sm text-slate-400 font-medium">
            {language === 'ar'
              ? 'لم يتم تسجيل ملاحظات أو توجيهات لهذا الطالب بعد من قِبل المعلم.'
              : 'No teacher notes or feedback recorded for this student yet.'}
          </div>
        )}
      </div>
    </div>
  );
}
