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
export const mockAdminGroups: AdminGroup[] = [
  {
    id: 'grp-a1-01',
    name: 'Group A1 — Beginner',
    code: 'A1-01',
    language: 'English',
    level: 'A1',
    levelNumber: 1,
    teacherId: '',
    teacherName: '',
    daysAr: 'الأحد + الثلاثاء',
    daysEn: 'Sunday + Tuesday',
    startTime: '16:00',
    endTime: '18:00',
    maxCapacity: 20,
    studentIds: [],
    attendanceRate: 0,
    averageProgress: 0,
    averagePerformance: 0,
    completedLessonsCount: 0,
    totalLessonsCount: 20,
    status: 'active',
  },
  {
    id: 'grp-a2-03',
    name: 'Group A2 — Elementary',
    code: 'A2-03',
    language: 'English',
    level: 'A2',
    levelNumber: 2,
    teacherId: '',
    teacherName: '',
    daysAr: 'الأحد + الثلاثاء',
    daysEn: 'Sunday + Tuesday',
    startTime: '18:00',
    endTime: '20:00',
    maxCapacity: 20,
    studentIds: [],
    attendanceRate: 0,
    averageProgress: 0,
    averagePerformance: 0,
    completedLessonsCount: 0,
    totalLessonsCount: 20,
    status: 'active',
  },
  {
    id: 'grp-b1-02',
    name: 'Group B1 — Intermediate',
    code: 'B1-02',
    language: 'English',
    level: 'B1',
    levelNumber: 3,
    teacherId: '',
    teacherName: '',
    daysAr: 'الإثنين + الأربعاء',
    daysEn: 'Monday + Wednesday',
    startTime: '17:00',
    endTime: '19:00',
    maxCapacity: 20,
    studentIds: [],
    attendanceRate: 0,
    averageProgress: 0,
    averagePerformance: 0,
    completedLessonsCount: 0,
    totalLessonsCount: 24,
    status: 'active',
  },
  {
    id: 'grp-b2-01',
    name: 'Group B2 — Upper Intermediate Lab',
    code: 'B2-01',
    language: 'English',
    level: 'B2',
    levelNumber: 4,
    teacherId: '',
    teacherName: '',
    daysAr: 'السبت + الخميس',
    daysEn: 'Saturday + Thursday',
    startTime: '15:00',
    endTime: '17:00',
    maxCapacity: 15,
    studentIds: [],
    attendanceRate: 0,
    averageProgress: 0,
    averagePerformance: 0,
    completedLessonsCount: 0,
    totalLessonsCount: 24,
    status: 'active',
  },
  {
    id: 'grp-fr-01',
    name: 'Groupe Français A2 — DELF Junior',
    code: 'FR-01',
    language: 'French',
    level: 'A2',
    levelNumber: 2,
    teacherId: '',
    teacherName: '',
    daysAr: 'السبت + الإثنين',
    daysEn: 'Saturday + Monday',
    startTime: '14:00',
    endTime: '16:00',
    maxCapacity: 18,
    studentIds: [],
    attendanceRate: 0,
    averageProgress: 0,
    averagePerformance: 0,
    completedLessonsCount: 0,
    totalLessonsCount: 20,
    status: 'active',
  },
];

// =========================================================================
// 5. Students Directory
// =========================================================================
export const mockAdminStudents: AdminStudent[] = [];

