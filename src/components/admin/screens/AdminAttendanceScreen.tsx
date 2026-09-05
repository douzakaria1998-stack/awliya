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
  Plus,
  CalendarPlus,
  Info,
  BookOpen,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useLanguage } from '@/context/LanguageContext';
import { AdminGroup } from '@/types/admin';
import { formatStudentCount } from '@/lib/utils';

export function AdminAttendanceScreen() {
  const { visibleGroups, visibleStudents, teachers, attendanceSessions, recordAttendance, addCoveringSession } = useAdmin();
  const { isRTL, language } = useLanguage();

  const getTodayDateStr = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState(getTodayDateStr);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Slide-over Drawer State
  const [activeDrawerGroup, setActiveDrawerGroup] = useState<(typeof visibleGroups)[0] | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Covering Session Modal State
  const [isCoveringModalOpen, setIsCoveringModalOpen] = useState(false);
  const [coveringGroupId, setCoveringGroupId] = useState('');
  const [coveringDate, setCoveringDate] = useState(getTodayDateStr);
  const [coveringStartTime, setCoveringStartTime] = useState('10:00');
  const [coveringEndTime, setCoveringEndTime] = useState('12:00');
  const [coveringTeacherId, setCoveringTeacherId] = useState('');
  const [coveringType, setCoveringType] = useState<'counted' | 'not_counted'>('counted');
  const [coveringReason, setCoveringReason] = useState('');

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

    // 0. Covering session or already registered session on this date: ALWAYS show the group
    const sessionOnThisDate = attendanceSessions.find(
      (s) => s.groupId === group.id && s.date === dateStr
    );
    if (sessionOnThisDate) {
      return true;
    }

    // 1. Start date constraint: Group only appears on or after its start date
    if (group.startDate && dateStr < group.startDate) {
      return false;
    }

    // 2. Archived check: Archived groups don't appear unless already recorded on this date
    if (group.status === 'archived') {
      return false;
    }

    // 3. Session limit constraint: Stop appearing after totalSessions is reached
    const maxSessions = group.totalSessions || 24;
    const priorRecordedSessions = attendanceSessions.filter(
      (s) => s.groupId === group.id && s.date < dateStr && (!s.isCoveringSession || s.coveringType === 'counted')
    );
    if (priorRecordedSessions.length >= maxSessions) {
      return false;
    }

    // 4. Weekday schedule check
    const dayIdx = getDayOfWeekIndex(dateStr);
    const enDay = dayMapEn[dayIdx].toLowerCase();
    const arDay = dayMapAr[dayIdx];

    if (group.schedules && group.schedules.length > 0) {
      const matchSchedule = group.schedules.some((s) => {
        const d = (s.day || '').toLowerCase();
        return d.includes(enDay) || d.includes(arDay);
      });
      if (matchSchedule) return true;
    }

    const daysEn = (group.daysEn || '').toLowerCase();
    const daysAr = group.daysAr || '';

    return daysEn.includes(enDay) || daysAr.includes(arDay);
  };

  const handleOpenCoveringModal = () => {
    const firstGroup = visibleGroups[0];
    setCoveringDate(selectedDate);
    if (firstGroup) {
      setCoveringGroupId(firstGroup.id);
      setCoveringTeacherId(firstGroup.teacherId);
      setCoveringStartTime(firstGroup.startTime || '10:00');
      setCoveringEndTime(firstGroup.endTime || '12:00');
    }
    setCoveringType('counted');
    setCoveringReason('');
    setIsCoveringModalOpen(true);
  };

  const handleGroupSelectChange = (grpId: string) => {
    setCoveringGroupId(grpId);
    const grp = visibleGroups.find((g) => g.id === grpId);
    if (grp) {
      setCoveringTeacherId(grp.teacherId);
      if (grp.startTime) setCoveringStartTime(grp.startTime);
      if (grp.endTime) setCoveringEndTime(grp.endTime);
    }
  };

  const handleSaveCoveringSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coveringGroupId) return;

    const grp = visibleGroups.find((g) => g.id === coveringGroupId);
    if (!grp) return;

    const tObj = teachers.find((t) => t.id === coveringTeacherId) || teachers.find((t) => t.id === grp.teacherId);
    const teacherName = tObj?.fullNameAr || grp.teacherName;
    const teacherId = tObj?.id || grp.teacherId;

    const dayNameAr = getDayName(coveringDate);
    const dayIdx = getDayOfWeekIndex(coveringDate);
    const dayNameEn = dayMapEn[dayIdx];

    const sessionTime = coveringStartTime;

    addCoveringSession({
      groupId: grp.id,
      groupName: grp.name,
      date: coveringDate,
      dayNameAr,
      dayNameEn,
      sessionTime,
      teacherId,
      teacherName,
      coveringType,
      coveringReason,
    });

    setSelectedDate(coveringDate);
    setIsCoveringModalOpen(false);
    setCoveringReason('');
  };

  // Filter groups that study on the selected date
  const dayGroups = useMemo(() => {
    return visibleGroups.filter((g) => doesGroupStudyOnDate(g, selectedDate));
  }, [visibleGroups, selectedDate, attendanceSessions]);

  const sanitizeTimeStr = (raw: string) => {
    if (!raw) return '06:00 PM';
    let str = raw.trim();
    // Fix corrupted repeating times or messy slashes/dashes
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
    const dayIdx = getDayOfWeekIndex(selectedDate);
    const enDay = dayMapEn[dayIdx]?.toLowerCase() || '';
    const arDay = dayMapAr[dayIdx] || '';

    // 1. If group has structured schedules array
    if (grp.schedules && grp.schedules.length > 0) {
      const todaySchedule =
        grp.schedules.find((s) => {
          const d = (s.day || '').toLowerCase();
          return d.includes(enDay) || d.includes(arDay);
        }) || grp.schedules[0];

      return (
        <div className="flex justify-center py-0.5 whitespace-nowrap">
          <div className="inline-flex items-center justify-between gap-3 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs min-w-[145px]">
            <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
              {todaySchedule.day}
            </span>
            <span
              className="inline-flex items-center font-mono font-bold text-[11px] text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/70 px-2 py-0.5 rounded-lg border border-indigo-100 dark:border-indigo-900/60 shrink-0"
              dir="ltr"
            >
              {sanitizeTimeStr(todaySchedule.time ? `${todaySchedule.time} ${todaySchedule.period || ''}` : '')}
            </span>
          </div>
        </div>
      );
    }

    // 2. Parse from daysAr and startTime
    const days = grp.daysAr ? grp.daysAr.split(/\s*[\+\•\/,]\s*/).filter(Boolean) : [];
    const times = grp.startTime ? grp.startTime.split(/\s*[\/]\s*/).filter(Boolean) : [];

    if (days.length > 0) {
      const dayIndexInGroup = days.findIndex((d) => d.includes(arDay) || d.toLowerCase().includes(enDay));
      const targetIdx = dayIndexInGroup >= 0 ? dayIndexInGroup : 0;
      const targetDay = days[targetIdx] || days[0];
      const rawTime = times[targetIdx] || times[0] || grp.startTime || '06:00 PM';
      const cleanTime = sanitizeTimeStr(rawTime);

      return (
        <div className="flex justify-center py-0.5 whitespace-nowrap">
          <div className="inline-flex items-center justify-between gap-3 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs min-w-[145px]">
            <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
              {targetDay.trim()}
            </span>
            <span
              className="inline-flex items-center font-mono font-bold text-[11px] text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/70 px-2 py-0.5 rounded-lg border border-indigo-100 dark:border-indigo-900/60 shrink-0"
              dir="ltr"
            >
              {cleanTime}
            </span>
          </div>
        </div>
      );
    }

    return <span className="text-slate-400 text-xs">—</span>;
  };

  // Drawer selected students
  const drawerStudents = useMemo(() => {
    if (!activeDrawerGroup) return [];
    return visibleStudents.filter(
      (s) => s.groupId === activeDrawerGroup.id || (activeDrawerGroup.studentIds && activeDrawerGroup.studentIds.includes(s.id) && (!s.groupId || s.groupId === activeDrawerGroup.id))
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

    const sessionId = drawerSession?.id || `att-sess-${activeDrawerGroup.id}-${selectedDate}`;

    recordAttendance(
      sessionId,
      records,
      {
        groupId: activeDrawerGroup.id,
        groupName: activeDrawerGroup.name,
        date: selectedDate,
        dayNameAr: getDayName(selectedDate),
        dayNameEn: dayMapEn[getDayOfWeekIndex(selectedDate)],
        sessionTime: drawerSession?.sessionTime || `${activeDrawerGroup.startTime} - ${activeDrawerGroup.endTime}`,
        teacherId: drawerSession?.teacherId || activeDrawerGroup.teacherId,
        teacherName: drawerSession?.teacherName || activeDrawerGroup.teacherName,
        isCoveringSession: drawerSession?.isCoveringSession,
        coveringType: drawerSession?.coveringType,
        coveringReason: drawerSession?.coveringReason,
      }
    );
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

          {/* Right: Prominent Big Day Name, Covering Session Button & Day Switcher */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Covering Session Action Button */}
            <button
              type="button"
              onClick={handleOpenCoveringModal}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-xl shadow-xs shadow-amber-500/20 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
              style={{
                paddingTop: '8px',
                paddingBottom: '8px',
                paddingLeft: '14px',
                paddingRight: '14px',
              }}
            >
              <Plus size={16} className="stroke-[2.5]" />
              <span>{language === 'ar' ? 'إضافة حصة استدراكية' : 'Add Covering Session'}</span>
            </button>

            {/* Big Day Name Display */}
            <div
              className="flex items-center gap-2.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/80 rounded-xl shadow-2xs"
              style={{
                paddingTop: '7px',
                paddingBottom: '7px',
                paddingLeft: '14px',
                paddingRight: '14px',
              }}
            >
              <Calendar size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="text-xs sm:text-sm font-black text-emerald-950 dark:text-emerald-100">
                {getDayName(selectedDate)}
              </span>
              <span className="w-1 h-1 rounded-full bg-emerald-400 shrink-0" />
              <span className="text-[11px] sm:text-xs font-mono font-extrabold text-emerald-700 dark:text-emerald-300">
                {dayGroups.length} {language === 'ar' ? 'أفواج نشطة' : language === 'fr' ? 'groupes' : 'active groups'}
              </span>
            </div>

            {/* Day Switcher Controls (< Date Picker >) */}
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 p-1 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <button
                type="button"
                onClick={handlePrevDay}
                className="w-8 h-8 rounded-lg hover:bg-white dark:hover:bg-slate-850 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                title={language === 'ar' ? 'اليوم السابق' : 'Previous Day'}
              >
                {isRTL ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
              </button>

              <div
                className="flex items-center justify-center bg-white dark:bg-slate-850 rounded-lg border border-slate-200/80 dark:border-slate-750 font-mono font-bold text-slate-900 dark:text-white shadow-2xs"
                style={{ padding: '4px 10px' }}
              >
                <input
                  type="date"
                  dir="ltr"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{ padding: '2px 4px', minWidth: '135px' }}
                  className="bg-transparent focus:outline-none cursor-pointer text-xs font-mono font-black tracking-wide"
                />
              </div>

              <button
                type="button"
                onClick={handleNextDay}
                className="w-8 h-8 rounded-lg hover:bg-white dark:hover:bg-slate-850 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                title={language === 'ar' ? 'اليوم التالي' : 'Next Day'}
              >
                {isRTL ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
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
          <div className="overflow-x-auto px-5 sm:px-8 py-2">
            <table className={`w-full text-xs sm:text-sm border-separate border-spacing-y-3.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <thead className="text-slate-400 dark:text-slate-500 font-bold text-xs">
                <tr>
                  <th className={`pb-2.5 font-extrabold ${isRTL ? 'text-right pr-9 pl-6' : 'text-left pl-9 pr-6'}`}>
                    {language === 'ar' ? 'الفوج والمستوى' : language === 'fr' ? 'Groupe & Niveau' : 'Group & Level'}
                  </th>
                  <th className="pb-2.5 px-4 font-extrabold text-center">{language === 'ar' ? 'الأستاذ المشرف' : language === 'fr' ? 'Enseignant' : 'Assigned Teacher'}</th>
                  <th className="pb-2.5 px-4 font-extrabold text-center">{language === 'ar' ? 'توقيت الحصة' : language === 'fr' ? 'Horaire du cours' : 'Session Timing'}</th>
                  <th className="pb-2.5 px-4 font-extrabold text-center">{language === 'ar' ? 'الطلاب المسجلين' : language === 'fr' ? 'Élèves inscrits' : 'Enrolled Students'}</th>
                  <th className="pb-2.5 px-4 font-extrabold text-center">{language === 'ar' ? 'حالة الرصد' : language === 'fr' ? 'Statut d\'appel' : 'Attendance Status'}</th>
                  <th className={`pb-2.5 font-extrabold text-center ${isRTL ? 'pl-8 pr-4' : 'pr-8 pl-4'}`}>
                    {language === 'ar' ? 'الإجراء' : language === 'fr' ? 'Action' : 'Action'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {dayGroups.map((grp) => {
                  const studentCount = grp.studentIds.length || 0;
                  const sessionRecord = attendanceSessions.find(
                    (s) => s.groupId === grp.id && s.date === selectedDate
                  );
                  const isRecorded = !!sessionRecord && (sessionRecord.isLocked || (sessionRecord.records && sessionRecord.records.length > 0));
                  const isCovering = sessionRecord?.isCoveringSession;
                  const covType = sessionRecord?.coveringType;

                  return (
                    <tr
                      key={grp.id}
                      onClick={() => openAttendanceDrawer(grp)}
                      className="bg-white dark:bg-slate-850 hover:bg-indigo-50/50 dark:hover:bg-slate-800 transition-all cursor-pointer group shadow-2xs hover:shadow-xs"
                    >
                      {/* Group & Level */}
                      <td className="py-4.5 font-bold text-slate-900 dark:text-white border-y border-slate-200/80 dark:border-slate-800 rtl:border-r rtl:rounded-r-2xl ltr:border-l ltr:rounded-l-2xl rtl:pr-9 rtl:pl-6 ltr:pl-9 ltr:pr-6">
                        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-xl bg-indigo-100/90 dark:bg-indigo-950/90 text-indigo-700 dark:text-indigo-300 font-mono font-black text-xs sm:text-sm tracking-wider shadow-2xs border border-indigo-200/80 dark:border-indigo-800/80 shrink-0 text-center min-w-[50px]">
                            {grp.code}
                          </span>
                          <span className="font-black text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                            {grp.name}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            • {grp.level}
                          </span>
                          <span
                            className={`text-[11px] font-bold rounded-lg border px-2 py-0.5 inline-flex items-center gap-1 shadow-2xs ${
                              grp.language?.toLowerCase().includes('french') || grp.language?.includes('فرنسية')
                                ? 'bg-red-100/80 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-200/80 dark:border-red-800/80'
                                : grp.language?.toLowerCase().includes('spanish') || grp.language?.includes('إسبانية')
                                ? 'bg-orange-100/80 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border-orange-200/80 dark:border-orange-800/80'
                                : grp.language?.toLowerCase().includes('german') || grp.language?.includes('ألمانية')
                                ? 'bg-yellow-100/80 dark:bg-yellow-950/60 text-yellow-800 dark:text-yellow-200 border-yellow-300/80 dark:border-yellow-700/80'
                                : 'bg-blue-100/80 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200/80 dark:border-blue-800/80'
                            }`}
                          >
                            <BookOpen size={11} className="shrink-0" />
                            <span>{grp.language}</span>
                          </span>
                          {isCovering ? (
                            covType === 'counted' ? (
                              <span
                                className="text-[11px] font-bold rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 whitespace-nowrap inline-flex items-center gap-1 shadow-2xs"
                                style={{ padding: '2px 9px' }}
                              >
                                <Sparkles size={11} className="text-amber-500 shrink-0" />
                                <span>{language === 'ar' ? 'حصة استدراكية (محسوبة)' : 'Covering (Counted)'}</span>
                              </span>
                            ) : (
                              <span
                                className="text-[11px] font-bold rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30 whitespace-nowrap inline-flex items-center gap-1 shadow-2xs"
                                style={{ padding: '2px 9px' }}
                              >
                                <Sparkles size={11} className="text-purple-500 shrink-0" />
                                <span>{language === 'ar' ? 'حصة استدراكية (إضافية)' : 'Covering (Extra)'}</span>
                              </span>
                            )
                          ) : (
                            <span
                              className="text-xs font-bold rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 whitespace-nowrap shadow-2xs inline-flex items-center gap-1.5"
                              style={{ padding: '2px 10px' }}
                            >
                              <span>{language === 'ar' ? 'الحصة' : 'Session'}</span>
                              <span dir="ltr" className="font-mono font-black tracking-wide">
                                {attendanceSessions.filter((s) => s.groupId === grp.id && s.date <= selectedDate).length || 1} / {grp.totalSessions || 24}
                              </span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Teacher */}
                      <td className="py-4.5 px-4 font-bold text-slate-800 dark:text-slate-200 text-center border-y border-slate-200/80 dark:border-slate-800">
                        <div className="inline-flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                            {grp.teacherName[0]}
                          </div>
                          <span className="text-xs sm:text-sm whitespace-nowrap">{grp.teacherName}</span>
                        </div>
                      </td>

                      {/* Timing / Schedule */}
                      <td className="py-4.5 px-4 text-center border-y border-slate-200/80 dark:border-slate-800">
                        {renderGroupSchedule(grp)}
                      </td>

                      {/* Enrolled Students */}
                      <td className="py-4.5 px-4 font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm text-center whitespace-nowrap border-y border-slate-200/80 dark:border-slate-800">
                        <div className="inline-flex items-center gap-1.5">
                          <Users size={15} className="text-purple-600 shrink-0" />
                          <span>{formatStudentCount(studentCount, language)}</span>
                        </div>
                      </td>

                      {/* Attendance Status */}
                      <td className="py-4.5 px-4 text-center border-y border-slate-200/80 dark:border-slate-800">
                        {isRecorded ? (
                          <span
                            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-bold text-xs border border-emerald-300/80 dark:border-emerald-700/80 shadow-2xs whitespace-nowrap"
                            style={{ padding: '4px 12px' }}
                          >
                            <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>{language === 'ar' ? 'تم الرصد' : language === 'fr' ? 'Enregistré' : 'Recorded'}</span>
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 font-bold text-xs border border-amber-300/80 dark:border-amber-700/80 shadow-2xs whitespace-nowrap"
                            style={{ padding: '4px 12px' }}
                          >
                            <Clock size={13} className="text-amber-600 dark:text-amber-400 shrink-0" />
                            <span>{language === 'ar' ? 'بانتظار التسجيل' : language === 'fr' ? 'En attente' : 'Pending'}</span>
                          </span>
                        )}
                      </td>

                      {/* Action Button */}
                      <td className={`py-4.5 text-center border-y border-slate-200/80 dark:border-slate-800 rtl:border-l rtl:rounded-l-2xl ltr:border-r ltr:rounded-r-2xl ${isRTL ? 'pl-8 pr-4' : 'pr-8 pl-4'}`}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openAttendanceDrawer(grp);
                          }}
                          className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap mx-auto"
                          style={{ padding: '6px 14px' }}
                        >
                          <CalendarCheck2 size={13} className="shrink-0" />
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
                                className="py-6 font-bold text-slate-900 dark:text-white"
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
                              <td className="py-6 px-3">
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
                                  <button
                                    type="button"
                                    dir="ltr"
                                    onClick={() => handleStatusChange(st.id, 'late')}
                                    title={currentStatus === 'late' ? `Late (${lateTime}) - Click to change` : 'L = Late (متأخر)'}
                                    className={`h-8 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                      currentStatus === 'late'
                                        ? 'bg-amber-500 text-slate-950 shadow-sm ring-2 ring-amber-400/40 px-3.5 min-w-14'
                                        : 'w-8 bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:text-amber-600'
                                    }`}
                                  >
                                    <span>L</span>
                                    {currentStatus === 'late' && (
                                      <span className="text-[10px] font-bold font-mono text-slate-950">
                                        {lateTime}
                                      </span>
                                    )}
                                  </button>

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
                                className="py-6"
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
                                  className="w-full min-w-[140px] h-9 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-750 rounded-xl text-xs text-slate-900 dark:text-white shadow-2xs focus:outline-none focus:border-indigo-500 transition-colors"
                                  style={{ paddingLeft: '14px', paddingRight: '14px' }}
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
        <div className="fixed inset-0 z-60 overflow-y-auto flex items-center justify-center p-4 sm:p-6 select-none bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div
            className="fixed inset-0"
            onClick={() => setLateModalStudent(null)}
          />

          <div
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[28px] shadow-2xl overflow-hidden my-auto animate-fade-in-up"
            style={{ padding: '28px 32px' }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-500 dark:text-amber-400 flex items-center justify-center font-black shrink-0 shadow-xs border border-amber-500/20">
                  <Clock size={22} />
                </div>
                <div>
                  <h3 className="font-black text-lg sm:text-xl text-slate-900 dark:text-white">
                    {language === 'ar' ? 'تحديد مدة التأخير' : language === 'fr' ? 'Durée du retard' : 'Set Lateness Time'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 font-bold mt-0.5">
                    {lateModalStudent.fullNameAr} • {lateModalStudent.fullNameEn}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setLateModalStudent(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center cursor-pointer transition-colors shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body with clear container gaps */}
            <div className="flex flex-col gap-5">
              {/* Presets Grid */}
              <div className="flex flex-col gap-2">
                <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                  {language === 'ar' ? 'خيارات سريعة للمدة:' : language === 'fr' ? 'Durées rapides:' : 'Quick Presets:'}
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {['5', '10', '15', '20', '30', '45'].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setLateMinutesInput(mins)}
                      style={{ padding: '10px 12px' }}
                      className={`rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer border flex items-center justify-center ${
                        lateMinutesInput === mins
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black scale-102'
                          : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-amber-400/60 hover:bg-amber-500/5'
                      }`}
                    >
                      +{mins} {language === 'ar' ? 'دقيقة' : 'min'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Input */}
              <div className="flex flex-col gap-2">
                <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                  {language === 'ar' ? 'أو أدخل عدد الدقائق يدوياً:' : language === 'fr' ? 'Ou entrez les minutes:' : 'Or enter minutes manually:'}
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={lateMinutesInput}
                    onChange={(e) => setLateMinutesInput(e.target.value)}
                    style={{
                      paddingLeft: isRTL ? '64px' : '16px',
                      paddingRight: isRTL ? '16px' : '64px',
                    }}
                    className="w-full h-12 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                  />
                  <span
                    className={`absolute text-xs font-bold text-slate-400 pointer-events-none ${
                      isRTL ? 'left-4' : 'right-4'
                    }`}
                  >
                    {language === 'ar' ? 'دقيقة' : 'min'}
                  </span>
                </div>
              </div>

              {/* Optional Reason / Note */}
              <div className="flex flex-col gap-2">
                <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                  {language === 'ar' ? 'سبب التأخير (اختياري):' : language === 'fr' ? 'Motif du retard (optionnel):' : 'Lateness Reason (optional):'}
                </label>
                <input
                  type="text"
                  value={lateCustomNote}
                  onChange={(e) => setLateCustomNote(e.target.value)}
                  placeholder={language === 'ar' ? 'مثال: ازدحام مروري، موعد طبي...' : 'e.g. Traffic, doctor appointment...'}
                  style={{ paddingLeft: '16px', paddingRight: '16px' }}
                  className="w-full h-12 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Modal Actions */}
              <div
                className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 mt-2"
              >
                <button
                  type="button"
                  onClick={() => setLateModalStudent(null)}
                  className="rounded-xl text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                  style={{ padding: '10px 20px' }}
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmLateness}
                  className="rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-98 text-slate-950 text-xs sm:text-sm font-black shadow-md shadow-amber-500/20 cursor-pointer flex items-center gap-2 transition-all"
                  style={{ padding: '10px 24px' }}
                >
                  <Check size={16} />
                  <span>{language === 'ar' ? 'تثبيت التأخير' : 'Confirm Lateness'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* 5. Add Covering Session Modal Dialog */}
      {isCoveringModalOpen && (
        <div className="fixed inset-0 z-60 overflow-y-auto flex items-center justify-center p-4 sm:p-6 select-none bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div
            className="fixed inset-0"
            onClick={() => setIsCoveringModalOpen(false)}
          />

          <div
            className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[28px] shadow-2xl overflow-hidden my-auto animate-fade-in-up"
            style={{ padding: '30px 34px' }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black shrink-0 shadow-xs border border-amber-500/30">
                  <CalendarPlus size={24} />
                </div>
                <div>
                  <h3 className="font-black text-lg sm:text-xl text-slate-900 dark:text-white">
                    {language === 'ar' ? 'إضافة حصة استدراكية / تعويضية' : 'Add Covering Session'}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    {language === 'ar'
                      ? 'جدولة حصة استدراكية لفوج معين وتحديد نوع الحساب'
                      : 'Schedule a covering session and configure quota calculation'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCoveringModalOpen(false)}
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center cursor-pointer transition-colors shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveCoveringSession} className="flex flex-col gap-5">
              {/* Target Group Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                  {language === 'ar' ? 'الفوج المستهدف (Target Group):' : 'Target Study Group:'}
                </label>
                <select
                  value={coveringGroupId}
                  onChange={(e) => handleGroupSelectChange(e.target.value)}
                  className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all cursor-pointer"
                  required
                >
                  <option value="" disabled>
                    {language === 'ar' ? '-- اختر الفوج --' : '-- Select Group --'}
                  </option>
                  {visibleGroups.map((grp) => (
                    <option key={grp.id} value={grp.id}>
                      {grp.name} ({grp.code}) — {grp.level} — {grp.teacherName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Date */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                    {language === 'ar' ? 'تاريخ الحصة:' : 'Session Date:'}
                  </label>
                  <input
                    type="date"
                    dir="ltr"
                    value={coveringDate}
                    onChange={(e) => setCoveringDate(e.target.value)}
                    className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all cursor-pointer"
                    required
                  />
                </div>

                {/* Session Time */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                    {language === 'ar' ? 'وقت وتوقيت الحصة:' : 'Session Time:'}
                  </label>
                  <input
                    type="time"
                    dir="ltr"
                    value={coveringStartTime}
                    onChange={(e) => setCoveringStartTime(e.target.value)}
                    className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all cursor-pointer"
                    required
                  />
                </div>
              </div>

              {/* Supervising Teacher */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                  {language === 'ar' ? 'الأستاذ المشرف:' : 'Supervising Teacher:'}
                </label>
                <select
                  value={coveringTeacherId}
                  onChange={(e) => setCoveringTeacherId(e.target.value)}
                  className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all cursor-pointer"
                  required
                >
                  {teachers && teachers.length > 0 ? (
                    teachers.map((teach) => (
                      <option key={teach.id} value={teach.id}>
                        {teach.fullNameAr} {((teach as any).specialty || (teach as any).subject) ? `(${((teach as any).specialty || (teach as any).subject)})` : ''}
                      </option>
                    ))
                  ) : (
                    <option value="">{language === 'ar' ? 'لا يوجد معلمون متاحون' : 'No teachers available'}</option>
                  )}
                </select>
              </div>

              {/* Covering Session Type Radio Selector Cards */}
              <div className="flex flex-col gap-2 pt-1">
                <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                  {language === 'ar' ? 'نوع الحصة الاستدراكية (Session Type):' : 'Covering Session Type:'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Type 1: Counted */}
                  <div
                    onClick={() => setCoveringType('counted')}
                    className={`rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      coveringType === 'counted'
                        ? 'border-amber-500 bg-amber-500/10 dark:bg-amber-500/15 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                    style={{ padding: '14px 18px' }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-4 h-4 rounded-full border-2 border-amber-500 flex items-center justify-center shrink-0">
                        {coveringType === 'counted' && <span className="w-2 h-2 rounded-full bg-amber-500" />}
                      </span>
                      <span className="font-bold text-xs sm:text-sm text-amber-950 dark:text-amber-100">
                        {language === 'ar' ? 'حصة محسوبة (Counted)' : 'Counted Session'}
                      </span>
                    </div>
                  </div>

                  {/* Type 2: Not Counted */}
                  <div
                    onClick={() => setCoveringType('not_counted')}
                    className={`rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      coveringType === 'not_counted'
                        ? 'border-purple-500 bg-purple-500/10 dark:bg-purple-500/15 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                    style={{ padding: '14px 18px' }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-4 h-4 rounded-full border-2 border-purple-500 flex items-center justify-center shrink-0">
                        {coveringType === 'not_counted' && <span className="w-2 h-2 rounded-full bg-purple-500" />}
                      </span>
                      <span className="font-bold text-xs sm:text-sm text-purple-950 dark:text-purple-100">
                        {language === 'ar' ? 'غير محسوبة (Extra)' : 'Not Counted (Extra)'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reason / Notes */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
                  {language === 'ar' ? 'سبب الاستدراك وملاحظات (اختياري):' : 'Covering Reason / Notes (optional):'}
                </label>
                <input
                  type="text"
                  value={coveringReason}
                  onChange={(e) => setCoveringReason(e.target.value)}
                  placeholder={language === 'ar' ? 'مثال: تعويض حصة يوم الأربعاء الفائتة بسبب عطلة رسمية...' : 'e.g. Compensation for missed holiday session...'}
                  className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 mt-2">
                <button
                  type="button"
                  onClick={() => setIsCoveringModalOpen(false)}
                  className="rounded-xl text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                  style={{ padding: '10px 20px' }}
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-98 text-slate-950 text-xs sm:text-sm font-black shadow-md shadow-amber-500/20 cursor-pointer flex items-center gap-2 transition-all"
                  style={{ padding: '10px 24px' }}
                >
                  <CalendarPlus size={17} className="stroke-[2.5]" />
                  <span>{language === 'ar' ? 'حفظ وتثبيت الحصة الاستدراكية' : 'Save Covering Session'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
