'use client'

import { useState } from 'react';
import { generatePatientCard } from '@/actions/patients';

export default function PatientCardButton({ patientId }: { patientId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await generatePatientCard(patientId);
      if (res.success) {
        if (res.data?.url) {
          window.open(res.data.url, '_blank');
        } else {
          setError('URL de téléchargement manquante.');
        }
      } else {
        setError(res.error);
      }
    } catch (err: any) {
      setError('Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button 
        onClick={handleGenerate}
        disabled={loading}
        className="w-full mt-4 py-4 bg-white text-indigo-600 rounded-2xl font-black hover:bg-indigo-50 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
      >
        {loading && <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />}
        {loading ? 'Génération...' : 'Générer & Télécharger'}
      </button>
      {error && <p className="text-[10px] text-red-100 mt-2 font-bold uppercase">{error}</p>}
    </div>
  );
}
