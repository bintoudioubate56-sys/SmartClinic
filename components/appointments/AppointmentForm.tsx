'use client'

import { useState, useEffect } from 'react';
import PatientSearch from '@/components/patients/PatientSearch';
import { performOfflineAwareAction } from '@/lib/offline/actions';
import { useRouter } from 'next/navigation';
import { Database } from '@/types/database.types';

type Doctor = { id: string, name: string };

export default function AppointmentForm({ 
  clinicId, 
  doctors 
}: { 
  clinicId: string, 
  doctors: Doctor[] 
}) {
  const router = useRouter();
  const [selectedPatient, setSelectedPatient] = useState<{id: string, name: string} | null>(null);
  const [formData, setFormData] = useState({
    doctor_id: '',
    scheduled_at: '',
    duration_min: 15,
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isOfflineResult, setIsOfflineResult] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) {
      setError('Veuillez sélectionner un patient.');
      return;
    }
    if (!formData.doctor_id) {
      setError('Veuillez sélectionner un médecin.');
      return;
    }

    setLoading(true);
    setError(null);

    const result = await performOfflineAwareAction('create_appointment', {
      clinic_id: clinicId,
      patient_id: selectedPatient.id,
      doctor_id: formData.doctor_id,
      scheduled_at: formData.scheduled_at,
      duration_min: Number(formData.duration_min),
      reason: formData.reason
    });

    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setIsOfflineResult(!!result.isOffline);
      
      if (result.data?.smsFailed) {
        setError('RDV créé, mais l\'envoi du SMS de confirmation a échoué.');
      }

      if (!result.isOffline) {
        setTimeout(() => {
          router.push('/dashboard/reception/appointments');
          router.refresh();
        }, 2000);
      }
    } else {
      setError(result.error || 'Une erreur est survenue.');
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Patient Selection */}
        <div>
          <label className="block text-sm font-black text-slate-800 uppercase tracking-widest mb-3">Patient</label>
          {selectedPatient ? (
            <div className="flex items-center justify-between p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
              <span className="font-bold text-indigo-700">{selectedPatient.name}</span>
              <button 
                type="button" 
                onClick={() => setSelectedPatient(null)}
                className="text-xs font-black text-indigo-400 hover:text-indigo-600 uppercase tracking-widest"
              >
                Changer
              </button>
            </div>
          ) : (
            <div className="relative group">
              <PatientSearch onSelect={(p) => setSelectedPatient({ id: p.id, name: `${p.last_name} ${p.first_name}` })} />
              <p className="mt-2 text-[10px] text-slate-400 font-bold uppercase italic">Recherchez par nom ou téléphone</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Doctor Dropdown */}
          <div>
            <label className="block text-sm font-black text-slate-800 uppercase tracking-widest mb-3">Médecin</label>
            <select
              value={formData.doctor_id}
              onChange={(e) => setFormData({...formData, doctor_id: e.target.value})}
              className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:ring-0 transition-all font-medium text-slate-700 appearance-none"
              required
            >
              <option value="">Sélectionner un médecin</option>
              {doctors.map(doc => (
                <option key={doc.id} value={doc.id}>{doc.name}</option>
              ))}
            </select>
          </div>

          {/* Date & Time */}
          <div>
            <label className="block text-sm font-black text-slate-800 uppercase tracking-widest mb-3">Date et Heure</label>
            <input
              type="datetime-local"
              value={formData.scheduled_at}
              onChange={(e) => setFormData({...formData, scheduled_at: e.target.value})}
              className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:ring-0 transition-all font-medium text-slate-700"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Duration */}
          <div>
            <label className="block text-sm font-black text-slate-800 uppercase tracking-widest mb-3">Durée</label>
            <select
              value={formData.duration_min}
              onChange={(e) => setFormData({...formData, duration_min: parseInt(e.target.value)})}
              className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:ring-0 transition-all font-medium text-slate-700 appearance-none"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">60 minutes</option>
            </select>
          </div>
        </div>

        {/* Reason */}
        <div>
          <label className="block text-sm font-black text-slate-800 uppercase tracking-widest mb-3">Motif de consultation</label>
          <textarea
            value={formData.reason}
            onChange={(e) => setFormData({...formData, reason: e.target.value})}
            className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:ring-0 transition-all font-medium text-slate-700 min-h-[120px]"
            placeholder="Ex: Consultation de routine, Douleurs abdominales..."
          />
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-3 animate-shake">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl text-sm font-bold flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            {isOfflineResult ? 'RDV enregistré localement (Hors-ligne)' : 'Rendez-vous créé avec succès !'}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || success}
          className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Vérification...
            </>
          ) : 'Confirmer le Rendez-vous'}
        </button>
      </form>
    </div>
  );
}
