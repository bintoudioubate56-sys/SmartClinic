import DashboardShell from '@/components/dashboard/DashboardShell';

export default function AdminDashboard() {
  return (
    <DashboardShell role="admin" userName="Administrateur Système">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="glass p-8 rounded-[2.5rem] col-span-2 space-y-6">
          <h2 className="text-xl font-black text-white">Activité du Système</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white/2 border border-white/5 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-400">Derniers logs d'audit</span>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Voir tout</span>
            </div>
            <div className="h-48 border border-white/5 bg-white/2 rounded-2xl flex items-center justify-center text-slate-500 italic">
              Aucun incident critique détecté ces dernières 24h.
            </div>
          </div>
        </div>
        
        <div className="glass p-8 rounded-[2.5rem] space-y-6">
          <h2 className="text-xl font-black text-white">Gestion Système</h2>
          <div className="space-y-3">
            <button className="w-full py-4 bg-indigo-600 rounded-2xl font-bold text-white shadow-xl shadow-indigo-600/20 active:scale-95 transition-all">
              Gérer les Utilisateurs
            </button>
            <button className="w-full py-4 bg-white/5 rounded-2xl font-bold text-white border border-white/10 hover:bg-white/10 transition-all">
              Paramètres Clinique
            </button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
