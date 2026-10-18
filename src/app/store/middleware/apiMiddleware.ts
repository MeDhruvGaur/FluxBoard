import { Middleware, isRejectedWithValue } from '@reduxjs/toolkit';
import { addNotification } from '../../../features/notifications/slices/notificationSlice';

export const apiMiddleware: Middleware = ({ dispatch }) => (next) => (action: any) => {
  // Capture rejected async thunk actions and dispatch an error notification
  if (isRejectedWithValue(action)) {
    const errorMsg =
      typeof action.payload === 'string'
        ? action.payload
        : action.error?.message || 'An API error occurred';

    dispatch(
      addNotification({
        title: 'API Request Error',
        message: errorMsg,
        type: 'error'
      })
    );
  }

  return next(action);
};
