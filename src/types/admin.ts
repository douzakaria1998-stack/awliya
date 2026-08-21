// =============================================
// Admin Control Panel - Types & Interfaces
// =============================================

export type AdminRole = 'super_admin' | 'administrator' | 'teacher';

export type AdminTabKey =
  | 'overview'
  | 'approvals'
  | 'students'
  | 'gradebook'
  | 'attendance'
  | 'users'
  | 'settings';

export interface AdminUser {
  id: string;
  fullNameAr: string;
  fullNameEn: string;
  email: string;
  role: AdminRole;
  phone: string;
  avatarUrl?: string;
  departmentAr: string;
  departmentEn: string;
  specialization?: 'english' | 'french' | 'dual' | 'all';
  assignedGroups?: string[];
  createdAt: string;
  lastLogin?: string;
  status: 'active' | 'inactive';
}

export interface PendingStudentApproval {
  id: string;
  studentId: string;
  studentNameAr: string;
  studentNameEn?: string;
  parentNameAr: string;
  parentPhone: string;
  parentEmail: string;
  enrolledPathAr: string;
  requestedLevel: number;
  branchAr: string;
  timingAr: string;
  submissionDate: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: AdminRole;
  actionAr: string;
  actionEn: string;
  detailsAr?: string;
  type: 'approval' | 'grade' | 'attendance' | 'user' | 'system';
}
