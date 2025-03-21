
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogisticsPartner, getLogisticsPartners } from "@/services/logisticsService";
import { Mail, ExternalLink, Building, Truck, Plus, Check, Loader2, Settings, Users } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";

interface ServiceProps {
  type: string;
  basePrice: number;
  carbonFootprint: number;
}

const ServiceCard = ({ type, basePrice, carbonFootprint }: ServiceProps) => {
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium capitalize">{type}</h4>
          <p className="text-sm text-muted-foreground">Shipping Service</p>
        </div>
        <Badge variant="outline" className="bg-soft-pink/10 text-soft-pink">
          ${basePrice.toFixed(2)}
        </Badge>
      </div>
      <div className="mt-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <span className="font-medium">Carbon Footprint:</span>
          <span>{carbonFootprint.toFixed(1)} kg/CO₂</span>
        </div>
      </div>
    </div>
  );
};

const LogisticsPartners = () => {
  const [partners, setPartners] = useState<LogisticsPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newPartner, setNewPartner] = useState({
    name: "",
    contactEmail: "",
    active: true
  });

  useEffect(() => {
    const fetchPartners = async () => {
      setLoading(true);
      try {
        const data = await getLogisticsPartners();
        setPartners(data);
      } catch (error) {
        console.error("Error fetching logistics partners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  const handleToggleActive = async (partnerId: string, isActive: boolean) => {
    // In a real app, this would update the database
    const updatedPartners = partners.map(partner => 
      partner.id === partnerId ? { ...partner, active: isActive } : partner
    );
    
    setPartners(updatedPartners);
    
    toast({
      title: `Partner ${isActive ? 'Activated' : 'Deactivated'}`,
      description: `Successfully ${isActive ? 'activated' : 'deactivated'} the logistics partner.`,
      variant: "default"
    });
  };

  const handleAddPartner = () => {
    if (!newPartner.name || !newPartner.contactEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // Create a new partner object with mock data
    const newPartnerObj: LogisticsPartner = {
      id: `partner-${Date.now()}`,
      name: newPartner.name,
      contactEmail: newPartner.contactEmail,
      services: [
        { type: "standard", basePrice: 5.99, carbonFootprint: 2.4 },
        { type: "express", basePrice: 12.99, carbonFootprint: 4.8 }
      ],
      active: newPartner.active
    };
    
    // Add the new partner to the list
    setPartners([...partners, newPartnerObj]);
    
    // Reset form and close dialog
    setNewPartner({
      name: "",
      contactEmail: "",
      active: true
    });
    setOpenAddDialog(false);
    
    toast({
      title: "Partner Added",
      description: "New logistics partner has been added successfully.",
      variant: "default"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Logistics Partners</h3>
        
        <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center">
              <Plus className="h-4 w-4 mr-1" />
              Add Partner
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Logistics Partner</DialogTitle>
              <DialogDescription>
                Add a new shipping and logistics provider to the platform.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Partner Name</Label>
                <Input
                  id="name"
                  value={newPartner.name}
                  onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                  placeholder="Enter partner name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Contact Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newPartner.contactEmail}
                  onChange={(e) => setNewPartner({ ...newPartner, contactEmail: e.target.value })}
                  placeholder="Enter contact email"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={newPartner.active}
                  onCheckedChange={(checked) => setNewPartner({ ...newPartner, active: checked })}
                />
                <Label htmlFor="active">Active Partner</Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenAddDialog(false)}>Cancel</Button>
              <Button onClick={handleAddPartner}>Add Partner</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {loading ? (
        <div className="flex flex-col items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin mb-2" />
          <p>Loading partners...</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{partner.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {partner.contactEmail}
                      </CardDescription>
                    </div>
                    <Badge variant={partner.active ? "default" : "outline"}>
                      {partner.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Services</h4>
                    <div className="space-y-3">
                      {partner.services.map((service, idx) => (
                        <ServiceCard
                          key={idx}
                          type={service.type}
                          basePrice={service.basePrice}
                          carbonFootprint={service.carbonFootprint}
                        />
                      ))}
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1"
                      >
                        <Settings className="h-4 w-4 mr-1" />
                        Configure
                      </Button>
                      <Button 
                        variant={partner.active ? "destructive" : "default"} 
                        size="sm"
                        className="flex-1"
                        onClick={() => handleToggleActive(partner.id, !partner.active)}
                      >
                        {partner.active ? "Deactivate" : "Activate"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LogisticsPartners;
