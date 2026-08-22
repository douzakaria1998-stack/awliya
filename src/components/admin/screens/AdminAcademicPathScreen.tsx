'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Settings,
  TrendingUp,
  Plus,
  Layers,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  Lock,
  FileCheck,
  Languages,
  X,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Check,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useLanguage } from '@/context/LanguageContext';
import { CurriculumLevel } from '@/types/admin';

export function AdminAcademicPathScreen() {
  const { curricula, visibleStudents, currentRole, addCurriculumLevel } = useAdmin();
  const { isRTL, language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'curriculum' | 'student_progress'>('curriculum');
  const [selectedCurriculumLanguage, setSelectedCurriculumLanguage] = useState<'English' | 'French'>('English');
  const [selectedLevelNumber, setSelectedLevelNumber] = useState(1);

  // Create Level Modal State
  const [isAddLevelOpen, setIsAddLevelOpen] = useState(false);
  const [modalStep, setModalStep] = useState<'basic' | 'units'>('basic');
  const [newLevelNameAr, setNewLevelNameAr] = useState('');
  const [newLevelNameEn, setNewLevelNameEn] = useState('');
  const [newLevelCode, setNewLevelCode] = useState<'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'>('A1');
  const [newLevelColor, setNewLevelColor] = useState('#3B82F6');
  const [newLevelDescAr, setNewLevelDescAr] = useState('');
  const [newLevelDescEn, setNewLevelDescEn] = useState('');
  const [newUnitsCount, setNewUnitsCount] = useState(3);

  // Units & Lessons configuration state for Step 2
  interface UnitDraft {
    id: string;
    unitNumber: number;
    titleAr: string;
    titleEn: string;
    lessons: {
      id: string;
      lessonNumber: number;
      titleAr: string;
      titleEn: string;
      contentSummary: string;
      vocabString: string;
      hasAssessment: boolean;
    }[];
  }

  const [unitsDraft, setUnitsDraft] = useState<UnitDraft[]>([]);
  const [expandedDraftUnitIds, setExpandedDraftUnitIds] = useState<string[]>([]);

  const toggleDraftUnit = (unitId: string) => {
    setExpandedDraftUnitIds((prev) =>
      prev.includes(unitId) ? prev.filter((id) => id !== unitId) : [...prev, unitId]
    );
  };

  const activeLevel = curricula.find(
    (c) => c.levelNumber === selectedLevelNumber && c.language === selectedCurriculumLanguage
  ) || curricula[0];

  const [expandedUnitId, setExpandedUnitId] = useState<string | null>('unit-01');

  const toggleUnit = (unitId: string) => {
    setExpandedUnitId((prev) => (prev === unitId ? null : unitId));
  };

  // Step 1 Submit: Move to Step 2 (Units & Lessons configuration)
  const handleProceedToUnits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLevelNameAr.trim()) return;

    // Generate initial units if not already configured
    const count = Math.max(1, newUnitsCount);
    const initialUnits: UnitDraft[] = Array.from({ length: count }, (_, uIdx) => {
      const uNum = uIdx + 1;
      return {
        id: `draft-unit-${uNum}-${Date.now()}`,
        unitNumber: uNum,
        titleAr: `الوحدة ${uNum}: محاور التأسيس والمفردات (${newLevelCode})`,
        titleEn: `Unit ${uNum}: Core Vocabulary & Concepts`,
        lessons: [
          {
            id: `draft-lesson-${uNum}-1-${Date.now()}`,
            lessonNumber: 1,
            titleAr: `الدرس 1: القواعد والمفردات التأسيسية`,
            titleEn: `Lesson 1: Foundations & Structure`,
            contentSummary: 'شرح القواعد الأساسية والمفردات المحورية وتطبيقاتها.',
            vocabString: 'Introduction, Grammar, Vocabulary',
            hasAssessment: false,
          },
          {
            id: `draft-lesson-${uNum}-2-${Date.now()}`,
            lessonNumber: 2,
            titleAr: `الدرس 2: التعبير الشفهي والتطبيق العملي`,
            titleEn: `Lesson 2: Speaking & Practice`,
            contentSummary: 'تمارين تطبيقية وتدريبات محادثة تفاعلية.',
            vocabString: 'Conversation, Dialogue, Practice',
            hasAssessment: true,
          },
        ],
      };
    });

    setUnitsDraft(initialUnits);
    setExpandedDraftUnitIds(initialUnits.map((u) => u.id));
    setModalStep('units');
  };

  // Helper actions for Units in Step 2
  const handleAddUnit = () => {
    const nextNum = unitsDraft.length + 1;
    const newUnit: UnitDraft = {
      id: `draft-unit-${nextNum}-${Date.now()}`,
      unitNumber: nextNum,
      titleAr: `الوحدة ${nextNum}: المحور التعليمي الجديد`,
      titleEn: `Unit ${nextNum}: New Topic`,
      lessons: [
        {
          id: `draft-lesson-${nextNum}-1-${Date.now()}`,
          lessonNumber: 1,
          titleAr: `الدرس 1: المفردات والتطبيق`,
          titleEn: `Lesson 1: Vocabulary & Practice`,
          contentSummary: 'شرح المفردات والمفاهيم الأساسية للوحدة.',
          vocabString: 'Topic, Words, Exercises',
          hasAssessment: false,
        },
      ],
    };
    setUnitsDraft((prev) => [...prev, newUnit]);
    setExpandedDraftUnitIds((prev) => [...prev, newUnit.id]);
  };

  const handleRemoveUnit = (unitId: string) => {
    if (unitsDraft.length <= 1) return;
    setUnitsDraft((prev) => prev.filter((u) => u.id !== unitId).map((u, idx) => ({ ...u, unitNumber: idx + 1 })));
  };

  const handleUpdateUnit = (unitId: string, updates: Partial<UnitDraft>) => {
    setUnitsDraft((prev) => prev.map((u) => (u.id === unitId ? { ...u, ...updates } : u)));
  };

  const handleAddLesson = (unitId: string) => {
    setUnitsDraft((prev) =>
      prev.map((unit) => {
        if (unit.id !== unitId) return unit;
        const nextLNum = unit.lessons.length + 1;
        const newLesson = {
          id: `draft-lesson-${unit.unitNumber}-${nextLNum}-${Date.now()}`,
          lessonNumber: nextLNum,
          titleAr: `الدرس ${nextLNum}: عنوان الدرس الجديد`,
          titleEn: `Lesson ${nextLNum}: New Lesson`,
          contentSummary: 'محتوى الدرس والأنشطة المقررة.',
          vocabString: 'New Words, Phrases',
          hasAssessment: false,
        };
        return { ...unit, lessons: [...unit.lessons, newLesson] };
      })
    );
  };

  const handleRemoveLesson = (unitId: string, lessonId: string) => {
    setUnitsDraft((prev) =>
      prev.map((unit) => {
        if (unit.id !== unitId) return unit;
        if (unit.lessons.length <= 1) return unit;
        return {
          ...unit,
          lessons: unit.lessons.filter((l) => l.id !== lessonId).map((l, lIdx) => ({ ...l, lessonNumber: lIdx + 1 })),
        };
      })
    );
  };

  const handleUpdateLesson = (unitId: string, lessonId: string, updates: any) => {
    setUnitsDraft((prev) =>
      prev.map((unit) => {
        if (unit.id !== unitId) return unit;
        return {
          ...unit,
          lessons: unit.lessons.map((l) => (l.id === lessonId ? { ...l, ...updates } : l)),
        };
      })
    );
  };

  // Final Step 2 Save: Add level with all units & lessons to context
  const handleFinalSaveLevel = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedUnits = unitsDraft.map((u, uIdx) => ({
      id: `unit-${Date.now()}-${uIdx + 1}`,
      unitNumber: uIdx + 1,
      titleAr: u.titleAr.trim() || `الوحدة ${uIdx + 1}`,
      titleEn: u.titleEn.trim() || `Unit ${uIdx + 1}`,
      lessons: u.lessons.map((l, lIdx) => ({
        id: `lesson-${Date.now()}-${uIdx + 1}-${lIdx + 1}`,
        lessonNumber: lIdx + 1,
        titleAr: l.titleAr.trim() || `الدرس ${lIdx + 1}`,
        titleEn: l.titleEn.trim() || `Lesson ${lIdx + 1}`,
        contentSummary: l.contentSummary.trim() || 'محتوى الدرس المعتمد.',
        vocabulary: l.vocabString
          .split(',')
          .map((v) => v.trim())
          .filter(Boolean),
        exercisesCount: 4,
        hasAssessment: l.hasAssessment,
      })),
    }));

    const sameLangLevels = curricula.filter((c) => c.language === selectedCurriculumLanguage);
    const newLevelNumber = sameLangLevels.length + 1;

    const newLevel: CurriculumLevel = {
      levelNumber: newLevelNumber,
      cefrCode: newLevelCode,
      nameAr: newLevelNameAr.trim(),
      nameEn: newLevelNameEn.trim() || `${newLevelCode} - Level`,
      descriptionAr: newLevelDescAr.trim() || 'مستوى تعليمي معتمد يركز على الكفاءات اللغوية التأسيسية.',
      descriptionEn: newLevelDescEn.trim() || 'Accredited curriculum level focusing on core competencies.',
      color: newLevelColor || '#3B82F6',
      language: selectedCurriculumLanguage,
      units: formattedUnits,
    };

    addCurriculumLevel(newLevel);
    setSelectedLevelNumber(newLevel.levelNumber);
    setIsAddLevelOpen(false);
    setModalStep('basic');
    setNewLevelNameAr('');
    setNewLevelNameEn('');
    setNewLevelDescAr('');
    setNewLevelDescEn('');

    alert(
      language === 'ar'
        ? `تم بنجاح إنشاء واعتماد المستوى (${newLevel.cefrCode}) مع ${formattedUnits.length} وحدات تعليمية!`
        : `Level ${newLevel.cefrCode} with ${formattedUnits.length} units published successfully!`
    );
  };

  const handleCloseModal = () => {
    setIsAddLevelOpen(false);
    setModalStep('basic');
  };

  return (
    <div className={`w-full select-none ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{ marginBottom: '20px' }}
      >
        <div>
          <span className="text-xs font-bold text-slate-400">
            {language === 'ar' ? 'المناهج وخارطة الكفاءات اللغوية' : 'Curriculum & CEFR Framework'}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
            {language === 'ar' ? 'المسار الأكاديمي والمنهاج (Academic Path)' : 'Academic Path & Curriculum'}
          </h2>
        </div>

        {/* Action: Create Level Button (Admin/Super Admin only) */}
        {currentRole !== 'teacher' && activeTab === 'curriculum' && (
          <button
            type="button"
            onClick={() => setIsAddLevelOpen(true)}
            className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
            style={{ padding: '8px 18px' }}
          >
            <Plus size={16} />
            <span>{language === 'ar' ? 'إضافة مستوى جديد' : 'Create New Level'}</span>
          </button>
        )}
      </div>

      {/* Main Two Tabs Bar (Section 17) */}
      <div
        className="flex items-center gap-2 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-xs"
        style={{
          padding: '6px 8px',
          marginBottom: '20px',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('curriculum')}
          className={`flex-1 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'curriculum'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          style={{ padding: '10px 18px' }}
        >
          <Settings size={16} />
          <span>{language === 'ar' ? 'التبويب 1: هيكل المنهاج والإعدادات (Curriculum / Settings)' : 'Tab 1 — Curriculum / Settings'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('student_progress')}
          className={`flex-1 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'student_progress'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          style={{ padding: '10px 18px' }}
        >
          <TrendingUp size={16} />
          <span>{language === 'ar' ? 'التبويب 2: مصفوفة تقدم الطلاب (Student Progress Matrix)' : 'Tab 2 — Student Progress'}</span>
        </button>
      </div>

      {/* TAB 1: Curriculum / Settings (Section 14, 15, 16) */}
      {activeTab === 'curriculum' && (
        <div className="space-y-5">
          {/* Language Selector (English / French) */}
          <div
            className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            style={{
              padding: '14px 20px',
              marginBottom: '20px',
            }}
          >
            <div className="flex items-center gap-2.5">
              <Languages size={18} className="text-indigo-600 dark:text-indigo-400" />
              <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                {language === 'ar' ? 'اختر المنهاج اللغوي:' : 'Select Language Curriculum:'}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedCurriculumLanguage('English')}
                className={`rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCurriculumLanguage === 'English'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
                style={{ padding: '6px 14px' }}
              >
                English Curriculum (CEFR)
              </button>
              <button
                type="button"
                onClick={() => setSelectedCurriculumLanguage('French')}
                className={`rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCurriculumLanguage === 'French'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
                style={{ padding: '6px 14px' }}
              >
                French Curriculum (DELF)
              </button>
            </div>
          </div>

          {/* Level Cards Selector Bar (A1, A2, B1, B2, C1) */}
          <div
            className="grid grid-cols-2 sm:grid-cols-5 gap-3"
            style={{ marginBottom: '20px' }}
          >
            {curricula
              .filter((c) => c.language === selectedCurriculumLanguage)
              .map((lvl) => (
                <div
                  key={lvl.levelNumber}
                  onClick={() => setSelectedLevelNumber(lvl.levelNumber)}
                  className={`rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 shadow-2xs hover:scale-[1.02] active:scale-[0.98] ${
                    selectedLevelNumber === lvl.levelNumber
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 shadow-xs'
                      : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                  style={{ padding: '12px 16px' }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-lg sm:text-xl" style={{ color: lvl.color }}>
                      {lvl.cefrCode}
                    </span>
                    <span
                      className="text-[11px] font-bold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      style={{ padding: '2px 8px' }}
                    >
                      {lvl.units.length} {language === 'ar' ? 'وحدات' : 'Units'}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 mt-1">
                    {lvl.nameAr}
                  </div>
                </div>
              ))}
          </div>

          {/* Active Level Detailed Units & Lessons Breakdown (Section 16) */}
          {activeLevel && (
            <div
              className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs space-y-6"
              style={{ padding: '20px 24px', marginBottom: '28px' }}
            >
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span
                      className="rounded-lg font-mono font-black text-white text-xs shadow-xs"
                      style={{ backgroundColor: activeLevel.color, padding: '4px 10px' }}
                    >
                      {activeLevel.cefrCode}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">{activeLevel.nameAr}</h3>
                  </div>
                  <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed">{activeLevel.descriptionAr}</p>
                </div>

                <div className="text-xs font-bold text-slate-400 shrink-0">
                  {activeLevel.units.length} {language === 'ar' ? 'وحدات تعليمية معتمدة' : 'Units'}
                </div>
              </div>

              {/* Units List (Accordion Collapsible List) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {activeLevel.units.map((unit) => {
                  const isExpanded = expandedUnitId === unit.id;
                  return (
                    <div
                      key={unit.id}
                      className={`rounded-2xl border transition-all shadow-2xs overflow-hidden ${
                        isExpanded
                          ? 'bg-slate-50/90 dark:bg-slate-900/80 border-indigo-500/40'
                          : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      {/* Clickable Unit Header Row */}
                      <button
                        type="button"
                        onClick={() => toggleUnit(unit.id)}
                        className="w-full flex items-center justify-between gap-4 cursor-pointer text-start transition-colors"
                        style={{ padding: '14px 18px' }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                              isExpanded
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                            }`}
                          >
                            <Layers size={16} />
                          </div>
                          <div>
                            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug">
                              {unit.titleAr}
                            </h4>
                            <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                              {unit.titleEn}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0">
                          <span
                            className="text-[11px] font-mono font-bold text-purple-600 dark:text-purple-400 bg-white dark:bg-slate-850 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs"
                            style={{ padding: '4px 10px' }}
                          >
                            {unit.lessons.length} {language === 'ar' ? 'دروس' : 'lessons'}
                          </span>
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-300 ${
                              isExpanded
                                ? 'rotate-180 bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600'
                                : 'bg-slate-200/60 dark:bg-slate-800 text-slate-500'
                            }`}
                          >
                            <ChevronDown size={15} />
                          </div>
                        </div>
                      </button>

                      {/* Collapsible Lessons List */}
                      {isExpanded && (
                        <div
                          className="border-t border-slate-200/60 dark:border-slate-800/80 space-y-2.5 animate-fade-in"
                          style={{ padding: '14px 18px 18px' }}
                        >
                          {unit.lessons.map((lesson, lIdx) => (
                            <div
                              key={lesson.id}
                              className="bg-white dark:bg-slate-850 rounded-xl border border-slate-200/80 dark:border-slate-750 space-y-2 shadow-2xs hover:border-indigo-500/40 transition-all"
                              style={{ padding: '12px 16px' }}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5">
                                  <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono font-black text-[11px] flex items-center justify-center shrink-0">
                                    {lIdx + 1}
                                  </span>
                                  <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                                    {lesson.titleAr}
                                  </span>
                                </div>
                                {lesson.hasAssessment && (
                                  <span
                                    className="text-[11px] font-bold rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0 self-start sm:self-auto"
                                    style={{ padding: '2px 10px' }}
                                  >
                                    اختبار مهارة ✓
                                  </span>
                                )}
                              </div>

                              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                                {lesson.contentSummary}
                              </p>

                              <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-800/60">
                                <span className="text-[10px] font-bold text-slate-400">
                                  {language === 'ar' ? 'المفردات الرئيسية:' : 'Key Vocabulary:'}
                                </span>
                                {lesson.vocabulary.map((vocab, vIdx) => (
                                  <span
                                    key={vIdx}
                                    className="rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-mono font-medium text-slate-700 dark:text-slate-300"
                                    style={{ padding: '2px 8px' }}
                                  >
                                    {vocab}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Student Progress Matrix (Section 17-Tab 2 & Section 18) */}
      {activeTab === 'student_progress' && (
        <div
          className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs space-y-4 overflow-hidden"
          style={{ marginBottom: '32px' }}
        >
          <div
            className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800"
            style={{ padding: '16px 22px' }}
          >
            <div>
              <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp size={18} className="text-indigo-600 dark:text-indigo-400" />
                <span>{language === 'ar' ? 'مصفوفة إنجاز الوحدات للطلاب (Curriculum Progress Matrix)' : 'Student Progress Matrix'}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {currentRole === 'teacher'
                  ? 'عرض تقدم طلاب الأفواج المسندة إليك فقط (Sarah Benali)'
                  : 'متابعة شاملة لتقدم جميع الطلاب عبر الوحدات التعليمية'}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className={`w-full text-xs ${isRTL ? 'text-right' : 'text-left'}`}>
              <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-400 font-bold">
                <tr>
                  <th
                    className={`font-extrabold text-xs ${isRTL ? 'text-right' : 'text-left'}`}
                    style={{
                      paddingTop: '14px',
                      paddingBottom: '14px',
                      paddingLeft: isRTL ? '20px' : '28px',
                      paddingRight: isRTL ? '28px' : '20px',
                    }}
                  >
                    {language === 'ar' ? 'اسم الطالب' : 'Student'}
                  </th>
                  <th className="py-3.5 px-4 text-center font-extrabold">{language === 'ar' ? 'الفوج' : 'Group'}</th>
                  <th className="py-3.5 px-4 text-center font-extrabold">Unit 1 (الوحدة 1)</th>
                  <th className="py-3.5 px-4 text-center font-extrabold">Unit 2 (الوحدة 2)</th>
                  <th className="py-3.5 px-4 text-center font-extrabold">Unit 3 (الوحدة 3)</th>
                  <th
                    className="font-extrabold text-center text-xs"
                    style={{
                      paddingTop: '14px',
                      paddingBottom: '14px',
                      paddingRight: isRTL ? '28px' : '20px',
                      paddingLeft: isRTL ? '20px' : '28px',
                    }}
                  >
                    {language === 'ar' ? 'المعدل الإجمالي' : 'Overall'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {visibleStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td
                      className="py-3.5 font-bold text-slate-900 dark:text-white"
                      style={{
                        paddingLeft: isRTL ? '20px' : '28px',
                        paddingRight: isRTL ? '28px' : '20px',
                      }}
                    >
                      <div className="font-bold text-xs sm:text-sm">{st.fullNameAr}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">{st.fullNameEn}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-medium text-slate-600 dark:text-slate-400 text-xs">
                      {st.groupName.split('(')[0].trim()}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm">
                      {st.overallProgress >= 70 ? '100%' : '80%'}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-indigo-600 dark:text-indigo-400 text-xs sm:text-sm">
                      {st.overallProgress >= 80 ? '100%' : st.overallProgress >= 60 ? '80%' : '50%'}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-purple-600 dark:text-purple-400 text-xs sm:text-sm">
                      {st.overallProgress >= 90 ? '70%' : '50%'}
                    </td>
                    <td
                      className="py-3.5 text-center"
                      style={{
                        paddingRight: isRTL ? '28px' : '20px',
                        paddingLeft: isRTL ? '20px' : '28px',
                      }}
                    >
                      <span
                        className="rounded-lg bg-purple-50 dark:bg-purple-950/60 font-mono font-black text-purple-600 dark:text-purple-300 text-xs"
                        style={{ padding: '4px 10px' }}
                      >
                        {st.overallProgress}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Create Level (Step 1: Level Details & Step 2: Units & Lessons Configuration) */}
      {isAddLevelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in select-none">
          {/* STEP 1: Basic Level Details */}
          {modalStep === 'basic' && (
            <div
              className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 animate-fade-in-up"
              style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '18px' }}
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
                <div>
                  <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 block">
                    {language === 'ar' ? 'الخطوة 1 من 2: بيانات المستوى الأساسية' : 'Step 1 of 2: Basic Level Info'}
                  </span>
                  <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white mt-0.5">
                    {language === 'ar' ? 'إضافة مستوى دراسي جديد' : 'Create New Level'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 cursor-pointer transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <form
                onSubmit={handleProceedToUnits}
                style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
              >
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 text-xs font-bold mb-1.5">
                    {language === 'ar' ? 'اسم المستوى بالعربية *' : 'Level Name (Arabic) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newLevelNameAr}
                    onChange={(e) => setNewLevelNameAr(e.target.value)}
                    placeholder="مثال: المستوى A1 — المبتدئ والتأسيس"
                    className="w-full h-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-indigo-500 transition-colors"
                    style={{ paddingLeft: '16px', paddingRight: '16px' }}
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 text-xs font-bold mb-1.5">
                    {language === 'ar' ? 'اسم المستوى بالإنجليزية (اختياري)' : 'Level Name (English)'}
                  </label>
                  <input
                    type="text"
                    value={newLevelNameEn}
                    onChange={(e) => setNewLevelNameEn(e.target.value)}
                    placeholder="e.g. Level A1 — Beginner & Foundation"
                    className="w-full h-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-indigo-500 transition-colors"
                    style={{ paddingLeft: '16px', paddingRight: '16px' }}
                    dir="ltr"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 text-xs font-bold mb-1.5">
                      {language === 'ar' ? 'رمز المستوى (CEFR) *' : 'CEFR Code *'}
                    </label>
                    <select
                      value={newLevelCode}
                      onChange={(e) => setNewLevelCode(e.target.value as any)}
                      className="w-full h-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs sm:text-sm font-bold focus:outline-none focus:border-indigo-500 transition-colors"
                      style={{ paddingLeft: '14px', paddingRight: '14px' }}
                    >
                      <option value="A1">A1 — Breakthrough</option>
                      <option value="A2">A2 — Waystage</option>
                      <option value="B1">B1 — Threshold</option>
                      <option value="B2">B2 — Vantage</option>
                      <option value="C1">C1 — Effective Proficiency</option>
                      <option value="C2">C2 — Mastery</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 text-xs font-bold mb-1.5">
                      {language === 'ar' ? 'عدد الوحدات الأولية' : 'Initial Units Count'}
                    </label>
                    <input
                      type="number"
                      value={newUnitsCount}
                      onChange={(e) => setNewUnitsCount(Math.max(1, Number(e.target.value)))}
                      min={1}
                      max={12}
                      className="w-full h-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs sm:text-sm font-bold focus:outline-none focus:border-indigo-500 transition-colors"
                      style={{ paddingLeft: '16px', paddingRight: '16px' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 text-xs font-bold mb-1.5">
                    {language === 'ar' ? 'وصف مخرجات التعلم' : 'Learning Outcomes Description'}
                  </label>
                  <textarea
                    rows={2}
                    value={newLevelDescAr}
                    onChange={(e) => setNewLevelDescAr(e.target.value)}
                    placeholder="اكتساب المفردات الأساسية وتكوين الجمل البسيطة..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-indigo-500 transition-colors resize-none leading-relaxed"
                    style={{ padding: '12px 16px' }}
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 text-xs font-bold mb-1.5">
                    {language === 'ar' ? 'اللون المميز للمستوى (Theme Color)' : 'Level Color'}
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={newLevelColor}
                      onChange={(e) => setNewLevelColor(e.target.value)}
                      className="w-12 h-10 p-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer"
                    />
                    <span className="font-mono text-xs font-bold text-slate-600 dark:text-slate-400">
                      {newLevelColor}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-2"
                  >
                    <span>{language === 'ar' ? 'التالي: إدخال الوحدات والدروس' : 'Next: Configure Units & Lessons'}</span>
                    {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 2: Configure Units and Lessons Popup */}
          {modalStep === 'units' && (
            <div
              className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 animate-fade-in-up flex flex-col max-h-[90vh] overflow-hidden"
            >
              {/* Step 2 Header */}
              <div
                className="bg-slate-900 text-white flex items-center justify-between shrink-0"
                style={{ padding: '18px 26px' }}
              >
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setModalStep('basic')}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                    title={language === 'ar' ? 'رجوع' : 'Back'}
                  >
                    {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2 py-0.5 rounded-md text-white font-mono font-bold text-xs shadow-xs"
                        style={{ backgroundColor: newLevelColor }}
                      >
                        {newLevelCode}
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-white">{newLevelNameAr}</h3>
                    </div>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      {language === 'ar'
                        ? 'الخطوة 2: تحديد مسميات الوحدات وتفاصيل الدروس والمفردات والتقييمات'
                        : 'Step 2: Enter unit names, lessons, vocabulary, and assessments'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Step 2 Action Bar */}
              <div
                className="bg-slate-100 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0"
                style={{ padding: '12px 24px' }}
              >
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                  <Layers size={16} className="text-indigo-600 dark:text-indigo-400" />
                  <span>
                    {language === 'ar'
                      ? `إجمالي الوحدات: ${unitsDraft.length} | إجمالي الدروس: ${unitsDraft.reduce((acc, u) => acc + u.lessons.length, 0)}`
                      : `Total Units: ${unitsDraft.length} | Total Lessons: ${unitsDraft.reduce((acc, u) => acc + u.lessons.length, 0)}`}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleAddUnit}
                  className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  style={{ padding: '7px 16px' }}
                >
                  <Plus size={15} />
                  <span>{language === 'ar' ? 'إضافة وحدة جديدة' : 'Add New Unit'}</span>
                </button>
              </div>

              {/* Step 2 Scrollable Units and Lessons List */}
              <div
                className="overflow-y-auto flex-1"
                style={{
                  padding: '24px 28px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                }}
              >
                {unitsDraft.map((unit, uIdx) => {
                  const isExpanded = expandedDraftUnitIds.includes(unit.id);
                  return (
                    <div
                      key={unit.id}
                      className="bg-slate-50 dark:bg-slate-800/60 rounded-3xl border border-slate-200 dark:border-slate-750 shadow-xs transition-all"
                      style={{
                        padding: isExpanded ? '22px 24px' : '16px 20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: isExpanded ? '20px' : '0px',
                      }}
                    >
                      {/* Unit Header: Clickable Accordion Bar */}
                      <div
                        onClick={() => toggleDraftUnit(unit.id)}
                        className={`flex items-center justify-between transition-all cursor-pointer select-none ${
                          isExpanded
                            ? 'border-b border-slate-200/80 dark:border-slate-700/80 pb-5 mb-2'
                            : 'pb-0 mb-0'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                            {uIdx + 1}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                                {unit.titleAr ? unit.titleAr : (language === 'ar' ? `الوحدة ${uIdx + 1}` : `Unit ${uIdx + 1}`)}
                              </h4>
                              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-[11px] border border-indigo-200/60 dark:border-indigo-800/60">
                                {language === 'ar' ? `${unit.lessons.length} دروس` : `${unit.lessons.length} Lessons`}
                              </span>
                            </div>
                            {!isExpanded && unit.titleEn && (
                              <p className="text-xs font-mono text-slate-400 mt-0.5">
                                {unit.titleEn}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => {
                              if (!isExpanded) toggleDraftUnit(unit.id);
                              handleAddLesson(unit.id);
                            }}
                            className="rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center gap-1.5 border border-indigo-200 dark:border-indigo-800 transition-colors cursor-pointer shadow-2xs"
                            style={{ padding: '7px 14px' }}
                          >
                            <Plus size={14} />
                            <span>{language === 'ar' ? 'إضافة درس' : 'Add Lesson'}</span>
                          </button>

                          {unitsDraft.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveUnit(unit.id)}
                              className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-200 dark:border-rose-900/60 transition-colors cursor-pointer"
                              title={language === 'ar' ? 'حذف الوحدة' : 'Delete Unit'}
                            >
                              <Trash2 size={15} />
                            </button>
                          )}

                          <div
                            onClick={() => toggleDraftUnit(unit.id)}
                            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700/60 text-slate-500 dark:text-slate-300 flex items-center justify-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                          >
                            <ChevronDown
                              size={18}
                              className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Expanded Unit Body */}
                      {isExpanded && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                          {/* Unit Titles Inputs Row */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <div>
                              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                                {language === 'ar' ? 'اسم الوحدة بالعربية *' : 'Unit Title (Arabic) *'}
                              </label>
                              <input
                                type="text"
                                value={unit.titleAr}
                                onChange={(e) => handleUpdateUnit(unit.id, { titleAr: e.target.value })}
                                placeholder={language === 'ar' ? `مثال: الوحدة ${uIdx + 1}: محاور التأسيس` : `Unit ${uIdx + 1} Title (AR)`}
                                className="w-full h-11 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                style={{ paddingLeft: '18px', paddingRight: '18px' }}
                                dir="rtl"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                                {language === 'ar' ? 'اسم الوحدة بالإنجليزية:' : 'Unit Title (English):'}
                              </label>
                              <input
                                type="text"
                                value={unit.titleEn}
                                onChange={(e) => handleUpdateUnit(unit.id, { titleEn: e.target.value })}
                                placeholder={`e.g. Unit ${uIdx + 1}: Core Foundations`}
                                className="w-full h-11 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors"
                                style={{ paddingLeft: '18px', paddingRight: '18px' }}
                                dir="ltr"
                              />
                            </div>
                          </div>

                          {/* Lessons in this Unit */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                                {language === 'ar' ? `دروس ومحتويات الوحدة (${unit.lessons.length} دروس)` : `Unit Lessons (${unit.lessons.length} Lessons)`}
                              </span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                              {unit.lessons.map((lesson, lIdx) => (
                                <div
                                  key={lesson.id}
                                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-750 shadow-2xs hover:border-indigo-300 dark:hover:border-indigo-800 transition-all"
                                  style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}
                                >
                                  {/* Lesson Top Bar: Number, Label, and Delete */}
                                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                                    <div className="flex items-center gap-2">
                                      <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                                        {lIdx + 1}
                                      </span>
                                      <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                                        {language === 'ar' ? `الدرس رقم ${lIdx + 1}` : `Lesson #${lIdx + 1}`}
                                      </span>
                                    </div>

                                    {unit.lessons.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveLesson(unit.id, lesson.id)}
                                        className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/60 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                                        title={language === 'ar' ? 'حذف الدرس' : 'Delete Lesson'}
                                      >
                                        <Trash2 size={13} />
                                      </button>
                                    )}
                                  </div>

                                  {/* Lesson Titles Row */}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-[11px] font-bold text-slate-400 mb-1">
                                        {language === 'ar' ? 'عنوان الدرس (عربي) *' : 'Lesson Title (Arabic) *'}
                                      </label>
                                      <input
                                        type="text"
                                        value={lesson.titleAr}
                                        onChange={(e) => handleUpdateLesson(unit.id, lesson.id, { titleAr: e.target.value })}
                                        placeholder={language === 'ar' ? `عنوان الدرس ${lIdx + 1}` : `Lesson ${lIdx + 1} Title (AR)`}
                                        className="w-full h-10 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                        style={{ paddingLeft: '16px', paddingRight: '16px' }}
                                        dir="rtl"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[11px] font-bold text-slate-400 mb-1">
                                        {language === 'ar' ? 'عنوان الدرس (إنجليزي):' : 'Lesson Title (English):'}
                                      </label>
                                      <input
                                        type="text"
                                        value={lesson.titleEn}
                                        onChange={(e) => handleUpdateLesson(unit.id, lesson.id, { titleEn: e.target.value })}
                                        placeholder={`Lesson ${lIdx + 1} Title (EN)`}
                                        className="w-full h-10 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors"
                                        style={{ paddingLeft: '16px', paddingRight: '16px' }}
                                        dir="ltr"
                                      />
                                    </div>
                                  </div>

                                  {/* Lesson Summary & Vocabulary inputs */}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-[11px] font-bold text-slate-400 mb-1">
                                        {language === 'ar' ? 'ملخص محتوى الدرس:' : 'Lesson Content Summary:'}
                                      </label>
                                      <input
                                        type="text"
                                        value={lesson.contentSummary}
                                        onChange={(e) => handleUpdateLesson(unit.id, lesson.id, { contentSummary: e.target.value })}
                                        placeholder={language === 'ar' ? 'ملخص ومخرجات الدرس...' : 'Lesson content summary...'}
                                        className="w-full h-10 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-600 dark:text-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                                        style={{ paddingLeft: '16px', paddingRight: '16px' }}
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[11px] font-bold text-slate-400 mb-1">
                                        {language === 'ar' ? 'المفردات المفتاحية:' : 'Key Vocabulary (comma-separated):'}
                                      </label>
                                      <input
                                        type="text"
                                        value={lesson.vocabString}
                                        onChange={(e) => handleUpdateLesson(unit.id, lesson.id, { vocabString: e.target.value })}
                                        placeholder={language === 'ar' ? 'المفردات (مفصولة بفواصل)' : 'Key Vocabulary (comma-separated)'}
                                        className="w-full h-10 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-600 dark:text-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                                        style={{ paddingLeft: '16px', paddingRight: '16px' }}
                                        dir="ltr"
                                      />
                                    </div>
                                  </div>

                                  {/* Assessment Checkbox */}
                                  <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800">
                                    <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs font-bold text-slate-600 dark:text-slate-300">
                                      <input
                                        type="checkbox"
                                        checked={lesson.hasAssessment}
                                        onChange={(e) => handleUpdateLesson(unit.id, lesson.id, { hasAssessment: e.target.checked })}
                                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                      />
                                      <span>{language === 'ar' ? 'يتضمن اختبار كفاءة وتقييم مهارة ✓' : 'Includes skill assessment checkpoint ✓'}</span>
                                    </label>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Step 2 Footer */}
              <div
                className="bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0"
                style={{ padding: '16px 26px' }}
              >
                <button
                  type="button"
                  onClick={() => setModalStep('basic')}
                  className="rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  style={{ padding: '9px 20px' }}
                >
                  {isRTL ? <ArrowRight size={15} /> : <ArrowLeft size={15} />}
                  <span>{language === 'ar' ? 'رجوع لتعديل البيانات' : 'Back to Level Info'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleFinalSaveLevel}
                  className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                  style={{ padding: '10px 26px' }}
                >
                  <Check size={16} />
                  <span>{language === 'ar' ? 'حفظ واعتماد المستوى في المنهاج' : 'Save Level to Curriculum'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
