
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Upload, Plus, Minus, ImagePlus, PackagePlus, Sparkles, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import ImageAnalyzer from "@/components/ai/ImageAnalyzer";
import { ItemAnalysisResult } from "@/lib/geminiService";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const donationSchema = z.object({
  batchName: z.string().min(2, {
    message: "Batch name must be at least 2 characters.",
  }),
  itemCategory: z.string({
    required_error: "Please select a category.",
  }),
  quantity: z.coerce.number().min(1, {
    message: "Quantity must be at least 1.",
  }),
  estimatedValue: z.coerce.number().min(0, {
    message: "Value must be a positive number.",
  }),
  storageLocation: z.string().min(2, {
    message: "Storage location is required.",
  }),
  storageArea: z.coerce.number().min(0, {
    message: "Storage area must be a positive number.",
  }),
  storageType: z.string().optional(),
  notes: z.string().optional(),
  description: z.string().optional(),
  taxEntityName: z.string().min(2, {
    message: "Tax entity name is required for tax benefits.",
  }).optional(),
  taxId: z.string().optional(),
});

type DonationFormValues = z.infer<typeof donationSchema>;

interface DonationItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  value: number;
  image?: string;
  condition?: string;
  conditionScore?: number;
  sustainabilityScore?: number;
  tags?: string[];
  description?: string;
  status: "registered" | "pending" | "approved";
}

interface PaperDonationFormProps {
  onComplete?: () => void;
}

