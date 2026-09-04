'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  KeyRound,
  Trash2,
  Edit3,
  Check,
  Copy,
  RefreshCw,
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Briefcase,
  Crown,
  GraduationCap,
  Shield,
  Save,
  AlertTriangle,
  Lock,
} from 'lucide-react';
import { AdminUser, AdminRole } from '@/types/admin';
import { useAdmin } from '@/context/AdminContext';
import { useLanguage } from '@/context/LanguageContext';
import { generateAutoPassword } from '@/lib/utils';
import { ConfirmModal } from './ConfirmModal';

interface AdminUserDetailModalProps {
  adminUser: AdminUser | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AdminUserDetailModal({ adminUser, isOpen, onClose }: AdminUserDetailModalProps) {
  const { adminUsers, currentAdmin, updateAdminUser, deleteAdminUser } = useAdmin();
  const { isRTL, language } = useLanguage();

  // Find live admin user from context
  const currentUser = adminUsers.find((u) => u.id === adminUser?.id) || adminUser;

  // Form Edit State
  const [fullNameAr, setFullNameAr] = useState('');
  const [fullNameEn, setFullNameEn] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<AdminRole>('administrator');
  const [departmentAr, setDepartmentAr] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive' | 'suspended'>('active');

  // Password State
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

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

  // Sync state when modal opens or user changes
  useEffect(() => {
    if (currentUser) {
      setFullNameAr(currentUser.fullNameAr || '');
      setFullNameEn(currentUser.fullNameEn || '');
      setUsername(currentUser.username || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
      setRole(currentUser.role || 'administrator');
      setDepartmentAr(currentUser.departmentAr || '');
      setStatus(currentUser.status || 'active');
      setPassword(currentUser.password || 'admin123');
      setFeedbackMessage('');
    }
  }, [currentUser, isOpen]);

  if (!isOpen || !currentUser) return null;

  const isSelf = currentAdmin.id === currentUser.id;

  const handleGeneratePassword = () => {
    const newPass = generateAutoPassword('Admin');
    setPassword(newPass);
    setShowPassword(true);
    setFeedbackMessage(
      language === 'ar' ? 'تم إنشاء كلمة مرور جديدة بنجاح' : 'New password generated successfully'
    );
    setTimeout(() => setFeedbackMessage(''), 3000);
  };

  const handleCopyPassword = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleTriggerSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!fullNameAr.trim() || !username.trim()) return;

    setConfirmConfig({
      isOpen: true,
      title: language === 'ar' ? 'تأكيد تعديل الحساب' : language === 'fr' ? 'Confirmer la modification' : 'Confirm Account Edit',
      message:
        language === 'ar'
          ? `هل أنت متأكد من حفظ التعديلات وتحديث بيانات حساب "${fullNameAr}"؟`
          : language === 'fr'
          ? `Voulez-vous enregistrer les modifications pour "${fullNameEn || fullNameAr}" ?`
          : `Are you sure you want to save changes to account "${fullNameEn || fullNameAr}"?`,
      confirmText: language === 'ar' ? 'حفظ التعديلات' : language === 'fr' ? 'Enregistrer' : 'Save Changes',
      cancelText: language === 'ar' ? 'إلغاء' : language === 'fr' ? 'Annuler' : 'Cancel',
      variant: 'primary',
      icon: 'edit',
      onConfirm: () => {
        updateAdminUser(currentUser.id, {
          fullNameAr: fullNameAr.trim(),
          fullNameEn: fullNameEn.trim() || fullNameAr.trim(),
          username: username.trim().toLowerCase(),
          email: email.trim(),
          phone: phone.trim(),
          role,
          departmentAr: departmentAr.trim(),
          departmentEn: departmentAr.trim(),
          status,
          password: password.trim() || undefined,
        });
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        onClose();
      },
    });
  };

