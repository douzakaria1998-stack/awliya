import { LevelTheme, LevelId } from '@/types';

// =============================================
// 10 Distinct Dynamic Level Themes
// Each mode corresponds to one of the 10 academic levels.
// =============================================
export const levelThemes: Record<LevelId, LevelTheme> = {
  1: {
    id: 1,
    nameAr: 'المستوى الأول: التأسيس الصوتي والمفردات الأولية (Starter A1.1)',
    shortNameAr: 'المستوى الأول',
    stageAr: 'مرحلة التأسيس والحروف والنطق (Phonetics & Basics)',
    primary: '#EA580C', // Vibrant Orange / Sunset
    primaryLight: '#FFEDD5',
    primaryDark: '#C2410C',
    primaryRgb: '234, 88, 12',
    gradient: 'linear-gradient(135deg, #EA580C 0%, #C2410C 100%)',
    accentColor: '#FB923C',
    descriptionAr: 'تعلم الأبجدية، مخارج الأصوات الصوتية، التحيات اليومية، والمفردات التأسيسية بالإنجليزية والفرنسية',
  },
  2: {
    id: 2,
    nameAr: 'المستوى الثاني: بناء الجمل والتواصل البسيط (Beginner A1.2)',
    shortNameAr: 'المستوى الثاني',
    stageAr: 'مرحلة التراكيب وقواعد البدايات (Basic Grammar)',
    primary: '#7C3AED', // Vivid Purple / Violet
    primaryLight: '#EDE9FE',
    primaryDark: '#6D28D9',
    primaryRgb: '124, 58, 237',
    gradient: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
    accentColor: '#A78BFA',
    descriptionAr: 'تكوين الجمل البسيطة، الأرقام والأوقات، والروتين اليومي باللغتين الإنجليزية والفرنسية',
  },
  3: {
    id: 3,
    nameAr: 'المستوى الثالث: الاستماع والمحادثة اليومية (Elementary A2.1)',
    shortNameAr: 'المستوى الثالث',
    stageAr: 'مرحلة الاستماع والتحدث التفاعلي (Listening & Dialogue)',
    primary: '#059669', // Deep Emerald
    primaryLight: '#D1FAE5',
    primaryDark: '#047857',
    primaryRgb: '5, 150, 105',
    gradient: 'linear-gradient(135deg, #059669 0%, #065F46 100%)',
    accentColor: '#34D399',
    descriptionAr: 'إجراء محادثات يومية في المدرسة والتسوق والسفر مع تعزيز الفهم السمعي السريع',
  },
  4: {
    id: 4,
    nameAr: 'المستوى الرابع: الطلاقة الشفهية والتعبير الكتابي (Pre-Intermediate A2.2)',
    shortNameAr: 'المستوى الرابع',
    stageAr: 'مرحلة التعبير والتحدث بطلاقة (Oral Fluency & Writing)',
    primary: '#E11D48', // Rose / Ruby Red
    primaryLight: '#FFE4E6',
    primaryDark: '#BE123C',
    primaryRgb: '225, 29, 72',
    gradient: 'linear-gradient(135deg, #E11D48 0%, #9F1239 100%)',
    accentColor: '#FB7185',
    descriptionAr: 'سرد القصص والتعبير عن الآراء والمشاعر باستخدام الأزمنة المتنوعة وتركيبات الجمل',
  },
  5: {
    id: 5,
    nameAr: 'المستوى الخامس: التراكيب المتقدمة والحوار الموسع (Intermediate B1.1)',
    shortNameAr: 'المستوى الخامس',
    stageAr: 'مرحلة الاستقلالية اللغوية (Language Autonomy)',
    primary: '#D97706', // Amber / Royal Gold
    primaryLight: '#FEF3C7',
    primaryDark: '#B45309',
    primaryRgb: '217, 119, 6',
    gradient: 'linear-gradient(135deg, #D97706 0%, #92400E 100%)',
    accentColor: '#FBBF24',
    descriptionAr: 'المشاركة في نقاشات جماعية، فهم النصوص المتوسطة، وصياغة الفقرات التعبيرية المترابطة',
  },
  6: {
    id: 6,
    nameAr: 'المستوى السادس: القراءة التحليلية والتعابير الاصطلاحية (Upper-Intermediate B1.2)',
    shortNameAr: 'المستوى السادس',
    stageAr: 'مرحلة التحليل والكتابة التعبيرية (Reading & Idioms)',
    primary: '#0891B2', // Cyan / Oceanic Teal
    primaryLight: '#CFFAFE',
    primaryDark: '#0E7490',
    primaryRgb: '8, 145, 178',
    gradient: 'linear-gradient(135deg, #0891B2 0%, #155E75 100%)',
    accentColor: '#22D3EE',
    descriptionAr: 'كتابة المقالات والمراسلات، وفهم التعبيرات الاصطلاحية والأمثال الشائعة بالإنجليزية والفرنسية',
  },
  7: {
    id: 7,
    nameAr: 'المستوى السابع: النقاشات الأكاديمية والمناظرات (Advanced B2.1)',
    shortNameAr: 'المستوى السابع',
    stageAr: 'مرحلة الحوار المتقدم والمناظرات (Debates & Presentations)',
    primary: '#4F46E5', // Indigo
    primaryLight: '#E0E7FF',
    primaryDark: '#4338CA',
    primaryRgb: '79, 70, 229',
    gradient: 'linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)',
    accentColor: '#818CF8',
    descriptionAr: 'إلقاء العروض التقديمية، الدفاع عن وجهات النظر، وصياغة الحجج اللغوية الدقيقة والمعقدة',
  },
  8: {
    id: 8,
    nameAr: 'المستوى الثامن: البلاغة والأساليب اللغوية الرفيعة (Advanced B2.2)',
    shortNameAr: 'المستوى الثامن',
    stageAr: 'مرحلة الصقل اللغوي والنطق الاحترافي (Accent & Rhetoric)',
    primary: '#DB2777', // Fuchsia / Magenta
    primaryLight: '#FCE7F3',
    primaryDark: '#BE185D',
    primaryRgb: '219, 39, 119',
    gradient: 'linear-gradient(135deg, #DB2777 0%, #9D174D 100%)',
    accentColor: '#F472B6',
    descriptionAr: 'تدريب مكثف على النطق المتقن واللهجات السليمة والأساليب البلاغية ونصوص الأدب العالمي',
  },
  9: {
    id: 9,
    nameAr: 'المستوى التاسع: الكفاءة الأكاديمية واختبارات الكفاءة (Proficiency C1 & IELTS/DELF)',
    shortNameAr: 'المستوى التاسع',
    stageAr: 'مرحلة الكفاءة العالية والاستعداد للاختبارات الدولية',
    primary: '#0D9488', // Persian Mint / Teal
    primaryLight: '#CCFBF1',
    primaryDark: '#0F766E',
    primaryRgb: '13, 148, 136',
    gradient: 'linear-gradient(135deg, #0D9488 0%, #115E59 100%)',
    accentColor: '#2DD4BF',
    descriptionAr: 'التحضير للاختبارات الدولية المعتمدة (IELTS, TOEFL, DELF, DALF) مع إتقان التحليل النقدي المعمق',
  },
  10: {
    id: 10,
    nameAr: 'المستوى العاشر: الطلاقة الشاملة والإتقان التام (Bilingual Mastery C2)',
    shortNameAr: 'المستوى العاشر',
    stageAr: 'مرحلة الإتقان والطلاقة ثنائية اللغة التامة (Native-like Mastery)',
    primary: '#2563EB', // Vibrant Blue / Sapphire
    primaryLight: '#DBEAFE',
    primaryDark: '#1D4ED8',
    primaryRgb: '37, 99, 235',
    gradient: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
    accentColor: '#60A5FA',
    descriptionAr: 'الوصول إلى الطلاقة التامة والتحدث والتفكير العفوي بالإنجليزية والفرنسية كالمتحدثين الأصليين',
  },
};

