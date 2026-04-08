'use client'

import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { syncToSupabase } from '@/lib/offline/sync';
import { useState } from 'react';

export default function OnlineIndicator() {
  const { isOnline, pendingCount } = useOnlineStatus();
  const [syncing, setSyncing] = useState(false);

  const handleManualSync = async () => {
    if (!isOnline || pendingCount === 0 || syncing) return;
    setSyncing(true);
    await syncToSupabase();
    setSyncing(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-3">
      {pendingCount > 0 && isOnline && !syncing && (
        <button 
          onClick={handleManualSync}
          className="px-4 py-2 bg-indigo-600 text-white text-xs font-black rounded-full shadow-lg hover:bg-indigo-700 transition-all animate-bounce"
        >
          Synchroniser {pendingCount} actions
        </button>
      )}

      <div className={`flex items-center gap-3 px-4 py-2 rounded-full shadow-2xl backdrop-blur-md border ${
        isOnline 
          ? 'bg-emerald-50/90 border-emerald-200 text-emerald-700' 
          : 'bg-red-50/90 border-red-200 text-red-700'
      }`}>
        <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
        <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          {isOnline ? (
            syncing ? 'Synchronisation en cours...' : 'Protégé — En ligne'
          ) : (
            `Mode Hors-ligne (${pendingCount} en attente)`
          )}
        </span>
      </div>
    </div>
  );
}
