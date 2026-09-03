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
  switchAccount: string;
  currentStudent: string;
  studentRole: string;
  studentRoleFemale: string;
  viewAllNotifs: string;
  markAllRead: string;
  noNotifications: string;
  unreadCountBadge: string;
  adminPortalLink: string;

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
  daughterProgress: string;
  levelOfTen: string;
  currentProgress: string;
  viewAcademicPath: string;
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
  viewFullEvaluation: string;
  clickToReviewHw: string;
  clickToReadFeedback: string;
  viewAllHomework: string;
  viewAllFeedback: string;
  studentQuickOverview: string;
  enrolledTrack: string;
  branchLocation: string;
  weeklySchedule: string;

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
  totalLevelsCount: string;
  activeLevelBadge: string;

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
  close: string;

  // Performance Screen
  performanceTitle: string;
  performanceSubtitle: string;
  tabHomework: string;
  tabAttendance: string;
  tabAssessments: string;
  tabTeacherFeedback: string;
  filterAll: string;
  needsRevision: string;
  completed: string;
  pending: string;
  notStarted: string;
  dueDateLabel: string;
  submittedDateLabel: string;
  scoreLabel: string;
  teacherNoteLabel: string;
  clickToViewHwDetails: string;
  overallAttendanceRate: string;
  allSessions: string;
  present: string;
  absent: string;
  late: string;
  excused: string;
  currentWeek: string;
  lastWeek: string;
  previousWeek: string;
  sessionNumber: string;
  teacherLabel: string;
  sessionType: string;
  listeningAudioNote: string;
  voiceNoteDuration: string;
  periodicAssessments: string;
  midtermExam: string;
  finalExam: string;
  generalGPA: string;
  highDistinction: string;
  veryGood: string;
  good: string;
  satisfactory: string;
  noHomeworkFound: string;
  noAttendanceFound: string;
  noAssessmentsFound: string;
  noFeedbackFound: string;
  viewAudioVoiceNote: string;

  // Financials Screen
  financialsTitle: string;
  balanceDue: string;
  payNow: string;
  invoices: string;
  paid: string;
  unpaid: string;
  downloadReceipt: string;
  receiptNumber: string;
  dueDate: string;
  paymentMethod: string;
  transactionsHistory: string;

  // Profile Screen
  profileTitle: string;
  personalInfo: string;
  phoneNumber: string;
  emailAddress: string;
  nationalId: string;
  registeredChildren: string;
  appSettings: string;
  languageSelect: string;
  darkTheme: string;
  lightTheme: string;
  notificationsSound: string;
  activeAccount: string;
}

