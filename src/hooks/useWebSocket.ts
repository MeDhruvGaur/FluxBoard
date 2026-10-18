import { useEffect, useRef, useCallback, useState } from 'react';
import { useAppDispatch } from '../app/hooks/useAppDispatch';
import { setRealTimeData } from '../features/dashboard/slices/dashboardSlice';
import { addNotification } from '../features/notifications/slices/notificationSlice';
import WebSocketService, { ConnectionStatus } from '../services/websocket/WebSocketService';
import { ChartData } from '../types/dashboard.types';

export const useWebSocket = (url: string = 'wss://api.fluxboard.io/ws') => {
  const dispatch = useAppDispatch();
  const wsService = useRef<WebSocketService | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>('connecting');
  const [latency, setLatency] = useState<number>(24);

  const handleMessage = useCallback(
    (data: any) => {
      if (data && data.revenue !== undefined) {
        // Chart tick update
        dispatch(setRealTimeData(data as ChartData));
        setLatency(data.latencyMs || Math.round(18 + Math.random() * 15));
      } else if (data && data.type === 'ALERT') {
        dispatch(
          addNotification({
            title: data.title || 'System Notification',
            message: data.message || 'Real-time alert triggered',
            type: data.level || 'info'
          })
        );
      }
    },
    [dispatch]
  );

  useEffect(() => {
    const service = new WebSocketService(url, handleMessage, (newStatus) => {
      setStatus(newStatus);
    });
    wsService.current = service;
    service.connect();

    return () => {
      service.disconnect();
    };
  }, [url, handleMessage]);

  const send = useCallback((data: any) => {
    wsService.current?.send(data);
  }, []);

  const reconnect = useCallback(() => {
    wsService.current?.disconnect();
    wsService.current?.connect();
  }, []);

  return { status, latency, send, reconnect, isConnected: status === 'connected' };
};
