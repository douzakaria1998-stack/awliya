import { LevelTheme, LevelId } from '@/types';

// =============================================
// 10 Distinct Dynamic Level Themes
// Each mode corresponds to one of the 10 academic levels.
// =============================================
export const levelThemes: Record<LevelId, LevelTheme> = {
  1: {
    id: 1,
    nameAr: 'المستوى الأول: التأسيس القرآني والقراءة',
    shortNameAr: 'المستوى الأول',
    stageAr: 'مرحلة التأسيس والقاعدة النورانية',
    primary: '#2563EB', // Vibrant Blue
    primaryLight: '#DBEAFE',
    primaryDark: '#1D4ED8',
    primaryRgb: '37, 99, 235',
    gradient: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
    accentColor: '#60A5FA',
    descriptionAr: 'تعلم مخارج الحروف، الحركات، والسور التأسيسية من جزء عم',
  },
  2: {
    id: 2,
    nameAr: 'المستوى الثاني: قصار السور والتلاوة',
    shortNameAr: 'المستوى الثاني',
    stageAr: 'مرحلة التلاوة وضبط الحركات',
    primary: '#7C3AED', // Vivid Purple / Violet
    primaryLight: '#EDE9FE',
    primaryDark: '#6D28D9',
    primaryRgb: '124, 58, 237',
    gradient: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
    accentColor: '#A78BFA',
    descriptionAr: 'حفظ قصار السور وضبط المدود والتلاوة الصحيحة',
  },
  3: {
    id: 3,
    nameAr: 'المستوى الثالث: أحكام النون الساكنة والتنوين',
    shortNameAr: 'المستوى الثالث',
    stageAr: 'مرحلة أحكام التجويد الأساسية',
    primary: '#059669', // Deep Emerald
    primaryLight: '#D1FAE5',
    primaryDark: '#047857',
    primaryRgb: '5, 150, 105',
    gradient: 'linear-gradient(135deg, #059669 0%, #065F46 100%)',
    accentColor: '#34D399',
    descriptionAr: 'إتقان الإظهار، الإدغام، الإقلاب، والإخفاء مع التطبيق العملي',
  },
  4: {
    id: 4,
    nameAr: 'المستوى الرابع: جزء عم وإتقان التجويد',
    shortNameAr: 'المستوى الرابع',
    stageAr: 'مرحلة إتمام جزء عم والتطبيق النظري',
    primary: '#E11D48', // Rose / Ruby Red
    primaryLight: '#FFE4E6',
    primaryDark: '#BE123C',
    primaryRgb: '225, 29, 72',
    gradient: 'linear-gradient(135deg, #E11D48 0%, #9F1239 100%)',
    accentColor: '#FB7185',
    descriptionAr: 'إتمام حفظ جزء عم كاملاً مع تطبيق قواعد التجويد بالتفصيل',
  },
  5: {
    id: 5,
    nameAr: 'المستوى الخامس: جزء تبارك والمخارج والصفات',
    shortNameAr: 'المستوى الخامس',
    stageAr: 'مرحلة جزء تبارك وتدقيق المخارج',
    primary: '#D97706', // Amber / Royal Gold
    primaryLight: '#FEF3C7',
    primaryDark: '#B45309',
    primaryRgb: '217, 119, 6',
    gradient: 'linear-gradient(135deg, #D97706 0%, #92400E 100%)',
    accentColor: '#FBBF24',
    descriptionAr: 'الانتقال لجزء تبارك مع دراسة مفصلة لمخارج الحروف وصفاتها',
  },
  6: {
    id: 6,
    nameAr: 'المستوى السادس: أحكام الراء واللامات والمدود',
    shortNameAr: 'المستوى السادس',
    stageAr: 'مرحلة تفخيم وترقيق الحروف',
    primary: '#0891B2', // Cyan / Oceanic Teal
    primaryLight: '#CFFAFE',
    primaryDark: '#0E7490',
    primaryRgb: '8, 145, 178',
    gradient: 'linear-gradient(135deg, #0891B2 0%, #155E75 100%)',
    accentColor: '#22D3EE',
    descriptionAr: 'تطبيق أحكام التفخيم والترقيق والمدود المتصلة والمنفصلة',
  },
  7: {
    id: 7,
    nameAr: 'المستوى السابع: جزء قد سمع وتفسير الآيات',
    shortNameAr: 'المستوى السابع',
    stageAr: 'مرحلة الحفظ المتقدم مع التدبر',
    primary: '#4F46E5', // Indigo
    primaryLight: '#E0E7FF',
    primaryDark: '#4338CA',
    primaryRgb: '79, 70, 229',
    gradient: 'linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)',
    accentColor: '#818CF8',
    descriptionAr: 'حفظ السور مع ربط المعاني والتدبر وأسباب النزول',
  },
  8: {
    id: 8,
    nameAr: 'المستوى الثامن: المتشابهات وضبط الحفظ',
    shortNameAr: 'المستوى الثامن',
    stageAr: 'مرحلة تثبيت المتشابهات اللفظية',
    primary: '#DB2777', // Fuchsia / Magenta
    primaryLight: '#FCE7F3',
    primaryDark: '#BE185D',
    primaryRgb: '219, 39, 119',
    gradient: 'linear-gradient(135deg, #DB2777 0%, #9D174D 100%)',
    accentColor: '#F472B6',
    descriptionAr: 'التمكن من متشابهات الألفاظ والربط بين الآيات المتماثلة',
  },
  9: {
    id: 9,
    nameAr: 'المستوى التاسع: الوقف والابتداء والرسم العثماني',
    shortNameAr: 'المستوى التاسع',
    stageAr: 'مرحلة الوقف والابتداء والضبط المتقدم',
    primary: '#0D9488', // Persian Mint / Teal
    primaryLight: '#CCFBF1',
    primaryDark: '#0F766E',
    primaryRgb: '13, 148, 136',
    gradient: 'linear-gradient(135deg, #0D9488 0%, #115E59 100%)',
    accentColor: '#2DD4BF',
    descriptionAr: 'دراسة قواعد الوقف التام والكافي والقبيح وقواعد الرسم العثماني',
  },
  10: {
    id: 10,
    nameAr: 'المستوى العاشر: الإتقان والإجازة والتثبيت',
    shortNameAr: 'المستوى العاشر',
    stageAr: 'مرحلة الإتقان والختم والإجازة',
    primary: '#EA580C', // Royal Sunset / Coral Gold
    primaryLight: '#FFEDD5',
    primaryDark: '#C2410C',
    primaryRgb: '234, 88, 12',
    gradient: 'linear-gradient(135deg, #EA580C 0%, #9A3412 100%)',
    accentColor: '#FB923C',
    descriptionAr: 'المرحلة الختامية: عرض القراءة الكاملة بالسند المتصل والاستعداد للإجازة',
  },
};

export function getThemeForLevel(level: LevelId): LevelTheme {
  return levelThemes[level] || levelThemes[1];
}

export function applyThemeCSS(level: LevelId): void {
  if (typeof document === 'undefined') return;
  const theme = getThemeForLevel(level);
  const root = document.documentElement;

  root.style.setProperty('--color-primary', theme.primary);
  root.style.setProperty('--color-primary-light', theme.primaryLight);
  root.style.setProperty('--color-primary-dark', theme.primaryDark);
  root.style.setProperty('--color-primary-rgb', theme.primaryRgb);
  root.style.setProperty('--gradient-primary', theme.gradient);
  root.style.setProperty('--color-accent', theme.accentColor);
  root.style.setProperty('--shadow-glow', `0 0 24px rgba(${theme.primaryRgb}, 0.35)`);
  root.style.setProperty('--shadow-button', `0 4px 14px rgba(${theme.primaryRgb}, 0.38)`);
}
