'use client';

import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FilterOptions } from '@/types/crypto';

interface MarketFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export function MarketFilters({ filters, onFiltersChange }: MarketFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handleSortChange = (value: string) => {
    onFiltersChange({ ...filters, sortBy: value as FilterOptions['sortBy'] });
  };

  const handleMinChangeChange = (value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value);
    onFiltersChange({ ...filters, minChange: numValue });
  };

  const handleMaxChangeChange = (value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value);
    onFiltersChange({ ...filters, maxChange: numValue });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      sortBy: 'market_cap_desc',
      minChange: undefined,
      maxChange: undefined,
    });
  };

  const hasActiveFilters = filters.search || filters.minChange !== undefined || filters.maxChange !== undefined;

  return (
    <Card className="p-4 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search coins..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={filters.sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="market_cap_desc">Market Cap (High to Low)</SelectItem>
              <SelectItem value="market_cap_asc">Market Cap (Low to High)</SelectItem>
              <SelectItem value="price_desc">Price (High to Low)</SelectItem>
              <SelectItem value="price_asc">Price (Low to High)</SelectItem>
              <SelectItem value="percent_change_desc">24h % (High to Low)</SelectItem>
              <SelectItem value="percent_change_asc">24h % (Low to High)</SelectItem>
            </SelectContent>
          </Select>

          <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="default">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                    !
                  </Badge>
                )}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        </div>
      </div>

      <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
        <CollapsibleContent className="space-y-4">
          <div className="border-t pt-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Min 24h Change (%)</label>
                <Input
                  type="number"
                  placeholder="e.g. -10"
                  value={filters.minChange?.toString() || ''}
                  onChange={(e) => handleMinChangeChange(e.target.value)}
                  className="w-32"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Max 24h Change (%)</label>
                <Input
                  type="number"
                  placeholder="e.g. 50"
                  value={filters.maxChange?.toString() || ''}
                  onChange={(e) => handleMaxChangeChange(e.target.value)}
                  className="w-32"
                />
              </div>

              {hasActiveFilters && (
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="text-muted-foreground"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}