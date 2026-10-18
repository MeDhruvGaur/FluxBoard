export interface MetricChange {
  value: number;
  percentage: number;
  isPositive: boolean;
}

export interface DashboardStats {
  totalRevenue: number;
  activeUsers: number;
  conversionRate: number;
  avgOrderValue: number;
  systemHealth: number;
  totalTransactions: number;
  revenueChange: MetricChange;
  usersChange: MetricChange;
  conversionChange: MetricChange;
  aovChange: MetricChange;
}

export interface ChartData {
  id: string;
  timestamp: string;
  revenue: number;
  targetRevenue: number;
  activeUsers: number;
  orders: number;
  conversionRate: number;
  latencyMs: number;
}

export interface RegionalPerformance {
  id: string;
  region: string;
  revenue: number;
  sharePercentage: number;
  growth: number;
  status: 'optimal' | 'stable' | 'attention';
}

export interface ServerHealthMetric {
  server: string;
  cpu: number;
  memory: number;
  status: 'healthy' | 'warning' | 'critical';
  uptime: string;
}

export interface TransactionRecord {
  id: string;
  customer: string;
  email: string;
  amount: number;
  status: 'completed' | 'processing' | 'failed' | 'refunded';
  plan: 'Enterprise' | 'Pro' | 'Starter';
  date: string;
  region: string;
}

export interface WebSocketMessage<T = unknown> {
  type: 'STATS_UPDATE' | 'CHART_TICK' | 'NEW_NOTIFICATION' | 'NEW_TRANSACTION' | 'SYSTEM_ALERT';
  data: T;
  timestamp: string;
}
