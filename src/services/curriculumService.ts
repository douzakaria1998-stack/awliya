import { supabase } from '@/lib/supabase/client';
import { CurriculumLevel } from '@/types/admin';

const SYSTEM_CURRICULA_CATEGORY = 'system_curricula';
const SYSTEM_CURRICULA_TITLE = 'ACTIVE_ACADEMIC_PATH';

export async function fetchCurriculaFromDb(): Promise<CurriculumLevel[]> {
  try {
    // Strategy 1: Dedicated curricula table
    const { data: tableData, error: tableError } = await supabase
      .from('curricula')
      .select('*')
      .order('level_number', { ascending: true });

    if (!tableError && tableData && tableData.length > 0) {
      return tableData.map((row: any) => ({
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
  } catch {
    // Continue to Strategy 2
  }

  try {
    // Strategy 2: System Config Announcement Record (works on all Supabase instances immediately)
    const { data: annData, error: annError } = await supabase
      .from('announcements')
      .select('*')
      .eq('category', SYSTEM_CURRICULA_CATEGORY)
      .order('created_at', { ascending: false })
      .limit(1);

    if (!annError && annData && annData.length > 0 && annData[0].content) {
      const parsed = JSON.parse(annData[0].content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Return empty on error
  }

  return [];
}

export async function saveAllCurriculaInDb(curricula: CurriculumLevel[]): Promise<void> {
  if (!curricula || curricula.length === 0) return;

  // 1. Save to dedicated curricula table if available
  try {
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

    await supabase
      .from('curricula')
      .upsert(payloads, { onConflict: 'level_number,language' });
  } catch {
    // Ignore table creation error
  }

  // 2. Guaranteed cloud sync via system announcement payload
  try {
    const jsonString = JSON.stringify(curricula);
    const { data: existing } = await supabase
      .from('announcements')
      .select('id')
      .eq('category', SYSTEM_CURRICULA_CATEGORY)
      .limit(1);

    if (existing && existing.length > 0) {
      await supabase
        .from('announcements')
        .update({
          content: jsonString,
          title: SYSTEM_CURRICULA_TITLE,
          published_at: new Date().toISOString(),
        })
        .eq('id', existing[0].id);
    } else {
      await supabase.from('announcements').insert({
        title: SYSTEM_CURRICULA_TITLE,
        content: jsonString,
        category: SYSTEM_CURRICULA_CATEGORY,
        target_role: 'all',
        priority: 'low',
      });
    }
  } catch (err) {
    console.warn('Error syncing curricula bundle to Supabase:', err);
  }
}

export async function saveCurriculumLevelInDb(levelData: CurriculumLevel): Promise<void> {
  // Update single level in curricula table
  try {
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

    await supabase
      .from('curricula')
      .upsert(payload, { onConflict: 'level_number,language' });
  } catch {
    // Continue
  }

  // Update full cloud bundle
  try {
    const current = await fetchCurriculaFromDb();
    const existingIdx = current.findIndex(
      (c) => c.levelNumber === levelData.levelNumber && c.language === levelData.language
    );
    let updated: CurriculumLevel[];
    if (existingIdx >= 0) {
      updated = current.map((c, i) => (i === existingIdx ? levelData : c));
    } else {
      updated = [...current, levelData];
    }
    await saveAllCurriculaInDb(updated);
  } catch {
    // Ignore
  }
}

export async function deleteCurriculumLevelInDb(levelNumber: number, language: 'English' | 'French'): Promise<void> {
  try {
    await supabase
      .from('curricula')
      .delete()
      .eq('level_number', levelNumber)
      .eq('language', language);
  } catch {
    // Continue
  }

  try {
    const current = await fetchCurriculaFromDb();
    const filtered = current.filter(
      (c) => !(c.levelNumber === levelNumber && c.language === language)
    );
    const sameLang = filtered.filter((c) => c.language === language).map((lvl, idx) => ({ ...lvl, levelNumber: idx + 1 }));
    const otherLang = filtered.filter((c) => c.language !== language);
    await saveAllCurriculaInDb([...otherLang, ...sameLang]);
  } catch {
    // Ignore
  }
}
