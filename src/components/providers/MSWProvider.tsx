'use client';

import { useEffect, useState } from 'react';

interface MSWProviderProps {
  children: React.ReactNode;
}

/**
 * Initializes Mock Service Worker in the browser (development only).
 * Renders children immediately — MSW starts in the background so the
 * UI is never blocked waiting for the worker to register.
 */
export function MSWProvider({ children }: MSWProviderProps) {
  const [mswReady, setMswReady] = useState(false);

  useEffect(() => {
    async function initMSW() {
      if (process.env.NODE_ENV === 'development') {
        const { startMockServiceWorker } = await import('@/mocks/browser');
        await startMockServiceWorker();
      }
      setMswReady(true);
    }

    initMSW();
  }, []);

  // Render children immediately — MSW intercepts requests once ready.
  // Any requests fired before MSW is ready will pass through to the network.
  if (!mswReady && process.env.NODE_ENV === 'development') {
    // In development, wait for MSW to be ready before rendering to avoid
    // race conditions where API calls fire before the worker is registered.
    return null;
  }

  return <>{children}</>;
}
