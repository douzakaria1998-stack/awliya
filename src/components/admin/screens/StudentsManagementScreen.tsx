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
  UserPlus,
  X,
  Sparkles,
  Shield,
  BookOpen,
  Calendar,
  Link2,
  UserCheck,
  Phone,
  Mail,
  Check,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useLanguage } from '@/context/LanguageContext';
import { AdminStudent, EntityStatus } from '@/types/admin';
import { StudentDetailModal } from '../modals/StudentDetailModal';

export function StudentsManagementScreen() {
  const { visibleStudents, groups, teachers, parents, addStudent, updateStudent, archiveStudent } = useAdmin();
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
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);

  // New Student Form State (First Name, Last Name, Birthday, Link to Parent, etc.)
  const [firstNameAr, setFirstNameAr] = useState('');
  const [lastNameAr, setLastNameAr] = useState('');
  const [firstNameEn, setFirstNameEn] = useState('');
  const [lastNameEn, setLastNameEn] = useState('');
  const [birthDate, setBirthDate] = useState('2015-05-15');
  const [newGender, setNewGender] = useState<'male' | 'female'>('male');
  const [newLanguage, setNewLanguage] = useState<'English' | 'French'>('English');
  const [newCefrLevel, setNewCefrLevel] = useState<'A1' | 'A2' | 'B1' | 'B2' | 'C1'>('A1');
  const [newGroupId, setNewGroupId] = useState<string>(groups[0]?.id || 'grp-a1-01');

  // Link to Parent Mode State
  const [parentLinkMode, setParentLinkMode] = useState<'existing' | 'new'>('existing');
  const [selectedParentId, setSelectedParentId] = useState<string>(parents[0]?.id || '');
  const [parentSearchQuery, setParentSearchQuery] = useState('');
  const [customParentName, setCustomParentName] = useState('');
  const [customParentPhone, setCustomParentPhone] = useState('');
  const [customParentEmail, setCustomParentEmail] = useState('');

  // Filtered Parents for Link to Parent search
  const filteredParents = useMemo(() => {
    if (!parentSearchQuery.trim()) return parents;
    const query = parentSearchQuery.toLowerCase();
    return parents.filter(
      (p) =>
        p.fullNameAr.toLowerCase().includes(query) ||
        p.fullNameEn.toLowerCase().includes(query) ||
        p.phone.includes(query)
    );
  }, [parents, parentSearchQuery]);

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

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstNameAr.trim() || !lastNameAr.trim()) return;

    const fullNameAr = `${firstNameAr.trim()} ${lastNameAr.trim()}`;
    const fullNameEn = firstNameEn.trim() && lastNameEn.trim()
      ? `${firstNameEn.trim()} ${lastNameEn.trim()}`
      : fullNameAr;

    const matchedGroup = groups.find((g) => g.id === newGroupId) || groups[0];
    const matchedTeacher = teachers.find((t) => t.id === matchedGroup?.teacherId) || teachers[0];

    let parentId = 'par-01';
    let parentName = 'محمد بن علي';
    let parentPhone = '+213 555 123 456';

    if (parentLinkMode === 'existing') {
      const existingParent = parents.find((p) => p.id === selectedParentId) || parents[0];
      if (existingParent) {
        parentId = existingParent.id;
        parentName = existingParent.fullNameAr;
        parentPhone = existingParent.phone;
      }
    } else {
      parentName = customParentName.trim() || 'ولي أمر الطالب';
      parentPhone = customParentPhone.trim() || '+213 550 000 000';
    }

    addStudent({
      fullNameAr,
      fullNameEn,
      gender: newGender,
      language: newLanguage,
      cefrLevel: newCefrLevel,
      currentLevel: newCefrLevel === 'A1' ? 1 : newCefrLevel === 'A2' ? 2 : newCefrLevel === 'B1' ? 3 : newCefrLevel === 'B2' ? 4 : 5,
      groupId: matchedGroup?.id || 'grp-a1-01',
      groupName: matchedGroup?.name || 'Group A1 — Beginner',
      teacherId: matchedTeacher?.id || 'usr-teach-01',
      teacherName: matchedTeacher?.fullNameEn || 'Sarah Benali',
      parentId,
      parentName,
      parentPhone,
      status: 'active',
      overallProgress: 0,
      attendanceRate: 100,
      averagePerformance: 80,
    });

    // Reset Form
    setFirstNameAr('');
    setLastNameAr('');
    setFirstNameEn('');
    setLastNameEn('');
    setCustomParentName('');
    setCustomParentPhone('');
    setIsAddStudentOpen(false);
  };

  return (
    <div className={`w-full select-none ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Header & Export Bar */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{ marginBottom: '28px' }}
      >
        <div>
          <span className="text-xs sm:text-sm font-bold text-slate-400">
            {language === 'ar' ? 'إدارة الشؤون الأكاديمية والطلاب' : 'Student Information System'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5">
            {language === 'ar' ? 'سجل الطلاب والمسارات (Students Roster)' : 'Students Management'}
          </h2>
        </div>

        {/* Export & Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Add New Student Button */}
          <button
            type="button"
            onClick={() => setIsAddStudentOpen(true)}
            className="rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
            style={{ padding: '12px 24px' }}
          >
            <UserPlus size={17} />
            <span>{language === 'ar' ? 'إضافة طالب جديد' : 'Add New Student'}</span>
          </button>

          <div className="flex items-center rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 p-1.5 shadow-2xs">
            <button
              type="button"
              onClick={() => handleExport('excel')}
              className="px-3.5 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Export to Excel"
            >
              <FileSpreadsheet size={15} className="text-emerald-600" />
              <span>Excel</span>
            </button>
            <button
              type="button"
              onClick={() => handleExport('csv')}
              className="px-3.5 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Export to CSV"
            >
              <FileText size={15} className="text-blue-600" />
              <span>CSV</span>
            </button>
            <button
              type="button"
              onClick={() => handleExport('pdf')}
              className="px-3.5 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer transition-colors"
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
        className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-[32px] shadow-xs space-y-6"
        style={{
          padding: '36px 40px',
          marginBottom: '36px',
        }}
      >
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'ar' ? 'بحث بالاسم، ولي الأمر، الفوج، أو المسار...' : 'Search student, parent, group...'}
              className="w-full h-12 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:border-purple-500 transition-colors shadow-2xs"
              style={{
                paddingLeft: isRTL ? '20px' : '50px',
                paddingRight: isRTL ? '50px' : '20px',
                textAlign: isRTL ? 'right' : 'left',
              }}
            />
            <Search
              size={20}
              className={`absolute top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none ${
                isRTL ? 'right-4' : 'left-4'
              }`}
            />
          </div>

          {/* Quick Result Counter */}
          <div className="text-xs sm:text-sm font-bold text-slate-400 shrink-0">
            {language === 'ar' ? `النتائج المعروضة: ${filteredStudents.length} طالب` : `Showing ${filteredStudents.length} students`}
          </div>
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 pt-5 border-t border-slate-100 dark:border-slate-800">
          {/* Level Filter */}
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-2">
              {language === 'ar' ? 'المستوى (Level)' : 'Level'}
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full h-11 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 px-3 cursor-pointer"
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
            <label className="text-xs font-bold text-slate-400 block mb-2">
              {language === 'ar' ? 'الفوج (Group)' : 'Group'}
            </label>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="w-full h-11 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 px-3 cursor-pointer"
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
            <label className="text-xs font-bold text-slate-400 block mb-2">
              {language === 'ar' ? 'المعلم (Teacher)' : 'Teacher'}
            </label>
            <select
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              className="w-full h-11 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 px-3 cursor-pointer"
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
            <label className="text-xs font-bold text-slate-400 block mb-2">
              {language === 'ar' ? 'المسار اللغوي' : 'Language'}
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full h-11 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 px-3 cursor-pointer"
            >
              <option value="all">{language === 'ar' ? 'كل المسارات' : 'All Tracks'}</option>
              <option value="English">English</option>
              <option value="French">French</option>
              <option value="Dual">Dual Bilingual</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-2">
              {language === 'ar' ? 'الحالة (Status)' : 'Status'}
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full h-11 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 px-3 cursor-pointer"
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
        className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-[32px] shadow-xs overflow-hidden"
        style={{ marginBottom: '44px' }}
      >
        <div className="overflow-x-auto">
          <table className={`w-full text-xs sm:text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold">
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
                  {language === 'ar' ? 'الطالب' : 'Student'}
                </th>
                <th className="py-7 px-6 text-center font-extrabold">{language === 'ar' ? 'المستوى' : 'Level'}</th>
                <th className="py-7 px-6 text-center font-extrabold">{language === 'ar' ? 'الفوج' : 'Group'}</th>
                <th className="py-7 px-6 text-center font-extrabold">{language === 'ar' ? 'المعلم' : 'Teacher'}</th>
                <th className="py-7 px-6 text-center font-extrabold">{language === 'ar' ? 'الانضباط' : 'Attendance'}</th>
                <th className="py-7 px-6 text-center font-extrabold">{language === 'ar' ? 'التقدم' : 'Progress'}</th>
                <th className="py-7 px-6 text-center font-extrabold">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                <th
                  className="font-extrabold text-center"
                  style={{
                    paddingTop: '26px',
                    paddingBottom: '26px',
                    paddingRight: isRTL ? '40px' : '24px',
                    paddingLeft: isRTL ? '24px' : '40px',
                  }}
                >
                  {language === 'ar' ? 'الإجراءات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-400 font-bold">
                    {language === 'ar' ? 'لم يتم العثور على أي طالب مطابق لمعايير البحث' : 'No students found matching your filters'}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st) => (
                  <tr
                    key={st.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer"
                    onClick={() => handleOpenStudent(st)}
                  >
                    {/* Student Name */}
                    <td
                      className="py-8"
                      style={{
                        paddingLeft: isRTL ? '24px' : '40px',
                        paddingRight: isRTL ? '40px' : '24px',
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 flex items-center justify-center font-black text-sm shrink-0">
                          {st.fullNameAr[0]}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-snug">
                            {st.fullNameAr}
                          </div>
                          <div className="text-xs text-slate-400 font-mono mt-1">
                            {st.fullNameEn}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Level */}
                    <td className="py-8 px-6 text-center">
                      <span
                        className="rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono font-bold text-xs"
                        style={{ padding: '8px 16px' }}
                      >
                        {st.cefrLevel} (L{st.currentLevel})
                      </span>
                    </td>

                    {/* Group */}
                    <td className="py-8 px-6 text-center font-semibold text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
                      {st.groupName.split('(')[0].trim()}
                    </td>

                    {/* Teacher */}
                    <td className="py-8 px-6 text-center font-medium text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
                      {st.teacherName}
                    </td>

                    {/* Attendance */}
                    <td className="py-8 px-6 text-center font-mono font-black text-sm sm:text-base">
                      <span
                        className={
                          st.attendanceRate >= 85
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : st.attendanceRate >= 75
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }
                      >
                        {st.attendanceRate}%
                      </span>
                    </td>

                    {/* Progress */}
                    <td className="py-8 px-6 text-center">
                      <span className="font-mono font-black text-purple-600 dark:text-purple-400 text-sm sm:text-base">
                        {st.overallProgress}%
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-8 px-6 text-center">
                      <span
                        className={`text-xs font-bold rounded-full ${
                          st.status === 'active'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : st.status === 'archived'
                            ? 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                        }`}
                        style={{ padding: '8px 18px' }}
                      >
                        {st.status === 'active' ? 'نشط' : st.status === 'archived' ? 'مؤرشف' : 'موقوف'}
                      </span>
                    </td>

                    {/* Action */}
                    <td
                      className="py-8 text-center"
                      style={{
                        paddingRight: isRTL ? '40px' : '24px',
                        paddingLeft: isRTL ? '24px' : '40px',
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => handleOpenStudent(st)}
                        className="rounded-2xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 text-purple-600 dark:text-purple-300 font-bold text-xs transition-colors cursor-pointer"
                        style={{ padding: '10px 22px' }}
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

      {/* Add New Student Modal Dialog (Section: First Name, Last Name, Birthday, Link to Parent) */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-md animate-fade-in">
          <div
            className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl border border-slate-200/80 dark:border-slate-800 animate-fade-in-up max-h-[92vh] overflow-y-auto"
            style={{ padding: '28px 32px' }}
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800"
              style={{ paddingBottom: '14px', marginBottom: '18px' }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center font-black shrink-0">
                  <UserPlus size={18} />
                </div>
                <div>
                  <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white">
                    {language === 'ar' ? 'تسجيل وإضافة طالب جديد' : 'Register New Student'}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {language === 'ar'
                      ? 'إدخال البيانات الشخصية، تاريخ الميلاد، وربط الطالب بولي الأمر'
                      : 'Enter student info, birthday, and link to parent profile'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddStudentOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateStudent} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* 1. Name Section: First Name & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* First Name (Arabic) */}
                <div>
                  <label
                    className="block text-xs font-bold text-slate-700 dark:text-slate-300"
                    style={{ marginBottom: '5px' }}
                  >
                    {language === 'ar' ? 'الاسم الأول (First Name) *' : 'First Name (Arabic) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={firstNameAr}
                    onChange={(e) => setFirstNameAr(e.target.value)}
                    placeholder="مثال: ياسمين"
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/80 transition-all placeholder:text-slate-400"
                    style={{ height: '42px', padding: '8px 14px' }}
                  />
                </div>

                {/* Last Name (Arabic) */}
                <div>
                  <label
                    className="block text-xs font-bold text-slate-700 dark:text-slate-300"
                    style={{ marginBottom: '5px' }}
                  >
                    {language === 'ar' ? 'اللقب / اسم العائلة (Last Name) *' : 'Last Name (Arabic) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={lastNameAr}
                    onChange={(e) => setLastNameAr(e.target.value)}
                    placeholder="مثال: التواتي"
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/80 transition-all placeholder:text-slate-400"
                    style={{ height: '42px', padding: '8px 14px' }}
                  />
                </div>
              </div>

              {/* Optional English Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    className="block text-[11px] font-bold text-slate-500 dark:text-slate-400"
                    style={{ marginBottom: '4px' }}
                  >
                    First Name (English)
                  </label>
                  <input
                    type="text"
                    value={firstNameEn}
                    onChange={(e) => setFirstNameEn(e.target.value)}
                    placeholder="e.g. Yasmine"
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/80 transition-all placeholder:text-slate-400"
                    style={{ height: '40px', padding: '6px 12px' }}
                    dir="ltr"
                  />
                </div>

                <div>
                  <label
                    className="block text-[11px] font-bold text-slate-500 dark:text-slate-400"
                    style={{ marginBottom: '4px' }}
                  >
                    Last Name (English)
                  </label>
                  <input
                    type="text"
                    value={lastNameEn}
                    onChange={(e) => setLastNameEn(e.target.value)}
                    placeholder="e.g. Touati"
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/80 transition-all placeholder:text-slate-400"
                    style={{ height: '40px', padding: '6px 12px' }}
                    dir="ltr"
                  />
                </div>
              </div>

              {/* 2. Birthday & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Birthday */}
                <div>
                  <label
                    className="block text-xs font-bold text-slate-700 dark:text-slate-300"
                    style={{ marginBottom: '5px' }}
                  >
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-purple-600" />
                      <span>{language === 'ar' ? 'تاريخ الميلاد (Birthday) *' : 'Birthday *'}</span>
                    </span>
                  </label>
                  <input
                    type="date"
                    required
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/80 transition-all cursor-pointer"
                    style={{ height: '42px', padding: '8px 14px' }}
                  />
                </div>

                {/* Gender */}
                <div>
                  <label
                    className="block text-xs font-bold text-slate-700 dark:text-slate-300"
                    style={{ marginBottom: '5px' }}
                  >
                    {language === 'ar' ? 'الجنس (Gender)' : 'Gender'}
                  </label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value as any)}
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/80 transition-all cursor-pointer"
                    style={{ height: '42px', padding: '8px 12px' }}
                  >
                    <option value="male">{language === 'ar' ? 'ذكر (Male)' : 'Male'}</option>
                    <option value="female">{language === 'ar' ? 'أنثى (Female)' : 'Female'}</option>
                  </select>
                </div>
              </div>

              {/* 3. Link to Parent Section (Enhanced Spacing & Search Container) */}
              <div
                className="rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/80 dark:border-purple-900/50 space-y-3.5"
                style={{ padding: '18px 20px', marginTop: '4px', marginBottom: '4px' }}
              >
                {/* Section Header & Toggle Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-100 dark:border-purple-900/30 pb-3">
                  <div className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-300 flex items-center justify-center shrink-0">
                      <Link2 size={15} />
                    </div>
                    <span>{language === 'ar' ? 'ربط الطالب بولي الأمر (Link to Parent):' : 'Link to Parent:'}</span>
                  </div>

                  {/* Mode Toggles */}
                  <div
                    className="inline-flex items-center gap-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-purple-200/50 dark:border-slate-800 shadow-inner shrink-0"
                    style={{ padding: '3px 4px' }}
                  >
                    <button
                      type="button"
                      onClick={() => setParentLinkMode('existing')}
                      className={`rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                        parentLinkMode === 'existing'
                          ? 'bg-purple-600 text-white shadow-xs scale-[1.01]'
                          : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                      }`}
                      style={{ padding: '6px 12px' }}
                    >
                      <UserCheck size={13} />
                      <span>{language === 'ar' ? 'ولي أمر مسجل' : 'Existing Parent'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setParentLinkMode('new')}
                      className={`rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                        parentLinkMode === 'new'
                          ? 'bg-purple-600 text-white shadow-xs scale-[1.01]'
                          : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                      }`}
                      style={{ padding: '6px 12px' }}
                    >
                      <UserPlus size={13} />
                      <span>{language === 'ar' ? 'ولي أمر جديد' : 'New Parent'}</span>
                    </button>
                  </div>
                </div>

                {parentLinkMode === 'existing' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {/* Search Container */}
                    <div className="relative w-full">
                      <input
                        type="text"
                        value={parentSearchQuery}
                        onChange={(e) => setParentSearchQuery(e.target.value)}
                        placeholder={
                          language === 'ar'
                            ? 'بحث عن ولي أمر بالاسم أو رقم الهاتف...'
                            : 'Search parent by name or phone number...'
                        }
                        className="w-full rounded-xl bg-white dark:bg-slate-850 border border-purple-200/90 dark:border-purple-800/80 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all placeholder:text-slate-400 shadow-2xs"
                        style={{
                          height: '44px',
                          paddingLeft: isRTL ? (parentSearchQuery ? '38px' : '16px') : '44px',
                          paddingRight: isRTL ? '44px' : (parentSearchQuery ? '38px' : '16px'),
                        }}
                      />
                      <Search
                        size={17}
                        className={`absolute top-1/2 -translate-y-1/2 text-purple-600 ${
                          isRTL ? 'right-4' : 'left-4'
                        }`}
                      />
                      {parentSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setParentSearchQuery('')}
                          className={`absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer ${
                            isRTL ? 'left-3.5' : 'right-3.5'
                          }`}
                        >
                          <X size={15} />
                        </button>
                      )}
                    </div>

                    {/* Search Results Dropdown List when typing */}
                    {parentSearchQuery.trim() && (
                      <div className="max-h-48 overflow-y-auto rounded-xl bg-white dark:bg-slate-850 border border-purple-200 dark:border-purple-800 divide-y divide-purple-50 dark:divide-slate-800 shadow-lg">
                        {filteredParents.length === 0 ? (
                          <div className="p-3.5 text-center text-xs text-slate-400 font-medium">
                            {language === 'ar' ? 'لا يوجد ولي أمر مطابق للبحث' : 'No matching parent found'}
                          </div>
                        ) : (
                          filteredParents.map((p) => (
                            <div
                              key={p.id}
                              onClick={() => {
                                setSelectedParentId(p.id);
                                setParentSearchQuery('');
                              }}
                              className={`p-3 flex items-center justify-between hover:bg-purple-50 dark:hover:bg-purple-950/40 cursor-pointer transition-colors ${
                                selectedParentId === p.id ? 'bg-purple-50/80 dark:bg-purple-950/60' : ''
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 flex items-center justify-center font-black text-xs">
                                  {p.fullNameAr.charAt(0)}
                                </div>
                                <div>
                                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                                    {p.fullNameAr} <span className="font-normal text-[11px] text-slate-500 font-mono">({p.fullNameEn})</span>
                                  </div>
                                  <div className="text-[11px] font-mono text-purple-600 dark:text-purple-400" dir="ltr">
                                    📱 {p.phone}
                                  </div>
                                </div>
                              </div>
                              {selectedParentId === p.id && (
                                <Check size={15} className="text-purple-600 dark:text-purple-400" />
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {/* Linked Parent Live Info Badge */}
                    {(() => {
                      if (!selectedParentId) return null;
                      const activeParent = parents.find((p) => p.id === selectedParentId);
                      if (!activeParent) return null;
                      return (
                        <div
                          className="flex items-center justify-between gap-2.5 rounded-xl bg-white/95 dark:bg-slate-850 border border-purple-200/90 dark:border-purple-900/60 shadow-2xs"
                          style={{ padding: '8px 12px' }}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 flex items-center justify-center font-black text-xs shrink-0">
                              {activeParent.fullNameAr.charAt(0)}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                                {activeParent.fullNameAr} <span className="font-normal text-[11px] text-slate-500 font-mono">({activeParent.fullNameEn})</span>
                              </div>
                              <div className="text-[11px] font-mono text-purple-600 dark:text-purple-400 font-medium" dir="ltr">
                                📱 {activeParent.phone}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 flex items-center gap-1">
                              <Check size={12} />
                              <span>{language === 'ar' ? 'تم الربط' : 'Linked'}</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => setSelectedParentId('')}
                              title={language === 'ar' ? 'إلغاء الربط' : 'Remove Link'}
                              className="w-6 h-6 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center transition-all cursor-pointer border border-rose-200/60 dark:border-rose-900/50 hover:scale-105 active:scale-95"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        {language === 'ar' ? 'اسم ولي الأمر الجديد *' : 'New Parent Full Name *'}
                      </label>
                      <input
                        type="text"
                        value={customParentName}
                        onChange={(e) => setCustomParentName(e.target.value)}
                        placeholder="مثال: أ. فريد التواتي"
                        className="w-full rounded-xl bg-white dark:bg-slate-850 border border-purple-200 dark:border-purple-800 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all placeholder:text-slate-400 shadow-2xs"
                        style={{ height: '42px', padding: '8px 14px' }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        {language === 'ar' ? 'رقم هاتف ولي الأمر *' : 'Parent Phone Number *'}
                      </label>
                      <input
                        type="text"
                        value={customParentPhone}
                        onChange={(e) => setCustomParentPhone(e.target.value)}
                        placeholder="+213 550 000 000"
                        className="w-full rounded-xl bg-white dark:bg-slate-850 border border-purple-200 dark:border-purple-800 font-mono text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all placeholder:text-slate-400 shadow-2xs"
                        style={{ height: '42px', padding: '8px 14px' }}
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        {language === 'ar' ? 'البريد الإلكتروني (Email)' : 'Parent Email'}
                      </label>
                      <input
                        type="email"
                        value={customParentEmail}
                        onChange={(e) => setCustomParentEmail(e.target.value)}
                        placeholder="parent@example.com"
                        className="w-full rounded-xl bg-white dark:bg-slate-850 border border-purple-200 dark:border-purple-800 font-mono text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all placeholder:text-slate-400 shadow-2xs"
                        style={{ height: '42px', padding: '8px 14px' }}
                        dir="ltr"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Academic Track & Group */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Language */}
                <div>
                  <label
                    className="block text-xs font-bold text-slate-700 dark:text-slate-300"
                    style={{ marginBottom: '5px' }}
                  >
                    {language === 'ar' ? 'المسار اللغوي' : 'Language'}
                  </label>
                  <select
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value as any)}
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/80 transition-all cursor-pointer"
                    style={{ height: '42px', padding: '8px 12px' }}
                  >
                    <option value="English">الإنجليزية (English)</option>
                    <option value="French">الفرنسية (Français)</option>
                  </select>
                </div>

                {/* Level */}
                <div>
                  <label
                    className="block text-xs font-bold text-slate-700 dark:text-slate-300"
                    style={{ marginBottom: '5px' }}
                  >
                    {language === 'ar' ? 'المستوى (Level)' : 'Level'}
                  </label>
                  <select
                    value={newCefrLevel}
                    onChange={(e) => setNewCefrLevel(e.target.value as any)}
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/80 transition-all cursor-pointer"
                    style={{ height: '42px', padding: '8px 12px' }}
                  >
                    <option value="A1">A1 (Level 1)</option>
                    <option value="A2">A2 (Level 2)</option>
                    <option value="B1">B1 (Level 3)</option>
                    <option value="B2">B2 (Level 4)</option>
                    <option value="C1">C1 (Level 5)</option>
                  </select>
                </div>

                {/* Group Assignment */}
                <div>
                  <label
                    className="block text-xs font-bold text-slate-700 dark:text-slate-300"
                    style={{ marginBottom: '5px' }}
                  >
                    {language === 'ar' ? 'الفوج (Group) *' : 'Group *'}
                  </label>
                  <select
                    value={newGroupId}
                    onChange={(e) => setNewGroupId(e.target.value)}
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/80 transition-all cursor-pointer"
                    style={{ height: '42px', padding: '8px 12px' }}
                  >
                    {groups.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name} — {isRTL ? g.daysAr : g.daysEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddStudentOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-all cursor-pointer text-xs sm:text-sm flex items-center justify-center"
                  style={{ height: '44px' }}
                >
                  <span>{language === 'ar' ? 'إلغاء' : 'Cancel'}</span>
                </button>

                <button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-xl shadow-md hover:scale-[1.01] active:scale-95 transition-all cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-2"
                  style={{ height: '44px' }}
                >
                  <CheckCircle2 size={16} />
                  <span>{language === 'ar' ? 'تسجيل وتأكيد الطالب' : 'Confirm & Register Student'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
