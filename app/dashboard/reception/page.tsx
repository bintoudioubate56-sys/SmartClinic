import DashboardShell from '@/components/dashboard/DashboardShell';

export default function ReceptionDashboard() {
  return (
    <DashboardShell role="receptionist" userName="Fatoumata Camara">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="glass p-8 rounded-[2.5rem] col-span-2 space-y-6">
          <h2 className="text-xl font-black text-white">File d'attente</h2>
          <div className="h-64 border border-white/5 bg-white/2 rounded-2xl flex items-center justify-center text-slate-500 italic">
            Aucun patient enregistré en attente.
          </div>
        </div>
        
        <div className="glass p-8 rounded-[2.5rem] space-y-6">
          <h2 className="text-xl font-black text-white">Accueil Patient</h2>
          <div className="space-y-3">
            <button className="w-full py-4 bg-emerald-600 rounded-2xl font-bold text-white shadow-xl shadow-emerald-600/20 active:scale-95 transition-all">
              Enregistrer Nouveau Patient
            </button>
            <button className="w-full py-4 bg-white/5 rounded-2xl font-bold text-white border border-white/10 hover:bg-white/10 transition-all">
              Vérifier QR Card
            </button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
