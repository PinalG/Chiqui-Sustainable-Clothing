
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChartPie, LineChart, ShieldCheck, BarChart4 } from "lucide-react";
import SustainabilityReports from "@/components/analytics/SustainabilityReports";
import ComplianceDashboard from "@/components/analytics/ComplianceDashboard";
import { usePerformance } from "@/contexts/PerformanceContext";

const AnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState("performance");
  const { trackEvent } = usePerformance();
  
  // Track tab changes for analytics
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    trackEvent('analytics', 'tab_change', tab);
  };

  return (
    <div className="space-y-6 animate-enter">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics & Reporting</h1>
        <p className="text-muted-foreground">
          Track performance, sustainability impact, and compliance across the platform
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-3 gap-4">
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            <span>Performance Monitoring</span>
          </TabsTrigger>
          <TabsTrigger value="sustainability" className="flex items-center gap-2">
            <ChartPie className="h-4 w-4" />
            <span>Sustainability Impact</span>
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            <span>Compliance</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="mt-6">
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle>Performance Monitoring</CardTitle>
              <CardDescription>
                Track application performance and user engagement metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Page Load Time</CardTitle>
                    <CardDescription>Average load time across all pages</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">1.25s</div>
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <span>↓ 0.3s</span>
                      <span className="text-muted-foreground">compared to last week</span>
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">User Sessions</CardTitle>
                    <CardDescription>Active user sessions today</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">1,284</div>
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <span>↑ 12%</span>
                      <span className="text-muted-foreground">compared to yesterday</span>
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">API Response</CardTitle>
                    <CardDescription>Average API response time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">210ms</div>
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <span>↓ 45ms</span>
                      <span className="text-muted-foreground">compared to last week</span>
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Error Rates</CardTitle>
                  <CardDescription>Application errors by category</CardDescription>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <BarChart4 className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                    <p>Performance monitoring is active and recording data.</p>
                    <p>Detailed error analytics will be available soon.</p>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sustainability" className="mt-6">
          <SustainabilityReports />
        </TabsContent>
        
        <TabsContent value="compliance" className="mt-6">
          <ComplianceDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
