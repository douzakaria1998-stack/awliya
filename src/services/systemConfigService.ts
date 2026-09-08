import { supabase } from '@/lib/supabase/client';

export interface SystemConfigPayload {
  key: string;
  data: any;
  updatedAt: string;
}

/**
 * Saves a system-wide configuration JSON (like curricula, custom level colors, active settings)
 * to Supabase so that all devices (laptop, mobile, tablets) share the exact same state.
 */
export async function saveSystemConfigInDb(configKey: string, data: any): Promise<void> {
  try {
    const serialized = JSON.stringify(data);
    const titleKey = `config_${configKey}`;

    // Upsert into announcements with category 'system_config'
    const { data: existing } = await supabase
      .from('announcements')
      .select('id')
      .eq('category', 'system_config')
      .eq('title', titleKey)
      .limit(1);

    if (existing && existing.length > 0) {
      await supabase
        .from('announcements')
        .update({
          content: serialized,
          published_at: new Date().toISOString(),
        })
        .eq('id', existing[0].id);
    } else {
      await supabase.from('announcements').insert({
        title: titleKey,
        content: serialized,
        category: 'system_config',
        target_role: 'all',
        priority: 'normal',
      });
    }
  } catch (err) {
    console.warn(`Error saving system config '${configKey}' to Supabase:`, err);
  }
}

/**
 * Fetches a system-wide configuration JSON from Supabase.
 */
export async function fetchSystemConfigFromDb<T = any>(configKey: string): Promise<T | null> {
  try {
    const titleKey = `config_${configKey}`;
    const { data, error } = await supabase
      .from('announcements')
      .select('content')
      .eq('category', 'system_config')
      .eq('title', titleKey)
      .order('published_at', { ascending: false })
      .limit(1);

    if (error || !data || data.length === 0) {
      return null;
    }

    const content = data[0].content;
    if (!content) return null;

    return JSON.parse(content) as T;
  } catch (err) {
    console.warn(`Error fetching system config '${configKey}' from Supabase:`, err);
    return null;
  }
}
