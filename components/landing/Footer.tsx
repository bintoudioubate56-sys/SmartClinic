'use client'

import { Activity, Globe, Send, Camera, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-20 border-t border-white/5 relative">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Activity className="text-white w-5 h-5" />
              </div>
              <span className="text-lg font-black tracking-tighter text-white">SmartClinic</span>
            </Link>
            <p className="text-slate-500 max-w-sm">
              Révolutionner la gestion médicale en Guinée grâce à l'innovation digitale et la résilience technologique.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"><Globe size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"><Send size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"><Camera size={18} /></a>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-bold uppercase text-xs tracking-[0.2em]">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Mail className="w-4 h-4 text-indigo-400" />
                contact@smartclinic.gn
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Phone className="w-4 h-4 text-indigo-400" />
                +224 622 000 000
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <MapPin className="w-4 h-4 text-indigo-400" />
                Matam, Conakry, Guinée
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-bold uppercase text-xs tracking-[0.2em]">Plateforme</h4>
            <ul className="space-y-4">
              <li><Link href="/login" className="text-slate-400 text-sm hover:text-white transition-colors">Portail Clinique</Link></li>
              <li><Link href="/emergency" className="text-slate-400 text-sm hover:text-white transition-colors">Portail Urgence</Link></li>
              <li><Link href="/security" className="text-slate-400 text-sm hover:text-white transition-colors">Sécurité des données</Link></li>
              <li><Link href="/offline" className="text-slate-400 text-sm hover:text-white transition-colors">Fonctionnement Hors-ligne</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:row justify-between items-center gap-4 text-slate-600 text-xs font-medium">
          <p>© 2026 SmartClinic Guinée. Tous droits réservés.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white">Confidentialité</a>
            <a href="#" className="hover:text-white">Mentions Légales</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
