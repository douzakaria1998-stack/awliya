'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  GraduationCap,
  School,
  Phone,
  Mail,
  Award,
  BookOpen,
  Calendar,
  Languages,
  UserCheck,
  Edit3,
  Check,
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  ShieldCheck,
  Save,
} from 'lucide-react';
import { AdminTeacher } from '@/types/admin';
import { useAdmin } from '@/context/AdminContext';
import { useLanguage } from '@/context/LanguageContext';
import { generateAutoPassword, formatStudentCount } from '@/lib/utils';
import { ConfirmModal } from './ConfirmModal';

interface TeacherDetailModalProps {
  teacher: AdminTeacher | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TeacherDetailModal({ teacher, isOpen, onClose }: TeacherDetailModalProps) {
  const { teachers, groups, setActiveTab, updateTeacher } = useAdmin();
  const { isRTL, language } = useLanguage();

  // Find live teacher data from context
  const currentTeacher = teachers.find((t) => t.id === teacher?.id) || teacher;

  // Confirmation Modal State
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'primary';
    icon?: 'trash' | 'edit' | 'alert' | 'check';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [editFullNameAr, setEditFullNameAr] = useState('');
  const [editFullNameEn, setEditFullNameEn] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editLanguages, setEditLanguages] = useState<('English' | 'French')[]>([]);

