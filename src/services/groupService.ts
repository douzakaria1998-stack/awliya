import { supabase } from '@/lib/supabase/client';
import { AdminGroup, AdminTeacher, EntityStatus } from '@/types/admin';

export async function fetchGroupsFromDb(): Promise<AdminGroup[]> {
  const { data, error } = await supabase
    .from('groups')
    .select(`
      *,
      teachers:teacher_id (
        id,
        full_name_ar,
        full_name_en
      ),
      students (
        id
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching groups from Supabase:', error);
    return [];
  }

  return (data || []).map((row: any): AdminGroup => ({
    id: row.id,
    name: row.name,
    code: row.code,
    language: row.language || 'English',
    level: row.level || 'A1',
    levelNumber: row.level_number || 1,
    teacherId: row.teacher_id || '',
    teacherName: row.teachers?.full_name_ar || 'غير محدد',
    daysAr: row.days_ar || 'الأحد / الثلاثاء',
    daysEn: row.days_en || 'Sun / Tue',
    startTime: row.start_time || '18:00',
    endTime: row.end_time || '20:00',
    maxCapacity: row.max_capacity || 20,
    studentIds: (row.students || []).map((s: any) => s.id),
    attendanceRate: Number(row.attendance_rate || 90),
    averageProgress: Number(row.average_progress || 60),
    averagePerformance: Number(row.average_performance || 75),
    completedLessonsCount: row.completed_lessons_count || 12,
    totalLessonsCount: row.total_lessons_count || 24,
    status: (row.status as EntityStatus) || 'active',
  }));
}

export async function fetchTeachersFromDb(): Promise<AdminTeacher[]> {
  const { data, error } = await supabase
    .from('teachers')
    .select(`
      *,
      groups (
        id
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching teachers from Supabase:', error);
    return [];
  }

  return (data || []).map((row: any): AdminTeacher => ({
    id: row.id,
    fullNameAr: row.full_name_ar,
    fullNameEn: row.full_name_en || '',
    username: row.username || '',
    email: row.email || '',
    phone: row.phone || '',
    languagesTaught: row.languages_taught || ['English'],
    specialization: row.specialization || '',
    experience: row.experience || '',
    assignedGroupIds: (row.groups || []).map((g: any) => g.id),
    status: (row.status as EntityStatus) || 'active',
    createdAt: row.created_at?.split('T')[0] || '',
  }));
}

export async function createGroupInDb(group: Partial<AdminGroup>): Promise<AdminGroup | null> {
  const { data, error } = await supabase
    .from('groups')
    .insert({
      name: group.name || 'فوج جديد',
      code: group.code || `G-${Date.now().toString().slice(-4)}`,
      language: group.language || 'English',
      level: group.level || 'A1',
      level_number: group.levelNumber || 1,
      teacher_id: group.teacherId && group.teacherId.length > 10 ? group.teacherId : null,
      days_ar: group.daysAr || 'الأحد / الثلاثاء',
      days_en: group.daysEn || 'Sun / Tue',
      start_time: group.startTime || '18:00',
      end_time: group.endTime || '20:00',
      max_capacity: group.maxCapacity || 20,
      status: group.status || 'active',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating group in Supabase:', error);
    return null;
  }

  return {
    ...group,
    id: data.id,
    studentIds: [],
  } as AdminGroup;
}

export async function updateGroupInDb(id: string, updates: Partial<AdminGroup>): Promise<void> {
  if (!id || id.startsWith('grp-')) return;
  const updatePayload: Record<string, any> = {};

  if (updates.name !== undefined) updatePayload.name = updates.name;
  if (updates.code !== undefined) updatePayload.code = updates.code;
  if (updates.language !== undefined) updatePayload.language = updates.language;
  if (updates.level !== undefined) updatePayload.level = updates.level;
  if (updates.levelNumber !== undefined) updatePayload.level_number = updates.levelNumber;
  if (updates.teacherId !== undefined) updatePayload.teacher_id = updates.teacherId && updates.teacherId.length > 10 ? updates.teacherId : null;
  if (updates.daysAr !== undefined) updatePayload.days_ar = updates.daysAr;
  if (updates.daysEn !== undefined) updatePayload.days_en = updates.daysEn;
  if (updates.startTime !== undefined) updatePayload.start_time = updates.startTime;
  if (updates.endTime !== undefined) updatePayload.end_time = updates.endTime;
  if (updates.maxCapacity !== undefined) updatePayload.max_capacity = updates.maxCapacity;
  if (updates.status !== undefined) updatePayload.status = updates.status;

  if (Object.keys(updatePayload).length === 0) return;

  const { error } = await supabase.from('groups').update(updatePayload).eq('id', id);
  if (error) {
    console.error('Error updating group in Supabase:', error);
  }
}

export async function deleteGroupFromDb(id: string): Promise<void> {
  if (!id || id.startsWith('grp-')) return;
  const { error } = await supabase.from('groups').delete().eq('id', id);
  if (error) {
    console.error('Error deleting group from Supabase:', error);
  }
}

export async function createTeacherInDb(teacher: Partial<AdminTeacher>): Promise<AdminTeacher | null> {
  const { data, error } = await supabase
    .from('teachers')
    .insert({
      full_name_ar: teacher.fullNameAr || 'معلم جديد',
      full_name_en: teacher.fullNameEn || null,
      username: teacher.username || `teacher_${Date.now()}`,
      email: teacher.email || null,
      phone: teacher.phone || null,
      languages_taught: teacher.languagesTaught || ['English'],
      specialization: teacher.specialization || null,
      experience: teacher.experience || null,
      status: teacher.status || 'active',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating teacher in Supabase:', error);
    return null;
  }

  return {
    ...teacher,
    id: data.id,
    assignedGroupIds: [],
    createdAt: data.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
  } as AdminTeacher;
}

export async function updateTeacherInDb(id: string, updates: Partial<AdminTeacher>): Promise<void> {
  if (!id || id.startsWith('usr-') || id.startsWith('tch-')) return;
  const updatePayload: Record<string, any> = {};

  if (updates.fullNameAr !== undefined) updatePayload.full_name_ar = updates.fullNameAr;
  if (updates.fullNameEn !== undefined) updatePayload.full_name_en = updates.fullNameEn;
  if (updates.username !== undefined) updatePayload.username = updates.username;
  if (updates.email !== undefined) updatePayload.email = updates.email || null;
  if (updates.phone !== undefined) updatePayload.phone = updates.phone || null;
  if (updates.languagesTaught !== undefined) updatePayload.languages_taught = updates.languagesTaught;
  if (updates.specialization !== undefined) updatePayload.specialization = updates.specialization || null;
  if (updates.experience !== undefined) updatePayload.experience = updates.experience || null;
  if (updates.status !== undefined) updatePayload.status = updates.status;

  if (Object.keys(updatePayload).length === 0) return;

  const { error } = await supabase.from('teachers').update(updatePayload).eq('id', id);
  if (error) {
    console.error('Error updating teacher in Supabase:', error);
  }
}

export async function deleteTeacherFromDb(id: string): Promise<void> {
  if (!id || id.startsWith('usr-') || id.startsWith('tch-')) return;
  const { error } = await supabase.from('teachers').delete().eq('id', id);
  if (error) {
    console.error('Error deleting teacher from Supabase:', error);
  }
}
