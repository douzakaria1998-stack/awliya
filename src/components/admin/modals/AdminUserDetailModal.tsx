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

  const handleTriggerSave = (e: React.FormEvent) => {
    e.preventDefault();
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
          className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl border border-slate-200/80 dark:border-slate-800 animate-fade-in-up flex flex-col max-h-[92vh] overflow-hidden"
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          {/* 1. Modal Header with clean badge and generous padding */}
          <div
            className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50/50 dark:bg-slate-900/50"
            style={{ padding: '22px 32px' }}
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black shadow-xs shrink-0 ${
                  role === 'super_admin'
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 border border-purple-300 dark:border-purple-800/60'
                    : role === 'administrator'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-300 dark:border-blue-800/60'
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60'
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
                <div className="flex items-center gap-2 mt-1">
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

          {/* 2. Modal Body: Scrollable with Spacious Sections */}
          <form onSubmit={handleTriggerSave} className="flex-1 overflow-y-auto flex flex-col justify-between" style={{ padding: '28px 32px' }}>
            <div className="space-y-6">
              {/* Section: Names */}
              <div className="space-y-4">
                <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {language === 'ar' ? 'البيانات الشخصية والتعريف' : 'Identity & Personal Info'}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                      {language === 'ar' ? 'الاسم الكامل بالعربية' : 'Full Name (Arabic)'} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullNameAr}
                      onChange={(e) => setFullNameAr(e.target.value)}
                      className="w-full h-11 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 transition-colors shadow-2xs"
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
                      className="w-full h-11 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 transition-colors shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* Section: Credentials & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                    {language === 'ar' ? 'اسم المستخدم (Username)' : 'Username'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full h-11 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-xs sm:text-sm font-mono font-bold text-purple-600 dark:text-purple-400 focus:outline-none focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 transition-colors shadow-2xs"
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
                    className="w-full h-11 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-xs sm:text-sm font-mono font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 transition-colors shadow-2xs"
                  />
                </div>
              </div>

              {/* Section: Phone & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                    {language === 'ar' ? 'رقم الهاتف والتواصل' : 'Phone Number'}
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    dir="ltr"
                    className="w-full h-11 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-xs sm:text-sm font-mono font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 transition-colors shadow-2xs"
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
                    className="w-full h-11 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 transition-colors shadow-2xs"
                  />
                </div>
              </div>

              {/* Section: Role & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                    {language === 'ar' ? 'الدور والصلاحية (Role)' : 'Role'}
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as AdminRole)}
                    className="w-full h-11 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 transition-colors cursor-pointer shadow-2xs"
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
                    className="w-full h-11 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 focus:bg-white dark:focus:bg-slate-800 transition-colors cursor-pointer shadow-2xs"
                  >
                    <option value="active">{language === 'ar' ? 'نشط (Active)' : 'Active'}</option>
                    <option value="inactive">{language === 'ar' ? 'معطل (Inactive)' : 'Inactive'}</option>
                    <option value="suspended">{language === 'ar' ? 'موقوف مؤقتاً (Suspended)' : 'Suspended'}</option>
                  </select>
                </div>
              </div>

              {/* Section: Password Management in Dedicated Card */}
              <div className="p-5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-900/60 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-xs">
                      <KeyRound size={14} />
                    </div>
                    <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                      {language === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}
                    </span>
                  </div>
                  {feedbackMessage && (
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800 animate-fade-in">
                      {feedbackMessage}
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative flex-1 w-full">
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

                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                    <button
                      type="button"
                      onClick={handleGeneratePassword}
                      className="flex-1 sm:flex-none h-11 px-4 rounded-xl bg-white dark:bg-slate-850 hover:bg-purple-50 dark:hover:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs hover:scale-102 active:scale-98"
                    >
                      <RefreshCw size={14} />
                      <span>{language === 'ar' ? 'توليد تلقائي' : 'Auto Generate'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyPassword}
                      className="h-11 px-4 rounded-xl bg-white dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs hover:scale-102 active:scale-98"
                    >
                      {isCopied ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
                      <span>{isCopied ? (language === 'ar' ? 'تم النسخ' : 'Copied') : (language === 'ar' ? 'نسخ' : 'Copy')}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Section: Danger Zone in Separate Spacious Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs sm:text-sm font-black text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle size={15} />
                    <span>{language === 'ar' ? 'منطقة الحذف والتعطيل' : 'Danger Zone'}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    {isSelf
                      ? language === 'ar'
                        ? 'الحساب الحالي نشط ومسجل للدخول ولا يمكن حذفه'
                        : 'Currently logged in account cannot be deleted'
                      : language === 'ar'
                      ? 'حذف هذا الحساب سيزيل صلاحيات الوصول وبياناته الإدارية نهائياً'
                      : 'Permanently removes this administrative account and access'}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isSelf}
                  onClick={handleTriggerDelete}
                  className="px-4 py-2.5 rounded-xl text-rose-600 dark:text-rose-300 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 dark:hover:text-white border border-rose-300 dark:border-rose-800 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs shrink-0"
                >
                  <Trash2 size={15} />
                  <span>{language === 'ar' ? 'حذف الحساب' : 'Delete Account'}</span>
                </button>
              </div>
            </div>

            {/* 3. Sticky Footer Actions with clear spacing and distinct buttons */}
            <div className="flex items-center justify-end gap-3 mt-8 pt-5 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm transition-colors cursor-pointer shadow-2xs"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>

              <button
                type="submit"
                className="px-7 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md hover:shadow-purple-600/30 hover:scale-102 active:scale-98 transition-all cursor-pointer"
              >
                <Save size={16} />
                <span>{language === 'ar' ? 'حفظ التعديلات' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
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
