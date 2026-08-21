'use client';

import React, { useState } from 'react';
import {
  CalendarCheck2,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Check,
  Search,
  Save,
  Users,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useStudent } from '@/context/StudentContext';
import { useAdmin } from '@/context/AdminContext';

export function TeacherAttendanceScreen() {
  const { students } = useStudent();
  const { currentAdmin, recordSessionAttendance } = useAdmin();

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedGroup, setSelectedGroup] = useState('English Speaking Lab - Level 4');
  const [attendanceMap, setAttendanceMap] = useState<Record<string, 'present' | 'late' | 'absent' | 'excused'>>({
    'student-001': 'present',
    'student-002': 'present',
    'student-003': 'late',
  });
  const [notesMap, setNotesMap] = useState<Record<string, string>>({
    'student-003': 'تأخر 10 دقائق بسبب عطل تقني',
  });
  const [savedToast, setSavedToast] = useState(false);

  const handleStatusChange = (studentId: string, status: 'present' | 'late' | 'absent' | 'excused') => {
    setAttendanceMap((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleNoteChange = (studentId: string, note: string) => {
    setNotesMap((prev) => ({ ...prev, [studentId]: note }));
  };

  const handleSaveAll = () => {
    students.forEach((st) => {
      const stStatus = attendanceMap[st.id] || 'present';
      const stNote = notesMap[st.id] || '';
      recordSessionAttendance(st.id, stStatus, stNote);
    });

    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            رصد حضور وغياب الورش اللغوية
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            المعلم المشرف: {currentAdmin.fullNameAr} ({currentAdmin.departmentAr})
          </p>
        </div>

        {savedToast && (
          <div className="px-4 py-2 rounded-2xl bg-emerald-500 text-white text-xs font-black shadow-lg animate-in fade-in flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>تم حفظ وتوثيق كشف الحضور بنجاح!</span>
          </div>
        )}
      </div>

      {/* Session Filter Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-2xs grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            تاريخ الحصة / الورشة:
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            الشعبة / الورشة اللغوية:
          </label>
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
          >
            <option value="English Speaking Lab - Level 4">ورشة المحادثة والنطق (English Speaking Lab - Level 4)</option>
            <option value="Atelier Phonétique Français - Niveau B1">ورشة الصوتيات الفرنسية (Atelier Phonétique - Niveau B1)</option>
            <option value="Kids Foundation Club">نادي التأسيس التفاعلي (Kids Foundation Club)</option>
          </select>
        </div>
      </div>

      {/* Attendance Roster Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-rose-500" />
            <span className="font-bold text-sm text-slate-900 dark:text-white">
              قائمة طلاب الشعبة ({students.length} طلاب)
            </span>
          </div>

          <button
            type="button"
            onClick={handleSaveAll}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save size={15} />
            <span>حفظ الكشف وإرسال الإشعارات</span>
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {students.map((st) => {
            const currentStatus = attendanceMap[st.id] || 'present';
            const currentNote = notesMap[st.id] || '';

            return (
              <div
                key={st.id}
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
              >
                {/* Student Info */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-sm text-slate-700 dark:text-slate-300 shrink-0">
                    {st.fullNameAr[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="font-black text-sm text-slate-900 dark:text-white truncate">
                      {st.fullNameAr}
                    </div>
                    <div className="text-xs text-slate-400 font-mono">
                      {st.studentIdNumber} • المستوى {st.currentLevel}
                    </div>
                  </div>
                </div>

                {/* Status Toggle Buttons */}
                <div className="flex items-center gap-2 self-start md:self-center">
                  {[
                    { id: 'present', label: 'حاضر', color: 'emerald' },
                    { id: 'late', label: 'متأخر', color: 'amber' },
                    { id: 'absent', label: 'غائب', color: 'rose' },
                    { id: 'excused', label: 'عذر', color: 'blue' },
                  ].map((btn) => {
                    const isSelected = currentStatus === btn.id;
                    return (
                      <button
                        key={btn.id}
                        type="button"
                        onClick={() => handleStatusChange(st.id, btn.id as any)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                          isSelected
                            ? btn.id === 'present'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : btn.id === 'late'
                              ? 'bg-amber-500 text-slate-950 shadow-xs'
                              : btn.id === 'absent'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {btn.label}
                      </button>
                    );
                  })}
                </div>

                {/* Note input */}
                <div className="w-full md:w-64">
                  <input
                    type="text"
                    value={currentNote}
                    onChange={(e) => handleNoteChange(st.id, e.target.value)}
                    placeholder="ملاحظة الحضور (اختياري)..."
                    className="w-full h-9 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
