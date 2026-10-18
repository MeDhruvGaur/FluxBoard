import React, { useState } from 'react';
import { FileSpreadsheet, FileText, Image, X, Check } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { setExportModalOpen } from '../../../features/ui/slices/uiSlice';
import { exportToCSV, exportElementToPDF, exportElementToPNG } from '../../../utils/exportUtils';
import { addNotification } from '../../../features/notifications/slices/notificationSlice';

export const ExportModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.isExportModalOpen);
  const transactions = useAppSelector((state) => state.dashboard.transactions);
  const [format, setFormat] = useState<'csv' | 'pdf' | 'png'>('csv');
  const [exporting, setExporting] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    setExporting(true);
    try {
      if (format === 'csv') {
        exportToCSV(transactions as unknown as Record<string, unknown>[], `fluxboard-transactions-${Date.now()}.csv`);
      } else if (format === 'pdf') {
        await exportElementToPDF('dashboard-content-area', `fluxboard-report-${Date.now()}.pdf`);
      } else if (format === 'png') {
        await exportElementToPNG('dashboard-content-area', `fluxboard-analytics-${Date.now()}.png`);
      }

      dispatch(
        addNotification({
          title: 'Export Successful',
          message: `Your ${format.toUpperCase()} export has been processed and downloaded.`,
          type: 'success'
        })
      );
      dispatch(setExportModalOpen(false));
    } catch (err: any) {
      dispatch(
        addNotification({
          title: 'Export Failed',
          message: err?.message || 'Failed to generate export file',
          type: 'error'
        })
      );
    } finally {
      setExporting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
        padding: '1rem'
      }}
    >
      <div
        className="glass-panel animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          backgroundColor: 'var(--bg-secondary)',
          boxShadow: 'var(--shadow-xl)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Export Analytics & Reports</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
              Choose your preferred format for reporting and offline analysis
            </p>
          </div>
          <button
            onClick={() => dispatch(setExportModalOpen(false))}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {[
            {
              id: 'csv',
              title: 'CSV Data Sheet',
              desc: 'Full raw transactions, metrics & timestamps in tabular CSV',
              icon: FileSpreadsheet,
              color: '#34d399'
            },
            {
              id: 'pdf',
              title: 'PDF Executive Briefing',
              desc: 'Vector rendered print-ready dashboard report with charts',
              icon: FileText,
              color: '#f87171'
            },
            {
              id: 'png',
              title: 'High-Res PNG Snapshot',
              desc: '2x retina image capture suitable for slide decks',
              icon: Image,
              color: '#38bdf8'
            }
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = format === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setFormat(item.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-card)',
                  border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <div
                  style={{
                    padding: '0.5rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: item.color
                  }}
                >
                  <Icon size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{item.title}</div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                </div>
                {isSelected && <Check size={18} color="var(--accent-primary)" />}
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <button
            onClick={() => dispatch(setExportModalOpen(false))}
            className="btn btn-secondary"
            disabled={exporting}
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="btn btn-primary"
            disabled={exporting}
            style={{ minWidth: '120px' }}
          >
            {exporting ? 'Processing...' : 'Export Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