  const handleTriggerDelete = () => {
    if (isSelf) {
      alert(
        language === 'ar'
          ? 'لا يمكنك حذف الحساب الإداري الذي تستخدمه حالياً لتسجيل الدخول.'
          : language === 'fr'
          ? 'Vous ne pouvez pas supprimer le compte actuellement connecté.'
          : 'You cannot delete the account you are currently logged into.'
      );
      return;
    }

    setConfirmConfig({
      isOpen: true,
      title: language === 'ar' ? 'حذف الحساب الإداري نهائياً' : language === 'fr' ? 'Supprimer le compte administrateur' : 'Delete Admin Account',
      message:
        language === 'ar'
          ? `هل أنت متأكد تماماً من رغبتك في حذف حساب "${currentUser.fullNameAr}" (@${currentUser.username}) نهائياً؟ هذا الإجراء لا يمكن التراجع عنه.`
          : language === 'fr'
          ? `Êtes-vous sûr de vouloir supprimer définitivement le compte "${currentUser.fullNameEn || currentUser.fullNameAr}" ? Cette action est irréversible.`
          : `Are you sure you want to permanently delete account "${currentUser.fullNameEn || currentUser.fullNameAr}" (@${currentUser.username})? This action cannot be undone.`,
      confirmText: language === 'ar' ? 'تأكيد الحذف النهائي' : language === 'fr' ? 'Supprimer définitivement' : 'Delete Account',
      cancelText: language === 'ar' ? 'إلغاء' : language === 'fr' ? 'Annuler' : 'Cancel',
      variant: 'danger',
      icon: 'trash',
      onConfirm: () => {
        deleteAdminUser(currentUser.id);
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
        onClose();
      },
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md animate-fade-in select-none">
        <div
          className="w-full max-w-3xl sm:max-w-4xl bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl border border-slate-200/80 dark:border-slate-800 animate-fade-in-up flex flex-col max-h-[92vh] overflow-hidden"
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          {/* 1. Modal Header (Fixed at top with generous horizontal padding) */}
          <div
            className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50/80 dark:bg-slate-900/80"
            style={{ padding: '22px 36px' }}
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black shadow-xs shrink-0 ${
                  role === 'super_admin'
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 border border-purple-300/80 dark:border-purple-800/80'
                    : role === 'administrator'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-300/80 dark:border-blue-800/80'
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-800/80'
                }`}
              >
                {role === 'super_admin' ? (
                  <Crown size={24} />
                ) : role === 'administrator' ? (
                  <Shield size={24} />
                ) : (
                  <GraduationCap size={24} />
                )}
              </div>
              <div>
                <h3 className="font-black text-lg sm:text-xl text-slate-900 dark:text-white leading-snug">
                  {language === 'ar' ? 'تعديل بيانات الحساب الإداري' : language === 'fr' ? 'Modifier le Compte Admin' : 'Edit Admin Account'}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
                    @{currentUser.username}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {currentUser.departmentAr}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer shadow-2xs"
            >
              <X size={18} />
            </button>
          </div>

          {/* 2. Modal Body (Scrollable with generous left/right padding around containers) */}
          <div className="flex-1 overflow-y-auto" style={{ padding: '28px 36px 36px' }}>
            <form id="admin-user-form" onSubmit={handleTriggerSave} className="space-y-6 sm:space-y-7">
              {/* Container 1: Personal & Identity Information */}
              <div className="p-6 sm:p-7 rounded-2xl bg-slate-50/70 dark:bg-slate-850/50 border border-slate-200/80 dark:border-slate-800 space-y-5 shadow-xs">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60 dark:border-slate-750">
                  <User size={16} className="text-purple-600 dark:text-purple-400 shrink-0" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    {language === 'ar' ? 'البيانات الشخصية والحساب' : 'Identity & Personal Info'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                      {language === 'ar' ? 'الاسم الكامل بالعربية' : 'Full Name (Arabic)'} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullNameAr}
                      onChange={(e) => setFullNameAr(e.target.value)}
                      className="w-full h-11 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                      {language === 'ar' ? 'الاسم باللاتينية / الإنجليزية' : 'Full Name (Latin/English)'}
                    </label>
                    <input
                      type="text"
                      value={fullNameEn}
                      onChange={(e) => setFullNameEn(e.target.value)}
                      className="w-full h-11 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors shadow-2xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                      {language === 'ar' ? 'اسم المستخدم (Username)' : 'Username'} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full h-11 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-xs sm:text-sm font-mono font-bold text-purple-600 dark:text-purple-400 focus:outline-none focus:border-purple-500 transition-colors shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                      {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-11 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-xs sm:text-sm font-mono font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-purple-500 transition-colors shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* Container 2: Role, Department & Contact */}
              <div className="p-6 sm:p-7 rounded-2xl bg-slate-50/70 dark:bg-slate-850/50 border border-slate-200/80 dark:border-slate-800 space-y-5 shadow-xs">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60 dark:border-slate-750">
                  <Briefcase size={16} className="text-purple-600 dark:text-purple-400 shrink-0" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    {language === 'ar' ? 'بيانات العمل والصلاحيات' : 'Role & Department'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                      {language === 'ar' ? 'رقم الهاتف والتواصل' : 'Phone Number'}
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      dir="ltr"
                      className="w-full h-11 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-xs sm:text-sm font-mono font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-purple-500 transition-colors shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                      {language === 'ar' ? 'القسم / التخصص' : 'Department / Role'}
                    </label>
                    <input
                      type="text"
                      value={departmentAr}
                      onChange={(e) => setDepartmentAr(e.target.value)}
                      className="w-full h-11 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors shadow-2xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                      {language === 'ar' ? 'الدور والصلاحية (Role)' : 'Role'}
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as AdminRole)}
                      className="w-full h-11 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors cursor-pointer shadow-2xs"
                    >
                      <option value="super_admin">{language === 'ar' ? 'مدير عام (Super Admin)' : 'Super Admin'}</option>
                      <option value="administrator">{language === 'ar' ? 'مدير عمليات (Administrator)' : 'Administrator'}</option>
                      <option value="teacher">{language === 'ar' ? 'معلم (Teacher)' : 'Teacher'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                      {language === 'ar' ? 'حالة الحساب' : 'Account Status'}
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full h-11 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors cursor-pointer shadow-2xs"
                    >
                      <option value="active">{language === 'ar' ? 'نشط (Active)' : 'Active'}</option>
                      <option value="inactive">{language === 'ar' ? 'معطل (Inactive)' : 'Inactive'}</option>
                      <option value="suspended">{language === 'ar' ? 'موقوف مؤقتاً (Suspended)' : 'Suspended'}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Container 3: Security & Password Management in Dedicated Spacious Card (One Line Buttons) */}
              <div className="p-6 sm:p-7 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-900/60 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-purple-200/60 dark:border-purple-850">
                  <div className="flex items-center gap-2">
                    <KeyRound size={16} className="text-purple-600 dark:text-purple-400 shrink-0" />
                    <span className="text-xs font-black uppercase tracking-wider text-purple-950 dark:text-purple-200">
                      {language === 'ar' ? 'إعدادات الأمان وتغيير كلمة المرور' : 'Security & Password'}
                    </span>
                  </div>
                  {feedbackMessage && (
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800 animate-fade-in">
                      {feedbackMessage}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    {language === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}
                  </label>

                  {/* One single unified line with input + generate + copy buttons */}
                  <div className="flex items-center gap-3.5 w-full flex-nowrap">
                    <div className="relative flex-1 min-w-0">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full h-11 bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900/80 rounded-xl px-4 text-xs sm:text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 shadow-2xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        style={{
                          right: isRTL ? 'auto' : '10px',
                          left: isRTL ? '10px' : 'auto',
                        }}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleGeneratePassword}
                      className="h-11 px-5 min-w-[135px] rounded-xl bg-white dark:bg-slate-850 hover:bg-purple-50 dark:hover:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-2xs hover:scale-102 active:scale-98 shrink-0 whitespace-nowrap"
                    >
                      <RefreshCw size={15} className="shrink-0" />
                      <span>{language === 'ar' ? 'توليد تلقائي' : 'Auto Generate'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyPassword}
                      className="h-11 px-5 min-w-[105px] rounded-xl bg-white dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-2xs hover:scale-102 active:scale-98 shrink-0 whitespace-nowrap"
                    >
                      {isCopied ? <Check size={15} className="text-emerald-500 shrink-0" /> : <Copy size={15} className="shrink-0" />}
                      <span>{isCopied ? (language === 'ar' ? 'تم النسخ' : 'Copied') : (language === 'ar' ? 'نسخ' : 'Copy')}</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* 3. Sticky Bottom Action Footer (All in One Line with Generous Padding) */}
          <div
            className="border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 shrink-0 flex flex-row items-center justify-between gap-6 flex-nowrap"
            style={{ padding: '20px 36px' }}
          >
            {/* Delete Account Button on One Side */}
            <div className="shrink-0">
              <button
                type="button"
                disabled={isSelf}
                onClick={handleTriggerDelete}
                className="h-11 px-5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 font-bold text-xs sm:text-sm flex items-center gap-2.5 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs hover:scale-102 active:scale-98 shrink-0 whitespace-nowrap"
                title={isSelf ? (language === 'ar' ? 'الحساب الحالي مسجل للدخول ولا يمكن حذفه' : 'Current account cannot be deleted') : undefined}
              >
                <Trash2 size={16} />
                <span>{language === 'ar' ? 'حذف الحساب' : 'Delete Account'}</span>
              </button>
            </div>

            {/* Cancel & Save Changes Buttons in One Line on Other Side */}
            <div className="flex items-center gap-4 sm:gap-5 justify-end shrink-0 flex-nowrap">
              <button
                type="button"
                onClick={onClose}
                className="h-11 px-6 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-2xs hover:scale-102 active:scale-98 shrink-0 whitespace-nowrap"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>

              <button
                type="submit"
                form="admin-user-form"
                className="h-11 px-7 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2.5 shadow-md hover:shadow-purple-600/30 hover:scale-102 active:scale-98 transition-all cursor-pointer shrink-0 whitespace-nowrap"
              >
                <Save size={16} />
                <span>{language === 'ar' ? 'حفظ التعديلات' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText}
        cancelText={confirmConfig.cancelText}
        variant={confirmConfig.variant}
        icon={confirmConfig.icon}
      />
    </>
  );
}
