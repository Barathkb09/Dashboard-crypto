'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { MarketTable } from '@/components/market-table';
import { Card } from '@/components/ui/card';
import { CoinGeckoAPI } from '@/lib/api';
import { useWatchlist } from '@/hooks/useWatchlist';
import { Coin } from '@/types/crypto';

export default function WatchlistPage() {
  const { watchlist, isLoaded } = useWatchlist();
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchWatchlistCoins = async () => {
      if (!isLoaded || watchlist.length === 0) {
        setCoins([]);
        return;
      }

      setLoading(true);
      setError(undefined);

      try {
        // Fetch all coins and filter by watchlist
        const allCoins = await CoinGeckoAPI.getMarkets(1, 250, 'market_cap_desc');
        const watchlistCoins = allCoins.filter((coin: Coin) => watchlist.includes(coin.id));
        setCoins(watchlistCoins);
      } catch (err) {
        setError('Failed to fetch watchlist data');
        console.error('Watchlist error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlistCoins();
  }, [watchlist, isLoaded]);

  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-2 mb-6">
          <h1 className="text-3xl font-bold">My Watchlist</h1>
          <p className="text-muted-foreground">Loading your saved cryptocurrencies...</p>
        </div>
      </div>
    );
  }

  if (watchlist.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-2 mb-6">
          <h1 className="text-3xl font-bold">My Watchlist</h1>
          <p className="text-muted-foreground">
            Keep track of your favorite cryptocurrencies
          </p>
        </div>

        <Card className="p-8 text-center">
          <div className="space-y-4">
            <Star className="h-12 w-12 mx-auto text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold">Your watchlist is empty</h3>
              <p className="text-muted-foreground">
                Start by adding some coins to your watchlist from the markets page
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">My Watchlist</h1>
        <p className="text-muted-foreground">
          Tracking {watchlist.length} cryptocurrencies
        </p>
      </div>

      <MarketTable coins={coins} loading={loading} error={error} />
    </div>
  );
}