import { createClient } from '@/lib/supabase/server'
import {
  Users,
  UserPlus,
  Calendar,
  ArrowRight,
  Search,
  TrendingUp,
  Clock,
  ClipboardCheck,
  Plus
} from 'lucide-react'
import Link from 'next/link'

export default async function ReceptionDashboard() {
  const supabase = createClient()

  // 1. Fetch Stats
  const { count: patientsCount } = await supabase.from('patients').select('*', { count: 'exact', head: true })

  // 2. Fetch Todays Appointments
  const today = new Date().toISOString().split('T')[0]
  const { count: appointmentsCount } = await supabase
    .from('appointments')
    .select('*', { count: 'exact', head: true })
    .eq('date', today)

  // 3. Fetch Recent Patients
  const { data: recentPatients } = await supabase
    .from('patients')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(4)

  return (
    <div className="space-y-12 animate-slow-fade">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Accueil & Réception</h1>
          <p className="text-slate-500 font-medium mt-1">Gérez les admissions et les flux patients en temps réel.</p>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/reception/appointments/new"
            className="glass-card px-6 py-4 flex items-center space-x-3 text-slate-900 font-black text-sm border-white/80 hover:bg-white/90 transition-all shadow-xl"
          >
            <Calendar className="w-5 h-5 text-teal-600" />
            <span>Planning</span>
          </Link>
          <Link
            href="/dashboard/reception/patients/new"
            className="medical-gradient text-white px-8 py-4 rounded-2xl font-black text-sm shadow-2xl shadow-teal-500/20 hover:scale-[102%] transition-all flex items-center space-x-3"
          >
            <UserPlus className="w-5 h-5" />
            <span>Nouveau Patient</span>
          </Link>
        </div>
      </div>

      {/* KPI Section Ultra-Glass */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-card p-8 group hover:scale-[102%] transition-all duration-500 border-white/60 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-bl-[4rem] group-hover:bg-teal-500/10 transition-colors"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">File d&apos;attente</p>
              <p className="text-5xl font-black text-slate-900 tracking-tighter">{patientsCount || 0}</p>
            </div>
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-teal-600 shadow-xl shadow-slate-200">
              <Users className="w-8 h-8" />
            </div>
          </div>
          <div className="mt-8 flex items-center text-[10px] font-black text-teal-600 uppercase tracking-widest bg-teal-50 w-fit px-3 py-1.5 rounded-lg border border-teal-100/50">
            <Clock className="w-3.5 h-3.5 mr-2" /> Admission Rapide
          </div>
        </div>

        <div className="glass-card p-8 group hover:scale-[102%] transition-all duration-500 border-white/60 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-[4rem] group-hover:bg-blue-500/10 transition-colors"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">RDV du Jour</p>
              <p className="text-5xl font-black text-slate-900 tracking-tighter">{appointmentsCount || 0}</p>
            </div>
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-xl shadow-slate-200">
              <Calendar className="w-8 h-8" />
            </div>
          </div>
          <div className="mt-8 flex items-center text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 w-fit px-3 py-1.5 rounded-lg border border-blue-100/50">
            <TrendingUp className="w-3.5 h-3.5 mr-2" /> +4 depuis 8h
          </div>
        </div>

        <div className="glass-card p-8 medical-gradient !border-0 text-white relative overflow-hidden group">
          <div className="absolute right-[-20px] top-[-20px] w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-black text-teal-50/70 uppercase tracking-[0.3em] mb-3">Status Clinique</p>
              <p className="text-2xl font-black leading-tight italic">Flux Patients : <br /><span className="text-4xl underline decoration-white/30 underline-offset-8">Optimisé</span></p>
            </div>
            <Link href="/dashboard/reception/reports" className="mt-8 flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 hover:bg-white/30 transition-all w-fit">
              <span>Voir Analytics</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Recent Activity */}
        <div className="lg:col-span-8">
          <div className="glass-card overflow-hidden h-full">
            <div className="p-10 border-b border-white/40 flex justify-between items-center bg-white/30">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl border border-slate-100">
                  <ClipboardCheck className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Dernières Admissions</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Membres récemment enregistrés</p>
                </div>
              </div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Filtrer patients..." className="bg-white/40 border border-white/80 rounded-xl py-2 pl-10 pr-4 text-xs font-bold focus:outline-none focus:ring-4 focus:ring-teal-500/10 transition-all" />
              </div>
            </div>

            <div className="divide-y divide-white/20">
              {recentPatients && recentPatients.map((patient) => (
                <div key={patient.id} className="p-8 flex items-center justify-between hover:bg-white/50 group transition-all duration-500">
                  <div className="flex items-center space-x-6">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-900 font-black text-xl group-hover:scale-110 transition-transform">
                      {patient.nom.charAt(0)}
                    </div>
                    <div>
                      <p className="text-lg font-black text-slate-800 tracking-tighter uppercase">{patient.prenom} {patient.nom}</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-[10px] font-black text-teal-600 bg-teal-50 px-2 py-0.5 rounded uppercase tracking-widest">{patient.patient_number}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inscrit le {new Date(patient.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/dashboard/reception/patients/${patient.id}`} className="p-4 rounded-2xl bg-slate-50 text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-all group-hover:shadow-lg border border-transparent hover:border-teal-100">
                    <ArrowRight className="w-6 h-6" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions / Status */}
        <div className="lg:col-span-4 space-y-8">
          <div className="glass-card p-10 bg-slate-900 border-0 text-white relative overflow-hidden group">
            <div className="absolute top-[-50px] left-[-50px] w-64 h-64 bg-teal-500/20 rounded-full blur-[80px]"></div>
            <h3 className="text-2xl font-black mb-6 relative z-10">Action Rapide</h3>
            <div className="space-y-4 relative z-10">
              <button className="w-full py-5 bg-white text-slate-900 rounded-2xl font-black text-sm flex items-center justify-center space-x-3 hover:scale-[102%] transition-all shadow-2xl">
                <Plus className="w-5 h-5" />
                <span>Créer Dossier Patient</span>
              </button>
              <button className="w-full py-5 bg-white/10 text-white rounded-2xl font-black text-sm border border-white/10 hover:bg-white/20 transition-all flex items-center justify-center space-x-3">
                <Calendar className="w-5 h-5" />
                <span>Nouvelle Consultation</span>
              </button>
            </div>
          </div>

          <div className="glass-card p-10">
            <h3 className="text-slate-900 font-black text-lg mb-6 tracking-tight">Status Serveur</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Base de données</span>
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Auth Service</span>
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Stockage Images</span>
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
