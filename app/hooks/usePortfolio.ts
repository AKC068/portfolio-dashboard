"use client";
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Stock, PortfolioSummary, SectorSummary } from '@/lib/types/portfolio';
import { BackendFinanceService } from '@/lib/api/backend-finance';
import { PortfolioApi } from '@/lib/api/portfolio';

export function usePortfolio(initialData: Stock[]) {
  // Calculate initial portfolio percentages
  const totalInitialValue = initialData.reduce((sum, stock) => sum + stock.presentValue, 0);
  const initialDataWithPortfolioPercentage = initialData.map(stock => ({
    ...stock,
    portfolioPercentage: totalInitialValue > 0 ? (stock.presentValue / totalInitialValue) * 100 : 0,
  }));
  
  const [stocks, setStocks] = useState<Stock[]>(initialDataWithPortfolioPercentage);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [hasLoadedFromBackend, setHasLoadedFromBackend] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update live prices and recalculate all metrics dynamically
  const updateLivePrices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const symbols = stocks.map(stock => stock.symbol);
      
      if (symbols.length === 0) {
        return;
      }
      
      // Fetch all stock data from backend
      const stockDataArray = await BackendFinanceService.getBulkStockData(symbols);
      
      // Update stocks with new data and recalculate all dynamic fields
      const updatedStocks = stocks.map((stock) => {
        const stockData = stockDataArray.find(data => data.symbol === stock.symbol);
        const cmp = stockData?.currentPrice || stock.cmp;
        const presentValue = cmp * stock.quantity;
        const gainLoss = presentValue - stock.investment;
        
        return {
          ...stock,
          cmp,
          presentValue,
          gainLoss,
          peRatio: stockData?.peRatio || stock.peRatio,
          latestEarnings: stockData?.latestEarnings || stock.latestEarnings,
          lastUpdated: new Date(),
        };
      });
      
      // Calculate portfolio percentages after updating all stocks
      const totalPresentValue = updatedStocks.reduce((sum, stock) => sum + stock.presentValue, 0);
      const stocksWithPortfolioPercentage = updatedStocks.map(stock => ({
        ...stock,
        portfolioPercentage: totalPresentValue > 0 ? (stock.presentValue / totalPresentValue) * 100 : 0,
      }));
      
      setStocks(stocksWithPortfolioPercentage);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error updating live prices:', error);
      setError(`Failed to update live prices: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, [stocks]);

  // Load holdings from backend once on mount
  useEffect(() => {
    if (hasLoadedFromBackend) return;
    
    const loadHoldingsFromBackend = async () => {
      try {
        setError(null);
        
        const holdings = await PortfolioApi.getHoldings(1);
        
        if (!holdings || holdings.length === 0) {
          setHasLoadedFromBackend(true);
          return;
        }
        
        // holdings already include live data and investment calculations from backend
        const totalPresentValue = holdings.reduce((sum: number, s: Stock) => sum + s.presentValue, 0);
        const withPct = holdings.map((s: Stock) => ({
          ...s,
          portfolioPercentage: totalPresentValue > 0 ? (s.presentValue / totalPresentValue) * 100 : 0,
        }));
        
        setStocks(withPct);
        setHasLoadedFromBackend(true);
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Failed to load holdings from backend:', error);
        setError(`Failed to load holdings: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setHasLoadedFromBackend(true); // Prevent infinite retry
      }
    };
    
    loadHoldingsFromBackend();
  }, [hasLoadedFromBackend]);

  const refreshFromBackend = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      const holdings = await PortfolioApi.getHoldings(1);
      
      if (!holdings || holdings.length === 0) {
        setStocks([]);
        setLastUpdated(new Date());
        return;
      }
      
      const totalPresentValue = holdings.reduce((sum: number, s: Stock) => sum + s.presentValue, 0);
      const withPct = holdings.map((s: Stock) => ({
        ...s,
        portfolioPercentage: totalPresentValue > 0 ? (s.presentValue / totalPresentValue) * 100 : 0,
      }));
      
      setStocks(withPct);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to refresh holdings from backend:', error);
      setError(`Failed to refresh holdings: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Calculate portfolio metrics dynamically based on current stock data
  const portfolioSummary = useMemo((): PortfolioSummary => {
    try {
      const totalInvestment = stocks.reduce((sum, stock) => sum + stock.investment, 0);
      const totalPresentValue = stocks.reduce((sum, stock) => sum + stock.presentValue, 0);
      const totalGainLoss = stocks.reduce((sum, stock) => sum + stock.gainLoss, 0);
      
      return {
        totalInvestment,
        totalPresentValue,
        totalGainLoss,
        totalGainLossPercentage: totalInvestment > 0 
          ? (totalGainLoss / totalInvestment) * 100 
          : 0,
      };
    } catch (error) {
      console.error('Error calculating portfolio summary:', error);
      return {
        totalInvestment: 0,
        totalPresentValue: 0,
        totalGainLoss: 0,
        totalGainLossPercentage: 0,
      };
    }
  }, [stocks]);

  // Group by sector dynamically based on current stock data
  const sectorSummaries = useMemo((): SectorSummary[] => {
    try {
      return stocks.reduce((acc, stock) => {
        const existingSector = acc.find(s => s.sector === stock.sector);
        
        if (existingSector) {
          existingSector.stocks.push(stock);
          existingSector.totalInvestment += stock.investment;
          existingSector.totalPresentValue += stock.presentValue;
          existingSector.totalGainLoss += stock.gainLoss;
        } else {
          acc.push({
            sector: stock.sector,
            totalInvestment: stock.investment,
            totalPresentValue: stock.presentValue,
            totalGainLoss: stock.gainLoss,
            stocks: [stock],
          });
        }
        
        return acc;
      }, [] as SectorSummary[]);
    } catch (error) {
      console.error('Error calculating sector summaries:', error);
      return [];
    }
  }, [stocks]);

  // Auto-update every 15 seconds
  // useEffect(() => {
  //   const interval = setInterval(updateLivePrices, 15000);
  //   return () => clearInterval(interval);
  // }, [updateLivePrices]);

  return {
    stocks,
    portfolioSummary,
    sectorSummaries,
    isLoading,
    lastUpdated,
    error,
    updateLivePrices,
    refreshFromBackend,
  };
}