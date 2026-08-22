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
  const { homeworkList, assessments, feedbackList, attendanceSessions } = useAdmin();
  const { isRTL, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<StudentTabKey>('overview');

  if (!isOpen || !student) return null;

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
          style={{ padding: '24px 32px' }}
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-md shrink-0">
              {student.fullNameAr[0]}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg sm:text-xl font-black text-white truncate">
                  {student.fullNameAr} ({student.fullNameEn})
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold font-mono">
                  {student.cefrLevel} — Level {student.currentLevel}
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
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation (Connected Profile Hub) */}
        <div className="flex items-center gap-1.5 p-2 bg-slate-100 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 overflow-x-auto shrink-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon size={16} />
                <span>{language === 'ar' ? tab.labelAr : tab.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className={`overflow-y-auto flex-1 p-6 sm:p-8 space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
          {/* TAB 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Basic Information Grid */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {language === 'ar' ? 'المعلومات الشخصية والأكاديمية' : 'Personal & Academic Details'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div
                    className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800"
                    style={{ padding: '20px 24px' }}
                  >
                    <span className="text-xs text-slate-400 block mb-1">{language === 'ar' ? 'الاسم الكامل:' : 'Full Name:'}</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{student.fullNameAr}</span>
                  </div>
                  <div
                    className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800"
                    style={{ padding: '20px 24px' }}
                  >
                    <span className="text-xs text-slate-400 block mb-1">{language === 'ar' ? 'الفوج المسند:' : 'Assigned Group:'}</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{student.groupName}</span>
                  </div>
                  <div
                    className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800"
                    style={{ padding: '20px 24px' }}
                  >
                    <span className="text-xs text-slate-400 block mb-1">{language === 'ar' ? 'المعلم المشرف:' : 'Assigned Teacher:'}</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{student.teacherName}</span>
                  </div>
                  <div
                    className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800"
                    style={{ padding: '20px 24px' }}
                  >
                    <span className="text-xs text-slate-400 block mb-1">{language === 'ar' ? 'ولي الأمر المربوط:' : 'Linked Parent:'}</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{student.parentName} ({student.relationship})</span>
                  </div>
                  <div
                    className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800"
                    style={{ padding: '20px 24px' }}
                  >
                    <span className="text-xs text-slate-400 block mb-1">{language === 'ar' ? 'هاتف التواصل:' : 'Parent Phone:'}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white text-sm" dir="ltr">{student.parentPhone}</span>
                  </div>
                  <div
                    className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800"
                    style={{ padding: '20px 24px' }}
                  >
                    <span className="text-xs text-slate-400 block mb-1">{language === 'ar' ? 'تاريخ التسجيل:' : 'Enrollment Date:'}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">{student.enrollmentDate}</span>
                  </div>
                </div>
              </div>

              {/* Placement Test Box (if exists) */}
              {student.placementTest && (
                <div
                  className="bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 rounded-2xl space-y-2"
                  style={{ padding: '22px 26px' }}
                >
                  <div className="flex items-center justify-between">
                    <h5 className="font-black text-blue-950 dark:text-blue-200 text-sm flex items-center gap-2">
                      <Sparkles size={16} className="text-blue-600" />
                      <span>{language === 'ar' ? 'نتيجة اختبار تحديد المستوى (Placement Test)' : 'Placement Test Result'}</span>
                    </h5>
                    <span className="px-3 py-1 rounded-full bg-blue-600 text-white font-mono font-bold text-xs">
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
            <div className="space-y-6">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-900 dark:text-white text-sm">
                    {language === 'ar' ? `نسبة إنجاز المنهج (${student.cefrLevel})` : `Curriculum Progress (${student.cefrLevel})`}
                  </span>
                  <span className="text-base font-mono font-black text-purple-600">{student.overallProgress}%</span>
                </div>
                <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: `${student.overallProgress}%` }} />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                  <span>{student.completedLessonsCount} / {student.totalLessonsCount} حصص منجزة</span>
                  <span>المتبقي: {student.totalLessonsCount - student.completedLessonsCount} حصص</span>
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
                <div className="py-8 text-center text-slate-400 text-xs font-semibold">
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
            <div className="space-y-4">
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                {language === 'ar' ? 'سجل الواجبات والتسليمات' : 'Homework & Submissions'}
              </h4>
              <div className="space-y-3">
                {studentHomework.map((hw) => {
                  const myEval = hw.evaluations.find((e) => e.studentId === student.id);
                  return (
                    <div
                      key={hw.id}
                      className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2"
                      style={{ padding: '20px 24px' }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">{hw.assignmentNameAr}</span>
                        <span className="font-mono text-xs font-bold text-purple-600">
                          {myEval?.score !== undefined ? `${myEval.score} / ${hw.totalScore}` : 'قيد التصحيح'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{hw.descriptionAr}</p>
                      {myEval?.teacherComment && (
                        <div className="text-xs font-medium text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200/50">
                          ملاحظة المعلم: "{myEval.teacherComment}"
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: 4-Skill Assessment */}
          {activeTab === 'assessment' && (
            <div className="space-y-6">
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                {language === 'ar' ? 'تقييم المهارات اللغوية الأربعة (4 Language Skills)' : '4-Skill Language Assessment'}
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { name: 'الاستماع (Listening)', score: student.skills.listening, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/40' },
                  { name: 'المحادثة (Speaking)', score: student.skills.speaking, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
                  { name: 'القراءة (Reading)', score: student.skills.reading, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950/40' },
                  { name: 'الكتابة (Writing)', score: student.skills.writing, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/40' },
                ].map((sk, idx) => (
                  <div key={idx} className={`${sk.bg} p-4 rounded-2xl text-center space-y-1`}>
                    <span className="text-xs font-bold text-slate-500 block">{sk.name}</span>
                    <span className={`text-2xl font-black font-mono ${sk.color}`}>{sk.score}%</span>
                  </div>
                ))}
              </div>

              {/* Assessment History */}
              <div className="space-y-3 pt-2">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {language === 'ar' ? 'سجل الاختبارات الدورية' : 'Assessment History'}
                </h5>
                {studentAssessments.map((asm) => (
                  <div
                    key={asm.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-sm text-slate-900 dark:text-white block">{asm.level} — {asm.assessmentType}</span>
                      <span className="text-xs text-slate-400 font-mono">{asm.date}</span>
                    </div>
                    <span className="text-sm font-mono font-black text-purple-600">{asm.scores.overall}% ({asm.gradeLetterAr})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: Teacher Feedback */}
          {activeTab === 'feedback' && (
            <div className="space-y-4">
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                {language === 'ar' ? 'التوجيهات التربوية والتواصل مع ولي الأمر' : 'Teacher Guidance & Parent Feedback'}
              </h4>

              {studentFeedback.map((fb) => (
                <div
                  key={fb.id}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-3">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{fb.teacherName}</span>
                    <span className="text-xs text-slate-400 font-mono">{fb.date}</span>
                  </div>

                  <div className="space-y-2 text-xs sm:text-sm">
                    <div>
                      <span className="font-bold text-emerald-600 block">نقاط القوة:</span>
                      <p className="text-slate-700 dark:text-slate-300">{fb.teacherFeedback.strengths.join(' • ')}</p>
                    </div>
                    <div>
                      <span className="font-bold text-amber-600 block">مجالات التطوير:</span>
                      <p className="text-slate-700 dark:text-slate-300">{fb.teacherFeedback.needsImprovement.join(' • ')}</p>
                    </div>
                    <div>
                      <span className="font-bold text-indigo-600 block">التوصية للمنزل:</span>
                      <p className="text-slate-700 dark:text-slate-300">"{fb.teacherFeedback.recommendations}"</p>
                    </div>
                  </div>

                  {fb.parentFeedback && (
                    <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm">
                      <span className="font-bold text-purple-600 block mb-1">رد ولي الأمر:</span>
                      <p className="text-slate-800 dark:text-slate-200 font-medium">"{fb.parentFeedback.message}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
