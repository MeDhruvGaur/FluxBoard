import { describe, it, expect } from 'vitest';
import dashboardReducer, {
  setRealTimeData,
  toggleStreaming,
  setDateRange,
  optimisticUpdate,
  revertUpdate
} from './dashboardSlice';
import { ChartData } from '../../../types/dashboard.types';

describe('dashboardSlice', () => {
  const initial = dashboardReducer(undefined, { type: '@@INIT' });

  it('should initialize with default state', () => {
    expect(initial.streamingEnabled).toBe(true);
    expect(initial.selectedDateRange).toBe('24h');
    expect(initial.chartData).toEqual([]);
  });

  it('should toggle streaming', () => {
    const nextState = dashboardReducer(initial, toggleStreaming());
    expect(nextState.streamingEnabled).toBe(false);
  });

  it('should change date range', () => {
    const nextState = dashboardReducer(initial, setDateRange('30d'));
    expect(nextState.selectedDateRange).toBe('30d');
  });

  it('should append real-time chart data points', () => {
    const point: ChartData = {
      id: 'tick-test-1',
      timestamp: new Date().toISOString(),
      revenue: 52000,
      targetRevenue: 48000,
      activeUsers: 15200,
      orders: 380,
      conversionRate: 3.6,
      latencyMs: 22
    };

    const nextState = dashboardReducer(initial, setRealTimeData(point));
    expect(nextState.chartData.length).toBe(1);
    expect(nextState.chartData[0].revenue).toBe(52000);
  });

  it('should handle optimistic updates and rollback revert', () => {
    const point: ChartData = {
      id: 'point-100',
      timestamp: '2026-10-18T12:00:00Z',
      revenue: 50000,
      targetRevenue: 48000,
      activeUsers: 14000,
      orders: 300,
      conversionRate: 3.5,
      latencyMs: 20
    };

    const stateWithData = {
      ...initial,
      chartData: [point]
    };

    const updatedPoint: ChartData = {
      ...point,
      revenue: 75000
    };

    // Optimistic update
    const optimisticState = dashboardReducer(stateWithData, optimisticUpdate(updatedPoint));
    expect(optimisticState.chartData[0].revenue).toBe(75000);

    // Revert update on failure
    const revertedState = dashboardReducer(optimisticState, revertUpdate('point-100'));
    expect(revertedState.chartData[0].revenue).toBe(50000);
  });
});
