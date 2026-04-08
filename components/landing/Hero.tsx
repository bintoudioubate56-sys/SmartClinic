'use client'

import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, MousePointer2, ShieldCheck, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Mesh Gradient Background Decor */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 blur-[128px] rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/10 blur-[128px] rounded-full" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              L'excellence médicale en Guinée
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight">
              La santé, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-indigo-400">connectée & sûre.</span>
            </h1>
            
            <p className="text-xl text-slate-400 max-w-xl leading-relaxed">
              SmartClinic digitalise le parcours de soin guinéen. Dossiers médicaux audités, cartes patients intelligentes et accès d'urgence instantané — même sans connexion.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link 
                href="/login" 
                className="group px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl flex items-center gap-2 shadow-2xl shadow-indigo-600/30 transition-all active:scale-95"
              >
                Commencer l'aventure
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/emergency" 
                className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all flex items-center gap-2"
              >
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                Accès Urgence
              </Link>
            </div>

            <div className="flex items-center gap-8 pt-8">
              <div className="space-y-1">
                <p className="text-3xl font-black text-white">99.9%</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Disponibilité</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="space-y-1">
                <p className="text-3xl font-black text-white">Off-Line</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Technologie Sync</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl aspect-[4/3]">
              <Image 
                src="/images/hero.png" 
                alt="Clinique Moderne SmartClinic Conakry" 
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              
              {/* Floating Badge */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="glass p-4 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                    <Zap className="text-emerald-400 w-6 h-6 fill-emerald-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold">Innovation Conakry 2026</p>
                    <p className="text-xs text-slate-400">Certifié conforme aux normes cliniques internationales</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-indigo-600/10 blur-[48px] rounded-full animate-pulse" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-emerald-600/10 blur-[48px] rounded-full animate-pulse" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
