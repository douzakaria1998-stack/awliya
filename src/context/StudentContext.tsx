'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  Student,
  AcademicLevel,
  Homework,
  AttendanceRecord,
  AttendanceSummary,
  Assessment,
  TeacherFeedback,
  Fee,
  PaymentRecord,
  FinancialSummary,
  Notification,
  NotificationSettings,
  LevelId,
  LevelModule,
  LevelLessonItem,
  LevelStatus,
  HomeworkStatus,
} from '@/types';
import { AdminStudent, AdminParent, CurriculumLevel, LessonProgressStatus, AttendanceSession, AdminHomeworkAssignment } from '@/types/admin';
import { getItem, setItem } from '@/lib/localStorage';
import { STORAGE_KEYS, SHOW_FINANCIALS_TAB } from '@/lib/constants';
import {
  mockStudents,
  getAcademicLevelsForStudent,
  mockHomeworkMap,
  getAttendanceDataForStudent,
  mockAssessmentsMap,
  mockTeacherFeedbackMap,
  mockFees,
  mockPayments,
  mockNotifications,
  mockNotificationSettings,
  getFinancialSummaryForStudent,
} from '@/data/mock';
import { mockAdminStudents, mockAdminParents, mockCurricula, mockTwoWayFeedback } from '@/data/adminMock';
import { useTheme } from './ThemeContext';
import { useAuth } from './AuthContext';

const emptyAttendanceSummary: AttendanceSummary = {
  totalDays: 0,
  presentDays: 0,
  absentDays: 0,
  lateDays: 0,
  excusedDays: 0,
  attendancePercentage: 0,
};

export const emptyStudent: Student = {
  id: '',
  parentId: '',
  fullNameAr: '',
  firstNameAr: '',
  lastNameAr: '',
  birthday: '',
  schoolLevelAr: '',
  nicknameAr: '',
  enrolledPathAr: '',
  currentLevel: 1 as LevelId,
  currentLevelProgress: 0,
  studentIdNumber: '',
  academicYearAr: '',
  branchAr: '',
  timingAr: '',
  enrollmentDate: '',
  age: 0,
};

