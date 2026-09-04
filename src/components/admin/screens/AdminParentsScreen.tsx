'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Users,
  Phone,
  Mail,
  MoreVertical,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  PlusCircle,
  X,
  Key,
  RefreshCw,
  Copy,
  Check,
  Eye,
  EyeOff,
  Sparkles,
  UserPlus,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useLanguage } from '@/context/LanguageContext';
import { AdminParent } from '@/types/admin';
import { generateAutoPassword, formatChildrenCount } from '@/lib/utils';
import { ParentDetailModal } from '../modals/ParentDetailModal';

export function AdminParentsScreen() {
  const { visibleParents, students, addParent } = useAdmin();
  const { isRTL, language } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParent, setSelectedParent] = useState<AdminParent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Parent Form State
  const [isAddParentOpen, setIsAddParentOpen] = useState(false);
  const [newNameAr, setNewNameAr] = useState('');
  const [newNameEn, setNewNameEn] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newPassword, setNewPassword] = useState(() => generateAutoPassword());
  const [showPassword, setShowPassword] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  const filteredParents = useMemo(() => {
    return visibleParents.filter((p) => {
      const q = searchQuery.toLowerCase();
      return (
        p.fullNameAr.toLowerCase().includes(q) ||
        p.fullNameEn.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        p.email.toLowerCase().includes(q)
      );
    });
  }, [visibleParents, searchQuery]);

  const handleOpenParent = (parent: AdminParent) => {
    setSelectedParent(parent);
    setIsModalOpen(true);
  };

  const handleOpenAddParent = () => {
    setNewNameAr('');
    setNewNameEn('');
    setNewPhone('');
    setNewEmail('');
    setNewAddress('');
    setNewPassword(generateAutoPassword());
    setShowPassword(true);
    setIsCopied(false);
    setIsAddParentOpen(true);
  };

  const handleCreateParent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNameAr || !newPhone) return;

    addParent({
      fullNameAr: newNameAr,
      fullNameEn: newNameEn || newNameAr,
      phone: newPhone,
      email: newEmail || 'parent@myschool.edu',
      address: newAddress || 'الجزائر العاصمة',
      password: newPassword || generateAutoPassword(),
      status: 'active',
    });

    setNewNameAr('');
    setNewNameEn('');
    setNewPhone('');
    setNewEmail('');
    setNewAddress('');
    setNewPassword(generateAutoPassword());
    setIsAddParentOpen(false);
  };

  return (
    <div className={`w-full select-none ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{ marginBottom: '28px' }}
      >
        <div>
          <span className="text-xs sm:text-sm font-bold text-slate-400">
            {language === 'ar' ? 'إدارة علاقات أولياء الأمور' : 'Family & Parent Relations'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5">
            {language === 'ar' ? 'سجل أولياء الأمور (Parents Directory)' : 'Parents Management'}
          </h2>
        </div>

        <button
          type="button"
          onClick={handleOpenAddParent}
          className="rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2.5 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
          style={{ padding: '14px 28px' }}
        >
          <Plus size={18} />
          <span>{language === 'ar' ? 'إضافة ولي أمر جديد' : 'Add New Parent'}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div
        className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs flex items-center justify-between gap-4"
        style={{
          padding: '14px 20px',
          marginBottom: '20px',
        }}
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'ar' ? 'بحث بالاسم، رقم الهاتف، أو البريد الإلكتروني...' : 'Search parent by name, phone, email...'}
            className="w-full h-10 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-purple-500 transition-colors shadow-2xs"
            style={{
              paddingLeft: isRTL ? '16px' : '42px',
              paddingRight: isRTL ? '42px' : '16px',
              textAlign: isRTL ? 'right' : 'left',
            }}
          />
          <Search
            size={16}
            className={`absolute top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none ${
              isRTL ? 'right-3.5' : 'left-3.5'
            }`}
          />
        </div>

        <div className="text-xs sm:text-sm font-bold text-slate-400 shrink-0">
          {language === 'ar' ? `العدد: ${filteredParents.length} ولي أمر` : `Total: ${filteredParents.length} parents`}
        </div>
      </div>

      {/* Parents Table (Section 8) */}
      <div
        className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-[32px] shadow-xs overflow-hidden"
        style={{ marginBottom: '44px' }}
      >
        <div className="overflow-x-auto">
          <table className={`w-full text-xs sm:text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold">
              <tr>
                <th
                  className={`font-extrabold text-xs ${isRTL ? 'text-right' : 'text-left'}`}
                  style={{
                    paddingTop: '14px',
                    paddingBottom: '14px',
                    paddingLeft: isRTL ? '20px' : '28px',
                    paddingRight: isRTL ? '28px' : '20px',
                  }}
                >
                  {language === 'ar' ? 'ولي الأمر' : 'Parent Name'}
                </th>
                <th className="py-3.5 px-4 text-center font-extrabold text-xs">{language === 'ar' ? 'رقم الهاتف' : 'Phone'}</th>
                <th className="py-3.5 px-4 text-center font-extrabold text-xs">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</th>
                <th className="py-3.5 px-4 text-center font-extrabold text-xs">{language === 'ar' ? 'عدد الأبناء' : 'Children'}</th>
                <th className="py-3.5 px-4 text-center font-extrabold text-xs">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                <th
                  className="font-extrabold text-center text-xs"
                  style={{
                    paddingTop: '14px',
                    paddingBottom: '14px',
                    paddingRight: isRTL ? '28px' : '20px',
                    paddingLeft: isRTL ? '20px' : '28px',
                  }}
                >
                  {language === 'ar' ? 'الإجراءات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredParents.map((par) => {
                return (
                  <tr
                    key={par.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                    onClick={() => handleOpenParent(par)}
                  >
                    <td
                      className="py-3.5"
                      style={{
                        paddingLeft: isRTL ? '20px' : '28px',
                        paddingRight: isRTL ? '28px' : '20px',
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 flex items-center justify-center font-black text-[11px] shrink-0">
                          {par.fullNameAr[0]}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm leading-snug">{par.fullNameAr}</div>
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5">{par.fullNameEn}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-700 dark:text-slate-300 text-xs" dir="ltr">
                      {par.phone}
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono text-slate-500 dark:text-slate-400 text-xs">
                      {par.email}
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono font-black text-purple-600 dark:text-purple-400 text-xs sm:text-sm">
                      {formatChildrenCount(students.filter((s) => (par.linkedStudentIds && par.linkedStudentIds.includes(s.id)) || s.parentId === par.id || ((par.phone && s.parentPhone) && s.parentPhone.replace(/\D/g, '') === par.phone.replace(/\D/g, ''))).length, language)}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className="text-xs font-bold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                        style={{ padding: '5px 12px' }}
                      >
                        {par.status === 'active' ? 'نشط' : 'غير نشط'}
                      </span>
                    </td>

                    <td
                      className="py-3.5 text-center"
                      style={{
                        paddingRight: isRTL ? '28px' : '20px',
                        paddingLeft: isRTL ? '20px' : '28px',
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => handleOpenParent(par)}
                        className="rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 text-purple-600 dark:text-purple-300 font-bold text-xs transition-colors cursor-pointer"
                        style={{ padding: '6px 14px' }}
                      >
                        {language === 'ar' ? 'الملف وإدارة الأبناء' : 'Manage Children'} →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add New Parent */}
      {isAddParentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 animate-fade-in-up"
            style={{ padding: '22px 26px' }}
          >
            <div
              className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800"
              style={{ paddingBottom: '12px', marginBottom: '16px' }}
            >
              <div>
                <h3 className="font-black text-lg text-slate-900 dark:text-white">
                  {language === 'ar' ? 'إضافة ولي أمر جديد' : 'Add New Parent'}
                </h3>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                  {language === 'ar' ? 'تسجيل بيانات ولي الأمر في المنظومة' : 'Register parent credentials in the system'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddParentOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateParent} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} className="text-xs font-bold">
              {/* Row 1: Names (Arabic & English) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 text-[11px] font-bold" style={{ marginBottom: '5px' }}>
                    {language === 'ar' ? 'الاسم بالعربية *' : 'Arabic Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newNameAr}
                    onChange={(e) => setNewNameAr(e.target.value)}
                    placeholder="مثال: عبد الرحمن بن سالم"
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 outline-none transition-all text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 text-[11px] font-bold" style={{ marginBottom: '5px' }}>
                    {language === 'ar' ? 'الاسم بالإنجليزية' : 'English Name'}
                  </label>
                  <input
                    type="text"
                    value={newNameEn}
                    onChange={(e) => setNewNameEn(e.target.value)}
                    placeholder="Ex: Abderrahmane Bensalem"
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 outline-none transition-all text-xs text-slate-900 dark:text-white"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Row 2: Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 text-[11px] font-bold" style={{ marginBottom: '5px' }}>
                    {language === 'ar' ? 'رقم الهاتف *' : 'Phone Number *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+213 550 000 000"
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 outline-none transition-all text-xs text-slate-900 dark:text-white"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 text-[11px] font-bold" style={{ marginBottom: '5px' }}>
                    {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="parent@example.com"
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 outline-none transition-all text-xs text-slate-900 dark:text-white"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Row 3: Address */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 text-[11px] font-bold" style={{ marginBottom: '5px' }}>
                  {language === 'ar' ? 'العنوان السكني' : 'Residential Address'}
                </label>
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="الجزائر العاصمة"
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 outline-none transition-all text-xs text-slate-900 dark:text-white"
                />
              </div>

              {/* Row 4: Password Field (Auto-Generated) */}
              <div>
                <div className="flex items-center justify-between" style={{ marginBottom: '5px' }}>
                  <label className="block text-slate-700 dark:text-slate-300 text-[11px] font-bold">
                    {language === 'ar' ? 'كلمة المرور للحساب *' : 'Account Password *'}
                  </label>
                  <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-md border border-purple-200/60 dark:border-purple-800/60 flex items-center gap-1">
                    <Sparkles size={11} />
                    <span>{language === 'ar' ? 'توليد تلقائي' : 'Auto Generated'}</span>
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="relative flex-1">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Awliya@2026"
                      className="w-full h-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 outline-none transition-all text-xs font-bold text-slate-900 dark:text-white px-3"
                      dir="ltr"
                    />
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center gap-1 shrink-0">
                    {/* Regenerate Button */}
                    <button
                      type="button"
                      onClick={() => {
                        const pass = generateAutoPassword();
                        setNewPassword(pass);
                        setIsCopied(false);
                      }}
                      title={language === 'ar' ? 'توليد كلمة مرور جديدة' : 'Generate New Password'}
                      className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-900/40 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-purple-600 flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-2xs shrink-0"
                    >
                      <RefreshCw size={14} />
                    </button>

                    {/* Show/Hide Toggle */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      title={showPassword ? (language === 'ar' ? 'إخفاء' : 'Hide') : (language === 'ar' ? 'إظهار' : 'Show')}
                      className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-all cursor-pointer shadow-2xs shrink-0"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>

                    {/* Copy Button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (navigator.clipboard) {
                          navigator.clipboard.writeText(newPassword);
                          setIsCopied(true);
                          setTimeout(() => setIsCopied(false), 2000);
                        }
                      }}
                      title={language === 'ar' ? 'نسخ كلمة المرور' : 'Copy Password'}
                      className={`rounded-xl border flex items-center justify-center text-xs font-bold transition-all cursor-pointer shadow-2xs shrink-0 whitespace-nowrap ${
                        isCopied
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'bg-purple-600 hover:bg-purple-700 border-purple-600 text-white hover:scale-105 active:scale-95'
                      }`}
                      style={{
                        height: '40px',
                        paddingLeft: '16px',
                        paddingRight: '16px',
                        gap: '6px',
                        minWidth: 'max-content',
                      }}
                    >
                      {isCopied ? <Check size={13} className="shrink-0" /> : <Copy size={13} className="shrink-0" />}
                      <span className="whitespace-nowrap">{isCopied ? (language === 'ar' ? 'تم النسخ' : 'Copied') : (language === 'ar' ? 'نسخ' : 'Copy')}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div style={{ paddingTop: '6px' }}>
                <button
                  type="submit"
                  className="w-full h-11 bg-purple-600 hover:bg-purple-700 active:scale-[0.99] text-white font-bold rounded-xl shadow-md transition-all cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-2"
                >
                  <UserPlus size={16} />
                  <span>{language === 'ar' ? 'حفظ ولي الأمر' : 'Save Parent'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Parent Details Modal */}
      <ParentDetailModal
        parent={selectedParent}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedParent(null);
        }}
      />
    </div>
  );
}
