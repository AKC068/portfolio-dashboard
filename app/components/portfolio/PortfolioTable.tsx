import { Stock } from '@/lib/types/portfolio';
import { formatCurrency, formatPercentage } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils';
import { Edit2, Trash2 } from 'lucide-react';

interface PortfolioTableProps {
  stocks: Stock[];
  isLoading: boolean;
  onEditHolding?: (holding: Stock) => void;
  onDeleteHolding?: (holdingId: string) => void;
}

export function PortfolioTable({ stocks, isLoading, onEditHolding, onDeleteHolding }: PortfolioTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Particulars
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Purchase Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Qty
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Investment
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Portfolio %
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Exchange
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              CMP
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Present Value
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Gain/Loss
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              P/E Ratio
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Latest Earnings
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto block">
          {stocks.map((stock) => (
            <StockRow 
              key={stock.id} 
              stock={stock} 
              isLoading={isLoading}
              onEdit={onEditHolding}
              onDelete={onDeleteHolding}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StockRow({ 
  stock, 
  isLoading, 
  onEdit, 
  onDelete 
}: { 
  stock: Stock; 
  isLoading: boolean;
  onEdit?: (holding: Stock) => void;
  onDelete?: (holdingId: string) => void;
}) {
  const gainLossClass = stock.gainLoss >= 0 
    ? 'text-green-600 dark:text-green-400' 
    : 'text-red-600 dark:text-red-400';

  return (
    <tr className={cn(isLoading && 'animate-pulse opacity-50')}>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
        <div>
          <div>{stock.particulars}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{stock.symbol}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
        {formatCurrency(stock.purchasePrice)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
        {stock.quantity}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
        {formatCurrency(stock.investment)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
        {formatPercentage(stock.portfolioPercentage)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          {stock.exchange}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">
        {formatCurrency(stock.cmp)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">
        {formatCurrency(stock.presentValue)}
      </td>
      <td className={cn("px-6 py-4 whitespace-nowrap text-sm font-medium", gainLossClass)}>
        {formatCurrency(stock.gainLoss)}
        <span className="text-xs ml-1">
          ({formatPercentage((stock.gainLoss / stock.investment) * 100)})
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
        {stock.peRatio ? stock.peRatio.toFixed(2) : '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
        {stock.latestEarnings || '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
        <div className="flex space-x-2">
          {onEdit && (
            <button
              onClick={() => onEdit(stock)}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              title="Edit holding"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(stock.id)}
              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
              title="Delete holding"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}