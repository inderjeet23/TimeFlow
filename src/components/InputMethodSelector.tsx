'use client';

import { useState } from 'react';
import { Upload, Edit3, FileText, Clock, ArrowRight } from 'lucide-react';
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
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors touch-target"
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
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors touch-target"
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
      {/* Header */}
      <div className="text-center mb-8">
        <div className="mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            Step 1 of 3
          </span>
        </div>
        <h2 className="text-mobile-xl text-gray-900 mb-4">
          Choose Your Input Method
        </h2>
        <p className="text-mobile-base text-gray-600 max-w-2xl mx-auto">
          You can either upload a CSV file from your time tracking tool or manually enter your time entries.
        </p>
      </div>

      {/* Input Method Options */}
      <div className="grid-mobile md:grid-cols-2 gap-6">
        {/* CSV Upload Option */}
        <div 
          className="card-mobile cursor-pointer hover:shadow-md transition-all duration-200 border-2 border-transparent hover:border-blue-200"
          onClick={() => setSelectedMethod('csv')}
        >
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload CSV File</h3>
            <p className="text-gray-600 mb-4">
              Import your time tracking data from Toggl, Clockify, Harvest, or any other tool.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center justify-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Supports multiple time tracking tools</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Automatic data parsing</span>
              </div>
            </div>
            <div className="mt-4">
              <span className="inline-flex items-center text-blue-600 font-medium">
                Choose CSV Upload
                <ArrowRight className="w-4 h-4 ml-1" />
              </span>
            </div>
          </div>
        </div>

        {/* Manual Entry Option */}
        <div 
          className="card-mobile cursor-pointer hover:shadow-md transition-all duration-200 border-2 border-transparent hover:border-green-200"
          onClick={() => setSelectedMethod('manual')}
        >
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Edit3 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Manual Entry</h3>
            <p className="text-gray-600 mb-4">
              Enter your time entries manually with a user-friendly form interface.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center justify-center space-x-2">
                <Edit3 className="h-4 w-4" />
                <span>No file upload required</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Real-time calculations</span>
              </div>
            </div>
            <div className="mt-4">
              <span className="inline-flex items-center text-green-600 font-medium">
                Choose Manual Entry
                <ArrowRight className="w-4 h-4 ml-1" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Start Options */}
      <div className="mt-8 grid-mobile md:grid-cols-2 gap-6">
        {/* Sample CSV */}
        <div className="card-mobile bg-blue-50 border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">📄 Need a Sample CSV?</h4>
          <p className="text-sm text-blue-700 mb-3">
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
            className="btn-secondary text-sm w-full"
          >
            Download Sample CSV
          </button>
        </div>

        {/* Quick Manual Entry */}
        <div className="card-mobile bg-green-50 border-green-200">
          <h4 className="font-medium text-green-900 mb-2">⚡ Quick Start</h4>
          <p className="text-sm text-green-700 mb-3">
            Start with a single time entry and add more as needed. Perfect for quick invoices.
          </p>
          <button
            onClick={() => setSelectedMethod('manual')}
            className="btn-primary text-sm w-full"
          >
            Start Manual Entry
          </button>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-8 card-mobile bg-gray-50">
        <h4 className="font-medium text-gray-900 mb-2">💡 Which method should I choose?</h4>
        <div className="grid-mobile md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <h5 className="font-medium text-gray-700 mb-1">Choose CSV Upload if:</h5>
            <ul className="space-y-1">
              <li>• You use a time tracking tool</li>
              <li>• You have many time entries</li>
              <li>• You want to import existing data</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-gray-700 mb-1">Choose Manual Entry if:</h5>
            <ul className="space-y-1">
              <li>• You don't use time tracking tools</li>
              <li>• You have just a few entries</li>
              <li>• You want to enter data quickly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 