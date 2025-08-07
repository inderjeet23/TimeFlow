'use client';

import { useState, useEffect, useCallback } from 'react';
import { Upload, FileText, Download, Settings, Clock, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import InputMethodSelector from '@/components/InputMethodSelector';
import MobileStepPicker from '@/components/MobileStepPicker';
import ManualTimeEntry from '@/components/ManualTimeEntry';
import InvoicePreview from '@/components/InvoicePreview';
import InvoiceForm from '@/components/InvoiceForm';
import MobileNavigation from '@/components/MobileNavigation';
import { InvoiceData, TimeEntry } from '@/types';
import { parseCSV, convertTimeEntriesToInvoiceItems, calculateTotals } from '@/lib/csv-parser';
import { generateInvoicePDF } from '@/lib/pdf-generator';
import { generateInvoiceNumber, calculateDueDate, downloadBlob } from '@/lib/utils';

export default function Home() {
  const [invoice, setInvoice] = useState<InvoiceData>({
    id: '',
    business: { name: '', email: '', address: '', city: '', state: '', zipCode: '', country: '' },
    client: { name: '', email: '', address: '', city: '', state: '', zipCode: '', country: '' },
    items: [],
    subtotal: 0,
    taxRate: 0,
    taxAmount: 0,
    total: 0,
    invoiceNumber: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    notes: '',
    terms: '',
    watermark: true
  });
  const [step, setStep] = useState<'upload' | 'configure' | 'preview'>('upload');
  const [inputMethod, setInputMethod] = useState<'csv' | 'manual' | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleTimeEntriesComplete = useCallback((timeEntries: TimeEntry[]) => {
    const defaultRate = 75; // Default hourly rate
    const invoiceItems = convertTimeEntriesToInvoiceItems(timeEntries, defaultRate);
    
    const updatedInvoice = {
      ...invoice,
      items: invoiceItems
    };
    
    const totals = calculateTotals(invoiceItems, invoice.taxRate);
    updatedInvoice.subtotal = totals.subtotal;
    updatedInvoice.taxAmount = totals.taxAmount;
    updatedInvoice.total = totals.total;
    
    setInvoice(updatedInvoice);
    
    // Add animation state for magic moment
    setIsAnimating(true);
    setTimeout(() => {
      setStep('configure');
      setIsAnimating(false);
    }, 300);
  }, [invoice.taxRate]);

  const handleCSVUpload = async (file: File) => {
    try {
      const parsedData = await parseCSV(file);
      
      // Convert CSV data to time entries
      const timeEntries: TimeEntry[] = parsedData.rows.map((row: any) => ({
        client: row[parsedData.columnMapping.client] || '',
        project: row[parsedData.columnMapping.project] || '',
        date: row[parsedData.columnMapping.date] || '',
        duration: parseFloat(row[parsedData.columnMapping.duration]) || 0,
        notes: row[parsedData.columnMapping.notes || ''] || '',
        billable: row[parsedData.columnMapping.billable || ''] === 'TRUE' || true
      }));

      handleTimeEntriesComplete(timeEntries);
    } catch (error) {
      console.error('Error parsing CSV:', error);
      alert('Error parsing CSV file. Please check the file format.');
    }
  };

  const handleInputMethodSelect = (method: 'csv' | 'manual') => {
    setInputMethod(method);
    if (method === 'manual') {
      // For manual entry, we'll show the manual entry form
      // The mobile component will handle this differently
    }
  };

  const handleInvoiceUpdate = (updatedInvoice: InvoiceData) => {
    setInvoice(updatedInvoice);
  };

  const handleGeneratePDF = async () => {
    if (!invoice) return;

    // setIsGenerating(true); // This state was removed, so this line is no longer needed.
    try {
      const pdfBytes = await generateInvoicePDF(invoice);
      const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
      downloadBlob(blob, `invoice-${invoice.invoiceNumber}.pdf`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      // setIsGenerating(false); // This state was removed, so this line is no longer needed.
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 's':
            event.preventDefault();
            if (step === 'preview' && invoice) {
              handleGeneratePDF();
            }
            break;
          case 'n':
            event.preventDefault();
            setStep('upload');
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [step, invoice]);

  // Mobile Step 1: Show mobile step picker
  if (step === 'upload') {
    return (
      <div className="min-h-screen">
        {/* Mobile Navigation */}
        <MobileNavigation currentStep={step} onStepChange={setStep} />
        
        {/* Mobile Step Picker */}
        <MobileStepPicker 
          onTimeEntriesComplete={handleTimeEntriesComplete}
          onCSVUpload={handleCSVUpload}
        />
        
        {/* Desktop Input Method Selector */}
        <div className="hidden lg:block">
          <div className="container-mobile py-6 sm:py-8 lg:pt-8">
            <InputMethodSelector 
              onTimeEntriesComplete={handleTimeEntriesComplete}
              onCSVUpload={handleCSVUpload}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Mobile Navigation */}
      <MobileNavigation currentStep={step} onStepChange={setStep} />
      
      {/* Desktop Header */}
      <header className="bg-white shadow-sm border-b hidden lg:block">
        <div className="container-mobile">
          <div className="flex justify-between items-center py-4 sm:py-6">
            <div className="flex items-center cursor-pointer touch-target" onClick={() => setStep('upload')}>
              <Clock className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">TimeFlow</h1>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-4">
              <span className="text-sm text-gray-500 hidden sm:block">Free Plan</span>
              <Link 
                href="/upgrade"
                className="btn-secondary text-sm px-3 py-2 sm:px-4"
              >
                Upgrade
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-mobile py-6 sm:py-8 lg:pt-8">
        {/* Desktop Progress Steps */}
        <div className="mb-6 sm:mb-8 hidden lg:block">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between relative">
              {/* Progress Line */}
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10"></div>
              <div 
                className={`absolute top-5 left-0 h-0.5 bg-blue-600 transition-all duration-500 -z-10 ${
                  step === 'configure' ? 'w-1/2' : 'w-full'
                }`}
              ></div>
              
              {/* Step 1 */}
              <div className="nav-step">
                <div 
                  className={`nav-step-icon ${
                    step === 'configure' || step === 'preview'
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm font-medium mt-2 text-gray-600">
                  Add Time Data
                </span>
              </div>

              {/* Step 2 */}
              <div className="nav-step">
                <div 
                  className={`nav-step-icon ${
                    step === 'configure' 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : step === 'preview'
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  {step === 'configure' ? (
                    <Settings className="h-5 w-5" />
                  ) : step === 'preview' ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <Settings className="h-5 w-5" />
                  )}
                </div>
                <span className={`text-sm font-medium mt-2 ${
                  step === 'configure' ? 'text-blue-600' : 
                  step === 'preview' ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  Configure
                </span>
              </div>

              {/* Step 3 */}
              <div className="nav-step">
                <div 
                  className={`nav-step-icon ${
                    step === 'preview' 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  {step === 'preview' ? (
                    <FileText className="h-5 w-5" />
                  ) : (
                    <FileText className="h-5 w-5" />
                  )}
                </div>
                <span className={`text-sm font-medium mt-2 ${
                  step === 'preview' ? 'text-blue-600' : 'text-gray-400'
                }`}>
                  Preview & Download
                </span>
              </div>
            </div>
            
            {/* Step Description */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                {step === 'configure' && 'Configure your invoice details and rates'}
                {step === 'preview' && 'Preview and download your professional invoice'}
              </p>
              {step === 'preview' && (
                <p className="text-sm text-green-600 mt-2 font-medium">
                  🎉 You're almost done! Review your invoice and download the PDF.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Step Content */}
        {step === 'configure' && invoice && (
          <div className="section-mobile">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <button
                onClick={() => setStep('upload')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors touch-target"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to Step 1</span>
              </button>
              <div className="text-center">
                <div className="mb-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Step 2 of 3
                  </span>
                </div>
                <h2 className="text-mobile-lg text-gray-900">Configure Invoice</h2>
              </div>
              <div className="hidden sm:block w-20"></div> {/* Spacer for centering */}
            </div>
            <div className="grid-mobile lg:grid-cols-2 gap-8">
              <div>
                <InvoiceForm 
                  invoice={invoice} 
                  onUpdate={handleInvoiceUpdate}
                  onNext={() => setStep('preview')}
                />
              </div>
              <div className="hidden lg:block">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h3>
                <InvoicePreview invoice={invoice} />
              </div>
            </div>
          </div>
        )}

        {step === 'preview' && invoice && (
          <div className="section-mobile">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <button
                onClick={() => setStep('configure')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors touch-target"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to Step 2</span>
              </button>
              <div className="text-center">
                <div className="mb-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Step 3 of 3
                  </span>
                </div>
                <h2 className="text-mobile-lg text-gray-900">Invoice Preview</h2>
              </div>
              <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => setStep('upload')}
                  className="btn-secondary w-full sm:w-auto"
                  title="Ctrl+N (or Cmd+N)"
                >
                  Start Over
                </button>
                <button
                  onClick={handleGeneratePDF}
                  className="btn-primary w-full sm:w-auto flex items-center justify-center space-x-2"
                  title="Ctrl+S (or Cmd+S)"
                >
                  <Download className="h-5 w-5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
            <InvoicePreview invoice={invoice} />
          </div>
        )}
      </main>

      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>PDF downloaded successfully! 🎉</span>
        </div>
      )}

      {/* Upgrade Prompt */}
      {step === 'preview' && invoice && (
        <div className="fixed bottom-4 left-4 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 max-w-sm">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Star className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 text-sm mb-1">Remove the watermark</h4>
              <p className="text-gray-600 text-xs mb-3">
                Upgrade to Pro to remove the "FREE VERSION" watermark and add your branding.
              </p>
              <Link 
                href="/upgrade"
                className="inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-800"
              >
                View Plans
                <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>
            <button className="text-gray-400 hover:text-gray-600 touch-target">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="container-mobile py-8">
          <div className="text-center text-gray-500">
            <p>&copy; 2024 TimeFlow. Generate professional invoices from your time logs.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 