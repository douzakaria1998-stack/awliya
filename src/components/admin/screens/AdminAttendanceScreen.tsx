'use client';

import React, { useState, useMemo } from 'react';
import {
  CalendarCheck2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  School,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  TrendingUp,
  Save,
  Check,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useLanguage } from '@/context/LanguageContext';

export function AdminAttendanceScreen() {
  const { visibleGroups, visibleStudents, attendanceSessions, recordAttendance } = useAdmin();
  const { isRTL, language } = useLanguage();

  const [selectedGroupId, setSelectedGroupId] = useState(visibleGroups[0]?.id || 'grp-a2-03');
  const [selectedDate, setSelectedDate] = useState('2025-02-22');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const selectedGroup = visibleGroups.find((g) => g.id === selectedGroupId) || visibleGroups[0];
  const groupStudents = visibleStudents.filter((s) => selectedGroup?.studentIds.includes(s.id) || s.groupId === selectedGroup?.id);

  // Active Session Record
  const activeSession = attendanceSessions.find(
    (s) => s.groupId === selectedGroupId && s.date === selectedDate
  );

  // Local Attendance Sheet State
  const [studentStatusMap, setStudentStatusMap] = useState<Record<string, 'present' | 'late' | 'absent' | 'excused'>>({});
  const [studentNotesMap, setStudentNotesMap] = useState<Record<string, string>>({});

  // Sync session records to local state
  React.useEffect(() => {
    const initialStatus: Record<string, 'present' | 'late' | 'absent' | 'excused'> = {};
    const initialNotes: Record<string, string> = {};

    groupStudents.forEach((st) => {
      const existingRec = activeSession?.records.find((r) => r.studentId === st.id);
      initialStatus[st.id] = existingRec ? existingRec.status : 'present';
      initialNotes[st.id] = existingRec?.note || '';
    });

    setStudentStatusMap(initialStatus);
    setStudentNotesMap(initialNotes);
  }, [selectedGroupId, selectedDate, activeSession, groupStudents]);

  // Date Navigation (Section 20: Previous Day ← Date → Next Day)
  const handlePrevDay = () => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() - 1);
    setSelectedDate(current.toISOString().substring(0, 10));
  };

  const handleNextDay = () => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + 1);
    setSelectedDate(current.toISOString().substring(0, 10));
  };

  const handleStatusChange = (studentId: string, status: 'present' | 'late' | 'absent' | 'excused') => {
    setStudentStatusMap((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSaveAttendance = () => {
    const records = groupStudents.map((st) => ({
      studentId: st.id,
      status: studentStatusMap[st.id] || 'present',
      note: studentNotesMap[st.id] || '',
    }));

    recordAttendance(activeSession?.id || 'att-sess-01', records);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Real-Time Session Statistics (Section 21)
  const stats = useMemo(() => {
    const total = groupStudents.length || 1;
    const presentCount = Object.values(studentStatusMap).filter((s) => s === 'present').length;
    const lateCount = Object.values(studentStatusMap).filter((s) => s === 'late').length;
    const absentCount = Object.values(studentStatusMap).filter((s) => s === 'absent').length;
    const excusedCount = Object.values(studentStatusMap).filter((s) => s === 'excused').length;
    const percentage = Math.round(((presentCount + lateCount) / total) * 100);

    return { total, presentCount, lateCount, absentCount, excusedCount, percentage };
  }, [studentStatusMap, groupStudents]);

  return (
    <div className={`w-full select-none ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{ marginBottom: '28px' }}
      >
        <div>
          <span className="text-xs sm:text-sm font-bold text-slate-400">
            {language === 'ar' ? 'رصد ومتابعة الحضور والغياب اليومي' : 'Attendance Recording & Analytics'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5">
            {language === 'ar' ? 'سجل الحضور والجلسات (Attendance Module)' : 'Attendance Management'}
          </h2>
        </div>

        {/* Save Button */}
        <button
          type="button"
          onClick={handleSaveAttendance}
          className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
        >
          {savedSuccess ? (
            <>
              <Check size={18} />
              <span>{language === 'ar' ? 'تم حفظ السجل بنجاح ✓' : 'Attendance Saved ✓'}</span>
            </>
          ) : (
            <>
              <Save size={18} />
              <span>{language === 'ar' ? 'حفظ وتثبيت سجل الحضور' : 'Save Attendance Sheet'}</span>
            </>
          )}
        </button>
      </div>

      {/* Attendance Flow: Group Selector & Date Navigation Bar (Section 19, 20) */}
      <div
        className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-[28px] shadow-xs flex flex-col lg:flex-row items-center justify-between gap-4"
        style={{
          padding: '26px 32px',
          marginBottom: '28px',
        }}
      >
        {/* 1. Group Selector */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <School size={20} className="text-emerald-600 shrink-0" />
          <div className="flex-1 lg:flex-initial">
            <label className="text-[11px] font-bold text-slate-400 block mb-0.5">
              {language === 'ar' ? 'اختر الفوج التعليمي:' : 'Select Group:'}
            </label>
            <select
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              className="h-10 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-bold text-slate-900 dark:text-white px-3 cursor-pointer"
            >
              {visibleGroups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.code} — {g.name} ({g.daysAr})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 2. Date Navigation (Previous Day ← Date → Next Day) */}
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={isRTL ? handleNextDay : handlePrevDay}
            className="w-9 h-9 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            title="Previous Day"
          >
            <ChevronRight size={18} />
          </button>

          <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 font-mono font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
            <Calendar size={16} className="text-emerald-600" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer text-xs sm:text-sm font-mono"
            />
          </div>

          <button
            type="button"
            onClick={isRTL ? handlePrevDay : handleNextDay}
            className="w-9 h-9 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            title="Next Day"
          >
            <ChevronLeft size={18} />
          </button>
        </div>
      </div>

      {/* Real-time Session Statistics Bar (Section 21) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4" style={{ marginBottom: '32px' }}>
        <div
          className="rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-center space-y-1 shadow-2xs"
          style={{ padding: '20px 24px' }}
        >
          <span className="text-[11px] font-bold text-slate-400 block">{language === 'ar' ? 'نسبة حضور الجلسة' : 'Attendance Rate'}</span>
          <span className="text-2xl font-black font-mono text-emerald-600">{stats.percentage}%</span>
        </div>

        <div
          className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-1 shadow-2xs"
          style={{ padding: '20px 24px' }}
        >
          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 block">{language === 'ar' ? 'حاضر (Present)' : 'Present'}</span>
          <span className="text-2xl font-black font-mono text-emerald-800 dark:text-emerald-200">{stats.presentCount}</span>
        </div>

        <div
          className="rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center space-y-1 shadow-2xs"
          style={{ padding: '20px 24px' }}
        >
          <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 block">{language === 'ar' ? 'متأخر (Late)' : 'Late'}</span>
          <span className="text-2xl font-black font-mono text-amber-800 dark:text-amber-200">{stats.lateCount}</span>
        </div>

        <div
          className="rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-center space-y-1 shadow-2xs"
          style={{ padding: '20px 24px' }}
        >
          <span className="text-[11px] font-bold text-rose-700 dark:text-rose-300 block">{language === 'ar' ? 'غائب (Absent)' : 'Absent'}</span>
          <span className="text-2xl font-black font-mono text-rose-800 dark:text-rose-200">{stats.absentCount}</span>
        </div>

        <div
          className="rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-center space-y-1 shadow-2xs"
          style={{ padding: '20px 24px' }}
        >
          <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300 block">{language === 'ar' ? 'غياب مبرر (Excused)' : 'Excused'}</span>
          <span className="text-2xl font-black font-mono text-blue-800 dark:text-blue-200">{stats.excusedCount}</span>
        </div>
      </div>

      {/* Interactive Attendance Sheet (Section 19 in PDF: Student, Present, Late, Absent, Excused) */}
      <div
        className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-[28px] shadow-xs overflow-hidden"
        style={{ marginBottom: '32px' }}
      >
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarCheck2 size={18} className="text-emerald-600" />
            <span>
              {language === 'ar' ? 'كشف تفقد الحضور للطلاب المسجلين بالفوج' : 'Student Attendance Sheet'} ({groupStudents.length} {language === 'ar' ? 'طلاب' : 'students'})
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {selectedGroup?.name} • {selectedDate}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-right">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-400 font-bold">
              <tr>
                <th className="py-3.5 px-6 text-right">{language === 'ar' ? 'اسم الطالب' : 'Student'}</th>
                <th className="py-3.5 px-4 text-center">{language === 'ar' ? 'حاضر (Present)' : 'Present'}</th>
                <th className="py-3.5 px-4 text-center">{language === 'ar' ? 'متأخر (Late)' : 'Late'}</th>
                <th className="py-3.5 px-4 text-center">{language === 'ar' ? 'غائب (Absent)' : 'Absent'}</th>
                <th className="py-3.5 px-4 text-center">{language === 'ar' ? 'مبرر (Excused)' : 'Excused'}</th>
                <th className="py-3.5 px-6 text-right">{language === 'ar' ? 'ملاحظة المعلم' : 'Teacher Note'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {groupStudents.map((st) => {
                const currentStatus = studentStatusMap[st.id] || 'present';
                return (
                  <tr key={st.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    {/* Student Name */}
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                      <div>{st.fullNameAr}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{st.fullNameEn}</div>
                    </td>

                    {/* Present */}
                    <td className="py-4 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(st.id, 'present')}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center mx-auto transition-all cursor-pointer ${
                          currentStatus === 'present'
                            ? 'bg-emerald-600 text-white shadow-xs font-black'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-emerald-600'
                        }`}
                      >
                        ✓
                      </button>
                    </td>

                    {/* Late */}
                    <td className="py-4 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(st.id, 'late')}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center mx-auto transition-all cursor-pointer ${
                          currentStatus === 'late'
                            ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-amber-600'
                        }`}
                      >
                        ⏱
                      </button>
                    </td>

                    {/* Absent */}
                    <td className="py-4 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(st.id, 'absent')}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center mx-auto transition-all cursor-pointer ${
                          currentStatus === 'absent'
                            ? 'bg-rose-600 text-white shadow-xs font-black'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-600'
                        }`}
                      >
                        ✕
                      </button>
                    </td>

                    {/* Excused */}
                    <td className="py-4 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(st.id, 'excused')}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center mx-auto transition-all cursor-pointer ${
                          currentStatus === 'excused'
                            ? 'bg-blue-600 text-white shadow-xs font-black'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-blue-600'
                        }`}
                      >
                        📄
                      </button>
                    </td>

                    {/* Teacher Note */}
                    <td className="py-4 px-6">
                      <input
                        type="text"
                        value={studentNotesMap[st.id] || ''}
                        onChange={(e) => setStudentNotesMap({ ...studentNotesMap, [st.id]: e.target.value })}
                        placeholder={language === 'ar' ? 'ملاحظة خاصة بالجلسة...' : 'Session note...'}
                        className="w-full h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
