import { supabase } from '@/lib/supabase/client';
import { AttendanceRecord } from '@/types';

export async function fetchAttendanceFromDb(studentId?: string): Promise<AttendanceRecord[]> {
  let query = supabase.from('attendance').select('*').order('date', { ascending: false });
  if (studentId) {
    query = query.eq('student_id', studentId);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching attendance from Supabase:', error);
    return [];
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    studentId: row.student_id,
    date: row.date,
    dayNameAr: row.day_name_ar || 'اليوم',
    subjectAr: row.subject_ar || 'اللغة الإنجليزية',
    status: row.status,
    noteAr: row.note_ar || '',
    sessionTimeAr: row.session_time_ar || '18:00 - 20:00',
    isCoveringSession: Boolean(row.is_covering_session),
    coveringType: row.covering_type,
    coveringReason: row.covering_reason,
  }));
}

export async function saveAttendanceRecordsInDb(
  groupId: string,
  records: { studentId: string; status: 'present' | 'late' | 'absent' | 'excused'; note?: string }[],
  sessionMeta?: {
    date: string;
    dayNameAr: string;
    sessionTime?: string;
    subjectAr?: string;
    isCoveringSession?: boolean;
    coveringType?: string;
    coveringReason?: string;
  }
): Promise<void> {
  const insertPayload = records
    .filter((r) => r.studentId && !r.studentId.startsWith('stu-')) // only persist valid UUIDs or real rows
    .map((r) => ({
      student_id: r.studentId,
      group_id: groupId && !groupId.startsWith('grp-') ? groupId : null,
      date: sessionMeta?.date || new Date().toISOString().split('T')[0],
      day_name_ar: sessionMeta?.dayNameAr || 'اليوم',
      subject_ar: sessionMeta?.subjectAr || 'اللغة الإنجليزية',
      status: r.status,
      note_ar: r.note || null,
      session_time_ar: sessionMeta?.sessionTime || '18:00 - 20:00',
      is_covering_session: Boolean(sessionMeta?.isCoveringSession),
      covering_type: sessionMeta?.coveringType || null,
      covering_reason: sessionMeta?.coveringReason || null,
    }));

  if (insertPayload.length === 0) return;

  const { error } = await supabase.from('attendance').insert(insertPayload);
  if (error) {
    console.error('Error saving attendance in Supabase:', error);
  }
}
