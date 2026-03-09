import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import {
  ShieldCheck,
  Zap,
  Users,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  MousePointer2,
  Target,
  Heart
} from 'lucide-react'

export default async function HomePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userData?.role) {
      redirect(`/dashboard/${userData.role}`)
    }
  }

  return (
    <div className="min-h-screen bg-transparent font-inter selection:bg-teal-200 selection:text-teal-900 overflow-x-hidden relative">
      <Navbar />

      {/* Hero Glows - Adjusted for mobile */}
      <div className="fixed top-[-5%] left-[-5%] w-[60%] sm:w-[40%] h-[40%] bg-teal-300/15 blur-[80px] sm:blur-[120px] rounded-full animate-pulse-slow"></div>
      <div className="fixed bottom-[-5%] right-[-5%] w-[60%] sm:w-[40%] h-[40%] bg-blue-300/15 blur-[80px] sm:blur-[120px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 sm:pt-64 sm:pb-32 lg:pt-80 lg:pb-48 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-24 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8 sm:space-y-12 animate-slow-fade text-center lg:text-left">
              <div className="inline-flex items-center space-x-3 px-4 py-2 bg-white/40 backdrop-blur-md border border-white/60 rounded-full shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-slate-700">L&apos;Ingénierie Clinique de Demain</span>
              </div>

              <h1 className="text-5xl sm:text-7xl lg:text-[110px] font-black text-slate-900 leading-[1.1] lg:leading-[0.9] tracking-[-0.04em]">
                La santé <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-blue-600 to-indigo-600">Sur-Mesure.</span>
              </h1>

              <p className="text-lg sm:text-2xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0 text-balance">
                SmartClinic fusionne <span className="text-slate-900 font-black">luxe technologique</span> et <span className="text-slate-900 font-black">précision médicale</span> pour propulser votre établissement dans l&apos;ère du tout-numérique.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-6 justify-center lg:justify-start">
                <Link href="/register" className="medical-gradient text-white px-8 sm:px-12 py-5 sm:py-6 rounded-2xl sm:rounded-[2rem] font-black text-lg sm:text-xl shadow-[0_20px_60px_-15px_rgba(13,148,136,0.3)] hover:scale-[103%] transition-all flex items-center justify-center space-x-4 group">
                  <span>Ouvrir un compte</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </Link>
                <button className="glass-card px-8 sm:px-12 py-5 sm:py-6 rounded-2xl sm:rounded-[2rem] font-black text-lg sm:text-xl text-slate-900 border-white/80 hover:bg-white/90 transition-all flex items-center justify-center group">
                  <span>Voir la démo</span>
                  <MousePointer2 className="w-5 h-5 ml-4 group-hover:scale-125 transition-transform" />
                </button>
              </div>

              {/* Stats - Fully Responsive Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 pt-12 border-t border-slate-200/50">
                <div className="space-y-1">
                  <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter">99.9%</p>
                  <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Uptime Garanti</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter">AES-256</p>
                  <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Chiffrement</p>
                </div>
                <div className="col-span-2 lg:col-span-1 space-y-1 hidden sm:block">
                  <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter">+10k</p>
                  <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Consultations</p>
                </div>
              </div>
            </div>

            {/* Right Asset */}
            <div className="lg:col-span-5 relative group animate-slow-fade lg:block" style={{ animationDelay: '0.4s' }}>
              <div className="absolute -inset-10 bg-gradient-to-tr from-teal-500/10 to-blue-500/10 blur-[80px] rounded-full transition-all"></div>
              <div className="relative glass-card p-4 sm:p-6 rounded-[2rem] sm:rounded-[3rem] overflow-hidden rotate-0 lg:rotate-2 group-hover:rotate-0 transition-all duration-1000 shadow-2xl border-white/80">
                <Image
                  src="/hero-medical.png"
                  width={1000}
                  height={1000}
                  alt="Elite Experience"
                  className="rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl scale-100 group-hover:scale-105 transition-transform duration-1000 object-cover aspect-video lg:aspect-square"
                  priority
                />
                
                {/* Floating Badges - Desktop only for less clutter on mobile */}
                <div className="hidden sm:block absolute bottom-8 left-8 glass-card p-6 border-white/60 z-20 animate-float shadow-2xl">
                  <div className="flex items-center space-x-4 text-slate-900">
                    <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 leading-none mb-1 tracking-widest">Confiance</p>
                      <p className="text-sm font-black leading-none">Certifié Elite</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="relative py-24 sm:py-48 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center space-y-4 mb-16 sm:mb-32">
            <h2 className="text-4xl sm:text-6xl lg:text-8xl font-black text-slate-900 tracking-tighter leading-none">
              L&apos;excellence, <br />
              <span className="text-teal-600/20">par le design.</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-12">
            {[
              { icon: Target, title: "Précision Médicale", desc: "Suivi chirurgical de chaque patient avec dossiers synchronisés en temps réel.", color: "teal" },
              { icon: ShieldCheck, title: "Zéro Compromis", desc: "Hébergement sécurisé et conformité totale aux normes de confidentialité.", color: "blue" },
              { icon: Zap, title: "Flux Instantané", desc: "Réduisez le temps de passage en réception de 60% grâce à nos automatisations.", color: "indigo" }
            ].map((f, i) => (
              <div key={i} className="glass-card p-8 sm:p-12 group hover:bg-slate-900 hover:text-white transition-all duration-500 border-white/60 relative">
                <div className="w-16 h-16 bg-white rounded-2xl sm:rounded-3xl flex items-center justify-center text-slate-900 mb-8 shadow-xl group-hover:scale-110 transition-transform">
                  <f.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black mb-4 tracking-tight leading-none">{f.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed sm:text-lg group-hover:text-slate-400 transition-colors">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust CTA */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto glass-card !bg-slate-900 p-8 sm:p-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-transparent opacity-50"></div>
          <div className="relative z-10 space-y-8 sm:space-y-12">
            <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black text-white tracking-tighter">
              Élevez le standard <br className="hidden sm:block" /> de votre clinique aujourd&apos;hui.
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
              <Link href="/register" className="medical-gradient text-white px-10 sm:px-12 py-5 sm:py-6 rounded-2xl sm:rounded-3xl font-black text-lg sm:text-xl hover:scale-105 transition-all shadow-2xl shadow-teal-500/20">
                Lancer SmartClinic
              </Link>
              <button className="px-10 sm:px-12 py-5 sm:py-6 rounded-2xl sm:rounded-3xl font-black text-lg sm:text-xl text-white border border-white/20 hover:bg-white/5 transition-all">
                Demander une démo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Refined Footer */}
      <footer className="py-20 px-4 sm:px-6 border-t border-slate-200/50 bg-white/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 sm:gap-20">
          <div className="col-span-2 space-y-8">
            <div className="flex items-center space-x-3">
              <Stethoscope className="text-teal-600 w-7 h-7" />
              <span className="text-2xl font-black text-slate-900 tracking-tighter">SmartClinic</span>
            </div>
            <p className="text-slate-500 font-medium text-lg max-w-sm">
              Le futur de la gestion médicale en Guinée. Allie élégance et performance pour les praticiens d&apos;élite.
            </p>
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Ressources</h4>
            <ul className="space-y-3 font-bold text-slate-600 text-sm">
              <li><a href="#" className="hover:text-teal-600">Produit</a></li>
              <li><a href="#" className="hover:text-teal-600">Tarifs</a></li>
              <li><a href="#" className="hover:text-teal-600">Aide</a></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Légal</h4>
            <ul className="space-y-3 font-bold text-slate-600 text-sm">
              <li><a href="#" className="hover:text-teal-600">Privacy</a></li>
              <li><a href="#" className="hover:text-teal-600">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-200/20 flex flex-col md:flex-row justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest gap-4">
          <p>© 2026 SmartClinic. Excellence Everywhere.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-teal-600">LinkedIn</a>
            <a href="#" className="hover:text-teal-600">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
