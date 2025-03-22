import { useState, useEffect } from "react";
import { useWebSocketContext } from "@/contexts/WebSocketContext";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { AlertCircle, ArrowDown, ArrowUp, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface InventoryUpdate {
  warehouseId: string;
  productId: string;
  quantity: number;
  previousQuantity?: number;
  status: string;
  lastUpdated: string;
  locationCode: string;
}

const LiveInventoryUpdates = () => {
  const [updates, setUpdates] = useState<InventoryUpdate[]>([]);
  const { isConnected, subscribe } = useWebSocketContext();

  useEffect(() => {
    if (!isConnected) return;

    // Subscribe to inventory updates
    const unsubscribe = subscribe<InventoryUpdate>('inventory_update', (data) => {
      // Add the new update to the list
      setUpdates(prev => {
        // Keep only the 5 most recent updates
        const newUpdates = [data, ...prev].slice(0, 5);
        return newUpdates;
      });

      // Show a toast notification for the update
      toast({
        title: "Inventory Updated",
        description: `Product ${data.productId} in ${data.warehouseId} has been updated.`,
      });
    });

    return () => {
      unsubscribe();
    };
  }, [isConnected, subscribe]);

  if (!isConnected) {
    return (
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-yellow-500" />
            Live Updates Unavailable
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Connect to the WebSocket server to receive real-time inventory updates.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (updates.length === 0) {
    return (
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Package className="h-5 w-5 mr-2 text-soft-pink" />
            Live Inventory Updates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Connected and waiting for inventory updates...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Package className="h-5 w-5 mr-2 text-soft-pink" />
          Live Inventory Updates
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          <AnimatePresence>
            {updates.map((update, index) => {
              const isQuantityIncrease = update.previousQuantity !== undefined && 
                update.quantity > update.previousQuantity;
              const isQuantityDecrease = update.previousQuantity !== undefined && 
                update.quantity < update.previousQuantity;
              
              return (
                <motion.div
                  key={`${update.productId}-${update.lastUpdated}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-3 bg-white"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{update.productId}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(update.lastUpdated).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="outline" 
                        className={`
                          ${update.status === 'available' ? 'bg-green-50 text-green-600 border-green-200' : ''}
                          ${update.status === 'reserved' ? 'bg-amber-50 text-amber-600 border-amber-200' : ''}
                          ${update.status === 'shipped' ? 'bg-red-50 text-red-600 border-red-200' : ''}
                        `}
                      >
                        {update.status}
                      </Badge>
                      
                      <div className="flex items-center">
                        {isQuantityIncrease && (
                          <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                        )}
                        {isQuantityDecrease && (
                          <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                        )}
                        <span className={`
                          ${isQuantityIncrease ? 'text-green-500' : ''}
                          ${isQuantityDecrease ? 'text-red-500' : ''}
                        `}>
                          {update.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveInventoryUpdates;
