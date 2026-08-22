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
    { key: 'students', labelAr: 'قائمة الطلاب', labelEn: 'Students', icon: Users },
    { key: 'attendance', labelAr: 'سجل الحضور', labelEn: 'Attendance', icon: CalendarCheck2 },
    { key: 'progress', labelAr: 'التقدم الأكاديمي', labelEn: 'Academic Progress', icon: TrendingUp },
    { key: 'performance', labelAr: 'الواجبات والأداء', labelEn: 'Homework & Performance', icon: BookCheck },
    { key: 'assessments', labelAr: 'نتائج الاختبارات', labelEn: 'Assessments', icon: Award },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-fade-in-up flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div
          className="bg-slate-900 text-white flex items-center justify-between shrink-0"
          style={{ padding: '24px 32px' }}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-black text-lg shadow-md shrink-0">
              <School size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-white">{group.name}</h3>
                <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono font-bold text-xs border border-amber-500/30">
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
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation (Section 13) */}
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
                    ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">المعلم المشرف:</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{group.teacherName}</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">أيام الحصص والتوقيت:</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{group.daysAr} ({group.startTime}–{group.endTime})</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1">الطلاب / السعة:</span>
                  <span className="font-mono font-bold text-purple-600 text-sm">{groupStudents.length} / {group.maxCapacity} طلاب</span>
                </div>
              </div>

              {/* Progress and Attendance Stat Boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 space-y-2">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">متوسط نسبة حضور الفوج:</span>
                  <div className="text-3xl font-black font-mono text-emerald-900 dark:text-emerald-200">{group.attendanceRate}%</div>
                </div>
                <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/60 space-y-2">
                  <span className="text-xs font-bold text-blue-800 dark:text-blue-300">متوسط التقدم في المنهاج:</span>
                  <div className="text-3xl font-black font-mono text-blue-900 dark:text-blue-200">{group.averageProgress}%</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Students List */}
          {activeTab === 'students' && (
            <div className="space-y-3">
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                {language === 'ar' ? `قائمة الطلاب المسجلين بالفوج (${groupStudents.length})` : `Students Roster (${groupStudents.length})`}
              </h4>
              <div className="space-y-2">
                {groupStudents.map((st) => (
                  <div
                    key={st.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-white">{st.fullNameAr} ({st.fullNameEn})</div>
                      <div className="text-xs text-slate-400">ولي الأمر: {st.parentName} ({st.parentPhone})</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-emerald-600 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700">
                        {st.attendanceRate}% حضور
                      </span>
                      <span className="font-mono text-xs font-bold text-purple-600 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700">
                        {st.overallProgress}% تقدم
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Attendance History */}
          {activeTab === 'attendance' && (
            <div className="space-y-3">
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                {language === 'ar' ? 'سجل جلسات الحضور المسجلة' : 'Attendance Sessions History'}
              </h4>
              {groupAttendance.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs font-semibold">
                  لا توجد جلسات مسجلة حتى الآن
                </div>
              ) : (
                <div className="space-y-3">
                  {groupAttendance.map((sess) => (
                    <div
                      key={sess.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900 dark:text-white font-mono">{sess.date} ({sess.dayNameAr})</span>
                        <span className="text-xs text-slate-400 font-mono">{sess.sessionTime}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap text-xs">
                        {sess.records.map((r, i) => (
                          <span
                            key={i}
                            className={`px-2.5 py-1 rounded-lg font-bold ${
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
            <div className="space-y-4">
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                {language === 'ar' ? 'معدلات التقدم الأكاديمي لطلاب الفوج' : 'Academic Progress Across Curriculum'}
              </h4>
              <div className="space-y-3">
                {groupStudents.map((st) => (
                  <div key={st.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-900 dark:text-white">{st.fullNameAr}</span>
                      <span className="font-mono text-purple-600">{st.overallProgress}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-600 rounded-full" style={{ width: `${st.overallProgress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Performance & Homework */}
          {activeTab === 'performance' && (
            <div className="space-y-3">
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                {language === 'ar' ? 'الواجبات المسندة للفوج' : 'Homework Tasks Assigned'}
              </h4>
              <div className="space-y-3">
                {groupHomework.map((hw) => (
                  <div key={hw.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{hw.assignmentNameAr}</span>
                      <span className="font-mono text-xs text-slate-400">تاريخ التسليم: {hw.dueDate}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{hw.descriptionAr}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: Assessments */}
          {activeTab === 'assessments' && (
            <div className="space-y-3">
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                {language === 'ar' ? 'نتائج التقييمات والاختبارات للفوج' : 'Group Assessment Results'}
              </h4>
              <div className="space-y-3">
                {groupAssessments.map((asm) => (
                  <div key={asm.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-slate-900 dark:text-white block">{asm.studentNameAr} — {asm.assessmentType}</span>
                      <span className="text-xs text-slate-400 font-mono">{asm.date}</span>
                    </div>
                    <span className="font-mono font-black text-sm text-purple-600">{asm.scores.overall}% ({asm.gradeLetterAr})</span>
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
