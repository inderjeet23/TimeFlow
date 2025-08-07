'use client';

import { useState } from 'react';
import { Upload, Edit3, Check, ChevronDown } from 'lucide-react';
import { TimeEntry } from '@/types';
import ManualTimeEntry from './ManualTimeEntry';

interface MobileStepPickerProps {
  onTimeEntriesComplete: (timeEntries: TimeEntry[]) => void;
  onCSVUpload?: (file: File) => void;
}

type InputMethod = 'csv' | 'manual' | null;
type View = 'picker' | 'manual-entry';

export default function MobileStepPicker({ onTimeEntriesComplete, onCSVUpload }: MobileStepPickerProps) {
  const [selectedMethod, setSelectedMethod] = useState<InputMethod>(null);
  const [showCompare, setShowCompare] = useState(false);
  const [currentView, setCurrentView] = useState<View>('picker');
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const handleContinue = () => {
    if (selectedMethod === 'csv' && csvFile) {
      // Only continue if CSV file is uploaded
      if (onCSVUpload) {
        onCSVUpload(csvFile);
      }
      return;
    } else if (selectedMethod === 'manual') {
      // Navigate to manual entry
      setCurrentView('manual-entry');
      return;
    }
  };

  const handleCSVFileSelect = (file: File) => {
    setCsvFile(file);
  };

  const handleManualEntries = (timeEntries: TimeEntry[]) => {
    onTimeEntriesComplete(timeEntries);
  };

  // Show manual entry form
  if (currentView === 'manual-entry') {
    return (
      <div className="min-h-screen bg-gray-50 lg:hidden">
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <button
            onClick={() => {
              setCurrentView('picker');
              setSelectedMethod(null);
            }}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to options</span>
          </button>
        </div>
        <ManualTimeEntry onTimeEntriesComplete={handleManualEntries} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 lg:hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6">
        {/* Stepper Dots */}
        <div className="flex justify-center mb-6">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          </div>
        </div>

        {/* Page Title */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            How do you want to add time?
          </h1>
          <p className="text-base text-gray-600">
            Pick one option.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 space-y-4">
        {/* Option Cards */}
        <div className="space-y-3">
          {/* CSV Upload Card */}
          <div 
            className={`rounded-xl border p-4 flex items-start gap-3 cursor-pointer transition-all duration-150 ${
              selectedMethod === 'csv' 
                ? 'border-blue-600 ring-2 ring-blue-100 bg-blue-50' 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
            onClick={() => setSelectedMethod('csv')}
          >
            <div className="flex-shrink-0">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                selectedMethod === 'csv' ? 'bg-blue-600' : 'bg-gray-100'
              }`}>
                {selectedMethod === 'csv' ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <Upload className="w-5 h-5 text-gray-600" />
                )}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Upload CSV file
              </h3>
              <p className="text-base text-gray-600 mb-1">
                Fast if you already track time
              </p>
              <p className="text-sm text-gray-500">
                Works with Toggl, Clockify, Harvest.
              </p>
            </div>
          </div>

          {/* Manual Entry Card */}
          <div 
            className={`rounded-xl border p-4 flex items-start gap-3 cursor-pointer transition-all duration-150 ${
              selectedMethod === 'manual' 
                ? 'border-blue-600 ring-2 ring-blue-100 bg-blue-50' 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
            onClick={() => setSelectedMethod('manual')}
          >
            <div className="flex-shrink-0">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                selectedMethod === 'manual' ? 'bg-blue-600' : 'bg-gray-100'
              }`}>
                {selectedMethod === 'manual' ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <Edit3 className="w-5 h-5 text-gray-600" />
                )}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Manual entry
              </h3>
              <p className="text-base text-gray-600 mb-1">
                Simple for a few entries
              </p>
              <p className="text-sm text-gray-500">
                Type in your time data directly.
              </p>
            </div>
          </div>
        </div>

        {/* Progressive Disclosure - CSV Helper */}
        {selectedMethod === 'csv' && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">Upload your CSV file</h4>
            </div>
            <div className="space-y-3">
              {!csvFile ? (
                <button
                  onClick={() => {
                    // Trigger file input
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.csv';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        handleCSVFileSelect(file);
                      }
                    };
                    input.click();
                  }}
                  className="w-full h-12 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors"
                >
                  Upload CSV
                </button>
              ) : (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-green-800 font-medium">File uploaded: {csvFile.name}</span>
                  </div>
                </div>
              )}
              <button
                onClick={() => {
                  const sampleData = `Client,Project,Date,Duration,Notes,Billable
Acme Inc,Website Redesign,2024-01-15,2.5,Design meeting,TRUE
Acme Inc,Website Redesign,2024-01-16,3.0,Wireframes,TRUE
Beta LLC,Mobile App,2024-01-17,4.0,Development,TRUE`;
                  const blob = new Blob([sampleData], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = 'sample-time-data.csv';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);
                }}
                className="w-full text-blue-600 text-center text-base hover:text-blue-700 transition-colors"
              >
                Download sample CSV
              </button>
            </div>
          </div>
        )}

        {/* Progressive Disclosure - Manual Helper */}
        {selectedMethod === 'manual' && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 text-sm">💡</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Perfect for quick invoices</h4>
                <p className="text-base text-gray-600">
                  Real-time totals. No file needed.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Compare Methods Link */}
        <div className="text-center pt-4">
          <button
            onClick={() => setShowCompare(!showCompare)}
            className="text-blue-600 text-base hover:text-blue-700 transition-colors flex items-center justify-center mx-auto space-x-1"
          >
            <span>Not sure? Compare methods</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showCompare ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Compare Methods Bottom Sheet */}
        {showCompare && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
            <div className="bg-white rounded-t-xl w-full max-h-[60vh] overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Compare Methods</h3>
                  <button
                    onClick={() => setShowCompare(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-4 overflow-y-auto">
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="font-medium text-gray-900">Feature</div>
                    <div className="font-medium text-gray-900">CSV Upload</div>
                    <div className="font-medium text-gray-900">Manual Entry</div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-sm border-t border-gray-200 pt-3">
                    <div className="text-gray-600">Best for</div>
                    <div className="text-gray-900">Many entries</div>
                    <div className="text-gray-900">Few entries</div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-sm border-t border-gray-200 pt-3">
                    <div className="text-gray-600">Setup time</div>
                    <div className="text-gray-900">Export file</div>
                    <div className="text-gray-900">Type directly</div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-sm border-t border-gray-200 pt-3">
                    <div className="text-gray-600">Speed</div>
                    <div className="text-gray-900">Instant import</div>
                    <div className="text-gray-900">Real-time entry</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 p-4 bg-white/90 backdrop-blur supports-[backdrop-filter]:backdrop-blur border-t border-gray-200 lg:hidden" style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}>
        <button
          onClick={handleContinue}
          disabled={!selectedMethod || (selectedMethod === 'csv' && !csvFile)}
          className={`w-full h-12 rounded-lg font-medium transition-colors ${
            selectedMethod && (selectedMethod !== 'csv' || csvFile)
              ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800' 
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          {selectedMethod === 'csv' && csvFile && 'Continue with CSV'}
          {selectedMethod === 'csv' && !csvFile && 'Upload CSV file first'}
          {selectedMethod === 'manual' && 'Continue with Manual Entry'}
          {!selectedMethod && 'Continue'}
        </button>
      </div>

      {/* Bottom spacing for sticky CTA */}
      <div className="h-20 lg:hidden"></div>
    </div>
  );
} 