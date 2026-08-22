'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  GraduationCap,
  Users,
  School,
  Phone,
  Mail,
  ShieldCheck,
  KeyRound,
  Sparkles,
  X,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useLanguage } from '@/context/LanguageContext';
import { AdminTeacher } from '@/types/admin';
import { TeacherDetailModal } from '../modals/TeacherDetailModal';

export function AdminTeachersScreen() {
  const { teachers, groups, students, addTeacher } = useAdmin();
  const { isRTL, language } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState<AdminTeacher | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Teacher Modal State
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);
  const [newFullNameAr, setNewFullNameAr] = useState('');
  const [newFullNameEn, setNewFullNameEn] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newSpecialization, setNewSpecialization] = useState('CEFR Grammar & Conversation');
  const [newExperience, setNewExperience] = useState('5 years in TEFL / Cambridge Curriculum');
  const [newLanguages, setNewLanguages] = useState<('English' | 'French')[]>(['English']);
  const [generatedPassword] = useState(`MS-Teach-${Math.floor(1000 + Math.random() * 9000)}!`);

  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      const q = searchQuery.toLowerCase();
      return (
        t.fullNameAr.toLowerCase().includes(q) ||
        t.fullNameEn.toLowerCase().includes(q) ||
        t.username.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q) ||
        t.phone.includes(q)
      );
    });
  }, [teachers, searchQuery]);

  const handleOpenTeacher = (teacher: AdminTeacher) => {
    setSelectedTeacher(teacher);
    setIsModalOpen(true);
  };

  const handleCreateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullNameAr || !newUsername || !newPhone) return;

    addTeacher({
      fullNameAr: newFullNameAr,
      fullNameEn: newFullNameEn || newFullNameAr,
      username: newUsername.toLowerCase().trim(),
      email: newEmail || `${newUsername.toLowerCase().trim()}@myschool.edu`,
      phone: newPhone,
      specialization: newSpecialization,
      experience: newExperience,
      languagesTaught: newLanguages,
      status: 'active',
      assignedGroupIds: [],
    });

    setNewFullNameAr('');
    setNewFullNameEn('');
    setNewUsername('');
    setNewEmail('');
    setNewPhone('');
    setIsAddTeacherOpen(false);
  };

  return (
    <div className={`w-full pb-10 space-y-6 select-none ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs sm:text-sm font-bold text-slate-400">
            {language === 'ar' ? 'هيئة التدريس والمشرفين الأكاديميين' : 'Faculty & Teaching Staff'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5">
            {language === 'ar' ? 'سجل المعلمين (Teachers Directory)' : 'Teachers Management'}
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setIsAddTeacherOpen(true)}
          className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <Plus size={16} />
          <span>{language === 'ar' ? '+ إنشاء حساب معلم جديد' : '+ Create Teacher Account'}</span>
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
            placeholder={language === 'ar' ? 'بحث باسم المعلم، اسم المستخدم، أو البريد الإلكتروني...' : 'Search teacher by name, username, email...'}
            className={`w-full h-11 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:border-emerald-500 transition-colors ${
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
          {language === 'ar' ? `العدد: ${filteredTeachers.length} معلمين` : `Total: ${filteredTeachers.length} teachers`}
        </div>
      </div>

      {/* Teachers Table (Section 10) */}
      <div className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-[28px] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-right">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-400 font-bold">
              <tr>
                <th className="py-3.5 px-6 text-right">{language === 'ar' ? 'المعلم' : 'Teacher'}</th>
                <th className="py-3.5 px-4 text-center">{language === 'ar' ? 'اسم المستخدم' : 'Username'}</th>
                <th className="py-3.5 px-4 text-center">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</th>
                <th className="py-3.5 px-4 text-center">{language === 'ar' ? 'الهاتف' : 'Phone'}</th>
                <th className="py-3.5 px-4 text-center">{language === 'ar' ? 'اللغات' : 'Languages'}</th>
                <th className="py-3.5 px-4 text-center">{language === 'ar' ? 'الأفواج' : 'Groups'}</th>
                <th className="py-3.5 px-4 text-center">{language === 'ar' ? 'الطلاب' : 'Students'}</th>
                <th className="py-3.5 px-4 text-center">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                <th className="py-3.5 px-6 text-center">{language === 'ar' ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTeachers.map((teach) => {
                const assignedGrps = groups.filter(
                  (g) => teach.assignedGroupIds.includes(g.id) || g.teacherId === teach.id
                );
                const studentsCount = assignedGrps.reduce((acc, g) => acc + g.studentIds.length, 0);

                return (
                  <tr
                    key={teach.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                    onClick={() => handleOpenTeacher(teach)}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0">
                          {teach.fullNameAr[0]}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{teach.fullNameAr}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{teach.fullNameEn}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-center font-mono font-bold text-purple-600 text-xs">
                      @{teach.username}
                    </td>

                    <td className="py-4 px-4 text-center font-mono text-slate-500 dark:text-slate-400 text-xs">
                      {teach.email}
                    </td>

                    <td className="py-4 px-4 text-center font-mono font-bold text-slate-700 dark:text-slate-300" dir="ltr">
                      {teach.phone}
                    </td>

                    <td className="py-4 px-4 text-center font-bold text-xs text-emerald-600">
                      {teach.languagesTaught.join(' & ')}
                    </td>

                    <td className="py-4 px-4 text-center font-mono font-bold text-slate-800 dark:text-slate-200">
                      {assignedGrps.length} {language === 'ar' ? 'أفواج' : 'groups'}
                    </td>

                    <td className="py-4 px-4 text-center font-mono font-bold text-indigo-600">
                      {studentsCount} {language === 'ar' ? 'طالب' : 'students'}
                    </td>

                    <td className="py-4 px-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                        {teach.status === 'active' ? 'نشط' : 'غير نشط'}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleOpenTeacher(teach)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 font-bold text-xs transition-colors cursor-pointer"
                      >
                        {language === 'ar' ? 'الملف والأفواج' : 'Profile & Groups'} →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Teacher Account (Section 11) */}
      {isAddTeacherOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5 animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-black text-lg text-slate-900 dark:text-white">
                  {language === 'ar' ? 'إنشاء حساب معلم جديد (Create Teacher Account)' : 'Create Teacher Account'}
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  {language === 'ar' ? 'إصدار بيانات الدخول الآمنة ورابط الدعوة' : 'Issue secure login credentials and invite'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddTeacherOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateTeacher} className="space-y-4 text-xs font-bold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">الاسم بالعربية *</label>
                  <input
                    type="text"
                    required
                    value={newFullNameAr}
                    onChange={(e) => setNewFullNameAr(e.target.value)}
                    placeholder="مثال: أ. حسام عثمان"
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">الاسم بالإنجليزية</label>
                  <input
                    type="text"
                    value={newFullNameEn}
                    onChange={(e) => setNewFullNameEn(e.target.value)}
                    placeholder="Ex: Mr. Houssam Othman"
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">اسم المستخدم (Username) *</label>
                  <input
                    type="text"
                    required
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="houssam.teacher"
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-purple-600"
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
                    placeholder="+213 770 000 000"
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">البريد الإلكتروني المهني</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="teacher@myschool.edu"
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  dir="ltr"
                />
              </div>

              {/* Languages Selection */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">اللغات المدرسة (Languages Taught)</label>
                <div className="flex gap-4 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newLanguages.includes('English')}
                      onChange={(e) => {
                        if (e.target.checked) setNewLanguages([...newLanguages, 'English']);
                        else setNewLanguages(newLanguages.filter((l) => l !== 'English'));
                      }}
                      className="rounded text-emerald-600"
                    />
                    <span>اللغة الإنجليزية (English)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newLanguages.includes('French')}
                      onChange={(e) => {
                        if (e.target.checked) setNewLanguages([...newLanguages, 'French']);
                        else setNewLanguages(newLanguages.filter((l) => l !== 'French'));
                      }}
                      className="rounded text-emerald-600"
                    />
                    <span>اللغة الفرنسية (French)</span>
                  </label>
                </div>
              </div>

              {/* Password Invitation Info Box (Section 11: Auto-generated invitation, not exposed in table) */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold">
                  <KeyRound size={15} />
                  <span>كلمة المرور المؤقتة المُنشأة تلقائياً (Auto-Generated):</span>
                </div>
                <div className="font-mono font-bold text-sm text-emerald-900 dark:text-emerald-200 bg-white dark:bg-slate-900 p-2 rounded-xl border border-emerald-300 dark:border-emerald-700" dir="ltr">
                  {generatedPassword}
                </div>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  سيتم إرسال دعوة آمنة للمعلم ليقوم بتعيين كلمة مروره الخاصة عند أول تسجيل دخول.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer text-sm"
                >
                  إنشاء وتفعيل حساب المعلم
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Teacher Profile Modal */}
      <TeacherDetailModal
        teacher={selectedTeacher}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTeacher(null);
        }}
      />
    </div>
  );
}
