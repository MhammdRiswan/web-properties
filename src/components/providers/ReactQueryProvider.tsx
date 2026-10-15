'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

interface ReactQueryProviderProps {
  children: React.ReactNode;
}

/**
 * React Query provider with optimized stale-while-revalidate caching strategy.
 * Instantiated per-render to avoid sharing state across requests.
 * 
 * Requirements: 9.1 - Performance optimization with proper caching
 */
export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Stale-while-revalidate: data is considered fresh for 5 minutes
            // This provides good balance between performance and data freshness
            staleTime: 5 * 60 * 1000, // 5 minutes
            
            // Keep unused data in cache for 30 minutes
            // Longer cache time for better performance on revisits
            gcTime: 30 * 60 * 1000, // 30 minutes
            
            // Retry failed requests up to 2 times with exponential backoff
            retry: 2,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            
            // Don't refetch on window focus to avoid unnecessary requests
            // Users can manually refresh if needed
            refetchOnWindowFocus: false,
            
            // Refetch on reconnect to ensure data consistency
            refetchOnReconnect: true,
            
            // Enable background refetching for better UX
            refetchOnMount: true,
          },
          mutations: {
            // Retry mutations once on failure
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