export const translations: Record<Language, Translations> = {
  ar: {
    brandTitle: 'بوابة ولي الأمر',
    brandSubtitle: 'My School Portal',
    notifications: 'التنبيهات',
    toggleTheme: 'تبديل المظهر',
    registeredStudents: 'الأبناء المسجلون',
    addStudent: '+ إضافة',
    level: 'المستوى',
    logout: 'تسجيل الخروج',
    switchAccount: 'تبديل الحساب',
    currentStudent: 'الطالب الحالي',
    studentRole: 'الطالب',
    studentRoleFemale: 'الطالبة',
    viewAllNotifs: 'عرض كل الإشعارات',
    markAllRead: 'تحديد الكل كمقروء',
    noNotifications: 'لا توجد إشعارات جديدة حالياً',
    unreadCountBadge: 'غير مقروءة',
    adminPortalLink: 'لوحة التحكم الإدارية',

    navDashboard: 'الرئيسية',
    navAcademic: 'المسار',
    navPerformance: 'الأداء',
    navFinancials: 'المالية',
    navProfile: 'الملف',

    greeting: 'مرحباً',
    parentOf: 'ولي أمر',
    sonProgress: 'تقدم الطالب',
    daughterProgress: 'تقدم الطالبة',
    levelOfTen: 'من 10 مستويات',
    currentProgress: 'نسبة الإنجاز',
    viewAcademicPath: 'عرض المسار الأكاديمي',
    recentNotifications: 'أحدث الإشعارات',
    homeworkNeedsRevision: 'الواجب المنزلي بحاجة إلى مراجعة',
    homeworkNeedsRevisionDesc: 'واجب اللغات (الإنجليزية / الفرنسية) بانتظار مراجعتك واعتمادك',
    twoHoursAgo: 'منذ ساعتين',
    courseEndingSoon: 'اقترب موعد انتهاء الدورة',
    courseEndingSoonDesc: 'تبقى 15 يوماً على موعد تجديد الاشتراك في الدورة الحالية',
    yesterday: 'أمس',
    latestTeacherNote: 'آخر ملاحظات المعلم',
    teacherDefaultNote: 'السلام عليكم ورحمة الله، يوسف ما شاء الله طالب مجتهد وذكي جداً. أظهر اليوم تفاعلاً رائعاً في ورشة المحادثة والنطق بالإنجليزية، ونرجو منكم حثه على الاستماع والتكرار اليومي في المنزل لترسيخ المفردات والطلاقة اللغوية.',
    quranSubject: 'اللغة الإنجليزية واللغة الفرنسية',
    viewFullEvaluation: 'عرض التقييم الشامل',
    clickToReviewHw: 'اضغط لمراجعة الواجب',
    clickToReadFeedback: 'استمع للتوجيه الصوتي',
    viewAllHomework: 'عرض جميع الواجبات',
    viewAllFeedback: 'عرض جميع الملاحظات',
    studentQuickOverview: 'نظرة عامة على بيانات الطالب',
    enrolledTrack: 'المسار المقيد به',
    branchLocation: 'الفرع والمقر',
    weeklySchedule: 'أيام ومواعيد الحصص',

    tenLevelsRoadmap: 'خارطة المستويات العشرة',
    academicPathTitle: 'المسار الأكاديمي الشامل',
    currentLevelBadge: 'المستوى الحالي',
    studentTrack: 'مسار الطالب',
    levelsCompleted: 'مستويات مكتملة',
    levelMilestone1: 'المستوى 1 (التأسيس A1.1)',
    levelMilestoneCurrent: 'المستوى الحالي',
    levelMilestone10: 'المستوى 10 (الطلاقة التامة C2)',
    statusStudied: 'تمت دراسته',
    statusCurrent: 'المستوى الحالي',
    statusLocked: 'لم يدرس بعد',
    stage: 'المرحلة',
    grade: 'درجة',
    currentProgressRate: 'نسبة الإنجاز الحالية:',
    viewCurriculumDetails: 'عرض تفاصيل المنهج والوحدات',
    totalLevelsCount: '10 مستويات أكاديمية معتمدة',
    activeLevelBadge: 'المستوى النشط',

    modalStudiedSuccess: 'تمت دراسته بنجاح',
    modalCurrentLevel: 'المستوى الحالي',
    modalLockedLevel: 'لم يدرس بعد',
    finalPassingScore: 'درجة الاجتياز النهائية',
    honorsDegree: 'تقدير: ممتاز مرتفع (مع مرتبة الشرف)',
    completionDate: 'تاريخ الإتمام والاعتماد',
    academicallyCertified: 'معتمد أكاديمياً من إدارة My School',
    syllabusTopics: 'مفردات ومقررات المستوى',
    certifiedUnits: 'الوحدات الدراسية المعتمدة',
    lessons: 'حصص',
    downloadCertificate: 'تحميل شهادة إتمام المستوى المعتمدة (PDF)',
    certificateReady: 'تم تجهيز الشهادة وتنزيلها بنجاح!',
    unlockRequirement: '🔒 يفتح هذا المستوى تلقائياً فور اجتياز المستوى السابق بنجاح.',
    close: 'إغلاق',

    performanceTitle: 'الأداء والتقييمات الأكاديمية',
    performanceSubtitle: 'متابعة دقيقة ومستمرة لتقدم الطالب',
    tabHomework: 'الواجبات',
    tabAttendance: 'الحضور',
    tabAssessments: 'التقييمات',
    tabTeacherFeedback: 'ملاحظات المعلم',
    filterAll: 'الكل',
    needsRevision: 'بحاجة إلى مراجعة',
    completed: 'المكتملة',
    pending: 'قيد الانتظار',
    notStarted: 'لم يبدأ بعد',
    dueDateLabel: 'موعد التسليم:',
    submittedDateLabel: 'تاريخ التسليم:',
    scoreLabel: 'الدرجة:',
    teacherNoteLabel: 'ملاحظة المعلم:',
    clickToViewHwDetails: 'اضغط لعرض تفاصيل الواجب والتسجيل الصوتي',
    overallAttendanceRate: 'نسبة الحضور العام',
    allSessions: 'جميع الحصص',
    present: 'حاضر',
    absent: 'غائب',
    late: 'متأخر',
    excused: 'معذور',
    currentWeek: 'الأسبوع الحالي',
    lastWeek: 'الأسبوع الماضي',
    previousWeek: 'الأسبوع الأسبق',
    sessionNumber: 'حصة رقم',
    teacherLabel: 'المعلم:',
    sessionType: 'نوع الحصة:',
    listeningAudioNote: 'استمع للملاحظة الصوتية من المعلم',
    voiceNoteDuration: 'تسجيل صوتي • 0:45 دقيقة',
    periodicAssessments: 'التقييمات والاختبارات الدورية',
    midtermExam: 'درجة الاختبار النصفي',
    finalExam: 'درجة الاختبار النهائي',
    generalGPA: 'المعدل العام للمستوى',
    highDistinction: 'ممتاز مرتفع (Honors)',
    veryGood: 'جيد جداً',
    good: 'جيد',
    satisfactory: 'مقبول',
    noHomeworkFound: 'لا توجد واجبات في هذا القسم',
    noAttendanceFound: 'لا توجد سجلات حضور لهذا الأسبوع',
    noAssessmentsFound: 'لا توجد اختبارات مسجلة حالياً',
    noFeedbackFound: 'لا توجد ملاحظات مسجلة حالياً',
    viewAudioVoiceNote: 'تشغيل التسجيل الصوتي',

    financialsTitle: 'الرسوم والاشتراكات المالية',
    balanceDue: 'المبلغ المستحق',
    payNow: 'سداد الآن',
    invoices: 'سجل الفواتير والدفعات',
    paid: 'مدفوع',
    unpaid: 'غير مدفوع',
    downloadReceipt: 'تحميل إيصال القبض',
    receiptNumber: 'رقم الإيصال',
    dueDate: 'تاريخ الاستحقاق',
    paymentMethod: 'طريقة الدفع',
    transactionsHistory: 'سجل العمليات المالية',

    profileTitle: 'الملف الشخصي والإعدادات',
    personalInfo: 'المعلومات الشخصية لولي الأمر',
    phoneNumber: 'رقم الهاتف',
    emailAddress: 'البريد الإلكتروني',
    nationalId: 'رقم الهوية / الإقامة',
    registeredChildren: 'الأبناء المسجلون',
    appSettings: 'إعدادات المنصة والمظهر',
    languageSelect: 'لغة الواجهة',
    darkTheme: 'المظهر الداكن (الوضع الليلي)',
    lightTheme: 'المظهر الفاتح',
    notificationsSound: 'نغمات التنبيهات',
    activeAccount: 'حساب نشط',
  },

  en: {
    brandTitle: 'Parent Portal',
    brandSubtitle: 'My School Portal',
    notifications: 'Notifications',
    toggleTheme: 'Toggle Theme',
    registeredStudents: 'Registered Children',
    addStudent: '+ Add Child',
    level: 'Level',
    logout: 'Sign Out',
    switchAccount: 'Switch Account',
    currentStudent: 'Current Student',
    studentRole: 'Student',
    studentRoleFemale: 'Student',
    viewAllNotifs: 'View All Notifications',
    markAllRead: 'Mark All as Read',
    noNotifications: 'No new notifications right now',
    unreadCountBadge: 'Unread',
    adminPortalLink: 'Admin Control Panel',

    navDashboard: 'Dashboard',
    navAcademic: 'Academic Path',
    navPerformance: 'Performance',
    navFinancials: 'Financials',
    navProfile: 'Profile',

    greeting: 'Welcome back',
    parentOf: 'Parent of',
    sonProgress: "Student's Progress",
    daughterProgress: "Student's Progress",
    levelOfTen: 'out of 10 levels',
    currentProgress: 'Current Progress',
    viewAcademicPath: 'View Academic Path',
    recentNotifications: 'Recent Notifications',
    homeworkNeedsRevision: 'Homework Needs Revision',
    homeworkNeedsRevisionDesc: 'Language homework (English/French) is awaiting your review and confirmation',
    twoHoursAgo: '2 hours ago',
    courseEndingSoon: 'Course Ending Soon',
    courseEndingSoonDesc: '15 days remaining for current subscription renewal',
    yesterday: 'Yesterday',
    latestTeacherNote: 'Latest Teacher Feedback',
    teacherDefaultNote: 'Hello! The student is very diligent and highly attentive. Today they showed wonderful interaction in the English conversation and pronunciation workshop. Please encourage daily listening and speaking practice at home.',
    quranSubject: 'English & French Language Studies',
    viewFullEvaluation: 'View Full Evaluation',
    clickToReviewHw: 'Click to review homework',
    clickToReadFeedback: 'Listen to voice guidance',
    viewAllHomework: 'View all homework',
    viewAllFeedback: 'View all feedback',
    studentQuickOverview: 'Student Profile Overview',
    enrolledTrack: 'Enrolled Track',
    branchLocation: 'Campus & Location',
    weeklySchedule: 'Session Schedule',

    tenLevelsRoadmap: '10-Level Curriculum Roadmap',
    academicPathTitle: 'Comprehensive Academic Path',
    currentLevelBadge: 'Current Level',
    studentTrack: 'Student Track',
    levelsCompleted: 'levels completed',
    levelMilestone1: 'Level 1 (Foundations A1.1)',
    levelMilestoneCurrent: 'Current Level',
    levelMilestone10: 'Level 10 (Bilingual Mastery C2)',
    statusStudied: 'Completed',
    statusCurrent: 'Current Level',
    statusLocked: 'Locked',
    stage: 'Stage',
    grade: 'Score',
    currentProgressRate: 'Current Progress Rate:',
    viewCurriculumDetails: 'View Curriculum & Unit Details',
    totalLevelsCount: '10 Accredited Academic Levels',
    activeLevelBadge: 'Active Level',

    modalStudiedSuccess: 'Completed Successfully',
    modalCurrentLevel: 'Current Active Level',
    modalLockedLevel: 'Not Yet Unlocked',
    finalPassingScore: 'Final Passing Score',
    honorsDegree: 'Grade: High Distinction (With Honors)',
    completionDate: 'Accreditation Date',
    academicallyCertified: 'Certified by My School Academic Board',
    syllabusTopics: 'Level Syllabus Topics',
    certifiedUnits: 'Certified Learning Units',
    lessons: 'lessons',
    downloadCertificate: 'Download Official Certificate (PDF)',
    certificateReady: 'Certificate generated and ready for download!',
    unlockRequirement: '🔒 This level unlocks automatically upon passing previous level exams.',
    close: 'Close',

    performanceTitle: 'Academic Performance & Evaluations',
    performanceSubtitle: 'Accurate and continuous monitoring of student progress',
    tabHomework: 'Homework',
    tabAttendance: 'Attendance',
    tabAssessments: 'Assessments',
    tabTeacherFeedback: 'Teacher Feedback',
    filterAll: 'All',
    needsRevision: 'Needs Revision',
    completed: 'Completed',
    pending: 'Pending',
    notStarted: 'Not Started',
    dueDateLabel: 'Due Date:',
    submittedDateLabel: 'Submitted Date:',
    scoreLabel: 'Score:',
    teacherNoteLabel: 'Teacher Note:',
    clickToViewHwDetails: 'Click to view homework details & audio recording',
    overallAttendanceRate: 'Overall Attendance Rate',
    allSessions: 'All Sessions',
    present: 'Present',
    absent: 'Absent',
    late: 'Late',
    excused: 'Excused',
    currentWeek: 'Current Week',
    lastWeek: 'Last Week',
    previousWeek: 'Previous Week',
    sessionNumber: 'Session #',
    teacherLabel: 'Teacher:',
    sessionType: 'Session Type:',
    listeningAudioNote: 'Listen to Teacher Voice Guidance',
    voiceNoteDuration: 'Voice recording • 0:45 min',
    periodicAssessments: 'Periodic Tests & Evaluations',
    midtermExam: 'Midterm Exam Score',
    finalExam: 'Final Exam Score',
    generalGPA: 'Overall Level GPA',
    highDistinction: 'High Distinction (Honors)',
    veryGood: 'Very Good',
    good: 'Good',
    satisfactory: 'Satisfactory',
    noHomeworkFound: 'No homework found in this category',
    noAttendanceFound: 'No attendance records found for this week',
    noAssessmentsFound: 'No assessments recorded yet',
    noFeedbackFound: 'No teacher feedback recorded yet',
    viewAudioVoiceNote: 'Play Voice Recording',

    financialsTitle: 'Tuition Fees & Payments',
    balanceDue: 'Balance Due',
    payNow: 'Pay Now',
    invoices: 'Invoice & Payment History',
    paid: 'Paid',
    unpaid: 'Unpaid',
    downloadReceipt: 'Download Receipt',
    receiptNumber: 'Receipt #',
    dueDate: 'Due Date',
    paymentMethod: 'Payment Method',
    transactionsHistory: 'Financial Transactions',

    profileTitle: 'Profile & Settings',
    personalInfo: 'Parent Personal Information',
    phoneNumber: 'Phone Number',
    emailAddress: 'Email Address',
    nationalId: 'National ID / Iqama',
    registeredChildren: 'Registered Children',
    appSettings: 'Platform Preferences',
    languageSelect: 'Interface Language',
    darkTheme: 'Dark Theme Mode',
    lightTheme: 'Light Theme Mode',
    notificationsSound: 'Notification Sounds',
    activeAccount: 'Active Account',
  },

  fr: {
    brandTitle: 'Portail Parents',
    brandSubtitle: 'My School Portail',
    notifications: 'Notifications',
    toggleTheme: 'Changer de Thème',
    registeredStudents: 'Enfants Inscrits',
    addStudent: '+ Ajouter un enfant',
    level: 'Niveau',
    logout: 'Se Déconnecter',
    switchAccount: 'Changer de Compte',
    currentStudent: 'Élève Actuel',
    studentRole: 'Élève',
    studentRoleFemale: 'Élève',
    viewAllNotifs: 'Voir Toutes les Notifications',
    markAllRead: 'Tout marquer comme lu',
    noNotifications: 'Aucune nouvelle notification pour le moment',
    unreadCountBadge: 'Non lus',
    adminPortalLink: "Panneau d'Administration",

    navDashboard: 'Tableau de bord',
    navAcademic: 'Parcours',
    navPerformance: 'Performance',
    navFinancials: 'Finances',
    navProfile: 'Profil',

    greeting: 'Bienvenue',
    parentOf: "Parent de",
    sonProgress: "Progression de l'élève",
    daughterProgress: "Progression de l'élève",
    levelOfTen: 'sur 10 niveaux',
    currentProgress: 'Taux de Progression',
    viewAcademicPath: 'Voir le Parcours Académique',
    recentNotifications: 'Dernières Notifications',
    homeworkNeedsRevision: 'Devoir à réviser',
    homeworkNeedsRevisionDesc: 'Le devoir de langue (Anglais / Français) est en attente de votre validation',
    twoHoursAgo: 'Il y a 2 heures',
    courseEndingSoon: 'Fin de session proche',
    courseEndingSoonDesc: 'Il reste 15 jours avant le renouvellement de la session',
    yesterday: 'Hier',
    latestTeacherNote: "Dernière remarque de l'enseignant",
    teacherDefaultNote: "Bonjour ! L'élève est très attentif et motivé. Aujourd'hui, il a montré une excellente participation dans l'atelier de conversation et d'expression orale. Nous vous invitons à encourager la pratique quotidienne à la maison.",
    quranSubject: 'Études Linguistiques : Anglais & Français',
    viewFullEvaluation: "Voir l'évaluation complète",
    clickToReviewHw: 'Cliquez pour réviser le devoir',
    clickToReadFeedback: 'Écouter le message vocal',
    viewAllHomework: 'Voir tous les devoirs',
    viewAllFeedback: 'Voir toutes les remarques',
    studentQuickOverview: "Aperçu du Profil de l'Élève",
    enrolledTrack: 'Filière Inscrite',
    branchLocation: 'Campus & Emplacement',
    weeklySchedule: 'Horaires des Séances',

    tenLevelsRoadmap: 'Parcours des 10 Niveaux',
    academicPathTitle: 'Parcours Académique Global',
    currentLevelBadge: 'Niveau Actuel',
    studentTrack: "Filière de l'élève",
    levelsCompleted: 'niveaux complétés',
    levelMilestone1: 'Niveau 1 (Débutant A1.1)',
    levelMilestoneCurrent: 'Niveau Actuel',
    levelMilestone10: 'Niveau 10 (Maîtrise Bilingue C2)',
    statusStudied: 'Validé',
    statusCurrent: 'Niveau Actuel',
    statusLocked: 'Verrouillé',
    stage: 'Étape',
    grade: 'Note',
    currentProgressRate: 'Taux de progression actuel :',
    viewCurriculumDetails: 'Voir le programme et les modules',
    totalLevelsCount: '10 Niveaux Académiques Certifiés',
    activeLevelBadge: 'Niveau Actif',

    modalStudiedSuccess: 'Validé avec succès',
    modalCurrentLevel: 'Niveau Actuel en cours',
    modalLockedLevel: 'Pas encore débloqué',
    finalPassingScore: "Note finale d'examen",
    honorsDegree: 'Mention : Très Bien (Avec Félicitations)',
    completionDate: "Date d'obtention",
    academicallyCertified: "Certifié par la direction pédagogique My School",
    syllabusTopics: 'Programme et thèmes étudiés',
    certifiedUnits: 'Unités pédagogiques certifiées',
    lessons: 'séances',
    downloadCertificate: 'Télécharger le Certificat Officiel (PDF)',
    certificateReady: 'Certificat généré avec succès !',
    unlockRequirement: '🔒 Ce niveau sera débloqué automatiquement après validation du niveau précédent.',
    close: 'Fermer',

    performanceTitle: 'Suivi et Performance Scolaire',
    performanceSubtitle: 'Suivi précis et continu des progrès de l’élève',
    tabHomework: 'Devoirs',
    tabAttendance: 'Présence',
    tabAssessments: 'Évaluations',
    tabTeacherFeedback: 'Remarques Enseignant',
    filterAll: 'Tous',
    needsRevision: 'À réviser',
    completed: 'Terminés',
    pending: 'En attente',
    notStarted: 'Pas commencé',
    dueDateLabel: 'Date limite :',
    submittedDateLabel: 'Date de rendu :',
    scoreLabel: 'Note :',
    teacherNoteLabel: "Remarque de l'enseignant :",
    clickToViewHwDetails: "Cliquez pour afficher les détails du devoir et l'audio",
    overallAttendanceRate: 'Taux de présence global',
    allSessions: 'Toutes les séances',
    present: 'Présent',
    absent: 'Absent',
    late: 'En retard',
    excused: 'Excusé',
    currentWeek: 'Semaine actuelle',
    lastWeek: 'Semaine passée',
    previousWeek: 'Semaine précédente',
    sessionNumber: 'Séance N°',
    teacherLabel: 'Enseignant :',
    sessionType: 'Type de séance :',
    listeningAudioNote: "Écouter le message vocal de l'enseignant",
    voiceNoteDuration: 'Enregistrement vocal • 0:45 min',
    periodicAssessments: 'Évaluations et Tests Périodiques',
    midtermExam: "Note de l'examen mi-parcours",
    finalExam: "Note de l'examen final",
    generalGPA: 'Moyenne générale du niveau',
    highDistinction: 'Très Bien (Avec Félicitations)',
    veryGood: 'Bien',
    good: 'Assez Bien',
    satisfactory: 'Passable',
    noHomeworkFound: 'Aucun devoir trouvé dans cette catégorie',
    noAttendanceFound: 'Aucun enregistrement de présence pour cette semaine',
    noAssessmentsFound: 'Aucune évaluation enregistrée pour le moment',
    noFeedbackFound: 'Aucune remarque enregistrée pour le moment',
    viewAudioVoiceNote: 'Écouter le message vocal',

    financialsTitle: 'Frais de Scolarité & Paiements',
    balanceDue: 'Montant Dû',
    payNow: 'Régler maintenant',
    invoices: 'Historique des factures',
    paid: 'Payé',
    unpaid: 'Impayé',
    downloadReceipt: 'Télécharger le reçu',
    receiptNumber: 'Reçu N°',
    dueDate: "Date d'échéance",
    paymentMethod: 'Moyen de paiement',
    transactionsHistory: 'Historique des transactions',

    profileTitle: 'Profil & Paramètres',
    personalInfo: 'Informations du Parent',
    phoneNumber: 'Numéro de téléphone',
    emailAddress: 'Adresse Email',
    nationalId: "Numéro d'identité / Séjour",
    registeredChildren: 'Enfants Inscrits',
    appSettings: 'Préférences de la Plateforme',
    languageSelect: 'Langue de la plateforme',
    darkTheme: 'Mode Sombre',
    lightTheme: 'Mode Clair',
    notificationsSound: 'Sons de notification',
    activeAccount: 'Compte Actif',
  },
};

