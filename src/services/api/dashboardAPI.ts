import { DashboardStats, ChartData, TransactionRecord } from '../../types/dashboard.types';

const generateSeedChartData = (): ChartData[] => {
  const points: ChartData[] = [];
  const now = Date.now();
  for (let i = 24; i >= 0; i--) {
    const time = new Date(now - i * 3600 * 1000);
    const baseRev = 45000 + Math.sin(i * 0.5) * 12000;
    points.push({
      id: `tick-${24 - i}`,
      timestamp: time.toISOString(),
      revenue: Math.round(baseRev + (Math.random() * 6000 - 3000)),
      targetRevenue: 48000,
      activeUsers: Math.round(1200 + Math.cos(i * 0.4) * 350 + Math.random() * 50),
      orders: Math.round(310 + Math.random() * 80),
      conversionRate: +(3.2 + Math.sin(i * 0.3) * 0.6 + (Math.random() * 0.2 - 0.1)).toFixed(2),
      latencyMs: Math.round(24 + Math.random() * 15)
    });
  }
  return points;
};

const INITIAL_TRANSACTIONS: TransactionRecord[] = [
  { id: 'TXN-9081', customer: 'Stripe Global Ops', email: 'billing@stripe.com', amount: 14200, status: 'completed', plan: 'Enterprise', date: '2026-10-18 18:45', region: 'North America' },
  { id: 'TXN-9082', customer: 'Vercel Edge Platform', email: 'finance@vercel.com', amount: 9800, status: 'completed', plan: 'Enterprise', date: '2026-10-18 18:32', region: 'North America' },
  { id: 'TXN-9083', customer: 'Supabase Cloud', email: 'accounts@supabase.io', amount: 6500, status: 'processing', plan: 'Pro', date: '2026-10-18 18:15', region: 'Europe' },
  { id: 'TXN-9084', customer: 'Datadog EMEA', email: 'payments@datadog.com', amount: 18400, status: 'completed', plan: 'Enterprise', date: '2026-10-18 17:50', region: 'Europe' },
  { id: 'TXN-9085', customer: 'Linear Labs', email: 'admin@linear.app', amount: 3200, status: 'completed', plan: 'Pro', date: '2026-10-18 17:34', region: 'North America' },
  { id: 'TXN-9086', customer: 'Figma Design Corp', email: 'procure@figma.com', amount: 24500, status: 'completed', plan: 'Enterprise', date: '2026-10-18 17:10', region: 'North America' },
  { id: 'TXN-9087', customer: 'HashiCorp Security', email: 'billing@hashicorp.com', amount: 12000, status: 'completed', plan: 'Enterprise', date: '2026-10-18 16:45', region: 'North America' },
  { id: 'TXN-9088', customer: 'Notion Productivity', email: 'accounting@makenotion.com', amount: 8900, status: 'completed', plan: 'Pro', date: '2026-10-18 16:20', region: 'North America' },
  { id: 'TXN-9089', customer: 'Render Cloud Host', email: 'ops@render.com', amount: 4100, status: 'refunded', plan: 'Starter', date: '2026-10-18 15:58', region: 'Europe' },
  { id: 'TXN-9090', customer: 'Prisma Data Hub', email: 'team@prisma.io', amount: 5600, status: 'completed', plan: 'Pro', date: '2026-10-18 15:30', region: 'Europe' },
  { id: 'TXN-9091', customer: 'Snowflake Analytics', email: 'procure@snowflake.com', amount: 34000, status: 'completed', plan: 'Enterprise', date: '2026-10-18 15:02', region: 'North America' },
  { id: 'TXN-9092', customer: 'Tokyo Fintech Inc', email: 'desk@tokyofintech.jp', amount: 16700, status: 'completed', plan: 'Enterprise', date: '2026-10-18 14:40', region: 'Asia-Pacific' },
  { id: 'TXN-9093', customer: 'Singapore PayGateway', email: 'finance@sgpay.sg', amount: 11200, status: 'processing', plan: 'Enterprise', date: '2026-10-18 14:12', region: 'Asia-Pacific' },
  { id: 'TXN-9094', customer: 'Berlin AI Systems', email: 'billing@berlinai.de', amount: 7800, status: 'completed', plan: 'Pro', date: '2026-10-18 13:50', region: 'Europe' },
  { id: 'TXN-9095', customer: 'Canva Visuals', email: 'subs@canva.com', amount: 21000, status: 'completed', plan: 'Enterprise', date: '2026-10-18 13:25', region: 'Asia-Pacific' }
];

export const DashboardAPI = {
  getDashboardData: async (_params?: { startDate?: string; endDate?: string }): Promise<{
    data: { stats: DashboardStats; chartData: ChartData[] };
  }> => {
    // Simulate network delay
    await new Promise((res) => setTimeout(res, 200));

    const stats: DashboardStats = {
      totalRevenue: 1983000,
      activeUsers: 14820,
      conversionRate: 3.48,
      avgOrderValue: 486,
      systemHealth: 99.98,
      totalTransactions: 4280,
      revenueChange: { value: 184500, percentage: 12.4, isPositive: true },
      usersChange: { value: 1240, percentage: 8.7, isPositive: true },
      conversionChange: { value: 0.32, percentage: 4.1, isPositive: true },
      aovChange: { value: 18, percentage: 3.8, isPositive: true }
    };

    return {
      data: {
        stats,
        chartData: generateSeedChartData()
      }
    };
  },

  getTransactions: async (): Promise<{ data: TransactionRecord[] }> => {
    await new Promise((res) => setTimeout(res, 150));
    return { data: INITIAL_TRANSACTIONS };
  },

  updateChartData: async (newData: ChartData): Promise<{ data: ChartData }> => {
    await new Promise((res) => setTimeout(res, 300));
    return { data: newData };
  }
};
