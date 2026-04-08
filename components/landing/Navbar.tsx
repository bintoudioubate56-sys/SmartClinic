'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Menu, X, Activity } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Services', href: '#features' },
    { name: 'Urgence', href: '#emergency' },
    { name: 'Cliniques', href: '#clinics' },
    { name: 'Hors-ligne', href: '#offline' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-4 glass border-b border-white/10 shadow-lg' : 'py-6'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform">
            <Activity className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white">SmartClinic</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <div className="h-6 w-px bg-white/10 mx-2" />
          <Link 
            href="/login" 
            className="text-sm font-semibold text-white px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 transition-all"
          >
            Se connecter
          </Link>
          <Link 
            href="/emergency" 
            className="text-sm font-bold text-white px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 active:scale-95 transition-all"
          >
            Portail Urgence
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-slate-300"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 glass border-b border-white/10 p-6 flex flex-col gap-4 md:hidden"
          >
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium text-slate-300"
              >
                {link.name}
              </Link>
            ))}
            <hr className="border-white/5" />
            <Link href="/login" className="text-center py-3 rounded-xl border border-white/10 text-white font-semibold">Se connecter</Link>
            <Link href="/emergency" className="text-center py-3 rounded-xl bg-indigo-600 text-white font-bold">Portail Urgence</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
