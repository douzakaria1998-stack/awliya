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
