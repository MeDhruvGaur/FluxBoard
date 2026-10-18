import React, { useRef, useEffect } from 'react';
import { Bell, Check, Trash2, Info, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAll
} from '../../../features/notifications/slices/notificationSlice';
import { formatTimestamp } from '../../../utils/formatters';

export interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const { notifications, unreadCount } = useAppSelector((state) => state.notifications);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={16} color="var(--accent-emerald)" />;
      case 'warning':
        return <AlertTriangle size={16} color="var(--accent-amber)" />;
      case 'error':
        return <AlertCircle size={16} color="var(--accent-rose)" />;
      default:
        return <Info size={16} color="var(--accent-cyan)" />;
    }
  };

  return (
    <div
      ref={panelRef}
      className="glass-panel animate-fade-in"
      style={{
        position: 'absolute',
        top: 'calc(100% + 12px)',
        right: 0,
        width: '380px',
        maxHeight: '480px',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
        boxShadow: 'var(--shadow-xl)',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '0.85rem 1rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-elevated)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bell size={16} color="var(--accent-primary)" />
          <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>Notifications</span>
          {unreadCount > 0 && (
            <span className="badge badge-danger" style={{ padding: '0.1rem 0.4rem', fontSize: '0.7rem' }}>
              {unreadCount} new
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {unreadCount > 0 && (
            <button
              onClick={() => dispatch(markAllAsRead())}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent-cyan)',
                cursor: 'pointer',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem'
              }}
              title="Mark all as read"
            >
              <Check size={13} /> Read all
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={() => dispatch(clearAll())}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem'
              }}
              title="Clear all"
            >
              <Trash2 size={13} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div style={{ overflowY: 'auto', flex: 1, padding: '0.5rem' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No notifications available
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => dispatch(markAsRead(item.id))}
              style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: item.read ? 'transparent' : 'rgba(99, 102, 241, 0.08)',
                border: item.read ? '1px solid transparent' : '1px solid rgba(99, 102, 241, 0.2)',
                marginBottom: '0.4rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                display: 'flex',
                gap: '0.75rem'
              }}
            >
              <div style={{ paddingTop: '2px' }}>{getIcon(item.type)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                  <span style={{ fontSize: '0.825rem', fontWeight: item.read ? 500 : 700, color: 'var(--text-primary)' }}>
                    {item.title}
                  </span>
                  <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)' }}>
                    {formatTimestamp(item.timestamp)}
                  </span>
                </div>
                <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                  {item.message}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(removeNotification(item.id));
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '2px',
                  alignSelf: 'flex-start'
                }}
                title="Dismiss"
              >
                &times;
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
