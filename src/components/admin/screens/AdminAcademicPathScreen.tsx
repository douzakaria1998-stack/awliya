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
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useLanguage } from '@/context/LanguageContext';
import { CurriculumLevel } from '@/types/admin';

export function AdminAcademicPathScreen() {
  const { curricula, visibleStudents, currentRole } = useAdmin();
  const { isRTL, language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'curriculum' | 'student_progress'>('curriculum');
  const [selectedCurriculumLanguage, setSelectedCurriculumLanguage] = useState<'English' | 'French'>('English');
  const [selectedLevelNumber, setSelectedLevelNumber] = useState(1);

  // Create Level Modal State
  const [isAddLevelOpen, setIsAddLevelOpen] = useState(false);
  const [newLevelNameAr, setNewLevelNameAr] = useState('');
  const [newLevelNameEn, setNewLevelNameEn] = useState('');
  const [newLevelCode, setNewLevelCode] = useState('A1');
  const [newLevelColor, setNewLevelColor] = useState('#3B82F6');
  const [newLevelDescAr, setNewLevelDescAr] = useState('');
  const [newUnitsCount, setNewUnitsCount] = useState(5);

  const activeLevel = curricula.find(
    (c) => c.levelNumber === selectedLevelNumber && c.language === selectedCurriculumLanguage
  ) || curricula[0];

  const [expandedUnitId, setExpandedUnitId] = useState<string | null>('unit-01');

  const toggleUnit = (unitId: string) => {
    setExpandedUnitId((prev) => (prev === unitId ? null : unitId));
  };

  const handleCreateLevel = (e: React.FormEvent) => {
    e.preventDefault();
    alert(language === 'ar' ? 'تم إنشاء وحفظ المستوى الجديد بنجاح في المنهاج الأكاديمي!' : 'New level created successfully!');
    setIsAddLevelOpen(false);
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

      {/* Modal: Create Level (Section 15) */}
      {isAddLevelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 animate-fade-in-up"
            style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '18px' }}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
              <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white">
                {language === 'ar' ? 'إضافة مستوى دراسي جديد (Create Level)' : 'Create New Level'}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddLevelOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 cursor-pointer transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form
              onSubmit={handleCreateLevel}
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
                  placeholder="مثال: المستوى A1 — المبتدئ"
                  className="w-full h-10 px-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 text-xs font-bold mb-1.5">
                  {language === 'ar' ? 'رمز المستوى (Level Code) *' : 'Level Code *'}
                </label>
                <input
                  type="text"
                  required
                  value={newLevelCode}
                  onChange={(e) => setNewLevelCode(e.target.value)}
                  placeholder="A1, A2, B1, B2, C1"
                  className="w-full h-10 px-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs sm:text-sm font-bold focus:outline-none focus:border-indigo-500 transition-colors"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 text-xs font-bold mb-1.5">
                  {language === 'ar' ? 'وصف مخرجات التعلم' : 'Learning Outcomes Description'}
                </label>
                <textarea
                  rows={3}
                  value={newLevelDescAr}
                  onChange={(e) => setNewLevelDescAr(e.target.value)}
                  placeholder="اكتساب المفردات الأساسية وتكوين الجمل البسيطة..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-indigo-500 transition-colors resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 text-xs font-bold mb-1.5">
                    {language === 'ar' ? 'عدد الوحدات (Units)' : 'Units Count'}
                  </label>
                  <input
                    type="number"
                    value={newUnitsCount}
                    onChange={(e) => setNewUnitsCount(Number(e.target.value))}
                    min={1}
                    max={20}
                    className="w-full h-10 px-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs sm:text-sm font-bold focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 text-xs font-bold mb-1.5">
                    {language === 'ar' ? 'اللون المميز (Color)' : 'Level Color'}
                  </label>
                  <input
                    type="color"
                    value={newLevelColor}
                    onChange={(e) => setNewLevelColor(e.target.value)}
                    className="w-full h-10 p-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer text-xs sm:text-sm"
                >
                  {language === 'ar' ? 'حفظ المستوى في المنهاج' : 'Save Level to Curriculum'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
