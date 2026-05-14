'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';

/** Waits for zustand `persist` to rehydrate from storage before auth checks. */
export function useAuthHydration(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const api = useAuthStore.persist;
    if (!api) {
      setReady(true);
      return;
    }
    if (api.hasHydrated()) {
      setReady(true);
      return;
    }
    const unsub = api.onFinishHydration(() => {
      setReady(true);
    });
    return unsub;
  }, []);

  return ready;
}
