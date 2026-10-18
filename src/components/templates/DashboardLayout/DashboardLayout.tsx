import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../organisms/Sidebar';
import Header from '../../organisms/Header';
import ExportModal from '../../organisms/ExportModal/ExportModal';

export const DashboardLayout: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        backgroundColor: 'var(--bg-primary)'
      }}
    >
      <Sidebar />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minWidth: 0,
          overflowX: 'hidden'
        }}
      >
        <Header />
        <main
          id="dashboard-content-area"
          style={{
            flex: 1,
            padding: '1.75rem',
            maxWidth: '1600px',
            width: '100%',
            margin: '0 auto',
            boxSizing: 'border-box'
          }}
        >
          <Outlet />
        </main>
        <ExportModal />
      </div>
    </div>
  );
};

export default DashboardLayout;
