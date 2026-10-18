import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { DashboardAPI } from '../../../services/api/dashboardAPI';
import { DashboardStats, ChartData, RegionalPerformance, ServerHealthMetric, TransactionRecord } from '../../../types/dashboard.types';
import { INITIAL_REGIONS, INITIAL_SERVERS } from '../../../utils/constants';

export interface DashboardState {
  stats: DashboardStats | null;
  chartData: ChartData[];
  backupChartData: Record<string, ChartData>;
  regions: RegionalPerformance[];
  servers: ServerHealthMetric[];
  transactions: TransactionRecord[];
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  streamingEnabled: boolean;
  selectedDateRange: '24h' | '7d' | '30d' | '90d';
}

const initialState: DashboardState = {
  stats: null,
  chartData: [],
  backupChartData: {},
  regions: INITIAL_REGIONS,
  servers: INITIAL_SERVERS,
  transactions: [],
  loading: false,
  error: null,
  lastUpdated: null,
  streamingEnabled: true,
  selectedDateRange: '24h'
};

export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async (params: { startDate?: string; endDate?: string } | void, { rejectWithValue }) => {
    try {
      const response = await DashboardAPI.getDashboardData(params || undefined);
      const txns = await DashboardAPI.getTransactions();
      return {
        ...response.data,
        transactions: txns.data
      };
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to fetch dashboard data');
    }
  }
);

export const updateChartData = createAsyncThunk(
  'dashboard/updateChart',
  async (newData: ChartData, { dispatch }) => {
    // Optimistic update
    dispatch(dashboardSlice.actions.optimisticUpdate(newData));
    try {
      const response = await DashboardAPI.updateChartData(newData);
      return response.data;
    } catch (error) {
      dispatch(dashboardSlice.actions.revertUpdate(newData.id));
      throw error;
    }
  }
);

export const addTransaction = createAsyncThunk(
  'dashboard/addTransaction',
  async (newTxn: Omit<TransactionRecord, 'id' | 'date'>, { dispatch }) => {
    const txn: TransactionRecord = {
      ...newTxn,
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
    dispatch(dashboardSlice.actions.optimisticAddTransaction(txn));
    return txn;
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    optimisticUpdate: (state, action: PayloadAction<ChartData>) => {
      const index = state.chartData.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        state.backupChartData[action.payload.id] = { ...state.chartData[index] };
        state.chartData[index] = action.payload;
      }
    },
    revertUpdate: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.backupChartData[id]) {
        const index = state.chartData.findIndex((item) => item.id === id);
        if (index !== -1) {
          state.chartData[index] = state.backupChartData[id];
        }
        delete state.backupChartData[id];
      }
    },
    setRealTimeData: (state, action: PayloadAction<ChartData>) => {
      if (!state.streamingEnabled) return;
      // Keep last 30 data points
      const updated = [...state.chartData, action.payload];
      if (updated.length > 30) {
        state.chartData = updated.slice(updated.length - 30);
      } else {
        state.chartData = updated;
      }

      // Update live stats dynamically
      if (state.stats) {
        state.stats.activeUsers = action.payload.activeUsers;
        state.stats.conversionRate = action.payload.conversionRate;
        state.stats.totalRevenue += Math.round(action.payload.revenue * 0.01);
        state.stats.totalTransactions += 1;
      }
      state.lastUpdated = new Date().toISOString();
    },
    toggleStreaming: (state) => {
      state.streamingEnabled = !state.streamingEnabled;
    },
    setDateRange: (state, action: PayloadAction<'24h' | '7d' | '30d' | '90d'>) => {
      state.selectedDateRange = action.payload;
    },
    optimisticAddTransaction: (state, action: PayloadAction<TransactionRecord>) => {
      state.transactions.unshift(action.payload);
      if (state.stats) {
        state.stats.totalRevenue += action.payload.amount;
        state.stats.totalTransactions += 1;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
        state.chartData = action.payload.chartData;
        state.transactions = action.payload.transactions;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to fetch dashboard data';
      })
      .addCase(updateChartData.fulfilled, (state) => {
        state.lastUpdated = new Date().toISOString();
      });
  }
});

export const {
  optimisticUpdate,
  revertUpdate,
  setRealTimeData,
  toggleStreaming,
  setDateRange,
  optimisticAddTransaction
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
