import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';
import { headers } from 'next/headers';

type AuditAction = Database['public']['Enums']['audit_action'];

export async function logAction(
  supabase: SupabaseClient<Database>,
  params: {
    userId?: string;
    clinicId?: string;
    action: AuditAction;
    targetTable?: string;
    targetId?: string;
    metadata?: any;
    request?: Request;
  }
) {
  try {
    let ip = '0.0.0.0';
    
    // Extract IP from request headers if available
    const headerList = params.request ? params.request.headers : await headers();
    const forwarded = headerList.get('x-forwarded-for');
    ip = forwarded ? forwarded.split(',')[0] : '0.0.0.0';

    const { error } = await supabase
      .from('audit_logs')
      .insert({
        user_id: params.userId,
        clinic_id: params.clinicId,
        action: params.action,
        target_table: params.targetTable,
        target_id: params.targetId,
        metadata: params.metadata,
        ip_address: ip
      });

    if (error) {
      console.error('Audit Log Error:', error);
    }
  } catch (err) {
    console.error('Audit Log Failed:', err);
  }
}
