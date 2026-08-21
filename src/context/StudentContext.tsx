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
} from '@/types';
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
import { useTheme } from './ThemeContext';

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

  // 1. Initial states are strictly deterministic for SSR matching
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [activeStudentId, setActiveStudentIdState] = useState<string>(mockStudents[0].id);
  const [homeworkMap, setHomeworkMap] = useState<Record<string, Homework[]>>(mockHomeworkMap);
  const [fees, setFees] = useState<Fee[]>(mockFees);
  const [payments, setPayments] = useState<PaymentRecord[]>(mockPayments);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(mockNotificationSettings);

  // Sync from localStorage after client mount
  useEffect(() => {
    const storedStudents = getItem<Student[]>(STORAGE_KEYS.STUDENTS_LIST) || getItem<Student[]>('awliya_students_list');
    if (storedStudents && storedStudents.length > 0) {
      const sanitized = storedStudents.map((s) => {
        if (
          !s.enrolledPathAr ||
          s.enrolledPathAr.includes('القرآن') ||
          s.enrolledPathAr.includes('تجويد') ||
          s.enrolledPathAr.includes('نورانية') ||
          s.enrolledPathAr.includes('حفظ')
        ) {
          const defaultTrack =
            s.id === 'student-002'
              ? 'مسار اللغة الفرنسية المتقدم (French Language Path)'
              : s.id === 'student-003'
              ? 'المسار المزدوج: إنجليزية وفرنسية (Dual Languages Path)'
              : 'مسار اللغة الإنجليزية المكثف (English Language Path)';
          return { ...s, enrolledPathAr: defaultTrack };
        }
        return s;
      });
      setStudents(sanitized);
      setItem(STORAGE_KEYS.STUDENTS_LIST, sanitized);
    }

    const storedActiveId = getItem<string>(STORAGE_KEYS.ACTIVE_STUDENT_ID);
    if (storedActiveId) {
      setActiveStudentIdState(storedActiveId);
    }

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

  // Current active student object
  const activeStudent = useMemo(() => {
    const found = students.find((s) => s.id === activeStudentId);
    return found || students[0] || mockStudents[0];
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

  // Computed data for active student
  const academicLevels = useMemo(() => {
    return getAcademicLevelsForStudent(activeStudent.currentLevel);
  }, [activeStudent.currentLevel]);

  const homeworkList = useMemo(() => {
    return homeworkMap[activeStudent.id] || [
      {
        id: `hw-gen-1`,
        studentId: activeStudent.id,
        titleAr: `تسميع مقرر ${activeStudent.enrolledPathAr}`,
        subjectAr: 'الحفظ والتلاوة',
        level: activeStudent.currentLevel,
        status: 'pending' as const,
        dueDate: '2025-03-01',
      },
      {
        id: `hw-gen-2`,
        studentId: activeStudent.id,
        titleAr: 'تطبيق مهارات النطق والطلاقة الشفهية',
        subjectAr: 'محادثة ونطق',
        level: activeStudent.currentLevel,
        status: 'needs_revision' as const,
        dueDate: '2025-02-28',
        teacherNote: 'يرجى إعادة التسجيل الصوتي مع مراعاة النطق السليم ومخارج الأصوات.',
      },
    ];
  }, [homeworkMap, activeStudent.id, activeStudent.enrolledPathAr, activeStudent.currentLevel]);

  const attendanceData = useMemo(() => {
    return getAttendanceDataForStudent(activeStudent.id);
  }, [activeStudent.id]);

  const assessments = useMemo(() => {
    return (
      mockAssessmentsMap[activeStudent.id] || [
        {
          id: `asm-gen-1`,
          studentId: activeStudent.id,
          titleAr: `تقييم المستوى الأكاديمي الحالي`,
          subjectAr: 'الحفظ والإتقان',
          level: activeStudent.currentLevel,
          score: 91,
          totalScore: 100,
          date: '2025-02-15',
          typeAr: 'اختبار دوري',
          gradeLetterAr: 'ممتاز',
          teacherComments: 'أداء متميز وتفاعل إيجابي مستمر.',
        },
      ]
    );
  }, [activeStudent.id, activeStudent.currentLevel]);

  const teacherFeedback = useMemo(() => {
    return (
      mockTeacherFeedbackMap[activeStudent.id] || [
        {
          id: `fb-gen-1`,
          studentId: activeStudent.id,
          teacherNameAr: 'الشيخ عبد الرحمن السبيعي',
          teacherRoleAr: 'معلم المسار الأكاديمي',
          messageAr: `السلام عليكم، يسرني إبلاغكم بأن ${activeStudent.fullNameAr} يواصل تقدمه المميز في المستوى ${activeStudent.currentLevel}. نرجو الاستمرار في المتابعة المنزلية المباركة.`,
          date: '2025-02-20T17:45:00',
          subjectAr: 'المتابعة العامة',
          isRead: false,
          badgeAr: 'طالب متميز',
        },
      ]
    );
  }, [activeStudent.id, activeStudent.fullNameAr, activeStudent.currentLevel]);

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