// =============================================
// Helper translation dictionaries for dynamic data
// =============================================

export function translateSubject(subjectAr: string, lang: Language): string {
  if (lang === 'ar') return subjectAr;

  const mapEn: Record<string, string> = {
    'اللغة الإنجليزية': 'English Language',
    'اللغة الفرنسية': 'French Language',
    'محادثة إنجليزية': 'English Speaking & Conversation',
    'ورشة النطق الفرنسي': 'French Pronunciation Workshop',
    'قواعد وتراكيب': 'Grammar & Syntax',
    'قواعد الإنجليزية': 'English Grammar & Structures',
    'قواعد الفرنسية': 'French Grammar & Conjugation',
    'استماع ومناقشة': 'Listening & Comprehension',
    'قراءة وفهم نصوص': 'Reading & Text Analysis',
    'تعبير وكتابة': 'Essay & Creative Writing',
    'محادثة وتطبيق': 'Conversation & Real-life Practice',
    'صوتيات وتجويد النطق': 'Phonetics & Pronunciation Accent',
  };

  const mapFr: Record<string, string> = {
    'اللغة الإنجليزية': 'Langue Anglaise',
    'اللغة الفرنسية': 'Langue Française',
    'محادثة إنجليزية': 'Expression Orale en Anglais',
    'ورشة النطق الفرنسي': 'Atelier de Prononciation Française',
    'قواعد وتراكيب': 'Grammaire et Syntaxe',
    'قواعد الإنجليزية': 'Grammaire Anglaise',
    'قواعد الفرنسية': 'Grammaire et Conjugaison Française',
    'استماع ومناقشة': 'Écoute et Débat',
    'قراءة وفهم نصوص': 'Lecture et Compréhension de Textes',
    'تعبير وكتابة': 'Expression Écrite et Rédaction',
    'محادثة وتطبيق': 'Conversation et Mise en Pratique',
    'صوتيات وتجويد النطق': 'Phonétique et Perfectionnement de l’Accent',
  };

  if (lang === 'fr') return mapFr[subjectAr] || subjectAr;
  return mapEn[subjectAr] || subjectAr;
}

