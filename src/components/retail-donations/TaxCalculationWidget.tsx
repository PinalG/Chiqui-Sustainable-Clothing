
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DownloadCloud, Share2, Calculator, DollarSign, Warehouse, Building, Calendar } from 'lucide-react';
import { calculateTaxBenefit, calculateStorageBenefit, formatCurrency, calculateEffectiveTaxRate } from './donationUtils';

interface TaxCalculationWidgetProps {
  defaultDonationValue?: number;
  defaultStorageArea?: number;
}

const TaxCalculationWidget = ({ 
  defaultDonationValue = 5000, 
  defaultStorageArea = 1000 
}: TaxCalculationWidgetProps) => {
  const [donationValue, setDonationValue] = useState(defaultDonationValue);
  const [storageArea, setStorageArea] = useState(defaultStorageArea);
  const [category, setCategory] = useState<string>('Apparel');
  const [storageType, setStorageType] = useState<string>('Warehouse');
  const [location, setLocation] = useState<string>('Urban');
  const [fiscalYear, setFiscalYear] = useState<string>('2024');
  const [corporateTaxRate, setCorporateTaxRate] = useState<number>(21);
  const [totalRevenue, setTotalRevenue] = useState<number>(1000000);
  
  // Calculate tax benefits
  const donationBenefit = calculateTaxBenefit(donationValue, category, fiscalYear);
  const storageBenefit = calculateStorageBenefit(storageArea, storageType, location);
  const totalBenefit = donationBenefit + storageBenefit;
  
  // Calculate effective tax rate reduction
  const effectiveTaxRateReduction = calculateEffectiveTaxRate(
    corporateTaxRate,
    totalBenefit,
    totalRevenue
  );
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-soft-pink" />
          Tax Benefit Calculator
        </CardTitle>
        <CardDescription>
          Calculate potential tax benefits from Retail Donations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic Calculation</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="donationValue" className="flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  Donation Value
                </Label>
                <Input
                  id="donationValue"
                  type="number"
                  value={donationValue}
                  onChange={(e) => setDonationValue(Number(e.target.value))}
                  min={0}
                  step={100}
                />
                <p className="text-sm text-muted-foreground">
                  Total estimated value of donated inventory
                </p>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="storageArea" className="flex items-center gap-1.5">
                  <Warehouse className="h-4 w-4 text-muted-foreground" />
                  Storage Area (sq ft)
                </Label>
                <Input
                  id="storageArea"
                  type="number"
                  value={storageArea}
                  onChange={(e) => setStorageArea(Number(e.target.value))}
                  min={0}
                  step={100}
                />
                <p className="text-sm text-muted-foreground">
                  Storage space used for donated inventory
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="category">Donation Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Apparel">Apparel</SelectItem>
                    <SelectItem value="Footwear">Footwear</SelectItem>
                    <SelectItem value="Accessories">Accessories</SelectItem>
                    <SelectItem value="Home Textiles">Home Textiles</SelectItem>
                    <SelectItem value="Children's Items">Children's Items</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="fiscalYear" className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Fiscal Year
                </Label>
                <Select value={fiscalYear} onValueChange={setFiscalYear}>
                  <SelectTrigger id="fiscalYear">
                    <SelectValue placeholder="Select fiscal year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="storageType" className="flex items-center gap-1.5">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  Storage Type
                </Label>
                <Select value={storageType} onValueChange={setStorageType}>
                  <SelectTrigger id="storageType">
                    <SelectValue placeholder="Select storage type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Warehouse">Warehouse</SelectItem>
                    <SelectItem value="Retail Space">Retail Space</SelectItem>
                    <SelectItem value="Climate Controlled">Climate Controlled</SelectItem>
                    <SelectItem value="Outdoor">Outdoor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="location">Location Type</Label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger id="location">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Urban">Urban</SelectItem>
                    <SelectItem value="Suburban">Suburban</SelectItem>
                    <SelectItem value="Rural">Rural</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="corporateTaxRate">Corporate Tax Rate (%)</Label>
                <Input
                  id="corporateTaxRate"
                  type="number"
                  value={corporateTaxRate}
                  onChange={(e) => setCorporateTaxRate(Number(e.target.value))}
                  min={0}
                  max={50}
                  step={0.5}
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="totalRevenue">Annual Revenue ($)</Label>
                <Input
                  id="totalRevenue"
                  type="number"
                  value={totalRevenue}
                  onChange={(e) => setTotalRevenue(Number(e.target.value))}
                  min={0}
                  step={10000}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <Separator className="my-6" />
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <p className="text-sm font-medium text-muted-foreground">Donation Benefit</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(donationBenefit)}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <p className="text-sm font-medium text-muted-foreground">Storage Benefit</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(storageBenefit)}</p>
              </CardContent>
            </Card>
            
            <Card className="col-span-2 md:col-span-1 bg-soft-pink/10">
              <CardContent className="p-4">
                <p className="text-sm font-medium text-muted-foreground">Total Benefit</p>
                <p className="text-2xl font-bold mt-1 text-soft-pink">{formatCurrency(totalBenefit)}</p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-muted/10 border-soft-pink/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-baseline">
                <p className="text-sm font-medium">Effective Tax Rate Reduction</p>
                <p className="text-xl font-bold text-soft-pink">{effectiveTaxRateReduction.toFixed(2)}%</p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Estimated reduction in effective tax rate based on your annual revenue
              </p>
            </CardContent>
          </Card>
          
          <div className="text-sm text-muted-foreground mt-2">
            <p className="italic">
              Note: This is an estimate based on current tax regulations. Please consult your tax professional for final determination.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-4 border-t pt-6">
        <Button variant="outline" className="flex-1 gap-2">
          <DownloadCloud className="h-4 w-4" />
          Export Report
        </Button>
        <Button className="flex-1 gap-2">
          <Share2 className="h-4 w-4" />
          Share Calculation
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TaxCalculationWidget;
