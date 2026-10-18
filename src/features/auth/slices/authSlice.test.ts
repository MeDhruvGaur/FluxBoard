import { describe, it, expect } from 'vitest';
import authReducer, { setUserRole, updateProfile } from './authSlice';

describe('authSlice', () => {
  it('should initialize with default enterprise admin user', () => {
    const state = authReducer(undefined, { type: '@@INIT' });
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.role).toBe('Admin');
  });

  it('should switch user role', () => {
    const initial = authReducer(undefined, { type: '@@INIT' });
    const nextState = authReducer(initial, setUserRole('Analyst'));
    expect(nextState.user?.role).toBe('Analyst');
  });

  it('should update profile fields', () => {
    const initial = authReducer(undefined, { type: '@@INIT' });
    const nextState = authReducer(initial, updateProfile({ department: 'AI Core Operations' }));
    expect(nextState.user?.department).toBe('AI Core Operations');
  });
});
