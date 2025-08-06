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
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-6 sm:mb-8 space-y-6 lg:space-y-0">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              {invoice.business.name || 'Your Business Name'}
            </h1>
            <div className="text-gray-600 space-y-1 text-sm sm:text-base">
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
          
          <div className="text-left lg:text-right">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">INVOICE</h2>
            <div className="space-y-1 text-sm">
              <div><span className="font-medium">Invoice #:</span> {invoice.invoiceNumber}</div>
              <div><span className="font-medium">Date:</span> {formatDate(invoice.date)}</div>
              <div><span className="font-medium">Due Date:</span> {formatDate(invoice.dueDate)}</div>
            </div>
          </div>
        </div>

        {/* Client Information */}
        <div className="mb-6 sm:mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Bill To:</h3>
          <div className="text-gray-700 text-sm sm:text-base">
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
        <div className="mb-6 sm:mb-8 overflow-x-auto">
          <table className="table-mobile">
            <thead>
              <tr>
                <th className="min-w-[200px]">Description</th>
                <th className="min-w-[100px]">Date</th>
                <th className="min-w-[80px]">Hours</th>
                <th className="min-w-[80px]">Rate</th>
                <th className="min-w-[100px]">Amount</th>
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
                  <td className="text-gray-600 text-sm sm:text-base">{formatDate(item.date)}</td>
                  <td className="text-gray-600 text-sm sm:text-base">{item.hours}</td>
                  <td className="text-gray-600 text-sm sm:text-base">{formatCurrency(item.rate)}</td>
                  <td className="font-medium text-gray-900 text-sm sm:text-base">{formatCurrency(item.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-full sm:w-64 space-y-2">
            <div className="flex justify-between text-gray-600 text-sm sm:text-base">
              <span>Subtotal:</span>
              <span>{formatCurrency(invoice.subtotal)}</span>
            </div>
            {invoice.taxAmount > 0 && (
              <div className="flex justify-between text-gray-600 text-sm sm:text-base">
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
          <div className="mt-8 sm:mt-12 grid-mobile md:grid-cols-2 gap-6 sm:gap-8 text-sm text-gray-600">
            {invoice.notes && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Notes:</h4>
                <p className="text-sm sm:text-base">{invoice.notes}</p>
              </div>
            )}
            {invoice.terms && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Terms:</h4>
                <p className="text-sm sm:text-base">{invoice.terms}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 