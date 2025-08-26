'use client';
import { X } from 'lucide-react';
import { useState } from 'react';
import { PortfolioApi } from '@/lib/api/portfolio';

interface EditSectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  sector: string;
}

export function EditSectorModal({ isOpen, onClose, onSuccess, sector }: EditSectorModalProps) {
  const [newSectorName, setNewSectorName] = useState(sector);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newSectorName.trim()) {
      setError('Sector name is required');
      return;
    }
    
    if (newSectorName.trim() === sector) {
      onClose();
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await PortfolioApi.updateSector(sector, newSectorName.trim());
      onClose();
      onSuccess();
    } catch (error) {
      console.error('Failed to update sector:', error);
      setError('Failed to update sector. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Sector</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sector Name *
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter sector name"
              value={newSectorName}
              onChange={(e) => {
                setNewSectorName(e.target.value);
                if (error) setError('');
              }}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Updating...' : 'Update Sector'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
