'use server'

import { createActionClient } from '@/lib/supabase/server';
import { ActionResult, UserRole } from '@/types/database.types';
import { logAction } from '@/lib/audit';

/**
 * Sign in a user and log the action.
 */
export async function signIn(email: string, password: string): Promise<ActionResult<{ role: UserRole }>> {
  const supabase = createActionClient() as any;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return { success: false, error: 'Email ou mot de passe incorrect' };
  }

  const role = (data.user.user_metadata?.role as UserRole) || 'patient';

  // Log access
  await logAction(supabase, {
    userId: data.user.id,
    action: 'login',
    metadata: { email }
  });

  return { success: true, data: { role } };
}

/**
 * Sign out the current user and log the action.
 */
export async function signOut(): Promise<ActionResult<null>> {
  const supabase = createActionClient() as any;
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    await logAction(supabase, {
      userId: user.id,
      action: 'logout'
    });
  }

  await supabase.auth.signOut();
  return { success: true, data: null };
}

/**
 * Sign up as a patient.
 */
export async function signUp(
  email: string, 
  password: string, 
  firstName: string, 
  lastName: string
): Promise<ActionResult<null>> {
  const supabase = createActionClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: 'patient',
        first_name: firstName,
        last_name: lastName,
      },
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: null };
}

/**
 * Trigger password reset email.
 */
export async function resetPassword(email: string): Promise<ActionResult<null>> {
  const supabase = createActionClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/dashboard/settings`,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: null };
}
