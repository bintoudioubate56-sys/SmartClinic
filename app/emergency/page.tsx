import DashboardShell from '@/components/dashboard/DashboardShell';
import { ShieldAlert, Zap, Search, Scan } from 'lucide-react';
import Link from 'next/link';

export default function EmergencyLanding() {
  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/10 blur-[128px] rounded-full -z-10" />
      
      <div className="max-w-2xl space-y-10">
        <div className="w-20 h-20 rounded-3xl bg-red-600/20 border border-red-600/30 flex items-center justify-center mx-auto shadow-2xl shadow-red-600/20">
          <ShieldAlert className="text-red-500 w-10 h-10" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
            Portail d'Urgence <br />
            <span className="text-red-500">SmartClinic</span>
          </h1>
          <p className="text-slate-400 text-lg">
            Accès sécurisé aux données vitales en cas de situation critique. Pour accéder aux informations d'un patient, veuillez scanner son QR code personnel.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 pt-10">
          <div className="glass p-8 rounded-[2.5rem] border border-white/5 space-y-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-red-400">
              <Scan className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Prise en charge Immédiate</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Le QR Code présent sur la carte ou le smartphone du patient donne un accès restreint aux allergies, groupe sanguin et contacts d'urgence.
            </p>
          </div>
          
          <div className="glass p-8 rounded-[2.5rem] border border-white/5 space-y-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-indigo-400">
              <Zap className="text-indigo-400 w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Technologie Resiliente</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Fonctionne même dans les conditions les plus dégradées pour garantir la sécurité du patient à tout moment.
            </p>
          </div>
        </div>

        <div className="pt-10 flex flex-col md:flex-row items-center justify-center gap-4">
          <Link 
            href="/" 
            className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all w-full md:w-auto"
          >
            Retour à l'accueil
          </Link>
          <button className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-2xl shadow-xl shadow-red-600/20 active:scale-95 transition-all w-full md:w-auto flex items-center justify-center gap-2">
            Signaler un incident
          </button>
        </div>
      </div>
      
      <p className="mt-20 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
        SmartClinic — Secure Emergency Access Portal — Guinée 2026
      </p>
    </main>
  );
}
