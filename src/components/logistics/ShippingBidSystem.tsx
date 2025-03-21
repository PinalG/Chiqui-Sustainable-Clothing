
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Clock, DollarSign, Truck, PackageCheck, Loader2 } from "lucide-react";
import { ShippingBid, generateShippingBids, selectShippingBid } from "@/services/logisticsService";
import { toast } from "@/components/ui/use-toast";

interface PackageDetails {
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  fragile: boolean;
}

const ShippingBidSystem = () => {
  const [originZip, setOriginZip] = useState("");
  const [destinationZip, setDestinationZip] = useState("");
  const [packageDetails, setPackageDetails] = useState<PackageDetails>({
    weight: 5,
    dimensions: { length: 10, width: 10, height: 10 },
    fragile: false
  });
  
  const [bids, setBids] = useState<ShippingBid[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<"price" | "eco" | "speed">("price");
  const [selectedBidId, setSelectedBidId] = useState<string | null>(null);
  const [confirmingBid, setConfirmingBid] = useState(false);

  const handleGenerateBids = async () => {
    if (!originZip || !destinationZip) {
      toast({
        title: "Missing Information",
        description: "Please enter both origin and destination zip codes.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    try {
      const generatedBids = await generateShippingBids(
        { zipCode: originZip },
        { zipCode: destinationZip },
        packageDetails
      );
      setBids(generatedBids);
    } catch (error) {
      toast({
        title: "Error Generating Bids",
        description: "There was an error generating shipping bids. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filter: "price" | "eco" | "speed") => {
    setSelectedFilter(filter);
    
    // Sort bids based on the selected filter
    const sortedBids = [...bids].sort((a, b) => {
      if (filter === "price") return a.price - b.price;
      if (filter === "eco") return a.carbonFootprint - b.carbonFootprint;
      if (filter === "speed") return a.estimatedDeliveryDays - b.estimatedDeliveryDays;
      return 0;
    });
    
    setBids(sortedBids);
  };

  const handleSelectBid = (bidId: string) => {
    setSelectedBidId(bidId);
  };

  const handleConfirmBid = async () => {
    if (!selectedBidId) return;
    
    const selectedBid = bids.find(bid => bid.id === selectedBidId);
    if (!selectedBid) return;
    
    setConfirmingBid(true);
    try {
      const shipmentId = await selectShippingBid("mock-order-123", selectedBid);
      toast({
        title: "Bid Selected Successfully",
        description: `Your shipment has been created with ${selectedBid.providerName}. Tracking ID: ${shipmentId}`,
        variant: "default"
      });
      
      // Reset state
      setBids([]);
      setSelectedBidId(null);
    } catch (error) {
      toast({
        title: "Error Confirming Bid",
        description: "There was an error confirming your selected bid. Please try again.",
        variant: "destructive"
      });
    } finally {
      setConfirmingBid(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Package and Shipping Details */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Shipping Details</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="originZip">Origin Zip Code</Label>
                  <Input
                    id="originZip"
                    value={originZip}
                    onChange={(e) => setOriginZip(e.target.value)}
                    placeholder="Enter origin zip"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="destinationZip">Destination Zip Code</Label>
                  <Input
                    id="destinationZip"
                    value={destinationZip}
                    onChange={(e) => setDestinationZip(e.target.value)}
                    placeholder="Enter destination zip"
                  />
                </div>
              </div>
              
              <Separator />
              
              <h3 className="text-lg font-medium">Package Details</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="weight">Weight (lbs)</Label>
                    <span className="text-sm text-muted-foreground">{packageDetails.weight} lbs</span>
                  </div>
                  <Slider
                    id="weight"
                    min={1}
                    max={50}
                    step={0.5}
                    value={[packageDetails.weight]}
                    onValueChange={(values) => setPackageDetails({
                      ...packageDetails,
                      weight: values[0]
                    })}
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="length">Length (in)</Label>
                    <Input
                      id="length"
                      type="number"
                      min={1}
                      value={packageDetails.dimensions.length}
                      onChange={(e) => setPackageDetails({
                        ...packageDetails,
                        dimensions: {
                          ...packageDetails.dimensions,
                          length: Number(e.target.value)
                        }
                      })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="width">Width (in)</Label>
                    <Input
                      id="width"
                      type="number"
                      min={1}
                      value={packageDetails.dimensions.width}
                      onChange={(e) => setPackageDetails({
                        ...packageDetails,
                        dimensions: {
                          ...packageDetails.dimensions,
                          width: Number(e.target.value)
                        }
                      })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (in)</Label>
                    <Input
                      id="height"
                      type="number"
                      min={1}
                      value={packageDetails.dimensions.height}
                      onChange={(e) => setPackageDetails({
                        ...packageDetails,
                        dimensions: {
                          ...packageDetails.dimensions,
                          height: Number(e.target.value)
                        }
                      })}
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="fragile"
                    checked={packageDetails.fragile}
                    onCheckedChange={(checked) => setPackageDetails({
                      ...packageDetails,
                      fragile: checked
                    })}
                  />
                  <Label htmlFor="fragile">Mark as Fragile</Label>
                </div>
              </div>
              
              <Button
                className="w-full mt-4"
                onClick={handleGenerateBids}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Bids...
                  </>
                ) : (
                  <>Generate Shipping Bids</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Bid Results */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Shipping Bids</h3>
                
                {bids.length > 0 && (
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant={selectedFilter === "price" ? "default" : "outline"}
                      onClick={() => handleFilterChange("price")}
                    >
                      <DollarSign className="h-4 w-4 mr-1" />
                      Price
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedFilter === "eco" ? "default" : "outline"}
                      onClick={() => handleFilterChange("eco")}
                    >
                      <Leaf className="h-4 w-4 mr-1" />
                      Eco
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedFilter === "speed" ? "default" : "outline"}
                      onClick={() => handleFilterChange("speed")}
                    >
                      <Clock className="h-4 w-4 mr-1" />
                      Speed
                    </Button>
                  </div>
                )}
              </div>
              
              {bids.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  {loading ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-8 w-8 animate-spin mb-2" />
                      <p>Finding the best shipping options...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Truck className="h-8 w-8 mb-2 text-muted-foreground" />
                      <p>Enter shipping details and generate bids</p>
                      <p className="text-sm">Our AI will find the best options for you</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-auto pr-2">
                  <AnimatePresence>
                    {bids.map((bid, index) => (
                      <motion.div
                        key={bid.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div 
                          className={`p-4 border rounded-lg hover:border-soft-pink transition-all cursor-pointer ${
                            selectedBidId === bid.id ? 'border-soft-pink bg-soft-pink/5' : 'border-border'
                          }`}
                          onClick={() => handleSelectBid(bid.id || "")}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium">{bid.providerName}</h4>
                              {index === 0 && selectedFilter === "price" && (
                                <Badge variant="outline" className="bg-soft-pink/10 text-soft-pink border-soft-pink">
                                  Best Price
                                </Badge>
                              )}
                              {index === 0 && selectedFilter === "eco" && (
                                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-800">
                                  Eco-Friendly
                                </Badge>
                              )}
                              {index === 0 && selectedFilter === "speed" && (
                                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-800">
                                  Fastest
                                </Badge>
                              )}
                            </div>
                            <div className="text-xl font-bold">${bid.price.toFixed(2)}</div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>{bid.estimatedDeliveryDays} day{bid.estimatedDeliveryDays !== 1 ? 's' : ''}</span>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Leaf className="h-4 w-4" />
                              <span>{bid.carbonFootprint.toFixed(1)} kg CO₂</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
              
              {selectedBidId && (
                <Button 
                  className="w-full mt-4" 
                  onClick={handleConfirmBid}
                  disabled={confirmingBid}
                >
                  {confirmingBid ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Confirming...
                    </>
                  ) : (
                    <>
                      <PackageCheck className="mr-2 h-4 w-4" />
                      Confirm Selected Bid
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShippingBidSystem;
