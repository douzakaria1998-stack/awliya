// =============================================
// App-wide Constants for Awliya Parent Portal
// =============================================

export const APP_NAME = 'بوابة ولي الأمر';
export const APP_SUBTITLE = 'Parent Portal';
export const APP_NAME_EN = 'Parent Portal';

// localStorage keys
export const STORAGE_KEYS = {
  AUTH_USER: 'awliya_auth_user',
  AUTH_STATUS: 'awliya_auth_status',
  STUDENTS_LIST: 'awliya_students_list',
  ACTIVE_STUDENT_ID: 'awliya_active_student_id',
  CURRENT_LEVEL: 'awliya_current_level',
  NOTIFICATIONS: 'awliya_notifications',
  NOTIFICATION_SETTINGS: 'awliya_notification_settings',
  HOMEWORK: 'awliya_homework',
  ATTENDANCE: 'awliya_attendance',
  ASSESSMENTS: 'awliya_assessments',
  FEEDBACK: 'awliya_feedback',
  FEES: 'awliya_fees',
  PAYMENTS: 'awliya_payments',
  THEME_MODE: 'awliya_theme_mode',
  VIEWPORT_MODE: 'awliya_viewport_mode',
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
