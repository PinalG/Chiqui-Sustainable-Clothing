
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWebSocket } from './use-websocket';
import { webSocketService } from '@/lib/websocketService';

// Mock the websocketService
vi.mock('@/lib/websocketService', () => ({
  webSocketService: {
    connect: vi.fn(),
    disconnect: vi.fn(),
    isConnected: vi.fn(),
    onConnect: vi.fn().mockReturnValue(vi.fn()),
    onDisconnect: vi.fn().mockReturnValue(vi.fn()),
    subscribe: vi.fn().mockReturnValue(vi.fn()),
    send: vi.fn(),
  },
  mockWebSocketMessages: vi.fn(),
}));

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn().mockReturnValue({
    toast: vi.fn(),
  }),
}));

describe('useWebSocket', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should connect to WebSocket on mount if autoConnect is true', () => {
    renderHook(() => useWebSocket({ autoConnect: true }));
    expect(webSocketService.connect).toHaveBeenCalled();
  });

  it('should not connect to WebSocket on mount if autoConnect is false', () => {
    renderHook(() => useWebSocket({ autoConnect: false }));
    expect(webSocketService.connect).not.toHaveBeenCalled();
  });

  it('should connect when connect method is called', () => {
    const { result } = renderHook(() => useWebSocket({ autoConnect: false }));
    act(() => {
      result.current.connect();
    });
    expect(webSocketService.connect).toHaveBeenCalled();
    expect(result.current.isConnecting).toBe(true);
  });

  it('should disconnect when disconnect method is called', () => {
    const { result } = renderHook(() => useWebSocket());
    act(() => {
      result.current.disconnect();
    });
    expect(webSocketService.disconnect).toHaveBeenCalled();
    expect(result.current.isConnected).toBe(false);
    expect(result.current.isConnecting).toBe(false);
  });

  it('should subscribe to WebSocket events', () => {
    const { result } = renderHook(() => useWebSocket());
    const handler = vi.fn();
    act(() => {
      result.current.subscribe('test-event', handler);
    });
    expect(webSocketService.subscribe).toHaveBeenCalledWith('test-event', handler);
  });

  it('should send WebSocket messages', () => {
    const { result } = renderHook(() => useWebSocket());
    act(() => {
      result.current.send('test-event', { data: 'test' });
    });
    expect(webSocketService.send).toHaveBeenCalledWith('test-event', { data: 'test' });
  });
});