interface StudentContextType {
  students: Student[];
  activeStudent: Student;
  activeStudentId: string;
  setActiveStudentId: (id: string) => void;
  addStudent: (data: {
    fullNameAr?: string;
    firstNameAr?: string;
    lastNameAr?: string;
    birthday?: string;
    schoolLevelAr?: string;
    timingAr?: string;
    status?: 'active' | 'pending';
    nicknameAr?: string;
    enrolledPathAr: string;
    currentLevel?: LevelId;
    age?: number;
    branchAr?: string;
  }) => Student;
  approveStudent: (id: string) => void;
  updateStudent: (id: string, data: Partial<Student>) => void;
  academicLevels: AcademicLevel[];
  homeworkList: Homework[];
  attendanceData: { records: AttendanceRecord[]; summary: AttendanceSummary };
  assessments: Assessment[];
  teacherFeedback: TeacherFeedback[];
  fees: Fee[];
  payments: PaymentRecord[];
  financialSummary: FinancialSummary;
  notifications: Notification[];
  notificationSettings: NotificationSettings;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  payFee: (feeId: string, methodAr: string) => void;
  submitHomeworkRevision: (homeworkId: string, note?: string) => void;
  activeLevelId: LevelId;
  changeActiveStudentLevel: (newLevel: LevelId) => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export function StudentProvider({ children }: { children: React.ReactNode }) {
  const { setLevel } = useTheme();
  const { parent } = useAuth();

  // 1. Initial states are strictly deterministic for SSR matching
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [activeStudentId, setActiveStudentIdState] = useState<string>(mockStudents[0]?.id || '');
  const [homeworkMap, setHomeworkMap] = useState<Record<string, Homework[]>>(mockHomeworkMap);
  const [fees, setFees] = useState<Fee[]>(mockFees);
  const [payments, setPayments] = useState<PaymentRecord[]>(mockPayments);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(mockNotificationSettings);

  // Sync from localStorage after client mount
  useEffect(() => {
    const storedHw = getItem<Record<string, Homework[]>>(STORAGE_KEYS.HOMEWORK);
    if (storedHw) setHomeworkMap(storedHw);

    const storedFees = getItem<Fee[]>(STORAGE_KEYS.FEES);
    if (storedFees) {
      const sanitizedFees = storedFees.map((f) => ({ ...f, currency: 'د.ج' }));
      setFees(sanitizedFees);
    }

    const storedPayments = getItem<PaymentRecord[]>(STORAGE_KEYS.PAYMENTS);
    if (storedPayments) {
      const seenIds = new Set<string>();
      const sanitizedPayments: PaymentRecord[] = [];
      storedPayments.forEach((p, idx) => {
        const id = p.id && !seenIds.has(p.id) ? p.id : `pay-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`;
        seenIds.add(id);
        sanitizedPayments.push({ ...p, id, currency: 'د.ج' });
      });
      setPayments(sanitizedPayments);
    }

    const storedNotifs = getItem<Notification[]>(STORAGE_KEYS.NOTIFICATIONS);
    if (storedNotifs) setNotifications(storedNotifs);

    const storedSettings = getItem<NotificationSettings>(STORAGE_KEYS.NOTIFICATION_SETTINGS);
    if (storedSettings) setNotificationSettings(storedSettings);
  }, []);

  // Dynamically resolve students belonging to the authenticated parent
  const syncParentStudents = useCallback(() => {
    // Check latest parent session
    const currentAuthUser = getItem<any>(STORAGE_KEYS.AUTH_USER) || getItem<any>('awliya_auth_user');
    const activeParent = currentAuthUser || parent;

    if (!activeParent) {
      setStudents([]);
      setActiveStudentIdState('');
      return;
    }

    const combinedParentsMap = new Map<string, AdminParent>();
    mockAdminParents.forEach((p) => combinedParentsMap.set(p.id, p));
    const storedAdminParents = getItem<AdminParent[]>(STORAGE_KEYS.ADMIN_PARENTS) || [];
    storedAdminParents.forEach((p) => combinedParentsMap.set(p.id, p));
    const allAdminParents = Array.from(combinedParentsMap.values());

    const cleanActivePhone = (activeParent.phone || '').replace(/[\s\-+()]/g, '');
    const cleanActiveEmail = (activeParent.email || '').toLowerCase().trim();
    const cleanActiveNameAr = (activeParent.fullNameAr || '').trim();

    // Match exact parent record in admin database
    const currentParentRecord =
      storedAdminParents.find((p) => p.id === activeParent.id) ||
      allAdminParents.find((p) => {
        const pPhone = (p.phone || '').replace(/[\s\-+()]/g, '');
        const pEmail = (p.email || '').toLowerCase().trim();
        const pNameAr = (p.fullNameAr || '').trim();
        return (
          p.id === activeParent.id ||
          (cleanActiveEmail && pEmail === cleanActiveEmail) ||
          (cleanActivePhone && cleanActivePhone.length > 5 && (pPhone.includes(cleanActivePhone) || cleanActivePhone.includes(pPhone))) ||
          (cleanActiveNameAr && pNameAr === cleanActiveNameAr)
        );
      }) ||
      activeParent;

    const combinedAdminStudentsMap = new Map<string, AdminStudent>();
    mockAdminStudents.forEach((st) => combinedAdminStudentsMap.set(st.id, st));
    const storedAdminStudents = getItem<AdminStudent[]>(STORAGE_KEYS.ADMIN_STUDENTS) || [];
    storedAdminStudents.forEach((st) => combinedAdminStudentsMap.set(st.id, st));
    const allAdminStudents = Array.from(combinedAdminStudentsMap.values());

    // Strict set of linked student IDs for this parent
    const parentLinkedIds = new Set<string>(currentParentRecord.linkedStudentIds || []);

    const parentChildren: Student[] = [];
    const seenIds = new Set<string>();

    // 1. Check all admin students linked to this parent (PRIMARY SOURCE OF TRUTH)
    allAdminStudents.forEach((adminStu) => {
      const isLinked =
        parentLinkedIds.has(adminStu.id) ||
        adminStu.parentId === currentParentRecord.id;

      if (isLinked && !seenIds.has(adminStu.id)) {
        seenIds.add(adminStu.id);
        const nameParts = adminStu.fullNameAr.trim().split(' ');
        parentChildren.push({
          id: adminStu.id,
          parentId: currentParentRecord.id,
          fullNameAr: adminStu.fullNameAr,
          firstNameAr: nameParts[0] || adminStu.fullNameAr,
          lastNameAr: nameParts.slice(1).join(' ') || (currentParentRecord.fullNameAr ? currentParentRecord.fullNameAr.split(' ').slice(1).join(' ') : ''),
          birthday: '2015-06-15',
          schoolLevelAr: 'المرحلة الابتدائية',
          nicknameAr: nameParts[0] || adminStu.fullNameAr,
          enrolledPathAr: adminStu.enrolledPathAr || 'مسار اللغة الإنجليزية المكثف (English Track)',
          currentLevel: (adminStu.currentLevel || 1) as LevelId,
          currentLevelProgress: adminStu.overallProgress !== undefined ? adminStu.overallProgress : 0,
          studentIdNumber: adminStu.id.toUpperCase(),
          academicYearAr: '1446-1447هـ (2024-2025)',
          branchAr: 'الفرع المركزي',
          timingAr: 'خلال أيام الأسبوع (Weekdays)',
          gender: adminStu.gender,
          status: adminStu.status as any,
          enrollmentDate: adminStu.enrollmentDate || '2024-09-01',
          age: 10,
          language: adminStu.language,
          cefrLevel: adminStu.cefrLevel,
          attendanceRate: adminStu.attendanceRate !== undefined ? adminStu.attendanceRate : 0,
          averagePerformance: adminStu.averagePerformance !== undefined ? adminStu.averagePerformance : 0,
          skills: adminStu.skills || { listening: 0, speaking: 0, reading: 0, writing: 0, overall: 0 },
        });
      }
    });

    // 2. Also check if any portal-added students were specifically registered with this parent's id
    const storedPortalStudents = getItem<Student[]>(STORAGE_KEYS.STUDENTS_LIST) || [];
    storedPortalStudents.forEach((s) => {
      const isMatch = parentLinkedIds.has(s.id) || s.parentId === currentParentRecord.id;
      if (isMatch && !seenIds.has(s.id)) {
        seenIds.add(s.id);
        parentChildren.push(s);
      }
    });

    if (parentChildren.length > 0) {
      setStudents(parentChildren);
      const currentStoredId = getItem<string>(STORAGE_KEYS.ACTIVE_STUDENT_ID);
      const isValidCurrent = parentChildren.some((c) => c.id === currentStoredId);
      const targetId = isValidCurrent ? (currentStoredId as string) : parentChildren[0].id;

      setActiveStudentIdState((prev) => {
        if (prev !== targetId) {
          setItem(STORAGE_KEYS.ACTIVE_STUDENT_ID, targetId);
          return targetId;
        }
        return prev;
      });

      const targetChild = parentChildren.find((c) => c.id === targetId) || parentChildren[0];
      setLevel(targetChild.currentLevel);
    } else {
      // Parent has NO linked students yet: leave students strictly empty!
      setStudents([]);
      setActiveStudentIdState('');
    }
  }, [parent, setLevel]);

  // Curricula & Lesson Progress states synced with Backoffice
  const [curricula, setCurricula] = useState<CurriculumLevel[]>(() => {
    return getItem<CurriculumLevel[]>(STORAGE_KEYS.ADMIN_CURRICULA) || mockCurricula;
  });
  const [lessonProgress, setLessonProgress] = useState<Record<string, LessonProgressStatus>>(() => {
    return getItem<Record<string, LessonProgressStatus>>(STORAGE_KEYS.ADMIN_LESSON_PROGRESS) || {};
  });
  const [studentLevelScores, setStudentLevelScores] = useState<
    Record<string, { score: number; honorsDegreeAr?: string; completedDate?: string }>
  >(() => {
    return (
      getItem<Record<string, { score: number; honorsDegreeAr?: string; completedDate?: string }>>(
        STORAGE_KEYS.ADMIN_STUDENT_LEVEL_SCORES
      ) || {}
    );
  });
  const [attendanceSessions, setAttendanceSessions] = useState<AttendanceSession[]>(() => {
    return getItem<AttendanceSession[]>(STORAGE_KEYS.ADMIN_ATTENDANCE) || [];
  });
  const [adminHomeworkList, setAdminHomeworkList] = useState<AdminHomeworkAssignment[]>(() => {
    return getItem<AdminHomeworkAssignment[]>(STORAGE_KEYS.ADMIN_HOMEWORK) || [];
  });
  const [adminFeedbackList, setAdminFeedbackList] = useState<any[]>(() => {
    return getItem<any[]>(STORAGE_KEYS.ADMIN_FEEDBACK) || mockTwoWayFeedback;
  });

  // Sync on parent change and listen to window storage and custom sync events
  useEffect(() => {
    syncParentStudents();

    const handleSync = () => {
      syncParentStudents();
      const freshCurricula = getItem<CurriculumLevel[]>(STORAGE_KEYS.ADMIN_CURRICULA) || mockCurricula;
      const freshProgress = getItem<Record<string, LessonProgressStatus>>(STORAGE_KEYS.ADMIN_LESSON_PROGRESS) || {};
      const freshScores =
        getItem<Record<string, { score: number; honorsDegreeAr?: string; completedDate?: string }>>(
          STORAGE_KEYS.ADMIN_STUDENT_LEVEL_SCORES
        ) || {};
      const freshAttendance = getItem<AttendanceSession[]>(STORAGE_KEYS.ADMIN_ATTENDANCE) || [];
      const freshAdminHw = getItem<AdminHomeworkAssignment[]>(STORAGE_KEYS.ADMIN_HOMEWORK) || [];
      const freshFeedback = getItem<any[]>(STORAGE_KEYS.ADMIN_FEEDBACK) || mockTwoWayFeedback;
      const freshNotifs = getItem<Notification[]>(STORAGE_KEYS.NOTIFICATIONS);

      setCurricula(freshCurricula);
      setLessonProgress(freshProgress);
      setStudentLevelScores(freshScores);
      setAttendanceSessions(freshAttendance);
      setAdminHomeworkList(freshAdminHw);
      setAdminFeedbackList(freshFeedback);
      if (freshNotifs) {
        setNotifications(freshNotifs);
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (
        !e.key ||
        e.key === STORAGE_KEYS.ADMIN_STUDENTS ||
        e.key === STORAGE_KEYS.ADMIN_PARENTS ||
        e.key === STORAGE_KEYS.STUDENTS_LIST ||
        e.key === STORAGE_KEYS.ADMIN_CURRICULA ||
        e.key === STORAGE_KEYS.ADMIN_LESSON_PROGRESS ||
        e.key === STORAGE_KEYS.ADMIN_STUDENT_LEVEL_SCORES ||
        e.key === STORAGE_KEYS.ADMIN_ATTENDANCE ||
        e.key === STORAGE_KEYS.ADMIN_HOMEWORK ||
        e.key === STORAGE_KEYS.ADMIN_FEEDBACK ||
        e.key === STORAGE_KEYS.NOTIFICATIONS
      ) {
        handleSync();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorage);
      window.addEventListener('awliya-data-sync', handleSync);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorage);
        window.removeEventListener('awliya-data-sync', handleSync);
      }
    };
  }, [syncParentStudents]);

