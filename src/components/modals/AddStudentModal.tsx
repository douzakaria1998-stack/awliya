'use client';

import React, { useState } from 'react';
import { X, UserPlus, Sparkles, Check, GraduationCap, Calendar, Clock, Send, CheckCircle2, PhoneCall } from 'lucide-react';
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

  const [firstNameAr, setFirstNameAr] = useState('');
  const [lastNameAr, setLastNameAr] = useState('');
  const [birthday, setBirthday] = useState('2016-05-15');
  const [schoolLevelAr, setSchoolLevelAr] = useState('السنة الثالثة ابتدائي');
  const [enrolledPathAr, setEnrolledPathAr] = useState('مسار اللغة الإنجليزية المكثف (English Language Path)');
  const [timingOption, setTimingOption] = useState<'weekdays' | 'weekend'>('weekdays');
  const [branchAr, setBranchAr] = useState('فرع الروضة - الرياض');
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    fullName: string;
    track: string;
    timing: string;
    branch: string;
  } | null>(null);

  if (!isOpen) return null;

  const currentSelectedTheme = levelThemes[1];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstNameAr.trim() || !lastNameAr.trim()) return;

    const full = `${firstNameAr.trim()} ${lastNameAr.trim()}`;
    const timingStr = timingOption === 'weekdays' ? 'خلال أيام الأسبوع (Weekdays)' : 'نهاية الأسبوع (Weekend)';

    addStudent({
      fullNameAr: full,
      firstNameAr: firstNameAr.trim(),
      lastNameAr: lastNameAr.trim(),
      birthday,
      schoolLevelAr,
      timingAr: timingStr,
      nicknameAr: firstNameAr.trim(),
      enrolledPathAr,
      currentLevel: 1,
      branchAr,
    });

    setSubmittedData({
      fullName: full,
      track: enrolledPathAr,
      timing: timingStr,
      branch: branchAr,
    });

    setIsSuccess(true);
  };

  const handleCloseAndReset = () => {
    setIsSuccess(false);
    setSubmittedData(null);
    setFirstNameAr('');
    setLastNameAr('');
    setTimingOption('weekdays');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in select-none">
      {/* Modal Box */}
      <div className="relative w-full max-w-2xl sm:max-w-3xl bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
        {/* 2. Form Body or Dedicated Confirmation Popup */}
        {isSuccess ? (
          <div
            className="relative flex flex-col items-center justify-center text-center animate-fade-in overflow-y-auto"
            style={{
              padding: '52px 40px 44px',
            }}
          >
            {/* Absolute close button */}
            <button
              type="button"
              onClick={handleCloseAndReset}
              className="absolute top-6 left-6 w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Success Icon Container */}
            <div
              className="w-20 h-20 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs"
              style={{ marginBottom: '22px' }}
            >
              <CheckCircle2 size={44} strokeWidth={2.2} />
            </div>

            {/* Status Badge */}
            <div
              className="inline-flex items-center rounded-full bg-emerald-100/90 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 font-bold text-xs sm:text-sm shadow-2xs select-none"
              style={{
                padding: '8px 24px',
                gap: '10px',
                marginBottom: '20px',
              }}
            >
              <Sparkles size={16} className="shrink-0" />
              <span className="leading-none whitespace-nowrap">{language === 'ar' ? 'تم إرسال الطلب بنجاح' : 'Request Sent Successfully'}</span>
            </div>

            {/* Title */}
            <h3
              className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight"
              style={{ marginBottom: '14px' }}
            >
              {language === 'ar' ? 'تم إرسال طلبكم إلى الإدارة التعليمية' : 'Request Submitted to Administration'}
            </h3>

            {/* Description */}
            <p
              className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-lg leading-relaxed font-medium"
              style={{ marginBottom: '32px' }}
            >
              {language === 'ar'
                ? `تم استلام طلب تسجيل الطالب (${submittedData?.fullName || ''}) بنجاح. سيقوم فريق الإدارة بالتواصل معكم هاتفياً لتحديد موعد اختبار تحديد المستوى وإتمام القبول.`
                : `The registration request for (${submittedData?.fullName || ''}) has been received. Our administration team will contact you to schedule the placement test.`}
            </p>

            {/* Summary Details Card Container with balanced breathing room */}
            <div
              className="w-full max-w-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 rounded-3xl text-right shadow-xs divide-y divide-slate-200/60 dark:divide-slate-800"
              style={{
                padding: '14px 28px',
                marginBottom: '32px',
              }}
            >
              <div
                className="flex items-center justify-between text-xs sm:text-sm gap-4"
                style={{ padding: '9px 0' }}
              >
                <span className="text-slate-400 font-semibold shrink-0">{language === 'ar' ? 'اسم الطالب:' : 'Student Name:'}</span>
                <span className="font-bold text-slate-900 dark:text-white truncate text-sm sm:text-base">{submittedData?.fullName}</span>
              </div>
              <div
                className="flex items-center justify-between text-xs sm:text-sm gap-4"
                style={{ padding: '9px 0' }}
              >
                <span className="text-slate-400 font-semibold shrink-0">{language === 'ar' ? 'المسار التعليمي:' : 'Track:'}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{submittedData?.track}</span>
              </div>
              <div
                className="flex items-center justify-between text-xs sm:text-sm gap-4"
                style={{ padding: '9px 0' }}
              >
                <span className="text-slate-400 font-semibold shrink-0">{language === 'ar' ? 'التوقيت المختار:' : 'Timing:'}</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 truncate">{submittedData?.timing}</span>
              </div>
              <div
                className="flex items-center justify-between text-xs sm:text-sm gap-4"
                style={{ padding: '9px 0' }}
              >
                <span className="text-slate-400 font-semibold shrink-0">{language === 'ar' ? 'الفرع الأكاديمي:' : 'Branch:'}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{submittedData?.branch}</span>
              </div>
            </div>

            {/* Confirmation dismiss button */}
            <button
              type="button"
              onClick={handleCloseAndReset}
              className="w-full max-w-xs rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2.5 active:scale-98"
              style={{
                height: '52px',
              }}
            >
              <Check size={20} strokeWidth={2.5} />
              <span>{language === 'ar' ? 'حسناً، فهمت' : 'Got it, thanks'}</span>
            </button>
          </div>
        ) : (
          <>
            {/* 1. Modal Header (26px 36px padding) */}
            <div
              className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 shrink-0"
              style={{ padding: '26px 36px' }}
            >
              <div className="flex items-center gap-4 min-w-0">
                <div
                  className="w-12 h-12 min-w-[48px] min-h-[48px] rounded-2xl flex items-center justify-center text-white font-bold shadow-xs shrink-0 bg-blue-600"
                >
                  <UserPlus size={24} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                    {t.addStudent}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
                    {language === 'ar' ? 'تقديم طلب تسجيل ابن جديد وحجز موعد اختبار المستوى' : 'Submit student registration and request placement test'}
                  </p>
                </div>
              </div>

              {/* Close button (40px x 40px) */}
              <button
                type="button"
                onClick={handleCloseAndReset}
                className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form
            onSubmit={handleSubmit}
            className={`flex-1 overflow-y-auto ${isRTL ? 'text-right' : 'text-left'}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '28px',
              padding: '34px 38px',
            }}
          >
            {/* Containers 1 & 2: First Name and Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  className="block text-sm font-bold text-slate-800 dark:text-slate-200"
                  style={{ marginBottom: '8px' }}
                >
                  {language === 'ar' ? 'الاسم الأول للطالب' : 'First Name'} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={firstNameAr}
                  onChange={(e) => setFirstNameAr(e.target.value)}
                  placeholder={language === 'ar' ? 'مثال: عبد الله' : 'e.g., Abdullah'}
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
                  {language === 'ar' ? 'اللقب / اسم العائلة' : 'Last Name'} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={lastNameAr}
                  onChange={(e) => setLastNameAr(e.target.value)}
                  placeholder={language === 'ar' ? 'مثال: الدوزكري' : 'e.g., Douzakaria'}
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-sm sm:text-base font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
                  style={{
                    height: '50px',
                    paddingRight: isRTL ? '18px' : '16px',
                    paddingLeft: isRTL ? '16px' : '18px',
                  }}
                />
              </div>
            </div>

            {/* Containers 3 & 4: Birthday and School Level */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  className="block text-sm font-bold text-slate-800 dark:text-slate-200"
                  style={{ marginBottom: '8px' }}
                >
                  {language === 'ar' ? 'تاريخ الميلاد' : 'Birthday'} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-sm sm:text-base font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all font-mono"
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
                  {language === 'ar' ? 'المستوى الدراسي' : 'School Level'} <span className="text-rose-500">*</span>
                </label>
                <select
                  value={schoolLevelAr}
                  onChange={(e) => setSchoolLevelAr(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none"
                  style={{
                    height: '50px',
                    paddingRight: isRTL ? '18px' : '16px',
                    paddingLeft: isRTL ? '16px' : '18px',
                  }}
                >
                  <option value="التحضيري / الروضة">التحضيري / الروضة</option>
                  <option value="السنة الأولى ابتدائي">السنة الأولى ابتدائي</option>
                  <option value="السنة الثانية ابتدائي">السنة الثانية ابتدائي</option>
                  <option value="السنة الثالثة ابتدائي">السنة الثالثة ابتدائي</option>
                  <option value="السنة الرابعة ابتدائي">السنة الرابعة ابتدائي</option>
                  <option value="السنة الخامسة ابتدائي">السنة الخامسة ابتدائي</option>
                  <option value="المرحلة المتوسطة">المرحلة المتوسطة</option>
                  <option value="المرحلة الثانوية">المرحلة الثانوية</option>
                </select>
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
                  <option value="مسار اللغة الإنجليزية المكثف (English Language Path)">
                    مسار اللغة الإنجليزية المكثف (English Language Path)
                  </option>
                  <option value="مسار اللغة الفرنسية المتقدم (French Language Path)">
                    مسار اللغة الفرنسية المتقدم (French Language Path)
                  </option>
                  <option value="المسار المزدوج: إنجليزية وفرنسية (Dual Languages Path)">
                    المسار المزدوج: إنجليزية وفرنسية (Dual Languages Path)
                  </option>
                  <option value="مسار الإعداد للاختبارات الدولية (IELTS & DELF Prep)">
                    مسار الإعداد للاختبارات الدولية (IELTS & DELF Prep)
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

            {/* Container 4: Timing / Preferred Schedule (Weekdays or Weekend) */}
            <div className="space-y-2 pt-1">
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200" style={{ marginBottom: '10px' }}>
                {language === 'ar' ? 'توقيت وأيام الحلقات الدراسية' : 'Timing & Schedule'} <span className="text-rose-500">*</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setTimingOption('weekdays')}
                  className={`rounded-2xl border text-right transition-all cursor-pointer flex items-center justify-between select-none ${
                    timingOption === 'weekdays'
                      ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 shadow-xs ring-2 ring-emerald-500/30'
                      : 'border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                  style={{
                    padding: '16px 20px',
                    minHeight: '74px',
                    gap: '14px',
                  }}
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div
                      className={`w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center shrink-0 transition-colors shadow-2xs ${
                        timingOption === 'weekdays'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Calendar size={20} />
                    </div>
                    <div className="min-w-0 text-right">
                      <div className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                        {language === 'ar' ? 'أيام الأسبوع (Weekdays)' : 'Weekdays'}
                      </div>
                      <div className="text-xs text-slate-400 font-medium mt-0.5 truncate">
                        {language === 'ar' ? 'من الأحد إلى الخميس' : 'Sunday to Thursday'}
                      </div>
                    </div>
                  </div>
                  {timingOption === 'weekdays' && (
                    <div className="w-7 h-7 min-w-[28px] min-h-[28px] rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Check size={16} strokeWidth={3} />
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setTimingOption('weekend')}
                  className={`rounded-2xl border text-right transition-all cursor-pointer flex items-center justify-between select-none ${
                    timingOption === 'weekend'
                      ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 shadow-xs ring-2 ring-emerald-500/30'
                      : 'border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                  style={{
                    padding: '16px 20px',
                    minHeight: '74px',
                    gap: '14px',
                  }}
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div
                      className={`w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center shrink-0 transition-colors shadow-2xs ${
                        timingOption === 'weekend'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Clock size={20} />
                    </div>
                    <div className="min-w-0 text-right">
                      <div className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                        {language === 'ar' ? 'نهاية الأسبوع (Weekend)' : 'Weekend'}
                      </div>
                      <div className="text-xs text-slate-400 font-medium mt-0.5 truncate">
                        {language === 'ar' ? 'الجمعة والسبت' : 'Friday & Saturday'}
                      </div>
                    </div>
                  </div>
                  {timingOption === 'weekend' && (
                    <div className="w-7 h-7 min-w-[28px] min-h-[28px] rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Check size={16} strokeWidth={3} />
                    </div>
                  )}
                </button>
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
                className="rounded-2xl font-bold text-white shadow-md transition-all hover:opacity-95 active:scale-98 flex items-center justify-center cursor-pointer select-none bg-blue-600 hover:bg-blue-700"
                style={{
                  height: '48px',
                  paddingRight: '32px',
                  paddingLeft: '32px',
                  gap: '10px',
                  fontSize: '14px',
                }}
              >
                <Send size={17} strokeWidth={2.2} className="shrink-0" />
                <span className="whitespace-nowrap">{language === 'ar' ? 'إرسال طلب' : 'Send Request'}</span>
              </button>
            </div>
          </form>
        </>
        )}
      </div>
    </div>
  );
}
