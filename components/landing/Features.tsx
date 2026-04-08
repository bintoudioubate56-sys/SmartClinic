'use client'

import { motion } from 'framer-motion';
import { 
  History, 
  CreditCard, 
  WifiOff, 
  Smartphone, 
  ShieldAlert, 
  Database,
  BellRing,
  Lock
} from 'lucide-react';

const features = [
  {
    title: "Historique Médical Audité",
    desc: "Suivi complet des consultations avec traçabilité totale pour sécuriser le parcours patient.",
    icon: <History className="w-6 h-6" />,
    color: "from-blue-500/20 to-indigo-500/20",
    border: "border-indigo-500/30",
    textColor: "text-indigo-400"
  },
  {
    title: "Carte Patient Digitale",
    desc: "Génération de cartes d'identité médicale avec QR token unique pour une identification instantanée.",
    icon: <CreditCard className="w-6 h-6" />,
    color: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-500/30",
    textColor: "text-emerald-400"
  },
  {
    title: "Résilience Hors-ligne",
    desc: "Continuez vos consultations même sans Wi-Fi. Synchronisation automatique dès le retour en ligne.",
    icon: <WifiOff className="w-6 h-6" />,
    color: "from-orange-500/20 to-red-500/20",
    border: "border-orange-500/30",
    textColor: "text-orange-400"
  },
  {
    title: "Rappels SMS Automatisés",
    desc: "Réduisez les rendez-vous manqués grâce aux notifications envoyées via Africa's Talking.",
    icon: <BellRing className="w-6 h-6" />,
    color: "from-purple-500/20 to-fuchsia-500/20",
    border: "border-purple-500/30",
    textColor: "text-purple-400"
  },
  {
    title: "Accès d'Urgence QR",
    desc: "En cas de malaise, les secours accèdent aux données vitales (sang, allergies) via un simple scan.",
    icon: <ShieldAlert className="w-6 h-6" />,
    color: "from-red-600/20 to-rose-600/20",
    border: "border-red-600/30",
    textColor: "text-red-400"
  },
  {
    title: "Sécurité de Grade Médical",
    desc: "Chiffrement des données sensibles et contrôle d'accès strict par rôles (RBAC).",
    icon: <Lock className="w-6 h-6" />,
    color: "from-slate-500/20 to-slate-800/20",
    border: "border-slate-500/30",
    textColor: "text-slate-400"
  }
];

export default function Features() {
  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Une plateforme complète pour <br />
            <span className="text-indigo-400">une clinique moderne.</span>
          </h2>
          <p className="text-slate-400">
            Conçue pour répondre aux défis spécifiques des infrastructures de santé en Guinée.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className={`p-8 rounded-[2rem] glass-card border ${feature.border} hover:scale-[1.02] transition-all group cursor-default`}
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-xl`}>
                <div className={`${feature.textColor}`}>
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                {feature.desc}
              </p>
              
              <div className="mt-6 pt-6 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className={`text-xs font-black uppercase tracking-widest ${feature.textColor} flex items-center gap-2`}>
                  En savoir plus
                  <div className="w-4 h-[1px] bg-current" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
