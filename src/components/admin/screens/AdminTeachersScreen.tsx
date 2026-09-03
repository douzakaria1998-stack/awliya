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
    <div className={`w-full select-none ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{ marginBottom: '28px' }}
      >
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
          className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2.5 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
          style={{ padding: '14px 28px' }}
        >
          <Plus size={18} />
          <span>{language === 'ar' ? 'إنشاء حساب معلم جديد' : 'Create Teacher Account'}</span>
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
            placeholder={language === 'ar' ? 'بحث باسم المعلم، اسم المستخدم، أو البريد الإلكتروني...' : 'Search teacher by name, username, email...'}
            className="w-full h-10 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-emerald-500 transition-colors shadow-2xs"
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
          {language === 'ar' ? `العدد: ${filteredTeachers.length} معلمين` : `Total: ${filteredTeachers.length} teachers`}
        </div>
      </div>

      {/* Teachers Table (Section 10) */}
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
                  {language === 'ar' ? 'المعلم' : 'Teacher'}
                </th>
                <th className="py-3.5 px-4 text-center font-extrabold text-xs">{language === 'ar' ? 'اسم المستخدم' : 'Username'}</th>
                <th className="py-3.5 px-4 text-center font-extrabold text-xs">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</th>
                <th className="py-3.5 px-4 text-center font-extrabold text-xs">{language === 'ar' ? 'الهاتف' : 'Phone'}</th>
                <th className="py-3.5 px-4 text-center font-extrabold text-xs">{language === 'ar' ? 'اللغات' : 'Languages'}</th>
                <th className="py-3.5 px-4 text-center font-extrabold text-xs">{language === 'ar' ? 'الأفواج' : 'Groups'}</th>
                <th className="py-3.5 px-4 text-center font-extrabold text-xs">{language === 'ar' ? 'الطلاب' : 'Students'}</th>
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
              {filteredTeachers.map((teach) => {
                const assignedGrps = groups.filter(
                  (g) => teach.assignedGroupIds.includes(g.id) || g.teacherId === teach.id
                );
                const studentsCount = assignedGrps.reduce((acc, g) => acc + g.studentIds.length, 0);

                return (
                  <tr
                    key={teach.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                    onClick={() => handleOpenTeacher(teach)}
                  >
                    <td
                      className="py-3.5"
                      style={{
                        paddingLeft: isRTL ? '20px' : '28px',
                        paddingRight: isRTL ? '28px' : '20px',
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-black text-[11px] shrink-0">
                          {teach.fullNameAr[0]}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm leading-snug">{teach.fullNameAr}</div>
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5">{teach.fullNameEn}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono font-bold text-purple-600 dark:text-purple-400 text-xs">
                      @{teach.username}
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono text-slate-500 dark:text-slate-400 text-xs">
                      {teach.email}
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-700 dark:text-slate-300 text-xs" dir="ltr">
                      {teach.phone}
                    </td>

                    <td className="py-3.5 px-4 text-center font-bold text-xs text-emerald-600 dark:text-emerald-400">
                      {teach.languagesTaught.join(' & ')}
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800 dark:text-slate-200 text-xs">
                      {assignedGrps.length} {language === 'ar' ? 'أفواج' : 'groups'}
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono font-black text-indigo-600 dark:text-indigo-400 text-xs sm:text-sm">
                      {studentsCount} {language === 'ar' ? 'طالب' : 'students'}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className="text-xs font-bold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                        style={{ padding: '5px 12px' }}
                      >
                        {teach.status === 'active' ? 'نشط' : 'غير نشط'}
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
                        onClick={() => handleOpenTeacher(teach)}
                        className="rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300 font-bold text-xs transition-colors cursor-pointer"
                        style={{ padding: '6px 14px' }}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div
            className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl border border-slate-200 dark:border-slate-800 my-6 overflow-hidden animate-fade-in-up"
            style={{ padding: '24px 28px' }}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <div>
                <h3 className="font-black text-lg sm:text-xl text-slate-900 dark:text-white tracking-tight">
                  {language === 'ar' ? 'إنشاء حساب معلم جديد' : 'Create Teacher Account'}
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                  {language === 'ar' ? 'إصدار بيانات الدخول الآمنة ورابط الدعوة' : 'Issue secure login credentials and invitation link'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddTeacherOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateTeacher} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-700 dark:text-slate-300 font-bold text-xs">
                    {language === 'ar' ? 'الاسم بالعربية *' : 'Arabic Name *'}
                  </label>
                  <input
                    type="text"
                    dir="auto"
                    required
                    value={newFullNameAr}
                    onChange={(e) => setNewFullNameAr(e.target.value)}
                    placeholder={language === 'ar' ? 'مثال: أ. حسام عثمان' : 'e.g. Mr. Houssam Othman'}
                    style={{ paddingLeft: '16px', paddingRight: '16px' }}
                    className="w-full h-11 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-700 dark:text-slate-300 font-bold text-xs">
                    {language === 'ar' ? 'الاسم بالإنجليزية' : 'English Name'}
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={newFullNameEn}
                    onChange={(e) => setNewFullNameEn(e.target.value)}
                    placeholder="Ex: Mr. Houssam Othman"
                    style={{ paddingLeft: '16px', paddingRight: '16px' }}
                    className="w-full h-11 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-700 dark:text-slate-300 font-bold text-xs">
                    {language === 'ar' ? 'اسم المستخدم *' : 'Username *'}
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    required
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="houssam.teacher"
                    style={{ paddingLeft: '16px', paddingRight: '16px' }}
                    className="w-full h-11 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs sm:text-sm font-bold text-purple-600 dark:text-purple-400 focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-700 dark:text-slate-300 font-bold text-xs">
                    {language === 'ar' ? 'رقم الهاتف *' : 'Phone Number *'}
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+213 770 000 000"
                    style={{ paddingLeft: '16px', paddingRight: '16px' }}
                    className="w-full h-11 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-700 dark:text-slate-300 font-bold text-xs">
                  {language === 'ar' ? 'البريد الإلكتروني المهني' : 'Professional Email'}
                </label>
                <input
                  type="email"
                  dir="ltr"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="teacher@myschool.edu"
                  style={{ paddingLeft: '16px', paddingRight: '16px' }}
                  className="w-full h-11 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Languages Selection */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-700 dark:text-slate-300 font-bold text-xs">
                  {language === 'ar' ? 'اللغات المدرسة' : 'Languages Taught'}
                </label>
                <div
                  className="flex items-center gap-6 min-h-11 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
                  style={{ paddingLeft: '20px', paddingRight: '20px', paddingTop: '10px', paddingBottom: '10px' }}
                >
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-800 dark:text-slate-200 select-none">
                    <input
                      type="checkbox"
                      checked={newLanguages.includes('English')}
                      onChange={(e) => {
                        if (e.target.checked) setNewLanguages([...newLanguages, 'English']);
                        else setNewLanguages(newLanguages.filter((l) => l !== 'English'));
                      }}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span>{language === 'ar' ? 'اللغة الإنجليزية' : 'English'}</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-800 dark:text-slate-200 select-none">
                    <input
                      type="checkbox"
                      checked={newLanguages.includes('French')}
                      onChange={(e) => {
                        if (e.target.checked) setNewLanguages([...newLanguages, 'French']);
                        else setNewLanguages(newLanguages.filter((l) => l !== 'French'));
                      }}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span>{language === 'ar' ? 'اللغة الفرنسية' : 'French'}</span>
                  </label>
                </div>
              </div>

              {/* Password Invitation Info Box (Section 11) */}
              <div
                className="rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200/90 dark:border-emerald-800/70 flex flex-col gap-3"
                style={{ padding: '18px 20px' }}
              >
                <div className="flex items-center gap-2.5 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                  <KeyRound size={16} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>{language === 'ar' ? 'كلمة المرور المؤقتة المُنشأة تلقائياً:' : 'Auto-Generated Temporary Password:'}</span>
                </div>
                <div
                  className="font-mono font-black text-sm text-emerald-900 dark:text-emerald-200 bg-white dark:bg-slate-900 rounded-xl border border-emerald-300 dark:border-emerald-700 text-center shadow-xs"
                  style={{ padding: '10px 16px' }}
                  dir="ltr"
                >
                  {generatedPassword}
                </div>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium leading-relaxed">
                  {language === 'ar'
                    ? 'سيتم إرسال دعوة آمنة للمعلم ليقوم بتعيين كلمة مروره الخاصة عند أول تسجيل دخول.'
                    : 'A secure invite will be sent to the teacher to set their personal password upon first login.'}
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer text-sm flex items-center justify-center gap-2"
                >
                  <span>{language === 'ar' ? 'إنشاء وتفعيل حساب المعلم' : 'Create & Activate Teacher Account'}</span>
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
