'use server'

import { createActionClient } from '@/lib/supabase/server';
import { ActionResult, UserRole, Database, Patient, PatientWithRecords, EmergencyData } from '@/types/database.types';
import { logAction } from '@/lib/audit';

/**
 * Create a new patient with duplicate check.
 */
export async function createPatient(data: Partial<Patient>): Promise<ActionResult<Patient>> {
  const supabase = createActionClient() as any;

  // 1. Role Check
  const { data: { user } } = await supabase.auth.getUser();
  const role = user?.user_metadata?.role as UserRole;
  if (role !== 'receptionist' && role !== 'admin') {
    return { success: false, error: 'Accès non autorisé' };
  }

  // 2. Duplicate Check (last_name + phone)
  if (data.last_name && data.phone) {
    const { data: existing } = await supabase
      .from('patients')
      .select('id, patient_number')
      .eq('last_name', data.last_name)
      .eq('phone', data.phone)
      .maybeSingle();

    if (existing) {
      return { 
        success: false, 
        error: `Doublon détecté : Un patient existe déjà avec ce nom et téléphone (${existing.patient_number}).` 
      };
    }
  }

  // 3. Insert
  const { data: patient, error } = await supabase
    .from('patients')
    .insert(data)
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  // 4. Audit Log
  await logAction(supabase, {
    userId: user?.id,
    clinicId: patient.clinic_id,
    action: 'patient_created',
    targetTable: 'patients',
    targetId: patient.id
  });

  return { success: true, data: patient };
}

/**
 * Get full patient dossier including records and attachments.
 */
export async function getPatient(id: string): Promise<ActionResult<PatientWithRecords>> {
  const supabase = createActionClient() as any;
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Non authentifié' };

  const { data, error } = await supabase
    .from('patients')
    .select(`
      *,
      medical_records (
        *,
        record_attachments (*)
      )
    `)
    .eq('id', id)
    .single();

  if (error) return { success: false, error: error.message };

  // Audit
  await logAction(supabase, {
    userId: user.id,
    clinicId: data.clinic_id,
    action: 'patient_viewed',
    targetTable: 'patients',
    targetId: data.id
  });

  return { success: true, data };
}

/**
 * Search patients with ilike and limit.
 */
export async function searchPatients(query: string): Promise<ActionResult<Patient[]>> {
  const supabase = createActionClient() as any;

  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .or(`last_name.ilike.%${query}%,first_name.ilike.%${query}%,phone.ilike.%${query}%,patient_number.ilike.%${query}%`)
    .limit(20);

  if (error) return { success: false, error: error.message };
  return { success: true, data: data || [] };
}

/**
 * Update patient and log diff.
 */
export async function updatePatient(id: string, data: Partial<Patient>): Promise<ActionResult<Patient>> {
  const supabase = createActionClient() as any;
  const { data: { user } } = await supabase.auth.getUser();

  const { data: updated, error } = await supabase
    .from('patients')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  // Log audit with diff
  await logAction(supabase, {
    userId: user?.id,
    clinicId: updated.clinic_id,
    action: 'patient_updated',
    targetTable: 'patients',
    targetId: id,
    metadata: { changes: data }
  });

  return { success: true, data: updated };
}

/**
 * Public emergency access (No auth required).
 */
export async function getEmergencyData(qrToken: string): Promise<ActionResult<EmergencyData>> {
  const supabase = createActionClient() as any;

  const { data, error } = await supabase
    .from('patients')
    .select('id, first_name, last_name, birth_date, blood_group, emergency_contact')
    .eq('qr_token', qrToken)
    .single();

  if (error) return { success: false, error: 'Accès urgence refusé ou token invalide' };

  const emergency: EmergencyData = {
    first_name: data.first_name,
    last_name: data.last_name,
    birth_date: data.birth_date,
    blood_group: data.blood_group,
    allergies: (data.emergency_contact as any)?.allergies || 'Non spécifié',
    chronic_diseases: (data.emergency_contact as any)?.chronic_diseases || 'Non spécifié',
    emergency_contact_name: (data.emergency_contact as any)?.name || 'Non spécifié',
    emergency_contact_phone: (data.emergency_contact as any)?.phone || 'Non spécifié'
  };

  // Log audit (Anonymous)
  await logAction(supabase, {
    action: 'emergency_access',
    targetTable: 'patients',
    targetId: data.id,
    metadata: { token_used: qrToken.substring(0, 8) + '...' }
  });

  return { success: true, data: emergency };
}

/**
 * Generate PDF card via Edge Function.
 */
export async function generatePatientCard(id: string): Promise<ActionResult<{ url: string }>> {
  const supabase = createActionClient() as any;
  
  const { data, error } = await supabase.functions.invoke('generate-patient-card', {
    body: { patientId: id }
  });

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}
