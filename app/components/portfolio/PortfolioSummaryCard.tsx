import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/lib/utils/formatters';

interface PortfolioSummaryCardProps {
  title: string;
  value: number;
  icon?: React.ReactNode;
  iconType?: 'currency' | 'trending' | 'percentage';
  trend?: 'up' | 'down' | 'neutral';
  formatType?: 'currency' | 'percentage';
  className?: string;
}

export function PortfolioSummaryCard({
  title,
  value,
  icon,
  iconType = 'currency',
  trend = 'neutral',
  formatType = 'currency',
  className = ''
}: PortfolioSummaryCardProps) {
  const getIconBackground = () => {
    if (trend === 'up') return 'bg-green-100 dark:bg-green-900';
    if (trend === 'down') return 'bg-red-100 dark:bg-red-900';
    if (iconType === 'currency') return 'bg-blue-100 dark:bg-blue-900';
    if (iconType === 'trending') return 'bg-green-100 dark:bg-green-900';
    if (iconType === 'percentage') {
      return value >= 0 ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900';
    }
    return 'bg-gray-100 dark:bg-gray-900';
  };

  const getIconColor = () => {
    if (trend === 'up') return 'text-green-600 dark:text-green-400';
    if (trend === 'down') return 'text-red-600 dark:text-red-400';
    if (iconType === 'currency') return 'text-blue-600 dark:text-blue-400';
    if (iconType === 'trending') return 'text-green-600 dark:text-green-400';
    if (iconType === 'percentage') {
      return value >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
    }
    return 'text-gray-600 dark:text-gray-400';
  };

  const getValueColor = () => {
    if (trend === 'up' || (iconType === 'percentage' && value >= 0)) {
      return 'text-green-600 dark:text-green-400';
    }
    if (trend === 'down' || (iconType === 'percentage' && value < 0)) {
      return 'text-red-600 dark:text-red-400';
    }
    return 'text-gray-900 dark:text-white';
  };

  const renderIcon = () => {
    if (icon) return icon;
    
    if (iconType === 'currency') {
      return <span className="font-semibold">₹</span>;
    }
    
    if (iconType === 'trending') {
      return <TrendingUp className="w-5 h-5" />;
    }
    
    if (iconType === 'percentage') {
      return <span className="text-sm font-semibold">%</span>;
    }
    
    return null;
  };

  const formatValue = () => {
    if (formatType === 'percentage') {
      return formatPercentage(value);
    }
    return formatCurrency(value);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg ${className}`}>
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`w-8 h-8 ${getIconBackground()} rounded-md flex items-center justify-center`}>
              <div className={getIconColor()}>
                {renderIcon()}
              </div>
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {title}
              </dt>
              <dd className={`text-lg font-medium ${getValueColor()}`}>
                {formatValue()}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
