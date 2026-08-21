'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { AdminRole, AdminTabKey, AdminUser, PendingStudentApproval, ActivityLogItem } from '@/types/admin';
import { mockAdminUsers, mockPendingApprovals, mockActivityLogs } from '@/data/adminMock';
import { useStudent } from '@/context/StudentContext';
import { getItem, setItem } from '@/lib/localStorage';

interface AdminContextType {
  currentAdmin: AdminUser;
  currentRole: AdminRole;
  activeTab: AdminTabKey;
  setActiveTab: (tab: AdminTabKey) => void;
  adminUsers: AdminUser[];
  pendingApprovals: PendingStudentApproval[];
  activityLogs: ActivityLogItem[];
  switchRole: (role: AdminRole, userId?: string) => void;
  approveStudentRegistration: (approvalId: string, level: number, track?: string) => void;
  rejectStudentRegistration: (approvalId: string, reason?: string) => void;
  gradeStudentHomework: (
    studentId: string,
    homeworkId: string,
    score: number,
    status: 'completed' | 'needs_revision',
    teacherNote?: string,
    badgeAr?: string
  ) => void;
  recordSessionAttendance: (
    studentId: string,
    status: 'present' | 'late' | 'absent' | 'excused',
    noteAr?: string
  ) => void;
  addNewAdminUser: (data: Omit<AdminUser, 'id' | 'createdAt' | 'status'>) => void;
  changeStudentLevel: (studentId: string, newLevel: number) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_STORAGE_KEYS = {
  CURRENT_USER_ID: 'awliya_admin_user_id_v1',
  ADMIN_USERS: 'awliya_admin_users_v1',
  PENDING_APPROVALS: 'awliya_admin_approvals_v1',
  ACTIVITY_LOGS: 'awliya_admin_logs_v1',
};

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const { students, approveStudent, updateStudent, submitHomeworkRevision } = useStudent();

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(mockAdminUsers);
  const [currentAdminId, setCurrentAdminId] = useState<string>(mockAdminUsers[0].id);
  const [pendingApprovals, setPendingApprovals] = useState<PendingStudentApproval[]>(mockPendingApprovals);
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>(mockActivityLogs);
  const [activeTab, setActiveTab] = useState<AdminTabKey>('overview');

  // Sync state from storage on mount
  useEffect(() => {
    const storedUsers = getItem<AdminUser[]>(ADMIN_STORAGE_KEYS.ADMIN_USERS);
    if (storedUsers && storedUsers.length > 0) setAdminUsers(storedUsers);

    const storedAdminId = getItem<string>(ADMIN_STORAGE_KEYS.CURRENT_USER_ID);
    if (storedAdminId) setCurrentAdminId(storedAdminId);

    const storedApprovals = getItem<PendingStudentApproval[]>(ADMIN_STORAGE_KEYS.PENDING_APPROVALS);
    if (storedApprovals && storedApprovals.length > 0) setPendingApprovals(storedApprovals);

    const storedLogs = getItem<ActivityLogItem[]>(ADMIN_STORAGE_KEYS.ACTIVITY_LOGS);
    if (storedLogs && storedLogs.length > 0) setActivityLogs(storedLogs);
  }, []);

  const currentAdmin = useMemo(() => {
    return adminUsers.find((u) => u.id === currentAdminId) || adminUsers[0];
  }, [adminUsers, currentAdminId]);

  const currentRole = currentAdmin.role;

  // Switch active role or specific user
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

