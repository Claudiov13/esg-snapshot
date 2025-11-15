import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { siteConfig } from '@/lib/config/site';
import '@/styles/globals.css';
import '@/styles/marketing.css';
import '@/styles/dashboard.css';

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const app = (
    <html lang="pt-BR">
      <body>
        {children}
      </body>
    </html>
  );

  if (!publishableKey) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not set. ClerkProvider is disabled for this build.');
    }
    return app;
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      {app}
    </ClerkProvider>
  );
}
