import { supabase } from '@/lib/supabase/client';
import { AdminParent, EntityStatus } from '@/types/admin';

export async function fetchParentsFromDb(): Promise<AdminParent[]> {
  const { data, error } = await supabase
    .from('parents')
    .select(`
      *,
      parent_students (
        student_id
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching parents from Supabase:', error);
    return [];
  }

  return (data || []).map((row: any): AdminParent => ({
    id: row.id,
    fullNameAr: row.full_name_ar,
    fullNameEn: row.full_name_en || '',
    phone: row.phone,
    email: row.email || '',
    nationalId: row.national_id || '',
    address: row.address || '',
    linkedStudentIds: (row.parent_students || []).map((ps: any) => ps.student_id),
    status: (row.status as EntityStatus) || 'active',
    createdAt: row.created_at?.split('T')[0] || '',
  }));
}

export async function createParentInDb(parent: Partial<AdminParent>): Promise<AdminParent | null> {
  const { data, error } = await supabase
    .from('parents')
    .insert({
      full_name_ar: parent.fullNameAr || 'ولي أمر جديد',
      full_name_en: parent.fullNameEn || null,
      phone: parent.phone || '+213 550 000 000',
      email: parent.email || null,
      national_id: parent.nationalId || null,
      address: parent.address || null,
      status: parent.status || 'active',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating parent in Supabase:', error);
    return null;
  }

  return {
    ...parent,
    id: data.id,
    linkedStudentIds: [],
    createdAt: data.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
  } as AdminParent;
}
