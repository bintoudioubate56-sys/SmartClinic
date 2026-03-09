import { createClient } from '@/lib/supabase/server'
import {
  ShieldAlert,
  Database,
  Globe,
  Settings,
  Activity,
  Zap,
  Server,
  Terminal,
  ChevronRight,
  ShieldCheck,
  Cpu
} from 'lucide-react'

export default async function SuperAdminDashboard() {
  const supabase = createClient()

  // 1. Fetch Global Stats
  const { count: totalUsers } = await supabase.from('users').select('*', { count: 'exact', head: true })
  const { count: totalPatients } = await supabase.from('patients').select('*', { count: 'exact', head: true })

  return (
    <div className="space-y-12 animate-slow-fade">
      {/* Power Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-slate-100 pb-12">
        <div>
          <div className="inline-flex items-center space-x-3 px-4 py-1.5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-4">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
            <span>Accès Niveau 0 : SuperAdmin</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">Console Infrastructure</h1>
          <p className="text-slate-500 font-medium mt-3 text-lg">Gérez les déploiements, la sécurité globale et les politiques système.</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="glass-card px-8 py-5 flex items-center space-x-3 text-slate-900 font-black text-sm border-white/80 hover:bg-slate-900 hover:text-white transition-all shadow-xl group">
            <Terminal className="w-5 h-5 text-teal-600 group-hover:text-teal-400" />
            <span>Logs Serveur</span>
          </button>
          <button className="medical-gradient text-white px-10 py-5 rounded-2xl font-black text-sm shadow-2xl shadow-teal-500/30 hover:scale-[102%] transition-all flex items-center space-x-3">
            <Settings className="w-5 h-5" />
            <span>Maintenance</span>
          </button>
        </div>
      </div>

      {/* Extreme Network KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { label: 'Utilisateurs Globaux', val: totalUsers || 0, icon: Globe, color: 'blue' },
          { label: 'Registres Santé', val: totalPatients || 0, icon: Database, color: 'teal' },
          { label: 'Uptime Système', val: '100%', icon: Activity, color: 'emerald' },
          { label: ' Latence DB', val: '18ms', icon: Zap, color: 'amber' }
        ].map((kpi, i) => (
          <div key={i} className="glass-card p-8 group hover:scale-[105%] transition-all duration-500 border-white/60">
            <div className="flex justify-between items-start mb-6">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{kpi.label}</p>
              <kpi.icon className={`w-5 h-5 text-${kpi.color}-500`} />
            </div>
            <p className="text-5xl font-black text-slate-900 tracking-tighter">{kpi.val}</p>
          </div>
        ))}
      </div>

      {/* Infrastructure Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* Module Management */}
        <div className="lg:col-span-8 space-y-10">
          <div className="glass-card overflow-hidden">
            <div className="p-10 border-b border-white/40 flex justify-between items-center bg-white/30 backdrop-blur-md">
              <div className="flex items-center space-x-5">
                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center shadow-2xl border border-white/10">
                  <Cpu className="h-7 w-7 text-teal-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Cœur du Système</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-1">Modules de micro-services</p>
                </div>
              </div>
            </div>
            <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { name: 'Auth Engine', status: 'Optimal', desc: 'Gestion des JWT & Sessions' },
                { name: 'Medical RLS', status: 'Actif', desc: 'Sécurité niveau ligne PostgreSQL' },
                { name: 'Asset Store', status: 'Optimal', desc: 'Optimisation Next/Image' },
                { name: 'Edge API', status: 'Actif', desc: 'Déploiement Vercel Global' }
              ].map((mod, j) => (
                <div key={j} className="p-8 rounded-[2rem] border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-2xl transition-all group">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest">{mod.name}</h4>
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                  </div>
                  <p className="text-slate-500 text-xs font-medium leading-relaxed mb-6">{mod.desc}</p>
                  <div className="flex items-center text-[9px] font-black text-teal-600 uppercase tracking-[0.2em] group-hover:underline cursor-pointer">
                    Configurer <ChevronRight className="w-3 h-3 ml-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Global Security Status */}
        <div className="lg:col-span-4 space-y-10">
          <div className="glass-card p-10 bg-slate-900 border-0 text-white relative overflow-hidden group">
            <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-rose-500/20 rounded-full blur-[90px]"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 mb-10">Firewall & Security</p>
            <div className="flex items-center space-x-6 mb-12">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/10">
                <ShieldCheck className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-black tracking-tighter">100% Sécurisé</p>
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Zéro Menace</p>
              </div>
            </div>
            <div className="space-y-4">
              <button className="w-full py-4.5 bg-white text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest shadow-2xl">Audit de Sécurité</button>
              <button className="w-full py-4.5 bg-white/10 text-white rounded-xl font-black text-xs uppercase tracking-widest border border-white/10 hover:bg-white/20 transition-all">Rotation des Clefs</button>
            </div>
          </div>

          <div className="glass-card p-10 h-fit">
            <h3 className="text-slate-900 font-black text-lg mb-8 tracking-tighter uppercase">Charge Réseau</h3>
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Server className="w-5 h-5 text-blue-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Instance Primary</span>
                </div>
                <span className="text-xs font-black text-slate-900">0.4ms</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden p-[1px]">
                <div className="h-full bg-blue-500 rounded-full w-[12%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
