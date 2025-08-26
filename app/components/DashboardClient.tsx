'use client';
import { Stock } from "@/lib/types/portfolio";
import { PortfolioTable } from '@/components/portfolio/PortfolioTable';
import { SectorSummary } from '@/components/portfolio/SectorSummary';
import { PortfolioSummaryCard } from '@/components/portfolio/PortfolioSummaryCard';
import { AddHoldingModal } from '@/components/portfolio/AddHoldingModal';
import { EditHoldingModal } from '@/components/portfolio/EditHoldingModal';
import { SectorsPanel } from '@/components/portfolio/SectorsPanel';
import { usePortfolio } from '@/hooks/usePortfolio';
import { RefreshCw, TrendingUp, TrendingDown, Plus, Layers, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { PortfolioApi } from '@/lib/api/portfolio';

// Sample data - replace with actual data loading
const initialStocks: Stock[] = [
  {
    id: '1',
    particulars: 'HDFC Bank',
    purchasePrice: 2450,
    quantity: 10,
    sector: 'Banking',
    exchange: 'NSE',
    symbol: 'HDFCBANK',
    investment: 24500,
    portfolioPercentage: 0,
    cmp: 2650,
    presentValue: 26500,
    gainLoss: 2000,
  },
  {
    id: '2',
    particulars: 'SBI',
    purchasePrice: 700,
    quantity: 10,
    sector: 'Banking',
    exchange: 'NSE',
    symbol: 'SBIN',
    investment: 7000,
    portfolioPercentage: 0,
    cmp: 750,
    presentValue: 7500,
    gainLoss: 2000,
  },
  {
    id: '3',
    particulars: 'Bajaj Finance',
    purchasePrice: 1650,
    quantity: 15,
    sector: 'Finance',
    exchange: 'NSE',
    symbol: 'BAJFINANCE',
    investment: 16500,
    portfolioPercentage: 0,
    cmp: 1580,
    presentValue: 15800,
    gainLoss: -1050,
  },
];

export function DashboardClient() {
  const {
    stocks,
    portfolioSummary,
    sectorSummaries,
    isLoading,
    lastUpdated,
    error,
    updateLivePrices,
    refreshFromBackend,
  } = usePortfolio(initialStocks);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingHolding, setEditingHolding] = useState<Stock | null>(null);
  const [isSectorsOpen, setIsSectorsOpen] = useState(false);

  const handleEditHolding = (holding: Stock) => {
    setEditingHolding(holding);
    setIsEditOpen(true);
  };

  const handleDeleteHolding = async (holdingId: string) => {
    if (confirm('Are you sure you want to delete this holding?')) {
      try {
        await PortfolioApi.deleteHolding(Number(holdingId));
        await refreshFromBackend();
      } catch (error) {
        console.error('Failed to delete holding:', error);
        alert('Failed to delete holding. Please try again.');
      }
    }
  };

  const handleEditSuccess = async () => {
    await refreshFromBackend();
  };

  const handleSectorUpdate = async () => {
    await refreshFromBackend();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Portfolio Dashboard
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Track your investments and monitor performance in real-time
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsAddOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Holdings
              </button>
              <button
                onClick={() => setIsSectorsOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
              >
                <Layers className="w-4 h-4 mr-2" />
                View all sectors
              </button>
              {lastUpdated && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
              )}
              <button
                onClick={updateLivePrices}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Error
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <PortfolioSummaryCard
            title="Total Investment"
            value={portfolioSummary.totalInvestment}
            iconType="currency"
            trend="neutral"
            formatType="currency"
          />
          
          <PortfolioSummaryCard
            title="Present Value"
            value={portfolioSummary.totalPresentValue}
            iconType="trending"
            trend="up"
            formatType="currency"
          />
          
          <PortfolioSummaryCard
            title="Total Gain/Loss"
            value={portfolioSummary.totalGainLoss}
            icon={portfolioSummary.totalGainLoss >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            trend={portfolioSummary.totalGainLoss >= 0 ? 'up' : 'down'}
            formatType="currency"
          />
          
          <PortfolioSummaryCard
            title="Return %"
            value={portfolioSummary.totalGainLossPercentage}
            iconType="percentage"
            trend={portfolioSummary.totalGainLossPercentage >= 0 ? 'up' : 'down'}
            formatType="percentage"
          />
        </div>

        {/* Sector Summary */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Sector Performance
          </h2>
          <SectorSummary sectorSummaries={sectorSummaries} />
        </div>

        {/* Portfolio Table */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Portfolio Holdings
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Detailed view of your stock holdings with live market data
            </p>
          </div>
          <PortfolioTable 
            stocks={stocks} 
            isLoading={isLoading}
            onEditHolding={handleEditHolding}
            onDeleteHolding={handleDeleteHolding}
          />
        </div>

        {/* Reusable Components */}
        <AddHoldingModal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onSuccess={handleEditSuccess}
          accountId={1}
        />

        <EditHoldingModal
          isOpen={isEditOpen}
          onClose={() => {
            setIsEditOpen(false);
            setEditingHolding(null);
          }}
          onSuccess={handleEditSuccess}
          holding={editingHolding}
        />

        <SectorsPanel
          isOpen={isSectorsOpen}
          onClose={() => setIsSectorsOpen(false)}
          onSectorUpdate={handleSectorUpdate}
        />
      </div>
    </div>
  );
}