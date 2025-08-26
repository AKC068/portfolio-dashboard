// app/lib/types/portfolio.ts
export interface Stock {
  id: string;
  particulars: string; // Stock Name
  purchasePrice: number;
  quantity: number;
  sector: string;
  exchange: 'NSE' | 'BSE';
  symbol: string; // For API calls
  
  // Calculated fields
  investment: number; // purchasePrice * quantity
  portfolioPercentage: number; // divide the current value of an asset by the total value of all assets in the portfolio and multiply the result by 100 to get a percentage
  
  // Live data from APIs
  cmp: number; // Current Market Price Fetched from Yahoo Finance API
  presentValue: number; // cmp * quantity
  gainLoss: number; // presentValue - investment
  peRatio?: number; // Fetched from Google Finance API
  latestEarnings?: string; // Fetched from Google Finance API
  
  // UI state
  isLoading?: boolean;
  lastUpdated?: Date;
}

export interface PortfolioSummary {
  totalInvestment: number;
  totalPresentValue: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;
}

export interface SectorSummary {
  sector: string;
  totalInvestment: number;
  totalPresentValue: number;
  totalGainLoss: number;
  stocks: Stock[];
}
