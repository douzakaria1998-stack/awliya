'use client';

import React, { useState } from 'react';
import { X, UserPlus, Sparkles, Check, GraduationCap } from 'lucide-react';
import { useStudent } from '@/context/StudentContext';
import { useLanguage } from '@/context/LanguageContext';
import { levelThemes } from '@/lib/themes';
import { LevelId } from '@/types';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddStudentModal({ isOpen, onClose }: AddStudentModalProps) {
  const { addStudent } = useStudent();
  const { t, isRTL, language } = useLanguage();

  const [fullNameAr, setFullNameAr] = useState('');
  const [nicknameAr, setNicknameAr] = useState('');
  const [age, setAge] = useState<number>(9);
  const [enrolledPathAr, setEnrolledPathAr] = useState('مسار حفظ القرآن الكريم وتجويده');
  const [selectedLevel, setSelectedLevel] = useState<LevelId>(1);
  const [branchAr, setBranchAr] = useState('فرع الروضة - الرياض');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const currentSelectedTheme = levelThemes[selectedLevel] || levelThemes[1];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullNameAr.trim()) return;

    addStudent({
      fullNameAr: fullNameAr.trim(),
      nicknameAr: nicknameAr.trim() || fullNameAr.trim().split(' ')[0],
      age: Number(age),
      enrolledPathAr,
      currentLevel: selectedLevel,
      branchAr,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
      // Reset form
      setFullNameAr('');
      setNicknameAr('');
      setSelectedLevel(1);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in select-none">
      {/* Expanded Modal Box (max-w-3xl) */}
      <div className="relative w-full max-w-2xl sm:max-w-3xl bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
        {/* 1. Modal Header (26px 36px padding) */}
        <div
          className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 shrink-0"
          style={{ padding: '26px 36px' }}
        >
          <div className="flex items-center gap-4 min-w-0">
            <div
              className="w-12 h-12 min-w-[48px] min-h-[48px] rounded-2xl flex items-center justify-center text-white font-bold shadow-xs shrink-0"
              style={{ backgroundColor: currentSelectedTheme.primary }}
            >
              <UserPlus size={24} />
            </div>
            <div className="min-w-0">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                {t.addStudent}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
                {language === 'ar' ? 'ربط حساب ابن جديد وتحديد مساره ومستواه الأكاديمي' : 'Link new student and configure level track'}
              </p>
            </div>
          </div>

          {/* Close button (40px x 40px) */}
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* 2. Form Body with generous 28px gaps between container rows */}
        {isSuccess ? (
          <div className="py-16 px-8 flex flex-col items-center justify-center text-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-white mb-5 shadow-lg animate-bounce"
              style={{ backgroundColor: currentSelectedTheme.primary }}
            >
              <Check size={40} strokeWidth={3} />
            </div>
            <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {language === 'ar' ? 'تمت إضافة الطالب بنجاح!' : 'Student Added Successfully!'}
            </h4>
            <p className="text-sm text-slate-400 font-medium">
              {language === 'ar' ? `تم ربط وتفعيل المستوى ${selectedLevel} تلقائياً` : `Level ${selectedLevel} activated`}
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className={`flex-1 overflow-y-auto ${isRTL ? 'text-right' : 'text-left'}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              padding: '30px 36px',
            }}
          >
            {/* Container 1: Student Full Name */}
            <div>
              <label
                className="block text-sm font-bold text-slate-800 dark:text-slate-200"
                style={{ marginBottom: '8px' }}
              >
                {language === 'ar' ? 'اسم الطالب الكامل' : 'Student Full Name'} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={fullNameAr}
                onChange={(e) => setFullNameAr(e.target.value)}
                placeholder={language === 'ar' ? 'مثال: عبد الله أحمد الدوزكري' : 'e.g., Abdullah Ahmed'}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-sm sm:text-base font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
                style={{
                  height: '50px',
                  paddingRight: isRTL ? '18px' : '16px',
                  paddingLeft: isRTL ? '16px' : '18px',
                }}
              />
            </div>

            {/* Container 2: Nickname & Age Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  className="block text-sm font-bold text-slate-800 dark:text-slate-200"
                  style={{ marginBottom: '8px' }}
                >
                  {language === 'ar' ? 'الاسم المختصر / المنادى' : 'Nickname'}
                </label>
                <input
                  type="text"
                  value={nicknameAr}
                  onChange={(e) => setNicknameAr(e.target.value)}
                  placeholder={language === 'ar' ? 'مثال: عبودي' : 'e.g., Aboudi'}
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-sm sm:text-base font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
                  style={{
                    height: '50px',
                    paddingRight: isRTL ? '18px' : '16px',
                    paddingLeft: isRTL ? '16px' : '18px',
                  }}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-bold text-slate-800 dark:text-slate-200"
                  style={{ marginBottom: '8px' }}
                >
                  {language === 'ar' ? 'العمر (سنوات)' : 'Age (Years)'}
                </label>
                <input
                  type="number"
                  min={5}
                  max={25}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-sm sm:text-base font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
                  style={{
                    height: '50px',
                    paddingRight: isRTL ? '18px' : '16px',
                    paddingLeft: isRTL ? '16px' : '18px',
                  }}
                />
              </div>
            </div>

            {/* Container 3: Academic Path & Branch */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  className="block text-sm font-bold text-slate-800 dark:text-slate-200"
                  style={{ marginBottom: '8px' }}
                >
                  {language === 'ar' ? 'المسار الأكاديمي المقيد به' : 'Academic Track'}
                </label>
                <select
                  value={enrolledPathAr}
                  onChange={(e) => setEnrolledPathAr(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none"
                  style={{
                    height: '50px',
                    paddingRight: isRTL ? '18px' : '16px',
                    paddingLeft: isRTL ? '16px' : '18px',
                  }}
                >
                  <option value="مسار حفظ القرآن الكريم وتجويده">
                    مسار حفظ القرآن الكريم وتجويده
                  </option>
                  <option value="مسار التجويد المتقدم والقراءات">
                    مسار التجويد المتقدم والقراءات
                  </option>
                  <option value="مسار التأسيس والقاعدة النورانية">
                    مسار التأسيس والقاعدة النورانية
                  </option>
                  <option value="مسار الحفظ المكثف والإتقان">
                    مسار الحفظ المكثف والإتقان
                  </option>
                </select>
              </div>

              <div>
                <label
                  className="block text-sm font-bold text-slate-800 dark:text-slate-200"
                  style={{ marginBottom: '8px' }}
                >
                  {language === 'ar' ? 'الفرع الأكاديمي' : 'Branch / Campus'}
                </label>
                <select
                  value={branchAr}
                  onChange={(e) => setBranchAr(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none"
                  style={{
                    height: '50px',
                    paddingRight: isRTL ? '18px' : '16px',
                    paddingLeft: isRTL ? '16px' : '18px',
                  }}
                >
                  <option value="فرع الروضة - الرياض">فرع الروضة - الرياض</option>
                  <option value="فرع العليا - الرياض">فرع العليا - الرياض</option>
                  <option value="فرع الياسمين - الرياض">فرع الياسمين - الرياض</option>
                  <option value="فرع النرجس - الرياض">فرع النرجس - الرياض</option>
                  <option value="الفرع الإلكتروني (عن بُعد)">الفرع الإلكتروني (عن بُعد)</option>
                </select>
              </div>
            </div>

            {/* Container 4: Academic Level Picker (1 to 10) */}
            <div className="space-y-3 pt-1">
              <div
                className="flex items-center justify-between gap-4"
                style={{ marginBottom: '16px' }}
              >
                <label className="block text-sm font-bold text-slate-800 dark:text-slate-200">
                  {language === 'ar' ? 'المستوى الأكاديمي الحالي (1 - 10)' : 'Current Academic Level (1 - 10)'}
                </label>
                <span
                  className="inline-flex items-center rounded-full font-bold text-white shadow-xs whitespace-nowrap select-none"
                  style={{
                    backgroundColor: currentSelectedTheme.primary,
                    height: '36px',
                    paddingRight: '22px',
                    paddingLeft: '22px',
                    fontSize: '13px',
                  }}
                >
                  {currentSelectedTheme.shortNameAr}
                </span>
              </div>

              {/* 10 Level Buttons Grid */}
              <div className="grid grid-cols-5 gap-2.5">
                {(Object.keys(levelThemes) as unknown as LevelId[]).map((lvl) => {
                  const numLvl = Number(lvl) as LevelId;
                  const theme = levelThemes[numLvl];
                  const isSelected = selectedLevel === numLvl;

                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSelectedLevel(numLvl)}
                      className={`h-12 rounded-2xl flex flex-col items-center justify-center font-black text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'ring-2 ring-offset-2 text-white scale-[1.03] shadow-md'
                          : 'text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                      style={{
                        backgroundColor: isSelected ? theme.primary : undefined,
                        borderColor: isSelected ? theme.primary : 'transparent',
                      }}
                    >
                      <span className="leading-none">L{numLvl}</span>
                      <span className="text-[10px] font-medium opacity-85 mt-0.5">
                        {language === 'ar' ? `م${numLvl}` : `Lvl ${numLvl}`}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Level Preview Banner */}
              <div
                className="rounded-2xl text-white font-bold flex items-center shadow-xs transition-all select-none"
                style={{
                  background: currentSelectedTheme.gradient,
                  minHeight: '44px',
                  padding: '12px 20px',
                  marginTop: '14px',
                  gap: '12px',
                  fontSize: '14px',
                }}
              >
                <Sparkles size={18} className="shrink-0" />
                <span className="truncate">{currentSelectedTheme.nameAr}</span>
              </div>
            </div>

            {/* Container 5: Action Buttons Footer with explicit padding and gaps */}
            <div
              className="border-t border-slate-100 dark:border-slate-800 flex items-center justify-end"
              style={{
                paddingTop: '24px',
                marginTop: '12px',
                gap: '16px',
              }}
            >
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer select-none"
                style={{
                  height: '48px',
                  minWidth: '120px',
                  paddingRight: '28px',
                  paddingLeft: '28px',
                  fontSize: '14px',
                }}
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>

              <button
                type="submit"
                className="rounded-2xl font-bold text-white shadow-md transition-all hover:opacity-95 active:scale-98 flex items-center justify-center cursor-pointer select-none"
                style={{
                  backgroundColor: currentSelectedTheme.primary,
                  height: '48px',
                  paddingRight: '32px',
                  paddingLeft: '32px',
                  gap: '12px',
                  fontSize: '14px',
                }}
              >
                <Check size={18} strokeWidth={2.5} className="shrink-0" />
                <span className="whitespace-nowrap">{language === 'ar' ? 'حفظ وإضافة الطالب' : 'Save & Add Student'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
