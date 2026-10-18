import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Edit3 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { updateChartData } from '../../features/dashboard/slices/dashboardSlice';
import { addNotification } from '../../features/notifications/slices/notificationSlice';
import { formatCurrency, formatTimestamp } from '../../utils/formatters';
import { ChartData } from '../../types/dashboard.types';

export const Analytics: React.FC = () => {
  const dispatch = useAppDispatch();
  const chartData = useAppSelector((state) => state.dashboard.chartData);
  const [selectedPoint, setSelectedPoint] = useState<ChartData | null>(null);
  const [editRevenue, setEditRevenue] = useState<number>(0);
  const [editUsers, setEditUsers] = useState<number>(0);
  const [simulatedError, setSimulatedError] = useState(false);
  const [updating, setUpdating] = useState(false);

  const handleEditClick = (point: ChartData) => {
    setSelectedPoint(point);
    setEditRevenue(point.revenue);
    setEditUsers(point.activeUsers);
  };

  const handleSaveOptimisticUpdate = async () => {
    if (!selectedPoint) return;
    setUpdating(true);

    const updated: ChartData = {
      ...selectedPoint,
      revenue: Number(editRevenue),
      activeUsers: Number(editUsers)
    };

    try {
      if (simulatedError) {
        // Trigger simulated failure to showcase optimistic update rollback!
        dispatch(
          addNotification({
            title: 'Simulating Network Failure',
            message: 'Testing optimistic rollback when API server throws 500.',
            type: 'warning'
          })
        );
        // Force an error
        throw new Error('Simulated network latency timeout (500)');
      }

      await dispatch(updateChartData(updated)).unwrap();

      dispatch(
        addNotification({
          title: 'Optimistic Update Applied',
          message: `Record ${selectedPoint.id} updated to ${formatCurrency(updated.revenue)} successfully.`,
          type: 'success'
        })
      );
      setSelectedPoint(null);
    } catch (err: any) {
      dispatch(
        addNotification({
          title: 'Optimistic Update Reverted',
          message: `${err.message || 'Server rejected changes'}. State rolled back to original values!`,
          type: 'error'
        })
      );
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <h2 style={{ fontSize: '1.65rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
          Advanced Data Visualization & Telemetry
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.35rem 0 0 0' }}>
          Deep multi-dimensional analysis with latency correlation and optimistic state updates
        </p>
      </div>

      {/* Optimistic Update Interactive Showcase Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(6, 182, 212, 0.15))',
          borderColor: 'rgba(99, 102, 241, 0.3)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              padding: '0.6rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--accent-primary)',
              color: '#ffffff'
            }}
          >
            <Edit3 size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
              Live Optimistic Mutation Engine
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
              Select any data point below to edit. Experience immediate optimistic UI sync with automatic rollback on network failure.
            </p>
          </div>
        </div>

        {chartData.length > 0 && !selectedPoint && (
          <button
            onClick={() => handleEditClick(chartData[chartData.length - 1])}
            className="btn btn-primary btn-sm"
          >
            Edit Latest Data Point ({chartData[chartData.length - 1]?.id})
          </button>
        )}
      </div>

      {/* Point Editor Modal / Banner if open */}
      {selectedPoint && (
        <div
          className="glass-panel animate-fade-in"
          style={{
            padding: '1.25rem 1.5rem',
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--accent-primary)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
              Editing Point: {selectedPoint.id} ({formatTimestamp(selectedPoint.timestamp)})
            </h4>
            <button
              onClick={() => setSelectedPoint(null)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Revenue ($)
              </label>
              <input
                type="number"
                className="form-input"
                value={editRevenue}
                onChange={(e) => setEditRevenue(Number(e.target.value))}
                style={{ marginTop: '4px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Active Users
              </label>
              <input
                type="number"
                className="form-input"
                value={editUsers}
                onChange={(e) => setEditUsers(Number(e.target.value))}
                style={{ marginTop: '4px' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '1.5rem' }}>
              <input
                type="checkbox"
                id="simFail"
                checked={simulatedError}
                onChange={(e) => setSimulatedError(e.target.checked)}
                style={{ accentColor: 'var(--accent-rose)' }}
              />
              <label htmlFor="simFail" style={{ fontSize: '0.8rem', color: 'var(--accent-rose)', fontWeight: 600 }}>
                Simulate 500 error (test rollback)
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '1rem' }}>
            <button onClick={() => setSelectedPoint(null)} className="btn btn-secondary btn-sm">
              Cancel
            </button>
            <button onClick={handleSaveOptimisticUpdate} className="btn btn-primary btn-sm" disabled={updating}>
              {updating ? 'Saving...' : 'Commit Optimistic Update'}
            </button>
          </div>
        </div>
      )}

      {/* Dual Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        {/* Latency vs Order Volume Correlation */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>
            Orders vs Gateway Latency Correlation
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0' }}>
            Monitoring system resilience under varying traffic loads
          </p>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
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
                <YAxis yAxisId="left" stroke="#10b981" fontSize={11} />
                <YAxis yAxisId="right" orientation="right" stroke="#f43f5e" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '12px'
                  }}
                  labelFormatter={(lbl) => formatTimestamp(lbl as string)}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="orders"
                  name="Orders Processed"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="latencyMs"
                  name="Edge Latency (ms)"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Conversion Rate Distribution BarChart */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>
            Hourly Conversion Velocity (%)
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0' }}>
            Target threshold 3.2% maintained across all availability zones
          </p>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.slice(-14)}>
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
                <YAxis stroke="var(--text-muted)" fontSize={11} domain={[0, 5]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '12px'
                  }}
                  formatter={(val) => [`${val}%`, 'Conversion Rate']}
                  labelFormatter={(lbl) => formatTimestamp(lbl as string)}
                />
                <Bar dataKey="conversionRate" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Point selector table for interactive testing */}
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.75rem 0' }}>
          Real-time Timeline Snapshots (Click "Edit" on any point)
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-medium)', color: 'var(--text-muted)', textAlign: 'left' }}>
                <th style={{ padding: '0.5rem' }}>Point ID</th>
                <th style={{ padding: '0.5rem' }}>Timestamp</th>
                <th style={{ padding: '0.5rem' }}>Revenue</th>
                <th style={{ padding: '0.5rem' }}>Active Users</th>
                <th style={{ padding: '0.5rem' }}>Conversion</th>
                <th style={{ padding: '0.5rem' }}>Latency</th>
                <th style={{ padding: '0.5rem', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {chartData.slice(-8).map((point) => (
                <tr
                  key={point.id}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    backgroundColor: selectedPoint?.id === point.id ? 'rgba(99, 102, 241, 0.1)' : 'transparent'
                  }}
                >
                  <td style={{ padding: '0.55rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                    {point.id}
                  </td>
                  <td style={{ padding: '0.55rem', color: 'var(--text-secondary)' }}>
                    {formatTimestamp(point.timestamp)}
                  </td>
                  <td style={{ padding: '0.55rem', fontWeight: 600 }}>{formatCurrency(point.revenue)}</td>
                  <td style={{ padding: '0.55rem' }}>{point.activeUsers.toLocaleString()}</td>
                  <td style={{ padding: '0.55rem', color: 'var(--accent-emerald)' }}>{point.conversionRate}%</td>
                  <td style={{ padding: '0.55rem' }}>{point.latencyMs}ms</td>
                  <td style={{ padding: '0.55rem', textAlign: 'right' }}>
                    <button
                      onClick={() => handleEditClick(point)}
                      className="btn btn-outline btn-sm"
                      style={{ padding: '0.2rem 0.5rem', fontSize: '0.725rem' }}
                    >
                      <Edit3 size={12} /> Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
