'use client';

import React, { useState } from 'react';
import {
  X,
  GraduationCap,
  CheckCircle2,
  Lock,
  Sparkles,
  BookOpen,
  Award,
  Calendar,
  FileCheck,
  Check,
  ChevronDown,
} from 'lucide-react';
import { AcademicLevel } from '@/types';
import { levelThemes, getThemeForLevel } from '@/lib/themes';
import { LEVEL_TITLES_EN, LEVEL_TITLES_FR } from '@/lib/constants';
import { useLanguage } from '@/context/LanguageContext';
import { useStudent } from '@/context/StudentContext';
import { downloadCertificateHTML } from '@/lib/certificateGenerator';
import { translateSubject } from '@/lib/translations';

interface LevelDetailModalProps {
  level: AcademicLevel | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LevelDetailModal({ level, isOpen, onClose }: LevelDetailModalProps) {
  const [downloaded, setDownloaded] = useState(false);
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>(null);
  const { activeStudent } = useStudent();
  const { t, isRTL, language } = useLanguage();

  if (!isOpen || !level) return null;

  const theme = getThemeForLevel(level.level, level.color);

  const handleDownloadCertificate = () => {
    setDownloaded(true);
    downloadCertificateHTML(level, activeStudent?.fullNameAr || 'Youssef Douzkari', activeStudent);
    setTimeout(() => {
      setDownloaded(false);
    }, 2500);
  };

  const levelName =
    language === 'en'
      ? (level.nameEn || LEVEL_TITLES_EN[level.level]?.name || level.nameAr)
      : language === 'fr'
      ? (LEVEL_TITLES_FR[level.level]?.name || level.nameAr)
      : (level.nameAr || `المستوى ${level.level}`);

  const levelStage =
    language === 'en'
      ? (level.stageEn || LEVEL_TITLES_EN[level.level]?.stage || level.stageAr)
      : language === 'fr'
      ? (LEVEL_TITLES_FR[level.level]?.stage || level.stageAr)
      : (level.stageAr || level.descriptionAr || `المرحلة ${level.level}`);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in select-none">
      {/* Expanded Modal Box */}
      <div className="relative w-full max-w-2xl sm:max-w-3xl bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
        {/* 1. Modal Header */}
        <div
          className="text-white relative overflow-hidden shrink-0"
          style={{
            background:
              level.status === 'locked'
                ? 'linear-gradient(135deg, #64748B, #475569)'
                : level.status === 'studied'
                ? 'linear-gradient(135deg, #16A34A, #15803D)'
                : theme.gradient,
            padding: '28px 32px',
          }}
        >
          {/* Subtle decorative circles */}
          <div className="absolute -left-10 -bottom-10 w-44 h-44 rounded-full bg-white/10 pointer-events-none" />
          <div className="absolute left-20 -top-10 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />

          {/* Top Bar with Badges and Close button */}
          <div className="flex items-center justify-between relative z-10 mb-3">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span
                className="inline-flex items-center rounded-full font-bold bg-white/20 backdrop-blur-md text-white border border-white/25 whitespace-nowrap select-none"
                style={{
                  height: '32px',
                  paddingRight: '14px',
                  paddingLeft: '14px',
                  fontSize: '13px',
                }}
              >
                {t.level} {level.level}
              </span>

              {level.status === 'studied' && (
                <span
                  className="inline-flex items-center rounded-full font-bold bg-white text-emerald-800 shadow-2xs whitespace-nowrap select-none"
                  style={{
                    height: '32px',
                    paddingRight: '14px',
                    paddingLeft: '14px',
                    gap: '6px',
                    fontSize: '13px',
                  }}
                >
                  <CheckCircle2 size={15} className="text-emerald-700 shrink-0" />
                  <span>{t.modalStudiedSuccess}</span>
                </span>
              )}

              {level.status === 'current' && (
                <span
                  className="inline-flex items-center rounded-full font-bold bg-white text-slate-900 shadow-2xs whitespace-nowrap select-none"
                  style={{
                    height: '32px',
                    paddingRight: '14px',
                    paddingLeft: '14px',
                    gap: '6px',
                    fontSize: '13px',
                  }}
                >
                  <Sparkles size={15} className="text-amber-500 shrink-0" />
                  <span>{t.modalCurrentLevel}</span>
                </span>
              )}

              {level.status === 'locked' && (
                <span
                  className="inline-flex items-center rounded-full font-bold bg-white/25 text-white whitespace-nowrap select-none"
                  style={{
                    height: '32px',
                    paddingRight: '14px',
                    paddingLeft: '14px',
                    gap: '6px',
                    fontSize: '13px',
                  }}
                >
                  <Lock size={14} className="shrink-0" />
                  <span>{t.modalLockedLevel}</span>
                </span>
              )}
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Level Title & Stage Subtitle */}
          <h3 className="text-xl sm:text-2xl font-bold leading-snug relative z-10">
            {levelName}
          </h3>
          <p className="text-sm text-white/90 mt-1 relative z-10 font-medium leading-relaxed">
            {levelStage}
          </p>
        </div>

