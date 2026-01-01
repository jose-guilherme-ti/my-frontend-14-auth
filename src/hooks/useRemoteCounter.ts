// src/hooks/useRemoteCounter.ts
'use client';

import { useEffect, useState } from 'react';

const COUNTER_EVENT = 'mfe:counter:update';

export function useRemoteCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const handler = (event: any) => {
      setCount(event.detail.count);
    };

    window.addEventListener(COUNTER_EVENT, handler);
    return () => window.removeEventListener(COUNTER_EVENT, handler);
  }, []);

  return count;
}
