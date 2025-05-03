// src/app/layout.tsx
'use client';

import { httpBatchLink } from '@trpc/client';
import { trpc } from '@/utils/trpc';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Navigation from '@/components/Navigation';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#E53935', // Pokemon Red
    },
    secondary: {
      main: '#1976D2', // Pokemon Blue
    },
  },
});

export default function RootLayout({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: '/api/trpc',
        }),
      ],
    })
  );

  return (
    <html lang="en">
      <body>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Navigation />
              {children}
            </ThemeProvider>
          </QueryClientProvider>
        </trpc.Provider>
      </body>
    </html>
  );
}