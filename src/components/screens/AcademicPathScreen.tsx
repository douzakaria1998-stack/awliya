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
import { levelThemes, getThemeForLevel } from '@/lib/themes';
import { AcademicLevel, LevelId } from '@/types';
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

  const currentLevelObj = academicLevels.find((l) => Number(l.level) === Number(activeStudent.currentLevel));
  const activeLevelTheme = getThemeForLevel(
    activeStudent.currentLevel,
    currentLevelObj?.color || (currentLevelObj as any)?.themeColor
  );

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
      style={{ paddingBottom: '60px' }}
    >
      {/* 1. Screen Header */}
      <div className="flex items-center justify-between gap-3 my-3 sm:my-4">
        <div>
          <span className="text-xs font-semibold text-slate-400 block mb-0.5">
            {language === 'ar' ? `خارطة المسار الأكاديمي (${academicLevels.length} مستويات)` : `${academicLevels.length}-Level Roadmap`}
          </span>
          <h1 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t.academicPathTitle}
          </h1>
        </div>

        {/* Current Level Pill Badge */}
        <div className="shrink-0">
          <div
            className="inline-flex items-center rounded-full font-bold text-white shadow-2xs select-none px-3 py-1 text-xs gap-1.5"
            style={{
              backgroundColor: activeLevelTheme.primary,
            }}
          >
            <Sparkles size={13} className="shrink-0" />
            <span className="whitespace-nowrap leading-none">
              {language === 'ar' ? activeLevelTheme.shortNameAr : `${t.level} ${activeStudent.currentLevel}`}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile-only student switcher */}
      <div className="block md:hidden mb-3.5">
        <StudentSwitcher onOpenAddStudent={onOpenAddStudent} />
      </div>

      {/* 2. Path Overview Summary Card */}
      <div
        className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-2xs p-4 sm:p-5 rounded-2xl mb-4"
      >
        {/* Student track name and completion status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: activeLevelTheme.primary }}
            />
            <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              {t.studentTrack}: <span className="text-slate-600 dark:text-slate-300 font-semibold">{translateTrack(activeStudent.enrolledPathAr, language)}</span>
            </span>
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400">
            {completedCount} / {academicLevels.length} {t.levelsCompleted} ({Math.round((completedCount / (academicLevels.length || 1)) * 100)}%)
          </span>
        </div>

        {/* Progress Timeline Segments */}
        <div className="mb-3">
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex mb-1.5">
            {academicLevels.map((lvl) => {
              const lvlObjTheme = getThemeForLevel(lvl.level as LevelId, lvl.color);
              let bg = '#E2E8F0';
              if (lvl.status === 'studied') bg = '#16A34A';
              else if (lvl.status === 'current') bg = lvlObjTheme.primary;

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

          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
            <span>{academicLevels.length > 0 ? `${t.level} ${academicLevels[0].level}` : t.levelMilestone1}</span>
            <span style={{ color: activeLevelTheme.primary }} className="font-bold">
              {t.levelMilestoneCurrent} ({activeStudent.currentLevel})
            </span>
            <span>
              {academicLevels.length > 0
                ? `${t.level} ${academicLevels[academicLevels.length - 1].level}`
                : t.levelMilestone10}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] sm:text-xs font-semibold">
          <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
            <span>{t.statusStudied} ({completedCount})</span>
          </div>
          <div className="flex items-center gap-1" style={{ color: activeLevelTheme.primary }}>
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: activeLevelTheme.primary }} />
            <span>{t.statusCurrent} (1)</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0" />
            <span>
              {t.statusLocked} ({Math.max(0, academicLevels.length - completedCount - (academicLevels.some((l) => l.status === 'current') ? 1 : 0))})
            </span>
          </div>
        </div>
      </div>

      {/* 3. Vertical Timeline Roadmap with compact gap between cards */}
      <div className="space-y-3">
        {academicLevels.map((lvl) => {
          const isStudied = lvl.status === 'studied';
          const isCurrent = lvl.status === 'current';
          const isLocked = lvl.status === 'locked';
          const lvlTheme = getThemeForLevel(lvl.level as LevelId, lvl.color);

          return (
            <div
              key={lvl.level}
              role="button"
              tabIndex={isLocked ? -1 : 0}
              onClick={() => !isLocked && setSelectedLevel(lvl)}
              onKeyDown={(e) => e.key === 'Enter' && !isLocked && setSelectedLevel(lvl)}
              className={`w-full transition-all flex flex-col justify-between cursor-pointer p-3.5 sm:p-4 rounded-2xl ${
                isCurrent
                  ? 'bg-white dark:bg-slate-850 shadow-sm border-2'
                  : isStudied
                  ? 'bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-emerald-300'
                  : 'bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 opacity-60 cursor-not-allowed'
              }`}
              style={{
                borderColor: isCurrent ? lvlTheme.primary : undefined,
              }}
            >
              <div>
                {/* Level Card Header */}
                <div className="flex items-center justify-between gap-2.5 mb-2">
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    {/* Node Icon */}
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-white shrink-0 font-bold shadow-xs ${
                        isCurrent
                          ? 'ring-2 ring-offset-1'
                          : isStudied
                          ? 'bg-emerald-600'
                          : 'bg-slate-300 dark:bg-slate-700 text-slate-500'
                      }`}
                      style={{
                        backgroundColor: isCurrent ? lvlTheme.primary : isStudied ? '#16A34A' : undefined,
                      }}
                    >
                      {isStudied ? (
                        <CheckCircle2 size={18} strokeWidth={2.5} />
                      ) : isCurrent ? (
                        <Sparkles size={18} />
                      ) : (
                        <Lock size={15} />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                        <span className="text-[11px] font-bold text-slate-400 block">
                          {t.stage} {lvl.level}
                        </span>
                        {lvl.modules && (
                          <span className="text-[11px] font-semibold text-slate-400">
                            • {lvl.modules.length} {language === 'ar' ? 'وحدات معتمدة' : 'units'}
                          </span>
                        )}
                      </div>
                      <h3
                        className={`text-sm sm:text-base font-bold truncate ${
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
                        className="inline-flex items-center rounded-full font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 shadow-2xs whitespace-nowrap select-none px-2.5 py-0.5 gap-1 text-[10.5px] sm:text-xs"
                      >
                        <Award size={12} className="shrink-0" />
                        <span>{t.grade} {lvl.score || 95}%</span>
                      </span>
                    )}

                    {isCurrent && (
                      <span
                        className="inline-flex items-center rounded-full font-bold text-white shadow-2xs whitespace-nowrap select-none px-2.5 py-0.5 text-[10.5px] sm:text-xs animate-pulse"
                        style={{
                          backgroundColor: lvlTheme.primary,
                        }}
                      >
                        {t.statusCurrent} ({lvl.progress !== undefined ? lvl.progress : activeStudent.currentLevelProgress}%)
                      </span>
                    )}

                    {isLocked && (
                      <span
                        className="inline-flex items-center rounded-full font-semibold bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200/50 dark:border-slate-700/50 whitespace-nowrap select-none px-2.5 py-0.5 gap-1 text-[10.5px] sm:text-xs"
                      >
                        <Lock size={11} className="shrink-0" />
                        <span>{t.statusLocked}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Level Stage Description */}
                <p className="text-[11.5px] sm:text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-2.5">
                  {getLevelStage(lvl)}
                </p>

                {/* Progress bar inside Current Level card */}
                {isCurrent && (
                  <div className="mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold">
                      <span className="text-slate-700 dark:text-slate-200">{t.currentProgressRate}</span>
                      <span style={{ color: lvlTheme.primary }} className="font-mono font-bold">
                        {lvl.progress !== undefined ? lvl.progress : activeStudent.currentLevelProgress}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${lvl.progress !== undefined ? lvl.progress : activeStudent.currentLevelProgress}%`,
                          backgroundColor: lvlTheme.primary,
                        }}
                      />
                    </div>
                    {lvl.completedLessonsCount !== undefined && lvl.totalLessonsCount !== undefined && lvl.totalLessonsCount > 0 && (
                      <div className="text-[10.5px] text-slate-400 font-semibold text-right">
                        {lvl.completedLessonsCount} / {lvl.totalLessonsCount} {language === 'ar' ? 'دروس مكتملة' : 'lessons completed'}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Card Footer Action */}
              {!isLocked && (
                <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-300 group">
                  <span className="flex items-center gap-1.5">
                    <BookOpen size={13} />
                    <span>{t.viewCurriculumDetails}</span>
                  </span>
                  {isRTL ? (
                    <ChevronLeft size={14} className="text-slate-400 group-hover:-translate-x-1 transition-transform" />
                  ) : (
                    <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
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
