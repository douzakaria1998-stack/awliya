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
      style={{ paddingBottom: '60px' }}
    >
      {/* 1. Screen Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        style={{
          marginTop: '16px',
          marginBottom: '14px',
        }}
      >
        <div>
          <span className="text-xs font-semibold text-slate-400 block mb-0.5">
            {t.tenLevelsRoadmap}
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t.academicPathTitle}
          </h1>
        </div>

        {/* Current Level Pill Badge */}
        <div className="self-start sm:self-auto shrink-0">
          <div
            className="inline-flex items-center rounded-full font-bold text-white shadow-xs select-none"
            style={{
              backgroundColor: theme.primary,
              height: '32px',
              paddingRight: isRTL ? '14px' : '16px',
              paddingLeft: isRTL ? '16px' : '14px',
              gap: '8px',
              fontSize: '12px',
            }}
          >
            <Sparkles size={14} className="shrink-0" />
            <span className="whitespace-nowrap leading-none">
              {t.currentLevelBadge}: {language === 'ar' ? theme.shortNameAr : language === 'fr' ? `Niveau ${activeStudent.currentLevel}` : `Level ${activeStudent.currentLevel}`}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile-only student switcher */}
      <div className="block md:hidden mb-4">
        <StudentSwitcher onOpenAddStudent={onOpenAddStudent} />
      </div>

      {/* 2. Path Overview Summary Card */}
      <div
        className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-2xs"
        style={{
          padding: '16px 20px',
          borderRadius: '18px',
          marginBottom: '18px',
        }}
      >
        {/* Student track name and completion status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3.5">
          <div className="flex items-center gap-2.5">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: theme.primary }}
            />
            <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {t.studentTrack}: <span className="font-mono text-slate-600 dark:text-slate-300 font-semibold">{translateTrack(activeStudent.enrolledPathAr, language)}</span>
            </span>
          </div>
          <span className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400">
            {completedCount} / {academicLevels.length} {t.levelsCompleted} ({Math.round((completedCount / (academicLevels.length || 1)) * 100)}%)
          </span>
        </div>

        {/* Progress Timeline Segments */}
        <div className="mb-4">
          <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex mb-2">
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

          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>{academicLevels.length > 0 ? `${t.level} ${academicLevels[0].level}` : t.levelMilestone1}</span>
            <span style={{ color: theme.primary }} className="font-bold">
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
        <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
            <span>{t.statusStudied} ({completedCount})</span>
          </div>
          <div className="flex items-center gap-1.5" style={{ color: theme.primary }}>
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: theme.primary }} />
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

      {/* 3. Vertical Timeline Roadmap with compact gap between cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
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
                  ? 'bg-white dark:bg-slate-850 shadow-md'
                  : isStudied
                  ? 'bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-emerald-300'
                  : 'bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 opacity-60 cursor-not-allowed'
              }`}
              style={{
                padding: isCurrent ? '16px 20px' : '14px 18px',
                borderRadius: '18px',
                borderWidth: isCurrent ? '2px' : '1px',
                borderColor: isCurrent ? theme.primary : undefined,
              }}
            >
              <div>
                {/* Level Card Header */}
                <div className="flex items-center justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Node Icon */}
                    <div
                      className={`rounded-xl flex items-center justify-center text-white shrink-0 font-bold shadow-xs ${
                        isCurrent
                          ? 'ring-3 ring-offset-1'
                          : isStudied
                          ? 'bg-emerald-600'
                          : 'bg-slate-300 dark:bg-slate-700 text-slate-500'
                      }`}
                      style={{
                        backgroundColor: isCurrent ? theme.primary : isStudied ? '#16A34A' : undefined,
                        width: '38px',
                        height: '38px',
                        minWidth: '38px',
                      }}
                    >
                      {isStudied ? (
                        <CheckCircle2 size={18} strokeWidth={2.5} />
                      ) : isCurrent ? (
                        <Sparkles size={18} />
                      ) : (
                        <Lock size={16} />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
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
                        className={`text-base sm:text-lg font-bold truncate ${
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
                          height: '28px',
                          paddingRight: '12px',
                          paddingLeft: '12px',
                          gap: '5px',
                          fontSize: '11px',
                        }}
                      >
                        <Award size={13} className="shrink-0" />
                        <span>{t.grade} {lvl.score || 95}%</span>
                      </span>
                    )}

                    {isCurrent && (
                      <span
                        className="inline-flex items-center rounded-full font-bold text-white shadow-2xs whitespace-nowrap select-none animate-pulse"
                        style={{
                          backgroundColor: theme.primary,
                          height: '28px',
                          paddingRight: '14px',
                          paddingLeft: '14px',
                          fontSize: '11px',
                        }}
                      >
                        {t.statusCurrent} ({lvl.progress !== undefined ? lvl.progress : activeStudent.currentLevelProgress}%)
                      </span>
                    )}

                    {isLocked && (
                      <span
                        className="inline-flex items-center rounded-full font-semibold bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200/50 dark:border-slate-700/50 whitespace-nowrap select-none"
                        style={{
                          height: '28px',
                          paddingRight: '12px',
                          paddingLeft: '12px',
                          gap: '5px',
                          fontSize: '11px',
                        }}
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
                  <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-700 dark:text-slate-200">{t.currentProgressRate}</span>
                      <span style={{ color: theme.primary }} className="font-mono text-sm sm:text-base font-bold">
                        {lvl.progress !== undefined ? lvl.progress : activeStudent.currentLevelProgress}%
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${lvl.progress !== undefined ? lvl.progress : activeStudent.currentLevelProgress}%`,
                          backgroundColor: theme.primary,
                        }}
                      />
                    </div>
                    {lvl.completedLessonsCount !== undefined && lvl.totalLessonsCount !== undefined && lvl.totalLessonsCount > 0 && (
                      <div className="text-[11px] text-slate-400 font-semibold text-right">
                        {lvl.completedLessonsCount} / {lvl.totalLessonsCount} {language === 'ar' ? 'دروس مكتملة' : 'lessons completed'}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Card Footer Action */}
              {!isLocked && (
                <div className="mt-3.5 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 group">
                  <span className="flex items-center gap-1.5">
                    <BookOpen size={14} />
                    <span>{t.viewCurriculumDetails}</span>
                  </span>
                  {isRTL ? (
                    <ChevronLeft size={16} className="text-slate-400 group-hover:-translate-x-1 transition-transform" />
                  ) : (
                    <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
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
