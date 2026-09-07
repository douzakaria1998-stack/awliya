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

export async function updateParentInDb(id: string, updates: Partial<AdminParent>): Promise<void> {
  if (!id || id.startsWith('par-')) return;
  const updatePayload: Record<string, any> = {};

  if (updates.fullNameAr !== undefined) updatePayload.full_name_ar = updates.fullNameAr;
  if (updates.fullNameEn !== undefined) updatePayload.full_name_en = updates.fullNameEn;
  if (updates.phone !== undefined) updatePayload.phone = updates.phone;
  if (updates.email !== undefined) updatePayload.email = updates.email || null;
  if (updates.nationalId !== undefined) updatePayload.national_id = updates.nationalId || null;
  if (updates.address !== undefined) updatePayload.address = updates.address || null;
  if (updates.status !== undefined) updatePayload.status = updates.status;

  if (Object.keys(updatePayload).length === 0) return;

  const { error } = await supabase.from('parents').update(updatePayload).eq('id', id);
  if (error) {
    console.error('Error updating parent in Supabase:', error);
  }
}

export async function deleteParentFromDb(id: string): Promise<void> {
  if (!id || id.startsWith('par-')) return;
  const { error } = await supabase.from('parents').delete().eq('id', id);
  if (error) {
    console.error('Error deleting parent from Supabase:', error);
  }
}
