'use client';

import React, { useState, useMemo } from 'react';
import {
  X,
  School,
  Users,
  CalendarCheck2,
  TrendingUp,
  Award,
  BookCheck,
  Calendar,
  Clock,
  User,
  GraduationCap,
  Sparkles,
  UserPlus,
  Plus,
  Search,
  Check,
  CheckCircle2,
  Pencil,
} from 'lucide-react';
import { AdminGroup } from '@/types/admin';
import { useAdmin } from '@/context/AdminContext';
import { useLanguage } from '@/context/LanguageContext';
import { SearchableSelect } from '@/components/common/SearchableSelect';

interface GroupDetailModalProps {
  group: AdminGroup | null;
  isOpen: boolean;
  onClose: () => void;
}

type GroupTabKey = 'overview' | 'students' | 'attendance' | 'progress' | 'performance' | 'assessments';

export function GroupDetailModal({ group, isOpen, onClose }: GroupDetailModalProps) {
  const {
    students,
    parents,
    teachers,
    curricula,
    attendanceSessions,
    homeworkList,
    assessments,
    assignStudentToGroup,
    addStudent,
    updateStudent,
    updateGroup,
  } = useAdmin();
  const { isRTL, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<GroupTabKey>('overview');

  // Sub-modal state: Edit Group
  const [isEditGroupOpen, setIsEditGroupOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editCode, setEditCode] = useState('');
  const [editLanguage, setEditLanguage] = useState<'English' | 'French' | 'Dual'>('English');
  const [editLevel, setEditLevel] = useState('');
  const [editTeacherId, setEditTeacherId] = useState('');
  const [editSchedule, setEditSchedule] = useState('');
  const [editStartDate, setEditStartDate] = useState('');
  const [editTotalSessions, setEditTotalSessions] = useState<number | string>(24);
  const [editStatus, setEditStatus] = useState<'active' | 'archived'>('active');
  const [editCapacity, setEditCapacity] = useState(25);

  // Sub-modal state: Add Student
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [addMode, setAddMode] = useState<'existing' | 'new'>('existing');
  const [studentSearch, setStudentSearch] = useState('');
  const [justAddedStudentId, setJustAddedStudentId] = useState<string | null>(null);

  // New Student fields
  const [newFirstNameAr, setNewFirstNameAr] = useState('');
  const [newLastNameAr, setNewLastNameAr] = useState('');
  const [newFirstNameEn, setNewFirstNameEn] = useState('');
  const [newLastNameEn, setNewLastNameEn] = useState('');
  const [newGender, setNewGender] = useState<'male' | 'female'>('male');
  const [newBirthDate, setNewBirthDate] = useState('2015-05-15');
  const [selectedParentId, setSelectedParentId] = useState('');
  const [parentSearchQuery, setParentSearchQuery] = useState('');

  const handleOpenEditGroup = () => {
    if (!group) return;
    const gAny = group as any;
    setEditName(group.name || '');
    setEditCode(group.code || '');
    setEditLanguage(group.language || 'English');
    setEditLevel(group.level || 'A1');
    setEditTeacherId(group.teacherId || (teachers[0]?.id || ''));
    setEditSchedule(gAny.schedule || group.daysAr || '');
    setEditStartDate(group.startDate || '2025-02-01');
    setEditTotalSessions(group.totalSessions ?? 24);
    setEditStatus((group.status === 'archived' ? 'archived' : 'active'));
    setEditCapacity(gAny.capacity || 25);
    setIsEditGroupOpen(true);
  };

  const handleSaveEditGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!group) return;
    const teacherObj = teachers.find((t) => t.id === editTeacherId);
    updateGroup(group.id, {
      name: editName.trim(),
      code: editCode.trim(),
      language: editLanguage,
      level: editLevel as any,
      teacherId: editTeacherId,
      teacherName: teacherObj
        ? language === 'ar'
          ? teacherObj.fullNameAr
          : teacherObj.fullNameEn || teacherObj.fullNameAr
        : group.teacherName,
      schedule: editSchedule.trim(),
      startDate: editStartDate,
      totalSessions: Number(editTotalSessions) || 24,
      status: editStatus,
      capacity: Number(editCapacity) || 25,
    } as any);
    setIsEditGroupOpen(false);
  };

  const availableLevels = useMemo(() => {
    const langCurricula = (curricula || []).filter(
      (c) =>
        editLanguage === 'Dual' ||
        (editLanguage === 'French' ? c.language === 'French' : c.language === 'English')
    );
    const sorted = [...langCurricula].sort((a, b) => (a.levelNumber || 0) - (b.levelNumber || 0));
    const seen = new Set<string>();
    const list: { code: string; name: string }[] = [];
    sorted.forEach((c) => {
      const code = c.cefrCode;
      const name =
        language === 'ar'
          ? c.nameAr || `المستوى ${c.levelNumber}`
          : c.nameEn || c.nameAr || `Level ${c.levelNumber}`;
      if (!seen.has(code)) {
        seen.add(code);
        list.push({ code, name });
      }
    });
    return list.length > 0
      ? list
      : [
          { code: 'A1', name: 'A1' },
          { code: 'A2', name: 'A2' },
          { code: 'B1', name: 'B1' },
          { code: 'B2', name: 'B2' },
          { code: 'C1', name: 'C1' },
        ];
  }, [curricula, editLanguage, language]);

  const groupStudents = group
    ? students.filter((s) => group.studentIds.includes(s.id) || s.groupId === group.id)
    : [];
  const availableStudents = group
    ? students.filter((s) => !group.studentIds.includes(s.id) && s.groupId !== group.id)
    : [];

  const filteredAvailableStudents = availableStudents.filter((s) => {
    const q = studentSearch.toLowerCase();
    return (
      s.fullNameAr.toLowerCase().includes(q) ||
      s.fullNameEn.toLowerCase().includes(q) ||
      s.parentName.toLowerCase().includes(q) ||
      s.parentPhone.includes(q)
    );
  });

  const filteredParents = parents.filter((p) => {
    const q = parentSearchQuery.toLowerCase();
    return (
      p.fullNameAr.toLowerCase().includes(q) ||
      p.fullNameEn.toLowerCase().includes(q) ||
      p.phone.includes(q)
    );
  });

  const groupConfirmedSessions = group
    ? attendanceSessions.filter(
        (a) => a.groupId === group.id && (a.isLocked || (a.records && a.records.length > 0))
      )
    : [];

  let realGroupAttendanceRate = 0;
  if (groupStudents && groupStudents.length > 0 && groupConfirmedSessions.length > 0) {
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

    realGroupAttendanceRate = totalPossible > 0 ? Math.round((totalAttended / totalPossible) * 100) : 0;
  }

  const handleEnrollExisting = (studentId: string) => {
    if (!group) return;
    assignStudentToGroup(group.id, studentId);
    setJustAddedStudentId(studentId);
    setTimeout(() => setJustAddedStudentId(null), 2000);
  };

  const handleCreateAndEnroll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!group || !newFirstNameAr.trim()) return;

    const fullAr = `${newFirstNameAr.trim()} ${newLastNameAr.trim()}`.trim();
    const fullEn = `${newFirstNameEn.trim()} ${newLastNameEn.trim()}`.trim() || fullAr;
    const linkedParent = parents.find((p) => p.id === selectedParentId);

    addStudent({
      fullNameAr: fullAr,
      fullNameEn: fullEn,
      gender: newGender,
      currentLevel: group.levelNumber || 1,
      language: group.language,
      groupId: group.id,
      groupName: group.name,
      teacherId: group.teacherId,
      teacherName: group.teacherName,
      parentId: linkedParent?.id,
      parentName: linkedParent ? linkedParent.fullNameAr : 'غير مربوط',
      parentPhone: linkedParent ? linkedParent.phone : '',
    });

    setNewFirstNameAr('');
    setNewLastNameAr('');
    setNewFirstNameEn('');
    setNewLastNameEn('');
    setNewBirthDate('2015-05-15');
    setNewGender('male');
    setSelectedParentId('');
    setIsAddStudentOpen(false);
  };

  if (!isOpen || !group) return null;

  const groupAttendance = attendanceSessions.filter((a) => a.groupId === group.id);
  const groupHomework = homeworkList.filter((h) => h.groupId === group.id);
  const groupAssessments = assessments.filter((a) => a.groupId === group.id);

  const tabs: { key: GroupTabKey; labelAr: string; labelEn: string; icon: any }[] = [
    { key: 'overview', labelAr: 'نظرة عامة', labelEn: 'Overview', icon: School },
    { key: 'students', labelAr: 'الطلاب', labelEn: 'Students', icon: Users },
    { key: 'attendance', labelAr: 'الحضور', labelEn: 'Attendance', icon: CalendarCheck2 },
    { key: 'progress', labelAr: 'التقدم', labelEn: 'Progress', icon: TrendingUp },
    { key: 'performance', labelAr: 'الواجبات', labelEn: 'Homework', icon: BookCheck },
    { key: 'assessments', labelAr: 'الاختبارات', labelEn: 'Assessments', icon: Award },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-fade-in-up flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div
          className="bg-slate-900 text-white flex items-center justify-between shrink-0"
          style={{ padding: '16px 24px' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-black text-sm shadow-md shrink-0">
              <School size={18} />
            </div>
            <div>
              <div className="flex items-center flex-wrap gap-2.5">
                {/* 1. Group ID */}
                <span
                  className="rounded-xl bg-amber-500/20 text-amber-300 font-mono font-black text-xs sm:text-sm border border-amber-400/40 shadow-xs flex items-center justify-center shrink-0"
                  style={{ padding: '4px 12px' }}
                >
                  {group.code}
                </span>

                {/* 2. Level Name */}
                <span
                  className="rounded-xl bg-indigo-500/20 text-indigo-300 font-bold text-xs sm:text-sm border border-indigo-400/40 shadow-xs flex items-center justify-center shrink-0"
                  style={{ padding: '4px 14px' }}
                >
                  {group.level}
                </span>

                {/* 3. Group Name */}
                <span
                  className="rounded-xl bg-sky-500/20 text-sky-200 font-black text-xs sm:text-sm border border-sky-400/40 shadow-xs flex items-center justify-center shrink-0"
                  style={{ padding: '4px 14px' }}
                >
                  {group.name}
                </span>

                {/* 4. Language Badge */}
                <span
                  className="rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs sm:text-sm border border-emerald-400/40 shadow-xs flex items-center justify-center shrink-0"
                  style={{ padding: '4px 12px' }}
                >
                  {language === 'ar'
                    ? group.language === 'English'
                      ? 'الإنجليزية'
                      : group.language === 'French'
                      ? 'الفرنسية'
                      : 'مسار مزدوج'
                    : group.language}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-1">
                {language === 'ar' ? 'المعلم:' : 'Teacher:'} {group.teacherName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenEditGroup}
              className="rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 border border-white/15 transition-all cursor-pointer whitespace-nowrap shadow-xs"
              style={{ padding: '7px 14px' }}
              title={language === 'ar' ? 'تعديل بيانات الفوج' : 'Edit Group Details'}
            >
              <Pencil size={14} className="text-amber-400" />
              <span>{language === 'ar' ? 'تعديل الفوج' : 'Edit Group'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAddStudentOpen(true)}
              className="rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
              style={{ padding: '7px 14px' }}
            >
              <UserPlus size={15} />
              <span>{language === 'ar' ? 'إضافة طالب' : 'Add Student'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Tab Navigation (Section 13) */}
        <div
          className="grid grid-cols-6 bg-slate-100 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 shrink-0"
          style={{ padding: '8px 12px', gap: '6px' }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap w-full ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs border border-amber-200/60 dark:border-amber-900/60'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-slate-800/40'
                }`}
                style={{ padding: '8px 6px' }}
              >
                <Icon size={14} className="shrink-0" />
                <span className="truncate">{language === 'ar' ? tab.labelAr : tab.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div
          className={`overflow-y-auto flex-1 space-y-5 ${isRTL ? 'text-right' : 'text-left'}`}
          style={{ padding: '20px 24px' }}
        >
          {/* TAB 1: Overview */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                <div
                  className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
                  style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: '4px' }}
                >
                  <span className="text-xs text-slate-400 font-medium">
                    {language === 'ar' ? 'المعلم المشرف:' : 'Assigned Teacher:'}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm truncate">{group.teacherName}</span>
                </div>

                <div
                  className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
                  style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: '6px' }}
                >
                  <span className="text-xs text-slate-400 font-medium">
                    {language === 'ar' ? 'أيام الحصص والتوقيت:' : 'Schedule & Timing:'}
                  </span>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
                    {group.schedules && group.schedules.length > 0 ? (
                      group.schedules.map((s, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                          <span>{s.day}</span>
                          <span className="text-slate-400">:</span>
                          <span className="font-mono text-indigo-600 dark:text-indigo-400 text-[11px]" dir="ltr">
                            {s.time} {s.period || ''}
                          </span>
                        </div>
                      ))
                    ) : (
                      <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                        {group.daysAr || (group as any).schedule || 'حسب الجدول'}
                      </span>
                    )}
                  </div>
                </div>

                <div
                  className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
                  style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: '4px' }}
                >
                  <span className="text-xs text-slate-400 font-medium">
                    {language === 'ar' ? 'تاريخ بداية الفوج:' : 'Start Date:'}
                  </span>
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-xs sm:text-sm" dir="ltr">
                    {group.startDate || '2025-02-01'}
                  </span>
                </div>

                <div
                  className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
                  style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: '4px' }}
                >
                  <span className="text-xs text-slate-400 font-medium">
                    {language === 'ar' ? 'عدد الحصص الإجمالي:' : 'Total Sessions:'}
                  </span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-xs sm:text-sm">
                    {group.totalSessions ?? 24} {language === 'ar' ? 'حصة' : 'sessions'}
                  </span>
                </div>
              </div>

              {/* Progress and Attendance Stat Boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div
                  className="rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60"
                  style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}
                >
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    {language === 'ar' ? 'متوسط نسبة حضور الفوج:' : 'Average Group Attendance:'}
                  </span>
                  <div className="text-2xl font-black font-mono text-emerald-900 dark:text-emerald-200">
                    {realGroupAttendanceRate}%
                  </div>
                </div>
                <div
                  className="rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/60"
                  style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}
                >
                  <span className="text-xs font-bold text-blue-800 dark:text-blue-300">
                    {language === 'ar' ? 'متوسط التقدم في المنهاج:' : 'Average Curriculum Progress:'}
                  </span>
                  <div className="text-2xl font-black font-mono text-blue-900 dark:text-blue-200">
                    {group.studentIds.length === 0 ? '0%' : `${group.averageProgress}%`}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Students List */}
          {activeTab === 'students' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                {language === 'ar' ? `قائمة الطلاب المسجلين بالفوج (${groupStudents.length})` : `Students Roster (${groupStudents.length})`}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {groupStudents.map((st) => (
                  <div
                    key={st.id}
                    className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4"
                    style={{ padding: '14px 18px' }}
                  >
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">{st.fullNameAr} ({st.fullNameEn})</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {language === 'ar' ? 'ولي الأمر:' : 'Parent:'} {st.parentName} ({st.parentPhone})
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span
                        className="inline-flex items-center justify-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200/80 dark:border-emerald-800/70 shadow-2xs whitespace-nowrap select-none"
                        style={{ padding: '6px 14px', minHeight: '32px', lineHeight: '1' }}
                      >
                        <span className="font-mono font-black text-xs sm:text-sm">{st.attendanceRate}%</span>
                        <span className="text-xs font-bold text-emerald-700/85 dark:text-emerald-300/85">{language === 'ar' ? 'حضور' : 'Att.'}</span>
                      </span>
                      <span
                        className="inline-flex items-center justify-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 bg-white dark:bg-slate-900 rounded-xl border border-purple-200/80 dark:border-purple-800/70 shadow-2xs whitespace-nowrap select-none"
                        style={{ padding: '6px 14px', minHeight: '32px', lineHeight: '1' }}
                      >
                        <span className="font-mono font-black text-xs sm:text-sm">{st.overallProgress}%</span>
                        <span className="text-xs font-bold text-purple-700/85 dark:text-purple-300/85">{language === 'ar' ? 'تقدم' : 'Prog.'}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Attendance History */}
          {activeTab === 'attendance' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                {language === 'ar' ? 'سجل جلسات الحضور المسجلة' : 'Attendance Sessions History'}
              </h4>
              {groupAttendance.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs font-semibold">
                  {language === 'ar' ? 'لا توجد جلسات مسجلة حتى الآن' : 'No recorded sessions yet'}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {groupAttendance.map((sess) => (
                    <div
                      key={sess.id}
                      className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2"
                      style={{ padding: '14px 18px' }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white font-mono">{sess.date} ({sess.dayNameAr})</span>
                        <span className="text-xs text-slate-400 font-mono">{sess.sessionTime}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap text-xs">
                        {sess.records.map((r, i) => (
                          <span
                            key={i}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] ${
                              r.status === 'present'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : r.status === 'late'
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                                : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                            }`}
                          >
                            {r.studentNameAr}: {r.status === 'present' ? 'حاضر' : r.status === 'late' ? 'متأخر' : 'غائب'}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Academic Progress */}
          {activeTab === 'progress' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                {language === 'ar' ? 'معدلات التقدم الأكاديمي لطلاب الفوج' : 'Academic Progress Across Curriculum'}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {groupStudents.map((st) => (
                  <div
                    key={st.id}
                    className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
                    style={{ padding: '12px 18px', display: 'flex', flexDirection: 'column', gap: '8px' }}
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-900 dark:text-white">{st.fullNameAr}</span>
                      <span className="font-mono text-purple-600 dark:text-purple-400">{st.overallProgress}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700/80 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-600 rounded-full transition-all duration-500" style={{ width: `${st.overallProgress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Performance & Homework */}
          {activeTab === 'performance' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                {language === 'ar' ? 'الواجبات المسندة للفوج' : 'Homework Tasks Assigned'}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {groupHomework.map((hw) => (
                  <div
                    key={hw.id}
                    className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
                    style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: '6px' }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">{hw.assignmentNameAr}</span>
                      <span className="font-mono text-[11px] text-slate-400">
                        {language === 'ar' ? 'تاريخ التسليم:' : 'Due Date:'} {hw.dueDate}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{hw.descriptionAr}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: Assessments */}
          {activeTab === 'assessments' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                {language === 'ar' ? 'نتائج التقييمات والاختبارات للفوج' : 'Group Assessment Results'}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {groupAssessments.map((asm) => (
                  <div
                    key={asm.id}
                    className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
                    style={{ padding: '14px 18px' }}
                  >
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white block">{asm.studentNameAr} — {asm.assessmentType}</span>
                      <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">{asm.date}</span>
                    </div>
                    <span className="font-mono font-black text-xs sm:text-sm text-purple-600 dark:text-purple-400">{asm.scores.overall}% ({asm.gradeLetterAr})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ADD STUDENT SUB-MODAL */}
        {isAddStudentOpen && (
          <div className="fixed inset-0 z-70 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-fade-in">
            <div
              className="relative w-full max-w-2xl bg-white dark:bg-slate-850 rounded-[28px] shadow-2xl border border-slate-200 dark:border-slate-700/80 overflow-hidden animate-fade-in-up"
              style={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '540px',
                maxHeight: '90vh',
              }}
            >
              {/* Header */}
              <div
                className="bg-slate-900 text-white shrink-0 border-b border-slate-800"
                style={{
                  padding: '18px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md shrink-0"
                  >
                    <UserPlus size={18} />
                  </div>
                  <div>
                    <h3 className="font-black text-base sm:text-lg leading-tight text-white">
                      {language === 'ar' ? `إضافة طالب إلى الفوج: ${group.name}` : `Add Student to Group: ${group.name}`}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <span className="font-mono text-xs text-amber-400 font-bold">{group.code}</span>
                      <span className="text-slate-500 text-xs">•</span>
                      <span className="text-xs text-slate-300 font-bold">{group.level}</span>
                      <span className="text-slate-500 text-xs">•</span>
                      <span className="text-xs text-slate-400">{group.language}</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddStudentOpen(false)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Sub-tabs: Select Existing vs Register New */}
              <div
                className="bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/80 shrink-0"
                style={{
                  padding: '12px 20px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gap: '12px',
                }}
              >
                <button
                  type="button"
                  onClick={() => setAddMode('existing')}
                  className={`rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    addMode === 'existing'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                  style={{ padding: '10px 16px' }}
                >
                  <Users size={16} />
                  <span>{language === 'ar' ? 'اختيار من الطلاب المسجلين' : 'Select Existing Student'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAddMode('new')}
                  className={`rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    addMode === 'new'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                  style={{ padding: '10px 16px' }}
                >
                  <Plus size={16} />
                  <span>{language === 'ar' ? 'تسجيل طالب جديد للفوج' : 'Register New Student'}</span>
                </button>
              </div>

              {/* Body */}
              <div
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  overflowY: 'auto',
                  flex: 1,
                }}
              >
                {addMode === 'existing' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Search box with proper RTL icon alignment and spacing */}
                    <div className="relative" style={{ marginBottom: '4px' }}>
                      <Search
                        size={18}
                        className="text-slate-400 pointer-events-none"
                        style={{
                          position: 'absolute',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          right: isRTL ? '16px' : 'auto',
                          left: isRTL ? 'auto' : '16px',
                        }}
                      />
                      <input
                        type="text"
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                        placeholder={language === 'ar' ? 'ابحث بالاسم أو رقم الهاتف...' : 'Search student by name or phone...'}
                        className="w-full h-12 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                        style={{
                          paddingRight: isRTL ? '48px' : '18px',
                          paddingLeft: isRTL ? '18px' : '48px',
                        }}
                      />
                    </div>

                    {/* Student List */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        maxHeight: '340px',
                        overflowY: 'auto',
                        paddingRight: '4px',
                      }}
                    >
                      {filteredAvailableStudents.length === 0 ? (
                        <div
                          className="text-center text-slate-400 text-xs sm:text-sm font-bold bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700"
                          style={{ padding: '48px 24px' }}
                        >
                          {language === 'ar' ? 'لا يوجد طلاب متاحين للإسناد حالياً' : 'No available students found'}
                        </div>
                      ) : (
                        filteredAvailableStudents.map((st) => (
                          <div
                            key={st.id}
                            className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700 hover:border-amber-400/60 transition-all"
                            style={{
                              padding: '16px 20px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '16px',
                            }}
                          >
                            <div className="min-w-0" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                                {st.fullNameAr} {st.fullNameEn ? `(${st.fullNameEn})` : ''}
                              </div>
                              <div className="text-[11px] text-slate-400 font-medium flex items-center gap-2 flex-wrap">
                                <span>{language === 'ar' ? 'ولي الأمر:' : 'Parent:'} {st.parentName}</span>
                                <span>•</span>
                                <span className="font-mono text-slate-500 dark:text-slate-400" dir="ltr">{st.parentPhone}</span>
                                <span>•</span>
                                <span className="text-amber-600 dark:text-amber-400 font-bold">
                                  {st.groupName ? `${language === 'ar' ? 'الفوج:' : 'Group:'} ${st.groupName}` : (language === 'ar' ? 'غير مسند' : 'Unassigned')}
                                </span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleEnrollExisting(st.id)}
                              disabled={justAddedStudentId === st.id}
                              className={`rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                                justAddedStudentId === st.id
                                  ? 'bg-emerald-500 text-white shadow-md'
                                  : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-xs hover:scale-102 active:scale-98'
                              }`}
                              style={{ padding: '8px 16px' }}
                            >
                              {justAddedStudentId === st.id ? (
                                <>
                                  <Check size={14} />
                                  <span>{language === 'ar' ? 'تمت الإضافة' : 'Enrolled'}</span>
                                </>
                              ) : (
                                <>
                                  <Plus size={14} />
                                  <span>{language === 'ar' ? 'إضافة للفوج' : 'Add to Group'}</span>
                                </>
                              )}
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ) : (
                  <form
                    onSubmit={handleCreateAndEnroll}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '22px',
                      paddingTop: '8px',
                      paddingBottom: '8px',
                    }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label
                          className="text-xs font-bold text-slate-700 dark:text-slate-300 block"
                          style={{ marginBottom: '8px' }}
                        >
                          {language === 'ar' ? 'الاسم (عربي) *' : 'First Name (Arabic) *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={newFirstNameAr}
                          onChange={(e) => setNewFirstNameAr(e.target.value)}
                          placeholder="محمد"
                          className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                          style={{ height: '46px', padding: '10px 14px' }}
                        />
                      </div>
                      <div>
                        <label
                          className="text-xs font-bold text-slate-700 dark:text-slate-300 block"
                          style={{ marginBottom: '8px' }}
                        >
                          {language === 'ar' ? 'اللقب (عربي) *' : 'Last Name (Arabic) *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={newLastNameAr}
                          onChange={(e) => setNewLastNameAr(e.target.value)}
                          placeholder="بن علي"
                          className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                          style={{ height: '46px', padding: '10px 14px' }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label
                          className="text-xs font-bold text-slate-700 dark:text-slate-300 block"
                          style={{ marginBottom: '8px' }}
                        >
                          {language === 'ar' ? 'الاسم باللاتينية' : 'First Name (Latin)'}
                        </label>
                        <input
                          type="text"
                          value={newFirstNameEn}
                          onChange={(e) => setNewFirstNameEn(e.target.value)}
                          placeholder="Mohamed"
                          className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                          style={{ height: '46px', padding: '10px 14px' }}
                        />
                      </div>
                      <div>
                        <label
                          className="text-xs font-bold text-slate-700 dark:text-slate-300 block"
                          style={{ marginBottom: '8px' }}
                        >
                          {language === 'ar' ? 'اللقب باللاتينية' : 'Last Name (Latin)'}
                        </label>
                        <input
                          type="text"
                          value={newLastNameEn}
                          onChange={(e) => setNewLastNameEn(e.target.value)}
                          placeholder="Benali"
                          className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                          style={{ height: '46px', padding: '10px 14px' }}
                        />
                      </div>
                    </div>

                    {/* Birthday & Gender */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label
                          className="text-xs font-bold text-slate-700 dark:text-slate-300 block flex items-center gap-1.5"
                          style={{ marginBottom: '8px' }}
                        >
                          <Calendar size={14} className="text-purple-600 dark:text-purple-400" />
                          <span>{language === 'ar' ? 'تاريخ الميلاد (Birthday) *' : 'Birthday *'}</span>
                        </label>
                        <input
                          type="date"
                          required
                          value={newBirthDate}
                          onChange={(e) => setNewBirthDate(e.target.value)}
                          className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                          style={{ height: '46px', padding: '10px 14px' }}
                        />
                      </div>
                      <div>
                        <label
                          className="text-xs font-bold text-slate-700 dark:text-slate-300 block"
                          style={{ marginBottom: '8px' }}
                        >
                          {language === 'ar' ? 'الجنس (Gender)' : 'Gender'}
                        </label>
                        <select
                          value={newGender}
                          onChange={(e) => setNewGender(e.target.value as any)}
                          className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 cursor-pointer"
                          style={{ height: '46px', padding: '10px 14px' }}
                        >
                          <option value="male">{language === 'ar' ? 'ذكر (Male)' : 'Male'}</option>
                          <option value="female">{language === 'ar' ? 'أنثى (Female)' : 'Female'}</option>
                        </select>
                      </div>
                    </div>

                    {/* Link to Parent (Search Bar) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block flex items-center gap-1.5">
                        <Users size={14} className="text-amber-500" />
                        <span>{language === 'ar' ? 'ربط بولي الأمر (Link Parent)' : 'Link Parent'}</span>
                      </label>

                      {/* Parent Search Input */}
                      <div className="relative">
                        <Search
                          size={16}
                          className="text-slate-400 pointer-events-none"
                          style={{
                            position: 'absolute',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            right: isRTL ? '14px' : 'auto',
                            left: isRTL ? 'auto' : '14px',
                          }}
                        />
                        <input
                          type="text"
                          value={parentSearchQuery}
                          onChange={(e) => setParentSearchQuery(e.target.value)}
                          placeholder={language === 'ar' ? 'ابحث عن ولي الأمر بالاسم أو رقم الهاتف...' : 'Search parent by name or phone...'}
                          className="w-full h-11 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                          style={{
                            paddingRight: isRTL ? '44px' : (parentSearchQuery ? '36px' : '14px'),
                            paddingLeft: isRTL ? (parentSearchQuery ? '36px' : '14px') : '44px',
                          }}
                        />
                        {parentSearchQuery && (
                          <button
                            type="button"
                            onClick={() => setParentSearchQuery('')}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                            style={{
                              position: 'absolute',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              left: isRTL ? '12px' : 'auto',
                              right: isRTL ? 'auto' : '12px',
                            }}
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>

                      {/* Search Results Dropdown List when typing */}
                      {parentSearchQuery.trim() && (
                        <div className="max-h-40 overflow-y-auto rounded-xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-slate-700 shadow-lg divide-y divide-slate-100 dark:divide-slate-700">
                          {filteredParents.length === 0 ? (
                            <div className="p-3 text-center text-xs text-slate-400 font-bold">
                              {language === 'ar' ? 'لا يوجد ولي أمر مطابق للبحث' : 'No matching parent found'}
                            </div>
                          ) : (
                            filteredParents.map((p) => (
                              <div
                                key={p.id}
                                onClick={() => {
                                  setSelectedParentId(p.id);
                                  setParentSearchQuery('');
                                }}
                                className={`p-2.5 flex items-center justify-between hover:bg-amber-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors ${
                                  selectedParentId === p.id ? 'bg-amber-50/80 dark:bg-slate-700' : ''
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center font-black text-xs">
                                    {p.fullNameAr.charAt(0)}
                                  </div>
                                  <div>
                                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                                      {p.fullNameAr} <span className="font-normal text-[11px] text-slate-500 font-mono">({p.fullNameEn})</span>
                                    </div>
                                    <div className="text-[11px] font-mono text-amber-600 dark:text-amber-400" dir="ltr">
                                      📱 {p.phone}
                                    </div>
                                  </div>
                                </div>
                                {selectedParentId === p.id && (
                                  <Check size={14} className="text-amber-600 dark:text-amber-400" />
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      )}

                      {/* Linked Parent Live Info Badge */}
                      {(() => {
                        if (!selectedParentId) return null;
                        const activeParent = parents.find((p) => p.id === selectedParentId);
                        if (!activeParent) return null;
                        return (
                          <div
                            className="flex items-center justify-between gap-2.5 rounded-xl bg-amber-50/60 dark:bg-slate-800 border border-amber-200/80 dark:border-slate-700 shadow-2xs"
                            style={{ padding: '8px 14px' }}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs shrink-0">
                                {activeParent.fullNameAr.charAt(0)}
                              </div>
                              <div>
                                <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                                  {activeParent.fullNameAr} <span className="font-normal text-[11px] text-slate-500 font-mono">({activeParent.fullNameEn})</span>
                                </div>
                                <div className="text-[11px] font-mono text-slate-600 dark:text-slate-400 font-medium" dir="ltr">
                                  📱 {activeParent.phone}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 flex items-center gap-1">
                                <Check size={11} />
                                <span>{language === 'ar' ? 'تم الربط' : 'Linked'}</span>
                              </span>
                              <button
                                type="button"
                                onClick={() => setSelectedParentId('')}
                                title={language === 'ar' ? 'إلغاء الربط' : 'Remove Link'}
                                className="w-6 h-6 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center transition-all cursor-pointer border border-rose-200/60 dark:border-rose-900/50"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    <div
                      className="pt-4 border-t border-slate-100 dark:border-slate-800"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: '12px',
                        marginTop: '8px',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setIsAddStudentOpen(false)}
                        className="rounded-xl text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                        style={{ padding: '10px 20px' }}
                      >
                        {language === 'ar' ? 'إلغاء' : 'Cancel'}
                      </button>
                      <button
                        type="submit"
                        className="rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-md hover:scale-102 active:scale-98 transition-all cursor-pointer"
                        style={{ padding: '10px 24px' }}
                      >
                        {language === 'ar' ? 'تسجيل وإضافة للفوج' : 'Register & Add to Group'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Sub-modal: Edit Group Details */}
        {isEditGroupOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
            <div
              className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl border border-slate-200 dark:border-slate-800 animate-fade-in-up my-auto max-h-[92vh] overflow-y-auto"
              style={{ padding: '28px 32px' }}
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20 shadow-xs">
                    <Pencil size={18} />
                  </div>
                  <div>
                    <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white">
                      {language === 'ar' ? 'تعديل بيانات الفوج' : 'Edit Group Details'}
                    </h3>
                    <p className="text-xs text-slate-400 font-bold mt-0.5">
                      {group?.code} • {group?.name}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditGroupOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer shrink-0"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveEditGroup} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-700 dark:text-slate-300 font-bold text-xs">
                      {language === 'ar' ? 'اسم الفوج *' : 'Group Name *'}
                    </label>
                    <input
                      type="text"
                      dir="auto"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      style={{ paddingLeft: '14px', paddingRight: '14px' }}
                      className="w-full h-11 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-700 dark:text-slate-300 font-bold text-xs">
                      {language === 'ar' ? 'رمز الفوج (ID) *' : 'Group Code (ID) *'}
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      required
                      value={editCode}
                      onChange={(e) => setEditCode(e.target.value)}
                      style={{ paddingLeft: '14px', paddingRight: '14px' }}
                      className="w-full h-11 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-700 dark:text-slate-300 font-bold text-xs">
                      {language === 'ar' ? 'مسار اللغة' : 'Language Track'}
                    </label>
                    <select
                      value={editLanguage}
                      onChange={(e) => setEditLanguage(e.target.value as any)}
                      style={{ paddingLeft: '14px', paddingRight: '14px' }}
                      className="w-full h-11 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-amber-500/20"
                    >
                      <option value="English">English</option>
                      <option value="French">French</option>
                      <option value="Dual">Dual</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-700 dark:text-slate-300 font-bold text-xs">
                      {language === 'ar' ? 'المستوى الأكاديمي' : 'Curriculum Level'}
                    </label>
                    <select
                      value={editLevel}
                      onChange={(e) => setEditLevel(e.target.value)}
                      style={{ paddingLeft: '14px', paddingRight: '14px' }}
                      className="w-full h-11 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-amber-500/20"
                    >
                      {availableLevels.map((lvl) => (
                        <option key={lvl.code} value={lvl.code}>
                          {lvl.code} — {lvl.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-700 dark:text-slate-300 font-bold text-xs">
                    {language === 'ar' ? 'المعلم المشرف' : 'Supervising Teacher'}
                  </label>
                  <SearchableSelect
                    options={teachers.map((t) => ({
                      value: t.id,
                      label: t.fullNameAr,
                      subLabel: t.specialization,
                    }))}
                    value={editTeacherId}
                    onChange={(val) => setEditTeacherId(val)}
                    themeColor="amber"
                    placeholder={language === 'ar' ? 'اختر المعلم المشرف...' : 'Select teacher...'}
                    searchPlaceholder={language === 'ar' ? 'ابحث باسم المعلم...' : 'Search teacher...'}
                    emptyText={language === 'ar' ? 'لا يوجد معلم بهذا الاسم' : 'No matching teachers found'}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5">
                    <Calendar size={13} className="text-amber-500" />
                    <span>{language === 'ar' ? 'مواعيد وتوقيت الحصص' : 'Schedule Days & Times'}</span>
                  </label>
                  <input
                    type="text"
                    dir="auto"
                    value={editSchedule}
                    onChange={(e) => setEditSchedule(e.target.value)}
                    placeholder={language === 'ar' ? 'مثال: الأحد + الثلاثاء (06:00 PM)' : 'e.g. Sun + Tue (06:00 PM)'}
                    style={{ paddingLeft: '14px', paddingRight: '14px' }}
                    className="w-full h-11 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5">
                      <Calendar size={13} className="text-amber-500" />
                      <span>{language === 'ar' ? 'تاريخ بداية الفوج' : 'Start Date'}</span>
                    </label>
                    <input
                      type="date"
                      value={editStartDate}
                      onChange={(e) => setEditStartDate(e.target.value)}
                      style={{ paddingLeft: '14px', paddingRight: '14px' }}
                      className="w-full h-11 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5">
                      <Clock size={13} className="text-amber-500" />
                      <span>{language === 'ar' ? 'عدد الحصص الإجمالي' : 'Total Sessions'}</span>
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={200}
                      value={editTotalSessions}
                      onChange={(e) => setEditTotalSessions(e.target.value)}
                      placeholder="24"
                      style={{ paddingLeft: '14px', paddingRight: '14px' }}
                      className="w-full h-11 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-700 dark:text-slate-300 font-bold text-xs">
                      {language === 'ar' ? 'الحد الأقصى للطلاب' : 'Max Capacity'}
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={editCapacity}
                      onChange={(e) => setEditCapacity(Number(e.target.value) || 25)}
                      style={{ paddingLeft: '14px', paddingRight: '14px' }}
                      className="w-full h-11 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-700 dark:text-slate-300 font-bold text-xs">
                      {language === 'ar' ? 'حالة الفوج' : 'Group Status'}
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as any)}
                      style={{ paddingLeft: '14px', paddingRight: '14px' }}
                      className="w-full h-11 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-amber-500/20"
                    >
                      <option value="active">{language === 'ar' ? 'نشط' : 'Active'}</option>
                      <option value="archived">{language === 'ar' ? 'مؤرشف' : 'Archived'}</option>
                    </select>
                  </div>
                </div>

                <div
                  className="pt-4 border-t border-slate-100 dark:border-slate-800"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '12px',
                    marginTop: '8px',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setIsEditGroupOpen(false)}
                    className="rounded-xl text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                    style={{ padding: '10px 20px' }}
                  >
                    {language === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-98 text-slate-950 font-black text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all cursor-pointer flex items-center gap-2"
                    style={{ padding: '10px 24px' }}
                  >
                    <Check size={16} />
                    <span>{language === 'ar' ? 'حفظ التعديلات' : 'Save Changes'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
