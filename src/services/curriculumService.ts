import { supabase } from '@/lib/supabase/client';
import { CurriculumLevel } from '@/types/admin';

export async function fetchCurriculaFromDb(): Promise<CurriculumLevel[]> {
  const { data, error } = await supabase
    .from('curricula')
    .select('*')
    .order('level_number', { ascending: true });

  if (error) {
    console.warn('Error fetching curricula from Supabase (falling back):', error.message);
    return [];
  }

  if (!data || data.length === 0) {
    return [];
  }

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

export async function saveCurriculumLevelInDb(levelData: CurriculumLevel): Promise<void> {
  const payload = {
    level_number: levelData.levelNumber,
    language: levelData.language,
    cefr_code: levelData.cefrCode,
    name_ar: levelData.nameAr,
    name_en: levelData.nameEn,
    description_ar: levelData.descriptionAr,
    description_en: levelData.descriptionEn,
    color: levelData.color,
    passing_score: levelData.passingScore || 93,
    honors_degree_ar: levelData.honorsDegreeAr || 'تقدير: ممتاز مرتفع (مع مرتبة الشرف)',
    honors_degree_en: levelData.honorsDegreeEn,
    units: levelData.units,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('curricula')
    .upsert(payload, { onConflict: 'level_number,language' });

  if (error) {
    console.warn('Error saving curriculum level in Supabase:', error.message);
  }
}

export async function deleteCurriculumLevelInDb(levelNumber: number, language: 'English' | 'French'): Promise<void> {
  const { error } = await supabase
    .from('curricula')
    .delete()
    .eq('level_number', levelNumber)
    .eq('language', language);

  if (error) {
    console.warn('Error deleting curriculum level from Supabase:', error.message);
  }
}

export async function saveAllCurriculaInDb(curricula: CurriculumLevel[]): Promise<void> {
  if (!curricula || curricula.length === 0) return;

  const payloads = curricula.map((lvl) => ({
    level_number: lvl.levelNumber,
    language: lvl.language,
    cefr_code: lvl.cefrCode,
    name_ar: lvl.nameAr,
    name_en: lvl.nameEn,
    description_ar: lvl.descriptionAr,
    description_en: lvl.descriptionEn,
    color: lvl.color,
    passing_score: lvl.passingScore || 93,
    honors_degree_ar: lvl.honorsDegreeAr || 'تقدير: ممتاز مرتفع (مع مرتبة الشرف)',
    honors_degree_en: lvl.honorsDegreeEn,
    units: lvl.units,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from('curricula')
    .upsert(payloads, { onConflict: 'level_number,language' });

  if (error) {
    console.warn('Error saving curricula list in Supabase:', error.message);
  }
}
