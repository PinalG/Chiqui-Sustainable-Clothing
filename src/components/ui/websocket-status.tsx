
import { useWebSocketContext } from "@/contexts/WebSocketContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface WebSocketStatusProps {
  showLabel?: boolean;
  showReconnectButton?: boolean;
}

export function WebSocketStatus({ 
  showLabel = false,
  showReconnectButton = false
}: WebSocketStatusProps) {
  const { isConnected, isConnecting, connect } = useWebSocketContext();

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2">
              {isConnected ? (
                <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 flex items-center gap-1.5 h-7 px-2">
                  <Wifi className="h-3.5 w-3.5" />
                  {showLabel && <span>Connected</span>}
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 flex items-center gap-1.5 h-7 px-2">
                  <WifiOff className="h-3.5 w-3.5" />
                  {showLabel && <span>{isConnecting ? "Connecting..." : "Disconnected"}</span>}
                </Badge>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isConnected 
              ? "Receiving real-time updates" 
              : isConnecting 
                ? "Connecting to real-time server..." 
                : "Real-time updates unavailable"
            }</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {showReconnectButton && !isConnected && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={connect}
          disabled={isConnecting}
          className="h-7 px-2 text-xs"
        >
          {isConnecting ? "Connecting..." : "Reconnect"}
        </Button>
      )}
    </div>
  );
}
