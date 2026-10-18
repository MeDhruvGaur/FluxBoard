import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { MetricChange } from '../../../types/dashboard.types';

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: MetricChange;
  icon: React.ReactNode;
  accentColor?: 'indigo' | 'cyan' | 'emerald' | 'amber' | 'rose';
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  accentColor = 'indigo',
  subtitle
}) => {
  const colorMap = {
    indigo: {
      glow: 'rgba(99, 102, 241, 0.15)',
      border: 'rgba(99, 102, 241, 0.3)',
      text: '#818cf8'
    },
    cyan: {
      glow: 'rgba(6, 182, 212, 0.15)',
      border: 'rgba(6, 182, 212, 0.3)',
      text: '#22d3ee'
    },
    emerald: {
      glow: 'rgba(16, 185, 129, 0.15)',
      border: 'rgba(16, 185, 129, 0.3)',
      text: '#34d399'
    },
    amber: {
      glow: 'rgba(245, 158, 11, 0.15)',
      border: 'rgba(245, 158, 11, 0.3)',
      text: '#fbbf24'
    },
    rose: {
      glow: 'rgba(244, 63, 94, 0.15)',
      border: 'rgba(244, 63, 94, 0.3)',
      text: '#fb7185'
    }
  };

  const scheme = colorMap[accentColor];

  return (
    <div
      className="glass-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '0.85rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          {title}
        </span>
        <div
          style={{
            padding: '0.45rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: scheme.glow,
            color: scheme.text,
            border: `1px solid ${scheme.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {icon}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
        <h3
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            margin: 0
          }}
        >
          {value}
        </h3>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
        {change && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.2rem',
              fontWeight: 600,
              color: change.isPositive ? 'var(--accent-emerald)' : 'var(--accent-rose)'
            }}
          >
            {change.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            <span>{Math.abs(change.percentage)}%</span>
            <span style={{ color: 'var(--text-muted)', fontWeight: 400, marginLeft: '0.25rem' }}>vs last period</span>
          </div>
        )}
        {subtitle && <span style={{ color: 'var(--text-muted)' }}>{subtitle}</span>}
      </div>
    </div>
  );
};

export default StatCard;
