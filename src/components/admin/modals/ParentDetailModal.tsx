'use client';

import React, { useState } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Users,
  Plus,
  Unlink,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Calendar,
  Key,
  Copy,
  Check,
  RefreshCw,
  Eye,
  EyeOff,
  ShieldCheck,
  Search,
  Edit2,
  Save,
  ExternalLink,
} from 'lucide-react';
import { AdminParent, AdminStudent, EntityStatus } from '@/types/admin';
import { useAdmin } from '@/context/AdminContext';
import { useLanguage } from '@/context/LanguageContext';
import { generateAutoPassword } from '@/lib/utils';
import { setItem } from '@/lib/localStorage';
import { STORAGE_KEYS } from '@/lib/constants';

import { ConfirmModal } from './ConfirmModal';

interface ParentDetailModalProps {
  parent: AdminParent | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ParentDetailModal({ parent, isOpen, onClose }: ParentDetailModalProps) {
  const { parents, students, linkStudentToParent, unlinkStudentFromParent, updateParent } = useAdmin();
  const { isRTL, language } = useLanguage();

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

  const [isLinkingOpen, setIsLinkingOpen] = useState(false);
  const [selectedStudentToLink, setSelectedStudentToLink] = useState('');
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isFullCopied, setIsFullCopied] = useState(false);

