import React, { forwardRef } from 'react';
import clsx from 'clsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, rightElement, className, ...props }, ref) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%' }}>
        {label && (
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            {label}
          </label>
        )}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
          {icon && (
            <span
              style={{
                position: 'absolute',
                left: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                color: 'var(--text-muted)',
                pointerEvents: 'none'
              }}
            >
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={clsx('form-input', className)}
            style={{
              paddingLeft: icon ? '2.3rem' : '0.85rem',
              paddingRight: rightElement ? '2.3rem' : '0.85rem',
              borderColor: error ? 'var(--accent-rose)' : undefined
            }}
            {...props}
          />
          {rightElement && (
            <span
              style={{
                position: 'absolute',
                right: '0.75rem',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {rightElement}
            </span>
          )}
        </div>
        {error && (
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-rose)', fontWeight: 500 }}>
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