  // Current active student object
  const activeStudent = useMemo(() => {
    if (students.length === 0) return emptyStudent;
    const found = students.find((s) => s.id === activeStudentId);
    return found || students[0] || emptyStudent;
  }, [students, activeStudentId]);

  // Sync theme whenever active student changes
  useEffect(() => {
    if (activeStudent) {
      setLevel(activeStudent.currentLevel);
    }
  }, [activeStudent, setLevel]);

  // Set active student ID and persist
  const setActiveStudentId = useCallback(
    (id: string) => {
      const target = students.find((s) => s.id === id);
      if (target) {
        setActiveStudentIdState(id);
        setItem(STORAGE_KEYS.ACTIVE_STUDENT_ID, id);
        setLevel(target.currentLevel);
      }
    },
    [students, setLevel]
  );

  const addStudent = useCallback(
    (data: {
      fullNameAr?: string;
      firstNameAr?: string;
      lastNameAr?: string;
      birthday?: string;
      schoolLevelAr?: string;
      timingAr?: string;
      status?: 'active' | 'pending';
      nicknameAr?: string;
      enrolledPathAr: string;
      currentLevel?: LevelId;
      age?: number;
      branchAr?: string;
    }): Student => {
      const newId = `student-${Date.now().toString().slice(-4)}`;
      const randomIdNum = Math.floor(1000 + Math.random() * 9000);
      const computedFullName = data.fullNameAr || `${data.firstNameAr || ''} ${data.lastNameAr || ''}`.trim() || 'طالب جديد';
      const computedNickname = data.nicknameAr || data.firstNameAr || computedFullName.split(' ')[0];
      
      const newStudent: Student = {
        id: newId,
        parentId: 'parent-001',
        fullNameAr: computedFullName,
        firstNameAr: data.firstNameAr || computedFullName.split(' ')[0],
        lastNameAr: data.lastNameAr || computedFullName.split(' ').slice(1).join(' '),
        birthday: data.birthday || '2016-01-01',
        schoolLevelAr: data.schoolLevelAr || 'المرحلة الابتدائية',
        timingAr: data.timingAr || 'خلال أيام الأسبوع (Weekdays)',
        status: data.status || 'pending',
        nicknameAr: computedNickname,
        enrolledPathAr: data.enrolledPathAr,
        currentLevel: data.currentLevel || 1,
        currentLevelProgress: 0,
        studentIdNumber: `STD-2025-${randomIdNum}`,
        academicYearAr: '1446-1447هـ (2024-2025)',
        branchAr: data.branchAr || 'فرع الروضة - الرياض',
        enrollmentDate: new Date().toISOString().split('T')[0],
        age: data.age || 8,
      };

      const updated = [...students, newStudent];
      setStudents(updated);
      setItem(STORAGE_KEYS.STUDENTS_LIST, updated);

      // Set as active
      setActiveStudentIdState(newId);
      setItem(STORAGE_KEYS.ACTIVE_STUDENT_ID, newId);
      setLevel(newStudent.currentLevel);

      return newStudent;
    },
    [students, setLevel]
  );

