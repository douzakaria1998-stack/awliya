/**
 * Auto-Transliteration & Translation Engine for Awliya
 * Converts Arabic names, titles, group names, curriculum levels and lesson titles
 * to English and French automatically.
 */

// Common Arabic given names & surnames mapping to clean Latin spellings
const COMMON_NAME_MAP: Record<string, string> = {
  // Male Names
  'محمد': 'Mohamed',
  'أحمد': 'Ahmed',
  'احمد': 'Ahmed',
  'محمود': 'Mahmoud',
  'يوسف': 'Youssef',
  'عبد الرحمن': 'Abderrahmane',
  'عبدالرحمن': 'Abderrahmane',
  'عبد الله': 'Abdullah',
  'عبدالله': 'Abdullah',
  'عبد العزيز': 'Abdelaziz',
  'عبدالعزيز': 'Abdelaziz',
  'عبد القادر': 'Abdelkader',
  'عبدالقادر': 'Abdelkader',
  'عبد الكريم': 'Abdelkarim',
  'عبد الرحيم': 'Abderrahim',
  'حسام': 'Houssam',
  'عثمان': 'Othman',
  'علي': 'Ali',
  'عمر': 'Omar',
  'خالد': 'Khaled',
  'حمزة': 'Hamza',
  'أيوب': 'Ayoub',
  'ياسين': 'Yassine',
  'بلال': 'Bilal',
  'إبراهيم': 'Ibrahim',
  'ابراهيم': 'Ibrahim',
  'إسماعيل': 'Ismail',
  'اسماعيل': 'Ismail',
  'طارق': 'Tarek',
  'كريم': 'Karim',
  'سامي': 'Sami',
  'أمين': 'Amine',
  'امين': 'Amine',
  'وليد': 'Walid',
  'فهد': 'Fahad',
  'سعود': 'Saud',
  'سلطان': 'Sultan',
  'بدر': 'Badr',
  'زياد': 'Ziad',
  'أنس': 'Anas',
  'ريان': 'Rayan',
  'إياد': 'Iyad',
  'يحيى': 'Yahya',
  'زكريا': 'Zakaria',
  'مصطفى': 'Mustafa',
  'سليمان': 'Slimane',
  'سفيان': 'Sofiane',
  'مهدي': 'Mehdi',
  'عادل': 'Adel',
  'فارس': 'Faris',
  'ياسر': 'Yasser',
  'هشام': 'Hicham',

  // Female Names
  'ياسمين': 'Yasmine',
  'فاطمة': 'Fatima',
  'فاطمه': 'Fatima',
  'مريم': 'Mariam',
  'عائشة': 'Aicha',
  'خديجة': 'Khadija',
  'سارة': 'Sara',
  'زينب': 'Zineb',
  'أمينة': 'Amina',
  'امينة': 'Amina',
  'نور': 'Nour',
  'نورة': 'Noura',
  'ليلى': 'Leila',
  'دليلة': 'Dalila',
  'هدى': 'Hoda',
  'منى': 'Mona',
  'رانية': 'Rania',
  'رانيا': 'Rania',
  'سلمى': 'Salma',
  'ريما': 'Rima',
  'آية': 'Aya',
  'اية': 'Aya',
  'إيمان': 'Imane',
  'ايمان': 'Imane',
  'حنان': 'Hanan',
  'وفاء': 'Wafaa',
  'أسماء': 'Asmaa',
  'شيماء': 'Chaimaa',
  'كنزة': 'Kenza',
  'إكرام': 'Ikram',

  // Common Surnames
  'تواتي': 'Touati',
  'التواتي': 'Touati',
  'بن سالم': 'Bensalem',
  'بنسالم': 'Bensalem',
  'مصطفاوي': 'Mostafaoui',
  'المصطفاوي': 'Mostafaoui',
  'دوزكاري': 'Douzkari',
  'الدوزكاري': 'Douzkari',
  'دحماني': 'Dahmani',
  'براهيمي': 'Brahimi',
  'منصوري': 'Mansouri',
  'بوزيد': 'Bouzid',
  'سليماني': 'Slimani',
  'العمري': 'Ammari',
  'طاهري': 'Tahiri',
  'قادري': 'Kadri',
  'حمدي': 'Hamdi',
  'عثماني': 'Othmani',
  'بلقاسم': 'Belkacem',
  'زروقي': 'Zerrouki',
  'بن علي': 'Benali',
  'بن يوسف': 'Benyoussef',
};

