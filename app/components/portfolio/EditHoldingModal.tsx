'use client';
import { X } from 'lucide-react';
import { useState } from 'react';
import { PortfolioApi } from '@/lib/api/portfolio';
import { HoldingForm, HoldingFormData } from './HoldingForm';
import { Stock } from '@/lib/types/portfolio';

interface EditHoldingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  holding: Stock | null;
}

export function EditHoldingModal({ isOpen, onClose, onSuccess, holding }: EditHoldingModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: HoldingFormData) => {
    if (!holding) return;
    
    setIsSubmitting(true);
    
    try {
      await PortfolioApi.updateHolding(Number(holding.id), {
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
      console.error('Failed to update holding:', error);
      throw error; // Let the form handle the error display
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !holding) return null;

  const initialData: HoldingFormData = {
    symbol: holding.symbol,
    exchange: holding.exchange,
    quantity: holding.quantity.toString(),
    price: holding.purchasePrice.toString(),
    name: holding.particulars,
    sector: holding.sector,
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Holding</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <HoldingForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
          title="Edit Holding"
          submitText="Update Holding"
        />
      </div>
    </div>
  );
}
