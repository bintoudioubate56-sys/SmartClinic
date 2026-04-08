import Dexie, { type Table } from 'dexie';

export interface PendingAction {
  id?: number;
  action_type: 'create_patient' | 'create_record' | 'create_appointment' | 'update_patient' | 'conflict_alert';
  payload: any;
  created_at: string;
}

export interface OfflineRecord {
  id: string;
  data: any;
  synced: boolean;
  updated_at: string;
}

export class SmartClinicDB extends Dexie {
  patients!: Table<OfflineRecord>;
  medical_records!: Table<OfflineRecord>;
  appointments!: Table<OfflineRecord>;
  pending_actions!: Table<PendingAction>;

  constructor() {
    super('smartclinic-offline');
    this.version(1).stores({
      patients: 'id, synced, updated_at',
      medical_records: 'id, synced, updated_at',
      appointments: 'id, synced, updated_at',
      pending_actions: '++id, action_type, created_at'
    });
  }
}

export const db = new SmartClinicDB();
