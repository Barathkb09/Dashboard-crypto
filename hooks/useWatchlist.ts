'use client';

import { useState, useEffect } from 'react';

const WATCHLIST_KEY = 'crypto-watchlist';

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(WATCHLIST_KEY);
      if (saved) {
        try {
          setWatchlist(JSON.parse(saved));
        } catch (error) {
          console.error('Error loading watchlist:', error);
          setWatchlist([]);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  const addToWatchlist = (coinId: string) => {
    const newWatchlist = [...watchlist, coinId];
    setWatchlist(newWatchlist);
    if (typeof window !== 'undefined') {
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(newWatchlist));
    }
  };

  const removeFromWatchlist = (coinId: string) => {
    const newWatchlist = watchlist.filter(id => id !== coinId);
    setWatchlist(newWatchlist);
    if (typeof window !== 'undefined') {
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(newWatchlist));
    }
  };

  const toggleWatchlist = (coinId: string) => {
    if (watchlist.includes(coinId)) {
      removeFromWatchlist(coinId);
    } else {
      addToWatchlist(coinId);
    }
  };

  const isInWatchlist = (coinId: string) => {
    return watchlist.includes(coinId);
  };

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
    isInWatchlist,
    isLoaded
  };
}