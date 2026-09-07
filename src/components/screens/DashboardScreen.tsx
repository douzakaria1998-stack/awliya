'use client';

import React, { useMemo } from 'react';
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
  } = useStudent();
  const { theme } = useTheme();
  const { t, language, isRTL } = useLanguage();

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
      .filter((n) => !n.studentId || n.studentId === activeStudent.id)
      .map((n) => ({
        id: `sys-${n.id}`,
        homeworkId: (n.actionPayload as any)?.homeworkId || (n.actionPayload as any)?.itemId,
        type: 'system' as const,
        title: n.titleAr || (language === 'ar' ? 'إشعار جديد' : 'New Notification'),
        description: n.messageAr || '',
        time: n.date || (language === 'ar' ? 'اليوم' : 'Today'),
        icon: Bell,
        colorClass: 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 border-cyan-200/70 dark:border-cyan-800/60',
        badgeText: language === 'ar' ? 'إشعار' : 'Notice',
        badgeClass: 'bg-cyan-600 text-white',
      }));

    const all = [...revision, ...pending, ...completed, ...studentNotifs];
    return all.slice(0, 3);
  }, [homeworkList, notifications, activeStudent.id, language, t]);

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
      className={`w-full animate-fade-in select-none ${isRTL ? 'text-right' : 'text-left'}`}
      style={{ paddingBottom: '60px' }}
    >
      {/* =========================================================================
          1. Welcome Card
          ========================================================================= */}
      <div
        className="text-white shadow-md relative overflow-hidden flex flex-col justify-between"
        style={{
          backgroundColor: activeLevelTheme.primary,
          minHeight: '130px',
          padding: '18px 22px',
          borderRadius: '18px',
          marginTop: '16px',
          marginBottom: '14px',
        }}
      >
        {/* Subtle decorative background shapes */}
        <div className="absolute -left-12 -bottom-12 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute left-16 -top-12 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />

        {/* Content inside the card */}
        <div className="relative z-10" style={{ padding: '2px 4px' }}>
          {/* Greeting */}
          <p className="text-xs font-medium text-white/90" style={{ marginBottom: '2px' }}>
            {t.greeting}, {parentFirstName} 👋
          </p>

          {/* Student's name/title */}
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug" style={{ marginBottom: '10px' }}>
            {t.parentOf} {studentFirstName}
          </h2>
        </div>

        {/* Level Badge Pill / Pending Pill */}
        <div className={`relative z-10 ${isRTL ? 'self-start' : 'self-start'}`} style={{ padding: '0 4px 4px 4px' }}>
          {activeStudent.status === 'pending' ? (
            <div
              className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 text-[11px] font-bold text-white shadow-2xs"
              style={{ padding: '4px 14px', height: '26px' }}
            >
              <Clock size={13} />
              <span>{language === 'ar' ? 'طلب قيد المراجعة - بانتظار الاختبار' : language === 'fr' ? 'En attente - Test prévu' : 'Pending - Placement Test'}</span>
            </div>
          ) : (
            <div
              className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold text-white border border-white/25 shadow-2xs"
              style={{ padding: '4px 12px', height: '26px' }}
            >
              <Layers size={13} />
              <span>{t.level} {levelWord}</span>
            </div>
          )}
        </div>
      </div>

      {/* Pending Account Notice Banner */}
      {activeStudent.status === 'pending' && (
        <div
          className={`bg-amber-50/90 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/80 rounded-xl flex items-start gap-3 shadow-xs ${isRTL ? 'text-right' : 'text-left'} animate-fade-in`}
          style={{
            padding: '14px 18px',
            marginBottom: '14px',
          }}
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Clock size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-amber-950 dark:text-amber-100 text-xs sm:text-sm mb-0.5">
              {language === 'ar' ? `طلب تسجيل ${getStudentGenderNoun(activeStudent)} قيد المراجعة لدى الإدارة` : language === 'fr' ? "Demande d'inscription en cours d'examen" : 'Registration Request Under Review'}
            </h4>
            <p className="text-[11px] text-amber-800/90 dark:text-amber-300/90 leading-relaxed font-medium">
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
        className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer"
        style={{
          padding: '16px 20px',
          borderRadius: '16px',
          marginBottom: '18px',
        }}
      >
        {/* Percentage and Level Info */}
        <div className="flex items-center justify-between gap-3" style={{ marginBottom: '10px' }}>
          {/* Icon + Title + Subtitle */}
          <div className="flex items-center gap-3">
            <div
              className="rounded-full flex items-center justify-center text-white shrink-0 shadow-xs"
              style={{
                backgroundColor: activeLevelTheme.primary,
                width: '38px',
                height: '38px',
                minWidth: '38px',
                minHeight: '38px',
              }}
            >
              <Check size={20} strokeWidth={3} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">
                {activeStudent.gender === 'female' ? t.daughterProgress : t.sonProgress}
              </h3>
              <p className="text-xs text-slate-400 font-semibold" style={{ marginTop: '2px' }}>
                {t.level} {levelWord} • {t.levelOfTen}
              </p>
            </div>
          </div>

          {/* Percentage text */}
          <div
            className="text-xl sm:text-2xl font-bold font-mono tracking-tight"
            style={{ color: activeLevelTheme.primary }}
          >
            % {activeStudent.currentLevelProgress ?? 0}
          </div>
        </div>

        {/* Progress Bar */}
        <div
          className="w-full bg-slate-100 dark:bg-slate-800 overflow-hidden"
          style={{ height: '10px', borderRadius: '6px', marginTop: '10px' }}
        >
          <div
            className="h-full transition-all duration-700"
            style={{
              width: `${activeStudent.currentLevelProgress ?? 0}%`,
              backgroundColor: activeLevelTheme.primary,
              borderRadius: '6px',
            }}
          />
        </div>
      </div>

      {/* =========================================================================
          3. Notifications & Homework Alerts Section
          ========================================================================= */}
      <div style={{ marginBottom: '18px' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: '10px' }}>
          <h3
            className="text-slate-900 dark:text-white"
            style={{
              fontSize: '16px',
              fontWeight: '700',
              lineHeight: '24px',
              paddingRight: isRTL ? '4px' : '0',
              paddingLeft: isRTL ? '0' : '4px',
            }}
          >
            {t.recentNotifications}
          </h3>

          <button
            type="button"
            onClick={() => onNavigate('performance', 'homework')}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>{language === 'ar' ? 'الواجبات المنزلية' : language === 'fr' ? 'Devoirs' : 'Homework'}</span>
            {isRTL ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>
        </div>

        {/* Notification Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {recentHomeworkNotifications.length > 0 ? (
            recentHomeworkNotifications.map((notif) => {
              const IconComp = notif.icon;
              return (
                <div
                  key={notif.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    if (notif.homeworkId && onOpenHomeworkDetail) {
                      onOpenHomeworkDetail(notif.homeworkId);
                    } else {
                      onNavigate('performance', 'homework');
                    }
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && onNavigate('performance', 'homework')}
                  className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-xs transition-all flex items-center justify-between cursor-pointer group"
                  style={{
                    minHeight: '64px',
                    padding: '12px 16px',
                    borderRadius: '16px',
                    gap: '12px',
                  }}
                >
                  <div className="flex items-center min-w-0" style={{ gap: '12px' }}>
                    <div
                      className={`rounded-xl flex items-center justify-center shrink-0 border ${notif.colorClass}`}
                      style={{ width: '38px', height: '38px', minWidth: '38px' }}
                    >
                      <IconComp size={18} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="font-bold text-slate-900 dark:text-white truncate text-xs sm:text-sm">
                          {notif.title}
                        </h4>
                        {notif.badgeText && (
                          <span
                            className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold ${notif.badgeClass} shrink-0`}
                          >
                            {notif.badgeText}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 font-medium truncate text-[11.5px]">
                        {notif.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-slate-400 font-semibold whitespace-nowrap text-[11px]">
                      {notif.time}
                    </span>
                    <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {isRTL ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                    </div>
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
              className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex items-center justify-between cursor-pointer"
              style={{
                minHeight: '60px',
                padding: '12px 16px',
                borderRadius: '16px',
                gap: '12px',
              }}
            >
              <div className="flex items-center min-w-0" style={{ gap: '12px' }}>
                <div
                  className="rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 border border-indigo-200/70 dark:border-indigo-800/60 flex items-center justify-center shrink-0"
                  style={{ width: '38px', height: '38px', minWidth: '38px' }}
                >
                  <BookOpen size={18} />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-900 dark:text-white truncate text-xs sm:text-sm" style={{ marginBottom: '2px' }}>
                    {language === 'ar' ? 'قسم الواجبات والأنشطة المدرسية' : 'Homework & Activities Section'}
                  </h4>
                  <p className="text-slate-400 font-medium truncate text-[11px]">
                    {language === 'ar' ? 'اضغط هنا لمتابعة المهام والواجبات المطلوبة لهذا الأسبوع' : 'Click here to view assigned homework and tasks'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 text-xs font-bold shrink-0">
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
      <div>
        <h3
          className="text-slate-900 dark:text-white"
          style={{
            fontSize: '16px',
            fontWeight: '700',
            lineHeight: '24px',
            marginBottom: '10px',
            paddingRight: isRTL ? '4px' : '0',
            paddingLeft: isRTL ? '0' : '4px',
          }}
        >
          {t.latestTeacherNote}
        </h3>

        {/* Teacher Card if exists, or clean empty placeholder */}
        {latestFeedback ? (
          <div
            role="button"
            tabIndex={0}
            onClick={() => onNavigate('performance', 'feedback')}
            onKeyDown={(e) => e.key === 'Enter' && onNavigate('performance', 'feedback')}
            className="border shadow-2xs transition-all cursor-pointer"
            style={{
              backgroundColor: `${theme.primary}0C`,
              borderColor: `${theme.primary}26`,
              padding: '16px 20px',
              borderRadius: '16px',
            }}
          >
            {/* Teacher Header */}
            <div className="flex items-center gap-2.5" style={{ marginBottom: '10px' }}>
              <div
                className="rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs"
                style={{
                  backgroundColor: theme.primary,
                  width: '36px',
                  height: '36px',
                  minWidth: '36px',
                }}
              >
                {language === 'ar' ? 'أ.س' : 'T.M'}
              </div>
              <div>
                <h4
                  className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm"
                >
                  {latestFeedback.teacherNameAr || 'معلم المادة'}
                </h4>
                <p className="text-[11px] text-slate-400 font-medium">
                  {latestFeedback.subjectAr || t.quranSubject}
                </p>
              </div>
            </div>

            {/* Note Bubble or Structured Guidance */}
            {latestFeedback.teacherFeedbackDetails &&
            (latestFeedback.teacherFeedbackDetails.strengths?.length ||
              latestFeedback.teacherFeedbackDetails.needsImprovement?.length ||
              latestFeedback.teacherFeedbackDetails.recommendations) ? (
              <div
                className="bg-white dark:bg-slate-850 border border-slate-100 dark:border-slate-800 shadow-2xs relative rounded-2xl"
                style={{ padding: '14px 18px' }}
              >
                <div className="space-y-1.5 text-slate-700 dark:text-slate-300 leading-relaxed text-xs sm:text-sm">
                  {latestFeedback.teacherFeedbackDetails.strengths && latestFeedback.teacherFeedbackDetails.strengths.length > 0 && (
                    <div>
                      • <span className="font-bold text-emerald-700 dark:text-emerald-400">{language === 'ar' ? 'نقاط القوة:' : 'Strengths:'}</span>{' '}
                      {Array.isArray(latestFeedback.teacherFeedbackDetails.strengths)
                        ? latestFeedback.teacherFeedbackDetails.strengths.join('، ')
                        : latestFeedback.teacherFeedbackDetails.strengths}
                    </div>
                  )}
                  {latestFeedback.teacherFeedbackDetails.needsImprovement && latestFeedback.teacherFeedbackDetails.needsImprovement.length > 0 && (
                    <div>
                      • <span className="font-bold text-amber-700 dark:text-amber-400">{language === 'ar' ? 'بحاجة لتطوير:' : 'Needs Improvement:'}</span>{' '}
                      {Array.isArray(latestFeedback.teacherFeedbackDetails.needsImprovement)
                        ? latestFeedback.teacherFeedbackDetails.needsImprovement.join('، ')
                        : latestFeedback.teacherFeedbackDetails.needsImprovement}
                    </div>
                  )}
                  {latestFeedback.teacherFeedbackDetails.recommendations && (
                    <div>
                      • <span className="font-bold text-purple-700 dark:text-purple-400">{language === 'ar' ? 'توصية للمنزل:' : 'Home Recommendation:'}</span>{' '}
                      "{latestFeedback.teacherFeedbackDetails.recommendations}"
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div
                className="bg-white dark:bg-slate-850 border border-slate-100 dark:border-slate-800 shadow-2xs relative flex items-center"
                style={{ padding: '12px 16px', borderRadius: '12px' }}
              >
                <div
                  className="rounded-full shrink-0"
                  style={{
                    backgroundColor: theme.primary,
                    width: '4px',
                    height: '24px',
                    marginLeft: isRTL ? '12px' : '0',
                    marginRight: isRTL ? '0' : '12px',
                  }}
                />
                <p
                  className="text-slate-700 dark:text-slate-200 font-medium text-xs sm:text-sm leading-relaxed"
                >
                  {translateTeacherNote(latestFeedback.messageAr || t.teacherDefaultNote, language)}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-850 border border-slate-200/70 dark:border-slate-800 shadow-2xs rounded-2xl p-5 text-center text-xs text-slate-400 font-medium">
            {language === 'ar'
              ? 'لم يتم تسجيل ملاحظات أو توجيهات لهذا الطالب بعد من قِبل المعلم.'
              : 'No teacher notes or feedback recorded for this student yet.'}
          </div>
        )}
      </div>
    </div>
  );
}
