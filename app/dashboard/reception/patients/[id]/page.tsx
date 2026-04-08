import { getPatient } from '@/actions/patients';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import QRCodeDisplay from '@/components/patients/QRCodeDisplay';
import PatientCardButton from '@/components/patients/PatientCardButton';

export default async function PatientAdminPage({ params }: { params: { id: string } }) {
  const result = await getPatient(params.id);

  if (!result.success) {
    return notFound();
  }

  const patient = result.data;
  
  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 text-slate-900">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-indigo-100 text-indigo-700 rounded-2xl flex items-center justify-center text-3xl font-black shadow-inner">
              {patient.first_name[0]}{patient.last_name[0]}
            </div>
            <div>
              <nav className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">
                <Link href="/dashboard/reception" className="hover:underline">Dashboard</Link> / <span>Patient Admin</span>
              </nav>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">
                {patient.last_name} {patient.first_name}
              </h1>
              <p className="text-slate-500 font-medium">ID: {patient.patient_number}</p>
            </div>
          </div>
          <Link 
            href="/dashboard/reception"
            className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
          >
            Retour au Dashboard
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
             <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
               <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-4">État Civil</h3>
               <div className="grid grid-cols-2 gap-6">
                 <div>
                   <label className="text-xs text-slate-400 font-bold block mb-1 uppercase">Né(e) le</label>
                   <p className="text-slate-800 font-bold">{new Date(patient.birth_date).toLocaleDateString()}</p>
                 </div>
                 <div>
                   <label className="text-xs text-slate-400 font-bold block mb-1 uppercase">Genre</label>
                   <p className="text-slate-800 font-bold">{patient.gender === 'M' ? 'Homme' : 'Femme'}</p>
                 </div>
                 <div>
                   <label className="text-xs text-slate-400 font-bold block mb-1 uppercase">Téléphone</label>
                   <p className="text-slate-800 font-bold">{patient.phone}</p>
                 </div>
                 <div>
                   <label className="text-xs text-slate-400 font-bold block mb-1 uppercase tracking-tighter">G. Sanguin</label>
                   <p className="text-red-600 font-black">{patient.blood_group}</p>
                 </div>
               </div>
             </section>

             <section className="bg-indigo-600 p-8 rounded-3xl text-white shadow-xl shadow-indigo-100 group overflow-hidden relative">
               <div className="relative z-10 flex flex-col items-center gap-4 text-center">
                 <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                   <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                 </div>
                 <h3 className="text-xl font-black">Carte d'Identification</h3>
                 <p className="text-indigo-100 text-sm opacity-80">Générer le format PDF A6 officiel pour l'impression.</p>
                 <PatientCardButton patientId={patient.id} />
               </div>
               <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all" />
             </section>
          </div>

          <div className="space-y-6">
            <QRCodeDisplay 
              qrToken={patient.qr_token || ''}
              patientName={`${patient.last_name} ${patient.first_name}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
