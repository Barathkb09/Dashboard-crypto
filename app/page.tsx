'use client';

import { useState, useEffect } from 'react';
import { MarketTable } from '@/components/market-table';
import { MarketFilters } from '@/components/market-filters';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CoinGeckoAPI } from '@/lib/api';
import { useDebounce } from '@/hooks/useDebounce';
import { Coin, FilterOptions } from '@/types/crypto';

export default function Home() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [filteredCoins, setFilteredCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    sortBy: 'market_cap_desc',
  });

  const debouncedSearch = useDebounce(filters.search, 300);
  const coinsPerPage = 50;

  useEffect(() => {
    const fetchCoins = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await CoinGeckoAPI.getMarkets(currentPage, coinsPerPage, filters.sortBy);
        setCoins(data);
      } catch (err) {
        setError('Failed to fetch market data. Please try again later.');
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, [currentPage, filters.sortBy]);

  useEffect(() => {
    let filtered = [...coins];

    // Apply search filter
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      filtered = filtered.filter(coin => 
        coin.name.toLowerCase().includes(searchLower) ||
        coin.symbol.toLowerCase().includes(searchLower)
      );
    }

    // Apply price change filters
    if (filters.minChange !== undefined) {
      filtered = filtered.filter(coin => coin.price_change_percentage_24h >= filters.minChange!);
    }
    
    if (filters.maxChange !== undefined) {
      filtered = filtered.filter(coin => coin.price_change_percentage_24h <= filters.maxChange!);
    }

    setFilteredCoins(filtered);
  }, [coins, debouncedSearch, filters.minChange, filters.maxChange]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Cryptocurrency Markets</h1>
        <p className="text-muted-foreground">
          Track prices, market caps, and trends for the top cryptocurrencies
        </p>
      </div>

      <MarketFilters filters={filters} onFiltersChange={setFilters} />
      
      <MarketTable coins={filteredCoins} loading={loading} error={error ?? undefined} />

      {!loading && !error && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {coinsPerPage} coins per page
          </p>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <span className="text-sm font-medium">
              Page {currentPage}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={filteredCoins.length < coinsPerPage}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}