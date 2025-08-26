'use client';
import { X } from 'lucide-react';
import { useState } from 'react';
import { PortfolioApi } from '@/lib/api/portfolio';
import { HoldingForm, HoldingFormData } from './HoldingForm';

interface AddHoldingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  accountId?: number;
}

export function AddHoldingModal({ isOpen, onClose, onSuccess, accountId = 1 }: AddHoldingModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: HoldingFormData) => {
    setIsSubmitting(true);
    
    try {
      await PortfolioApi.addHolding({
        accountId,
        symbol: formData.symbol.trim(),
        exchange: formData.exchange,
        quantity: Number(formData.quantity),
        price: Number(formData.price),
        name: formData.name.trim() || undefined,
        sector: formData.sector.trim() || undefined,
      });
      
      onClose();
      onSuccess();
    } catch (error) {
      console.error('Failed to add holding:', error);
      throw error; // Let the form handle the error display
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Holding</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <HoldingForm
          onSubmit={handleSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
          title="Add New Holding"
          submitText="Add Holding"
        />
      </div>
    </div>
  );
}
