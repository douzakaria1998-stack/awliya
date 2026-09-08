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
import { levelThemes, getThemeForLevel } from '@/lib/themes';
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
  const [parentAddress, setParentAddress] = useState(parent.address || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  React.useEffect(() => {
    setParentName(parent.fullNameAr);
    setParentPhone(parent.phone);
    setParentEmail(parent.email);
    setParentAddress(parent.address || '');
  }, [parent.fullNameAr, parent.phone, parent.email, parent.address]);

  const handleSaveParent = (e: React.FormEvent) => {
    e.preventDefault();
    updateParent({
      fullNameAr: parentName,
      phone: parentPhone,
      email: parentEmail,
      address: parentAddress,
    });
    setIsEditingParent(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleToggleNotif = (key: keyof typeof notificationSettings) => {
    updateNotificationSettings({
      [key]: !notificationSettings[key],
    });
  };

  return (
    <div className={`space-y-4 animate-fade-in ${isRTL ? 'text-right' : 'text-left'}`} style={{ paddingBottom: '40px' }}>
      {/* Header */}
      <div className="flex items-center justify-between gap-3 my-4 sm:my-6">
        <div>
          <span className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 block mb-1">
            {language === 'ar' ? 'إدارة الحساب والإعدادات' : language === 'fr' ? 'Gestion du Compte & Préférences' : 'Account Management & Settings'}
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.profileTitle}
          </h1>
        </div>
      </div>

      {/* Stacked Layout: All Containers Under Each Other with Spacious & Clean Spacing */}
      <div className="flex flex-col gap-4 sm:gap-6">
        {/* Module 1: Student Information */}
        <div
          className="bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 shadow-sm p-4 sm:p-6 rounded-3xl"
        >
          <div>
            <div
              className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5 mb-4"
            >
              <div className="flex items-center gap-2.5">
                <GraduationCap size={20} className="text-slate-500 shrink-0" />
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {language === 'ar' ? 'بيانات الطالب الأكاديمية' : language === 'fr' ? 'Dossier Académique de l’Élève' : 'Student Academic Profile'}
                </h3>
              </div>
              <span
                className="inline-flex items-center justify-center rounded-full text-xs font-black shadow-2xs select-none px-3.5 py-1 shrink-0 bg-slate-900 text-white dark:bg-slate-800 dark:text-slate-100 border border-slate-700/60"
              >
                {students.length > 0 ? (language === 'ar' ? theme.shortNameAr : `${t.level} ${activeStudent.currentLevel}`) : (language === 'ar' ? 'بانتظار الربط' : 'Pending Link')}
              </span>
            </div>

            {students.length === 0 ? (
              <div
                className="bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 text-center space-y-1.5 p-6 rounded-2xl"
              >
                <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  {language === 'ar' ? 'لا يوجد ملف طالب مرتبط بحسابك حالياً' : 'No student profile currently linked'}
                </p>
                <p className="text-xs text-slate-400 font-medium">
                  {language === 'ar' ? 'ستظهر كافة البيانات والمستويات الأكاديمية تلقائياً فور ربط الأبناء من طرف إدارة المدرسة.' : 'Academic records will appear here once linked by school administration.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs">
                <div
                  className="bg-slate-50/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 p-3 sm:p-3.5 rounded-2xl space-y-1"
                >
                  <span className="text-xs text-slate-400 font-bold block">
                    {language === 'ar' ? 'الاسم الأول' : language === 'fr' ? 'Prénom' : 'First Name'}
                  </span>
                  <span className="font-black text-slate-900 dark:text-white truncate block text-sm sm:text-base">
                    {activeStudent.firstNameAr || activeStudent.fullNameAr.split(' ')[0]}
                  </span>
                </div>

                <div
                  className="bg-slate-50/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 p-3 sm:p-3.5 rounded-2xl space-y-1"
                >
                  <span className="text-xs text-slate-400 font-bold block">
                    {language === 'ar' ? 'اللقب / اسم العائلة' : language === 'fr' ? 'Nom de Famille' : 'Last Name'}
                  </span>
                  <span className="font-black text-slate-900 dark:text-white truncate block text-sm sm:text-base">
                    {activeStudent.lastNameAr || activeStudent.fullNameAr.split(' ').slice(1).join(' ') || 'Douzkari'}
                  </span>
                </div>

                <div
                  className="bg-slate-50/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 p-3 sm:p-3.5 rounded-2xl space-y-1"
                >
                  <span className="text-xs text-slate-400 font-bold block">
                    {language === 'ar' ? 'تاريخ الميلاد' : language === 'fr' ? 'Date de Naissance' : 'Date of Birth'}
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white block text-sm sm:text-base">
                    {activeStudent.birthday || '2016-09-20'}
                  </span>
                </div>

                <div
                  className="bg-slate-50/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 p-3 sm:p-3.5 rounded-2xl space-y-1"
                >
                  <span className="text-xs text-slate-400 font-bold block">
                    {language === 'ar' ? 'المستوى المدرسي' : language === 'fr' ? 'Niveau Scolaire' : 'School Grade'}
                  </span>
                  <span className="font-black text-slate-900 dark:text-white truncate block text-sm sm:text-base">
                    {translateSchoolLevel(activeStudent.schoolLevelAr, language)}
                  </span>
                </div>

                <div
                  className="bg-slate-50/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 p-3 sm:p-3.5 rounded-2xl space-y-1 col-span-2 sm:col-span-1"
                >
                  <span className="text-xs text-slate-400 font-bold block">
                    {language === 'ar' ? 'الرقم الأكاديمي' : language === 'fr' ? 'Identifiant Étudiant' : 'Student ID'}
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white block text-xs sm:text-sm truncate">
                    {activeStudent.studentIdNumber}
                  </span>
                </div>

                <div
                  className="bg-slate-50/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 p-3 sm:p-3.5 rounded-2xl space-y-1 col-span-2 sm:col-span-1"
                >
                  <span className="text-xs text-slate-400 font-bold block">
                    {t.studentTrack}
                  </span>
                  <span className="font-black text-slate-900 dark:text-white truncate block text-sm sm:text-base">
                    {translateTrack(activeStudent.enrolledPathAr, language)}
                  </span>
                </div>

                <div
                  className="bg-slate-50/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 p-3 sm:p-3.5 rounded-2xl space-y-1 col-span-2 sm:col-span-2 lg:col-span-2"
                >
                  <span className="text-xs text-slate-400 font-bold block">
                    {language === 'ar' ? 'الفرع والسنة الدراسية' : language === 'fr' ? 'Campus & Année Scolaire' : 'Campus & Academic Year'}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white truncate block text-sm sm:text-base">
                    {translateBranch(activeStudent.branchAr, language)} • {activeStudent.academicYearAr || '2025/2026'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Module 2: Parent Information */}
        <div
          className="bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 shadow-sm p-4 sm:p-6 rounded-3xl"
        >
          <div>
            <div
              className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5 mb-4"
            >
              <div className="flex items-center gap-2.5">
                <User size={20} className="text-slate-500 shrink-0" />
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {t.personalInfo}
                </h3>
              </div>

              {!isEditingParent && (
                <button
                  type="button"
                  onClick={() => setIsEditingParent(true)}
                  className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer px-4 py-2"
                >
                  <Edit2 size={14} />
                  <span>{language === 'ar' ? 'تعديل البيانات' : language === 'fr' ? 'Modifier' : 'Edit Profile'}</span>
                </button>
              )}
            </div>

            {saveSuccess && (
              <div className="p-3.5 mb-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs sm:text-sm font-bold flex items-center gap-2">
                <Check size={18} />
                <span>{language === 'ar' ? 'تم حفظ بيانات ولي الأمر بنجاح!' : language === 'fr' ? 'Modifications enregistrées avec succès !' : 'Parent details updated successfully!'}</span>
              </div>
            )}

            {isEditingParent ? (
              <form onSubmit={handleSaveParent} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  <div
                    className="bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 p-3.5 rounded-2xl"
                  >
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                      {language === 'ar' ? 'اسم ولي الأمر:' : language === 'fr' ? 'Nom du Parent :' : 'Parent Full Name:'}
                    </label>
                    <input
                      type="text"
                      required
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      className="w-full text-xs sm:text-sm font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all px-3 py-2.5"
                    />
                  </div>

                  <div
                    className="bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 p-3.5 rounded-2xl"
                  >
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                      {t.phoneNumber}:
                    </label>
                    <input
                      type="tel"
                      required
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      className="w-full text-xs sm:text-sm font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all px-3 py-2.5"
                      dir="ltr"
                    />
                  </div>

                  <div
                    className="bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 p-3.5 rounded-2xl"
                  >
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                      {t.emailAddress}:
                    </label>
                    <input
                      type="email"
                      value={parentEmail}
                      onChange={(e) => setParentEmail(e.target.value)}
                      className="w-full text-xs sm:text-sm font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all px-3 py-2.5"
                      dir="ltr"
                    />
                  </div>

                  <div
                    className="bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 p-3.5 rounded-2xl"
                  >
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                      {language === 'ar' ? 'العنوان السكني:' : language === 'fr' ? 'Adresse :' : 'Address:'}
                    </label>
                    <input
                      type="text"
                      value={parentAddress}
                      onChange={(e) => setParentAddress(e.target.value)}
                      className="w-full text-xs sm:text-sm font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all px-3 py-2.5"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingParent(false)}
                    className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm cursor-pointer transition-colors flex items-center justify-center rounded-xl px-5 py-2.5"
                  >
                    {language === 'ar' ? 'إلغاء' : language === 'fr' ? 'Annuler' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="font-black text-xs sm:text-sm bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950 shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all hover:opacity-90 active:scale-98 rounded-xl px-6 py-2.5"
                  >
                    <Save size={16} className="shrink-0" />
                    <span>{language === 'ar' ? 'حفظ التعديلات' : language === 'fr' ? 'Enregistrer' : 'Save Changes'}</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs">
                <div
                  className="bg-slate-50/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 p-3 sm:p-3.5 rounded-2xl space-y-1"
                >
                  <span className="text-xs text-slate-400 font-bold block">
                    {language === 'ar' ? 'اسم ولي الأمر' : language === 'fr' ? 'Nom du Parent' : 'Parent Name'}
                  </span>
                  <span className="font-black text-slate-900 dark:text-white truncate block text-sm sm:text-base">{parent.fullNameAr}</span>
                </div>
                <div
                  className="bg-slate-50/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 p-3 sm:p-3.5 rounded-2xl space-y-1"
                >
                  <span className="text-xs text-slate-400 font-bold block">{t.phoneNumber}</span>
                  <span className="font-mono font-black text-slate-900 dark:text-white block text-sm sm:text-base" dir="ltr">
                    {parent.phone}
                  </span>
                </div>
                <div
                  className="bg-slate-50/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 p-3 sm:p-3.5 rounded-2xl space-y-1"
                >
                  <span className="text-xs text-slate-400 font-bold block">{t.emailAddress}</span>
                  <span className="font-mono font-black text-slate-900 dark:text-white truncate block text-sm sm:text-base" dir="ltr">
                    {parent.email}
                  </span>
                </div>
                <div
                  className="bg-slate-50/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 p-3 sm:p-3.5 rounded-2xl space-y-1"
                >
                  <span className="text-xs text-slate-400 font-bold block">
                    {language === 'ar' ? 'العنوان السكني' : language === 'fr' ? 'Adresse' : 'Address'}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white truncate block text-sm sm:text-base">
                    {parent.address || (language === 'ar' ? 'الجزائر العاصمة' : 'Algiers')}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Module 3: Manage Children */}
        <div
          className="bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 shadow-sm p-4 sm:p-6 rounded-3xl"
        >
          <div>
            <div
              className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5 mb-4"
            >
              <div className="flex items-center gap-2.5">
                <Users size={20} className="text-slate-500 shrink-0" />
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {t.registeredChildren} ({students.length})
                </h3>
              </div>
              {SHOW_ADD_STUDENT_BUTTON && (
                <button
                  type="button"
                  onClick={onOpenAddStudent}
                  className="font-bold text-xs text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800/80 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 cursor-pointer transition-all shadow-2xs flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2"
                >
                  <UserPlus size={15} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>{t.addStudent}</span>
                </button>
              )}
            </div>

            <div className="space-y-3">
              {students.map((st) => {
                const stTheme = getThemeForLevel(st.currentLevel as LevelId);
                const isSelected = st.id === activeStudent.id;

                return (
                  <div
                    key={st.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setActiveStudentId(st.id)}
                    className={`border flex items-center justify-between gap-4 cursor-pointer transition-all p-3.5 sm:p-4 rounded-2xl ${
                      isSelected
                        ? 'bg-slate-50 dark:bg-slate-800/80 border-lime-500/60 dark:border-lime-500/40 ring-1 ring-lime-500/20 shadow-xs'
                        : 'border-slate-200/80 dark:border-slate-800 hover:bg-slate-50/60 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-black text-xs shrink-0 shadow-xs bg-slate-900 text-white dark:bg-slate-800 dark:text-slate-100 border border-slate-700/60"
                      >
                        {st.nicknameAr ? st.nicknameAr[0] : st.fullNameAr[0]}
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-black text-slate-900 dark:text-white block truncate">
                            {st.fullNameAr}
                          </span>
                          {st.status === 'pending' ? (
                            <span
                              className="inline-flex items-center gap-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 select-none whitespace-nowrap shrink-0 shadow-2xs px-3 py-1"
                            >
                              <Clock size={12} className="shrink-0" />
                              <span>{language === 'ar' ? 'قيد المراجعة' : language === 'fr' ? 'En validation' : 'Pending'}</span>
                            </span>
                          ) : (
                            isSelected && (
                              <span
                                className="inline-flex items-center justify-center rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 select-none whitespace-nowrap shrink-0 shadow-2xs px-3 py-1"
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

                    <div className="flex items-center gap-2 shrink-0">
                      {st.status === 'pending' ? (
                        <span
                          className="inline-flex items-center justify-center rounded-full text-xs font-bold text-white bg-amber-500 shadow-2xs select-none whitespace-nowrap px-4 py-1.5"
                        >
                          {language === 'ar' ? 'بانتظار الاختبار' : language === 'fr' ? 'Test prévu' : 'Awaiting Test'}
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center justify-center rounded-full text-xs font-black shadow-xs select-none whitespace-nowrap px-4 py-1.5 bg-slate-900 text-white dark:bg-slate-800 dark:text-slate-100 border border-slate-700/60"
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
          className="bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 shadow-sm p-4 sm:p-6 rounded-3xl"
        >
          <div>
            <div
              className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3.5 mb-4"
            >
              <Settings size={20} className="text-slate-500 shrink-0" />
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {t.appSettings}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Language Selection */}
              <div
                className="flex flex-col justify-between bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 gap-3 p-3.5 sm:p-4 rounded-2xl"
              >
                <div className="flex items-center gap-2">
                  <Languages size={18} className="text-slate-500 shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
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
                      className={`h-9 px-2 rounded-xl font-black text-xs flex items-center justify-center transition-all cursor-pointer ${
                        language === l.code
                          ? 'bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950 shadow-xs'
                          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dark Mode toggle */}
              <div
                className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 gap-4 p-3.5 sm:p-4 rounded-2xl"
              >
                <div className="flex items-center gap-2">
                  {isDarkMode ? <Moon size={20} className="text-amber-400 shrink-0" /> : <Sun size={20} className="text-amber-500 shrink-0" />}
                  <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
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
                    className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                    style={{
                      backgroundColor: isDarkMode ? theme.primary : undefined,
                    }}
                  />
                </label>
              </div>

              {/* Homework alerts */}
              <div
                className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 gap-4 p-3.5 sm:p-4 rounded-2xl"
              >
                <div className="space-y-0.5">
                  <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 block">
                    {language === 'ar' ? 'تنبيهات الواجبات والتصحيح' : language === 'fr' ? 'Alertes de Devoirs' : 'Homework & Grading Alerts'}
                  </span>
                  <span className="text-xs text-slate-400 font-medium block leading-tight">
                    {language === 'ar' ? 'إشعار عند طلب مراجعة الواجب أو رصد درجة' : language === 'fr' ? 'Notification lors de la correction' : 'Instant notice for grades & revisions'}
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
                    className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                    style={{
                      backgroundColor: notificationSettings.homework ? theme.primary : undefined,
                    }}
                  />
                </label>
              </div>

              {/* Attendance alerts */}
              <div
                className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 gap-4 p-3.5 sm:p-4 rounded-2xl"
              >
                <div className="space-y-0.5">
                  <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 block">
                    {language === 'ar' ? 'تنبيهات الحضور والغياب اليومي' : language === 'fr' ? 'Alertes de Présence Quotidienne' : 'Daily Attendance Alerts'}
                  </span>
                  <span className="text-xs text-slate-400 font-medium block leading-tight">
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
                    className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
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
          className="bg-white dark:bg-slate-850 border border-slate-200/90 dark:border-slate-800 shadow-sm p-4 sm:p-6 rounded-3xl flex items-center justify-between gap-4 flex-wrap"
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
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all hover:opacity-95 active:scale-98 shrink-0 rounded-2xl px-5 py-3"
          >
            <MessageCircle size={18} className="shrink-0" />
            <span>{language === 'ar' ? 'واتساب الإشراف' : language === 'fr' ? 'WhatsApp Support' : 'WhatsApp Support'}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