// Helper to convert hex to RGB
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map((c) => c + c).join('');
  }
  const num = parseInt(cleanHex, 16);
  if (isNaN(num) || cleanHex.length !== 6) {
    return { r: 234, g: 88, b: 12 }; // Default orange fallback
  }
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

// Helper to adjust color brightness (positive percent = lighter, negative = darker)
export function adjustBrightness(hex: string, percent: number): string {
  const { r, g, b } = hexToRgb(hex);
  const factor = 1 + percent / 100;
  const clamp = (val: number) => Math.min(255, Math.max(0, Math.round(val)));
  const toHex = (val: number) => clamp(val).toString(16).padStart(2, '0');
  return `#${toHex(r * factor)}${toHex(g * factor)}${toHex(b * factor)}`;
}

// Key for storing dynamic level colors in browser storage
export const CUSTOM_LEVEL_COLORS_KEY = 'myschool_custom_level_colors_v1';

// Retrieve custom color for a level from localStorage (or curriculum data)
export function getCustomLevelColor(levelNumber: number | string): string | null {
  if (typeof window === 'undefined') return null;
  const num = Number(levelNumber);
  if (isNaN(num)) return null;

  try {
    // 1. Direct custom level colors map
    const rawCustom = localStorage.getItem(CUSTOM_LEVEL_COLORS_KEY);
    if (rawCustom) {
      const parsed = JSON.parse(rawCustom);
      if (parsed && (parsed[num] || parsed[String(num)])) {
        return parsed[num] || parsed[String(num)];
      }
    }

    // 2. Check admin curricula storage keys
    const storageKeysToCheck = [
      'myschool_admin_curricula_v11',
      'myschool_curricula_v11',
      'myschool_curricula',
      'curricula',
    ];

    for (const key of storageKeysToCheck) {
      const rawCurricula = localStorage.getItem(key);
      if (rawCurricula) {
        const list = JSON.parse(rawCurricula);
        if (Array.isArray(list)) {
          const match = list.find(
            (c: any) => Number(c?.levelNumber) === num || Number(c?.level) === num || Number(c?.id) === num
          );
          if (match && match.color && typeof match.color === 'string') {
            return match.color;
          }
        }
      }
    }
  } catch {
    // Ignore storage parse errors
  }
  return null;
}

