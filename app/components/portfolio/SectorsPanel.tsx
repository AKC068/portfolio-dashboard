'use client';
import { useState, useEffect } from 'react';
import { PortfolioApi } from '@/lib/api/portfolio';
import { Edit2 } from 'lucide-react';

interface SectorsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSectorUpdate?: () => void;
}

interface SectorStock {
  id: number;
  name: string;
  symbol: string;
}

export function SectorsPanel({ isOpen, onClose, onSectorUpdate }: SectorsPanelProps) {
  const [sectors, setSectors] = useState<string[] | null>(null);
  const [sectorStocks, setSectorStocks] = useState<Record<string, SectorStock[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [editingSector, setEditingSector] = useState<string | null>(null);
  const [newSectorName, setNewSectorName] = useState('');

  useEffect(() => {
    if (isOpen && !sectors) {
      loadSectors();
    }
  }, [isOpen, sectors]);

  const loadSectors = async () => {
    setIsLoading(true);
    try {
      const sectorsData = await PortfolioApi.getSectors();
      setSectors(sectorsData);
    } catch (error) {
      console.error('Failed to load sectors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStocksForSector = async (sector: string) => {
    if (sectorStocks[sector]) return; // Already loaded
    
    try {
      const stocks = await PortfolioApi.getStocksBySector(sector);
      setSectorStocks(prev => ({ ...prev, [sector]: stocks }));
    } catch (error) {
      console.error(`Failed to load stocks for sector ${sector}:`, error);
    }
  };

  const handleEditSector = (sector: string) => {
    setEditingSector(sector);
    setNewSectorName(sector);
  };

  const handleSaveSector = async () => {
    if (!editingSector || !newSectorName.trim() || newSectorName.trim() === editingSector) {
      setEditingSector(null);
      return;
    }

    try {
      await PortfolioApi.updateSector(editingSector, newSectorName.trim());
      
      // Update local state
      setSectors(prev => prev?.map(s => s === editingSector ? newSectorName.trim() : s) || null);
      
      // Update sector stocks mapping
      if (sectorStocks[editingSector]) {
        setSectorStocks(prev => {
          const newMapping = { ...prev };
          newMapping[newSectorName.trim()] = newMapping[editingSector];
          delete newMapping[editingSector];
          return newMapping;
        });
      }
      
      setEditingSector(null);
      onSectorUpdate?.();
    } catch (error) {
      console.error('Failed to update sector:', error);
      alert('Failed to update sector. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setEditingSector(null);
    setNewSectorName('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full sm:w-[380px] bg-white dark:bg-gray-800 shadow-xl p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sectors</h3>
          <button 
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Close
          </button>
        </div>
        
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        
        {!isLoading && !sectors && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
            No sectors found
          </p>
        )}
        
        {sectors && (
          <ul className="space-y-2">
            {sectors.map((sector) => (
              <li key={sector}>
                {editingSector === sector ? (
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <input
                      type="text"
                      value={newSectorName}
                      onChange={(e) => setNewSectorName(e.target.value)}
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveSector();
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                      autoFocus
                    />
                    <button
                      onClick={handleSaveSector}
                      className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                    <button
                      className="flex-1 text-left"
                      onClick={() => loadStocksForSector(sector)}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-900 dark:text-white">{sector}</span>
                        {sectorStocks[sector] && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {sectorStocks[sector].length} stocks
                          </span>
                        )}
                      </div>
                    </button>
                    <button
                      onClick={() => handleEditSector(sector)}
                      className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      title="Edit sector"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                {sectorStocks[sector] && (
                  <div className="mt-2 ml-3">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Stocks in {sector}
                    </h4>
                    <ul className="space-y-1">
                      {sectorStocks[sector].map((stock) => (
                        <li key={stock.symbol} className="text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex justify-between items-center">
                            <span>{stock.name}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-500 font-mono">
                              {stock.symbol}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
