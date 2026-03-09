'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { logAudit } from './audit'
import { z } from 'zod'

// ─── Schéma de validation Zod ─────────────────────────────────────────────────
const createPatientSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide (format YYYY-MM-DD requis)"),
  tel: z.string().min(6, "Numéro de téléphone invalide").optional().or(z.literal('')),
  email: z.string().email("Email invalide").optional().or(z.literal('')),
  group_sanguin: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', '']).optional(),
  allergies: z.string().optional(),
  antecedents_critiques: z.string().optional(),
})

export async function createPatientAction(data: unknown) {
  // 1. Validation Zod
  const parsed = createPatientSchema.safeParse(data)
  if (!parsed.success) {
    return { error: "Données invalides", issues: parsed.error.issues }
  }

  const supabase = createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: "Non authentifié" }
  }

  // 2. Récupérer la clinique_id du créateur
  const { data: userData } = await supabase
    .from('users')
    .select('clinique_id')
    .eq('id', user.id)
    .single()

  if (!userData?.clinique_id) {
    return { error: "L'utilisateur n'est rattaché à aucune clinique." }
  }

  // 3. Générer le numéro patient via séquence PostgreSQL (atomique, sans race condition)
  const { data: seqData, error: seqError } = await supabase
    .rpc('nextval', { seq: 'patient_number_seq' })

  let patient_number: string
  if (seqError || seqData === null) {
    // Fallback en cas d'erreur sur la RPC : utiliser un UUID tronqué
    const fallbackId = Math.floor(Math.random() * 99999) + 1
    patient_number = `SC-${new Date().getFullYear()}-${fallbackId.toString().padStart(5, '0')}`
  } else {
    patient_number = `SC-${new Date().getFullYear()}-${String(seqData).padStart(5, '0')}`
  }

  // 4. Construire l'objet patient validé
  const newPatient = {
    nom: parsed.data.nom,
    dob: parsed.data.dob,
    tel: parsed.data.tel || null,
    email: parsed.data.email || null,
    group_sanguin: parsed.data.group_sanguin || null,
    allergies: parsed.data.allergies
      ? parsed.data.allergies.split(',').map((s: string) => s.trim()).filter(Boolean)
      : [],
    antecedents_critiques: parsed.data.antecedents_critiques || null,
    patient_number,
    clinique_id: userData.clinique_id,
    created_by: user.id,
  }

  const { data: insertedPatient, error: insertError } = await supabase
    .from('patients')
    .insert(newPatient)
    .select()
    .single()

  if (insertError) {
    return { error: insertError.message }
  }

  // 5. Déclencher la génération du QR Code (Edge Function)
  const { error: qrError } = await supabase.functions.invoke('generate-qr', {
    body: {
      patient_id: insertedPatient.id,
      patient_number: insertedPatient.patient_number,
    },
  })

  if (qrError) {
    console.error("Erreur génération QR Code:", qrError)
    // Non bloquant : le QR peut être régénéré plus tard
  }

  await logAudit('create_patient', 'patients', insertedPatient.id)

  return { success: true, patient: insertedPatient }
}

export async function searchPatientsAction(query: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('patients')
    .select('id, nom, patient_number, tel')
    .or(`nom.ilike.%${query}%,patient_number.ilike.%${query}%,tel.ilike.%${query}%`)
    .limit(10)

  if (error) return { error: error.message }
  return { patients: data }
}

export async function getPatientAction(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return { error: error.message }

  await logAudit('view_patient', 'patients', id)

  return { patient: data }
}

export async function getPatientByNumberPublicAction(patient_number: string) {
  // Admin client pour bypasser RLS (accès urgence public, pas d'authentification)
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('patients')
    .select('nom, group_sanguin, allergies, antecedents_critiques')
    .eq('patient_number', patient_number)
    .single()

  if (error || !data) return { error: "Patient non trouvé" }

  // Log l'accès urgence via admin client pour garantir l'enregistrement
  const adminSupabase = createAdminClient()
  await adminSupabase.from('audit_logs').insert({
    user_id: null,
    action: 'qr_access_emergency',
    target_type: 'patients',
    meta_json: { patient_number },
  })

  return { patient: data }
}
