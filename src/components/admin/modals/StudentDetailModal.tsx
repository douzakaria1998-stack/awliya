'use client';

import React, { useState } from 'react';
import {
  X,
  User,
  BookOpen,
  CalendarCheck2,
  BookCheck,
  Award,
  MessageSquareQuote,
  Sparkles,
  Phone,
  Mail,
  School,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  UserPlus,
  Link2,
  Search,
} from 'lucide-react';
import { AdminStudent } from '@/types/admin';
import { useAdmin } from '@/context/AdminContext';
import { useLanguage } from '@/context/LanguageContext';

interface StudentDetailModalProps {
  student: AdminStudent | null;
  isOpen: boolean;
  onClose: () => void;
}

type StudentTabKey = 'overview' | 'academic' | 'attendance' | 'homework' | 'assessment' | 'feedback';

export function StudentDetailModal({ student, isOpen, onClose }: StudentDetailModalProps) {
  const {
    homeworkList,
    assessments,
    feedbackList,
    attendanceSessions,
    students,
    parents,
    linkStudentToParent,
    unlinkStudentFromParent,
    updateStudent,
    recordAssessment,
  } = useAdmin();
  const { isRTL, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<StudentTabKey>('overview');
  const [isLinkingParent, setIsLinkingParent] = useState(false);
  const [parentSearchQuery, setParentSearchQuery] = useState('');

  // 4-Skill Assessment Editing State
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [editListening, setEditListening] = useState(0);
  const [editSpeaking, setEditSpeaking] = useState(0);
  const [editReading, setEditReading] = useState(0);
  const [editWriting, setEditWriting] = useState(0);

  if (!isOpen || !student) return null;

  // Resolve live student record from context
  const currentStudent = students.find((s) => s.id === student.id) || student;
  const hasParent = Boolean(
    currentStudent.parentId &&
    currentStudent.parentName &&
    currentStudent.parentId.trim() !== ''
  );

  const isSearchingParent = parentSearchQuery.trim().length > 0;
  const filteredParentsToLink = isSearchingParent
    ? parents.filter((p) => {
        const q = parentSearchQuery.trim().toLowerCase();
        return (
          p.fullNameAr.toLowerCase().includes(q) ||
          (p.fullNameEn && p.fullNameEn.toLowerCase().includes(q)) ||
          p.phone.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q)
        );
      })
    : [];

  const studentHomework = homeworkList.filter((h) => h.studentIds.includes(student.id) || h.groupId === student.groupId);
  const studentAssessments = assessments.filter((a) => a.studentId === student.id);
  const studentFeedback = feedbackList.filter((f) => f.studentId === student.id);

  // Student Attendance Records across sessions
  const studentAttendanceRecords = attendanceSessions
    .map((sess) => {
      const rec = sess.records.find((r) => r.studentId === student.id);
      return rec ? { ...rec, sessionDate: sess.date, groupName: sess.groupName } : null;
    })
    .filter(Boolean);

  const tabs: { key: StudentTabKey; labelAr: string; labelEn: string; icon: any }[] = [
    { key: 'overview', labelAr: 'نظرة عامة', labelEn: 'Overview', icon: User },
    { key: 'academic', labelAr: 'المسار الأكاديمي', labelEn: 'Academic Progress', icon: BookOpen },
    { key: 'attendance', labelAr: 'سجل الحضور', labelEn: 'Attendance', icon: CalendarCheck2 },
    { key: 'homework', labelAr: 'الواجبات', labelEn: 'Homework', icon: BookCheck },
    { key: 'assessment', labelAr: 'تقييم المهارات', labelEn: 'Assessments', icon: Award },
    { key: 'feedback', labelAr: 'الملاحظات والتوجيه', labelEn: 'Feedback', icon: MessageSquareQuote },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-fade-in-up flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div
          className="bg-slate-900 text-white flex items-center justify-between shrink-0"
          style={{ padding: '20px 28px' }}
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-base shadow-md shrink-0">
              {student.fullNameAr[0]}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black text-white truncate">
                  {student.fullNameAr} ({student.fullNameEn})
                </h3>
                <span
                  className="inline-flex items-center justify-center rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold font-mono tracking-wide"
                  style={{ padding: '4px 12px', lineHeight: '1.2' }}
                >
                  {language === 'ar' ? `المستوى ${student.currentLevel}` : `Level ${student.currentLevel}`}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-0.5 truncate">
                {student.groupName} • {student.enrolledPathAr}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Navigation (Connected Profile Hub) */}
        <div
          className="flex items-center bg-slate-100/90 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 overflow-x-auto shrink-0"
          style={{ padding: '10px 18px', gap: '8px' }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-xl font-bold text-xs sm:text-sm flex items-center transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs border border-purple-200/60 dark:border-purple-900/60 scale-[1.02]'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/50'
                }`}
                style={{ padding: '8px 16px', gap: '8px' }}
              >
                <Icon size={15} />
                <span>{language === 'ar' ? tab.labelAr : tab.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div
          className={`overflow-y-auto flex-1 ${isRTL ? 'text-right' : 'text-left'}`}
          style={{ padding: '24px 28px' }}
        >
          {/* TAB 1: Overview */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Basic Information Grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {language === 'ar' ? 'المعلومات الشخصية والأكاديمية' : 'Personal & Academic Details'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div
                    className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800"
                    style={{ padding: '14px 18px' }}
                  >
                    <span className="text-xs text-slate-400 block mb-1">{language === 'ar' ? 'الاسم الكامل:' : 'Full Name:'}</span>
                    <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">{student.fullNameAr}</span>
                  </div>
                  <div
                    className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800"
                    style={{ padding: '14px 18px' }}
                  >
                    <span className="text-xs text-slate-400 block mb-1">{language === 'ar' ? 'الفوج المسند:' : 'Assigned Group:'}</span>
                    <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">{student.groupName}</span>
                  </div>
                  <div
                    className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800"
                    style={{ padding: '14px 18px' }}
                  >
                    <span className="text-xs text-slate-400 block mb-1">{language === 'ar' ? 'المعلم المشرف:' : 'Assigned Teacher:'}</span>
                    <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">{student.teacherName}</span>
                  </div>
                  <div
                    className={`${hasParent ? 'bg-slate-50 dark:bg-slate-800/60 border-slate-100 dark:border-slate-800' : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200/80 dark:border-amber-900/50'} rounded-2xl border`}
                    style={{ padding: '14px 18px' }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs block font-bold ${hasParent ? 'text-slate-400' : 'text-amber-700/80 dark:text-amber-400/80'}`}>
                        {language === 'ar' ? 'ولي الأمر المربوط:' : 'Linked Parent:'}
                      </span>
                      {hasParent && (
                        <button
                          type="button"
                          onClick={() => unlinkStudentFromParent(currentStudent.parentId, currentStudent.id)}
                          className="text-[10px] font-bold text-rose-500 hover:text-rose-700 dark:text-rose-400 cursor-pointer transition-colors"
                          title={language === 'ar' ? 'إلغاء ربط ولي الأمر' : 'Unlink Parent'}
                        >
                          {language === 'ar' ? 'إلغاء الربط' : 'Unlink'}
                        </button>
                      )}
                    </div>

                    {hasParent ? (
                      <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm block truncate">
                        {currentStudent.parentName} {currentStudent.relationship ? `(${currentStudent.relationship})` : ''}
                      </span>
                    ) : isLinkingParent ? (
                      <div className="space-y-2 mt-2 animate-fade-in">
                        {/* Search Input Bar */}
                        <div className="relative">
                          <Search
                            size={15}
                            className={`absolute top-1/2 -translate-y-1/2 text-amber-600 dark:text-amber-400 pointer-events-none ${
                              isRTL ? 'right-3.5' : 'left-3.5'
                            }`}
                          />
                          <input
                            type="text"
                            autoFocus
                            value={parentSearchQuery}
                            onChange={(e) => setParentSearchQuery(e.target.value)}
                            placeholder={language === 'ar' ? 'ابحث بالاسم أو رقم الهاتف...' : 'Search by name or phone...'}
                            className="w-full text-xs font-bold bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-2xs"
                            style={{
                              paddingTop: '9px',
                              paddingBottom: '9px',
                              paddingRight: isRTL ? '36px' : '14px',
                              paddingLeft: isRTL ? '14px' : '36px',
                              minHeight: '38px',
                            }}
                          />
                          {parentSearchQuery && (
                            <button
                              type="button"
                              onClick={() => setParentSearchQuery('')}
                              className={`absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer ${
                                isRTL ? 'left-3' : 'right-3'
                              }`}
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>

                        {/* Search Results Dropdown List (only shown when typing a search query) */}
                        {isSearchingParent && (
                          <div
                            className="bg-white dark:bg-slate-900 rounded-xl border border-amber-300/80 dark:border-amber-700/80 shadow-lg divide-y divide-slate-100 dark:divide-slate-800 overflow-y-auto animate-fade-in"
                            style={{ maxHeight: '180px' }}
                          >
                            {filteredParentsToLink.length === 0 ? (
                              <div className="py-3.5 px-4 text-center text-xs text-slate-400 font-bold">
                                {language === 'ar' ? 'لا يوجد ولي أمر مطابق للبحث' : 'No matching parents found'}
                              </div>
                            ) : (
                              filteredParentsToLink.map((p) => (
                                <div
                                  key={p.id}
                                  className="p-3 hover:bg-amber-50/80 dark:hover:bg-amber-950/40 flex items-center justify-between gap-3 transition-colors cursor-pointer"
                                  onClick={() => {
                                    linkStudentToParent(p.id, currentStudent.id);
                                    setIsLinkingParent(false);
                                    setParentSearchQuery('');
                                  }}
                                >
                                  <div className="min-w-0">
                                    <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                      {p.fullNameAr} {p.fullNameEn ? `(${p.fullNameEn})` : ''}
                                    </div>
                                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate" dir="ltr">
                                      {p.phone}
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      linkStudentToParent(p.id, currentStudent.id);
                                      setIsLinkingParent(false);
                                      setParentSearchQuery('');
                                    }}
                                    className="rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors cursor-pointer whitespace-nowrap shadow-2xs shrink-0 flex items-center justify-center"
                                    style={{ padding: '6px 14px', minHeight: '30px' }}
                                  >
                                    {language === 'ar' ? 'ربط' : 'Link'}
                                  </button>
                                </div>
                              ))
                            )}
                          </div>
                        )}

                        {/* Cancel Button */}
                        <div className="flex items-center justify-end pt-0.5">
                          <button
                            type="button"
                            onClick={() => {
                              setIsLinkingParent(false);
                              setParentSearchQuery('');
                            }}
                            className="rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer"
                            style={{ padding: '5px 12px', minHeight: '30px', whiteSpace: 'nowrap' }}
                          >
                            {language === 'ar' ? 'إلغاء' : 'Cancel'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-bold text-amber-700 dark:text-amber-300 text-xs flex items-center gap-1.5 min-w-0">
                          <UserPlus size={14} className="shrink-0 text-amber-600" />
                          <span className="truncate">{language === 'ar' ? 'إضافة ولي أمر للربط' : 'Add parent to link'}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setIsLinkingParent(true);
                            setParentSearchQuery('');
                          }}
                          className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-all cursor-pointer hover:scale-102 active:scale-98 shrink-0 flex items-center justify-center shadow-xs"
                          style={{
                            padding: '6px 16px',
                            minHeight: '32px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {language === 'ar' ? 'ربط الآن' : 'Link'}
                        </button>
                      </div>
                    )}
                  </div>
                  <div
                    className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800"
                    style={{ padding: '14px 18px' }}
                  >
                    <span className="text-xs text-slate-400 block mb-1">{language === 'ar' ? 'هاتف التواصل:' : 'Parent Phone:'}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white text-xs sm:text-sm" dir="ltr">
                      {hasParent ? (currentStudent.parentPhone || '—') : (language === 'ar' ? 'غير محدد' : 'Not set')}
                    </span>
                  </div>
                  <div
                    className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800"
                    style={{ padding: '14px 18px' }}
                  >
                    <span className="text-xs text-slate-400 block mb-1">{language === 'ar' ? 'تاريخ التسجيل:' : 'Enrollment Date:'}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white text-xs sm:text-sm">{student.enrollmentDate}</span>
                  </div>
                </div>
              </div>

              {/* Placement Test Box (if exists) */}
              {student.placementTest && (
                <div
                  className="bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 rounded-2xl space-y-2"
                  style={{ padding: '16px 20px' }}
                >
                  <div className="flex items-center justify-between">
                    <h5 className="font-black text-blue-950 dark:text-blue-200 text-xs sm:text-sm flex items-center gap-2">
                      <Sparkles size={15} className="text-blue-600" />
                      <span>{language === 'ar' ? 'نتيجة اختبار تحديد المستوى (Placement Test)' : 'Placement Test Result'}</span>
                    </h5>
                    <span
                      className="inline-flex items-center justify-center rounded-full bg-blue-600 text-white font-mono font-bold text-xs"
                      style={{ padding: '4px 12px', lineHeight: '1.2' }}
                    >
                      {student.placementTest.score}% — Level {student.placementTest.recommendedLevel}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-blue-900 dark:text-blue-300 font-medium leading-relaxed">
                    "{student.placementTest.comment}"
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Academic Progress */}
          {activeTab === 'academic' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div
                className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800"
                style={{ padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: '16px' }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-900 dark:text-white text-sm">
                    {language === 'ar' ? `نسبة إنجاز المنهج (${student.cefrLevel})` : `Curriculum Progress (${student.cefrLevel})`}
                  </span>
                  <span className="text-base font-mono font-black text-purple-600 dark:text-purple-400">{student.overallProgress}%</span>
                </div>
                <div className="w-full h-3 bg-slate-200 dark:bg-slate-700/80 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full transition-all duration-500" style={{ width: `${student.overallProgress}%` }} />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold pt-1">
                  <span>{student.completedLessonsCount} / {student.totalLessonsCount} {language === 'ar' ? 'حصص منجزة' : 'Lessons Completed'}</span>
                  <span>{language === 'ar' ? `المتبقي: ${student.totalLessonsCount - student.completedLessonsCount} حصص` : `Remaining: ${student.totalLessonsCount - student.completedLessonsCount} lessons`}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Attendance */}
          {activeTab === 'attendance' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  {language === 'ar' ? `سجل حضور الطالب (نسبة الانضباط: ${student.attendanceRate}%)` : `Attendance History (${student.attendanceRate}%)`}
                </h4>
              </div>

              {studentAttendanceRecords.length === 0 ? (
                <div
                  className="text-center text-slate-400 dark:text-slate-400 text-xs sm:text-sm font-semibold bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-center"
                  style={{ padding: '28px 24px', minHeight: '80px', lineHeight: '1.6' }}
                >
                  {language === 'ar' ? 'لا توجد سجلات حضور مسجلة حتى الآن' : 'No attendance records yet'}
                </div>
              ) : (
                <div className="space-y-3">
                  {studentAttendanceRecords.map((att: any, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
                      style={{ padding: '16px 20px' }}
                    >
                      <div className="flex items-center gap-3">
                        <Calendar size={16} className="text-slate-400" />
                        <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                          {att.sessionDate}
                        </span>
                        <span className="text-xs text-slate-400">{att.groupName}</span>
                      </div>

                      <span
                        className={`text-xs font-bold rounded-full ${
                          att.status === 'present'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : att.status === 'late'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                        }`}
                        style={{ padding: '6px 14px' }}
                      >
                        {att.status === 'present' ? 'حاضر ✓' : att.status === 'late' ? 'متأخر ⏱' : 'غائب ✕'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Homework */}
          {activeTab === 'homework' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                {language === 'ar' ? 'سجل الواجبات والتسليمات' : 'Homework & Submissions'}
              </h4>
              {studentHomework.length === 0 ? (
                <div
                  className="text-center text-slate-400 dark:text-slate-400 text-xs sm:text-sm font-semibold bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-center"
                  style={{ padding: '28px 24px', minHeight: '80px', lineHeight: '1.6' }}
                >
                  {language === 'ar' ? 'لا توجد واجبات مسندة لهذا الطالب بعد' : 'No homework assignments recorded yet'}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {studentHomework.map((hw) => {
                    const myEval = hw.evaluations.find((e) => e.studentId === student.id);
                    return (
                      <div
                        key={hw.id}
                        className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
                        style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: '10px' }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">{hw.assignmentNameAr}</span>
                          <span className="font-mono text-xs font-bold text-purple-600 dark:text-purple-400">
                            {myEval?.score !== undefined ? `${myEval.score} / ${hw.totalScore}` : 'قيد التصحيح'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{hw.descriptionAr}</p>
                        {myEval?.teacherComment && (
                          <div
                            className="text-xs font-medium text-amber-800 dark:text-amber-300 bg-amber-50/90 dark:bg-amber-950/40 rounded-xl border border-amber-200/60 dark:border-amber-900/40"
                            style={{ padding: '10px 16px', marginTop: '4px' }}
                          >
                            <span className="font-bold">{language === 'ar' ? 'ملاحظة المعلم: ' : 'Teacher Note: '}</span>
                            <span>"{myEval.teacherComment}"</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: 4-Skill Assessment */}
          {activeTab === 'assessment' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    {language === 'ar' ? 'تقييم المهارات اللغوية الأربعة (4 Language Skills)' : '4-Skill Language Assessment'}
                  </h4>
                  {!isEditingSkills ? (
                    <button
                      type="button"
                      onClick={() => {
                        setEditListening(currentStudent.skills?.listening || 0);
                        setEditSpeaking(currentStudent.skills?.speaking || 0);
                        setEditReading(currentStudent.skills?.reading || 0);
                        setEditWriting(currentStudent.skills?.writing || 0);
                        setIsEditingSkills(true);
                      }}
                      className="inline-flex items-center justify-center rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800/60 text-purple-700 dark:text-purple-300 text-xs font-bold transition-all cursor-pointer shadow-2xs hover:scale-102 active:scale-98"
                      style={{ padding: '8px 18px', minHeight: '36px', lineHeight: '1.4' }}
                    >
                      {language === 'ar' ? 'تعديل التقييم' : 'Edit Skills'}
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingSkills(false)}
                        className="inline-flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                        style={{ padding: '8px 16px', minHeight: '36px', lineHeight: '1.4' }}
                      >
                        {language === 'ar' ? 'إلغاء' : 'Cancel'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const l = Math.min(100, Math.max(0, Number(editListening) || 0));
                          const s = Math.min(100, Math.max(0, Number(editSpeaking) || 0));
                          const r = Math.min(100, Math.max(0, Number(editReading) || 0));
                          const w = Math.min(100, Math.max(0, Number(editWriting) || 0));
                          const overall = Math.round((l + s + r + w) / 4);
                          const updatedSkills = {
                            listening: l,
                            speaking: s,
                            reading: r,
                            writing: w,
                            overall,
                          };

                          updateStudent(currentStudent.id, {
                            skills: updatedSkills,
                            averagePerformance: overall,
                          });

                          recordAssessment({
                            studentId: currentStudent.id,
                            studentNameAr: currentStudent.fullNameAr,
                            studentNameEn: currentStudent.fullNameEn,
                            groupId: currentStudent.groupId,
                            groupName: currentStudent.groupName,
                            level: currentStudent.cefrLevel,
                            assessmentType: 'periodic',
                            scores: updatedSkills,
                            gradeLetterAr: overall >= 90 ? 'ممتاز (A+)' : overall >= 80 ? 'جيد جداً (B+)' : overall >= 60 ? 'مقبول (C)' : 'يحتاج تحسين (D)',
                            gradeLetterEn: overall >= 90 ? 'A+ (Distinction)' : overall >= 80 ? 'B+ (Very Good)' : overall >= 60 ? 'C (Pass)' : 'D (Needs Improvement)',
                            teacherComment: language === 'ar' ? 'تحديث مباشر لتقييم المهارات اللغوية الأربعة' : 'Direct update of 4-skill assessment',
                          });

                          setIsEditingSkills(false);
                        }}
                        className="inline-flex items-center justify-center rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                        style={{ padding: '8px 20px', minHeight: '36px', lineHeight: '1.4' }}
                      >
                        {language === 'ar' ? 'حفظ التقييم' : 'Save Skills'}
                      </button>
                    </div>
                  )}
                </div>

                {!isEditingSkills ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    {[
                      { name: 'الاستماع (Listening)', score: currentStudent.skills?.listening || 0, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50/80 dark:bg-blue-950/40' },
                      { name: 'المحادثة (Speaking)', score: currentStudent.skills?.speaking || 0, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50/80 dark:bg-emerald-950/40' },
                      { name: 'القراءة (Reading)', score: currentStudent.skills?.reading || 0, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50/80 dark:bg-purple-950/40' },
                      { name: 'الكتابة (Writing)', score: currentStudent.skills?.writing || 0, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50/80 dark:bg-amber-950/40' },
                    ].map((sk, idx) => (
                      <div
                        key={idx}
                        className={`${sk.bg} rounded-2xl text-center border border-slate-100 dark:border-slate-800/80`}
                        style={{ padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: '8px' }}
                      >
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 block">{sk.name}</span>
                        <span className={`text-2xl font-black font-mono ${sk.color}`}>{sk.score}%</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <div>
                      <label className="block text-slate-500 mb-1 text-[11px] font-bold">الاستماع (Listening)</label>
                      <input
                        type="number"
                        value={editListening}
                        onChange={(e) => setEditListening(Number(e.target.value))}
                        min={0}
                        max={100}
                        className="w-full h-10 px-2 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold text-blue-600 dark:text-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1 text-[11px] font-bold">المحادثة (Speaking)</label>
                      <input
                        type="number"
                        value={editSpeaking}
                        onChange={(e) => setEditSpeaking(Number(e.target.value))}
                        min={0}
                        max={100}
                        className="w-full h-10 px-2 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold text-emerald-600 dark:text-emerald-400"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1 text-[11px] font-bold">القراءة (Reading)</label>
                      <input
                        type="number"
                        value={editReading}
                        onChange={(e) => setEditReading(Number(e.target.value))}
                        min={0}
                        max={100}
                        className="w-full h-10 px-2 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold text-purple-600 dark:text-purple-400"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1 text-[11px] font-bold">الكتابة (Writing)</label>
                      <input
                        type="number"
                        value={editWriting}
                        onChange={(e) => setEditWriting(Number(e.target.value))}
                        min={0}
                        max={100}
                        className="w-full h-10 px-2 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold text-amber-600 dark:text-amber-400"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Assessment History */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {language === 'ar' ? 'سجل الاختبارات الدورية' : 'Assessment History'}
                </h5>
                {studentAssessments.length === 0 ? (
                  <div
                    className="text-center text-slate-400 dark:text-slate-400 text-xs sm:text-sm font-semibold bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-center"
                    style={{ padding: '28px 24px', minHeight: '80px', lineHeight: '1.6' }}
                  >
                    {language === 'ar' ? 'لا توجد اختبارات مسجلة لهذا الطالب بعد' : 'No assessments recorded yet'}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {studentAssessments.map((asm) => (
                      <div
                        key={asm.id}
                        className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
                        style={{ padding: '16px 22px' }}
                      >
                        <div>
                          <span className="font-bold text-sm text-slate-900 dark:text-white block">{asm.level} — {asm.assessmentType}</span>
                          <span className="text-xs text-slate-400 font-mono mt-1 block">{asm.date}</span>
                        </div>
                        <span className="text-sm font-mono font-black text-purple-600 dark:text-purple-400">{asm.scores.overall}% ({asm.gradeLetterAr})</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: Teacher Feedback */}
          {activeTab === 'feedback' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                {language === 'ar' ? 'التوجيهات التربوية والتواصل مع ولي الأمر' : 'Teacher Guidance & Parent Feedback'}
              </h4>

              {studentFeedback.length === 0 ? (
                <div
                  className="text-center text-slate-400 dark:text-slate-400 text-xs sm:text-sm font-semibold bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-center"
                  style={{ padding: '28px 24px', minHeight: '80px', lineHeight: '1.6' }}
                >
                  {language === 'ar' ? 'لا توجد ملاحظات أو توجيهات مسجلة بعد' : 'No teacher feedback recorded yet'}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {studentFeedback.map((fb) => (
                    <div
                      key={fb.id}
                      className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
                      style={{ padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: '16px' }}
                    >
                      <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-3.5">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">{fb.teacherName}</span>
                        <span className="text-xs text-slate-400 font-mono">{fb.date}</span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }} className="text-xs sm:text-sm">
                        <div>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                            {language === 'ar' ? 'نقاط القوة:' : 'Strengths:'}
                          </span>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{fb.teacherFeedback.strengths.join(' • ')}</p>
                        </div>
                        <div>
                          <span className="font-bold text-amber-600 dark:text-amber-400 block mb-1">
                            {language === 'ar' ? 'مجالات التطوير:' : 'Areas for Improvement:'}
                          </span>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{fb.teacherFeedback.needsImprovement.join(' • ')}</p>
                        </div>
                        <div>
                          <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-1">
                            {language === 'ar' ? 'التوصية للمنزل:' : 'Home Recommendation:'}
                          </span>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">"{fb.teacherFeedback.recommendations}"</p>
                        </div>
                      </div>

                      {fb.parentFeedback && (
                        <div
                          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700/80 text-xs sm:text-sm shadow-2xs"
                          style={{ padding: '14px 18px', marginTop: '6px' }}
                        >
                          <span className="font-bold text-purple-600 dark:text-purple-400 block mb-1.5">
                            {language === 'ar' ? 'رد ولي الأمر:' : 'Parent Reply:'}
                          </span>
                          <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">"{fb.parentFeedback.message}"</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