  // Approve student (e.g. when administration approves placement test)
  const approveStudent = useCallback(
    (id: string) => {
      setStudents((prev) => {
        const updated = prev.map((s) => (s.id === id ? { ...s, status: 'active' as const, currentLevelProgress: 25 } : s));
        setItem(STORAGE_KEYS.STUDENTS_LIST, updated);
        return updated;
      });
    },
    []
  );

  // Update existing student
  const updateStudent = useCallback(
    (id: string, data: Partial<Student>) => {
      setStudents((prev) => {
        const updated = prev.map((s) => (s.id === id ? { ...s, ...data } : s));
        setItem(STORAGE_KEYS.STUDENTS_LIST, updated);
        return updated;
      });
    },
    []
  );

  // Change current student's level (for live demoing all 10 levels)
  const changeActiveStudentLevel = useCallback(
    (newLevel: LevelId) => {
      setStudents((prev) => {
        const updated = prev.map((s) => (s.id === activeStudentId ? { ...s, currentLevel: newLevel } : s));
        setItem(STORAGE_KEYS.STUDENTS_LIST, updated);
        return updated;
      });
      setLevel(newLevel);
    },
    [activeStudentId, setLevel]
  );

  // Computed data for active student: dynamic mapping from Backoffice Curricula
  const academicLevels = useMemo<AcademicLevel[]>(() => {
    if (!activeStudent || !activeStudent.id) {
      return getAcademicLevelsForStudent(activeStudent?.currentLevel || 1);
    }

    // Determine language track: French if explicitly French or enrolled path indicates French, else English
    const isFrench =
      activeStudent.language === 'French' ||
      activeStudent.enrolledPathAr?.includes('فرنسية') ||
      activeStudent.enrolledPathAr?.toLowerCase().includes('french');
    const studentLang = isFrench ? 'French' : 'English';

    // Filter curriculum levels for this language, ordered by levelNumber
    const list = Array.isArray(curricula) && curricula.length > 0 ? curricula : mockCurricula;
    const studentCurricula = list
      .filter((c) => c && c.language === studentLang)
      .sort((a, b) => a.levelNumber - b.levelNumber);

    if (studentCurricula.length === 0) {
      return getAcademicLevelsForStudent(activeStudent.currentLevel);
    }

    const currentLevelNum = Number(activeStudent.currentLevel) || 1;

    return studentCurricula.map((lvl) => {
      const allLessons = lvl.units.flatMap((u) => u.lessons);
      const totalLessons = allLessons.length;
      const completedLessons = allLessons.filter(
        (l) => lessonProgress[`${activeStudent.id}_${l.id}`] === 'completed'
      ).length;

      // Status determination
      let status: LevelStatus = 'locked';
      if (lvl.levelNumber < currentLevelNum || (totalLessons > 0 && completedLessons === totalLessons)) {
        status = 'studied';
      } else if (lvl.levelNumber === currentLevelNum) {
        status = 'current';
      } else {
        status = 'locked';
      }

      const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      // Map units to LevelModule with lessons and progress
      const modules: LevelModule[] = lvl.units.map((u) => {
        const uLessons: LevelLessonItem[] = u.lessons.map((l) => {
          let lStatus: 'completed' | 'in_progress' | 'not_started' = 'not_started';
          if (lessonProgress[`${activeStudent.id}_${l.id}`]) {
            lStatus = lessonProgress[`${activeStudent.id}_${l.id}`] as any;
          } else if (status === 'studied') {
            lStatus = 'completed';
          }

          return {
            id: l.id,
            lessonNumber: l.lessonNumber,
            titleAr: l.titleAr,
            titleEn: l.titleEn,
            status: lStatus,
            exercisesCount: l.exercisesCount,
            hasAssessment: l.hasAssessment,
          };
        });

        const isUnitCompleted =
          uLessons.length > 0
            ? uLessons.every((l) => l.status === 'completed')
            : status === 'studied';

        return {
          id: u.id,
          unitNumber: u.unitNumber,
          titleAr: u.titleAr,
          titleEn: u.titleEn,
          isCompleted: isUnitCompleted,
          lessonsCount: u.lessons.length,
          lessons: uLessons,
        };
      });

      // Extract subject topics
      const subjects = lvl.units.flatMap((u) => u.lessons.map((l) => l.titleAr));

      const yearOffset = Math.max(1, currentLevelNum - lvl.levelNumber);
      const completedDate =
        status === 'studied' ? `2024-0${Math.min(9, Math.max(1, 10 - yearOffset * 3))}-15` : undefined;
      const scoreRecord = studentLevelScores[`${activeStudent.id}_level_${lvl.levelNumber}`];
      const finalScore = scoreRecord?.score ?? (lvl.passingScore || 93);
      const finalHonors = scoreRecord?.honorsDegreeAr || lvl.honorsDegreeAr || 'تقدير: ممتاز مرتفع (مع مرتبة الشرف)';
      const finalCompletedDate = scoreRecord?.completedDate || completedDate;

      const score = status === 'studied' ? finalScore : undefined;
      const honorsDegree = finalHonors;

      return {
        level: lvl.levelNumber as LevelId,
        cefrCode: lvl.cefrCode,
        nameAr: lvl.nameAr,
        nameEn: lvl.nameEn,
        stageAr: lvl.descriptionAr || `المرحلة ${lvl.levelNumber}`,
        stageEn: lvl.descriptionEn || `Stage ${lvl.levelNumber}`,
        status,
        subjects: subjects.length > 0 ? subjects : [lvl.nameAr],
        modules,
        completedDate: finalCompletedDate,
        score,
        honorsDegree,
        certificateAvailable: status === 'studied',
        descriptionAr: lvl.descriptionAr,
        descriptionEn: lvl.descriptionEn,
        color: lvl.color,
        language: lvl.language,
        progress,
        completedLessonsCount: completedLessons,
        totalLessonsCount: totalLessons,
      };
    });
  }, [curricula, lessonProgress, studentLevelScores, activeStudent]);

