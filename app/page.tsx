'use client'

import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Footer from '@/components/landing/Footer';
import { motion, useScroll, useSpring } from 'framer-motion';

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <main className="relative min-h-screen bg-slate-950 selection:bg-indigo-500/30">
      {/* Global Aesthetics */}
      <div className="mesh-bg opacity-40" />
      
      {/* Scroll Progress Indicator */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-indigo-500 origin-left z-[60]"
        style={{ scaleX }}
      />

      <Navbar />
      
      <div className="relative">
        <Hero />
        
        {/* Subtle separator */}
        <div className="container mx-auto px-6">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>

        <Features />
        
        {/* Emergency Portal Teaser Section */}
        <section id="emergency" className="py-24 relative overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="glass p-12 rounded-[3rem] border border-red-500/20 relative overflow-hidden group">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-600/10 blur-[96px] rounded-full group-hover:scale-125 transition-transform duration-700" />
              
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                  Urgence Vitale
                </div>
                <h3 className="text-4xl font-black text-white mb-6 leading-tight">
                  Scannez. Identifiez. <br />
                  <span className="text-red-500/80">Sauvez des vies.</span>
                </h3>
                <p className="text-slate-400 text-lg mb-8">
                  En cas d'accident, votre code QR SmartClinic permet aux urgentistes d'accéder instantanément à votre groupe sanguin et vos allergies, sans authentification requise.
                </p>
                <div className="flex gap-4">
                  <button className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all shadow-xl shadow-red-600/20 active:scale-95">
                    Découvrir l'Accès Urgence
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Clinics Showcase / Partners */}
        <section id="clinics" className="py-24 border-t border-white/5">
          <div className="container mx-auto px-6 text-center">
            <h4 className="text-slate-500 font-bold uppercase text-xs tracking-[0.3em] mb-12">Ils nous font confiance</h4>
            <div className="flex flex-wrap justify-center items-center gap-16 opacity-50 grayscale hover:grayscale-0 transition-all">
              <span className="text-2xl font-black text-white tracking-tighter">Clinique Ambroise Paré</span>
              <span className="text-2xl font-black text-white tracking-tighter">Hôpital National Donka</span>
              <span className="text-2xl font-black text-white tracking-tighter">Pasteur Conakry</span>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}
