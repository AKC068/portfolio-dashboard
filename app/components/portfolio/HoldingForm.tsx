'use client';
import { useState, useRef, useEffect } from 'react';

export interface HoldingFormData {
  symbol: string;
  exchange: string;
  quantity: string;
  price: string;
  name: string;
  sector: string;
}

interface HoldingFormProps {
  initialData?: Partial<HoldingFormData>;
  onSubmit: (data: HoldingFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  title?: string;
  submitText?: string;
}

export function HoldingForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isSubmitting = false,
  title = "Add New Holding",
  submitText = "Add Holding"
}: HoldingFormProps) {
  const [form, setForm] = useState<HoldingFormData>({
    symbol: '',
    exchange: 'NSE',
    quantity: '',
    price: '',
    name: '',
    sector: '',
    ...initialData
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);

  // Update form when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      setForm(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({});
    
    // Validate required fields
    const newErrors: Record<string, string> = {};
    
    if (!form.symbol.trim()) {
      newErrors.symbol = 'Stock symbol is required';
    } else if (form.symbol.length < 1) {
      newErrors.symbol = 'Stock symbol must be at least 1 character';
    }
    
    if (!form.exchange) {
      newErrors.exchange = 'Exchange is required';
    }
    
    if (!form.quantity || Number(form.quantity) <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }
    
    if (!form.price || Number(form.price) <= 0) {
      newErrors.price = 'Purchase price must be greater than 0';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      await onSubmit(form);
    } catch (error) {
      console.error('Form submission failed:', error);
      setErrors({ submit: 'Failed to save holding. Please try again.' });
    }
  };

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Stock Symbol *
        </label>
        <input
          type="text"
          required
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
            errors.symbol ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
          placeholder="e.g., AAPL, GOOGL"
          value={form.symbol}
          onChange={(e) => {
            setForm({ ...form, symbol: e.target.value.toUpperCase() });
            clearError('symbol');
          }}
        />
        {errors.symbol && <p className="text-red-500 text-sm mt-1">{errors.symbol}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Exchange *
        </label>
        <select
          required
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          value={form.exchange}
          onChange={(e) => {
            setForm({ ...form, exchange: e.target.value });
            clearError('exchange');
          }}
        >
          <option value="">Select Exchange</option>
          <option value="NSE">NSE</option>
          <option value="BSE">BSE</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Quantity *
        </label>
        <input
          type="number"
          required
          min="1"
          step="1"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
            errors.quantity ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
          placeholder="Number of shares"
          value={form.quantity}
          onChange={(e) => {
            setForm({ ...form, quantity: e.target.value });
            clearError('quantity');
          }}
        />
        {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Purchase Price *
        </label>
        <input
          type="number"
          required
          min="0.01"
          step="0.01"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
            errors.price ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
          placeholder="Price per share"
          value={form.price}
          onChange={(e) => {
            setForm({ ...form, price: e.target.value });
            clearError('price');
          }}
        />
        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Stock Name
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="Company name (optional)"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Sector
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          placeholder="e.g., Technology, Healthcare (optional)"
          value={form.sector}
          onChange={(e) => setForm({ ...form, sector: e.target.value })}
        />
      </div>

      {errors.submit && (
        <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
          {errors.submit}
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Saving...' : submitText}
        </button>
      </div>
    </form>
  );
}
