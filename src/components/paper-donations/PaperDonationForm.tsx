
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
import { Upload, Plus, Minus, ImagePlus, PackagePlus, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import ImageAnalyzer from "@/components/ai/ImageAnalyzer";
import { ItemAnalysisResult } from "@/lib/geminiService";
import { motion, AnimatePresence } from "framer-motion";

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
  description: z.string().optional(),
});

type DonationFormValues = z.infer<typeof donationSchema>;

interface DonationItem {
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
}

interface PaperDonationFormProps {
  onComplete?: () => void;
}

const PaperDonationForm = ({ onComplete }: PaperDonationFormProps) => {
  const { toast } = useToast();
  const { userData } = useAuth();
  const [items, setItems] = useState<DonationItem[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAiAnalyzer, setShowAiAnalyzer] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<ItemAnalysisResult | null>(null);

  const form = useForm<DonationFormValues>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      batchName: `Batch #${Math.floor(1000 + Math.random() * 9000)}`,
      itemCategory: "",
      quantity: 1,
      estimatedValue: 0,
      storageLocation: userData?.organizationName ? `${userData.organizationName} Main Warehouse` : "",
      storageArea: 0,
      description: "",
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
      name: `Item #${items.length + 1}`,
      category: data.itemCategory,
      quantity: data.quantity,
      value: data.estimatedValue,
      image: images.length > 0 ? images[images.length - 1] : undefined,
      condition: aiAnalysisResult?.condition,
      conditionScore: aiAnalysisResult?.conditionScore,
      sustainabilityScore: aiAnalysisResult?.sustainabilityScore,
      tags: aiAnalysisResult?.tags,
      description: data.description || aiAnalysisResult?.description,
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
      console.log("Donation submitted:", {
        batchName: data.batchName,
        items,
        storageLocation: data.storageLocation,
        storageArea: data.storageArea,
        totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
        totalValue: items.reduce((sum, item) => sum + item.value, 0),
      });

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Donation registered",
        description: `${data.batchName} has been successfully registered for paper donation.`,
      });

      // Reset form and state
      setItems([]);
      form.reset();
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error registering your donation.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = items.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Form {...form}>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="batchName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Batch Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>
              
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
          <h3 className="text-lg font-medium">Batch Summary</h3>
          
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
                    <p className="text-2xl font-bold">${(totalValue * 0.30).toFixed(2)}</p>
                  </CardContent>
                </Card>
                <Card className="backdrop-blur-sm bg-white/90 border-none shadow-md">
                  <CardContent className="p-4">
                    <p className="text-sm font-medium text-muted-foreground">Storage Benefit</p>
                    <p className="text-2xl font-bold">
                      ${(form.getValues().storageArea * 2.50).toFixed(2)}
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
                {items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
                    <div className="flex items-center space-x-3">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center">
                          <PackagePlus className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{item.category}</p>
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
                  Register Paper Donation
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaperDonationForm;
