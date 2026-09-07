import { supabase } from '@/lib/supabase/client';
import { Homework } from '@/types';
import { AdminHomeworkAssignment } from '@/types/admin';

export async function fetchHomeworkFromDb(studentId?: string): Promise<Homework[]> {
  let query = supabase.from('homeworks').select('*').order('created_at', { ascending: false });
  if (studentId) {
    query = query.eq('student_id', studentId);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching homework from Supabase:', error);
    return [];
  }

  return (data || []).map((h: any) => ({
    id: h.id,
    studentId: h.student_id,
    titleAr: h.title_ar,
    subjectAr: h.subject_ar,
    level: h.level || 1,
    status: h.status,
    dueDate: h.due_date || '',
    submittedDate: h.submitted_date,
    teacherNote: h.teacher_note,
    score: h.score ? Number(h.score) : undefined,
    totalScore: h.total_score ? Number(h.total_score) : 20,
  }));
}

export async function createHomeworkInDb(hw: Partial<AdminHomeworkAssignment>): Promise<void> {
  if (!hw.studentIds || hw.studentIds.length === 0) return;

  const records = hw.studentIds
    .filter((stId) => !stId.startsWith('stu-'))
    .map((stId) => ({
      student_id: stId,
      group_id: hw.groupId && !hw.groupId.startsWith('grp-') ? hw.groupId : null,
      title_ar: hw.assignmentNameAr || 'واجب دراسي جديد',
      subject_ar: 'اللغة الإنجليزية',
      level: 1,
      status: 'pending',
      due_date: hw.dueDate || null,
      total_score: hw.totalScore || 20,
    }));

  if (records.length === 0) return;

  const { error } = await supabase.from('homeworks').insert(records);
  if (error) {
    console.error('Error creating homeworks in Supabase:', error);
  }
}

export async function evaluateHomeworkInDb(
  homeworkId: string,
  score: number,
  comment: string,
  status: 'completed' | 'needs_revision'
): Promise<void> {
  if (!homeworkId || homeworkId.startsWith('hw-')) return;

  const { error } = await supabase
    .from('homeworks')
    .update({
      score,
      teacher_note: comment,
      status,
      submitted_date: new Date().toISOString().split('T')[0],
    })
    .eq('id', homeworkId);

  if (error) {
    console.error('Error evaluating homework in Supabase:', error);
  }
}
