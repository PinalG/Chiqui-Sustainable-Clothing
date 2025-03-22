
// WebSocket connection management for real-time updates
// Handles auto-reconnection, message parsing, and event subscription

type MessageHandler = (data: any) => void;
type ConnectionHandler = () => void;

interface WebSocketEvent {
  type: string;
  data: any;
}

export class WebSocketService {
  private socket: WebSocket | null = null;
  private url: string;
  private reconnectTimeout: number = 2000; // Start with 2s reconnect
  private maxReconnectTimeout: number = 30000; // Max 30s
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 10;
  private reconnectTimer: number | null = null;
  private messageHandlers: Map<string, Set<MessageHandler>> = new Map();
  private connectHandlers: Set<ConnectionHandler> = new Set();
  private disconnectHandlers: Set<ConnectionHandler> = new Set();
  private isConnecting: boolean = false;
  private pingInterval: number | null = null;
  private lastMessageTime: number = 0;

  constructor(url: string) {
    // In development, connect to a local WebSocket server
    // In production, use the deployed WebSocket endpoint
    this.url = import.meta.env.DEV 
      ? 'ws://localhost:8080' 
      : url;
  }

  public connect(): void {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      console.log('WebSocket already connected or connecting');
      return;
    }

    if (this.isConnecting) {
      console.log('WebSocket connection already in progress');
      return;
    }

    this.isConnecting = true;

    console.log(`Connecting to WebSocket at ${this.url}`);
    
    try {
      this.socket = new WebSocket(this.url);
      
      this.socket.onopen = this.handleOpen.bind(this);
      this.socket.onmessage = this.handleMessage.bind(this);
      this.socket.onclose = this.handleClose.bind(this);
      this.socket.onerror = this.handleError.bind(this);
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.scheduleReconnect();
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    if (this.reconnectTimer !== null) {
      window.clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.pingInterval !== null) {
      window.clearInterval(this.pingInterval);
      this.pingInterval = null;
    }

    this.reconnectAttempts = 0;
    this.isConnecting = false;
  }

  public send(type: string, data: any = {}): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket not connected, cannot send message');
      return;
    }

    const message: WebSocketEvent = {
      type,
      data
    };

    this.socket.send(JSON.stringify(message));
  }

  public subscribe(eventType: string, handler: MessageHandler): () => void {
    if (!this.messageHandlers.has(eventType)) {
      this.messageHandlers.set(eventType, new Set());
    }

    this.messageHandlers.get(eventType)!.add(handler);

    // Return an unsubscribe function
    return () => {
      const handlers = this.messageHandlers.get(eventType);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.messageHandlers.delete(eventType);
        }
      }
    };
  }

  public onConnect(handler: ConnectionHandler): () => void {
    this.connectHandlers.add(handler);
    return () => {
      this.connectHandlers.delete(handler);
    };
  }

  public onDisconnect(handler: ConnectionHandler): () => void {
    this.disconnectHandlers.add(handler);
    return () => {
      this.disconnectHandlers.delete(handler);
    };
  }

  public isConnected(): boolean {
    return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
  }

  private handleOpen(event: Event): void {
    console.log('WebSocket connected');
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    this.reconnectTimeout = 2000;
    this.lastMessageTime = Date.now();

    // Set up ping interval to keep connection alive
    this.setupPingInterval();

    this.connectHandlers.forEach(handler => {
      try {
        handler();
      } catch (error) {
        console.error('Error in connect handler:', error);
      }
    });
  }

  private handleMessage(event: MessageEvent): void {
    this.lastMessageTime = Date.now();
    
    try {
      const message = JSON.parse(event.data) as WebSocketEvent;
      
      // Handle system messages
      if (message.type === 'pong') {
        return;
      }

      // Handle subscribed messages
      const handlers = this.messageHandlers.get(message.type);
      if (handlers) {
        handlers.forEach(handler => {
          try {
            handler(message.data);
          } catch (error) {
            console.error(`Error in handler for ${message.type}:`, error);
          }
        });
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  private handleClose(event: CloseEvent): void {
    console.log(`WebSocket closed: ${event.code} ${event.reason}`);
    this.socket = null;
    this.isConnecting = false;

    if (this.pingInterval !== null) {
      window.clearInterval(this.pingInterval);
      this.pingInterval = null;
    }

    this.disconnectHandlers.forEach(handler => {
      try {
        handler();
      } catch (error) {
        console.error('Error in disconnect handler:', error);
      }
    });

    // Don't reconnect on normal closure (1000) or if we've reached max attempts
    if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
      this.scheduleReconnect();
    }
  }

  private handleError(event: Event): void {
    console.error('WebSocket error:', event);
    // Connection error, will be followed by onclose
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer !== null) {
      window.clearTimeout(this.reconnectTimer);
    }

    this.reconnectAttempts++;
    
    // Exponential backoff with jitter
    const jitter = Math.random() * 0.3 + 0.85; // 0.85-1.15
    let timeout = Math.min(
      this.reconnectTimeout * Math.pow(1.5, this.reconnectAttempts - 1) * jitter,
      this.maxReconnectTimeout
    );

    console.log(`Reconnecting in ${Math.round(timeout / 100) / 10}s (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, timeout);
  }

  private setupPingInterval(): void {
    if (this.pingInterval !== null) {
      window.clearInterval(this.pingInterval);
    }

    // Send ping every 30 seconds to keep connection alive
    this.pingInterval = window.setInterval(() => {
      if (this.socket?.readyState === WebSocket.OPEN) {
        // Check if we haven't received messages for too long (90 seconds)
        const now = Date.now();
        if (now - this.lastMessageTime > 90000) {
          console.warn('No message received for 90 seconds, reconnecting...');
          this.socket.close();
          this.scheduleReconnect();
          return;
        }

        this.send('ping');
      } else {
        window.clearInterval(this.pingInterval!);
        this.pingInterval = null;
      }
    }, 30000);
  }
}

// Create a singleton instance for the application
const wsUrl = import.meta.env.VITE_WEBSOCKET_URL || 'wss://api.chiqui-platform.com/ws';
export const webSocketService = new WebSocketService(wsUrl);

// For mocking in development
export const mockWebSocketMessages = import.meta.env.DEV ? () => {
  setInterval(() => {
    const handlers = webSocketService.subscribe('inventory_update', () => {});
    const mockData = {
      type: 'inventory_update',
      data: {
        warehouseId: 'warehouse-' + Math.ceil(Math.random() * 3),
        productId: 'PROD-' + Math.ceil(Math.random() * 1000),
        quantity: Math.ceil(Math.random() * 100),
        status: ['available', 'reserved', 'shipped'][Math.floor(Math.random() * 3)],
        lastUpdated: new Date().toISOString()
      }
    };
    const event = new MessageEvent('message', { data: JSON.stringify(mockData) });
    // @ts-ignore - We're mocking the event
    webSocketService['handleMessage'](event);
  }, 10000);
} : undefined;
