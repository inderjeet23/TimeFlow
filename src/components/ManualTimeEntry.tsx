'use client';

import { useState, useCallback } from 'react';
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

  const addTimeEntry = useCallback(() => {
    setTimeEntries(prev => [
      ...prev,
      {
        client: prev[0]?.client || '',
        project: '',
        date: new Date().toISOString().split('T')[0],
        duration: '',
        notes: '',
        rate: prev[0]?.rate || '75'
      }
    ]);
  }, []);

  const removeTimeEntry = useCallback((index: number) => {
    setTimeEntries(prev => {
      if (prev.length > 1) {
        return prev.filter((_, i) => i !== index);
      }
      return prev;
    });
  }, []);

  const updateTimeEntry = useCallback((index: number, field: keyof TimeEntryForm, value: string) => {
    setTimeEntries(prevEntries => {
      const updatedEntries = [...prevEntries];
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
      
      return updatedEntries;
    });
  }, []);

  const handleContinue = useCallback(() => {
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
  }, [timeEntries, onTimeEntriesComplete]);

  const totalHours = timeEntries.reduce((sum, entry) => sum + (parseFloat(entry.duration) || 0), 0);
  const totalAmount = timeEntries.reduce((sum, entry) => {
    const hours = parseFloat(entry.duration) || 0;
    const rate = parseFloat(entry.rate) || 0;
    return sum + (hours * rate);
  }, 0);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800 mb-6">
          Manual Entry
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          Add Your Time Entries Manually
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Enter your time tracking data manually. You can add multiple entries and we'll automatically calculate totals.
        </p>
      </div>

      {/* Time Entries */}
      <div className="space-y-8 lg:space-y-10">
        {timeEntries.map((entry, index) => (
          <div key={index} className="bg-white rounded-2xl border border-gray-200 p-6 lg:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl lg:text-2xl font-semibold text-gray-900">
                Time Entry #{index + 1}
              </h3>
              {timeEntries.length > 1 && (
                <button
                  onClick={() => removeTimeEntry(index)}
                  className="p-3 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-xl transition-colors touch-target"
                  title="Remove this entry"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="space-y-8">
              {/* Row 1: Client and Project */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                <div className="space-y-3">
                  <label className="block text-base font-semibold text-gray-700">
                    Client <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={entry.client}
                    onChange={(e) => updateTimeEntry(index, 'client', e.target.value)}
                    placeholder="Client name"
                    className="w-full px-4 py-4 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-base font-semibold text-gray-700">
                    Project <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={entry.project}
                    onChange={(e) => updateTimeEntry(index, 'project', e.target.value)}
                    placeholder="Project name"
                    className="w-full px-4 py-4 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Row 2: Date and Duration */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                <div className="space-y-3">
                  <label className="block text-base font-semibold text-gray-700">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    <input
                      type="date"
                      value={entry.date}
                      onChange={(e) => updateTimeEntry(index, 'date', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-base font-semibold text-gray-700">
                    Duration (hours) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    <input
                      type="number"
                      step="0.25"
                      min="0"
                      value={entry.duration}
                      onChange={(e) => updateTimeEntry(index, 'duration', e.target.value)}
                      placeholder="2.5"
                      className="w-full pl-12 pr-4 py-4 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Rate */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                <div className="space-y-3">
                  <label className="block text-base font-semibold text-gray-700">
                    Rate ($/hour)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={entry.rate}
                      onChange={(e) => updateTimeEntry(index, 'rate', e.target.value)}
                      placeholder="75.00"
                      className="w-full pl-12 pr-4 py-4 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Row 4: Notes */}
              <div className="space-y-3">
                <label className="block text-base font-semibold text-gray-700">
                  Notes
                </label>
                <textarea
                  value={entry.notes}
                  onChange={(e) => updateTimeEntry(index, 'notes', e.target.value)}
                  placeholder="Description of work completed..."
                  className="w-full px-4 py-4 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  rows={4}
                />
              </div>
            </div>

            {/* Entry Summary */}
            {entry.duration && entry.rate && (
              <div className="mt-8 p-4 bg-blue-50 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium text-lg">
                    {parseFloat(entry.duration) || 0} hours × ${parseFloat(entry.rate) || 0}/hour
                  </span>
                  <span className="text-2xl font-bold text-gray-900">
                    ${((parseFloat(entry.duration) || 0) * (parseFloat(entry.rate) || 0)).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Add More Button */}
        <div className="text-center py-6">
          <button
            onClick={addTimeEntry}
            className="inline-flex items-center justify-center space-x-3 px-8 py-4 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors touch-target text-lg"
          >
            <Plus className="h-5 w-5" />
            <span>Add Another Time Entry</span>
          </button>
        </div>

        {/* Summary */}
        {timeEntries.length > 0 && (
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 lg:p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-8">Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium text-lg">Total Entries:</span>
                  <span className="font-semibold text-gray-900 text-lg">{timeEntries.filter(e => e.client && e.project && e.duration).length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium text-lg">Total Hours:</span>
                  <span className="font-semibold text-gray-900 text-lg">{totalHours.toFixed(2)} hours</span>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium text-lg">Average Rate:</span>
                  <span className="font-semibold text-gray-900 text-lg">${totalHours > 0 ? (totalAmount / totalHours).toFixed(2) : 'N/A'}/hour</span>
                </div>
                <div className="flex justify-between items-center text-2xl border-t pt-6">
                  <span className="font-bold text-gray-900">Total Amount:</span>
                  <span className="font-bold text-blue-600">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Continue Button */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur supports-[backdrop-filter]:backdrop-blur border-t p-6 -mx-4 mt-12 sm:-mx-6 lg:-mx-8">
          <button
            onClick={handleContinue}
            disabled={timeEntries.filter(e => e.client && e.project && e.duration).length === 0}
            className={`w-full h-16 rounded-xl font-semibold text-lg transition-colors touch-target ${
              timeEntries.filter(e => e.client && e.project && e.duration).length > 0
                ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-lg' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue to Invoice Configuration
          </button>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 lg:p-8 mb-8">
          <h4 className="font-semibold text-blue-900 mb-6 text-xl">💡 Tips for Manual Entry</h4>
          <ul className="text-blue-800 space-y-3 text-lg">
            <li>• Enter client name first and it will auto-fill for new entries</li>
            <li>• Set hourly rate once and it will apply to all entries</li>
            <li>• You can add as many time entries as needed</li>
            <li>• Use decimal hours (e.g., 2.5 for 2 hours 30 minutes)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}