const RetailDonationForm = ({ onComplete }: PaperDonationFormProps) => {
  const { toast } = useToast();
  const { userData } = useAuth();
  const [items, setItems] = useState<DonationItem[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAiAnalyzer, setShowAiAnalyzer] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<ItemAnalysisResult | null>(null);
  const [donationComplete, setDonationComplete] = useState(false);
  const [batchId, setBatchId] = useState<string>(`RTL-${Math.floor(100000 + Math.random() * 900000)}`);

  const form = useForm<DonationFormValues>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      batchName: `Batch #${Math.floor(1000 + Math.random() * 9000)}`,
      itemCategory: "",
      quantity: 1,
      estimatedValue: 0,
      storageLocation: userData?.organizationName ? `${userData.organizationName} Main Warehouse` : "",
      storageArea: 100,
      storageType: "warehouse",
      notes: "",
      description: "",
      taxEntityName: userData?.organizationName || "",
      taxId: userData?.taxId || "",
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "The image must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Only JPG, PNG and WebP images are accepted",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImages([...images, e.target.result as string]);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAiAnalysisComplete = (result: ItemAnalysisResult) => {
    setAiAnalysisResult(result);
    
    // Update form with AI analysis results
    form.setValue("itemCategory", result.category);
    form.setValue("estimatedValue", result.estimatedValue);
    form.setValue("description", result.description);
    
    // Hide the AI analyzer
    setShowAiAnalyzer(false);
    
    toast({
      title: "AI Analysis Applied",
      description: `Category: ${result.category}, Value: $${result.estimatedValue.toFixed(2)}, Condition: ${result.condition}`,
    });
  };

  const addItem = (data: DonationFormValues) => {
    const newItem: DonationItem = {
      id: `item-${Math.random().toString(36).substring(2, 9)}`,
      name: `${data.itemCategory} - ${data.quantity} units`,
      category: data.itemCategory,
      quantity: data.quantity,
      value: data.estimatedValue,
      image: images.length > 0 ? images[images.length - 1] : undefined,
      condition: aiAnalysisResult?.condition,
      conditionScore: aiAnalysisResult?.conditionScore,
      sustainabilityScore: aiAnalysisResult?.sustainabilityScore,
      tags: aiAnalysisResult?.tags,
      description: data.description || aiAnalysisResult?.description,
      status: "registered"
    };

    setItems([...items, newItem]);
    setImages([]);
    setAiAnalysisResult(null);

    // Reset some form fields after adding an item
    form.setValue("itemCategory", "");
    form.setValue("quantity", 1);
    form.setValue("estimatedValue", 0);
    form.setValue("description", "");

    toast({
      title: "Item added",
      description: `${data.quantity} ${data.itemCategory} item(s) added to the batch`,
    });
  };

  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const calculateTaxBenefit = (totalValue: number): number => {
    // Simplified tax benefit calculation - typically 30% of donation value
    return totalValue * 0.30;
  };

  const calculateStorageBenefit = (storageArea: number): number => {
    // Simplified storage benefit calculation - $2.50 per sq ft
    return storageArea * 2.50;
  };

  const onSubmit = async (data: DonationFormValues) => {
    if (items.length === 0) {
      toast({
        title: "No items added",
        description: "Please add at least one item to the batch",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real application, this would make an API call to save the donation
      const donationData = {
        batchId: batchId,
        batchName: data.batchName,
        items,
        storageLocation: data.storageLocation,
        storageArea: data.storageArea,
        storageType: data.storageType,
        taxEntityName: data.taxEntityName,
        taxId: data.taxId,
        registrationDate: new Date().toISOString(),
        status: "approved",
        totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
        totalValue: items.reduce((sum, item) => sum + item.value, 0),
        taxBenefit: calculateTaxBenefit(items.reduce((sum, item) => sum + item.value, 0)),
        storageBenefit: calculateStorageBenefit(data.storageArea),
        notes: data.notes,
      };

      console.log("Retail donation submitted:", donationData);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Donation registered",
        description: `${data.batchName} has been successfully registered with batch ID ${batchId}.`,
      });

      // Show completion state
      setDonationComplete(true);

      // Reset form and state after a short delay
      setTimeout(() => {
        setItems([]);
        setDonationComplete(false);
        form.reset();
        setBatchId(`RTL-${Math.floor(100000 + Math.random() * 900000)}`);
        
        if (onComplete) {
          onComplete();
        }
      }, 3000);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error registering your retail donation.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = items.reduce((sum, item) => sum + item.value, 0);
  const taxBenefit = calculateTaxBenefit(totalValue);
  const storageBenefit = calculateStorageBenefit(form.getValues().storageArea);
  const totalBenefit = taxBenefit + storageBenefit;

  // If donation is complete, show success state
  if (donationComplete) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="rounded-full bg-green-100 p-3 mb-4">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Retail Donation Registered!</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Your items have been registered for donation without physically moving them. 
            They will remain in your storage location until sold.
          </p>
          <div className="bg-soft-pink/10 rounded-lg py-3 px-6 mb-6">
            <p className="font-medium text-soft-pink">Batch ID: {batchId}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Estimated Tax Benefit</p>
              <p className="text-2xl font-bold">${taxBenefit.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Storage Benefit</p>
              <p className="text-2xl font-bold">${storageBenefit.toFixed(2)}</p>
            </div>
          </div>
          <Button onClick={() => {
            setDonationComplete(false);
            setItems([]);
            form.reset();
            setBatchId(`RTL-${Math.floor(100000 + Math.random() * 900000)}`);
            if (onComplete) onComplete();
          }}>
            Register Another Donation
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Form {...form}>
            <form className="space-y-4">
              <div className="flex items-start justify-between">
                <FormField
                  control={form.control}
                  name="batchName"
                  render={({ field }) => (
                    <FormItem className="flex-1 mr-4">
                      <FormLabel>Batch Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="min-w-[140px] mt-8">
                  <Badge variant="outline" className="bg-soft-pink/5 text-soft-pink border-soft-pink/20 px-3 py-1.5 text-xs">
                    Batch ID: {batchId}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="itemCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="clothing">Clothing</SelectItem>
                          <SelectItem value="accessories">Accessories</SelectItem>
                          <SelectItem value="footwear">Footwear</SelectItem>
                          <SelectItem value="outerwear">Outerwear</SelectItem>
                          <SelectItem value="sportswear">Sportswear</SelectItem>
                          <SelectItem value="formalwear">Formalwear</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="estimatedValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Value (USD)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="taxEntityName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Entity Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        For tax benefit documentation
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="bg-muted/30 p-4 rounded-md border border-muted">
                <h3 className="text-sm font-medium mb-3">Storage Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="storageLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Storage Location</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="storageType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Storage Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || "warehouse"}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="warehouse">Warehouse</SelectItem>
                            <SelectItem value="retail-backroom">Retail Backroom</SelectItem>
                            <SelectItem value="distribution-center">Distribution Center</SelectItem>
                            <SelectItem value="offsite-storage">Offsite Storage</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <FormField
                    control={form.control}
                    name="storageArea"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Storage Area (sq ft)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormDescription>
                          For storage space tax benefits
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Storage Notes</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="mt-2 text-xs text-muted-foreground">
                  <p>
                    <span className="font-medium">Note:</span> Items will remain in this location until sold or requested to be moved.
                  </p>
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <AnimatePresence>
                {!showAiAnalyzer && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <FormLabel>Item Image (Optional)</FormLabel>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setShowAiAnalyzer(true)}
                        className="gap-1.5 text-soft-pink"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        Use AI Analysis
                      </Button>
                    </div>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-soft-pink transition-colors">
                        <input
                          type="file"
                          className="hidden"
                          accept=".jpg,.jpeg,.png,.webp"
                          onChange={handleImageUpload}
                        />
                        {images.length > 0 && images[images.length - 1] ? (
                          <img
                            src={images[images.length - 1]}
                            alt="Item preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="flex flex-col items-center text-gray-500">
                            <ImagePlus className="w-8 h-8 mb-2" />
                            <span className="text-xs">Upload Image</span>
                          </div>
                        )}
                      </label>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">
                          Upload an image of the item (max 5MB). This helps in categorization and quality assessment.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {showAiAnalyzer && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border border-soft-pink/20 bg-soft-pink/5">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-medium flex items-center">
                            <Sparkles className="h-4 w-4 mr-2 text-soft-pink" />
                            AI Image Analysis
                          </h3>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setShowAiAnalyzer(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                        <ImageAnalyzer onAnalysisComplete={handleAiAnalysisComplete} />
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="flex justify-end">
                <Button 
                  type="button"
                  onClick={() => form.handleSubmit(addItem)()}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Item to Batch
                </Button>
              </div>
            </form>
          </Form>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Batch Summary</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="inline-flex items-center text-sm text-soft-pink hover:underline cursor-help">
                  How it works
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p className="text-sm">
                    Retail donations allow you to register items without physically moving them until sold. 
                    You gain tax benefits for both the donated items and the storage space.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {items.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="backdrop-blur-sm bg-white/90 border-none shadow-md">
                  <CardContent className="p-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                    <p className="text-2xl font-bold">{totalItems}</p>
                  </CardContent>
                </Card>
                <Card className="backdrop-blur-sm bg-white/90 border-none shadow-md">
                  <CardContent className="p-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                    <p className="text-2xl font-bold">${totalValue.toFixed(2)}</p>
                  </CardContent>
                </Card>
                <Card className="backdrop-blur-sm bg-white/90 border-none shadow-md">
                  <CardContent className="p-4">
                    <p className="text-sm font-medium text-muted-foreground">Est. Tax Benefit</p>
                    <p className="text-2xl font-bold">${taxBenefit.toFixed(2)}</p>
                  </CardContent>
                </Card>
                <Card className="backdrop-blur-sm bg-white/90 border-none shadow-md">
                  <CardContent className="p-4">
                    <p className="text-sm font-medium text-muted-foreground">Storage Benefit</p>
                    <p className="text-2xl font-bold">${storageBenefit.toFixed(2)}</p>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="border-soft-pink/20 bg-soft-pink/5">
                <CardContent className="p-4">
                  <div className="flex items-baseline justify-between">
                    <h4 className="font-medium">Total Estimated Benefit</h4>
                    <p className="text-xl font-bold">${totalBenefit.toFixed(2)}</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Estimated tax deduction based on current rates. Consult your tax professional for final determination.
                  </p>
                </CardContent>
              </Card>
              
              <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
                {items.map((item, index) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
                    <div className="flex items-center space-x-3">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center">
                          <PackagePlus className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center">
                          <p className="font-medium">{item.category}</p>
                          <Badge className="ml-2 bg-green-100 text-green-800 text-xs">
                            {item.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} items • ${item.value.toFixed(2)}
                          {item.condition && ` • ${item.condition}`}
                        </p>
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {item.tags.slice(0, 2).map((tag, i) => (
                              <span key={i} className="px-1.5 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                                {tag}
                              </span>
                            ))}
                            {item.tags.length > 2 && (
                              <span className="px-1.5 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                                +{item.tags.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-md border border-dashed">
              <PackagePlus className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">No items added yet. Add items from the form to see them here.</p>
            </div>
          )}
          
          <div className="flex justify-end">
            <Button 
              onClick={form.handleSubmit(onSubmit)}
              disabled={items.length === 0 || isSubmitting}
              className="w-full flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Register Retail Donation
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetailDonationForm;