  // Password & Security State
  const [showPassword, setShowPassword] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isFullCopied, setIsFullCopied] = useState(false);
  const [isChangingCustomPass, setIsChangingCustomPass] = useState(false);
  const [customPasswordInput, setCustomPasswordInput] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync edit state when modal opens or teacher changes
  useEffect(() => {
    if (currentTeacher) {
      setEditFullNameAr(currentTeacher.fullNameAr || '');
      setEditFullNameEn(currentTeacher.fullNameEn || '');
      setEditUsername(currentTeacher.username || '');
      setEditPhone(currentTeacher.phone || '');
      setEditEmail(currentTeacher.email || '');
      setEditLanguages(currentTeacher.languagesTaught || ['English']);
      setIsEditing(false);
      setIsChangingCustomPass(false);
      setCustomPasswordInput('');
    }
  }, [currentTeacher, isOpen]);

  if (!isOpen || !currentTeacher) return null;

  const assignedGroups = groups.filter(
    (g) => currentTeacher.assignedGroupIds.includes(g.id) || g.teacherId === currentTeacher.id
  );
  const totalStudentsCount = assignedGroups.reduce((acc, g) => acc + g.studentIds.length, 0);
  const activePassword = currentTeacher.password || 'MS-Teach-2026!';

  const executeSaveProfile = () => {
    updateTeacher(currentTeacher.id, {
      fullNameAr: editFullNameAr.trim() || currentTeacher.fullNameAr,
      fullNameEn: editFullNameEn.trim() || currentTeacher.fullNameEn,
      username: editUsername.trim() || currentTeacher.username,
      phone: editPhone.trim() || currentTeacher.phone,
      email: editEmail.trim() || currentTeacher.email,
      languagesTaught: editLanguages.length > 0 ? editLanguages : currentTeacher.languagesTaught,
    });
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Handle Save Profile Edits
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmConfig({
      isOpen: true,
      title: language === 'ar' ? 'تأكيد تعديل بيانات المعلم' : 'Confirm Teacher Profile Changes',
      message: language === 'ar'
        ? `هل أنت متأكد من حفظ التعديلات الجديدة على ملف المعلم (${editFullNameAr.trim() || currentTeacher.fullNameAr})؟`
        : `Are you sure you want to save changes for teacher ${editFullNameEn.trim() || currentTeacher.fullNameEn}?`,
      confirmText: language === 'ar' ? 'تأكيد وحفظ' : 'Confirm & Save',
      variant: 'primary',
      icon: 'edit',
      onConfirm: () => {
        executeSaveProfile();
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Handle Quick Password Reset
  const handleResetPassword = () => {
    setConfirmConfig({
      isOpen: true,
      title: language === 'ar' ? 'تأكيد إعادة تعيين كلمة المرور' : 'Confirm Password Reset',
      message: language === 'ar'
        ? `هل أنت متأكد من إنشاء كلمة مرور عشوائية جديدة للمعلم (${currentTeacher.fullNameAr})؟`
        : `Are you sure you want to generate a new random password for ${currentTeacher.fullNameEn}?`,
      confirmText: language === 'ar' ? 'إعادة التعيين' : 'Reset Password',
      variant: 'warning',
      icon: 'alert',
      onConfirm: () => {
        const newPass = generateAutoPassword();
        updateTeacher(currentTeacher.id, { password: newPass });
        setShowPassword(true);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Handle Custom Password Save
  const handleSaveCustomPassword = () => {
    if (!customPasswordInput.trim()) return;
    setConfirmConfig({
      isOpen: true,
      title: language === 'ar' ? 'تأكيد تغيير كلمة المرور' : 'Confirm Custom Password',
      message: language === 'ar'
        ? `هل أنت متأكد من تعيين كلمة المرور المخصصة الجديدة للمعلم (${currentTeacher.fullNameAr})؟`
        : `Are you sure you want to set the new custom password for ${currentTeacher.fullNameEn}?`,
      confirmText: language === 'ar' ? 'تغيير كلمة المرور' : 'Change Password',
      variant: 'warning',
      icon: 'alert',
      onConfirm: () => {
        updateTeacher(currentTeacher.id, { password: customPasswordInput.trim() });
        setIsChangingCustomPass(false);
        setCustomPasswordInput('');
        setShowPassword(true);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText}
        variant={confirmConfig.variant}
        icon={confirmConfig.icon}
        onConfirm={confirmConfig.onConfirm}
      />
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-fade-in-up my-6 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div
          className="bg-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800"
          style={{ padding: '20px 24px' }}
        >
          <div className="flex items-center gap-3 truncate">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black shadow-md shrink-0">
              <GraduationCap size={22} />
            </div>
            <div className="truncate">
              <h3 className="text-lg sm:text-xl font-black text-white truncate">
                {language === 'ar' ? currentTeacher.fullNameAr : currentTeacher.fullNameEn || currentTeacher.fullNameAr}
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5 truncate" dir="auto">
                @{currentTeacher.username} • {currentTeacher.specialization}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                style={{ paddingLeft: '16px', paddingRight: '16px', gap: '8px' }}
                className="h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
              >
                <Edit3 size={14} className="shrink-0" />
                <span>{language === 'ar' ? 'تعديل البيانات' : 'Edit Profile'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                style={{ paddingLeft: '16px', paddingRight: '16px', gap: '8px' }}
                className="h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center transition-all cursor-pointer shrink-0"
              >
                <X size={14} className="shrink-0" />
                <span>{language === 'ar' ? 'إلغاء' : 'Cancel'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div
          className={`overflow-y-auto flex-1 flex flex-col gap-5 ${isRTL ? 'text-right' : 'text-left'}`}
          style={{ padding: '22px 26px' }}
        >
          {/* Success Toast */}
          {saveSuccess && (
            <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fade-in">
              <Check size={16} className="text-emerald-600" />
              <span>{language === 'ar' ? 'تم حفظ وتحديث بيانات المعلم بنجاح' : 'Teacher information updated successfully'}</span>
            </div>
          )}

          {/* Section 1: Teacher Profile Information */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {language === 'ar' ? 'المعلومات الشخصية والمهنية' : 'Personal & Teaching Details'}
            </h4>

            {isEditing ? (
              /* EDIT MODE FORM */
              <form onSubmit={handleSaveProfile} className="flex flex-col gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {language === 'ar' ? 'الاسم بالعربية *' : 'Arabic Name *'}
                    </label>
                    <input
                      type="text"
                      dir="auto"
                      required
                      value={editFullNameAr}
                      onChange={(e) => setEditFullNameAr(e.target.value)}
                      style={{ paddingLeft: '14px', paddingRight: '14px' }}
                      className="w-full h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {language === 'ar' ? 'الاسم بالإنجليزية' : 'English Name'}
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={editFullNameEn}
                      onChange={(e) => setEditFullNameEn(e.target.value)}
                      style={{ paddingLeft: '14px', paddingRight: '14px' }}
                      className="w-full h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {language === 'ar' ? 'اسم المستخدم *' : 'Username *'}
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      required
                      value={editUsername}
                      onChange={(e) => setEditUsername(e.target.value)}
                      style={{ paddingLeft: '14px', paddingRight: '14px' }}
                      className="w-full h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs font-bold text-purple-600 dark:text-purple-400 focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {language === 'ar' ? 'رقم الهاتف *' : 'Phone Number *'}
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      required
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      style={{ paddingLeft: '14px', paddingRight: '14px' }}
                      className="w-full h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {language === 'ar' ? 'البريد الإلكتروني المهني' : 'Professional Email'}
                  </label>
                  <input
                    type="email"
                    dir="ltr"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    style={{ paddingLeft: '14px', paddingRight: '14px' }}
                    className="w-full h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                {/* Languages selection checkboxes */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {language === 'ar' ? 'اللغات المدرسة' : 'Languages Taught'}
                  </label>
                  <div
                    className="flex items-center gap-6 min-h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                    style={{ paddingLeft: '18px', paddingRight: '18px', paddingTop: '8px', paddingBottom: '8px' }}
                  >
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800 dark:text-slate-200 select-none">
                      <input
                        type="checkbox"
                        checked={editLanguages.includes('English')}
                        onChange={(e) => {
                          if (e.target.checked) setEditLanguages([...editLanguages, 'English']);
                          else setEditLanguages(editLanguages.filter((l) => l !== 'English'));
                        }}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <span>{language === 'ar' ? 'اللغة الإنجليزية' : 'English'}</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800 dark:text-slate-200 select-none">
                      <input
                        type="checkbox"
                        checked={editLanguages.includes('French')}
                        onChange={(e) => {
                          if (e.target.checked) setEditLanguages([...editLanguages, 'French']);
                          else setEditLanguages(editLanguages.filter((l) => l !== 'French'));
                        }}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <span>{language === 'ar' ? 'اللغة الفرنسية' : 'French'}</span>
                    </label>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
                  >
                    {language === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <Save size={14} />
                    <span>{language === 'ar' ? 'حفظ التعديلات' : 'Save Changes'}</span>
                  </button>
                </div>
              </form>
            ) : (
              /* VIEW MODE 2x2 GRID */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 p-3.5 flex flex-col gap-1">
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
                    {language === 'ar' ? 'اسم المستخدم:' : 'Username:'}
                  </span>
                  <span className="font-mono font-bold text-purple-600 dark:text-purple-400 text-xs truncate" dir="ltr">
                    @{currentTeacher.username}
                  </span>
                </div>

                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 p-3.5 flex flex-col gap-1">
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
                    {language === 'ar' ? 'البريد الإلكتروني:' : 'Email:'}
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white text-xs truncate" dir="ltr">
                    {currentTeacher.email}
                  </span>
                </div>

                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 p-3.5 flex flex-col gap-1">
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
                    {language === 'ar' ? 'رقم الهاتف:' : 'Phone Number:'}
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white text-xs" dir="ltr">
                    {currentTeacher.phone}
                  </span>
                </div>

                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 p-3.5 flex flex-col gap-1">
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
                    {language === 'ar' ? 'اللغات المدرسة:' : 'Languages Taught:'}
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs truncate">
                    {currentTeacher.languagesTaught.join(' & ')}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Security & Password Management (Section 11) */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <KeyRound size={14} className="text-emerald-600 dark:text-emerald-400" />
                <span>{language === 'ar' ? 'بيانات الدخول وكلمة المرور' : 'Security & Login Credentials'}</span>
              </h4>

              {/* Copy Full Credentials */}
              <button
                type="button"
                onClick={() => {
                  const text =
                    `${language === 'ar' ? 'بيانات دخول المعلم' : 'Teacher Credentials'}\n` +
                    `👤 ${language === 'ar' ? 'الاسم' : 'Name'}: ${currentTeacher.fullNameAr}\n` +
                    `🔖 ${language === 'ar' ? 'اسم المستخدم' : 'Username'}: @${currentTeacher.username}\n` +
                    `📱 ${language === 'ar' ? 'الهاتف' : 'Phone'}: ${currentTeacher.phone}\n` +
                    `📧 ${language === 'ar' ? 'البريد' : 'Email'}: ${currentTeacher.email}\n` +
                    `🔑 ${language === 'ar' ? 'كلمة المرور' : 'Password'}: ${activePassword}`;
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(text);
                    setIsFullCopied(true);
                    setTimeout(() => setIsFullCopied(false), 2000);
                  }
                }}
                style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '8px', paddingBottom: '8px', gap: '8px' }}
                className={`rounded-xl border flex items-center justify-center text-xs font-bold transition-all cursor-pointer shadow-2xs shrink-0 whitespace-nowrap ${
                  isFullCopied
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-emerald-700'
                }`}
              >
                {isFullCopied ? <Check size={14} className="shrink-0" /> : <ShieldCheck size={14} className="shrink-0" />}
                <span>
                  {isFullCopied
                    ? language === 'ar'
                      ? 'تم النسخ'
                      : 'Copied!'
                    : language === 'ar'
                    ? 'نسخ كامل البيانات'
                    : 'Copy Full Details'}
                </span>
              </button>
            </div>

            {/* Password Card */}
            <div
              className="rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/90 dark:border-emerald-800/70 flex flex-col gap-3"
              style={{ padding: '18px 20px' }}
            >
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                {/* Password Display Box */}
                <div
                  className="flex-1 flex items-center bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 rounded-xl shadow-2xs"
                  style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '8px', paddingBottom: '8px', gap: '12px' }}
                >
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 shrink-0">
                    {language === 'ar' ? 'كلمة المرور:' : 'Password:'}
                  </span>
                  <span
                    className="flex-1 font-mono font-black text-xs sm:text-sm text-emerald-950 dark:text-emerald-200 tracking-wider"
                    dir="ltr"
                  >
                    {showPassword ? activePassword : '••••••••••••'}
                  </span>

                  {/* Show/Hide Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
                    title={showPassword ? 'Hide' : 'Show'}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                {/* Copy Password Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(activePassword);
                      setIsCopied(true);
                      setTimeout(() => setIsCopied(false), 2000);
                    }
                  }}
                  style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '8px', paddingBottom: '8px', gap: '8px' }}
                  className={`rounded-xl border flex items-center justify-center text-xs font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                    isCopied
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white shadow-xs active:scale-95'
                  }`}
                >
                  {isCopied ? <Check size={14} className="shrink-0" /> : <Copy size={14} className="shrink-0" />}
                  <span>{isCopied ? (language === 'ar' ? 'تم النسخ' : 'Copied') : language === 'ar' ? 'نسخ الرمز' : 'Copy'}</span>
                </button>

                {/* Auto Regenerate Password */}
                <button
                  type="button"
                  onClick={handleResetPassword}
                  title={language === 'ar' ? 'توليد كلمة مرور جديدة عشوائياً' : 'Auto generate new password'}
                  style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '8px', paddingBottom: '8px', gap: '8px' }}
                  className="bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 rounded-xl flex items-center justify-center text-xs font-bold transition-all cursor-pointer active:scale-95 shrink-0 whitespace-nowrap shadow-2xs"
                >
                  <RefreshCw size={14} className="shrink-0" />
                  <span>{language === 'ar' ? 'توليد كلمة جديدة' : 'Reset Password'}</span>
                </button>
              </div>

              {/* Custom Password Input Toggle */}
              {!isChangingCustomPass ? (
                <div className="flex items-center justify-between pt-0.5">
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                    {language === 'ar'
                      ? 'يمكنك تعيين كلمة مرور مخصصة أو توليدها تلقائياً للمعلم.'
                      : 'You can set a custom password or auto-generate one for this teacher.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsChangingCustomPass(true)}
                    className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 hover:underline cursor-pointer shrink-0"
                  >
                    {language === 'ar' ? 'تعيين كلمة مخصصة ←' : 'Set Custom Password →'}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    dir="ltr"
                    placeholder={language === 'ar' ? 'أدخل كلمة المرور الجديدة...' : 'Enter new password...'}
                    value={customPasswordInput}
                    onChange={(e) => setCustomPasswordInput(e.target.value)}
                    style={{ paddingLeft: '14px', paddingRight: '14px' }}
                    className="flex-1 h-9 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 rounded-xl font-mono text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <button
                    type="button"
                    onClick={handleSaveCustomPassword}
                    className="h-9 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer shrink-0"
                  >
                    {language === 'ar' ? 'تطبيق وحفظ' : 'Apply'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingCustomPass(false);
                      setCustomPasswordInput('');
                    }}
                    className="h-9 px-3 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer shrink-0"
                  >
                    {language === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Total Students Counter Bar */}
          <div
            className="rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/50 dark:border-purple-800/40 flex items-center justify-between"
            style={{ paddingLeft: '20px', paddingRight: '20px', paddingTop: '12px', paddingBottom: '12px' }}
          >
            <span className="text-xs font-bold text-purple-900 dark:text-purple-300">
              {language === 'ar' ? 'إجمالي الطلاب المسجلين بالأفواج:' : 'Total Enrolled Students:'}
            </span>
            <span className="font-mono font-black text-purple-700 dark:text-purple-400 text-sm">
              {totalStudentsCount} {language === 'ar' ? 'طالب' : 'Students'}
            </span>
          </div>

          {/* Section 4: Assigned Groups */}
          <div className="flex flex-col gap-2.5 pt-1">
            <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <School size={17} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>
                {language === 'ar'
                  ? `الأفواج المسندة للمعلم (${assignedGroups.length})`
                  : `Assigned Class Groups (${assignedGroups.length})`}
              </span>
            </h4>

            <div className="flex flex-col gap-3">
              {assignedGroups.length > 0 ? (
                assignedGroups.map((grp) => {
                  const cleanTime =
                    grp.startTime && grp.endTime && !grp.startTime.includes('–') && !grp.startTime.includes('-')
                      ? `${grp.startTime} – ${grp.endTime}`
                      : grp.startTime || grp.endTime || '';

                  return (
                    <div
                      key={grp.id}
                      className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-slate-300 dark:hover:border-slate-600"
                      style={{ padding: '16px 20px' }}
                    >
                      <div className="flex flex-col gap-2 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span
                            className="inline-flex items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-mono font-black text-xs sm:text-sm tracking-wider border border-emerald-300/70 dark:border-emerald-700/60 shrink-0 shadow-2xs select-none"
                            style={{ padding: '6px 14px', minWidth: '52px', minHeight: '32px', lineHeight: '1' }}
                          >
                            {grp.code}
                          </span>
                          <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-none">
                            {grp.name.replace(/\s*\([A-Z0-9\.\+\-]+\)/g, '')}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2 flex-wrap pt-0.5">
                          <span>{grp.daysAr || grp.daysEn}</span>
                          {cleanTime && (
                            <>
                              <span className="text-slate-300 dark:text-slate-600">•</span>
                              <span dir="ltr" className="font-mono text-[11px] font-bold text-slate-600 dark:text-slate-300">{cleanTime}</span>
                            </>
                          )}
                          <span className="text-slate-300 dark:text-slate-600">•</span>
                          <span>{formatStudentCount(grp.studentIds.length, language)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-center flex-wrap">
                        <span
                          className="inline-flex items-center justify-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 bg-white dark:bg-slate-900 border border-purple-200/80 dark:border-purple-800/70 rounded-xl shadow-2xs whitespace-nowrap select-none"
                          style={{ padding: '6px 16px', minHeight: '34px', lineHeight: '1' }}
                        >
                          <span className="font-mono font-black text-xs sm:text-sm">{grp.attendanceRate}%</span>
                          <span className="text-xs font-bold text-purple-700/85 dark:text-purple-300/85">{language === 'ar' ? 'حضور' : 'Att.'}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            setActiveTab('groups');
                          }}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0 select-none"
                          style={{ padding: '6px 18px', minHeight: '34px', lineHeight: '1' }}
                        >
                          <span className="text-xs font-bold">{language === 'ar' ? 'إدارة الفوج' : 'Manage Group'}</span>
                          <span className="text-xs font-black" aria-hidden="true">{language === 'ar' ? '←' : '→'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-5 px-4 text-center text-xs text-slate-400 dark:text-slate-500 font-medium bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                  {language === 'ar' ? 'لا توجد أفواج مسندة لهذا المعلم حالياً' : 'No groups currently assigned to this teacher'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
