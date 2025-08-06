import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { InvoiceData } from '@/types';

export async function generateInvoicePDF(invoice: InvoiceData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]); // US Letter size
  const { width, height } = page.getSize();
  
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Margins
  const margin = 50;
  const contentWidth = width - (margin * 2);
  
  let yPosition = height - margin;
  
  // Header
  yPosition = drawHeader(page, invoice, yPosition, margin, contentWidth, font, boldFont);
  
  // Business and Client Info
  yPosition = drawBusinessClientInfo(page, invoice, yPosition, margin, contentWidth, font, boldFont);
  
  // Invoice Details
  yPosition = drawInvoiceDetails(page, invoice, yPosition, margin, contentWidth, font, boldFont);
  
  // Items Table
  yPosition = drawItemsTable(page, invoice, yPosition, margin, contentWidth, font, boldFont);
  
  // Totals
  yPosition = drawTotals(page, invoice, yPosition, margin, contentWidth, font, boldFont);
  
  // Footer
  drawFooter(page, invoice, margin, contentWidth, font);
  
  // Add watermark if needed
  if (invoice.watermark) {
    addWatermark(page, width, height, font);
  }
  
  return await pdfDoc.save();
}

function drawHeader(page: any, invoice: InvoiceData, yPosition: number, margin: number, contentWidth: number, font: any, boldFont: any): number {
  // Logo placeholder (would need to be implemented with actual logo)
  if (invoice.business.logo) {
    // TODO: Add logo embedding logic
  }
  
  // Business name
  page.drawText(invoice.business.name, {
    x: margin,
    y: yPosition,
    size: 24,
    font: boldFont,
    color: rgb(0.2, 0.2, 0.2)
  });
  
  yPosition -= 30;
  
  // Business address
  const addressLines = [
    invoice.business.address,
    `${invoice.business.city}, ${invoice.business.state} ${invoice.business.zipCode}`,
    invoice.business.country
  ];
  
  addressLines.forEach(line => {
    page.drawText(line, {
      x: margin,
      y: yPosition,
      size: 10,
      font: font,
      color: rgb(0.4, 0.4, 0.4)
    });
    yPosition -= 15;
  });
  
  yPosition -= 20;
  
  return yPosition;
}

function drawBusinessClientInfo(page: any, invoice: InvoiceData, yPosition: number, margin: number, contentWidth: number, font: any, boldFont: any): number {
  const leftColumn = margin;
  const rightColumn = margin + (contentWidth / 2);
  
  // Client Info (right side)
  page.drawText('Bill To:', {
    x: rightColumn,
    y: yPosition,
    size: 12,
    font: boldFont,
    color: rgb(0.2, 0.2, 0.2)
  });
  
  yPosition -= 20;
  
  const clientLines = [
    invoice.client.name,
    invoice.client.address,
    `${invoice.client.city}, ${invoice.client.state} ${invoice.client.zipCode}`,
    invoice.client.country
  ];
  
  clientLines.forEach(line => {
    page.drawText(line, {
      x: rightColumn,
      y: yPosition,
      size: 10,
      font: font,
      color: rgb(0.4, 0.4, 0.4)
    });
    yPosition -= 15;
  });
  
  yPosition -= 30;
  
  return yPosition;
}

function drawInvoiceDetails(page: any, invoice: InvoiceData, yPosition: number, margin: number, contentWidth: number, font: any, boldFont: any): number {
  const leftColumn = margin;
  const rightColumn = margin + (contentWidth / 2);
  
  // Invoice title
  page.drawText('INVOICE', {
    x: leftColumn,
    y: yPosition,
    size: 20,
    font: boldFont,
    color: rgb(0.2, 0.2, 0.2)
  });
  
  yPosition -= 30;
  
  // Invoice details
  const details = [
    { label: 'Invoice #:', value: invoice.invoiceNumber },
    { label: 'Date:', value: invoice.date },
    { label: 'Due Date:', value: invoice.dueDate }
  ];
  
  details.forEach(detail => {
    page.drawText(detail.label, {
      x: leftColumn,
      y: yPosition,
      size: 10,
      font: boldFont,
      color: rgb(0.4, 0.4, 0.4)
    });
    
    page.drawText(detail.value, {
      x: leftColumn + 80,
      y: yPosition,
      size: 10,
      font: font,
      color: rgb(0.2, 0.2, 0.2)
    });
    
    yPosition -= 20;
  });
  
  yPosition -= 20;
  
  return yPosition;
}

