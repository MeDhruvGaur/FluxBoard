export const APP_CONFIG = {
  name: 'FluxBoard',
  version: '2.4.0',
  environment: 'production',
  defaultRefreshInterval: 3000,
  maxHistoricalTicks: 30
};

export const INITIAL_REGIONS = [
  { id: 'reg-1', region: 'North America (US-East)', revenue: 842500, sharePercentage: 42.5, growth: 14.8, status: 'optimal' as const },
  { id: 'reg-2', region: 'Europe (EU-Central)', revenue: 512300, sharePercentage: 25.8, growth: 8.4, status: 'optimal' as const },
  { id: 'reg-3', region: 'Asia-Pacific (Tokyo/SG)', revenue: 398200, sharePercentage: 20.1, growth: 22.3, status: 'optimal' as const },
  { id: 'reg-4', region: 'Latin America (Sao Paulo)', revenue: 154000, sharePercentage: 7.8, growth: -2.1, status: 'attention' as const },
  { id: 'reg-5', region: 'Middle East & Africa', revenue: 76000, sharePercentage: 3.8, growth: 5.6, status: 'stable' as const }
];

export const INITIAL_SERVERS = [
  { server: 'edge-cluster-01 (US-VA)', cpu: 38, memory: 52, status: 'healthy' as const, uptime: '99.99%' },
  { server: 'edge-cluster-02 (EU-FR)', cpu: 44, memory: 61, status: 'healthy' as const, uptime: '99.98%' },
  { server: 'api-core-gateway (SG)', cpu: 78, memory: 84, status: 'warning' as const, uptime: '99.95%' },
  { server: 'redis-cache-tier (Global)', cpu: 22, memory: 40, status: 'healthy' as const, uptime: '100%' }
];
