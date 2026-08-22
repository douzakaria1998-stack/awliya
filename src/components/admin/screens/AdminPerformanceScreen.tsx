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
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useLanguage } from '@/context/LanguageContext';

export function AdminPerformanceScreen() {
  const {
    visibleHomework,
    visibleAssessments,
    visibleStudents,
    visibleGroups,
    feedbackList,
    createHomework,
    evaluateHomework,
    recordAssessment,
    addTeacherFeedback,
    currentAdmin,
  } = useAdmin();
  const { isRTL, language } = useLanguage();

  const [activeSubTab, setActiveSubTab] = useState<'homework' | 'assessments' | 'feedback'>('homework');

  // Create Homework Modal State
  const [isAddHomeworkOpen, setIsAddHomeworkOpen] = useState(false);
  const [newHwTitleAr, setNewHwTitleAr] = useState('');
  const [newHwDescAr, setNewHwDescAr] = useState('');
  const [newHwNoteAr, setNewHwNoteAr] = useState('');
  const [newHwDueDate, setNewHwDueDate] = useState(new Date(Date.now() + 7 * 86400000).toISOString().substring(0, 10));
  const [newHwGroupId, setNewHwGroupId] = useState(visibleGroups[0]?.id || 'grp-a2-03');
  const [newHwScore, setNewHwScore] = useState(20);

  // Homework Evaluation Drawer State
  const [selectedHwToGrade, setSelectedHwToGrade] = useState<any | null>(null);
  const [gradeStudentId, setGradeStudentId] = useState('');
  const [gradeScore, setGradeScore] = useState(18);
  const [gradeComment, setGradeComment] = useState('أداء ممتاز وعمل متقن!');
  const [gradeStatus, setGradeStatus] = useState<'completed' | 'needs_revision'>('completed');

  // Record Assessment Modal State
  const [isAddAssessmentOpen, setIsAddAssessmentOpen] = useState(false);
  const [asmStudentId, setAsmStudentId] = useState(visibleStudents[0]?.id || 'stu-01');
  const [asmType, setAsmType] = useState<'periodic' | 'midterm' | 'final' | 'placement'>('periodic');
  const [asmListening, setAsmListening] = useState(85);
  const [asmSpeaking, setAsmSpeaking] = useState(80);
  const [asmReading, setAsmReading] = useState(90);
  const [asmWriting, setAsmWriting] = useState(75);
  const [asmComment, setAsmComment] = useState('مستوى ممتاز في الفهم القرائي والاستماع.');

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

    const grp = visibleGroups.find((g) => g.id === newHwGroupId) || visibleGroups[0];

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
      studentIds: grp?.studentIds || [],
    });

    setNewHwTitleAr('');
    setNewHwDescAr('');
    setNewHwNoteAr('');
    setIsAddHomeworkOpen(false);
  };

  const handleSaveEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHwToGrade || !gradeStudentId) return;

    evaluateHomework(selectedHwToGrade.id, gradeStudentId, Number(gradeScore), gradeComment, gradeStatus);
    setSelectedHwToGrade(null);
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
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{ marginBottom: '28px' }}
      >
        <div>
          <span className="text-xs sm:text-sm font-bold text-slate-400">
            {language === 'ar' ? 'التقييم الأكاديمي والواجبات والتوجيه التربوي' : 'Performance, Assessments & Feedback'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5">
            {language === 'ar' ? 'الأداء والتقييمات (Performance Module)' : 'Performance Management'}
          </h2>
        </div>

        {/* Dynamic Action Button according to active sub-tab */}
        {activeSubTab === 'homework' && (
          <button
            type="button"
            onClick={() => setIsAddHomeworkOpen(true)}
            className="rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm flex items-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0 whitespace-nowrap"
            style={{ padding: '12px 28px', gap: '10px' }}
          >
            <Plus size={16} />
            <span>{language === 'ar' ? 'إسناد واجب جديد' : 'Create Homework'}</span>
          </button>
        )}

        {activeSubTab === 'assessments' && (
          <button
            type="button"
            onClick={() => setIsAddAssessmentOpen(true)}
            className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0 whitespace-nowrap"
            style={{ padding: '12px 28px', gap: '10px' }}
          >
            <Plus size={16} />
            <span>{language === 'ar' ? 'رصد تقييم مهارات جديد' : 'Record 4-Skill Assessment'}</span>
          </button>
        )}

        {activeSubTab === 'feedback' && (
          <button
            type="button"
            onClick={() => setIsAddFeedbackOpen(true)}
            className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0 whitespace-nowrap"
            style={{ padding: '12px 28px', gap: '10px' }}
          >
            <Plus size={16} />
            <span>{language === 'ar' ? 'إرسال توجيه تربوي لولي الأمر' : 'Send Teacher Feedback'}</span>
          </button>
        )}
      </div>

      {/* 3-Part Navigation Bar (Section 22 in PDF: 1. Homework, 2. Assessments, 3. Teacher Feedback) */}
      <div
        className="flex items-center bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-[24px] shadow-2xs"
        style={{
          padding: '8px 10px',
          gap: '10px',
          marginBottom: '36px',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveSubTab('homework')}
          className={`flex-1 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center transition-all cursor-pointer ${
            activeSubTab === 'homework'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          style={{ padding: '13px 22px', gap: '10px' }}
        >
          <BookCheck size={18} />
          <span>1. {language === 'ar' ? 'الواجبات المنزلية (Homework)' : 'Homework'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('assessments')}
          className={`flex-1 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center transition-all cursor-pointer ${
            activeSubTab === 'assessments'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          style={{ padding: '13px 22px', gap: '10px' }}
        >
          <Award size={18} />
          <span>2. {language === 'ar' ? 'تقييم المهارات واختبار المستوى (Assessments)' : 'Assessments (4 Skills)'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('feedback')}
          className={`flex-1 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center transition-all cursor-pointer ${
            activeSubTab === 'feedback'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          style={{ padding: '13px 22px', gap: '10px' }}
        >
          <MessageSquareQuote size={18} />
          <span>3. {language === 'ar' ? 'التوجيهات التربوية والتواصل (2-Way Feedback)' : 'Teacher & Parent Feedback'}</span>
        </button>
      </div>

      {/* SUB-TAB 1: Homework (Section 23, 24, 25) */}
      {activeSubTab === 'homework' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {visibleHomework.map((hw) => (
            <div
              key={hw.id}
              className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-[32px] shadow-xs"
              style={{ padding: '36px 40px' }}
            >
              {/* Header Row */}
              <div
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800"
                style={{ paddingBottom: '24px', marginBottom: '24px' }}
              >
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-3.5 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 font-mono font-black text-xs">
                      {hw.groupName}
                    </span>
                    <h4 className="font-black text-xl text-slate-900 dark:text-white">{hw.assignmentNameAr}</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400 font-medium mt-2 leading-relaxed">{hw.descriptionAr}</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <span className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono font-bold text-xs flex items-center gap-2">
                    <Calendar size={15} className="text-purple-600" />
                    <span>{language === 'ar' ? 'تاريخ الاستحقاق:' : 'Due Date:'} {hw.dueDate}</span>
                  </span>
                  <span className="px-4 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 font-mono font-black text-xs border border-purple-200/60 dark:border-purple-800/60 flex items-center gap-2">
                    <Award size={15} className="text-purple-600" />
                    <span>{language === 'ar' ? 'الدرجة القصوى:' : 'Max Score:'} {hw.totalScore}</span>
                  </span>
                </div>
              </div>

              {/* Teacher Note Callout (Section 23 in PDF) */}
              {hw.teacherNote && (
                <div
                  className="rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200/90 dark:border-amber-800/70 space-y-2 text-xs sm:text-sm"
                  style={{ padding: '20px 24px', marginBottom: '28px' }}
                >
                  <div className="flex items-center gap-2.5 font-bold text-amber-900 dark:text-amber-300">
                    <MessageSquareQuote size={18} />
                    <span className="text-sm font-black">{language === 'ar' ? 'توجيه وملاحظة المعلم:' : 'Teacher Note & Instruction:'}</span>
                  </div>
                  <p className="text-slate-800 dark:text-amber-100 font-medium leading-relaxed italic pr-1">
                    "{hw.teacherNote}"
                  </p>
                </div>
              )}

              {/* Submissions & Evaluations Table (Section 25) */}
              <div style={{ paddingTop: '8px' }}>
                <span
                  className="text-xs sm:text-sm font-black text-slate-400 uppercase tracking-wider block"
                  style={{ marginBottom: '16px' }}
                >
                  {language === 'ar' ? 'تسليمات وتقييمات الطلاب:' : 'Student Submissions & Evaluations:'}
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {hw.evaluations.map((ev, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl bg-slate-50/90 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-750 flex items-center justify-between gap-4 shadow-2xs hover:border-purple-300 dark:hover:border-purple-700 transition-all"
                      style={{ padding: '18px 22px' }}
                    >
                      <div>
                        <div className="font-black text-sm text-slate-900 dark:text-white leading-snug">{ev.studentNameAr}</div>
                        <div className="text-xs font-mono font-bold mt-1.5">
                          {ev.score !== undefined ? (
                            <span className="text-emerald-600 dark:text-emerald-400">
                              {language === 'ar' ? `الدرجة: ${ev.score} / ${hw.totalScore}` : `Score: ${ev.score} / ${hw.totalScore}`}
                            </span>
                          ) : (
                            <span className="text-amber-600 dark:text-amber-400">
                              {language === 'ar' ? 'لم يتم التصحيح' : 'Not graded'}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedHwToGrade(hw);
                          setGradeStudentId(ev.studentId);
                          setGradeScore(ev.score || 18);
                          setGradeComment(ev.teacherComment || 'عمل ممتاز!');
                        }}
                        className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0 whitespace-nowrap"
                        style={{ padding: '8px 18px' }}
                      >
                        {ev.score !== undefined
                          ? (language === 'ar' ? 'تعديل التقييم' : 'Edit Grade')
                          : (language === 'ar' ? 'تصحيح الواجب' : 'Grade Homework')}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUB-TAB 2: Assessments & 4 Skills (Section 27, 28, 29) */}
      {activeSubTab === 'assessments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {visibleAssessments.map((asm) => (
              <div
                key={asm.id}
                className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-[32px] shadow-xs"
                style={{ padding: '36px 40px' }}
              >
                <div
                  className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800"
                  style={{ paddingBottom: '20px', marginBottom: '24px' }}
                >
                  <div>
                    <h4 className="font-black text-xl text-slate-900 dark:text-white">{asm.studentNameAr}</h4>
                    <span className="text-xs text-slate-400 mt-1 block font-medium">{asm.groupName} • {asm.level}</span>
                  </div>
                  <span className="px-4 py-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/60 dark:border-indigo-800/60 font-mono font-black text-indigo-700 dark:text-indigo-300 text-sm shadow-2xs">
                    {asm.scores.overall}% ({asm.gradeLetterAr})
                  </span>
                </div>

                {/* 4 Skills Radar (Listening, Speaking, Reading, Writing - Section 27) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-center text-xs" style={{ marginBottom: '24px' }}>
                  <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 rounded-2xl" style={{ padding: '16px 12px' }}>
                    <span className="text-[11px] text-slate-400 block font-bold mb-1.5">{language === 'ar' ? 'الاستماع' : 'Listening'}</span>
                    <span className="font-mono font-black text-blue-600 dark:text-blue-400 text-lg">{asm.scores.listening}%</span>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 rounded-2xl" style={{ padding: '16px 12px' }}>
                    <span className="text-[11px] text-slate-400 block font-bold mb-1.5">{language === 'ar' ? 'المحادثة' : 'Speaking'}</span>
                    <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-lg">{asm.scores.speaking}%</span>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/40 rounded-2xl" style={{ padding: '16px 12px' }}>
                    <span className="text-[11px] text-slate-400 block font-bold mb-1.5">{language === 'ar' ? 'القراءة' : 'Reading'}</span>
                    <span className="font-mono font-black text-purple-600 dark:text-purple-400 text-lg">{asm.scores.reading}%</span>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/40 rounded-2xl" style={{ padding: '16px 12px' }}>
                    <span className="text-[11px] text-slate-400 block font-bold mb-1.5">{language === 'ar' ? 'الكتابة' : 'Writing'}</span>
                    <span className="font-mono font-black text-amber-600 dark:text-amber-400 text-lg">{asm.scores.writing}%</span>
                  </div>
                </div>

                {asm.teacherComment && (
                  <p
                    className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed bg-slate-50/90 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 rounded-2xl italic"
                    style={{ padding: '18px 22px' }}
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {feedbackList.map((fb) => (
            <div
              key={fb.id}
              className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-[32px] shadow-xs"
              style={{ padding: '36px 40px' }}
            >
              <div
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800"
                style={{ paddingBottom: '20px', marginBottom: '24px' }}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-black text-base shadow-2xs">
                    {fb.studentNameAr[0]}
                  </div>
                  <div>
                    <h4 className="font-black text-xl text-slate-900 dark:text-white">{fb.studentNameAr}</h4>
                    <span className="text-xs text-slate-400 font-medium">{language === 'ar' ? 'ولي الأمر:' : 'Parent:'} {fb.parentName}</span>
                  </div>
                </div>
                <span className="text-xs text-slate-400 font-mono font-bold bg-slate-100 dark:bg-slate-800 px-3.5 py-1.5 rounded-xl w-fit">{fb.date}</span>
              </div>

              {/* Two-Way Stream (Section 26: Teacher Feedback & Parent Feedback) */}
              <div className="space-y-5 text-xs sm:text-sm">
                {/* Teacher Side */}
                <div
                  className="bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200/60 dark:border-emerald-800/40 space-y-3"
                  style={{ padding: '22px 26px' }}
                >
                  <span className="font-bold text-emerald-800 dark:text-emerald-300 block text-sm">
                    {language === 'ar' ? `توجيه المعلم (${fb.teacherName}):` : `Teacher Guidance (${fb.teacherName}):`}
                  </span>
                  <div className="space-y-2 text-slate-700 dark:text-slate-300 leading-relaxed">
                    <div>• <span className="font-bold">{language === 'ar' ? 'نقاط القوة:' : 'Strengths:'}</span> {fb.teacherFeedback.strengths.join(', ')}</div>
                    <div>• <span className="font-bold">{language === 'ar' ? 'بحاجة لتطوير:' : 'Needs Improvement:'}</span> {fb.teacherFeedback.needsImprovement.join(', ')}</div>
                    <div>• <span className="font-bold">{language === 'ar' ? 'توصية للمنزل:' : 'Home Recommendation:'}</span> "{fb.teacherFeedback.recommendations}"</div>
                  </div>
                </div>

                {/* Parent Response */}
                {fb.parentFeedback && (
                  <div
                    className="bg-purple-50/60 dark:bg-purple-950/30 rounded-2xl border border-purple-200/60 dark:border-purple-800/40 space-y-2.5"
                    style={{ padding: '22px 26px' }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple-800 dark:text-purple-300 text-sm">
                        {language === 'ar' ? `رد وملاحظة ولي الأمر (${fb.parentName}):` : `Parent Note (${fb.parentName}):`}
                      </span>
                      <span className="font-mono text-xs font-bold text-purple-600 dark:text-purple-400">{fb.parentFeedback.date}</span>
                    </div>
                    <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed italic">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5 animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-black text-lg text-slate-900 dark:text-white">إسناد واجب منزلي جديد</h3>
              <button
                type="button"
                onClick={() => setIsAddHomeworkOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateHomework} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">الفوج المستهدف *</label>
                <select
                  value={newHwGroupId}
                  onChange={(e) => setNewHwGroupId(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  {visibleGroups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.code} — {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">عنوان الواجب *</label>
                <input
                  type="text"
                  required
                  value={newHwTitleAr}
                  onChange={(e) => setNewHwTitleAr(e.target.value)}
                  placeholder="مثال: واجب الماضي البسيط: تمارين الأفعال الشاذة"
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">تفاصيل التمرين والتعليمات</label>
                <textarea
                  rows={2}
                  value={newHwDescAr}
                  onChange={(e) => setNewHwDescAr(e.target.value)}
                  placeholder="حل التمارين من 1 إلى 5 وتسجيل المقطع الصوتي..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">ملاحظة وتوجيه المعلم للواجب</label>
                <input
                  type="text"
                  value={newHwNoteAr}
                  onChange={(e) => setNewHwNoteAr(e.target.value)}
                  placeholder="Review exercises before next session"
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">آخر موعد للتسليم</label>
                  <input
                    type="date"
                    value={newHwDueDate}
                    onChange={(e) => setNewHwDueDate(e.target.value)}
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">الدرجة القصوى</label>
                  <input
                    type="number"
                    value={newHwScore}
                    onChange={(e) => setNewHwScore(Number(e.target.value))}
                    min={10}
                    max={100}
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer text-sm"
                >
                  إسناد وإشعار أولياء الأمور
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Grade Homework Evaluation (Section 25) */}
      {selectedHwToGrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-black text-base text-slate-900 dark:text-white">تصحيح وتقييم الواجب المنزلي</h3>
              <button
                type="button"
                onClick={() => setSelectedHwToGrade(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveEvaluation} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">الدرجة الممنوحة (من {selectedHwToGrade.totalScore})</label>
                <input
                  type="number"
                  required
                  value={gradeScore}
                  onChange={(e) => setGradeScore(Number(e.target.value))}
                  min={0}
                  max={selectedHwToGrade.totalScore}
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-purple-600 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">حالة الواجب</label>
                <select
                  value={gradeStatus}
                  onChange={(e) => setGradeStatus(e.target.value as any)}
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  <option value="completed">مكتمل ومقبول (Completed)</option>
                  <option value="needs_revision">بحاجة لإعادة مراجعة (Needs Revision)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">ملاحظة وتعليق المعلم للطالب</label>
                <textarea
                  rows={3}
                  required
                  value={gradeComment}
                  onChange={(e) => setGradeComment(e.target.value)}
                  placeholder="Good work. Review question 4."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer text-sm"
                >
                  حفظ التقييم وإرسال إشعار
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: 4-Skill Assessment (Section 27, 28) */}
      {isAddAssessmentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5 animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-black text-lg text-slate-900 dark:text-white">رصد تقييم المهارات اللغوية الأربعة</h3>
              <button
                type="button"
                onClick={() => setIsAddAssessmentOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateAssessment} className="space-y-4 text-xs font-bold">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">الطالب</label>
                  <select
                    value={asmStudentId}
                    onChange={(e) => setAsmStudentId(e.target.value)}
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    {visibleStudents.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.fullNameAr} ({s.cefrLevel})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">نوع الاختبار</label>
                  <select
                    value={asmType}
                    onChange={(e) => setAsmType(e.target.value as any)}
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="periodic">دوري (Periodic)</option>
                    <option value="midterm">نصفي (Midterm)</option>
                    <option value="final">نهائي (Final)</option>
                    <option value="placement">تحديد مستوى (Placement)</option>
                  </select>
                </div>
              </div>

              {/* 4 Skills Inputs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <div>
                  <label className="block text-slate-500 mb-1 text-[11px]">الاستماع (%)</label>
                  <input
                    type="number"
                    value={asmListening}
                    onChange={(e) => setAsmListening(Number(e.target.value))}
                    min={0}
                    max={100}
                    className="w-full h-10 px-2 text-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 text-[11px]">المحادثة (%)</label>
                  <input
                    type="number"
                    value={asmSpeaking}
                    onChange={(e) => setAsmSpeaking(Number(e.target.value))}
                    min={0}
                    max={100}
                    className="w-full h-10 px-2 text-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 text-[11px]">القراءة (%)</label>
                  <input
                    type="number"
                    value={asmReading}
                    onChange={(e) => setAsmReading(Number(e.target.value))}
                    min={0}
                    max={100}
                    className="w-full h-10 px-2 text-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 text-[11px]">الكتابة (%)</label>
                  <input
                    type="number"
                    value={asmWriting}
                    onChange={(e) => setAsmWriting(Number(e.target.value))}
                    min={0}
                    max={100}
                    className="w-full h-10 px-2 text-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-amber-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">تقرير المعلم حول أداء الطالب</label>
                <textarea
                  rows={2}
                  value={asmComment}
                  onChange={(e) => setAsmComment(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer text-sm"
                >
                  تثبيت نتيجة التقييم
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Teacher Feedback (Section 30) */}
      {isAddFeedbackOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5 animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-black text-lg text-slate-900 dark:text-white">إرسال توجيه تربوي لولي الأمر</h3>
              <button
                type="button"
                onClick={() => setIsAddFeedbackOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateFeedback} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">الطالب المستهدف</label>
                <select
                  value={fbStudentId}
                  onChange={(e) => setFbStudentId(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  {visibleStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullNameAr} — {s.parentName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">نقاط القوة (Strengths)</label>
                <input
                  type="text"
                  value={fbStrengths}
                  onChange={(e) => setFbStrengths(e.target.value)}
                  placeholder="Good pronunciation, strong reading skills"
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">المجالات التي تحتاج لتطوير (Needs Improvement)</label>
                <input
                  type="text"
                  value={fbNeedsImprovement}
                  onChange={(e) => setFbNeedsImprovement(e.target.value)}
                  placeholder="Speaking fluency, vocabulary recall"
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">التوصية والتوجيه للمنزل (Recommendation)</label>
                <input
                  type="text"
                  value={fbRecommendation}
                  onChange={(e) => setFbRecommendation(e.target.value)}
                  placeholder="Practice speaking for 10 minutes every day"
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 mb-1">ملاحظة عامة لولي الأمر</label>
                <textarea
                  rows={2}
                  value={fbComments}
                  onChange={(e) => setFbComments(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer text-sm"
                >
                  إرسال التوجيه التربوي
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
