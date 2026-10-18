import { describe, it, expect } from 'vitest';
import notificationReducer, {
  addNotification,
  markAsRead,
  markAllAsRead,
  clearAll
} from './notificationSlice';

describe('notificationSlice', () => {
  it('should initialize with seed notifications', () => {
    const state = notificationReducer(undefined, { type: '@@INIT' });
    expect(state.notifications.length).toBeGreaterThan(0);
    expect(state.unreadCount).toBeGreaterThan(0);
  });

  it('should add a new notification and increment unread count', () => {
    const initial = notificationReducer(undefined, { type: '@@INIT' });
    const countBefore = initial.unreadCount;

    const nextState = notificationReducer(
      initial,
      addNotification({
        title: 'Cluster Alert',
        message: 'CPU usage threshold exceeded',
        type: 'warning'
      })
    );

    expect(nextState.notifications[0].title).toBe('Cluster Alert');
    expect(nextState.unreadCount).toBe(countBefore + 1);
  });

  it('should mark a specific notification as read', () => {
    const initial = notificationReducer(undefined, { type: '@@INIT' });
    const unreadItem = initial.notifications.find((n) => !n.read);
    if (unreadItem) {
      const readState = notificationReducer(initial, markAsRead(unreadItem.id));
      const updatedItem = readState.notifications.find((n) => n.id === unreadItem.id);
      expect(updatedItem?.read).toBe(true);
    }
  });

  it('should mark all notifications as read', () => {
    const initial = notificationReducer(undefined, { type: '@@INIT' });
    const readState = notificationReducer(initial, markAllAsRead());
    expect(readState.unreadCount).toBe(0);
    expect(readState.notifications.every((n) => n.read)).toBe(true);
  });

  it('should clear all notifications', () => {
    const initial = notificationReducer(undefined, { type: '@@INIT' });
    const cleared = notificationReducer(initial, clearAll());
    expect(cleared.notifications).toEqual([]);
    expect(cleared.unreadCount).toBe(0);
  });
});
