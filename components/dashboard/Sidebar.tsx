'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Users, 
  Calendar, 
  FileText, 
  Settings, 
  LayoutDashboard, 
  LogOut,
  Activity,
  ShieldCheck
} from 'lucide-react';
import { signOut } from '@/actions/auth';

interface SidebarProps {
  role: 'doctor' | 'receptionist' | 'admin' | 'patient';
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  const getLinks = () => {
    const base = [
      { name: 'Dashboard', href: `/dashboard/${role}`, icon: LayoutDashboard },
    ];

    if (role === 'doctor' || role === 'admin' || role === 'receptionist') {
      base.push({ name: 'Patients', href: `/dashboard/${role}/patients`, icon: Users });
      base.push({ name: 'Rendez-vous', href: `/dashboard/${role}/appointments`, icon: Calendar });
    }

    if (role === 'doctor') {
      base.push({ name: 'Dossiers Medicaux', href: `/dashboard/doctor/records`, icon: FileText });
    }

    if (role === 'admin') {
      base.push({ name: 'Audit Logs', href: `/dashboard/admin/audit`, icon: ShieldCheck });
      base.push({ name: 'Configuration', href: `/dashboard/admin/settings`, icon: Settings });
    }

    return base;
  };

  const links = getLinks();

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 glass border-r border-white/5 flex flex-col p-6 z-40">
      <div className="flex items-center gap-2 mb-12">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
          <Activity className="text-white w-5 h-5" />
        </div>
        <span className="text-lg font-black tracking-tighter text-white">SmartClinic</span>
      </div>

      <nav className="flex-1 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <Icon size={20} />
              <span className="text-sm font-bold">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => signOut()}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all mt-auto"
      >
        <LogOut size={20} />
        <span className="text-sm font-bold">Déconnexion</span>
      </button>
    </aside>
  );
}
