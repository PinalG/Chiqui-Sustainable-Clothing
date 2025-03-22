
import { useWebSocketContext } from "@/contexts/WebSocketContext";
import { WebSocketStatus } from "@/components/ui/websocket-status";
import { useState, useEffect } from "react";

export function WebSocketStatusIndicator() {
  const { isConnected } = useWebSocketContext();
  const [showReconnect, setShowReconnect] = useState(false);

  // Only show the reconnect button if disconnected for more than 5 seconds
  useEffect(() => {
    if (isConnected) {
      setShowReconnect(false);
    } else {
      const timer = setTimeout(() => {
        setShowReconnect(true);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isConnected]);

  return (
    <div className="hidden md:flex items-center ml-2">
      <WebSocketStatus showLabel showReconnectButton={showReconnect} />
    </div>
  );
}
