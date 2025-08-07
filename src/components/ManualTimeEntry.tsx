'use client';

import { useState } from 'react';
import { Plus, Trash2, Clock, Calendar, DollarSign } from 'lucide-react';
import { TimeEntry } from '@/types';

interface ManualTimeEntryProps {
  onTimeEntriesComplete: (timeEntries: TimeEntry[]) => void;
}

interface TimeEntryForm {
  client: string;
  project: string;
  date: string;
  duration: string;
  notes: string;
  rate: string;
}

export default function ManualTimeEntry({ onTimeEntriesComplete }: ManualTimeEntryProps) {
  const [timeEntries, setTimeEntries] = useState<TimeEntryForm[]>([
    {
      client: '',
      project: '',
      date: new Date().toISOString().split('T')[0],
      duration: '',
      notes: '',
      rate: '75'
    }
  ]);

  const addTimeEntry = () => {
    setTimeEntries([
      ...timeEntries,
      {
        client: timeEntries[0]?.client || '',
        project: '',
        date: new Date().toISOString().split('T')[0],
        duration: '',
        notes: '',
        rate: timeEntries[0]?.rate || '75'
      }
    ]);
  };

  const removeTimeEntry = (index: number) => {
    if (timeEntries.length > 1) {
      setTimeEntries(timeEntries.filter((_, i) => i !== index));
    }
  };

  const updateTimeEntry = (index: number, field: keyof TimeEntryForm, value: string) => {
    const updatedEntries = [...timeEntries];
    updatedEntries[index] = { ...updatedEntries[index], [field]: value };
    
    // Auto-fill client and rate for subsequent entries
    if (field === 'client' || field === 'rate') {
      for (let i = index + 1; i < updatedEntries.length; i++) {
        if (field === 'client' && !updatedEntries[i].client) {
          updatedEntries[i].client = value;
        }
        if (field === 'rate' && !updatedEntries[i].rate) {
          updatedEntries[i].rate = value;
        }
      }
    }
    
    setTimeEntries(updatedEntries);
  };

  const handleContinue = () => {
    const validEntries = timeEntries
      .filter(entry => entry.client && entry.project && entry.duration)
      .map(entry => ({
        client: entry.client,
        project: entry.project,
        date: entry.date,
        duration: parseFloat(entry.duration) || 0,
        notes: entry.notes,
        billable: true
      }));

    if (validEntries.length === 0) {
      alert('Please add at least one time entry with client, project, and duration.');
      return;
    }

    onTimeEntriesComplete(validEntries);
  };

  const totalHours = timeEntries.reduce((sum, entry) => sum + (parseFloat(entry.duration) || 0), 0);
  const totalAmount = timeEntries.reduce((sum, entry) => {
    const hours = parseFloat(entry.duration) || 0;
    const rate = parseFloat(entry.rate) || 0;
    return sum + (hours * rate);
  }, 0);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            Manual Entry
          </span>
        </div>
        <h2 className="text-mobile-xl text-gray-900 mb-4">
          Add Your Time Entries Manually
        </h2>
        <p className="text-mobile-base text-gray-600 max-w-2xl mx-auto">
          Enter your time tracking data manually. You can add multiple entries and we'll automatically calculate totals.
        </p>
      </div>

      {/* Time Entries Form */}
      <div className="space-y-6">
        {timeEntries.map((entry, index) => (
          <div key={index} className="card-mobile">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Time Entry #{index + 1}
              </h3>
              {timeEntries.length > 1 && (
                <button
                  onClick={() => removeTimeEntry(index)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors touch-target"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="grid-mobile-2 gap-4">
              {/* Client */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Client <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={entry.client}
                  onChange={(e) => updateTimeEntry(index, 'client', e.target.value)}
                  placeholder="Client name"
                  className="input-mobile"
                  required
                />
              </div>

              {/* Project */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Project <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={entry.project}
                  onChange={(e) => updateTimeEntry(index, 'project', e.target.value)}
                  placeholder="Project name"
                  className="input-mobile"
                  required
                />
              </div>

              {/* Date */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    value={entry.date}
                    onChange={(e) => updateTimeEntry(index, 'date', e.target.value)}
                    className="input-mobile pl-10 w-full min-w-0"
                    required
                  />
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Duration (hours) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    value={entry.duration}
                    onChange={(e) => updateTimeEntry(index, 'duration', e.target.value)}
                    placeholder="2.5"
                    className="input-mobile pl-10"
                    required
                  />
                </div>
              </div>

              {/* Rate */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Rate ($/hour)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={entry.rate}
                    onChange={(e) => updateTimeEntry(index, 'rate', e.target.value)}
                    placeholder="75.00"
                    className="input-mobile pl-10"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  value={entry.notes}
                  onChange={(e) => updateTimeEntry(index, 'notes', e.target.value)}
                  placeholder="Description of work completed..."
                  className="input-mobile min-h-[80px] resize-none"
                  rows={3}
                />
              </div>
            </div>

            {/* Entry Summary */}
            {entry.duration && entry.rate && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">
                    {parseFloat(entry.duration) || 0} hours × ${parseFloat(entry.rate) || 0}/hour
                  </span>
                  <span className="font-semibold text-gray-900">
                    ${((parseFloat(entry.duration) || 0) * (parseFloat(entry.rate) || 0)).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Add More Button */}
        <div className="text-center">
          <button
            onClick={addTimeEntry}
            className="btn-secondary flex items-center justify-center space-x-2 mx-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Add Another Time Entry</span>
          </button>
        </div>

        {/* Summary */}
        {timeEntries.length > 0 && (
          <div className="card-mobile bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
            <div className="grid-mobile-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Entries:</span>
                  <span className="font-medium">{timeEntries.filter(e => e.client && e.project && e.duration).length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Hours:</span>
                  <span className="font-medium">{totalHours.toFixed(2)} hours</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Average Rate:</span>
                  <span className="font-medium">
                    ${timeEntries.length > 0 ? (totalAmount / totalHours).toFixed(2) : '0.00'}/hour
                  </span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t pt-2">
                  <span>Total Amount:</span>
                  <span className="text-blue-600">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={handleContinue}
            className="btn-primary flex items-center justify-center space-x-2 mx-auto"
          >
            <span>Continue to Invoice Configuration</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-8 card-mobile bg-blue-50 border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2">💡 Tips for Manual Entry</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Enter the client name once and it will auto-fill for new entries</li>
          <li>• Set your hourly rate once and it will apply to all entries</li>
          <li>• You can add as many time entries as needed</li>
          <li>• Use decimal hours (e.g., 2.5 for 2 hours 30 minutes)</li>
        </ul>
      </div>
    </div>
  );
} 