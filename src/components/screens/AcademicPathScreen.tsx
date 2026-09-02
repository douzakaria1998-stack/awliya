'use client';

import React, { useState } from 'react';
import {
  GraduationCap,
  CheckCircle2,
  Lock,
  Sparkles,
  BookOpen,
  Award,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useStudent } from '@/context/StudentContext';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { levelThemes } from '@/lib/themes';
import { AcademicLevel } from '@/types';
import { LEVEL_TITLES_EN, LEVEL_TITLES_FR } from '@/lib/constants';
import { LevelDetailModal } from '../modals/LevelDetailModal';
import { StudentSwitcher } from '../layout/StudentSwitcher';
import { translateTrack } from '@/lib/translations';

interface AcademicPathScreenProps {
  onOpenAddStudent: () => void;
}

export function AcademicPathScreen({ onOpenAddStudent }: AcademicPathScreenProps) {
  const { activeStudent, academicLevels } = useStudent();
  const { theme } = useTheme();
  const { t, isRTL, language } = useLanguage();

  const [selectedLevel, setSelectedLevel] = useState<AcademicLevel | null>(null);

  const completedCount = academicLevels.filter((l) => l.status === 'studied').length;

  const getLevelName = (lvl: AcademicLevel) => {
    if (language === 'en' && LEVEL_TITLES_EN[lvl.level]) return LEVEL_TITLES_EN[lvl.level].name;
    if (language === 'fr' && LEVEL_TITLES_FR[lvl.level]) return LEVEL_TITLES_FR[lvl.level].name;
    return lvl.nameAr;
  };

  const getLevelStage = (lvl: AcademicLevel) => {
    if (language === 'en' && LEVEL_TITLES_EN[lvl.level]) return LEVEL_TITLES_EN[lvl.level].stage;
    if (language === 'fr' && LEVEL_TITLES_FR[lvl.level]) return LEVEL_TITLES_FR[lvl.level].stage;
    return lvl.stageAr;
  };

  return (
    <div
      className={`w-full animate-fade-in select-none ${isRTL ? 'text-right' : 'text-left'}`}
      style={{ paddingBottom: '80px' }}
    >
      {/* 1. Screen Header: Minimized 16px bottom margin to sit close to the overview card */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{
          marginTop: '28px',
          marginBottom: '16px',
        }}
      >
        <div>
          <span className="text-xs sm:text-sm font-bold text-slate-400 block mb-0.5">
            {t.tenLevelsRoadmap}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t.academicPathTitle}
          </h1>
        </div>

        {/* Current Level Pill Badge */}
        <div className="self-start sm:self-auto shrink-0">
          <div
            className="inline-flex items-center rounded-full font-bold text-white shadow-xs select-none"
            style={{
              backgroundColor: theme.primary,
              height: '38px',
              paddingRight: isRTL ? '18px' : '20px',
              paddingLeft: isRTL ? '20px' : '18px',
              gap: '10px',
              fontSize: '13px',
            }}
          >
            <Sparkles size={16} className="shrink-0" />
            <span className="whitespace-nowrap leading-none">
              {t.currentLevelBadge}: {language === 'ar' ? theme.shortNameAr : language === 'fr' ? `Niveau ${activeStudent.currentLevel}` : `Level ${activeStudent.currentLevel}`}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile-only student switcher */}
      <div className="block md:hidden mb-6">
        <StudentSwitcher onOpenAddStudent={onOpenAddStudent} />
      </div>

      {/* 2. Path Overview Summary Card */}
      <div
        className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-2xs"
        style={{
          padding: '28px 36px',
          borderRadius: '24px',
          marginBottom: '40px',
        }}
      >
        {/* Student track name and completion status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <span
              className="w-3.5 h-3.5 rounded-full shrink-0"
              style={{ backgroundColor: theme.primary }}
            />
            <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {t.studentTrack}: <span className="font-mono text-slate-600 dark:text-slate-300 font-semibold">{translateTrack(activeStudent.enrolledPathAr, language)}</span>
            </span>
          </div>
          <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
            {completedCount} / {academicLevels.length} {t.levelsCompleted} ({Math.round((completedCount / (academicLevels.length || 1)) * 100)}%)
          </span>
        </div>

        {/* Progress Timeline Segments */}
        <div className="mb-6">
          <div className="w-full h-3.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex mb-2.5">
            {academicLevels.map((lvl) => {
              let bg = '#E2E8F0';
              if (lvl.status === 'studied') bg = '#16A34A';
              else if (lvl.status === 'current') bg = theme.primary;

              return (
                <div
                  key={lvl.level}
                  className="flex-1 h-full border-r border-white dark:border-slate-900 first:border-r-0 transition-colors"
                  style={{ backgroundColor: bg }}
                  title={`${getLevelName(lvl)} (${lvl.status})`}
                />
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-400">
            <span>{academicLevels.length > 0 ? `${t.level} ${academicLevels[0].level} (${academicLevels[0].cefrCode || 'A1'})` : t.levelMilestone1}</span>
            <span style={{ color: theme.primary }} className="font-bold">
              {t.levelMilestoneCurrent} ({activeStudent.currentLevel})
            </span>
            <span>
              {academicLevels.length > 0
                ? `${t.level} ${academicLevels[academicLevels.length - 1].level} (${academicLevels[academicLevels.length - 1].cefrCode || 'C2'})`
                : t.levelMilestone10}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm font-semibold">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
            <span className="w-3 h-3 rounded-full bg-emerald-600 shrink-0" />
            <span>{t.statusStudied} ({completedCount})</span>
          </div>
          <div className="flex items-center gap-2" style={{ color: theme.primary }}>
            <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: theme.primary }} />
            <span>{t.statusCurrent}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0" />
            <span>
              {t.statusLocked} ({Math.max(0, academicLevels.length - completedCount - (academicLevels.some((l) => l.status === 'current') ? 1 : 0))})
            </span>
          </div>
        </div>
      </div>

      {/* 3. Vertical Timeline Roadmap with generous 32px gap between cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {academicLevels.map((lvl) => {
          const isStudied = lvl.status === 'studied';
          const isCurrent = lvl.status === 'current';
          const isLocked = lvl.status === 'locked';

          return (
            <div
              key={lvl.level}
              role="button"
              tabIndex={isLocked ? -1 : 0}
              onClick={() => !isLocked && setSelectedLevel(lvl)}
              onKeyDown={(e) => e.key === 'Enter' && !isLocked && setSelectedLevel(lvl)}
              className={`w-full transition-all flex flex-col justify-between cursor-pointer ${
                isCurrent
                  ? 'bg-white dark:bg-slate-850 shadow-lg'
                  : isStudied
                  ? 'bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-emerald-300'
                  : 'bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 opacity-60 cursor-not-allowed'
              }`}
              style={{
                padding: isCurrent ? '30px 36px' : '26px 34px',
                borderRadius: '24px',
                borderWidth: isCurrent ? '2px' : '1px',
                borderColor: isCurrent ? theme.primary : undefined,
              }}
            >
              <div>
                {/* Level Card Header */}
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Node Icon */}
                    <div
                      className={`rounded-2xl flex items-center justify-center text-white shrink-0 font-bold shadow-xs ${
                        isCurrent
                          ? 'ring-4 ring-offset-2'
                          : isStudied
                          ? 'bg-emerald-600'
                          : 'bg-slate-300 dark:bg-slate-700 text-slate-500'
                      }`}
                      style={{
                        backgroundColor: isCurrent ? theme.primary : isStudied ? '#16A34A' : undefined,
                        width: '48px',
                        height: '48px',
                        minWidth: '48px',
                      }}
                    >
                      {isStudied ? (
                        <CheckCircle2 size={24} strokeWidth={2.5} />
                      ) : isCurrent ? (
                        <Sparkles size={24} />
                      ) : (
                        <Lock size={20} />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-bold text-slate-400 block">
                          {t.stage} {lvl.level}
                        </span>
                        {lvl.cefrCode && (
                          <span
                            className="inline-flex items-center justify-center rounded-lg text-xs font-black tracking-wide font-mono bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800/60 shadow-2xs select-none"
                            style={{
                              padding: '3px 10px',
                              minWidth: '36px',
                              lineHeight: '1.2',
                            }}
                          >
                            {lvl.cefrCode}
                          </span>
                        )}
                        {lvl.modules && (
                          <span className="text-xs font-semibold text-slate-400">
                            • {lvl.modules.length} {language === 'ar' ? 'وحدات معتمدة' : 'units'}
                          </span>
                        )}
                      </div>
                      <h3
                        className={`text-lg sm:text-xl font-bold truncate ${
                          isCurrent
                            ? 'text-slate-900 dark:text-white'
                            : isStudied
                            ? 'text-slate-800 dark:text-slate-100'
                            : 'text-slate-500'
                        }`}
                      >
                        {getLevelName(lvl)}
                      </h3>
                    </div>
                  </div>

                  {/* Level Status Pill Badge */}
                  <div className="shrink-0">
                    {isStudied && (
                      <span
                        className="inline-flex items-center rounded-full font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 shadow-2xs whitespace-nowrap select-none"
                        style={{
                          height: '34px',
                          paddingRight: '16px',
                          paddingLeft: '16px',
                          gap: '6px',
                          fontSize: '13px',
                        }}
                      >
                        <Award size={15} className="shrink-0" />
                        <span>{t.grade} {lvl.score || 95}%</span>
                      </span>
                    )}

                    {isCurrent && (
                      <span
                        className="inline-flex items-center rounded-full font-bold text-white shadow-2xs whitespace-nowrap select-none animate-pulse"
                        style={{
                          backgroundColor: theme.primary,
                          height: '34px',
                          paddingRight: '18px',
                          paddingLeft: '18px',
                          fontSize: '13px',
                        }}
                      >
                        {t.statusCurrent} ({lvl.progress !== undefined ? lvl.progress : activeStudent.currentLevelProgress}%)
                      </span>
                    )}

                    {isLocked && (
                      <span
                        className="inline-flex items-center rounded-full font-semibold bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200/50 dark:border-slate-700/50 whitespace-nowrap select-none"
                        style={{
                          height: '34px',
                          paddingRight: '16px',
                          paddingLeft: '16px',
                          gap: '6px',
                          fontSize: '12px',
                        }}
                      >
                        <Lock size={13} className="shrink-0" />
                        <span>{t.statusLocked}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Level Stage Description */}
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-4">
                  {getLevelStage(lvl)}
                </p>

                {/* Progress bar inside Current Level card */}
                {isCurrent && (
                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                      <span className="text-slate-700 dark:text-slate-200">{t.currentProgressRate}</span>
                      <span style={{ color: theme.primary }} className="font-mono text-base sm:text-lg font-bold">
                        {lvl.progress !== undefined ? lvl.progress : activeStudent.currentLevelProgress}%
                      </span>
                    </div>
                    <div className="w-full h-3.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${lvl.progress !== undefined ? lvl.progress : activeStudent.currentLevelProgress}%`,
                          backgroundColor: theme.primary,
                        }}
                      />
                    </div>
                    {lvl.completedLessonsCount !== undefined && lvl.totalLessonsCount !== undefined && lvl.totalLessonsCount > 0 && (
                      <div className="text-xs text-slate-400 font-semibold text-right">
                        {lvl.completedLessonsCount} / {lvl.totalLessonsCount} {language === 'ar' ? 'دروس مكتملة' : 'lessons completed'}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Card Footer Action */}
              {!isLocked && (
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 group">
                  <span className="flex items-center gap-2">
                    <BookOpen size={16} />
                    <span>{t.viewCurriculumDetails}</span>
                  </span>
                  {isRTL ? (
                    <ChevronLeft size={18} className="text-slate-400 group-hover:-translate-x-1.5 transition-transform" />
                  ) : (
                    <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-1.5 transition-transform" />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <LevelDetailModal
        level={selectedLevel}
        isOpen={!!selectedLevel}
        onClose={() => setSelectedLevel(null)}
      />
    </div>
  );
}
