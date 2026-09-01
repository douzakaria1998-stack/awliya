// =========================================================================
// Back Office Requirements & Functional Specification - Types & Interfaces
// =========================================================================

export type AdminRole = 'super_admin' | 'administrator' | 'teacher';

export type AdminTabKey =
  | 'overview'
  | 'students'
  | 'parents'
  | 'teachers'
  | 'groups'
  | 'academic'
  | 'attendance'
  | 'performance'
  | 'roles'
  | 'notifications'
  | 'audit'
  | 'settings'
  | 'approvals';

export type EntityStatus = 'active' | 'inactive' | 'suspended' | 'completed' | 'archived' | 'pending';

// Admin / Teacher User
export interface AdminUser {
  id: string;
  fullNameAr: string;
  fullNameEn: string;
  username: string;
  email: string;
  role: AdminRole;
  phone: string;
  avatarUrl?: string;
  departmentAr: string;
  departmentEn: string;
  languagesTaught?: ('English' | 'French' | 'Both')[];
  specialization?: string;
  experience?: string;
  assignedGroups?: string[];
  createdAt: string;
  lastLogin?: string;
  status: 'active' | 'inactive' | 'suspended';
  permissions?: Record<string, boolean>;
}

// Student Entity
export interface AdminStudent {
  id: string;
  fullNameAr: string;
  fullNameEn: string;
  nicknameAr?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender: 'male' | 'female';
  currentLevel: number; // 1-10 or CEFR
  cefrLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  enrolledPathAr: string;
  enrolledPathEn: string;
  language: 'English' | 'French' | 'Dual';
  groupId: string;
  groupName: string;
  teacherId: string;
  teacherName: string;
  parentId: string;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  relationship: string;
  enrollmentDate: string;
  status: EntityStatus;
  overallProgress: number; // e.g. 67%
  attendanceRate: number; // e.g. 91%
  averagePerformance: number; // e.g. 78%
  completedLessonsCount: number;
  totalLessonsCount: number;
  isFallingBehind?: boolean;
  skills: {
    listening: number;
    speaking: number;
    reading: number;
    writing: number;
    overall: number;
  };
  placementTest?: {
    score: number;
    recommendedLevel: string;
    date: string;
    comment: string;
  };
}

// Parent Entity (Multi-Student Relationship)
export interface AdminParent {
  id: string;
  fullNameAr: string;
  fullNameEn: string;
  phone: string;
  email: string;
  nationalId?: string;
  address?: string;
  password?: string;
  linkedStudentIds: string[];
  status: EntityStatus;
  createdAt: string;
}

// Teacher Entity
export interface AdminTeacher {
  id: string;
  fullNameAr: string;
  fullNameEn: string;
  username: string;
  email: string;
  phone: string;
  languagesTaught: ('English' | 'French')[];
  specialization: string;
  experience: string;
  assignedGroupIds: string[];
  status: EntityStatus;
  createdAt: string;
}

// Group Entity (Class / Session Hub)
export interface AdminGroup {
  id: string;
  name: string; // e.g. 'Group A2-03'
  code: string; // e.g. 'A2-G03'
  language: 'English' | 'French' | 'Dual';
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  levelNumber: number; // 1-10
  teacherId: string;
  teacherName: string;
  daysAr: string;
  daysEn: string;
  startTime: string; // '18:00'
  endTime: string; // '20:00'
  maxCapacity: number; // 20
  studentIds: string[];
  attendanceRate: number; // e.g. 91%
  averageProgress: number; // e.g. 67%
  averagePerformance: number; // e.g. 78%
  completedLessonsCount: number;
  totalLessonsCount: number;
  status: EntityStatus;
}

// Curriculum - Levels, Units, Lessons
export interface CurriculumLesson {
  id: string;
  lessonNumber: number;
  titleAr: string;
  titleEn: string;
  contentSummary: string;
  vocabulary: string[];
  exercisesCount: number;
  hasAssessment: boolean;
}

export interface CurriculumUnit {
  id: string;
  unitNumber: number;
  titleAr: string;
  titleEn: string;
  lessons: CurriculumLesson[];
}

export interface CurriculumLevel {
  levelNumber: number;
  cefrCode: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  color: string;
  language: 'English' | 'French';
  units: CurriculumUnit[];
}

// Student Academic Lesson Progress (Back Office Spec)
export type LessonProgressStatus = 'not_started' | 'in_progress' | 'completed';

