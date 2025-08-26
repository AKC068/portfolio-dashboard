import { Stock } from '@/lib/types/portfolio';

export function calculatePortfolioPercentages(stocks: Stock[]): Stock[] {
  const totalInvestment = stocks.reduce((sum, stock) => sum + stock.investment, 0);
  
  return stocks.map(stock => ({
    ...stock,
    portfolioPercentage: (stock.investment / totalInvestment) * 100,
  }));
}

export function calculateDerivedValues(stocks: Stock[]): Stock[] {
  return stocks.map(stock => ({
    ...stock,
    investment: stock.purchasePrice * stock.quantity,
    presentValue: stock.cmp * stock.quantity,
    gainLoss: (stock.cmp * stock.quantity) - (stock.purchasePrice * stock.quantity),
  }));
}