// Character-by-character transliteration map
const CHAR_MAP: Record<string, string> = {
  'ا': 'a',
  'أ': 'a',
  'إ': 'i',
  'آ': 'aa',
  'ء': '',
  'ئ': 'i',
  'ؤ': 'ou',
  'ب': 'b',
  'ت': 't',
  'ث': 'th',
  'ج': 'j',
  'ح': 'h',
  'خ': 'kh',
  'د': 'd',
  'ذ': 'dh',
  'ر': 'r',
  'ز': 'z',
  'س': 's',
  'ش': 'ch',
  'ص': 's',
  'ض': 'd',
  'ط': 't',
  'ظ': 'z',
  'ع': 'a',
  'غ': 'gh',
  'ف': 'f',
  'ق': 'k',
  'ك': 'k',
  'ل': 'l',
  'م': 'm',
  'ن': 'n',
  'ه': 'h',
  'و': 'ou',
  'ي': 'i',
  'ى': 'a',
  'ة': 'a',
  'ـ': '',
  'َ': 'a',
  'ُ': 'ou',
  'ِ': 'i',
  'ّ': '',
  'ْ': '',
};

/**
 * Transliterates an Arabic word or full name into clean Latin spelling.
 */
export function transliterateArabicName(text: string | undefined): string {
  if (!text) return '';
  const trimmed = text.trim();
  if (!trimmed) return '';

  // Check if text is already Latin/English
  if (/^[A-Za-z0-9\s._\-&'’]+$/.test(trimmed)) {
    return trimmed;
  }

  // Split title prefixes like أ. or د. or الشيخ
  let prefix = '';
  let cleanText = trimmed;
  if (cleanText.startsWith('أ. ') || cleanText.startsWith('أستاذ ') || cleanText.startsWith('الأستاذ ')) {
    prefix = 'Mr. ';
    cleanText = cleanText.replace(/^(أ\.\s*|أستاذ\s*|الأستاذ\s*)/, '');
  } else if (cleanText.startsWith('أستاذة ') || cleanText.startsWith('الأستاذة ')) {
    prefix = 'Ms. ';
    cleanText = cleanText.replace(/^(أستاذة\s*|الأستاذة\s*)/, '');
  } else if (cleanText.startsWith('د. ') || cleanText.startsWith('دكتور ')) {
    prefix = 'Dr. ';
    cleanText = cleanText.replace(/^(د\.\s*|دكتور\s*)/, '');
  }

  // Split into words
  const words = cleanText.split(/\s+/);
  const transliteratedWords = words.map((word) => {
    // 1. Direct dictionary match
    if (COMMON_NAME_MAP[word]) {
      return COMMON_NAME_MAP[word];
    }

    // 2. Handle "عبد" compound names
    if (word.startsWith('عبدال')) {
      const remainder = word.slice(5);
      const remainderTrans = COMMON_NAME_MAP[remainder] || transliterateSingleWord(remainder);
      return `Abdel${capitalize(remainderTrans)}`;
    }
    if (word.startsWith('عبد')) {
      const remainder = word.slice(3);
      const remainderTrans = COMMON_NAME_MAP[remainder] || transliterateSingleWord(remainder);
      return `Abdel${capitalize(remainderTrans)}`;
    }

    // 3. Handle "بن" or "ابن" compound names
    if (word.startsWith('بن') && word.length > 2) {
      const remainder = word.slice(2);
      const remainderTrans = COMMON_NAME_MAP[remainder] || transliterateSingleWord(remainder);
      return `Ben${capitalize(remainderTrans)}`;
    }

    // 4. Handle "ال" prefix
    if (word.startsWith('ال') && word.length > 2) {
      const remainder = word.slice(2);
      if (COMMON_NAME_MAP[remainder]) {
        return COMMON_NAME_MAP[remainder];
      }
      return transliterateSingleWord(word);
    }

    // 5. Fallback character-by-character phoneme transliteration
    return transliterateSingleWord(word);
  });

  return `${prefix}${transliteratedWords.join(' ')}`.trim();
}

function transliterateSingleWord(word: string): string {
  let result = '';
  for (let i = 0; i < word.length; i++) {
    const char = word[i];
    const nextChar = word[i + 1];

    // Handle "ال" at word start
    if (i === 0 && char === 'ا' && nextChar === 'ل') {
      result += 'el';
      i++;
      continue;
    }

    result += CHAR_MAP[char] !== undefined ? CHAR_MAP[char] : char;
  }

  // Clean up double vowels
  result = result.replace(/([aeiou])\1+/gi, '$1');
  return capitalize(result);
}

function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Auto-translates a group name (e.g. "الفوج A2 — المتوسط") to English or French.
 */
export function autoTranslateGroupName(nameAr: string | undefined, lang: 'ar' | 'en' | 'fr'): string {
  if (!nameAr) return '';
  if (lang === 'ar') return nameAr;

  // Extract code/letters if present
  let translated = nameAr;

  if (lang === 'en') {
    translated = translated
      .replace(/الفوج/g, 'Group')
      .replace(/المتوسط/g, 'Intermediate')
      .replace(/الابتدائي/g, 'Elementary')
      .replace(/المبتدئ/g, 'Beginner')
      .replace(/المتقدم/g, 'Advanced')
      .replace(/المكثف/g, 'Intensive')
      .replace(/صباحي/g, 'Morning')
      .replace(/مسائي/g, 'Evening')
      .replace(/نهاية الأسبوع/g, 'Weekend')
      .replace(/أيام الأسبوع/g, 'Weekdays');
  } else if (lang === 'fr') {
    translated = translated
      .replace(/الفوج/g, 'Groupe')
      .replace(/المتوسط/g, 'Intermédiaire')
      .replace(/الابتدائي/g, 'Élémentaire')
      .replace(/المبتدئ/g, 'Débutant')
      .replace(/المتقدم/g, 'Avancé')
      .replace(/المكثف/g, 'Intensif')
      .replace(/صباحي/g, 'Matin')
      .replace(/مسائي/g, 'Soir')
      .replace(/نهاية الأسبوع/g, 'Week-end')
      .replace(/أيام الأسبوع/g, 'En semaine');
  }

  // If translation made no changes and text has Arabic characters, transliterate
  if (translated === nameAr && /[\u0600-\u06FF]/.test(nameAr)) {
    return transliterateArabicName(nameAr);
  }

  return translated;
}

/**
 * Auto-translates a curriculum level name (e.g. "اختبار 1" or "المستوى A1")
 */
export function autoTranslateLevelName(
  nameAr: string | undefined,
  levelNumber: number,
  lang: 'ar' | 'en' | 'fr'
): string {
  if (!nameAr) {
    return lang === 'ar' ? `المستوى ${levelNumber}` : lang === 'fr' ? `Niveau ${levelNumber}` : `Level ${levelNumber}`;
  }
  if (lang === 'ar') return nameAr;

  let translated = nameAr;
  if (lang === 'en') {
    translated = translated
      .replace(/اختبار/g, 'Test')
      .replace(/امتحان/g, 'Exam')
      .replace(/المستوى/g, 'Level')
      .replace(/مستوى/g, 'Level')
      .replace(/المبتدئ/g, 'Beginner')
      .replace(/التأسيس/g, 'Foundation')
      .replace(/المتوسط/g, 'Intermediate')
      .replace(/المتقدم/g, 'Advanced')
      .replace(/التمكن/g, 'Mastery')
      .replace(/الطلاقة/g, 'Fluency')
      .replace(/الأول/g, '1')
      .replace(/الثاني/g, '2')
      .replace(/الثالث/g, '3')
      .replace(/الرابع/g, '4')
      .replace(/الخامس/g, '5')
      .replace(/السادس/g, '6')
      .replace(/السابع/g, '7')
      .replace(/الثامن/g, '8')
      .replace(/التاسع/g, '9')
      .replace(/العاشر/g, '10');
  } else if (lang === 'fr') {
    translated = translated
      .replace(/اختبار/g, 'Test')
      .replace(/امتحان/g, 'Examen')
      .replace(/المستوى/g, 'Niveau')
      .replace(/مستوى/g, 'Niveau')
      .replace(/المبتدئ/g, 'Débutant')
      .replace(/التأسيس/g, 'Fondations')
      .replace(/المتوسط/g, 'Intermédiaire')
      .replace(/المتقدم/g, 'Avancé')
      .replace(/التمكن/g, 'Maîtrise')
      .replace(/الطلاقة/g, 'Aisance')
      .replace(/الأول/g, '1')
      .replace(/الثاني/g, '2')
      .replace(/الثالث/g, '3')
      .replace(/الرابع/g, '4')
      .replace(/الخامس/g, '5')
      .replace(/السادس/g, '6')
      .replace(/السابع/g, '7')
      .replace(/الثامن/g, '8')
      .replace(/التاسع/g, '9')
      .replace(/العاشر/g, '10');
  }

  // If translation still contains Arabic, transliterate it cleanly
  if (/[\u0600-\u06FF]/.test(translated)) {
    return transliterateArabicName(translated) || `${lang === 'fr' ? 'Niveau' : 'Level'} ${levelNumber}`;
  }

  return translated;
}

/**
 * Auto-translates a curriculum unit title
 */
export function autoTranslateUnitTitle(
  titleAr: string | undefined,
  unitNumber: number,
  lang: 'ar' | 'en' | 'fr'
): string {
  if (!titleAr) {
    return lang === 'ar' ? `الوحدة ${unitNumber}` : lang === 'fr' ? `Unité ${unitNumber}` : `Unit ${unitNumber}`;
  }
  if (lang === 'ar') return titleAr;

  let translated = titleAr;
  if (lang === 'en') {
    translated = translated
      .replace(/الوحدة/g, 'Unit')
      .replace(/وحدة/g, 'Unit')
      .replace(/التأسيس/g, 'Foundations')
      .replace(/المفردات/g, 'Vocabulary')
      .replace(/القواعد/g, 'Grammar')
      .replace(/المحادثة/g, 'Conversation')
      .replace(/الاستماع/g, 'Listening')
      .replace(/القراءة/g, 'Reading')
      .replace(/الكتابة/g, 'Writing')
      .replace(/الأولى/g, '1')
      .replace(/الثانية/g, '2')
      .replace(/الثالثة/g, '3')
      .replace(/الرابعة/g, '4')
      .replace(/الخامسة/g, '5');
  } else if (lang === 'fr') {
    translated = translated
      .replace(/الوحدة/g, 'Unité')
      .replace(/وحدة/g, 'Unité')
      .replace(/التأسيس/g, 'Fondations')
      .replace(/المفردات/g, 'Vocabulaire')
      .replace(/القواعد/g, 'Grammaire')
      .replace(/المحادثة/g, 'Conversation')
      .replace(/الاستماع/g, 'Écoute')
      .replace(/القراءة/g, 'Lecture')
      .replace(/الكتابة/g, 'Écriture')
      .replace(/الأولى/g, '1')
      .replace(/الثانية/g, '2')
      .replace(/الثالثة/g, '3')
      .replace(/الرابعة/g, '4')
      .replace(/الخامسة/g, '5');
  }

  if (/[\u0600-\u06FF]/.test(translated)) {
    return `${lang === 'fr' ? 'Unité' : 'Unit'} ${unitNumber}: ${transliterateArabicName(titleAr)}`;
  }

  return translated;
}

/**
 * Auto-translates a curriculum lesson title
 */
export function autoTranslateLessonTitle(
  titleAr: string | undefined,
  lessonNumber: number,
  lang: 'ar' | 'en' | 'fr'
): string {
  if (!titleAr) {
    return lang === 'ar' ? `الدرس ${lessonNumber}` : lang === 'fr' ? `Leçon ${lessonNumber}` : `Lesson ${lessonNumber}`;
  }
  if (lang === 'ar') return titleAr;

  let translated = titleAr;
  if (lang === 'en') {
    translated = translated
      .replace(/الدرس/g, 'Lesson')
      .replace(/درس/g, 'Lesson')
      .replace(/مقدمة في/g, 'Introduction to')
      .replace(/قواعد/g, 'Grammar')
      .replace(/مفردات/g, 'Vocabulary')
      .replace(/محادثة/g, 'Conversation')
      .replace(/استماع/g, 'Listening')
      .replace(/قراءة/g, 'Reading')
      .replace(/كتابة/g, 'Writing')
      .replace(/تمارين/g, 'Exercises')
      .replace(/تطبيق/g, 'Practice');
  } else if (lang === 'fr') {
    translated = translated
      .replace(/الدرس/g, 'Leçon')
      .replace(/درس/g, 'Leçon')
      .replace(/مقدمة في/g, 'Introduction à')
      .replace(/قواعد/g, 'Grammaire')
      .replace(/مفردات/g, 'Vocabulaire')
      .replace(/محادثة/g, 'Conversation')
      .replace(/استماع/g, 'Écoute')
      .replace(/قراءة/g, 'Lecture')
      .replace(/كتابة/g, 'Écriture')
      .replace(/تمارين/g, 'Exercices')
      .replace(/تطبيق/g, 'Pratique');
  }

  if (/[\u0600-\u06FF]/.test(translated)) {
    return `${lang === 'fr' ? 'Leçon' : 'Lesson'} ${lessonNumber}: ${transliterateArabicName(titleAr)}`;
  }

  return translated;
}
