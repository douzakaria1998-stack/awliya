'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
  Trash2,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useLanguage } from '@/context/LanguageContext';
import { AdminGroup } from '@/types/admin';
import { GroupDetailModal } from '../modals/GroupDetailModal';
import { SearchableSelect } from '@/components/common/SearchableSelect';
import { DateInputDMY } from '@/components/common/DateInputDMY';

interface ScheduleSlot {
  id: string;
  day: string;
  time: string;
  period: 'AM' | 'PM';
}

export function AdminGroupsScreen() {
  const { visibleGroups, teachers, students, addGroup, curricula, attendanceSessions } = useAdmin();
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
  const [newLevel, setNewLevel] = useState<string>('A1');
  const [newTeacherId, setNewTeacherId] = useState(teachers[0]?.id || '');
  const [newStartDate, setNewStartDate] = useState(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });
  const [newTotalSessions, setNewTotalSessions] = useState<number | string>(24);

  // Derive available levels dynamically from the Curriculum (Path Tab 1)
  const availableLevels = useMemo(() => {
    const langCurricula =
      newLanguage === 'Dual'
        ? curricula
        : curricula.filter((c) => c.language === newLanguage);

    if (langCurricula && langCurricula.length > 0) {
      const seen = new Set<string>();
      const list: { code: string; nameAr?: string; nameEn?: string; levelNumber?: number }[] = [];
      const sorted = [...langCurricula].sort((a, b) => (a.levelNumber || 0) - (b.levelNumber || 0));

      sorted.forEach((c) => {
        const levelName = language === 'ar'
          ? (c.nameAr || `المستوى ${c.levelNumber}`)
          : (c.nameEn || c.nameAr || `Level ${c.levelNumber}`);

        if (!seen.has(levelName)) {
          seen.add(levelName);
          list.push({
            code: levelName,
            nameAr: c.nameAr || `المستوى ${c.levelNumber}`,
            nameEn: c.nameEn || `Level ${c.levelNumber}`,
            levelNumber: c.levelNumber,
          });
        }
      });
      return list;
    }

    // Default fallback if no curriculum levels exist
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((lvl) => ({
      code: language === 'ar' ? `المستوى ${lvl}` : `Level ${lvl}`,
      nameAr: `المستوى ${lvl}`,
      nameEn: `Level ${lvl}`,
      levelNumber: lvl,
    }));
  }, [curricula, newLanguage, language]);

  // Keep newLevel valid when language or availableLevels change
  useEffect(() => {
    if (availableLevels.length > 0) {
      const exists = availableLevels.some((l) => l.code === newLevel);
      if (!exists) {
        setNewLevel(availableLevels[0].code);
      }
    }
  }, [availableLevels, newLevel]);

  // Auto-suggest next unique 4-digit code when opening add group modal
  useEffect(() => {
    if (isAddGroupOpen && !newCode) {
      const existing = new Set(visibleGroups.map((g) => g.code?.trim()).filter(Boolean));
      for (let num = 3925; num <= 9999; num++) {
        if (!existing.has(num.toString())) {
          setNewCode(num.toString());
          break;
        }
      }
    }
  }, [isAddGroupOpen, newCode, visibleGroups]);

  // Dynamic schedules (Day + Time + AM/PM)
  const [schedules, setSchedules] = useState<ScheduleSlot[]>([
    { id: '1', day: 'الأحد', time: '06:00', period: 'PM' },
    { id: '2', day: 'الثلاثاء', time: '06:00', period: 'PM' },
  ]);

  const DAYS_LIST = [
    { value: 'الأحد', labelAr: 'الأحد', labelEn: 'Sunday' },
    { value: 'الإثنين', labelAr: 'الإثنين', labelEn: 'Monday' },
    { value: 'الثلاثاء', labelAr: 'الثلاثاء', labelEn: 'Tuesday' },
    { value: 'الأربعاء', labelAr: 'الأربعاء', labelEn: 'Wednesday' },
    { value: 'الخميس', labelAr: 'الخميس', labelEn: 'Thursday' },
    { value: 'الجمعة', labelAr: 'الجمعة', labelEn: 'Friday' },
    { value: 'السبت', labelAr: 'السبت', labelEn: 'Saturday' },
  ];

  const handleAddSchedule = () => {
    setSchedules((prev) => [
      ...prev,
      { id: Date.now().toString(), day: 'الأربعاء', time: '06:00', period: 'PM' },
    ]);
  };

  const handleRemoveSchedule = (id: string) => {
    if (schedules.length <= 1) return;
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  };

  const handleUpdateSchedule = (id: string, field: keyof ScheduleSlot, value: string) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

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
    const daysArFormatted = schedules.map((s) => s.day).join(' + ');
    const daysEnFormatted = schedules
      .map((s) => DAYS_LIST.find((d) => d.value === s.day)?.labelEn || s.day)
      .join(' + ');
    const startTimeFormatted = schedules
      .map((s) => `${s.time} ${s.period}`)
      .join(' / ');

    addGroup({
      name: newName,
      code: newCode.toUpperCase().trim(),
      language: newLanguage,
      level: newLevel as any,
      teacherId: teacherObj?.id || 'usr-teach-01',
      teacherName: teacherObj?.fullNameAr || 'Sarah Benali',
      daysAr: daysArFormatted,
      daysEn: daysEnFormatted,
      startTime: startTimeFormatted,
      endTime: '20:00',
      schedules: schedules.map((s) => ({ day: s.day, time: s.time, period: s.period })),
      startDate: newStartDate,
      totalSessions: Number(newTotalSessions) || 24,
      maxCapacity: 20,
      studentIds: [],
      status: 'active',
    });

    setNewName('');
    setNewCode('');
    const d = new Date();
    const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    setNewStartDate(todayStr);
    setNewTotalSessions(24);
    setSchedules([
      { id: '1', day: 'الأحد', time: '06:00', period: 'PM' },
      { id: '2', day: 'الثلاثاء', time: '06:00', period: 'PM' },
    ]);
    setIsAddGroupOpen(false);
  };

  const sanitizeTimeStr = (raw: string) => {
    if (!raw) return '06:00 PM';
    let str = raw.trim();
    const match = str.match(/(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?)/i);
    if (match) {
      let t = match[1].trim();
      if (!/(AM|PM|am|pm)/i.test(t)) {
        t = `${t} PM`;
      }
      return t.toUpperCase();
    }
    return str.split('/')[0]?.trim() || '06:00 PM';
  };

  const renderGroupSchedule = (grp: AdminGroup) => {
    // 1. If group has structured schedules array
    if (grp.schedules && grp.schedules.length > 0) {
      return (
        <div className="flex flex-col items-center gap-1.5 py-0.5 whitespace-nowrap">
          {grp.schedules.map((s, idx) => (
            <div
              key={idx}
              className="inline-flex items-center justify-between gap-3 px-3 py-1 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs min-w-[150px]"
            >
              <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                {s.day}
              </span>
              <span
                className="inline-flex items-center font-mono font-bold text-[11px] text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/70 px-2 py-0.5 rounded-lg border border-indigo-100 dark:border-indigo-900/60 shrink-0"
                dir="ltr"
              >
                {sanitizeTimeStr(s.time ? `${s.time} ${s.period || ''}` : '')}
              </span>
            </div>
          ))}
        </div>
      );
    }

    // 2. Parse from daysAr (e.g. "الأحد + الثلاثاء") and startTime
    const days = grp.daysAr ? grp.daysAr.split(/\s*[\+\•\/,]\s*/).filter(Boolean) : [];
    const times = grp.startTime ? grp.startTime.split(/\s*[\/]\s*/).filter(Boolean) : [];

    if (days.length > 0) {
      return (
        <div className="flex flex-col items-center gap-1.5 py-0.5 whitespace-nowrap">
          {days.map((day, idx) => {
            const rawTime = times[idx] || times[0] || grp.startTime || '06:00 PM';
            const cleanTime = sanitizeTimeStr(rawTime);
            return (
              <div
                key={idx}
                className="inline-flex items-center justify-between gap-3 px-3 py-1 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs min-w-[150px]"
              >
                <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                  {day.trim()}
                </span>
                <span
                  className="inline-flex items-center font-mono font-bold text-[11px] text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/70 px-2 py-0.5 rounded-lg border border-indigo-100 dark:border-indigo-900/60 shrink-0"
                  dir="ltr"
                >
                  {cleanTime}
                </span>
              </div>
            );
          })}
        </div>
      );
    }

    return <span className="text-slate-400 text-xs">—</span>;
  };

  const getGroupAttendanceRate = (grp: AdminGroup) => {
    const groupConfirmedSessions = attendanceSessions.filter(
      (a) => a.groupId === grp.id && (a.isLocked || (a.records && a.records.length > 0))
    );
    if (!grp.studentIds || grp.studentIds.length === 0 || groupConfirmedSessions.length === 0) return 0;

    let totalPossible = 0;
    let totalAttended = 0;

    groupConfirmedSessions.forEach((sess) => {
      sess.records?.forEach((rec) => {
        totalPossible++;
        if (rec.status === 'present' || rec.status === 'late' || rec.status === 'excused') {
          totalAttended++;
        }
      });
    });

    return totalPossible > 0 ? Math.round((totalAttended / totalPossible) * 100) : 0;
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
        className="bg-transparent border-0 rounded-[32px] overflow-hidden"
        style={{ marginBottom: '44px' }}
      >
        <div className="overflow-x-auto">
          <table className={`w-full text-xs sm:text-sm border-separate border-spacing-y-3.5 ${isRTL ? 'text-right' : 'text-left'}`}>
            <thead className="text-slate-400 font-bold">
              <tr>
                <th
                  className={`font-extrabold text-xs pb-1 ${isRTL ? 'text-right' : 'text-left'}`}
                  style={{
                    paddingLeft: isRTL ? '20px' : '28px',
                    paddingRight: isRTL ? '28px' : '20px',
                  }}
                >
                  {language === 'ar' ? 'الفوج والكود' : 'Group Code & Name'}
                </th>
                <th className="pb-1 px-4 text-center font-extrabold text-xs">{language === 'ar' ? 'اللغة والمستوى' : 'Language & Level'}</th>
                <th className="pb-1 px-4 text-center font-extrabold text-xs">{language === 'ar' ? 'المعلم المشرف' : 'Assigned Teacher'}</th>
                <th className="pb-1 px-4 text-center font-extrabold text-xs">{language === 'ar' ? 'الأيام والتوقيت' : 'Schedule'}</th>
                <th className="pb-1 px-4 text-center font-extrabold text-xs">{language === 'ar' ? 'عدد الطلاب' : 'Students'}</th>
                <th className="pb-1 px-4 text-center font-extrabold text-xs">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                <th className="pb-1 px-4 text-center font-extrabold text-xs">{language === 'ar' ? 'نسبة الحضور' : 'Attendance'}</th>
                <th className="pb-1 px-4 text-center font-extrabold text-xs">{language === 'ar' ? 'التقدم' : 'Progress'}</th>
                <th
                  className="pb-1 font-extrabold text-center text-xs"
                  style={{
                    paddingRight: isRTL ? '28px' : '20px',
                    paddingLeft: isRTL ? '20px' : '28px',
                  }}
                >
                  {language === 'ar' ? 'الإجراءات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredGroups.map((grp) => (
                <tr
                  key={grp.id}
                  className="bg-white dark:bg-slate-850 hover:bg-amber-50/50 dark:hover:bg-slate-800 transition-all cursor-pointer group shadow-2xs hover:shadow-xs"
                  onClick={() => handleOpenGroup(grp)}
                >
                  <td
                    className="py-4.5 border-y border-slate-200/80 dark:border-slate-800 rtl:border-r rtl:rounded-r-2xl ltr:border-l ltr:rounded-l-2xl"
                    style={{
                      paddingLeft: isRTL ? '20px' : '28px',
                      paddingRight: isRTL ? '28px' : '20px',
                    }}
                  >
                    <div className="flex items-center gap-2.5 whitespace-nowrap">
                      <span
                        className="inline-flex items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-mono font-black text-xs sm:text-sm border border-amber-200/80 dark:border-amber-800/60 shrink-0 shadow-xs"
                        style={{ padding: '5px 12px', minWidth: '42px', height: '32px' }}
                      >
                        {grp.code}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">{grp.name}</span>
                      <span className="text-slate-300 dark:text-slate-600 text-xs">•</span>
                      <span className="text-[11px] text-slate-400 font-medium bg-slate-100/80 dark:bg-slate-800/80 px-2 py-0.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                        {grp.language}
                      </span>
                    </div>
                  </td>

                  <td className="py-4.5 px-4 text-center border-y border-slate-200/80 dark:border-slate-800">
                    <span
                      className="inline-flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono font-bold text-xs select-none"
                      style={{ padding: '6px 14px', minWidth: '48px', lineHeight: '1.2' }}
                    >
                      {grp.level}
                    </span>
                  </td>

                  <td className="py-4.5 px-4 text-center font-bold text-slate-700 dark:text-slate-300 text-xs sm:text-sm border-y border-slate-200/80 dark:border-slate-800">
                    {grp.teacherName}
                  </td>

                  <td className="py-4.5 px-4 text-center text-xs border-y border-slate-200/80 dark:border-slate-800">
                    {renderGroupSchedule(grp)}
                  </td>

                  <td className="py-4.5 px-4 text-center font-mono font-bold text-purple-600 dark:text-purple-400 text-xs sm:text-sm border-y border-slate-200/80 dark:border-slate-800">
                    {grp.studentIds.length}
                  </td>

                  <td className="py-4.5 px-4 text-center border-y border-slate-200/80 dark:border-slate-800">
                    {grp.status === 'archived' ? (
                      <span
                        className="inline-flex items-center justify-center font-bold text-[11px] rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shadow-2xs whitespace-nowrap"
                        style={{ padding: '4px 14px', minWidth: '58px', lineHeight: '1.2' }}
                      >
                        {language === 'ar' ? 'مؤرشف' : 'Archived'}
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center justify-center font-bold text-[11px] rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-2xs whitespace-nowrap"
                        style={{ padding: '4px 14px', minWidth: '58px', lineHeight: '1.2' }}
                      >
                        {language === 'ar' ? 'نشط' : 'Active'}
                      </span>
                    )}
                  </td>

                  <td className="py-4.5 px-4 text-center font-mono font-black text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm border-y border-slate-200/80 dark:border-slate-800">
                    {getGroupAttendanceRate(grp)}%
                  </td>

                  <td className="py-4.5 px-4 text-center font-mono font-black text-blue-600 dark:text-blue-400 text-xs sm:text-sm border-y border-slate-200/80 dark:border-slate-800">
                    {grp.studentIds.length === 0 ? '0%' : `${grp.averageProgress}%`}
                  </td>

                  <td
                    className="py-4.5 text-center border-y border-slate-200/80 dark:border-slate-800 rtl:border-l rtl:rounded-l-2xl ltr:border-r ltr:rounded-r-2xl"
                    style={{
                      paddingRight: isRTL ? '28px' : '20px',
                      paddingLeft: isRTL ? '20px' : '28px',
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => handleOpenGroup(grp)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 font-bold text-xs transition-colors cursor-pointer border border-amber-200/60 dark:border-amber-800/60 shadow-2xs"
                      style={{ padding: '7px 15px', lineHeight: '1.2' }}
                    >
                      <span>{language === 'ar' ? 'عرض الفوج' : 'View Group'}</span>
                      {isRTL ? <ArrowLeft size={13} className="shrink-0" /> : <ArrowRight size={13} className="shrink-0" />}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[22px] shadow-2xl border border-slate-200 dark:border-slate-800 animate-fade-in-up my-auto max-h-[92vh] overflow-y-auto"
            style={{ padding: '20px 24px' }}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-3.5">
              <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white tracking-tight">
                {language === 'ar' ? 'إنشاء فوج دراسي جديد' : 'Create New Class Group'}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddGroupOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-slate-700 dark:text-slate-300 font-bold text-[11px]">
                    {language === 'ar' ? 'اسم الفوج *' : 'Group Name *'}
                  </label>
                  <input
                    type="text"
                    dir="auto"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder={language === 'ar' ? 'مثال: الفوج A2 — المتوسط' : 'e.g. Group A2 — Elementary'}
                    style={{ paddingLeft: '14px', paddingRight: '14px' }}
                    className="w-full h-9 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-slate-700 dark:text-slate-300 font-bold text-[11px]">
                    {language === 'ar' ? 'رمز الفوج *' : 'Group Code *'}
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    required
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="مثال: A2-03"
                    style={{ paddingLeft: '14px', paddingRight: '14px' }}
                    className="w-full h-9 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-slate-700 dark:text-slate-300 font-bold text-[11px]">
                    {language === 'ar' ? 'اللغة' : 'Language'}
                  </label>
                  <select
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value as any)}
                    style={{ paddingLeft: '14px', paddingRight: '14px' }}
                    className="w-full h-9 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-amber-500/20"
                  >
                    <option value="English">English</option>
                    <option value="French">French</option>
                    <option value="Dual">Dual</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-slate-700 dark:text-slate-300 font-bold text-[11px]">
                    {language === 'ar' ? 'المستوى' : 'Level'}
                  </label>
                  <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value)}
                    style={{ paddingLeft: '14px', paddingRight: '14px' }}
                    className="w-full h-9 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-amber-500/20"
                  >
                    {availableLevels.map((lvl) => (
                      <option key={lvl.code} value={lvl.code}>
                        {lvl.code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-slate-700 dark:text-slate-300 font-bold text-[11px]">
                  {language === 'ar' ? 'المعلم المشرف' : 'Supervising Teacher'}
                </label>
                <SearchableSelect
                  options={teachers.map((t) => ({
                    value: t.id,
                    label: t.fullNameAr,
                    subLabel: t.specialization,
                  }))}
                  value={newTeacherId}
                  onChange={(val) => setNewTeacherId(val)}
                  themeColor="amber"
                  placeholder={language === 'ar' ? 'اختر المعلم المشرف...' : 'Select teacher...'}
                  searchPlaceholder={language === 'ar' ? 'ابحث باسم المعلم أو التخصص...' : 'Search teacher or subject...'}
                  emptyText={language === 'ar' ? 'لا يوجد معلم بهذا الاسم' : 'No matching teachers found'}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-slate-700 dark:text-slate-300 font-bold text-[11px] flex items-center gap-1.5">
                    <Calendar size={13} className="text-amber-500" />
                    <span>{language === 'ar' ? 'تاريخ بداية الفوج (DD/MM/YYYY)' : 'Start Date (DD/MM/YYYY)'}</span>
                  </label>
                  <DateInputDMY
                    value={newStartDate}
                    onChange={(val) => setNewStartDate(val)}
                    className="w-full h-9 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 hover:border-amber-500/50 focus-within:ring-2 focus-within:ring-amber-500/20"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-slate-700 dark:text-slate-300 font-bold text-[11px] flex items-center gap-1.5">
                    <Clock size={13} className="text-amber-500" />
                    <span>{language === 'ar' ? 'عدد الحصص الإجمالي' : 'Total Sessions'}</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={200}
                    value={newTotalSessions}
                    onChange={(e) => setNewTotalSessions(e.target.value)}
                    placeholder="24"
                    style={{ paddingLeft: '14px', paddingRight: '14px' }}
                    className="w-full h-9 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              {/* Dynamic Schedules (Days & Times) */}
              <div className="flex flex-col gap-2 pt-0.5">
                <div className="flex items-center justify-between">
                  <label className="text-slate-700 dark:text-slate-300 font-bold text-[11px] flex items-center gap-1.5">
                    <Calendar size={13} className="text-amber-500" />
                    <span>{language === 'ar' ? 'مواعيد وأوقات الحصص' : 'Class Days & Schedule Times'}</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {language === 'ar' ? `${schedules.length} حصص أسبوعياً` : `${schedules.length} sessions/week`}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  {schedules.map((slot, index) => (
                    <div
                      key={slot.id}
                      style={{ padding: '10px 12px' }}
                      className="rounded-xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700/80"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2.5 items-end">
                        {/* Day Selector */}
                        <div className="flex flex-col gap-1 min-w-0">
                          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                            {language === 'ar' ? `اليوم (${index + 1})` : `Day (${index + 1})`}
                          </label>
                          <select
                            value={slot.day}
                            onChange={(e) => handleUpdateSchedule(slot.id, 'day', e.target.value)}
                            style={{ paddingLeft: '12px', paddingRight: '12px' }}
                            className="w-full h-9 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-amber-500/20"
                          >
                            {DAYS_LIST.map((d) => (
                              <option key={d.value} value={d.value}>
                                {language === 'ar' ? d.labelAr : d.labelEn}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Time Section with Clock icon, 00:00 input, and AM/PM */}
                        <div className="flex flex-col gap-1 min-w-0">
                          <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                            {language === 'ar' ? 'وقت الحصة' : 'Session Time'}
                          </label>
                          <div
                            dir="ltr"
                            className="h-9 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-between focus-within:ring-2 focus-within:ring-amber-500/20"
                            style={{ paddingLeft: '10px', paddingRight: '4px', gap: '6px' }}
                          >
                            {/* Clock Icon */}
                            <Clock size={14} className="text-amber-500 shrink-0" />

                            {/* Time Input: "00:00" */}
                            <input
                              type="text"
                              value={slot.time}
                              onChange={(e) => handleUpdateSchedule(slot.id, 'time', e.target.value)}
                              placeholder="06:00"
                              style={{ width: '65px' }}
                              className="bg-transparent text-center font-mono font-bold text-xs text-slate-800 dark:text-slate-200 outline-none"
                            />

                            {/* AM / PM Toggle Pill */}
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateSchedule(slot.id, 'period', slot.period === 'AM' ? 'PM' : 'AM')
                              }
                              style={{ paddingLeft: '8px', paddingRight: '8px', height: '26px' }}
                              className={`rounded-md font-mono font-black text-[10px] transition-all cursor-pointer shrink-0 select-none flex items-center justify-center ${
                                slot.period === 'PM'
                                  ? 'bg-amber-500 text-slate-950 hover:bg-amber-600'
                                  : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}
                            >
                              {slot.period}
                            </button>
                          </div>
                        </div>

                        {/* Delete Slot Button */}
                        {schedules.length > 1 && (
                          <div className="flex flex-col gap-1 items-end sm:items-center">
                            <span className="text-[11px] font-bold text-transparent select-none hidden sm:block">.</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSchedule(slot.id)}
                              className="w-9 h-9 rounded-lg bg-rose-50 hover:bg-rose-100 active:scale-95 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center cursor-pointer transition-all shrink-0 border border-rose-200/60 dark:border-rose-800/40"
                              title={language === 'ar' ? 'حذف هذا التوقيت' : 'Remove schedule'}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Button to Add Day and Time */}
                <button
                  type="button"
                  onClick={handleAddSchedule}
                  style={{ paddingLeft: '14px', paddingRight: '14px', gap: '6px' }}
                  className="w-full h-9 rounded-xl border border-dashed border-amber-300 dark:border-amber-700/80 bg-amber-50/60 dark:bg-amber-950/30 hover:bg-amber-100/70 dark:hover:bg-amber-900/50 text-amber-800 dark:text-amber-300 font-bold text-xs flex items-center justify-center transition-all cursor-pointer active:scale-98"
                >
                  <Plus size={14} className="shrink-0" />
                  <span>{language === 'ar' ? 'إضافة يوم ووقت آخر' : 'Add Another Day & Time'}</span>
                </button>
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  className="w-full h-10 bg-amber-500 hover:bg-amber-600 active:scale-98 text-slate-950 font-black rounded-xl shadow-md shadow-amber-500/20 transition-all cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-2"
                >
                  <span>{language === 'ar' ? 'إنشاء وتفعيل الفوج' : 'Create & Activate Group'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Group Details Modal */}
      <GroupDetailModal
        group={visibleGroups.find((g) => g.id === selectedGroup?.id) || selectedGroup}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedGroup(null);
        }}
      />
    </div>
  );
}
