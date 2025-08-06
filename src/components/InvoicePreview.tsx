'use client';

import { InvoiceData } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

interface InvoicePreviewProps {
  invoice: InvoiceData;
}

export default function InvoicePreview({ invoice }: InvoicePreviewProps) {
  return (
    <div className="relative">
      <div className="invoice-preview">
        {/* Watermark for free users */}
        {invoice.watermark && (
          <div className="watermark">
            <span>FREE VERSION</span>
          </div>
        )}
        
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {invoice.business.name || 'Your Business Name'}
            </h1>
            <div className="text-gray-600 space-y-1">
              <div>{invoice.business.address || 'Business Address'}</div>
              <div>
                {invoice.business.city && invoice.business.state && invoice.business.zipCode
                  ? `${invoice.business.city}, ${invoice.business.state} ${invoice.business.zipCode}`
                  : 'City, State ZIP'
                }
              </div>
              <div>{invoice.business.country || 'Country'}</div>
              {invoice.business.email && (
                <div className="text-blue-600">{invoice.business.email}</div>
              )}
            </div>
          </div>
          
          <div className="text-right">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">INVOICE</h2>
            <div className="space-y-1 text-sm">
              <div><span className="font-medium">Invoice #:</span> {invoice.invoiceNumber}</div>
              <div><span className="font-medium">Date:</span> {formatDate(invoice.date)}</div>
              <div><span className="font-medium">Due Date:</span> {formatDate(invoice.dueDate)}</div>
            </div>
          </div>
        </div>

        {/* Client Information */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Bill To:</h3>
          <div className="text-gray-700">
            <div className="font-medium">{invoice.client.name || 'Client Name'}</div>
            <div>{invoice.client.address || 'Client Address'}</div>
            <div>
              {invoice.client.city && invoice.client.state && invoice.client.zipCode
                ? `${invoice.client.city}, ${invoice.client.state} ${invoice.client.zipCode}`
                : 'City, State ZIP'
              }
            </div>
            <div>{invoice.client.country || 'Country'}</div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Date</th>
                <th>Hours</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index}>
                  <td>
                    <div className="font-medium text-gray-900">{item.project}</div>
                    {item.notes && (
                      <div className="text-sm text-gray-500 mt-1">{item.notes}</div>
                    )}
                  </td>
                  <td className="text-gray-600">{formatDate(item.date)}</td>
                  <td className="text-gray-600">{item.hours}</td>
                  <td className="text-gray-600">{formatCurrency(item.rate)}</td>
                  <td className="font-medium text-gray-900">{formatCurrency(item.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span>{formatCurrency(invoice.subtotal)}</span>
            </div>
            {invoice.taxAmount > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Tax ({invoice.taxRate}%):</span>
                <span>{formatCurrency(invoice.taxAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span>{formatCurrency(invoice.total)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        {(invoice.notes || invoice.terms) && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-600">
            {invoice.notes && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Notes:</h4>
                <p>{invoice.notes}</p>
              </div>
            )}
            {invoice.terms && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Terms:</h4>
                <p>{invoice.terms}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 