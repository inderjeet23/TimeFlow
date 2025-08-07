'use client';

import { InvoiceData } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

interface InvoicePreviewProps {
  invoice: InvoiceData;
}

export default function InvoicePreview({ invoice }: InvoicePreviewProps) {
  return (
    <div className="relative">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 lg:p-12 shadow-sm">
        {/* Watermark for free users - removed the ugly diagonal one */}
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-8 lg:mb-12 space-y-8 lg:space-y-0">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {invoice.business.name || 'Your Business Name'}
            </h1>
            <div className="text-gray-600 space-y-2 text-base sm:text-lg">
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
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">INVOICE</h2>
            <div className="space-y-2 text-base sm:text-lg">
              <div><span className="font-semibold">Invoice #:</span> {invoice.invoiceNumber}</div>
              <div><span className="font-semibold">Date:</span> {formatDate(invoice.date)}</div>
              <div><span className="font-semibold">Due Date:</span> {formatDate(invoice.dueDate)}</div>
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
        <div className="mb-8 lg:mb-12 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left p-4 font-semibold text-gray-900 text-base lg:text-lg min-w-[200px]">Description</th>
                <th className="text-left p-4 font-semibold text-gray-900 text-base lg:text-lg min-w-[120px]">Date</th>
                <th className="text-left p-4 font-semibold text-gray-900 text-base lg:text-lg min-w-[100px]">Hours</th>
                <th className="text-left p-4 font-semibold text-gray-900 text-base lg:text-lg min-w-[100px]">Rate</th>
                <th className="text-left p-4 font-semibold text-gray-900 text-base lg:text-lg min-w-[120px]">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="p-4">
                    <div className="font-semibold text-gray-900 text-base lg:text-lg">{item.project}</div>
                    {item.notes && (
                      <div className="text-base text-gray-500 mt-1">{item.notes}</div>
                    )}
                  </td>
                  <td className="p-4 text-gray-600 text-base lg:text-lg">{formatDate(item.date)}</td>
                  <td className="p-4 text-gray-600 text-base lg:text-lg">{item.hours}</td>
                  <td className="p-4 text-gray-600 text-base lg:text-lg">{formatCurrency(item.rate)}</td>
                  <td className="p-4 font-semibold text-gray-900 text-base lg:text-lg">{formatCurrency(item.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-full sm:w-80 space-y-4">
            <div className="flex justify-between text-gray-600 text-lg">
              <span className="font-medium">Subtotal:</span>
              <span className="font-semibold">{formatCurrency(invoice.subtotal)}</span>
            </div>
            {invoice.taxAmount > 0 && (
              <div className="flex justify-between text-gray-600 text-lg">
                <span className="font-medium">Tax ({invoice.taxRate}%):</span>
                <span className="font-semibold">{formatCurrency(invoice.taxAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-xl lg:text-2xl font-bold border-t-2 pt-4">
              <span>Total:</span>
              <span>{formatCurrency(invoice.total)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        {(invoice.notes || invoice.terms) && (
          <div className="mt-12 lg:mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {invoice.notes && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 text-lg">Notes:</h4>
                <p className="text-base lg:text-lg text-gray-600 leading-relaxed">{invoice.notes}</p>
              </div>
            )}
            {invoice.terms && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 text-lg">Terms:</h4>
                <p className="text-base lg:text-lg text-gray-600 leading-relaxed">{invoice.terms}</p>
              </div>
            )}
          </div>
        )}

        {/* Professional Footer for Free Version */}
        {invoice.watermark && (
          <div className="mt-12 lg:mt-16 pt-8 border-t border-gray-200">
            <p className="text-center text-sm text-gray-400">
              Invoice generated by TimeFlow
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 