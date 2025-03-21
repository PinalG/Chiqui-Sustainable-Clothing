
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PackagePlus, QrCode, DollarSign, ClipboardList, FileText } from "lucide-react";
import PaperDonationForm from "@/components/paper-donations/PaperDonationForm";
import InventoryManagement from "@/components/paper-donations/InventoryManagement";
import QrCodeGenerator from "@/components/paper-donations/QrCodeGenerator";
import TaxBenefitCalculator from "@/components/paper-donations/TaxBenefitCalculator";
import DonationReports from "@/components/paper-donations/DonationReports";

const PaperDonations = () => {
  const [activeTab, setActiveTab] = useState("register");

  return (
    <div className="space-y-6 animate-enter">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paper Donations</h1>
        <p className="text-muted-foreground">
          Register inventory items for donation without physically moving them until sold.
        </p>
      </div>

      <Card className="glass-morphism">
        <CardHeader>
          <CardTitle>Paper Donation Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="register" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
                <span className="hidden md:inline">QR Codes</span>
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
              <PaperDonationForm onComplete={() => setActiveTab("inventory")} />
            </TabsContent>
            
            <TabsContent value="inventory" className="mt-6">
              <InventoryManagement />
            </TabsContent>
            
            <TabsContent value="qrcode" className="mt-6">
              <QrCodeGenerator />
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

export default PaperDonations;
