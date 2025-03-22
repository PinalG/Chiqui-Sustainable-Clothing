
import React, { createContext, useContext, ReactNode } from 'react';
import { useWebSocket } from '@/hooks/use-websocket';

interface WebSocketContextType {
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => void;
  disconnect: () => void;
  subscribe: <T,>(eventType: string, handler: (data: T) => void) => () => void;
  send: (type: string, data?: any) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const websocket = useWebSocket({
    autoConnect: true,
    reconnectOnMount: true,
  });

  return (
    <WebSocketContext.Provider value={websocket}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }
  return context;
};
