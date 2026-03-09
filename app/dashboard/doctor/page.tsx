import { createClient } from '@/lib/supabase/server'
import {
  Calendar,
  Clock,
  CheckCircle2,
  Stethoscope,
  ChevronRight,
  Search,
  Activity,
  Sparkles,
  Zap
} from 'lucide-react'
import Link from 'next/link'

export default async function DoctorDashboard() {
  const supabase = createClient()

  // 1. Fetch Today's Appointments for this Doctor
  const today = new Date().toISOString().split('T')[0]
  const { data: appointmentData } = await supabase
    .from('appointments')
    .select(`
      id,
      date,
      time,
      status,
      patients (nom, prenom)
    `)
    .eq('date', today)
    .order('time', { ascending: true })

  return (
    <div className="space-y-12 animate-slow-fade">
      {/* Precision Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <div className="inline-flex items-center space-x-3 px-4 py-1.5 bg-teal-50 text-teal-700 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-4 border border-teal-100/50">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Session Certifiée</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">Espace Praticien</h1>
          <p className="text-slate-500 font-medium mt-3 text-lg">Optimisez vos consultations et le suivi de vos patients.</p>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/doctor/calendar"
            className="glass-card px-8 py-5 flex items-center space-x-3 text-slate-900 font-black text-sm border-white/80 hover:bg-white/90 transition-all shadow-xl"
          >
            <Calendar className="w-5 h-5 text-teal-600" />
            <span>Agenda Complet</span>
          </Link>
        </div>
      </div>

      {/* Doctor KPIs - Precision Mode */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2 glass-card p-10 bg-slate-900 border-0 text-white relative overflow-hidden group">
          <div className="absolute top-[20%] right-[-10%] w-64 h-64 bg-teal-500/20 rounded-full blur-[100px] animate-pulse"></div>
          <div className="relative z-10 flex h-full items-center justify-between">
            <div className="space-y-6">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Prochaine Intervention</p>
              <div>
                <p className="text-4xl font-black tracking-tighter mb-1">09:45 AM</p>
                <p className="text-emerald-400 font-black uppercase text-[11px] tracking-widest flex items-center">
                  <Zap className="w-3.5 h-3.5 mr-2 fill-emerald-400" /> Dans 12 minutes
                </p>
              </div>
            </div>
            <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-3xl border border-white/10 shadow-2xl">
              <Clock className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>

        <div className="glass-card p-10 group hover:scale-[102%] transition-all duration-500 border-white/60">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Patients du jour</p>
          <p className="text-6xl font-black text-slate-900 tracking-tighter leading-none">
            {appointmentData?.length || 0}
          </p>
          <div className="mt-8 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-teal-500 w-[65%] rounded-full"></div>
          </div>
        </div>

        <div className="glass-card p-10 group hover:scale-[102%] transition-all duration-500 border-white/60">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Score Qualité</p>
          <p className="text-6xl font-black text-slate-900 tracking-tighter leading-none">9.8</p>
          <div className="mt-8 flex items-center text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 w-fit px-3 py-1.5 rounded-lg">
            <Activity className="w-3.5 h-3.5 mr-2" /> Top performance
          </div>
        </div>
      </div>

      {/* Agenda & Search */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          <div className="glass-card overflow-hidden">
            <div className="p-10 border-b border-white/40 flex justify-between items-center bg-white/30 backdrop-blur-md">
              <div className="flex items-center space-x-5">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-xl border border-slate-100">
                  <Calendar className="h-7 w-7 text-teal-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Planning Quotidien</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Consultations séquencées</p>
                </div>
              </div>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Rechercher patient..." className="bg-white/40 border border-white/80 rounded-xl py-3 pl-10 pr-6 text-xs font-bold focus:outline-none focus:ring-4 focus:ring-teal-500/10 transition-all font-outfit" />
              </div>
            </div>

            <div className="divide-y divide-white/20">
              {appointmentData && appointmentData.length > 0 ? (
                appointmentData.map((rdv: { id: string, time: string, status: string, patients: { nom: string, prenom: string } | { nom: string, prenom: string }[] }) => (
                  <div key={rdv.id} className="p-10 flex items-center justify-between hover:bg-white/60 group transition-all duration-500 cursor-pointer">
                    <div className="flex items-center space-x-10">
                      <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-teal-500 group-hover:text-white group-hover:border-teal-400 transition-all">
                        <p className="text-xl font-black leading-none">{rdv.time}</p>
                        <p className="text-[9px] font-black uppercase mt-1 opacity-60">Status: {rdv.status}</p>
                      </div>
                      <div>
                        <p className="text-xl font-black text-slate-800 tracking-tighter uppercase mb-1">
                          {Array.isArray(rdv.patients) ? `${rdv.patients[0].prenom} ${rdv.patients[0].nom}` : `${rdv.patients.prenom} ${rdv.patients.nom}`}
                        </p>
                        <div className="flex items-center space-x-4">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                            <Clock className="w-3.5 h-3.5 mr-2" /> 20 MIN Prévues
                          </span>
                          <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-3 opacity-0 group-hover:opacity-100 translate-x-10 group-hover:translate-x-0 transition-all duration-500">
                      <button className="bg-white text-slate-900 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl border border-white hover:bg-teal-500 hover:text-white transition-all">Détails</button>
                      <button className="medical-gradient text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">Consultation</button>
                    </div>
                    <ChevronRight className="w-6 h-6 text-slate-200 group-hover:hidden transition-all" />
                  </div>
                ))
              ) : (
                <div className="p-32 text-center text-slate-300 font-black uppercase tracking-[0.5em] text-[10px] leading-relaxed">
                  Aucune consultation <br />programmée pour aujourd&apos;hui.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="lg:col-span-4 space-y-10">
          <div className="glass-card p-10 medical-gradient !border-0 text-white relative overflow-hidden group">
            <div className="absolute right-[-40px] bottom-[-40px] w-56 h-56 bg-white/10 rounded-full blur-[80px] group-hover:scale-110 transition-all duration-1000"></div>
            <h3 className="text-3xl font-black mb-6 relative z-10 leading-tight">Prescription <br />Électronique</h3>
            <p className="text-teal-50/70 text-sm font-medium mb-10 relative z-10 leading-relaxed">
              Générez des ordonnances sécurisées avec signature biométrique et transmission immédiate au patient.
            </p>
            <button className="w-full bg-white text-teal-900 py-4.5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl flex items-center justify-center space-x-3 hover:bg-teal-50 transition-all relative z-10">
              <CheckCircle2 className="w-5 h-5" />
              <span>Nouveau Document</span>
            </button>
          </div>

          <div className="glass-card p-10 bg-white/50 border-white/60">
            <h3 className="text-slate-900 font-black text-lg mb-8 tracking-tighter">Bio-Statistiques</h3>
            <div className="space-y-8">
              <div className="flex items-center space-x-6">
                <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 shadow-sm border border-rose-100">
                  <Activity className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Vigilance</p>
                  <p className="text-lg font-black text-slate-900 leading-none">0 Alertes Bio</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 shadow-sm border border-teal-100">
                  <Stethoscope className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Efficacité</p>
                  <p className="text-lg font-black text-slate-900 leading-none">+18% vs Hier</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
