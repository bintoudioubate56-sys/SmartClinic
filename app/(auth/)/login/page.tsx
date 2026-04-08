'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/actions/auth';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const checkLock = () => {
      const lockData = localStorage.getItem('login_lock');
      if (lockData) {
        const { expiry } = JSON.parse(lockData);
        const now = Date.now();
        if (now < expiry) {
          setIsLocked(true);
          setRemainingTime(Math.ceil((expiry - now) / 1000 / 60));
        } else {
          localStorage.removeItem('login_lock');
          localStorage.removeItem('login_attempts');
        }
      }
    };
    checkLock();
    const interval = setInterval(checkLock, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    setIsLoading(true);
    setError(null);

    const result = await signIn(email, password);

    if (result.success) {
      localStorage.removeItem('login_attempts');
      router.push(`/dashboard/${result.data.role}`);
      router.refresh();
    } else {
      const attempts = parseInt(localStorage.getItem('login_attempts') || '0') + 1;
      localStorage.setItem('login_attempts', attempts.toString());

      if (attempts >= 5) {
        const expiry = Date.now() + 15 * 60 * 1000;
        localStorage.setItem('login_lock', JSON.stringify({ expiry }));
        setIsLocked(true);
        setRemainingTime(15);
        setError('Compte bloqué 15 minutes');
      } else {
        setError('Email ou mot de passe incorrect');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg border border-gray-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Connexion SmartClinic
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLocked}
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">Mot de passe</label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLocked}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Masquer' : 'Afficher'}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-500">
              {isLocked && `Désactivé (${remainingTime} min)`}
            </div>
            <div className="text-sm">
              <Link href="/reset-password" title="Réinitialiser" className="font-medium text-blue-600 hover:text-blue-500">
                Mot de passe oublié ?
              </Link>
            </div>
          </div>

          {error && (
            <div className={`text-sm text-center p-3 rounded-md ${isLocked ? 'bg-red-50 text-red-800' : 'text-red-600 font-medium'}`}>
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading || isLocked}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
