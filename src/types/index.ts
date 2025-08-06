export interface TimeEntry {
  client: string;
  project: string;
  date: string;
  duration: number; // in hours
  notes?: string;
  billable: boolean;
}

export interface InvoiceItem {
  client: string;
  project: string;
  date: string;
  hours: number;
  rate: number;
  amount: number;
  notes?: string;
}

export interface BusinessInfo {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  email: string;
  phone?: string;
  website?: string;
  logo?: string;
}

export interface ClientInfo {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  email?: string;
}

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  business: BusinessInfo;
  client: ClientInfo;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes?: string;
  terms?: string;
  watermark?: boolean;
}

export interface CSVColumnMapping {
  client: string;
  project: string;
  date: string;
  duration: string;
  notes?: string;
  billable?: string;
}

export interface ParsedCSVData {
  headers: string[];
  rows: any[][];
  columnMapping: CSVColumnMapping;
}

export interface InvoiceSettings {
  defaultRate: number;
  taxRate: number;
  currency: string;
  invoicePrefix: string;
  autoNumbering: boolean;
  watermark: boolean;
} 