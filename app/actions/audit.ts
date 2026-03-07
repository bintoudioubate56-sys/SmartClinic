'use server'

import { createClient } from '@/lib/supabase/server'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function logAudit(action: string, target_type?: string, target_id?: string, meta_json?: any) {
  const supabase = createClient()
  
  // Try to get user, but don't fail if not authenticated (e.g. for public QR access)
  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase.from('audit_logs').insert({
    user_id: user?.id || null,
    action,
    target_type,
    target_id,
    meta_json
  })

  if (error) {
    console.error("Erreur lors de l'enregistrement de l'audit:", error)
  }
}
