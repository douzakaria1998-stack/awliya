export type Language = 'ar' | 'en' | 'fr';

export interface Translations {
  // Brand & Header
  brandTitle: string;
  brandSubtitle: string;
  notifications: string;
  toggleTheme: string;
  registeredStudents: string;
  addStudent: string;
  level: string;
  logout: string;

  // Nav items
  navDashboard: string;
  navAcademic: string;
  navPerformance: string;
  navFinancials: string;
  navProfile: string;

  // Dashboard
  greeting: string;
  parentOf: string;
  sonProgress: string;
  levelOfTen: string;
  recentNotifications: string;
  homeworkNeedsRevision: string;
  homeworkNeedsRevisionDesc: string;
  twoHoursAgo: string;
  courseEndingSoon: string;
  courseEndingSoonDesc: string;
  yesterday: string;
  latestTeacherNote: string;
  teacherDefaultNote: string;
  quranSubject: string;

  // Academic Path
  tenLevelsRoadmap: string;
  academicPathTitle: string;
  currentLevelBadge: string;
  studentTrack: string;
  levelsCompleted: string;
  levelMilestone1: string;
  levelMilestoneCurrent: string;
  levelMilestone10: string;
  statusStudied: string;
  statusCurrent: string;
  statusLocked: string;
  stage: string;
  grade: string;
  currentProgressRate: string;
  viewCurriculumDetails: string;

  // Level Details Modal
  modalStudiedSuccess: string;
  modalCurrentLevel: string;
  modalLockedLevel: string;
  finalPassingScore: string;
  honorsDegree: string;
  completionDate: string;
  academicallyCertified: string;
  syllabusTopics: string;
  certifiedUnits: string;
  lessons: string;
  downloadCertificate: string;
  certificateReady: string;
  unlockRequirement: string;

  // Performance Screen
  performanceTitle: string;
  tabHomework: string;
  tabAttendance: string;
  tabAssessments: string;
  tabTeacherFeedback: string;
  submitted: string;
  graded: string;
  pending: string;
  attendanceRate: string;
  present: string;
  absent: string;
  late: string;

  // Financials Screen
  financialsTitle: string;
  balanceDue: string;
  payNow: string;
  invoices: string;
  paid: string;
  unpaid: string;
  downloadReceipt: string;
  receiptNumber: string;

  // Profile Screen
  profileTitle: string;
  personalInfo: string;
  phoneNumber: string;
  emailAddress: string;
  registeredChildren: string;
  appSettings: string;
  languageSelect: string;
  darkTheme: string;
}

