// =============================================
// Awliya Parent Portal – Type Definitions
// =============================================

// ---------- Level / Theme ----------
export type LevelId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface LevelTheme {
  id: LevelId;
  nameAr: string;
  shortNameAr: string;
  stageAr: string;
  primary: string; // Main color
  primaryLight: string; // Light variant (backgrounds)
  primaryDark: string; // Dark variant (hover states)
  primaryRgb: string; // RGB values for opacity/glow (e.g., '59, 130, 246')
  gradient: string; // CSS gradient string
  accentColor: string; // Complementary accent
  descriptionAr: string;
}

// ---------- User / Auth ----------
export interface Parent {
  id: string;
  fullNameAr: string;
  fullNameEn?: string;
  email: string;
  phone: string;
  password?: string;
  address?: string;
  nationalId?: string;
  avatarUrl?: string;
  linkedStudentIds?: string[];
}

export interface Student {
  id: string;
  parentId: string;
  fullNameAr: string;
  firstNameAr?: string;
  lastNameAr?: string;
  birthday?: string;
  schoolLevelAr?: string;
  nicknameAr?: string;
  enrolledPathAr: string;
  currentLevel: LevelId;
  currentLevelProgress: number; // 0-100
  avatarUrl?: string;
  studentIdNumber: string;
  academicYearAr: string;
  branchAr: string;
  timingAr?: string;
  gender?: 'male' | 'female';
  status?: 'active' | 'pending';
  enrollmentDate: string;
  age: number;
  language?: 'English' | 'French' | 'Dual';
  cefrLevel?: string;
}

// ---------- Academic Path ----------
export type LevelStatus = 'studied' | 'current' | 'locked';

export interface LevelLessonItem {
  id: string;
  lessonNumber: number;
  titleAr: string;
  titleEn?: string;
  status: 'completed' | 'in_progress' | 'not_started';
  durationMinutes?: number;
  exercisesCount?: number;
  hasAssessment?: boolean;
}

export interface LevelModule {
  id?: string;
  unitNumber?: number;
  titleAr: string;
  titleEn?: string;
  isCompleted: boolean;
  lessonsCount: number;
  lessons?: LevelLessonItem[];
}

export interface AcademicLevel {
  level: LevelId;
  cefrCode?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | string;
  nameAr: string;
  nameEn?: string;
  stageAr: string;
  stageEn?: string;
  status: LevelStatus;
  subjects: string[];
  modules?: LevelModule[];
  completedDate?: string; // ISO date string
  score?: number; // Score percentage if completed
  honorsDegree?: string; // e.g. "تقدير: ممتاز مرتفع (مع مرتبة الشرف)"
  certificateAvailable?: boolean;
  descriptionAr?: string;
  descriptionEn?: string;
  color?: string;
  language?: 'English' | 'French';
  progress?: number; // 0 to 100
  completedLessonsCount?: number;
  totalLessonsCount?: number;
}

// ---------- Homework ----------
export type HomeworkStatus = 'completed' | 'needs_revision' | 'pending' | 'not_started';

export interface Homework {
  id: string;
  studentId: string;
  titleAr: string;
  subjectAr: string;
  level: LevelId;
  status: HomeworkStatus;
  dueDate: string;
  submittedDate?: string;
  teacherNote?: string;
  score?: number;
  totalScore?: number;
}

// ---------- Attendance ----------
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  dayNameAr?: string;
  subjectAr?: string;
  weekIndex?: number;
  status: AttendanceStatus;
  noteAr?: string;
  sessionTimeAr?: string;
}

export interface AttendanceSummary {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  excusedDays: number;
  attendancePercentage: number;
}

// ---------- Assessments ----------
export interface Assessment {
  id: string;
  studentId: string;
  titleAr: string;
  subjectAr: string;
  level: LevelId;
  score: number;
  totalScore: number;
  date: string;
  typeAr: string; // اختبار شفوي، اختبار كتابي، تسميع مستمر
  gradeLetterAr?: string; // ممتاز، جيد جداً
  teacherComments?: string;
}

// ---------- Teacher Feedback ----------
export interface TeacherFeedback {
  id: string;
  studentId: string;
  teacherNameAr: string;
  teacherRoleAr?: string;
  teacherAvatar?: string;
  messageAr: string;
  date: string;
  subjectAr?: string;
  isRead: boolean;
  hasAudio?: boolean;
  audioDurationSeconds?: number;
  badgeAr?: string; // "طالب متميز", "مثابرة عالية"
}

// ---------- Financials ----------
export type PaymentStatus = 'paid' | 'pending' | 'overdue';

export interface Fee {
  id: string;
  studentId: string;
  descriptionAr: string;
  courseNameAr?: string;
  isCurrentCourse?: boolean;
  categoryAr: string; // رسوم دراسية، كتب ومناهج، أنشطة
  amount: number;
  currency: string;
  status: PaymentStatus;
  dueDate: string;
  paidDate?: string;
  invoiceNumber?: string;
}

export interface PaymentRecord {
  id: string;
  studentId: string;
  descriptionAr: string;
  feeTitleAr?: string;
  amount: number;
  currency: string;
  date: string;
  receiptNumber: string;
  methodAr: string; // مدى، فيزا، Apple Pay، تحويل بنكي
  status: 'successful' | 'refunded';
}

export type Payment = PaymentRecord;

export interface FinancialSummary {
  currentBalance: number;
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
  currency: string;
}

// ---------- Notifications ----------
export type NotificationType = 'homework' | 'payment' | 'attendance' | 'feedback' | 'general';

export interface Notification {
  id: string;
  studentId?: string;
  type: NotificationType;
  titleAr: string;
  messageAr: string;
  date: string;
  isRead: boolean;
  routeTo?: string; // Tab / screen to navigate on tap
  actionPayload?: {
    tab?: string;
    level?: LevelId;
    itemId?: string;
  };
}

// ---------- Settings ----------
export interface NotificationSettings {
  homework: boolean;
  payments: boolean;
  attendance: boolean;
  feedback: boolean;
  courseExpiry: boolean;
}

// ---------- Quick Actions ----------
export interface QuickAction {
  id: string;
  titleAr: string;
  icon: string;
  action: () => void;
}