  const homeworkList = useMemo(() => {
    if (!activeStudent.id) return [];

    // 1. Read live homework assignments from backoffice
    const liveAdminHw =
      adminHomeworkList.length > 0
        ? adminHomeworkList
        : getItem<AdminHomeworkAssignment[]>(STORAGE_KEYS.ADMIN_HOMEWORK) || [];

    // Find all homework that targets this student (either by studentIds, groupId, or evaluations entry)
    const activeStudentAny = activeStudent as any;
    const matchingAdminHw = liveAdminHw.filter((hw) => {
      const inStudentIds = hw.studentIds?.includes(activeStudent.id);
      const inGroup = hw.groupId && activeStudentAny.groupId && hw.groupId === activeStudentAny.groupId;
      const inEvals = hw.evaluations?.some(
        (e) =>
          e.studentId === activeStudent.id ||
          (activeStudent.fullNameAr && e.studentNameAr === activeStudent.fullNameAr) ||
          (activeStudentAny.nameAr && e.studentNameAr === activeStudentAny.nameAr)
      );
      return inStudentIds || inGroup || inEvals;
    });

    const mappedAdminHw: Homework[] = matchingAdminHw.map((hw) => {
      const studentEval = hw.evaluations?.find(
        (e) =>
          e.studentId === activeStudent.id ||
          (activeStudent.fullNameAr && e.studentNameAr === activeStudent.fullNameAr) ||
          (activeStudentAny.nameAr && e.studentNameAr === activeStudentAny.nameAr)
      );
      let status: HomeworkStatus = 'not_started';
      if (studentEval?.completionStatus === 'completed') {
        status = 'completed';
      } else if (studentEval?.completionStatus === 'needs_revision') {
        status = 'needs_revision';
      } else if (studentEval?.completionStatus === 'pending') {
        status = 'pending';
      }

      const subject =
        activeStudent.enrolledPathAr?.includes('فرنسية') || activeStudent.language === 'French'
          ? 'اللغة الفرنسية'
          : 'اللغة الإنجليزية';

      return {
        id: hw.id,
        studentId: activeStudent.id,
        titleAr: hw.assignmentNameAr,
        titleEn: hw.assignmentNameEn || hw.assignmentNameAr,
        subjectAr: subject,
        level: (activeStudent.currentLevel as LevelId) || 1,
        dueDate: hw.dueDate,
        assignedDate: hw.assignedDate || new Date().toISOString().substring(0, 10),
        status,
        score: studentEval?.score,
        totalScore: hw.totalScore || 20,
        maxScore: hw.totalScore || 20,
        teacherNote: studentEval?.teacherComment || hw.teacherNote,
        description: hw.descriptionAr,
        parentConfirmed: status === 'completed',
        parentConfirmDate: studentEval?.submittedAt,
      };
    });

    // Merge with any custom client-side stored homework for this student
    const clientHw = homeworkMap[activeStudent.id] || [];
    const seenIds = new Set<string>(mappedAdminHw.map((h) => h.id));
    const combined = [...mappedAdminHw];
    clientHw.forEach((h) => {
      if (!seenIds.has(h.id)) {
        combined.push(h);
      }
    });

    return combined;
  }, [adminHomeworkList, homeworkMap, activeStudent]);

