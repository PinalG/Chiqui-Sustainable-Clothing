
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  DollarSign, 
  BarChart4, 
  FileSpreadsheet, 
  Calculator, 
  Download, 
  Info, 
  Calendar, 
  Building2, 
  FileCheck,
  FilePlus2,
  Briefcase,
  ClipboardCheck,
  BookOpen,
  AlertCircle,
  Check
} from "lucide-react";
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
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { 
  calculateTaxBenefit, 
  calculateStorageBenefit, 
  formatCurrency, 
  calculateTaxDeadline,
  taxEntitySchema,
  isValidFederalTaxId,
  calculateEffectiveTaxRate,
  generateTaxDocumentId
} from "./donationUtils";
import { useAuth } from "@/contexts/AuthContext";

// Define tax form schema
const taxFormSchema = z.object({
  inventoryValue: z.coerce.number().min(0),
  storageSpace: z.coerce.number().min(0),
  corporateTaxRate: z.coerce.number().min(0).max(40),
  annualRevenue: z.coerce.number().min(0).optional(),
  fiscalYear: z.string(),
  quarter: z.string(),
  donationCategory: z.string().optional(),
  storageType: z.string().optional(),
  location: z.string().optional(),
  taxEntityName: z.string().min(2, { message: "Tax entity name is required" }),
  taxId: z.string().min(9, { message: "Valid Tax ID is required" }),
  entityType: z.string().optional(),
});

type TaxFormValues = z.infer<typeof taxFormSchema>;

// Enhanced tax benefit calculation utility
const calculateDetailedTaxBenefit = (values: TaxFormValues) => {
  const inventoryBenefit = calculateTaxBenefit(
    values.inventoryValue, 
    values.donationCategory, 
    values.fiscalYear
  );
  
  const storageBenefit = calculateStorageBenefit(
    values.storageSpace, 
    values.storageType, 
    values.location
  );
  
  const totalBenefit = inventoryBenefit + storageBenefit;
  const taxSavings = totalBenefit * (values.corporateTaxRate / 100);
  
  const effectiveRate = values.annualRevenue && values.annualRevenue > 0
    ? calculateEffectiveTaxRate(values.corporateTaxRate, totalBenefit, values.annualRevenue)
    : (taxSavings / values.inventoryValue) * 100;
  
  return {
    inventoryBenefit,
    storageBenefit,
    totalBenefit,
    taxSavings,
    effectiveRate
  };
};

