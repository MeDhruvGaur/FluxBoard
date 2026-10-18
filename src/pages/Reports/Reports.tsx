import React from 'react';
import { Download, FileText, CheckCircle, Shield, Award } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setExportModalOpen } from '../../features/ui/slices/uiSlice';
import { formatCurrency } from '../../utils/formatters';

export const Reports: React.FC = () => {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector((state) => state.dashboard.transactions);

  const totalSettled = transactions
    .filter((t) => t.status === 'completed')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const enterpriseTotal = transactions
    .filter((t) => t.plan === 'Enterprise')
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
            Enterprise Financial Audit & Compliance
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.35rem 0 0 0' }}>
            Quarterly revenue reconciliation, cloud billing metrics, and compliance certificates
          </p>
        </div>

        <button
          onClick={() => dispatch(setExportModalOpen(true))}
          className="btn btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Download size={16} /> Export Complete Audit Packet
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Net Processed Volume</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, fontFamily: 'var(--font-mono)', margin: '0.5rem 0', color: 'var(--accent-emerald)' }}>
            {formatCurrency(totalSettled)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>From {transactions.length} verified transactions</div>
        </div>

        <div className="glass-card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Enterprise Tier Share</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, fontFamily: 'var(--font-mono)', margin: '0.5rem 0', color: 'var(--accent-cyan)' }}>
            {formatCurrency(enterpriseTotal)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>High-contract annual recurring accounts</div>
        </div>

        <div className="glass-card">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Compliance Status</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.5rem 0' }}>
            <Shield size={24} color="var(--accent-emerald)" />
            <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>SOC2 Type II</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)' }}>Audit valid through Q4 2027</div>
        </div>
      </div>

      {/* Compliance Grid */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Award size={18} color="var(--accent-primary)" /> Regulatory Attestations & Certifications
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {[
            { name: 'SOC 2 Type II Certified', issuer: 'PwC Global Assurance', date: 'Oct 2026', status: 'Compliant' },
            { name: 'ISO/IEC 27001:2022', issuer: 'BSI Management Systems', date: 'Aug 2026', status: 'Compliant' },
            { name: 'GDPR / HIPAA Data Privacy', issuer: 'Privacy Trust Alliance', date: 'Jul 2026', status: 'Compliant' },
            { name: 'PCI-DSS Level 1 Service Provider', issuer: 'Coalfire Systems', date: 'Sep 2026', status: 'Compliant' }
          ].map((cert) => (
            <div
              key={cert.name}
              style={{
                padding: '1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{cert.name}</span>
                <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                  <CheckCircle size={12} /> {cert.status}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Audited by {cert.issuer}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Verified: {cert.date}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Reports Available for Download */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 1rem 0' }}>Available Quarterly Dossiers</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {[
            { title: 'Q3 2026 Global Ingestion & Financial Ledger', size: '2.4 MB', date: 'Oct 15, 2026' },
            { title: 'Edge Cluster Latency & SLA Performance Report', size: '1.8 MB', date: 'Oct 01, 2026' },
            { title: 'Security Incident & Pen-Test Executive Summary', size: '3.1 MB', date: 'Sep 20, 2026' }
          ].map((rep) => (
            <div
              key={rep.title}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1rem',
                backgroundColor: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FileText size={20} color="var(--accent-primary)" />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{rep.title}</div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                    Generated {rep.date} • {rep.size}
                  </div>
                </div>
              </div>
              <button
                onClick={() => dispatch(setExportModalOpen(true))}
                className="btn btn-outline btn-sm"
              >
                <Download size={13} /> Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
