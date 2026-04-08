'use client'

import { useState, useEffect } from 'react';
import { syncToSupabase } from '@/lib/offline/sync';
import { db } from '@/lib/offline/db';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Auto-sync after 30s when back online
      setTimeout(() => {
        syncToSupabase();
      }, 30000);
    };

    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Refresh pending count periodically
    const interval = setInterval(async () => {
      const count = await db.pending_actions.count();
      setPendingCount(count);
    }, 2000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  return { isOnline, pendingCount };
}
