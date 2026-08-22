'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import { AdminGroup } from '@/types/admin';
import { useAdmin } from '@/context/AdminContext';
import { useLanguage } from '@/context/LanguageContext';

interface GroupDetailModalProps {
  group: AdminGroup | null;
  isOpen: boolean;
  onClose: () => void;
}

type GroupTabKey = 'overview' | 'students' | 'attendance' | 'progress' | 'performance' | 'assessments';

export function GroupDetailModal({ group, isOpen, onClose }: GroupDetailModalProps) {
  const { students, attendanceSessions, homeworkList, assessments } = useAdmin();
  const { isRTL, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<GroupTabKey>('overview');

  if (!isOpen || !group) return null;

  const groupStudents = students.filter((s) => group.studentIds.includes(s.id) || s.groupId === group.id);
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
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">{group.name}</h3>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono font-bold text-[11px] border border-amber-500/30">
                  {group.code} • {group.level}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                {group.language} • {language === 'ar' ? 'المعلم:' : 'Teacher:'} {group.teacherName} • {group.daysAr} ({group.startTime}–{group.endTime})
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

        {/* Tab Navigation (Section 13) */}
        <div
          className="flex items-center bg-slate-100 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 overflow-x-auto shrink-0 scrollbar-none"
          style={{ padding: '8px 14px', gap: '6px' }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs border border-amber-200/60 dark:border-amber-900/60'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                style={{ padding: '6px 12px' }}
              >
                <Icon size={14} />
                <span>{language === 'ar' ? tab.labelAr : tab.labelEn}</span>
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div
                  className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
                  style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: '4px' }}
                >
                  <span className="text-xs text-slate-400 font-medium">
                    {language === 'ar' ? 'المعلم المشرف:' : 'Assigned Teacher:'}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">{group.teacherName}</span>
                </div>
                <div
                  className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
                  style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: '4px' }}
                >
                  <span className="text-xs text-slate-400 font-medium">
                    {language === 'ar' ? 'أيام الحصص والتوقيت:' : 'Schedule & Timing:'}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">{group.daysAr} ({group.startTime}–{group.endTime})</span>
                </div>
                <div
                  className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
                  style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: '4px' }}
                >
                  <span className="text-xs text-slate-400 font-medium">
                    {language === 'ar' ? 'الطلاب / السعة:' : 'Students / Capacity:'}
                  </span>
                  <span className="font-mono font-bold text-purple-600 dark:text-purple-400 text-xs sm:text-sm">
                    {groupStudents.length} / {group.maxCapacity} {language === 'ar' ? 'طلاب' : 'students'}
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
                  <div className="text-2xl font-black font-mono text-emerald-900 dark:text-emerald-200">{group.attendanceRate}%</div>
                </div>
                <div
                  className="rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/60"
                  style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}
                >
                  <span className="text-xs font-bold text-blue-800 dark:text-blue-300">
                    {language === 'ar' ? 'متوسط التقدم في المنهاج:' : 'Average Curriculum Progress:'}
                  </span>
                  <div className="text-2xl font-black font-mono text-blue-900 dark:text-blue-200">{group.averageProgress}%</div>
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
                    <div className="flex items-center gap-2.5">
                      <span
                        className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700/80"
                        style={{ padding: '4px 10px' }}
                      >
                        {st.attendanceRate}% {language === 'ar' ? 'حضور' : 'Att.'}
                      </span>
                      <span
                        className="font-mono text-xs font-bold text-purple-600 dark:text-purple-400 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700/80"
                        style={{ padding: '4px 10px' }}
                      >
                        {st.overallProgress}% {language === 'ar' ? 'تقدم' : 'Prog.'}
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
      </div>
    </div>
  );
}
