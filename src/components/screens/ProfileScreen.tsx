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
  Languages,
} from 'lucide-react';
import { useStudent } from '@/context/StudentContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { levelThemes } from '@/lib/themes';
import { LevelId } from '@/types';
import { SHOW_FINANCIALS_TAB, SHOW_ADD_STUDENT_BUTTON } from '@/lib/constants';
import { StudentSwitcher } from '../layout/StudentSwitcher';
import {
  translateTrack,
  translateSchoolLevel,
  translateBranch,
  Language,
} from '@/lib/translations';

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
  const { t, isRTL, language, setLanguage } = useLanguage();

  // Editable parent state
  const [isEditingParent, setIsEditingParent] = useState(false);
  const [parentName, setParentName] = useState(parent.fullNameAr);
  const [parentPhone, setParentPhone] = useState(parent.phone);
  const [parentEmail, setParentEmail] = useState(parent.email);
  const [saveSuccess, setSaveSuccess] = useState(false);

  React.useEffect(() => {
    setParentName(parent.fullNameAr);
    setParentPhone(parent.phone);
    setParentEmail(parent.email);
  }, [parent.fullNameAr, parent.phone, parent.email]);

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
    <div className={`space-y-6 animate-fade-in ${isRTL ? 'text-right' : 'text-left'}`} style={{ paddingBottom: '48px' }}>
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5"
        style={{ marginTop: '28px', marginBottom: '20px' }}
      >
        <div>
          <span className="text-xs sm:text-sm font-bold text-slate-400">
            {language === 'ar' ? 'إدارة الحساب والإعدادات' : language === 'fr' ? 'Gestion du Compte & Préférences' : 'Account Management & Settings'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            {t.profileTitle}
          </h1>
        </div>
      </div>

      {/* Mobile-only student switcher */}
      <div className="block md:hidden">
        <StudentSwitcher onOpenAddStudent={onOpenAddStudent} />
      </div>

      {/* Stacked Layout: All Containers Under Each Other with Clear & Clean Spacing */}
      <div className="flex flex-col" style={{ gap: '48px' }}>
        {/* Module 1: Student Information */}
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
                  {language === 'ar' ? 'بيانات الطالب الأكاديمية (قراءة فقط)' : language === 'fr' ? 'Dossier Académique de l’Élève' : 'Student Academic Profile (Read-Only)'}
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
                {language === 'ar' ? theme.shortNameAr : `${t.level} ${activeStudent.currentLevel}`}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-xs sm:text-sm">
              <div
                className="bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 space-y-2"
                style={{ padding: '22px 28px', borderRadius: '20px' }}
              >
                <span className="text-xs text-slate-400 font-semibold block">
                  {language === 'ar' ? 'الاسم الأول' : language === 'fr' ? 'Prénom' : 'First Name'}
                </span>
                <span className="font-bold text-slate-900 dark:text-white truncate block text-sm">
                  {activeStudent.firstNameAr || activeStudent.fullNameAr.split(' ')[0]}
                </span>
              </div>

              <div
                className="bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 space-y-2"
                style={{ padding: '22px 28px', borderRadius: '20px' }}
              >
                <span className="text-xs text-slate-400 font-semibold block">
                  {language === 'ar' ? 'اللقب / اسم العائلة' : language === 'fr' ? 'Nom de Famille' : 'Last Name'}
                </span>
                <span className="font-bold text-slate-900 dark:text-white truncate block text-sm">
                  {activeStudent.lastNameAr || activeStudent.fullNameAr.split(' ').slice(1).join(' ') || 'Douzkari'}
                </span>
              </div>

              <div
                className="bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 space-y-2"
                style={{ padding: '22px 28px', borderRadius: '20px' }}
              >
                <span className="text-xs text-slate-400 font-semibold block">
                  {language === 'ar' ? 'تاريخ الميلاد' : language === 'fr' ? 'Date de Naissance' : 'Date of Birth'}
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white block text-sm">
                  {activeStudent.birthday || '2016-09-20'}
                </span>
              </div>

              <div
                className="bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 space-y-2"
                style={{ padding: '22px 28px', borderRadius: '20px' }}
              >
                <span className="text-xs text-slate-400 font-semibold block">
                  {language === 'ar' ? 'المستوى المدرسي' : language === 'fr' ? 'Niveau Scolaire' : 'School Grade'}
                </span>
                <span className="font-bold text-slate-900 dark:text-white truncate block text-sm">
                  {translateSchoolLevel(activeStudent.schoolLevelAr, language)}
                </span>
              </div>

              <div
                className="bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 space-y-2"
                style={{ padding: '22px 28px', borderRadius: '20px' }}
              >
                <span className="text-xs text-slate-400 font-semibold block">
                  {language === 'ar' ? 'الرقم الأكاديمي' : language === 'fr' ? 'Identifiant Étudiant' : 'Student ID'}
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white block text-sm">
                  {activeStudent.studentIdNumber}
                </span>
              </div>

              <div
                className="bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 space-y-2"
                style={{ padding: '22px 28px', borderRadius: '20px' }}
              >
                <span className="text-xs text-slate-400 font-semibold block">
                  {t.studentTrack}
                </span>
                <span className="font-bold text-slate-900 dark:text-white truncate block text-sm">
                  {translateTrack(activeStudent.enrolledPathAr, language)}
                </span>
              </div>

              <div
                className="bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 space-y-2 sm:col-span-2"
                style={{ padding: '22px 28px', borderRadius: '20px' }}
              >
                <span className="text-xs text-slate-400 font-semibold block">
                  {language === 'ar' ? 'الفرع والسنة الدراسية' : language === 'fr' ? 'Campus & Année Scolaire' : 'Campus & Academic Year'}
                </span>
                <span className="font-bold text-slate-900 dark:text-white truncate block text-sm">
                  {translateBranch(activeStudent.branchAr, language)} • {activeStudent.academicYearAr}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Module 2: Parent Information */}
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
                  {t.personalInfo}
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
                  <span>{language === 'ar' ? 'تعديل البيانات' : language === 'fr' ? 'Modifier' : 'Edit Profile'}</span>
                </button>
              )}
            </div>

            {saveSuccess && (
              <div className="p-4 mb-5 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs sm:text-sm font-bold flex items-center gap-2">
                <Check size={18} />
                <span>{language === 'ar' ? 'تم حفظ بيانات ولي الأمر بنجاح!' : language === 'fr' ? 'Modifications enregistrées avec succès !' : 'Parent details updated successfully!'}</span>
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
                      {language === 'ar' ? 'اسم ولي الأمر:' : language === 'fr' ? 'Nom du Parent :' : 'Parent Full Name:'}
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
                      {t.phoneNumber}:
                    </label>
                    <input
                      type="tel"
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      className="w-full text-sm font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all"
                      style={{ padding: '14px 20px' }}
                    />
                  </div>

                  <div
                    className="bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800"
                    style={{ padding: '22px 28px', borderRadius: '20px' }}
                  >
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400" style={{ marginBottom: '10px' }}>
                      {t.emailAddress}:
                    </label>
                    <input
                      type="email"
                      value={parentEmail}
                      onChange={(e) => setParentEmail(e.target.value)}
                      className="w-full text-sm font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all"
                      style={{ padding: '14px 20px' }}
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
                    {language === 'ar' ? 'إلغاء' : language === 'fr' ? 'Annuler' : 'Cancel'}
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
                    <span>{language === 'ar' ? 'حفظ التعديلات' : language === 'fr' ? 'Enregistrer' : 'Save Changes'}</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs sm:text-sm">
                <div
                  className="bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 space-y-2"
                  style={{ padding: '22px 28px', borderRadius: '20px' }}
                >
                  <span className="text-xs text-slate-400 font-semibold block">
                    {language === 'ar' ? 'اسم ولي الأمر' : language === 'fr' ? 'Nom du Parent' : 'Parent Name'}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white truncate block text-sm">{parent.fullNameAr}</span>
                </div>
                <div
                  className="bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 space-y-2"
                  style={{ padding: '22px 28px', borderRadius: '20px' }}
                >
                  <span className="text-xs text-slate-400 font-semibold block">{t.phoneNumber}</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white block text-sm" dir="ltr">
                    {parent.phone}
                  </span>
                </div>
                <div
                  className="bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 space-y-2"
                  style={{ padding: '22px 28px', borderRadius: '20px' }}
                >
                  <span className="text-xs text-slate-400 font-semibold block">{t.emailAddress}</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white truncate block text-sm" dir="ltr">
                    {parent.email}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Module 3: Manage Children */}
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
                  {t.registeredChildren} ({students.length})
                </h3>
              </div>
              {SHOW_ADD_STUDENT_BUTTON && (
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
                  <span>{t.addStudent}</span>
                </button>
              )}
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
                              <span>{language === 'ar' ? 'قيد المراجعة والاعتماد' : language === 'fr' ? 'En cours de validation' : 'Pending Approval'}</span>
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
                                {language === 'ar' ? 'النشط حالياً' : language === 'fr' ? 'Actif' : 'Active'}
                              </span>
                            )
                          )}
                        </div>
                        <span className="text-xs text-slate-400 font-medium block truncate">
                          {translateTrack(st.enrolledPathAr, language)}
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
                          {language === 'ar' ? 'بانتظار الاختبار' : language === 'fr' ? 'Test prévu' : 'Awaiting Test'}
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
                          {t.level} {st.currentLevel}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Module 4: Settings & Platform Preferences */}
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
                {t.appSettings}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Language Selection */}
              <div
                className="flex flex-col justify-between bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 gap-4"
                style={{ padding: '22px 28px', borderRadius: '20px' }}
              >
                <div className="flex items-center gap-3">
                  <Languages size={22} className="text-slate-500 shrink-0" />
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {t.languageSelect}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { code: 'ar' as Language, label: 'العربية' },
                    { code: 'en' as Language, label: 'English' },
                    { code: 'fr' as Language, label: 'Français' },
                  ].map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => setLanguage(l.code)}
                      className={`py-2 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                        language === l.code
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dark Mode toggle */}
              <div
                className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 gap-6"
                style={{ padding: '22px 28px', borderRadius: '20px' }}
              >
                <div className="flex items-center gap-3">
                  {isDarkMode ? <Moon size={22} className="text-amber-400 shrink-0" /> : <Sun size={22} className="text-amber-500 shrink-0" />}
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {isDarkMode ? t.darkTheme : t.lightTheme}
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

              {/* Homework alerts */}
              <div
                className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 gap-6"
                style={{ padding: '22px 28px', borderRadius: '20px' }}
              >
                <div className="space-y-1">
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">
                    {language === 'ar' ? 'تنبيهات الواجبات والتصحيح' : language === 'fr' ? 'Alertes de Devoirs' : 'Homework & Grading Alerts'}
                  </span>
                  <span className="text-xs text-slate-400 font-medium block leading-relaxed">
                    {language === 'ar' ? 'إشعار عند طلب المعلم مراجعة الواجب أو رصد درجة' : language === 'fr' ? 'Notification lors de la correction des devoirs' : 'Instant notice when teacher requests revision or grades'}
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

              {/* Attendance alerts */}
              <div
                className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 gap-6"
                style={{ padding: '22px 28px', borderRadius: '20px' }}
              >
                <div className="space-y-1">
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">
                    {language === 'ar' ? 'تنبيهات الحضور والغياب اليومي' : language === 'fr' ? 'Alertes de Présence Quotidienne' : 'Daily Attendance Alerts'}
                  </span>
                  <span className="text-xs text-slate-400 font-medium block leading-relaxed">
                    {language === 'ar' ? 'إشعار فوري عند تسجيل حضور أو غياب الطالب' : language === 'fr' ? 'Notification immédiate lors du pointage' : 'Instant notice for present, late, or absent status'}
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
              {language === 'ar' ? 'الدعم الفني والأكاديمي' : language === 'fr' ? 'Support Pédagogique & Technique' : 'Academic & Technical Support'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              {language === 'ar' ? 'تواصل مباشر مع إدارة الأكاديمية' : language === 'fr' ? 'Contact direct avec la direction My School' : 'Direct contact with My School team'}
            </p>
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
            <span>{language === 'ar' ? 'واتساب الإشراف' : language === 'fr' ? 'WhatsApp Support' : 'WhatsApp Support'}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
