'use client';

import React from 'react';
import {
  Check,
  FileText,
  Clock,
  Layers,
} from 'lucide-react';
import { useStudent } from '@/context/StudentContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { NavTabKey, PerformanceTabKey, SHOW_FINANCIALS_TAB, getStudentGenderNoun } from '@/lib/constants';
import { levelThemes } from '@/lib/themes';
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
  } = useStudent();
  const { theme } = useTheme();
  const { t, language, isRTL } = useLanguage();

  const activeLevelTheme = levelThemes[activeStudent.currentLevel] || levelThemes[4];
  const revisionHomework = homeworkList.find((h) => h.status === 'needs_revision');
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
      style={{ paddingBottom: '80px' }}
    >
      {/* =========================================================================
          1. Welcome Card (Explicit 32px top margin from header, 32px bottom margin)
          ========================================================================= */}
      <div
        className="text-white shadow-md relative overflow-hidden flex flex-col justify-between"
        style={{
          backgroundColor: theme.primary,
          minHeight: '200px',
          padding: '28px 32px',
          borderRadius: '24px',
          marginTop: '32px',
          marginBottom: '32px',
        }}
      >
        {/* Subtle decorative background shapes */}
        <div className="absolute -left-12 -bottom-12 w-52 h-52 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute left-16 -top-12 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />

        {/* Content inside the card */}
        <div className="relative z-10" style={{ padding: '8px' }}>
          {/* Greeting */}
          <p className="text-sm font-medium text-white/90" style={{ marginBottom: '6px' }}>
            {t.greeting}, {parentFirstName} 👋
          </p>

          {/* Student's name/title */}
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug" style={{ marginBottom: '16px' }}>
            {t.parentOf} {studentFirstName}
          </h2>
        </div>

        {/* Level Badge Pill / Pending Pill */}
        <div className={`relative z-10 ${isRTL ? 'self-start' : 'self-start'}`} style={{ padding: '0 8px 8px 8px' }}>
          {activeStudent.status === 'pending' ? (
            <div
              className="inline-flex items-center gap-2 rounded-full bg-amber-500 text-xs font-bold text-white shadow-2xs"
              style={{ padding: '8px 18px' }}
            >
              <Clock size={15} />
              <span>{language === 'ar' ? 'طلب قيد المراجعة - بانتظار الاختبار' : language === 'fr' ? 'En attente - Test de niveau prévu' : 'Pending - Awaiting Placement Test'}</span>
            </div>
          ) : (
            <div
              className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white border border-white/25 shadow-2xs"
              style={{ padding: '8px 16px' }}
            >
              <Layers size={15} />
              <span>{t.level} {levelWord}</span>
            </div>
          )}
        </div>
      </div>

      {/* Pending Account Notice Banner */}
      {activeStudent.status === 'pending' && (
        <div
          className={`bg-amber-50/90 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/80 rounded-2xl flex items-start gap-4 shadow-xs ${isRTL ? 'text-right' : 'text-left'} animate-fade-in`}
          style={{
            padding: '22px 26px',
            marginBottom: '32px',
          }}
        >
          <div className="w-11 h-11 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Clock size={22} />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-black text-amber-950 dark:text-amber-100 text-sm sm:text-base mb-1">
              {language === 'ar' ? `طلب تسجيل ${getStudentGenderNoun(activeStudent)} قيد المراجعة لدى الإدارة` : language === 'fr' ? "Demande d'inscription en cours d'examen" : 'Registration Request Under Review'}
            </h4>
            <p className="text-xs sm:text-sm text-amber-800/90 dark:text-amber-300/90 leading-relaxed font-medium">
              {language === 'ar'
                ? `تم استلام طلب تسجيل ${getStudentGenderNoun(activeStudent)} (${activeStudent.fullNameAr}) في مسار (${activeStudent.enrolledPathAr}) بنجاح. سيقوم فريق الإدارة بالتواصل معكم لتحديد موعد اختبار تحديد المستوى واعتماد التفعيل النهائي.`
                : language === 'fr'
                ? `La demande d'inscription pour (${activeStudent.fullNameAr}) a été reçue avec succès. L'administration vous contactera pour organiser le test de niveau.`
                : `The registration request for (${activeStudent.fullNameAr}) is under review. Our administration team will contact you to schedule the placement test.`}
            </p>
          </div>
        </div>
      )}

      {/* =========================================================================
          2. Progress Card (32px bottom margin)
          ========================================================================= */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => onNavigate('academic')}
        onKeyDown={(e) => e.key === 'Enter' && onNavigate('academic')}
        className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer"
        style={{
          padding: '28px 32px',
          borderRadius: '20px',
          marginBottom: '36px',
        }}
      >
        {/* Percentage and Level Info */}
        <div className="flex items-center justify-between gap-4" style={{ marginBottom: '16px' }}>
          {/* Icon (56px x 56px) + Title + Subtitle */}
          <div className="flex items-center" style={{ gap: '16px' }}>
            <div
              className="rounded-full flex items-center justify-center text-white shrink-0 shadow-xs"
              style={{
                backgroundColor: theme.primary,
                width: '56px',
                height: '56px',
                minWidth: '56px',
                minHeight: '56px',
              }}
            >
              <Check size={28} strokeWidth={3} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                {activeStudent.gender === 'female' ? t.daughterProgress : t.sonProgress}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 font-semibold" style={{ marginTop: '4px' }}>
                {t.level} {levelWord} • {t.levelOfTen}
              </p>
            </div>
          </div>

          {/* Percentage text */}
          <div
            className="text-2xl sm:text-3xl font-bold font-mono tracking-tight"
            style={{ color: theme.primary }}
          >
            {activeStudent.currentLevelProgress || 40} %
          </div>
        </div>

        {/* Progress Bar */}
        <div
          className="w-full bg-slate-100 dark:bg-slate-800 overflow-hidden"
          style={{ height: '16px', borderRadius: '8px', marginTop: '16px' }}
        >
          <div
            className="h-full transition-all duration-700"
            style={{
              width: `${activeStudent.currentLevelProgress || 40}%`,
              backgroundColor: theme.primary,
              borderRadius: '8px',
            }}
          />
        </div>
      </div>

      {/* =========================================================================
          3. Notifications Section
          ========================================================================= */}
      <div style={{ marginBottom: '36px' }}>
        <h3
          className="text-slate-900 dark:text-white"
          style={{
            fontSize: '22px',
            fontWeight: '700',
            lineHeight: '32px',
            marginBottom: '16px',
            paddingRight: isRTL ? '4px' : '0',
            paddingLeft: isRTL ? '0' : '4px',
          }}
        >
          {t.recentNotifications}
        </h3>

        {/* Notification Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Card 1: Homework Revision */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => {
              if (revisionHomework && onOpenHomeworkDetail) onOpenHomeworkDetail(revisionHomework.id);
              else onNavigate('performance', 'homework');
            }}
            onKeyDown={(e) => e.key === 'Enter' && onNavigate('performance', 'homework')}
            className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-center justify-between cursor-pointer"
            style={{
              minHeight: '76px',
              padding: '18px 24px',
              borderRadius: '16px',
              gap: '16px',
            }}
          >
            <div className="flex items-center min-w-0" style={{ gap: '16px' }}>
              <div
                className="rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-500 border border-amber-200/70 dark:border-amber-800/60 flex items-center justify-center shrink-0"
                style={{ width: '48px', height: '48px', minWidth: '48px' }}
              >
                <FileText size={24} />
              </div>
              <div className="min-w-0">
                <h4
                  className="font-bold text-slate-900 dark:text-white truncate"
                  style={{ fontSize: '17px', lineHeight: '24px', marginBottom: '4px' }}
                >
                  {t.homeworkNeedsRevision}
                </h4>
                <p
                  className="text-slate-400 font-medium truncate"
                  style={{ fontSize: '14px', lineHeight: '22px' }}
                >
                  {t.homeworkNeedsRevisionDesc}
                </p>
              </div>
            </div>

            <span
              className="text-slate-400 font-semibold whitespace-nowrap shrink-0 text-xs"
              style={{ fontSize: '13px', lineHeight: '20px' }}
            >
              {t.twoHoursAgo}
            </span>
          </div>

          {/* Card 2: Course Expiry / Payment Alert */}
          {SHOW_FINANCIALS_TAB && (
            <div
              role="button"
              tabIndex={0}
              onClick={() => onNavigate('financials')}
              onKeyDown={(e) => e.key === 'Enter' && onNavigate('financials')}
              className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-center justify-between cursor-pointer"
              style={{
                minHeight: '76px',
                padding: '18px 24px',
                borderRadius: '16px',
                gap: '16px',
              }}
            >
              <div className="flex items-center min-w-0" style={{ gap: '16px' }}>
                <div
                  className="rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-500 border border-orange-200/70 dark:border-orange-800/60 flex items-center justify-center shrink-0"
                  style={{ width: '48px', height: '48px', minWidth: '48px' }}
                >
                  <Clock size={24} />
                </div>
                <div className="min-w-0">
                  <h4
                    className="font-bold text-slate-900 dark:text-white truncate"
                    style={{ fontSize: '17px', lineHeight: '24px', marginBottom: '4px' }}
                  >
                    {t.courseEndingSoon}
                  </h4>
                  <p
                    className="text-slate-400 font-medium truncate"
                    style={{ fontSize: '14px', lineHeight: '22px' }}
                  >
                    {t.courseEndingSoonDesc}
                  </p>
                </div>
              </div>

              <span
                className="text-slate-400 font-semibold whitespace-nowrap shrink-0 text-xs"
                style={{ fontSize: '13px', lineHeight: '20px' }}
              >
                {t.yesterday}
              </span>
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
            fontSize: '22px',
            fontWeight: '700',
            lineHeight: '32px',
            marginBottom: '16px',
            paddingRight: isRTL ? '4px' : '0',
            paddingLeft: isRTL ? '0' : '4px',
          }}
        >
          {t.latestTeacherNote}
        </h3>

        {/* Teacher Card */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onNavigate('performance', 'feedback')}
          onKeyDown={(e) => e.key === 'Enter' && onNavigate('performance', 'feedback')}
          className="border shadow-2xs transition-all cursor-pointer"
          style={{
            backgroundColor: `${theme.primary}0C`,
            borderColor: `${theme.primary}26`,
            padding: '24px 28px',
            borderRadius: '20px',
          }}
        >
          {/* Teacher Header */}
          <div className="flex items-center" style={{ gap: '14px', marginBottom: '16px' }}>
            <div
              className="rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-xs"
              style={{
                backgroundColor: theme.primary,
                width: '48px',
                height: '48px',
                minWidth: '48px',
              }}
            >
              {language === 'ar' ? 'أ.س' : 'T.M'}
            </div>
            <div>
              <h4
                className="font-bold text-slate-900 dark:text-white"
                style={{ fontSize: '17px', lineHeight: '24px' }}
              >
                {language === 'ar'
                  ? latestFeedback?.teacherNameAr || 'مستر ديفيد ويلسون'
                  : language === 'fr'
                  ? 'M. David Wilson'
                  : 'Mr. David Wilson'}
              </h4>
              <p className="text-xs text-slate-400 font-medium" style={{ marginTop: '2px' }}>
                {t.quranSubject}
              </p>
            </div>
          </div>

          {/* Note Bubble */}
          <div
            className="bg-white dark:bg-slate-850 border border-slate-100 dark:border-slate-800 shadow-2xs relative flex items-center"
            style={{ padding: '20px 24px', borderRadius: '16px' }}
          >
            {/* Colored vertical accent line */}
            <div
              className="rounded-full shrink-0"
              style={{
                backgroundColor: theme.primary,
                width: '6px',
                height: '32px',
                marginLeft: isRTL ? '16px' : '0',
                marginRight: isRTL ? '0' : '16px',
              }}
            />
            <p
              className="text-slate-700 dark:text-slate-200 font-medium"
              style={{ fontSize: '16px', lineHeight: '28px', padding: '0 4px' }}
            >
              {translateTeacherNote(latestFeedback?.messageAr || t.teacherDefaultNote, language)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
