'use client';

import React, { useState } from 'react';
import {
  BookCheck,
  Award,
  MessageSquareQuote,
  Plus,
  Sparkles,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Bell,
  ChevronDown,
  User,
  School,
  X,
  Send,
  Clock,
  Globe,
  Hash,
  Users,
  Trash2,
  Pencil,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useLanguage } from '@/context/LanguageContext';
import { SearchableSelect } from '@/components/common/SearchableSelect';

export function AdminPerformanceScreen() {
  const {
    visibleHomework,
    visibleAssessments,
    visibleStudents,
    visibleGroups,
    groups,
    feedbackList,
    createHomework,
    updateHomework,
    deleteHomework,
    evaluateHomework,
    batchEvaluateHomework,
    recordAssessment,
    addTeacherFeedback,
    currentAdmin,
    students,
  } = useAdmin();
  const { isRTL, language } = useLanguage();

  const getCleanGroupScheduleStr = (grp?: any) => {
    if (!grp) return '06:00 PM';
    if (grp.schedules && grp.schedules.length > 0) {
      const days = grp.schedules.map((s: any) => s.day).join(' + ');
      const times = grp.schedules.map((s: any) => {
        let t = (s.time || '06:00').trim();
        const p = s.period || 'PM';
        if (!/(AM|PM)/i.test(t)) t = `${t} ${p}`;
        return t.toUpperCase();
      });
      const uniqueTime = Array.from(new Set(times)).join(' / ');
      return `${days} • ${uniqueTime}`;
    }
    const days = grp.daysAr ? grp.daysAr.trim() : '';
    let timeStr = grp.startTime ? grp.startTime.trim() : '06:00 PM';
    const match = timeStr.match(/(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?)/i);
    if (match) {
      let t = match[1].trim();
      if (!/(AM|PM)/i.test(t)) t = `${t} PM`;
      timeStr = t.toUpperCase();
    }
    return days ? `${days} • ${timeStr}` : timeStr;
  };

  const [activeSubTab, setActiveSubTab] = useState<'homework' | 'assessments' | 'feedback'>('homework');

  // Create Homework Modal State
  const [isAddHomeworkOpen, setIsAddHomeworkOpen] = useState(false);
  const [newHwTitleAr, setNewHwTitleAr] = useState('');
  const [newHwDescAr, setNewHwDescAr] = useState('');
  const [newHwNoteAr, setNewHwNoteAr] = useState('');
  const [newHwDueDate, setNewHwDueDate] = useState(new Date(Date.now() + 7 * 86400000).toISOString().substring(0, 10));
  const [newHwGroupId, setNewHwGroupId] = useState(visibleGroups[0]?.id || 'grp-a2-03');
  const [newHwScore, setNewHwScore] = useState(20);

  // Edit Homework Modal State
  const [editingHw, setEditingHw] = useState<any | null>(null);
  const [editHwTitleAr, setEditHwTitleAr] = useState('');
  const [editHwDescAr, setEditHwDescAr] = useState('');
  const [editHwNoteAr, setEditHwNoteAr] = useState('');
  const [editHwDueDate, setEditHwDueDate] = useState('');
  const [editHwGroupId, setEditHwGroupId] = useState('');
  const [editHwScore, setEditHwScore] = useState(20);

  const openEditHomeworkModal = (hw: any) => {
    setEditingHw(hw);
    setEditHwTitleAr(hw.assignmentNameAr || '');
    setEditHwDescAr(hw.descriptionAr || '');
    setEditHwNoteAr(hw.teacherNote || '');
    setEditHwDueDate(hw.dueDate || '');
    setEditHwGroupId(hw.groupId || visibleGroups[0]?.id || '');
    setEditHwScore(hw.totalScore || 20);
  };

  const handleSaveEditHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHw || !editHwTitleAr.trim()) return;

    const targetGrp = groups.find((g) => g.id === editHwGroupId);

    updateHomework(editingHw.id, {
      assignmentNameAr: editHwTitleAr.trim(),
      assignmentNameEn: editHwTitleAr.trim(),
      descriptionAr: editHwDescAr.trim(),
      descriptionEn: editHwDescAr.trim(),
      teacherNote: editHwNoteAr.trim(),
      dueDate: editHwDueDate,
      groupId: editHwGroupId,
      groupName: targetGrp?.name || editingHw.groupName,
      totalScore: Number(editHwScore),
    });

    setEditingHw(null);
  };

  // Group Homework Evaluation Modal State
  const [selectedHwToGrade, setSelectedHwToGrade] = useState<any | null>(null);
  const [hwToDelete, setHwToDelete] = useState<{ id: string; name: string } | null>(null);
  const [groupEvalsDraft, setGroupEvalsDraft] = useState<{
    studentId: string;
    studentNameAr: string;
    score: number;
    teacherComment: string;
    completionStatus: 'completed' | 'needs_revision' | 'pending';
  }[]>([]);

  // Dynamically resolve only the students belonging to THIS homework's assigned group (strictly isolated per group)
  const getHomeworkEvaluations = (hw: any) => {
    const grp =
      visibleGroups.find((g) => g.id === hw.groupId) ||
      groups.find((g) => g.id === hw.groupId) ||
      visibleGroups.find((g) => g.name === hw.groupName) ||
      groups.find((g) => g.name === hw.groupName);

    // Filter students belonging to this homework / group (excluding Dalila)
    const groupStudents = students.filter((s) => {
      if (s.fullNameAr?.includes('دليلة') || s.fullNameEn?.toLowerCase().includes('dalila')) {
        return false;
      }
      if (!s.groupId || s.groupId === '' || s.groupName === 'بدون فوج' || s.groupName === 'No Group') return false;
      if (hw.groupId && s.groupId === hw.groupId) return true;
      if (grp?.id && s.groupId === grp.id) return true;
      if (grp?.studentIds && Array.isArray(grp.studentIds) && grp.studentIds.includes(s.id)) return true;
      if (hw.studentIds && Array.isArray(hw.studentIds) && hw.studentIds.includes(s.id)) return true;
      if (hw.evaluations && Array.isArray(hw.evaluations) && hw.evaluations.some((e: any) => e.studentId === s.id)) return true;
      if (grp?.name && s.groupName && s.groupName.trim().toLowerCase() === grp.name.trim().toLowerCase()) return true;
      if (hw.groupName && s.groupName && s.groupName.trim().toLowerCase() === hw.groupName.trim().toLowerCase()) return true;
      return false;
    });

    return groupStudents.map((s) => {
      const existing = (hw.evaluations || []).find((e: any) => e.studentId === s.id);
      return {
        studentId: s.id,
        studentNameAr: s.fullNameAr || existing?.studentNameAr || '',
        studentNameEn: s.fullNameEn || '',
        score: existing?.score,
        teacherComment: existing?.teacherComment,
        completionStatus: existing?.completionStatus || (existing?.score !== undefined ? 'completed' : 'pending'),
      };
    });
  };

  const openGradeGroupModal = (hw: any) => {
    setSelectedHwToGrade(hw);
    const resolvedList = getHomeworkEvaluations(hw);

    const evals = resolvedList.map((ev) => ({
      studentId: ev.studentId,
      studentNameAr: ev.studentNameAr,
      score:
        ev.score !== undefined
          ? ev.score
          : (hw.totalScore || 20) >= 20
          ? 18
          : Math.round((hw.totalScore || 20) * 0.9),
      teacherComment:
        ev.teacherComment ||
        (language === 'ar' ? 'أداء ممتاز وعمل متقن!' : 'Excellent work!'),
      completionStatus: (ev.completionStatus as any) === 'pending' ? 'completed' : (ev.completionStatus as any) || 'completed',
    }));

    setGroupEvalsDraft(evals);
  };

  const handleSaveGroupEvaluations = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHwToGrade) return;

    batchEvaluateHomework(selectedHwToGrade.id, groupEvalsDraft);
    setSelectedHwToGrade(null);
  };

  // Record Assessment Modal State
  const [isAddAssessmentOpen, setIsAddAssessmentOpen] = useState(false);
  const [asmStudentId, setAsmStudentId] = useState(visibleStudents[0]?.id || 'stu-01');
  const [asmType, setAsmType] = useState<'periodic' | 'midterm' | 'final' | 'placement'>('periodic');
  const [asmListening, setAsmListening] = useState(0);
  const [asmSpeaking, setAsmSpeaking] = useState(0);
  const [asmReading, setAsmReading] = useState(0);
  const [asmWriting, setAsmWriting] = useState(0);
  const [asmComment, setAsmComment] = useState('تقييم المهارات الدورية للطالب.');

  const openAddAssessment = (studentId?: string) => {
    const targetId = studentId || asmStudentId || visibleStudents[0]?.id || '';
    const st = visibleStudents.find((s) => s.id === targetId);
    setAsmStudentId(targetId);
    setAsmListening(st?.skills?.listening || 0);
    setAsmSpeaking(st?.skills?.speaking || 0);
    setAsmReading(st?.skills?.reading || 0);
    setAsmWriting(st?.skills?.writing || 0);
    setIsAddAssessmentOpen(true);
  };

  const handleAsmStudentChange = (id: string) => {
    setAsmStudentId(id);
    const st = visibleStudents.find((s) => s.id === id);
    if (st) {
      setAsmListening(st.skills?.listening || 0);
      setAsmSpeaking(st.skills?.speaking || 0);
      setAsmReading(st.skills?.reading || 0);
      setAsmWriting(st.skills?.writing || 0);
    }
  };

  // Teacher Feedback Modal State
  const [isAddFeedbackOpen, setIsAddFeedbackOpen] = useState(false);
  const [fbStudentId, setFbStudentId] = useState(visibleStudents[0]?.id || 'stu-01');
  const [fbStrengths, setFbStrengths] = useState('Good pronunciation, Active in class');
  const [fbNeedsImprovement, setFbNeedsImprovement] = useState('Spontaneous dialogue fluency');
  const [fbRecommendation, setFbRecommendation] = useState('Practice speaking 10 minutes daily at home.');
  const [fbComments, setFbComments] = useState('الطالب متفاعل وملتزم بالحضور والواجبات.');

  const handleCreateHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHwTitleAr) return;

    const grp =
      visibleGroups.find((g) => g.id === newHwGroupId) ||
      groups.find((g) => g.id === newHwGroupId);
    const groupStudents = students.filter(
      (s) =>
        !s.fullNameAr?.includes('دليلة') &&
        !s.fullNameEn?.toLowerCase().includes('dalila') &&
        ((grp?.id && s.groupId === grp.id) ||
          (grp?.studentIds && grp.studentIds.includes(s.id)))
    );

    createHomework({
      assignmentNameAr: newHwTitleAr,
      assignmentNameEn: newHwTitleAr,
      descriptionAr: newHwDescAr,
      descriptionEn: newHwDescAr,
      teacherNote: newHwNoteAr,
      dueDate: newHwDueDate,
      groupId: grp?.id,
      groupName: grp?.name,
      totalScore: Number(newHwScore),
      studentIds: groupStudents.map((s) => s.id),
    });

    setNewHwTitleAr('');
    setNewHwDescAr('');
    setNewHwNoteAr('');
    setIsAddHomeworkOpen(false);
  };

  const handleCreateAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    const st = visibleStudents.find((s) => s.id === asmStudentId) || visibleStudents[0];
    const overall = Math.round((Number(asmListening) + Number(asmSpeaking) + Number(asmReading) + Number(asmWriting)) / 4);

    recordAssessment({
      studentId: st?.id,
      studentNameAr: st?.fullNameAr,
      studentNameEn: st?.fullNameEn,
      groupId: st?.groupId,
      groupName: st?.groupName,
      level: st?.cefrLevel,
      assessmentType: asmType,
      scores: {
        listening: Number(asmListening),
        speaking: Number(asmSpeaking),
        reading: Number(asmReading),
        writing: Number(asmWriting),
        overall,
      },
      gradeLetterAr: overall >= 90 ? 'ممتاز (A+)' : overall >= 80 ? 'جيد جداً (B+)' : 'مقبول (C)',
      gradeLetterEn: overall >= 90 ? 'A+ (Distinction)' : overall >= 80 ? 'B+ (Very Good)' : 'C (Pass)',
      teacherComment: asmComment,
    });

    setIsAddAssessmentOpen(false);
  };

  const handleCreateFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    addTeacherFeedback(fbStudentId, {
      strengths: fbStrengths.split(',').map((s) => s.trim()),
      needsImprovement: fbNeedsImprovement.split(',').map((s) => s.trim()),
      recommendations: fbRecommendation,
      generalComments: fbComments,
    });

    setIsAddFeedbackOpen(false);
  };

  return (
    <div className={`w-full select-none ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        style={{ marginBottom: '20px' }}
      >
        <div>
          <span className="text-xs font-bold text-slate-400">
            {language === 'ar' ? 'التقييم الأكاديمي والواجبات والتوجيه التربوي' : 'Performance, Assessments & Feedback'}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5 tracking-tight">
            {language === 'ar' ? 'الأداء والتقييمات (Performance Module)' : 'Performance Management'}
          </h2>
        </div>

        {/* Dynamic Action Button according to active sub-tab */}
        {activeSubTab === 'homework' && (
          <button
            type="button"
            onClick={() => setIsAddHomeworkOpen(true)}
            className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0 whitespace-nowrap"
            style={{ padding: '8px 20px', gap: '8px', minHeight: '38px' }}
          >
            <Plus size={15} />
            <span>{language === 'ar' ? 'إسناد واجب جديد' : 'Create Homework'}</span>
          </button>
        )}

        {activeSubTab === 'assessments' && (
          <button
            type="button"
            onClick={() => openAddAssessment()}
            className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0 whitespace-nowrap"
            style={{ padding: '8px 20px', gap: '8px', minHeight: '38px' }}
          >
            <Plus size={15} />
            <span>{language === 'ar' ? 'رصد تقييم مهارات جديد' : 'Record 4-Skill Assessment'}</span>
          </button>
        )}

        {activeSubTab === 'feedback' && (
          <button
            type="button"
            onClick={() => setIsAddFeedbackOpen(true)}
            className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0 whitespace-nowrap"
            style={{ padding: '8px 20px', gap: '8px', minHeight: '38px' }}
          >
            <Plus size={15} />
            <span>{language === 'ar' ? 'إرسال توجيه تربوي لولي الأمر' : 'Send Teacher Feedback'}</span>
          </button>
        )}
      </div>

      {/* 3-Part Navigation Bar */}
      <div
        className="flex items-center bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-2xs overflow-x-auto"
        style={{
          padding: '4px 6px',
          gap: '6px',
          marginBottom: '24px',
          minHeight: '44px',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveSubTab('homework')}
          className={`flex-1 rounded-xl font-bold text-xs flex items-center justify-center transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeSubTab === 'homework'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          style={{ height: '36px', padding: '0 16px', gap: '6px' }}
        >
          <BookCheck size={15} className="shrink-0" />
          <span>{language === 'ar' ? 'الواجبات المنزلية' : 'Homework'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('assessments')}
          className={`flex-1 rounded-xl font-bold text-xs flex items-center justify-center transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeSubTab === 'assessments'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          style={{ height: '36px', padding: '0 16px', gap: '6px' }}
        >
          <Award size={15} className="shrink-0" />
          <span>{language === 'ar' ? 'تقييم المهارات' : 'Skill Assessments'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('feedback')}
          className={`flex-1 rounded-xl font-bold text-xs flex items-center justify-center transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeSubTab === 'feedback'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          style={{ height: '36px', padding: '0 16px', gap: '6px' }}
        >
          <MessageSquareQuote size={15} className="shrink-0" />
          <span>{language === 'ar' ? 'التوجيهات التربوية' : 'Teacher Guidance'}</span>
        </button>
      </div>

      {/* SUB-TAB 1: Homework (Section 23, 24, 25) */}
      {activeSubTab === 'homework' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {visibleHomework.map((hw) => {
            const grp =
              visibleGroups.find((g) => g.id === hw.groupId) ||
              groups.find((g) => g.id === hw.groupId) ||
              visibleGroups.find((g) => g.name === hw.groupName) ||
              groups.find((g) => g.name === hw.groupName);
            const groupName = grp?.name || hw.groupName;
            const displayGroupId =
              grp?.code && grp.code.trim() && !grp.code.startsWith('grp-')
                ? grp.code.trim()
                : grp?.code || hw.groupId?.replace('grp-', '') || '3927';
            const groupLanguage = grp?.language || 'English';
            const groupTiming = getCleanGroupScheduleStr(grp);

            return (
              <div
                key={hw.id}
                className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-2xs"
                style={{ padding: '18px 22px' }}
              >
                {/* Header Row */}
                <div
                  className="flex flex-col gap-3.5 border-b border-slate-100 dark:border-slate-800"
                  style={{ paddingBottom: '16px', marginBottom: '16px' }}
                >
                  {/* Top Badges & Remove Button Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2.5">
                    {/* Group Meta Info Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* 1. Group Name */}
                      <span
                        className="inline-flex items-center gap-1.5 rounded-lg bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 font-black text-xs border border-purple-200/60 dark:border-purple-800/60 shadow-2xs whitespace-nowrap"
                        style={{ height: '28px', padding: '0 12px' }}
                      >
                        <Users size={13} className="shrink-0 text-purple-600 dark:text-purple-400" />
                        <span>{groupName}</span>
                      </span>

                      {/* 2. Group ID (Clean short code e.g. 3925) */}
                      {displayGroupId && (
                        <span
                          className="inline-flex items-center justify-center rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-300 font-mono font-black text-xs border border-amber-400/40 shadow-2xs whitespace-nowrap"
                          style={{ height: '28px', padding: '0 12px' }}
                          title="Group ID"
                        >
                          <span>{displayGroupId}</span>
                        </span>
                      )}

                      {/* 3. Language */}
                      <span
                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold text-xs border border-blue-200/60 dark:border-blue-800/60 shadow-2xs whitespace-nowrap"
                        style={{ height: '28px', padding: '0 10px' }}
                      >
                        <Globe size={13} className="shrink-0 text-blue-600 dark:text-blue-400" />
                        <span>
                          {groupLanguage === 'French'
                            ? (language === 'ar' ? 'اللغة الفرنسية' : 'French')
                            : groupLanguage === 'Dual'
                            ? (language === 'ar' ? 'مسار مزدوج' : 'Dual Track')
                            : (language === 'ar' ? 'اللغة الإنجليزية' : 'English')}
                        </span>
                      </span>

                      {/* 4. Timing */}
                      <span
                        className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 font-bold text-xs border border-amber-200/60 dark:border-amber-800/50 shadow-2xs whitespace-nowrap"
                        style={{ height: '28px', padding: '0 10px' }}
                      >
                        <Clock size={13} className="shrink-0 text-amber-600 dark:text-amber-400" />
                        <span dir="ltr" className="font-mono text-[11px] font-semibold">{groupTiming}</span>
                      </span>
                    </div>

                    {/* Top Actions: Edit + Remove */}
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Edit Homework Button */}
                      <button
                        type="button"
                        onClick={() => openEditHomeworkModal(hw)}
                        className="rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 font-bold text-xs border border-blue-200/70 dark:border-blue-800/60 shadow-2xs hover:scale-102 active:scale-98 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap"
                        style={{ height: '28px', padding: '0 12px' }}
                        title={language === 'ar' ? 'تعديل الواجب' : 'Edit Homework'}
                      >
                        <Pencil size={12} className="shrink-0 text-blue-500" />
                        <span>{language === 'ar' ? 'تعديل' : 'Edit'}</span>
                      </button>

                      {/* Remove Homework Button */}
                      <button
                        type="button"
                        onClick={() => setHwToDelete({ id: hw.id, name: hw.assignmentNameAr })}
                        className="rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 font-bold text-xs border border-rose-200/70 dark:border-rose-800/60 shadow-2xs hover:scale-102 active:scale-98 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap"
                        style={{ height: '28px', padding: '0 12px' }}
                        title={language === 'ar' ? 'حذف الواجب' : 'Delete Homework'}
                      >
                        <Trash2 size={13} className="shrink-0 text-rose-500" />
                        <span>{language === 'ar' ? 'حذف' : 'Remove'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
                    <div className="space-y-1">
                      <h4 className="font-black text-base sm:text-lg text-slate-900 dark:text-white leading-tight">
                        {hw.assignmentNameAr}
                      </h4>

                      {hw.descriptionAr && (
                        <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-2xl">
                          {hw.descriptionAr}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <span
                      className="rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center shadow-2xs whitespace-nowrap"
                      style={{ height: '34px', padding: '0 14px', gap: '8px' }}
                    >
                      <Calendar size={14} className="text-purple-600 shrink-0" />
                      <span className="flex items-center gap-1.5">
                        <span>{language === 'ar' ? 'تاريخ الاستحقاق:' : 'Due Date:'}</span>
                        <span dir="ltr" className="font-mono font-bold">{hw.dueDate}</span>
                      </span>
                    </span>
                    <span
                      className="rounded-xl bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 font-bold text-xs border border-purple-200/60 dark:border-purple-800/60 flex items-center shadow-2xs whitespace-nowrap"
                      style={{ height: '34px', padding: '0 14px', gap: '8px' }}
                    >
                      <Award size={14} className="text-purple-600 dark:text-purple-400 shrink-0" />
                      <span className="flex items-center gap-1.5">
                        <span>{language === 'ar' ? 'الدرجة القصوى:' : 'Max Score:'}</span>
                        <span dir="ltr" className="font-mono font-black">{hw.totalScore}</span>
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => openGradeGroupModal(hw)}
                      className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 hover:scale-102 active:scale-98 transition-all cursor-pointer flex items-center shrink-0 whitespace-nowrap"
                      style={{ height: '34px', padding: '0 16px', gap: '8px' }}
                    >
                      <CheckCircle2 size={15} className="shrink-0" />
                      <span>{language === 'ar' ? 'تصحيح وتقييم الفوج' : 'Grade Group'}</span>
                    </button>
                    </div>
                  </div>
                </div>

              {/* Teacher Note Callout (Section 23 in PDF) */}
              {hw.teacherNote && (
                <div
                  className="rounded-xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200/90 dark:border-amber-800/70 space-y-1.5 text-xs"
                  style={{ padding: '12px 16px', marginBottom: '16px' }}
                >
                  <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300">
                    <MessageSquareQuote size={15} />
                    <span className="text-xs font-black">{language === 'ar' ? 'توجيه وملاحظة المعلم:' : 'Teacher Note & Instruction:'}</span>
                  </div>
                  <p className="text-slate-800 dark:text-amber-100 font-medium leading-relaxed italic pr-1">
                    "{hw.teacherNote}"
                  </p>
                </div>
              )}

              {/* Submissions & Evaluations Table (Section 25) */}
              <div style={{ paddingTop: '4px' }}>
                <div className="flex items-center justify-between gap-2" style={{ marginBottom: '10px' }}>
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                    {language === 'ar' ? 'تسليمات وتقييمات الطلاب:' : 'Student Submissions & Evaluations:'}
                  </span>
                  <button
                    type="button"
                    onClick={() => openGradeGroupModal(hw)}
                    className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>{language === 'ar' ? 'فتح جدول التقييم الكامل' : 'Open Full Grading Sheet'}</span>
                    <span>←</span>
                  </button>
                </div>
                {getHomeworkEvaluations(hw).length === 0 ? (
                  <div className="rounded-xl bg-slate-50/50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 p-4 text-center text-xs text-slate-400 font-bold">
                    {language === 'ar'
                      ? 'لا يوجد طلاب مسجلين في هذا الفوج حالياً'
                      : 'No students enrolled in this group yet'}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {getHomeworkEvaluations(hw).map((ev, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl bg-slate-50/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 flex items-center justify-between gap-3 shadow-2xs hover:border-purple-300 dark:hover:border-purple-700/60 hover:shadow-xs transition-all"
                        style={{ padding: '12px 14px' }}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/70 border border-purple-200/60 dark:border-purple-800/60 text-purple-700 dark:text-purple-300 font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                            {ev.studentNameAr.slice(0, 1) || 'ط'}
                          </div>
                          <div className="min-w-0">
                            <div className="font-black text-xs sm:text-sm text-slate-900 dark:text-white leading-snug truncate">
                              {ev.studentNameAr}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {ev.score !== undefined ? (
                                <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50">
                                  <CheckCircle2 size={11} className="text-emerald-600 dark:text-emerald-400" />
                                  <span dir="ltr" className="font-mono font-black">{ev.score} / {hw.totalScore}</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/50">
                                  <Clock size={11} className="text-amber-500" />
                                  <span>{language === 'ar' ? 'لم يتم التصحيح' : 'Not graded'}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => openGradeGroupModal(hw)}
                          className={`rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-2xs hover:scale-102 active:scale-98 transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                            ev.score !== undefined
                              ? 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                              : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/20 shadow-sm'
                          }`}
                          style={{ padding: '7px 14px' }}
                        >
                          <CheckCircle2 size={13} className="shrink-0" />
                          <span>
                            {ev.score !== undefined
                              ? (language === 'ar' ? 'تعديل' : 'Edit')
                              : (language === 'ar' ? 'تصحيح' : 'Grade')}
                          </span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    )}

      {/* SUB-TAB 2: Assessments & 4 Skills (Section 27, 28, 29) */}
      {activeSubTab === 'assessments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visibleAssessments.map((asm) => (
              <div
                key={asm.id}
                className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-2xs"
                style={{ padding: '18px 22px' }}
              >
                <div
                  className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800"
                  style={{ paddingBottom: '14px', marginBottom: '14px' }}
                >
                  <div>
                    <h4 className="font-black text-base text-slate-900 dark:text-white">{asm.studentNameAr}</h4>
                    <span className="text-xs text-slate-400 mt-0.5 block font-medium">{asm.groupName} • {asm.level}</span>
                  </div>
                  <span className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/60 dark:border-indigo-800/60 font-bold text-indigo-700 dark:text-indigo-300 text-xs shadow-2xs flex items-center gap-1.5">
                    <span dir="ltr" className="font-mono font-black">{asm.scores.overall}%</span>
                    <span>({asm.gradeLetterAr})</span>
                  </span>
                </div>

                {/* 4 Skills Radar (Listening, Speaking, Reading, Writing - Section 27) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs" style={{ marginBottom: '16px' }}>
                  <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 rounded-xl" style={{ padding: '10px 8px' }}>
                    <span className="text-[10px] text-slate-400 block font-bold mb-1">{language === 'ar' ? 'الاستماع' : 'Listening'}</span>
                    <span className="font-mono font-black text-blue-600 dark:text-blue-400 text-base">{asm.scores.listening}%</span>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 rounded-xl" style={{ padding: '10px 8px' }}>
                    <span className="text-[10px] text-slate-400 block font-bold mb-1">{language === 'ar' ? 'المحادثة' : 'Speaking'}</span>
                    <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-base">{asm.scores.speaking}%</span>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/40 rounded-xl" style={{ padding: '10px 8px' }}>
                    <span className="text-[10px] text-slate-400 block font-bold mb-1">{language === 'ar' ? 'القراءة' : 'Reading'}</span>
                    <span className="font-mono font-black text-purple-600 dark:text-purple-400 text-base">{asm.scores.reading}%</span>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/40 rounded-xl" style={{ padding: '10px 8px' }}>
                    <span className="text-[10px] text-slate-400 block font-bold mb-1">{language === 'ar' ? 'الكتابة' : 'Writing'}</span>
                    <span className="font-mono font-black text-amber-600 dark:text-amber-400 text-base">{asm.scores.writing}%</span>
                  </div>
                </div>

                {asm.teacherComment && (
                  <p
                    className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed bg-slate-50/90 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 rounded-xl italic"
                    style={{ padding: '12px 16px' }}
                  >
                    "{asm.teacherComment}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Teacher Feedback & Parent Comments (Section 26, 30) */}
      {activeSubTab === 'feedback' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {feedbackList.map((fb) => (
            <div
              key={fb.id}
              className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-2xs"
              style={{ padding: '18px 22px' }}
            >
              <div
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100 dark:border-slate-800"
                style={{ paddingBottom: '14px', marginBottom: '14px' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-black text-xs shadow-2xs">
                    {fb.studentNameAr[0]}
                  </div>
                  <div>
                    <h4 className="font-black text-sm sm:text-base text-slate-900 dark:text-white leading-snug">{fb.studentNameAr}</h4>
                    <span className="text-[11px] text-slate-400 font-medium">{language === 'ar' ? 'ولي الأمر:' : 'Parent:'} {fb.parentName}</span>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 font-mono font-bold bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg w-fit">{fb.date}</span>
              </div>

              {/* Two-Way Stream (Section 26: Teacher Feedback & Parent Feedback) */}
              <div className="space-y-3 text-xs">
                {/* Teacher Side */}
                <div
                  className="bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-200/60 dark:border-emerald-800/40 space-y-2"
                  style={{ padding: '14px 18px' }}
                >
                  <span className="font-bold text-emerald-800 dark:text-emerald-300 block text-xs sm:text-sm">
                    {language === 'ar' ? `توجيه المعلم (${fb.teacherName}):` : `Teacher Guidance (${fb.teacherName}):`}
                  </span>
                  <div className="space-y-1.5 text-slate-700 dark:text-slate-300 leading-relaxed text-xs">
                    <div>• <span className="font-bold">{language === 'ar' ? 'نقاط القوة:' : 'Strengths:'}</span> {fb.teacherFeedback.strengths.join(', ')}</div>
                    <div>• <span className="font-bold">{language === 'ar' ? 'بحاجة لتطوير:' : 'Needs Improvement:'}</span> {fb.teacherFeedback.needsImprovement.join(', ')}</div>
                    <div>• <span className="font-bold">{language === 'ar' ? 'توصية للمنزل:' : 'Home Recommendation:'}</span> "{fb.teacherFeedback.recommendations}"</div>
                  </div>
                </div>

                {/* Parent Response */}
                {fb.parentFeedback && (
                  <div
                    className="bg-purple-50/60 dark:bg-purple-950/30 rounded-xl border border-purple-200/60 dark:border-purple-800/40 space-y-1.5"
                    style={{ padding: '14px 18px' }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple-800 dark:text-purple-300 text-xs sm:text-sm">
                        {language === 'ar' ? `رد وملاحظة ولي الأمر (${fb.parentName}):` : `Parent Note (${fb.parentName}):`}
                      </span>
                      <span className="font-mono text-[11px] font-bold text-purple-600 dark:text-purple-400">{fb.parentFeedback.date}</span>
                    </div>
                    <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed italic text-xs">
                      "{fb.parentFeedback.message}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create Homework (Section 23) */}
      {isAddHomeworkOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div
            className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl border border-slate-200 dark:border-slate-800 animate-fade-in-up my-6 overflow-hidden"
            style={{ padding: '24px 28px' }}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <h3 className="font-black text-lg sm:text-xl text-slate-900 dark:text-white tracking-tight">
                {language === 'ar' ? 'إسناد واجب منزلي جديد' : 'Assign New Homework'}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddHomeworkOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateHomework} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-700 dark:text-slate-300 font-bold text-xs">
                  {language === 'ar' ? 'الفوج المستهدف *' : 'Target Class Group *'}
                </label>
                <SearchableSelect
                  options={visibleGroups.map((g) => ({
                    value: g.id,
                    label: `${g.name} (${g.code || '3925'}) • ${g.language}`,
                    subLabel: getCleanGroupScheduleStr(g),
                  }))}
                  value={newHwGroupId}
                  onChange={(val) => setNewHwGroupId(val)}
                  themeColor="purple"
                  placeholder={language === 'ar' ? 'اختر الفوج...' : 'Select class group...'}
                  searchPlaceholder={language === 'ar' ? 'ابحث عن اسم أو رمز الفوج...' : 'Search group by name or code...'}
                  emptyText={language === 'ar' ? 'لا يوجد فوج بهذا الاسم' : 'No matching groups found'}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-700 dark:text-slate-300 font-bold text-xs">
                  {language === 'ar' ? 'عنوان الواجب *' : 'Homework Title *'}
                </label>
                <input
                  type="text"
                  dir="auto"
                  required
                  value={newHwTitleAr}
                  onChange={(e) => setNewHwTitleAr(e.target.value)}
                  placeholder={language === 'ar' ? 'مثال: واجب الماضي البسيط: تمارين الأفعال الشاذة' : 'e.g. Past Simple: Irregular verbs exercises'}
                  style={{ paddingLeft: '16px', paddingRight: '16px' }}
                  className="w-full h-11 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-700 dark:text-slate-300 font-bold text-xs">
                  {language === 'ar' ? 'تفاصيل التمرين والتعليمات' : 'Exercise Details & Instructions'}
                </label>
                <textarea
                  rows={2}
                  dir="auto"
                  value={newHwDescAr}
                  onChange={(e) => setNewHwDescAr(e.target.value)}
                  placeholder={language === 'ar' ? 'حل التمارين من 1 إلى 5 وتسجيل المقطع الصوتي...' : 'Instructions...'}
                  style={{ padding: '12px 16px' }}
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed resize-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-700 dark:text-slate-300 font-bold text-xs">
                  {language === 'ar' ? 'ملاحظة وتوجيه المعلم للواجب' : 'Teacher Guidance Note'}
                </label>
                <input
                  type="text"
                  dir="auto"
                  value={newHwNoteAr}
                  onChange={(e) => setNewHwNoteAr(e.target.value)}
                  placeholder={language === 'ar' ? 'ملاحظات إضافية...' : 'Review exercises before next session'}
                  style={{ paddingLeft: '16px', paddingRight: '16px' }}
                  className="w-full h-11 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-700 dark:text-slate-300 font-bold text-xs">
                    {language === 'ar' ? 'آخر موعد للتسليم' : 'Due Date'}
                  </label>
                  <input
                    type="date"
                    dir="ltr"
                    value={newHwDueDate}
                    onChange={(e) => setNewHwDueDate(e.target.value)}
                    style={{ paddingLeft: '16px', paddingRight: '16px' }}
                    className="w-full h-11 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-700 dark:text-slate-300 font-bold text-xs">
                    {language === 'ar' ? 'الدرجة القصوى' : 'Max Score'}
                  </label>
                  <input
                    type="number"
                    dir="ltr"
                    value={newHwScore}
                    onChange={(e) => setNewHwScore(Number(e.target.value))}
                    min={10}
                    max={100}
                    style={{ paddingLeft: '16px', paddingRight: '16px' }}
                    className="w-full h-11 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-12 bg-purple-600 hover:bg-purple-700 active:scale-98 text-white font-black rounded-xl shadow-md shadow-purple-600/20 transition-all cursor-pointer text-sm flex items-center justify-center gap-2"
                >
                  <span>{language === 'ar' ? 'إسناد وإشعار أولياء الأمور' : 'Assign & Notify Parents'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Homework Assignment */}
      {editingHw && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in select-none">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-scale-in">
            {/* Modal Header */}
            <div
              className="bg-slate-900 text-white flex items-center justify-between"
              style={{ padding: '20px 24px' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black shadow-md shadow-blue-500/20">
                  <Pencil size={18} />
                </div>
                <div>
                  <h3 className="font-black text-lg text-white">
                    {language === 'ar' ? 'تعديل بيانات الواجب المنزلي' : 'Edit Homework Assignment'}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    {language === 'ar' ? 'تحديث العنوان أو التعليمات أو تاريخ التسليم' : 'Update assignment details & due date'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingHw(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveEditHomework} className="space-y-4" style={{ padding: '24px' }}>
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-700 dark:text-slate-300 font-bold text-xs">
                  {language === 'ar' ? 'الفوج المسند إليه *' : 'Assigned Class Group *'}
                </label>
                <SearchableSelect
                  options={visibleGroups.map((g) => ({
                    value: g.id,
                    label: `${g.name} (${g.code || '3925'}) • ${g.language}`,
                    subLabel: getCleanGroupScheduleStr(g),
                  }))}
                  value={editHwGroupId}
                  onChange={(val) => setEditHwGroupId(val)}
                  themeColor="blue"
                  placeholder={language === 'ar' ? 'اختر الفوج...' : 'Select class group...'}
                  searchPlaceholder={language === 'ar' ? 'ابحث عن اسم أو رمز الفوج...' : 'Search group by name or code...'}
                  emptyText={language === 'ar' ? 'لا يوجد فوج بهذا الاسم' : 'No matching groups found'}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-700 dark:text-slate-300 font-bold text-xs">
                  {language === 'ar' ? 'عنوان الواجب *' : 'Homework Title *'}
                </label>
                <input
                  type="text"
                  dir="auto"
                  required
                  value={editHwTitleAr}
                  onChange={(e) => setEditHwTitleAr(e.target.value)}
                  style={{ paddingLeft: '16px', paddingRight: '16px' }}
                  className="w-full h-11 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-700 dark:text-slate-300 font-bold text-xs">
                  {language === 'ar' ? 'تفاصيل التمرين والتعليمات' : 'Exercise Details & Instructions'}
                </label>
                <textarea
                  rows={2}
                  dir="auto"
                  value={editHwDescAr}
                  onChange={(e) => setEditHwDescAr(e.target.value)}
                  style={{ padding: '12px 16px' }}
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed resize-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-700 dark:text-slate-300 font-bold text-xs">
                  {language === 'ar' ? 'ملاحظة وتوجيه المعلم للواجب' : 'Teacher Guidance Note'}
                </label>
                <input
                  type="text"
                  dir="auto"
                  value={editHwNoteAr}
                  onChange={(e) => setEditHwNoteAr(e.target.value)}
                  style={{ paddingLeft: '16px', paddingRight: '16px' }}
                  className="w-full h-11 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-700 dark:text-slate-300 font-bold text-xs">
                    {language === 'ar' ? 'آخر موعد للتسليم' : 'Due Date'}
                  </label>
                  <input
                    type="date"
                    dir="ltr"
                    value={editHwDueDate}
                    onChange={(e) => setEditHwDueDate(e.target.value)}
                    style={{ paddingLeft: '16px', paddingRight: '16px' }}
                    className="w-full h-11 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-700 dark:text-slate-300 font-bold text-xs">
                    {language === 'ar' ? 'الدرجة القصوى' : 'Max Score'}
                  </label>
                  <input
                    type="number"
                    dir="ltr"
                    value={editHwScore}
                    onChange={(e) => setEditHwScore(Number(e.target.value))}
                    min={10}
                    max={100}
                    style={{ paddingLeft: '16px', paddingRight: '16px' }}
                    className="w-full h-11 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingHw(null)}
                  className="flex-1 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm transition-all cursor-pointer"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-black rounded-xl shadow-md shadow-blue-600/20 transition-all cursor-pointer text-sm flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={16} />
                  <span>{language === 'ar' ? 'حفظ التعديلات' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Group Homework Evaluation Matrix / List (Section 25) */}
      {selectedHwToGrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-fade-in select-none">
          <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
            
            {/* 1. Modal Header */}
            {(() => {
              const modalGrp =
                visibleGroups.find((g) => g.id === selectedHwToGrade.groupId) ||
                groups.find((g) => g.id === selectedHwToGrade.groupId) ||
                visibleGroups.find((g) => g.name === selectedHwToGrade.groupName) ||
                groups.find((g) => g.name === selectedHwToGrade.groupName);
              const modalGroupName = modalGrp?.name || selectedHwToGrade.groupName;
              const modalDisplayGroupId =
                modalGrp?.code && modalGrp.code.trim() && !modalGrp.code.startsWith('grp-')
                  ? modalGrp.code.trim()
                  : modalGrp?.code || selectedHwToGrade.groupId?.replace('grp-', '') || '3927';
              const modalGroupLanguage = modalGrp?.language || 'English';
              const modalGroupTiming = getCleanGroupScheduleStr(modalGrp);

              return (
                <div
                  className="bg-slate-900 text-white flex items-center justify-between shrink-0"
                  style={{ padding: '18px 26px' }}
                >
                  <div className="min-w-0 space-y-2">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="font-black text-lg sm:text-xl text-white tracking-tight">
                        {language === 'ar' ? 'تصحيح وتقييم واجبات الفوج' : 'Grade Group Homework'}
                      </h3>

                      {/* Group Name */}
                      <span
                        className="inline-flex items-center gap-1.5 rounded-lg text-xs font-black bg-purple-500/25 text-purple-200 border border-purple-400/50 shadow-xs whitespace-nowrap"
                        style={{ height: '26px', padding: '0 12px' }}
                      >
                        <Users size={12} className="text-purple-300" />
                        <span>{modalGroupName}</span>
                      </span>

                      {/* Group ID (Clean short code e.g. 3925) */}
                      {modalDisplayGroupId && (
                        <span
                          className="inline-flex items-center justify-center rounded-lg text-xs font-mono font-black bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-xs whitespace-nowrap"
                          style={{ height: '26px', padding: '0 12px' }}
                        >
                          <span>{modalDisplayGroupId}</span>
                        </span>
                      )}

                      {/* Language */}
                      <span
                        className="inline-flex items-center gap-1.5 rounded-lg text-xs font-bold bg-blue-500/20 text-blue-200 border border-blue-400/40 shadow-xs whitespace-nowrap"
                        style={{ height: '26px', padding: '0 10px' }}
                      >
                        <Globe size={12} className="text-blue-300" />
                        <span>
                          {modalGroupLanguage === 'French'
                            ? (language === 'ar' ? 'اللغة الفرنسية' : 'French')
                            : (language === 'ar' ? 'اللغة الإنجليزية' : 'English')}
                        </span>
                      </span>

                      {/* Timing */}
                      <span
                        className="inline-flex items-center gap-1.5 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-200 border border-amber-400/40 shadow-xs whitespace-nowrap"
                        style={{ height: '26px', padding: '0 10px' }}
                      >
                        <Clock size={12} className="text-amber-300" />
                        <span dir="ltr" className="font-mono text-[11px] font-semibold">{modalGroupTiming}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-300 font-medium flex-wrap">
                      <span className="font-bold text-amber-300">
                        {selectedHwToGrade.assignmentNameAr}
                      </span>
                      <span>•</span>
                      <span>
                        {language === 'ar'
                          ? `الدرجة القصوى: ${selectedHwToGrade.totalScore || 20}`
                          : `Max Score: ${selectedHwToGrade.totalScore || 20}`}
                      </span>
                      <span>•</span>
                      <span>
                        {language === 'ar'
                          ? `تاريخ الاستحقاق: ${selectedHwToGrade.dueDate}`
                          : `Due Date: ${selectedHwToGrade.dueDate}`}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedHwToGrade(null)}
                    className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
                  >
                    <X size={18} />
                  </button>
                </div>
              );
            })()}

            {/* 2. Sub-Header Quick Action Bar */}
            <div
              className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0 text-xs flex-wrap"
              style={{ padding: '12px 26px' }}
            >
              <div className="flex items-center gap-2 font-black text-slate-800 dark:text-slate-200">
                <Award size={16} className="text-purple-600 dark:text-purple-400" />
                <span>
                  {language === 'ar'
                    ? `قائمة طلاب الفوج (${groupEvalsDraft.length} طالب):`
                    : `Group Students (${groupEvalsDraft.length}):`}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setGroupEvalsDraft((prev) =>
                    prev.map((item) => ({
                      ...item,
                      completionStatus: 'completed',
                      score: selectedHwToGrade.totalScore || 20,
                      teacherComment:
                        item.teacherComment ||
                        (language === 'ar' ? 'أداء ممتاز وعمل متقن!' : 'Excellent work!'),
                    }))
                  );
                }}
                className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:underline cursor-pointer"
              >
                {language === 'ar'
                  ? '✓ تعيين الكل كمكتمل وبدرجة كاملة'
                  : '✓ Mark all completed with full score'}
              </button>
            </div>

            {/* 3. Students List Form (Scrollable body) */}
            <form onSubmit={handleSaveGroupEvaluations} className="flex flex-col flex-1 overflow-hidden">
              <div
                className="overflow-y-auto space-y-2 flex-1"
                style={{ padding: '14px 22px' }}
              >
                {groupEvalsDraft.length === 0 ? (
                  <div className="text-center py-10 text-xs text-slate-400 font-bold">
                    {language === 'ar'
                      ? 'لا يوجد طلاب مسجلين في هذا الفوج حالياً'
                      : 'No students enrolled in this group'}
                  </div>
                ) : (
                  groupEvalsDraft.map((stEval, index) => (
                    <div
                      key={stEval.studentId}
                      className="rounded-xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-2.5 shadow-2xs hover:border-purple-300 dark:hover:border-purple-600 transition-all"
                      style={{ padding: '8px 12px' }}
                    >
                      {/* Student Info */}
                      <div className="flex items-center gap-2.5 min-w-[170px] shrink-0">
                        <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 font-black text-xs flex items-center justify-center shrink-0 border border-purple-200/60 dark:border-purple-800/60">
                          {stEval.studentNameAr.split(' ').slice(-1)[0]?.[0] || 'ط'}
                        </div>
                        <div>
                          <div className="font-black text-xs sm:text-sm text-slate-900 dark:text-white leading-tight">
                            {stEval.studentNameAr}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {stEval.studentId}
                          </div>
                        </div>
                      </div>

                      {/* Form Fields in Responsive Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 flex-1 items-center">
                        {/* Mark Field */}
                        <div className="sm:col-span-3 flex flex-col gap-0.5">
                          <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                            {language === 'ar'
                              ? `الدرجة (من ${selectedHwToGrade.totalScore || 20}) *`
                              : `Score (/ ${selectedHwToGrade.totalScore || 20}) *`}
                          </label>
                          <div className="relative flex items-center">
                            <input
                              type="number"
                              required
                              min={0}
                              max={selectedHwToGrade.totalScore || 20}
                              value={stEval.score}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setGroupEvalsDraft((prev) =>
                                  prev.map((item, i) => (i === index ? { ...item, score: val } : item))
                                );
                              }}
                              className="w-full h-8 px-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-xs font-black text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500 text-center"
                            />
                            <span className="text-[10px] font-bold text-slate-400 absolute left-2 pointer-events-none">
                              /{selectedHwToGrade.totalScore || 20}
                            </span>
                          </div>
                        </div>

                        {/* Status Field */}
                        <div className="sm:col-span-4 flex flex-col gap-0.5">
                          <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                            {language === 'ar' ? 'حالة الواجب *' : 'Status *'}
                          </label>
                          <select
                            value={stEval.completionStatus}
                            onChange={(e) => {
                              const val = e.target.value as any;
                              setGroupEvalsDraft((prev) =>
                                prev.map((item, i) => (i === index ? { ...item, completionStatus: val } : item))
                              );
                            }}
                            className="w-full h-8 px-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px] font-bold text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-purple-500 cursor-pointer"
                          >
                            <option value="completed">
                              {language === 'ar' ? 'مكتمل ومقبول (Completed)' : 'Completed'}
                            </option>
                            <option value="needs_revision">
                              {language === 'ar' ? 'بحاجة لمراجعة (Revision)' : 'Needs Revision'}
                            </option>
                            <option value="pending">
                              {language === 'ar' ? 'لم يسلم بعد (Pending)' : 'Pending'}
                            </option>
                          </select>
                        </div>

                        {/* Comment Field */}
                        <div className="sm:col-span-5 flex flex-col gap-0.5">
                          <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                            {language === 'ar' ? 'ملاحظة وتعليق المعلم' : 'Comment & Feedback'}
                          </label>
                          <input
                            type="text"
                            dir="auto"
                            value={stEval.teacherComment}
                            onChange={(e) => {
                              const val = e.target.value;
                              setGroupEvalsDraft((prev) =>
                                prev.map((item, i) => (i === index ? { ...item, teacherComment: val } : item))
                              );
                            }}
                            placeholder={
                              language === 'ar' ? 'ملاحظة المعلم للطالب...' : 'Teacher feedback...'
                            }
                            className="w-full h-8 px-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px] font-medium text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-purple-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* 4. Modal Footer */}
              <div
                className="bg-slate-50 dark:bg-slate-850 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-end gap-3.5 shrink-0"
                style={{ padding: '14px 26px' }}
              >
                <button
                  type="button"
                  onClick={() => setSelectedHwToGrade(null)}
                  className="rounded-xl text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center"
                  style={{ height: '38px', padding: '0 18px' }}
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md hover:scale-101 active:scale-99 transition-all cursor-pointer text-xs sm:text-sm flex items-center justify-center shrink-0"
                  style={{ height: '38px', padding: '0 20px', gap: '8px' }}
                >
                  <CheckCircle2 size={16} className="shrink-0" />
                  <span className="whitespace-nowrap leading-none pt-0.5">
                    {language === 'ar'
                      ? 'حفظ تقييمات الفوج وإرسال الإشعارات'
                      : 'Save Group Grades & Notify'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: 4-Skill Assessment (Section 27, 28) */}
      {isAddAssessmentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div
            className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl border border-slate-200 dark:border-slate-800 animate-fade-in-up my-6 overflow-hidden"
            style={{ padding: '26px 30px' }}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-5">
              <h3 className="font-black text-lg sm:text-xl text-slate-900 dark:text-white tracking-tight">
                {language === 'ar' ? 'رصد تقييم المهارات اللغوية الأربعة' : 'Record 4-Skill Assessment'}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddAssessmentOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateAssessment} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-slate-700 dark:text-slate-300 font-bold text-xs">
                    {language === 'ar' ? 'الطالب' : 'Student'}
                  </label>
                  <SearchableSelect
                    options={visibleStudents.map((s) => ({
                      value: s.id,
                      label: s.fullNameAr,
                      subLabel: s.cefrLevel,
                    }))}
                    value={asmStudentId}
                    onChange={(val) => handleAsmStudentChange(val)}
                    themeColor="indigo"
                    placeholder={language === 'ar' ? 'اختر الطالب...' : 'Select student...'}
                    searchPlaceholder={language === 'ar' ? 'ابحث باسم الطالب...' : 'Search student...'}
                    emptyText={language === 'ar' ? 'لا يوجد طالب بهذا الاسم' : 'No matching students found'}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-slate-700 dark:text-slate-300 font-bold text-xs">
                    {language === 'ar' ? 'نوع الاختبار' : 'Assessment Type'}
                  </label>
                  <select
                    value={asmType}
                    onChange={(e) => setAsmType(e.target.value as any)}
                    style={{ paddingLeft: '16px', paddingRight: '16px' }}
                    className="w-full h-11 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="periodic">{language === 'ar' ? 'دوري (Periodic)' : 'Periodic'}</option>
                    <option value="midterm">{language === 'ar' ? 'نصفي (Midterm)' : 'Midterm'}</option>
                    <option value="final">{language === 'ar' ? 'نهائي (Final)' : 'Final'}</option>
                    <option value="placement">{language === 'ar' ? 'تحديد مستوى (Placement)' : 'Placement'}</option>
                  </select>
                </div>
              </div>

              {/* 4 Skills Inputs */}
              <div className="flex flex-col gap-2">
                <span className="block text-slate-700 dark:text-slate-300 font-bold text-xs">
                  {language === 'ar' ? 'الدرجات المهارية الأربعة (من 100%)' : '4-Skill Percentages (0-100%)'}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/80 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="space-y-1.5 text-center">
                    <label className="block text-slate-500 dark:text-slate-400 text-[11px] font-bold">
                      {language === 'ar' ? 'الاستماع (%)' : 'Listening (%)'}
                    </label>
                    <input
                      type="number"
                      value={asmListening}
                      onChange={(e) => setAsmListening(Number(e.target.value))}
                      min={0}
                      max={100}
                      className="w-full h-11 px-2 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-black text-blue-600 dark:text-blue-400 text-base shadow-xs"
                    />
                  </div>
                  <div className="space-y-1.5 text-center">
                    <label className="block text-slate-500 dark:text-slate-400 text-[11px] font-bold">
                      {language === 'ar' ? 'المحادثة (%)' : 'Speaking (%)'}
                    </label>
                    <input
                      type="number"
                      value={asmSpeaking}
                      onChange={(e) => setAsmSpeaking(Number(e.target.value))}
                      min={0}
                      max={100}
                      className="w-full h-11 px-2 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-black text-emerald-600 dark:text-emerald-400 text-base shadow-xs"
                    />
                  </div>
                  <div className="space-y-1.5 text-center">
                    <label className="block text-slate-500 dark:text-slate-400 text-[11px] font-bold">
                      {language === 'ar' ? 'القراءة (%)' : 'Reading (%)'}
                    </label>
                    <input
                      type="number"
                      value={asmReading}
                      onChange={(e) => setAsmReading(Number(e.target.value))}
                      min={0}
                      max={100}
                      className="w-full h-11 px-2 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-black text-purple-600 dark:text-purple-400 text-base shadow-xs"
                    />
                  </div>
                  <div className="space-y-1.5 text-center">
                    <label className="block text-slate-500 dark:text-slate-400 text-[11px] font-bold">
                      {language === 'ar' ? 'الكتابة (%)' : 'Writing (%)'}
                    </label>
                    <input
                      type="number"
                      value={asmWriting}
                      onChange={(e) => setAsmWriting(Number(e.target.value))}
                      min={0}
                      max={100}
                      className="w-full h-11 px-2 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-black text-amber-600 dark:text-amber-400 text-base shadow-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-slate-700 dark:text-slate-300 font-bold text-xs">
                  {language === 'ar' ? 'تقرير المعلم حول أداء الطالب' : 'Teacher Evaluation Notes'}
                </label>
                <textarea
                  rows={3}
                  dir="auto"
                  value={asmComment}
                  onChange={(e) => setAsmComment(e.target.value)}
                  style={{ padding: '12px 16px' }}
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed resize-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder={language === 'ar' ? 'اكتب تقييم وملاحظات المعلم حول مستوى الطالب...' : 'Teacher notes...'}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-black rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer text-sm flex items-center justify-center gap-2"
                >
                  <span>{language === 'ar' ? 'تثبيت نتيجة التقييم' : 'Save Assessment Result'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Teacher Feedback (Section 30) */}
      {isAddFeedbackOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div
            className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl border border-slate-200 dark:border-slate-800 animate-fade-in-up my-6 overflow-hidden"
            style={{ padding: '26px 30px' }}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-5">
              <h3 className="font-black text-lg sm:text-xl text-slate-900 dark:text-white tracking-tight">
                {language === 'ar' ? 'إرسال توجيه تربوي لولي الأمر' : 'Send Teacher Guidance to Parent'}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddFeedbackOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateFeedback} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-700 dark:text-slate-300 font-bold text-xs">
                  {language === 'ar' ? 'الطالب المستهدف' : 'Target Student'}
                </label>
                <SearchableSelect
                  options={visibleStudents.map((s) => ({
                    value: s.id,
                    label: s.fullNameAr,
                    subLabel: s.parentName ? `ولي الأمر: ${s.parentName}` : undefined,
                  }))}
                  value={fbStudentId}
                  onChange={(val) => setFbStudentId(val)}
                  themeColor="emerald"
                  placeholder={language === 'ar' ? 'اختر الطالب...' : 'Select student...'}
                  searchPlaceholder={language === 'ar' ? 'ابحث باسم الطالب أو ولي الأمر...' : 'Search student or parent...'}
                  emptyText={language === 'ar' ? 'لا يوجد طالب بهذا الاسم' : 'No matching students found'}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-700 dark:text-slate-300 font-bold text-xs">
                  {language === 'ar' ? 'نقاط القوة (Strengths)' : 'Strengths'}
                </label>
                <input
                  type="text"
                  dir="auto"
                  value={fbStrengths}
                  onChange={(e) => setFbStrengths(e.target.value)}
                  placeholder={language === 'ar' ? 'المشاركة الفعالة، النطق السليم' : 'Good pronunciation, strong reading skills'}
                  style={{ paddingLeft: '16px', paddingRight: '16px' }}
                  className="w-full h-11 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-700 dark:text-slate-300 font-bold text-xs">
                  {language === 'ar' ? 'المجالات التي تحتاج لتطوير (Needs Improvement)' : 'Areas for Improvement'}
                </label>
                <input
                  type="text"
                  dir="auto"
                  value={fbNeedsImprovement}
                  onChange={(e) => setFbNeedsImprovement(e.target.value)}
                  placeholder={language === 'ar' ? 'الطلاقة في الحوار التلقائي' : 'Speaking fluency, vocabulary recall'}
                  style={{ paddingLeft: '16px', paddingRight: '16px' }}
                  className="w-full h-11 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-700 dark:text-slate-300 font-bold text-xs">
                  {language === 'ar' ? 'التوصية والتوجيه للمنزل (Recommendation)' : 'Home Recommendation'}
                </label>
                <input
                  type="text"
                  dir="auto"
                  value={fbRecommendation}
                  onChange={(e) => setFbRecommendation(e.target.value)}
                  placeholder={language === 'ar' ? 'ممارسة التحدث لمدة 10 دقائق يومياً في المنزل' : 'Practice speaking for 10 minutes every day'}
                  style={{ paddingLeft: '16px', paddingRight: '16px' }}
                  className="w-full h-11 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-700 dark:text-slate-300 font-bold text-xs">
                  {language === 'ar' ? 'ملاحظة عامة لولي الأمر' : 'General Comments to Parent'}
                </label>
                <textarea
                  rows={2.5}
                  dir="auto"
                  value={fbComments}
                  onChange={(e) => setFbComments(e.target.value)}
                  style={{ padding: '12px 16px' }}
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed resize-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer text-sm flex items-center justify-center gap-2"
                >
                  <span>{language === 'ar' ? 'إرسال التوجيه لولي الأمر' : 'Send Feedback to Parent'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Homework Confirmation Modal */}
      {hwToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in select-none">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[24px] shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 animate-scale-in">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-inner">
              <Trash2 size={24} />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="font-black text-lg text-slate-900 dark:text-white">
                {language === 'ar' ? 'حذف الواجب المنزلي' : 'Delete Homework'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                {language === 'ar'
                  ? `هل أنت متأكد من رغبتك في حذف واجب "${hwToDelete.name}"؟ لا يمكن التراجع عن هذا الإجراء.`
                  : `Are you sure you want to delete "${hwToDelete.name}"? This action cannot be undone.`}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setHwToDelete(null)}
                className="flex-1 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm transition-all cursor-pointer"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteHomework(hwToDelete.id);
                  setHwToDelete(null);
                }}
                className="flex-1 h-11 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-600/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash2 size={15} />
                <span>{language === 'ar' ? 'تأكيد الحذف' : 'Confirm Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
