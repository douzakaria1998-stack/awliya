import { supabase } from '@/lib/supabase/client';
import { CurriculumLevel } from '@/types/admin';

const SYSTEM_CURRICULA_ANNOUNCEMENT_TITLE = 'SYSTEM_CURRICULA_CONFIG';
const SYSTEM_CURRICULA_CATEGORY = 'system_curricula';

export async function fetchCurriculaFromDb(): Promise<CurriculumLevel[]> {
  try {
    // 1. Try dedicated curricula table
    const { data, error } = await supabase
      .from('curricula')
      .select('*')
      .order('level_number', { ascending: true });

    if (!error && Array.isArray(data) && data.length > 0) {
      return data.map((row: any) => ({
        levelNumber: row.level_number,
        cefrCode: row.cefr_code || 'A1',
        nameAr: row.name_ar,
        nameEn: row.name_en || row.name_ar,
        descriptionAr: row.description_ar || '',
        descriptionEn: row.description_en || '',
        color: row.color || '#84CC16',
        language: row.language || 'English',
        passingScore: row.passing_score ? Number(row.passing_score) : 93,
        honorsDegreeAr: row.honors_degree_ar || 'تقدير: ممتاز مرتفع (مع مرتبة الشرف)',
        honorsDegreeEn: row.honors_degree_en,
        units: Array.isArray(row.units) ? row.units : typeof row.units === 'string' ? JSON.parse(row.units) : [],
      }));
    }
  } catch (e) {
    // Fall through to announcements config
  }

  try {
    // 2. Fallback to announcements config row (guaranteed to work across all devices)
    const { data: configRow } = await supabase
      .from('announcements')
      .select('content')
      .eq('category', SYSTEM_CURRICULA_CATEGORY)
      .eq('title', SYSTEM_CURRICULA_ANNOUNCEMENT_TITLE)
      .order('published_at', { ascending: false })
      .limit(1);

    if (configRow && configRow.length > 0 && configRow[0].content) {
      const parsed = typeof configRow[0].content === 'string' ? JSON.parse(configRow[0].content) : configRow[0].content;
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error fetching fallback curricula from Supabase:', err);
  }

  return [];
}

export async function saveAllCurriculaInDb(curricula: CurriculumLevel[]): Promise<void> {
  if (!curricula || !Array.isArray(curricula) || curricula.length === 0) return;

  // 1. Save to dedicated table if available
  try {
    const payloads = curricula.map((lvl) => ({
      level_number: lvl.levelNumber,
      language: lvl.language || 'English',
      cefr_code: lvl.cefrCode || 'A1',
      name_ar: lvl.nameAr,
      name_en: lvl.nameEn || lvl.nameAr,
      description_ar: lvl.descriptionAr || '',
      description_en: lvl.descriptionEn || '',
      color: lvl.color || '#84CC16',
      passing_score: lvl.passingScore || 93,
      honors_degree_ar: lvl.honorsDegreeAr || 'تقدير: ممتاز مرتفع (مع مرتبة الشرف)',
      honors_degree_en: lvl.honorsDegreeEn,
      units: lvl.units || [],
      updated_at: new Date().toISOString(),
    }));

    // Delete existing to avoid keeping removed levels
    await supabase.from('curricula').delete().neq('level_number', -999);
    await supabase.from('curricula').insert(payloads);
  } catch (e) {
    // Silently ignore if table doesn't exist
  }

  // 2. Always persist full config JSON to announcements table
  try {
    const jsonContent = JSON.stringify(curricula);
    const { data: existing } = await supabase
      .from('announcements')
      .select('id')
      .eq('category', SYSTEM_CURRICULA_CATEGORY)
      .eq('title', SYSTEM_CURRICULA_ANNOUNCEMENT_TITLE)
      .limit(1);

    if (existing && existing.length > 0) {
      await supabase
        .from('announcements')
        .update({
          content: jsonContent,
          published_at: new Date().toISOString(),
        })
        .eq('id', existing[0].id);
    } else {
      await supabase.from('announcements').insert({
        title: SYSTEM_CURRICULA_ANNOUNCEMENT_TITLE,
        content: jsonContent,
        category: SYSTEM_CURRICULA_CATEGORY,
        target_role: 'all',
        published_at: new Date().toISOString(),
      });
    }
  } catch (err) {
    console.warn('Error syncing curricula config in Supabase:', err);
  }
}

export async function saveCurriculumLevelInDb(levelData: CurriculumLevel): Promise<void> {
  const allCurricula = await fetchCurriculaFromDb();
  const existingIdx = allCurricula.findIndex(
    (c) => c.levelNumber === levelData.levelNumber && c.language === levelData.language
  );
  let updated: CurriculumLevel[];
  if (existingIdx >= 0) {
    updated = allCurricula.map((c, i) => (i === existingIdx ? levelData : c));
  } else {
    updated = [...allCurricula, levelData];
  }
  await saveAllCurriculaInDb(updated);
}

export async function deleteCurriculumLevelInDb(levelNumber: number, language: 'English' | 'French'): Promise<void> {
  const allCurricula = await fetchCurriculaFromDb();
  const filtered = allCurricula.filter((c) => !(c.levelNumber === levelNumber && c.language === language));
  const sameLang = filtered.filter((c) => c.language === language).map((lvl, idx) => ({ ...lvl, levelNumber: idx + 1 }));
  const otherLang = filtered.filter((c) => c.language !== language);
  const updated = [...otherLang, ...sameLang];

  try {
    await supabase
      .from('curricula')
      .delete()
      .eq('level_number', levelNumber)
      .eq('language', language);
  } catch (e) {}

  await saveAllCurriculaInDb(updated);
}