export function translateTrack(trackAr: string, lang: Language): string {
  if (lang === 'ar') return trackAr;

  if (lang === 'en') {
    if (trackAr.includes('الإنجليزية')) return 'Intensive English Language Path';
    if (trackAr.includes('الفرنسية')) return 'Advanced French Language Path';
    if (trackAr.includes('المزدوج')) return 'Dual Bilingual Path: English & French';
    return trackAr;
  }

  if (lang === 'fr') {
    if (trackAr.includes('الإنجليزية')) return 'Parcours Intensif de Langue Anglaise';
    if (trackAr.includes('الفرنسية')) return 'Parcours Avancé de Langue Française';
    if (trackAr.includes('المزدوج')) return 'Parcours Bilingue : Anglais & Français';
    return trackAr;
  }

  return trackAr;
}

export function translateSchoolLevel(schoolLevelAr: string | undefined, lang: Language): string {
  if (!schoolLevelAr) return '';
  if (lang === 'ar') return schoolLevelAr;

  if (lang === 'en') {
    if (schoolLevelAr.includes('الخامسة ابتدائي')) return '5th Grade Elementary';
    if (schoolLevelAr.includes('الثالثة متوسط')) return '3rd Grade Middle School';
    if (schoolLevelAr.includes('الأولى ابتدائي')) return '1st Grade Elementary';
    return schoolLevelAr;
  }

  if (lang === 'fr') {
    if (schoolLevelAr.includes('الخامسة ابتدائي')) return '5ème Année Primaire';
    if (schoolLevelAr.includes('الثالثة متوسط')) return '3ème Année Collège';
    if (schoolLevelAr.includes('الأولى ابتدائي')) return '1ère Année Primaire';
    return schoolLevelAr;
  }

  return schoolLevelAr;
}

