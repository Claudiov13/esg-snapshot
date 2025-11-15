import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { siteConfig } from '@/lib/config/site';
import '@/styles/globals.css';
import '@/styles/marketing.css';
import '@/styles/dashboard.css';

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="pt-BR">
        <body>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}