export interface StudentLessonProgress {
  studentId: string;
  groupId: string;
  levelNumber: number;
  unitId: string;
  lessonId: string;
  status: LessonProgressStatus;
  completedAt?: string;
  lastUpdatedBy?: string;
  lastUpdatedAt?: string;
}

// Attendance Record
export interface AttendanceStudentEntry {
  studentId: string;
  studentNameAr: string;
  studentNameEn: string;
  status: 'present' | 'late' | 'absent' | 'excused';
  note?: string;
  recordedAt?: string;
}

export interface AttendanceSession {
  id: string;
  groupId: string;
  groupName: string;
  date: string; // 'YYYY-MM-DD'
  dayNameAr: string;
  dayNameEn: string;
  sessionTime: string;
  teacherId: string;
  teacherName: string;
  records: AttendanceStudentEntry[];
  isLocked?: boolean;
}

// Performance - Homework Assignment & Evaluation
export interface AdminHomeworkAssignment {
  id: string;
  groupId: string;
  groupName: string;
  assignmentNameAr: string;
  assignmentNameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  teacherNote?: string;
  dueDate: string;
  assignedDate: string;
  totalScore: number;
  studentIds: string[];
  status: 'assigned' | 'under_review' | 'evaluated' | 'archived';
  evaluations: {
    studentId: string;
    studentNameAr: string;
    score?: number;
    teacherComment?: string;
    completionStatus: 'completed' | 'needs_revision' | 'pending' | 'not_submitted';
    submittedAt?: string;
    parentNotified: boolean;
  }[];
}

// Performance - 4-Skill Assessment & Placement Tests
export interface AdminAssessmentRecord {
  id: string;
  studentId: string;
  studentNameAr: string;
  studentNameEn: string;
  groupId: string;
  groupName: string;
  level: string;
  assessmentType: 'periodic' | 'midterm' | 'final' | 'placement';
  date: string;
  scores: {
    listening: number;
    speaking: number;
    reading: number;
    writing: number;
    overall: number;
  };
  gradeLetterAr: string;
  gradeLetterEn: string;
  teacherComment: string;
  teacherId: string;
  teacherName: string;
}

// Performance - Two-Way Feedback (Teacher ↔ Parent)
export interface TwoWayFeedbackItem {
  id: string;
  studentId: string;
  studentNameAr: string;
  studentNameEn: string;
  parentId: string;
  parentName: string;
  teacherId: string;
  teacherName: string;
  date: string;
  teacherFeedback: {
    strengths: string[];
    needsImprovement: string[];
    recommendations: string;
    generalComments: string;
  };
  parentFeedback?: {
    message: string;
    date: string;
    isReadByTeacher?: boolean;
  };
}

// Admin Role & Permission Matrix
export interface AdminRolePermissionConfig {
  roleId: AdminRole;
  roleNameAr: string;
  roleNameEn: string;
  descriptionAr: string;
  modules: {
    dashboard: 'full' | 'restricted' | 'personal';
    students: 'full' | 'view_only' | 'own_students' | 'none';
    parents: 'full' | 'view_only' | 'related_parents' | 'none';
    teachers: 'full' | 'optional' | 'view_only' | 'none';
    groups: 'full' | 'manage' | 'own_groups' | 'none';
    academicPath: 'full' | 'manage' | 'view_progress' | 'none';
    attendance: 'full' | 'manage' | 'own_groups' | 'none';
    performance: 'full' | 'manage' | 'own_students' | 'none';
    assessments: 'full' | 'manage' | 'own_students' | 'none';
    adminRoles: 'full' | 'none';
    systemSettings: 'full' | 'none';
    auditLogs: 'full' | 'none';
  };
}

// Audit Log Entry
export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: AdminRole;
  actionAr: string;
  actionEn: string;
  targetEntity: 'student' | 'parent' | 'teacher' | 'group' | 'curriculum' | 'attendance' | 'homework' | 'assessment' | 'role' | 'setting';
  previousValue?: string;
  newValue?: string;
  details?: string;
}

// Notification Center Item
export interface AdminNotificationItem {
  id: string;
  titleAr: string;
  titleEn: string;
  messageAr: string;
  messageEn: string;
  category: 'homework' | 'attendance' | 'absence' | 'assessment' | 'feedback' | 'group' | 'announcement';
  date: string;
  targetRole?: AdminRole | 'all';
  targetGroupId?: string;
  targetStudentId?: string;
  isRead: boolean;
}

// Pending Approval (Registration request)
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
