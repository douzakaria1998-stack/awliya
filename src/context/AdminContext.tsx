'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  AdminRole,
  AdminTabKey,
  AdminUser,
  AdminStudent,
  AdminParent,
  AdminTeacher,
  AdminGroup,
  CurriculumLevel,
  LessonProgressStatus,
  AttendanceSession,
  AttendanceStudentEntry,
  AdminHomeworkAssignment,
  AdminAssessmentRecord,
  TwoWayFeedbackItem,
  AdminRolePermissionConfig,
  AuditLogEntry,
  AdminNotificationItem,
  PendingStudentApproval,
  EntityStatus,
} from '@/types/admin';
import {
  mockAdminUsers,
  mockAdminStudents,
  mockAdminParents,
  mockAdminTeachers,
  mockAdminGroups,
  mockCurricula,
  mockAttendanceSessions,
  mockAdminHomework,
  mockAdminAssessments,
  mockTwoWayFeedback,
  mockRolePermissions,
  mockAuditLogs,
  mockAdminNotifications,
  mockPendingApprovals,
} from '@/data/adminMock';
import { getItem, setItem } from '@/lib/localStorage';
import { generateAutoPassword } from '@/lib/utils';
import { useStudent } from '@/context/StudentContext';
import { STORAGE_KEYS } from '@/lib/constants';

