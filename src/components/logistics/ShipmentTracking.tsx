
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ShipmentTrackingInfo, getShipmentTracking 
} from "@/services/logisticsService";
import { 
  Search, Loader2, PackageCheck, PackageX, Package, Truck, MapPin,
  CalendarClock, AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";

const mockShipmentIds = [
  "shipment-order123-1714505423687",
  "shipment-order456-1714505423698",
  "shipment-order789-1714505423701",
];

const ShipmentTracking = () => {
  const [trackingId, setTrackingId] = useState("");
  const [tracking, setTracking] = useState<ShipmentTrackingInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [recentShipments, setRecentShipments] = useState<string[]>(mockShipmentIds);

  const handleTrackShipment = async () => {
    if (!trackingId) {
      toast({
        title: "Missing Information",
        description: "Please enter a shipment tracking ID.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    try {
      const trackingInfo = await getShipmentTracking(trackingId);
      setTracking(trackingInfo);
      
      // Add to recent shipments if not already there
      if (!recentShipments.includes(trackingId)) {
        setRecentShipments([trackingId, ...recentShipments.slice(0, 2)]);
      }
    } catch (error) {
      toast({
        title: "Error Tracking Shipment",
        description: "Unable to find tracking information for the provided ID.",
        variant: "destructive"
      });
      setTracking(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: ShipmentTrackingInfo['status']) => {
    switch (status) {
      case "processing":
        return <Package className="h-5 w-5 text-blue-500" />;
      case "picked_up":
        return <PackageCheck className="h-5 w-5 text-blue-500" />;
      case "in_transit":
        return <Truck className="h-5 w-5 text-yellow-500" />;
      case "out_for_delivery":
        return <MapPin className="h-5 w-5 text-purple-500" />;
      case "delivered":
        return <PackageCheck className="h-5 w-5 text-green-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: ShipmentTrackingInfo['status']) => {
    switch (status) {
      case "processing":
        return "text-blue-700 bg-blue-50 border-blue-200";
      case "picked_up":
        return "text-blue-700 bg-blue-50 border-blue-200";
      case "in_transit":
        return "text-yellow-700 bg-yellow-50 border-yellow-200";
      case "out_for_delivery":
        return "text-purple-700 bg-purple-50 border-purple-200";
      case "delivered":
        return "text-green-700 bg-green-50 border-green-200";
      default:
        return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  const getStatusText = (status: ShipmentTrackingInfo['status']) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleRecentShipmentClick = (shipmentId: string) => {
    setTrackingId(shipmentId);
    getShipmentTracking(shipmentId)
      .then(trackingInfo => {
        setTracking(trackingInfo);
      })
      .catch(error => {
        toast({
          title: "Error Tracking Shipment",
          description: "Unable to find tracking information for the selected shipment.",
          variant: "destructive"
        });
        setTracking(null);
      });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Shipment Tracking</CardTitle>
          <CardDescription>
            Track the status and location of any shipment in real-time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Enter shipment ID or tracking number"
                className="pl-8"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
              />
            </div>
            <Button onClick={handleTrackShipment} disabled={loading || !trackingId}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Track Shipment
            </Button>
          </div>
          
          {recentShipments.length > 0 && !tracking && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Recent Shipments:</h4>
              <div className="flex flex-wrap gap-2">
                {recentShipments.map((shipment, index) => (
                  <Button
                    key={shipment}
                    variant="outline"
                    size="sm"
                    onClick={() => handleRecentShipmentClick(shipment)}
                  >
                    {shipment.substring(0, 18)}...
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {loading ? (
        <div className="flex flex-col items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin mb-2" />
          <p>Tracking shipment...</p>
        </div>
      ) : tracking ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Shipment {tracking.trackingNumber}</CardTitle>
                  <CardDescription>Carrier: {tracking.carrier}</CardDescription>
                </div>
                <Badge
                  variant="outline"
                  className={`flex items-center gap-2 px-3 py-1 ${getStatusColor(tracking.status)}`}
                >
                  {getStatusIcon(tracking.status)}
                  {getStatusText(tracking.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* Shipment Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Current Location</h3>
                    <p className="text-lg font-medium">{tracking.currentLocation?.address}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Estimated Delivery</h3>
                    <div className="flex items-center gap-2">
                      <CalendarClock className="h-5 w-5 text-soft-pink" />
                      <p className="text-lg font-medium">
                        {new Date(tracking.estimatedDelivery).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Tracking Timeline */}
                <div>
                  <h3 className="text-sm font-medium mb-4">Tracking History</h3>
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
                    
                    {/* Timeline events */}
                    <div className="space-y-8">
                      {tracking.history.map((event, index) => (
                        <div key={index} className="flex gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10
                            ${index === 0 ? 'bg-soft-pink text-white' : 'bg-muted border'}`}
                          >
                            {index === 0 ? (
                              getStatusIcon(tracking.status)
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{getStatusText(event.status as ShipmentTrackingInfo['status'])}</h4>
                              <span className="text-xs text-muted-foreground">
                                {new Date(event.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{event.description}</p>
                            <p className="text-sm">{event.location}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : null}
    </div>
  );
};

export default ShipmentTracking;
