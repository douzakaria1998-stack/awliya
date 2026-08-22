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
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useLanguage } from '@/context/LanguageContext';
import { AdminParent } from '@/types/admin';
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

  const handleCreateParent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNameAr || !newPhone) return;

    addParent({
      fullNameAr: newNameAr,
      fullNameEn: newNameEn || newNameAr,
      phone: newPhone,
      email: newEmail || 'parent@myschool.edu',
      address: newAddress || 'الجزائر العاصمة',
      status: 'active',
    });

    setNewNameAr('');
    setNewNameEn('');
    setNewPhone('');
    setNewEmail('');
    setNewAddress('');
    setIsAddParentOpen(false);
  };

  return (
    <div className={`w-full pb-10 space-y-6 select-none ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
          onClick={() => setIsAddParentOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <Plus size={16} />
          <span>{language === 'ar' ? '+ إضافة ولي أمر جديد' : '+ Add New Parent'}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div
        className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-[28px] shadow-xs flex items-center justify-between gap-3"
        style={{ padding: '20px 24px' }}
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'ar' ? 'بحث بالاسم، رقم الهاتف، أو البريد الإلكتروني...' : 'Search parent by name, phone, email...'}
            className={`w-full h-11 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:border-purple-500 transition-colors ${
              isRTL ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'
            }`}
          />
          <Search
            size={18}
            className={`absolute top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none ${
              isRTL ? 'right-3.5' : 'left-3.5'
            }`}
          />
        </div>

        <div className="text-xs font-bold text-slate-400 shrink-0">
          {language === 'ar' ? `العدد: ${filteredParents.length} ولي أمر` : `Total: ${filteredParents.length} parents`}
        </div>
      </div>

      {/* Parents Table (Section 8) */}
      <div className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-[28px] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-right">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-400 font-bold">
              <tr>
                <th className="py-3.5 px-6 text-right">{language === 'ar' ? 'ولي الأمر' : 'Parent Name'}</th>
                <th className="py-3.5 px-4 text-center">{language === 'ar' ? 'رقم الهاتف' : 'Phone'}</th>
                <th className="py-3.5 px-4 text-center">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</th>
                <th className="py-3.5 px-4 text-center">{language === 'ar' ? 'عدد الأبناء' : 'Children'}</th>
                <th className="py-3.5 px-4 text-center">{language === 'ar' ? 'الأبناء المربوطين' : 'Linked Students'}</th>
                <th className="py-3.5 px-4 text-center">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                <th className="py-3.5 px-6 text-center">{language === 'ar' ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredParents.map((par) => {
                const linkedStudents = students.filter((s) => par.linkedStudentIds.includes(s.id));
                return (
                  <tr
                    key={par.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                    onClick={() => handleOpenParent(par)}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center font-bold text-xs shrink-0">
                          {par.fullNameAr[0]}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{par.fullNameAr}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{par.fullNameEn}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-center font-mono font-bold text-slate-700 dark:text-slate-300" dir="ltr">
                      {par.phone}
                    </td>

                    <td className="py-4 px-4 text-center font-mono text-slate-500 dark:text-slate-400 text-xs">
                      {par.email}
                    </td>

                    <td className="py-4 px-4 text-center font-mono font-bold text-purple-600">
                      {par.linkedStudentIds.length} {language === 'ar' ? 'أبناء' : 'children'}
                    </td>

                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        {linkedStudents.map((st) => (
                          <span
                            key={st.id}
                            className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300"
                          >
                            {st.fullNameAr} ({st.cefrLevel})
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                        {par.status === 'active' ? 'نشط' : 'غير نشط'}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleOpenParent(par)}
                        className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 font-bold text-xs transition-colors cursor-pointer"
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
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-black text-lg text-slate-900 dark:text-white">
                {language === 'ar' ? 'إضافة ولي أمر جديد' : 'Add New Parent'}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddParentOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateParent} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">الاسم بالعربية *</label>
                <input
                  type="text"
                  required
                  value={newNameAr}
                  onChange={(e) => setNewNameAr(e.target.value)}
                  placeholder="مثال: عبد الرحمن بن سالم"
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">الاسم بالإنجليزية</label>
                <input
                  type="text"
                  value={newNameEn}
                  onChange={(e) => setNewNameEn(e.target.value)}
                  placeholder="Ex: Abderrahmane Bensalem"
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">رقم الهاتف *</label>
                <input
                  type="text"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+213 550 000 000"
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="parent@example.com"
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">العنوان السكني</label>
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="الجزائر العاصمة"
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer text-sm"
                >
                  حفظ ولي الأمر
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
