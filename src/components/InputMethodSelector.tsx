'use client';

import { useState } from 'react';
import { Upload, Edit3, FileText, Clock, ArrowRight, HelpCircle, Zap, Users, Calculator } from 'lucide-react';
import CSVUploader from './CSVUploader';
import ManualTimeEntry from './ManualTimeEntry';
import { TimeEntry } from '@/types';

interface InputMethodSelectorProps {
  onTimeEntriesComplete: (timeEntries: TimeEntry[]) => void;
  onCSVUpload?: (file: File) => void;
}

type InputMethod = 'csv' | 'manual' | null;

export default function InputMethodSelector({ onTimeEntriesComplete, onCSVUpload }: InputMethodSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<InputMethod>(null);
  const [showHelp, setShowHelp] = useState(false);

  const handleCSVUpload = (file: File) => {
    if (onCSVUpload) {
      onCSVUpload(file);
    }
  };

  const handleManualEntries = (timeEntries: TimeEntry[]) => {
    onTimeEntriesComplete(timeEntries);
  };

  if (selectedMethod === 'csv') {
    return (
      <div>
        <div className="mb-6">
          <button
            onClick={() => setSelectedMethod(null)}
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors touch-target"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Input Method Selection</span>
          </button>
        </div>
        <CSVUploader onUpload={handleCSVUpload} />
      </div>
    );
  }

  if (selectedMethod === 'manual') {
    return (
      <div>
        <div className="mb-6">
          <button
            onClick={() => setSelectedMethod(null)}
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors touch-target"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Input Method Selection</span>
          </button>
        </div>
        <ManualTimeEntry onTimeEntriesComplete={handleManualEntries} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header with Value Proposition */}
      <div className="text-center mb-12">
        <div className="mb-6">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/20 text-primary">
            Step 1 of 3
          </span>
        </div>
        <h2 className="text-mobile-xl text-foreground mb-4">
          Choose Your Input Method
        </h2>
        <p className="text-mobile-base text-muted-foreground max-w-2xl mx-auto mb-6">
          Generate professional invoices from your time logs in minutes—no manual math, no hassle.
        </p>
        
        {/* Benefits Summary */}
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Upload className="h-4 w-4 text-primary" />
            <span>Easy imports</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Zap className="h-4 w-4 text-primary" />
            <span>Fast setup</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Calculator className="h-4 w-4 text-primary" />
            <span>Smart calculations</span>
          </div>
        </div>
      </div>

      {/* Input Method Options */}
      <div className="grid-mobile md:grid-cols-2 gap-8 mb-12">
        {/* CSV Upload Option - Power Users */}
        <div 
          className="card-mobile cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-primary/30 group relative overflow-hidden"
          onClick={() => setSelectedMethod('csv')}
        >
          {/* Power User Badge */}
          <div className="absolute top-4 right-4">
            <div className="bg-purple-500/20 text-purple-600 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
              <Users className="h-3 w-3" />
              <span>Power Users</span>
            </div>
          </div>
          
          <div className="text-center p-8">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
              <Upload className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-3">Upload CSV File</h3>
            <p className="text-muted-foreground mb-6 text-base leading-relaxed">
              Import your time tracking data from Toggl, Clockify, Harvest, or any other tool.
            </p>
            <div className="space-y-3 text-sm text-muted-foreground mb-8">
              <div className="flex items-center justify-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Supports multiple time tracking tools</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Automatic data parsing</span>
              </div>
            </div>
            
            {/* Prominent CTA Button */}
            <button className="w-full bg-primary text-primary-foreground py-4 px-6 rounded-lg font-semibold text-lg hover:bg-primary/90 active:bg-primary/80 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Choose CSV Upload
              <ArrowRight className="w-5 h-5 ml-2 inline" />
            </button>
          </div>
        </div>

        {/* Manual Entry Option - Quick Start */}
        <div 
          className="card-mobile cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-green-500/30 group relative overflow-hidden"
          onClick={() => setSelectedMethod('manual')}
        >
          {/* Quick Start Badge */}
          <div className="absolute top-4 right-4">
            <div className="bg-green-500/20 text-green-600 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
              <Zap className="h-3 w-3" />
              <span>Quick Start</span>
            </div>
          </div>
          
          <div className="text-center p-8">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
              <Edit3 className="h-10 w-10 text-green-500" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-3">Manual Entry</h3>
            <p className="text-muted-foreground mb-6 text-base leading-relaxed">
              Enter your time entries manually with a user-friendly form interface.
            </p>
            <div className="space-y-3 text-sm text-muted-foreground mb-8">
              <div className="flex items-center justify-center space-x-2">
                <Edit3 className="h-4 w-4" />
                <span>No file upload required</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Real-time calculations</span>
              </div>
            </div>
            
            {/* Prominent CTA Button */}
            <button className="w-full bg-green-500 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-green-600 active:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Choose Manual Entry
              <ArrowRight className="w-5 h-5 ml-2 inline" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Start Options */}
      <div className="grid-mobile md:grid-cols-2 gap-8 mb-12">
        {/* Sample CSV */}
        <div className="card-mobile bg-primary/5 border-primary/20">
          <h4 className="font-medium text-primary mb-3 text-lg">📄 Need a Sample CSV?</h4>
          <p className="text-sm text-primary/80 mb-4 leading-relaxed">
            Download a sample CSV file to see the expected format for your time tracking data.
          </p>
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
            className="btn-secondary text-sm w-full py-3"
          >
            Download Sample CSV
          </button>
        </div>

        {/* Quick Manual Entry */}
        <div className="card-mobile bg-green-500/5 border-green-500/20">
          <h4 className="font-medium text-green-500 mb-3 text-lg">⚡ Quick Start</h4>
          <p className="text-sm text-green-500/80 mb-4 leading-relaxed">
            Start with a single time entry and add more as needed. Perfect for quick invoices.
          </p>
          <button
            onClick={() => setSelectedMethod('manual')}
            className="btn-primary text-sm w-full py-3"
          >
            Start Manual Entry
          </button>
        </div>
      </div>

      {/* Tips with Help */}
      <div className="card-mobile bg-muted/50 relative">
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title="Get help"
          >
            <HelpCircle className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
        
        <h4 className="font-medium text-foreground mb-4 text-lg pr-12">💡 Which method should I choose?</h4>
        <div className="grid-mobile md:grid-cols-2 gap-6 text-sm text-muted-foreground">
          <div>
            <h5 className="font-medium text-foreground mb-2">Choose CSV Upload if:</h5>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2">
                <span className="text-primary mt-0.5">•</span>
                <span>You use a time tracking tool</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary mt-0.5">•</span>
                <span>You have many time entries</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-primary mt-0.5">•</span>
                <span>You want to import existing data</span>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-foreground mb-2">Choose Manual Entry if:</h5>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span>You don't use time tracking tools</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span>You have just a few entries</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span>You want to enter data quickly</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 bg-foreground/40 flex items-center justify-center p-4">
          <div className="bg-card rounded-xl border border-border shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Help & Support</h3>
                <button
                  onClick={() => setShowHelp(false)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4 text-sm text-muted-foreground">
                <div>
                  <h4 className="font-medium text-foreground mb-2">CSV File Format</h4>
                  <p>Your CSV should include columns for: Client, Project, Date, Duration, Notes, and Billable status.</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Manual Entry Tips</h4>
                  <p>Enter time in decimal format (e.g., 2.5 for 2 hours 30 minutes). You can add multiple entries and edit them before proceeding.</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Need More Help?</h4>
                  <p>Check our documentation or contact support for additional assistance with file formatting and data entry.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 