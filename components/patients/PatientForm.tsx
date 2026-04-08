'use client'

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { generatePatientCard } from '@/actions/patients';
import { Patient, UserRole } from '@/types/database.types';
import { performOfflineAwareAction } from '@/lib/offline/actions';

const patientSchema = z.object({
  // Step 1
  first_name: z.string().min(2, 'Prénom requis'),
  last_name: z.string().min(2, 'Nom requis'),
  father_name: z.string().optional(),
  birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date invalide'),
  birth_place: z.string().optional(),
  gender: z.enum(['M', 'F']),
  language: z.string().optional(),
  
  // Step 2
  phone: z.string().regex(/^\+224\d{9}$/, 'Format: +224XXXXXXXXX'),
  phone_alt: z.string().optional(),
  quartier: z.string().optional(),
  commune: z.string().optional(),
  
  // Step 3
  blood_group: z.enum(['A+','A-','B+','B-','AB+','AB-','O+','O-','INCONNU']).optional(),
  allergies: z.string().optional(),
  chronic_diseases: z.string().optional(),
  emergency_contact_name: z.string().optional(),
  emergency_contact_phone: z.string().optional(),
  consent: z.boolean().refine(v => v === true, 'Le consentement est obligatoire')
});

type PatientFormData = z.infer<typeof patientSchema>;

export default function PatientForm({ clinicId }: { clinicId: string }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdPatient, setCreatedPatient] = useState<Patient | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const { register, handleSubmit, trigger, watch, formState: { errors } } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      gender: 'M',
      blood_group: 'INCONNU',
      consent: false
    }
  });

  const nextStep = async () => {
    let fields: (keyof PatientFormData)[] = [];
    if (step === 1) fields = ['first_name', 'last_name', 'birth_date', 'gender'];
    if (step === 2) fields = ['phone'];
    
    const isValid = await trigger(fields);
    if (isValid) setStep(s => s + 1);
  };

  const onSubmit = async (data: PatientFormData) => {
    setIsSubmitting(true);
    setError(null);
    setInfo(null);
    
    const result = await performOfflineAwareAction('create_patient', {
      ...data,
      clinic_id: clinicId,
      emergency_contact: {
        name: data.emergency_contact_name,
        phone: data.emergency_contact_phone,
        allergies: data.allergies,
        chronic_diseases: data.chronic_diseases
      }
    });

    setIsSubmitting(false);
    
    if (result.success) {
      if (result.isOffline) {
        setInfo("Patient enregistré localement (Hors-ligne). Synchronisation automatique dès le retour en ligne.");
        // We don't setCreatedPatient because we don't have the real ID yet
      } else {
        setCreatedPatient(result.data);
      }
    } else {
      setError(result.error || 'Erreur inconnue');
    }
  };

  if (createdPatient) {
    return (
      <div className="p-8 bg-white rounded-2xl shadow-xl border border-emerald-100 max-w-2xl mx-auto text-center">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Patient Enregistré !</h2>
        <p className="text-slate-500 mb-6">Le dossier de <strong>{createdPatient.first_name} {createdPatient.last_name}</strong> a été créé avec le numéro <strong>{createdPatient.patient_number}</strong>.</p>
        
        <div className="grid grid-cols-2 gap-4 mb-8 text-left bg-slate-50 p-4 rounded-xl">
          <div>
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">ID Patient</p>
            <p className="text-slate-700 font-medium">{createdPatient.patient_number}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Téléphone</p>
            <p className="text-slate-700 font-medium">{createdPatient.phone}</p>
          </div>
        </div>

        <button 
          onClick={async () => {
            const res = await generatePatientCard(createdPatient.id);
            if (res.success) window.open(res.data.url, '_blank');
          }}
          className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
          Imprimer la carte patient
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-10">
        <div className="flex justify-between mb-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="text-center w-full">
              <div className={`h-2 rounded-full mx-1 transition-all ${s <= step ? 'bg-indigo-600' : 'bg-slate-200'}`} />
              <span className={`text-xs font-bold mt-2 inline-block ${s <= step ? 'text-indigo-600' : 'text-slate-400'}`}>
                Étape {s}/3
              </span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}
        {info && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl text-sm font-bold flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
             {info}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold text-slate-800 border-b pb-2">Informations Personnelles</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-600">Prénom *</label>
                <input {...register('first_name')} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                {errors.first_name && <p className="text-xs text-red-500 mt-1">{errors.first_name.message}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-600">Nom *</label>
                <input {...register('last_name')} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                {errors.last_name && <p className="text-xs text-red-500 mt-1">{errors.last_name.message}</p>}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-600">Prénom du Père</label>
              <input {...register('father_name')} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-600">Date de Naissance *</label>
                <input type="date" {...register('birth_date')} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                {errors.birth_date && <p className="text-xs text-red-500 mt-1">{errors.birth_date.message}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-600">Sexe *</label>
                <select {...register('gender')} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold text-slate-800 border-b pb-2">Contact & Localisation</h3>
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-600">Téléphone * (+224XXXXXXXXX)</label>
              <input {...register('phone')} placeholder="+224" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-600">Téléphone Alternatif</label>
              <input {...register('phone_alt')} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-600">Commune</label>
                <input {...register('commune')} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-600">Quartier</label>
                <input {...register('quartier')} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold text-slate-800 border-b pb-2">Données Médicales & Urgence</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-600">Groupe Sanguin</label>
                <select {...register('blood_group')} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                  {['A+','A-','B+','B-','AB+','AB-','O+','O-','INCONNU'].map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-600">Allergies connues</label>
              <textarea {...register('allergies')} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" rows={2} />
            </div>
            <div className="space-y-4 pt-4 border-t">
              <p className="text-sm font-bold text-slate-800">Personne à contacter en cas d'urgence</p>
              <div className="grid grid-cols-2 gap-4">
                <input {...register('emergency_contact_name')} placeholder="Nom complet" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                <input {...register('emergency_contact_phone')} placeholder="Téléphone" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-indigo-50 rounded-xl">
              <input type="checkbox" {...register('consent')} className="mt-1 w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              <label className="text-sm text-slate-700 leading-tight">
                Je confirme l'exactitude des informations fournies et consens à leur traitement confidentiel par SmartClinic. *
              </label>
            </div>
            {errors.consent && <p className="text-xs text-red-500">{errors.consent.message}</p>}
          </div>
        )}

        <div className="mt-10 flex justify-between gap-4">
          {step > 1 && (
            <button type="button" onClick={() => setStep(s => s - 1)} className="px-6 py-3 border border-slate-200 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-all">
              Précédent
            </button>
          )}
          {step < 3 ? (
            <button type="button" onClick={nextStep} className="ml-auto px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2">
              Suivant <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          ) : (
            <button type="submit" disabled={isSubmitting} className="ml-auto px-10 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50">
              {isSubmitting ? 'Enregistrement...' : 'Confirmer & Créer'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