export const translations: Record<Language, Translations> = {
  ar: {
    brandTitle: 'بوابة ولي الأمر',
    brandSubtitle: 'Parent Portal',
    notifications: 'التنبيهات',
    toggleTheme: 'تبديل المظهر',
    registeredStudents: 'الأبناء المسجلون',
    addStudent: '+ إضافة',
    level: 'المستوى',
    logout: 'تسجيل الخروج',

    navDashboard: 'الرئيسية',
    navAcademic: 'المسار',
    navPerformance: 'الأداء',
    navFinancials: 'المالية',
    navProfile: 'الملف',

    greeting: 'مرحباً',
    parentOf: 'والد ابنك',
    sonProgress: 'تقدم ابنك',
    levelOfTen: 'من عشرة',
    recentNotifications: 'أحدث الإشعارات',
    homeworkNeedsRevision: 'الواجب المنزلي بحاجة إلى مراجعة',
    homeworkNeedsRevisionDesc: 'واجب مادة القرآن الكريم بانتظار مراجعتك وتوقيعك',
    twoHoursAgo: 'منذ ساعتين',
    courseEndingSoon: 'اقترب موعد انتهاء الدورة',
    courseEndingSoonDesc: 'تبقى 15 يوماً على موعد تجديد الاشتراك في الدورة الحالية',
    yesterday: 'أمس',
    latestTeacherNote: 'آخر ملاحظات المعلم',
    teacherDefaultNote: 'السلام عليكم ورحمة الله، الطالب ما شاء الله مجتهد وذكي جداً. أظهر اليوم تفاعلاً رائعاً في حلقة التجويد، ونرجو منكم حثه على التكرار اليومي في المنزل لتثبيت أحكام التجويد.',
    quranSubject: 'حفظ القرآن الكريم وتجويده',

    tenLevelsRoadmap: 'خارطة المستويات العشرة',
    academicPathTitle: 'المسار الأكاديمي الشامل',
    currentLevelBadge: 'المستوى الحالي',
    studentTrack: 'مسار الطالب',
    levelsCompleted: 'مستويات مكتملة',
    levelMilestone1: 'المستوى 1 (التأسيس)',
    levelMilestoneCurrent: 'المستوى الحالي',
    levelMilestone10: 'المستوى 10 (الإجازة بالسند)',
    statusStudied: 'تمت دراسته',
    statusCurrent: 'المستوى الحالي',
    statusLocked: 'لم يدرس بعد',
    stage: 'المرحلة',
    grade: 'درجة',
    currentProgressRate: 'نسبة الإنجاز الحالية:',
    viewCurriculumDetails: 'عرض تفاصيل المنهج والوحدات',

    modalStudiedSuccess: 'تمت دراسته بنجاح',
    modalCurrentLevel: 'المستوى الحالي',
    modalLockedLevel: 'لم يدرس بعد',
    finalPassingScore: 'درجة الاجتياز النهائية',
    honorsDegree: 'تقدير: ممتاز مرتفع (مع مرتبة الشرف)',
    completionDate: 'تاريخ الإتمام والاعتماد',
    academicallyCertified: 'معتمد أكاديمياً من إدارة المقرأة',
    syllabusTopics: 'مفردات ومقررات المستوى',
    certifiedUnits: 'الوحدات الدراسية المعتمدة',
    lessons: 'حصص',
    downloadCertificate: 'تحميل شهادة إتمام المستوى المعتمدة (PDF)',
    certificateReady: 'تم تجهيز الشهادة وتنزيلها بنجاح!',
    unlockRequirement: '🔒 يفتح هذا المستوى تلقائياً فور اجتياز المستوى السابق بنجاح.',

    performanceTitle: 'المتابعة الأكاديمية والأداء',
    tabHomework: 'الواجبات',
    tabAttendance: 'الحضور والغياب',
    tabAssessments: 'التقييمات والاختبارات',
    tabTeacherFeedback: 'ملاحظات المعلمين',
    submitted: 'تم التسليم',
    graded: 'تم التصحيح',
    pending: 'قيد الانتظار',
    attendanceRate: 'نسبة الحضور العام',
    present: 'حاضر',
    absent: 'غائب',
    late: 'متأخر',

    financialsTitle: 'الرسوم والاشتراكات المالية',
    balanceDue: 'المبلغ المستحق',
    payNow: 'سداد الآن',
    invoices: 'سجل الفواتير والدفعات',
    paid: 'مدفوع',
    unpaid: 'غير مدفوع',
    downloadReceipt: 'تحميل إيصال القبض',
    receiptNumber: 'رقم الإيصال',

    profileTitle: 'الملف الشخصي والإعدادات',
    personalInfo: 'المعلومات الشخصية لولي الأمر',
    phoneNumber: 'رقم الهاتف',
    emailAddress: 'البريد الإلكتروني',
    registeredChildren: 'الأبناء المسجلون',
    appSettings: 'إعدادات المنصة والمظهر',
    languageSelect: 'لغة الواجهة',
    darkTheme: 'المظهر الداكن (الوضع الليلي)',
  },

  en: {
    brandTitle: 'Parent Portal',
    brandSubtitle: 'Awliya Platform',
    notifications: 'Notifications',
    toggleTheme: 'Toggle Theme',
    registeredStudents: 'Registered Children',
    addStudent: '+ Add Child',
    level: 'Level',
    logout: 'Sign Out',

    navDashboard: 'Dashboard',
    navAcademic: 'Academic Path',
    navPerformance: 'Performance',
    navFinancials: 'Financials',
    navProfile: 'Profile',

    greeting: 'Welcome',
    parentOf: 'Father of',
    sonProgress: "Child's Progress",
    levelOfTen: 'out of 10 levels',
    recentNotifications: 'Recent Notifications',
    homeworkNeedsRevision: 'Homework Needs Revision',
    homeworkNeedsRevisionDesc: 'Quran homework is awaiting your review and confirmation',
    twoHoursAgo: '2 hours ago',
    courseEndingSoon: 'Course Ending Soon',
    courseEndingSoonDesc: '15 days remaining for current subscription renewal',
    yesterday: 'Yesterday',
    latestTeacherNote: 'Latest Teacher Feedback',
    teacherDefaultNote: 'Peace be upon you. The student is very diligent and highly attentive. Today they showed wonderful interaction in the Tajweed circle. Please encourage daily repetition at home.',
    quranSubject: 'Holy Quran & Tajweed Studies',

    tenLevelsRoadmap: '10-Level Roadmap',
    academicPathTitle: 'Comprehensive Academic Path',
    currentLevelBadge: 'Current Level',
    studentTrack: 'Student Track',
    levelsCompleted: 'levels completed',
    levelMilestone1: 'Level 1 (Foundation)',
    levelMilestoneCurrent: 'Current Level',
    levelMilestone10: 'Level 10 (Sanad Certification)',
    statusStudied: 'Completed',
    statusCurrent: 'Current Level',
    statusLocked: 'Locked',
    stage: 'Stage',
    grade: 'Score',
    currentProgressRate: 'Current Progress Rate:',
    viewCurriculumDetails: 'View Curriculum & Unit Details',

    modalStudiedSuccess: 'Completed Successfully',
    modalCurrentLevel: 'Current Active Level',
    modalLockedLevel: 'Not Yet Unlocked',
    finalPassingScore: 'Final Passing Score',
    honorsDegree: 'Grade: High Distinction (With Honors)',
    completionDate: 'Accreditation Date',
    academicallyCertified: 'Certified by Academy Board',
    syllabusTopics: 'Level Syllabus Topics',
    certifiedUnits: 'Certified Learning Units',
    lessons: 'lessons',
    downloadCertificate: 'Download Official Certificate (PDF)',
    certificateReady: 'Certificate generated and ready for download!',
    unlockRequirement: '🔒 This level unlocks automatically upon passing previous level exams.',

    performanceTitle: 'Academic Performance & Tracking',
    tabHomework: 'Homework',
    tabAttendance: 'Attendance',
    tabAssessments: 'Assessments',
    tabTeacherFeedback: 'Teacher Feedback',
    submitted: 'Submitted',
    graded: 'Graded',
    pending: 'Pending',
    attendanceRate: 'Overall Attendance Rate',
    present: 'Present',
    absent: 'Absent',
    late: 'Late',

    financialsTitle: 'Tuition Fees & Payments',
    balanceDue: 'Balance Due',
    payNow: 'Pay Now',
    invoices: 'Invoice & Payment History',
    paid: 'Paid',
    unpaid: 'Unpaid',
    downloadReceipt: 'Download Receipt',
    receiptNumber: 'Receipt #',

    profileTitle: 'Profile & Settings',
    personalInfo: 'Parent Personal Information',
    phoneNumber: 'Phone Number',
    emailAddress: 'Email Address',
    registeredChildren: 'Registered Children',
    appSettings: 'Platform Preferences',
    languageSelect: 'Interface Language',
    darkTheme: 'Dark Theme Mode',
  },

  fr: {
    brandTitle: 'Portail Parents',
    brandSubtitle: 'Plateforme Awliya',
    notifications: 'Notifications',
    toggleTheme: 'Changer de Thème',
    registeredStudents: 'Enfants Inscrits',
    addStudent: '+ Ajouter un enfant',
    level: 'Niveau',
    logout: 'Se Déconnecter',

    navDashboard: 'Tableau de bord',
    navAcademic: 'Parcours',
    navPerformance: 'Performance',
    navFinancials: 'Finances',
    navProfile: 'Profil',

    greeting: 'Bienvenue',
    parentOf: "Parent de",
    sonProgress: "Progression de l'enfant",
    levelOfTen: 'sur 10 niveaux',
    recentNotifications: 'Dernières Notifications',
    homeworkNeedsRevision: 'Devoir à réviser',
    homeworkNeedsRevisionDesc: 'Le devoir de Coran est en attente de votre validation',
    twoHoursAgo: 'Il y a 2 heures',
    courseEndingSoon: 'Fin de session proche',
    courseEndingSoonDesc: 'Il reste 15 jours avant le renouvellement de la session',
    yesterday: 'Hier',
    latestTeacherNote: "Dernière remarque de l'enseignant",
    teacherDefaultNote: "Que la paix soit sur vous. L'élève fait preuve d'une grande assiduité et d'une excellente concentration en Tajweed. Merci d'encourager la révision quotidienne à la maison.",
    quranSubject: 'Apprentissage du Coran & Tajweed',

    tenLevelsRoadmap: 'Parcours des 10 Niveaux',
    academicPathTitle: 'Parcours Académique Global',
    currentLevelBadge: 'Niveau Actuel',
    studentTrack: "Filière de l'élève",
    levelsCompleted: 'niveaux complétés',
    levelMilestone1: 'Niveau 1 (Fondation)',
    levelMilestoneCurrent: 'Niveau Actuel',
    levelMilestone10: 'Niveau 10 (Sanad & Ijaza)',
    statusStudied: 'Validé',
    statusCurrent: 'Niveau Actuel',
    statusLocked: 'Verrouillé',
    stage: 'Étape',
    grade: 'Note',
    currentProgressRate: 'Taux de progression actuel :',
    viewCurriculumDetails: 'Voir le programme et les modules',

    modalStudiedSuccess: 'Validé avec succès',
    modalCurrentLevel: 'Niveau Actuel en cours',
    modalLockedLevel: 'Pas encore débloqué',
    finalPassingScore: "Note finale d'examen",
    honorsDegree: 'Mention : Très Bien (Avec Félicitations)',
    completionDate: "Date d'obtention",
    academicallyCertified: "Certifié par la direction pédagogique",
    syllabusTopics: 'Programme et sourates étudiées',
    certifiedUnits: 'Unités pédagogiques certifiées',
    lessons: 'séances',
    downloadCertificate: 'Télécharger le Certificat Officiel (PDF)',
    certificateReady: 'Certificat généré avec succès !',
    unlockRequirement: '🔒 Ce niveau sera débloqué automatiquement après validation du niveau précédent.',

    performanceTitle: 'Suivi et Performance Scolaire',
    tabHomework: 'Devoirs',
    tabAttendance: 'Présences',
    tabAssessments: 'Évaluations',
    tabTeacherFeedback: 'Remarques Enseignants',
    submitted: 'Rendu',
    graded: 'Corrigé',
    pending: 'En attente',
    attendanceRate: 'Taux de présence global',
    present: 'Présent',
    absent: 'Absent',
    late: 'En retard',

    financialsTitle: 'Frais de Scolarité & Paiements',
    balanceDue: 'Montant Dû',
    payNow: 'Régler maintenant',
    invoices: 'Historique des factures',
    paid: 'Payé',
    unpaid: 'Impayé',
    downloadReceipt: 'Télécharger le reçu',
    receiptNumber: 'Reçu N°',

    profileTitle: 'Profil & Paramètres',
    personalInfo: 'Informations du Parent',
    phoneNumber: 'Numéro de téléphone',
    emailAddress: 'Adresse Email',
    registeredChildren: 'Enfants Inscrits',
    appSettings: 'Préférences de la Plateforme',
    languageSelect: 'Langue de la plateforme',
    darkTheme: 'Mode Sombre',
  },
};
