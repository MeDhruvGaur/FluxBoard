import React from 'react';
import { Database, Moon, Sun, Globe, Volume2, VolumeX, RefreshCcw } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  setTheme,
  setLanguage,
  toggleSound,
  SupportedLanguage
} from '../../features/ui/slices/uiSlice';
import { addNotification } from '../../features/notifications/slices/notificationSlice';
import { persistor } from '../../app/store';

export const SettingsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { theme, language, soundEnabled } = useAppSelector((state) => state.ui);

  const handleClearCache = async () => {
    try {
      await persistor.purge();
      dispatch(
        addNotification({
          title: 'Cache Purged',
          message: 'Local persist store flushed. Defaults reloaded.',
          type: 'success'
        })
      );
    } catch {
      // ignore
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '900px' }}>
      <div>
        <h2 style={{ fontSize: '1.65rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
          System & Workspace Preferences
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.35rem 0 0 0' }}>
          Configure enterprise telemetry parameters, visual styling, and client state storage
        </p>
      </div>

      {/* Visual & Theme */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sun size={18} color="var(--accent-amber)" /> Interface Appearance
        </h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => dispatch(setTheme('dark'))}
            style={{
              flex: 1,
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: theme === 'dark' ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-elevated)',
              border: `2px solid ${theme === 'dark' ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              color: 'var(--text-primary)'
            }}
          >
            <Moon size={22} color="#818cf8" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 600 }}>Obsidian Dark (Default)</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Deep slate glassmorphism with high contrast neon</div>
            </div>
          </button>

          <button
            onClick={() => dispatch(setTheme('light'))}
            style={{
              flex: 1,
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: theme === 'light' ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-elevated)',
              border: `2px solid ${theme === 'light' ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              color: 'var(--text-primary)'
            }}
          >
            <Sun size={22} color="#f59e0b" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 600 }}>Solar Clean Light</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>High-clarity daylight theme for bright rooms</div>
            </div>
          </button>
        </div>
      </div>

      {/* Language & Accessibility */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Globe size={18} color="var(--accent-cyan)" /> Localization (i18n)
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
          {[
            { code: 'en', name: 'English (US)' },
            { code: 'es', name: 'Español (ES)' },
            { code: 'de', name: 'Deutsch (DE)' },
            { code: 'fr', name: 'Français (FR)' }
          ].map((item) => (
            <button
              key={item.code}
              onClick={() => dispatch(setLanguage(item.code as SupportedLanguage))}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: language === item.code ? 'rgba(6, 182, 212, 0.15)' : 'var(--bg-elevated)',
                border: `1px solid ${language === item.code ? 'var(--accent-cyan)' : 'var(--border-medium)'}`,
                color: language === item.code ? 'var(--accent-cyan)' : 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '0.825rem',
                cursor: 'pointer'
              }}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* State & Storage Management */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Database size={18} color="var(--accent-rose)" /> State Persistence & Redux Cache
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
          Redux persist actively syncs authentication tokens and interface configurations to encrypted browser storage.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => dispatch(toggleSound())}
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
              <span>{soundEnabled ? 'Audio Alerts: ON' : 'Audio Alerts: OFF'}</span>
            </button>
          </div>
          <button
            onClick={handleClearCache}
            className="btn btn-danger btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <RefreshCcw size={14} /> Purge Redux Persist Cache
          </button>
        </div>
      </div>

      {/* Runtime Environment Info */}
      <div className="glass-panel" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-elevated)' }}>
        <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', margin: '0 0 0.75rem 0' }}>
          Runtime Architecture Spec
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.775rem' }}>
          <div><strong style={{ color: 'var(--text-secondary)' }}>Framework:</strong> React 18.2 (Concurrent)</div>
          <div><strong style={{ color: 'var(--text-secondary)' }}>State Engine:</strong> Redux Toolkit 2.2 + Persist</div>
          <div><strong style={{ color: 'var(--text-secondary)' }}>Typing:</strong> TypeScript 5.4 Strict Mode</div>
          <div><strong style={{ color: 'var(--text-secondary)' }}>Bundler:</strong> Vite 5.2 (HMR enabled)</div>
          <div><strong style={{ color: 'var(--text-secondary)' }}>Charts:</strong> Recharts 2.12 + D3 Interpolation</div>
          <div><strong style={{ color: 'var(--text-secondary)' }}>Protocol:</strong> WebSocket wss:// + Heartbeat</div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
