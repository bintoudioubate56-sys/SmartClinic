import {
  Stethoscope,
  ArrowRight,
  ShieldCheck,
  UserPlus
} from 'lucide-react'
import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-transparent font-outfit relative flex items-center justify-center p-6 overflow-hidden">
      {/* Background Decor */}
      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-300/10 blur-[150px] rounded-full"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-300/10 blur-[150px] rounded-full"></div>
      <div className="fixed inset-0 bg-noise z-0 pointer-events-none"></div>

      <div className="w-full max-w-xl relative animate-slow-fade">
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex flex-col items-center group">
            <div className="w-20 h-20 medical-gradient rounded-[2rem] flex items-center justify-center shadow-2xl shadow-teal-500/40 mb-6 group-hover:scale-110 transition-transform duration-500">
              <Stethoscope className="text-white w-10 h-10" />
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">SmartClinic</h1>
            <p className="text-[10px] uppercase tracking-[0.5em] text-teal-600 font-black mt-2 opacity-60">Health Registration</p>
          </Link>
        </div>

        <div className="glass-card p-12 border-white/60 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)]">
          <div className="flex items-center space-x-3 mb-10">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Créer votre compte</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5 leading-none">Portail Patient Unique</p>
            </div>
          </div>

          <form action="/auth/signup" method="post" className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2.5">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Nom</label>
                <input
                  name="nom"
                  type="text"
                  placeholder="Dupont"
                  required
                  className="w-full bg-white/40 border border-white/80 rounded-2xl px-6 py-5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-teal-500/10 transition-all"
                />
              </div>
              <div className="space-y-2.5">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Prénom</label>
                <input
                  name="prenom"
                  type="text"
                  placeholder="Jean"
                  required
                  className="w-full bg-white/40 border border-white/80 rounded-2xl px-6 py-5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-teal-500/10 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Email</label>
              <input
                name="email"
                type="email"
                placeholder="patient@email.com"
                required
                className="w-full bg-white/40 border border-white/80 rounded-2xl px-6 py-5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-teal-500/10 transition-all"
              />
            </div>

            <div className="space-y-2.5">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Mot de passe</label>
              <input
                name="password"
                type="password"
                placeholder="••••••••••••"
                required
                className="w-full bg-white/40 border border-white/80 rounded-2xl px-6 py-5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-teal-500/10 transition-all font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full medical-gradient text-white py-6 rounded-2xl font-black text-lg shadow-[0_20px_40px_rgba(13,148,136,0.25)] hover:scale-[102%] transition-all flex items-center justify-center space-x-3 group"
            >
              <span>Finaliser l&apos;inscription</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </form>

          <div className="mt-12 pt-10 border-t border-slate-100 flex flex-col items-center space-y-4">
            <p className="text-sm font-bold text-slate-400">Déjà inscrit ?</p>
            <Link
              href="/login"
              className="w-full text-center py-5 rounded-2xl border-2 border-slate-100 font-black text-sm text-slate-800 hover:bg-slate-50 transition-colors uppercase tracking-[0.1em]"
            >
              Se connecter
            </Link>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-center space-x-3 opacity-40">
          <ShieldCheck className="w-4 h-4 text-slate-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Protection GDRP & Chiffrement de bout en bout</span>
        </div>
      </div>
    </div>
  )
}
