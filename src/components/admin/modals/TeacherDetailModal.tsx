'use client';

import React from 'react';
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
} from 'lucide-react';
import { AdminTeacher } from '@/types/admin';
import { useAdmin } from '@/context/AdminContext';
import { useLanguage } from '@/context/LanguageContext';

interface TeacherDetailModalProps {
  teacher: AdminTeacher | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TeacherDetailModal({ teacher, isOpen, onClose }: TeacherDetailModalProps) {
  const { groups, students, setActiveTab } = useAdmin();
  const { isRTL, language } = useLanguage();

  if (!isOpen || !teacher) return null;

  const assignedGroups = groups.filter((g) => teacher.assignedGroupIds.includes(g.id) || g.teacherId === teacher.id);
  const totalStudentsCount = assignedGroups.reduce((acc, g) => acc + g.studentIds.length, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div
          className="bg-slate-900 text-white flex items-center justify-between shrink-0"
          style={{ padding: '24px 32px' }}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-lg shadow-md shrink-0">
              <GraduationCap size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">{teacher.fullNameAr} ({teacher.fullNameEn})</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                @{teacher.username} • {teacher.specialization}
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
          {/* Personal & Teaching Information (Section 10) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {language === 'ar' ? 'المعلومات الشخصية والمهنية (Personal & Teaching Info)' : 'Teaching Information'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">اسم المستخدم (Username):</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-xs">@{teacher.username}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">البريد الإلكتروني:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-xs truncate block">{teacher.email}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">رقم الهاتف:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-sm" dir="ltr">{teacher.phone}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">اللغات المدرسة:</span>
                <span className="font-bold text-emerald-600 text-xs">{teacher.languagesTaught.join(' & ')}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">التخصص والخبرة:</span>
                <span className="font-bold text-slate-900 dark:text-white text-xs">{teacher.experience}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">الطلاب المباشرين:</span>
                <span className="font-mono font-bold text-purple-600 text-sm">{totalStudentsCount} طالب</span>
              </div>
            </div>
          </div>

          {/* Assigned Groups (Section 10 in PDF) */}
          <div className="space-y-3 pt-2">
            <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <School size={18} className="text-emerald-600" />
              <span>{language === 'ar' ? `الأفواج المسندة للمعلم (${assignedGroups.length})` : `Assigned Groups (${assignedGroups.length})`}</span>
            </h4>

            <div className="space-y-3">
              {assignedGroups.map((grp) => (
                <div
                  key={grp.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-xs">
                        {grp.code}
                      </span>
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{grp.name}</span>
                    </div>
                    <div className="text-xs text-slate-400">
                      {grp.daysAr} • {grp.startTime}–{grp.endTime} • {grp.studentIds.length} طلاب مسجلين
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-purple-600 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl">
                      {grp.attendanceRate}% حضور
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        setActiveTab('groups');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors cursor-pointer"
                    >
                      إدارة الفوج →
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
