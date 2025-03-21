import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DollarSign, BarChart4, FileSpreadsheet, Calculator, Download, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

// Mock tax benefit calculation
const calculateTaxBenefit = (inventoryValue: number, storageSpace: number, taxRate: number) => {
  const inventoryBenefit = inventoryValue * 0.3; // 30% of inventory value
  const storageBenefit = storageSpace * 2.5; // $2.50 per sq ft
  const totalBenefit = inventoryBenefit + storageBenefit;
  const taxSavings = totalBenefit * (taxRate / 100);
  
  return {
    inventoryBenefit,
    storageBenefit,
    totalBenefit,
    taxSavings,
    effectiveRate: (taxSavings / inventoryValue) * 100
  };
};

const TaxBenefitCalculator = () => {
  const { toast } = useToast();
  const [inventoryValue, setInventoryValue] = useState(10000);
  const [storageSpace, setStorageSpace] = useState(500);
  const [taxRate, setTaxRate] = useState(21);
  const [year, setYear] = useState("2023");
  const [quarter, setQuarter] = useState("Q2");
  
  const taxBenefit = calculateTaxBenefit(inventoryValue, storageSpace, taxRate);
  
  const generateReport = () => {
    toast({
      title: "Report Generated",
      description: `Tax benefit report for ${quarter} ${year} has been generated.`,
    });
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="calculator">
        <TabsList className="mb-4">
          <TabsTrigger value="calculator" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Tax Benefit Calculator
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Tax Reports
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="calculator" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Inventory Value (USD)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      min="0"
                      className="pl-9 w-28 text-right"
                      value={inventoryValue}
                      onChange={(e) => setInventoryValue(Number(e.target.value))}
                    />
                  </div>
                </div>
                <Slider
                  value={[inventoryValue]}
                  min={0}
                  max={100000}
                  step={1000}
                  onValueChange={(value) => setInventoryValue(value[0])}
                />
                <p className="text-xs text-muted-foreground">
                  The total value of inventory items registered for paper donation.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Storage Space (sq ft)</label>
                  <Input
                    type="number"
                    min="0"
                    className="w-28 text-right"
                    value={storageSpace}
                    onChange={(e) => setStorageSpace(Number(e.target.value))}
                  />
                </div>
                <Slider
                  value={[storageSpace]}
                  min={0}
                  max={5000}
                  step={50}
                  onValueChange={(value) => setStorageSpace(value[0])}
                />
                <p className="text-xs text-muted-foreground">
                  The physical storage space allocated for the donated inventory.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Corporate Tax Rate (%)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    className="w-28 text-right"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                  />
                </div>
                <Slider
                  value={[taxRate]}
                  min={0}
                  max={40}
                  step={0.5}
                  onValueChange={(value) => setTaxRate(value[0])}
                />
                <p className="text-xs text-muted-foreground">
                  Your company's effective corporate tax rate.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <Card className="glass-morphism">
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium mb-4">Tax Benefit Summary</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b">
                      <div className="flex items-center">
                        <span>Inventory Benefit</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 ml-1.5 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>30% of inventory value as tax deduction</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <span className="font-medium">${taxBenefit.inventoryBenefit.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b">
                      <div className="flex items-center">
                        <span>Storage Space Benefit</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 ml-1.5 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>$2.50 per sq ft of storage space as tax deduction</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <span className="font-medium">${taxBenefit.storageBenefit.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b">
                      <div className="flex items-center">
                        <span>Total Tax Deduction</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 ml-1.5 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Combined inventory and storage space benefits</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <span className="font-medium">${taxBenefit.totalBenefit.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b">
                      <div className="flex items-center">
                        <span>Effective Tax Rate</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 ml-1.5 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Actual tax savings as a percentage of inventory value</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <span className="font-medium">{taxBenefit.effectiveRate.toFixed(2)}%</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-3 mt-2 bg-soft-pink/10 rounded-md px-3">
                      <div className="flex items-center font-medium">
                        <span>Estimated Tax Savings</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 ml-1.5 text-soft-pink" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Total tax deduction multiplied by your tax rate</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <span className="text-xl font-bold text-soft-pink">${taxBenefit.taxSavings.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Button className="w-full flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Generate Tax Benefit Report
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                Note: This calculator provides estimates only. Please consult with your tax professional for accurate tax advice specific to your situation.
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="text-sm font-medium block mb-2">Filter by Year</label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2021">2021</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <label className="text-sm font-medium block mb-2">Filter by Quarter</label>
              <Select value={quarter} onValueChange={setQuarter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select quarter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Quarters</SelectItem>
                  <SelectItem value="Q1">Q1 (Jan-Mar)</SelectItem>
                  <SelectItem value="Q2">Q2 (Apr-Jun)</SelectItem>
                  <SelectItem value="Q3">Q3 (Jul-Sep)</SelectItem>
                  <SelectItem value="Q4">Q4 (Oct-Dec)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button variant="outline" className="h-10" onClick={generateReport}>
                Generate New Report
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Available Tax Reports</h3>
            
            <div className="space-y-3">
              {[
                { name: "Q2 2023 Tax Benefit Report", date: "June 30, 2023", items: 245, value: 42750.80 },
                { name: "Q1 2023 Tax Benefit Report", date: "March 31, 2023", items: 187, value: 36250.45 },
                { name: "Q4 2022 Tax Benefit Report", date: "December 31, 2022", items: 310, value: 58420.20 },
                { name: "Q3 2022 Tax Benefit Report", date: "September 30, 2022", items: 175, value: 32150.75 },
              ].map((report, index) => (
                <Card key={index} className="backdrop-blur-sm bg-white/90 border-none shadow-sm">
                  <CardContent className="p-4 flex flex-col md:flex-row justify-between items-center">
                    <div>
                      <h4 className="font-medium">{report.name}</h4>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <BarChart4 className="h-3.5 w-3.5 mr-1.5" />
                        <span>{report.items} items • ${report.value.toFixed(2)} • Generated on {report.date}</span>
                      </div>
                    </div>
                    <div className="flex mt-3 md:mt-0">
                      <Button variant="outline" size="sm" className="flex items-center gap-1.5 mr-2">
                        <Download className="h-3.5 w-3.5" />
                        PDF
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                        <Download className="h-3.5 w-3.5" />
                        CSV
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaxBenefitCalculator;
