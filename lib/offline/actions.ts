import { db } from './db';
import { createPatient, updatePatient } from '@/actions/patients';
import { createRecord } from '@/actions/medical-records';
import { createAppointment } from '@/actions/appointments';

/**
 * Proxy function to handle creation actions with offline support.
 */
export async function performOfflineAwareAction(
  actionType: 'create_patient' | 'create_record' | 'create_appointment' | 'update_patient',
  payload: any
): Promise<{ success: boolean; data?: any; error?: string; isOffline?: boolean }> {
  
  if (typeof window !== 'undefined' && !navigator.onLine) {
    // Offline mode: Queue it
    await db.pending_actions.add({
      action_type: actionType,
      payload,
      created_at: new Date().toISOString()
    });

    return { 
      success: true, 
      isOffline: true,
      error: 'Action enregistrée hors-ligne. Elle sera synchronisée au retour en ligne.' 
    };
  }

  // Online mode: Call real server actions
  switch (actionType) {
    case 'create_patient': return await createPatient(payload);
    case 'create_record': return await createRecord(payload);
    case 'create_appointment': return await createAppointment(payload);
    case 'update_patient': return await updatePatient(payload.id, payload.data);
    default: return { success: false, error: 'Action non supportée.' };
  }
}