export function translateBranch(branchAr: string | undefined, lang: Language): string {
  if (!branchAr) return '';
  if (lang === 'ar') return branchAr;

  if (lang === 'en') {
    if (branchAr.includes('الروضة')) return 'Al-Rawdah Campus - Riyadh';
    if (branchAr.includes('العليا')) return 'Al-Olaya Campus - Riyadh';
    return branchAr;
  }

  if (lang === 'fr') {
    if (branchAr.includes('الروضة')) return 'Campus Al-Rawdah - Riyad';
    if (branchAr.includes('العليا')) return 'Campus Al-Olaya - Riyad';
    return branchAr;
  }

  return branchAr;
}

export function translateTiming(timingAr: string | undefined, lang: Language): string {
  if (!timingAr) return '';
  if (lang === 'ar') return timingAr;

  if (lang === 'en') {
    if (timingAr.includes('أيام الأسبوع')) return 'Weekdays (Mon - Thu)';
    if (timingAr.includes('نهاية الأسبوع')) return 'Weekend (Fri - Sat)';
    return timingAr;
  }

  if (lang === 'fr') {
    if (timingAr.includes('أيام الأسبوع')) return 'En semaine (Lun - Jeu)';
    if (timingAr.includes('نهاية الأسبوع')) return 'Week-end (Ven - Sam)';
    return timingAr;
  }

  return timingAr;
}

