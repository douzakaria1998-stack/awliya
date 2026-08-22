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
            {language === 'ar' ? 'رصد ومتابعة الحضور والغياب اليومي' : language === 'fr' ? 'Suivi et Enregistrement des Présences' : 'Attendance Recording & Analytics'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5">
            {language === 'ar' ? 'سجل الحضور والجلسات (Attendance Module)' : language === 'fr' ? 'Gestion des Présences' : 'Attendance Management'}
          </h2>
        </div>

        {/* Save Button */}
        <button
          type="button"
          onClick={handleSaveAttendance}
          className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm flex items-center gap-2.5 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
          style={{ padding: '14px 28px' }}
        >
          {savedSuccess ? (
            <>
              <Check size={18} />
              <span>{language === 'ar' ? 'تم حفظ السجل بنجاح ✓' : language === 'fr' ? 'Présences Enregistrées ✓' : 'Attendance Saved ✓'}</span>
            </>
          ) : (
            <>
              <Save size={18} />
              <span>{language === 'ar' ? 'حفظ وتثبيت سجل الحضور' : language === 'fr' ? 'Enregistrer la feuille de présence' : 'Save Attendance Sheet'}</span>
            </>
          )}
        </button>
      </div>

      {/* Attendance Flow: Group Selector & Date Navigation Bar (Section 19, 20) */}
      <div
        className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-[32px] shadow-xs flex flex-col lg:flex-row items-center justify-between gap-6"
        style={{
          padding: '32px 36px',
          marginBottom: '36px',
        }}
      >
        {/* 1. Group Selector */}
        <div className="flex items-center gap-3.5 w-full lg:w-auto">
          <School size={22} className="text-emerald-600 shrink-0" />
          <div className="flex-1 lg:flex-initial">
            <label className="text-xs font-bold text-slate-400 block mb-1">
              {language === 'ar' ? 'اختر الفوج التعليمي:' : language === 'fr' ? 'Sélectionner le groupe:' : 'Select Group:'}
            </label>
            <select
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              className="h-12 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 dark:text-white px-4 cursor-pointer shadow-2xs focus:outline-none focus:border-emerald-500 transition-colors"
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
        <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
          <button
            type="button"
            onClick={isRTL ? handleNextDay : handlePrevDay}
            className="w-10 h-10 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            title="Previous Day"
          >
            <ChevronRight size={20} />
          </button>

          <div className="flex items-center gap-2.5 px-4 py-1.5 bg-white dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 font-mono font-bold text-xs sm:text-sm text-slate-900 dark:text-white shadow-xs">
            <Calendar size={18} className="text-emerald-600" />
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
            className="w-10 h-10 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            title="Next Day"
          >
            <ChevronLeft size={20} />
          </button>
        </div>
      </div>

      {/* Real-time Session Statistics Bar (Section 21) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 sm:gap-5" style={{ marginBottom: '36px' }}>
        <div
          className="rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-center space-y-2 shadow-2xs"
          style={{ padding: '24px 28px' }}
        >
          <span className="text-xs font-bold text-slate-400 block">{language === 'ar' ? 'نسبة حضور الجلسة' : language === 'fr' ? 'Taux de présence' : 'Attendance Rate'}</span>
          <span className="text-3xl font-black font-mono text-emerald-600">{stats.percentage}%</span>
        </div>

        <div
          className="rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-2 shadow-2xs"
          style={{ padding: '24px 28px' }}
        >
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 block">{language === 'ar' ? 'حاضر (Present)' : language === 'fr' ? 'Présents' : 'Present'}</span>
          <span className="text-3xl font-black font-mono text-emerald-800 dark:text-emerald-200">{stats.presentCount}</span>
        </div>

        <div
          className="rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center space-y-2 shadow-2xs"
          style={{ padding: '24px 28px' }}
        >
          <span className="text-xs font-bold text-amber-700 dark:text-amber-300 block">{language === 'ar' ? 'متأخر (Late)' : language === 'fr' ? 'En retard' : 'Late'}</span>
          <span className="text-3xl font-black font-mono text-amber-800 dark:text-amber-200">{stats.lateCount}</span>
        </div>

        <div
          className="rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-center space-y-2 shadow-2xs"
          style={{ padding: '24px 28px' }}
        >
          <span className="text-xs font-bold text-rose-700 dark:text-rose-300 block">{language === 'ar' ? 'غائب (Absent)' : language === 'fr' ? 'Absents' : 'Absent'}</span>
          <span className="text-3xl font-black font-mono text-rose-800 dark:text-rose-200">{stats.absentCount}</span>
        </div>

        <div
          className="rounded-3xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-center space-y-2 shadow-2xs"
          style={{ padding: '24px 28px' }}
        >
          <span className="text-xs font-bold text-blue-700 dark:text-blue-300 block">{language === 'ar' ? 'غياب مبرر (Excused)' : language === 'fr' ? 'Excusés' : 'Excused'}</span>
          <span className="text-3xl font-black font-mono text-blue-800 dark:text-blue-200">{stats.excusedCount}</span>
        </div>
      </div>

      {/* Interactive Attendance Sheet (Section 19 in PDF: Student, Present, Late, Absent, Excused) */}
      <div
        className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-[32px] shadow-xs overflow-hidden"
        style={{ marginBottom: '44px' }}
      >
        <div
          className="border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          style={{ padding: '28px 36px' }}
        >
          <div className="font-black text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-3">
            <CalendarCheck2 size={22} className="text-emerald-600" />
            <span>
              {language === 'ar' ? 'كشف تفقد الحضور للطلاب المسجلين بالفوج' : language === 'fr' ? 'Feuille d\'appel des élèves du groupe' : 'Student Attendance Sheet'} ({groupStudents.length} {language === 'ar' ? 'طلاب' : 'students'})
            </span>
          </div>
          <span className="text-xs font-bold text-slate-400 font-mono">
            {selectedGroup?.name} • {selectedDate}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className={`w-full text-xs sm:text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-400 font-bold">
              <tr>
                <th
                  className={`font-extrabold text-xs sm:text-sm ${isRTL ? 'text-right' : 'text-left'}`}
                  style={{
                    paddingTop: '26px',
                    paddingBottom: '26px',
                    paddingLeft: isRTL ? '24px' : '40px',
                    paddingRight: isRTL ? '40px' : '24px',
                  }}
                >
                  {language === 'ar' ? 'اسم الطالب' : language === 'fr' ? 'Nom de l\'élève' : 'Student'}
                </th>
                <th className="py-7 px-4 text-center font-extrabold">{language === 'ar' ? 'حاضر (Present)' : language === 'fr' ? 'Présent' : 'Present'}</th>
                <th className="py-7 px-4 text-center font-extrabold">{language === 'ar' ? 'متأخر (Late)' : language === 'fr' ? 'En retard' : 'Late'}</th>
                <th className="py-7 px-4 text-center font-extrabold">{language === 'ar' ? 'غائب (Absent)' : language === 'fr' ? 'Absent' : 'Absent'}</th>
                <th className="py-7 px-4 text-center font-extrabold">{language === 'ar' ? 'مبرر (Excused)' : language === 'fr' ? 'Excusé' : 'Excused'}</th>
                <th
                  className={`font-extrabold text-xs sm:text-sm ${isRTL ? 'text-right' : 'text-left'}`}
                  style={{
                    paddingTop: '26px',
                    paddingBottom: '26px',
                    paddingRight: isRTL ? '40px' : '24px',
                    paddingLeft: isRTL ? '24px' : '40px',
                  }}
                >
                  {language === 'ar' ? 'ملاحظة المعلم' : language === 'fr' ? 'Note de l\'enseignant' : 'Teacher Note'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {groupStudents.map((st) => {
                const currentStatus = studentStatusMap[st.id] || 'present';
                return (
                  <tr key={st.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    {/* Student Name */}
                    <td
                      className="py-8 font-bold text-slate-900 dark:text-white"
                      style={{
                        paddingLeft: isRTL ? '24px' : '40px',
                        paddingRight: isRTL ? '40px' : '24px',
                      }}
                    >
                      <div className="font-bold text-sm sm:text-base leading-snug">{st.fullNameAr}</div>
                      <div className="text-xs text-slate-400 font-mono mt-1">{st.fullNameEn}</div>
                    </td>

                    {/* Present */}
                    <td className="py-8 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(st.id, 'present')}
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center mx-auto transition-all cursor-pointer ${
                          currentStatus === 'present'
                            ? 'bg-emerald-600 text-white shadow-md font-black scale-105 ring-2 ring-emerald-400/40'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                        }`}
                        title="Present"
                      >
                        ✓
                      </button>
                    </td>

                    {/* Late */}
                    <td className="py-8 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(st.id, 'late')}
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center mx-auto transition-all cursor-pointer ${
                          currentStatus === 'late'
                            ? 'bg-amber-500 text-slate-950 shadow-md font-black scale-105 ring-2 ring-amber-400/40'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                        }`}
                        title="Late"
                      >
                        ⏱
                      </button>
                    </td>

                    {/* Absent */}
                    <td className="py-8 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(st.id, 'absent')}
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center mx-auto transition-all cursor-pointer ${
                          currentStatus === 'absent'
                            ? 'bg-rose-600 text-white shadow-md font-black scale-105 ring-2 ring-rose-400/40'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40'
                        }`}
                        title="Absent"
                      >
                        ✕
                      </button>
                    </td>

                    {/* Excused */}
                    <td className="py-8 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(st.id, 'excused')}
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center mx-auto transition-all cursor-pointer ${
                          currentStatus === 'excused'
                            ? 'bg-blue-600 text-white shadow-md font-black scale-105 ring-2 ring-blue-400/40'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40'
                        }`}
                        title="Excused"
                      >
                        📄
                      </button>
                    </td>

                    {/* Teacher Note */}
                    <td
                      className="py-8"
                      style={{
                        paddingRight: isRTL ? '40px' : '24px',
                        paddingLeft: isRTL ? '24px' : '40px',
                      }}
                    >
                      <input
                        type="text"
                        value={studentNotesMap[st.id] || ''}
                        onChange={(e) => setStudentNotesMap({ ...studentNotesMap, [st.id]: e.target.value })}
                        placeholder={language === 'ar' ? 'ملاحظة خاصة بالجلسة...' : language === 'fr' ? 'Note de séance...' : 'Session note...'}
                        className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white shadow-2xs focus:outline-none focus:border-emerald-500 transition-colors"
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
