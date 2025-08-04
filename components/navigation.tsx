'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TrendingUp, Star, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navigation() {
  const pathname = usePathname();

  const navigation = [
    {
      name: 'Markets',
      href: '/',
      icon: TrendingUp,
      current: pathname === '/',
    },
    {
      name: 'Watchlist',
      href: '/watchlist',
      icon: Star,
      current: pathname === '/watchlist',
    },
  ];

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6" />
            <span className="font-bold text-xl">CryptoTracker</span>
          </Link>
          
          <div className="flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
                  item.current ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}