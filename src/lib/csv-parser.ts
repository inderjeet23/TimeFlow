import Papa from 'papaparse';
import { TimeEntry, InvoiceItem, CSVColumnMapping, ParsedCSVData } from '@/types';

export function parseCSV(file: File): Promise<ParsedCSVData> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: any) => {
        if (results.errors.length > 0) {
          reject(new Error('Failed to parse CSV file'));
          return;
        }

        const headers = results.meta.fields || [];
        const rows = results.data as any[];
        
        // Try to auto-detect column mapping
        const columnMapping = detectColumnMapping(headers);
        
        resolve({
          headers,
          rows,
          columnMapping
        });
      },
      error: (error: any) => {
        reject(error);
      }
    });
  });
}

function detectColumnMapping(headers: string[]): CSVColumnMapping {
  const mapping: CSVColumnMapping = {
    client: '',
    project: '',
    date: '',
    duration: '',
    notes: '',
    billable: ''
  };

  headers.forEach(header => {
    const lowerHeader = header.toLowerCase();
    
    if (lowerHeader.includes('client') || lowerHeader.includes('customer')) {
      mapping.client = header;
    } else if (lowerHeader.includes('project') || lowerHeader.includes('task')) {
      mapping.project = header;
    } else if (lowerHeader.includes('date') || lowerHeader.includes('start')) {
      mapping.date = header;
    } else if (lowerHeader.includes('duration') || lowerHeader.includes('time') || lowerHeader.includes('hours')) {
      mapping.duration = header;
    } else if (lowerHeader.includes('notes') || lowerHeader.includes('description') || lowerHeader.includes('comment')) {
      mapping.notes = header;
    } else if (lowerHeader.includes('billable') || lowerHeader.includes('bill')) {
      mapping.billable = header;
    }
  });

  return mapping;
}

export function convertTimeEntriesToInvoiceItems(
  timeEntries: TimeEntry[],
  defaultRate: number
): InvoiceItem[] {
  return timeEntries
    .filter(entry => entry.billable)
    .map(entry => ({
      client: entry.client,
      project: entry.project,
      date: entry.date,
      hours: entry.duration,
      rate: defaultRate,
      amount: entry.duration * defaultRate,
      notes: entry.notes
    }));
}

export function parseDuration(duration: string): number {
  // Handle HH:MM format
  if (duration.includes(':')) {
    const [hours, minutes] = duration.split(':').map(Number);
    return hours + (minutes / 60);
  }
  
  // Handle decimal hours
  return parseFloat(duration) || 0;
}

export function parseDate(dateString: string): string {
  // Try to parse various date formats
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date format: ${dateString}`);
  }
  return date.toISOString().split('T')[0];
}

export function extractMostCommonClient(timeEntries: TimeEntry[]): string {
  if (!timeEntries || timeEntries.length === 0) {
    return '';
  }

  // Count occurrences of each client
  const clientCounts: Record<string, number> = {};
  timeEntries.forEach(entry => {
    if (entry.client) {
      clientCounts[entry.client] = (clientCounts[entry.client] || 0) + 1;
    }
  });

  // Find the client with the most entries
  let mostCommonClient = '';
  let maxCount = 0;

  Object.entries(clientCounts).forEach(([client, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mostCommonClient = client;
    }
  });

  return mostCommonClient;
}

export function groupByClient(items: InvoiceItem[]): Record<string, InvoiceItem[]> {
  return items.reduce((groups, item) => {
    if (!groups[item.client]) {
      groups[item.client] = [];
    }
    groups[item.client].push(item);
    return groups;
  }, {} as Record<string, InvoiceItem[]>);
}

export function calculateTotals(items: InvoiceItem[], taxRate: number = 0) {
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;
  
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    total: Math.round(total * 100) / 100
  };
} 