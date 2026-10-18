import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Shield } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { loginUser } from '../../features/auth/slices/authSlice';
import { UserRole } from '../../types/auth.types';
import Button from '../../components/atoms/Button';
import Input from '../../components/atoms/Input';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('alex.morgan@fluxboard.io');
  const [password, setPassword] = useState('enterprisePass123');
  const [role, setRole] = useState<UserRole>('Admin');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(loginUser({ email, password, role })).unwrap();
      navigate('/');
    } catch {
      // handled in slice
    }
  };

  const handleQuickRole = (r: UserRole, mail: string) => {
    setRole(r);
    setEmail(mail);
  };

  return (
    <div
      className="glass-panel"
      style={{
        padding: '2.25rem',
        backgroundColor: 'var(--bg-card)',
        boxShadow: 'var(--shadow-xl)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}
    >
      <div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>Enterprise Sign In</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
          Authenticate to your high-frequency telemetry dashboard
        </p>
      </div>

      {error && (
        <div
          style={{
            padding: '0.75rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid var(--accent-rose)',
            color: 'var(--accent-rose)',
            fontSize: '0.8rem'
          }}
        >
          {error}
        </div>
      )}

      {/* Quick Demo Role Selectors */}
      <div>
        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>
          1-Click Preset Roles:
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
          {[
            { r: 'Admin' as UserRole, mail: 'alex.morgan@fluxboard.io', color: 'var(--accent-primary)' },
            { r: 'Analyst' as UserRole, mail: 'elena.rostova@fluxboard.io', color: 'var(--accent-cyan)' },
            { r: 'Manager' as UserRole, mail: 'marcus.chen@fluxboard.io', color: 'var(--accent-emerald)' }
          ].map((item) => (
            <button
              key={item.r}
              type="button"
              onClick={() => handleQuickRole(item.r, item.mail)}
              style={{
                padding: '0.5rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: role === item.r ? 'var(--bg-elevated)' : 'transparent',
                border: `1px solid ${role === item.r ? item.color : 'var(--border-subtle)'}`,
                color: role === item.r ? '#ffffff' : 'var(--text-secondary)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.2rem',
                transition: 'all var(--transition-fast)'
              }}
            >
              <Shield size={14} color={item.color} />
              <span>{item.r}</span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Input
          label="Corporate Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          icon={<Mail size={16} />}
        />

        <Input
          label="Password / Token"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          icon={<Lock size={16} />}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          icon={<ArrowRight size={16} />}
          iconPosition="right"
          style={{ width: '100%', marginTop: '0.5rem' }}
        >
          Sign In to Dashboard
        </Button>
      </form>

      <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        FluxBoard Enterprise Cloud • Zero Trust Guard Enabled
      </div>
    </div>
  );
};

export default LoginPage;
