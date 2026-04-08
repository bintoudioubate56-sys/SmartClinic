'use client'

import Sidebar from './Sidebar';
import { motion } from 'framer-motion';
import { UserRole } from '@/types/database.types';

interface DashboardShellProps {
  children: React.ReactNode;
  role: 'doctor' | 'receptionist' | 'admin' | 'patient';
  userName?: string;
}

export default function DashboardShell({ children, role, userName }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Global Aesthetics */}
      <div className="mesh-bg opacity-30 pointer-events-none" />
      
      <Sidebar role={role} />

      <main className="flex-1 ml-64 p-8 relative z-10 overflow-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400 mb-1">Espace {role}</h1>
            <p className="text-2xl font-black text-white">Bon retour, {userName || 'Utilisateur'}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-500">
              <span className="text-sm font-bold capitalize">{role.charAt(0)}</span>
            </div>
          </div>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