export function translateHomeworkTitle(titleAr: string, lang: Language): string {
  if (lang === 'ar') return titleAr;

  if (lang === 'en') {
    if (titleAr.includes('Chapter 4 Speaking Task')) return 'Chapter 4 Speaking Task: English Conversation Audio';
    if (titleAr.includes('Present Perfect Worksheet')) return 'Present Perfect Worksheet: Complex Grammar Exercises';
    if (titleAr.includes('French Pronunciation Workshop')) return 'French Pronunciation Workshop: Vowels and Nasal Sounds';
    if (titleAr.includes('Reading Comprehension & Vocabulary')) return 'Reading Comprehension & Vocabulary Analysis Task';
    if (titleAr.includes('Formal Email Writing')) return 'Formal Email Writing: Professional Structure & Syntax';
    return titleAr;
  }

  if (lang === 'fr') {
    if (titleAr.includes('Chapter 4 Speaking Task')) return 'Tâche d’Expression Orale Ch. 4 : Conversation en Anglais';
    if (titleAr.includes('Present Perfect Worksheet')) return 'Fiche d’exercices : Conjugaison et Temps Composés (Present Perfect)';
    if (titleAr.includes('French Pronunciation Workshop')) return 'Atelier de Prononciation Française : Voyelles et Sons Nasaux';
    if (titleAr.includes('Reading Comprehension & Vocabulary')) return 'Compréhension de Texte et Analyse de Vocabulaire';
    if (titleAr.includes('Formal Email Writing')) return 'Rédaction de Courriel Formel : Structure et Vocabulaire Professionnel';
    return titleAr;
  }

  return titleAr;
}

