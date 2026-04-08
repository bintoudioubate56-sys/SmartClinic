'use server'

import { createActionClient } from '@/lib/supabase/server';
import { ActionResult, Database } from '@/types/database.types';
import { logAction } from '@/lib/audit';
import { revalidatePath } from 'next/cache';

type MedicalRecord = Database['public']['Tables']['medical_records']['Row'];
type RecordAttachment = Database['public']['Tables']['record_attachments']['Row'];

/**
 * Create a new medical record (Doctor only).
 */
export async function createRecord(data: {
  clinic_id: string;
  patient_id: string;
  doctor_id: string;
  appointment_id?: string;
  chief_complaint: string;
  diagnosis: string;
  treatment?: string;
  prescription?: string;
  notes?: string;
  follow_up_date?: string;
}): Promise<ActionResult<MedicalRecord>> {
  const supabase = createActionClient() as any;

  // 1. Verify role is doctor
  const { data: { user } } = await supabase.auth.getUser();
  const { data: staff } = await supabase
    .from('clinic_staff')
    .select('role')
    .eq('user_id', user?.id)
    .single();

  if (staff?.role !== 'doctor') {
    return { success: false, error: 'Seuls les médecins peuvent créer des dossiers médicaux.' };
  }

  // 2. Insert record
  const { data: record, error } = await supabase
    .from('medical_records')
    .insert({
      ...data,
      consultation_date: new Date().toISOString()
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  // 3. Update appointment status if linked
  if (data.appointment_id) {
    await supabase
      .from('appointments')
      .update({ status: 'completed' })
      .eq('id', data.appointment_id);
  }

  // 4. Audit
  await logAction(supabase, {
    userId: user?.id,
    clinicId: data.clinic_id,
    action: 'record_created',
    targetTable: 'medical_records',
    targetId: record.id
  });

  revalidatePath(`/dashboard/doctor/patients/${data.patient_id}`);
  return { success: true, data: record };
}

/**
 * Get patient consultation history with attachments.
 */
export async function getPatientHistory(patientId: string): Promise<ActionResult<any[]>> {
  const supabase = createActionClient() as any;

  const { data, error } = await supabase
    .from('medical_records')
    .select(`
      *,
      doctor:clinic_staff(user_id),
      record_attachments(*)
    `)
    .eq('patient_id', patientId)
    .order('consultation_date', { ascending: false });

  if (error) return { success: false, error: error.message };

  // Audit
  const { data: { user } } = await supabase.auth.getUser();
  await logAction(supabase, {
    userId: user?.id,
    action: 'record_viewed',
    targetTable: 'patients',
    targetId: patientId
  });

  return { success: true, data: data || [] };
}

/**
 * Upload attachment to Supabase Storage and DB.
 */
export async function uploadAttachment(
  recordId: string, 
  patientId: string, 
  clinicId: string,
  fileName: string,
  fileType: string,
  fileSize: number,
  formData: FormData
): Promise<ActionResult<RecordAttachment>> {
  const supabase = createActionClient() as any;
  const file = formData.get('file') as File;

  // 1. Validation
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  if (!allowedTypes.includes(fileType)) {
    return { success: false, error: 'Format non accepté. PDF, JPG et PNG uniquement.' };
  }
  if (fileSize > 10 * 1024 * 1024) { // 10MB
    return { success: false, error: 'Fichier trop lourd (max 10MB).' };
  }

  // 2. Upload to Storage
  const path = `${clinicId}/${patientId}/${recordId}/${Date.now()}_${fileName}`;
  const { data: storageData, error: storageError } = await supabase.storage
    .from('medical-files')
    .upload(path, file);

  if (storageError) return { success: false, error: `Erreur Storage: ${storageError.message}` };

  // 3. Insert in DB
  const { data: attachment, error: dbError } = await supabase
    .from('record_attachments')
    .insert({
      record_id: recordId,
      file_name: fileName,
      file_path: path,
      file_type: fileType,
      file_size: fileSize
    })
    .select()
    .single();

  if (dbError) {
    // Cleanup storage on DB fail
    await supabase.storage.from('medical-files').remove([path]);
    return { success: false, error: dbError.message };
  }

  return { success: true, data: attachment };
}

/**
 * Delete attachment.
 */
export async function deleteAttachment(id: string): Promise<ActionResult<null>> {
  const supabase = createActionClient() as any;

  // 1. Get attachment and verify ownership
  const { data: attachment } = await supabase
    .from('record_attachments')
    .select(`*, medical_records(doctor_id)`)
    .eq('id', id)
    .single();

  if (!attachment) return { success: false, error: 'Fichier introuvable.' };

  const { data: { user } } = await supabase.auth.getUser();
  const { data: staff } = await supabase
    .from('clinic_staff')
    .select('id')
    .eq('user_id', user?.id)
    .single();

  if (attachment.medical_records.doctor_id !== staff?.id) {
    return { success: false, error: 'Seul l\'auteur du dossier peut supprimer les pièces jointes.' };
  }

  // 2. Delete from Storage
  const { error: storageError } = await supabase.storage
    .from('medical-files')
    .remove([attachment.file_path]);

  if (storageError) return { success: false, error: storageError.message };

  // 3. Delete from DB
  const { error: dbError } = await supabase.from('record_attachments').delete().eq('id', id);

  if (dbError) return { success: false, error: dbError.message };

  return { success: true, data: null };
}
