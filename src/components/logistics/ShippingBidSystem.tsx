import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { requestShippingBids, createBidRequest } from "@/services/winningBidService";
import { ShippingBid, BidRequest } from "@/types/LogisticsTypes";
import { ArrowRight, BadgeCheck, Leaf, Clock, DollarSign, BarChart, TrendingDown, Truck, Package, MapPin, Scale } from "lucide-react";

// Validation schema for bid request form
const bidRequestSchema = z.object({
  origin: z.string().min(5, "Please enter a valid origin address"),
  destination: z.string().min(5, "Please enter a valid destination address"),
  weight: z.coerce.number().min(0.1, "Weight must be at least 0.1 kg"),
  length: z.coerce.number().min(1, "Length must be at least 1 cm"),
  width: z.coerce.number().min(1, "Width must be at least 1 cm"),
  height: z.coerce.number().min(1, "Height must be at least 1 cm"),
  itemValue: z.coerce.number().min(1, "Item value must be at least $1"),
  urgency: z.enum(["standard", "expedited", "priority"], {
    required_error: "Please select a delivery urgency",
  }),
});

type BidRequestForm = z.infer<typeof bidRequestSchema>;

const ShippingBidSystem = () => {
  const { toast } = useToast();
  const [bids, setBids] = useState<ShippingBid[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("request");
  const [selectedBid, setSelectedBid] = useState<ShippingBid | null>(null);
  
  const form = useForm<BidRequestForm>({
    resolver: zodResolver(bidRequestSchema),
    defaultValues: {
      origin: "123 Main St, Anytown, USA",
      destination: "456 Oak Ave, Othertown, USA",
      weight: 1.5,
      length: 30,
      width: 20,
      height: 15,
      itemValue: 50,
      urgency: "standard",
    },
  });
  
  const onSubmit = async (data: BidRequestForm) => {
    setLoading(true);
    try {
      // Create bid request from form data
      const bidRequest = createBidRequest(
        data.origin,
        data.destination,
        data.weight,
        { length: data.length, width: data.width, height: data.height },
        data.itemValue,
        data.urgency
      );
      
      // Get bids from shipping carriers
      const shippingBids = await requestShippingBids(bidRequest);
      
      // Update state with bids
      setBids(shippingBids);
      
      // Set the winning bid as selected
      const winningBid = shippingBids.find(bid => bid.isWinningBid);
      if (winningBid) {
        setSelectedBid(winningBid);
      }
      
      // Show success toast
      toast({
        title: "Bids retrieved successfully",
        description: `${shippingBids.length} carriers responded to your request`,
      });
      
      // Switch to results tab
      setActiveTab("results");
    } catch (error) {
      toast({
        title: "Error retrieving bids",
        description: "There was a problem processing your request",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleBidSelection = (bid: ShippingBid) => {
    setSelectedBid(bid);
  };
  
  const handleConfirmBid = () => {
    if (!selectedBid) return;
    
    toast({
      title: "Shipping bid confirmed",
      description: `Your shipment will be handled by ${selectedBid.carrierName}`,
    });
    
    // Reset the form and bids
    form.reset();
    setBids([]);
    setSelectedBid(null);
    setActiveTab("request");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">AI-Driven Shipping Bid System</h2>
        <p className="text-muted-foreground">
          Our AI analyzes carrier bids in real-time to determine the optimal shipping solution based on 
          sustainability, cost, and delivery time.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Shipping Bid Manager</CardTitle>
          <CardDescription>
            Create a shipping request and let our AI find the best carrier
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="request">Request Bids</TabsTrigger>
              <TabsTrigger value="results" disabled={bids.length === 0}>
                Bid Results
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="request" className="space-y-4 mt-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="origin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Origin Address</FormLabel>
                            <FormControl>
                              <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                <Input {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="destination"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Destination Address</FormLabel>
                            <FormControl>
                              <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                <Input {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Weight (kg)</FormLabel>
                            <FormControl>
                              <div className="flex items-center space-x-2">
                                <Scale className="w-4 h-4 text-muted-foreground" />
                                <Input type="number" step="0.1" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-3 gap-3">
                        <FormField
                          control={form.control}
                          name="length"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Length (cm)</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="width"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Width (cm)</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="height"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Height (cm)</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="itemValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Item Value ($)</FormLabel>
                          <FormControl>
                            <div className="flex items-center space-x-2">
                              <DollarSign className="w-4 h-4 text-muted-foreground" />
                              <Input type="number" {...field} />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Used to determine insurance coverage
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="urgency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Delivery Urgency</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select urgency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="standard">Standard (3-5 days)</SelectItem>
                              <SelectItem value="expedited">Expedited (2-3 days)</SelectItem>
                              <SelectItem value="priority">Priority (1-2 days)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Priority affects delivery timeframe and cost
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <BarChart className="w-4 h-4" />
                        Get AI-Optimized Shipping Bids
                      </span>
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="results" className="space-y-4 mt-4">
              {bids.length > 0 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="overflow-hidden">
                      <CardHeader className={`${selectedBid?.isWinningBid ? 'bg-soft-pink/10' : ''}`}>
                        <div className="flex items-center justify-between">
                          <CardTitle>Selected Carrier</CardTitle>
                          {selectedBid?.isWinningBid && (
                            <Badge className="bg-soft-pink text-white">
                              <TrendingDown className="w-3 h-3 mr-1" />
                              Best Value
                            </Badge>
                          )}
                        </div>
                        <CardDescription>
                          Based on optimal balance of sustainability, cost, and speed
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
                        {selectedBid ? (
                          <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                                <Truck className="h-6 w-6" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">{selectedBid.carrierName}</h3>
                                <p className="text-sm text-muted-foreground">
                                  Carrier ID: {selectedBid.carrierId}
                                </p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-2 mt-4">
                              <div className="bg-muted/50 p-2 rounded">
                                <div className="flex items-center text-sm font-medium mb-1">
                                  <DollarSign className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                                  Price
                                </div>
                                <p className="text-lg font-semibold">${selectedBid.price.toFixed(2)}</p>
                              </div>
                              
                              <div className="bg-muted/50 p-2 rounded">
                                <div className="flex items-center text-sm font-medium mb-1">
                                  <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                                  Delivery
                                </div>
                                <p className="text-lg font-semibold">{selectedBid.estimatedDeliveryTime}h</p>
                              </div>
                              
                              <div className="bg-muted/50 p-2 rounded">
                                <div className="flex items-center text-sm font-medium mb-1">
                                  <Leaf className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                                  CO₂
                                </div>
                                <p className="text-lg font-semibold">{selectedBid.carbonFootprint}kg</p>
                              </div>
                            </div>
                            
                            <div className="mt-4">
                              <p className="text-sm font-medium mb-1">Reliability Score</p>
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className="bg-soft-pink h-2.5 rounded-full" 
                                  style={{ width: `${selectedBid.reliability}%` }}
                                ></div>
                              </div>
                              <p className="text-xs text-right mt-1 text-muted-foreground">
                                {selectedBid.reliability}/100
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                            <p>Select a carrier from the list</p>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="bg-muted/30">
                        <Button 
                          onClick={handleConfirmBid} 
                          className="w-full" 
                          disabled={!selectedBid}
                        >
                          Confirm Selection
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Available Carriers</CardTitle>
                        <CardDescription>
                          {bids.length} carriers responded to your request
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2">
                          {bids.map((bid) => (
                            <div
                              key={bid.id}
                              className={`
                                border rounded-lg p-3 cursor-pointer transition-all
                                ${selectedBid?.id === bid.id ? 'border-soft-pink bg-soft-pink/5' : 'border-gray-200 hover:border-gray-300'}
                              `}
                              onClick={() => handleBidSelection(bid)}
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex items-center">
                                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center mr-2">
                                    <Truck className="h-4 w-4" />
                                  </div>
                                  <div>
                                    <p className="font-medium">{bid.carrierName}</p>
                                    <div className="flex items-center mt-1">
                                      <Badge variant="outline" className="text-xs mr-1">
                                        ${bid.price.toFixed(2)}
                                      </Badge>
                                      <Badge variant="outline" className="text-xs mr-1">
                                        {bid.estimatedDeliveryTime}h
                                      </Badge>
                                      <Badge variant="outline" className="text-xs">
                                        {bid.carbonFootprint}kg CO₂
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                                
                                {bid.isWinningBid && (
                                  <Badge className="bg-soft-pink text-white">
                                    <TrendingDown className="w-3 h-3 mr-1" />
                                    Best Value
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShippingBidSystem;
