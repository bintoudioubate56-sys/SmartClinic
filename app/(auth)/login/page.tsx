'use client'

import { useState, useEffect } from 'react';
import { signIn } from '@/actions/auth';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, ShieldAlert } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);
  const router = useRouter();

  // Load lockout state from localStorage
  useEffect(() => {
    const savedLockout = localStorage.getItem('login_lockout');
    if (savedLockout) {
      const time = parseInt(savedLockout);
      if (Date.now() < time) {
        setLockoutTime(time);
        setAttempts(5);
      } else {
        localStorage.removeItem('login_lockout');
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTime && Date.now() < lockoutTime) return;

    setError(null);
    setLoading(true);

    const res = await signIn(email, password);

    if (res.success) {
      setAttempts(0);
      localStorage.removeItem('login_lockout');
      router.push(`/dashboard/${res.data.role === 'admin' ? 'admin' : res.data.role}`);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setError('Email ou mot de passe incorrect');
      
      if (newAttempts >= 5) {
        const lockout = Date.now() + 5 * 60 * 1000; // 5 minutes
        setLockoutTime(lockout);
        localStorage.setItem('login_lockout', lockout.toString());
        setError('Trop de tentatives. Compte bloqué pendant 5 minutes.');
      }
    }
    setLoading(false);
  };

  const isLocked = lockoutTime && Date.now() < lockoutTime;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md space-y-8 bg-slate-900/50 p-8 rounded-2xl border border-slate-800 backdrop-blur-xl shadow-2xl">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-4">
            <Lock className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">SmartClinic</h1>
          <p className="text-slate-400">Connectez-vous à votre espace professionnel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="email"
                required
                disabled={isLocked || loading}
                className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none disabled:opacity-50"
                placeholder="nom@smartclinic.gn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 block">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                disabled={isLocked || loading}
                className="w-full pl-11 pr-12 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none disabled:opacity-50"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLocked || loading}
            className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 shadow-lg shadow-indigo-600/20"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connexion...
              </span>
            ) : (
              'Se connecter'
            )}
          </button>
        </form>

        <div className="pt-6 text-center">
          <p className="text-slate-500 text-sm">
            Mode hors-ligne disponible. Vos données se synchroniseront automatiquement dès le retour de connexion.
          </p>
        </div>
      </div>
    </div>
  );
}
