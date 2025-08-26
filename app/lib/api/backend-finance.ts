// app/lib/api/backend-finance.ts
export interface StockData {
  symbol: string;
  currentPrice: number;
  peRatio?: number | null;
  latestEarnings?: string | null;
}

export class BackendFinanceService {
  private static baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

  static async getCurrentPrice(symbol: string): Promise<number> {
    try {
      const response = await fetch(`${this.baseUrl}/finance/price/${symbol}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.price || 0;
      
    } catch (error) {
      console.error(`Error fetching price for ${symbol}:`, error);
      return 0; // Return 0 on error, handle gracefully
    }
  }
  
  static async getBulkPrices(symbols: string[]): Promise<Record<string, number>> {
    try {
      const response = await fetch(`${this.baseUrl}/finance/price/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbols }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
      
    } catch (error) {
      console.error('Error fetching bulk prices:', error);
      return {};
    }
  }

  static async getStockData(symbol: string): Promise<StockData> {
    try {
      const response = await fetch(`${this.baseUrl}/finance/stock/${symbol}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
      
    } catch (error) {
      console.error(`Error fetching stock data for ${symbol}:`, error);
      return {
        symbol,
        currentPrice: 0,
        peRatio: null,
        latestEarnings: null,
      };
    }
  }

  static async getBulkStockData(symbols: string[]): Promise<StockData[]> {
    try {
      const response = await fetch(`${this.baseUrl}/finance/stock/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbols }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
      
    } catch (error) {
      console.error('Error fetching bulk stock data:', error);
      return symbols.map(symbol => ({
        symbol,
        currentPrice: 0,
        peRatio: null,
        latestEarnings: null,
      }));
    }
  }

  static async getPERatio(symbol: string): Promise<number | null> {
    try {
      const response = await fetch(`${this.baseUrl}/finance/pe-ratio/${symbol}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.peRatio;
      
    } catch (error) {
      console.error(`Error fetching P/E ratio for ${symbol}:`, error);
      return null;
    }
  }

  static async getLatestEarnings(symbol: string): Promise<string | null> {
    try {
      const response = await fetch(`${this.baseUrl}/finance/earnings/${symbol}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.earnings;
      
    } catch (error) {
      console.error(`Error fetching earnings for ${symbol}:`, error);
      return null;
    }
  }
}
