import React, { useEffect, useMemo } from 'react';
import {
  DollarSign,
  Users,
  Activity,
  Server,
  TrendingUp,
  Clock,
  Sparkles,
  PlusCircle,
  RefreshCw
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchDashboardData,
  setDateRange,
  addTransaction
} from '../../features/dashboard/slices/dashboardSlice';
import { setActiveFilter } from '../../features/ui/slices/uiSlice';
import { addNotification } from '../../features/notifications/slices/notificationSlice';
import { formatCurrency, formatTimestamp } from '../../utils/formatters';
import { useI18n } from '../../hooks/useI18n';
import StatCard from '../../components/molecules/StatCard';
import DataTable, { Column } from '../../components/organisms/DataTable/DataTable';
import { TransactionRecord } from '../../types/dashboard.types';

export const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    stats,
    chartData,
    regions,
    servers,
    transactions,
    loading,
    lastUpdated,
    selectedDateRange
  } = useAppSelector((state) => state.dashboard);
  const { searchQuery, activeFilter } = useAppSelector((state) => state.ui);
  const { t } = useI18n();

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  // Filtered transactions based on search query and status tab
  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        txn.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter = activeFilter === 'all' || txn.status === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [transactions, searchQuery, activeFilter]);

  // Handlers
  const handleSimulateSale = () => {
    const plans: ('Enterprise' | 'Pro' | 'Starter')[] = ['Enterprise', 'Pro', 'Starter'];
    const chosenPlan = plans[Math.floor(Math.random() * plans.length)];
    const amounts = { Enterprise: 16500, Pro: 5400, Starter: 1200 };
    const clients = [
      'GitLab DevOps',
      'Atlassian Cloud',
      'Snowflake Inc',
      'Cloudflare CDN',
      'MongoDB Atlas',
      'Shopify Plus'
    ];
    const client = clients[Math.floor(Math.random() * clients.length)];

    dispatch(
      addTransaction({
        customer: client,
        email: `ops@${client.toLowerCase().replace(/\s+/g, '')}.com`,
        amount: amounts[chosenPlan],
        status: 'completed',
        plan: chosenPlan,
        region: 'Global Edge Tier'
      })
    );

    dispatch(
      addNotification({
        title: 'New Transaction Ingested',
        message: `${client} upgraded to ${chosenPlan} plan (${formatCurrency(amounts[chosenPlan])}).`,
        type: 'success'
      })
    );
  };

  const tableColumns: Column<TransactionRecord>[] = [
    {
      key: 'id',
      header: 'Txn ID',
      width: '120px',
      render: (val) => (
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--accent-primary)' }}>
          {val}
        </span>
      )
    },
    {
      key: 'customer',
      header: 'Customer / Entity',
      width: '240px',
      render: (_, row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{row.customer}</div>
          <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{row.email}</div>
        </div>
      )
    },
    {
      key: 'plan',
      header: 'Plan Tier',
      width: '130px',
      render: (plan) => (
        <span
          className={`badge ${
            plan === 'Enterprise' ? 'badge-info' : plan === 'Pro' ? 'badge-success' : 'badge-warning'
          }`}
        >
          {plan}
        </span>
      )
    },
    {
      key: 'amount',
      header: 'Amount',
      width: '140px',
      render: (amount) => (
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)' }}>
          {formatCurrency(amount)}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      width: '130px',
      render: (status) => {
        const cls =
          status === 'completed'
            ? 'badge-success'
            : status === 'processing'
            ? 'badge-info'
            : status === 'refunded'
            ? 'badge-warning'
            : 'badge-danger';
        return <span className={`badge ${cls}`}>{status}</span>;
      }
    },
    {
      key: 'date',
      header: 'Timestamp',
      width: '160px',
      render: (val) => <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{val}</span>
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Banner & Quick Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
            Enterprise Operations Dashboard
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '0.35rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <span className="live-pulse" />
            <span>Telemetry Pipeline Live</span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Clock size={13} /> Last synced: {lastUpdated ? formatTimestamp(lastUpdated) : 'Just now'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Time range picker */}
          <div
            style={{
              display: 'flex',
              backgroundColor: 'var(--bg-elevated)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-medium)',
              padding: '2px'
            }}
          >
            {(['24h', '7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => dispatch(setDateRange(range))}
                style={{
                  background: selectedDateRange === range ? 'var(--accent-primary)' : 'transparent',
                  color: selectedDateRange === range ? '#ffffff' : 'var(--text-secondary)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {range}
              </button>
            ))}
          </div>

          <button
            onClick={handleSimulateSale}
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <PlusCircle size={15} />
            <span>Simulate Transaction</span>
          </button>

          <button
            onClick={() => dispatch(fetchDashboardData())}
            className="btn btn-secondary"
            title="Refresh Dashboard Data"
          >
            <RefreshCw size={15} className={loading ? 'spin' : ''} />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem'
        }}
      >
        <StatCard
          title={t('totalRevenue')}
          value={formatCurrency(stats?.totalRevenue ?? 1983000)}
          change={stats?.revenueChange}
          icon={<DollarSign size={20} />}
          accentColor="indigo"
          subtitle="ARR run rate $23.8M"
        />
        <StatCard
          title={t('activeUsers')}
          value={(stats?.activeUsers ?? 14820).toLocaleString()}
          change={stats?.usersChange}
          icon={<Users size={20} />}
          accentColor="cyan"
          subtitle="Across 34 countries"
        />
        <StatCard
          title={t('conversionRate')}
          value={`${stats?.conversionRate ?? 3.48}%`}
          change={stats?.conversionChange}
          icon={<TrendingUp size={20} />}
          accentColor="emerald"
          subtitle="Funnel step 4 completion"
        />
        <StatCard
          title={t('systemHealth')}
          value={`${stats?.systemHealth ?? 99.98}%`}
          change={{ value: 0.02, percentage: 0.1, isPositive: true }}
          icon={<Server size={20} />}
          accentColor="amber"
          subtitle="All 4 clusters nominal"
        />
      </div>

      {/* Main Charts & Telemetry Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
        {/* Main Chart */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Revenue Velocity & Target Comparison</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                Real-time streaming ingestion with rolling 24-period baseline
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#6366f1' }} />
                <span>Actual Revenue</span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#06b6d4' }} />
                <span>Target Baseline</span>
              </span>
            </div>
          </div>

          <div style={{ height: '320px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis
                  dataKey="timestamp"
                  stroke="var(--text-muted)"
                  fontSize={11}
                  tickFormatter={(val) => {
                    const d = new Date(val);
                    return `${d.getHours()}:00`;
                  }}
                />
                <YAxis
                  stroke="var(--text-muted)"
                  fontSize={11}
                  tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '12px'
                  }}
                  formatter={(value: any, name: string) => [
                    formatCurrency(Number(value)),
                    name === 'revenue' ? 'Actual Revenue' : 'Target Baseline'
                  ]}
                  labelFormatter={(lbl) => formatTimestamp(lbl as string)}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#revenueGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="targetRevenue"
                  stroke="#06b6d4"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#targetGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Regional Distribution & Cluster Health */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Regional Performance */}
          <div className="glass-panel" style={{ padding: '1.25rem', flex: 1 }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0 0 0.85rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={15} color="var(--accent-cyan)" /> Regional Revenue Share
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {regions.map((reg) => (
                <div key={reg.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '3px' }}>
                    <span style={{ fontWeight: 600 }}>{reg.region}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                      {formatCurrency(reg.revenue)} ({reg.sharePercentage}%)
                    </span>
                  </div>
                  <div
                    style={{
                      height: '6px',
                      width: '100%',
                      backgroundColor: 'var(--bg-input)',
                      borderRadius: 'var(--radius-full)',
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${reg.sharePercentage}%`,
                        background:
                          reg.status === 'optimal'
                            ? 'linear-gradient(90deg, #6366f1, #06b6d4)'
                            : 'linear-gradient(90deg, #f59e0b, #ef4444)',
                        borderRadius: 'var(--radius-full)'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Infrastructure Health */}
          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Activity size={15} color="var(--accent-emerald)" /> Cluster Health
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {servers.map((s) => (
                <div
                  key={s.server}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.45rem 0.6rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span
                      style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        backgroundColor: s.status === 'healthy' ? 'var(--accent-emerald)' : 'var(--accent-amber)'
                      }}
                    />
                    <span style={{ fontWeight: 500 }}>{s.server}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    <span>CPU: {s.cpu}%</span>
                    <span>MEM: {s.memory}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Section with Smart Filter Toolbar and DataTable */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Recent Enterprise Settlements</h3>
            <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
              Virtualized transactional audit ledger with real-time optimistic sync
            </p>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {['all', 'completed', 'processing', 'refunded'].map((status) => (
              <button
                key={status}
                onClick={() => dispatch(setActiveFilter(status))}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: activeFilter === status ? 'var(--accent-primary)' : 'var(--border-medium)',
                  backgroundColor: activeFilter === status ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                  color: activeFilter === status ? '#ffffff' : 'var(--text-secondary)',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Smart Virtualized DataTable */}
        <DataTable<TransactionRecord>
          data={filteredTransactions}
          columns={tableColumns}
          loading={loading}
          containerHeight={380}
          rowHeight={54}
          virtualize={true}
          pagination={{ pageSize: 10, showSizeChanger: true }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
