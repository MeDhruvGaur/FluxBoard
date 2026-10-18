import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationItem, NotificationState } from '../../../types/notification.types';

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'High Ingestion Throughput',
    message: 'Global pipeline reached 45,000 req/sec across EU & US edge nodes.',
    type: 'info',
    timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    read: false
  },
  {
    id: 'notif-2',
    title: 'Payment Settlement Complete',
    message: 'Enterprise batch settlement $142,500 processed successfully via Stripe.',
    type: 'success',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    read: false
  },
  {
    id: 'notif-3',
    title: 'Latency Spike Detected',
    message: 'API Gateway cluster in Singapore experienced 84ms latency transient.',
    type: 'warning',
    timestamp: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
    read: true
  }
];

const initialState: NotificationState = {
  notifications: INITIAL_NOTIFICATIONS,
  unreadCount: 2
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<NotificationItem, 'id' | 'timestamp' | 'read'>>) => {
      const item: NotificationItem = {
        ...action.payload,
        id: `notif-${Date.now()}`,
        timestamp: new Date().toISOString(),
        read: false
      };
      state.notifications.unshift(item);
      state.unreadCount += 1;
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const item = state.notifications.find((n) => n.id === action.payload);
      if (item && !item.read) {
        item.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach((n) => {
        n.read = true;
      });
      state.unreadCount = 0;
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      const item = state.notifications.find((n) => n.id === action.payload);
      if (item && !item.read) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
    clearAll: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    }
  }
});

export const { addNotification, markAsRead, markAllAsRead, removeNotification, clearAll } =
  notificationSlice.actions;

export default notificationSlice.reducer;
