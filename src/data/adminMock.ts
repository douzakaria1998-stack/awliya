import {
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
} from '@/types/admin';

// =========================================================================
// 1. Administrators and Teachers Accounts
// =========================================================================
export const mockAdminUsers: AdminUser[] = [
  {
    id: 'usr-super-01',
    fullNameAr: 'د. طارق المنصور',
    fullNameEn: 'Dr. Tariq Al-Mansoor',
    username: 'superadmin',
    email: 'superadmin@myschool.edu',
    role: 'super_admin',
    phone: '+213 770 100 001',
    avatarUrl: '',
    departmentAr: 'الإدارة العامة ومجلس الأكاديمية',
    departmentEn: 'Executive Board & Academy Management',
    createdAt: '2024-01-01',
    lastLogin: '2025-02-22 10:30',
    status: 'active',
  },
  {
    id: 'usr-admin-01',
    fullNameAr: 'أ. نادين بوزيد',
    fullNameEn: 'Nadine Bouzid',
    username: 'nadine.admin',
    email: 'admissions@myschool.edu',
    role: 'administrator',
    phone: '+213 770 200 002',
    avatarUrl: '',
    departmentAr: 'إدارة شؤون الطلاب والتسجيل',
    departmentEn: 'Academic Admissions & Student Affairs',
    createdAt: '2024-03-15',
    lastLogin: '2025-02-22 09:45',
    status: 'active',
  },
  {
    id: 'usr-teach-01',
    fullNameAr: 'أ. سارة بن علي',
    fullNameEn: 'Sarah Benali',
    username: 'sarah.teacher',
    email: 'sarah.benali@myschool.edu',
    role: 'teacher',
    phone: '+213 770 300 001',
    avatarUrl: '',
    departmentAr: 'هيئة تدريس اللغة الإنجليزية (CEFR Master)',
    departmentEn: 'English Language Department',
    languagesTaught: ['English'],
    specialization: 'CEFR Grammar & Conversation',
    experience: '7 years in TEFL / Cambridge Curriculum',
    assignedGroups: ['grp-a1-01', 'grp-a2-03', 'grp-b1-02'],
    createdAt: '2024-02-01',
    lastLogin: '2025-02-22 11:15',
    status: 'active',
  },
  {
    id: 'usr-teach-02',
    fullNameAr: 'مستر ديفيد ويلسون',
    fullNameEn: 'Mr. David Wilson',
    username: 'david.wilson',
    email: 'david.wilson@myschool.edu',
    role: 'teacher',
    phone: '+213 770 300 002',
    avatarUrl: '',
    departmentAr: 'هيئة تدريس النطق والمحادثة (Native Instructor)',
    departmentEn: 'Phonetics & Verbal Fluency Department',
    languagesTaught: ['English'],
    specialization: 'IELTS / TOEFL & Speaking Labs',
    experience: '10 years in ESL & Pronunciation',
    assignedGroups: ['grp-b2-01', 'grp-a2-03'],
    createdAt: '2024-02-15',
    lastLogin: '2025-02-21 17:30',
    status: 'active',
  },
  {
    id: 'usr-teach-03',
    fullNameAr: 'مدام كلير ديبوا',
    fullNameEn: 'Mme. Claire Dubois',
    username: 'claire.dubois',
    email: 'claire.dubois@myschool.edu',
    role: 'teacher',
    phone: '+213 770 300 003',
    avatarUrl: '',
    departmentAr: 'هيئة تدريس مسار اللغة الفرنسية (DELF / DALF)',
    departmentEn: 'French Language Department',
    languagesTaught: ['French'],
    specialization: 'DELF Junior & French Literature',
    experience: '8 years in French Pedagogy',
    assignedGroups: ['grp-fr-01', 'grp-fr-02'],
    createdAt: '2024-03-01',
    lastLogin: '2025-02-21 16:45',
    status: 'active',
  },
];

// =========================================================================
// 2. Teachers Directory
// =========================================================================
export const mockAdminTeachers: AdminTeacher[] = [];

// =========================================================================
// 3. Parents Directory (Multi-Student Relationship)
// =========================================================================
export const mockAdminParents: AdminParent[] = [];

// =========================================================================
// 4. Groups Directory (Class / Session Hub)
// =========================================================================
export const mockAdminGroups: AdminGroup[] = [];

// =========================================================================
// 5. Students Directory
// =========================================================================
export const mockAdminStudents: AdminStudent[] = [];

