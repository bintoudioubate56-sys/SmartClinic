'use server'

import { createActionClient } from '@/lib/supabase/server';
import { ActionResult, UserRole } from '@/types/database.types';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { logAction } from '@/lib/audit';

// Internal helper for admin operations requiring service role
const getAdminClient = () => {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
};

export async function inviteStaff(data: {
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone: string;
  specialty?: string;
  clinicId: string;
}): Promise<ActionResult<any>> {
  const adminClient = getAdminClient();
  const supabase = createActionClient() as any;

  // Verify requester is admin
  const { data: { user } } = await supabase.auth.getUser();
  if (user?.user_metadata?.role !== 'admin') {
    return { success: false, error: 'Accès non autorisé' };
  }

  // Invite user via Supabase Auth Admin
  const { data: inviteData, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(data.email, {
    data: {
      role: data.role,
      first_name: data.firstName,
      last_name: data.lastName,
      phone: data.phone,
      specialty: data.specialty
    }
  });

  if (inviteError) {
    return { success: false, error: inviteError.message };
  }

  // Create entry in clinic_staff
  const { error: staffError } = await supabase.from('clinic_staff').insert({
    user_id: inviteData.user.id,
    clinic_id: data.clinicId,
    role: data.role,
    is_active: true
  });

  if (staffError) {
    return { success: false, error: staffError.message };
  }

  // Audit
  await logAction(supabase, {
    userId: user.id,
    clinicId: data.clinicId,
    action: 'admin' as any, // Standardize if needed or use metadata
    metadata: { 
      event: 'staff_invited',
      email: data.email, 
      role: data.role 
    }
  });

  return { success: true, data: inviteData.user };
}

export async function deactivateStaff(staffId: string): Promise<ActionResult<null>> {
  const supabase = createActionClient() as any;
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase
    .from('clinic_staff')
    .update({ is_active: false })
    .eq('id', staffId);

  if (error) {
    return { success: false, error: error.message };
  }

  // Audit
  await logAction(supabase, {
    userId: user?.id,
    action: 'admin' as any,
    metadata: { event: 'staff_deactivated', staff_id: staffId }
  });

  return { success: true, data: null };
}

export async function getStaffList(clinicId: string): Promise<ActionResult<any[]>> {
  const supabase = createActionClient() as any;
  
  const { data, error } = await supabase
    .from('clinic_staff')
    .select('*')
    .eq('clinic_id', clinicId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: data || [] };
}
