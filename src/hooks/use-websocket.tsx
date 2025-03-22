
import { useState, useEffect, useCallback, useRef } from 'react';
import { webSocketService, mockWebSocketMessages } from '@/lib/websocketService';
import { useToast } from '@/hooks/use-toast';

interface UseWebSocketOptions {
  autoConnect?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
  reconnectOnMount?: boolean;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const { 
    autoConnect = true, 
    onConnect, 
    onDisconnect,
    reconnectOnMount = true 
  } = options;
  
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();
  const onConnectRef = useRef(onConnect);
  const onDisconnectRef = useRef(onDisconnect);

  // Update refs when handlers change
  useEffect(() => {
    onConnectRef.current = onConnect;
    onDisconnectRef.current = onDisconnect;
  }, [onConnect, onDisconnect]);

  // Connect/disconnect handlers
  const handleConnect = useCallback(() => {
    setIsConnected(true);
    setIsConnecting(false);
    if (onConnectRef.current) {
      onConnectRef.current();
    }
    toast({
      title: "Connected to real-time updates",
      description: "You will now receive live data updates",
    });
  }, [toast]);

  const handleDisconnect = useCallback(() => {
    setIsConnected(false);
    if (onDisconnectRef.current) {
      onDisconnectRef.current();
    }
    toast({
      title: "Disconnected from real-time updates",
      description: "Live data updates temporarily unavailable",
      variant: "destructive",
    });
  }, [toast]);

  // Connect to WebSocket
  const connect = useCallback(() => {
    setIsConnecting(true);
    webSocketService.connect();
  }, []);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    webSocketService.disconnect();
    setIsConnected(false);
    setIsConnecting(false);
  }, []);

  // Subscribe to events
  const subscribe = useCallback(<T,>(
    eventType: string, 
    handler: (data: T) => void
  ) => {
    return webSocketService.subscribe(eventType, handler);
  }, []);

  // Send message
  const send = useCallback((type: string, data: any = {}) => {
    webSocketService.send(type, data);
  }, []);

  // Connect on mount if autoConnect is true
  useEffect(() => {
    if (autoConnect || reconnectOnMount) {
      connect();
    }

    // Set up connection handlers
    const connectUnsubscribe = webSocketService.onConnect(handleConnect);
    const disconnectUnsubscribe = webSocketService.onDisconnect(handleDisconnect);

    // Check if we are currently connected
    setIsConnected(webSocketService.isConnected());

    // For development mode, we'll mock some WebSocket messages
    if (process.env.NODE_ENV === 'development' && mockWebSocketMessages) {
      mockWebSocketMessages();
    }

    // Clean up on unmount
    return () => {
      connectUnsubscribe();
      disconnectUnsubscribe();
    };
  }, [autoConnect, reconnectOnMount, connect, handleConnect, handleDisconnect]);

  return {
    isConnected,
    isConnecting,
    connect,
    disconnect,
    subscribe,
    send
  };
}
