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
      className={`w-full animate-fade-in select-none space-y-6 sm:space-y-8 ${isRTL ? 'text-right' : 'text-left'}`}
      style={{ paddingBottom: '70px' }}
    >
      {/* 1. Screen Header */}
      <div className="flex items-center justify-between gap-3 pt-1 pb-1">
        <div>
          <span className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 block mb-1">
            {language === 'ar' ? `خارطة المسار الأكاديمي (${academicLevels.length} مستويات)` : `${academicLevels.length}-Level Roadmap`}
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.academicPathTitle}
          </h1>
        </div>

        {/* Current Level Pill Badge */}
        <div className="shrink-0">
          <div
            className="inline-flex items-center rounded-full font-black text-xs sm:text-sm shadow-xs select-none px-4 py-2 gap-2 bg-slate-900 text-white dark:bg-slate-800 dark:text-slate-100 border border-slate-700/60"
          >
            <Sparkles size={14} className="text-lime-400 shrink-0" />
            <span className="whitespace-nowrap leading-none">
              {language === 'ar' ? activeLevelTheme.shortNameAr : `${t.level} ${activeStudent.currentLevel}`}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Path Overview Summary Card */}
      <div
        className="bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 shadow-sm p-5 sm:p-6 rounded-3xl space-y-5"
      >
        {/* Student track name and completion status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: activeLevelTheme.primary }}
            />
            <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {t.studentTrack}: <span className="text-slate-600 dark:text-slate-300 font-semibold">{translateTrack(activeStudent.enrolledPathAr, language)}</span>
            </span>
          </div>
          <span className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400">
            {completedCount} / {academicLevels.length} {t.levelsCompleted} ({Math.round((completedCount / (academicLevels.length || 1)) * 100)}%)
          </span>
        </div>

        {/* Progress Timeline Segments */}
        <div className="space-y-2.5">
          <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
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

          <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
            <span>{academicLevels.length > 0 ? `${t.level} ${academicLevels[0].level}` : t.levelMilestone1}</span>
            <span className="text-slate-800 dark:text-slate-200 font-black">
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
        <div className="flex flex-wrap items-center gap-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 text-xs font-bold">
          <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
            <span>{t.statusStudied} ({completedCount})</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: activeLevelTheme.primary }} />
            <span>{t.statusCurrent} (1)</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0" />
            <span>
              {t.statusLocked} ({Math.max(0, academicLevels.length - completedCount - (academicLevels.some((l) => l.status === 'current') ? 1 : 0))})
            </span>
          </div>
        </div>
      </div>

      {/* 3. Vertical Timeline Roadmap with comfortable spacing */}
      <div className="space-y-5 sm:space-y-6">
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
              className={`w-full transition-all flex flex-col justify-between cursor-pointer p-5 sm:p-6 rounded-3xl ${
                isCurrent
                  ? 'bg-white dark:bg-slate-850 shadow-md border-2 border-lime-500/60 dark:border-lime-500/40 ring-1 ring-lime-500/20'
                  : isStudied
                  ? 'bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-emerald-300'
                  : 'bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 opacity-60 cursor-not-allowed'
              }`}
            >
              <div>
                {/* Level Card Header */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Node Icon */}
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 font-bold shadow-xs ${
                        isCurrent
                          ? 'bg-slate-950 dark:bg-slate-900 text-lime-400 border border-lime-500/40 ring-2 ring-lime-500/20'
                          : isStudied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isStudied ? (
                        <CheckCircle2 size={22} strokeWidth={2.5} />
                      ) : isCurrent ? (
                        <Sparkles size={20} />
                      ) : (
                        <Lock size={18} />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="text-xs font-bold text-slate-400 block">
                          {t.stage} {lvl.level}
                        </span>
                        {lvl.modules && (
                          <span className="text-xs font-semibold text-slate-400">
                            • {lvl.modules.length} {language === 'ar' ? 'وحدات معتمدة' : 'units'}
                          </span>
                        )}
                      </div>
                      <h3
                        className={`text-base sm:text-lg font-black truncate ${
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
                        className="inline-flex items-center rounded-full font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 shadow-2xs whitespace-nowrap select-none px-3 py-1 gap-1 text-xs"
                      >
                        <Award size={14} className="shrink-0" />
                        <span>{t.grade} {lvl.score || 95}%</span>
                      </span>
                    )}

                    {isCurrent && (
                      <span
                        className="inline-flex items-center rounded-full font-black bg-slate-950 dark:bg-slate-900 text-lime-400 border border-lime-500/50 shadow-xs whitespace-nowrap select-none px-3.5 py-1 text-xs"
                      >
                        {t.statusCurrent} ({lvl.progress !== undefined ? lvl.progress : activeStudent.currentLevelProgress}%)
                      </span>
                    )}

                    {isLocked && (
                      <span
                        className="inline-flex items-center rounded-full font-semibold bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200/50 dark:border-slate-700/50 whitespace-nowrap select-none px-3 py-1 gap-1 text-xs"
                      >
                        <Lock size={12} className="shrink-0" />
                        <span>{t.statusLocked}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Level Stage Description */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-3">
                  {getLevelStage(lvl)}
                </p>

                {/* Progress bar inside Current Level card */}
                {isCurrent && (
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                      <span className="text-slate-800 dark:text-slate-200">{t.currentProgressRate}:</span>
                      <span className="font-mono font-black text-sm sm:text-base text-lime-600 dark:text-lime-400">
                        {lvl.progress !== undefined ? lvl.progress : activeStudent.currentLevelProgress}%
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${lvl.progress !== undefined ? lvl.progress : activeStudent.currentLevelProgress}%`,
                          backgroundColor: lvlTheme.primary,
                        }}
                      />
                    </div>
                    {lvl.completedLessonsCount !== undefined && lvl.totalLessonsCount !== undefined && lvl.totalLessonsCount > 0 && (
                      <div className="text-xs text-slate-400 font-bold text-right pt-0.5">
                        {lvl.completedLessonsCount} / {lvl.totalLessonsCount} {language === 'ar' ? 'دروس مكتملة' : 'lessons completed'}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Card Footer Action */}
              {!isLocked && (
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 group">
                  <span className="flex items-center gap-2">
                    <BookOpen size={16} />
                    <span>{t.viewCurriculumDetails}</span>
                  </span>
                  {isRTL ? (
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                  ) : (
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
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