function drawItemsTable(page: any, invoice: InvoiceData, yPosition: number, margin: number, contentWidth: number, font: any, boldFont: any): number {
  const tableWidth = contentWidth;
  const colWidths = [tableWidth * 0.3, tableWidth * 0.2, tableWidth * 0.15, tableWidth * 0.15, tableWidth * 0.2];
  
  // Table header
  const headers = ['Description', 'Date', 'Hours', 'Rate', 'Amount'];
  let xPosition = margin;
  
  headers.forEach((header, index) => {
    page.drawText(header, {
      x: xPosition,
      y: yPosition,
      size: 10,
      font: boldFont,
      color: rgb(0.2, 0.2, 0.2)
    });
    xPosition += colWidths[index];
  });
  
  yPosition -= 20;
  
  // Draw header line
  page.drawLine({
    start: { x: margin, y: yPosition },
    end: { x: margin + tableWidth, y: yPosition },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8)
  });
  
  yPosition -= 20;
  
  // Table rows
  invoice.items.forEach(item => {
    if (yPosition < 100) {
      // Add new page if needed
      page = page.getDocument().addPage([612, 792]);
      yPosition = page.getSize().height - 50;
    }
    
    xPosition = margin;
    
    // Description
    page.drawText(item.project, {
      x: xPosition,
      y: yPosition,
      size: 9,
      font: font,
      color: rgb(0.2, 0.2, 0.2)
    });
    xPosition += colWidths[0];
    
    // Date
    page.drawText(item.date, {
      x: xPosition,
      y: yPosition,
      size: 9,
      font: font,
      color: rgb(0.4, 0.4, 0.4)
    });
    xPosition += colWidths[1];
    
    // Hours
    page.drawText(item.hours.toString(), {
      x: xPosition,
      y: yPosition,
      size: 9,
      font: font,
      color: rgb(0.4, 0.4, 0.4)
    });
    xPosition += colWidths[2];
    
    // Rate
    page.drawText(`$${item.rate.toFixed(2)}`, {
      x: xPosition,
      y: yPosition,
      size: 9,
      font: font,
      color: rgb(0.4, 0.4, 0.4)
    });
    xPosition += colWidths[3];
    
    // Amount
    page.drawText(`$${item.amount.toFixed(2)}`, {
      x: xPosition,
      y: yPosition,
      size: 9,
      font: font,
      color: rgb(0.2, 0.2, 0.2)
    });
    
    yPosition -= 20;
  });
  
  yPosition -= 20;
  
  return yPosition;
}

function drawTotals(page: any, invoice: InvoiceData, yPosition: number, margin: number, contentWidth: number, font: any, boldFont: any): number {
  const rightColumn = margin + contentWidth - 150;
  
  // Subtotal
  page.drawText('Subtotal:', {
    x: rightColumn,
    y: yPosition,
    size: 10,
    font: font,
    color: rgb(0.4, 0.4, 0.4)
  });
  
  page.drawText(`$${invoice.subtotal.toFixed(2)}`, {
    x: rightColumn + 80,
    y: yPosition,
    size: 10,
    font: font,
    color: rgb(0.2, 0.2, 0.2)
  });
  
  yPosition -= 20;
  
  // Tax
  if (invoice.taxAmount > 0) {
    page.drawText(`Tax (${invoice.taxRate}%):`, {
      x: rightColumn,
      y: yPosition,
      size: 10,
      font: font,
      color: rgb(0.4, 0.4, 0.4)
    });
    
    page.drawText(`$${invoice.taxAmount.toFixed(2)}`, {
      x: rightColumn + 80,
      y: yPosition,
      size: 10,
      font: font,
      color: rgb(0.2, 0.2, 0.2)
    });
    
    yPosition -= 20;
  }
  
  // Total
  page.drawText('Total:', {
    x: rightColumn,
    y: yPosition,
    size: 12,
    font: boldFont,
    color: rgb(0.2, 0.2, 0.2)
  });
  
  page.drawText(`$${invoice.total.toFixed(2)}`, {
    x: rightColumn + 80,
    y: yPosition,
    size: 12,
    font: boldFont,
    color: rgb(0.2, 0.2, 0.2)
  });
  
  yPosition -= 40;
  
  return yPosition;
}

function drawFooter(page: any, invoice: InvoiceData, margin: number, contentWidth: number, font: any): void {
  const yPosition = 50;
  
  if (invoice.notes) {
    page.drawText('Notes:', {
      x: margin,
      y: yPosition + 20,
      size: 10,
      font: font,
      color: rgb(0.4, 0.4, 0.4)
    });
    
    page.drawText(invoice.notes, {
      x: margin,
      y: yPosition,
      size: 9,
      font: font,
      color: rgb(0.4, 0.4, 0.4)
    });
  }
  
  if (invoice.terms) {
    page.drawText('Terms:', {
      x: margin + (contentWidth / 2),
      y: yPosition + 20,
      size: 10,
      font: font,
      color: rgb(0.4, 0.4, 0.4)
    });
    
    page.drawText(invoice.terms, {
      x: margin + (contentWidth / 2),
      y: yPosition,
      size: 9,
      font: font,
      color: rgb(0.4, 0.4, 0.4)
    });
  }
}

function addWatermark(page: any, width: number, height: number, font: any): void {
  page.drawText('FREE VERSION', {
    x: width / 2 - 50,
    y: height / 2,
    size: 48,
    font: font,
    color: rgb(0.9, 0.9, 0.9),
    rotate: { angle: -45, type: 'degrees' }
  });
} 