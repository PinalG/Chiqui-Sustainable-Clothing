
import { createContext, useContext, ReactNode } from 'react';
import { useWebSocket } from '@/hooks/use-websocket';

// Define the shape of our context
interface WebSocketContextType {
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => void;
  disconnect: () => void;
  subscribe: <T,>(eventType: string, handler: (data: T) => void) => () => void;
  send: (type: string, data?: any) => void;
}

// Create context with undefined as default
const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

// Props for our provider
interface WebSocketProviderProps {
  children: ReactNode;
  autoConnect?: boolean;
}

// WebSocket Provider component
export function WebSocketProvider({
  children,
  autoConnect = true
}: WebSocketProviderProps) {
  const websocket = useWebSocket({
    autoConnect,
    onConnect: () => console.log('[WebSocketContext] Connected to WebSocket server'),
    onDisconnect: () => console.log('[WebSocketContext] Disconnected from WebSocket server')
  });

  return (
    <WebSocketContext.Provider value={websocket}>
      {children}
    </WebSocketContext.Provider>
  );
}

// Hook to use the WebSocket context
export function useWebSocketContext() {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }
  return context;
}
