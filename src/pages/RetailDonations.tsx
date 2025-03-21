
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PackagePlus, QrCode, DollarSign, ClipboardList, FileText, Info, Scan, History } from "lucide-react";
import RetailDonationForm from "@/components/retail-donations/RetailDonationForm";
import InventoryManagement from "@/components/retail-donations/InventoryManagement";
import QrCodeGenerator from "@/components/retail-donations/QrCodeGenerator";
import QrCodeScanner from "@/components/retail-donations/QrCodeScanner";
import QrCodeTrackingHistory from "@/components/retail-donations/QrCodeTrackingHistory";
import TaxBenefitCalculator from "@/components/retail-donations/TaxBenefitCalculator";
import DonationReports from "@/components/retail-donations/DonationReports";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";

const RetailDonations = () => {
  const [activeTab, setActiveTab] = useState("register");
  const { userData } = useAuth();
  
  // Check if user has retailer role
  const isRetailer = userData?.role === "retailer" || userData?.role === "admin";

  return (
    <div className="space-y-6 animate-enter">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Retail Donations</h1>
          <p className="text-muted-foreground">
            Register inventory items for donation without physically moving them until sold.
          </p>
        </div>
        
        {!isRetailer && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 bg-soft-pink/10 text-soft-pink rounded-full">
                <Info className="h-4 w-4" />
                Retailer Feature
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-xs">
                <p>Retail donations are primarily for retail partners. As a non-retailer, you can explore the interface but some functionality may be limited.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle>Retail Donation Management</CardTitle>
          <CardDescription>
            Create, track, and manage your retail donations from a central dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="register" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-7 gap-2 md:gap-4">
              <TabsTrigger value="register" className="flex items-center gap-2">
                <PackagePlus className="h-4 w-4" />
                <span className="hidden md:inline">Register</span>
              </TabsTrigger>
              <TabsTrigger value="inventory" className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                <span className="hidden md:inline">Inventory</span>
              </TabsTrigger>
              <TabsTrigger value="qrcode" className="flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                <span className="hidden md:inline">QR Generate</span>
              </TabsTrigger>
              <TabsTrigger value="qrscan" className="flex items-center gap-2">
                <Scan className="h-4 w-4" />
                <span className="hidden md:inline">QR Scan</span>
              </TabsTrigger>
              <TabsTrigger value="qrtrack" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                <span className="hidden md:inline">QR Track</span>
              </TabsTrigger>
              <TabsTrigger value="tax" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span className="hidden md:inline">Tax Benefits</span>
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden md:inline">Reports</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="register" className="mt-6">
              <RetailDonationForm onComplete={() => setActiveTab("inventory")} />
            </TabsContent>
            
            <TabsContent value="inventory" className="mt-6">
              <InventoryManagement />
            </TabsContent>
            
            <TabsContent value="qrcode" className="mt-6">
              <QrCodeGenerator />
            </TabsContent>
            
            <TabsContent value="qrscan" className="mt-6">
              <QrCodeScanner />
            </TabsContent>
            
            <TabsContent value="qrtrack" className="mt-6">
              <QrCodeTrackingHistory />
            </TabsContent>
            
            <TabsContent value="tax" className="mt-6">
              <TaxBenefitCalculator />
            </TabsContent>
            
            <TabsContent value="reports" className="mt-6">
              <DonationReports />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default RetailDonations;