export function translateTeacherNote(note: string, lang: Language): string {
  if (lang === 'ar') return note;

  if (lang === 'en') {
    if (note.includes('أداء جيد ولكن يحتاج لإعادة تسجيل')) {
      return 'Teacher Note: Good overall performance, but please re-record focusing on accurate pronunciation of irregular past verbs.';
    }
    if (note.includes('يوسف ما شاء الله طالب مجتهد')) {
      return 'Hello! The student is very diligent and highly attentive. Today they showed wonderful interaction in the conversation and pronunciation workshop. Please encourage daily listening and speaking practice at home.';
    }
    if (note.includes('إتقان ممتاز')) {
      return 'Excellent mastery! Accurately completed with great attention to grammar details.';
    }
    return note;
  }

  if (lang === 'fr') {
    if (note.includes('أداء جيد ولكن يحتاج لإعادة تسجيل')) {
      return "Remarque de l'enseignant : Bon travail général, mais veuillez réenregistrer en insistant sur la bonne prononciation des verbes irréguliers au passé.";
    }
    if (note.includes('يوسف ما شاء الله طالب مجتهد')) {
      return "Bonjour ! L'élève est très sérieux et investi. Aujourd'hui, il a fait preuve d'une excellente participation lors de l'atelier de conversation. Continuez à encourager l'écoute quotidienne à la maison.";
    }
    if (note.includes('إتقان ممتاز')) {
      return 'Excellente maîtrise ! Devoir complété avec grande précision et rigueur grammaticale.';
    }
    return note;
  }

  return note;
}
