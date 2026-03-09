'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Stethoscope, Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-4 sm:top-8 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-7xl transition-all duration-500 ${scrolled ? 'top-2 sm:top-4' : ''}`}>
      <div className={`glass-card px-6 sm:px-10 py-4 sm:py-5 flex items-center justify-between border-white/40 shadow-2xl relative overflow-hidden ${scrolled ? 'bg-white/60 backdrop-blur-3xl' : ''}`}>
        
        {/* Brand */}
        <Link href="/" className="flex items-center space-x-3 sm:space-x-4 group relative z-10">
          <div className="w-10 h-10 sm:w-12 sm:h-12 medical-gradient rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl shadow-teal-500/30 transition-transform group-hover:scale-110">
            <Stethoscope className="text-white w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tighter leading-none">SmartClinic</span>
            <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.3em] text-teal-600 font-bold leading-none mt-1 opacity-70">Elevating Health</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center space-x-12 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
          {['Solutions', 'Vision', 'Sécurité'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-teal-600 transition-all relative group">
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-600 transition-all group-hover:w-full"></span>
            </a>
          ))}
        </div>

        {/* CTAs */}
        <div className="hidden md:flex items-center space-x-6 relative z-10">
          <Link href="/login" className="text-xs font-black text-slate-800 uppercase tracking-widest hover:text-teal-600 transition-colors">
            Connexion
          </Link>
          <Link href="/register" className="medical-gradient text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-black shadow-xl shadow-teal-500/20 hover:scale-[102%] transition-all uppercase tracking-widest text-center whitespace-nowrap">
            Rejoindre
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 text-slate-900 focus:outline-none relative z-20"
        >
          {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>

        {/* Mobile Menu Overlay */}
        <div className={`lg:hidden fixed inset-0 z-10 transition-all duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div className="absolute inset-0 bg-white/95 backdrop-blur-xl"></div>
          <div className="relative h-full flex flex-col items-center justify-center space-y-10 px-6">
            <div className="flex flex-col items-center space-y-8 w-full">
              {['Solutions', 'Vision', 'Sécurité'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`} 
                  onClick={() => setIsOpen(false)}
                  className="text-2xl font-black text-slate-900 uppercase tracking-widest"
                >
                  {item}
                </a>
              ))}
              <hr className="w-12 border-slate-200" />
              <Link 
                href="/login" 
                onClick={() => setIsOpen(false)}
                className="text-xl font-black text-slate-600 uppercase tracking-widest"
              >
                Connexion
              </Link>
              <Link 
                href="/register" 
                onClick={() => setIsOpen(false)}
                className="w-full medical-gradient text-white py-6 rounded-3xl text-center text-lg font-black uppercase tracking-widest shadow-2xl"
              >
                Rejoindre maintenant
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
