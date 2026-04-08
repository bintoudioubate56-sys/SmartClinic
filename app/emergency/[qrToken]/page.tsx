import { getEmergencyData } from '@/actions/patients';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { AlertTriangle, Activity, Phone, HeartPulse, User } from 'lucide-react';

export default async function EmergencyPage({ params }: { params: { qrToken: string } }) {
  const result = await getEmergencyData(params.qrToken);
  const headerList = await headers();
  const ip = headerList.get('x-forwarded-for') || 'Unknown';

  if (!result.success) {
    return notFound();
  }

  const data = result.data;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Mesh Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-red-950/20 via-transparent to-transparent pointer-events-none" />

      {/* Persistent Critical Alert Bar */}
      <div className="fixed top-0 left-0 right-0 bg-red-600 text-white py-4 px-6 z-50 shadow-2xl flex items-center justify-center gap-3">
        <div className="flex items-center gap-3 animate-pulse">
          <HeartPulse className="w-8 h-8 fill-white" />
          <span className="text-xl font-black uppercase tracking-tighter">DONNÉES D'URGENCE VITALES</span>
        </div>
      </div>

      <main className="flex-1 pt-28 pb-12 px-6 max-w-xl mx-auto w-full space-y-8 relative z-10">
        {/* Patient Identity */}
        <section className="text-center space-y-4">
          <div className="w-24 h-24 rounded-full bg-slate-900 border-2 border-white/10 flex items-center justify-center mx-auto shadow-2xl">
            <User className="w-12 h-12 text-slate-500" />
          </div>
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none mb-2">
              {data.last_name.toUpperCase()}<br/>
              <span className="text-indigo-400">{data.first_name}</span>
            </h1>
            <p className="text-xl font-bold text-slate-400">
              Né(e) le {new Date(data.birth_date).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </section>

        {/* Primary Medical Data Grid */}
        <div className="grid grid-cols-1 gap-6">
          {/* Blood Group - Hyper-Visible */}
          <div className="glass p-10 rounded-[2.5rem] border-red-500/30 text-center shadow-2xl shadow-red-500/5">
            <h2 className="text-xs font-black text-red-400 uppercase tracking-[0.3em] mb-4">Groupe Sanguin</h2>
            <div className="text-9xl font-black text-white leading-none tracking-tighter flex items-center justify-center">
              {data.blood_group}
            </div>
          </div>

          {/* Allergies - Critical Warning */}
          <div className={`glass p-8 rounded-[2.5rem] border-2 ${data.allergies && data.allergies !== 'Non spécifié' ? 'border-amber-500/30' : 'border-white/5 opacity-50'}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <AlertTriangle className="text-amber-500 w-6 h-6" />
              </div>
              <h2 className="text-xs font-black text-amber-500 uppercase tracking-[0.2em]">Allergies Connues</h2>
            </div>
            <p className="text-3xl font-black text-white leading-tight">
              {data.allergies || 'Aucune connue'}
            </p>
          </div>

          {/* Chronic Conditions */}
          <div className="glass p-8 rounded-[2.5rem] border-white/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                <Activity className="text-indigo-400 w-6 h-6" />
              </div>
              <h2 className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em]">Maladies Chroniques</h2>
            </div>
            <p className="text-2xl font-bold text-slate-200 leading-relaxed">
              {data.chronic_diseases || 'Aucune mentionnée'}
            </p>
          </div>

          {/* Emergency Contact - Call Action */}
          <div className="bg-emerald-600 p-8 rounded-[2.5rem] shadow-2xl shadow-emerald-600/20 border border-emerald-400/20">
            <h2 className="text-xs font-black text-emerald-100 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Contact Proche
            </h2>
            <div className="space-y-4">
              <p className="text-3xl font-black text-white">{data.emergency_contact_name}</p>
              <a 
                href={`tel:${data.emergency_contact_phone}`} 
                className="w-full bg-white text-emerald-700 py-6 rounded-2xl text-center text-3xl font-black block shadow-lg active:scale-[0.98] transition-all"
              >
                {data.emergency_contact_phone}
              </a>
            </div>
          </div>
        </div>

        <footer className="pt-10 text-center space-y-2">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">SmartClinic Emergency Protocol V1.0</p>
          <p className="text-[10px] text-slate-600">ID Trace: {ip} • {new Date().toISOString()}</p>
        </footer>
      </main>
    </div>
  );
}
