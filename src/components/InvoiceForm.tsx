'use client';

import { useState, useEffect } from 'react';
import { InvoiceData } from '@/types';
import { calculateTotals } from '@/lib/csv-parser';
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

  const handleInputChange = (section: 'business' | 'client' | 'invoice', field: string, value: string | number) => {
    const updatedInvoice = { ...formData };
    
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

    setFormData(updatedInvoice);
    onUpdate(updatedInvoice);
  };

  const handleItemRateChange = (index: number, rate: number) => {
    const updatedInvoice = { ...formData };
    updatedInvoice.items[index].rate = rate;
    updatedInvoice.items[index].amount = updatedInvoice.items[index].hours * rate;
    
    const totals = calculateTotals(updatedInvoice.items, updatedInvoice.taxRate);
    updatedInvoice.subtotal = totals.subtotal;
    updatedInvoice.taxAmount = totals.taxAmount;
    updatedInvoice.total = totals.total;
    
    setFormData(updatedInvoice);
    onUpdate(updatedInvoice);
  };

  const handleRateInputChange = (index: number, value: string) => {
    const rate = value === '' ? 0 : parseFloat(value) || 0;
    handleItemRateChange(index, rate);
  };

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
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        required={required}
      />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Quick Start Options */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-blue-900">Quick Start</h4>
            <p className="text-sm text-blue-700">Generate an invoice with default settings in seconds</p>
          </div>
          <button
            onClick={() => {
              setUseDefaults(true);
              onNext();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Use Defaults & Continue
          </button>
        </div>
      </div>

      {/* Business Information */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="text-lg font-semibold text-gray-900">Advanced Settings</h3>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Tax Rate (%)"
                value={formData.taxRate}
                onChange={(value) => handleInputChange('invoice', 'taxRate', value)}
                type="number"
                placeholder="0"
              />
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Invoice Terms
                </label>
                <textarea
                  value={formData.terms || ''}
                  onChange={(e) => handleInputChange('invoice', 'terms', e.target.value)}
                  placeholder="Net 30, payment due upon receipt, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Time Entries */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Time Entries</h3>
          <div className="text-sm text-gray-500">
            {formData.items.length} entries • {formData.items.reduce((sum, item) => sum + item.hours, 0).toFixed(1)} hours total
          </div>
        </div>
        
        <div className="space-y-4">
          {formData.items.map((item, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="md:col-span-2">
                  <div className="font-medium text-gray-900 text-lg mb-1">{item.project}</div>
                  <div className="text-sm text-gray-500 flex items-center space-x-4">
                    <span>📅 {item.date}</span>
                    <span>⏱️ {item.hours} hours</span>
                    {item.notes && <span>📝 {item.notes}</span>}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Rate ($/hr)</label>
                    <input
                      type="number"
                      value={item.rate === 0 ? '' : item.rate.toString()}
                      onChange={(e) => handleRateInputChange(index, e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
        <div className="space-y-2">
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
          <div className="flex justify-between text-lg font-semibold border-t pt-2">
            <span>Total:</span>
            <span>${formData.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div className="space-y-2">
            <div className="text-sm text-gray-500">
              💡 Tip: All fields marked with * are required
            </div>
            <div className="text-xs text-gray-400">
              You can always edit these details later in the preview
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                setUseDefaults(true);
                onNext();
              }}
              className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Use Defaults
            </button>
            <button
              onClick={onNext}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 font-medium"
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