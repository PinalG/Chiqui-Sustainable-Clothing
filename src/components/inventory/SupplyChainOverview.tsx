
import { Card, CardContent } from "@/components/ui/card";
import { Package, TrendingUp, AlertTriangle, Truck, Users, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const SupplyChainOverview = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const supplyChainHealth = 87;
  
  const handleOptimizeSupplyChain = () => {
    toast({
      title: "Supply Chain Optimization",
      description: "Optimization process has been initiated. You'll be notified when it's complete.",
    });
  };
  
  const handleResolveIssue = (issue: string) => {
    toast({
      title: "Issue Resolution",
      description: `A resolution for "${issue}" has been initiated.`,
    });
  };

  const navigateToTab = (tab: string) => {
    setActiveTab(tab);
  };

  // We're mocking the setActiveTab function here
  const setActiveTab = (tab: string) => {
    // This would typically be passed down from the parent component
    // but for this component we're just using it with navigate
    navigate("/inventory", { state: { activeTab: tab } });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-morphism">
          <CardContent className="p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-soft-pink" />
                <h3 className="font-medium">Inventory Status</h3>
              </div>
              <span className="text-green-600 font-medium">Healthy</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Items in stock:</div>
              <div className="text-right font-medium">3,245</div>
              <div>Low stock items:</div>
              <div className="text-right font-medium text-amber-600">18</div>
              <div>Out of stock:</div>
              <div className="text-right font-medium text-red-600">5</div>
            </div>
            <Button 
              variant="link" 
              className="mt-2 justify-start p-0 h-auto text-soft-pink" 
              onClick={() => navigateToTab("inventory")}
            >
              View inventory
            </Button>
          </CardContent>
        </Card>
        
        <Card className="glass-morphism">
          <CardContent className="p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-soft-pink" />
                <h3 className="font-medium">Shipments</h3>
              </div>
              <span className="text-amber-600 font-medium">3 Delayed</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>In transit:</div>
              <div className="text-right font-medium">12</div>
              <div>Delivered (7d):</div>
              <div className="text-right font-medium">38</div>
              <div>Processing:</div>
              <div className="text-right font-medium">7</div>
            </div>
            <Button 
              variant="link" 
              className="mt-2 justify-start p-0 h-auto text-soft-pink" 
              onClick={() => navigateToTab("tracking")}
            >
              Track shipments
            </Button>
          </CardContent>
        </Card>
        
        <Card className="glass-morphism">
          <CardContent className="p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-soft-pink" />
                <h3 className="font-medium">Partners</h3>
              </div>
              <span className="text-green-600 font-medium">All Active</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Logistics partners:</div>
              <div className="text-right font-medium">6</div>
              <div>Warehouses:</div>
              <div className="text-right font-medium">3</div>
              <div>Retailers:</div>
              <div className="text-right font-medium">8</div>
            </div>
            <Button 
              variant="link" 
              className="mt-2 justify-start p-0 h-auto text-soft-pink" 
              onClick={() => navigateToTab("partners")}
            >
              Manage partners
            </Button>
          </CardContent>
        </Card>
        
        <Card className="glass-morphism">
          <CardContent className="p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-soft-pink" />
                <h3 className="font-medium">Performance</h3>
              </div>
              <span className="text-amber-600 font-medium">↑ 3.2%</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Order accuracy:</div>
              <div className="text-right font-medium">98.5%</div>
              <div>On-time delivery:</div>
              <div className="text-right font-medium">94.2%</div>
              <div>Carbon footprint:</div>
              <div className="text-right font-medium text-green-600">↓ 8.7%</div>
            </div>
            <Button 
              variant="link" 
              className="mt-2 justify-start p-0 h-auto text-soft-pink" 
              onClick={() => navigateToTab("analytics")}
            >
              View analytics
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Card className="glass-morphism p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h3 className="text-xl font-medium">Supply Chain Health</h3>
            <p className="text-muted-foreground">Overall performance of your supply chain</p>
          </div>
          <Button onClick={handleOptimizeSupplyChain}>
            Optimize Supply Chain
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Health Score</span>
              <span className="text-sm font-medium">{supplyChainHealth}%</span>
            </div>
            <Progress value={supplyChainHealth} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Critical</span>
              <span>Optimal</span>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <h4 className="text-lg font-medium mb-4">Attention Required</h4>
          <div className="space-y-4">
            <Card className="bg-amber-50 border border-amber-200">
              <CardContent className="p-4 flex items-start justify-between">
                <div className="flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium">Low stock alert: Summer Collection items</h5>
                    <p className="text-sm text-muted-foreground">8 items below reorder threshold</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleResolveIssue("Low stock alert")}>
                  Resolve
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-red-50 border border-red-200">
              <CardContent className="p-4 flex items-start justify-between">
                <div className="flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium">Shipping delay: Order #45982</h5>
                    <p className="text-sm text-muted-foreground">Estimated 2-day delay due to logistics issue</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleResolveIssue("Shipping delay")}>
                  Resolve
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border border-green-200">
              <CardContent className="p-4 flex items-start justify-between">
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium">Recently resolved: Warehouse space optimization</h5>
                    <p className="text-sm text-muted-foreground">Warehouse efficiency increased by 12%</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" disabled>
                  Resolved
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SupplyChainOverview;
