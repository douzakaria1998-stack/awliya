'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
  X,
  User,
  Users,
  Sparkles,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useLanguage } from '@/context/LanguageContext';

export function AdminAttendanceScreen() {
  const { visibleGroups, visibleStudents, attendanceSessions, recordAttendance } = useAdmin();
  const { isRTL, language } = useLanguage();

  const [selectedDate, setSelectedDate] = useState('2025-02-22');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Slide-over Drawer State
  const [activeDrawerGroup, setActiveDrawerGroup] = useState<(typeof visibleGroups)[0] | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Day mapping helpers
  const dayMapEn: Record<number, string> = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
  };

  const dayMapAr: Record<number, string> = {
    0: 'الأحد',
    1: 'الإثنين',
    2: 'الثلاثاء',
    3: 'الأربعاء',
    4: 'الخميس',
    5: 'الجمعة',
    6: 'السبت',
  };

  const dayMapFr: Record<number, string> = {
    0: 'Dimanche',
    1: 'Lundi',
    2: 'Mardi',
    3: 'Mercredi',
    4: 'Jeudi',
    5: 'Vendredi',
    6: 'Samedi',
  };

  const getDayOfWeekIndex = (dateStr: string) => {
    if (!dateStr) return 0;
    const [y, m, d] = dateStr.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.getDay();
  };

  const getDayName = (dateStr: string) => {
    const idx = getDayOfWeekIndex(dateStr);
    if (language === 'ar') return dayMapAr[idx];
    if (language === 'fr') return dayMapFr[idx];
    return dayMapEn[idx];
  };

  const doesGroupStudyOnDate = (group: (typeof visibleGroups)[0], dateStr: string) => {
    if (!group || !dateStr) return false;
    const dayIdx = getDayOfWeekIndex(dateStr);
    const enDay = dayMapEn[dayIdx].toLowerCase();
    const arDay = dayMapAr[dayIdx];

    const daysEn = (group.daysEn || '').toLowerCase();
    const daysAr = group.daysAr || '';

    return daysEn.includes(enDay) || daysAr.includes(arDay);
  };

  // Filter groups that study on the selected date
  const dayGroups = useMemo(() => {
    return visibleGroups.filter((g) => doesGroupStudyOnDate(g, selectedDate));
  }, [visibleGroups, selectedDate]);

  // Drawer selected students
  const drawerStudents = useMemo(() => {
    if (!activeDrawerGroup) return [];
    return visibleStudents.filter(
      (s) => activeDrawerGroup.studentIds.includes(s.id) || s.groupId === activeDrawerGroup.id
    );
  }, [activeDrawerGroup, visibleStudents]);

  // Active Session Record for Drawer Group
  const drawerSession = useMemo(() => {
    if (!activeDrawerGroup) return null;
    return attendanceSessions.find(
      (s) => s.groupId === activeDrawerGroup.id && s.date === selectedDate
    );
  }, [activeDrawerGroup, selectedDate, attendanceSessions]);

  // Local Attendance Sheet State for the Drawer
  const [studentStatusMap, setStudentStatusMap] = useState<Record<string, 'present' | 'late' | 'absent' | 'excused'>>({});
  const [studentNotesMap, setStudentNotesMap] = useState<Record<string, string>>({});
  const [studentLateTimeMap, setStudentLateTimeMap] = useState<Record<string, string>>({});

  // Lateness Modal State
  const [lateModalStudent, setLateModalStudent] = useState<(typeof visibleStudents)[0] | null>(null);
  const [lateMinutesInput, setLateMinutesInput] = useState('15');
  const [lateCustomNote, setLateCustomNote] = useState('');

  // Sync drawer session records to local state
  useEffect(() => {
    if (!activeDrawerGroup) return;
    const initialStatus: Record<string, 'present' | 'late' | 'absent' | 'excused'> = {};
    const initialNotes: Record<string, string> = {};
    const initialLateTimes: Record<string, string> = {};

    drawerStudents.forEach((st) => {
      const existingRec = drawerSession?.records.find((r) => r.studentId === st.id);
      initialStatus[st.id] = existingRec ? existingRec.status : 'present';
      initialNotes[st.id] = existingRec?.note || '';
      if (existingRec?.status === 'late') {
        // extract minutes if present in note
        const match = (existingRec.note || '').match(/(\d+)\s*(min|دقيقة|د)/);
        initialLateTimes[st.id] = match ? `${match[1]}m` : '15m';
      }
    });

    setStudentStatusMap(initialStatus);
    setStudentNotesMap(initialNotes);
    setStudentLateTimeMap(initialLateTimes);
  }, [activeDrawerGroup, drawerSession, drawerStudents]);

  // Open Drawer Handler
  const openAttendanceDrawer = (group: (typeof visibleGroups)[0]) => {
    setActiveDrawerGroup(group);
    setIsDrawerOpen(true);
  };

  // Close Drawer Handler
  const closeAttendanceDrawer = () => {
    setIsDrawerOpen(false);
  };

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lateModalStudent) {
          setLateModalStudent(null);
        } else if (isDrawerOpen) {
          closeAttendanceDrawer();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, lateModalStudent]);

  // Date Navigation (Previous Day ← Date → Next Day)
  const handlePrevDay = () => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const current = new Date(y, m - 1, d);
    current.setDate(current.getDate() - 1);
    const newY = current.getFullYear();
    const newM = String(current.getMonth() + 1).padStart(2, '0');
    const newD = String(current.getDate()).padStart(2, '0');
    setSelectedDate(`${newY}-${newM}-${newD}`);
  };

  const handleNextDay = () => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const current = new Date(y, m - 1, d);
    current.setDate(current.getDate() + 1);
    const newY = current.getFullYear();
    const newM = String(current.getMonth() + 1).padStart(2, '0');
    const newD = String(current.getDate()).padStart(2, '0');
    setSelectedDate(`${newY}-${newM}-${newD}`);
  };

  const handleStatusChange = (studentId: string, status: 'present' | 'late' | 'absent' | 'excused') => {
    if (status === 'late') {
      const student = drawerStudents.find((s) => s.id === studentId);
      if (student) {
        setLateModalStudent(student);
        const existingTime = studentLateTimeMap[studentId] || '15';
        const numOnly = existingTime.replace(/\D/g, '') || '15';
        setLateMinutesInput(numOnly);
        setLateCustomNote('');
        return;
      }
    }
    setStudentStatusMap((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleConfirmLateness = () => {
    if (!lateModalStudent) return;
    const mins = lateMinutesInput.trim() || '15';
    const lateLabel = `${mins}m`;

    setStudentStatusMap((prev) => ({ ...prev, [lateModalStudent.id]: 'late' }));
    setStudentLateTimeMap((prev) => ({ ...prev, [lateModalStudent.id]: lateLabel }));

    // Auto-update student note
    const currentNote = studentNotesMap[lateModalStudent.id] || '';
    let updatedNote = currentNote;
    if (lateCustomNote.trim()) {
      updatedNote = language === 'ar'
        ? `[تأخر ${mins} دقيقة: ${lateCustomNote.trim()}] ${currentNote}`.trim()
        : `[Late ${mins} min: ${lateCustomNote.trim()}] ${currentNote}`.trim();
    } else if (!currentNote.includes('min') && !currentNote.includes('دقيقة')) {
      updatedNote = language === 'ar'
        ? `[تأخر ${mins} دقيقة] ${currentNote}`.trim()
        : `[Late ${mins} min] ${currentNote}`.trim();
    }
    setStudentNotesMap((prev) => ({ ...prev, [lateModalStudent.id]: updatedNote }));
    setLateModalStudent(null);
  };

  const handleSaveAttendance = () => {
    if (!activeDrawerGroup) return;

    const records = drawerStudents.map((st) => ({
      studentId: st.id,
      status: studentStatusMap[st.id] || 'present',
      note: studentNotesMap[st.id] || '',
    }));

    recordAttendance(drawerSession?.id || `att-sess-${activeDrawerGroup.id}`, records);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsDrawerOpen(false);
    }, 1400);
  };

  // Real-Time Session Statistics for Drawer (Excused is counted like Absent)
  const stats = useMemo(() => {
    const total = drawerStudents.length || 1;
    const presentCount = Object.values(studentStatusMap).filter((s) => s === 'present').length;
    const lateCount = Object.values(studentStatusMap).filter((s) => s === 'late').length;
    const rawAbsentCount = Object.values(studentStatusMap).filter((s) => s === 'absent').length;
    const excusedCount = Object.values(studentStatusMap).filter((s) => s === 'excused').length;
    // Excused is counted like Absent as requested
    const absentCount = rawAbsentCount + excusedCount;
    const percentage = Math.round(((presentCount + lateCount) / total) * 100);

    return { total, presentCount, lateCount, absentCount, excusedCount, rawAbsentCount, percentage };
  }, [studentStatusMap, drawerStudents]);

  return (
    <div className={`w-full select-none ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* 1. Main Screen Header */}
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
      </div>

      {/* 2. Today's Groups Card (With Integrated Big Day Display & Day Switcher) */}
      <div
        className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-[32px] shadow-xs overflow-hidden"
        style={{ marginBottom: '44px' }}
      >
        {/* Card Header Bar */}
        <div
          className="border-b border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
          style={{ padding: '24px 32px' }}
        >
          {/* Left: Title & Subtitle */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black shrink-0 shadow-2xs">
              <School size={22} />
            </div>
            <div>
              <h3 className="font-black text-lg sm:text-xl text-slate-900 dark:text-white leading-tight">
                {language === 'ar' ? 'أفواج وحصص اليوم الدراسية' : language === 'fr' ? 'Groupes & Cours du Jour' : 'Scheduled Classes & Groups Today'}
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-1">
                {language === 'ar'
                  ? 'انقر على أي فوج لفتح نافذة رصد الحضور وقائمة الطلاب الخاصة به'
                  : language === 'fr'
                  ? 'Cliquez sur un groupe pour ouvrir le panneau d\'appel des élèves'
                  : 'Click on any class to open the student attendance slide-over panel'}
              </p>
            </div>
          </div>

          {/* Right: Prominent Big Day Name & Day Switcher */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Big Day Name Display */}
            <div
              className="flex items-center gap-3.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/80 rounded-2xl shadow-2xs"
              style={{
                paddingTop: '12px',
                paddingBottom: '12px',
                paddingLeft: '24px',
                paddingRight: '24px',
              }}
            >
              <Calendar size={20} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-base sm:text-lg font-black text-emerald-950 dark:text-emerald-100">
                {getDayName(selectedDate)}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span className="text-xs sm:text-sm font-mono font-extrabold text-emerald-700 dark:text-emerald-300">
                {dayGroups.length} {language === 'ar' ? 'أفواج نشطة' : language === 'fr' ? 'groupes' : 'active groups'}
              </span>
            </div>

            {/* Day Switcher Controls (< Date Picker >) */}
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 p-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <button
                type="button"
                onClick={handlePrevDay}
                className="w-10 h-10 rounded-xl hover:bg-white dark:hover:bg-slate-850 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                title="Previous Day"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-850 rounded-xl border border-slate-200/60 dark:border-slate-750 font-mono font-bold text-xs sm:text-sm text-slate-900 dark:text-white shadow-2xs">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent focus:outline-none cursor-pointer text-xs sm:text-sm font-mono font-bold"
                />
              </div>

              <button
                type="button"
                onClick={handleNextDay}
                className="w-10 h-10 rounded-xl hover:bg-white dark:hover:bg-slate-850 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                title="Next Day"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Card Body: Table or Off-Day Empty State */}
        {dayGroups.length === 0 ? (
          <div
            className="text-center space-y-3"
            style={{ padding: '64px 40px' }}
          >
            <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-xs">
              <Calendar size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              {language === 'ar'
                ? `عطلة / لا توجد أفواج دراسية مجدولة ليوم ${getDayName(selectedDate)}`
                : language === 'fr'
                ? `Jour de repos / Aucun cours le ${getDayName(selectedDate)}`
                : `Off-Day / No classes scheduled on ${getDayName(selectedDate)}`}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              {language === 'ar'
                ? 'يرجى التنقل إلى يوم دراسي آخر باستخدام أسهم التقويم أعلاه لعرض وتثبيت حضور الطلاب.'
                : language === 'fr'
                ? 'Veuillez utiliser les flèches du calendrier ci-dessus pour naviguer vers un jour de cours actif.'
                : 'Please use the date navigation arrows above to select an active study day to record attendance.'}
            </p>
          </div>
        ) : (
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
                    {language === 'ar' ? 'الفوج والمستوى' : language === 'fr' ? 'Groupe & Niveau' : 'Group & Level'}
                  </th>
                  <th className="py-7 px-6 font-extrabold">{language === 'ar' ? 'الأستاذ المشرف' : language === 'fr' ? 'Enseignant' : 'Assigned Teacher'}</th>
                  <th className="py-7 px-6 font-extrabold">{language === 'ar' ? 'توقيت الحصة' : language === 'fr' ? 'Horaire du cours' : 'Session Timing'}</th>
                  <th className="py-7 px-6 font-extrabold">{language === 'ar' ? 'الطلاب المسجلين' : language === 'fr' ? 'Élèves inscrits' : 'Enrolled Students'}</th>
                  <th className="py-7 px-6 font-extrabold">{language === 'ar' ? 'حالة الرصد' : language === 'fr' ? 'Statut d\'appel' : 'Attendance Status'}</th>
                  <th
                    className={`font-extrabold text-xs sm:text-sm ${isRTL ? 'text-right' : 'text-left'}`}
                    style={{
                      paddingTop: '26px',
                      paddingBottom: '26px',
                      paddingRight: isRTL ? '40px' : '24px',
                      paddingLeft: isRTL ? '24px' : '40px',
                    }}
                  >
                    {language === 'ar' ? 'الإجراء' : language === 'fr' ? 'Action' : 'Action'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {dayGroups.map((grp) => {
                  const studentCount = grp.studentIds.length || 0;
                  const isRecorded = attendanceSessions.some(
                    (s) => s.groupId === grp.id && s.date === selectedDate
                  );

                  return (
                    <tr
                      key={grp.id}
                      onClick={() => openAttendanceDrawer(grp)}
                      className="hover:bg-indigo-50/40 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group"
                    >
                      {/* Group & Level */}
                      <td
                        className="py-7 font-bold text-slate-900 dark:text-white"
                        style={{
                          paddingLeft: isRTL ? '24px' : '40px',
                          paddingRight: isRTL ? '40px' : '24px',
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="px-2.5 py-1 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-mono font-black text-xs">
                            {grp.code}
                          </span>
                          <div>
                            <div className="font-black text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                              {grp.name}
                            </div>
                            <div className="text-xs text-slate-400 font-normal mt-0.5">
                              {grp.level} • {grp.language}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Teacher */}
                      <td className="py-7 px-6 font-bold text-slate-800 dark:text-slate-200">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-xs flex items-center justify-center shrink-0">
                            {grp.teacherName[0]}
                          </div>
                          <span>{grp.teacherName}</span>
                        </div>
                      </td>

                      {/* Timing */}
                      <td className="py-7 px-6 font-mono font-bold text-slate-700 dark:text-slate-300">
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-indigo-600 shrink-0" />
                          <span>{grp.startTime} - {grp.endTime}</span>
                        </div>
                      </td>

                      {/* Enrolled Students */}
                      <td className="py-7 px-6 font-bold text-slate-800 dark:text-slate-200">
                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-purple-600 shrink-0" />
                          <span>{studentCount} {language === 'ar' ? 'طلاب' : language === 'fr' ? 'élèves' : 'students'}</span>
                        </div>
                      </td>

                      {/* Attendance Status */}
                      <td className="py-7 px-6">
                        {isRecorded ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-black text-xs border border-emerald-200/60 dark:border-emerald-800/60 shadow-2xs">
                            <CheckCircle2 size={15} />
                            <span>{language === 'ar' ? 'تم الرصد' : language === 'fr' ? 'Enregistré' : 'Recorded'}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 font-bold text-xs border border-amber-200/60 dark:border-amber-800/60 shadow-2xs">
                            <Clock size={15} />
                            <span>{language === 'ar' ? 'بانتظار التسجيل' : language === 'fr' ? 'En attente' : 'Pending'}</span>
                          </span>
                        )}
                      </td>

                      {/* Action Button */}
                      <td
                        className="py-7"
                        style={{
                          paddingRight: isRTL ? '40px' : '24px',
                          paddingLeft: isRTL ? '24px' : '40px',
                        }}
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openAttendanceDrawer(grp);
                          }}
                          className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                          style={{ padding: '10px 22px' }}
                        >
                          <CalendarCheck2 size={16} />
                          <span>{language === 'ar' ? 'رصد الحضور' : language === 'fr' ? 'Faire l\'appel' : 'Take Attendance'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 3. Slide-Over Attendance Drawer from the Right (Full Screen Height, Compact Width) */}
      {isDrawerOpen && activeDrawerGroup && (
        <div className="fixed inset-0 z-50 overflow-hidden select-none">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={closeAttendanceDrawer}
          />

          {/* Slide-over Container from the Right */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-8 z-50 animate-in slide-in-from-right duration-300">
            <div className="w-screen max-w-2xl bg-white dark:bg-slate-900 shadow-2xl flex flex-col h-full border-l border-slate-200 dark:border-slate-800">
              {/* Header */}
              <div
                className="border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-850/80 shrink-0"
                style={{ padding: '18px 24px' }}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black shrink-0 shadow-sm">
                    <CalendarCheck2 size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono font-black text-xs">
                        {activeDrawerGroup.code}
                      </span>
                      <h3 className="text-base font-black text-slate-900 dark:text-white truncate">
                        {activeDrawerGroup.name}
                      </h3>
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium mt-0.5 flex items-center gap-1.5">
                      <span>{getDayName(selectedDate)} • {selectedDate}</span>
                      <span>•</span>
                      <span>{activeDrawerGroup.teacherName}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeAttendanceDrawer}
                  className="w-8 h-8 rounded-xl bg-slate-200/70 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  title="Close"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Real-time Summary Pills Bar */}
              <div
                className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-around gap-2 shrink-0"
                style={{ padding: '12px 20px' }}
              >
                <div className="text-center">
                  <span className="text-[10px] font-bold text-slate-400 block">{language === 'ar' ? 'نسبة الحضور' : 'Rate'}</span>
                  <span className="text-sm font-black font-mono text-emerald-600">{stats.percentage}%</span>
                </div>
                <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
                <div className="text-center">
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block">{language === 'ar' ? 'حاضر' : 'Present'}</span>
                  <span className="text-sm font-black font-mono text-emerald-700 dark:text-emerald-300">{stats.presentCount}</span>
                </div>
                <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
                <div className="text-center">
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 block">{language === 'ar' ? 'متأخر' : 'Late'}</span>
                  <span className="text-sm font-black font-mono text-amber-700 dark:text-amber-300">{stats.lateCount}</span>
                </div>
                <div className="h-6 w-px bg-slate-200 dark:border-slate-800" />
                <div className="text-center">
                  <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 block">
                    {language === 'ar' ? 'غائب' : 'Absent'}
                  </span>
                  <span className="text-sm font-black font-mono text-rose-700 dark:text-rose-300">{stats.absentCount}</span>
                  {stats.excusedCount > 0 && (
                    <span className="text-[9px] text-blue-500 font-bold block">
                      ({stats.excusedCount} {language === 'ar' ? 'مبرر' : 'excused'})
                    </span>
                  )}
                </div>
              </div>

              {/* Table of Students */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5">
                <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-2xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className={`w-full text-xs ${isRTL ? 'text-right' : 'text-left'}`}>
                      <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800 text-slate-400 font-bold text-[11px]">
                        <tr>
                          <th
                            className={`font-extrabold ${isRTL ? 'text-right' : 'text-left'}`}
                            style={{
                              paddingTop: '14px',
                              paddingBottom: '14px',
                              paddingLeft: isRTL ? '14px' : '18px',
                              paddingRight: isRTL ? '18px' : '14px',
                            }}
                          >
                            {language === 'ar' ? 'الطالب' : language === 'fr' ? 'Élève' : 'Student'}
                          </th>
                          <th className="py-3.5 px-3 font-extrabold text-center">
                            <div>
                              <span>{language === 'ar' ? 'حالة الحضور' : language === 'fr' ? 'Statut' : 'Attendance'}</span>
                              <div className="text-[9px] font-mono text-slate-400 dark:text-slate-500 font-normal">
                                P: Present • L: Late • A: Absent • E: Excused
                              </div>
                            </div>
                          </th>
                          <th
                            className={`font-extrabold ${isRTL ? 'text-right' : 'text-left'}`}
                            style={{
                              paddingTop: '14px',
                              paddingBottom: '14px',
                              paddingRight: isRTL ? '18px' : '14px',
                              paddingLeft: isRTL ? '14px' : '18px',
                            }}
                          >
                            {language === 'ar' ? 'الملاحظة' : language === 'fr' ? 'Note' : 'Session Note'}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {drawerStudents.map((st, idx) => {
                          const currentStatus = studentStatusMap[st.id] || 'present';
                          const lateTime = studentLateTimeMap[st.id] || '15m';

                          return (
                            <tr key={st.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                              {/* 1. Student Name */}
                              <td
                                className="py-3.5 font-bold text-slate-900 dark:text-white"
                                style={{
                                  paddingLeft: isRTL ? '14px' : '18px',
                                  paddingRight: isRTL ? '18px' : '14px',
                                }}
                              >
                                <div className="flex items-center gap-2.5">
                                  <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-[11px] flex items-center justify-center shrink-0">
                                    {idx + 1}
                                  </span>
                                  <div>
                                    <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug">
                                      {st.fullNameAr}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-mono">
                                      {st.fullNameEn}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* 2. Action Status Single-Letter Buttons ("P, L, A, E") */}
                              <td className="py-3.5 px-3">
                                <div className="flex items-center justify-center gap-2">
                                  {/* P = Present */}
                                  <button
                                    type="button"
                                    onClick={() => handleStatusChange(st.id, 'present')}
                                    title="P = Present (حاضر)"
                                    className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center transition-all cursor-pointer ${
                                      currentStatus === 'present'
                                        ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400/40 scale-105'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600'
                                    }`}
                                  >
                                    P
                                  </button>

                                  {/* L = Late */}
                                  <div className="relative inline-flex flex-col items-center">
                                    <button
                                      type="button"
                                      onClick={() => handleStatusChange(st.id, 'late')}
                                      title={currentStatus === 'late' ? `Late (${lateTime}) - Click to change` : 'L = Late (متأخر)'}
                                      className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center transition-all cursor-pointer ${
                                        currentStatus === 'late'
                                          ? 'bg-amber-500 text-slate-950 shadow-sm ring-2 ring-amber-400/40 scale-105'
                                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:text-amber-600'
                                      }`}
                                    >
                                      L
                                    </button>
                                    {currentStatus === 'late' && (
                                      <span className="absolute -bottom-2 px-1 py-0.1 bg-amber-950 text-amber-300 dark:bg-amber-300 dark:text-slate-950 text-[8px] font-black rounded font-mono shadow-xs border border-amber-400/30 whitespace-nowrap">
                                        {lateTime}
                                      </span>
                                    )}
                                  </div>

                                  {/* A = Absent */}
                                  <button
                                    type="button"
                                    onClick={() => handleStatusChange(st.id, 'absent')}
                                    title="A = Absent (غائب)"
                                    className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center transition-all cursor-pointer ${
                                      currentStatus === 'absent'
                                        ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-400/40 scale-105'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600'
                                    }`}
                                  >
                                    A
                                  </button>

                                  {/* E = Excused */}
                                  <button
                                    type="button"
                                    onClick={() => handleStatusChange(st.id, 'excused')}
                                    title="E = Excused (غياب مبرر)"
                                    className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center transition-all cursor-pointer ${
                                      currentStatus === 'excused'
                                        ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400/40 scale-105'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600'
                                    }`}
                                  >
                                    E
                                  </button>
                                </div>
                              </td>

                              {/* 3. Comment / Teacher Note Input beside actions */}
                              <td
                                className="py-3.5"
                                style={{
                                  paddingRight: isRTL ? '18px' : '14px',
                                  paddingLeft: isRTL ? '14px' : '18px',
                                }}
                              >
                                <input
                                  type="text"
                                  value={studentNotesMap[st.id] || ''}
                                  onChange={(e) => setStudentNotesMap({ ...studentNotesMap, [st.id]: e.target.value })}
                                  placeholder={language === 'ar' ? 'ملاحظة...' : 'Session note...'}
                                  className="w-full min-w-[140px] h-9 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-750 rounded-xl text-xs text-slate-900 dark:text-white shadow-2xs focus:outline-none focus:border-indigo-500 transition-colors"
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

              {/* Sticky Footer */}
              <div
                className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 flex items-center justify-end gap-3.5 shrink-0"
                style={{
                  paddingTop: '22px',
                  paddingBottom: '24px',
                  paddingLeft: '32px',
                  paddingRight: '32px',
                }}
              >
                <button
                  type="button"
                  onClick={closeAttendanceDrawer}
                  className="rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm cursor-pointer transition-all"
                  style={{
                    paddingTop: '12px',
                    paddingBottom: '12px',
                    paddingLeft: '24px',
                    paddingRight: '24px',
                  }}
                >
                  {language === 'ar' ? 'إلغاء' : language === 'fr' ? 'Annuler' : 'Cancel'}
                </button>

                <button
                  type="button"
                  onClick={handleSaveAttendance}
                  className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm flex items-center gap-3 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  style={{
                    paddingTop: '12px',
                    paddingBottom: '12px',
                    paddingLeft: '28px',
                    paddingRight: '28px',
                  }}
                >
                  {savedSuccess ? (
                    <>
                      <Check size={18} />
                      <span>{language === 'ar' ? 'تم الحفظ بنجاح ✓' : language === 'fr' ? 'Enregistré ✓' : 'Saved ✓'}</span>
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      <span>{language === 'ar' ? 'حفظ وتثبيت الحضور' : language === 'fr' ? 'Enregistrer' : 'Save Attendance Sheet'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Time of Lateness Modal Popup */}
      {lateModalStudent && (
        <div className="fixed inset-0 z-60 overflow-hidden flex items-center justify-center p-4 select-none">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={() => setLateModalStudent(null)}
          />

          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black shrink-0 shadow-xs">
                  <Clock size={20} />
                </div>
                <div>
                  <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white">
                    {language === 'ar' ? 'تحديد مدة التأخير' : language === 'fr' ? 'Durée du retard' : 'Set Lateness Time'}
                  </h3>
                  <p className="text-xs text-slate-400 font-bold">
                    {lateModalStudent.fullNameAr} • {lateModalStudent.fullNameEn}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setLateModalStudent(null)}
                className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Presets Grid */}
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-2">
                {language === 'ar' ? 'خيارات سريعة للمدة:' : language === 'fr' ? 'Durées rapides:' : 'Quick Presets:'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['5', '10', '15', '20', '30', '45'].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setLateMinutesInput(mins)}
                    className={`py-2.5 px-3 rounded-xl font-black text-xs transition-all cursor-pointer border ${
                      lateMinutesInput === mins
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm scale-102 font-black'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-amber-400'
                    }`}
                  >
                    +{mins} {language === 'ar' ? 'دقيقة' : 'min'}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input */}
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1.5">
                {language === 'ar' ? 'أو أدخل عدد الدقائق يدوياً:' : language === 'fr' ? 'Ou entrez les minutes:' : 'Or enter minutes manually:'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="180"
                  value={lateMinutesInput}
                  onChange={(e) => setLateMinutesInput(e.target.value)}
                  className="flex-1 h-11 px-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold font-mono text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 shadow-2xs"
                />
                <span className="text-xs font-bold text-slate-500 shrink-0">
                  {language === 'ar' ? 'دقيقة' : 'minutes'}
                </span>
              </div>
            </div>

            {/* Optional Reason / Note */}
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1.5">
                {language === 'ar' ? 'سبب التأخير (اختياري):' : language === 'fr' ? 'Motif du retard (optionnel):' : 'Lateness Reason (optional):'}
              </label>
              <input
                type="text"
                value={lateCustomNote}
                onChange={(e) => setLateCustomNote(e.target.value)}
                placeholder={language === 'ar' ? 'مثال: ازدحام مروري، موعد طبي...' : 'e.g. Traffic, doctor appointment...'}
                className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 shadow-2xs"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setLateModalStudent(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmLateness}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black shadow-md hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5 transition-all"
              >
                <Check size={16} />
                <span>{language === 'ar' ? 'تثبيت التأخير' : 'Confirm Lateness'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
