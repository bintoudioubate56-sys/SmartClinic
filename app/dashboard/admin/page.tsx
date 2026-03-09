import { createClient } from '@/lib/supabase/server'
import {
  Activity,
  ShieldCheck,
  TrendingUp,
  UserPlus,
  BarChart3,
  Zap,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'

interface AuditLog {
  id: string
  action: string
  timestamp: string
  ip_address: string | null
  users: { nom: string } | { nom: string }[] | null
}

export default async function AdminDashboard() {
  const supabase = createClient()

  // 1. Fetch Stats
  const { count: patientsCount } = await supabase.from('patients').select('*', { count: 'exact', head: true })
  const { count: staffCount } = await supabase.from('users').select('*', { count: 'exact', head: true })

  // 2. Fetch Latest Audit Logs
  const { data: logsData } = await supabase
    .from('audit_logs')
    .select(`
      id,
      action,
      timestamp,
      ip_address,
      users (nom)
    `)
    .order('timestamp', { ascending: false })
    .limit(4)

  const logs = logsData as unknown as AuditLog[]

  return (
    <div className="space-y-12 animate-slow-fade">
      {/* Header Elite */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Centre de Contrôle</h1>
          <p className="text-slate-500 font-medium mt-1">Supervisez l&apos;intégralité de l&apos;infrastructure clinique.</p>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/admin/staff/new"
            className="medical-gradient text-white px-8 py-4 rounded-2xl font-black text-sm shadow-2xl shadow-teal-500/20 hover:scale-[102%] transition-all flex items-center space-x-3"
          >
            <UserPlus className="h-5 w-5" />
            <span>Recruter Staff</span>
          </Link>
        </div>
      </div>

      {/* Extreme KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-4 glass-card p-10 group hover:bg-white/60 transition-all duration-500 border-white/60 relative overflow-hidden">
          <div className="absolute -right-5 -top-5 w-32 h-32 bg-teal-500/5 group-hover:bg-teal-500/10 rounded-full blur-2xl"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Base Patients</p>
          <p className="text-6xl font-black text-slate-900 tracking-tighter mb-8">{patientsCount || 0}</p>
          <div className="flex items-center text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 w-fit px-3 py-1.5 rounded-lg border border-emerald-100/50">
            <TrendingUp className="w-3.5 h-3.5 mr-2" /> Croissance Positive
          </div>
        </div>

        <div className="md:col-span-4 glass-card p-10 group hover:bg-white/60 transition-all duration-500 border-white/60 relative overflow-hidden">
          <div className="absolute -right-5 -top-5 w-32 h-32 bg-blue-500/5 group-hover:bg-blue-500/10 rounded-full blur-2xl"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Corps Médical</p>
          <p className="text-6xl font-black text-slate-900 tracking-tighter mb-8">{staffCount || 0}</p>
          <div className="flex items-center text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 w-fit px-3 py-1.5 rounded-lg border border-blue-100/50">
            <ShieldCheck className="w-3.5 h-3.5 mr-2" /> Certifié & Actif
          </div>
        </div>

        <div className="md:col-span-4 glass-card p-10 bg-slate-900 border-0 text-white relative overflow-hidden group">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-teal-500/20 rounded-full blur-[80px]"></div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-3">Intelligence</p>
                <p className="text-2xl font-black leading-tight italic tracking-tighter"> Rapports <br />Performance</p>
              </div>
              <Zap className="w-6 h-6 text-amber-500 fill-amber-500 animate-pulse" />
            </div>
            <button className="w-full mt-10 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all border border-white/10 flex items-center justify-center space-x-2">
              <span>Exporter Audit</span>
              <BarChart3 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Activity Logs Deluxe */}
        <div className="lg:col-span-8">
          <div className="glass-card overflow-hidden h-full">
            <div className="p-10 border-b border-white/40 flex justify-between items-center bg-white/30">
              <div className="flex items-center space-x-5">
                <div className="w-14 h-14 bg-white rounded-[1.5rem] shadow-xl border border-slate-100 flex items-center justify-center">
                  <Activity className="h-7 w-7 text-rose-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Journal d&apos;Intrusions</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Surveillance temps réel</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/dashboard/admin/audit" className="text-[11px] font-black text-rose-600 uppercase tracking-widest hover:underline decoration-2 underline-offset-8">
                  Historique complet
                </Link>
              </div>
            </div>

            <div className="divide-y divide-white/20">
              {logs && logs.length > 0 ? (
                logs.map((log: AuditLog) => {
                  const userAccount = Array.isArray(log.users) ? log.users[0] : log.users
                  return (
                    <div key={log.id} className="p-8 flex items-center justify-between hover:bg-white/60 group transition-all duration-500">
                      <div className="flex items-center space-x-6">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-rose-50 group-hover:text-rose-500 transition-all shadow-sm">
                          <Activity className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-black text-slate-800 uppercase tracking-tight">
                            {log.action === 'login' ? 'Auth: Session Validée' : log.action}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">
                            OPÉRATEUR : <span className="text-slate-900 font-black">{userAccount?.nom || 'UNK-PROFIL'}</span> • {new Date(log.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-[10px] font-black font-mono text-slate-400 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                          {log.ip_address || '0.0.0.0'}
                        </span>
                        <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-slate-400 transition-colors" />
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="p-24 text-center text-slate-300 font-black uppercase tracking-[0.5em] text-[10px]">
                  Aucun signal détecté.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="lg:col-span-4 space-y-8">
          <div className="glass-card p-10 medical-gradient !border-0 text-white relative overflow-hidden group">
            <div className="absolute right-[-60px] top-[-60px] w-64 h-64 bg-white/10 rounded-full blur-[90px] group-hover:scale-110 transition-transform duration-1000"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 opacity-60">Gestion RH</p>
            <h3 className="text-3xl font-black mb-6 relative z-10 leading-tight tracking-tighter">Pilotage des <br />Accès Staff</h3>
            <p className="text-teal-50/70 text-sm font-medium mb-10 relative z-10 leading-relaxed">
              Activez ou révoquez les privilèges instantanément pour maintenir l&apos;étanchéité de votre clinique.
            </p>
            <Link
              href="/dashboard/admin/staff"
              className="w-full bg-white text-teal-900 py-4.5 rounded-[1.2rem] font-black text-xs uppercase tracking-widest shadow-2xl flex items-center justify-center space-x-2 border border-white hover:bg-teal-50 transition-all relative z-10"
            >
              <span>Accéder à l&apos;Espace RH</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="glass-card p-10">
            <h3 className="text-slate-900 font-black text-lg mb-8 tracking-tighter">Infrastructure</h3>
            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-400">Charge Serveur</span>
                  <span className="text-slate-900">22%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden p-[1.5px]">
                  <div className="h-full bg-teal-500 rounded-full w-[22%]"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-400">Optimisation DB</span>
                  <span className="text-slate-900">Optimal</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden p-[1.5px]">
                  <div className="h-full bg-blue-500 rounded-full w-[94%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