  const attendanceData = useMemo(() => {
    if (!activeStudent.id) {
      return {
        records: [],
        summary: emptyAttendanceSummary,
      };
    }

    // 1. Gather all recorded attendance sessions from the backoffice that contain this student
    const studentSessionsWithRecord: { session: AttendanceSession; entry: any }[] = [];

    attendanceSessions.forEach((sess) => {
      const match = sess.records?.find((r) => r.studentId === activeStudent.id);
      if (match) {
        studentSessionsWithRecord.push({ session: sess, entry: match });
      }
    });

    // 2. If backoffice sessions exist for this student, USE THEM as the live synchronized source of truth!
    if (studentSessionsWithRecord.length > 0) {
      // Sort sessions by date descending (newest first)
      studentSessionsWithRecord.sort(
        (a, b) => new Date(b.session.date).getTime() - new Date(a.session.date).getTime()
      );

      // Helper to calculate week index dynamically relative to current week:
      // Week 0: Current week (since latest Saturday)
      // Week 1: Last week
      // Week 2: Previous week
      const parseWeekIndex = (dateStr: string) => {
        try {
          const sessDate = new Date(dateStr);
          sessDate.setHours(0, 0, 0, 0);

          const now = new Date();
          const dayOfWeek = now.getDay();
          const diffToSaturday = (dayOfWeek + 1) % 7;
          
          const currentSat = new Date(now);
          currentSat.setDate(now.getDate() - diffToSaturday);
          currentSat.setHours(0, 0, 0, 0);

          const diffDays = Math.floor((currentSat.getTime() - sessDate.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays <= 6 && diffDays >= -6) return 0; // Current week
          if (diffDays > 6 && diffDays <= 13) return 1;  // Last week
          return 2;                                      // Previous week
        } catch {
          return 0;
        }
      };

      const records: AttendanceRecord[] = studentSessionsWithRecord.map(({ session, entry }, idx) => {
        const isCovering = Boolean(session.isCoveringSession || session.id?.includes('cov') || (session as any).coveringType);
        return {
          id: `att-rec-${session.id}-${entry.studentId}-${idx}`,
          studentId: entry.studentId,
          date: session.date,
          dayNameAr: session.dayNameAr || 'السبت',
          subjectAr:
            session.groupName?.toLowerCase().includes('fr') || session.groupName?.includes('فرنسي')
              ? 'اللغة الفرنسية'
              : 'اللغة الإنجليزية',
          status: entry.status,
          noteAr: entry.note || undefined,
          sessionTimeAr: session.sessionTime || '04:30 PM - 06:00 PM',
          weekIndex: parseWeekIndex(session.date),
          isCoveringSession: isCovering,
          coveringType: session.coveringType || (isCovering ? 'counted' : undefined),
          coveringReason: session.coveringReason,
        };
      });

      const presentCount = records.filter((r) => r.status === 'present').length;
      const lateCount = records.filter((r) => r.status === 'late').length;
      const absentCount = records.filter((r) => r.status === 'absent').length;
      const excusedCount = records.filter((r) => r.status === 'excused').length;
      const total = records.length;
      const percentage = total > 0 ? Math.round(((presentCount + lateCount) / total) * 100) : 0;

      return {
        records,
        summary: {
          totalDays: total,
          presentDays: presentCount,
          absentDays: absentCount,
          lateDays: lateCount,
          excusedDays: excusedCount,
          attendancePercentage: percentage,
        },
      };
    }

    // 3. Fallback: If no backoffice attendance has been recorded yet for this student:
    // If the student is new (attendanceRate === 0 or currentLevelProgress === 0), return 0% and empty records!
    const isNewStudent =
      activeStudent.attendanceRate === 0 ||
      activeStudent.currentLevelProgress === 0 ||
      (activeStudent as any).overallProgress === 0;

    if (isNewStudent) {
      return {
        records: [],
        summary: emptyAttendanceSummary,
      };
    }

    const data = getAttendanceDataForStudent(activeStudent.id, isNewStudent);
    if (!data || data.records.length === 0) {
      return {
        records: [],
        summary: emptyAttendanceSummary,
      };
    }
    return data;
  }, [activeStudent, attendanceSessions]);

  const assessments = useMemo(() => {
    if (!activeStudent.id) return [];

    // 1. Check live assessments recorded by teachers/admins in backoffice
    const liveAdminAssessments = getItem<any[]>('myschool_admin_assessments_v11') || [];
    const matched: Assessment[] = liveAdminAssessments
      .filter((a) => a.studentId === activeStudent.id)
      .map((a) => ({
        id: a.id,
        studentId: a.studentId,
        titleAr: `تقييم المهارات اللغوية (${a.assessmentType === 'periodic' ? 'دوري' : a.assessmentType === 'midterm' ? 'نصفي' : a.assessmentType === 'final' ? 'نهائي' : 'تحديد مستوى'})`,
        typeAr: a.assessmentType === 'periodic' ? 'اختبار دوري' : a.assessmentType === 'midterm' ? 'اختبار نصفي' : a.assessmentType === 'final' ? 'اختبار نهائي' : 'تحديد مستوى',
        subjectAr: activeStudent.enrolledPathAr?.includes('فرنسية') || activeStudent.language === 'French' ? 'اللغة الفرنسية' : 'اللغة الإنجليزية',
        score: a.scores?.overall !== undefined ? a.scores.overall : (a.score !== undefined ? a.score : 0),
        totalScore: 100,
        gradeLetterAr: a.gradeLetterAr || 'ممتاز',
        date: a.date,
        level: (Number(activeStudent.currentLevel) || 1) as LevelId,
        teacherComments: a.teacherComment || 'أداء متميز وتطور ملحوظ في المهارات اللغوية.',
      }));

    if (matched.length > 0) return matched;
    return mockAssessmentsMap[activeStudent.id] || [];
  }, [activeStudent.id, activeStudent.enrolledPathAr, activeStudent.language, activeStudent.currentLevel]);

  const teacherFeedback = useMemo(() => {
    if (!activeStudent.id) return [];

    // 1. Check live feedback recorded by teachers in backoffice
    const liveList = adminFeedbackList.length > 0 ? adminFeedbackList : (getItem<any[]>('myschool_admin_feedback_v11') || []);
    const matched: TeacherFeedback[] = liveList
      .filter((fb) => fb.studentId === activeStudent.id)
      .map((fb) => {
        let msg = '';
        if (fb.teacherFeedback) {
          const parts: string[] = [];
          if (fb.teacherFeedback.strengths && (Array.isArray(fb.teacherFeedback.strengths) ? fb.teacherFeedback.strengths.length > 0 : fb.teacherFeedback.strengths)) {
            parts.push(`نقاط القوة: ${Array.isArray(fb.teacherFeedback.strengths) ? fb.teacherFeedback.strengths.join('، ') : fb.teacherFeedback.strengths}`);
          }
          if (fb.teacherFeedback.needsImprovement && (Array.isArray(fb.teacherFeedback.needsImprovement) ? fb.teacherFeedback.needsImprovement.length > 0 : fb.teacherFeedback.needsImprovement)) {
            parts.push(`بحاجة لتطوير: ${Array.isArray(fb.teacherFeedback.needsImprovement) ? fb.teacherFeedback.needsImprovement.join('، ') : fb.teacherFeedback.needsImprovement}`);
          }
          if (fb.teacherFeedback.recommendations) {
            parts.push(`توصية للمنزل: "${fb.teacherFeedback.recommendations}"`);
          }
          if (fb.teacherFeedback.generalComments && fb.teacherFeedback.generalComments !== 'الطالب متفاعل وملتزم بالحضور والواجبات.') {
            parts.push(fb.teacherFeedback.generalComments);
          }
          msg = parts.join(' • ');
        }
        if (!msg) {
          msg = fb.messageAr || fb.feedback || fb.teacherFeedback?.generalComments || '';
        }

        return {
          id: fb.id,
          studentId: fb.studentId,
          teacherNameAr: fb.teacherName || 'د. طارق المنصور',
          messageAr: msg || `السلام عليكم ورحمة الله، ${activeStudent.fullNameAr || 'الطالب'} ما شاء الله طالب مجتهد وذكي جداً. أظهر تفاعلاً رائعاً في ورشة المحادثة والنطق بالإنجليزية، ونرجو منكم حثه على الاستماع والتكرار اليومي في المنزل لترسيخ المفردات والطلاقة اللغوية.`,
          date: fb.date || '2026-09-03',
          subjectAr: activeStudent.enrolledPathAr?.includes('فرنسية') || activeStudent.language === 'French' ? 'اللغة الفرنسية' : 'اللغة الإنجليزية واللغة الفرنسية',
          isRead: true,
          badgeAr: 'طالب متميز',
          teacherRoleAr: 'اللغة الإنجليزية واللغة الفرنسية',
          teacherFeedbackDetails: fb.teacherFeedback,
        };
      });

    if (matched.length > 0) return matched;

    if (mockTeacherFeedbackMap[activeStudent.id] && mockTeacherFeedbackMap[activeStudent.id].length > 0) {
      return mockTeacherFeedbackMap[activeStudent.id];
    }

    // 2. Default feedback linked to the teacher comment from dashboard
    const studentName = activeStudent.fullNameAr || 'احمد بوكوشة';
    return [
      {
        id: `fb-default-${activeStudent.id}`,
        studentId: activeStudent.id,
        teacherNameAr: 'د. طارق المنصور',
        messageAr: `السلام عليكم ورحمة الله، ${studentName} ما شاء الله طالب مجتهد وذكي جداً. أظهر اليوم تفاعلاً رائعاً في ورشة المحادثة والنطق بالإنجليزية، ونرجو منكم حثه على الاستماع والتكرار اليومي في المنزل لترسيخ المفردات والطلاقة اللغوية.`,
        date: '2026-09-03',
        subjectAr: activeStudent.enrolledPathAr?.includes('فرنسية') || activeStudent.language === 'French' ? 'اللغة الفرنسية' : 'اللغة الإنجليزية واللغة الفرنسية',
        isRead: true,
        badgeAr: 'طالب متميز',
        teacherRoleAr: 'اللغة الإنجليزية واللغة الفرنسية',
        teacherFeedbackDetails: {
          strengths: ['Good pronunciation', 'Active in class'],
          needsImprovement: ['Spontaneous dialogue fluency'],
          recommendations: 'Practice speaking 10 minutes daily at home.',
          generalComments: 'الطالب متفاعل وملتزم بالحضور والواجبات.',
        },
      },
    ];
  }, [activeStudent.id, activeStudent.fullNameAr, activeStudent.enrolledPathAr, activeStudent.language, adminFeedbackList]);

  const studentFees = useMemo(() => {
    return fees.filter((f) => f.studentId === activeStudent.id || !f.studentId);
  }, [fees, activeStudent.id]);

  const studentPayments = useMemo(() => {
    return payments.filter((p) => p.studentId === activeStudent.id || !p.studentId);
  }, [payments, activeStudent.id]);

  const financialSummary = useMemo<FinancialSummary>(() => {
    const pending = studentFees.filter((f) => f.status === 'pending').reduce((sum, f) => sum + f.amount, 0);
    const paid = studentFees.filter((f) => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0);
    const overdue = studentFees.filter((f) => f.status === 'overdue').reduce((sum, f) => sum + f.amount, 0);

    return {
      currentBalance: pending,
      totalPaid: paid,
      totalPending: pending,
      totalOverdue: overdue,
      currency: 'د.ج',
    };
  }, [studentFees]);

  // Central notifications for all registered students of the parent
  const filteredNotifications = useMemo(() => {
    const studentIds = new Set(students.map((s) => s.id));
    return notifications.filter((n) => {
      if (!SHOW_FINANCIALS_TAB && (n.type === 'payment' || n.routeTo === 'financials')) {
        return false;
      }
      return !n.studentId || studentIds.has(n.studentId);
    });
  }, [notifications, students]);

  // Handlers
  const updateNotificationSettings = useCallback((settings: Partial<NotificationSettings>) => {
    setNotificationSettings((prev) => {
      const updated = { ...prev, ...settings };
      setItem(STORAGE_KEYS.NOTIFICATION_SETTINGS, updated);
      return updated;
    });
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, isRead: true } : n));
      setItem(STORAGE_KEYS.NOTIFICATIONS, updated);
      return updated;
    });
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, isRead: true }));
      setItem(STORAGE_KEYS.NOTIFICATIONS, updated);
      return updated;
    });
  }, []);

  const payFee = useCallback((feeId: string, methodAr: string) => {
    setFees((prev) => {
      const targetFee = prev.find((f) => f.id === feeId);
      if (!targetFee) return prev;

      const updatedFees = prev.map((f) =>
        f.id === feeId ? { ...f, status: 'paid' as const, paidDate: new Date().toISOString().split('T')[0] } : f
      );
      setItem(STORAGE_KEYS.FEES, updatedFees);

      // Create payment record
      const newPayment: PaymentRecord = {
        id: `pay-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
        studentId: targetFee.studentId,
        descriptionAr: `سداد ${targetFee.descriptionAr}`,
        amount: targetFee.amount,
        currency: targetFee.currency,
        date: new Date().toISOString().split('T')[0],
        receiptNumber: `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        methodAr: methodAr || 'دفع إلكتروني',
        status: 'successful',
      };

      setPayments((prevPayments) => {
        const updatedPayments = [newPayment, ...prevPayments];
        setItem(STORAGE_KEYS.PAYMENTS, updatedPayments);
        return updatedPayments;
      });

      return updatedFees;
    });
  }, []);

  const submitHomeworkRevision = useCallback((homeworkId: string, note?: string) => {
    setHomeworkMap((prev) => {
      const studentHw = prev[activeStudent.id] || [];
      const updatedList = studentHw.map((hw) =>
        hw.id === homeworkId
          ? {
              ...hw,
              status: 'pending' as const,
              teacherNote: note ? `ملاحظة ولي الأمر: ${note}` : hw.teacherNote,
              submittedDate: new Date().toISOString().split('T')[0],
            }
          : hw
      );
      const updatedMap = { ...prev, [activeStudent.id]: updatedList };
      setItem(STORAGE_KEYS.HOMEWORK, updatedMap);
      return updatedMap;
    });
  }, [activeStudent.id]);

  return (
    <StudentContext.Provider
      value={{
        students,
        activeStudent,
        activeStudentId,
        setActiveStudentId,
        addStudent,
        approveStudent,
        updateStudent,
        academicLevels,
        homeworkList,
        attendanceData,
        assessments,
        teacherFeedback,
        fees: studentFees,
        payments: studentPayments,
        financialSummary,
        notifications: filteredNotifications,
        notificationSettings,
        updateNotificationSettings,
        markNotificationRead,
        markAllNotificationsRead,
        payFee,
        submitHomeworkRevision,
        activeLevelId: activeStudent.currentLevel,
        changeActiveStudentLevel,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (!context) throw new Error('useStudent must be used within StudentProvider');
  return context;
}
