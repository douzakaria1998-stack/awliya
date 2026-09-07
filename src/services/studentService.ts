import { supabase } from '@/lib/supabase/client';
import { AdminStudent, EntityStatus } from '@/types/admin';

export async function fetchStudentsFromDb(): Promise<AdminStudent[]> {
  const { data, error } = await supabase
    .from('students')
    .select(`
      *,
      groups:group_id (
        id,
        name,
        code,
        teachers:teacher_id (
          id,
          full_name_ar,
          full_name_en
        )
      ),
      parents:parent_id (
        id,
        full_name_ar,
        full_name_en,
        phone,
        email
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching students from Supabase:', error);
    return [];
  }

  return (data || []).map((row: any): AdminStudent => ({
    id: row.id,
    fullNameAr: row.full_name_ar,
    fullNameEn: row.full_name_en || '',
    nicknameAr: row.nickname_ar || '',
    dateOfBirth: row.date_of_birth || '',
    gender: row.gender || 'male',
    currentLevel: row.current_level || 1,
    cefrLevel: row.cefr_level || 'A1',
    enrolledPathAr: row.enrolled_path_ar || 'المسار الأساسي',
    enrolledPathEn: row.enrolled_path_en || 'Standard Path',
    language: row.language || 'English',
    groupId: row.group_id || '',
    groupName: row.groups?.name || 'بدون فوج',
    teacherId: row.groups?.teachers?.id || '',
    teacherName: row.groups?.teachers?.full_name_ar || 'غير محدد',
    parentId: row.parent_id || '',
    parentName: row.parents?.full_name_ar || 'غير محدد',
    parentPhone: row.parents?.phone || '',
    parentEmail: row.parents?.email || '',
    relationship: row.relationship || 'أب',
    enrollmentDate: row.enrollment_date || row.created_at?.split('T')[0] || '',
    status: (row.status as EntityStatus) || 'active',
    overallProgress: Number(row.overall_progress || 0),
    attendanceRate: Number(row.attendance_rate !== null && row.attendance_rate !== undefined ? row.attendance_rate : 0),
    averagePerformance: Number(row.average_performance !== null && row.average_performance !== undefined ? row.average_performance : 0),
    completedLessonsCount: row.completed_lessons_count || 0,
    totalLessonsCount: row.total_lessons_count || 24,
    isFallingBehind: Boolean(row.is_falling_behind),
    skills: {
      listening: Number(row.skills_listening !== null && row.skills_listening !== undefined ? row.skills_listening : 0),
      speaking: Number(row.skills_speaking !== null && row.skills_speaking !== undefined ? row.skills_speaking : 0),
      reading: Number(row.skills_reading !== null && row.skills_reading !== undefined ? row.skills_reading : 0),
      writing: Number(row.skills_writing !== null && row.skills_writing !== undefined ? row.skills_writing : 0),
      overall: Math.round(
        (Number(row.skills_listening !== null && row.skills_listening !== undefined ? row.skills_listening : 0) +
          Number(row.skills_speaking !== null && row.skills_speaking !== undefined ? row.skills_speaking : 0) +
          Number(row.skills_reading !== null && row.skills_reading !== undefined ? row.skills_reading : 0) +
          Number(row.skills_writing !== null && row.skills_writing !== undefined ? row.skills_writing : 0)) / 4
      ),
    },
  }));
}

export async function createStudentInDb(student: Partial<AdminStudent>): Promise<AdminStudent | null> {
  const insertPayload = {
    full_name_ar: student.fullNameAr || 'طالب جديد',
    full_name_en: student.fullNameEn || 'New Student',
    nickname_ar: student.nicknameAr || null,
    date_of_birth: student.dateOfBirth || null,
    gender: student.gender || 'male',
    current_level: student.currentLevel || 1,
    cefr_level: student.cefrLevel || 'A1',
    enrolled_path_ar: student.enrolledPathAr || 'المسار الأكاديمي الأساسي',
    enrolled_path_en: student.enrolledPathEn || 'Core Academic Track',
    language: student.language || 'English',
    group_id: student.groupId && student.groupId.length > 10 ? student.groupId : null,
    parent_id: student.parentId && student.parentId.length > 10 ? student.parentId : null,
    relationship: student.relationship || 'أب',
    status: student.status || 'active',
    overall_progress: student.overallProgress ?? 0,
    attendance_rate: student.attendanceRate ?? 0,
    average_performance: student.averagePerformance ?? 0,
    completed_lessons_count: student.completedLessonsCount ?? 0,
    total_lessons_count: student.totalLessonsCount ?? 24,
    skills_listening: student.skills?.listening ?? 0,
    skills_speaking: student.skills?.speaking ?? 0,
    skills_reading: student.skills?.reading ?? 0,
    skills_writing: student.skills?.writing ?? 0,
  };

  const { data, error } = await supabase
    .from('students')
    .insert(insertPayload)
    .select()
    .single();

  if (error) {
    console.error('Error creating student in Supabase:', error);
    return null;
  }

  if (student.parentId && data?.id) {
    await supabase.from('parent_students').upsert({
      parent_id: student.parentId,
      student_id: data.id,
      relationship: student.relationship || 'أب',
    });
  }

  return {
    ...student,
    id: data.id,
    groupName: student.groupName || 'بدون فوج',
    teacherName: student.teacherName || 'غير محدد',
    parentName: student.parentName || 'غير محدد',
    parentPhone: student.parentPhone || '',
    skills: student.skills || { listening: 0, speaking: 0, reading: 0, writing: 0, overall: 0 },
  } as AdminStudent;
}

export async function updateStudentInDb(id: string, updates: Partial<AdminStudent>): Promise<void> {
  if (!id || id.startsWith('stu-')) return; // skip mock non-uuid IDs
  const updatePayload: Record<string, any> = {};

  if (updates.fullNameAr !== undefined) updatePayload.full_name_ar = updates.fullNameAr;
  if (updates.fullNameEn !== undefined) updatePayload.full_name_en = updates.fullNameEn;
  if (updates.nicknameAr !== undefined) updatePayload.nickname_ar = updates.nicknameAr;
  if (updates.dateOfBirth !== undefined) updatePayload.date_of_birth = updates.dateOfBirth || null;
  if (updates.gender !== undefined) updatePayload.gender = updates.gender;
  if (updates.bloodType !== undefined) updatePayload.blood_type = updates.bloodType;
  if (updates.currentLevel !== undefined) updatePayload.current_level = updates.currentLevel;
  if (updates.cefrLevel !== undefined) updatePayload.cefr_level = updates.cefrLevel;
  if (updates.enrolledPathAr !== undefined) updatePayload.enrolled_path_ar = updates.enrolledPathAr;
  if (updates.enrolledPathEn !== undefined) updatePayload.enrolled_path_en = updates.enrolledPathEn;
  if (updates.language !== undefined) updatePayload.language = updates.language;
  if (updates.groupId !== undefined) updatePayload.group_id = updates.groupId && updates.groupId.length > 10 ? updates.groupId : null;
  if (updates.parentId !== undefined) updatePayload.parent_id = updates.parentId && updates.parentId.length > 10 ? updates.parentId : null;
  if (updates.relationship !== undefined) updatePayload.relationship = updates.relationship;
  if (updates.avatarUrl !== undefined) updatePayload.avatar_url = updates.avatarUrl;
  if (updates.status !== undefined) updatePayload.status = updates.status;
  if (updates.overallProgress !== undefined) updatePayload.overall_progress = updates.overallProgress;
  if (updates.attendanceRate !== undefined) updatePayload.attendance_rate = updates.attendanceRate;
  if (updates.averagePerformance !== undefined) updatePayload.average_performance = updates.averagePerformance;
  if (updates.completedLessonsCount !== undefined) updatePayload.completed_lessons_count = updates.completedLessonsCount;
  if (updates.totalLessonsCount !== undefined) updatePayload.total_lessons_count = updates.totalLessonsCount;
  
  if (updates.skills) {
    if (updates.skills.listening !== undefined) updatePayload.skills_listening = updates.skills.listening;
    if (updates.skills.speaking !== undefined) updatePayload.skills_speaking = updates.skills.speaking;
    if (updates.skills.reading !== undefined) updatePayload.skills_reading = updates.skills.reading;
    if (updates.skills.writing !== undefined) updatePayload.skills_writing = updates.skills.writing;
  }

  if (Object.keys(updatePayload).length === 0) return;

  const { error } = await supabase.from('students').update(updatePayload).eq('id', id);
  if (error) {
    console.error('Error updating student in Supabase:', error);
  }
}

export async function deleteStudentFromDb(id: string): Promise<void> {
  if (!id || id.startsWith('stu-')) return;
  const { error } = await supabase.from('students').delete().eq('id', id);
  if (error) {
    console.error('Error deleting student from Supabase:', error);
  }
}
