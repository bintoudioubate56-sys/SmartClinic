import DashboardShell from '@/components/dashboard/DashboardShell';

export default function PatientDashboard() {
  return (
    <DashboardShell role="patient" userName="Mamadou Diallo">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="glass p-10 rounded-[3rem] col-span-2 space-y-8 relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/10 blur-[96px] rounded-full group-hover:scale-110 transition-transform duration-700" />
          
          <h2 className="text-2xl font-black text-white px-2">Ma Carte Santé</h2>
          <div className="aspect-[1.6/1] bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="flex justify-between h-full flex-col">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-1">Pass Santé SmartClinic</p>
                  <p className="text-3xl font-black tracking-tighter">DIALLO Mamadou</p>
                </div>
                <div className="w-16 h-16 bg-white rounded-2xl p-2 flex items-center justify-center">
                  <div className="w-full h-full border-2 border-slate-900 flex items-center justify-center opacity-20">QR</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Groupe Sanguin</p>
                  <p className="text-2xl font-bold">O+</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">ID Patient</p>
                  <p className="text-2xl font-bold">SC2026-0042</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="glass p-8 rounded-[2.5rem] space-y-6">
          <h2 className="text-xl font-black text-white">Mon Parcours De Soin</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 mb-1">PROCHAIN RDV</p>
                <p className="text-sm font-black text-white">12 Avril 2026 • 09:00</p>
              </div>
            </div>
            <button className="w-full py-4 bg-white hover:bg-slate-100 text-slate-950 rounded-2xl font-black transition-all active:scale-95 shadow-xl">
              Consulter Historique
            </button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
