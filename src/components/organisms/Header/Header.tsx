import React, { useState } from 'react';
import {
  Bell,
  Sun,
  Moon,
  Download,
  Pause,
  Globe,
  Radio,
  Menu
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  toggleTheme,
  toggleSidebar,
  setLanguage,
  setSearchQuery,
  setExportModalOpen,
  SupportedLanguage
} from '../../../features/ui/slices/uiSlice';
import { toggleStreaming } from '../../../features/dashboard/slices/dashboardSlice';
import { useWebSocket } from '../../../hooks/useWebSocket';
import { useI18n } from '../../../hooks/useI18n';
import SearchBar from '../../molecules/SearchBar';
import UserMenu from '../../molecules/UserMenu';
import NotificationPanel from '../NotificationPanel/NotificationPanel';

export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.ui.theme);
  const unreadCount = useAppSelector((state) => state.notifications.unreadCount);
  const streamingEnabled = useAppSelector((state) => state.dashboard.streamingEnabled);
  const [notifOpen, setNotifOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const { status, latency } = useWebSocket();
  const { t, language } = useI18n();

  const languages: { code: SupportedLanguage; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'de', label: 'Deutsch' },
    { code: 'fr', label: 'Français' }
  ];

  return (
    <header
      style={{
        height: '70px',
        padding: '0 1.75rem',
        backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        backdropFilter: 'var(--backdrop-blur)'
      }}
    >
      {/* Left section: mobile hamburger & search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
        <button
          onClick={() => dispatch(toggleSidebar())}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: '4px'
          }}
          className="lg-hidden"
          title="Toggle Navigation"
        >
          <Menu size={20} />
        </button>

        <SearchBar
          placeholder={t('searchPlaceholder')}
          onSearch={(query) => dispatch(setSearchQuery(query))}
        />

        {/* WebSocket Real-time Status Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.75rem'
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor:
                status === 'connected'
                  ? 'var(--accent-emerald)'
                  : status === 'reconnecting'
                  ? 'var(--accent-amber)'
                  : 'var(--accent-rose)',
              boxShadow: status === 'connected' ? '0 0 8px var(--accent-emerald)' : 'none'
            }}
          />
          <span style={{ fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
            {status}
          </span>
          <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
            {latency}ms
          </span>
        </div>
      </div>

      {/* Right section: live controls, language, theme, export, notifications, profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Live Stream Ingestion Toggle */}
        <button
          onClick={() => dispatch(toggleStreaming())}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.4rem 0.8rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: streamingEnabled ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
            color: streamingEnabled ? 'var(--accent-emerald)' : 'var(--accent-rose)',
            border: `1px solid ${streamingEnabled ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
            transition: 'all var(--transition-fast)'
          }}
          title={streamingEnabled ? 'Pause real-time streaming' : 'Resume real-time streaming'}
        >
          {streamingEnabled ? <Radio size={13} className="live-pulse" /> : <Pause size={13} />}
          <span>{streamingEnabled ? 'STREAMING' : 'PAUSED'}</span>
        </button>

        {/* Export Data Button */}
        <button
          onClick={() => dispatch(setExportModalOpen(true))}
          className="btn btn-secondary btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          title="Export analytics reports"
        >
          <Download size={14} />
          <span>{t('export')}</span>
        </button>

        {/* Language Selector Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              padding: '0.45rem 0.65rem',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase'
            }}
            title="Change Language"
          >
            <Globe size={14} />
            <span>{language}</span>
          </button>

          {langMenuOpen && (
            <div
              className="glass-panel animate-fade-in"
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                right: 0,
                width: '130px',
                padding: '0.4rem',
                zIndex: 100
              }}
            >
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    dispatch(setLanguage(l.code));
                    setLangMenuOpen(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.35rem 0.6rem',
                    textAlign: 'left',
                    background: language === l.code ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                    color: language === l.code ? 'var(--accent-primary)' : 'var(--text-primary)',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  {l.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={() => dispatch(toggleTheme())}
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            padding: '0.45rem',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={16} color="#fbbf24" /> : <Moon size={16} color="#6366f1" />}
        </button>

        {/* Notifications Icon with Badge */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            style={{
              position: 'relative',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              padding: '0.45rem',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Notifications"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  width: '18px',
                  height: '18px',
                  backgroundColor: 'var(--accent-rose)',
                  color: '#ffffff',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid var(--bg-secondary)'
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          <NotificationPanel isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
        </div>

        {/* User Profile Menu */}
        <UserMenu />
      </div>
    </header>
  );
};

export default Header;
