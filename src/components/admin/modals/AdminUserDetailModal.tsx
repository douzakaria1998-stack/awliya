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
      language === 'ar' ? 'تم إنشاء كلمة مرور قوية جديدة' : 'New strong password generated'
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
          ? `هل أنت متأكد من حفظ التعديلات على حساب "${fullNameAr}"؟`
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-fade-in select-none">
        <div
          className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl border border-slate-200/80 dark:border-slate-800 animate-fade-in-up flex flex-col max-h-[90vh] overflow-hidden"
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          {/* Modal Header */}
          <div
            className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 shrink-0"
            style={{ padding: '20px 28px' }}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black shadow-xs shrink-0 ${
                  role === 'super_admin'
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300'
                    : role === 'administrator'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300'
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300'
                }`}
              >
                {role === 'super_admin' ? <Crown size={22} /> : role === 'administrator' ? <Shield size={22} /> : <GraduationCap size={22} />}
              </div>
              <div>
                <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white leading-tight">
                  {language === 'ar' ? 'تعديل الحساب الإداري' : language === 'fr' ? 'Modifier le Compte Admin' : 'Edit Admin Account'}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
                    @{currentUser.username}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="text-[11px] font-bold text-slate-400">
                    {currentUser.departmentAr}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Modal Body: Scrollable Form */}
          <form onSubmit={handleTriggerSave} className="flex-1 overflow-y-auto" style={{ padding: '24px 28px' }}>
            <div className="space-y-5">
              {/* Names row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    {language === 'ar' ? 'الاسم الكامل بالعربية' : 'Full Name (Arabic)'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullNameAr}
                    onChange={(e) => setFullNameAr(e.target.value)}
                    className="w-full h-11 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    {language === 'ar' ? 'الاسم باللاتينية / الإنجليزية' : 'Full Name (Latin/English)'}
                  </label>
                  <input
                    type="text"
                    value={fullNameEn}
                    onChange={(e) => setFullNameEn(e.target.value)}
                    className="w-full h-11 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              {/* Username & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    {language === 'ar' ? 'اسم المستخدم (Username)' : 'Username'} *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full h-11 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 text-xs sm:text-sm font-mono font-bold text-purple-600 dark:text-purple-400 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'} *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-11 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 text-xs sm:text-sm font-mono font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Phone & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    {language === 'ar' ? 'رقم الهاتف والتواصل' : 'Phone Number'}
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    dir="ltr"
                    className="w-full h-11 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 text-xs sm:text-sm font-mono font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    {language === 'ar' ? 'القسم / التخصص' : 'Department / Role'}
                  </label>
                  <input
                    type="text"
                    value={departmentAr}
                    onChange={(e) => setDepartmentAr(e.target.value)}
                    className="w-full h-11 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              {/* Role Selection & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    {language === 'ar' ? 'الدور والصلاحية (Role)' : 'Role'}
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as AdminRole)}
                    className="w-full h-11 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
                  >
                    <option value="super_admin">{language === 'ar' ? 'مدير عام (Super Admin)' : 'Super Admin'}</option>
                    <option value="administrator">{language === 'ar' ? 'مدير عمليات (Administrator)' : 'Administrator'}</option>
                    <option value="teacher">{language === 'ar' ? 'معلم (Teacher)' : 'Teacher'}</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    {language === 'ar' ? 'حالة الحساب' : 'Account Status'}
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full h-11 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
                  >
                    <option value="active">{language === 'ar' ? 'نشط (Active)' : 'Active'}</option>
                    <option value="inactive">{language === 'ar' ? 'معطل (Inactive)' : 'Inactive'}</option>
                    <option value="suspended">{language === 'ar' ? 'موقوف مؤقتاً (Suspended)' : 'Suspended'}</option>
                  </select>
                </div>
              </div>

              {/* Password Management & Security Section */}
              <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-900/50">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <KeyRound size={16} className="text-purple-600 dark:text-purple-400" />
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      {language === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}
                    </span>
                  </div>
                  {feedbackMessage && (
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 animate-fade-in">
                      {feedbackMessage}
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <div className="relative flex-1 w-full">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 text-xs sm:text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1"
                      style={{
                        right: isRTL ? 'auto' : '10px',
                        left: isRTL ? '10px' : 'auto',
                      }}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleGeneratePassword}
                      className="flex-1 sm:flex-none h-10 px-3.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                    >
                      <RefreshCw size={14} />
                      <span>{language === 'ar' ? 'توليد تلقائي' : 'Auto Generate'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyPassword}
                      className="h-10 px-3.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                    >
                      {isCopied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                      <span>{isCopied ? (language === 'ar' ? 'تم النسخ' : 'Copied') : (language === 'ar' ? 'نسخ' : 'Copy')}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Danger Zone: Delete Account */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-rose-600 dark:text-rose-400">
                    {language === 'ar' ? 'منطقة الحذف' : 'Danger Zone'}
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">
                    {isSelf
                      ? language === 'ar'
                        ? 'الحساب الحالي نشط ولا يمكن حذفه'
                        : 'Currently logged in account cannot be deleted'
                      : language === 'ar'
                      ? 'حذف هذا الحساب سيزيل صلاحيات الوصول نهائياً'
                      : 'Deleting this account revokes all administrative access'}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isSelf}
                  onClick={handleTriggerDelete}
                  className="px-3.5 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Trash2 size={14} />
                  <span>{language === 'ar' ? 'حذف الحساب' : 'Delete Account'}</span>
                </button>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 shadow-md hover:shadow-purple-600/30 transition-all cursor-pointer"
              >
                <Save size={15} />
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
