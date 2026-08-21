'use client';

import React, { useState } from 'react';
import {
  User,
  Users,
  GraduationCap,
  Settings,
  Bell,
  Check,
  Phone,
  Mail,
  Edit2,
  Save,
  UserPlus,
  Moon,
  Sun,
  MessageCircle,
  Clock,
} from 'lucide-react';
import { useStudent } from '@/context/StudentContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { levelThemes } from '@/lib/themes';
import { LevelId } from '@/types';
import { SHOW_FINANCIALS_TAB } from '@/lib/constants';
import { StudentSwitcher } from '../layout/StudentSwitcher';

interface ProfileScreenProps {
  onOpenAddStudent: () => void;
}

export function ProfileScreen({ onOpenAddStudent }: ProfileScreenProps) {
  const { parent, updateParent } = useAuth();
  const {
    students,
    activeStudent,
    setActiveStudentId,
    notificationSettings,
    updateNotificationSettings,
  } = useStudent();
  const { theme, isDarkMode, toggleDarkMode } = useTheme();

  // Editable parent state
  const [isEditingParent, setIsEditingParent] = useState(false);
  const [parentName, setParentName] = useState(parent.fullNameAr);
  const [parentPhone, setParentPhone] = useState(parent.phone);
  const [parentEmail, setParentEmail] = useState(parent.email);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveParent = (e: React.FormEvent) => {
    e.preventDefault();
    updateParent({
      fullNameAr: parentName,
      phone: parentPhone,
      email: parentEmail,
    });
    setIsEditingParent(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleToggleNotif = (key: keyof typeof notificationSettings) => {
    updateNotificationSettings({
      [key]: !notificationSettings[key],
    });
  };

  return (
    <div className="space-y-6 animate-fade-in text-right" style={{ paddingBottom: '48px' }}>
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5"
        style={{ marginTop: '28px', marginBottom: '20px' }}
      >
        <div>
          <span className="text-xs sm:text-sm font-bold text-slate-400">إدارة الحساب والإعدادات</span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            الملف الشخصي
          </h1>
        </div>
      </div>

      {/* Mobile-only student switcher */}
      <div className="block md:hidden">
        <StudentSwitcher onOpenAddStudent={onOpenAddStudent} />
      </div>

      {/* Stacked Layout: All Containers Under Each Other with Clear & Clean Spacing */}
      <div className="flex flex-col" style={{ gap: '48px' }}>
        {/* Module 1: بيانات الطالب (Student Information - Full Width) */}
        <div
          className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-xs"
          style={{
            padding: '40px 48px',
            borderRadius: '32px',
          }}
        >
          <div>
            <div
              className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800"
              style={{ paddingBottom: '24px', marginBottom: '32px' }}
            >
              <div className="flex items-center gap-3">
                <GraduationCap size={26} className="text-slate-500 shrink-0" />
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  بيانات الطالب الأكاديمية (قراءة فقط)
                </h3>
              </div>
              <span
                className="inline-flex items-center justify-center rounded-full text-xs sm:text-sm font-black text-white shadow-2xs select-none"
                style={{
                  backgroundColor: theme.primary,
                  height: '36px',
                  paddingRight: '20px',
                  paddingLeft: '20px',
                }}
              >
                {theme.shortNameAr}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-xs sm:text-sm">
              <div
                className="bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 space-y-2"
                style={{ padding: '22px 28px', borderRadius: '20px' }}
              >
                <span className="text-xs text-slate-400 font-semibold block">الاسم الأول</span>
                <span className="font-bold text-slate-900 dark:text-white truncate block text-sm">
                  {activeStudent.firstNameAr || activeStudent.fullNameAr.split(' ')[0]}
                </span>
              </div>

              <div
                className="bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 space-y-2"
                style={{ padding: '22px 28px', borderRadius: '20px' }}
              >
                <span className="text-xs text-slate-400 font-semibold block">اللقب / اسم العائلة</span>
                <span className="font-bold text-slate-900 dark:text-white truncate block text-sm">
                  {activeStudent.lastNameAr || activeStudent.fullNameAr.split(' ').slice(1).join(' ') || 'الدوزكري'}
                </span>
              </div>

              <div
                className="bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 space-y-2"
                style={{ padding: '22px 28px', borderRadius: '20px' }}
              >
                <span className="text-xs text-slate-400 font-semibold block">تاريخ الميلاد</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white block text-sm">
                  {activeStudent.birthday || '2016-09-20'}
                </span>
              </div>

              <div
                className="bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 space-y-2"
                style={{ padding: '22px 28px', borderRadius: '20px' }}
              >
                <span className="text-xs text-slate-400 font-semibold block">المستوى المدرسي</span>
                <span className="font-bold text-slate-900 dark:text-white truncate block text-sm">
                  {activeStudent.schoolLevelAr || 'المرحلة الابتدائية'}
                </span>
              </div>

              <div
                className="bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 space-y-2"
                style={{ padding: '22px 28px', borderRadius: '20px' }}
              >
                <span className="text-xs text-slate-400 font-semibold block">الرقم الأكاديمي</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white block text-sm">
                  {activeStudent.studentIdNumber}
                </span>
              </div>

              <div
                className="bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 space-y-2"
                style={{ padding: '22px 28px', borderRadius: '20px' }}
              >
                <span className="text-xs text-slate-400 font-semibold block">المسار الأكاديمي</span>
                <span className="font-bold text-slate-900 dark:text-white truncate block text-sm">
                  {activeStudent.enrolledPathAr}
                </span>
              </div>

              <div
                className="bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 space-y-2 sm:col-span-2"
                style={{ padding: '22px 28px', borderRadius: '20px' }}
              >
                <span className="text-xs text-slate-400 font-semibold block">الفرع والسنة الدراسية</span>
                <span className="font-bold text-slate-900 dark:text-white truncate block text-sm">
                  {activeStudent.branchAr} • {activeStudent.academicYearAr}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Module 2: بيانات ولي الأمر (Parent Information - Full Width) */}
        <div
          className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-xs"
          style={{
            padding: '40px 48px',
            borderRadius: '32px',
          }}
        >
          <div>
            <div
              className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800"
              style={{ paddingBottom: '24px', marginBottom: '32px' }}
            >
              <div className="flex items-center gap-3">
                <User size={26} className="text-slate-500 shrink-0" />
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  بيانات ولي الأمر (قابلة للتعديل)
                </h3>
              </div>

              {!isEditingParent && (
                <button
                  type="button"
                  onClick={() => setIsEditingParent(true)}
                  className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                  style={{ padding: '8px 18px', minHeight: '38px' }}
                >
                  <Edit2 size={14} />
                  <span>تعديل البيانات</span>
                </button>
              )}
            </div>

            {saveSuccess && (
              <div className="p-4 mb-5 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs sm:text-sm font-bold flex items-center gap-2">
                <Check size={18} />
                <span>تم حفظ بيانات ولي الأمر بنجاح!</span>
              </div>
            )}

            {isEditingParent ? (
              <form onSubmit={handleSaveParent} className="space-y-6" style={{ marginTop: '8px' }}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div
                    className="bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800"
                    style={{ padding: '22px 28px', borderRadius: '20px' }}
                  >
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400" style={{ marginBottom: '10px' }}>
                      اسم ولي الأمر:
                    </label>
                    <input
                      type="text"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      className="w-full text-sm font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all"
                      style={{ padding: '14px 20px' }}
                    />
                  </div>

                  <div
                    className="bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800"
                    style={{ padding: '22px 28px', borderRadius: '20px' }}
                  >
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400" style={{ marginBottom: '10px' }}>
                      رقم الهاتف / الجوال:
                    </label>
                    <input
                      type="tel"
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      className="w-full text-sm font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all"
                      style={{ padding: '14px 20px', direction: 'rtl', textAlign: 'right' }}
                    />
                  </div>

                  <div
                    className="bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800"
                    style={{ padding: '22px 28px', borderRadius: '20px' }}
                  >
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400" style={{ marginBottom: '10px' }}>
                      البريد الإلكتروني:
                    </label>
                    <input
                      type="email"
                      value={parentEmail}
                      onChange={(e) => setParentEmail(e.target.value)}
                      className="w-full text-sm font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all"
                      style={{ padding: '14px 20px', direction: 'rtl', textAlign: 'right' }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4" style={{ marginTop: '24px' }}>
                  <button
                    type="button"
                    onClick={() => setIsEditingParent(false)}
                    className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm cursor-pointer transition-colors flex items-center justify-center"
                    style={{
                      padding: '14px 28px',
                      borderRadius: '16px',
                      minHeight: '48px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="font-bold text-sm text-white shadow-xs flex items-center justify-center gap-2.5 cursor-pointer transition-all hover:opacity-90 active:scale-98"
                    style={{
                      backgroundColor: theme.primary,
                      padding: '14px 32px',
                      borderRadius: '16px',
                      minHeight: '48px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Save size={18} className="shrink-0" />
                    <span>حفظ التعديلات</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs sm:text-sm">
                <div
                  className="bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 space-y-2"
                  style={{ padding: '22px 28px', borderRadius: '20px' }}
                >
                  <span className="text-xs text-slate-400 font-semibold block">اسم ولي الأمر</span>
                  <span className="font-bold text-slate-900 dark:text-white truncate block text-sm">{parent.fullNameAr}</span>
                </div>
                <div
                  className="bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 space-y-2"
                  style={{ padding: '22px 28px', borderRadius: '20px' }}
                >
                  <span className="text-xs text-slate-400 font-semibold block">رقم الجوال</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white block text-sm" dir="ltr">
                    {parent.phone}
                  </span>
                </div>
                <div
                  className="bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 space-y-2"
                  style={{ padding: '22px 28px', borderRadius: '20px' }}
                >
                  <span className="text-xs text-slate-400 font-semibold block">البريد الإلكتروني</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white truncate block text-sm" dir="ltr">
                    {parent.email}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Module 3: إدارة الأبناء (Manage All Children - Full Width) */}
        <div
          className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-xs"
          style={{
            padding: '40px 48px',
            borderRadius: '32px',
          }}
        >
          <div>
            <div
              className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800"
              style={{ paddingBottom: '24px', marginBottom: '32px' }}
            >
              <div className="flex items-center gap-3">
                <Users size={26} className="text-slate-500 shrink-0" />
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  إدارة الأبناء المربوطين بالحساب ({students.length})
                </h3>
              </div>
              <button
                type="button"
                onClick={onOpenAddStudent}
                className="font-bold text-xs sm:text-sm text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800/80 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 cursor-pointer transition-all shadow-2xs flex items-center justify-center gap-2"
                style={{
                  padding: '8px 20px',
                  borderRadius: '14px',
                  minHeight: '38px',
                  whiteSpace: 'nowrap',
                }}
              >
                <UserPlus size={16} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>إضافة طالب</span>
              </button>
            </div>

            <div className="space-y-4">
              {students.map((st) => {
                const stTheme = levelThemes[st.currentLevel as LevelId] || levelThemes[1];
                const isSelected = st.id === activeStudent.id;

                return (
                  <div
                    key={st.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setActiveStudentId(st.id)}
                    className={`border flex items-center justify-between gap-6 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-50 dark:bg-slate-800/80 shadow-xs'
                        : 'border-slate-200/80 dark:border-slate-800 hover:bg-slate-50/60 dark:hover:bg-slate-800/50'
                    }`}
                    style={{
                      padding: '22px 28px',
                      borderRadius: '20px',
                      borderWidth: isSelected ? '2px' : '1px',
                      borderColor: isSelected ? stTheme.primary : undefined,
                    }}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0 shadow-2xs"
                        style={{ background: stTheme.gradient }}
                      >
                        {st.nicknameAr ? st.nicknameAr[0] : st.fullNameAr[0]}
                      </div>
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white block truncate">
                            {st.fullNameAr}
                          </span>
                          {st.status === 'pending' ? (
                            <span
                              className="inline-flex items-center gap-1.5 rounded-full text-xs font-black bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 select-none whitespace-nowrap shadow-2xs"
                              style={{
                                paddingRight: '14px',
                                paddingLeft: '14px',
                                paddingTop: '4px',
                                paddingBottom: '4px',
                                height: '26px',
                                lineHeight: '1',
                              }}
                            >
                              <Clock size={12} className="shrink-0" />
                              <span>قيد المراجعة والاعتماد</span>
                            </span>
                          ) : (
                            isSelected && (
                              <span
                                className="inline-flex items-center justify-center rounded-full text-xs font-black bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 select-none whitespace-nowrap shadow-2xs"
                                style={{
                                  paddingRight: '14px',
                                  paddingLeft: '14px',
                                  paddingTop: '4px',
                                  paddingBottom: '4px',
                                  height: '26px',
                                  lineHeight: '1',
                                }}
                              >
                                النشط حالياً
                              </span>
                            )
                          )}
                        </div>
                        <span className="text-xs text-slate-400 font-medium block truncate">
                          {st.enrolledPathAr}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {st.status === 'pending' ? (
                        <span
                          className="inline-flex items-center rounded-full text-xs font-black text-white bg-amber-500 shadow-2xs select-none"
                          style={{
                            height: '32px',
                            paddingRight: '16px',
                            paddingLeft: '16px',
                          }}
                        >
                          بانتظار الاختبار
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center rounded-full text-xs font-black text-white shadow-2xs select-none"
                          style={{
                            backgroundColor: stTheme.primary,
                            height: '32px',
                            paddingRight: '16px',
                            paddingLeft: '16px',
                          }}
                        >
                          المستوى {st.currentLevel}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Module 4: الإعدادات والإشعارات (Settings & Notification Toggles - Full Width) */}
        <div
          className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-xs"
          style={{
            padding: '40px 48px',
            borderRadius: '32px',
          }}
        >
          <div>
            <div
              className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800"
              style={{ paddingBottom: '24px', marginBottom: '32px' }}
            >
              <Settings size={26} className="text-slate-500 shrink-0" />
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                الإعدادات وتفضيلات التنبيهات
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Homework alerts */}
              <div
                className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 gap-6"
                style={{ padding: '22px 28px', borderRadius: '20px' }}
              >
                <div className="space-y-1">
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">
                    تنبيهات الواجبات والتصحيح
                  </span>
                  <span className="text-xs text-slate-400 font-medium block leading-relaxed">
                    إشعار عند طلب المعلم مراجعة الواجب أو رصد درجة
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={notificationSettings.homework}
                    onChange={() => handleToggleNotif('homework')}
                    className="sr-only peer"
                  />
                  <div
                    className="w-12 h-6.5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:right-[3px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                    style={{
                      backgroundColor: notificationSettings.homework ? theme.primary : undefined,
                    }}
                  />
                </label>
              </div>

              {/* Payment alerts (Shown only when financials feature is enabled) */}
              {SHOW_FINANCIALS_TAB && (
                <div
                  className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 gap-6"
                  style={{ padding: '22px 28px', borderRadius: '20px' }}
                >
                  <div className="space-y-1">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">
                      تنبيهات الرسوم والدفع
                    </span>
                    <span className="text-xs text-slate-400 font-medium block leading-relaxed">
                      تذكير بمواعيد الاستحقاق وفواتير الاشتراك
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={notificationSettings.payments}
                      onChange={() => handleToggleNotif('payments')}
                      className="sr-only peer"
                    />
                    <div
                      className="w-12 h-6.5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:right-[3px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                      style={{
                        backgroundColor: notificationSettings.payments ? theme.primary : undefined,
                      }}
                    />
                  </label>
                </div>
              )}

              {/* Attendance alerts */}
              <div
                className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 gap-6"
                style={{ padding: '22px 28px', borderRadius: '20px' }}
              >
                <div className="space-y-1">
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">
                    تنبيهات الحضور والغياب اليومي
                  </span>
                  <span className="text-xs text-slate-400 font-medium block leading-relaxed">
                    إشعار فوري عند تسجيل حضور أو غياب الطالب
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={notificationSettings.attendance}
                    onChange={() => handleToggleNotif('attendance')}
                    className="sr-only peer"
                  />
                  <div
                    className="w-12 h-6.5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:right-[3px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                    style={{
                      backgroundColor: notificationSettings.attendance ? theme.primary : undefined,
                    }}
                  />
                </label>
              </div>

              {/* Dark Mode toggle */}
              <div
                className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 gap-6"
                style={{ padding: '22px 28px', borderRadius: '20px' }}
              >
                <div className="flex items-center gap-3">
                  {isDarkMode ? <Moon size={22} className="text-amber-400 shrink-0" /> : <Sun size={22} className="text-amber-500 shrink-0" />}
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    الوضع الداكن (Dark Mode)
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={isDarkMode}
                    onChange={toggleDarkMode}
                    className="sr-only peer"
                  />
                  <div
                    className="w-12 h-6.5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:right-[3px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                    style={{
                      backgroundColor: isDarkMode ? theme.primary : undefined,
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div
          className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between gap-6 flex-wrap"
          style={{
            padding: '36px 48px',
            borderRadius: '32px',
          }}
        >
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              الدعم الفني والأكاديمي
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">تواصل مباشر مع إدارة الحلقات</p>
          </div>
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noreferrer"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-xs transition-all hover:opacity-95 active:scale-98 shrink-0"
            style={{
              padding: '14px 28px',
              borderRadius: '16px',
              minHeight: '48px',
              whiteSpace: 'nowrap',
            }}
          >
            <MessageCircle size={20} className="shrink-0" />
            <span>واتساب الإشراف</span>
          </a>
        </div>
      </div>
    </div>
  );
}
