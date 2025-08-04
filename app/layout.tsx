import './globals.css';
import { Inter } from 'next/font/google';
import { Navigation } from '@/components/navigation';

import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CryptoTracker - Cryptocurrency Dashboard',
  description: 'Track cryptocurrency prices, market caps, and build your watchlist',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        <main className="min-h-screen bg-background">
          {children}
        </main>
      </body>
    </html>
  );
}