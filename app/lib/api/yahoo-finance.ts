// app/lib/api/yahoo-finance.ts
export class YahooFinanceService {
  private static baseUrl = 'https://query1.finance.yahoo.com/v8/finance/chart/';
  
  static async getCurrentPrice(symbol: string): Promise<number> {
    try {
      // Add .NS for NSE, .BO for BSE
      const yahooSymbol = `${symbol}.NS`;
      const response = await fetch(`${this.baseUrl}${yahooSymbol}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const result = data.chart?.result;
      
      if (!result) {
        throw new Error('No data found');
      }
      
      // Get the latest price
      const meta = result.meta;
      return meta.regularMarketPrice || meta.previousClose || 0;
      
    } catch (error) {
      console.error(`Error fetching price for ${symbol}:`, error);
      return 0; // Return 0 on error, handle gracefully
    }
  }
  
  static async getBulkPrices(symbols: string[]): Promise<Record<string, number>> {
    const prices: Record<string, number> = {};
    
    // Process in batches to avoid rate limiting
    const batchSize = 5;
    for (let i = 0; i < symbols.length; i += batchSize) {
      const batch = symbols.slice(i, i + batchSize);
      const batchPromises = batch.map(async (symbol) => {
        const price = await this.getCurrentPrice(symbol);
        prices[symbol] = price;
      });
      
      await Promise.all(batchPromises);
      
      // Add delay between batches
      if (i + batchSize < symbols.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return prices;
  }
}