        {/* 2. Modal Body */}
        <div
          className={`overflow-y-auto flex-1 ${isRTL ? 'text-right' : 'text-left'}`}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '26px',
            padding: '30px 34px',
          }}
        >
          {/* Summary / Description */}
          {level.descriptionAr && (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
              {level.descriptionAr}
            </div>
          )}

          {/* Completion Metrics (If Studied) */}
          {level.status === 'studied' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Score Box */}
              <div
                className={`rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/50 flex flex-col justify-between ${isRTL ? 'text-right' : 'text-left'}`}
                style={{
                  padding: '24px 28px',
                  minHeight: '130px',
                }}
              >
                <div className="flex items-center gap-2.5 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-bold" style={{ marginBottom: '8px' }}>
                  <Award size={18} className="shrink-0" />
                  <span>{t.finalPassingScore}</span>
                </div>
                <div className="text-3xl sm:text-4xl font-black text-emerald-800 dark:text-emerald-200 font-mono tracking-tight" style={{ margin: '4px 0 8px 0' }}>
                  {level.score ?? 93}%
                </div>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 block font-semibold">
                  {level.honorsDegree || t.honorsDegree}
                </span>
              </div>

              {/* Date Box */}
              <div
                className={`rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 flex flex-col justify-between ${isRTL ? 'text-right' : 'text-left'}`}
                style={{
                  padding: '24px 28px',
                  minHeight: '130px',
                }}
              >
                <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-bold" style={{ marginBottom: '8px' }}>
                  <Calendar size={18} className="shrink-0" />
                  <span>{t.completionDate}</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 font-mono" style={{ margin: '4px 0 8px 0' }}>
                  {level.completedDate || '2024-06-15'}
                </div>
                <span className="text-xs text-slate-400 font-medium block">
                  {t.academicallyCertified}
                </span>
              </div>
            </div>
          )}



          {/* Units / Modules & Lessons */}
          {level.modules && level.modules.length > 0 && (
            <div>
              <h4
                className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2"
                style={{ marginBottom: '14px' }}
              >
                <FileCheck size={18} className="text-slate-500 shrink-0" />
                <span>
                  {language === 'ar' ? 'الوحدات الدراسية المعتمدة' : 'Certified Units'} ({level.modules.length}):
                </span>
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {level.modules.map((mod, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-2xs select-none transition-all"
                    style={{ padding: '20px 24px' }}
                  >
                    {/* Unit Header */}
                    <div className="flex items-center justify-between gap-4 mb-1">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className={`w-7 h-7 min-w-[28px] min-h-[28px] rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-2xs ${
                            mod.isCompleted ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {mod.isCompleted ? <Check size={16} strokeWidth={3} /> : idx + 1}
                        </div>
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base truncate">
                          {translateSubject(mod.titleAr, language)}
                        </span>
                      </div>
                      <span
                        className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-full shrink-0 select-none flex items-center justify-center"
                        style={{
                          padding: '4px 14px',
                          minHeight: '26px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {mod.lessonsCount} {language === 'ar' ? 'دروس' : 'lessons'}
                      </span>
                    </div>

                    {/* Unit Lessons list (if available) */}
                    {mod.lessons && mod.lessons.length > 0 && (
                      <div
                        className="border-t border-slate-100 dark:border-slate-800/80 space-y-2.5"
                        style={{ marginTop: '16px', paddingTop: '16px' }}
                      >
                        {mod.lessons.map((lesson) => {
                          const isDone = lesson.status === 'completed';
                          const isInProg = lesson.status === 'in_progress';
                          const isExpanded = expandedLessonId === lesson.id;

                          // Extract or resolve targeted skills
                          const resolvedSkills: string[] = (
                            Array.isArray(lesson.vocabulary) && lesson.vocabulary.length > 0
                              ? lesson.vocabulary
                              : typeof (lesson as any).vocabulary === 'string' && (lesson as any).vocabulary.trim()
                              ? (lesson as any).vocabulary.split(',').map((s: string) => s.trim())
                              : [
                                  language === 'ar' ? 'المحادثة والطلاقة الشفهية' : 'Speaking Fluency',
                                  language === 'ar' ? 'الفهم والاستيعاب السمعي' : 'Listening Comprehension',
                                  language === 'ar' ? 'القواعد وبناء الجمل' : 'Sentence Structure & Grammar',
                                ]
                          ).filter(Boolean);

                          return (
                            <div
                              key={lesson.id}
                              className="rounded-2xl border transition-all overflow-hidden bg-slate-50/80 dark:bg-slate-900/60 border-slate-200/70 dark:border-slate-800/70"
                            >
                              {/* Lesson Header Clickable Row */}
                              <div
                                role="button"
                                tabIndex={0}
                                onClick={() => setExpandedLessonId(isExpanded ? null : lesson.id)}
                                onKeyDown={(e) => e.key === 'Enter' && setExpandedLessonId(isExpanded ? null : lesson.id)}
                                className="flex items-center justify-between gap-3.5 text-xs sm:text-sm cursor-pointer hover:bg-slate-100/70 dark:hover:bg-slate-850/80 transition-colors"
                                style={{
                                  padding: '12px 16px',
                                  minHeight: '46px',
                                }}
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <span
                                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                                      isDone
                                        ? 'bg-emerald-500 ring-2 ring-emerald-200 dark:ring-emerald-900'
                                        : isInProg
                                        ? 'bg-amber-500 animate-pulse ring-2 ring-amber-200 dark:ring-amber-900'
                                        : 'bg-slate-300 dark:bg-slate-600'
                                    }`}
                                  />
                                  <span className={`truncate font-bold ${isDone ? 'text-slate-800 dark:text-slate-200' : 'text-slate-700 dark:text-slate-300'}`}>
                                    {lesson.titleAr}
                                  </span>
                                  <ChevronDown
                                    size={15}
                                    className={`text-slate-400 shrink-0 transition-transform duration-200 ${
                                      isExpanded ? 'rotate-180 text-indigo-500' : ''
                                    }`}
                                  />
                                </div>

                                <span
                                  className={`font-bold rounded-lg shrink-0 text-xs flex items-center justify-center ${
                                    isDone
                                      ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60'
                                      : isInProg
                                      ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60'
                                      : 'bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60'
                                  }`}
                                  style={{
                                    padding: '5px 14px',
                                    minHeight: '28px',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {isDone
                                    ? (language === 'ar' ? 'مكتمل' : 'Completed')
                                    : isInProg
                                    ? (language === 'ar' ? 'قيد الدراسة' : 'In Progress')
                                    : (language === 'ar' ? 'لم يبدأ بعد' : 'Pending')}
                                </span>
                              </div>

                              {/* Lesson Expanded Details Section */}
                              {isExpanded && (
                                <div
                                  className="border-t border-slate-200/70 dark:border-slate-800/70 bg-white/95 dark:bg-slate-850/95 space-y-3 animate-fade-in"
                                  style={{ padding: '14px 18px' }}
                                >
                                  {/* 1. Lesson Content Summary */}
                                  <div>
                                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-400 block mb-1">
                                      {language === 'ar' ? 'محتوى وملخص الدرس:' : language === 'fr' ? 'Contenu du cours :' : 'Lesson Content Summary:'}
                                    </span>
                                    <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                                      {lesson.contentSummary ||
                                        (language === 'ar'
                                          ? 'شرح المفاهيم اللغوية والتأسيسية وبناء الجمل وتطبيقات المحادثة والقواعد المقررة مع تدريبات عملية.'
                                          : 'Comprehensive study of foundational language concepts, sentence building, and interactive spoken practice.')}
                                    </p>
                                  </div>

                                  {/* 2. Target Skills & Competencies */}
                                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-400 block mb-1.5">
                                      {language === 'ar'
                                        ? 'المهارات المستهدفة والتركيز التعليمي:'
                                        : language === 'fr'
                                        ? 'Compétences et Objectifs Clés :'
                                        : 'Target Skills & Learning Focus:'}
                                    </span>
                                    <div className="flex flex-wrap gap-1.5">
                                      {resolvedSkills.map((skill, sIdx) => (
                                        <span
                                          key={sIdx}
                                          className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60 text-[11px] font-bold shadow-2xs"
                                          style={{ padding: '4px 12px' }}
                                        >
                                          <Sparkles size={11} className="shrink-0 text-indigo-500" />
                                          <span>{skill}</span>
                                        </span>
                                      ))}
                                    </div>
                                  </div>

                                  {/* 3. Assessment status if present */}
                                  {lesson.hasAssessment && (
                                    <div className="pt-1.5 flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                                      <CheckCircle2 size={14} className="shrink-0" />
                                      <span>
                                        {language === 'ar'
                                          ? 'يتضمن هذا الدرس اختبار كفاءة وتقييم مهارة مكتسبة ✓'
                                          : 'This lesson includes a skill proficiency assessment checkpoint ✓'}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Button: Download Certificate if Studied */}
          {level.status === 'studied' && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleDownloadCertificate}
                className="w-full h-12 sm:h-14 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base shadow-md flex items-center justify-center gap-2.5 transition-all cursor-pointer active:scale-[0.99]"
              >
                {downloaded ? (
                  <>
                    <Check size={18} />
                    <span>{t.certificateReady}</span>
                  </>
                ) : (
                  <>
                    <Award size={18} />
                    <span>{t.downloadCertificate}</span>
                  </>
                )}
              </button>
            </div>
          )}

          {level.status === 'locked' && (
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-xs sm:text-sm text-center font-semibold">
              {t.unlockRequirement}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
