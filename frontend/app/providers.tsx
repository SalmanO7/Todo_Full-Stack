'use client';

import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useState, useEffect } from 'react';
import { clearInvalidTokens } from '@/lib/clearInvalidTokens';
import { ClientProvider } from 'better-auth/react';

export function Providers({ children }: { children: React.ReactNode }) {
  // Create QueryClient inside the component to avoid server-side creation
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: Infinity,
      },
    },
  }));

  // Clear any invalid tokens on component mount
  useEffect(() => {
    clearInvalidTokens();
  }, []);

  return (
    <ClientProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster richColors />
        </ThemeProvider>
      </QueryClientProvider>
    </ClientProvider>
  );
}