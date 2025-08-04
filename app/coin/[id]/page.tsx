'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Star, TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PriceChart } from '@/components/price-chart';
import { CoinDetailSkeleton } from '@/components/ui/loading-skeleton';
import { CoinGeckoAPI } from '@/lib/api';
import { useWatchlist } from '@/hooks/useWatchlist';
import { CoinDetail } from '@/types/crypto';
import { cn } from '@/lib/utils';

export default function CoinDetailPage() {
  const params = useParams();
  const router = useRouter();
  const coinId = params.id as string;
  const { toggleWatchlist, isInWatchlist } = useWatchlist();
  
  const [coin, setCoin] = useState<CoinDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoinDetail = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await CoinGeckoAPI.getCoinDetail(coinId);
        setCoin(data);
      } catch (err) {
        setError('Failed to load coin details');
        console.error('Coin detail error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (coinId) {
      fetchCoinDetail();
    }
  }, [coinId]);

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

  const formatSupply = (value: number | null) => {
    if (!value) return 'N/A';
    if (value >= 1e9) {
      return `${(value / 1e9).toFixed(2)}B`;
    }
    if (value >= 1e6) {
      return `${(value / 1e6).toFixed(2)}M`;
    }
    if (value >= 1e3) {
      return `${(value / 1e3).toFixed(2)}K`;
    }
    return value.toLocaleString();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <CoinDetailSkeleton />
      </div>
    );
  }

  if (error || !coin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <p className="text-red-500 mb-4">Error loading coin details</p>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  const priceChange24h = coin.market_data.price_change_percentage_24h;
  const isPositiveChange = priceChange24h >= 0;

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Markets
        </Button>
        
        <Button
          variant="outline"
          onClick={() => toggleWatchlist(coin.id)}
          className={cn(
            "hover:bg-yellow-100 hover:text-yellow-600",
            isInWatchlist(coin.id) && "bg-yellow-100 text-yellow-600"
          )}
        >
          <Star
            className={cn(
              "h-4 w-4 mr-2",
              isInWatchlist(coin.id) && "fill-yellow-400"
            )}
          />
          {isInWatchlist(coin.id) ? 'Remove from Watchlist' : 'Add to Watchlist'}
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <Image
          src={coin.image.large}
          alt={coin.name}
          width={64}
          height={64}
          className="rounded-full"
        />
        <div>
          <h1 className="text-3xl font-bold">{coin.name}</h1>
          <div className="flex items-center space-x-2">
            <span className="text-muted-foreground uppercase font-medium">
              {coin.symbol}
            </span>
            <Badge variant="secondary">
              Rank #{coin.market_cap_rank}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Current Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-2xl font-bold">
                {formatCurrency(coin.market_data.current_price.usd)}
              </div>
              <div className={cn(
                "flex items-center space-x-1 text-sm",
                isPositiveChange ? "text-green-600" : "text-red-600"
              )}>
                {isPositiveChange ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>{Math.abs(priceChange24h).toFixed(2)}% (24h)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Market Cap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(coin.market_data.market_cap.usd)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(coin.market_data.total_volume.usd)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">24h High/Low</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-green-600">
                H: {formatCurrency(coin.market_data.high_24h.usd)}
              </div>
              <div className="text-red-600">
                L: {formatCurrency(coin.market_data.low_24h.usd)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Circulating Supply</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatSupply(coin.market_data.circulating_supply)}
            </div>
            <div className="text-sm text-muted-foreground">
              {coin.symbol.toUpperCase()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Max Supply</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatSupply(coin.market_data.max_supply)}
            </div>
            <div className="text-sm text-muted-foreground">
              {coin.symbol.toUpperCase()}
            </div>
          </CardContent>
        </Card>
      </div>

      <PriceChart coinId={coin.id} />

      {coin.description.en && (
        <Card>
          <CardHeader>
            <CardTitle>About {coin.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="prose prose-sm max-w-none text-muted-foreground"
              dangerouslySetInnerHTML={{ 
                __html: coin.description.en.split('.')[0] + '.' 
              }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}