const TaxBenefitCalculator = () => {
  const { toast } = useToast();
  const { userData } = useAuth();
  const [activeTab, setActiveTab] = useState("calculator");
  const [savedEntities, setSavedEntities] = useState<any[]>([]);
  const [complianceScore, setComplianceScore] = useState(85);
  const [showComplianceCheck, setShowComplianceCheck] = useState(false);
  const [complianceItems, setComplianceItems] = useState({
    validTaxId: true,
    validDocumentation: true,
    properCategorization: true,
    valueAssessment: false,
    documentationTimeliness: true
  });
  
  const currentYear = new Date().getFullYear().toString();
  
  const form = useForm<TaxFormValues>({
    resolver: zodResolver(taxFormSchema),
    defaultValues: {
      inventoryValue: 10000,
      storageSpace: 500,
      corporateTaxRate: 21,
      annualRevenue: 1000000,
      fiscalYear: currentYear,
      quarter: "Q2",
      donationCategory: "Apparel",
      storageType: "Warehouse",
      location: "Urban",
      taxEntityName: userData?.displayName ? `${userData.displayName}'s Corp` : "Your Corporation",
      taxId: "12-3456789",
      entityType: "corporation",
    },
  });

  const watchValues = form.watch();
  const taxBenefit = calculateDetailedTaxBenefit(watchValues);
  
  // Load saved tax entities from localStorage (simulating database storage)
  useEffect(() => {
    const savedData = localStorage.getItem("taxEntities");
    if (savedData) {
      setSavedEntities(JSON.parse(savedData));
    } else {
      // Create sample data if none exists
      const sampleEntities = [
        { 
          id: "entity-1", 
          name: "EcoFashion Inc.", 
          taxId: "12-3456789", 
          entityType: "corporation",
          lastUpdated: "2023-06-30" 
        },
        { 
          id: "entity-2", 
          name: "Green Textiles LLC", 
          taxId: "98-7654321", 
          entityType: "llc",
          lastUpdated: "2023-03-15" 
        },
      ];
      setSavedEntities(sampleEntities);
      localStorage.setItem("taxEntities", JSON.stringify(sampleEntities));
    }
  }, []);
  
  // Update compliance score based on compliance items
  useEffect(() => {
    const trueItems = Object.values(complianceItems).filter(Boolean).length;
    const totalItems = Object.values(complianceItems).length;
    setComplianceScore(Math.round((trueItems / totalItems) * 100));
  }, [complianceItems]);
  
  const generateReport = () => {
    const reportId = generateTaxDocumentId();
    const reportData = {
      id: reportId,
      name: `${watchValues.quarter} ${watchValues.fiscalYear} Tax Benefit Report`,
      date: format(new Date(), "MMMM dd, yyyy"),
      fiscalYear: watchValues.fiscalYear,
      quarter: watchValues.quarter,
      inventoryValue: watchValues.inventoryValue,
      storageSpace: watchValues.storageSpace,
      taxEntityName: watchValues.taxEntityName,
      taxId: watchValues.taxId,
      inventoryBenefit: taxBenefit.inventoryBenefit,
      storageBenefit: taxBenefit.storageBenefit,
      totalBenefit: taxBenefit.totalBenefit,
      taxSavings: taxBenefit.taxSavings,
      taxRate: watchValues.corporateTaxRate,
      effectiveRate: taxBenefit.effectiveRate,
    };
    
    // Save the report in localStorage (would be database in real app)
    const savedReports = JSON.parse(localStorage.getItem("taxReports") || "[]");
    savedReports.unshift(reportData);
    localStorage.setItem("taxReports", JSON.stringify(savedReports));
    
    toast({
      title: "Report Generated",
      description: `${reportData.name} has been generated with ID: ${reportId}`,
    });
    
    // Switch to reports tab
    setActiveTab("reports");
  };
  
  const runComplianceCheck = () => {
    setShowComplianceCheck(true);
    
    // Simulate compliance check
    const validTaxId = isValidFederalTaxId(watchValues.taxId);
    
    setComplianceItems({
      validTaxId,
      validDocumentation: true,
      properCategorization: true,
      valueAssessment: Math.random() > 0.3, // Randomize for demo
      documentationTimeliness: Math.random() > 0.2, // Randomize for demo
    });
    
    toast({
      title: "Compliance Check Complete",
      description: validTaxId 
        ? "Your tax information passed our compliance check." 
        : "Please check your tax ID format.",
    });
  };
  
  const saveEntity = () => {
    const { taxEntityName, taxId, entityType } = watchValues;
    
    if (!taxEntityName || !taxId) {
      toast({
        title: "Validation Error",
        description: "Please provide tax entity name and ID",
        variant: "destructive",
      });
      return;
    }
    
    const newEntity = {
      id: `entity-${Date.now()}`,
      name: taxEntityName,
      taxId,
      entityType: entityType || "corporation",
      lastUpdated: format(new Date(), "yyyy-MM-dd")
    };
    
    const updatedEntities = [...savedEntities, newEntity];
    setSavedEntities(updatedEntities);
    localStorage.setItem("taxEntities", JSON.stringify(updatedEntities));
    
    toast({
      title: "Tax Entity Saved",
      description: `${taxEntityName} has been added to your saved entities.`,
    });
  };
  
  const renderTaxTips = () => {
    const tips = [
      "Paper donations allow you to claim tax benefits on both inventory and storage space.",
      "Proper item categorization can increase your tax benefits by up to 5%.",
      "Keep detailed records of all donation transactions for at least 7 years.",
      "Consider quarterly tax benefit reports to maximize your annual tax planning.",
      "Consult with a tax professional to ensure compliance with latest tax codes."
    ];
    
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Tax Optimization Tips</h3>
        <ul className="space-y-2">
          {tips.map((tip, index) => (
            <li key={index} className="flex gap-2">
              <BookOpen className="h-5 w-5 text-soft-pink shrink-0 mt-0.5" />
              <span className="text-sm">{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="calculator" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Tax Benefit Calculator
          </TabsTrigger>
          <TabsTrigger value="entities" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Tax Entities
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4" />
            Compliance Check
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Tax Reports
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="calculator" className="space-y-6">
          <Form {...form}>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="inventoryValue"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <div className="flex items-center justify-between">
                            <FormLabel>Inventory Value (USD)</FormLabel>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <FormControl>
                                <Input
                                  type="number"
                                  min="0"
                                  className="pl-9 w-28 text-right"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                            </div>
                          </div>
                          <Slider
                            value={[field.value]}
                            min={0}
                            max={100000}
                            step={1000}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                          <FormDescription>
                            The total value of inventory items registered for paper donation.
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="donationCategory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Donation Category</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Apparel">Apparel</SelectItem>
                              <SelectItem value="Footwear">Footwear</SelectItem>
                              <SelectItem value="Accessories">Accessories</SelectItem>
                              <SelectItem value="Home Textiles">Home Textiles</SelectItem>
                              <SelectItem value="Children's Items">Children's Items</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Different categories may qualify for different tax benefit rates.
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="storageSpace"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <div className="flex items-center justify-between">
                            <FormLabel>Storage Space (sq ft)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                className="w-28 text-right"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                          </div>
                          <Slider
                            value={[field.value]}
                            min={0}
                            max={5000}
                            step={50}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                          <FormDescription>
                            The physical storage space allocated for the donated inventory.
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="storageType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Storage Type</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Warehouse">Warehouse</SelectItem>
                                <SelectItem value="Retail Space">Retail Space</SelectItem>
                                <SelectItem value="Climate Controlled">Climate Controlled</SelectItem>
                                <SelectItem value="Outdoor">Outdoor</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location Type</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select location" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Urban">Urban</SelectItem>
                                <SelectItem value="Suburban">Suburban</SelectItem>
                                <SelectItem value="Rural">Rural</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="corporateTaxRate"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <div className="flex items-center justify-between">
                            <FormLabel>Corporate Tax Rate (%)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                className="w-28 text-right"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                          </div>
                          <Slider
                            value={[field.value]}
                            min={0}
                            max={40}
                            step={0.5}
                            onValueChange={(value) => field.onChange(value[0])}
                          />
                          <FormDescription>
                            Your company's effective corporate tax rate.
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="annualRevenue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Annual Revenue (Optional)</FormLabel>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                className="pl-9"
                                placeholder="1,000,000"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                              />
                            </FormControl>
                          </div>
                          <FormDescription>
                            Used to calculate impact on overall effective tax rate.
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Card className="bg-soft-pink/5 border-soft-pink/20">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FileCheck className="h-5 w-5 text-soft-pink" />
                        <h3 className="font-medium">Tax Entity Information</h3>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="taxEntityName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Entity Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="taxId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tax ID (EIN)</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="XX-XXXXXXX"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="entityType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Entity Type</FormLabel>
                              <Select value={field.value} onValueChange={field.onChange}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="corporation">Corporation</SelectItem>
                                  <SelectItem value="llc">LLC</SelectItem>
                                  <SelectItem value="partnership">Partnership</SelectItem>
                                  <SelectItem value="soleProprietorship">Sole Proprietorship</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="fiscalYear"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Fiscal Year</FormLabel>
                              <Select value={field.value} onValueChange={field.onChange}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select year" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value={currentYear}>{currentYear}</SelectItem>
                                  <SelectItem value={(parseInt(currentYear) - 1).toString()}>{parseInt(currentYear) - 1}</SelectItem>
                                  <SelectItem value={(parseInt(currentYear) + 1).toString()}>{parseInt(currentYear) + 1}</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-3 text-soft-pink"
                        type="button"
                        onClick={saveEntity}
                      >
                        <Building2 className="h-3.5 w-3.5 mr-1.5" />
                        Save Entity
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-6">
                  <Card className="glass-morphism">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                        <Calculator className="h-5 w-5 text-soft-pink" />
                        Tax Benefit Summary
                      </h3>
                      
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
                                  <p>
                                    {watchValues.donationCategory 
                                      ? `${watchValues.donationCategory} items qualify for special rates` 
                                      : "30% of inventory value as tax deduction"}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <span className="font-medium">{formatCurrency(taxBenefit.inventoryBenefit)}</span>
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
                                  <p>
                                    {watchValues.storageType
                                      ? `${watchValues.storageType} space has specific rates`
                                      : "$2.50 per sq ft of storage space as tax deduction"}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <span className="font-medium">{formatCurrency(taxBenefit.storageBenefit)}</span>
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
                          <span className="font-medium">{formatCurrency(taxBenefit.totalBenefit)}</span>
                        </div>
                        
                        <div className="flex justify-between items-center py-2 border-b">
                          <div className="flex items-center">
                            <span>Effective Tax Rate Reduction</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-4 w-4 ml-1.5 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Tax savings as a percentage of {watchValues.annualRevenue ? "annual revenue" : "inventory value"}</p>
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
                          <span className="text-xl font-bold text-soft-pink">{formatCurrency(taxBenefit.taxSavings)}</span>
                        </div>
                      </div>
                      
                      <div className="pt-4 flex flex-col gap-4">
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium block mb-1">Filing Deadline:</span> 
                          {calculateTaxDeadline(watchValues.fiscalYear).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                        
                        <div className="flex justify-between items-center gap-4 text-sm">
                          <span>Compliance Status:</span>
                          <Badge 
                            className={
                              isValidFederalTaxId(watchValues.taxId) 
                                ? "bg-green-100 text-green-800 hover:bg-green-100" 
                                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                            }
                          >
                            {isValidFederalTaxId(watchValues.taxId) ? "Valid" : "Needs Review"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button 
                      className="flex items-center gap-2"
                      onClick={generateReport}
                      type="button"
                    >
                      <FileSpreadsheet className="h-4 w-4" />
                      Generate Tax Benefit Report
                    </Button>
                    
                    <Button 
                      className="flex items-center gap-2" 
                      variant="outline"
                      onClick={runComplianceCheck}
                      type="button"
                    >
                      <ClipboardCheck className="h-4 w-4" />
                      Run Compliance Check
                    </Button>
                  </div>
                  
                  {renderTaxTips()}
                  
                  <p className="text-xs text-muted-foreground text-center">
                    Note: This calculator provides estimates only. Please consult with your tax professional for accurate tax advice specific to your situation.
                  </p>
                </div>
              </div>
            </form>
          </Form>
        </TabsContent>
        
        <TabsContent value="entities" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Saved Tax Entities</h3>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-1.5">
                  <FilePlus2 className="h-4 w-4" />
                  Add New Entity
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Tax Entity</DialogTitle>
                  <DialogDescription>
                    Add a new corporation or entity for tax benefits
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <FormLabel htmlFor="entityName" className="text-right">
                      Entity Name
                    </FormLabel>
                    <Input id="entityName" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <FormLabel htmlFor="taxIdInput" className="text-right">
                      Tax ID (EIN)
                    </FormLabel>
                    <Input id="taxIdInput" className="col-span-3" placeholder="XX-XXXXXXX" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <FormLabel htmlFor="entityTypeSelect" className="text-right">
                      Entity Type
                    </FormLabel>
                    <Select>
                      <SelectTrigger id="entityTypeSelect" className="col-span-3">
                        <SelectValue placeholder="Select entity type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="corporation">Corporation</SelectItem>
                        <SelectItem value="llc">LLC</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="soleProprietorship">Sole Proprietorship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="submit">Save Entity</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="space-y-4">
            {savedEntities.map((entity) => (
              <Card key={entity.id} className="backdrop-blur-sm bg-white/90 border-none shadow-sm">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-soft-pink" />
                        <h4 className="font-medium">{entity.name}</h4>
                        <Badge 
                          variant="outline" 
                          className="ml-2 text-xs capitalize"
                        >
                          {entity.entityType}
                        </Badge>
                      </div>
                      <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Briefcase className="h-3.5 w-3.5" />
                          <span>Tax ID: {entity.taxId}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>Last Updated: {entity.lastUpdated}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-soft-pink"
                        onClick={() => {
                          form.setValue('taxEntityName', entity.name);
                          form.setValue('taxId', entity.taxId);
                          form.setValue('entityType', entity.entityType);
                          setActiveTab('calculator');
                          
                          toast({
                            title: "Entity Loaded",
                            description: `${entity.name} has been loaded into the calculator.`,
                          });
                        }}
                      >
                        Use in Calculator
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="backdrop-blur-sm bg-white/90 border-none shadow-md h-min">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5 text-soft-pink" />
                  Compliance Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pb-6 space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Overall Compliance Score</h4>
                    <Badge 
                      className={
                        complianceScore >= 80 
                          ? "bg-green-100 text-green-800 hover:bg-green-100" 
                          : complianceScore >= 60 
                            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                            : "bg-red-100 text-red-800 hover:bg-red-100"
                      }
                    >
                      {complianceScore}%
                    </Badge>
                  </div>
                  <Progress value={complianceScore} className="h-2" />
                </div>
                
                {showComplianceCheck && (
                  <div className="space-y-4 border rounded-md p-4">
                    <h4 className="font-medium">Compliance Check Results</h4>
                    <ul className="space-y-2 text-sm">
                      {Object.entries(complianceItems).map(([key, value]) => (
                        <li key={key} className="flex justify-between items-center">
                          <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                          {value ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                              <Check className="h-3 w-3 mr-1" />
                              Pass
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Review
                            </Badge>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="pt-2">
                  <Button 
                    className="w-full flex items-center gap-2"
                    onClick={runComplianceCheck}
                  >
                    <FileCheck className="h-4 w-4" />
                    Run Compliance Check
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-4">
              <Card className="backdrop-blur-sm bg-white/90 border-none shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-soft-pink" />
                    Tax Documentation Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="rounded-full p-1 bg-soft-pink/10 mt-0.5">
                        <Check className="h-3 w-3 text-soft-pink" />
                      </div>
                      <span>Valid Federal Tax ID (EIN) for the donating entity</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full p-1 bg-soft-pink/10 mt-0.5">
                        <Check className="h-3 w-3 text-soft-pink" />
                      </div>
                      <span>Documented fair market value assessment of donated items</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full p-1 bg-soft-pink/10 mt-0.5">
                        <Check className="h-3 w-3 text-soft-pink" />
                      </div>
                      <span>Storage space measurements and location documentation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full p-1 bg-soft-pink/10 mt-0.5">
                        <Check className="h-3 w-3 text-soft-pink" />
                      </div>
                      <span>Itemized inventory list with condition assessments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full p-1 bg-soft-pink/10 mt-0.5">
                        <Check className="h-3 w-3 text-soft-pink" />
                      </div>
                      <span>Quarterly and annual donation summary reports</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="backdrop-blur-sm bg-white/90 border-none shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-soft-pink" />
                    Compliance Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 text-sm space-y-3">
                  <p>
                    Paper donations require meticulous documentation to ensure compliance with tax regulations. 
                    All donated items must remain in their registered storage location until sold or otherwise distributed.
                  </p>
                  <p>
                    Regular compliance checks are recommended to minimize audit risk. Our system automatically 
                    flags potential compliance issues based on IRS guidelines for charitable donations.
                  </p>
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" className="mt-2">
                      Download Compliance Guide
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="text-sm font-medium block mb-2">Filter by Year</label>
              <Select defaultValue={currentYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={currentYear}>{currentYear}</SelectItem>
                  <SelectItem value={(parseInt(currentYear) - 1).toString()}>{parseInt(currentYear) - 1}</SelectItem>
                  <SelectItem value={(parseInt(currentYear) - 2).toString()}>{parseInt(currentYear) - 2}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <label className="text-sm font-medium block mb-2">Filter by Quarter</label>
              <Select defaultValue="All">
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
            
            <div className="flex-1">
              <label className="text-sm font-medium block mb-2">Filter by Entity</label>
              <Select defaultValue="All">
                <SelectTrigger>
                  <SelectValue placeholder="Select entity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Entities</SelectItem>
                  {savedEntities.map(entity => (
                    <SelectItem key={entity.id} value={entity.id}>{entity.name}</SelectItem>
                  ))}
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
                { name: "Q2 2023 Tax Benefit Report", date: "June 30, 2023", items: 245, value: 42750.80, entity: "EcoFashion Inc." },
                { name: "Q1 2023 Tax Benefit Report", date: "March 31, 2023", items: 187, value: 36250.45, entity: "EcoFashion Inc." },
                { name: "Q4 2022 Tax Benefit Report", date: "December 31, 2022", items: 310, value: 58420.20, entity: "Green Textiles LLC" },
                { name: "Q3 2022 Tax Benefit Report", date: "September 30, 2022", items: 175, value: 32150.75, entity: "Green Textiles LLC" },
              ].map((report, index) => (
                <Card key={index} className="backdrop-blur-sm bg-white/90 border-none shadow-sm">
                  <CardContent className="p-4 flex flex-col md:flex-row justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="h-4 w-4 text-soft-pink" />
                        <h4 className="font-medium">{report.name}</h4>
                        <Badge variant="outline" className="ml-1">{report.entity}</Badge>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <BarChart4 className="h-3.5 w-3.5 mr-1.5" />
                        <span>{report.items} items • {formatCurrency(report.value)} • Generated on {report.date}</span>
                      </div>
                    </div>
                    <div className="flex mt-3 md:mt-0">
                      <Button variant="outline" size="sm" className="flex items-center gap-1.5 mr-2">
                        <Download className="h-3.5 w-3.5" />
                        PDF
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-1.5 mr-2">
                        <Download className="h-3.5 w-3.5" />
                        CSV
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                        <FileCheck className="h-3.5 w-3.5" />
                        IRS Format
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Separator className="my-6" />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Schedule Tax Filings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-soft-pink/5 border-soft-pink/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Quarterly Filing Reminder</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm">Next filing deadline:</p>
                        <p className="font-medium">April 15, {parseInt(currentYear) + 1}</p>
                      </div>
                      <Button size="sm">Set Reminder</Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-soft-pink/5 border-soft-pink/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Need Filing Assistance?</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm">Connect with a tax professional</p>
                      <Button size="sm" variant="outline">Find Expert</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaxBenefitCalculator;
