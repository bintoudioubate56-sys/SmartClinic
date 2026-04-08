export type ActionResult<T> = 
  | { success: true; data: T } 
  | { success: false; error: string };

export type UserRole = 'admin' | 'doctor' | 'receptionist' | 'patient';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      clinics: {
        Row: {
          id: string
          name: string
          address: string
          quartier: string | null
          commune: string | null
          phone: string
          email: string | null
          logo_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          quartier?: string | null
          commune?: string | null
          phone: string
          email?: string | null
          logo_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          quartier?: string | null
          commune?: string | null
          phone?: string
          email?: string | null
          logo_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      clinic_staff: {
        Row: {
          id: string
          user_id: string
          clinic_id: string
          role: UserRole
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          clinic_id: string
          role: UserRole
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          clinic_id?: string
          role?: UserRole
          is_active?: boolean
          created_at?: string
        }
      }
      patients: {
        Row: {
          id: string
          clinic_id: string
          patient_number: string | null
          first_name: string
          last_name: string
          gender: 'M' | 'F'
          birth_date: string
          blood_group: string | null
          phone: string | null
          email: string | null
          address: string | null
          emergency_contact: Json | null
          qr_token: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          clinic_id: string
          patient_number?: string | null
          first_name: string
          last_name: string
          gender: 'M' | 'F'
          birth_date: string
          blood_group?: string | null
          phone?: string | null
          email?: string | null
          address?: string | null
          emergency_contact?: Json | null
          qr_token?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          clinic_id?: string
          patient_number?: string | null
          first_name?: string
          last_name?: string
          gender?: 'M' | 'F'
          birth_date?: string
          blood_group?: string | null
          phone?: string | null
          email?: string | null
          address?: string | null
          emergency_contact?: Json | null
          qr_token?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          clinic_id: string
          patient_id: string
          doctor_id: string | null
          scheduled_at: string
          duration_min: number
          status: string
          reason: string | null
          notes: string | null
          reminder_sent: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          clinic_id: string
          patient_id: string
          doctor_id?: string | null
          scheduled_at: string
          duration_min?: number
          status?: string
          reason?: string | null
          notes?: string | null
          reminder_sent?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          clinic_id?: string
          patient_id?: string
          doctor_id?: string | null
          scheduled_at?: string
          duration_min?: number
          status?: string
          reason?: string | null
          notes?: string | null
          reminder_sent?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      medical_records: {
        Row: {
          id: string
          clinic_id: string
          patient_id: string
          doctor_id: string | null
          content: Json | null
          confidential: boolean
          created_at: string
        }
        Insert: {
          id?: string
          clinic_id: string
          patient_id: string
          doctor_id?: string | null
          content?: Json | null
          confidential?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          clinic_id?: string
          patient_id?: string
          doctor_id?: string | null
          content?: Json | null
          confidential?: boolean
          created_at?: string
        }
      }
      record_attachments: {
        Row: {
          id: string
          record_id: string
          file_name: string
          file_type: string
          file_size: number
          storage_path: string
          created_at: string
        }
        Insert: {
          id?: string
          record_id: string
          file_name: string
          file_type: string
          file_size: number
          storage_path: string
          created_at?: string
        }
        Update: {
          id?: string
          record_id?: string
          file_name?: string
          file_type?: string
          file_size?: number
          storage_path?: string
          created_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          clinic_id: string | null
          action: string
          target_table: string | null
          target_id: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          clinic_id?: string | null
          action: string
          target_table?: string | null
          target_id?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          clinic_id?: string | null
          action?: string
          target_table?: string | null
          target_id?: string | null
          metadata?: Json | null
          created_at?: string
        }
      }
    }
  }
}

export type Patient = Database['public']['Tables']['patients']['Row'];
export type MedicalRecord = Database['public']['Tables']['medical_records']['Row'];
export type RecordAttachment = Database['public']['Tables']['record_attachments']['Row'];

export type PatientWithRecords = Patient & {
  medical_records: (MedicalRecord & {
    record_attachments: RecordAttachment[];
  })[];
};

export type EmergencyData = {
  first_name: string;
  last_name: string;
  birth_date: string;
  blood_group: string | null;
  allergies: string | null;
  chronic_diseases: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
};
