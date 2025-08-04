const API_BASE_URL = 'https://api.coingecko.com/api/v3';

// Note: In production, you would want to add your API key here
const API_KEY = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;

export class CoinGeckoAPI {
  private static async fetchWithRetry(url: string, retries = 3): Promise<any> {
    // Add API key to URL if available
    const urlWithKey = API_KEY ? `${url}${url.includes('?') ? '&' : '?'}x_cg_demo_api_key=${API_KEY}` : url;
    
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(urlWithKey);
        
        if (response.status === 429) {
          // Rate limited, wait and retry
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
          continue;
        }
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  static async getMarkets(page = 1, perPage = 50, sortBy = 'market_cap_desc') {
    const url = `${API_BASE_URL}/coins/markets?vs_currency=usd&order=${sortBy}&per_page=${perPage}&page=${page}&sparkline=false&price_change_percentage=24h`;
    return this.fetchWithRetry(url);
  }

  static async getCoinDetail(id: string) {
    const url = `${API_BASE_URL}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;
    return this.fetchWithRetry(url);
  }

  static async getMarketChart(id: string, days: number) {
    const url = `${API_BASE_URL}/coins/${id}/market_chart?vs_currency=usd&days=${days}&interval=${days <= 1 ? 'hourly' : 'daily'}`;
    return this.fetchWithRetry(url);
  }

  static async searchCoins(query: string) {
    const url = `${API_BASE_URL}/search?query=${encodeURIComponent(query)}`;
    return this.fetchWithRetry(url);
  }
}