  // Approve student registration
  const approveStudentRegistration = useCallback(
    (approvalId: string, level: number, track?: string) => {
      const approval = pendingApprovals.find((a) => a.id === approvalId);
      if (!approval) return;

      // 1. Update approval queue status
      const updatedApprovals = pendingApprovals.map((a) =>
        a.id === approvalId ? { ...a, status: 'approved' as const } : a
      );
      setPendingApprovals(updatedApprovals);
      setItem(ADMIN_STORAGE_KEYS.PENDING_APPROVALS, updatedApprovals);

      // 2. Call StudentContext approve logic
      approveStudent(approval.studentId);
      if (track || level) {
        updateStudent(approval.studentId, {
          ...(level ? { currentLevel: level as any } : {}),
          ...(track ? { enrolledPathAr: track } : {}),
          status: 'active',
        });
      }

      // 3. Log activity
      const newLog: ActivityLogItem = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        actorName: currentAdmin.fullNameAr,
        actorRole: currentAdmin.role,
        actionAr: `تم قبول وتسكين الطالب ${approval.studentNameAr} في المستوى ${level}`,
        actionEn: `Approved student ${approval.studentNameEn || approval.studentNameAr} for Level ${level}`,
        detailsAr: track || approval.enrolledPathAr,
        type: 'approval',
      };
      const updatedLogs = [newLog, ...activityLogs];
      setActivityLogs(updatedLogs);
      setItem(ADMIN_STORAGE_KEYS.ACTIVITY_LOGS, updatedLogs);
    },
    [pendingApprovals, approveStudent, updateStudent, currentAdmin, activityLogs]
  );

  // Reject student registration
  const rejectStudentRegistration = useCallback(
    (approvalId: string, reason?: string) => {
      const approval = pendingApprovals.find((a) => a.id === approvalId);
      if (!approval) return;

      const updatedApprovals = pendingApprovals.map((a) =>
        a.id === approvalId ? { ...a, status: 'rejected' as const, notes: reason || a.notes } : a
      );
      setPendingApprovals(updatedApprovals);
      setItem(ADMIN_STORAGE_KEYS.PENDING_APPROVALS, updatedApprovals);

      const newLog: ActivityLogItem = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        actorName: currentAdmin.fullNameAr,
        actorRole: currentAdmin.role,
        actionAr: `تم رفض طلب تسجيل الطالب ${approval.studentNameAr}`,
        actionEn: `Rejected student registration for ${approval.studentNameEn || approval.studentNameAr}`,
        detailsAr: reason || 'غير مستوفٍ للشروط',
        type: 'approval',
      };
      const updatedLogs = [newLog, ...activityLogs];
      setActivityLogs(updatedLogs);
      setItem(ADMIN_STORAGE_KEYS.ACTIVITY_LOGS, updatedLogs);
    },
    [pendingApprovals, currentAdmin, activityLogs]
  );

  // Grade student homework
  const gradeStudentHomework = useCallback(
    (
      studentId: string,
      homeworkId: string,
      score: number,
      status: 'completed' | 'needs_revision',
      teacherNote?: string,
      badgeAr?: string
    ) => {
      const student = students.find((s) => s.id === studentId);
      const studentName = student?.fullNameAr || 'الطالب';

      // Log activity
      const newLog: ActivityLogItem = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        actorName: currentAdmin.fullNameAr,
        actorRole: currentAdmin.role,
        actionAr: `تصحيح ورصد درجة واجب للطالب ${studentName} (${score}/100)`,
        actionEn: `Graded homework for ${studentName} (${score}/100)`,
        detailsAr: teacherNote || (badgeAr ? `وسام: ${badgeAr}` : undefined),
        type: 'grade',
      };
      const updatedLogs = [newLog, ...activityLogs];
      setActivityLogs(updatedLogs);
      setItem(ADMIN_STORAGE_KEYS.ACTIVITY_LOGS, updatedLogs);
    },
    [students, currentAdmin, activityLogs]
  );

  // Record session attendance
  const recordSessionAttendance = useCallback(
    (
      studentId: string,
      status: 'present' | 'late' | 'absent' | 'excused',
      noteAr?: string
    ) => {
      const student = students.find((s) => s.id === studentId);
      const studentName = student?.fullNameAr || 'الطالب';
      const statusNames = {
        present: 'حاضر',
        late: 'متأخر',
        absent: 'غائب',
        excused: 'غياب بعذر',
      };

      const newLog: ActivityLogItem = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        actorName: currentAdmin.fullNameAr,
        actorRole: currentAdmin.role,
        actionAr: `تسجيل حالة الحضور للطالب ${studentName}: ${statusNames[status]}`,
        actionEn: `Recorded attendance for ${studentName}: ${status}`,
        detailsAr: noteAr,
        type: 'attendance',
      };
      const updatedLogs = [newLog, ...activityLogs];
      setActivityLogs(updatedLogs);
      setItem(ADMIN_STORAGE_KEYS.ACTIVITY_LOGS, updatedLogs);
    },
    [students, currentAdmin, activityLogs]
  );

  // Add new admin / teacher user
  const addNewAdminUser = useCallback(
    (data: Omit<AdminUser, 'id' | 'createdAt' | 'status'>) => {
      const newUser: AdminUser = {
        ...data,
        id: `usr-${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
        status: 'active',
      };
      const updated = [newUser, ...adminUsers];
      setAdminUsers(updated);
      setItem(ADMIN_STORAGE_KEYS.ADMIN_USERS, updated);

      const newLog: ActivityLogItem = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        actorName: currentAdmin.fullNameAr,
        actorRole: currentAdmin.role,
        actionAr: `إضافة مستخدم جديد للنظام: ${newUser.fullNameAr} (${newUser.role})`,
        actionEn: `Added new user ${newUser.fullNameEn} as ${newUser.role}`,
        detailsAr: newUser.departmentAr,
        type: 'user',
      };
      const updatedLogs = [newLog, ...activityLogs];
      setActivityLogs(updatedLogs);
      setItem(ADMIN_STORAGE_KEYS.ACTIVITY_LOGS, updatedLogs);
    },
    [adminUsers, currentAdmin, activityLogs]
  );

  // Change student level
  const changeStudentLevel = useCallback(
    (studentId: string, newLevel: number) => {
      updateStudent(studentId, { currentLevel: newLevel as any });
      const student = students.find((s) => s.id === studentId);
      const studentName = student?.fullNameAr || 'الطالب';

      const newLog: ActivityLogItem = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        actorName: currentAdmin.fullNameAr,
        actorRole: currentAdmin.role,
        actionAr: `ترقية/تعديل مستوى الطالب ${studentName} إلى المستوى ${newLevel}`,
        actionEn: `Changed student ${studentName} level to ${newLevel}`,
        type: 'system',
      };
      const updatedLogs = [newLog, ...activityLogs];
      setActivityLogs(updatedLogs);
      setItem(ADMIN_STORAGE_KEYS.ACTIVITY_LOGS, updatedLogs);
    },
    [updateStudent, students, currentAdmin, activityLogs]
  );

  return (
    <AdminContext.Provider
      value={{
        currentAdmin,
        currentRole,
        activeTab,
        setActiveTab,
        adminUsers,
        pendingApprovals,
        activityLogs,
        switchRole,
        approveStudentRegistration,
        rejectStudentRegistration,
        gradeStudentHomework,
        recordSessionAttendance,
        addNewAdminUser,
        changeStudentLevel,
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
