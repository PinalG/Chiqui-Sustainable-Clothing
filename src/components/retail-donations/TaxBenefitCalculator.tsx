
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DollarSign, FileText, Info, Download, Printer, TrendingUp, Calculator } from "lucide-react";
import TaxCalculationWidget from "./TaxCalculationWidget";
import { useAuth } from "@/contexts/AuthContext";

// Tax documents types
type TaxDocument = {
  id: string;
  title: string;
  description: string;
  dateIssued: string;
  taxYear: string;
  amountClaimed: number;
  status: "draft" | "submitted" | "approved" | "rejected";
};

const TaxBenefitCalculator = () => {
  const { userData } = useAuth();
  const [activeTab, setActiveTab] = useState("calculator");
  
  // Mock tax documents for demonstration
  const [taxDocuments] = useState<TaxDocument[]>([
    {
      id: "tax-doc-123456",
      title: "Q1 2024 Retail Donation Tax Certificate",
      description: "Itemized receipt for donated inventory in Q1 2024",
      dateIssued: "2024-04-15",
      taxYear: "2024",
      amountClaimed: 12450.75,
      status: "approved"
    },
    {
      id: "tax-doc-123457",
      title: "Warehouse Space Donation Valuation",
      description: "Storage space donation valuation for tax year 2024",
      dateIssued: "2024-03-20",
      taxYear: "2024",
      amountClaimed: 5238.50,
      status: "approved"
    },
    {
      id: "tax-doc-123458",
      title: "Annual Donation Summary 2023",
      description: "Cumulative donation summary for tax filing",
      dateIssued: "2024-01-05",
      taxYear: "2023",
      amountClaimed: 28350.00,
      status: "approved"
    },
    {
      id: "tax-doc-123459",
      title: "Q2 2024 Retail Donation Tax Certificate",
      description: "Itemized receipt for donated inventory in Q2 2024",
      dateIssued: "2024-07-12",
      taxYear: "2024",
      amountClaimed: 8975.25,
      status: "submitted"
    }
  ]);

  const getStatusColor = (status: TaxDocument["status"]) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "submitted":
        return "bg-blue-100 text-blue-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Tax Benefit Center</h2>
        <p className="text-muted-foreground">
          Calculate, track, and optimize tax benefits from your Retail Donations
        </p>
      </div>
      
      {!userData?.taxId && (
        <Alert className="bg-soft-pink/10 border-soft-pink/20">
          <Info className="h-4 w-4 text-soft-pink" />
          <AlertTitle>Tax Information Required</AlertTitle>
          <AlertDescription>
            To generate official tax documents, please add your Tax ID and entity information in your profile settings.
          </AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Tax Benefit Management</CardTitle>
          <CardDescription>
            Maximize your tax advantages from Retail Donations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="calculator" className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                <span>Tax Calculator</span>
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Tax Documents</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="calculator" className="space-y-4">
              <TaxCalculationWidget 
                defaultDonationValue={10000}
                defaultStorageArea={2000}
              />
            </TabsContent>
            
            <TabsContent value="documents" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Your Tax Documents</h3>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5" />
                  View Tax Insights
                </Button>
              </div>
              
              <div className="space-y-3">
                {taxDocuments.map((doc) => (
                  <Card key={doc.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-center">
                      <div className="p-4 flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium">{doc.title}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(doc.status)}`}>
                            {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{doc.description}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                          <span className="flex items-center gap-1">
                            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                            ID: {doc.id}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                            ${doc.amountClaimed.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                          <span>Issued: {new Date(doc.dateIssued).toLocaleDateString()}</span>
                          <span>Tax Year: {doc.taxYear}</span>
                        </div>
                      </div>
                      <div className="bg-muted/10 p-4 flex md:flex-col gap-2 justify-end">
                        <Button variant="ghost" size="sm" className="gap-1.5">
                          <Download className="h-4 w-4" />
                          <span className="hidden md:inline">Download</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-1.5">
                          <Printer className="h-4 w-4" />
                          <span className="hidden md:inline">Print</span>
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxBenefitCalculator;
