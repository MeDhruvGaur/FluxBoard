import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Shield, LogOut, Check } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { setUserRole, logoutUser } from '../../../features/auth/slices/authSlice';
import { UserRole } from '../../../types/auth.types';

export const UserMenu: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const roles: UserRole[] = ['Admin', 'Analyst', 'Manager'];

  return (
    <div ref={menuRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-full)',
          padding: '0.3rem 0.75rem 0.3rem 0.35rem',
          cursor: 'pointer',
          color: 'var(--text-primary)',
          transition: 'all var(--transition-fast)'
        }}
      >
        <img
          src={user.avatar}
          alt={user.name}
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid var(--accent-primary)'
          }}
        />
        <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{user.name}</div>
          <div style={{ fontSize: '0.675rem', color: 'var(--accent-cyan)' }}>{user.role}</div>
        </div>
        <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
      </button>

      {isOpen && (
        <div
          className="glass-panel animate-fade-in"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '240px',
            padding: '0.75rem',
            zIndex: 100,
            boxShadow: 'var(--shadow-xl)'
          }}
        >
          <div style={{ paddingBottom: '0.65rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.5rem' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Signed in as</p>
            <p style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user.email}</p>
            <span className="badge badge-info" style={{ marginTop: '4px' }}>
              {user.department}
            </span>
          </div>

          <div style={{ marginBottom: '0.5rem' }}>
            <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, padding: '0.2rem 0.4rem' }}>
              Switch Role
            </p>
            {roles.map((r) => (
              <button
                key={r}
                onClick={() => {
                  dispatch(setUserRole(r));
                  setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.4rem 0.6rem',
                  fontSize: '0.8rem',
                  color: user.role === r ? 'var(--accent-cyan)' : 'var(--text-primary)',
                  backgroundColor: user.role === r ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Shield size={13} /> {r}
                </span>
                {user.role === r && <Check size={14} />}
              </button>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.4rem' }}>
            <button
              onClick={() => dispatch(logoutUser())}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.45rem 0.6rem',
                fontSize: '0.8rem',
                color: 'var(--accent-rose)',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer'
              }}
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
