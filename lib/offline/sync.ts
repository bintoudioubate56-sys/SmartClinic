import { db, type PendingAction } from './db';
import { createPatient, updatePatient } from '@/actions/patients';
import { createRecord } from '@/actions/medical-records';
import { createAppointment } from '@/actions/appointments';

/**
 * Detects if a local record is outdated compared to the remote version.
 */
export function detectConflict(localUpdatedAt: string, remoteUpdatedAt: string): boolean {
  return new Date(localUpdatedAt) < new Date(remoteUpdatedAt);
}

/**
 * Synchronizes all pending actions to the Supabase backend.
 */
export async function syncToSupabase() {
  const pending = await db.pending_actions.toArray();
  
  if (pending.length === 0) return;

  console.log(`Syncing ${pending.length} actions to Supabase...`);

  for (const action of pending) {
    let success = false;

    try {
      switch (action.action_type) {
        case 'create_patient':
          const pResult = await createPatient(action.payload);
          success = pResult.success;
          break;
        case 'create_record':
          const rResult = await createRecord(action.payload);
          success = rResult.success;
          break;
        case 'create_appointment':
          const aResult = await createAppointment(action.payload);
          success = aResult.success;
          break;
        case 'update_patient':
          const upResult = await updatePatient(action.payload.id, action.payload.data);
          success = upResult.success;
          break;
      }

      if (success && action.id) {
        await db.pending_actions.delete(action.id);
      }
    } catch (err) {
      console.error(`Sync failed for action ${action.id}:`, err);
    }
  }
}
