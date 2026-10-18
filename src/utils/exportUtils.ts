import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const exportToCSV = (data: Record<string, unknown>[], filename = 'fluxboard_export.csv') => {
  if (!data || !data.length) return;
  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers.map((h) => {
      const val = row[h];
      const escaped = String(val ?? '').replace(/"/g, '""');
      return `"${escaped}"`;
    }).join(',')
  );

  const csvContent = [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportElementToPNG = async (elementId: string, filename = 'fluxboard-analytics.png') => {
  const element = document.getElementById(elementId);
  if (!element) return;
  const canvas = await html2canvas(element, {
    backgroundColor: '#07090e',
    scale: 2
  });
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
};

export const exportElementToPDF = async (elementId: string, filename = 'fluxboard-report.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) return;
  const canvas = await html2canvas(element, {
    backgroundColor: '#07090e',
    scale: 1.5
  });
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('landscape', 'pt', 'a4');
  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save(filename);
};
