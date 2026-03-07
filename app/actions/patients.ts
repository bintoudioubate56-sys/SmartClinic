'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { logAudit } from './audit'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createPatientAction(data: any) {
  const supabase = createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: "Non authentifié" }
  }

  // Generate patient number: SC-YYYY-XXXXX
  const year = new Date().getFullYear()
  // Fetch count to increment (in a real app, use a sequence or transaction)
  const { count } = await supabase.from('patients').select('*', { count: 'exact', head: true })
  const nextNum = (count || 0) + 1
  const patient_number = `SC-${year}-${nextNum.toString().padStart(5, '0')}`

  // Ensure clinique_id is retrieved from user context or provided
  // For now, we fetch the clinique_id of the creator
  const { data: userData } = await supabase.from('users').select('clinique_id').eq('id', user.id).single()
  
  if (!userData?.clinique_id) {
    return { error: "L'utilisateur n'est rattaché à aucune clinique." }
  }

  const newPatient = {
    nom: data.nom,
    dob: data.dob,
    tel: data.tel,
    email: data.email,
    group_sanguin: data.group_sanguin,
    allergies: data.allergies ? data.allergies.split(',').map((s: string) => s.trim()) : [],
    antecedents_critiques: data.antecedents_critiques,
    patient_number,
    clinique_id: userData.clinique_id,
    created_by: user.id
  }

  const { data: insertedPatient, error: insertError } = await supabase
    .from('patients')
    .insert(newPatient)
    .select()
    .single()

  if (insertError) {
    return { error: insertError.message }
  }

  // Trigger Edge Function to generate QR Code
  // Using Admin Client to call edge function if we need service roles, or just authorized client
  const { error: qrError } = await supabase.functions.invoke('generate-qr', {
    body: { patient_id: insertedPatient.id, patient_number: insertedPatient.patient_number }
  })

  if (qrError) {
    console.error("Erreur de génération du QR Code:", qrError)
    // We don't fail the creation, but log the error. The QR can be regenerated later.
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
  const { data, error } = await supabase.from('patients').select('*').eq('id', id).single()
  if (error) return { error: error.message }
  return { patient: data }
}

export async function getPatientByNumberPublicAction(patient_number: string) {
  const supabase = createAdminClient() // Public access, but we bypass RLS for this specific urgent data reading
  
  const { data, error } = await supabase
    .from('patients')
    .select('nom, group_sanguin, allergies, antecedents_critiques')
    .eq('patient_number', patient_number)
    .single()

  if (error) return { error: "Patient non trouvé" }
  
  // Log as urgent public access
  await logAudit('qr_access_emergency', 'patients', undefined, { patient_number })
  
  return { patient: data }
}