// =========================================================================
// 6. Curriculum Management (Levels, Units, Lessons)
// =========================================================================
export const mockCurricula: CurriculumLevel[] = [
  {
    levelNumber: 1,
    cefrCode: 'A1',
    nameAr: 'المستوى A1 — المبتدئ والتأسيس',
    nameEn: 'Level A1 — Beginner & Foundation',
    descriptionAr: 'اكتساب المفردات الأساسية، تكوين الجمل البسيطة، والتحية والتعريف بالنفس.',
    descriptionEn: 'Basic vocabulary, simple sentence construction, greetings and self-introductions.',
    color: '#3B82F6', // Blue
    language: 'English',
    passingScore: 93,
    honorsDegreeAr: 'تقدير: ممتاز مرتفع (مع مرتبة الشرف)',
    honorsDegreeEn: 'Honors: High Distinction',
    units: [
      {
        id: 'u-a1-01',
        unitNumber: 1,
        titleAr: 'الوحدة 01: التعارف والمقدمات',
        titleEn: 'Unit 01: Introduction & Greetings',
        lessons: [
          {
            id: 'l-a1-01',
            lessonNumber: 1,
            titleAr: 'الدرس 01: التحيات والترحيب',
            titleEn: 'Lesson 01: Greetings & Welcomes',
            contentSummary: 'Formal and informal greetings, morning/afternoon phrases.',
            vocabulary: ['Hello', 'Good morning', 'Nice to meet you', 'How are you'],
            exercisesCount: 5,
            hasAssessment: true,
          },
          {
            id: 'l-a1-02',
            lessonNumber: 2,
            titleAr: 'الدرس 02: التعريف بالنفس',
            titleEn: 'Lesson 02: Introducing Yourself',
            contentSummary: 'Name, age, origin, and occupation basic patterns.',
            vocabulary: ['My name is', 'I am from', 'I live in', 'Student'],
            exercisesCount: 6,
            hasAssessment: false,
          },
          {
            id: 'l-a1-03',
            lessonNumber: 3,
            titleAr: 'الدرس 03: الدول والجنسيات',
            titleEn: 'Lesson 03: Countries & Nationalities',
            contentSummary: 'World countries, flags, nationalities, and languages.',
            vocabulary: ['Algeria', 'England', 'France', 'Arabic', 'English'],
            exercisesCount: 4,
            hasAssessment: true,
          },
          {
            id: 'l-a1-04',
            lessonNumber: 4,
            titleAr: 'الدرس 04: المعلومات الشخصية',
            titleEn: 'Lesson 04: Personal Information',
            contentSummary: 'Phone numbers, emails, addresses, and ID cards.',
            vocabulary: ['Email', 'Phone number', 'Address', 'Spell'],
            exercisesCount: 5,
            hasAssessment: true,
          },
        ],
      },
      {
        id: 'u-a1-02',
        unitNumber: 2,
        titleAr: 'الوحدة 02: العائلة والمنزل',
        titleEn: 'Unit 02: Family & Home',
        lessons: [
          {
            id: 'l-a1-05',
            lessonNumber: 1,
            titleAr: 'الدرس 01: أفراد العائلة',
            titleEn: 'Lesson 01: Family Members',
            contentSummary: 'Father, mother, brother, sister, grandparents.',
            vocabulary: ['Father', 'Mother', 'Brother', 'Sister', 'Parents'],
            exercisesCount: 5,
            hasAssessment: true,
          },
          {
            id: 'l-a1-06',
            lessonNumber: 2,
            titleAr: 'الدرس 02: غرف وأثاث المنزل',
            titleEn: 'Lesson 02: Rooms & Furniture',
            contentSummary: 'Living room, kitchen, bedroom, table, chair, bed.',
            vocabulary: ['Kitchen', 'Bedroom', 'Table', 'Window', 'Door'],
            exercisesCount: 6,
            hasAssessment: true,
          },
        ],
      },
      {
        id: 'u-a1-03',
        unitNumber: 3,
        titleAr: 'الوحدة 03: الحياة اليومية والروتين',
        titleEn: 'Unit 03: Daily Life & Routines',
        lessons: [
          {
            id: 'l-a1-07',
            lessonNumber: 1,
            titleAr: 'الدرس 01: الاستيقاظ والأنشطة الصباحية',
            titleEn: 'Lesson 01: Morning Routine',
            contentSummary: 'Present simple affirmative and time telling.',
            vocabulary: ['Wake up', 'Breakfast', 'Go to school', 'Brush teeth'],
            exercisesCount: 6,
            hasAssessment: true,
          },
        ],
      },
    ],
  },
  {
    levelNumber: 2,
    cefrCode: 'A2',
    nameAr: 'المستوى A2 — الأساسي وتوسيع التعبير',
    nameEn: 'Level A2 — Elementary & Expression Expansion',
    descriptionAr: 'التحدث عن التجارب السابقة، التسوق، طلب الطعام، ووصف الأحداث بالماضي البسيط.',
    descriptionEn: 'Past experiences, shopping, ordering food, and past simple descriptions.',
    color: '#8B5CF6', // Purple
    language: 'English',
    passingScore: 93,
    honorsDegreeAr: 'تقدير: ممتاز مرتفع (مع مرتبة الشرف)',
    honorsDegreeEn: 'Honors: High Distinction',
    units: [
      {
        id: 'u-a2-01',
        unitNumber: 1,
        titleAr: 'الوحدة 01: أحداث الماضي والتجارب',
        titleEn: 'Unit 01: Past Events & Experiences',
        lessons: [
          {
            id: 'l-a2-01',
            lessonNumber: 1,
            titleAr: 'الدرس 01: الماضي البسيط والأفعال المنتظمة',
            titleEn: 'Lesson 01: Past Simple Regular Verbs',
            contentSummary: 'Affirmative, negative, and question forms with -ed endings.',
            vocabulary: ['Visited', 'Played', 'Watched', 'Worked', 'Travelled'],
            exercisesCount: 8,
            hasAssessment: true,
          },
          {
            id: 'l-a2-02',
            lessonNumber: 2,
            titleAr: 'الدرس 02: الأفعال غير المنتظمة والمحادثة',
            titleEn: 'Lesson 02: Irregular Verbs in Dialogue',
            contentSummary: 'Common irregular verbs (went, saw, took, spoke, had).',
            vocabulary: ['Went', 'Bought', 'Saw', 'Ate', 'Spoke'],
            exercisesCount: 8,
            hasAssessment: true,
          },
        ],
      },
      {
        id: 'u-a2-02',
        unitNumber: 2,
        titleAr: 'الوحدة 02: السفر والمطارات',
        titleEn: 'Unit 02: Travel & Airports',
        lessons: [
          {
            id: 'l-a2-03',
            lessonNumber: 1,
            titleAr: 'الدرس 01: حجز التذاكر وإجراءات السفر',
            titleEn: 'Lesson 01: Booking & Check-in',
            contentSummary: 'At the airport, boarding passes, luggage, and gates.',
            vocabulary: ['Boarding pass', 'Luggage', 'Passport', 'Departure', 'Arrival'],
            exercisesCount: 6,
            hasAssessment: true,
          },
        ],
      },
    ],
  },
  {
    levelNumber: 3,
    cefrCode: 'B1',
    nameAr: 'المستوى B1 — المتوسط والاستقلالية اللغوية',
    nameEn: 'Level B1 — Intermediate & Independent User',
    descriptionAr: 'المناقشة والتعبير عن الرأي، كتابة المقالات القصيرة، والتعامل مع معظم مواقف السفر.',
    descriptionEn: 'Expressing opinions, short essay writing, dealing with real-life travel situations.',
    color: '#10B981', // Emerald
    language: 'English',
    passingScore: 93,
    honorsDegreeAr: 'تقدير: ممتاز مرتفع (مع مرتبة الشرف)',
    honorsDegreeEn: 'Honors: High Distinction',
    units: [
      {
        id: 'u-b1-01',
        unitNumber: 1,
        titleAr: 'الوحدة 01: العمل والوظائف المستقبلية',
        titleEn: 'Unit 01: Careers & Future Ambitions',
        lessons: [
          {
            id: 'l-b1-01',
            lessonNumber: 1,
            titleAr: 'الدرس 01: المقابلات الوظيفية',
            titleEn: 'Lesson 01: Job Interviews',
            contentSummary: 'Professional questions, qualifications, strengths and weaknesses.',
            vocabulary: ['Resume', 'Interview', 'Experience', 'Leadership', 'Skills'],
            exercisesCount: 10,
            hasAssessment: true,
          },
        ],
      },
    ],
  },
];

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
export const mockTwoWayFeedback: TwoWayFeedbackItem[] = [];

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
