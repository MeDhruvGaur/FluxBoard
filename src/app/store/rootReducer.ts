import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../../features/auth/slices/authSlice';
import dashboardReducer from '../../features/dashboard/slices/dashboardSlice';
import notificationReducer from '../../features/notifications/slices/notificationSlice';
import uiReducer from '../../features/ui/slices/uiSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer,
  notifications: notificationReducer,
  ui: uiReducer
});

export type RootState = ReturnType<typeof rootReducer>;
