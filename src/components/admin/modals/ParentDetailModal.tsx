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
} from 'lucide-react';
import { AdminParent, AdminStudent } from '@/types/admin';
import { useAdmin } from '@/context/AdminContext';
import { useLanguage } from '@/context/LanguageContext';
import { generateAutoPassword } from '@/lib/utils';

interface ParentDetailModalProps {
  parent: AdminParent | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ParentDetailModal({ parent, isOpen, onClose }: ParentDetailModalProps) {
  const { students, linkStudentToParent, unlinkStudentFromParent, updateParent } = useAdmin();
  const { isRTL, language } = useLanguage();

  const [isLinkingOpen, setIsLinkingOpen] = useState(false);
  const [selectedStudentToLink, setSelectedStudentToLink] = useState('');
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isFullCopied, setIsFullCopied] = useState(false);

  if (!isOpen || !parent) return null;

  const linkedStudents = students.filter((s) => parent.linkedStudentIds.includes(s.id));
  const availableStudentsToLink = students.filter((s) => !parent.linkedStudentIds.includes(s.id));

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
    linkStudentToParent(parent.id, selectedStudentToLink);
    setSelectedStudentToLink('');
    setStudentSearchTerm('');
    setIsLinkingOpen(false);
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
              {parent.fullNameAr[0]}
            </div>
            <div>
              <h3 className="text-xl font-black text-white">{parent.fullNameAr} ({parent.fullNameEn})</h3>
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
              <h4
                className="text-xs font-black text-slate-400 dark:text-slate-400 uppercase tracking-wider block"
                style={{ marginBottom: '14px' }}
              >
                {language === 'ar' ? 'البيانات الشخصية لولي الأمر (Personal Information)' : 'Personal Information'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div
                  className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800"
                  style={{ padding: '18px 22px' }}
                >
                  <span className="text-xs text-slate-400 block mb-1.5 font-bold">{language === 'ar' ? 'رقم الهاتف:' : 'Phone Number:'}</span>
                  <span className="font-mono font-black text-slate-900 dark:text-white text-sm" dir="ltr">{parent.phone}</span>
                </div>
                <div
                  className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800"
                  style={{ padding: '18px 22px' }}
                >
                  <span className="text-xs text-slate-400 block mb-1.5 font-bold">{language === 'ar' ? 'البريد الإلكتروني:' : 'Email:'}</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white text-xs truncate block">{parent.email}</span>
                </div>
                <div
                  className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800"
                  style={{ padding: '18px 22px' }}
                >
                  <span className="text-xs text-slate-400 block mb-1.5 font-bold">{language === 'ar' ? 'العنوان السكني:' : 'Address:'}</span>
                  <span className="font-bold text-slate-900 dark:text-white text-xs truncate block">{parent.address || 'الجزائر العاصمة'}</span>
                </div>
              </div>
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
                    const currentPass = parent.password || 'Awliya@2026';
                    const text = `${language === 'ar' ? 'بيانات الدخول لبوابة أولياء الأمور' : 'Parent Portal Login'}\n` +
                      `👤 ${language === 'ar' ? 'الاسم' : 'Name'}: ${parent.fullNameAr}\n` +
                      `📱 ${language === 'ar' ? 'الهاتف' : 'Phone'}: ${parent.phone}\n` +
                      `📧 ${language === 'ar' ? 'البريد' : 'Email'}: ${parent.email}\n` +
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
                    {showPassword ? (parent.password || 'Awliya@2026') : '••••••••••••'}
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
                    const pass = parent.password || 'Awliya@2026';
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
                    const newPass = generateAutoPassword();
                    updateParent(parent.id, { password: newPass });
                    setIsCopied(false);
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

                {/* Filtered Students List: ONLY SHOWN WHEN USER TYPES */}
                {studentSearchTerm.trim().length > 0 && (
                  <div
                    className="max-h-56 overflow-y-auto rounded-2xl border border-purple-200/90 dark:border-purple-800/70 bg-white dark:bg-slate-900 shadow-sm animate-fade-in"
                    style={{ padding: '14px 16px', marginTop: '4px' }}
                  >
                    <div
                      className="text-[11px] font-bold text-slate-400 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between"
                      style={{ paddingBottom: '10px', marginBottom: '12px' }}
                    >
                      <span>{language === 'ar' ? 'نتائج البحث المطابقة:' : 'Matching Search Results:'}</span>
                      <span className="font-mono text-purple-600 dark:text-purple-400 font-bold">{filteredAvailableStudents.length}</span>
                    </div>

                    {filteredAvailableStudents.length === 0 ? (
                      <div className="py-8 text-center text-xs font-bold text-slate-400">
                        {language === 'ar' ? 'لا يوجد أي طالب مطابق لبحثك' : 'No students matching your search'}
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
                                if (!isSelected) {
                                  setStudentSearchTerm('');
                                }
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
                                  className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold ${
                                    isSelected ? 'bg-white/20 text-white' : 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                                  }`}
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
                )}

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

                    <div className="flex items-center gap-2.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setSelectedStudentToLink('')}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white cursor-pointer hover:bg-white/40"
                      >
                        {language === 'ar' ? 'تغيير' : 'Change'}
                      </button>
                      <button
                        type="button"
                        onClick={handleLinkStudent}
                        className="h-10 px-5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95 whitespace-nowrap"
                      >
                        {language === 'ar' ? 'تأكيد الربط الآن' : 'Confirm Link Now'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Linked Students Cards (Section 7 in PDF: Level, Group, Teacher, Progress, Attendance) */}
            <div className="space-y-3">
              {linkedStudents.map((st) => (
                <div
                  key={st.id}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-slate-900 dark:text-white">
                        {st.fullNameAr} ({st.fullNameEn})
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 font-mono font-bold text-xs">
                        Level: {st.cefrLevel}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 space-y-0.5">
                      <div>• Group: <span className="font-semibold text-slate-800 dark:text-slate-200">{st.groupName}</span></div>
                      <div>• Teacher: <span className="font-semibold text-slate-800 dark:text-slate-200">{st.teacherName}</span></div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-center p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 min-w-[80px]">
                      <span className="text-[10px] text-slate-400 block font-bold">{language === 'ar' ? 'التقدم' : 'Progress'}</span>
                      <span className="font-mono font-black text-sm text-purple-600">{st.overallProgress}%</span>
                    </div>
                    <div className="text-center p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 min-w-[80px]">
                      <span className="text-[10px] text-slate-400 block font-bold">{language === 'ar' ? 'الحضور' : 'Attendance'}</span>
                      <span className="font-mono font-black text-sm text-emerald-600">{st.attendanceRate}%</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => unlinkStudentFromParent(parent.id, st.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title={language === 'ar' ? 'إلغاء ربط الطالب' : 'Unlink student'}
                    >
                      <Unlink size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}
