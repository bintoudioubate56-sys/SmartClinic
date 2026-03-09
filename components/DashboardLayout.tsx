'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Users,
    Calendar,
    LogOut,
    Menu,
    X,
    LayoutDashboard,
    ClipboardList,
    ShieldCheck,
    Building2,
    Stethoscope,
    ChevronRight,
    Bell,
    Settings,
    Search
} from 'lucide-react'

interface NavItem {
    title: string
    href: string
    icon: React.ReactNode
}

interface UserProfile {
    nom: string
    role: string
    clinique?: { nom: string }
}

export default function DashboardLayout({
    children,
    user
}: {
    children: React.ReactNode
    user: UserProfile
}) {
    const [isSidebarOpen, setSidebarOpen] = useState(false)
    const pathname = usePathname()

    const navigation: Record<string, NavItem[]> = {
        superadmin: [
            { title: 'Vue Globale', href: '/dashboard/superadmin', icon: <LayoutDashboard className="w-5 h-5" /> },
            { title: 'Réseau Cliniques', href: '/dashboard/superadmin/clinics', icon: <Building2 className="w-5 h-5" /> },
            { title: 'Audit Système', href: '/dashboard/superadmin/audit', icon: <ShieldCheck className="w-5 h-5" /> },
        ],
        admin: [
            { title: 'Tableau de bord', href: '/dashboard/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
            { title: 'Équipe Staff', href: '/dashboard/admin/staff', icon: <Users className="w-5 h-5" /> },
            { title: 'Planning Clinique', href: '/dashboard/admin/schedule', icon: <Calendar className="w-5 h-5" /> },
            { title: 'Journal d\'audit', href: '/dashboard/admin/audit', icon: <ClipboardList className="w-5 h-5" /> },
        ],
        doctor: [
            { title: 'Mes Patients', href: '/dashboard/doctor', icon: <Users className="w-5 h-5" /> },
            { title: 'Agenda', href: '/dashboard/doctor/calendar', icon: <Calendar className="w-5 h-5" /> },
            { title: 'Dossiers Medicaux', href: '/dashboard/doctor/records', icon: <ClipboardList className="w-5 h-5" /> },
        ],
        reception: [
            { title: 'Accueil', href: '/dashboard/reception', icon: <LayoutDashboard className="w-5 h-5" /> },
            { title: 'Patients', href: '/dashboard/reception/patients', icon: <Users className="w-5 h-5" /> },
            { title: 'Rendez-vous', href: '/dashboard/reception/appointments', icon: <Calendar className="w-5 h-5" /> },
        ],
        patient: [
            { title: 'Mon Espace', href: '/dashboard/patient', icon: <LayoutDashboard className="w-5 h-5" /> },
            { title: 'Mes RDV', href: '/dashboard/patient/appointments', icon: <Calendar className="w-5 h-5" /> },
            { title: 'Dossier Santé', href: '/dashboard/patient/records', icon: <ClipboardList className="w-5 h-5" /> },
        ]
    }

    const currentNav = navigation[user.role] || []

    return (
        <div className="flex min-h-screen bg-transparent font-outfit relative">
            <div className="fixed inset-0 bg-noise z-0 pointer-events-none"></div>

            {/* Sidebar Desktop Ultra-Premium */}
            <aside className="hidden lg:flex flex-col w-80 m-8 mr-0 rounded-[2.5rem] sidebar-glass border-white/60 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] fixed h-[calc(100vh-4rem)] z-50">
                <div className="p-10">
                    <div className="flex items-center space-x-4 group cursor-pointer mb-12">
                        <div className="w-12 h-12 medical-gradient rounded-2xl flex items-center justify-center shadow-2xl shadow-teal-500/30 group-hover:rotate-[15deg] transition-all duration-500">
                            <Stethoscope className="text-white w-7 h-7" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">SmartClinic</h1>
                            <p className="text-[10px] uppercase tracking-[0.5em] text-teal-600 font-black leading-none mt-2 opacity-60">Est. 2026</p>
                        </div>
                    </div>

                    <div className="relative mb-8">
                        <div className="absolute inset-y-0 left-4 flex items-center text-slate-400">
                            <Search className="w-4 h-4" />
                        </div>
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            className="w-full bg-white/40 border border-white/80 rounded-2xl py-3 pl-12 pr-4 text-xs font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-teal-500/10 placeholder:text-slate-300 transition-all font-outfit"
                        />
                    </div>
                </div>

                <nav className="flex-1 px-6 space-y-2 overflow-y-auto custom-scrollbar">
                    <p className="px-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Espace {user.role}</p>
                    {currentNav.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center justify-between px-6 py-4 rounded-[1.5rem] transition-all duration-500 group relative ${isActive
                                    ? 'medical-gradient text-white shadow-2xl shadow-teal-500/30'
                                    : 'text-slate-500 hover:bg-white/60 hover:text-slate-900'
                                    }`}
                            >
                                <div className="flex items-center space-x-4">
                                    <span className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-teal-600 group-hover:rotate-12'} transition-all duration-300`}>
                                        {item.icon}
                                    </span>
                                    <span className="font-black text-sm tracking-tight">{item.title}</span>
                                </div>
                                {isActive && <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-sm shadow-white"></div>}
                                {!isActive && <ChevronRight className="w-4 h-4 text-slate-200 group-hover:translate-x-1 transition-transform" />}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-6 mt-auto">
                    <div className="glass-card p-6 border-white/80 !bg-white/40 shadow-xl">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="w-12 h-12 rounded-[1.2rem] medical-gradient-vibrant p-[2px] shadow-xl">
                                <div className="w-full h-full bg-white rounded-[1.1rem] flex items-center justify-center overflow-hidden">
                                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-900 font-black text-xl tracking-tighter uppercase">
                                        {user.nom.charAt(0)}
                                    </div>
                                </div>
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-black text-slate-900 truncate uppercase tracking-tighter">{user.nom}</p>
                                <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest opacity-80 truncate mt-1">
                                    {user.role}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex-1 bg-white/60 hover:bg-white text-slate-800 p-2.5 rounded-xl transition-all border border-white/80 group">
                                <Settings className="w-4 h-4 mx-auto group-hover:rotate-90 transition-transform" />
                            </button>
                            <form action="/auth/signout" method="post" className="flex-[2]">
                                <button
                                    type="submit"
                                    className="w-full h-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 group"
                                >
                                    <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                                    <span>Quitter</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-[22rem] p-8 lg:p-12 relative z-10">
                {/* Modern Dynamic Header */}
                <header className="flex justify-between items-center mb-12 lg:mb-16">
                    <div className="lg:hidden">
                        <button onClick={() => setSidebarOpen(true)} className="p-4 bg-white/60 backdrop-blur-md rounded-2xl border border-white/80 shadow-xl group">
                            <Menu className="w-6 h-6 text-slate-900 group-hover:scale-110 transition-transform" />
                        </button>
                    </div>

                    <div className="hidden lg:block">
                        <div className="flex flex-col">
                            <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-1 leading-none">Perspective</h2>
                            <p className="text-2xl font-black text-slate-900 tracking-tighter">Espace {user.clinique?.nom || user.role}</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="hidden sm:flex items-center space-x-4 bg-white/40 backdrop-blur-md border border-white/80 rounded-2xl px-5 py-2.5">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none">Node: Conakry-01</span>
                        </div>

                        <button className="p-4 bg-white/60 backdrop-blur-md rounded-2xl border border-white/80 text-slate-900 hover:text-teal-600 shadow-xl transition-all relative group overflow-hidden">
                            <div className="absolute inset-0 bg-teal-500 opacity-0 group-hover:opacity-5 transition-opacity"></div>
                            <Bell className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform" />
                            <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-bounce"></span>
                        </button>
                    </div>
                </header>

                <div className="animate-slow-fade">
                    {children}
                </div>
            </main>

            {/* Mobile Sidebar Ultra-Glass */}
            {isSidebarOpen && (
                <div className="fixed inset-0 z-[100] bg-slate-900/10 backdrop-blur-md lg:hidden transition-opacity">
                    <div className="absolute inset-0" onClick={() => setSidebarOpen(false)}></div>
                    <aside className="w-80 h-full bg-white/50 backdrop-blur-3xl border-r border-white/40 flex flex-col p-8 animate-in slide-in-from-left duration-500 relative shadow-2xl">
                        <div className="flex items-center justify-between mb-12">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 medical-gradient rounded-xl flex items-center justify-center">
                                    <Stethoscope className="text-white w-6 h-6" />
                                </div>
                                <span className="text-xl font-black text-slate-900 tracking-tighter">SmartClinic</span>
                            </div>
                            <button onClick={() => setSidebarOpen(false)} className="p-3 bg-slate-100/50 rounded-xl hover:bg-slate-200 transition-colors">
                                <X className="w-5 h-5 text-slate-900" />
                            </button>
                        </div>

                        <nav className="flex-1 space-y-3">
                            {currentNav.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="flex items-center space-x-4 px-6 py-4 rounded-2xl text-slate-900 font-black text-sm uppercase tracking-tight hover:bg-white/80 transition-all shadow-sm"
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <span className="text-teal-600">{item.icon}</span>
                                    <span>{item.title}</span>
                                </Link>
                            ))}
                        </nav>

                        <div className="mt-auto glass-card p-6 !bg-white/60">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Version Elite 1.0.4</p>
                        </div>
                    </aside>
                </div>
            )}
        </div>
    )
}
