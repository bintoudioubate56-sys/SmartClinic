'use server'

import { createActionClient } from '@/lib/supabase/server';
import { ActionResult, Database } from '@/types/database.types';
import { logAction } from '@/lib/audit';
import { sendSmsConfirmation, sendSmsCancellation } from '@/lib/sms';

type Appointment = Database['public']['Tables']['appointments']['Row'];

/**
 * Create appointment with conflict check.
 */
export async function createAppointment(data: {
  clinic_id: string;
  patient_id: string;
  doctor_id: string;
  scheduled_at: string;
  duration_min: number;
  reason?: string;
}): Promise<ActionResult<Appointment & { smsFailed?: boolean }>> {
  const supabase = createActionClient() as any;

  // 1. Conflict Check
  const start = new Date(data.scheduled_at);
  const end = new Date(start.getTime() + data.duration_min * 60000);

  const { data: conflicts } = await supabase
    .from('appointments')
    .select('id')
    .eq('doctor_id', data.doctor_id)
    .eq('status', 'scheduled')
    .filter('scheduled_at', 'lt', end.toISOString())
    .filter('scheduled_at', 'gte', start.toISOString());
  
  if (conflicts && conflicts.length > 0) {
    return { success: false, error: 'Créneau indisponible : Le médecin a déjà un rendez-vous sur cette période.' };
  }

  // 2. Insert
  const { data: appointment, error } = await supabase
    .from('appointments')
    .insert({
      ...data,
      status: 'scheduled',
      reminder_sent: false
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  // 3. SMS Confirmation
  let smsFailed = false;
  try {
    const { data: patient } = await supabase.from('patients').select('*').eq('id', data.patient_id).single();
    const { data: clinic } = await supabase.from('clinics').select('*').eq('id', data.clinic_id).single();
    if (patient && clinic) {
      const smsRes = await sendSmsConfirmation(patient, appointment, clinic);
      smsFailed = smsRes.smsFailed;
    }
  } catch (e) {
    smsFailed = true;
  }

  // 4. Audit
  const { data: { user } } = await supabase.auth.getUser();
  await logAction(supabase, {
    userId: user?.id,
    clinicId: data.clinic_id,
    action: 'appointment_created',
    targetTable: 'appointments',
    targetId: appointment.id
  });

  return { success: true, data: { ...appointment, smsFailed } };
}

/**
 * Get appointments with filters and pagination.
 */
export async function getAppointments(filters: {
  date?: string;
  doctorId?: string;
  status?: string;
  clinicId: string;
  page?: number;
}): Promise<ActionResult<any[]>> {
  const supabase = createActionClient() as any;
  const page = filters.page || 1;
  const limit = 20;
  const offset = (page - 1) * limit;

  let query = supabase
    .from('appointments')
    .select(`
      *,
      patient:patients(first_name, last_name, phone),
      doctor:clinic_staff(id, user_id) 
    `)
    .eq('clinic_id', filters.clinicId)
    .order('scheduled_at', { ascending: true })
    .range(offset, offset + limit - 1);

  if (filters.date) {
    const start = `${filters.date}T00:00:00`;
    const end = `${filters.date}T23:59:59`;
    query = query.gte('scheduled_at', start).lte('scheduled_at', end);
  }
  if (filters.doctorId) query = query.eq('doctor_id', filters.doctorId);
  if (filters.status) query = query.eq('status', filters.status);

  const { data, error } = await query;

  if (error) return { success: false, error: error.message };
  return { success: true, data: data || [] };
}

/**
 * Update status and handle cancellation SMS.
 */
export async function updateAppointmentStatus(
  id: string, 
  status: string, 
  motif?: string
): Promise<ActionResult<Appointment & { smsFailed?: boolean }>> {
  const supabase = createActionClient() as any;

  // Check current
  const { data: current } = await supabase.from('appointments').select('*').eq('id', id).single();
  if (current?.status === 'completed') {
    return { success: false, error: 'Impossible de modifier un rendez-vous déjà terminé.' };
  }

  const { data: appointment, error } = await supabase
    .from('appointments')
    .update({ 
      status,
      notes: motif ? `Annulé: ${motif}` : current?.notes
    })
    .eq('id', id)
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  let smsFailed = false;
  const { data: { user } } = await supabase.auth.getUser();

  if (status === 'cancelled') {
    try {
      const { data: patient } = await supabase.from('patients').select('*').eq('id', appointment.patient_id).single();
      const { data: clinic } = await supabase.from('clinics').select('*').eq('id', appointment.clinic_id).single();
      if (patient && clinic) {
        const smsRes = await sendSmsCancellation(patient, appointment, clinic);
        smsFailed = smsRes.smsFailed;
      }
    } catch (e) {
      smsFailed = true;
    }

    await logAction(supabase, {
      userId: user?.id,
      clinicId: appointment.clinic_id,
      action: 'appointment_cancelled',
      targetTable: 'appointments',
      targetId: id,
      metadata: { motif }
    });
  }

  return { success: true, data: { ...appointment, smsFailed } };
}

/**
 * Send reminders.
 */
export async function sendReminders(): Promise<void> {
  const supabase = createActionClient() as any;
  const tomorrow = new Date();
  tomorrow.setHours(tomorrow.getHours() + 24);
  const startWindow = new Date(tomorrow.getTime() - 3600000).toISOString();
  const endWindow = new Date(tomorrow.getTime() + 3600000).toISOString();

  const { data: appts } = await supabase
    .from('appointments')
    .select('*, patients(*), clinics(*)')
    .eq('reminder_sent', false)
    .eq('status', 'scheduled')
    .gte('scheduled_at', startWindow)
    .lte('scheduled_at', endWindow);

  if (appts) {
    for (const appt of appts) {
      await supabase.from('appointments').update({ reminder_sent: true }).eq('id', appt.id);
    }
  }
}
