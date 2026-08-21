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
export const mockStudents: Student[] = [
  {
    id: 'student-001',
    parentId: 'parent-001',
    fullNameAr: 'يوسف أحمد الدوزكري',
    firstNameAr: 'يوسف',
    lastNameAr: 'الدوزكري',
    birthday: '2014-05-12',
    schoolLevelAr: 'السنة الخامسة ابتدائي',
    nicknameAr: 'يوسف',
    enrolledPathAr: 'مسار حفظ القرآن الكريم وتجويده',
    currentLevel: 4 as LevelId,
    currentLevelProgress: 68,
    studentIdNumber: 'STD-2024-0042',
    academicYearAr: '1446-1447هـ (2024-2025)',
    branchAr: 'فرع الروضة - الرياض',
    timingAr: 'خلال أيام الأسبوع (Weekdays)',
    status: 'active',
    enrollmentDate: '2023-09-01',
    age: 11,
  },
  {
    id: 'student-002',
    parentId: 'parent-001',
    fullNameAr: 'مريم أحمد الدوزكري',
    firstNameAr: 'مريم',
    lastNameAr: 'الدوزكري',
    birthday: '2011-09-20',
    schoolLevelAr: 'السنة الثالثة متوسط',
    nicknameAr: 'مريم',
    enrolledPathAr: 'مسار التجويد المتقدم والقراءات',
    currentLevel: 7 as LevelId,
    currentLevelProgress: 84,
    studentIdNumber: 'STD-2023-0118',
    academicYearAr: '1446-1447هـ (2024-2025)',
    branchAr: 'فرع العليا - الرياض',
    timingAr: 'نهاية الأسبوع (Weekend)',
    status: 'active',
    enrollmentDate: '2022-09-01',
    age: 14,
  },
  {
    id: 'student-003',
    parentId: 'parent-001',
    fullNameAr: 'عمر أحمد الدوزكري',
    firstNameAr: 'عمر',
    lastNameAr: 'الدوزكري',
    birthday: '2018-03-15',
    schoolLevelAr: 'السنة الأولى ابتدائي',
    nicknameAr: 'عمر',
    enrolledPathAr: 'مسار التأسيس والقاعدة النورانية',
    currentLevel: 2 as LevelId,
    currentLevelProgress: 42,
    studentIdNumber: 'STD-2025-0005',
    academicYearAr: '1446-1447هـ (2024-2025)',
    branchAr: 'فرع الروضة - الرياض',
    timingAr: 'خلال أيام الأسبوع (Weekdays)',
    status: 'active',
    enrollmentDate: '2024-09-01',
    age: 7,
  },
];

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
    nameAr: 'المستوى الأول: التأسيس القرآني والقراءة',
    stageAr: 'مرحلة التأسيس والقاعدة النورانية',
    subjects: ['مخارج الحروف', 'الحركات والمدود القصيرة', 'سورة الفاتحة وقصار السور (الناس، الفلق، الإخلاص)'],
    descriptionAr: 'بناء الأساس الصحيح للنطق العربي وتلاوة السور التأسيسية بسلاسة.',
    modules: [
      { titleAr: 'مخارج الحروف ونطقها السليم', lessonsCount: 8 },
      { titleAr: 'الحركات الثلاث والتنوين', lessonsCount: 6 },
      { titleAr: 'تسميع السور التأسيسية', lessonsCount: 6 },
    ],
  },
  2: {
    nameAr: 'المستوى الثاني: قصار السور والتلاوة',
    stageAr: 'مرحلة التلاوة وضبط الحركات',
    subjects: ['حفظ من سورة المسد إلى سورة الكوثر', 'السكون والشدة', 'مبادئ الترتيل'],
    descriptionAr: 'تثبيت حفظ قصار السور وضبط النطق بالحركات والسكون والشدات.',
    modules: [
      { titleAr: 'حفظ السور من المسد للكوثر', lessonsCount: 8 },
      { titleAr: 'أحكام الشدة والسكون', lessonsCount: 6 },
      { titleAr: 'تدريبات الترتيل والاسترسال', lessonsCount: 6 },
    ],
  },
  3: {
    nameAr: 'المستوى الثالث: أحكام النون الساكنة والتنوين',
    stageAr: 'مرحلة أحكام التجويد الأساسية',
    subjects: ['الإظهار والإدغام', 'الإقلاب والإخفاء الحقيقي', 'حفظ من الماعون إلى العصر'],
    descriptionAr: 'دراسة وتطبيق أحكام النون الساكنة والتنوين مع الربط العملي في الحفظ.',
    modules: [
      { titleAr: 'حكم الإظهار والإدغام بغنة وبغير غنة', lessonsCount: 7 },
      { titleAr: 'حكم الإقلاب والإخفاء الحقيقي', lessonsCount: 7 },
      { titleAr: 'حفظ السور المقررة وتطبيق الأحكام', lessonsCount: 8 },
    ],
  },
  4: {
    nameAr: 'المستوى الرابع: جزء عم وإتقان التجويد',
    stageAr: 'مرحلة إتمام جزء عم والتطبيق النظري',
    subjects: ['حفظ من سورة التكاثر إلى سورة النبأ', 'أحكام الميم الساكنة', 'المد الطبيعي والفرعي'],
    descriptionAr: 'إتمام حفظ جزء عم كاملاً مع التمكن من أحكام الميم الساكنة والمدود.',
    modules: [
      { titleAr: 'حفظ من سورة التكاثر إلى سورة البلد', lessonsCount: 10 },
      { titleAr: 'حفظ من سورة الفجر إلى سورة النبأ', lessonsCount: 10 },
      { titleAr: 'أحكام الميم الساكنة والمدود', lessonsCount: 8 },
    ],
  },
  5: {
    nameAr: 'المستوى الخامس: جزء تبارك والمخارج والصفات',
    stageAr: 'مرحلة جزء تبارك وتدقيق المخارج',
    subjects: ['حفظ جزء تبارك (الملك إلى المرسلات)', 'صفات الحروف الذاتية والعرضية', 'القلقلة ومراتبها'],
    descriptionAr: 'الانتقال إلى جزء تبارك مع التدريب العملي على صفات الحروف والقلقلة.',
    modules: [
      { titleAr: 'حفظ سور الملك والقلم والحاقة', lessonsCount: 10 },
      { titleAr: 'حفظ المعارج حتى المرسلات', lessonsCount: 10 },
      { titleAr: 'صفات الحروف والقلقلة', lessonsCount: 8 },
    ],
  },
  6: {
    nameAr: 'المستوى السادس: أحكام الراء واللامات والمدود',
    stageAr: 'مرحلة تفخيم وترقيق الحروف',
    subjects: ['حفظ جزء قد سمع (المجادلة إلى التحريم)', 'أحكام الراءات تفخيماً وترقيقاً', 'لام لفظ الجلالة واللامات السواكن'],
    descriptionAr: 'التفخيم والترقيق وقواعد الراءات واللامات مع حفظ جزء المجادلة.',
    modules: [
      { titleAr: 'حفظ المجادلة والحشر والممتحنة', lessonsCount: 10 },
      { titleAr: 'حفظ الصف حتى التحريم', lessonsCount: 10 },
      { titleAr: 'التفخيم والترقيق واللامات', lessonsCount: 8 },
    ],
  },
  7: {
    nameAr: 'المستوى السابع: جزء الذاريات والأحقاف',
    stageAr: 'مرحلة الحفظ المتقدم مع التدبر',
    subjects: ['حفظ جزئي الذاريات والأحقاف', 'الوقف والابتداء', 'معاني الآيات وتدبرها'],
    descriptionAr: 'الانتقال للأجزاء الطويلة مع دراسة علامات الوقف وأصول التدبر.',
    modules: [
      { titleAr: 'حفظ سورة الذاريات والطور والنجم', lessonsCount: 10 },
      { titleAr: 'حفظ القمر والرحمن والواقعة والحديد', lessonsCount: 10 },
      { titleAr: 'أصول الوقف والابتداء والتدبر', lessonsCount: 8 },
    ],
  },
  8: {
    nameAr: 'المستوى الثامن: المتشابهات وضبط الحفظ',
    stageAr: 'مرحلة تثبيت المتشابهات اللفظية',
    subjects: ['حفظ سورة يس والصافات وص والزمر', 'متشابهات الألفاظ والآيات', 'التسميع التراكمي بالأرباع'],
    descriptionAr: 'التمكن من ضبط المتشابهات اللفظية ومراجعة الأجزاء المحفوظة سابقاً.',
    modules: [
      { titleAr: 'حفظ سورتي يس والصافات', lessonsCount: 10 },
      { titleAr: 'حفظ سورتي ص والزمر', lessonsCount: 10 },
      { titleAr: 'دليل المتشابهات القرآنية وضبطها', lessonsCount: 8 },
    ],
  },
  9: {
    nameAr: 'المستوى التاسع: الرسم العثماني وعلم الفواصل',
    stageAr: 'مرحلة الضبط المتقدم وعلوم القرآن',
    subjects: ['حفظ سور الحواميم وفصلت والشورى', 'قواعد الرسم والضبط العثماني', 'علم فواصل الآيات ووجوه الإعراب القرآني'],
    descriptionAr: 'دراسة كتابة المصحف الشريف وضبط الحواميم بالكامل.',
    modules: [
      { titleAr: 'حفظ سور غافر وفصلت والشورى', lessonsCount: 10 },
      { titleAr: 'حفظ الزخرف والدخان والجاثية', lessonsCount: 10 },
      { titleAr: 'الرسم العثماني وفواصل الآيات', lessonsCount: 8 },
    ],
  },
  10: {
    nameAr: 'المستوى العاشر: الإتقان والختم والإجازة',
    stageAr: 'مرحلة الختم بالسند المتصل والاستعداد للإجازة',
    subjects: ['عرض القرآن الكريم كاملاً غيباً', 'المتون العلمية (تحفة الأطفال والجزرية)', 'اختبار الختام والإجازة بالسند'],
    descriptionAr: 'المرحلة العليا: سرد القرآن الكريم كاملاً وتثبيته ونيل الإجازة الأكاديمية.',
    modules: [
      { titleAr: 'السرد الكامل للقرآن الكريم غيباً', lessonsCount: 15 },
      { titleAr: 'شرح منظومة المقدمة الجزرية', lessonsCount: 10 },
      { titleAr: 'الاختبار الشامل للختم والإجازة', lessonsCount: 5 },
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
export const mockHomeworkMap: Record<string, Homework[]> = {
  'student-001': [
    {
      id: 'hw-101',
      studentId: 'student-001',
      titleAr: 'تسميع سورة قريش والفيل مع أحكام الميم الساكنة',
      subjectAr: 'حفظ وتجويد',
      level: 4,
      status: 'needs_revision',
      dueDate: '2025-02-25',
      teacherNote: 'أداء جيد ولكن يحتاج لإعادة تسميع الآيات (3-4) مع الانتباه لإخفاء الميم الساكنة عند حرف الباء.',
      score: 75,
      totalScore: 100,
    },
    {
      id: 'hw-102',
      studentId: 'student-001',
      titleAr: 'حل ورقة عمل أحكام الإظهار الشفوي',
      subjectAr: 'تجويد نظري',
      level: 4,
      status: 'completed',
      dueDate: '2025-02-22',
      submittedDate: '2025-02-21',
      teacherNote: 'ممتاز! تم حل جميع الأسئلة بدقة وتحديد مواضع الإظهار بشكل صحيح.',
      score: 98,
      totalScore: 100,
    },
    {
      id: 'hw-103',
      studentId: 'student-001',
      titleAr: 'مراجعة أسبوعية من سورة الهمزة إلى سورة الناس',
      subjectAr: 'المراجعة التراكمية',
      level: 4,
      status: 'pending',
      dueDate: '2025-02-28',
    },
    {
      id: 'hw-104',
      studentId: 'student-001',
      titleAr: 'كتابة وضبط كلمات سورة قريش بالرسم العثماني',
      subjectAr: 'الرسم والضبط',
      level: 4,
      status: 'completed',
      dueDate: '2025-02-18',
      submittedDate: '2025-02-17',
      score: 95,
      totalScore: 100,
    },
    {
      id: 'hw-105',
      studentId: 'student-001',
      titleAr: 'التحضير القبلي لسورة الماعون',
      subjectAr: 'تحضير مسبق',
      level: 4,
      status: 'not_started',
      dueDate: '2025-03-02',
    },
  ],
  'student-002': [
    {
      id: 'hw-201',
      studentId: 'student-002',
      titleAr: 'تسميع سورة النجم كاملة مع تطبيق الوقف التام',
      subjectAr: 'الحفظ المتقدم',
      level: 7,
      status: 'needs_revision',
      dueDate: '2025-02-24',
      teacherNote: 'تلاوة رائعة ومتقنة، فقط إعادة تسميع المقطع الأخير من الآية 50 مع مراعاة علامات الوقف.',
      score: 84,
      totalScore: 100,
    },
    {
      id: 'hw-202',
      studentId: 'student-002',
      titleAr: 'بحث مصغر حول معاني وأسباب نزول سورة الواقعة',
      subjectAr: 'التدبر والتفسير',
      level: 7,
      status: 'completed',
      dueDate: '2025-02-20',
      submittedDate: '2025-02-19',
      teacherNote: 'بحث متميز جداً وشامل، بارك الله في حرصك وفهمك.',
      score: 100,
      totalScore: 100,
    },
    {
      id: 'hw-203',
      studentId: 'student-002',
      titleAr: 'مراجعة جزئي الذاريات وقد سمع',
      subjectAr: 'المراجعة التراكمية',
      level: 7,
      status: 'pending',
      dueDate: '2025-02-27',
    },
  ],
  'student-003': [
    {
      id: 'hw-301',
      studentId: 'student-003',
      titleAr: 'تسميع سورة المسد وسورة الإخلاص',
      subjectAr: 'التأسيس والتلاوة',
      level: 2,
      status: 'completed',
      dueDate: '2025-02-21',
      submittedDate: '2025-02-20',
      teacherNote: 'بطل! نطق جميل ومخارج سليمة جداً.',
      score: 95,
      totalScore: 100,
    },
    {
      id: 'hw-302',
      studentId: 'student-003',
      titleAr: 'تمارين الحركات (الفتحة والضمة والكسرة)',
      subjectAr: 'القاعدة النورانية',
      level: 2,
      status: 'needs_revision',
      dueDate: '2025-02-25',
      teacherNote: 'يحتاج لمزيد من التدريب على التمييز بين الكسرة والياء الممدودة في الدرس الرابع.',
      score: 70,
      totalScore: 100,
    },
  ],
};

// ---------- Attendance Data Generator ----------
export function getAttendanceDataForStudent(studentId: string): {
  records: AttendanceRecord[];
  summary: AttendanceSummary;
} {
  const dates = [
    // Week 0: الأسبوع الحالي (15 - 20 فبراير 2025)
    { date: '2025-02-15', day: 'السبت', subject: 'حفظ وتجويد', status: 'present' as const, time: '04:30 م', weekIndex: 0 },
    { date: '2025-02-16', day: 'الأحد', subject: 'المراجعة التراكمية', status: 'late' as const, note: 'تأخر 12 دقيقة بسبب الازدحام', time: '04:42 م', weekIndex: 0 },
    { date: '2025-02-17', day: 'الإثنين', subject: 'تفسير وتدبر', status: 'present' as const, time: '04:30 م', weekIndex: 0 },
    { date: '2025-02-18', day: 'الثلاثاء', subject: 'تجويد نظري', status: 'absent' as const, note: 'عذر مرضي مسبق', time: '04:30 م', weekIndex: 0 },
    { date: '2025-02-19', day: 'الأربعاء', subject: 'الرسم والضبط', status: 'present' as const, time: '04:30 م', weekIndex: 0 },
    { date: '2025-02-20', day: 'الخميس', subject: 'حفظ وتجويد', status: 'present' as const, time: '04:30 م', weekIndex: 0 },

    // Week 1: الأسبوع الماضي (8 - 13 فبراير 2025)
    { date: '2025-02-08', day: 'السبت', subject: 'الرسم والضبط', status: 'present' as const, time: '04:30 م', weekIndex: 1 },
    { date: '2025-02-09', day: 'الأحد', subject: 'المراجعة التراكمية', status: 'present' as const, time: '04:30 م', weekIndex: 1 },
    { date: '2025-02-10', day: 'الإثنين', subject: 'حفظ وتجويد', status: 'present' as const, time: '04:30 م', weekIndex: 1 },
    { date: '2025-02-11', day: 'الثلاثاء', subject: 'تفسير وتدبر', status: 'present' as const, time: '04:30 م', weekIndex: 1 },
    { date: '2025-02-12', day: 'الأربعاء', subject: 'تجويد نظري', status: 'present' as const, time: '04:30 م', weekIndex: 1 },
    { date: '2025-02-13', day: 'الخميس', subject: 'تحضير مسبق', status: 'excused' as const, note: 'مناسبة أسرية مصرح بها', time: '04:30 م', weekIndex: 1 },

    // Week 2: الأسبوع الأسبق (1 - 6 فبراير 2025)
    { date: '2025-02-01', day: 'السبت', subject: 'حفظ وتجويد', status: 'present' as const, time: '04:30 م', weekIndex: 2 },
    { date: '2025-02-02', day: 'الأحد', subject: 'المراجعة التراكمية', status: 'present' as const, time: '04:30 م', weekIndex: 2 },
    { date: '2025-02-03', day: 'الإثنين', subject: 'تفسير وتدبر', status: 'present' as const, time: '04:30 م', weekIndex: 2 },
    { date: '2025-02-04', day: 'الثلاثاء', subject: 'حفظ وتجويد', status: 'present' as const, time: '04:30 م', weekIndex: 2 },
    { date: '2025-02-05', day: 'الأربعاء', subject: 'الرسم والضبط', status: 'present' as const, time: '04:30 م', weekIndex: 2 },
    { date: '2025-02-06', day: 'الخميس', subject: 'تجويد نظري', status: 'present' as const, time: '04:30 م', weekIndex: 2 },
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
export const mockAssessmentsMap: Record<string, Assessment[]> = {
  'student-001': [
    {
      id: 'asm-101',
      studentId: 'student-001',
      titleAr: 'اختبار نهاية الوحدة: سورة قريش والفيل',
      subjectAr: 'الحفظ المتقن',
      level: 4,
      score: 92,
      totalScore: 100,
      date: '2025-02-15',
      typeAr: 'اختبار شفوي مباشر',
      gradeLetterAr: 'ممتاز',
      teacherComments: 'حفظ متماسك وأداء رائع في مخارج الحروف.',
    },
    {
      id: 'asm-102',
      studentId: 'student-001',
      titleAr: 'التقييم الشهري لأحكام التجويد',
      subjectAr: 'التجويد التطبيقي',
      level: 4,
      score: 88,
      totalScore: 100,
      date: '2025-02-05',
      typeAr: 'اختبار عملي وتحليلي',
      gradeLetterAr: 'جيد جداً مرتفع',
      teacherComments: 'إتقان جيد للميم الساكنة مع الحاجة لمزيد من الضبط في الغنن.',
    },
    {
      id: 'asm-103',
      studentId: 'student-001',
      titleAr: 'اختبار ختام المستوى الثالث (السابق)',
      subjectAr: 'الاختبار الأكاديمي الشامل',
      level: 3,
      score: 96,
      totalScore: 100,
      date: '2024-11-20',
      typeAr: 'اختبار شامل معتمد',
      gradeLetterAr: 'ممتاز مع مرتبة الشرف',
      teacherComments: 'اجتاز المستوى الثالث بجدارة واستحقاق شهادة التميز.',
    },
  ],
  'student-002': [
    {
      id: 'asm-201',
      studentId: 'student-002',
      titleAr: 'اختبار حفظ سورة الذاريات والطور',
      subjectAr: 'الحفظ التراكمي',
      level: 7,
      score: 97,
      totalScore: 100,
      date: '2025-02-10',
      typeAr: 'اختبار سرد كامل',
      gradeLetterAr: 'ممتاز مرتفع',
      teacherComments: 'ما شاء الله، إتقان تام واستحضار سريع للآيات.',
    },
    {
      id: 'asm-202',
      studentId: 'student-002',
      titleAr: 'تقييم مهارات الوقف والابتداء',
      subjectAr: 'علوم القرآن',
      level: 7,
      score: 94,
      totalScore: 100,
      date: '2025-01-25',
      typeAr: 'تطبيق عملي',
      gradeLetterAr: 'ممتاز',
      teacherComments: 'فهم عميق لعلامات الوقف التام والكافي.',
    },
  ],
  'student-003': [
    {
      id: 'asm-301',
      studentId: 'student-003',
      titleAr: 'اختبار قصار السور (الفلق والناس والإخلاص)',
      subjectAr: 'التأسيس القرآني',
      level: 2,
      score: 86,
      totalScore: 100,
      date: '2025-02-12',
      typeAr: 'تسميع شفوي',
      gradeLetterAr: 'جيد جداً',
      teacherComments: 'تقدم ملحوظ وشجاعة في الإلقاء والتلاوة.',
    },
  ],
};

// ---------- Teacher Feedback Messages ----------
export const mockTeacherFeedbackMap: Record<string, TeacherFeedback[]> = {
  'student-001': [
    {
      id: 'fb-101',
      studentId: 'student-001',
      teacherNameAr: 'الشيخ عبد الرحمن السبيعي',
      teacherRoleAr: 'معلم مسار الحفظ والتجويد',
      messageAr:
        'السلام عليكم ورحمة الله، يوسف ما شاء الله طالب مجتهد وذكي جداً. أظهر اليوم تفاعلاً رائعاً في حلقة التجويد، وأرجو منكم حثه على تكرار سورة قريش في المنزل لتثبيت حكم الإخفاء الشفوي قبل جلسة التسميع القادمة.',
      date: '2025-02-20T17:45:00',
      subjectAr: 'حفظ القرآن الكريم',
      isRead: false,
      hasAudio: true,
      audioDurationSeconds: 42,
      badgeAr: 'طالب متميز هذا الأسبوع',
    },
    {
      id: 'fb-102',
      studentId: 'student-001',
      teacherNameAr: 'الأستاذ عبد العزيز الغامدي',
      teacherRoleAr: 'مشرف المراجعة التراكمية',
      messageAr:
        'تم اليوم اختبار يوسف في مراجعة الأرباع الخمسة الأولى، وكان سرده ممتازاً وخالياً من التردد. استمروا في دعمه وتشجيعه.',
      date: '2025-02-14T18:10:00',
      subjectAr: 'المراجعة التراكمية',
      isRead: true,
      badgeAr: 'سرد متقن بدون تردد',
    },
    {
      id: 'fb-103',
      studentId: 'student-001',
      teacherNameAr: 'الشيخ عبد الرحمن السبيعي',
      teacherRoleAr: 'معلم مسار الحفظ والتجويد',
      messageAr:
        'مبارك إنهاء تسميع سورة الفيل بدرجة كاملة. يوسف أصبح أكثر ثقة في تطبيق أحكام المدود، نفع الله به وبكم.',
      date: '2025-02-08T16:30:00',
      subjectAr: 'حفظ القرآن الكريم',
      isRead: true,
      hasAudio: true,
      audioDurationSeconds: 28,
    },
  ],
  'student-002': [
    {
      id: 'fb-201',
      studentId: 'student-002',
      teacherNameAr: 'الأستاذة نورة الدوسري',
      teacherRoleAr: 'معلمة القراءات والتجويد',
      messageAr:
        'مريم نموذج رائع للطالبة المثابرة والملتزمة. صوتها عذب وأحكامها منضبطة بالسليقة. أتمت اليوم مقرر الأسبوع بنجاح باهر.',
      date: '2025-02-19T18:00:00',
      subjectAr: 'التجويد والقراءات',
      isRead: false,
      badgeAr: 'وسام الإتقان والترتيل',
    },
  ],
  'student-003': [
    {
      id: 'fb-301',
      studentId: 'student-003',
      teacherNameAr: 'الأستاذة سارة المنصور',
      teacherRoleAr: 'معلمة مرحلة التأسيس',
      messageAr:
        'عمر البطل شارك اليوم بحماس كبير وردد الحروف بالحركات بطريقة صحيحة ومبهجة، تم منحه نجمة التميز الصفية.',
      date: '2025-02-20T15:30:00',
      subjectAr: 'القاعدة النورانية',
      isRead: false,
      badgeAr: 'نجم الحلقة اليوم',
    },
  ],
};

// ---------- Fees & Financials Data ----------
export const mockFees: Fee[] = [
  {
    id: 'fee-001',
    studentId: 'student-001',
    descriptionAr: 'رسوم الدورة الحالية: مسار الحفظ والتجويد المكثف (المستوى 3)',
    courseNameAr: 'مسار الحفظ والتجويد المكثف (المستوى الثالث)',
    isCurrentCourse: true,
    categoryAr: 'دورة نشطة حالياً • الفصل الدراسي الثاني 2025',
    amount: 1850,
    currency: 'د.ج',
    status: 'pending',
    dueDate: '2025-03-01',
    invoiceNumber: 'INV-2025-0482',
  },
  {
    id: 'fee-002',
    studentId: 'student-001',
    descriptionAr: 'باقة المناهج والمصاحف التعليمية المقررة',
    courseNameAr: 'الحقيبة التعليمية والكتب',
    isCurrentCourse: false,
    categoryAr: 'كتب ومناهج دراسية معتمدة',
    amount: 250,
    currency: 'د.ج',
    status: 'paid',
    dueDate: '2025-01-15',
    paidDate: '2025-01-12',
    invoiceNumber: 'INV-2025-0112',
  },
  {
    id: 'fee-003',
    studentId: 'student-002',
    descriptionAr: 'رسوم الدورة الحالية: دورة القراءات وإجازة المتون',
    courseNameAr: 'دورة القراءات المتقدمة وإجازة المتون',
    isCurrentCourse: true,
    categoryAr: 'دورة نشطة حالياً • الفصل الدراسي الثاني 2025',
    amount: 1400,
    currency: 'د.ج',
    status: 'pending',
    dueDate: '2025-03-05',
    invoiceNumber: 'INV-2025-0519',
  },
  {
    id: 'fee-004',
    studentId: 'student-001',
    descriptionAr: 'رسوم دورة التجويد النظري والضبط (المستوى 2)',
    courseNameAr: 'دورة التجويد النظري والضبط (المستوى الثاني)',
    isCurrentCourse: false,
    categoryAr: 'دورة سابقة مكتملة • الفصل الدراسي الأول 2024',
    amount: 1850,
    currency: 'د.ج',
    status: 'paid',
    dueDate: '2024-09-01',
    paidDate: '2024-08-28',
    invoiceNumber: 'INV-2024-0903',
  },
  {
    id: 'fee-005',
    studentId: 'student-003',
    descriptionAr: 'رسوم الدورة الحالية: حقيبة التأسيس والقاعدة النورانية',
    courseNameAr: 'حقيبة التأسيس والقاعدة النورانية',
    isCurrentCourse: true,
    categoryAr: 'دورة نشطة حالياً • الفصل الدراسي الثاني 2025',
    amount: 200,
    currency: 'د.ج',
    status: 'paid',
    dueDate: '2024-09-10',
    paidDate: '2024-09-05',
    invoiceNumber: 'INV-2024-0940',
  },
];

export const mockPayments: PaymentRecord[] = [
  {
    id: 'pay-001',
    studentId: 'student-001',
    descriptionAr: 'سداد باقة الكتب التجويدية والمصاحف',
    amount: 250,
    currency: 'د.ج',
    date: '2025-01-12',
    receiptNumber: 'REC-2025-7821',
    methodAr: 'وصل استلام نقدي',
    status: 'successful',
  },
  {
    id: 'pay-002',
    studentId: 'student-001',
    descriptionAr: 'سداد رسوم الفصل الدراسي الأول',
    amount: 1850,
    currency: 'د.ج',
    date: '2024-08-28',
    receiptNumber: 'REC-2024-4190',
    methodAr: 'تحويل بريدي / CCP',
    status: 'successful',
  },
  {
    id: 'pay-003',
    studentId: 'student-003',
    descriptionAr: 'سداد حقيبة التأسيس والقاعدة النورانية',
    amount: 200,
    currency: 'د.ج',
    date: '2024-09-05',
    receiptNumber: 'REC-2024-4501',
    methodAr: 'نقداً في الإدارة',
    status: 'successful',
  },
];

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
export const mockNotifications: Notification[] = [
  {
    id: 'notif-001',
    studentId: 'student-001',
    type: 'homework',
    titleAr: 'تنبيه مراجعة واجب منزلي',
    messageAr: 'الواجب المنزلي بحاجة إلى مراجعة',
    date: '2025-02-20T17:45:00',
    isRead: false,
    routeTo: 'performance',
    actionPayload: { tab: 'homework', itemId: 'hw-101' },
  },
  {
    id: 'notif-002',
    studentId: 'student-001',
    type: 'payment',
    titleAr: 'تنبيه استحقاق الرسوم الدراسية',
    messageAr: 'اقترب موعد انتهاء الدورة',
    date: '2025-02-19T10:00:00',
    isRead: false,
    routeTo: 'financials',
  },
  {
    id: 'notif-003',
    studentId: 'student-001',
    type: 'feedback',
    titleAr: 'ملاحظة وتوجيه جديد من المعلم',
    messageAr: 'أضاف الشيخ عبد الرحمن السبيعي تقييماً صوتياً وملاحظة جديدة',
    date: '2025-02-18T16:20:00',
    isRead: true,
    routeTo: 'performance',
    actionPayload: { tab: 'feedback' },
  },
  {
    id: 'notif-004',
    studentId: 'student-001',
    type: 'attendance',
    titleAr: 'تأكيد تسجيل الحضور اليومي',
    messageAr: 'تم تسجيل حضور يوسف بنجاح في حلقة اليوم (04:30 م)',
    date: '2025-02-17T16:35:00',
    isRead: true,
    routeTo: 'performance',
    actionPayload: { tab: 'attendance' },
  },
];

// ---------- Notification Settings Default ----------
export const mockNotificationSettings: NotificationSettings = {
  homework: true,
  payments: true,
  attendance: true,
  feedback: true,
  courseExpiry: true,
};
