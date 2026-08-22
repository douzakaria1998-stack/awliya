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
  AttendanceSession,
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
import { useStudent } from '@/context/StudentContext';

interface AdminContextType {
  // Current user & role
  currentAdmin: AdminUser;
  currentRole: AdminRole;
  activeTab: AdminTabKey;
  setActiveTab: (tab: AdminTabKey) => void;
  switchRole: (role: AdminRole, userId?: string) => void;

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
  linkStudentToParent: (parentId: string, studentId: string) => void;
  unlinkStudentFromParent: (parentId: string, studentId: string) => void;

  addTeacher: (teacherData: Partial<AdminTeacher>) => void;
  updateTeacher: (teacherId: string, updates: Partial<AdminTeacher>) => void;

  addGroup: (groupData: Partial<AdminGroup>) => void;
  updateGroup: (groupId: string, updates: Partial<AdminGroup>) => void;
  assignStudentToGroup: (groupId: string, studentId: string) => void;
  removeStudentFromGroup: (groupId: string, studentId: string) => void;

  recordAttendance: (sessionId: string, records: { studentId: string; status: 'present' | 'late' | 'absent' | 'excused'; note?: string }[]) => void;
  
  createHomework: (hwData: Partial<AdminHomeworkAssignment>) => void;
  evaluateHomework: (hwId: string, studentId: string, score: number, comment: string, status: 'completed' | 'needs_revision') => void;

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
  CURRENT_USER_ID: 'myschool_admin_user_id_v2',
  ADMIN_USERS: 'myschool_admin_users_v2',
  STUDENTS: 'myschool_admin_students_v2',
  PARENTS: 'myschool_admin_parents_v2',
  TEACHERS: 'myschool_admin_teachers_v2',
  GROUPS: 'myschool_admin_groups_v2',
  CURRICULA: 'myschool_admin_curricula_v2',
  ATTENDANCE: 'myschool_admin_attendance_v2',
  HOMEWORK: 'myschool_admin_homework_v2',
  ASSESSMENTS: 'myschool_admin_assessments_v2',
  FEEDBACK: 'myschool_admin_feedback_v2',
  PERMISSIONS: 'myschool_admin_permissions_v2',
  AUDIT_LOGS: 'myschool_admin_audit_logs_v2',
  NOTIFICATIONS: 'myschool_admin_notifications_v2',
  APPROVALS: 'myschool_admin_approvals_v2',
};

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const { approveStudent: approveInStudentContext, updateStudent: updateInStudentContext } = useStudent();

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(mockAdminUsers);
  const [currentAdminId, setCurrentAdminId] = useState<string>(mockAdminUsers[0].id);
  const [activeTab, setActiveTab] = useState<AdminTabKey>('overview');

  const [students, setStudents] = useState<AdminStudent[]>(mockAdminStudents);
  const [parents, setParents] = useState<AdminParent[]>(mockAdminParents);
  const [teachers, setTeachers] = useState<AdminTeacher[]>(mockAdminTeachers);
  const [groups, setGroups] = useState<AdminGroup[]>(mockAdminGroups);
  const [curricula, setCurricula] = useState<CurriculumLevel[]>(mockCurricula);
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
        attendanceRate: data.attendanceRate || 100,
        averagePerformance: data.averagePerformance || 80,
        completedLessonsCount: 0,
        totalLessonsCount: 20,
        skills: data.skills || { listening: 75, speaking: 70, reading: 75, writing: 70, overall: 72 },
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
        linkedStudentIds: data.linkedStudentIds || [],
        status: data.status || 'active',
        createdAt: new Date().toISOString().substring(0, 10),
      };

      setParents((prev) => {
        const updated = [newParent, ...prev];
        setItem(ADMIN_STORAGE_KEYS.PARENTS, updated);
        return updated;
      });

      logAudit(`إضافة ولي أمر جديد: ${newParent.fullNameAr}`, `Added new parent: ${newParent.fullNameEn}`, 'parent');
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
      logAudit(
        `إلغاء ربط الطالب ${studentId} بولي الأمر ${parentId}`,
        `Unlinked student ${studentId} from parent ${parentId}`,
        'parent'
      );
    },
    [logAudit]
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
    },
    []
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
        maxCapacity: data.maxCapacity || 20,
        studentIds: data.studentIds || [],
        attendanceRate: 100,
        averageProgress: 0,
        averagePerformance: 80,
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
    },
    []
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
  // Attendance Actions
  // ==========================================
  const recordAttendance = useCallback(
    (sessionId: string, records: { studentId: string; status: 'present' | 'late' | 'absent' | 'excused'; note?: string }[]) => {
      setAttendanceSessions((prev) => {
        const updated = prev.map((sess) => {
          if (sess.id === sessionId) {
            const updatedEntries = sess.records.map((rec) => {
              const matchingNew = records.find((r) => r.studentId === rec.studentId);
              if (matchingNew) {
                return { ...rec, status: matchingNew.status, note: matchingNew.note || rec.note, recordedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
              }
              return rec;
            });
            return { ...sess, records: updatedEntries };
          }
          return sess;
        });
        setItem(ADMIN_STORAGE_KEYS.ATTENDANCE, updated);
        return updated;
      });

      logAudit(
        `رصد سجل الحضور للجلسة ${sessionId}`,
        `Recorded attendance session ${sessionId}`,
        'attendance'
      );
    },
    [logAudit]
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

      logAudit(
        `إسناد واجب جديد: ${newHw.assignmentNameAr} للفوج ${newHw.groupName}`,
        `Created homework: ${newHw.assignmentNameEn}`,
        'homework'
      );
    },
    [students, logAudit]
  );

  const evaluateHomework = useCallback(
    (hwId: string, studentId: string, score: number, comment: string, status: 'completed' | 'needs_revision') => {
      setHomeworkList((prev) => {
        const updated = prev.map((hw) => {
          if (hw.id === hwId) {
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

      logAudit(
        `تقييم واجب الطالب ${studentId} بدرجة (${score})`,
        `Graded homework for student ${studentId} with score (${score})`,
        'homework'
      );
    },
    [logAudit]
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
        scores: data.scores || { listening: 80, speaking: 80, reading: 80, writing: 80, overall: 80 },
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

      logAudit(
        `رصد اختبار وتقييم مهارات للطالب ${newAsm.studentNameAr}`,
        `Recorded 4-skill assessment for student ${newAsm.studentNameEn}`,
        'assessment'
      );
    },
    [currentAdmin, logAudit]
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

      logAudit(
        `إرسال توجيه وملاحظة معلم للطالب ${newFb.studentNameAr}`,
        `Sent teacher feedback for student ${newFb.studentNameEn}`,
        'homework'
      );
    },
    [students, currentAdmin, logAudit]
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

      logAudit(
        `قبول طلب تسجيل الطالب ${approval.studentNameAr} وتسكينه في المستوى ${level}`,
        `Approved student registration: ${approval.studentNameAr}`,
        'student'
      );
    },
    [pendingApprovals, approveInStudentContext, updateInStudentContext, logAudit]
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
        linkStudentToParent,
        unlinkStudentFromParent,
        addTeacher,
        updateTeacher,
        addGroup,
        updateGroup,
        assignStudentToGroup,
        removeStudentFromGroup,
        recordAttendance,
        createHomework,
        evaluateHomework,
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
