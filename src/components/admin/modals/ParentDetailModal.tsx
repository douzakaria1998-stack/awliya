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
} from 'lucide-react';
import { AdminParent, AdminStudent } from '@/types/admin';
import { useAdmin } from '@/context/AdminContext';
import { useLanguage } from '@/context/LanguageContext';

interface ParentDetailModalProps {
  parent: AdminParent | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ParentDetailModal({ parent, isOpen, onClose }: ParentDetailModalProps) {
  const { students, linkStudentToParent, unlinkStudentFromParent } = useAdmin();
  const { isRTL, language } = useLanguage();

  const [isLinkingOpen, setIsLinkingOpen] = useState(false);
  const [selectedStudentToLink, setSelectedStudentToLink] = useState('');

  if (!isOpen || !parent) return null;

  const linkedStudents = students.filter((s) => parent.linkedStudentIds.includes(s.id));
  const availableStudentsToLink = students.filter((s) => !parent.linkedStudentIds.includes(s.id));

  const handleLinkStudent = () => {
    if (!selectedStudentToLink) return;
    linkStudentToParent(parent.id, selectedStudentToLink);
    setSelectedStudentToLink('');
    setIsLinkingOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div
          className="bg-slate-900 text-white flex items-center justify-between shrink-0"
          style={{ padding: '24px 32px' }}
        >
          <div className="flex items-center gap-3.5">
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
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className={`overflow-y-auto flex-1 p-6 sm:p-8 space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
          {/* Personal Information (Section 8) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {language === 'ar' ? 'البيانات الشخصية لولي الأمر (Personal Information)' : 'Personal Information'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">{language === 'ar' ? 'رقم الهاتف:' : 'Phone Number:'}</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-sm" dir="ltr">{parent.phone}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">{language === 'ar' ? 'البريد الإلكتروني:' : 'Email:'}</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-xs truncate block">{parent.email}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">{language === 'ar' ? 'العنوان السكني:' : 'Address:'}</span>
                <span className="font-bold text-slate-900 dark:text-white text-xs">{parent.address || 'الجزائر العاصمة'}</span>
              </div>
            </div>
          </div>

          {/* Linked Students List (Section 8, 9) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Users size={18} className="text-purple-600" />
                <span>{language === 'ar' ? `الأبناء المسجلين في المنصة (${linkedStudents.length})` : `Linked Students (${linkedStudents.length})`}</span>
              </h4>

              <button
                type="button"
                onClick={() => setIsLinkingOpen(!isLinkingOpen)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <Plus size={15} />
                <span>{language === 'ar' ? '+ ربط طالب جديد' : '+ Link Student'}</span>
              </button>
            </div>

            {/* Link Student Selection Form */}
            {isLinkingOpen && (
              <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 space-y-3 animate-fade-in">
                <span className="text-xs font-bold text-purple-950 dark:text-purple-200 block">
                  {language === 'ar' ? 'اختر طالباً من قائمة الطلاب لربطه بحساب ولي الأمر:' : 'Select an existing student to link with this parent account:'}
                </span>
                <div className="flex gap-2">
                  <select
                    value={selectedStudentToLink}
                    onChange={(e) => setSelectedStudentToLink(e.target.value)}
                    className="flex-1 h-10 bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white px-3 cursor-pointer"
                  >
                    <option value="">{language === 'ar' ? '-- اختر الطالب --' : '-- Select Student --'}</option>
                    {availableStudentsToLink.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.fullNameAr} ({s.fullNameEn}) — {s.groupName}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleLinkStudent}
                    disabled={!selectedStudentToLink}
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    {language === 'ar' ? 'تأكيد الربط' : 'Confirm Link'}
                  </button>
                </div>
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
  );
}
