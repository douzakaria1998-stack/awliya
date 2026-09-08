import { supabase } from '@/lib/supabase/client';
import { Student, AttendanceRecord, Homework, Notification } from '@/types';

export async function fetchParentPortalBundle(parentId?: string) {
  // 1. Fetch Students
  let studentQuery = supabase.from('students').select('*').order('created_at', { ascending: true });
  if (parentId) {
    studentQuery = studentQuery.eq('parent_id', parentId);
  }
  const { data: studentsData } = await studentQuery;

  // 2. Fetch Announcements/Notifications (excluding internal system configs)
  const { data: announcementsData } = await supabase
    .from('announcements')
    .select('*')
    .neq('category', 'system_curricula')
    .order('published_at', { ascending: false });

  // 3. Fetch Homeworks
  const { data: homeworksData } = await supabase
    .from('homeworks')
    .select('*')
    .order('created_at', { ascending: false });

  // 4. Fetch Attendance
  const { data: attendanceData } = await supabase
    .from('attendance')
    .select('*')
    .order('date', { ascending: false });

  // 5. Fetch Invoices
  const { data: invoicesData } = await supabase
    .from('invoices')
    .select('*')
    .order('due_date', { ascending: false });

  const students: Student[] = (studentsData || []).map((s: any) => ({
    id: s.id,
    parentId: s.parent_id || '',
    fullNameAr: s.full_name_ar,
    firstNameAr: s.full_name_ar.split(' ')[0] || '',
    lastNameAr: s.full_name_ar.split(' ').slice(1).join(' ') || '',
    birthday: s.date_of_birth || '',
    schoolLevelAr: s.cefr_level || 'A1',
    nicknameAr: s.nickname_ar || '',
    enrolledPathAr: s.enrolled_path_ar || 'المسار الأكاديمي الأساسي',
    currentLevel: (s.current_level || 1) as any,
    currentLevelProgress: Number(s.overall_progress || 0),
    avatarUrl: s.avatar_url || '',
    studentIdNumber: s.matricule || s.id.slice(0, 8),
    academicYearAr: '2024 - 2025',
    branchAr: 'الفرع الرئيسي',
    gender: s.gender || 'male',
    status: s.status || 'active',
    enrollmentDate: s.enrollment_date || s.created_at?.split('T')[0] || '',
    age: s.date_of_birth ? new Date().getFullYear() - new Date(s.date_of_birth).getFullYear() : 11,
    attendanceRate: Number(s.attendance_rate !== null && s.attendance_rate !== undefined ? s.attendance_rate : 0),
    averagePerformance: Number(s.average_performance !== null && s.average_performance !== undefined ? s.average_performance : 0),
    skills: {
      listening: Number(s.skills_listening !== null && s.skills_listening !== undefined ? s.skills_listening : 0),
      speaking: Number(s.skills_speaking !== null && s.skills_speaking !== undefined ? s.skills_speaking : 0),
      reading: Number(s.skills_reading !== null && s.skills_reading !== undefined ? s.skills_reading : 0),
      writing: Number(s.skills_writing !== null && s.skills_writing !== undefined ? s.skills_writing : 0),
      overall: Math.round(
        (Number(s.skills_listening !== null && s.skills_listening !== undefined ? s.skills_listening : 0) +
          Number(s.skills_speaking !== null && s.skills_speaking !== undefined ? s.skills_speaking : 0) +
          Number(s.skills_reading !== null && s.skills_reading !== undefined ? s.skills_reading : 0) +
          Number(s.skills_writing !== null && s.skills_writing !== undefined ? s.skills_writing : 0)) / 4
      ),
    },
  }));

  const attendance: AttendanceRecord[] = (attendanceData || []).map((a: any) => ({
    id: a.id,
    studentId: a.student_id,
    date: a.date,
    dayNameAr: a.day_name_ar || 'اليوم',
    subjectAr: a.subject_ar || 'اللغة الإنجليزية',
    status: a.status,
    noteAr: a.note_ar || '',
    sessionTimeAr: a.session_time_ar || '18:00 - 20:00',
    isCoveringSession: Boolean(a.is_covering_session),
    coveringType: a.covering_type,
    coveringReason: a.covering_reason,
  }));

  const homeworks: Homework[] = (homeworksData || []).map((h: any) => ({
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

  const notifications: Notification[] = (announcementsData || []).map((an: any) => ({
    id: an.id,
    titleAr: an.title,
    messageAr: an.content,
    date: an.published_at?.split('T')[0] || an.created_at?.split('T')[0] || '',
    type: (an.category as any) || 'general',
    isRead: false,
  }));

  return {
    students,
    attendance,
    homeworks,
    notifications,
    invoices: invoicesData || [],
  };
}
