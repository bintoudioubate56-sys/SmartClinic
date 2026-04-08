import { getPatient } from '@/actions/patients';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import ConsultationManager from '@/components/patients/ConsultationManager';

export default async function PatientDossierPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return notFound();

  const { data: staff } = await (supabase
    .from('clinic_staff')
    .select('id, role, clinic_id')
    .eq('user_id', user.id)
    .single() as any);

  if (!staff) return notFound();

  const result = await getPatient(params.id);

  if (!result.success) {
    if (result.error.includes('autorisé') || result.error.includes('refusé')) {
      return (
        <div className="p-10 text-center">
          <div className="bg-red-50 text-red-600 p-8 rounded-2xl border border-red-100 max-w-md mx-auto">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0v2m0-2h2m-2 0H10m11 3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <h2 className="text-xl font-bold mb-2">Accès Refusé</h2>
            <p>{result.error}</p>
            <Link href="/dashboard/doctor" className="mt-6 inline-block text-red-700 font-bold underline">Retour au Dashboard</Link>
          </div>
        </div>
      );
    }
    return notFound();
  }

  const patient = result.data;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-10 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-indigo-100 text-indigo-700 rounded-2xl flex items-center justify-center text-3xl font-black shadow-inner">
              {patient.first_name[0]}{patient.last_name[0]}
            </div>
            <div>
              <nav className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">
                <Link href="/dashboard/doctor" className="hover:underline">Patients</Link> / <span>Dossier</span>
              </nav>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                {patient.last_name.toUpperCase()} {patient.first_name}
              </h1>
              <p className="text-slate-500 font-medium">Né(e) le {new Date(patient.birth_date).toLocaleDateString()} • {patient.gender === 'M' ? 'Homme' : 'Femme'}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
              Imprimer Carte
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar: Patient Info */}
          <div className="space-y-6">
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Informations Clés</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 font-bold block">NUMÉRO PATIENT</label>
                  <p className="text-slate-800 font-black text-lg">{patient.patient_number}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-bold block">GROUPE SANGUIN</label>
                  <span className={`inline-block px-3 py-1 rounded-lg text-sm font-black mt-1 ${patient.blood_group === 'O-' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                    {patient.blood_group}
                  </span>
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-bold block">CONTACT</label>
                  <p className="text-slate-800 font-medium">{patient.phone}</p>
                </div>
              </div>
            </section>

            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm border-l-4 border-l-amber-400">
              <h3 className="text-sm font-black text-amber-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" /></svg>
                Alertes Médicales
              </h3>
              <div className="space-y-4 text-sm">
                <div>
                  <span className="font-bold text-slate-700 block">Allergies:</span>
                  <p className="text-slate-500">{(patient.emergency_contact as any)?.allergies || 'Aucune'}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-700 block">Maladies chroniques:</span>
                  <p className="text-slate-500">{(patient.emergency_contact as any)?.chronic_diseases || 'Aucune'}</p>
                </div>
              </div>
            </section>
          </div>

          {/* Main Content: Consultations */}
          <div className="lg:col-span-2">
            <ConsultationManager 
              patient={patient}
              staff={staff}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