// Save custom level color
export function saveCustomLevelColor(levelNumber: number, hexColor: string): void {
  if (typeof window === 'undefined' || !hexColor) return;
  try {
    const raw = localStorage.getItem(CUSTOM_LEVEL_COLORS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    parsed[levelNumber] = hexColor;
    parsed[String(levelNumber)] = hexColor;
    localStorage.setItem(CUSTOM_LEVEL_COLORS_KEY, JSON.stringify(parsed));
    window.dispatchEvent(new CustomEvent('awliya-data-sync'));
  } catch {
    // Ignore storage errors
  }
}

// Dynamically construct a LevelTheme object given any hex color
export function createDynamicTheme(level: LevelId, hexColor: string): LevelTheme {
  const base = levelThemes[level] || levelThemes[1];
  const rgb = hexToRgb(hexColor);
  const primaryDark = adjustBrightness(hexColor, -25);
  const primaryLight = adjustBrightness(hexColor, 45);
  const accentColor = adjustBrightness(hexColor, 20);

  return {
    ...base,
    id: level,
    primary: hexColor,
    primaryLight,
    primaryDark,
    primaryRgb: `${rgb.r}, ${rgb.g}, ${rgb.b}`,
    gradient: `linear-gradient(135deg, ${hexColor} 0%, ${primaryDark} 100%)`,
    accentColor,
  };
}

export function getThemeForLevel(level: LevelId, customColor?: string): LevelTheme {
  if (customColor) {
    return createDynamicTheme(level, customColor);
  }

  const storedColor = getCustomLevelColor(level);
  if (storedColor) {
    return createDynamicTheme(level, storedColor);
  }

  return levelThemes[level] || levelThemes[1];
}

export function applyThemeCSS(level: LevelId, customTheme?: LevelTheme): void {
  if (typeof document === 'undefined') return;
  const theme = customTheme || getThemeForLevel(level);
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
