import { createClient } from '@/lib/supabase/server'
import {
  Calendar,
  Clock,
  Activity,
  QrCode,
  ShieldCheck,
  TrendingUp,
  Stethoscope,
  Sparkles,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default async function PatientDashboard() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 1. Fetch Patient Profile & ID
  const { data: profile } = await supabase
    .from('users')
    .select('*, patients(*)')
    .eq('id', user?.id)
    .single()

  const patient = Array.isArray(profile?.patients) ? profile?.patients[0] : profile?.patients

  // 2. Fetch Next Appointment
  const { data: nextRDV } = await supabase
    .from('appointments')
    .select('*')
    .eq('patient_id', patient?.id)
    .gte('date', new Date().toISOString().split('T')[0])
    .order('date', { ascending: true })
    .order('time', { ascending: true })
    .limit(1)
    .single()

  return (
    <div className="space-y-12 animate-slow-fade">
      {/* Patient Elite Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <div className="inline-flex items-center space-x-3 px-4 py-1.5 bg-rose-50 text-rose-700 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-4 border border-rose-100/50">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Votre Santé, Notre Priorité</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">Bonjour, {profile?.nom}</h1>
          <p className="text-slate-500 font-medium mt-3 text-lg">Retrouvez votre carnet de santé numérique et vos rendez-vous.</p>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/patient/appointments/new"
            className="medical-gradient text-white px-10 py-5 rounded-[2rem] font-black text-sm shadow-2xl shadow-teal-500/30 hover:scale-[103%] transition-all flex items-center space-x-3 group"
          >
            <span>Prendre un RDV</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Patient Experience Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* QR Identification Card */}
        <div className="lg:col-span-4 h-full">
          <div className="glass-card p-10 bg-slate-900 border-0 text-white h-full relative overflow-hidden flex flex-col items-center text-center justify-center group">
            <div className="absolute top-[-40px] right-[-40px] w-64 h-64 bg-teal-500/10 rounded-full blur-[100px]"></div>
            <div className="relative z-10 w-full">
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 mb-10">Votre Clef Numérique</p>
              <div className="relative inline-block mb-10 group/qr">
                <div className="absolute -inset-6 bg-white/20 blur-xl rounded-full opacity-0 group-hover/qr:opacity-100 transition-opacity"></div>
                <div className="relative bg-white p-6 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
                  {patient?.patient_number ? (
                    <div className="relative w-40 h-40">
                      <Image
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${patient.patient_number}`}
                        alt="Patient QR Code"
                        width={200}
                        height={200}
                        className="rounded-xl"
                      />
                    </div>
                  ) : (
                    <QrCode className="w-40 h-40 text-slate-200" />
                  )}
                </div>
              </div>
              <h3 className="text-3xl font-black tracking-tighter mb-4">{patient?.patient_number || 'EN ATTENTE'}</h3>
              <p className="text-[11px] font-black text-teal-400 uppercase tracking-widest opacity-80 mb-10">Identifiant Unique SmartClinic</p>
              <button className="w-full py-5 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/10 transition-all font-black text-xs uppercase tracking-widest">
                Partager l&apos;Identité
              </button>
            </div>
          </div>
        </div>

        {/* Vital Info & Next RDV */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Next RDV Card */}
          <div className="glass-card p-10 flex flex-col justify-between group hover:border-teal-500 transition-all border-white/60 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-bl-[4rem]"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mb-8 shadow-sm">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Prochain Rendez-vous</h3>
              {nextRDV ? (
                <div className="space-y-2">
                  <p className="text-3xl font-black text-slate-900 tracking-tighter">{new Date(nextRDV.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                  <p className="text-xl font-bold text-teal-600">À {nextRDV.time}</p>
                </div>
              ) : (
                <p className="text-xl font-black text-slate-300 uppercase tracking-tighter">Aucun RDV programmé</p>
              )}
            </div>
            <Link href="/dashboard/patient/appointments" className="mt-12 flex items-center text-[10px] font-black text-slate-800 uppercase tracking-widest hover:text-teal-600 transition-colors relative z-10 group/link">
              Voir tous mes rendez-vous <ArrowRight className="w-3 h-3 ml-2 group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Health Stats */}
          <div className="glass-card p-10 flex flex-col justify-between group bg-white/50 border-white/60">
            <div className="relative z-10">
              <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mb-8 shadow-sm">
                <Activity className="w-8 h-8" />
              </div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6">Paramètres Vitaux</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Groupe Sanguin</span>
                  <span className="text-xl font-black text-rose-600 italic">O+</span>
                </div>
                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dernier Checkup</span>
                  <span className="text-[11px] font-black text-slate-900 uppercase">24 Jan 2026</span>
                </div>
              </div>
            </div>
            <div className="mt-8 flex items-center space-x-2 text-[9px] font-black text-emerald-600 uppercase tracking-[0.2em] bg-emerald-50 px-3 py-1.5 rounded-lg w-fit">
              <ShieldCheck className="w-3 h-3" /> <span>Dossier Synchronisé</span>
            </div>
          </div>

          {/* Quick CTAs */}
          <div className="md:col-span-2 grid grid-cols-3 gap-6">
            {[
              { title: 'Prescriptions', icon: Stethoscope, color: 'blue' },
              { title: 'Analyses', icon: TrendingUp, color: 'indigo' },
              { title: 'Historique', icon: Clock, color: 'teal' }
            ].map((item, id) => (
              <button key={id} className="glass-card p-8 flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-500">
                <div className={`w-14 h-14 rounded-2xl bg-white shadow-xl flex items-center justify-center text-slate-900 mb-6 group-hover:bg-slate-900 group-hover:text-white transition-all`}>
                  <item.icon className="w-7 h-7" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-800">{item.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