// =========================================================================
// 6. Curriculum Management (Levels, Units, Lessons)
// =========================================================================
export const mockCurricula: CurriculumLevel[] = [];

// =========================================================================
// 7. Attendance Sessions & Historical Records
// =========================================================================
export const mockAttendanceSessions: AttendanceSession[] = [];

// =========================================================================
// 8. Homework Assignments & Evaluation Stream
// =========================================================================
export const mockAdminHomework: AdminHomeworkAssignment[] = [];

// =========================================================================
// 9. Skill Assessments (4 Skills: Listening, Speaking, Reading, Writing)
// =========================================================================
export const mockAdminAssessments: AdminAssessmentRecord[] = [];

// =========================================================================
// 10. Two-Way Feedback (Teacher ↔ Parent)
// =========================================================================
export const mockTwoWayFeedback: TwoWayFeedbackItem[] = [
  {
    id: 'fb-01',
    studentId: 'stu-01',
    studentNameAr: 'احمد بوكوشة',
    studentNameEn: 'Ahmed Boukoucha',
    parentId: 'par-01',
    parentName: 'رؤوف بوكوشة',
    teacherId: 'usr-admin-01',
    teacherName: 'د. طارق المنصور',
    date: '2026-09-03',
    teacherFeedback: {
      strengths: ['Good pronunciation', 'Active in class'],
      needsImprovement: ['Spontaneous dialogue fluency'],
      recommendations: 'Practice speaking 10 minutes daily at home.',
      generalComments: 'السلام عليكم ورحمة الله، احمد ما شاء الله طالب مجتهد وذكي جداً. أظهر اليوم تفاعلاً رائعاً في ورشة المحادثة والنطق بالإنجليزية، ونرجو منكم حثه على الاستماع والتكرار اليومي في المنزل لترسيخ المفردات والطلاقة اللغوية.',
    },
  },
];

// =========================================================================
// 11. Role Permission Matrix (Section 32)
// =========================================================================
export const mockRolePermissions: AdminRolePermissionConfig[] = [
  {
    roleId: 'super_admin',
    roleNameAr: 'المدير العام (Super Admin)',
    roleNameEn: 'Super Administrator',
    descriptionAr: 'صلاحيات مطلقة وكاملة تشمل إدارة حسابات المدراء، الصلاحيات، وسجل التدقيق وإعدادات المنصة.',
    modules: {
      dashboard: 'full',
      students: 'full',
      parents: 'full',
      teachers: 'full',
      groups: 'full',
      academicPath: 'full',
      attendance: 'full',
      performance: 'full',
      assessments: 'full',
      adminRoles: 'full',
      systemSettings: 'full',
      auditLogs: 'full',
    },
  },
  {
    roleId: 'administrator',
    roleNameAr: 'مدير العمليات الأكاديمية (Admin)',
    roleNameEn: 'Academic & Operations Admin',
    descriptionAr: 'صلاحيات تشغيلية لإدارة الطلاب، أولياء الأمور، الأفواج، الحضور، والمناهج دون صلاحية تعديل المدراء.',
    modules: {
      dashboard: 'full',
      students: 'full',
      parents: 'full',
      teachers: 'optional',
      groups: 'full',
      academicPath: 'manage',
      attendance: 'full',
      performance: 'full',
      assessments: 'full',
      adminRoles: 'none',
      systemSettings: 'none',
      auditLogs: 'none',
    },
  },
  {
    roleId: 'teacher',
    roleNameAr: 'المعلم (Teacher)',
    roleNameEn: 'Course Teacher',
    descriptionAr: 'صلاحية مقتصرة تماماً على طلابه وأفواجه المسندة إليه، رصد الحضور، الواجبات والتقييمات.',
    modules: {
      dashboard: 'personal',
      students: 'own_students',
      parents: 'related_parents',
      teachers: 'none',
      groups: 'own_groups',
      academicPath: 'view_progress',
      attendance: 'own_groups',
      performance: 'own_students',
      assessments: 'own_students',
      adminRoles: 'none',
      systemSettings: 'none',
      auditLogs: 'none',
    },
  },
];

// =========================================================================
// 12. Audit Log Records (Section 37-D)
// =========================================================================
export const mockAuditLogs: AuditLogEntry[] = [];

// =========================================================================
// 13. Admin Notification Center (Section 37-A)
// =========================================================================
export const mockAdminNotifications: AdminNotificationItem[] = [];

// =========================================================================
// 14. Pending Student Registrations
// =========================================================================
export const mockPendingApprovals: PendingStudentApproval[] = [];
