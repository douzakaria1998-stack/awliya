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

  const handleCreateLevel = (e: React.FormEvent) => {
    e.preventDefault();
    alert(language === 'ar' ? 'تم إنشاء وحفظ المستوى الجديد بنجاح في المنهاج الأكاديمي!' : 'New level created successfully!');
    setIsAddLevelOpen(false);
  };

  return (
    <div className={`w-full pb-10 space-y-6 select-none ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs sm:text-sm font-bold text-slate-400">
            {language === 'ar' ? 'المناهج وخارطة الكفاءات اللغوية' : 'Curriculum & CEFR Framework'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5">
            {language === 'ar' ? 'المسار الأكاديمي والمنهاج (Academic Path)' : 'Academic Path & Curriculum'}
          </h2>
        </div>

        {/* Action: Create Level Button (Admin/Super Admin only) */}
        {currentRole !== 'teacher' && activeTab === 'curriculum' && (
          <button
            type="button"
            onClick={() => setIsAddLevelOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <Plus size={16} />
            <span>{language === 'ar' ? '+ إضافة مستوى جديد (Create Level)' : '+ Create New Level'}</span>
          </button>
        )}
      </div>

      {/* Main Two Tabs Bar (Section 17) */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveTab('curriculum')}
          className={`flex-1 py-3 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'curriculum'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Settings size={16} />
          <span>{language === 'ar' ? 'التبويب 1: هيكل المنهاج والإعدادات (Curriculum / Settings)' : 'Tab 1 — Curriculum / Settings'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('student_progress')}
          className={`flex-1 py-3 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'student_progress'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <TrendingUp size={16} />
          <span>{language === 'ar' ? 'التبويب 2: مصفوفة تقدم الطلاب (Student Progress Matrix)' : 'Tab 2 — Student Progress'}</span>
        </button>
      </div>

      {/* TAB 1: Curriculum / Settings (Section 14, 15, 16) */}
      {activeTab === 'curriculum' && (
        <div className="space-y-6">
          {/* Language Selector (English / French) */}
          <div
            className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-[28px] shadow-xs flex items-center justify-between gap-4"
            style={{ padding: '20px 28px' }}
          >
            <div className="flex items-center gap-2.5">
              <Languages size={20} className="text-indigo-600" />
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                {language === 'ar' ? 'اختر المنهاج اللغوي:' : 'Select Language Curriculum:'}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedCurriculumLanguage('English')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCurriculumLanguage === 'English'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                English Curriculum (CEFR)
              </button>
              <button
                type="button"
                onClick={() => setSelectedCurriculumLanguage('French')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCurriculumLanguage === 'French'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                French Curriculum (DELF)
              </button>
            </div>
          </div>

          {/* Level Cards Selector Bar (A1, A2, B1, B2, C1) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {curricula
              .filter((c) => c.language === selectedCurriculumLanguage)
              .map((lvl) => (
                <div
                  key={lvl.levelNumber}
                  onClick={() => setSelectedLevelNumber(lvl.levelNumber)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    selectedLevelNumber === lvl.levelNumber
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 shadow-xs'
                      : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-black text-lg" style={{ color: lvl.color }}>
                      {lvl.cefrCode}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                      {lvl.units.length} وحدات
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {lvl.nameAr}
                  </div>
                </div>
              ))}
          </div>

          {/* Active Level Detailed Units & Lessons Breakdown (Section 16) */}
          {activeLevel && (
            <div
              className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-[28px] shadow-xs space-y-6"
              style={{ padding: '28px 32px' }}
            >
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md font-mono font-bold text-white text-xs" style={{ backgroundColor: activeLevel.color }}>
                      {activeLevel.cefrCode}
                    </span>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">{activeLevel.nameAr}</h3>
                  </div>
                  <p className="text-xs text-slate-400 font-medium mt-1">{activeLevel.descriptionAr}</p>
                </div>

                <div className="text-xs font-bold text-slate-400">
                  {activeLevel.units.length} {language === 'ar' ? 'وحدات تعليمية معتمدة' : 'Units'}
                </div>
              </div>

              {/* Units List */}
              <div className="space-y-4">
                {activeLevel.units.map((unit) => (
                  <div
                    key={unit.id}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Layers size={18} className="text-indigo-600" />
                        <h4 className="font-black text-sm text-slate-900 dark:text-white">
                          {unit.titleAr} ({unit.titleEn})
                        </h4>
                      </div>
                      <span className="text-xs font-mono font-bold text-purple-600 bg-white dark:bg-slate-900 px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-700">
                        {unit.lessons.length} {language === 'ar' ? 'دروس' : 'lessons'}
                      </span>
                    </div>

                    {/* Lessons Tree (Section 16: Greetings, Introducing Yourself, Exercises, Vocabulary) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {unit.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 shadow-2xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-900 dark:text-white">
                              {lesson.titleAr}
                            </span>
                            {lesson.hasAssessment && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                                اختبار مهارة ✓
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 leading-relaxed">{lesson.contentSummary}</p>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {lesson.vocabulary.map((vocab, vIdx) => (
                              <span
                                key={vIdx}
                                className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-300"
                              >
                                {vocab}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Student Progress Matrix (Section 17-Tab 2 & Section 18) */}
      {activeTab === 'student_progress' && (
        <div
          className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-[28px] shadow-xs space-y-5"
          style={{ padding: '28px 32px' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp size={20} className="text-indigo-600" />
                <span>{language === 'ar' ? 'مصفوفة إنجاز الوحدات للطلاب (Curriculum Progress Matrix)' : 'Student Progress Matrix'}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {currentRole === 'teacher'
                  ? 'عرض تقدم طلاب الأفواج المسندة إليك فقط (Sarah Benali)'
                  : 'متابعة شاملة لتقدم جميع الطلاب عبر الوحدات التعليمية'}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-right">
              <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-400 font-bold">
                <tr>
                  <th className="py-3.5 px-6 text-right">{language === 'ar' ? 'اسم الطالب' : 'Student'}</th>
                  <th className="py-3.5 px-4 text-center">{language === 'ar' ? 'الفوج' : 'Group'}</th>
                  <th className="py-3.5 px-4 text-center">Unit 1 (الوحدة 1)</th>
                  <th className="py-3.5 px-4 text-center">Unit 2 (الوحدة 2)</th>
                  <th className="py-3.5 px-4 text-center">Unit 3 (الوحدة 3)</th>
                  <th className="py-3.5 px-4 text-center">{language === 'ar' ? 'المعدل الإجمالي' : 'Overall'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {visibleStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                      {st.fullNameAr} ({st.fullNameEn})
                    </td>
                    <td className="py-4 px-4 text-center font-semibold text-slate-600 dark:text-slate-400">
                      {st.groupName.split('(')[0].trim()}
                    </td>
                    <td className="py-4 px-4 text-center font-mono font-bold text-emerald-600">
                      {st.overallProgress >= 70 ? '100%' : '80%'}
                    </td>
                    <td className="py-4 px-4 text-center font-mono font-bold text-indigo-600">
                      {st.overallProgress >= 80 ? '100%' : st.overallProgress >= 60 ? '80%' : '50%'}
                    </td>
                    <td className="py-4 px-4 text-center font-mono font-bold text-purple-600">
                      {st.overallProgress >= 90 ? '70%' : '50%'}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="px-3 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/60 font-mono font-black text-purple-600 dark:text-purple-300">
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
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5 animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-black text-lg text-slate-900 dark:text-white">
                {language === 'ar' ? 'إضافة مستوى دراسي جديد (Create Level)' : 'Create New Level'}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddLevelOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateLevel} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">اسم المستوى بالعربية *</label>
                <input
                  type="text"
                  required
                  value={newLevelNameAr}
                  onChange={(e) => setNewLevelNameAr(e.target.value)}
                  placeholder="مثال: المستوى A1 — المبتدئ"
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">رمز المستوى (Level Code) *</label>
                <input
                  type="text"
                  required
                  value={newLevelCode}
                  onChange={(e) => setNewLevelCode(e.target.value)}
                  placeholder="A1, A2, B1, B2, C1"
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">وصف مخرجات التعلم</label>
                <textarea
                  rows={3}
                  value={newLevelDescAr}
                  onChange={(e) => setNewLevelDescAr(e.target.value)}
                  placeholder="اكتساب المفردات الأساسية وتكوين الجمل البسيطة..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">عدد الوحدات (Units)</label>
                  <input
                    type="number"
                    value={newUnitsCount}
                    onChange={(e) => setNewUnitsCount(Number(e.target.value))}
                    min={1}
                    max={20}
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">اللون المميز (Color)</label>
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
                  className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer text-sm"
                >
                  حفظ المستوى في المنهاج
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
