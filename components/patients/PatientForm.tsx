'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createPatientAction } from '@/app/actions/patients'

const patientSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  dob: z.string().min(1, "La date de naissance est requise"),
  tel: z.string().optional(),
  email: z.string().email("Email invalide").optional().or(z.literal('')),
  group_sanguin: z.string().optional(),
  allergies: z.string().optional(),
  antecedents_critiques: z.string().optional()
})

type PatientFormValues = z.infer<typeof patientSchema>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function PatientForm({ onSuccess }: { onSuccess?: (patient: any) => void }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema)
  })

  const onSubmit = async (data: PatientFormValues) => {
    setIsLoading(true)
    setError(null)
    
    // Convert empty strings to undefined to avoid constraint issues if needed
    const submissionData = { ...data, email: data.email || undefined }

    const result = await createPatientAction(submissionData)
    
    if (result.error) {
      setError(result.error)
    } else {
      reset()
      if (onSuccess) onSuccess(result.patient)
    }
    
    setIsLoading(false)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Ajouter un Patient</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && <div className="p-3 bg-red-50 text-red-600 rounded text-sm">{error}</div>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
            <input type="text" {...register('nom')} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500" />
            {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
            <input type="date" {...register('dob')} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500" />
            {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input type="tel" {...register('tel')} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" {...register('email')} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Groupe sanguin</label>
            <select {...register('group_sanguin')} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500">
              <option value="">Non spécifié</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Allergies (séparées par des virgules)</label>
            <input type="text" {...register('allergies')} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500" placeholder="Pénicilline, Arachides..." />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Antécédents critiques</label>
            <textarea {...register('antecedents_critiques')} rows={3} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"></textarea>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 focus:ring-teal-500 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Création...' : 'Créer le patient'}
          </button>
        </div>
      </form>
    </div>
  )
}
