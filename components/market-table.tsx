'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MarketRowSkeleton } from '@/components/ui/loading-skeleton';
import { useWatchlist } from '@/hooks/useWatchlist';
import { Coin } from '@/types/crypto';
import { cn } from '@/lib/utils';

interface MarketTableProps {
  coins: Coin[];
  loading?: boolean;
  error?: string;
}

export function MarketTable({ coins, loading, error }: MarketTableProps) {
  const { toggleWatchlist, isInWatchlist } = useWatchlist();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: value < 1 ? 6 : 2,
      maximumFractionDigits: value < 1 ? 6 : 2,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`;
    }
    if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(2)}M`;
    }
    if (value >= 1e3) {
      return `$${(value / 1e3).toFixed(2)}K`;
    }
    return `$${value.toFixed(2)}`;
  };

  if (loading) {
    return (
      <Card className="w-full">
        <div className="space-y-0">
          {Array.from({ length: 10 }).map((_, i) => (
            <MarketRowSkeleton key={i} />
          ))}
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full p-8 text-center">
        <p className="text-red-500 mb-4">Error loading market data</p>
        <p className="text-sm text-muted-foreground">{error}</p>
      </Card>
    );
  }

  if (!coins.length) {
    return (
      <Card className="w-full p-8 text-center">
        <p className="text-muted-foreground">No coins found</p>
      </Card>
    );
  }

  return (
    <Card className="w-full overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium">#</th>
              <th className="text-left p-4 font-medium">Coin</th>
              <th className="text-right p-4 font-medium">Price</th>
              <th className="text-right p-4 font-medium">24h %</th>
              <th className="text-right p-4 font-medium">Market Cap</th>
              <th className="text-right p-4 font-medium">Volume (24h)</th>
              <th className="text-center p-4 font-medium">Watch</th>
            </tr>
          </thead>
          <tbody>
            {coins.map((coin) => (
              <tr
                key={coin.id}
                className="border-b hover:bg-muted/30 transition-colors"
              >
                <td className="p-4 text-sm text-muted-foreground">
                  {coin.market_cap_rank}
                </td>
                <td className="p-4">
                  <Link href={`/coin/${coin.id}`} className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                    <Image
                      src={coin.image}
                      alt={coin.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div>
                      <div className="font-medium">{coin.name}</div>
                      <div className="text-sm text-muted-foreground uppercase">
                        {coin.symbol}
                      </div>
                    </div>
                  </Link>
                </td>
                <td className="p-4 text-right font-medium">
                  {formatCurrency(coin.current_price)}
                </td>
                <td className="p-4 text-right">
                  <div className={cn(
                    "flex items-center justify-end space-x-1",
                    coin.price_change_percentage_24h >= 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {coin.price_change_percentage_24h >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span className="font-medium">
                      {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                    </span>
                  </div>
                </td>
                <td className="p-4 text-right font-medium">
                  {formatNumber(coin.market_cap)}
                </td>
                <td className="p-4 text-right font-medium">
                  {formatNumber(coin.total_volume)}
                </td>
                <td className="p-4 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleWatchlist(coin.id)}
                    className="hover:bg-yellow-100 hover:text-yellow-600"
                  >
                    <Star
                      className={cn(
                        "h-4 w-4",
                        isInWatchlist(coin.id) && "fill-yellow-400 text-yellow-400"
                      )}
                    />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}