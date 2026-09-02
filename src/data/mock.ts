// =============================================
// Comprehensive Mock Data for Awliya Parent Portal
// Supports multi-student with custom progress, levels, homework, attendance, etc.
// =============================================

import {
  Parent,
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

// ---------- Parent Profile ----------
export const mockParent: Parent = {
  id: 'parent-001',
  fullNameAr: 'أحمد بن محمد الدوزكري',
  email: 'ahmed.douzkari@gmail.com',
  phone: '+966 50 123 4567',
  nationalId: '1098765432',
  avatarUrl: '',
};

// ---------- Multiple Students (Children) ----------
export const mockStudents: Student[] = [];

export const mockStudent = mockStudents[0];

// ---------- 10 Academic Levels Template Generator ----------
export const levelCurriculumTemplates: Record<
  LevelId,
  {
    nameAr: string;
    stageAr: string;
    subjects: string[];
    descriptionAr: string;
    modules: { titleAr: string; lessonsCount: number }[];
  }
> = {
  1: {
    nameAr: 'المستوى الأول: التأسيس الصوتي والمفردات الأولية (Starter A1.1)',
    stageAr: 'مرحلة التأسيس والحروف والنطق (Phonetics & Basics)',
    subjects: ['الحروف والأصوات الصوتية (Phonics & Alphabet)', 'التحيات والتعريف بالنفس (Greetings & Intro)', 'الأرقام والألوان والأشياء اليومية'],
    descriptionAr: 'بناء الأساس الصحيح للنطق الإنجليزي والفرنسي السليم والتعرف على الكلمات التأسيسية.',
    modules: [
      { titleAr: 'مخارج الأصوات والحروف (Alphabet & Sounds)', lessonsCount: 8 },
      { titleAr: 'المفردات التأسيسية والتحيات اليومية', lessonsCount: 6 },
      { titleAr: 'تكوين الكلمات ونطق المقاطع الصوتية', lessonsCount: 6 },
    ],
  },
  2: {
    nameAr: 'المستوى الثاني: بناء الجمل والتواصل البسيط (Beginner A1.2)',
    stageAr: 'مرحلة التراكيب وقواعد البدايات (Basic Grammar)',
    subjects: ['الضمائر والأفعال الأساسية (To Be / Être & Avoir)', 'الروتين اليومي والأوقات (Daily Routines)', 'تكوين الأسئلة والإجابات البسيطة'],
    descriptionAr: 'تكوين جمل متكاملة والتعبير عن النشاطات اليومية والتفاعل مع المعلم والزملاء.',
    modules: [
      { titleAr: 'الأفعال الشائعة والضمائر الشخصية', lessonsCount: 8 },
      { titleAr: 'الروتين اليومي وأيام الأسبوع والطقس', lessonsCount: 6 },
      { titleAr: 'المحادثات القصيرة والتعبير الشفهي', lessonsCount: 6 },
    ],
  },
  3: {
    nameAr: 'المستوى الثالث: الاستماع والمحادثة اليومية (Elementary A2.1)',
    stageAr: 'مرحلة الاستماع والتحدث التفاعلي (Listening & Dialogue)',
    subjects: ['زمن المضارع والماضي البسيط (Present & Past)', 'المحادثات في المدرسة والتسوق والسفر', 'الفهم السمعي للحوارات المسجلة'],
    descriptionAr: 'تنمية مهارة الاستماع السريع والطلاقة في إجراء حوارات يومية متواصلة.',
    modules: [
      { titleAr: 'الأزمنة وتصريف الأفعال الأساسية', lessonsCount: 7 },
      { titleAr: 'ورش المحادثة ولعب الأدوار (Role-play)', lessonsCount: 7 },
      { titleAr: 'تمارين الاستماع وتلخيص الحوارات', lessonsCount: 8 },
    ],
  },
  4: {
    nameAr: 'المستوى الرابع: الطلاقة الشفهية والتعبير الكتابي (Pre-Intermediate A2.2)',
    stageAr: 'مرحلة التعبير والتحدث بطلاقة (Oral Fluency & Writing)',
    subjects: ['المستقبل والمقارنات (Future & Comparisons)', 'سرد القصص والتجارب الشخصية', 'كتابة الفقرات والرسائل البسيطة'],
    descriptionAr: 'الانتقال إلى سرد القصص القصيرة والتعبير عن الآراء الشخصية شفهياً وكتابياً.',
    modules: [
      { titleAr: 'أدوات الربط وبناء الفقرات المترابطة', lessonsCount: 10 },
      { titleAr: 'السرد القصصي والتعبير الشفهي المباشر', lessonsCount: 10 },
      { titleAr: 'القراءة الجهرية وتحسين مخارج النطق', lessonsCount: 8 },
    ],
  },
  5: {
    nameAr: 'المستوى الخامس: التراكيب المتقدمة والحوار الموسع (Intermediate B1.1)',
    stageAr: 'مرحلة الاستقلالية اللغوية (Language Autonomy)',
    subjects: ['الأزمنة المركبة والشرطية (Conditionals & Modals)', 'المناقشات الجماعية وإبداء الرأي', 'استيعاب المقروء للنصوص المتوسطة'],
    descriptionAr: 'المشاركة الفعالة في الحوارات والمناقشات وفهم المقالات والمحادثات المتقدمة.',
    modules: [
      { titleAr: 'القواعد المتقدمة وتراكيب الجمل المعقدة', lessonsCount: 10 },
      { titleAr: 'ورش النقاش والمحادثة التفاعلية', lessonsCount: 10 },
      { titleAr: 'تحليل النصوص واستخراج الأفكار الرئيسية', lessonsCount: 8 },
    ],
  },
  6: {
    nameAr: 'المستوى السادس: القراءة التحليلية والتعابير الاصطلاحية (Upper-Intermediate B1.2)',
    stageAr: 'مرحلة التحليل والكتابة التعبيرية (Reading & Idioms)',
    subjects: ['التعابير الاصطلاحية والأمثال (Idioms & Phrasal Verbs)', 'كتابة المقالات والمراسلات الرسمية', 'الاستماع للنشرات والبودكاست'],
    descriptionAr: 'إتقان التعبيرات اليومية الشائعة وكتابة المقالات المنظمة وفهم البرامج الصوتية.',
    modules: [
      { titleAr: 'المفردات المتقدمة والتعابير الاصطلاحية', lessonsCount: 10 },
      { titleAr: 'مهارات الكتابة المقالية والتنظيم اللغوي', lessonsCount: 10 },
      { titleAr: 'الاستماع المتقدم للوسائط المتعددة', lessonsCount: 8 },
    ],
  },
  7: {
    nameAr: 'المستوى السابع: النقاشات الأكاديمية والمناظرات (Advanced B2.1)',
    stageAr: 'مرحلة الحوار المتقدم والمناظرات (Debates & Presentations)',
    subjects: ['مهارات الإلقاء والعروض التقديمية (Public Speaking)', 'المناظرات والدفاع عن وجهات النظر', 'الكتابة الأكاديمية والتقارير'],
    descriptionAr: 'بناء الثقة في التحدث أمام الجمهور وإعداد العروض التقديمية والمناظرات الفكرية.',
    modules: [
      { titleAr: 'تقنيات العرض التقديمي والإلقاء المؤثر', lessonsCount: 10 },
      { titleAr: 'فنون المناظرة وصياغة الحجج المنطقية', lessonsCount: 10 },
      { titleAr: 'إعداد التقارير والمقالات الأكاديمية', lessonsCount: 8 },
    ],
  },
  8: {
    nameAr: 'المستوى الثامن: البلاغة والأساليب اللغوية الرفيعة (Advanced B2.2)',
    stageAr: 'مرحلة الصقل اللغوي والنطق الاحترافي (Accent & Rhetoric)',
    subjects: ['دراسة الأساليب البلاغية ونصوص الأدب العالمي', 'التدريب المكثف على اللهجة والنبرة (Accent Reduction)', 'تحليل الأفلام والمقاطع الوثائقية'],
    descriptionAr: 'صقل النبرة الصوتية والتحدث بسلاسة تامة ومقاربة المتحدثين الأصليين.',
    modules: [
      { titleAr: 'النطق المتقدم وضبط النبر والتنغيم الصوتي', lessonsCount: 10 },
      { titleAr: 'تحليل نصوص الأدب الإنجليزي والفرنسي', lessonsCount: 10 },
      { titleAr: 'التحليل النقدي والمحادثات المتقدمة', lessonsCount: 8 },
    ],
  },
  9: {
    nameAr: 'المستوى التاسع: الكفاءة الأكاديمية واختبارات الكفاءة (Proficiency C1 & IELTS/DELF)',
    stageAr: 'مرحلة الكفاءة العالية والاستعداد للاختبارات الدولية',
    subjects: ['التحضير لاختبارات (IELTS / TOEFL / DELF B2-C1)', 'الكتابة الأكاديمية المتقدمة والبحوث', 'الترجمة الفورية والمقارنة اللغوية'],
    descriptionAr: 'الاستعداد التام للاختبارات الدولية المعترف بها وتحقيق أعلى الدرجات الأكاديمية.',
    modules: [
      { titleAr: 'استراتيجيات اجتياز اختبارات IELTS و DELF', lessonsCount: 10 },
      { titleAr: 'الكتابة الأكاديمية التخصصية المتقدمة', lessonsCount: 10 },
      { titleAr: 'التطبيقات الشفهية واختبارات المحاكاة', lessonsCount: 8 },
    ],
  },
  10: {
    nameAr: 'المستوى العاشر: الطلاقة الشاملة والإتقان التام (Bilingual Mastery C2)',
    stageAr: 'مرحلة الإتقان والطلاقة ثنائية اللغة التامة (Native-like Mastery)',
    subjects: ['المحادثة والتفكير التلقائي كالمتحدثين الأصليين', 'البحوث والمناقشات رفيعة المستوى', 'المشروع الختامي ونيل شهادة الإتقان'],
    descriptionAr: 'الوصول إلى قمة الهرم التعليمي في إتقان اللغتين الإنجليزية والفرنسية بطلاقة شاملة.',
    modules: [
      { titleAr: 'المشروع الأكاديمي الشامل والعرض الختامي', lessonsCount: 15 },
      { titleAr: 'الترجمة والتحليل اللغوي المتقدم', lessonsCount: 10 },
      { titleAr: 'الاختبار النهائي وشهادة الطلاقة ثنائية اللغة', lessonsCount: 5 },
    ],
  },
};

// Function to generate 10 levels dynamically for any student
export function getAcademicLevelsForStudent(currentLevel: LevelId): AcademicLevel[] {
  const levels: AcademicLevel[] = [];
  const levelIds: LevelId[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  for (const lvl of levelIds) {
    const template = levelCurriculumTemplates[lvl];
    let status: 'studied' | 'current' | 'locked' = 'locked';
    let completedDate: string | undefined = undefined;
    let score: number | undefined = undefined;
    let certificateAvailable: boolean = false;

    if (lvl < currentLevel) {
      status = 'studied';
      const yearOffset = currentLevel - lvl;
      completedDate = `2024-0${Math.min(9, Math.max(1, 10 - yearOffset * 3))}-15`;
      score = 90 + ((lvl * 3) % 10);
      certificateAvailable = true;
    } else if (lvl === currentLevel) {
      status = 'current';
    } else {
      status = 'locked';
    }

    levels.push({
      level: lvl,
      nameAr: template.nameAr,
      stageAr: template.stageAr,
      status,
      subjects: template.subjects,
      descriptionAr: template.descriptionAr,
      completedDate,
      score,
      certificateAvailable,
      modules: template.modules.map((m, idx) => ({
        ...m,
        isCompleted: status === 'studied' || (status === 'current' && idx === 0),
      })),
    });
  }

  return levels;
}

// ---------- Homework for Specific Students ----------
export const mockHomeworkMap: Record<string, Homework[]> = {};

// ---------- Attendance Data Generator ----------
export function getAttendanceDataForStudent(studentId: string, isNewStudent?: boolean): {
  records: AttendanceRecord[];
  summary: AttendanceSummary;
} {
  // If the student is new, attendance is strictly 0% with 0 recorded days
  if (
    isNewStudent ||
    studentId === 'student-001' ||
    studentId.startsWith('student-new') ||
    studentId.includes('new') ||
    !studentId
  ) {
    return {
      records: [],
      summary: {
        totalDays: 0,
        presentDays: 0,
        absentDays: 0,
        lateDays: 0,
        excusedDays: 0,
        attendancePercentage: 0,
      },
    };
  }

  const dates = [
    // Week 0: الأسبوع الحالي (15 - 20 فبراير 2025)
    { date: '2025-02-15', day: 'السبت', subject: 'محادثة إنجليزية', status: 'present' as const, time: '04:30 م', weekIndex: 0 },
    { date: '2025-02-16', day: 'الأحد', subject: 'قواعد وتراكيب', status: 'late' as const, note: 'تأخر 12 دقيقة بسبب الازدحام', time: '04:42 م', weekIndex: 0 },
    { date: '2025-02-17', day: 'الإثنين', subject: 'ورشة النطق الفرنسي', status: 'present' as const, time: '04:30 م', weekIndex: 0 },
    { date: '2025-02-18', day: 'الثلاثاء', subject: 'استماع ومناقشة', status: 'absent' as const, note: 'عذر مرضي مسبق', time: '04:30 م', weekIndex: 0 },
    { date: '2025-02-19', day: 'الأربعاء', subject: 'قراءة وفهم نصوص', status: 'present' as const, time: '04:30 م', weekIndex: 0 },
    { date: '2025-02-20', day: 'الخميس', subject: 'محادثة إنجليزية', status: 'present' as const, time: '04:30 م', weekIndex: 0 },

    // Week 1: الأسبوع الماضي (8 - 13 فبراير 2025)
    { date: '2025-02-08', day: 'السبت', subject: 'تعبير وكتابة', status: 'present' as const, time: '04:30 م', weekIndex: 1 },
    { date: '2025-02-09', day: 'الأحد', subject: 'قواعد وتراكيب', status: 'present' as const, time: '04:30 م', weekIndex: 1 },
    { date: '2025-02-10', day: 'الإثنين', subject: 'محادثة إنجليزية', status: 'present' as const, time: '04:30 م', weekIndex: 1 },
    { date: '2025-02-11', day: 'الثلاثاء', subject: 'ورشة النطق الفرنسي', status: 'present' as const, time: '04:30 م', weekIndex: 1 },
    { date: '2025-02-12', day: 'الأربعاء', subject: 'استماع ومناقشة', status: 'present' as const, time: '04:30 م', weekIndex: 1 },
    { date: '2025-02-13', day: 'الخميس', subject: 'محادثة وتطبيق', status: 'excused' as const, note: 'مناسبة أسرية مصرح بها', time: '04:30 م', weekIndex: 1 },

    // Week 2: الأسبوع الأسبق (1 - 6 فبراير 2025)
    { date: '2025-02-01', day: 'السبت', subject: 'محادثة إنجليزية', status: 'present' as const, time: '04:30 م', weekIndex: 2 },
    { date: '2025-02-02', day: 'الأحد', subject: 'قواعد وتراكيب', status: 'present' as const, time: '04:30 م', weekIndex: 2 },
    { date: '2025-02-03', day: 'الإثنين', subject: 'ورشة النطق الفرنسي', status: 'present' as const, time: '04:30 م', weekIndex: 2 },
    { date: '2025-02-04', day: 'الثلاثاء', subject: 'محادثة إنجليزية', status: 'present' as const, time: '04:30 م', weekIndex: 2 },
    { date: '2025-02-05', day: 'الأربعاء', subject: 'تعبير وكتابة', status: 'present' as const, time: '04:30 م', weekIndex: 2 },
    { date: '2025-02-06', day: 'الخميس', subject: 'استماع ومناقشة', status: 'present' as const, time: '04:30 م', weekIndex: 2 },
  ];

  const records: AttendanceRecord[] = dates.map((d, i) => ({
    id: `att-${studentId}-${i}`,
    studentId,
    date: d.date,
    dayNameAr: d.day,
    subjectAr: d.subject,
    weekIndex: d.weekIndex,
    status: d.status,
    noteAr: d.note,
    sessionTimeAr: d.time,
  }));

  const presentCount = studentId === 'student-002' ? 56 : studentId === 'student-003' ? 44 : 52;
  const absentCount = studentId === 'student-002' ? 1 : studentId === 'student-003' ? 3 : 2;
  const lateCount = studentId === 'student-002' ? 1 : studentId === 'student-003' ? 2 : 3;
  const excusedCount = studentId === 'student-002' ? 2 : studentId === 'student-003' ? 1 : 3;
  const total = presentCount + absentCount + lateCount + excusedCount;
  const percentage = Math.round(((presentCount + excusedCount) / total) * 100);

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

// ---------- Assessments Data ----------
export const mockAssessmentsMap: Record<string, Assessment[]> = {};

// ---------- Teacher Feedback Messages ----------
export const mockTeacherFeedbackMap: Record<string, TeacherFeedback[]> = {};

// ---------- Fees & Financials Data ----------
export const mockFees: Fee[] = [];

export const mockPayments: PaymentRecord[] = [];

export function getFinancialSummaryForStudent(studentId?: string): FinancialSummary {
  const fees = studentId ? mockFees.filter((f) => f.studentId === studentId) : mockFees;
  const pending = fees.filter((f) => f.status === 'pending').reduce((sum, f) => sum + f.amount, 0);
  const paid = fees.filter((f) => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0);
  const overdue = fees.filter((f) => f.status === 'overdue').reduce((sum, f) => sum + f.amount, 0);

  return {
    currentBalance: pending,
    totalPaid: paid,
    totalPending: pending,
    totalOverdue: overdue,
    currency: 'د.ج',
  };
}

// ---------- Notifications Feed ----------
export const mockNotifications: Notification[] = [];

// ---------- Notification Settings Default ----------
export const mockNotificationSettings: NotificationSettings = {
  homework: true,
  payments: true,
  attendance: true,
  feedback: true,
  courseExpiry: true,
};
