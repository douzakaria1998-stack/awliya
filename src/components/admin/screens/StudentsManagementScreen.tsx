'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  GraduationCap,
  Award,
  ChevronRight,
  TrendingUp,
  Languages,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Download,
} from 'lucide-react';
import { useStudent } from '@/context/StudentContext';
import { useAdmin } from '@/context/AdminContext';
import { levelThemes } from '@/lib/themes';
import { LevelId } from '@/types';
import { downloadCertificateHTML } from '@/lib/certificateGenerator';

export function StudentsManagementScreen() {
  const { students } = useStudent();
  const { changeStudentLevel } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTrack, setFilterTrack] = useState<string>('all');
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [targetLevel, setTargetLevel] = useState<number>(1);

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullNameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentIdNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.branchAr && s.branchAr.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTrack =
      filterTrack === 'all' ||
      (filterTrack === 'english' && (s.enrolledPathAr?.includes('الإنجليزية') || s.enrolledPathAr?.includes('English'))) ||
      (filterTrack === 'french' && (s.enrolledPathAr?.includes('الفرنسية') || s.enrolledPathAr?.includes('French')));

    return matchesSearch && matchesTrack;
  });

  const handleSaveLevel = (studentId: string) => {
    changeStudentLevel(studentId, targetLevel);
    setEditingStudentId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            شؤون وملفات الطلاب الأكاديمية
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            متابعة المستويات الدراسية للغات، ترقية الطلاب، وتصدير شهادات التخرج المعتمدة.
          </p>
        </div>

        {/* Track Filters */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 self-start sm:self-auto">
          {[
            { id: 'all', label: 'كافة المسارات' },
            { id: 'english', label: 'اللغة الإنجليزية' },
            { id: 'french', label: 'اللغة الفرنسية' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilterTrack(item.id)}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                filterTrack === item.id
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="البحث باسم الطالب، الرقم الأكاديمي، أو الفرع..."
          className="w-full h-12 pr-11 pl-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
        />
      </div>

      {/* Students Data Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStudents.map((st) => {
          const stTheme = levelThemes[st.currentLevel as LevelId] || levelThemes[1];
          const isPending = st.status === 'pending';
          const isEditing = editingStudentId === st.id;

          return (
            <div
              key={st.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-4 transition-all hover:border-slate-300 dark:hover:border-slate-700"
            >
              {/* Top Row: Avatar & Basic Info */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg text-white shadow-sm shrink-0"
                    style={{ background: stTheme.gradient }}
                  >
                    {st.fullNameAr[0]}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-base text-slate-900 dark:text-white truncate">
                      {st.fullNameAr}
                    </h3>
                    <div className="text-xs text-slate-400 font-mono">{st.studentIdNumber}</div>
                  </div>
                </div>

                {isPending ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30 shrink-0">
                    معلق
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 shrink-0">
                    نشط
                  </span>
                )}
              </div>

              {/* Middle: Path & Current Level */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                  {st.enrolledPathAr}
                </div>

                {/* Level Tag & Progress */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-rose-600 dark:text-rose-400">
                    المستوى {st.currentLevel} ({stTheme.shortNameAr})
                  </span>
                  <span className="font-mono font-bold text-slate-500">{st.currentLevelProgress}% إنجاز</span>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${st.currentLevelProgress}%`,
                      backgroundColor: stTheme.primary,
                    }}
                  />
                </div>
              </div>

              {/* Bottom Actions: Level Editor & Certificate */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <select
                      value={targetLevel}
                      onChange={(e) => setTargetLevel(Number(e.target.value))}
                      className="flex-1 h-9 px-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((lvl) => (
                        <option key={lvl} value={lvl}>
                          المستوى {lvl}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => handleSaveLevel(st.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs"
                    >
                      حفظ
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingStudentId(null)}
                      className="px-2 py-1.5 rounded-xl text-slate-400 font-bold text-xs"
                    >
                      إلغاء
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingStudentId(st.id);
                        setTargetLevel(st.currentLevel);
                      }}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <GraduationCap size={14} />
                      <span>ترقية المستوى</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        downloadCertificateHTML(
                          {
                            level: st.currentLevel,
                            nameAr: stTheme.nameAr,
                            stageAr: stTheme.stageAr,
                            status: 'studied',
                            score: 95,
                            completedDate: new Date().toISOString().split('T')[0],
                            subjects: [],
                          },
                          st.fullNameAr,
                          st
                        )
                      }
                      className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download size={13} />
                      <span>إصدار شهادة</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
