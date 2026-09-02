// =============================================
// App-wide Constants for Awliya Parent Portal
// =============================================

export const APP_NAME = 'بوابة ولي الأمر';
export const APP_SUBTITLE = 'Parent Portal';
export const APP_NAME_EN = 'Parent Portal';

// localStorage keys
export const STORAGE_KEYS = {
  AUTH_USER: 'awliya_auth_user_v4',
  AUTH_STATUS: 'awliya_auth_status_v4',
  STUDENTS_LIST: 'awliya_students_list_v4',
  ACTIVE_STUDENT_ID: 'awliya_active_student_id_v4',
  CURRENT_LEVEL: 'awliya_current_level_v4',
  NOTIFICATIONS: 'awliya_notifications_v4',
  NOTIFICATION_SETTINGS: 'awliya_notification_settings_v4',
  HOMEWORK: 'awliya_homework_v4',
  ATTENDANCE: 'awliya_attendance_v4',
  ASSESSMENTS: 'awliya_assessments_v4',
  FEEDBACK: 'awliya_feedback_v4',
  FEES: 'awliya_fees_v4',
  PAYMENTS: 'awliya_payments_v4',
  THEME_MODE: 'awliya_theme_mode_v4',
  VIEWPORT_MODE: 'awliya_viewport_mode_v4',
  ADMIN_PARENTS: 'myschool_admin_parents_v2',
  ADMIN_STUDENTS: 'myschool_admin_students_v2',
  ADMIN_CURRICULA: 'myschool_admin_curricula_v2',
  ADMIN_LESSON_PROGRESS: 'myschool_admin_lesson_progress_v2',
} as const;

// Navigation tabs
export type NavTabKey = 'dashboard' | 'academic' | 'performance' | 'financials' | 'profile';

export interface NavItemConfig {
  key: NavTabKey;
  labelAr: string;
  iconName: 'Home' | 'Activity' | 'BarChart3' | 'CreditCard' | 'User';
}

// Feature toggle to easily activate/hide the Financials section
export const SHOW_FINANCIALS_TAB = false;

// Feature toggle to easily activate/hide the Add Student (+ إضافة) button
export const SHOW_ADD_STUDENT_BUTTON = false;

// 5 Main sections RTL order (matches image exactly: الرئيسية، المسار، الأداء، المالية، الملف)
export const NAV_ITEMS: NavItemConfig[] = [
  { key: 'dashboard', labelAr: 'الرئيسية', iconName: 'Home' },
  { key: 'academic', labelAr: 'المسار', iconName: 'Activity' },
  { key: 'performance', labelAr: 'الأداء', iconName: 'BarChart3' },
  ...(SHOW_FINANCIALS_TAB
    ? [{ key: 'financials' as NavTabKey, labelAr: 'المالية', iconName: 'CreditCard' as const }]
    : []),
  { key: 'profile', labelAr: 'الملف', iconName: 'User' },
];

// Default Currency
export const DEFAULT_CURRENCY = 'د.ج';

// Performance sub-tabs
export type PerformanceTabKey = 'homework' | 'attendance' | 'assessments' | 'feedback';

export const PERFORMANCE_TABS: { key: PerformanceTabKey; labelAr: string; countBadge?: number }[] = [
  { key: 'homework', labelAr: 'الواجبات' },
  { key: 'attendance', labelAr: 'الحضور' },
  { key: 'assessments', labelAr: 'التقييمات' },
  { key: 'feedback', labelAr: 'ملاحظات المعلم' },
];

// Fixed Status Colors specification
export const STATUS_COLORS = {
  success: '#16A34A',
  successLight: '#DCFCE7',
  warning: '#D97706',
  warningLight: '#FEF3C7',
  locked: '#9CA3AF',
  lockedLight: '#F3F4F6',
  error: '#DC2626',
  errorLight: '#FEE2E2',
};

// Status labels
export const STATUS_LABELS = {
  studied: 'تمت دراسته',
  current: 'المستوى الحالي',
  locked: 'لم يدرس بعد',
  completed: 'مكتمل',
  needs_revision: 'بحاجة إلى مراجعة',
  pending: 'قيد الانتظار',
  not_started: 'لم يبدأ بعد',
  paid: 'مكتمل الدفع',
  overdue: 'متأخر',
  present: 'حاضر',
  absent: 'غائب',
  late: 'متأخر',
  excused: 'غياب بعذر',
} as const;

