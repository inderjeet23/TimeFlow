'use client';

import { useState, useEffect, useCallback } from 'react';
import { InvoiceData } from '@/types';
import { calculateTotals, extractMostCommonClient } from '@/lib/csv-parser';
import { cn } from '@/lib/utils';

interface InvoiceFormProps {
  invoice: InvoiceData;
  onUpdate: (invoice: InvoiceData) => void;
  onNext: () => void;
}

export default function InvoiceForm({ invoice, onUpdate, onNext }: InvoiceFormProps) {
  const [formData, setFormData] = useState<InvoiceData>(invoice);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [useDefaults, setUseDefaults] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [showRatePrompt, setShowRatePrompt] = useState(false);
  const [lastRateApplied, setLastRateApplied] = useState<number | null>(null);

  useEffect(() => {
    setFormData(invoice);
  }, [invoice]);

  // Auto-fill common business info if empty
  useEffect(() => {
    if (!formData.business.name && !useDefaults) {
      const updatedInvoice = { ...formData };
      updatedInvoice.business = {
        ...updatedInvoice.business,
        name: 'Your Business Name',
        email: 'your@email.com',
        address: '123 Business St',
        city: 'Your City',
        state: 'State',
        zipCode: '12345',
        country: 'United States'
      };
      setFormData(updatedInvoice);
      onUpdate(updatedInvoice);
    }
  }, [formData.business.name, useDefaults]);

  // Pre-fill client name from CSV data
  useEffect(() => {
    if (formData.items.length > 0 && !formData.client.name) {
      const mostCommonClient = extractMostCommonClient(formData.items.map(item => ({
        client: item.client,
        project: item.project,
        date: item.date,
        duration: item.hours,
        notes: item.notes,
        billable: true
      })));
      
      if (mostCommonClient) {
        const updatedInvoice = { ...formData };
        updatedInvoice.client = {
          ...updatedInvoice.client,
          name: mostCommonClient
        };
        setFormData(updatedInvoice);
        onUpdate(updatedInvoice);
      }
    }
  }, [formData.items, formData.client.name]);

  const handleInputChange = useCallback((section: 'business' | 'client' | 'invoice', field: string, value: string | number) => {
    // Mark that user has interacted with the form
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
    }

    setFormData(prevData => {
      const updatedInvoice = { ...prevData };
      
      if (section === 'business') {
        updatedInvoice.business = { ...updatedInvoice.business, [field]: value };
      } else if (section === 'client') {
        updatedInvoice.client = { ...updatedInvoice.client, [field]: value };
      } else {
        (updatedInvoice as any)[field] = value;
      }

      // Recalculate totals if rate or tax rate changes
      if (field === 'taxRate') {
        const totals = calculateTotals(updatedInvoice.items, value as number);
        updatedInvoice.taxRate = value as number;
        updatedInvoice.taxAmount = totals.taxAmount;
        updatedInvoice.total = totals.total;
      }

      onUpdate(updatedInvoice);
      return updatedInvoice;
    });
  }, [hasUserInteracted, onUpdate]);

  const handleItemRateChange = useCallback((index: number, rate: number) => {
    // Mark that user has interacted with the form
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
    }

    setFormData(prevData => {
      const updatedInvoice = { ...prevData };
      updatedInvoice.items[index].rate = rate;
      updatedInvoice.items[index].amount = updatedInvoice.items[index].hours * rate;
      
      const totals = calculateTotals(updatedInvoice.items, updatedInvoice.taxRate);
      updatedInvoice.subtotal = totals.subtotal;
      updatedInvoice.taxAmount = totals.taxAmount;
      updatedInvoice.total = totals.total;
      
      onUpdate(updatedInvoice);

      // Show rate application prompt if this is the first rate entry and there are multiple items
      if (rate > 0 && prevData.items.length > 1 && lastRateApplied !== rate) {
        const otherItemsNeedRate = prevData.items.some((item, i) => i !== index && item.rate === 0);
        if (otherItemsNeedRate) {
          setShowRatePrompt(true);
          setLastRateApplied(rate);
        }
      }

      return updatedInvoice;
    });
  }, [hasUserInteracted, onUpdate, lastRateApplied]);

  const handleRateInputChange = useCallback((index: number, value: string) => {
    const rate = value === '' ? 0 : parseFloat(value) || 0;
    handleItemRateChange(index, rate);
  }, [handleItemRateChange]);

  const applyRateToAll = useCallback((rate: number) => {
    setFormData(prevData => {
      const updatedInvoice = { ...prevData };
      updatedInvoice.items = updatedInvoice.items.map(item => ({
        ...item,
        rate: rate,
        amount: item.hours * rate
      }));
      
      const totals = calculateTotals(updatedInvoice.items, updatedInvoice.taxRate);
      updatedInvoice.subtotal = totals.subtotal;
      updatedInvoice.taxAmount = totals.taxAmount;
      updatedInvoice.total = totals.total;
      
      onUpdate(updatedInvoice);
      setShowRatePrompt(false);
      return updatedInvoice;
    });
  }, [onUpdate]);

  const InputField = ({ 
    label, 
    value, 
    onChange, 
    placeholder, 
    type = 'text',
    required = false 
  }: {
    label: string;
    value: string | number;
    onChange: (value: string | number) => void;
    placeholder?: string;
    type?: string;
    required?: boolean;
  }) => (
    <div className="space-y-3">
      <label className="block text-base font-semibold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-4 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        required={required}
      />
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 lg:space-y-10">
      {/* Quick Start Options - Only show if user hasn't interacted */}
      {!hasUserInteracted && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1">
              <h4 className="text-xl font-semibold text-blue-900 mb-2">Quick Start</h4>
              <p className="text-base text-blue-700">Generate an invoice with default settings in seconds</p>
            </div>
            <button
              onClick={() => {
                setUseDefaults(true);
                onNext();
              }}
              className="px-6 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors text-lg touch-target"
            >
              Use Defaults & Continue
            </button>
          </div>
        </div>
      )}

      {/* Business Information */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:p-8 shadow-sm">
        <h3 className="text-2xl font-semibold text-gray-900 mb-8">Business Information</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <InputField
            label="Business Name"
            value={formData.business.name}
            onChange={(value) => handleInputChange('business', 'name', value)}
            placeholder="Your Business Name"
            required
          />
          <InputField
            label="Email"
            value={formData.business.email}
            onChange={(value) => handleInputChange('business', 'email', value)}
            placeholder="your@email.com"
            type="email"
            required
          />
          <InputField
            label="Address"
            value={formData.business.address}
            onChange={(value) => handleInputChange('business', 'address', value)}
            placeholder="Street Address"
            required
          />
          <InputField
            label="City"
            value={formData.business.city}
            onChange={(value) => handleInputChange('business', 'city', value)}
            placeholder="City"
            required
          />
          <InputField
            label="State"
            value={formData.business.state}
            onChange={(value) => handleInputChange('business', 'state', value)}
            placeholder="State"
            required
          />
          <InputField
            label="ZIP Code"
            value={formData.business.zipCode}
            onChange={(value) => handleInputChange('business', 'zipCode', value)}
            placeholder="ZIP Code"
            required
          />
        </div>
      </div>

      {/* Client Information */}
      <div className="card-mobile">
        <h3 className="text-mobile-lg text-gray-900 mb-4">Client Information</h3>
        <div className="grid-mobile-2">
          <InputField
            label="Client Name"
            value={formData.client.name}
            onChange={(value) => handleInputChange('client', 'name', value)}
            placeholder="Client Name"
            required
          />
          <InputField
            label="Address"
            value={formData.client.address}
            onChange={(value) => handleInputChange('client', 'address', value)}
            placeholder="Client Address"
            required
          />
          <InputField
            label="City"
            value={formData.client.city}
            onChange={(value) => handleInputChange('client', 'city', value)}
            placeholder="City"
            required
          />
          <InputField
            label="State"
            value={formData.client.state}
            onChange={(value) => handleInputChange('client', 'state', value)}
            placeholder="State"
            required
          />
          <InputField
            label="ZIP Code"
            value={formData.client.zipCode}
            onChange={(value) => handleInputChange('client', 'zipCode', value)}
            placeholder="ZIP Code"
            required
          />
          <InputField
            label="Country"
            value={formData.client.country}
            onChange={(value) => handleInputChange('client', 'country', value)}
            placeholder="Country"
            required
          />
        </div>
      </div>

      {/* Invoice Details */}
      <div className="card-mobile">
        <h3 className="text-mobile-lg text-gray-900 mb-4">Invoice Details</h3>
        <div className="grid-mobile-2 lg:grid-cols-3">
          <InputField
            label="Invoice Number"
            value={formData.invoiceNumber}
            onChange={(value) => handleInputChange('invoice', 'invoiceNumber', value)}
            placeholder="INV-001"
            required
          />
          <InputField
            label="Invoice Date"
            value={formData.date}
            onChange={(value) => handleInputChange('invoice', 'date', value)}
            type="date"
            required
          />
          <InputField
            label="Due Date"
            value={formData.dueDate}
            onChange={(value) => handleInputChange('invoice', 'dueDate', value)}
            type="date"
            required
          />
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="card-mobile">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between w-full text-left touch-target"
        >
          <h3 className="text-mobile-lg text-gray-900">Advanced Settings</h3>
          <svg 
            className={`w-5 h-5 text-gray-500 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {showAdvanced && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid-mobile-2">
              <InputField
                label="Tax Rate (%)"
                value={formData.taxRate}
                onChange={(value) => handleInputChange('invoice', 'taxRate', value)}
                type="number"
                placeholder="0"
              />
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Invoice Terms
                </label>
                <textarea
                  value={formData.terms || ''}
                  onChange={(e) => handleInputChange('invoice', 'terms', e.target.value)}
                  placeholder="Net 30, payment due upon receipt, etc."
                  className="input-mobile min-h-[80px] resize-none"
                  rows={3}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Time Entries */}
      <div className="card-mobile">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
          <h3 className="text-mobile-lg text-gray-900">Time Entries</h3>
          <div className="text-sm text-gray-500">
            {formData.items.length} entries • {formData.items.reduce((sum, item) => sum + item.hours, 0).toFixed(1)} hours total
          </div>
        </div>
        
        <div className="space-y-4">
          {formData.items.map((item, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid-mobile lg:grid-cols-3 gap-4 items-start">
                <div className="lg:col-span-2">
                  <div className="font-medium text-gray-900 text-lg mb-2">{item.project}</div>
                  <div className="text-sm text-gray-500 space-y-1">
                    <div className="flex items-center space-x-2">
                      <span>📅 {item.date}</span>
                      <span>⏱️ {item.hours} hours</span>
                    </div>
                    {item.notes && (
                      <div className="flex items-start space-x-2">
                        <span>📝</span>
                        <span className="flex-1">{item.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Rate ($/hr)</label>
                    <input
                      type="number"
                      value={item.rate === 0 ? '' : item.rate.toString()}
                      onChange={(e) => handleRateInputChange(index, e.target.value)}
                      className="input-mobile text-sm"
                      placeholder="75"
                    />
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Total</div>
                    <div className="font-semibold text-gray-900 text-lg">
                      ${item.amount.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totals Summary */}
      <div className="card-mobile">
        <h3 className="text-mobile-lg text-gray-900 mb-4">Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">${formData.subtotal.toFixed(2)}</span>
          </div>
          {formData.taxAmount > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Tax ({formData.taxRate}%):</span>
              <span className="font-medium">${formData.taxAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-semibold border-t pt-3">
            <span>Total:</span>
            <span>${formData.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Rate Application Prompt */}
      {showRatePrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full animate-fadeIn">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-xl">💡</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Apply ${lastRateApplied}/hr to all entries?
              </h3>
              <p className="text-gray-600 mb-6">
                This will save you time by applying the same rate to all {formData.items.length} time entries.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowRatePrompt(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  No, thanks
                </button>
                <button
                  onClick={() => applyRateToAll(lastRateApplied!)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Apply to all
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="card-mobile">
        <div className="flex flex-col space-y-4">
          <div className="space-y-2">
            <div className="text-sm text-gray-500">
              💡 Tip: All fields marked with * are required
            </div>
            <div className="text-xs text-gray-400">
              You can always edit these details later in the preview
            </div>
          </div>
          
          {/* Smart CTA Flow */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            {/* Show "Use Defaults" only if user hasn't interacted */}
            {!hasUserInteracted && (
              <button
                onClick={() => {
                  setUseDefaults(true);
                  onNext();
                }}
                className="btn-secondary w-full sm:w-auto"
              >
                Use Defaults & Continue
              </button>
            )}
            
            {/* Primary CTA - always visible */}
            <button
              onClick={onNext}
              className={cn(
                "btn-primary w-full sm:w-auto flex items-center justify-center space-x-2",
                hasUserInteracted ? "w-full" : "flex-1"
              )}
            >
              <span>Continue to Step 3</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 