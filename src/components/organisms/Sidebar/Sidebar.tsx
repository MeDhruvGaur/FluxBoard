import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  LineChart,
  Users,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Activity,
  Zap
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { toggleSidebar } from '../../../features/ui/slices/uiSlice';
import { useI18n } from '../../../hooks/useI18n';

export const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.sidebarOpen);
  const user = useAppSelector((state) => state.auth.user);
  const { t } = useI18n();

  const navItems = [
    { to: '/', label: t('dashboard'), icon: LayoutDashboard },
    { to: '/analytics', label: t('analytics'), icon: LineChart },
    { to: '/users', label: t('users'), icon: Users, roles: ['Admin', 'Manager'] },
    { to: '/reports', label: t('reports'), icon: FileText },
    { to: '/settings', label: t('settings'), icon: Settings }
  ];

  return (
    <aside
      style={{
        width: isOpen ? '260px' : '76px',
        minWidth: isOpen ? '260px' : '76px',
        height: '100vh',
        backgroundColor: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'width var(--transition-normal), min-width var(--transition-normal)',
        position: 'sticky',
        top: 0,
        zIndex: 40
      }}
    >
      {/* Top Header / Brand */}
      <div>
        <div
          style={{
            height: '70px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isOpen ? 'space-between' : 'center',
            padding: isOpen ? '0 1.25rem' : '0',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          {isOpen ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)'
                }}
              >
                <Zap size={20} color="#ffffff" />
              </div>
              <div>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                  Flux<span style={{ color: 'var(--accent-cyan)' }}>Board</span>
                </span>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  ENTERPRISE v2.4
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Zap size={20} color="#ffffff" />
            </div>
          )}

          {isOpen && (
            <button
              onClick={() => dispatch(toggleSidebar())}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Collapse Sidebar"
            >
              <ChevronLeft size={18} />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav style={{ padding: '1.25rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            // Role Guard check for link display
            if (item.roles && user && !item.roles.includes(user.role)) {
              return null;
            }

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: isOpen ? '0.75rem 1rem' : '0.75rem 0',
                  justifyContent: isOpen ? 'flex-start' : 'center',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                  border: isActive ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
                  position: 'relative',
                  transition: 'all var(--transition-fast)'
                })}
              >
                <Icon size={19} />
                {isOpen && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom status / Collapse action */}
      <div style={{ padding: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
        {!isOpen && (
          <button
            onClick={() => dispatch(toggleSidebar())}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.5rem 0'
            }}
            title="Expand Sidebar"
          >
            <ChevronRight size={18} />
          </button>
        )}

        {isOpen && (
          <div
            className="glass-panel"
            style={{
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 600 }}>
                <Activity size={14} color="var(--accent-emerald)" />
                <span>Cluster Pulse</span>
              </div>
              <span className="live-pulse" />
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Connected to 4 Edge Nodes
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