  // Edit Parent Details State
  const [isEditing, setIsEditing] = useState(false);
  const [editNameAr, setEditNameAr] = useState('');
  const [editNameEn, setEditNameEn] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editStatus, setEditStatus] = useState<EntityStatus>('active');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const currentParent = parents.find((p) => p.id === parent?.id) || parent;

  React.useEffect(() => {
    if (currentParent) {
      setEditNameAr(currentParent.fullNameAr);
      setEditNameEn(currentParent.fullNameEn || '');
      setEditPhone(currentParent.phone);
      setEditEmail(currentParent.email);
      setEditAddress(currentParent.address || '');
      setEditStatus(currentParent.status || 'active');
    }
  }, [
    currentParent?.id,
    currentParent?.fullNameAr,
    currentParent?.fullNameEn,
    currentParent?.phone,
    currentParent?.email,
    currentParent?.address,
    currentParent?.status,
  ]);

  if (!isOpen || !currentParent) return null;

  const parentPhoneClean = (currentParent.phone || '').replace(/\D/g, '');
  const parentNameClean = (currentParent.fullNameAr || '').trim().toLowerCase();

  const linkedStudents = students.filter((s) => {
    if (currentParent.linkedStudentIds && currentParent.linkedStudentIds.includes(s.id)) return true;
    if (s.parentId && s.parentId === currentParent.id) return true;
    if (parentPhoneClean && s.parentPhone && s.parentPhone.replace(/\D/g, '') === parentPhoneClean) return true;
    if (parentNameClean && s.parentName && s.parentName.trim().toLowerCase() === parentNameClean) return true;
    return false;
  });

  const availableStudentsToLink = students.filter((s) => !linkedStudents.some((ls) => ls.id === s.id));

  const filteredAvailableStudents = availableStudentsToLink.filter((s) => {
    const q = studentSearchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      s.fullNameAr.toLowerCase().includes(q) ||
      s.fullNameEn.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q) ||
      s.groupName.toLowerCase().includes(q) ||
      s.cefrLevel.toLowerCase().includes(q)
    );
  });

  const selectedStudentObj = students.find((s) => s.id === selectedStudentToLink);

  const handleLinkStudent = () => {
    if (!selectedStudentToLink) return;
    linkStudentToParent(currentParent.id, selectedStudentToLink);
    setSelectedStudentToLink('');
    setStudentSearchTerm('');
    setIsLinkingOpen(false);
  };

  const handleSaveParentDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editNameAr.trim() || !editPhone.trim()) return;

    setConfirmConfig({
      isOpen: true,
      title: language === 'ar' ? 'تأكيد تعديل بيانات ولي الأمر' : 'Confirm Parent Profile Changes',
      message:
        language === 'ar'
          ? `هل أنت متأكد من حفظ التعديلات الجديدة لولي الأمر "${editNameAr}"؟ سيتم تحديث بيانات الاتصال والحساب فوراً.`
          : `Are you sure you want to save changes to "${editNameAr}"? Contact and profile details will be updated immediately.`,
      confirmText: language === 'ar' ? 'نعم، حفظ التعديلات' : 'Yes, Save Changes',
      cancelText: language === 'ar' ? 'إلغاء' : 'Cancel',
      variant: 'primary',
      icon: 'edit',
      onConfirm: () => {
        updateParent(currentParent.id, {
          fullNameAr: editNameAr.trim(),
          fullNameEn: editNameEn.trim() || editNameAr.trim(),
          phone: editPhone.trim(),
          email: editEmail.trim() || currentParent.email,
          address: editAddress.trim() || currentParent.address,
          status: editStatus,
        });

        setIsEditing(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      },
    });
  };

  const handleOpenParentPortalSession = () => {
    const parentAuthObj = {
      id: currentParent.id,
      fullNameAr: currentParent.fullNameAr,
      fullNameEn: currentParent.fullNameEn,
      phone: currentParent.phone,
      email: currentParent.email,
      password: currentParent.password || 'Awliya@2026',
      address: currentParent.address,
      linkedStudentIds: currentParent.linkedStudentIds,
    };
    setItem(STORAGE_KEYS.AUTH_USER, parentAuthObj);
    setItem(STORAGE_KEYS.AUTH_STATUS, 'logged_in');
    window.open('/', '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-fade-in-up flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div
          className="bg-slate-900 text-white flex items-center justify-between shrink-0"
          style={{ padding: '26px 36px' }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md shrink-0">
              {currentParent.fullNameAr[0]}
            </div>
            <div>
              <h3 className="text-xl font-black text-white">{currentParent.fullNameAr} ({currentParent.fullNameEn})</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                {language === 'ar' ? 'ملف ولي الأمر وإدارة الأبناء المربوطين' : 'Parent Profile & Linked Students Management'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div
          className={`overflow-y-auto flex-1 ${isRTL ? 'text-right' : 'text-left'}`}
          style={{ padding: '32px 36px' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* 1. Personal Information */}
            <div>
              <div className="flex items-center justify-between" style={{ marginBottom: '14px' }}>
                <h4
                  className="text-xs font-black text-slate-400 dark:text-slate-400 uppercase tracking-wider block"
                >
                  {language === 'ar' ? 'البيانات الشخصية لولي الأمر (Personal Information)' : 'Personal Information'}
                </h4>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleOpenParentPortalSession}
                    className="rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/50 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    style={{ height: '36px', padding: '0 14px' }}
                    title={language === 'ar' ? 'فتح بوابة ولي الأمر بهذا الحساب' : 'Open portal as this parent'}
                  >
                    <ExternalLink size={14} />
                    <span>{language === 'ar' ? 'معاينة البوابة كولي أمر' : 'Open as Parent'}</span>
                  </button>

                  {!isEditing && (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      style={{ height: '36px', padding: '0 14px' }}
                    >
                      <Edit2 size={13} />
                      <span>{language === 'ar' ? 'تعديل البيانات' : 'Edit Info'}</span>
                    </button>
                  )}
                </div>
              </div>

              {saveSuccess && (
                <div className="p-3 mb-4 rounded-2xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex items-center gap-2">
                  <Check size={16} />
                  <span>{language === 'ar' ? 'تم حفظ ومزامنة بيانات ولي الأمر بنجاح مع بوابة أولياء الأمور!' : 'Parent details saved and synced with Parent Portal!'}</span>
                </div>
              )}

              {isEditing ? (
                <form onSubmit={handleSaveParentDetails} className="space-y-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 p-5 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                        {language === 'ar' ? 'الاسم بالعربية *' : 'Full Name (Arabic) *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={editNameAr}
                        onChange={(e) => setEditNameAr(e.target.value)}
                        className="w-full text-xs sm:text-sm font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        style={{ padding: '11px 18px', minHeight: '44px' }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                        {language === 'ar' ? 'الاسم بالإنجليزية' : 'Full Name (English)'}
                      </label>
                      <input
                        type="text"
                        value={editNameEn}
                        onChange={(e) => setEditNameEn(e.target.value)}
                        className="w-full text-xs sm:text-sm font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        style={{ padding: '11px 18px', minHeight: '44px' }}
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                        {language === 'ar' ? 'رقم الهاتف *' : 'Phone Number *'}
                      </label>
                      <input
                        type="tel"
                        required
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full text-xs sm:text-sm font-bold font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        style={{ padding: '11px 18px', minHeight: '44px' }}
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                        {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                      </label>
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full text-xs sm:text-sm font-bold font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        style={{ padding: '11px 18px', minHeight: '44px' }}
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                        {language === 'ar' ? 'العنوان السكني' : 'Address'}
                      </label>
                      <input
                        type="text"
                        value={editAddress}
                        onChange={(e) => setEditAddress(e.target.value)}
                        className="w-full text-xs sm:text-sm font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        style={{ padding: '11px 18px', minHeight: '44px' }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                        {language === 'ar' ? 'حالة الحساب' : 'Account Status'}
                      </label>
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value as EntityStatus)}
                        className="w-full text-xs sm:text-sm font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                        style={{ padding: '11px 18px', minHeight: '44px' }}
                      >
                        <option value="active">{language === 'ar' ? 'نشط (Active)' : 'Active'}</option>
                        <option value="inactive">{language === 'ar' ? 'غير نشط (Inactive)' : 'Inactive'}</option>
                        <option value="pending">{language === 'ar' ? 'قيد الانتظار (Pending)' : 'Pending'}</option>
                      </select>
                    </div>
                  </div>

                  <div
                    className="flex items-center justify-end gap-3.5 border-t border-slate-200/80 dark:border-slate-700/80"
                    style={{ marginTop: '24px', paddingTop: '18px' }}
                  >
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm cursor-pointer transition-colors flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700 shadow-2xs"
                      style={{
                        padding: '10px 24px',
                        borderRadius: '12px',
                        minHeight: '42px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {language === 'ar' ? 'إلغاء' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all hover:opacity-95 active:scale-98 shrink-0"
                      style={{
                        padding: '10px 28px',
                        borderRadius: '12px',
                        minHeight: '42px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <Save size={16} className="shrink-0" />
                      <span>{language === 'ar' ? 'حفظ التعديلات' : 'Save Changes'}</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div
                    className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800"
                    style={{ padding: '18px 22px' }}
                  >
                    <span className="text-xs text-slate-400 block mb-1.5 font-bold">{language === 'ar' ? 'رقم الهاتف:' : 'Phone Number:'}</span>
                    <span className="font-mono font-black text-slate-900 dark:text-white text-sm" dir="ltr">{currentParent.phone}</span>
                  </div>
                  <div
                    className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800"
                    style={{ padding: '18px 22px' }}
                  >
                    <span className="text-xs text-slate-400 block mb-1.5 font-bold">{language === 'ar' ? 'البريد الإلكتروني:' : 'Email:'}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white text-xs truncate block">{currentParent.email}</span>
                  </div>
                  <div
                    className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800"
                    style={{ padding: '18px 22px' }}
                  >
                    <span className="text-xs text-slate-400 block mb-1.5 font-bold">{language === 'ar' ? 'العنوان السكني:' : 'Address:'}</span>
                    <span className="font-bold text-slate-900 dark:text-white text-xs truncate block">{currentParent.address || 'الجزائر العاصمة'}</span>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Account Login Credentials Card */}
            <div
              className="rounded-3xl bg-gradient-to-r from-purple-50/90 via-indigo-50/60 to-purple-50/90 dark:from-purple-950/50 dark:via-indigo-950/40 dark:to-purple-950/50 border border-purple-200/90 dark:border-purple-800/70 shadow-xs"
              style={{ padding: '26px 30px' }}
            >
              {/* Header row with Title and Copy Full Credentials */}
              <div
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                style={{ marginBottom: '20px' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs shrink-0">
                    <Key size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-purple-950 dark:text-purple-100">
                      {language === 'ar' ? 'بيانات دخول ولي الأمر إلى البوابة (Parent Portal Credentials)' : 'Parent Portal Login Credentials'}
                    </h4>
                    <p className="text-xs text-purple-700/80 dark:text-purple-300/80 font-medium mt-0.5">
                      {language === 'ar' ? 'كلمة المرور الحالية لحساب ولي الأمر المعتمدة في النظام' : 'Current active portal password for this parent'}
                    </p>
                  </div>
                </div>

                {/* Copy Full Credentials */}
                <button
                  type="button"
                  onClick={() => {
                    const currentPass = currentParent.password || 'Awliya@2026';
                    const text = `${language === 'ar' ? 'بيانات الدخول لبوابة أولياء الأمور' : 'Parent Portal Login'}\n` +
                      `👤 ${language === 'ar' ? 'الاسم' : 'Name'}: ${currentParent.fullNameAr}\n` +
                      `📱 ${language === 'ar' ? 'الهاتف' : 'Phone'}: ${currentParent.phone}\n` +
                      `📧 ${language === 'ar' ? 'البريد' : 'Email'}: ${currentParent.email}\n` +
                      `🔑 ${language === 'ar' ? 'كلمة المرور' : 'Password'}: ${currentPass}`;
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(text);
                      setIsFullCopied(true);
                      setTimeout(() => setIsFullCopied(false), 2000);
                    }
                  }}
                  className={`rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer shadow-2xs shrink-0 whitespace-nowrap ${
                    isFullCopied
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'bg-white dark:bg-slate-900 hover:bg-purple-50 dark:hover:bg-purple-950/60 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:scale-105 active:scale-95'
                  }`}
                  style={{ height: '42px', padding: '0 18px' }}
                >
                  {isFullCopied ? <Check size={15} /> : <ShieldCheck size={15} />}
                  <span>{isFullCopied ? (language === 'ar' ? 'تم نسخ كامل البيانات' : 'Credentials Copied!') : (language === 'ar' ? 'نسخ بيانات الدخول كاملة' : 'Copy Full Credentials')}</span>
                </button>
              </div>

              {/* Password field and action buttons row */}
              <div
                className="flex flex-col sm:flex-row items-stretch sm:items-center"
                style={{ gap: '12px' }}
              >
                {/* Password display pill */}
                <div
                  className="flex-1 flex items-center gap-3 bg-white dark:bg-slate-900 border border-purple-200/90 dark:border-purple-800 rounded-xl shadow-2xs"
                  style={{ height: '46px', padding: '0 16px' }}
                >
                  <span className="text-xs text-slate-400 font-bold shrink-0">
                    {language === 'ar' ? 'كلمة المرور:' : 'Password:'}
                  </span>
                  <span className="flex-1 font-mono font-bold text-slate-900 dark:text-white text-xs sm:text-sm tracking-wider" dir="ltr">
                    {showPassword ? (currentParent.password || 'Awliya@2026') : '••••••••••••'}
                  </span>

                  {/* Show/Hide Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer p-1.5 shrink-0 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Copy Single Password Button */}
                <button
                  type="button"
                  onClick={() => {
                    const pass = currentParent.password || 'Awliya@2026';
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(pass);
                      setIsCopied(true);
                      setTimeout(() => setIsCopied(false), 2000);
                    }
                  }}
                  className={`rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                    isCopied
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'bg-purple-600 hover:bg-purple-700 border-purple-600 text-white shadow-xs hover:scale-105 active:scale-95'
                  }`}
                  style={{ height: '46px', padding: '0 18px' }}
                >
                  {isCopied ? <Check size={15} /> : <Copy size={15} />}
                  <span>{isCopied ? (language === 'ar' ? 'تم النسخ' : 'Copied') : (language === 'ar' ? 'نسخ الرمز' : 'Copy')}</span>
                </button>

                {/* Regenerate Password Button */}
                <button
                  type="button"
                  onClick={() => {
                    setConfirmConfig({
                      isOpen: true,
                      title: language === 'ar' ? 'إعادة تعيين كلمة مرور ولي الأمر' : 'Reset Parent Password',
                      message:
                        language === 'ar'
                          ? `هل أنت متأكد من رغبتك في توليد وتعيين كلمة مرور جديدة لـ "${currentParent.fullNameAr}"؟ سيتعين على ولي الأمر استخدام الرمز الجديد لتسجيل الدخول.`
                          : `Are you sure you want to generate a new password for "${currentParent.fullNameAr}"? The parent will need to use this new credential to log in.`,
                      confirmText: language === 'ar' ? 'نعم، تعيين كلمة مرور جديدة' : 'Yes, Reset Password',
                      cancelText: language === 'ar' ? 'إلغاء' : 'Cancel',
                      variant: 'warning',
                      icon: 'alert',
                      onConfirm: () => {
                        const newPass = generateAutoPassword();
                        updateParent(currentParent.id, { password: newPass });
                        setIsCopied(false);
                      },
                    });
                  }}
                  title={language === 'ar' ? 'توليد وتعيين كلمة مرور جديدة تلقائياً' : 'Auto generate and set new password'}
                  className="bg-white dark:bg-slate-900 hover:bg-purple-50 dark:hover:bg-purple-950/50 border border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer hover:scale-105 active:scale-95 shrink-0 whitespace-nowrap shadow-2xs"
                  style={{ height: '46px', padding: '0 18px' }}
                >
                  <RefreshCw size={15} />
                  <span>{language === 'ar' ? 'توليد كلمة جديدة' : 'Reset Password'}</span>
                </button>
              </div>
            </div>

            {/* 3. Linked Students List */}
            <div>
              <div className="flex items-center justify-between" style={{ marginBottom: '16px' }}>
                <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Users size={18} className="text-purple-600" />
                  <span>{language === 'ar' ? `الأبناء المسجلين في المنصة (${linkedStudents.length})` : `Linked Students (${linkedStudents.length})`}</span>
                </h4>

                <button
                  type="button"
                  onClick={() => setIsLinkingOpen(!isLinkingOpen)}
                  className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs flex items-center justify-center gap-2.5 transition-all shadow-xs cursor-pointer hover:scale-105 active:scale-95 whitespace-nowrap shrink-0"
                  style={{ height: '42px', padding: '0 22px', minWidth: 'max-content' }}
                >
                  <Plus size={16} className="shrink-0" />
                  <span>{language === 'ar' ? 'ربط طالب جديد' : 'Link Student'}</span>
                </button>
              </div>

            {/* Link Student Searchable Selection Box */}
            {isLinkingOpen && (
              <div
                className="rounded-3xl bg-purple-50/90 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 animate-fade-in shadow-xs"
                style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}
              >
                {/* Header row */}
                <div className="flex items-center justify-between" style={{ marginBottom: '2px' }}>
                  <span className="text-xs font-black text-purple-950 dark:text-purple-200 block">
                    {language === 'ar' ? 'البحث عن طالب لربطه بحساب ولي الأمر:' : 'Search & Select Student to Link:'}
                  </span>
                  <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400">
                    {availableStudentsToLink.length} {language === 'ar' ? 'طالب متاح' : 'available students'}
                  </span>
                </div>

                {/* Search Input Field */}
                <div className="relative flex items-center">
                  <div
                    className="absolute text-purple-600 dark:text-purple-400 pointer-events-none flex items-center justify-center"
                    style={{ [isRTL ? 'right' : 'left']: '16px' }}
                  >
                    <Search size={18} />
                  </div>
                  <input
                    type="text"
                    value={studentSearchTerm}
                    onChange={(e) => setStudentSearchTerm(e.target.value)}
                    placeholder={language === 'ar' ? 'ابدأ بكتابة اسم الطالب، الفوج، أو المستوى...' : 'Type student name, group, or CEFR level to search...'}
                    className="w-full bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-700 rounded-xl text-xs sm:text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 transition-all focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 shadow-2xs"
                    style={{
                      height: '48px',
                      paddingLeft: isRTL ? '44px' : '50px',
                      paddingRight: isRTL ? '50px' : '44px',
                    }}
                  />
                  {studentSearchTerm && (
                    <button
                      type="button"
                      onClick={() => setStudentSearchTerm('')}
                      className="absolute text-slate-400 hover:text-slate-600 dark:hover:text-white p-1.5 cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                      style={{ [isRTL ? 'left' : 'right']: '12px' }}
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>

                {/* Available Students List: Shown immediately */}
                <div
                  className="max-h-56 overflow-y-auto rounded-2xl border border-purple-200/90 dark:border-purple-800/70 bg-white dark:bg-slate-900 shadow-sm animate-fade-in"
                  style={{ padding: '14px 16px', marginTop: '4px' }}
                >
                  <div
                    className="text-[11px] font-bold text-slate-400 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between"
                    style={{ paddingBottom: '10px', marginBottom: '12px' }}
                  >
                    <span>{language === 'ar' ? 'الطلاب المتاحين للربط:' : 'Available Students to Link:'}</span>
                    <span className="font-mono text-purple-600 dark:text-purple-400 font-bold">{filteredAvailableStudents.length}</span>
                  </div>

                  {filteredAvailableStudents.length === 0 ? (
                    <div className="py-8 text-center text-xs font-bold text-slate-400">
                      {language === 'ar' ? 'لا يوجد طلاب متاحين للربط أو مطابقين للبحث' : 'No available students to link'}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredAvailableStudents.map((s) => {
                        const isSelected = selectedStudentToLink === s.id;
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => {
                              setSelectedStudentToLink(isSelected ? '' : s.id);
                            }}
                            className={`w-full flex items-center justify-between transition-all cursor-pointer ${
                              isRTL ? 'text-right' : 'text-left'
                            } ${
                              isSelected
                                ? 'bg-purple-600 text-white shadow-xs'
                                : 'hover:bg-purple-50 dark:hover:bg-purple-950/60 text-slate-800 dark:text-slate-200 bg-slate-50/70 dark:bg-slate-850/60'
                            }`}
                            style={{ padding: '12px 14px', borderRadius: '14px' }}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                                  isSelected ? 'bg-white/20 text-white' : 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300'
                                }`}
                              >
                                {s.fullNameAr[0]}
                              </div>
                              <div className="min-w-0">
                                <span className="font-black text-xs sm:text-sm block truncate">
                                  {s.fullNameAr} ({s.fullNameEn})
                                </span>
                                <span className={`text-[11px] block truncate font-medium mt-0.5 ${isSelected ? 'text-purple-100' : 'text-slate-400'}`}>
                                  {s.groupName} • {s.teacherName}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2.5 shrink-0">
                              <span
                                className={`inline-flex items-center justify-center font-mono text-xs font-bold transition-all ${
                                  isSelected ? 'bg-white/20 text-white' : 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                                }`}
                                style={{
                                  padding: '4px 12px',
                                  minWidth: '38px',
                                  borderRadius: '8px',
                                  lineHeight: '1.2',
                                }}
                              >
                                {s.cefrLevel}
                              </span>
                              {isSelected && <Check size={16} strokeWidth={3} className="text-white" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Selected Action Bar */}
                {selectedStudentObj && (
                  <div
                    className="flex items-center justify-between rounded-2xl bg-purple-100/90 dark:bg-purple-950/90 border border-purple-300 dark:border-purple-700 animate-fade-in shadow-xs"
                    style={{ padding: '16px 20px', marginTop: '6px' }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {selectedStudentObj.fullNameAr[0]}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs sm:text-sm font-black text-purple-950 dark:text-purple-100 truncate block">
                          {selectedStudentObj.fullNameAr} ({selectedStudentObj.fullNameEn})
                        </span>
                        <span className="text-[11px] text-purple-700 dark:text-purple-300 font-medium truncate block mt-0.5">
                          {selectedStudentObj.groupName} • Level {selectedStudentObj.cefrLevel}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        type="button"
                        onClick={() => setSelectedStudentToLink('')}
                        className="rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white cursor-pointer hover:bg-white/50 dark:hover:bg-slate-800/60 transition-colors whitespace-nowrap"
                        style={{ height: '44px', padding: '0 18px', minWidth: 'max-content' }}
                      >
                        {language === 'ar' ? 'تغيير' : 'Change'}
                      </button>
                      <button
                        type="button"
                        onClick={handleLinkStudent}
                        className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95 whitespace-nowrap flex items-center justify-center"
                        style={{ height: '44px', padding: '0 24px', minWidth: 'max-content' }}
                      >
                        <span>{language === 'ar' ? 'تأكيد الربط الآن' : 'Confirm Link Now'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Linked Students Cards */}
            <div className="space-y-3">
              {linkedStudents.length === 0 ? (
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700 text-center space-y-2">
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    {language === 'ar' ? 'لا يوجد أي طالب مربوط بهذا الحساب حالياً.' : 'No students linked to this parent account yet.'}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {language === 'ar' ? 'اضغط على زر "ربط طالب جديد" أعلاه لاختيار وربط الطلاب مباشرة.' : 'Click "Link Student" above to select and link students directly.'}
                  </p>
                </div>
              ) : (
                linkedStudents.map((st) => (
                  <div
                    key={st.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {st.fullNameAr} ({st.fullNameEn})
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 font-mono font-bold text-[11px]">
                          Level: {st.cefrLevel}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-0.5">
                        <div>• Group: <span className="font-semibold text-slate-800 dark:text-slate-200">{st.groupName}</span></div>
                        <div>• Teacher: <span className="font-semibold text-slate-800 dark:text-slate-200">{st.teacherName}</span></div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-center p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 min-w-[70px]">
                        <span className="text-[10px] text-slate-400 block font-bold">{language === 'ar' ? 'التقدم' : 'Progress'}</span>
                        <span className="font-mono font-bold text-xs text-purple-600">{st.overallProgress}%</span>
                      </div>
                      <div className="text-center p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 min-w-[70px]">
                        <span className="text-[10px] text-slate-400 block font-bold">{language === 'ar' ? 'الحضور' : 'Attendance'}</span>
                        <span className="font-mono font-bold text-xs text-emerald-600">{st.attendanceRate}%</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setConfirmConfig({
                            isOpen: true,
                            title: language === 'ar' ? 'تأكيد إلغاء ربط الطالب' : 'Confirm Unlink Student',
                            message:
                              language === 'ar'
                                ? `هل أنت متأكد من رغبتك في إلغاء ربط الطالب "${st.fullNameAr}" من حساب ولي الأمر "${currentParent.fullNameAr}"؟ لن يتمكن ولي الأمر من متابعة هذا الطالب في البوابة.`
                                : `Are you sure you want to unlink student "${st.fullNameAr}" from "${currentParent.fullNameAr}"? The parent will no longer see this student in their portal.`,
                            confirmText: language === 'ar' ? 'نعم، إلغاء الربط' : 'Yes, Unlink Student',
                            cancelText: language === 'ar' ? 'تراجع' : 'Cancel',
                            variant: 'danger',
                            icon: 'trash',
                            onConfirm: () => {
                              unlinkStudentFromParent(currentParent.id, st.id);
                            },
                          });
                        }}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title={language === 'ar' ? 'إلغاء ربط الطالب' : 'Unlink student'}
                      >
                        <Unlink size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText}
        cancelText={confirmConfig.cancelText}
        variant={confirmConfig.variant}
        icon={confirmConfig.icon}
        onConfirm={confirmConfig.onConfirm}
        onClose={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
