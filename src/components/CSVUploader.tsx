'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CSVUploaderProps {
  onUpload: (file: File) => void;
}

export default function CSVUploader({ onUpload }: CSVUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        onUpload(file);
      } else {
        alert('Please upload a valid CSV file.');
      }
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    multiple: false,
  });

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div
        {...getRootProps()}
        className={cn(
          "upload-area-mobile",
          isDragActive && !isDragReject && "border-blue-500 bg-blue-50 scale-105",
          isDragReject && "border-red-500 bg-red-50",
          !isDragActive && "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
        )}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4 sm:space-y-6">
          {isDragReject ? (
            <AlertCircle className="h-12 w-12 sm:h-16 sm:w-16 text-red-500" />
          ) : (
            <div className="relative">
              <Upload className="h-12 w-12 sm:h-16 sm:w-16 text-blue-500" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-blue-600">+</span>
              </div>
            </div>
          )}
          
          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
              {isDragActive 
                ? isDragReject 
                  ? 'Invalid file type' 
                  : 'Drop your CSV file here'
                : 'Upload your time tracking CSV'
              }
            </h3>
            
            <p className="text-base sm:text-lg text-gray-600">
              {isDragReject 
                ? 'Please upload a valid CSV file'
                : 'Drag and drop your CSV file here, or click to browse'
              }
            </p>
          </div>
          
          {!isDragActive && (
            <div className="flex items-center space-x-2 text-sm sm:text-base text-gray-500">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Supports: Toggl, Clockify, Harvest, and more</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Supported Formats & Examples */}
      <div className="mt-6 sm:mt-8 grid-mobile md:grid-cols-2 gap-6">
        {/* Supported Tools */}
        <div className="card-mobile">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Supported Time Tracking Tools</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center flex-shrink-0">
                <span className="text-red-600 font-bold text-sm">T</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900">Toggl</div>
                <div className="text-sm text-gray-500">Export from Reports → Detailed</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold text-sm">C</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900">Clockify</div>
                <div className="text-sm text-gray-500">Export from Reports → Detailed</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-bold text-sm">H</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900">Harvest</div>
                <div className="text-sm text-gray-500">Export from Reports → Detailed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sample Format */}
        <div className="card-mobile">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
            <h4 className="text-lg font-semibold text-gray-900">Expected CSV Format</h4>
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
              className="btn-secondary text-sm w-full sm:w-auto"
            >
              Download Sample
            </button>
          </div>
          <div className="bg-gray-900 text-green-400 p-3 sm:p-4 rounded-lg font-mono text-xs sm:text-sm overflow-x-auto">
            <div className="text-gray-400 mb-2"># CSV Headers</div>
            <div>Client,Project,Date,Duration,Notes,Billable</div>
            <div className="text-gray-400 mt-3 mb-2"># Example Rows</div>
            <div>Acme Inc,Website Redesign,2024-01-15,2.5,Design meeting,TRUE</div>
            <div>Acme Inc,Website Redesign,2024-01-16,3.0,Wireframes,TRUE</div>
            <div>Beta LLC,Mobile App,2024-01-17,4.0,Development,TRUE</div>
          </div>
        </div>
      </div>
    </div>
  );
} 