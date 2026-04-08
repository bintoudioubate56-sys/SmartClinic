'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { searchPatients } from '@/actions/patients';
import { Patient } from '@/types/database.types';

export default function PatientSearch({ onSelect }: { onSelect?: (p: Patient) => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Patient[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Ctrl+K Shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Debounced Search
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const res = await searchPatients(query);
      setIsSearching(false);
      if (res.success) setResults(res.data);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="w-full max-w-2xl relative group">
      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un patient (Nom, ID, Tel...)"
          className="w-full pl-12 pr-20 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium text-slate-700"
        />
        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
          <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded text-[10px] font-bold text-slate-400">CTRL K</kbd>
        </div>
      </div>

      {/* Results Dropdown */}
      {(results.length > 0 || (query.length >= 2 && !isSearching)) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2">
            {results.map((patient) => (
              <button
                type="button"
                key={patient.id}
                onClick={() => {
                  if (onSelect) {
                    onSelect(patient);
                  } else {
                    router.push(`/dashboard/doctor/patients/${patient.id}`);
                  }
                }}
                className="w-full text-left p-4 hover:bg-indigo-50 rounded-xl transition-all group flex justify-between items-center"
              >
                <div>
                  <p className="font-bold text-slate-800 group-hover:text-indigo-700">
                    {patient.last_name.toUpperCase()} {patient.first_name}
                  </p>
                  <p className="text-xs text-slate-500">ID: {patient.patient_number} • Tel: {patient.phone}</p>
                </div>
                <svg className="w-5 h-5 text-slate-300 group-hover:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </button>
            ))}

            {results.length === 0 && !isSearching && (
              <div className="p-8 text-center">
                <div className="text-slate-400 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <p className="text-slate-600 font-medium mb-4">Aucun patient trouvé pour "{query}"</p>
                <button
                  type="button"
                  onClick={() => router.push('/dashboard/reception/patients/new')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                  Nouveau Patient
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {isSearching && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 flex justify-center z-50">
          <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
