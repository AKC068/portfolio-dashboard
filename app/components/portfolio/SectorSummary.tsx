import { SectorSummary as SectorSummaryType } from '@/lib/types/portfolio';
import { formatCurrency, formatPercentage } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils';

interface SectorSummaryProps {
  sectorSummaries: SectorSummaryType[];
}

export function SectorSummary({ sectorSummaries }: SectorSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {sectorSummaries.map((sector) => {
        const gainLossPercentage = (sector.totalGainLoss / sector.totalInvestment) * 100;
        const isProfit = sector.totalGainLoss >= 0;
        
        return (
          <div
            key={sector.sector}
            className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={cn(
                    "w-8 h-8 rounded-md flex items-center justify-center",
                    isProfit ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900"
                  )}>
                    <span className={cn(
                      "text-sm font-semibold",
                      isProfit ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    )}>
                      {sector.sector.charAt(0)}
                    </span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      {sector.sector}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(sector.totalPresentValue)}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-5 py-3">
              <div className="text-sm">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500 dark:text-gray-400">Investment:</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {formatCurrency(sector.totalInvestment)}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500 dark:text-gray-400">Gain/Loss:</span>
                  <span className={cn(
                    "font-medium",
                    isProfit ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  )}>
                    {formatCurrency(sector.totalGainLoss)} ({formatPercentage(gainLossPercentage)})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Stocks:</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {sector.stocks.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}