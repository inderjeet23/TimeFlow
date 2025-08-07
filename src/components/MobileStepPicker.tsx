'use client';


import { useState, useEffect, useRef } from 'react';
import { Upload, Edit3, Check, ChevronDown, X } from 'lucide-react';
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
  const csvSectionRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to CSV section when selected
  useEffect(() => {
    if (selectedMethod === 'csv' && csvSectionRef.current) {
      setTimeout(() => {
        csvSectionRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 100);
    }
  }, [selectedMethod]);

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

  const handleRemoveFile = () => {
    setCsvFile(null);
  };

  const handleManualEntries = (timeEntries: TimeEntry[]) => {
    onTimeEntriesComplete(timeEntries);
  };

  // Show manual entry form
  if (currentView === 'manual-entry') {
    return (
      <div className="min-h-screen bg-background lg:hidden">
        <div className="bg-card border-b border-border px-4 py-4">
          <button
            onClick={() => {
              setCurrentView('picker');
              setSelectedMethod(null);
            }}
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
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
    <div className="min-h-screen bg-background lg:hidden">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-6">
        {/* Stepper Dots */}
        <div className="flex justify-center mb-6">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <div className="w-3 h-3 bg-muted rounded-full"></div>
            <div className="w-3 h-3 bg-muted rounded-full"></div>
          </div>
        </div>

        {/* Page Title */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            How do you want to add time?
          </h1>
          <p className="text-base text-muted-foreground">
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
                ? 'border-primary ring-2 ring-primary/20 bg-primary/5' 
                : 'border-border bg-card hover:border-border/80'
            }`}
            onClick={() => setSelectedMethod('csv')}
          >
            <div className="flex-shrink-0">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                selectedMethod === 'csv' ? 'bg-primary' : 'bg-muted'
              }`}>
                {selectedMethod === 'csv' ? (
                  <Check className="w-5 h-5 text-primary-foreground" />
                ) : (
                  <Upload className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Upload CSV file
              </h3>
              <p className="text-base text-muted-foreground mb-1">
                Fast if you already track time
              </p>
              <p className="text-sm text-muted-foreground">
                Works with Toggl, Clockify, Harvest.
              </p>
            </div>
          </div>

          {/* Compare Methods Link - positioned between cards */}
          <div className="text-center py-2">
            <button
              onClick={() => setShowCompare(!showCompare)}
              className="text-primary text-sm hover:text-primary/80 transition-colors flex items-center justify-center mx-auto space-x-1"
            >
              <span>Not sure? Compare methods</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${showCompare ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Manual Entry Card */}
          <div 
            className={`rounded-xl border p-4 flex items-start gap-3 cursor-pointer transition-all duration-150 ${
              selectedMethod === 'manual' 
                ? 'border-primary ring-2 ring-primary/20 bg-primary/5' 
                : 'border-border bg-card hover:border-border/80'
            }`}
            onClick={() => setSelectedMethod('manual')}
          >
            <div className="flex-shrink-0">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                selectedMethod === 'manual' ? 'bg-primary' : 'bg-muted'
              }`}>
                {selectedMethod === 'manual' ? (
                  <Check className="w-5 h-5 text-primary-foreground" />
                ) : (
                  <Edit3 className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Manual entry
              </h3>
              <p className="text-base text-muted-foreground mb-1">
                Simple for a few entries
              </p>
              <p className="text-sm text-muted-foreground">
                Type in your time data directly.
              </p>
            </div>
          </div>
        </div>

        {/* Progressive Disclosure - CSV Helper */}
        {selectedMethod === 'csv' && (
          <div 
            ref={csvSectionRef}
            className="bg-card rounded-xl border border-border p-4 space-y-3 animate-fadeIn"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-foreground">Upload your CSV file</h4>
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
                  className="w-full h-12 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 active:bg-primary/80 transition-colors"
                >
                  Upload CSV
                </button>
              ) : (
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-green-600 dark:text-green-400 font-medium">File uploaded: {csvFile.name}</span>
                    </div>
                    <button
                      onClick={handleRemoveFile}
                      className="p-1 hover:bg-green-500/20 rounded transition-colors"
                      title="Change file"
                    >
                      <X className="w-4 h-4 text-green-500" />
                    </button>
                  </div>
                  <div className="mt-2">
                    <button
                      onClick={() => {
                        // Trigger file input for new file
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
                      className="text-green-600 dark:text-green-400 text-sm hover:text-green-700 dark:hover:text-green-300 transition-colors underline"
                    >
                      Change file
                    </button>
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
                className="w-full text-primary text-center text-base hover:text-primary/80 transition-colors"
              >
                Download sample CSV
              </button>
            </div>
          </div>
        )}

        {/* Progressive Disclosure - Manual Helper */}
        {selectedMethod === 'manual' && (
          <div className="bg-card rounded-xl border border-border p-4 animate-fadeIn">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-500 text-sm">💡</span>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">Perfect for quick invoices</h4>
                <p className="text-base text-muted-foreground">
                  Real-time totals. No file needed.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Compare Methods Bottom Sheet */}
        {showCompare && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
            <div className="bg-card rounded-t-xl w-full max-h-[60vh] overflow-hidden border border-border">
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">Compare Methods</h3>
                  <button
                    onClick={() => setShowCompare(false)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
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
                    <div className="font-medium text-foreground">Feature</div>
                    <div className="font-medium text-foreground">CSV Upload</div>
                    <div className="font-medium text-foreground">Manual Entry</div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-sm border-t border-border pt-3">
                    <div className="text-muted-foreground">Best for</div>
                    <div className="text-foreground">Many entries</div>
                    <div className="text-foreground">Few entries</div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-sm border-t border-border pt-3">
                    <div className="text-muted-foreground">Setup time</div>
                    <div className="text-foreground">Export file</div>
                    <div className="text-foreground">Type directly</div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-sm border-t border-border pt-3">
                    <div className="text-muted-foreground">Speed</div>
                    <div className="text-foreground">Instant import</div>
                    <div className="text-foreground">Real-time entry</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 p-4 bg-card/90 backdrop-blur supports-[backdrop-filter]:backdrop-blur border-t border-border lg:hidden" style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}>
        <button
          onClick={handleContinue}
          disabled={!selectedMethod || (selectedMethod === 'csv' && !csvFile)}
          className={`w-full h-12 rounded-lg font-medium transition-colors ${
            selectedMethod && (selectedMethod !== 'csv' || csvFile)
              ? 'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80' 
              : 'bg-muted text-muted-foreground cursor-not-allowed'
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