interface AdminContextType {
  // Current user & role & auth
  currentAdmin: AdminUser;
  currentRole: AdminRole;
  activeTab: AdminTabKey;
  setActiveTab: (tab: AdminTabKey) => void;
  switchRole: (role: AdminRole, userId?: string) => void;
  isAdminLoggedIn: boolean;
  loginAdmin: (usernameOrEmail: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logoutAdmin: () => void;

  // Entities
  adminUsers: AdminUser[];
  students: AdminStudent[];
  parents: AdminParent[];
  teachers: AdminTeacher[];
  groups: AdminGroup[];
  curricula: CurriculumLevel[];
  attendanceSessions: AttendanceSession[];
  homeworkList: AdminHomeworkAssignment[];
  assessments: AdminAssessmentRecord[];
  feedbackList: TwoWayFeedbackItem[];
  rolePermissions: AdminRolePermissionConfig[];
  auditLogs: AuditLogEntry[];
  notifications: AdminNotificationItem[];
  pendingApprovals: PendingStudentApproval[];

  // Role-filtered access helpers
  visibleStudents: AdminStudent[];
  visibleGroups: AdminGroup[];
  visibleParents: AdminParent[];
  visibleAttendance: AttendanceSession[];
  visibleHomework: AdminHomeworkAssignment[];
  visibleAssessments: AdminAssessmentRecord[];

  // Action methods
  addStudent: (studentData: Partial<AdminStudent>) => void;
  updateStudent: (studentId: string, updates: Partial<AdminStudent>) => void;
  archiveStudent: (studentId: string) => void;
  
  addParent: (parentData: Partial<AdminParent>) => void;
  updateParent: (parentId: string, updates: Partial<AdminParent>) => void;
  deleteParent: (parentId: string) => void;
  linkStudentToParent: (parentId: string, studentId: string) => void;
  unlinkStudentFromParent: (parentId: string, studentId: string) => void;

  addTeacher: (teacherData: Partial<AdminTeacher>) => void;
  updateTeacher: (teacherId: string, updates: Partial<AdminTeacher>) => void;

  addGroup: (groupData: Partial<AdminGroup>) => void;
  updateGroup: (groupId: string, updates: Partial<AdminGroup>) => void;
  assignStudentToGroup: (groupId: string, studentId: string) => void;
  removeStudentFromGroup: (groupId: string, studentId: string) => void;

  addCurriculumLevel: (levelData: CurriculumLevel) => void;
  updateCurriculumLevel: (oldLevelNumber: number, language: 'English' | 'French', levelData: CurriculumLevel) => void;
  reorderCurriculumLevels: (language: 'English' | 'French', newOrderedLevels: CurriculumLevel[]) => void;
  deleteCurriculumLevel: (levelNumber: number, language: 'English' | 'French') => void;

  lessonProgressRecords: Record<string, LessonProgressStatus>;
  updateLessonProgress: (
    studentId: string,
    lessonId: string,
    status: LessonProgressStatus,
    levelNumber?: number
  ) => void;

  studentLevelScores: Record<string, { score: number; honorsDegreeAr?: string; completedDate?: string }>;
  updateStudentLevelScore: (
    studentId: string,
    levelNumber: number,
    score: number,
    honorsDegreeAr?: string,
    completedDate?: string
  ) => void;

  recordAttendance: (
    sessionId: string,
    records: { studentId: string; status: 'present' | 'late' | 'absent' | 'excused'; note?: string }[],
    sessionMeta?: {
      groupId: string;
      groupName: string;
      date: string;
      dayNameAr: string;
      dayNameEn: string;
      sessionTime: string;
      teacherId: string;
      teacherName: string;
      isCoveringSession?: boolean;
      coveringType?: 'counted' | 'not_counted';
      coveringReason?: string;
    }
  ) => void;
  addCoveringSession: (sessionData: {
    groupId: string;
    groupName: string;
    date: string;
    dayNameAr: string;
    dayNameEn: string;
    sessionTime: string;
    teacherId: string;
    teacherName: string;
    coveringType: 'counted' | 'not_counted';
    coveringReason?: string;
  }) => void;
  
  createHomework: (hwData: Partial<AdminHomeworkAssignment>) => void;
  evaluateHomework: (hwId: string, studentId: string, score: number, comment: string, status: 'completed' | 'needs_revision') => void;
  batchEvaluateHomework: (
    hwId: string,
    evaluations: {
      studentId: string;
      score: number;
      teacherComment?: string;
      completionStatus: 'completed' | 'needs_revision' | 'pending';
    }[]
  ) => void;

  recordAssessment: (asmData: Partial<AdminAssessmentRecord>) => void;
  
  addTeacherFeedback: (studentId: string, feedback: { strengths: string[]; needsImprovement: string[]; recommendations: string; generalComments: string }) => void;
  replyParentFeedback: (feedbackId: string, message: string) => void;

  updateRolePermissions: (roleId: AdminRole, modules: AdminRolePermissionConfig['modules']) => void;
  addNewAdminUser: (userData: Partial<AdminUser>) => void;
  updateAdminUser: (userId: string, updates: Partial<AdminUser>) => void;

  approveStudentRegistration: (approvalId: string, level: number, track?: string) => void;
  rejectStudentRegistration: (approvalId: string, reason?: string) => void;

  markNotificationRead: (notifId: string) => void;
  markAllNotificationsRead: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_STORAGE_KEYS = {
  IS_LOGGED_IN: 'myschool_admin_logged_in_v11',
  CURRENT_USER_ID: 'myschool_admin_user_id_v11',
  ADMIN_USERS: 'myschool_admin_users_v11',
  STUDENTS: 'myschool_admin_students_v11',
  PARENTS: 'myschool_admin_parents_v11',
  TEACHERS: 'myschool_admin_teachers_v11',
  GROUPS: 'myschool_admin_groups_v11',
  CURRICULA: 'myschool_admin_curricula_v11',
  ATTENDANCE: 'myschool_admin_attendance_v11',
  HOMEWORK: 'myschool_admin_homework_v11',
  ASSESSMENTS: 'myschool_admin_assessments_v11',
  FEEDBACK: 'myschool_admin_feedback_v11',
  PERMISSIONS: 'myschool_admin_permissions_v11',
  AUDIT_LOGS: 'myschool_admin_audit_logs_v11',
  NOTIFICATIONS: 'myschool_admin_notifications_v11',
  APPROVALS: 'myschool_admin_approvals_v11',
  LESSON_PROGRESS: 'myschool_admin_lesson_progress_v11',
  STUDENT_LEVEL_SCORES: 'myschool_admin_student_level_scores_v11',
};

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const { approveStudent: approveInStudentContext, updateStudent: updateInStudentContext } = useStudent();

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return getItem<boolean>(ADMIN_STORAGE_KEYS.IS_LOGGED_IN) ?? false;
  });
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(mockAdminUsers);
  const [currentAdminId, setCurrentAdminId] = useState<string>(mockAdminUsers[0].id);
  const [activeTab, setActiveTab] = useState<AdminTabKey>('overview');

  const [students, setStudents] = useState<AdminStudent[]>(mockAdminStudents);
  const [parents, setParents] = useState<AdminParent[]>(mockAdminParents);
  const [teachers, setTeachers] = useState<AdminTeacher[]>(mockAdminTeachers);
  const [groups, setGroups] = useState<AdminGroup[]>(mockAdminGroups);
  const [curricula, setCurricula] = useState<CurriculumLevel[]>(mockCurricula);
  const [studentLevelScores, setStudentLevelScores] = useState<
    Record<string, { score: number; honorsDegreeAr?: string; completedDate?: string }>
  >(() => {
    return (
      getItem<Record<string, { score: number; honorsDegreeAr?: string; completedDate?: string }>>(
        ADMIN_STORAGE_KEYS.STUDENT_LEVEL_SCORES
      ) || {}
    );
  });
  const [lessonProgressRecords, setLessonProgressRecords] = useState<Record<string, LessonProgressStatus>>({});
  const [attendanceSessions, setAttendanceSessions] = useState<AttendanceSession[]>(mockAttendanceSessions);
  const [homeworkList, setHomeworkList] = useState<AdminHomeworkAssignment[]>(mockAdminHomework);
  const [assessments, setAssessments] = useState<AdminAssessmentRecord[]>(mockAdminAssessments);
  const [feedbackList, setFeedbackList] = useState<TwoWayFeedbackItem[]>(mockTwoWayFeedback);
  const [rolePermissions, setRolePermissions] = useState<AdminRolePermissionConfig[]>(mockRolePermissions);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(mockAuditLogs);
  const [notifications, setNotifications] = useState<AdminNotificationItem[]>(mockAdminNotifications);
  const [pendingApprovals, setPendingApprovals] = useState<PendingStudentApproval[]>(mockPendingApprovals);

  // Sync state from storage
  useEffect(() => {
    const sLoggedIn = getItem<boolean>(ADMIN_STORAGE_KEYS.IS_LOGGED_IN);
    if (typeof sLoggedIn === 'boolean') setIsAdminLoggedIn(sLoggedIn);

    const sUsers = getItem<AdminUser[]>(ADMIN_STORAGE_KEYS.ADMIN_USERS);
    if (sUsers?.length) setAdminUsers(sUsers);

    const sAdminId = getItem<string>(ADMIN_STORAGE_KEYS.CURRENT_USER_ID);
    if (sAdminId) setCurrentAdminId(sAdminId);

    const sStudents = getItem<AdminStudent[]>(ADMIN_STORAGE_KEYS.STUDENTS);
    if (sStudents?.length) setStudents(sStudents);

    const sParents = getItem<AdminParent[]>(ADMIN_STORAGE_KEYS.PARENTS);
    if (sParents?.length) setParents(sParents);

    const sTeachers = getItem<AdminTeacher[]>(ADMIN_STORAGE_KEYS.TEACHERS);
    if (sTeachers?.length) setTeachers(sTeachers);

    const sGroups = getItem<AdminGroup[]>(ADMIN_STORAGE_KEYS.GROUPS);
    if (sGroups?.length) setGroups(sGroups);

    const sCurricula = getItem<CurriculumLevel[]>(ADMIN_STORAGE_KEYS.CURRICULA);
    if (sCurricula?.length) setCurricula(sCurricula);

    const sProgress = getItem<Record<string, LessonProgressStatus>>(ADMIN_STORAGE_KEYS.LESSON_PROGRESS);
    if (sProgress && Object.keys(sProgress).length) {
      setLessonProgressRecords(sProgress);
    } else {
      // Seed realistic initial lesson progress for mock students based on their overall progress
      const initialMap: Record<string, LessonProgressStatus> = {};
      mockAdminStudents.forEach((st) => {
        const studentLevel = mockCurricula.find(
          (c) => (c.levelNumber === st.currentLevel || c.cefrCode === st.cefrLevel) && c.language === (st.language === 'French' ? 'French' : 'English')
        ) || mockCurricula[0];

        if (studentLevel) {
          const allLessons = studentLevel.units.flatMap((u) => u.lessons);
          const completedCount = Math.round((st.overallProgress / 100) * allLessons.length);
          allLessons.forEach((l, idx) => {
            if (idx < completedCount) {
              initialMap[`${st.id}_${l.id}`] = 'completed';
            } else if (idx === completedCount && st.overallProgress < 100) {
              initialMap[`${st.id}_${l.id}`] = 'in_progress';
            } else {
              initialMap[`${st.id}_${l.id}`] = 'not_started';
            }
          });
        }
      });
      setLessonProgressRecords(initialMap);
      setItem(ADMIN_STORAGE_KEYS.LESSON_PROGRESS, initialMap);
    }

    const sAttendance = getItem<AttendanceSession[]>(ADMIN_STORAGE_KEYS.ATTENDANCE);
    if (sAttendance?.length) setAttendanceSessions(sAttendance);

    const sHomework = getItem<AdminHomeworkAssignment[]>(ADMIN_STORAGE_KEYS.HOMEWORK);
    if (sHomework?.length) setHomeworkList(sHomework);

    const sAssessments = getItem<AdminAssessmentRecord[]>(ADMIN_STORAGE_KEYS.ASSESSMENTS);
    if (sAssessments?.length) setAssessments(sAssessments);

    const sFeedback = getItem<TwoWayFeedbackItem[]>(ADMIN_STORAGE_KEYS.FEEDBACK);
    if (sFeedback?.length) setFeedbackList(sFeedback);

    const sLogs = getItem<AuditLogEntry[]>(ADMIN_STORAGE_KEYS.AUDIT_LOGS);
    if (sLogs?.length) setAuditLogs(sLogs);

    const sNotifs = getItem<AdminNotificationItem[]>(ADMIN_STORAGE_KEYS.NOTIFICATIONS);
    if (sNotifs?.length) setNotifications(sNotifs);

    const sApprovals = getItem<PendingStudentApproval[]>(ADMIN_STORAGE_KEYS.APPROVALS);
    if (sApprovals?.length) setPendingApprovals(sApprovals);

    // Dynamic sync listener for cross-context / Parent Portal updates
    const handleSync = () => {
      const liveParents = getItem<AdminParent[]>(ADMIN_STORAGE_KEYS.PARENTS);
      if (liveParents?.length) setParents(liveParents);

      const liveStudents = getItem<AdminStudent[]>(ADMIN_STORAGE_KEYS.STUDENTS);
      if (liveStudents?.length) setStudents(liveStudents);

      const liveScores = getItem<Record<string, { score: number; honorsDegreeAr?: string; completedDate?: string }>>(
        ADMIN_STORAGE_KEYS.STUDENT_LEVEL_SCORES
      );
      if (liveScores) setStudentLevelScores(liveScores);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('awliya-data-sync', handleSync);
      window.addEventListener('storage', handleSync);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('awliya-data-sync', handleSync);
        window.removeEventListener('storage', handleSync);
      }
    };
  }, []);

  const currentAdmin = useMemo(() => {
    return adminUsers.find((u) => u.id === currentAdminId) || adminUsers[0];
  }, [adminUsers, currentAdminId]);

  const currentRole = currentAdmin.role;

  // Log an administrative action to audit logs
  const logAudit = useCallback(
    (actionAr: string, actionEn: string, targetEntity: AuditLogEntry['targetEntity'], prev?: string, next?: string, details?: string) => {
      const entry: AuditLogEntry = {
        id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        actorId: currentAdmin.id,
        actorName: currentAdmin.fullNameAr,
        actorRole: currentAdmin.role,
        actionAr,
        actionEn,
        targetEntity,
        previousValue: prev,
        newValue: next,
        details,
      };
      setAuditLogs((prevLogs) => {
        const updated = [entry, ...prevLogs];
        setItem(ADMIN_STORAGE_KEYS.AUDIT_LOGS, updated);
        return updated;
      });
    },
    [currentAdmin]
  );

  // Switch role or specific user
  const switchRole = useCallback(
    (role: AdminRole, userId?: string) => {
      let targetUser: AdminUser | undefined;
      if (userId) {
        targetUser = adminUsers.find((u) => u.id === userId);
      } else {
        targetUser = adminUsers.find((u) => u.role === role);
      }
      if (targetUser) {
        setCurrentAdminId(targetUser.id);
        setItem(ADMIN_STORAGE_KEYS.CURRENT_USER_ID, targetUser.id);
      }
    },
    [adminUsers]
  );

  // Admin / Staff Login
  const loginAdmin = useCallback(
    async (usernameOrEmail: string, password: string): Promise<{ success: boolean; message?: string }> => {
      const trimmed = usernameOrEmail.trim().toLowerCase();
      const trimmedPass = password.trim();

      if (!trimmed) {
        return { success: false, message: 'empty_username' };
      }

      const user = adminUsers.find(
        (u) =>
          u.email.toLowerCase() === trimmed ||
          u.username.toLowerCase() === trimmed ||
          u.fullNameAr.toLowerCase() === trimmed ||
          u.fullNameEn.toLowerCase() === trimmed
      );

      if (!user) {
        return { success: false, message: 'user_not_found' };
      }

      if (user.status === 'inactive' || user.status === 'suspended') {
        return { success: false, message: 'user_inactive' };
      }

      // Password check with mock flexibility (admin123, user's defined password, or any standard mock pass)
      const expectedPass = user.password || 'admin123';
      if (
        trimmedPass !== expectedPass &&
        trimmedPass !== 'admin123' &&
        trimmedPass !== 'admin' &&
        trimmedPass !== '123456'
      ) {
        return { success: false, message: 'invalid_password' };
      }

      setCurrentAdminId(user.id);
      setIsAdminLoggedIn(true);
      setItem(ADMIN_STORAGE_KEYS.CURRENT_USER_ID, user.id);
      setItem(ADMIN_STORAGE_KEYS.IS_LOGGED_IN, true);

      return { success: true };
    },
    [adminUsers]
  );

  // Admin / Staff Logout
  const logoutAdmin = useCallback(() => {
    setIsAdminLoggedIn(false);
    setItem(ADMIN_STORAGE_KEYS.IS_LOGGED_IN, false);
  }, []);

  // Helper to dispatch instant parent notification into parent portal
  const notifyParentPortal = useCallback(
    (notif: {
      studentId?: string;
      type: 'homework' | 'payment' | 'attendance' | 'feedback' | 'general';
      titleAr: string;
      messageAr: string;
      routeTo?: string;
      actionPayload?: { tab?: string; level?: any; itemId?: string };
    }) => {
      try {
        const existing = getItem<any[]>(STORAGE_KEYS.NOTIFICATIONS) || [];
        const newNotif = {
          id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          date: new Date().toISOString().substring(0, 10),
          isRead: false,
          ...notif,
        };
        const updated = [newNotif, ...existing];
        setItem(STORAGE_KEYS.NOTIFICATIONS, updated);
      } catch (err) {
        console.error('Error dispatching parent notification:', err);
      }
    },
    []
  );

  // RBAC Filtered entities (Teacher only sees own groups and students)
  const teacherAssignedGroupIds = useMemo(() => {
    if (currentRole !== 'teacher') return [];
    const teacherEntity = teachers.find((t) => t.id === currentAdmin.id || t.username === currentAdmin.username);
    return teacherEntity ? teacherEntity.assignedGroupIds : currentAdmin.assignedGroups || [];
  }, [currentRole, teachers, currentAdmin]);

  const visibleGroups = useMemo(() => {
    if (currentRole === 'teacher') {
      return groups.filter((g) => teacherAssignedGroupIds.includes(g.id) || g.teacherId === currentAdmin.id);
    }
    return groups;
  }, [currentRole, groups, teacherAssignedGroupIds, currentAdmin.id]);

  const visibleStudents = useMemo(() => {
    if (currentRole === 'teacher') {
      const allowedGroupIds = visibleGroups.map((g) => g.id);
      return students.filter((s) => allowedGroupIds.includes(s.groupId) || s.teacherId === currentAdmin.id);
    }
    return students;
  }, [currentRole, students, visibleGroups, currentAdmin.id]);

  const visibleParents = useMemo(() => {
    if (currentRole === 'teacher') {
      const visibleStudentParentIds = visibleStudents.map((s) => s.parentId);
      return parents.filter((p) => visibleStudentParentIds.includes(p.id));
    }
    return parents;
  }, [currentRole, parents, visibleStudents]);

  const visibleAttendance = useMemo(() => {
    if (currentRole === 'teacher') {
      const allowedGroupIds = visibleGroups.map((g) => g.id);
      return attendanceSessions.filter((a) => allowedGroupIds.includes(a.groupId));
    }
    return attendanceSessions;
  }, [currentRole, attendanceSessions, visibleGroups]);

  const visibleHomework = useMemo(() => {
    if (currentRole === 'teacher') {
      const allowedGroupIds = visibleGroups.map((g) => g.id);
      return homeworkList.filter((h) => allowedGroupIds.includes(h.groupId));
    }
    return homeworkList;
  }, [currentRole, homeworkList, visibleGroups]);

  const visibleAssessments = useMemo(() => {
    if (currentRole === 'teacher') {
      const allowedGroupIds = visibleGroups.map((g) => g.id);
      return assessments.filter((a) => allowedGroupIds.includes(a.groupId));
    }
    return assessments;
  }, [currentRole, assessments, visibleGroups]);

  // ==========================================
  // Student Actions
  // ==========================================
  const addStudent = useCallback(
    (data: Partial<AdminStudent>) => {
      const newStudent: AdminStudent = {
        id: `stu-${Date.now()}`,
        fullNameAr: data.fullNameAr || 'طالب جديد',
        fullNameEn: data.fullNameEn || 'New Student',
        gender: data.gender || 'male',
        currentLevel: data.currentLevel || 1,
        cefrLevel: data.cefrLevel || 'A1',
        enrolledPathAr: data.enrolledPathAr || 'مسار اللغة الإنجليزية المكثف (CEFR)',
        enrolledPathEn: data.enrolledPathEn || 'Intensive English Language Track (CEFR)',
        language: data.language || 'English',
        groupId: data.groupId || 'grp-a1-01',
        groupName: data.groupName || 'Group A1 — Beginner',
        teacherId: data.teacherId || 'usr-teach-01',
        teacherName: data.teacherName || 'Sarah Benali',
        parentId: data.parentId || 'par-01',
        parentName: data.parentName || 'محمد بن علي',
        parentPhone: data.parentPhone || '+213 555 123 456',
        relationship: data.relationship || 'Father',
        enrollmentDate: new Date().toISOString().substring(0, 10),
        status: data.status || 'active',
        overallProgress: data.overallProgress || 0,
        attendanceRate: data.attendanceRate !== undefined ? data.attendanceRate : 0,
        averagePerformance: data.averagePerformance ?? 0,
        completedLessonsCount: 0,
        totalLessonsCount: 20,
        skills: data.skills || { listening: 0, speaking: 0, reading: 0, writing: 0, overall: 0 },
      };

      setStudents((prev) => {
        const updated = [newStudent, ...prev];
        setItem(ADMIN_STORAGE_KEYS.STUDENTS, updated);
        return updated;
      });

      logAudit(
        `إضافة طالب جديد: ${newStudent.fullNameAr}`,
        `Added new student: ${newStudent.fullNameEn}`,
        'student',
        undefined,
        newStudent.fullNameAr,
        `Assigned to Group ${newStudent.groupName}`
      );
    },
    [logAudit]
  );

  const updateStudent = useCallback(
    (studentId: string, updates: Partial<AdminStudent>) => {
      setStudents((prev) => {
        const prevStudent = prev.find((s) => s.id === studentId);
        const updated = prev.map((s) => (s.id === studentId ? { ...s, ...updates } : s));
        setItem(ADMIN_STORAGE_KEYS.STUDENTS, updated);

        if (prevStudent) {
          logAudit(
            `تحديث بيانات الطالب ${prevStudent.fullNameAr}`,
            `Updated details for student ${prevStudent.fullNameEn}`,
            'student',
            JSON.stringify(prevStudent),
            JSON.stringify({ ...prevStudent, ...updates })
          );
        }
        return updated;
      });
    },
    [logAudit]
  );

  const archiveStudent = useCallback(
    (studentId: string) => {
      updateStudent(studentId, { status: 'archived' });
    },
    [updateStudent]
  );

  // ==========================================
  // Parent Actions (Multi-Student Links)
  // ==========================================
  const addParent = useCallback(
    (data: Partial<AdminParent>) => {
      const newParent: AdminParent = {
        id: `par-${Date.now()}`,
        fullNameAr: data.fullNameAr || 'ولي أمر جديد',
        fullNameEn: data.fullNameEn || 'New Parent',
        phone: data.phone || '+213 550 000 000',
        email: data.email || 'parent@myschool.edu',
        address: data.address || 'الجزائر العاصمة',
        password: data.password || generateAutoPassword(),
        linkedStudentIds: data.linkedStudentIds || [],
        status: data.status || 'active',
        createdAt: new Date().toISOString().substring(0, 10),
      };

      setParents((prev) => {
        const updated = [newParent, ...prev];
        setItem(ADMIN_STORAGE_KEYS.PARENTS, updated);
        return updated;
      });

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('awliya-data-sync'));
      }

      logAudit(`إضافة ولي أمر جديد: ${newParent.fullNameAr}`, `Added new parent: ${newParent.fullNameEn}`, 'parent');
    },
    [logAudit]
  );

  const updateParent = useCallback(
    (parentId: string, updates: Partial<AdminParent>) => {
      setParents((prev) => {
        const updated = prev.map((p) => (p.id === parentId ? { ...p, ...updates } : p));
        setItem(ADMIN_STORAGE_KEYS.PARENTS, updated);
        return updated;
      });

      // If phone/email/name changed, sync linked students in admin database
      if (updates.fullNameAr || updates.phone || updates.email) {
        setStudents((prev) => {
          const updatedStudents = prev.map((s) => {
            if (s.parentId === parentId) {
              return {
                ...s,
                parentName: updates.fullNameAr || s.parentName,
                parentPhone: updates.phone || s.parentPhone,
                parentEmail: updates.email !== undefined ? updates.email : s.parentEmail,
              };
            }
            return s;
          });
          setItem(ADMIN_STORAGE_KEYS.STUDENTS, updatedStudents);
          return updatedStudents;
        });
      }

      // Sync active auth user session in Parent Portal if matching
      const currentAuthUser = getItem<any>(STORAGE_KEYS.AUTH_USER) || getItem<any>('awliya_auth_user_v4');
      if (
        currentAuthUser &&
        (currentAuthUser.id === parentId ||
          (updates.email && currentAuthUser.email?.toLowerCase() === updates.email.toLowerCase()) ||
          (updates.phone && (currentAuthUser.phone || '').replace(/\D/g, '') === (updates.phone || '').replace(/\D/g, '')))
      ) {
        const updatedAuth = {
          ...currentAuthUser,
          ...updates,
          fullNameAr: updates.fullNameAr || currentAuthUser.fullNameAr,
          fullNameEn: updates.fullNameEn || currentAuthUser.fullNameEn,
          phone: updates.phone || currentAuthUser.phone,
          email: updates.email || currentAuthUser.email,
          address: updates.address !== undefined ? updates.address : currentAuthUser.address,
          password: updates.password || currentAuthUser.password,
        };
        setItem(STORAGE_KEYS.AUTH_USER, updatedAuth);
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('awliya-data-sync'));
      }

      logAudit(`تحديث بيانات ولي الأمر: ${parentId}`, `Updated parent details: ${parentId}`, 'parent');
    },
    [logAudit]
  );

  const deleteParent = useCallback(
    (parentId: string) => {
      setParents((prev) => {
        const updated = prev.filter((p) => p.id !== parentId);
        setItem(ADMIN_STORAGE_KEYS.PARENTS, updated);
        return updated;
      });

      // Clear student's parent reference for any students linked to this parent
      setStudents((prev) => {
        const updated = prev.map((s) => {
          if (s.parentId === parentId) {
            return {
              ...s,
              parentId: '',
              parentName: '',
              parentPhone: '',
              parentEmail: '',
            };
          }
          return s;
        });
        setItem(ADMIN_STORAGE_KEYS.STUDENTS, updated);
        return updated;
      });

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('awliya-data-sync'));
      }

      logAudit(`حذف ولي الأمر: ${parentId}`, `Deleted parent: ${parentId}`, 'parent');
    },
    [logAudit]
  );

  const linkStudentToParent = useCallback(
    (parentId: string, studentId: string) => {
      setParents((prev) => {
        const updated = prev.map((p) => {
          if (p.id === parentId && !p.linkedStudentIds.includes(studentId)) {
            return { ...p, linkedStudentIds: [...p.linkedStudentIds, studentId] };
          }
          return p;
        });
        setItem(ADMIN_STORAGE_KEYS.PARENTS, updated);
        return updated;
      });

      // Also update student's parent reference
      const parentObj = parents.find((p) => p.id === parentId);
      if (parentObj) {
        updateStudent(studentId, {
          parentId: parentObj.id,
          parentName: parentObj.fullNameAr,
          parentPhone: parentObj.phone,
          parentEmail: parentObj.email,
        });
      }

      // Sync active auth session if current user is this parent
      const currentAuthUser = getItem<any>(STORAGE_KEYS.AUTH_USER) || getItem<any>('awliya_auth_user_v4');
      if (
        currentAuthUser &&
        (currentAuthUser.id === parentId ||
          (parentObj && currentAuthUser.email?.toLowerCase() === parentObj.email.toLowerCase()) ||
          (parentObj && (currentAuthUser.phone || '').replace(/\D/g, '') === (parentObj.phone || '').replace(/\D/g, '')))
      ) {
        const updatedUser = {
          ...currentAuthUser,
          linkedStudentIds: Array.from(new Set([...(currentAuthUser.linkedStudentIds || []), studentId])),
        };
        setItem(STORAGE_KEYS.AUTH_USER, updatedUser);
      }

      // Dispatch cross-context synchronization event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('awliya-data-sync'));
      }

      logAudit(
        `ربط الطالب ${studentId} بولي الأمر ${parentId}`,
        `Linked student ${studentId} to parent ${parentId}`,
        'parent'
      );
    },
    [parents, updateStudent, logAudit]
  );

  const unlinkStudentFromParent = useCallback(
    (parentId: string, studentId: string) => {
      setParents((prev) => {
        const updated = prev.map((p) => {
          if (p.id === parentId) {
            return { ...p, linkedStudentIds: p.linkedStudentIds.filter((id) => id !== studentId) };
          }
          return p;
        });
        setItem(ADMIN_STORAGE_KEYS.PARENTS, updated);
        return updated;
      });

      // Clear student's parent reference
      updateStudent(studentId, {
        parentId: '',
        parentName: '',
        parentPhone: '',
        parentEmail: '',
      });

      // Sync active auth session if current user is this parent
      const currentAuthUser = getItem<any>(STORAGE_KEYS.AUTH_USER) || getItem<any>('awliya_auth_user_v4');
      if (currentAuthUser && currentAuthUser.id === parentId) {
        const updatedUser = {
          ...currentAuthUser,
          linkedStudentIds: (currentAuthUser.linkedStudentIds || []).filter((id: string) => id !== studentId),
        };
        setItem(STORAGE_KEYS.AUTH_USER, updatedUser);
      }

      // Dispatch cross-context synchronization event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('awliya-data-sync'));
      }

      logAudit(
        `إلغاء ربط الطالب ${studentId} بولي الأمر ${parentId}`,
        `Unlinked student ${studentId} from parent ${parentId}`,
        'parent'
      );
    },
    [updateStudent, logAudit]
  );

  // ==========================================
  // Teacher Actions
  // ==========================================
  const addTeacher = useCallback(
    (data: Partial<AdminTeacher>) => {
      const newTeacher: AdminTeacher = {
        id: `usr-teach-${Date.now()}`,
        fullNameAr: data.fullNameAr || 'معلم جديد',
        fullNameEn: data.fullNameEn || 'New Teacher',
        username: data.username || `teacher_${Date.now().toString().slice(-4)}`,
        password: data.password || generateAutoPassword(),
        email: data.email || 'teacher@myschool.edu',
        phone: data.phone || '+213 770 000 000',
        languagesTaught: data.languagesTaught || ['English'],
        specialization: data.specialization || 'General Language Teacher',
        experience: data.experience || '3 years',
        assignedGroupIds: data.assignedGroupIds || [],
        status: data.status || 'active',
        createdAt: new Date().toISOString().substring(0, 10),
      };

      setTeachers((prev) => {
        const updated = [newTeacher, ...prev];
        setItem(ADMIN_STORAGE_KEYS.TEACHERS, updated);
        return updated;
      });

      // Also add to adminUsers
      const newAdminUser: AdminUser = {
        id: newTeacher.id,
        fullNameAr: newTeacher.fullNameAr,
        fullNameEn: newTeacher.fullNameEn,
        username: newTeacher.username,
        email: newTeacher.email,
        role: 'teacher',
        phone: newTeacher.phone,
        departmentAr: `هيئة التدريس (${newTeacher.languagesTaught.join(' & ')})`,
        departmentEn: `Teaching Staff (${newTeacher.languagesTaught.join(' & ')})`,
        languagesTaught: newTeacher.languagesTaught,
        specialization: newTeacher.specialization,
        experience: newTeacher.experience,
        assignedGroups: newTeacher.assignedGroupIds,
        createdAt: newTeacher.createdAt,
        status: 'active',
      };

      setAdminUsers((prev) => {
        const updated = [newAdminUser, ...prev];
        setItem(ADMIN_STORAGE_KEYS.ADMIN_USERS, updated);
        return updated;
      });

      logAudit(
        `إنشاء حساب معلم جديد: ${newTeacher.fullNameAr} (${newTeacher.username})`,
        `Created teacher account: ${newTeacher.fullNameEn}`,
        'teacher'
      );
    },
    [logAudit]
  );

  const updateTeacher = useCallback(
    (teacherId: string, updates: Partial<AdminTeacher>) => {
      setTeachers((prev) => {
        const updated = prev.map((t) => (t.id === teacherId ? { ...t, ...updates } : t));
        setItem(ADMIN_STORAGE_KEYS.TEACHERS, updated);
        return updated;
      });

      setAdminUsers((prev) => {
        const updated = prev.map((u) => {
          if (u.id === teacherId) {
            return {
              ...u,
              fullNameAr: updates.fullNameAr || u.fullNameAr,
              fullNameEn: updates.fullNameEn || u.fullNameEn,
              username: updates.username || u.username,
              email: updates.email || u.email,
              phone: updates.phone || u.phone,
              languagesTaught: updates.languagesTaught || u.languagesTaught,
            };
          }
          return u;
        });
        setItem(ADMIN_STORAGE_KEYS.ADMIN_USERS, updated);
        return updated;
      });

      logAudit(
        `تحديث بيانات المعلم: ${updates.fullNameAr || teacherId}${updates.password ? ' (تم تغيير كلمة المرور)' : ''}`,
        `Updated teacher details for ${teacherId}`,
        'teacher'
      );
    },
    [logAudit]
  );

  // ==========================================
  // Group Actions (Class Hub)
  // ==========================================
  const addGroup = useCallback(
    (data: Partial<AdminGroup>) => {
      const newGroup: AdminGroup = {
        id: `grp-${Date.now()}`,
        name: data.name || 'Group New',
        code: data.code || `G-${Date.now().toString().slice(-3)}`,
        language: data.language || 'English',
        level: data.level || 'A1',
        levelNumber: data.levelNumber || 1,
        teacherId: data.teacherId || 'usr-teach-01',
        teacherName: data.teacherName || 'Sarah Benali',
        daysAr: data.daysAr || 'الأحد + الثلاثاء',
        daysEn: data.daysEn || 'Sunday + Tuesday',
        startTime: data.startTime || '18:00',
        endTime: data.endTime || '20:00',
        schedules: data.schedules || [],
        maxCapacity: data.maxCapacity || 20,
        studentIds: data.studentIds || [],
        attendanceRate: 0,
        averageProgress: 0,
        averagePerformance: 0,
        completedLessonsCount: 0,
        totalLessonsCount: 20,
        status: data.status || 'active',
      };

      setGroups((prev) => {
        const updated = [newGroup, ...prev];
        setItem(ADMIN_STORAGE_KEYS.GROUPS, updated);
        return updated;
      });

      logAudit(
        `إنشاء فوج جديد: ${newGroup.name} (${newGroup.code})`,
        `Created new class group: ${newGroup.name}`,
        'group'
      );
    },
    [logAudit]
  );

  const updateGroup = useCallback(
    (groupId: string, updates: Partial<AdminGroup>) => {
      setGroups((prev) => {
        const updated = prev.map((g) => (g.id === groupId ? { ...g, ...updates } : g));
        setItem(ADMIN_STORAGE_KEYS.GROUPS, updated);
        return updated;
      });

      // Update student denormalized fields if group name, level, or teacher changed
      if (updates.name || updates.level || updates.teacherName || updates.teacherId) {
        setStudents((prev) => {
          const updated = prev.map((s) => {
            if (s.groupId === groupId) {
              return {
                ...s,
                groupName: updates.name || s.groupName,
                cefrLevel: (updates.level as any) || s.cefrLevel,
                teacherName: updates.teacherName || s.teacherName,
                teacherId: updates.teacherId || s.teacherId,
              };
            }
            return s;
          });
          setItem(ADMIN_STORAGE_KEYS.STUDENTS, updated);
          return updated;
        });
      }

      if (typeof window !== 'undefined') {
        setTimeout(() => window.dispatchEvent(new CustomEvent('awliya-data-sync')), 0);
      }

      logAudit(
        `تعديل بيانات الفوج: ${updates.name || groupId}`,
        `Updated group details for ${groupId}`,
        'group'
      );
    },
    [logAudit]
  );

  const assignStudentToGroup = useCallback(
    (groupId: string, studentId: string) => {
      const targetGroup = groups.find((g) => g.id === groupId);
      if (!targetGroup) return;

      setGroups((prev) => {
        const updated = prev.map((g) => {
          if (g.id === groupId && !g.studentIds.includes(studentId)) {
            return { ...g, studentIds: [...g.studentIds, studentId] };
          }
          return g;
        });
        setItem(ADMIN_STORAGE_KEYS.GROUPS, updated);
        return updated;
      });

      // Update student's group
      updateStudent(studentId, {
        groupId: targetGroup.id,
        groupName: targetGroup.name,
        teacherId: targetGroup.teacherId,
        teacherName: targetGroup.teacherName,
      });

      logAudit(
        `إسناد الطالب ${studentId} إلى الفوج ${targetGroup.name}`,
        `Assigned student ${studentId} to Group ${targetGroup.name}`,
        'group'
      );
    },
    [groups, updateStudent, logAudit]
  );

  const removeStudentFromGroup = useCallback(
    (groupId: string, studentId: string) => {
      setGroups((prev) => {
        const updated = prev.map((g) => {
          if (g.id === groupId) {
            return { ...g, studentIds: g.studentIds.filter((id) => id !== studentId) };
          }
          return g;
        });
        setItem(ADMIN_STORAGE_KEYS.GROUPS, updated);
        return updated;
      });
    },
    []
  );

  // ==========================================
  // Curriculum Actions
  // ==========================================
  const addCurriculumLevel = useCallback(
    (levelData: CurriculumLevel) => {
      setCurricula((prev) => {
        const existingIdx = prev.findIndex(
          (c) => c.levelNumber === levelData.levelNumber && c.language === levelData.language
        );
        let updated: CurriculumLevel[];
        if (existingIdx >= 0) {
          updated = prev.map((c, i) => (i === existingIdx ? levelData : c));
        } else {
          updated = [...prev, levelData];
        }
        setItem(ADMIN_STORAGE_KEYS.CURRICULA, updated);
        return updated;
      });

      if (typeof window !== 'undefined') {
        setTimeout(() => window.dispatchEvent(new CustomEvent('awliya-data-sync')), 0);
      }

      logAudit(
        `إضافة مستوى ومنهاج جديد: ${levelData.nameAr} (${levelData.cefrCode})`,
        `Added new curriculum level: ${levelData.nameEn} (${levelData.cefrCode})`,
        'curriculum',
        undefined,
        levelData.nameAr,
        `${levelData.units.length} units configured`
      );
    },
    [logAudit]
  );

  const updateCurriculumLevel = useCallback(
    (oldLevelNumber: number, lang: 'English' | 'French', levelData: CurriculumLevel) => {
      setCurricula((prev) => {
        const updated = prev.map((c) =>
          c.levelNumber === oldLevelNumber && c.language === lang ? levelData : c
        );
        setItem(ADMIN_STORAGE_KEYS.CURRICULA, updated);
        return updated;
      });

      if (typeof window !== 'undefined') {
        setTimeout(() => window.dispatchEvent(new CustomEvent('awliya-data-sync')), 0);
      }

      logAudit(
        `تعديل بيانات المنهاج: ${levelData.nameAr} (${levelData.cefrCode})`,
        `Updated curriculum level: ${levelData.nameEn} (${levelData.cefrCode})`,
        'curriculum',
        undefined,
        levelData.nameAr,
        `Updated units and lessons structure`
      );
    },
    [logAudit]
  );

  const reorderCurriculumLevels = useCallback(
    (lang: 'English' | 'French', newOrderedLevels: CurriculumLevel[]) => {
      setCurricula((prev) => {
        const otherLang = prev.filter((c) => c.language !== lang);
        const renumbered = newOrderedLevels.map((lvl, idx) => ({
          ...lvl,
          levelNumber: idx + 1,
        }));
        const updated = [...otherLang, ...renumbered];
        setItem(ADMIN_STORAGE_KEYS.CURRICULA, updated);
        return updated;
      });

      if (typeof window !== 'undefined') {
        setTimeout(() => window.dispatchEvent(new CustomEvent('awliya-data-sync')), 0);
      }

      logAudit(
        `إعادة ترتيب مستويات المنهاج (${lang})`,
        `Reordered curriculum levels for (${lang})`,
        'curriculum'
      );
    },
    [logAudit]
  );

  const deleteCurriculumLevel = useCallback(
    (lvlNum: number, lang: 'English' | 'French') => {
      let target: CurriculumLevel | undefined;
      setCurricula((prev) => {
        target = prev.find((c) => c.levelNumber === lvlNum && c.language === lang);
        const filtered = prev.filter((c) => !(c.levelNumber === lvlNum && c.language === lang));
        const sameLang = filtered.filter((c) => c.language === lang).map((lvl, idx) => ({ ...lvl, levelNumber: idx + 1 }));
        const otherLang = filtered.filter((c) => c.language !== lang);
        const updated = [...otherLang, ...sameLang];
        setItem(ADMIN_STORAGE_KEYS.CURRICULA, updated);
        return updated;
      });

      if (typeof window !== 'undefined') {
        setTimeout(() => window.dispatchEvent(new CustomEvent('awliya-data-sync')), 0);
      }

      if (target) {
        logAudit(
          `حذف مستوى من المنهاج: ${target.nameAr}`,
          `Deleted curriculum level: ${target.nameEn}`,
          'curriculum'
        );
      }
    },
    [logAudit]
  );

  const updateLessonProgress = useCallback(
    (
      studentId: string,
      lessonId: string,
      status: LessonProgressStatus,
      levelNumber?: number
    ) => {
      const key = `${studentId}_${lessonId}`;

      setLessonProgressRecords((prev) => {
        const updated = { ...prev, [key]: status };
        setItem(ADMIN_STORAGE_KEYS.LESSON_PROGRESS, updated);
        return updated;
      });

      setStudents((prevStudents) => {
        const student = prevStudents.find((s) => s.id === studentId);
        if (!student) return prevStudents;

        const studentLevelNum = levelNumber || student.currentLevel || 1;
        const studentCurriculum =
          curricula.find(
            (c) =>
              (c.levelNumber === studentLevelNum || c.cefrCode === student.cefrLevel) &&
              c.language === (student.language === 'French' ? 'French' : 'English')
          ) || curricula[0];

        const allLessons = studentCurriculum ? studentCurriculum.units.flatMap((u) => u.lessons) : [];
        const totalLessons = allLessons.length || 1;

        const currentRecords = getItem<Record<string, LessonProgressStatus>>(ADMIN_STORAGE_KEYS.LESSON_PROGRESS) || {};
        const completedCount = allLessons.filter((l) =>
          l.id === lessonId ? status === 'completed' : currentRecords[`${studentId}_${l.id}`] === 'completed'
        ).length;

        const newProgress = Math.round((completedCount / totalLessons) * 100);

        const updatedStudents = prevStudents.map((s) =>
          s.id === studentId
            ? {
                ...s,
                overallProgress: newProgress,
                completedLessonsCount: completedCount,
                totalLessonsCount: totalLessons,
              }
            : s
        );
        setItem(ADMIN_STORAGE_KEYS.STUDENTS, updatedStudents);

        if (student.groupId) {
          const gId = student.groupId;
          setTimeout(() => {
            setGroups((prevGroups) => {
              const groupStudents = updatedStudents.filter((s) => s.groupId === gId);
              if (groupStudents.length === 0) return prevGroups;
              const avg = Math.round(
                groupStudents.reduce((acc, st) => acc + (st.overallProgress || 0), 0) / groupStudents.length
              );
              const updatedGroups = prevGroups.map((g) =>
                g.id === gId ? { ...g, averageProgress: avg } : g
              );
              setItem(ADMIN_STORAGE_KEYS.GROUPS, updatedGroups);
              return updatedGroups;
            });
          }, 0);
        }

        return updatedStudents;
      });

      if (typeof window !== 'undefined') {
        setTimeout(() => window.dispatchEvent(new CustomEvent('awliya-data-sync')), 0);
      }

      logAudit(
        `تحديث حالة الدرس للطالب (${studentId}): ${status}`,
        `Updated student (${studentId}) lesson (${lessonId}) status to ${status}`,
        'curriculum'
      );
    },
    [curricula, logAudit]
  );

  const updateStudentLevelScore = useCallback(
    (
      studentId: string,
      levelNumber: number,
      score: number,
      honorsDegreeAr?: string,
      completedDate?: string
    ) => {
      setStudentLevelScores((prev) => {
        const key = `${studentId}_level_${levelNumber}`;
        const updated = {
          ...prev,
          [key]: {
            score,
            honorsDegreeAr: honorsDegreeAr || 'تقدير: ممتاز مرتفع (مع مرتبة الشرف)',
            completedDate: completedDate || new Date().toISOString().split('T')[0],
          },
        };
        setItem(ADMIN_STORAGE_KEYS.STUDENT_LEVEL_SCORES, updated);
        return updated;
      });

      if (typeof window !== 'undefined') {
        setTimeout(() => window.dispatchEvent(new CustomEvent('awliya-data-sync')), 0);
      }

      logAudit(
        `تحديث درجة الاجتياز والاعتماد للطالب: ${studentId}`,
        `Updated level ${levelNumber} final score for student ${studentId} to ${score}%`,
        'curriculum',
        studentId,
        `Level ${levelNumber}`,
        `Score: ${score}% - ${honorsDegreeAr || ''}`
      );
    },
    [logAudit]
  );

  // ==========================================
  // Attendance Actions
  // ==========================================
  const recordAttendance = useCallback(
    (
      sessionId: string,
      records: { studentId: string; status: 'present' | 'late' | 'absent' | 'excused'; note?: string }[],
      sessionMeta?: {
        groupId: string;
        groupName: string;
        date: string;
        dayNameAr: string;
        dayNameEn: string;
        sessionTime: string;
        teacherId: string;
        teacherName: string;
      }
    ) => {
      let updatedSessionsResult: AttendanceSession[] = [];

      setAttendanceSessions((prev) => {
        const existingIdx = prev.findIndex((sess) => sess.id === sessionId);

        if (existingIdx >= 0) {
          const updated = [...prev];
          const currentSess = updated[existingIdx];
          const updatedEntries = currentSess.records.map((rec) => {
            const matchingNew = records.find((r) => r.studentId === rec.studentId);
            if (matchingNew) {
              return {
                ...rec,
                status: matchingNew.status,
                note: matchingNew.note || rec.note,
                recordedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              };
            }
            return rec;
          });

          // Include any students in this group not yet in session
          records.forEach((newRec) => {
            if (!updatedEntries.some((r) => r.studentId === newRec.studentId)) {
              const studentObj = students.find((s) => s.id === newRec.studentId);
              updatedEntries.push({
                studentId: newRec.studentId,
                studentNameAr: studentObj?.fullNameAr || newRec.studentId,
                studentNameEn: studentObj?.fullNameEn || newRec.studentId,
                status: newRec.status,
                note: newRec.note || '',
                recordedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              });
            }
          });

          updated[existingIdx] = { ...currentSess, records: updatedEntries, isLocked: true };
          updatedSessionsResult = updated;
          setItem(ADMIN_STORAGE_KEYS.ATTENDANCE, updated);
          return updated;
        } else {
          // Create new session
          const studentEntries: AttendanceStudentEntry[] = records.map((r) => {
            const studentObj = students.find((s) => s.id === r.studentId);
            return {
              studentId: r.studentId,
              studentNameAr: studentObj?.fullNameAr || r.studentId,
              studentNameEn: studentObj?.fullNameEn || r.studentId,
              status: r.status,
              note: r.note || '',
              recordedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
          });

          const newSession: AttendanceSession = {
            id: sessionId,
            groupId: sessionMeta?.groupId || 'grp-a1-01',
            groupName: sessionMeta?.groupName || 'Group',
            date: sessionMeta?.date || new Date().toISOString().split('T')[0],
            dayNameAr: sessionMeta?.dayNameAr || 'اليوم',
            dayNameEn: sessionMeta?.dayNameEn || 'Today',
            sessionTime: sessionMeta?.sessionTime || '04:30',
            teacherId: sessionMeta?.teacherId || 'usr-teach-01',
            teacherName: sessionMeta?.teacherName || 'Teacher',
            records: studentEntries,
            isLocked: true,
          };
          const updated = [newSession, ...prev];
          updatedSessionsResult = updated;
          setItem(ADMIN_STORAGE_KEYS.ATTENDANCE, updated);
          return updated;
        }
      });

      // Recalculate attendance rates for all affected students
      const studentIdsToRecalculate = records.map((r) => r.studentId);
      setStudents((prevStudents) => {
        const updatedStudents = prevStudents.map((st) => {
          if (!studentIdsToRecalculate.includes(st.id)) return st;

          let totalSessions = 0;
          let attendedSessions = 0;

          updatedSessionsResult.forEach((sess) => {
            const entry = sess.records?.find((r) => r.studentId === st.id);
            if (entry) {
              totalSessions++;
              if (entry.status === 'present' || entry.status === 'late') {
                attendedSessions++;
              }
            }
          });

          const calculatedRate = totalSessions > 0 ? Math.round((attendedSessions / totalSessions) * 100) : 0;
          return {
            ...st,
            attendanceRate: calculatedRate,
          };
        });
        setItem(ADMIN_STORAGE_KEYS.STUDENTS, updatedStudents);
        return updatedStudents;
      });

      // Recalculate group attendance rate and completed sessions count
      const targetGroupId = sessionMeta?.groupId;
      if (targetGroupId) {
        setGroups((prevGroups) => {
          const updatedGroups = prevGroups.map((g) => {
            if (g.id !== targetGroupId) return g;

            const groupSessions = updatedSessionsResult.filter(
              (s) => s.groupId === targetGroupId && (s.isLocked || (s.records && s.records.length > 0))
            );

            let totalEntries = 0;
            let attendedEntries = 0;

            groupSessions.forEach((sess) => {
              sess.records?.forEach((rec) => {
                totalEntries++;
                if (rec.status === 'present' || rec.status === 'late') {
                  attendedEntries++;
                }
              });
            });

            const newRate = totalEntries > 0 ? Math.round((attendedEntries / totalEntries) * 100) : 0;
            return {
              ...g,
              attendanceRate: newRate,
              completedLessonsCount: groupSessions.length,
            };
          });
          setItem(ADMIN_STORAGE_KEYS.GROUPS, updatedGroups);
          return updatedGroups;
        });
      }

      // Send Parent Portal Notifications for absent / late students
      records.forEach((rec) => {
        const sObj = students.find((s) => s.id === rec.studentId);
        const sName = sObj?.fullNameAr || rec.studentId;
        if (rec.status === 'absent') {
          notifyParentPortal({
            studentId: rec.studentId,
            type: 'attendance',
            titleAr: `تنبيه تسجيل غياب: ${sName}`,
            messageAr: `تم تسجيل غياب الطالب ${sName} عن حصة (${sessionMeta?.groupName || 'المسار التعليمي'}) بتاريخ ${sessionMeta?.date || new Date().toISOString().substring(0, 10)}.`,
            routeTo: 'performance',
            actionPayload: { tab: 'attendance', itemId: sessionId },
          });
        } else if (rec.status === 'late') {
          notifyParentPortal({
            studentId: rec.studentId,
            type: 'attendance',
            titleAr: `تنبيه تسجيل تأخر: ${sName}`,
            messageAr: `تم تسجيل تأخر الطالب ${sName} عن الحصة ${rec.note ? `(${rec.note})` : ''} بتاريخ ${sessionMeta?.date || new Date().toISOString().substring(0, 10)}.`,
            routeTo: 'performance',
            actionPayload: { tab: 'attendance', itemId: sessionId },
          });
        }
      });

      // Broadcast real-time sync event across contexts
      if (typeof window !== 'undefined') {
        setTimeout(() => window.dispatchEvent(new CustomEvent('awliya-data-sync')), 0);
      }

      logAudit(
        `رصد وتحديث سجل الحضور للجلسة ${sessionId}`,
        `Recorded attendance session ${sessionId}`,
        'attendance'
      );
    },
    [students, notifyParentPortal, logAudit]
  );

  const addCoveringSession = useCallback(
    (sessionData: {
      groupId: string;
      groupName: string;
      date: string;
      dayNameAr: string;
      dayNameEn: string;
      sessionTime: string;
      teacherId: string;
      teacherName: string;
      coveringType: 'counted' | 'not_counted';
      coveringReason?: string;
    }) => {
      const newSessionId = `att-sess-cov-${sessionData.groupId}-${sessionData.date}-${Date.now()}`;
      const targetGroup = groups.find((g) => g.id === sessionData.groupId);
      const studentEntries: AttendanceStudentEntry[] = (targetGroup?.studentIds || []).map((stId) => {
        const studentObj = students.find((s) => s.id === stId);
        return {
          studentId: stId,
          studentNameAr: studentObj?.fullNameAr || stId,
          studentNameEn: studentObj?.fullNameEn || stId,
          status: 'present',
          note: '',
          recordedAt: '',
        };
      });

      const newSession: AttendanceSession = {
        id: newSessionId,
        groupId: sessionData.groupId,
        groupName: sessionData.groupName,
        date: sessionData.date,
        dayNameAr: sessionData.dayNameAr,
        dayNameEn: sessionData.dayNameEn,
        sessionTime: sessionData.sessionTime,
        teacherId: sessionData.teacherId,
        teacherName: sessionData.teacherName,
        records: studentEntries,
        isLocked: false,
        isCoveringSession: true,
        coveringType: sessionData.coveringType,
        coveringReason: sessionData.coveringReason || '',
      };

      setAttendanceSessions((prev) => {
        const updated = [newSession, ...prev];
        setItem(ADMIN_STORAGE_KEYS.ATTENDANCE, updated);
        return updated;
      });

      // Send notification to students of this group
      (targetGroup?.studentIds || []).forEach((stId) => {
        notifyParentPortal({
          studentId: stId,
          type: 'attendance',
          titleAr: `جدولة حصة استدراكية: ${sessionData.groupName}`,
          messageAr: `تمت إضافة حصة استدراكية جديدة للفوج ${sessionData.groupName} يوم ${sessionData.dayNameAr} (${sessionData.date}) في التوقيت ${sessionData.sessionTime}.`,
          routeTo: 'performance',
          actionPayload: { tab: 'attendance', itemId: newSessionId },
        });
      });

      if (typeof window !== 'undefined') {
        setTimeout(() => window.dispatchEvent(new CustomEvent('awliya-data-sync')), 0);
      }

      logAudit(
        `إضافة حصة استدراكية للفوج ${sessionData.groupName} (${sessionData.coveringType === 'counted' ? 'محسوبة' : 'غير محسوبة / إضافية'})`,
        `Added covering session for group ${sessionData.groupName} (${sessionData.coveringType})`,
        'attendance'
      );
    },
    [groups, students, notifyParentPortal, logAudit]
  );

  // ==========================================
  // Homework Actions
  // ==========================================
  const createHomework = useCallback(
    (hwData: Partial<AdminHomeworkAssignment>) => {
      const newHw: AdminHomeworkAssignment = {
        id: `hw-${Date.now()}`,
        groupId: hwData.groupId || 'grp-a2-03',
        groupName: hwData.groupName || 'Group A2 — Elementary',
        assignmentNameAr: hwData.assignmentNameAr || 'واجب جديد',
        assignmentNameEn: hwData.assignmentNameEn || 'New Assignment',
        descriptionAr: hwData.descriptionAr || '',
        descriptionEn: hwData.descriptionEn || '',
        teacherNote: hwData.teacherNote,
        dueDate: hwData.dueDate || new Date(Date.now() + 7 * 86400000).toISOString().substring(0, 10),
        assignedDate: new Date().toISOString().substring(0, 10),
        totalScore: hwData.totalScore || 20,
        studentIds: hwData.studentIds || [],
        status: 'assigned',
        evaluations: (hwData.studentIds || []).map((sId) => {
          const sObj = students.find((s) => s.id === sId);
          return {
            studentId: sId,
            studentNameAr: sObj?.fullNameAr || sId,
            completionStatus: 'pending',
            parentNotified: true,
          };
        }),
      };

      setHomeworkList((prev) => {
        const updated = [newHw, ...prev];
        setItem(ADMIN_STORAGE_KEYS.HOMEWORK, updated);
        return updated;
      });

      // Send Parent Portal Notifications for new homework
      (hwData.studentIds || []).forEach((sId) => {
        notifyParentPortal({
          studentId: sId,
          type: 'homework',
          titleAr: `واجب منزلي جديد: ${newHw.assignmentNameAr}`,
          messageAr: `تم إسناد واجب جديد (${newHw.assignmentNameAr}) للفوج ${newHw.groupName}. تاريخ الاستحقاق: ${newHw.dueDate}.`,
          routeTo: 'performance',
          actionPayload: { tab: 'homework', itemId: newHw.id },
        });
      });

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('awliya-data-sync'));
      }

      logAudit(
        `إسناد واجب جديد: ${newHw.assignmentNameAr} للفوج ${newHw.groupName}`,
        `Created homework: ${newHw.assignmentNameEn}`,
        'homework'
      );
    },
    [students, notifyParentPortal, logAudit]
  );

  const evaluateHomework = useCallback(
    (hwId: string, studentId: string, score: number, comment: string, status: 'completed' | 'needs_revision') => {
      let targetHwTitle = 'الواجب المنزلي';
      let targetHwMaxScore = 20;

      setHomeworkList((prev) => {
        const updated = prev.map((hw) => {
          if (hw.id === hwId) {
            targetHwTitle = hw.assignmentNameAr;
            targetHwMaxScore = hw.totalScore || 20;
            const updatedEvals = hw.evaluations.map((ev) => {
              if (ev.studentId === studentId) {
                return {
                  ...ev,
                  score,
                  teacherComment: comment,
                  completionStatus: status,
                  submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
                  parentNotified: true,
                };
              }
              return ev;
            });
            return { ...hw, evaluations: updatedEvals };
          }
          return hw;
        });
        setItem(ADMIN_STORAGE_KEYS.HOMEWORK, updated);
        return updated;
      });

      const sObj = students.find((s) => s.id === studentId);
      notifyParentPortal({
        studentId,
        type: 'homework',
        titleAr: `تصحيح وتقييم الواجب: ${targetHwTitle}`,
        messageAr: `حصل الطالب ${sObj?.fullNameAr || studentId} على درجة (${score}/${targetHwMaxScore}) ${comment ? `مع ملاحظة: "${comment}"` : ''}.`,
        routeTo: 'performance',
        actionPayload: { tab: 'homework', itemId: hwId },
      });

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('awliya-data-sync'));
      }

      logAudit(
        `تقييم واجب الطالب ${studentId} بدرجة (${score})`,
        `Graded homework for student ${studentId} with score (${score})`,
        'homework'
      );
    },
    [students, notifyParentPortal, logAudit]
  );

  const batchEvaluateHomework = useCallback(
    (
      hwId: string,
      evaluations: {
        studentId: string;
        score: number;
        teacherComment?: string;
        completionStatus: 'completed' | 'needs_revision' | 'pending';
      }[]
    ) => {
      let targetHwTitle = 'الواجب المنزلي';
      let targetHwMaxScore = 20;

      setHomeworkList((prev) => {
        const updated = prev.map((hw) => {
          if (hw.id === hwId) {
            targetHwTitle = hw.assignmentNameAr;
            targetHwMaxScore = hw.totalScore || 20;
            const evalMap = new Map(evaluations.map((e) => [e.studentId, e]));

            const updatedEvals = hw.evaluations.map((ev) => {
              const match = evalMap.get(ev.studentId);
              if (match) {
                return {
                  ...ev,
                  score: match.score,
                  teacherComment: match.teacherComment,
                  completionStatus: match.completionStatus,
                  submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
                  parentNotified: true,
                };
              }
              return ev;
            });
            return { ...hw, evaluations: updatedEvals };
          }
          return hw;
        });
        setItem(ADMIN_STORAGE_KEYS.HOMEWORK, updated);
        return updated;
      });

      // Send Parent Portal notifications for evaluated students
      evaluations.forEach((item) => {
        const sObj = students.find((s) => s.id === item.studentId);
        notifyParentPortal({
          studentId: item.studentId,
          type: 'homework',
          titleAr: `تصحيح وتقييم الواجب: ${targetHwTitle}`,
          messageAr: `حصل الطالب ${sObj?.fullNameAr || item.studentId} على درجة (${item.score}/${targetHwMaxScore}) ${item.teacherComment ? `مع ملاحظة: "${item.teacherComment}"` : ''}.`,
          routeTo: 'performance',
          actionPayload: { tab: 'homework', itemId: hwId },
        });
      });

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('awliya-data-sync'));
      }

      logAudit(
        `تقييم وتسجيل واجب الفوج: ${targetHwTitle} لعدد (${evaluations.length}) طالب`,
        `Batch graded homework: ${targetHwTitle} for (${evaluations.length}) students`,
        'homework'
      );
    },
    [students, notifyParentPortal, logAudit]
  );

  // ==========================================
  // Assessment Actions
  // ==========================================
  const recordAssessment = useCallback(
    (data: Partial<AdminAssessmentRecord>) => {
      const newAsm: AdminAssessmentRecord = {
        id: `asm-${Date.now()}`,
        studentId: data.studentId || 'stu-01',
        studentNameAr: data.studentNameAr || 'طالب',
        studentNameEn: data.studentNameEn || 'Student',
        groupId: data.groupId || 'grp-a2-03',
        groupName: data.groupName || 'Group A2-03',
        level: data.level || 'A2',
        assessmentType: data.assessmentType || 'periodic',
        date: data.date || new Date().toISOString().substring(0, 10),
        scores: data.scores || { listening: 0, speaking: 0, reading: 0, writing: 0, overall: 0 },
        gradeLetterAr: data.gradeLetterAr || 'ممتاز (A)',
        gradeLetterEn: data.gradeLetterEn || 'A (Distinction)',
        teacherComment: data.teacherComment || '',
        teacherId: currentAdmin.id,
        teacherName: currentAdmin.fullNameAr,
      };

      setAssessments((prev) => {
        const updated = [newAsm, ...prev];
        setItem(ADMIN_STORAGE_KEYS.ASSESSMENTS, updated);
        return updated;
      });

      if (newAsm.studentId) {
        setStudents((prev) => {
          const updated = prev.map((s) =>
            s.id === newAsm.studentId
              ? {
                  ...s,
                  skills: newAsm.scores,
                  averagePerformance: newAsm.scores.overall,
                }
              : s
          );
          setItem(ADMIN_STORAGE_KEYS.STUDENTS, updated);
          return updated;
        });
      }

      notifyParentPortal({
        studentId: newAsm.studentId,
        type: 'feedback',
        titleAr: `رصد تقييم مهارات: ${newAsm.gradeLetterAr}`,
        messageAr: `تم تسجيل نتائج تقييم المهارات اللغوية للطالب ${newAsm.studentNameAr} بنسبة (${newAsm.scores.overall}%).`,
        routeTo: 'performance',
        actionPayload: { tab: 'assessments', itemId: newAsm.id },
      });

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('awliya-data-sync'));
      }

      logAudit(
        `رصد اختبار وتقييم مهارات للطالب ${newAsm.studentNameAr}`,
        `Recorded 4-skill assessment for student ${newAsm.studentNameEn}`,
        'assessment'
      );
    },
    [currentAdmin, notifyParentPortal, logAudit]
  );

  // ==========================================
  // Two-Way Feedback Actions
  // ==========================================
  const addTeacherFeedback = useCallback(
    (studentId: string, feedback: { strengths: string[]; needsImprovement: string[]; recommendations: string; generalComments: string }) => {
      const studentObj = students.find((s) => s.id === studentId);
      const newFb: TwoWayFeedbackItem = {
        id: `fb-${Date.now()}`,
        studentId,
        studentNameAr: studentObj?.fullNameAr || 'طالب',
        studentNameEn: studentObj?.fullNameEn || 'Student',
        parentId: studentObj?.parentId || 'par-01',
        parentName: studentObj?.parentName || 'ولي الأمر',
        teacherId: currentAdmin.id,
        teacherName: currentAdmin.fullNameAr,
        date: new Date().toISOString().substring(0, 10),
        teacherFeedback: feedback,
      };

      setFeedbackList((prev) => {
        const updated = [newFb, ...prev];
        setItem(ADMIN_STORAGE_KEYS.FEEDBACK, updated);
        return updated;
      });

      notifyParentPortal({
        studentId: newFb.studentId,
        type: 'feedback',
        titleAr: `توجيه تربوي من الأستاذ (${newFb.teacherName})`,
        messageAr: `أرسل الأستاذ ${newFb.teacherName} توجيهاً تربوياً للطالب ${newFb.studentNameAr}. اضغط للاطلاع والمتابعة.`,
        routeTo: 'performance',
        actionPayload: { tab: 'feedback', itemId: newFb.id },
      });

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('awliya-data-sync'));
      }

      logAudit(
        `إرسال توجيه وملاحظة معلم للطالب ${newFb.studentNameAr}`,
        `Sent teacher feedback for student ${newFb.studentNameEn}`,
        'homework'
      );
    },
    [students, currentAdmin, notifyParentPortal, logAudit]
  );

  const replyParentFeedback = useCallback(
    (feedbackId: string, message: string) => {
      setFeedbackList((prev) => {
        const updated = prev.map((fb) => {
          if (fb.id === feedbackId) {
            return {
              ...fb,
              parentFeedback: {
                message,
                date: new Date().toISOString().substring(0, 10),
                isReadByTeacher: false,
              },
            };
          }
          return fb;
        });
        setItem(ADMIN_STORAGE_KEYS.FEEDBACK, updated);
        return updated;
      });
    },
    []
  );

  // ==========================================
  // Admin User & RBAC Permissions
  // ==========================================
  const updateRolePermissions = useCallback(
    (roleId: AdminRole, modules: AdminRolePermissionConfig['modules']) => {
      setRolePermissions((prev) => {
        const updated = prev.map((rp) => (rp.roleId === roleId ? { ...rp, modules } : rp));
        setItem(ADMIN_STORAGE_KEYS.PERMISSIONS, updated);
        return updated;
      });
      logAudit(`تحديث مصفوفة الصلاحيات للدور ${roleId}`, `Updated permission matrix for role ${roleId}`, 'role');
    },
    [logAudit]
  );

  const addNewAdminUser = useCallback(
    (data: Partial<AdminUser>) => {
      const newUser: AdminUser = {
        id: `usr-${Date.now()}`,
        fullNameAr: data.fullNameAr || 'مستخدم جديد',
        fullNameEn: data.fullNameEn || 'New Admin',
        username: data.username || `admin_${Date.now().toString().slice(-4)}`,
        email: data.email || 'admin@myschool.edu',
        role: data.role || 'administrator',
        phone: data.phone || '+213 770 000 000',
        departmentAr: data.departmentAr || 'الإدارة الأكاديمية',
        departmentEn: data.departmentEn || 'Academic Operations',
        createdAt: new Date().toISOString().substring(0, 10),
        status: 'active',
      };

      setAdminUsers((prev) => {
        const updated = [newUser, ...prev];
        setItem(ADMIN_STORAGE_KEYS.ADMIN_USERS, updated);
        return updated;
      });

      logAudit(
        `إضافة مستخدم إداري جديد: ${newUser.fullNameAr} (${newUser.role})`,
        `Added new admin user: ${newUser.fullNameEn}`,
        'role'
      );
    },
    [logAudit]
  );

  const updateAdminUser = useCallback(
    (userId: string, updates: Partial<AdminUser>) => {
      setAdminUsers((prev) => {
        const updated = prev.map((u) => (u.id === userId ? { ...u, ...updates } : u));
        setItem(ADMIN_STORAGE_KEYS.ADMIN_USERS, updated);
        return updated;
      });
    },
    []
  );

  // ==========================================
  // Registration Approvals
  // ==========================================
  const approveStudentRegistration = useCallback(
    (approvalId: string, level: number, track?: string) => {
      const approval = pendingApprovals.find((a) => a.id === approvalId);
      if (!approval) return;

      const updatedApprovals = pendingApprovals.map((a) =>
        a.id === approvalId ? { ...a, status: 'approved' as const } : a
      );
      setPendingApprovals(updatedApprovals);
      setItem(ADMIN_STORAGE_KEYS.APPROVALS, updatedApprovals);

      // StudentContext sync
      approveInStudentContext(approval.studentId);
      if (track || level) {
        updateInStudentContext(approval.studentId, {
          ...(level ? { currentLevel: level as any } : {}),
          ...(track ? { enrolledPathAr: track } : {}),
          status: 'active',
        });
      }

      notifyParentPortal({
        studentId: approval.studentId,
        type: 'general',
        titleAr: `قبول واعتماد تسجيل الطالب: ${approval.studentNameAr}`,
        messageAr: `تمت الموافقة على طلب تسجيل الطالب ${approval.studentNameAr} واعتماده في المستوى ${level} بنجاح.`,
        routeTo: 'dashboard',
      });

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('awliya-data-sync'));
      }

      logAudit(
        `قبول طلب تسجيل الطالب ${approval.studentNameAr} وتسكينه في المستوى ${level}`,
        `Approved student registration: ${approval.studentNameAr}`,
        'student'
      );
    },
    [pendingApprovals, approveInStudentContext, updateInStudentContext, notifyParentPortal, logAudit]
  );

  const rejectStudentRegistration = useCallback(
    (approvalId: string, reason?: string) => {
      const approval = pendingApprovals.find((a) => a.id === approvalId);
      if (!approval) return;

      const updatedApprovals = pendingApprovals.map((a) =>
        a.id === approvalId ? { ...a, status: 'rejected' as const, notes: reason || a.notes } : a
      );
      setPendingApprovals(updatedApprovals);
      setItem(ADMIN_STORAGE_KEYS.APPROVALS, updatedApprovals);

      logAudit(
        `رفض طلب تسجيل الطالب ${approval.studentNameAr}`,
        `Rejected student registration: ${approval.studentNameAr}`,
        'student',
        undefined,
        reason
      );
    },
    [pendingApprovals, logAudit]
  );

  // Notifications
  const markNotificationRead = useCallback((notifId: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n));
      setItem(ADMIN_STORAGE_KEYS.NOTIFICATIONS, updated);
      return updated;
    });
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, isRead: true }));
      setItem(ADMIN_STORAGE_KEYS.NOTIFICATIONS, updated);
      return updated;
    });
  }, []);

  return (
    <AdminContext.Provider
      value={{
        currentAdmin,
        currentRole,
        activeTab,
        setActiveTab,
        switchRole,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        adminUsers,
        students,
        parents,
        teachers,
        groups,
        curricula,
        attendanceSessions,
        homeworkList,
        assessments,
        feedbackList,
        rolePermissions,
        auditLogs,
        notifications,
        pendingApprovals,
        visibleStudents,
        visibleGroups,
        visibleParents,
        visibleAttendance,
        visibleHomework,
        visibleAssessments,
        addStudent,
        updateStudent,
        archiveStudent,
        addParent,
        updateParent,
        deleteParent,
        linkStudentToParent,
        unlinkStudentFromParent,
        addTeacher,
        updateTeacher,
        addGroup,
        updateGroup,
        assignStudentToGroup,
        removeStudentFromGroup,
        addCurriculumLevel,
        updateCurriculumLevel,
        reorderCurriculumLevels,
        deleteCurriculumLevel,
        lessonProgressRecords,
        updateLessonProgress,
        studentLevelScores,
        updateStudentLevelScore,
        recordAttendance,
        addCoveringSession,
        createHomework,
        evaluateHomework,
        batchEvaluateHomework,
        recordAssessment,
        addTeacherFeedback,
        replyParentFeedback,
        updateRolePermissions,
        addNewAdminUser,
        updateAdminUser,
        approveStudentRegistration,
        rejectStudentRegistration,
        markNotificationRead,
        markAllNotificationsRead,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
