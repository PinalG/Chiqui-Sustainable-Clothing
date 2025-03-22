
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/test/utils';
import { WebSocketStatusIndicator } from './WebSocketStatusIndicator';
import * as WebSocketContext from '@/contexts/WebSocketContext';

// Mock the WebSocketContext
vi.mock('@/contexts/WebSocketContext', () => ({
  useWebSocketContext: vi.fn(),
}));

describe('WebSocketStatusIndicator', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should display connected status when WebSocket is connected', () => {
    // Mock the context value for connected state
    vi.spyOn(WebSocketContext, 'useWebSocketContext').mockReturnValue({
      isConnected: true,
      isConnecting: false,
      connect: vi.fn(),
      disconnect: vi.fn(),
      subscribe: vi.fn(),
      send: vi.fn(),
    });

    render(<WebSocketStatusIndicator />);
    
    // In the actual component, there might be a visual indication of connected status
    // Check if the reconnect button is not shown
    expect(screen.queryByRole('button', { name: /reconnect/i })).not.toBeInTheDocument();
  });

  it('should display reconnect button after 5 seconds of disconnection', async () => {
    // Mock the context value for disconnected state
    vi.spyOn(WebSocketContext, 'useWebSocketContext').mockReturnValue({
      isConnected: false,
      isConnecting: false,
      connect: vi.fn(),
      disconnect: vi.fn(),
      subscribe: vi.fn(),
      send: vi.fn(),
    });
    
    // Mock timers
    vi.useFakeTimers();
    
    render(<WebSocketStatusIndicator />);
    
    // Initially, reconnect button should not be visible
    expect(screen.queryByRole('button', { name: /reconnect/i })).not.toBeInTheDocument();
    
    // Advance timer by 5 seconds
    vi.advanceTimersByTime(5000);
    
    // Now the reconnect button should be visible
    expect(screen.getByRole('button', { name: /reconnect/i })).toBeInTheDocument();
    
    // Restore timer
    vi.useRealTimers();
  });
});
