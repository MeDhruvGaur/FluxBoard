import { Middleware } from '@reduxjs/toolkit';

export const loggerMiddleware: Middleware = () => (next) => (action: any) => {
  if (process.env.NODE_ENV !== 'production') {
    // Light-weight action auditing in dev
    console.debug(`[Redux Action] %c${action.type}`, 'color: #06b6d4; font-weight: bold;', action.payload);
  }
  return next(action);
};
