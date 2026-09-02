'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  School,
  Users,
  GraduationCap,
  Calendar,
  Clock,
  ChevronRight,
  TrendingUp,
  X,
  Archive,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useLanguage } from '@/context/LanguageContext';
import { AdminGroup } from '@/types/admin';
import { GroupDetailModal } from '../modals/GroupDetailModal';

export function AdminGroupsScreen() {
  const { visibleGroups, teachers, students, addGroup } = useAdmin();
  const { isRTL, language } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived'>('all');
  const [selectedGroup, setSelectedGroup] = useState<AdminGroup | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Create Group Modal State
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newLanguage, setNewLanguage] = useState<'English' | 'French' | 'Dual'>('English');
  const [newLevel, setNewLevel] = useState<'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'>('A1');
  const [newTeacherId, setNewTeacherId] = useState(teachers[0]?.id || '');
  const [newDaysAr, setNewDaysAr] = useState('الأحد + الثلاثاء');
  const [newStartTime, setNewStartTime] = useState('18:00');
  const [newEndTime, setNewEndTime] = useState('20:00');
  const [newCapacity, setNewCapacity] = useState(20);

  const filteredGroups = useMemo(() => {
    return visibleGroups.filter((g) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        g.name.toLowerCase().includes(q) ||
        g.code.toLowerCase().includes(q) ||
        g.teacherName.toLowerCase().includes(q) ||
        g.language.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && g.status !== 'archived') ||
        (statusFilter === 'archived' && g.status === 'archived');

      return matchesSearch && matchesStatus;
    });
  }, [visibleGroups, searchQuery, statusFilter]);

  const handleOpenGroup = (group: AdminGroup) => {
    setSelectedGroup(group);
    setIsModalOpen(true);
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newCode) return;

    const teacherObj = teachers.find((t) => t.id === newTeacherId) || teachers[0];

    addGroup({
      name: newName,
      code: newCode.toUpperCase().trim(),
      language: newLanguage,
      level: newLevel,
      teacherId: teacherObj?.id || 'usr-teach-01',
      teacherName: teacherObj?.fullNameAr || 'Sarah Benali',
      daysAr: newDaysAr,
      daysEn: newDaysAr,
      startTime: newStartTime,
      endTime: newEndTime,
      maxCapacity: Number(newCapacity),
      studentIds: [],
      status: 'active',
    });

    setNewName('');
    setNewCode('');
    setIsAddGroupOpen(false);
  };

  const getDaysAbbreviation = (daysAr: string) => {
    if (language === 'ar') {
      if (daysAr.includes('الأحد') && daysAr.includes('الثلاثاء')) return 'أحد • ثلاثاء';
      if (daysAr.includes('الإثنين') && daysAr.includes('الأربعاء')) return 'إثنين • أربعاء';
      if (daysAr.includes('السبت') && daysAr.includes('الخميس')) return 'سبت • خميس';
      if (daysAr.includes('السبت') && daysAr.includes('الإثنين')) return 'سبت • إثنين';
      if (daysAr.includes('الجمعة') && daysAr.includes('السبت')) return 'جمعة • سبت';
      return daysAr;
    }
    if (language === 'fr') {
      if (daysAr.includes('الأحد') && daysAr.includes('الثلاثاء')) return 'Dim / Mar';
      if (daysAr.includes('الإثنين') && daysAr.includes('الأربعاء')) return 'Lun / Mer';
      if (daysAr.includes('السبت') && daysAr.includes('الخميس')) return 'Sam / Jeu';
      if (daysAr.includes('السبت') && daysAr.includes('الإثنين')) return 'Sam / Lun';
      if (daysAr.includes('الجمعة') && daysAr.includes('السبت')) return 'Ven / Sam';
      return daysAr;
    }
    // English default
    if (daysAr.includes('الأحد') && daysAr.includes('الثلاثاء')) return 'Sun / Tue';
    if (daysAr.includes('الإثنين') && daysAr.includes('الأربعاء')) return 'Mon / Wed';
    if (daysAr.includes('السبت') && daysAr.includes('الخميس')) return 'Sat / Thu';
    if (daysAr.includes('السبت') && daysAr.includes('الإثنين')) return 'Sat / Mon';
    if (daysAr.includes('الجمعة') && daysAr.includes('السبت')) return 'Fri / Sat';
    return daysAr;
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
            {language === 'ar' ? 'إدارة الأفواج والقاعات والمواعيد' : 'Classes & Classrooms Schedule'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5">
            {language === 'ar' ? 'سجل الأفواج والحصص (Groups Hub)' : 'Groups Management'}
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setIsAddGroupOpen(true)}
          className="rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2.5 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
          style={{ padding: '14px 28px' }}
        >
          <Plus size={18} />
          <span>{language === 'ar' ? 'إنشاء فوج دراسي جديد' : 'Create New Group'}</span>
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
            placeholder={language === 'ar' ? 'بحث باسم الفوج، الكود، المعلم، أو اللغة...' : 'Search group by name, code, teacher...'}
            className="w-full h-10 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-amber-500 transition-colors shadow-2xs"
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

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-750 rounded-xl text-xs font-bold focus:outline-none focus:border-amber-500 cursor-pointer shadow-2xs shrink-0"
        >
          <option value="all">{language === 'ar' ? 'جميع الأفواج' : 'All Groups'}</option>
          <option value="active">{language === 'ar' ? 'الأفواج النشطة' : 'Active Groups'}</option>
          <option value="archived">{language === 'ar' ? 'الأفواج المؤرشفة' : 'Archived Groups'}</option>
        </select>

        <div className="text-xs sm:text-sm font-bold text-slate-400 shrink-0">
          {language === 'ar' ? `العدد: ${filteredGroups.length} أفواج` : `Total: ${filteredGroups.length} groups`}
        </div>
      </div>

      {/* Groups Table (Section 12) */}
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
                  {language === 'ar' ? 'الفوج والكود' : 'Group Code & Name'}
                </th>
                <th className="py-3.5 px-4 text-center font-extrabold text-xs">{language === 'ar' ? 'اللغة والمستوى' : 'Language & Level'}</th>
                <th className="py-3.5 px-4 text-center font-extrabold text-xs">{language === 'ar' ? 'المعلم المشرف' : 'Assigned Teacher'}</th>
                <th className="py-3.5 px-4 text-center font-extrabold text-xs">{language === 'ar' ? 'الأيام والتوقيت' : 'Schedule'}</th>
                <th className="py-3.5 px-4 text-center font-extrabold text-xs">{language === 'ar' ? 'الطلاب / السعة' : 'Capacity'}</th>
                <th className="py-3.5 px-4 text-center font-extrabold text-xs">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                <th className="py-3.5 px-4 text-center font-extrabold text-xs">{language === 'ar' ? 'نسبة الحضور' : 'Attendance'}</th>
                <th className="py-3.5 px-4 text-center font-extrabold text-xs">{language === 'ar' ? 'التقدم' : 'Progress'}</th>
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
              {filteredGroups.map((grp) => (
                <tr
                  key={grp.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                  onClick={() => handleOpenGroup(grp)}
                >
                  <td
                    className="py-3.5"
                    style={{
                      paddingLeft: isRTL ? '20px' : '28px',
                      paddingRight: isRTL ? '28px' : '20px',
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black text-[10px] shrink-0 font-mono shadow-xs">
                        {grp.code}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm leading-snug">{grp.name}</div>
                        <div className="text-[11px] text-slate-400 font-medium mt-0.5">{grp.language} Track</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span
                      className="inline-flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono font-bold text-xs select-none"
                      style={{ padding: '5px 14px', minWidth: '46px', lineHeight: '1.2' }}
                    >
                      {grp.level}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center font-bold text-slate-700 dark:text-slate-300 text-xs">
                    {grp.teacherName}
                  </td>

                  <td className="py-3.5 px-4 text-center text-xs">
                    <div className="font-bold text-slate-900 dark:text-white tracking-wide">
                      {getDaysAbbreviation(grp.daysAr)}
                    </div>
                    <div className="font-mono text-slate-400 text-[11px] mt-0.5">{grp.startTime}–{grp.endTime}</div>
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono font-bold text-purple-600 dark:text-purple-400 text-xs">
                    {grp.studentIds.length} / {grp.maxCapacity}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    {grp.status === 'archived' ? (
                      <span
                        className="inline-flex items-center justify-center font-bold text-xs rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shadow-2xs whitespace-nowrap"
                        style={{ padding: '6px 18px', minWidth: '68px', lineHeight: '1.2' }}
                      >
                        {language === 'ar' ? 'مؤرشف' : 'Archived'}
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center justify-center font-bold text-xs rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-2xs whitespace-nowrap"
                        style={{ padding: '6px 18px', minWidth: '68px', lineHeight: '1.2' }}
                      >
                        {language === 'ar' ? 'نشط' : 'Active'}
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono font-black text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm">
                    {grp.attendanceRate}%
                  </td>

                  <td className="py-3.5 px-4 text-center font-mono font-black text-blue-600 dark:text-blue-400 text-xs sm:text-sm">
                    {grp.averageProgress}%
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
                      onClick={() => handleOpenGroup(grp)}
                      className="rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 font-bold text-xs transition-colors cursor-pointer"
                      style={{ padding: '6px 14px' }}
                    >
                      {language === 'ar' ? 'عرض الفوج' : 'View Group'} →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Group (Section 12) */}
      {isAddGroupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5 animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-black text-lg text-slate-900 dark:text-white">
                {language === 'ar' ? 'إنشاء فوج دراسي جديد (Create Group)' : 'Create New Class Group'}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddGroupOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-4 text-xs font-bold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">اسم الفوج *</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="مثال: Group A2 — Elementary"
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">رمز الفوج (Code) *</label>
                  <input
                    type="text"
                    required
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="مثال: A2-03"
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">اللغة</label>
                  <select
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value as any)}
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="English">English</option>
                    <option value="French">French</option>
                    <option value="Dual">Dual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">المستوى (Level)</label>
                  <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value as any)}
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  >
                    <option value="A1">A1</option>
                    <option value="A2">A2</option>
                    <option value="B1">B1</option>
                    <option value="B2">B2</option>
                    <option value="C1">C1</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">السعة القصوى</label>
                  <input
                    type="number"
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(Number(e.target.value))}
                    min={5}
                    max={40}
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">المعلم المشرف</label>
                <select
                  value={newTeacherId}
                  onChange={(e) => setNewTeacherId(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.fullNameAr} ({t.specialization})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">الأيام</label>
                  <input
                    type="text"
                    value={newDaysAr}
                    onChange={(e) => setNewDaysAr(e.target.value)}
                    placeholder="الأحد + الثلاثاء"
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">وقت البدء</label>
                  <input
                    type="text"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">وقت الانتهاء</label>
                  <input
                    type="text"
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-11 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-md transition-colors cursor-pointer text-sm"
                >
                  إنشاء وتفعيل الفوج
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Group Details Modal */}
      <GroupDetailModal
        group={selectedGroup}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedGroup(null);
        }}
      />
    </div>
  );
}
