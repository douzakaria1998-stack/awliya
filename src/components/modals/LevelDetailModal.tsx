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
} from 'lucide-react';
import { AcademicLevel } from '@/types';
import { levelThemes } from '@/lib/themes';
import { useLanguage } from '@/context/LanguageContext';
import { useStudent } from '@/context/StudentContext';
import { downloadCertificateHTML } from '@/lib/certificateGenerator';

interface LevelDetailModalProps {
  level: AcademicLevel | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LevelDetailModal({ level, isOpen, onClose }: LevelDetailModalProps) {
  const [downloaded, setDownloaded] = useState(false);
  const { activeStudent } = useStudent();
  const { t, isRTL, language } = useLanguage();

  if (!isOpen || !level) return null;

  const theme = levelThemes[level.level] || levelThemes[1];

  const handleDownloadCertificate = () => {
    setDownloaded(true);
    downloadCertificateHTML(level, activeStudent?.fullNameAr || 'مريم الدوزكري');
    setTimeout(() => {
      setDownloaded(false);
    }, 2500);
  };

  const levelTitlesEn: Record<number, { name: string; stage: string }> = {
    1: { name: 'Level 1: Quranic Foundation & Reading', stage: 'Nooraniyah Qaida & Foundation Rules' },
    2: { name: 'Level 2: Short Surahs & Fluency', stage: 'Recitation practice & vowel accuracy' },
    3: { name: 'Level 3: Nun Sakinah & Tanween Rules', stage: 'Core Tajweed foundation rules' },
    4: { name: 'Level 4: Juz Amma & Tajweed Mastery', stage: 'Completion of Juz Amma & theoretical applications' },
    5: { name: 'Level 5: Juz Tabarak & Articulation Points', stage: 'Makharij & Sifat detailed training' },
    6: { name: 'Level 6: Raa, Laam & Madd Rules', stage: 'Tafkheem, Tarqeeq, and Madd varieties' },
    7: { name: 'Level 7: Juz Adh-Dhariyat & Al-Ahqaf', stage: 'Advanced memorization with Tadabbur' },
    8: { name: 'Level 8: Mutashabihat & Retention Precision', stage: 'Verbal Mutashabihat mastery' },
    9: { name: 'Level 9: Uthmani Script & Waqf Rules', stage: 'Endings, pauses, and script rules' },
    10: { name: 'Level 10: Complete Khatm & Sanad Grant', stage: 'Continuous connected chain of transmission' },
  };

  const levelTitlesFr: Record<number, { name: string; stage: string }> = {
    1: { name: 'Niveau 1 : Initiation & Lecture Coranique', stage: 'Méthode Nouraniya et bases de lecture' },
    2: { name: 'Niveau 2 : Petites Sourates & Fluidité', stage: 'Pratique de récitation et vocalisation' },
    3: { name: 'Niveau 3 : Règles du Noun Sakin & Tanwin', stage: 'Fondamentaux des règles de Tajweed' },
    4: { name: 'Niveau 4 : Juz Amma & Maîtrise du Tajweed', stage: 'Finalisation du Juz Amma et théorie' },
    5: { name: 'Niveau 5 : Juz Tabarak & Points d’Articulation', stage: 'Makharij et Sifat détaillés' },
    6: { name: 'Niveau 6 : Règles des Raa, Laam & Prolongations', stage: 'Tafkheem, Tarqeeq et types de Madd' },
    7: { name: 'Niveau 7 : Juz Adh-Dhariyat & Al-Ahqaf', stage: 'Mémorisation avancée avec méditation' },
    8: { name: 'Niveau 8 : Mutashabihat & Précision', stage: 'Maîtrise des versets similaires' },
    9: { name: 'Niveau 9 : Graphie Othmane & Arrêts', stage: 'Règles de Waqf et d’écriture' },
    10: { name: 'Niveau 10 : Clôture Complète & Sanad (Ijaza)', stage: 'Chaîne de transmission continue (Ijaza)' },
  };

  const levelName =
    language === 'en' && levelTitlesEn[level.level]
      ? levelTitlesEn[level.level].name
      : language === 'fr' && levelTitlesFr[level.level]
      ? levelTitlesFr[level.level].name
      : level.nameAr;

  const levelStage =
    language === 'en' && levelTitlesEn[level.level]
      ? levelTitlesEn[level.level].stage
      : language === 'fr' && levelTitlesFr[level.level]
      ? levelTitlesFr[level.level].stage
      : level.stageAr;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in select-none">
      {/* Expanded Modal Box (max-w-2xl sm:max-w-3xl) */}
      <div className="relative w-full max-w-2xl sm:max-w-3xl bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
        {/* 1. Modal Header (Generous 28px 32px padding) */}
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

            {/* Close Button (40px x 40px) */}
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

        {/* 2. Modal Body (Spacious 30px 34px padding with 26px gap) */}
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
                  {level.score || 95}%
                </div>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 block font-semibold">
                  {t.honorsDegree}
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

          {/* Subjects & Surahs List */}
          <div>
            <h4
              className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2"
              style={{ marginBottom: '12px' }}
            >
              <BookOpen size={18} className="text-slate-500 shrink-0" />
              <span>{t.syllabusTopics} ({level.subjects.length}):</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {level.subjects.map((subj, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-slate-100 dark:border-slate-800 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 select-none"
                  style={{
                    padding: '14px 20px',
                    minHeight: '52px',
                  }}
                >
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-2xs"
                    style={{
                      backgroundColor:
                        level.status === 'studied'
                          ? '#16A34A'
                          : level.status === 'current'
                          ? theme.primary
                          : '#9CA3AF',
                    }}
                  >
                    {idx + 1}
                  </span>
                  <span className="truncate">{subj}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Units / Modules */}
          {level.modules && level.modules.length > 0 && (
            <div>
              <h4
                className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2"
                style={{ marginBottom: '12px' }}
              >
                <FileCheck size={18} className="text-slate-500 shrink-0" />
                <span>{t.certifiedUnits} ({level.modules.length}):</span>
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {level.modules.map((mod, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-850 text-xs sm:text-sm shadow-2xs select-none"
                    style={{
                      padding: '16px 22px',
                      minHeight: '56px',
                    }}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`w-7 h-7 min-w-[28px] min-h-[28px] rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-2xs ${
                          mod.isCompleted ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700 text-slate-600'
                        }`}
                      >
                        {mod.isCompleted ? <Check size={16} strokeWidth={3} /> : idx + 1}
                      </div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
                        {mod.titleAr}
                      </span>
                    </div>
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
