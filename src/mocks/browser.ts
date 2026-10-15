/**
 * MSW Browser Worker Setup
 * Initializes Mock Service Worker for browser environment
 */

import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Setup worker with handlers
export const worker = setupWorker(...handlers);

// Start worker in development mode
export async function startMockServiceWorker() {
  if (typeof window === 'undefined') {
    return;
  }

  // Only start MSW in development mode
  if (process.env.NODE_ENV === 'development') {
    await worker.start({
      onUnhandledRequest: 'bypass', // Don't warn about unhandled requests
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
    });
    console.log('[MSW] Mock Service Worker started');
  }
}