// Helper to determine Arabic noun (الطالب vs الطالبة) based on gender and name
export function getStudentGenderNoun(
  student?: { gender?: 'male' | 'female'; firstNameAr?: string; fullNameAr?: string; nicknameAr?: string } | null
): string {
  if (!student) return 'الطالب';
  if (student.gender === 'female') return 'الطالبة';
  if (student.gender === 'male') return 'الطالب';

  const name = (student.firstNameAr || student.nicknameAr || student.fullNameAr || '').trim().split(' ')[0];
  const femaleNames = [
    'مريم', 'فاطمة', 'عائشة', 'سارة', 'نورة', 'سلمى', 'زينب', 'خديجة',
    'ريناد', 'لينا', 'جنى', 'هدى', 'شهد', 'يارا', 'ريما', 'تسنيم',
    'آية', 'أميرة', 'حفصة', 'روان', 'رغد', 'لجين', 'ملاك', 'أسماء',
    'أروى', 'حنين', 'بيان', 'لمى', 'نور', 'دانة', 'تولين', 'تالا'
  ];

  if (femaleNames.includes(name) || name.endsWith('ة') || name.endsWith('اء') || name.endsWith('ى')) {
    return 'الطالبة';
  }
  return 'الطالب';
}

export const LEVEL_TITLES_EN: Record<number, { name: string; stage: string }> = {
  1: { name: 'Level 1: Phonics & Basic Vocabulary (Starter A1.1)', stage: 'Phonetics, Alphabet & Everyday Greetings' },
  2: { name: 'Level 2: Sentence Building & Daily Routines (Beginner A1.2)', stage: 'Basic Grammar & Simple Dialogues' },
  3: { name: 'Level 3: Listening & Everyday Conversation (Elementary A2.1)', stage: 'Interactive Listening & Speaking Practice' },
  4: { name: 'Level 4: Oral Fluency & Paragraph Writing (Pre-Intermediate A2.2)', stage: 'Storytelling & Applied Sentence Structures' },
  5: { name: 'Level 5: Advanced Structures & Debates (Intermediate B1.1)', stage: 'Language Autonomy & Group Discussions' },
  6: { name: 'Level 6: Analytical Reading & Idioms (Upper-Intermediate B1.2)', stage: 'Essay Writing & Idiomatic Expressions' },
  7: { name: 'Level 7: Academic Presentations & Debates (Advanced B2.1)', stage: 'Public Speaking & Formal Debates' },
  8: { name: 'Level 8: Accent Mastery & Global Literature (Advanced B2.2)', stage: 'Accent Reduction & Advanced Rhetoric' },
  9: { name: 'Level 9: Academic Proficiency & Exam Prep (Proficiency C1)', stage: 'IELTS / DELF Certification Preparation' },
  10: { name: 'Level 10: Bilingual Mastery & Professional Fluency (Mastery C2)', stage: 'Native-like Fluency & Capstone Project' },
};

export const LEVEL_TITLES_FR: Record<number, { name: string; stage: string }> = {
  1: { name: 'Niveau 1 : Phonétique & Vocabulaire de Base (Débutant A1.1)', stage: 'Phonétique, Alphabet et Salutations' },
  2: { name: 'Niveau 2 : Construction de Phrases & Vie Quotidienne (A1.2)', stage: 'Grammaire de Base et Dialogues Simples' },
  3: { name: 'Niveau 3 : Compréhension Orale & Conversation (A2.1)', stage: 'Écoute Interactive et Pratique Orale' },
  4: { name: 'Niveau 4 : Fluidité Orale & Expression Écrite (A2.2)', stage: 'Récits et Structures de Phrases Appliquées' },
  5: { name: 'Niveau 5 : Structures Avancées & Débats (Intermédiaire B1.1)', stage: 'Autonomie Linguistique et Discussions de Groupe' },
  6: { name: 'Niveau 6 : Lecture Analytique & Expressions Idiomatiques (B1.2)', stage: 'Rédaction de Textes et Expressions Courantes' },
  7: { name: 'Niveau 7 : Présentations Académiques & Débats (Avancé B2.1)', stage: 'Prise de Parole en Public et Débats Formels' },
  8: { name: 'Niveau 8 : Maîtrise de l’Accent & Littérature Mondiale (B2.2)', stage: 'Perfectionnement de l’Accent et Rhétorique' },
  9: { name: 'Niveau 9 : Compétence Académique & Préparation aux Examens (C1)', stage: 'Préparation aux Certifications IELTS / DELF' },
  10: { name: 'Niveau 10 : Maîtrise Bilingue & Aisance Professionnelle (C2)', stage: 'Aisance Bilingue Complète et Projet Final' },
};
