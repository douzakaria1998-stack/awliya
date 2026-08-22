'use client';

import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Settings,
  TrendingUp,
  Plus,
  Layers,
  Sparkles,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pencil,
  CheckCircle2,
  Lock,
  FileCheck,
  Languages,
  X,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Check,
  Users,
  Search,
  GraduationCap,
  Clock,
  ArrowUpRight,
  Calendar,
  Circle,
  CircleDot,
  CheckCircle,
  Eye,
  Award,
  Download,
  School,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useLanguage } from '@/context/LanguageContext';
import { CurriculumLevel, LessonProgressStatus } from '@/types/admin';

export function AdminAcademicPathScreen() {
  const {
    curricula,
    visibleStudents,
    students,
    visibleGroups,
    groups,
    currentRole,
    addCurriculumLevel,
    updateCurriculumLevel,
    reorderCurriculumLevels,
    deleteCurriculumLevel,
    lessonProgressRecords,
    updateLessonProgress,
  } = useAdmin();
  const { isRTL, language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'curriculum' | 'student_progress'>('curriculum');
  const [selectedCurriculumLanguage, setSelectedCurriculumLanguage] = useState<'English' | 'French'>('English');
  const [selectedLevelNumber, setSelectedLevelNumber] = useState(1);

  // Tab 2: Student Progress Hierarchical View State (Groups -> Group Detail -> Student Detail)
  const [progressViewMode, setProgressViewMode] = useState<'groups' | 'group_detail' | 'student_detail'>('groups');
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // Tab 2 Filters
  const [groupSearchQuery, setGroupSearchQuery] = useState('');
  const [groupLanguageFilter, setGroupLanguageFilter] = useState<'all' | 'English' | 'French'>('all');
  const [groupLevelFilter, setGroupLevelFilter] = useState<string>('all');
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [studentStatusFilter, setStudentStatusFilter] = useState<'all' | 'in_progress' | 'completed' | 'not_started'>('all');

  // Create / Edit Level Modal State
  const [isAddLevelOpen, setIsAddLevelOpen] = useState(false);
  const [editingLevelNumber, setEditingLevelNumber] = useState<number | null>(null);
  const [modalStep, setModalStep] = useState<'basic' | 'units'>('basic');
  const [newLevelLanguage, setNewLevelLanguage] = useState<'English' | 'French'>('English');
  const [newLevelNameAr, setNewLevelNameAr] = useState('');
  const [newLevelNameEn, setNewLevelNameEn] = useState('');
  const [newLevelCode, setNewLevelCode] = useState<'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'>('A1');
  const [newLevelColor, setNewLevelColor] = useState('#3B82F6');
  const [newLevelDescAr, setNewLevelDescAr] = useState('');
  const [newLevelDescEn, setNewLevelDescEn] = useState('');
  const [newUnitsCount, setNewUnitsCount] = useState(3);

  // Units & Lessons configuration state for Step 2
  interface UnitDraft {
    id: string;
    unitNumber: number;
    titleAr: string;
    titleEn: string;
    lessons: {
      id: string;
      lessonNumber: number;
      titleAr: string;
      titleEn: string;
      contentSummary: string;
      vocabString: string;
      hasAssessment: boolean;
    }[];
  }

  const [unitsDraft, setUnitsDraft] = useState<UnitDraft[]>([]);
  const [expandedDraftUnitIds, setExpandedDraftUnitIds] = useState<string[]>([]);

  const toggleDraftUnit = (unitId: string) => {
    setExpandedDraftUnitIds((prev) =>
      prev.includes(unitId) ? prev.filter((id) => id !== unitId) : [...prev, unitId]
    );
  };

  const currentLangLevels = curricula.filter((c) => c.language === selectedCurriculumLanguage);

  const activeLevel = currentLangLevels.find(
    (c) => c.levelNumber === selectedLevelNumber
  ) || currentLangLevels[0] || curricula[0];

  const [expandedUnitId, setExpandedUnitId] = useState<string | null>('unit-01');

  const toggleUnit = (unitId: string) => {
    setExpandedUnitId((prev) => (prev === unitId ? null : unitId));
  };

  // Tab 2: Derived Data & Helpers
  const activeProgressGroup = useMemo(() => {
    if (!selectedGroupId) return null;
    return groups.find((g) => g.id === selectedGroupId) || null;
  }, [groups, selectedGroupId]);

  const groupStudentsList = useMemo(() => {
    if (!activeProgressGroup) return [];
    return visibleStudents.filter((st) => st.groupId === activeProgressGroup.id);
  }, [activeProgressGroup, visibleStudents]);

  const activeProgressStudent = useMemo(() => {
    if (!selectedStudentId) return null;
    return students.find((st) => st.id === selectedStudentId) || null;
  }, [students, selectedStudentId]);

  const studentCurriculumLevel = useMemo(() => {
    if (!activeProgressStudent) return null;
    return (
      curricula.find(
        (c) =>
          (c.levelNumber === activeProgressStudent.currentLevel || c.cefrCode === activeProgressStudent.cefrLevel) &&
          c.language === (activeProgressStudent.language === 'French' ? 'French' : 'English')
      ) ||
      curricula.find((c) => c.language === (activeProgressStudent.language === 'French' ? 'French' : 'English')) ||
      curricula[0]
    );
  }, [activeProgressStudent, curricula]);

  // Filtered Groups for Level 1
  const filteredProgressGroups = useMemo(() => {
    return visibleGroups.filter((grp) => {
      const matchesSearch =
        !groupSearchQuery ||
        grp.name.toLowerCase().includes(groupSearchQuery.toLowerCase()) ||
        grp.code.toLowerCase().includes(groupSearchQuery.toLowerCase()) ||
        grp.teacherName.toLowerCase().includes(groupSearchQuery.toLowerCase());

      const matchesLang =
        groupLanguageFilter === 'all' ||
        (groupLanguageFilter === 'English' && grp.language !== 'French') ||
        (groupLanguageFilter === 'French' && grp.language === 'French');

      const matchesLevel = groupLevelFilter === 'all' || grp.level === groupLevelFilter;

      return matchesSearch && matchesLang && matchesLevel;
    });
  }, [visibleGroups, groupSearchQuery, groupLanguageFilter, groupLevelFilter]);

  // Filtered Students for Level 2 (Group Detail)
  const filteredGroupStudents = useMemo(() => {
    return groupStudentsList.filter((st) => {
      const matchesSearch =
        !studentSearchQuery ||
        st.fullNameAr.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
        st.fullNameEn.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
        st.id.toLowerCase().includes(studentSearchQuery.toLowerCase());

      const matchesStatus =
        studentStatusFilter === 'all' ||
        (studentStatusFilter === 'completed' && st.overallProgress === 100) ||
        (studentStatusFilter === 'in_progress' && st.overallProgress > 0 && st.overallProgress < 100) ||
        (studentStatusFilter === 'not_started' && st.overallProgress === 0);

      return matchesSearch && matchesStatus;
    });
  }, [groupStudentsList, studentSearchQuery, studentStatusFilter]);

  // Handlers for Tab 2 navigation
  const handleOpenGroupDetail = (groupId: string) => {
    setSelectedGroupId(groupId);
    setProgressViewMode('group_detail');
    setStudentSearchQuery('');
    setStudentStatusFilter('all');
  };

  const handleOpenStudentDetail = (studentId: string) => {
    setSelectedStudentId(studentId);
    setProgressViewMode('student_detail');
  };

  const handleBackToGroups = () => {
    setSelectedGroupId(null);
    setSelectedStudentId(null);
    setProgressViewMode('groups');
  };

  const handleBackToGroupDetail = () => {
    setSelectedStudentId(null);
    setProgressViewMode('group_detail');
  };

  const handleMarkUnitComplete = (unitId: string) => {
    if (!activeProgressStudent || !studentCurriculumLevel) return;
    const targetUnit = studentCurriculumLevel.units.find((u) => u.id === unitId);
    if (!targetUnit) return;
    targetUnit.lessons.forEach((l) => {
      updateLessonProgress(activeProgressStudent.id, l.id, 'completed', studentCurriculumLevel.levelNumber);
    });
  };

  // Open modal in Create mode
  const handleOpenCreateModal = () => {
    setEditingLevelNumber(null);
    setNewLevelLanguage(selectedCurriculumLanguage);
    setNewLevelNameAr('');
    setNewLevelNameEn('');
    setNewLevelCode('A1');
    setNewLevelColor('#3B82F6');
    setNewLevelDescAr('');
    setNewLevelDescEn('');
    setNewUnitsCount(3);
    setUnitsDraft([]);
    setModalStep('basic');
    setIsAddLevelOpen(true);
  };

  // Open modal in Edit mode
  const handleOpenEditModal = (level: CurriculumLevel) => {
    setEditingLevelNumber(level.levelNumber);
    setNewLevelLanguage(level.language || selectedCurriculumLanguage);
    setNewLevelNameAr(level.nameAr);
    setNewLevelNameEn(level.nameEn || '');
    setNewLevelCode(level.cefrCode);
    setNewLevelColor(level.color || '#3B82F6');
    setNewLevelDescAr(level.descriptionAr || '');
    setNewLevelDescEn(level.descriptionEn || '');
    setNewUnitsCount(level.units.length);

    const mappedDraft: UnitDraft[] = level.units.map((u, uIdx) => ({
      id: u.id || `draft-unit-${uIdx + 1}-${Date.now()}`,
      unitNumber: u.unitNumber || uIdx + 1,
      titleAr: u.titleAr,
      titleEn: u.titleEn || `Unit ${uIdx + 1}`,
      lessons: u.lessons.map((l, lIdx) => ({
        id: l.id || `draft-lesson-${uIdx + 1}-${lIdx + 1}-${Date.now()}`,
        lessonNumber: l.lessonNumber || lIdx + 1,
        titleAr: l.titleAr,
        titleEn: l.titleEn || `Lesson ${lIdx + 1}`,
        contentSummary: l.contentSummary || '',
        vocabString: Array.isArray(l.vocabulary) ? l.vocabulary.join(', ') : ((l.vocabulary as any) || ''),
        hasAssessment: Boolean(l.hasAssessment),
      })),
    }));

    setUnitsDraft(mappedDraft);
    setExpandedDraftUnitIds(mappedDraft.map((u) => u.id));
    setModalStep('basic');
    setIsAddLevelOpen(true);
  };

  // Reorder level left / right
  const handleMoveLevel = (e: React.MouseEvent, lvlNumber: number, direction: 'prev' | 'next') => {
    e.stopPropagation();
    const currentList = curricula.filter((c) => c.language === selectedCurriculumLanguage);
    const currentIndex = currentList.findIndex((c) => c.levelNumber === lvlNumber);
    if (currentIndex < 0) return;
    const targetIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= currentList.length) return;

    const reordered = [...currentList];
    const [moved] = reordered.splice(currentIndex, 1);
    reordered.splice(targetIndex, 0, moved);

    reorderCurriculumLevels(selectedCurriculumLanguage, reordered);
    setSelectedLevelNumber(targetIndex + 1);
  };

  // Delete Level
  const handleDeleteLevel = (lvlNumber: number) => {
    const target = curricula.find((c) => c.levelNumber === lvlNumber && c.language === selectedCurriculumLanguage);
    if (!target) return;
    if (
      !confirm(
        language === 'ar'
          ? `هل أنت متأكد من رغبتك في حذف مستوى "${target.nameAr}" بالكامل من المنهاج؟`
          : `Are you sure you want to delete "${target.nameEn}" from the curriculum?`
      )
    ) {
      return;
    }
    deleteCurriculumLevel(lvlNumber, selectedCurriculumLanguage);
    setSelectedLevelNumber(1);
  };

  // Step 1 Submit: Move to Step 2 (Units & Lessons configuration)
  const handleProceedToUnits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLevelNameAr.trim()) return;

    if (unitsDraft.length === 0) {
      const count = Math.max(1, newUnitsCount);
      const initialUnits: UnitDraft[] = Array.from({ length: count }, (_, uIdx) => {
        const uNum = uIdx + 1;
        return {
          id: `draft-unit-${uNum}-${Date.now()}`,
          unitNumber: uNum,
          titleAr: `الوحدة ${uNum}: محاور التأسيس والمفردات (${newLevelCode})`,
          titleEn: `Unit ${uNum}: Core Vocabulary & Concepts`,
          lessons: [
            {
              id: `draft-lesson-${uNum}-1-${Date.now()}`,
              lessonNumber: 1,
              titleAr: `الدرس 1: القواعد والمفردات التأسيسية`,
              titleEn: `Lesson 1: Foundations & Structure`,
              contentSummary: 'شرح القواعد الأساسية والمفردات المحورية وتطبيقاتها.',
              vocabString: 'Introduction, Grammar, Vocabulary',
              hasAssessment: false,
            },
            {
              id: `draft-lesson-${uNum}-2-${Date.now()}`,
              lessonNumber: 2,
              titleAr: `الدرس 2: التعبير الشفهي والتطبيق العملي`,
              titleEn: `Lesson 2: Speaking & Practice`,
              contentSummary: 'تمارين تطبيقية وتدريبات محادثة تفاعلية.',
              vocabString: 'Conversation, Dialogue, Practice',
              hasAssessment: true,
            },
          ],
        };
      });

      setUnitsDraft(initialUnits);
      setExpandedDraftUnitIds(initialUnits.map((u) => u.id));
    }

    setModalStep('units');
  };

  // Helper actions for Units in Step 2
  const handleAddUnit = () => {
    const nextNum = unitsDraft.length + 1;
    const newUnit: UnitDraft = {
      id: `draft-unit-${nextNum}-${Date.now()}`,
      unitNumber: nextNum,
      titleAr: `الوحدة ${nextNum}: المحور التعليمي الجديد`,
      titleEn: `Unit ${nextNum}: New Topic`,
      lessons: [
        {
          id: `draft-lesson-${nextNum}-1-${Date.now()}`,
          lessonNumber: 1,
          titleAr: `الدرس 1: المفردات والتطبيق`,
          titleEn: `Lesson 1: Vocabulary & Practice`,
          contentSummary: 'شرح المفردات والمفاهيم الأساسية للوحدة.',
          vocabString: 'Topic, Words, Exercises',
          hasAssessment: false,
        },
      ],
    };
    setUnitsDraft((prev) => [...prev, newUnit]);
    setExpandedDraftUnitIds((prev) => [...prev, newUnit.id]);
  };

  const handleRemoveUnit = (unitId: string) => {
    if (unitsDraft.length <= 1) return;
    setUnitsDraft((prev) => prev.filter((u) => u.id !== unitId).map((u, idx) => ({ ...u, unitNumber: idx + 1 })));
  };

  const handleUpdateUnit = (unitId: string, updates: Partial<UnitDraft>) => {
    setUnitsDraft((prev) => prev.map((u) => (u.id === unitId ? { ...u, ...updates } : u)));
  };

  const handleAddLesson = (unitId: string) => {
    setUnitsDraft((prev) =>
      prev.map((unit) => {
        if (unit.id !== unitId) return unit;
        const nextLNum = unit.lessons.length + 1;
        const newLesson = {
          id: `draft-lesson-${unit.unitNumber}-${nextLNum}-${Date.now()}`,
          lessonNumber: nextLNum,
          titleAr: `الدرس ${nextLNum}: عنوان الدرس الجديد`,
          titleEn: `Lesson ${nextLNum}: New Lesson`,
          contentSummary: 'محتوى الدرس والأنشطة المقررة.',
          vocabString: 'New Words, Phrases',
          hasAssessment: false,
        };
        return { ...unit, lessons: [...unit.lessons, newLesson] };
      })
    );
  };

  const handleRemoveLesson = (unitId: string, lessonId: string) => {
    setUnitsDraft((prev) =>
      prev.map((unit) => {
        if (unit.id !== unitId) return unit;
        if (unit.lessons.length <= 1) return unit;
        return {
          ...unit,
          lessons: unit.lessons.filter((l) => l.id !== lessonId).map((l, lIdx) => ({ ...l, lessonNumber: lIdx + 1 })),
        };
      })
    );
  };

  const handleUpdateLesson = (unitId: string, lessonId: string, updates: any) => {
    setUnitsDraft((prev) =>
      prev.map((unit) => {
        if (unit.id !== unitId) return unit;
        return {
          ...unit,
          lessons: unit.lessons.map((l) => (l.id === lessonId ? { ...l, ...updates } : l)),
        };
      })
    );
  };

  // Final Step 2 Save: Add or Edit level with all units & lessons in context
  const handleFinalSaveLevel = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedUnits = unitsDraft.map((u, uIdx) => ({
      id: u.id.startsWith('draft-') ? `unit-${Date.now()}-${uIdx + 1}` : u.id,
      unitNumber: uIdx + 1,
      titleAr: u.titleAr.trim() || `الوحدة ${uIdx + 1}`,
      titleEn: u.titleEn.trim() || `Unit ${uIdx + 1}`,
      lessons: u.lessons.map((l, lIdx) => ({
        id: l.id.startsWith('draft-') ? `lesson-${Date.now()}-${uIdx + 1}-${lIdx + 1}` : l.id,
        lessonNumber: lIdx + 1,
        titleAr: l.titleAr.trim() || `الدرس ${lIdx + 1}`,
        titleEn: l.titleEn.trim() || `Lesson ${lIdx + 1}`,
        contentSummary: l.contentSummary.trim() || 'محتوى الدرس المعتمد.',
        vocabulary: l.vocabString
          .split(',')
          .map((v) => v.trim())
          .filter(Boolean),
        exercisesCount: 4,
        hasAssessment: l.hasAssessment,
      })),
    }));

    if (editingLevelNumber !== null) {
      const updatedLevel: CurriculumLevel = {
        levelNumber: editingLevelNumber,
        cefrCode: newLevelCode,
        nameAr: newLevelNameAr.trim(),
        nameEn: newLevelNameEn.trim() || `${newLevelCode} - Level`,
        descriptionAr: newLevelDescAr.trim() || 'مستوى تعليمي معتمد يركز على الكفاءات اللغوية التأسيسية.',
        descriptionEn: newLevelDescEn.trim() || 'Accredited curriculum level focusing on core competencies.',
        color: newLevelColor || '#3B82F6',
        language: newLevelLanguage,
        units: formattedUnits,
      };

      updateCurriculumLevel(editingLevelNumber, selectedCurriculumLanguage, updatedLevel);
      setSelectedCurriculumLanguage(newLevelLanguage);
      setSelectedLevelNumber(editingLevelNumber);
      alert(
        language === 'ar'
          ? `تم بنجاح تحديث وتعديل مستوى (${updatedLevel.cefrCode}) مع ${formattedUnits.length} وحدات تعليمية!`
          : `Level ${updatedLevel.cefrCode} updated successfully with ${formattedUnits.length} units!`
      );
    } else {
      const sameLangLevels = curricula.filter((c) => c.language === newLevelLanguage);
      const newLevelNumber = sameLangLevels.length + 1;

      const newLevel: CurriculumLevel = {
        levelNumber: newLevelNumber,
        cefrCode: newLevelCode,
        nameAr: newLevelNameAr.trim(),
        nameEn: newLevelNameEn.trim() || `${newLevelCode} - Level`,
        descriptionAr: newLevelDescAr.trim() || 'مستوى تعليمي معتمد يركز على الكفاءات اللغوية التأسيسية.',
        descriptionEn: newLevelDescEn.trim() || 'Accredited curriculum level focusing on core competencies.',
        color: newLevelColor || '#3B82F6',
        language: newLevelLanguage,
        units: formattedUnits,
      };

      addCurriculumLevel(newLevel);
      setSelectedCurriculumLanguage(newLevelLanguage);
      setSelectedLevelNumber(newLevel.levelNumber);
      alert(
        language === 'ar'
          ? `تم بنجاح إنشاء واعتماد المستوى (${newLevel.cefrCode}) مع ${formattedUnits.length} وحدات تعليمية!`
          : `Level ${newLevel.cefrCode} with ${formattedUnits.length} units published successfully!`
      );
    }

    setIsAddLevelOpen(false);
    setEditingLevelNumber(null);
    setModalStep('basic');
    setNewLevelNameAr('');
    setNewLevelNameEn('');
    setNewLevelDescAr('');
    setNewLevelDescEn('');
  };

  const handleCloseModal = () => {
    setIsAddLevelOpen(false);
    setEditingLevelNumber(null);
    setModalStep('basic');
  };

  return (
    <div className={`w-full select-none ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{ marginBottom: '20px' }}
      >
        <div>
          <span className="text-xs font-bold text-slate-400">
            {language === 'ar' ? 'المناهج وخارطة الكفاءات اللغوية' : 'Curriculum & CEFR Framework'}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
            {language === 'ar' ? 'المسار الأكاديمي والمنهاج (Academic Path)' : 'Academic Path & Curriculum'}
          </h2>
        </div>

        {/* Action: Create Level Button (Admin/Super Admin only) */}
        {currentRole !== 'teacher' && activeTab === 'curriculum' && (
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
            style={{ padding: '8px 18px' }}
          >
            <Plus size={16} />
            <span>{language === 'ar' ? 'إضافة مستوى جديد' : 'Create New Level'}</span>
          </button>
        )}
      </div>

      {/* Main Two Tabs Bar (Section 17) */}
      <div
        className="flex items-center gap-2 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-xs"
        style={{
          padding: '6px 8px',
          marginBottom: '20px',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('curriculum')}
          className={`flex-1 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'curriculum'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          style={{ padding: '10px 18px' }}
        >
          <Settings size={16} />
          <span>{language === 'ar' ? 'التبويب 1: هيكل المنهاج والإعدادات (Curriculum / Settings)' : 'Tab 1 — Curriculum / Settings'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('student_progress')}
          className={`flex-1 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'student_progress'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          style={{ padding: '10px 18px' }}
        >
          <TrendingUp size={16} />
          <span>{language === 'ar' ? 'التبويب 2: مصفوفة تقدم الطلاب (Student Progress Matrix)' : 'Tab 2 — Student Progress'}</span>
        </button>
      </div>

      {/* TAB 1: Curriculum / Settings (Section 14, 15, 16) */}
      {activeTab === 'curriculum' && (
        <div className="space-y-5">
          {/* Language Selector (English / French) */}
          <div
            className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            style={{
              padding: '14px 20px',
              marginBottom: '20px',
            }}
          >
            <div className="flex items-center gap-2.5">
              <Languages size={18} className="text-indigo-600 dark:text-indigo-400" />
              <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                {language === 'ar' ? 'اختر المنهاج اللغوي:' : 'Select Language Curriculum:'}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedCurriculumLanguage('English')}
                className={`rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCurriculumLanguage === 'English'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
                style={{ padding: '6px 14px' }}
              >
                English Curriculum (CEFR)
              </button>
              <button
                type="button"
                onClick={() => setSelectedCurriculumLanguage('French')}
                className={`rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCurriculumLanguage === 'French'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
                style={{ padding: '6px 14px' }}
              >
                French Curriculum (DELF)
              </button>
            </div>
          </div>

          {/* Level Cards Selector Bar with Reorder and Edit Actions */}
          <div
            className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3.5"
            style={{ marginBottom: '22px' }}
          >
            {currentLangLevels.map((lvl, lvlIdx) => (
              <div
                key={lvl.levelNumber}
                onClick={() => setSelectedLevelNumber(lvl.levelNumber)}
                className={`rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 shadow-2xs hover:scale-[1.01] active:scale-[0.99] relative group ${
                  selectedLevelNumber === lvl.levelNumber
                    ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 shadow-xs ring-2 ring-indigo-500/20'
                    : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
                style={{ padding: '12px 14px' }}
              >
                {/* Top Row: CEFR Code + Units Count */}
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-lg sm:text-xl" style={{ color: lvl.color }}>
                    {lvl.cefrCode}
                  </span>
                  <span
                    className="text-[11px] font-bold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    style={{ padding: '2px 8px' }}
                  >
                    {lvl.units.length} {language === 'ar' ? 'وحدات' : 'Units'}
                  </span>
                </div>

                {/* Level Title */}
                <div className="text-xs font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                  {lvl.nameAr}
                </div>

                {/* Bottom Row: Reorder Actions and Edit Button */}
                {currentRole !== 'teacher' && (
                  <div
                    className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 gap-1.5 mt-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Move Left / Prev */}
                    <button
                      type="button"
                      disabled={lvlIdx === 0}
                      onClick={(e) => handleMoveLevel(e, lvl.levelNumber, 'prev')}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                        lvlIdx === 0
                          ? 'opacity-20 cursor-not-allowed text-slate-400'
                          : 'hover:bg-indigo-100 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 cursor-pointer'
                      }`}
                      title={language === 'ar' ? 'تقديم المستوى (تحريك لليسار)' : 'Move level previous'}
                    >
                      <ChevronLeft size={15} />
                    </button>

                    {/* Edit Level Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(lvl)}
                      className="rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 font-bold text-[11px] flex items-center justify-center border border-indigo-200/80 dark:border-indigo-800/80 transition-colors cursor-pointer shadow-2xs"
                      style={{ padding: '3px 12px', gap: '5px' }}
                      title={language === 'ar' ? 'تعديل بيانات المستوى' : 'Edit Level'}
                    >
                      <Pencil size={11} className="shrink-0" />
                      <span className="leading-none">{language === 'ar' ? 'تعديل' : 'Edit'}</span>
                    </button>

                    {/* Move Right / Next */}
                    <button
                      type="button"
                      disabled={lvlIdx === currentLangLevels.length - 1}
                      onClick={(e) => handleMoveLevel(e, lvl.levelNumber, 'next')}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                        lvlIdx === currentLangLevels.length - 1
                          ? 'opacity-20 cursor-not-allowed text-slate-400'
                          : 'hover:bg-indigo-100 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 cursor-pointer'
                      }`}
                      title={language === 'ar' ? 'تأخير المستوى (تحريك لليمين)' : 'Move level next'}
                    >
                      <ChevronRight size={15} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Active Level Detailed Units & Lessons Breakdown (Section 16) */}
          {activeLevel && (
            <div
              className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs space-y-6"
              style={{ padding: '20px 24px', marginBottom: '28px' }}
            >
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center" style={{ gap: '14px' }}>
                    <span
                      className="rounded-xl font-mono font-black text-white text-xs shadow-xs shrink-0 flex items-center justify-center"
                      style={{
                        backgroundColor: activeLevel.color,
                        padding: '5px 12px',
                        marginInlineEnd: '4px',
                      }}
                    >
                      {activeLevel.cefrCode}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight">{activeLevel.nameAr}</h3>
                  </div>
                  <p className="text-xs text-slate-400 font-medium mt-1 leading-relaxed">{activeLevel.descriptionAr}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                  <span className="text-xs font-bold text-slate-400">
                    {activeLevel.units.length} {language === 'ar' ? 'وحدات تعليمية معتمدة' : 'Units'}
                  </span>

                  {currentRole !== 'teacher' && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(activeLevel)}
                        className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer hover:scale-105 active:scale-95"
                        style={{ padding: '7px 14px' }}
                        title={language === 'ar' ? 'تعديل بيانات المستوى ووحداته' : 'Edit Level & Units'}
                      >
                        <Pencil size={14} />
                        <span>{language === 'ar' ? 'تعديل المستوى' : 'Edit Level'}</span>
                      </button>

                      {currentLangLevels.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteLevel(activeLevel.levelNumber)}
                          className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-200 dark:border-rose-900/60 transition-colors cursor-pointer"
                          title={language === 'ar' ? 'حذف المستوى' : 'Delete Level'}
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Units List (Accordion Collapsible List) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {activeLevel.units.map((unit) => {
                  const isExpanded = expandedUnitId === unit.id;
                  return (
                    <div
                      key={unit.id}
                      className={`rounded-2xl border transition-all shadow-2xs overflow-hidden ${
                        isExpanded
                          ? 'bg-slate-50/90 dark:bg-slate-900/80 border-indigo-500/40'
                          : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      {/* Clickable Unit Header Row */}
                      <button
                        type="button"
                        onClick={() => toggleUnit(unit.id)}
                        className="w-full flex items-center justify-between gap-4 cursor-pointer text-start transition-colors"
                        style={{ padding: '14px 18px' }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                              isExpanded
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                            }`}
                          >
                            <Layers size={16} />
                          </div>
                          <div>
                            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-snug">
                              {unit.titleAr}
                            </h4>
                            <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                              {unit.titleEn}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0">
                          <span
                            className="text-[11px] font-mono font-bold text-purple-600 dark:text-purple-400 bg-white dark:bg-slate-850 rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs"
                            style={{ padding: '4px 10px' }}
                          >
                            {unit.lessons.length} {language === 'ar' ? 'دروس' : 'lessons'}
                          </span>
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-300 ${
                              isExpanded
                                ? 'rotate-180 bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600'
                                : 'bg-slate-200/60 dark:bg-slate-800 text-slate-500'
                            }`}
                          >
                            <ChevronDown size={15} />
                          </div>
                        </div>
                      </button>

                      {/* Collapsible Lessons List */}
                      {isExpanded && (
                        <div
                          className="border-t border-slate-200/60 dark:border-slate-800/80 space-y-2.5 animate-fade-in"
                          style={{ padding: '14px 18px 18px' }}
                        >
                          {unit.lessons.map((lesson, lIdx) => (
                            <div
                              key={lesson.id}
                              className="bg-white dark:bg-slate-850 rounded-xl border border-slate-200/80 dark:border-slate-750 space-y-2 shadow-2xs hover:border-indigo-500/40 transition-all"
                              style={{ padding: '12px 16px' }}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5">
                                  <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono font-black text-[11px] flex items-center justify-center shrink-0">
                                    {lIdx + 1}
                                  </span>
                                  <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                                    {lesson.titleAr}
                                  </span>
                                </div>
                                {lesson.hasAssessment && (
                                  <span
                                    className="text-[11px] font-bold rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0 self-start sm:self-auto"
                                    style={{ padding: '2px 10px' }}
                                  >
                                    اختبار مهارة ✓
                                  </span>
                                )}
                              </div>

                              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                                {lesson.contentSummary}
                              </p>

                              <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-800/60">
                                <span className="text-[10px] font-bold text-slate-400">
                                  {language === 'ar' ? 'المفردات الرئيسية:' : 'Key Vocabulary:'}
                                </span>
                                {lesson.vocabulary.map((vocab, vIdx) => (
                                  <span
                                    key={vIdx}
                                    className="rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-mono font-medium text-slate-700 dark:text-slate-300"
                                    style={{ padding: '2px 8px' }}
                                  >
                                    {vocab}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Student Progress (Back Office Spec: Groups -> Students -> Academic Progress) */}
      {activeTab === 'student_progress' && (
        <div className="animate-fade-in" style={{ marginBottom: '48px' }}>
          {/* LEVEL 1: Groups List Page */}
          {progressViewMode === 'groups' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {/* Container 1: KPI Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div
                  className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between"
                  style={{ padding: '18px 22px' }}
                >
                  <div>
                    <span className="text-xs font-bold text-slate-400 block">
                      {language === 'ar' ? 'إجمالي الأفواج الدراسية' : 'Total Groups'}
                    </span>
                    <span className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1 block">
                      {visibleGroups.length}
                    </span>
                    <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold mt-0.5 block">
                      {currentRole === 'teacher'
                        ? language === 'ar' ? 'أفواجك المسندة فقط' : 'Your assigned groups'
                        : language === 'ar' ? 'جميع الأفواج في المنظومة' : 'All platform groups'}
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black shrink-0">
                    <School size={22} />
                  </div>
                </div>

                <div
                  className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between"
                  style={{ padding: '18px 22px' }}
                >
                  <div>
                    <span className="text-xs font-bold text-slate-400 block">
                      {language === 'ar' ? 'إجمالي الطلاب المتابعين' : 'Total Students'}
                    </span>
                    <span className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-1 block">
                      {visibleStudents.length}
                    </span>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5 block">
                      {language === 'ar' ? 'مسجلون ونشطون' : 'Active & Enrolled'}
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black shrink-0">
                    <Users size={22} />
                  </div>
                </div>

                <div
                  className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between"
                  style={{ padding: '18px 22px' }}
                >
                  <div>
                    <span className="text-xs font-bold text-slate-400 block">
                      {language === 'ar' ? 'متوسط التقدم العام' : 'Overall Avg Progress'}
                    </span>
                    <span className="text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400 mt-1 block">
                      {visibleStudents.length
                        ? Math.round(
                            visibleStudents.reduce((acc, st) => acc + (st.overallProgress || 0), 0) /
                              visibleStudents.length
                          )
                        : 0}
                      %
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">
                      {language === 'ar' ? 'محسوب من إنجاز الدروس' : 'Calculated from lessons'}
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black shrink-0">
                    <TrendingUp size={22} />
                  </div>
                </div>

                <div
                  className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between"
                  style={{ padding: '18px 22px' }}
                >
                  <div>
                    <span className="text-xs font-bold text-slate-400 block">
                      {language === 'ar' ? 'المستويات الأكاديمية' : 'Curriculum Levels'}
                    </span>
                    <span className="text-2xl font-black font-mono text-purple-600 dark:text-purple-400 mt-1 block">
                      {curricula.length}
                    </span>
                    <span className="text-[11px] text-purple-600 dark:text-purple-400 font-bold mt-0.5 block">
                      A1, A2, B1, B2, C1
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-black shrink-0">
                    <Award size={22} />
                  </div>
                </div>
              </div>

              {/* Container 2: Filter & Search Bar */}
              <div
                className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                style={{ padding: '18px 24px' }}
              >
                {/* Search Box */}
                <div className="relative flex-1 min-w-[240px]">
                  <Search
                    size={16}
                    className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${
                      isRTL ? 'right-3.5' : 'left-3.5'
                    }`}
                  />
                  <input
                    type="text"
                    value={groupSearchQuery}
                    onChange={(e) => setGroupSearchQuery(e.target.value)}
                    placeholder={
                      language === 'ar'
                        ? 'بحث باسم الفوج أو المعلم...'
                        : 'Search by group or teacher name...'
                    }
                    className="w-full h-10 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-750 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-indigo-500 transition-colors"
                    style={{
                      paddingRight: isRTL ? '38px' : '16px',
                      paddingLeft: isRTL ? '16px' : '38px',
                    }}
                  />
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Language Filter */}
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setGroupLanguageFilter('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        groupLanguageFilter === 'all'
                          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {language === 'ar' ? 'الكل' : 'All'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setGroupLanguageFilter('English')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        groupLanguageFilter === 'English'
                          ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      🇬🇧 English
                    </button>
                    <button
                      type="button"
                      onClick={() => setGroupLanguageFilter('French')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        groupLanguageFilter === 'French'
                          ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      🇫🇷 French
                    </button>
                  </div>

                  {/* Level Code Filter */}
                  <select
                    value={groupLevelFilter}
                    onChange={(e) => setGroupLevelFilter(e.target.value)}
                    className="h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-750 rounded-xl text-xs font-bold focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="all">{language === 'ar' ? 'جميع المستويات' : 'All Levels'}</option>
                    <option value="A1">A1 — Breakthrough</option>
                    <option value="A2">A2 — Waystage</option>
                    <option value="B1">B1 — Threshold</option>
                    <option value="B2">B2 — Vantage</option>
                    <option value="C1">C1 — Proficiency</option>
                  </select>
                </div>
              </div>

              {/* Container 3: Section 2: Groups Table (Groups Page) */}
              <div className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xs overflow-hidden">
                <div
                  className="border-b border-slate-100 dark:border-slate-800 flex items-center justify-between"
                  style={{ padding: '20px 26px' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black shrink-0">
                      <Layers size={18} />
                    </div>
                    <div>
                      <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white">
                        {language === 'ar' ? 'قائمة الأفواج الدراسية' : 'Academic Groups Directory'}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {language === 'ar'
                          ? 'اختر أي فوج لعرض قائمة الطلاب ومتابعة تقدمهم عبر الوحدات والدروس'
                          : 'Select any group to view student list and track units/lessons progress'}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-slate-400 font-mono">
                    {filteredProgressGroups.length} {language === 'ar' ? 'أفواج' : 'Groups'}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className={`w-full text-xs ${isRTL ? 'text-right' : 'text-left'}`}>
                    <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-400 font-bold text-[11px]">
                      <tr>
                        <th
                          className={`font-extrabold ${isRTL ? 'text-right' : 'text-left'}`}
                          style={{
                            paddingTop: '16px',
                            paddingBottom: '16px',
                            paddingLeft: isRTL ? '20px' : '26px',
                            paddingRight: isRTL ? '26px' : '20px',
                          }}
                        >
                          {language === 'ar' ? 'الفوج (Group)' : 'Group'}
                        </th>
                        <th className="py-4 px-6 font-extrabold text-center">
                          {language === 'ar' ? 'اللغة (Language)' : 'Language'}
                        </th>
                        <th className="py-4 px-6 font-extrabold text-center">
                          {language === 'ar' ? 'المستوى (Level)' : 'Level'}
                        </th>
                        <th
                          className={`py-4 px-6 font-extrabold ${isRTL ? 'text-right' : 'text-left'}`}
                        >
                          {language === 'ar' ? 'المعلم (Teacher)' : 'Teacher'}
                        </th>
                        <th className="py-4 px-6 font-extrabold text-center">
                          {language === 'ar' ? 'الطلاب (Students)' : 'Students'}
                        </th>
                        <th className="py-4 px-8 font-extrabold text-center">
                          {language === 'ar' ? 'متوسط التقدم (Progress)' : 'Progress'}
                        </th>
                        <th
                          className="font-extrabold text-center"
                          style={{
                            paddingTop: '16px',
                            paddingBottom: '16px',
                            paddingRight: isRTL ? '26px' : '20px',
                            paddingLeft: isRTL ? '20px' : '26px',
                          }}
                        >
                          {language === 'ar' ? 'الإجراء' : 'Action'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredProgressGroups.map((grp) => {
                        const studentCount = grp.studentIds?.length || 0;
                        const groupProgress = grp.averageProgress || 0;
                        const levelColor =
                          grp.level === 'A1'
                            ? '#3B82F6'
                            : grp.level === 'A2'
                            ? '#8B5CF6'
                            : grp.level === 'B1'
                            ? '#10B981'
                            : grp.level === 'B2'
                            ? '#F59E0B'
                            : '#EC4899';

                        return (
                          <tr
                            key={grp.id}
                            onClick={() => handleOpenGroupDetail(grp.id)}
                            className="hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 transition-colors cursor-pointer group"
                          >
                            <td
                              className="py-4 font-bold text-slate-900 dark:text-white"
                              style={{
                                paddingLeft: isRTL ? '20px' : '26px',
                                paddingRight: isRTL ? '26px' : '20px',
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-black text-xs flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                  {grp.level}
                                </span>
                                <div>
                                  <span className="font-black text-xs sm:text-sm text-slate-900 dark:text-white block group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    {grp.name}
                                  </span>
                                  <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                                    {grp.code}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td className="py-4 px-6 text-center font-bold text-slate-600 dark:text-slate-300 text-xs">
                              <span className="inline-flex items-center gap-1.5">
                                <span>{grp.language === 'French' ? '🇫🇷' : '🇬🇧'}</span>
                                <span>{grp.language === 'French' ? 'French' : 'English'}</span>
                              </span>
                            </td>

                            <td className="py-4 px-6 text-center">
                              <span
                                className="inline-flex items-center justify-center px-3 py-1 rounded-lg text-white font-mono font-bold text-xs shadow-2xs"
                                style={{ backgroundColor: levelColor }}
                              >
                                {grp.level}
                              </span>
                            </td>

                            <td className="py-4 px-6 font-bold text-slate-700 dark:text-slate-300 text-xs">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold text-[10px] shrink-0">
                                  {grp.teacherName.slice(0, 1)}
                                </div>
                                <span className="whitespace-nowrap">{grp.teacherName}</span>
                              </div>
                            </td>

                            <td className="py-4 px-6 text-center font-mono font-bold text-slate-900 dark:text-white text-xs">
                              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
                                {studentCount} {language === 'ar' ? 'طلاب' : 'students'}
                              </span>
                            </td>

                            <td className="py-4 px-8 text-center">
                              <div className="flex items-center justify-center gap-3 min-w-[140px]">
                                <div className="flex-1 h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                  <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{
                                      width: `${groupProgress}%`,
                                      backgroundColor:
                                        groupProgress >= 80
                                          ? '#10B981'
                                          : groupProgress >= 50
                                          ? '#3B82F6'
                                          : '#F59E0B',
                                    }}
                                  />
                                </div>
                                <span className="font-mono font-black text-xs text-slate-900 dark:text-white shrink-0">
                                  {groupProgress}%
                                </span>
                              </div>
                            </td>

                            <td
                              className="py-4 text-center"
                              style={{
                                paddingRight: isRTL ? '26px' : '20px',
                                paddingLeft: isRTL ? '20px' : '26px',
                              }}
                            >
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenGroupDetail(grp.id);
                                }}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 font-bold text-xs border border-indigo-200/60 dark:border-indigo-800/60 transition-all cursor-pointer shadow-2xs mx-auto whitespace-nowrap"
                                style={{ padding: '8px 18px' }}
                              >
                                <span>{language === 'ar' ? 'عرض الفوج' : 'View Group'}</span>
                                {isRTL ? <ArrowLeft size={15} /> : <ArrowRight size={15} />}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* LEVEL 2: Group Detail Page */}
          {progressViewMode === 'group_detail' && activeProgressGroup && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {/* Back Button */}
              <div>
                <button
                  type="button"
                  onClick={handleBackToGroups}
                  className="self-start flex items-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer shadow-2xs"
                  style={{ padding: '9px 18px' }}
                >
                  {isRTL ? <ArrowRight size={15} /> : <ArrowLeft size={15} />}
                  <span>{language === 'ar' ? 'العودة لقائمة الأفواج' : 'Back to Groups'}</span>
                </button>
              </div>

              {/* Container 1: Group Summary Card */}
              <div
                className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                style={{ padding: '26px 30px' }}
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white font-mono font-black text-xs shadow-xs">
                      {activeProgressGroup.level}
                    </span>
                    <h3 className="font-black text-xl sm:text-2xl text-slate-900 dark:text-white">
                      {activeProgressGroup.name}
                    </h3>
                    <span className="text-xs text-slate-400 font-mono font-medium">
                      ({activeProgressGroup.code})
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-5 text-xs font-bold text-slate-500 dark:text-slate-400 pt-1">
                    <span className="flex items-center gap-1.5">
                      <Languages size={15} className="text-indigo-500" />
                      {activeProgressGroup.language === 'French' ? 'اللغة الفرنسية (DELF)' : 'اللغة الإنجليزية (CEFR)'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <GraduationCap size={15} className="text-purple-500" />
                      {language === 'ar' ? `المعلم: ${activeProgressGroup.teacherName}` : `Teacher: ${activeProgressGroup.teacherName}`}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Users size={15} className="text-emerald-500" />
                      {groupStudentsList.length} {language === 'ar' ? 'طلاب مسجلين' : 'Students'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={15} className="text-amber-500" />
                      {activeProgressGroup.daysAr} ({activeProgressGroup.startTime} - {activeProgressGroup.endTime})
                    </span>
                  </div>
                </div>

                {/* Group Average Progress Metric */}
                <div
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl flex items-center gap-4 shrink-0 shadow-2xs"
                  style={{ padding: '16px 24px' }}
                >
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block">
                      {language === 'ar' ? 'متوسط تقدم الفوج' : 'Average Group Progress'}
                    </span>
                    <span className="text-2xl font-black font-mono text-indigo-600 dark:text-indigo-400 block mt-0.5">
                      {activeProgressGroup.averageProgress || 0}%
                    </span>
                  </div>
                  <div className="w-13 h-13 rounded-full border-4 border-indigo-500/20 border-t-indigo-600 flex items-center justify-center font-bold text-xs font-mono">
                    {activeProgressGroup.averageProgress || 0}%
                  </div>
                </div>
              </div>

              {/* Container 2: Section 3: Students Table (Group Detail) */}
              <div className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xs overflow-hidden">
                <div
                  className="border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  style={{ padding: '20px 28px' }}
                >
                  <div>
                    <h4 className="font-black text-base sm:text-lg text-slate-900 dark:text-white">
                      {language === 'ar' ? 'طلاب الفوج والمسار الأكاديمي' : 'Students in Group & Academic Status'}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {language === 'ar'
                        ? 'انقر على زر "عرض" لفتح تفاصيل تقدم الطالب عبر الوحدات والدروس'
                        : 'Click "View" to open student units & lessons academic path'}
                    </p>
                  </div>

                  {/* Search Student Box */}
                  <div className="relative min-w-[240px]">
                    <Search
                      size={15}
                      className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${
                        isRTL ? 'right-3.5' : 'left-3.5'
                      }`}
                    />
                    <input
                      type="text"
                      value={studentSearchQuery}
                      onChange={(e) => setStudentSearchQuery(e.target.value)}
                      placeholder={language === 'ar' ? 'بحث عن طالب...' : 'Search student...'}
                      className="w-full h-10 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-750 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 transition-colors"
                      style={{
                        paddingRight: isRTL ? '36px' : '16px',
                        paddingLeft: isRTL ? '16px' : '36px',
                      }}
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className={`w-full text-xs ${isRTL ? 'text-right' : 'text-left'}`}>
                    <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-400 font-bold text-[11px]">
                      <tr>
                        <th
                          className={`font-extrabold w-[32%] ${isRTL ? 'text-right' : 'text-left'}`}
                          style={{
                            paddingTop: '16px',
                            paddingBottom: '16px',
                            paddingLeft: isRTL ? '20px' : '28px',
                            paddingRight: isRTL ? '28px' : '20px',
                          }}
                        >
                          {language === 'ar' ? 'اسم الطالب (Student)' : 'Student'}
                        </th>
                        <th className="py-4 px-8 font-extrabold text-center w-[28%]">
                          {language === 'ar' ? 'التقدم الإجمالي (Overall Progress)' : 'Overall Progress'}
                        </th>
                        <th className="py-4 px-6 font-extrabold text-center w-[16%]">
                          {language === 'ar' ? 'الوحدة الحالية (Current Unit)' : 'Current Unit'}
                        </th>
                        <th className="py-4 px-6 font-extrabold text-center w-[12%]">
                          {language === 'ar' ? 'الحالة (Status)' : 'Status'}
                        </th>
                        <th
                          className="font-extrabold text-center w-[12%]"
                          style={{
                            paddingTop: '16px',
                            paddingBottom: '16px',
                            paddingRight: isRTL ? '28px' : '20px',
                            paddingLeft: isRTL ? '20px' : '28px',
                          }}
                        >
                          {language === 'ar' ? 'الإجراء (Action)' : 'Action'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredGroupStudents.map((st) => {
                        const progress = st.overallProgress || 0;
                        const statusLabel =
                          progress === 100
                            ? language === 'ar' ? 'مكتمل' : 'Completed'
                            : progress > 0
                            ? language === 'ar' ? 'قيد التقدم' : 'In Progress'
                            : language === 'ar' ? 'لم يبدأ' : 'Not Started';

                        const currentUnitNumber = Math.min(
                          Math.floor((progress / 100) * 3) + 1,
                          3
                        );

                        return (
                          <tr
                            key={st.id}
                            onClick={() => handleOpenStudentDetail(st.id)}
                            className="hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 transition-colors cursor-pointer group"
                          >
                            <td
                              className="py-4.5 font-bold text-slate-900 dark:text-white"
                              style={{
                                paddingLeft: isRTL ? '20px' : '28px',
                                paddingRight: isRTL ? '28px' : '20px',
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                                  {st.fullNameAr.slice(0, 1)}
                                </div>
                                <div>
                                  <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white block group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    {st.fullNameAr}
                                  </span>
                                  <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                                    {st.fullNameEn} • {st.id}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td className="py-4.5 px-8">
                              <div className="flex items-center justify-center gap-3.5 w-full max-w-[200px] mx-auto">
                                <div className="flex-1 h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                  <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{
                                      width: `${progress}%`,
                                      backgroundColor:
                                        progress >= 80 ? '#10B981' : progress >= 50 ? '#3B82F6' : '#F59E0B',
                                    }}
                                  />
                                </div>
                                <span className="font-mono font-black text-xs text-slate-900 dark:text-white shrink-0 min-w-[38px] text-right">
                                  {progress}%
                                </span>
                              </div>
                            </td>

                            <td className="py-4.5 px-6 text-center">
                              <span className="inline-flex items-center justify-center px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs">
                                {language === 'ar' ? `الوحدة ${currentUnitNumber}` : `Unit ${currentUnitNumber}`}
                              </span>
                            </td>

                            <td className="py-4.5 px-6 text-center">
                              <span
                                className={`inline-flex items-center justify-center font-bold text-xs border whitespace-nowrap ${
                                  progress === 100
                                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-800/80'
                                    : progress > 0
                                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200/80 dark:border-indigo-800/80'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                                }`}
                                style={{ padding: '6px 16px', borderRadius: '12px' }}
                              >
                                {statusLabel}
                              </span>
                            </td>

                            <td
                              className="py-4.5 text-center"
                              style={{
                                paddingRight: isRTL ? '28px' : '20px',
                                paddingLeft: isRTL ? '20px' : '28px',
                              }}
                            >
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenStudentDetail(st.id);
                                }}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-2xs hover:shadow-md transition-all cursor-pointer whitespace-nowrap mx-auto"
                                style={{ padding: '8px 18px' }}
                              >
                                <Eye size={15} className="shrink-0" />
                                <span>{language === 'ar' ? 'عرض التقدم' : 'View'}</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* LEVEL 3: Student Academic Progress Detail */}
          {progressViewMode === 'student_detail' && activeProgressStudent && studentCurriculumLevel && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {/* Back Button & Navigation Bar */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <button
                    type="button"
                    onClick={handleBackToGroups}
                    className="hover:text-indigo-600 cursor-pointer transition-colors"
                  >
                    {language === 'ar' ? 'الأفواج' : 'Groups'}
                  </button>
                  <span>/</span>
                  <button
                    type="button"
                    onClick={handleBackToGroupDetail}
                    className="hover:text-indigo-600 cursor-pointer transition-colors"
                  >
                    {activeProgressGroup?.name || activeProgressStudent.groupName}
                  </button>
                  <span>/</span>
                  <span className="text-slate-900 dark:text-white">
                    {activeProgressStudent.fullNameAr}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={handleBackToGroupDetail}
                    className="flex items-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer shadow-2xs"
                    style={{ padding: '9px 18px' }}
                  >
                    {isRTL ? <ArrowRight size={15} /> : <ArrowLeft size={15} />}
                    <span>{language === 'ar' ? 'العودة للفوج' : 'Back to Group'}</span>
                  </button>
                </div>
              </div>

              {/* Container 1: Student Profile & Progress Banner */}
              <div
                className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
                style={{ padding: '26px 30px' }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black text-xl flex items-center justify-center shrink-0 shadow-md">
                    {activeProgressStudent.fullNameAr.slice(0, 1)}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="font-black text-xl sm:text-2xl text-slate-900 dark:text-white">
                        {activeProgressStudent.fullNameAr}
                      </h3>
                      <span
                        className="px-2.5 py-0.5 rounded-lg text-white font-mono font-bold text-xs shadow-2xs"
                        style={{ backgroundColor: studentCurriculumLevel.color }}
                      >
                        {studentCurriculumLevel.cefrCode} — {studentCurriculumLevel.language}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium mt-1">
                      {language === 'ar' ? `المعلم المسؤول: ${activeProgressStudent.teacherName}` : `Teacher: ${activeProgressStudent.teacherName}`} • {activeProgressStudent.groupName}
                    </p>
                  </div>
                </div>

                {/* Calculated Overall Progress Card */}
                <div
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl flex items-center gap-4 shrink-0 shadow-2xs"
                  style={{ padding: '16px 24px' }}
                >
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block">
                      {language === 'ar' ? 'التقدم الأكاديمي الإجمالي' : 'Overall Progress'}
                    </span>
                    <span className="text-2xl sm:text-3xl font-black font-mono text-indigo-600 dark:text-indigo-400 block mt-0.5">
                      {activeProgressStudent.overallProgress || 0}%
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block mt-0.5">
                      {language === 'ar' ? 'محتسب تلقائياً من الدروس المنجزة ✓' : 'Auto-calculated from lessons ✓'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Container 2: Section 4, 5, 6: Units & Lessons Breakdown with 3 Interactive States */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="flex items-center justify-between" style={{ paddingBottom: '4px' }}>
                  <h4 className="font-black text-base sm:text-lg text-slate-900 dark:text-white flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                      <BookOpen size={17} />
                    </div>
                    <span>{language === 'ar' ? 'تفاصيل الوحدات والدروس ومستويات الإنجاز' : 'Curriculum Units & Lessons Progress'}</span>
                  </h4>
                  <span className="text-xs font-bold text-slate-400 font-mono bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl">
                    {studentCurriculumLevel.units.length} {language === 'ar' ? 'وحدات' : 'Units'}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                  {studentCurriculumLevel.units.map((unit, uIdx) => {
                    const totalLessons = unit.lessons.length || 1;
                    const completedLessons = unit.lessons.filter(
                      (l) => (lessonProgressRecords[`${activeProgressStudent.id}_${l.id}`] || 'not_started') === 'completed'
                    ).length;
                    const inProgressLessons = unit.lessons.filter(
                      (l) => (lessonProgressRecords[`${activeProgressStudent.id}_${l.id}`] || 'not_started') === 'in_progress'
                    ).length;

                    // Unit Progress Formula: Completed Lessons ÷ Total Lessons × 100
                    const unitPercentage = Math.round((completedLessons / totalLessons) * 100);

                    const isUnitCompleted = unitPercentage === 100;
                    const isUnitInProgress = completedLessons > 0 || inProgressLessons > 0;

                    return (
                      <div
                        key={unit.id}
                        className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xs overflow-hidden"
                      >
                        {/* Unit Header Bar */}
                        <div
                          className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                          style={{ padding: '20px 28px' }}
                        >
                          <div className="flex items-center gap-3.5">
                            <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                              {uIdx + 1}
                            </span>
                            <div>
                              <div className="flex items-center gap-2.5">
                                <h5 className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                                  {unit.titleAr}
                                </h5>
                                <span className="text-xs text-slate-400 font-mono font-medium">
                                  ({unit.titleEn})
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-400 font-bold block mt-0.5">
                                {completedLessons} {language === 'ar' ? 'من' : 'of'} {totalLessons} {language === 'ar' ? 'دروس مكتملة' : 'lessons completed'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            {/* Unit Progress Badge */}
                            <span
                              className={`px-3 py-1 rounded-full font-mono font-black text-xs border flex items-center gap-1.5 ${
                                isUnitCompleted
                                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-800/80'
                                  : isUnitInProgress
                                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200/80 dark:border-indigo-800/80'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              <span>{unitPercentage}%</span>
                              <span>{isUnitCompleted ? '✓' : isUnitInProgress ? '●' : '■'}</span>
                            </span>

                            {/* Mark Unit All Complete Button */}
                            {!isUnitCompleted && (
                              <button
                                type="button"
                                onClick={() => handleMarkUnitComplete(unit.id)}
                                className="px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800 transition-colors cursor-pointer shadow-2xs"
                                title={language === 'ar' ? 'تعليم جميع دروس الوحدة كمكتملة' : 'Mark all unit lessons completed'}
                              >
                                <CheckCircle2 size={14} />
                                <span>{language === 'ar' ? 'إتمام الوحدة' : 'Complete All'}</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Lessons List inside Unit */}
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                          {unit.lessons.map((lesson, lIdx) => {
                            const currentStatus =
                              lessonProgressRecords[`${activeProgressStudent.id}_${lesson.id}`] || 'not_started';

                            return (
                              <div
                                key={lesson.id}
                                className="flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-900/30"
                                style={{ padding: '18px 28px' }}
                              >
                              {/* Left: Lesson Info */}
                              <div className="space-y-1.5 flex-1">
                                <div className="flex items-center gap-2.5">
                                  <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono font-bold text-[11px] flex items-center justify-center shrink-0">
                                    {lIdx + 1}
                                  </span>
                                  <h6 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                                    {lesson.titleAr}
                                  </h6>
                                  <span className="text-xs text-slate-400 font-mono">
                                    ({lesson.titleEn})
                                  </span>

                                  {lesson.hasAssessment && (
                                    <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 font-bold text-[10px] border border-amber-200/80 dark:border-amber-800/80">
                                      {language === 'ar' ? 'اختبار مهارة ✓' : 'Assessment'}
                                    </span>
                                  )}
                                </div>

                                <p className="text-xs text-slate-400 leading-relaxed">
                                  {lesson.contentSummary}
                                </p>

                                {lesson.vocabulary?.length > 0 && (
                                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                    <span className="text-[10px] font-bold text-slate-400">
                                      {language === 'ar' ? 'المفردات:' : 'Vocab:'}
                                    </span>
                                    {lesson.vocabulary.map((vocab, vIdx) => (
                                      <span
                                        key={vIdx}
                                        className="rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-300"
                                        style={{ padding: '1px 6px' }}
                                      >
                                        {vocab}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Right: Interactive 3-State Toggle (Section 5 of PDF) */}
                              <div
                                className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shrink-0 self-start md:self-center shadow-2xs"
                              >
                                {/* 1. Not Started */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateLessonProgress(
                                      activeProgressStudent.id,
                                      lesson.id,
                                      'not_started',
                                      studentCurriculumLevel.levelNumber
                                    )
                                  }
                                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                                    currentStatus === 'not_started'
                                      ? 'bg-white dark:bg-slate-750 text-slate-700 dark:text-slate-200 shadow-xs ring-1 ring-slate-300 dark:ring-slate-600'
                                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                                  }`}
                                >
                                  <Circle size={12} />
                                  <span>{language === 'ar' ? 'لم يبدأ' : 'Not Started'}</span>
                                </button>

                                {/* 2. In Progress */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateLessonProgress(
                                      activeProgressStudent.id,
                                      lesson.id,
                                      'in_progress',
                                      studentCurriculumLevel.levelNumber
                                    )
                                  }
                                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                                    currentStatus === 'in_progress'
                                      ? 'bg-amber-500 text-white shadow-xs ring-2 ring-amber-400/40'
                                      : 'text-slate-400 hover:text-amber-600'
                                  }`}
                                >
                                  <CircleDot size={12} />
                                  <span>{language === 'ar' ? 'قيد التقدم' : 'In Progress'}</span>
                                </button>

                                {/* 3. Completed */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateLessonProgress(
                                      activeProgressStudent.id,
                                      lesson.id,
                                      'completed',
                                      studentCurriculumLevel.levelNumber
                                    )
                                  }
                                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                                    currentStatus === 'completed'
                                      ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-400/40'
                                      : 'text-slate-400 hover:text-emerald-600'
                                  }`}
                                >
                                  <CheckCircle size={12} />
                                  <span>{language === 'ar' ? 'مكتمل ✓' : 'Completed'}</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal: Create Level (Step 1: Level Details & Step 2: Units & Lessons Configuration) */}
      {isAddLevelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in select-none">
          {/* STEP 1: Basic Level Details */}
          {modalStep === 'basic' && (
            <div
              className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 animate-fade-in-up"
              style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '18px' }}
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
                <div>
                  <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 block">
                    {language === 'ar' ? 'الخطوة 1 من 2: بيانات المستوى الأساسية' : 'Step 1 of 2: Basic Level Info'}
                  </span>
                  <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white mt-0.5">
                    {editingLevelNumber !== null
                      ? (language === 'ar' ? 'تعديل بيانات المنهاج والمستوى' : 'Edit Curriculum Level')
                      : (language === 'ar' ? 'إضافة مستوى دراسي جديد' : 'Create New Level')}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 cursor-pointer transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <form
                onSubmit={handleProceedToUnits}
                style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
              >
                {/* Curriculum Subject / Language Selection */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 text-xs font-bold mb-1.5">
                    {language === 'ar' ? 'المادة / المنهاج اللغوي (Subject / Language) *' : 'Curriculum Subject / Language *'}
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setNewLevelLanguage('English')}
                      className={`h-10 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                        newLevelLanguage === 'English'
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750'
                      }`}
                    >
                      <span className="text-sm">🇬🇧</span>
                      <span>{language === 'ar' ? 'اللغة الإنجليزية' : 'English (CEFR)'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setNewLevelLanguage('French')}
                      className={`h-10 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                        newLevelLanguage === 'French'
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750'
                      }`}
                    >
                      <span className="text-sm">🇫🇷</span>
                      <span>{language === 'ar' ? 'اللغة الفرنسية' : 'French (DELF)'}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 text-xs font-bold mb-1.5">
                    {language === 'ar' ? 'اسم المستوى بالعربية *' : 'Level Name (Arabic) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newLevelNameAr}
                    onChange={(e) => setNewLevelNameAr(e.target.value)}
                    placeholder="مثال: المستوى A1 — المبتدئ والتأسيس"
                    className="w-full h-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-indigo-500 transition-colors"
                    style={{ paddingLeft: '16px', paddingRight: '16px' }}
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 text-xs font-bold mb-1.5">
                    {language === 'ar' ? 'اسم المستوى بالإنجليزية (اختياري)' : 'Level Name (English)'}
                  </label>
                  <input
                    type="text"
                    value={newLevelNameEn}
                    onChange={(e) => setNewLevelNameEn(e.target.value)}
                    placeholder="e.g. Level A1 — Beginner & Foundation"
                    className="w-full h-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-indigo-500 transition-colors"
                    style={{ paddingLeft: '16px', paddingRight: '16px' }}
                    dir="ltr"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 text-xs font-bold mb-1.5">
                      {language === 'ar' ? 'رمز المستوى (CEFR) *' : 'CEFR Code *'}
                    </label>
                    <select
                      value={newLevelCode}
                      onChange={(e) => setNewLevelCode(e.target.value as any)}
                      className="w-full h-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs sm:text-sm font-bold focus:outline-none focus:border-indigo-500 transition-colors"
                      style={{ paddingLeft: '14px', paddingRight: '14px' }}
                    >
                      <option value="A1">A1 — Breakthrough</option>
                      <option value="A2">A2 — Waystage</option>
                      <option value="B1">B1 — Threshold</option>
                      <option value="B2">B2 — Vantage</option>
                      <option value="C1">C1 — Effective Proficiency</option>
                      <option value="C2">C2 — Mastery</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 text-xs font-bold mb-1.5">
                      {language === 'ar' ? 'عدد الوحدات الأولية' : 'Initial Units Count'}
                    </label>
                    <input
                      type="number"
                      value={newUnitsCount}
                      onChange={(e) => setNewUnitsCount(Math.max(1, Number(e.target.value)))}
                      min={1}
                      max={12}
                      className="w-full h-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs sm:text-sm font-bold focus:outline-none focus:border-indigo-500 transition-colors"
                      style={{ paddingLeft: '16px', paddingRight: '16px' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 text-xs font-bold mb-1.5">
                    {language === 'ar' ? 'وصف مخرجات التعلم' : 'Learning Outcomes Description'}
                  </label>
                  <textarea
                    rows={2}
                    value={newLevelDescAr}
                    onChange={(e) => setNewLevelDescAr(e.target.value)}
                    placeholder="اكتساب المفردات الأساسية وتكوين الجمل البسيطة..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-indigo-500 transition-colors resize-none leading-relaxed"
                    style={{ padding: '12px 16px' }}
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 text-xs font-bold mb-1.5">
                    {language === 'ar' ? 'اللون المميز للمستوى (Theme Color)' : 'Level Color'}
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={newLevelColor}
                      onChange={(e) => setNewLevelColor(e.target.value)}
                      className="w-12 h-10 p-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer"
                    />
                    <span className="font-mono text-xs font-bold text-slate-600 dark:text-slate-400">
                      {newLevelColor}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-2"
                  >
                    <span>{language === 'ar' ? 'التالي: إدخال الوحدات والدروس' : 'Next: Configure Units & Lessons'}</span>
                    {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 2: Configure Units and Lessons Popup */}
          {modalStep === 'units' && (
            <div
              className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 animate-fade-in-up flex flex-col max-h-[90vh] overflow-hidden"
            >
              {/* Step 2 Header */}
              <div
                className="bg-slate-900 text-white flex items-center justify-between shrink-0"
                style={{ padding: '18px 26px' }}
              >
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setModalStep('basic')}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                    title={language === 'ar' ? 'رجوع' : 'Back'}
                  >
                    {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
                  </button>
                  <div>
                    <div className="flex items-center" style={{ gap: '14px' }}>
                      <span
                        className="rounded-xl text-white font-mono font-bold text-xs shadow-xs shrink-0 flex items-center justify-center"
                        style={{
                          backgroundColor: newLevelColor,
                          padding: '5px 14px',
                          marginInlineEnd: '4px',
                        }}
                      >
                        {newLevelCode}
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-white leading-tight">{newLevelNameAr}</h3>
                    </div>
                    <p className="text-xs text-slate-400 font-medium mt-1">
                      {language === 'ar'
                        ? 'الخطوة 2: تحديد مسميات الوحدات وتفاصيل الدروس والمفردات والتقييمات'
                        : 'Step 2: Enter unit names, lessons, vocabulary, and assessments'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Step 2 Action Bar */}
              <div
                className="bg-slate-100 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0"
                style={{ padding: '12px 24px' }}
              >
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                  <Layers size={16} className="text-indigo-600 dark:text-indigo-400" />
                  <span>
                    {language === 'ar'
                      ? `إجمالي الوحدات: ${unitsDraft.length} | إجمالي الدروس: ${unitsDraft.reduce((acc, u) => acc + u.lessons.length, 0)}`
                      : `Total Units: ${unitsDraft.length} | Total Lessons: ${unitsDraft.reduce((acc, u) => acc + u.lessons.length, 0)}`}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleAddUnit}
                  className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  style={{ padding: '7px 16px' }}
                >
                  <Plus size={15} />
                  <span>{language === 'ar' ? 'إضافة وحدة جديدة' : 'Add New Unit'}</span>
                </button>
              </div>

              {/* Step 2 Scrollable Units and Lessons List */}
              <div
                className="overflow-y-auto flex-1"
                style={{
                  padding: '24px 28px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                }}
              >
                {unitsDraft.map((unit, uIdx) => {
                  const isExpanded = expandedDraftUnitIds.includes(unit.id);
                  return (
                    <div
                      key={unit.id}
                      className="bg-slate-50 dark:bg-slate-800/60 rounded-3xl border border-slate-200 dark:border-slate-750 shadow-xs transition-all"
                      style={{
                        padding: isExpanded ? '22px 24px' : '16px 20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: isExpanded ? '20px' : '0px',
                      }}
                    >
                      {/* Unit Header: Clickable Accordion Bar */}
                      <div
                        onClick={() => toggleDraftUnit(unit.id)}
                        className="flex items-center justify-between transition-all cursor-pointer select-none border-slate-200/80 dark:border-slate-700/80"
                        style={{
                          paddingBottom: isExpanded ? '18px' : '0px',
                          marginBottom: isExpanded ? '16px' : '0px',
                          borderBottomWidth: isExpanded ? '1px' : '0px',
                          borderBottomStyle: 'solid',
                        }}
                      >
                        <div className="flex items-center gap-3.5" style={{ gap: '14px' }}>
                          <span className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                            {uIdx + 1}
                          </span>
                          <div>
                            <div className="flex items-center" style={{ gap: '12px' }}>
                              <h4 className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                                {unit.titleAr ? unit.titleAr : (language === 'ar' ? `الوحدة ${uIdx + 1}` : `Unit ${uIdx + 1}`)}
                              </h4>
                              <span
                                className="rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-[11px] border border-indigo-200/60 dark:border-indigo-800/60"
                                style={{ padding: '3px 10px', marginInlineStart: '6px' }}
                              >
                                {language === 'ar' ? `${unit.lessons.length} دروس` : `${unit.lessons.length} Lessons`}
                              </span>
                            </div>
                            {!isExpanded && unit.titleEn && (
                              <p className="text-xs font-mono text-slate-400 mt-1">
                                {unit.titleEn}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => {
                              if (!isExpanded) toggleDraftUnit(unit.id);
                              handleAddLesson(unit.id);
                            }}
                            className="rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center gap-1.5 border border-indigo-200 dark:border-indigo-800 transition-colors cursor-pointer shadow-2xs"
                            style={{ padding: '7px 14px' }}
                          >
                            <Plus size={14} />
                            <span>{language === 'ar' ? 'إضافة درس' : 'Add Lesson'}</span>
                          </button>

                          {unitsDraft.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveUnit(unit.id)}
                              className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-200 dark:border-rose-900/60 transition-colors cursor-pointer"
                              title={language === 'ar' ? 'حذف الوحدة' : 'Delete Unit'}
                            >
                              <Trash2 size={15} />
                            </button>
                          )}

                          <div
                            onClick={() => toggleDraftUnit(unit.id)}
                            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700/60 text-slate-500 dark:text-slate-300 flex items-center justify-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                          >
                            <ChevronDown
                              size={18}
                              className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Expanded Unit Body */}
                      {isExpanded && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                          {/* Unit Titles Inputs Row */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <div>
                              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                                {language === 'ar' ? 'اسم الوحدة بالعربية *' : 'Unit Title (Arabic) *'}
                              </label>
                              <input
                                type="text"
                                value={unit.titleAr}
                                onChange={(e) => handleUpdateUnit(unit.id, { titleAr: e.target.value })}
                                placeholder={language === 'ar' ? `مثال: الوحدة ${uIdx + 1}: محاور التأسيس` : `Unit ${uIdx + 1} Title (AR)`}
                                className="w-full h-11 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                style={{ paddingLeft: '18px', paddingRight: '18px' }}
                                dir="rtl"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                                {language === 'ar' ? 'اسم الوحدة بالإنجليزية:' : 'Unit Title (English):'}
                              </label>
                              <input
                                type="text"
                                value={unit.titleEn}
                                onChange={(e) => handleUpdateUnit(unit.id, { titleEn: e.target.value })}
                                placeholder={`e.g. Unit ${uIdx + 1}: Core Foundations`}
                                className="w-full h-11 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors"
                                style={{ paddingLeft: '18px', paddingRight: '18px' }}
                                dir="ltr"
                              />
                            </div>
                          </div>

                          {/* Lessons in this Unit */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                                {language === 'ar' ? `دروس ومحتويات الوحدة (${unit.lessons.length} دروس)` : `Unit Lessons (${unit.lessons.length} Lessons)`}
                              </span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                              {unit.lessons.map((lesson, lIdx) => (
                                <div
                                  key={lesson.id}
                                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-750 shadow-2xs hover:border-indigo-300 dark:hover:border-indigo-800 transition-all"
                                  style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}
                                >
                                  {/* Lesson Top Bar: Number, Label, and Delete */}
                                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                                    <div className="flex items-center gap-2">
                                      <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                                        {lIdx + 1}
                                      </span>
                                      <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                                        {language === 'ar' ? `الدرس رقم ${lIdx + 1}` : `Lesson #${lIdx + 1}`}
                                      </span>
                                    </div>

                                    {unit.lessons.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveLesson(unit.id, lesson.id)}
                                        className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/60 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                                        title={language === 'ar' ? 'حذف الدرس' : 'Delete Lesson'}
                                      >
                                        <Trash2 size={13} />
                                      </button>
                                    )}
                                  </div>

                                  {/* Lesson Titles Row */}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-[11px] font-bold text-slate-400 mb-1">
                                        {language === 'ar' ? 'عنوان الدرس (عربي) *' : 'Lesson Title (Arabic) *'}
                                      </label>
                                      <input
                                        type="text"
                                        value={lesson.titleAr}
                                        onChange={(e) => handleUpdateLesson(unit.id, lesson.id, { titleAr: e.target.value })}
                                        placeholder={language === 'ar' ? `عنوان الدرس ${lIdx + 1}` : `Lesson ${lIdx + 1} Title (AR)`}
                                        className="w-full h-10 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                        style={{ paddingLeft: '16px', paddingRight: '16px' }}
                                        dir="rtl"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[11px] font-bold text-slate-400 mb-1">
                                        {language === 'ar' ? 'عنوان الدرس (إنجليزي):' : 'Lesson Title (English):'}
                                      </label>
                                      <input
                                        type="text"
                                        value={lesson.titleEn}
                                        onChange={(e) => handleUpdateLesson(unit.id, lesson.id, { titleEn: e.target.value })}
                                        placeholder={`Lesson ${lIdx + 1} Title (EN)`}
                                        className="w-full h-10 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors"
                                        style={{ paddingLeft: '16px', paddingRight: '16px' }}
                                        dir="ltr"
                                      />
                                    </div>
                                  </div>

                                  {/* Lesson Summary & Vocabulary inputs */}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-[11px] font-bold text-slate-400 mb-1">
                                        {language === 'ar' ? 'ملخص محتوى الدرس:' : 'Lesson Content Summary:'}
                                      </label>
                                      <input
                                        type="text"
                                        value={lesson.contentSummary}
                                        onChange={(e) => handleUpdateLesson(unit.id, lesson.id, { contentSummary: e.target.value })}
                                        placeholder={language === 'ar' ? 'ملخص ومخرجات الدرس...' : 'Lesson content summary...'}
                                        className="w-full h-10 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-600 dark:text-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                                        style={{ paddingLeft: '16px', paddingRight: '16px' }}
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-[11px] font-bold text-slate-400 mb-1">
                                        {language === 'ar' ? 'المفردات المفتاحية:' : 'Key Vocabulary (comma-separated):'}
                                      </label>
                                      <input
                                        type="text"
                                        value={lesson.vocabString}
                                        onChange={(e) => handleUpdateLesson(unit.id, lesson.id, { vocabString: e.target.value })}
                                        placeholder={language === 'ar' ? 'المفردات (مفصولة بفواصل)' : 'Key Vocabulary (comma-separated)'}
                                        className="w-full h-10 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-600 dark:text-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                                        style={{ paddingLeft: '16px', paddingRight: '16px' }}
                                        dir="ltr"
                                      />
                                    </div>
                                  </div>

                                  {/* Assessment Checkbox */}
                                  <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800">
                                    <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs font-bold text-slate-600 dark:text-slate-300">
                                      <input
                                        type="checkbox"
                                        checked={lesson.hasAssessment}
                                        onChange={(e) => handleUpdateLesson(unit.id, lesson.id, { hasAssessment: e.target.checked })}
                                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                      />
                                      <span>{language === 'ar' ? 'يتضمن اختبار كفاءة وتقييم مهارة ✓' : 'Includes skill assessment checkpoint ✓'}</span>
                                    </label>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Step 2 Footer */}
              <div
                className="bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0"
                style={{ padding: '16px 26px' }}
              >
                <button
                  type="button"
                  onClick={() => setModalStep('basic')}
                  className="rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  style={{ padding: '9px 20px' }}
                >
                  {isRTL ? <ArrowRight size={15} /> : <ArrowLeft size={15} />}
                  <span>{language === 'ar' ? 'رجوع لتعديل البيانات' : 'Back to Level Info'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleFinalSaveLevel}
                  className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                  style={{ padding: '10px 26px' }}
                >
                  <Check size={16} />
                  <span>
                    {editingLevelNumber !== null
                      ? (language === 'ar' ? 'حفظ التعديلات في المنهاج' : 'Save Changes to Curriculum')
                      : (language === 'ar' ? 'حفظ واعتماد المستوى في المنهاج' : 'Save Level to Curriculum')}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
