'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  FileSpreadsheet,
  FileText,
  Plus,
  Eye,
  Edit,
  Archive,
  GraduationCap,
  Users,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowUpDown,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useLanguage } from '@/context/LanguageContext';
import { AdminStudent, EntityStatus } from '@/types/admin';
import { StudentDetailModal } from '../modals/StudentDetailModal';

export function StudentsManagementScreen() {
  const { visibleStudents, groups, teachers, updateStudent, archiveStudent } = useAdmin();
  const { isRTL, language } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedTeacher, setSelectedTeacher] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'progress' | 'attendance' | 'performance'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [selectedStudentForModal, setSelectedStudentForModal] = useState<AdminStudent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter and Sort Pipeline
  const filteredStudents = useMemo(() => {
    return visibleStudents
      .filter((s) => {
        const matchesSearch =
          s.fullNameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.fullNameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.groupName.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesLevel = selectedLevel === 'all' || s.cefrLevel === selectedLevel;
        const matchesGroup = selectedGroup === 'all' || s.groupId === selectedGroup;
        const matchesTeacher = selectedTeacher === 'all' || s.teacherId === selectedTeacher;
        const matchesLanguage = selectedLanguage === 'all' || s.language === selectedLanguage;
        const matchesStatus = selectedStatus === 'all' || s.status === selectedStatus;

        return matchesSearch && matchesLevel && matchesGroup && matchesTeacher && matchesLanguage && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'name') {
          return sortOrder === 'asc'
            ? a.fullNameAr.localeCompare(b.fullNameAr)
            : b.fullNameAr.localeCompare(a.fullNameAr);
        }
        if (sortBy === 'progress') {
          return sortOrder === 'asc' ? a.overallProgress - b.overallProgress : b.overallProgress - a.overallProgress;
        }
        if (sortBy === 'attendance') {
          return sortOrder === 'asc' ? a.attendanceRate - b.attendanceRate : b.attendanceRate - a.attendanceRate;
        }
        if (sortBy === 'performance') {
          return sortOrder === 'asc'
            ? a.averagePerformance - b.averagePerformance
            : b.averagePerformance - a.averagePerformance;
        }
        return 0;
      });
  }, [visibleStudents, searchQuery, selectedLevel, selectedGroup, selectedTeacher, selectedLanguage, selectedStatus, sortBy, sortOrder]);

  const handleExport = (format: 'excel' | 'csv' | 'pdf') => {
    alert(
      language === 'ar'
        ? `جاري تصدير قائمة الطلاب بصيغة (${format.toUpperCase()})...`
        : `Exporting student roster as ${format.toUpperCase()}...`
    );
  };

  const handleOpenStudent = (student: AdminStudent) => {
    setSelectedStudentForModal(student);
    setIsModalOpen(true);
  };

  return (
    <div className={`w-full pb-10 space-y-6 select-none ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Header & Export Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs sm:text-sm font-bold text-slate-400">
            {language === 'ar' ? 'إدارة الشؤون الأكاديمية والطلاب' : 'Student Information System'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5">
            {language === 'ar' ? 'سجل الطلاب والمسارات (Students Roster)' : 'Students Management'}
          </h2>
        </div>

        {/* Export & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 p-1 shadow-2xs">
            <button
              type="button"
              onClick={() => handleExport('excel')}
              className="px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Export to Excel"
            >
              <FileSpreadsheet size={15} className="text-emerald-600" />
              <span>Excel</span>
            </button>
            <button
              type="button"
              onClick={() => handleExport('csv')}
              className="px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Export to CSV"
            >
              <FileText size={15} className="text-blue-600" />
              <span>CSV</span>
            </button>
            <button
              type="button"
              onClick={() => handleExport('pdf')}
              className="px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Export to PDF"
            >
              <Download size={15} className="text-rose-600" />
              <span>PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Comprehensive Multi-Filters (Section 25) */}
      <div
        className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-[28px] shadow-xs space-y-4"
        style={{ padding: '24px 28px' }}
      >
        <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'ar' ? 'بحث بالاسم، ولي الأمر، الفوج، أو المسار...' : 'Search student, parent, group...'}
              className={`w-full h-11 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:border-purple-500 transition-colors ${
                isRTL ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'
              }`}
            />
            <Search
              size={18}
              className={`absolute top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none ${
                isRTL ? 'right-3.5' : 'left-3.5'
              }`}
            />
          </div>

          {/* Quick Result Counter */}
          <div className="text-xs font-bold text-slate-400 shrink-0">
            {language === 'ar' ? `النتائج المعروضة: ${filteredStudents.length} طالب` : `Showing ${filteredStudents.length} students`}
          </div>
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          {/* Level Filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1">
              {language === 'ar' ? 'المستوى (Level)' : 'Level'}
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full h-9 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 px-2 cursor-pointer"
            >
              <option value="all">{language === 'ar' ? 'جميع المستويات' : 'All Levels'}</option>
              <option value="A1">A1 — Beginner</option>
              <option value="A2">A2 — Elementary</option>
              <option value="B1">B1 — Intermediate</option>
              <option value="B2">B2 — Upper Intermediate</option>
              <option value="C1">C1 — Advanced</option>
            </select>
          </div>

          {/* Group Filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1">
              {language === 'ar' ? 'الفوج (Group)' : 'Group'}
            </label>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="w-full h-9 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 px-2 cursor-pointer"
            >
              <option value="all">{language === 'ar' ? 'جميع الأفواج' : 'All Groups'}</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.code} — {g.name}
                </option>
              ))}
            </select>
          </div>

          {/* Teacher Filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1">
              {language === 'ar' ? 'المعلم (Teacher)' : 'Teacher'}
            </label>
            <select
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              className="w-full h-9 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 px-2 cursor-pointer"
            >
              <option value="all">{language === 'ar' ? 'جميع المعلمين' : 'All Teachers'}</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.fullNameAr}
                </option>
              ))}
            </select>
          </div>

          {/* Language Filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1">
              {language === 'ar' ? 'المسار اللغوي' : 'Language'}
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full h-9 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 px-2 cursor-pointer"
            >
              <option value="all">{language === 'ar' ? 'كل المسارات' : 'All Tracks'}</option>
              <option value="English">English</option>
              <option value="French">French</option>
              <option value="Dual">Dual Bilingual</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1">
              {language === 'ar' ? 'الحالة (Status)' : 'Status'}
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full h-9 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 px-2 cursor-pointer"
            >
              <option value="all">{language === 'ar' ? 'جميع الحالات' : 'All Statuses'}</option>
              <option value="active">Active (نشط)</option>
              <option value="inactive">Inactive (غير نشط)</option>
              <option value="suspended">Suspended (موقوف)</option>
              <option value="archived">Archived (مؤرشف)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Students Table (Section 7, 38) */}
      <div
        className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-[28px] shadow-xs overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-right">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-400 font-bold">
              <tr>
                <th className="py-3.5 px-6 text-right">{language === 'ar' ? 'الطالب' : 'Student'}</th>
                <th className="py-3.5 px-4 text-center">{language === 'ar' ? 'المستوى' : 'Level'}</th>
                <th className="py-3.5 px-4 text-center">{language === 'ar' ? 'الفوج' : 'Group'}</th>
                <th className="py-3.5 px-4 text-center">{language === 'ar' ? 'المعلم' : 'Teacher'}</th>
                <th className="py-3.5 px-4 text-center">{language === 'ar' ? 'ولي الأمر' : 'Parent'}</th>
                <th className="py-3.5 px-4 text-center">{language === 'ar' ? 'الانضباط' : 'Attendance'}</th>
                <th className="py-3.5 px-4 text-center">{language === 'ar' ? 'التقدم' : 'Progress'}</th>
                <th className="py-3.5 px-4 text-center">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                <th className="py-3.5 px-6 text-center">{language === 'ar' ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 font-bold">
                    {language === 'ar' ? 'لم يتم العثور على أي طالب مطابق لمعايير البحث' : 'No students found matching your filters'}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st) => (
                  <tr
                    key={st.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => handleOpenStudent(st)}
                  >
                    {/* Student Name */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 flex items-center justify-center font-bold text-xs shrink-0">
                          {st.fullNameAr[0]}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">
                            {st.fullNameAr}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {st.fullNameEn}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Level */}
                    <td className="py-4 px-4 text-center">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono font-bold text-xs">
                        {st.cefrLevel} (L{st.currentLevel})
                      </span>
                    </td>

                    {/* Group */}
                    <td className="py-4 px-4 text-center font-semibold text-slate-700 dark:text-slate-300">
                      {st.groupName.split('(')[0].trim()}
                    </td>

                    {/* Teacher */}
                    <td className="py-4 px-4 text-center font-medium text-slate-600 dark:text-slate-400">
                      {st.teacherName}
                    </td>

                    {/* Parent */}
                    <td className="py-4 px-4 text-center">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{st.parentName}</div>
                      <div className="text-[10px] text-slate-400 font-mono" dir="ltr">{st.parentPhone}</div>
                    </td>

                    {/* Attendance */}
                    <td className="py-4 px-4 text-center font-mono font-bold">
                      <span
                        className={
                          st.attendanceRate >= 85
                            ? 'text-emerald-600'
                            : st.attendanceRate >= 75
                            ? 'text-amber-600'
                            : 'text-rose-600'
                        }
                      >
                        {st.attendanceRate}%
                      </span>
                    </td>

                    {/* Progress */}
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className="font-mono font-bold text-purple-600">{st.overallProgress}%</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          st.status === 'active'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : st.status === 'archived'
                            ? 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                        }`}
                      >
                        {st.status === 'active' ? 'نشط' : st.status === 'archived' ? 'مؤرشف' : 'موقوف'}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-4 px-6 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleOpenStudent(st)}
                        className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 text-purple-600 dark:text-purple-300 font-bold text-xs transition-colors cursor-pointer"
                      >
                        {language === 'ar' ? 'الملف الشامل' : 'View Profile'} →
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Connected Student Profile Modal */}
      <StudentDetailModal
        student={selectedStudentForModal}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedStudentForModal(null);
        }}
      />
    </div>
  );
}
