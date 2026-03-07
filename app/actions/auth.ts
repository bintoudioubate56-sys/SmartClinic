'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { z } from 'zod'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  consent_given: z.boolean().refine((val) => val === true, {
    message: "Le consentement est obligatoire",
  }),
})

export async function registerPatientAction(formData: FormData) {
  const data = Object.fromEntries(formData.entries())
  const parsed = registerSchema.safeParse({
    ...data,
    consent_given: data.consent_given === 'true' || data.consent_given === 'on',
  })

  if (!parsed.success) {
    return { error: "Données invalides", issues: parsed.error.issues }
  }

  const supabase = createClient()

  // 1. Create user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        role: 'patient',
        first_name: parsed.data.first_name,
        last_name: parsed.data.last_name,
      }
    }
  })

  if (authError) {
    return { error: authError.message }
  }

  if (authData.user) {
    // 2. Insert into public.users
    const { error: dbError } = await supabase.from('users').insert({
      id: authData.user.id,
      email: parsed.data.email,
      first_name: parsed.data.first_name,
      last_name: parsed.data.last_name,
      role: 'patient'
    })

    if (dbError) {
      return { error: "Erreur lors de l'enregistrement du patient dans la base" }
    }
  }

  return { success: true }
}

export async function createStaffUserAction(data: { email: string, role: string, first_name: string, last_name: string }) {
  const supabase = createClient()

  // Verify caller is admin or superadmin
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) return { error: "Non authentifié" }

  const { data: callerData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!callerData || (callerData.role !== 'admin' && callerData.role !== 'superadmin')) {
    return { error: "Accès refusé. Droits insuffisants." }
  }

  const supabaseAdmin = createAdminClient()

  // Generate random password or let admin set it. Here we generate one and send email implicitly
  const password = Math.random().toString(36).slice(-10) + "A1!"

  const { data: newAuthUser, error: newAuthError } = await supabaseAdmin.auth.admin.createUser({
    email: data.email,
    password: password,
    email_confirm: true,
    user_metadata: { role: data.role, first_name: data.first_name, last_name: data.last_name }
  })

  if (newAuthError) {
    return { error: newAuthError.message }
  }

  if (newAuthUser.user) {
    const { error: dbError } = await supabaseAdmin.from('users').insert({
      id: newAuthUser.user.id,
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      role: data.role
    })

    if (dbError) {
      // Rollback auth user creation if needed...
      await supabaseAdmin.auth.admin.deleteUser(newAuthUser.user.id)
      return { error: "Erreur base de données lors de la création du staff" }
    }
  }

  return { success: true, message: "Utilisateur créé avec succès" }
}
