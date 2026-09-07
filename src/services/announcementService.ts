import { supabase } from '@/lib/supabase/client';

export interface AnnouncementPayload {
  title: string;
  content: string;
  category?: string;
  targetRole?: 'all' | 'parent' | 'teacher' | 'student' | 'admin';
  priority?: 'urgent' | 'normal' | 'low';
  groupId?: string;
}

export async function createAnnouncementInDb(payload: AnnouncementPayload): Promise<void> {
  const { error } = await supabase.from('announcements').insert({
    title: payload.title,
    content: payload.content,
    category: payload.category || 'general',
    target_role: payload.targetRole || 'all',
    priority: payload.priority || 'normal',
    group_id: payload.groupId && !payload.groupId.startsWith('grp-') ? payload.groupId : null,
  });

  if (error) {
    console.error('Error creating announcement in Supabase:', error);
  }
}
