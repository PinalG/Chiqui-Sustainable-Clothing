
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ItemAnalysisResult } from "@/lib/geminiService";
import { Badge } from "@/components/ui/badge";

// Import our new components and types
import { DonationItem, RetailDonationFormProps } from "./types";
import { donationSchema, DonationFormValues } from "./donationFormSchema";
import { calculateTaxBenefit, calculateStorageBenefit, generateBatchId, generateDefaultBatchName } from "./donationUtils";
import DonationSuccessScreen from "./DonationSuccessScreen";
import BatchSummary from "./BatchSummary";
import ImageUploader from "./ImageUploader";
import StorageInfoForm from "./StorageInfoForm";

const RetailDonationForm = ({ onComplete }: RetailDonationFormProps) => {
  const { toast } = useToast();
  const { userData } = useAuth();
  const [items, setItems] = useState<DonationItem[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<ItemAnalysisResult | null>(null);
  const [donationComplete, setDonationComplete] = useState(false);
  const [batchId, setBatchId] = useState<string>(generateBatchId());

  const form = useForm<DonationFormValues>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      batchName: generateDefaultBatchName(),
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

  const handleImageUpload = (imageUrl: string) => {
    setImages([...images, imageUrl]);
  };

  const handleAiAnalysisComplete = (result: ItemAnalysisResult) => {
    setAiAnalysisResult(result);
    
    // Update form with AI analysis results
    form.setValue("itemCategory", result.category);
    form.setValue("estimatedValue", result.estimatedValue);
    form.setValue("description", result.description);
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

  const handleSubmit = async (data: DonationFormValues) => {
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

  const resetForm = () => {
    setItems([]);
    setDonationComplete(false);
    form.reset();
    setBatchId(generateBatchId());
    
    if (onComplete) {
      onComplete();
    }
  };

  const totalValue = items.reduce((sum, item) => sum + item.value, 0);
  const taxBenefit = calculateTaxBenefit(totalValue);
  const storageBenefit = calculateStorageBenefit(form.getValues().storageArea);

  // If donation is complete, show success state
  if (donationComplete) {
    return (
      <DonationSuccessScreen 
        batchId={batchId}
        taxBenefit={taxBenefit}
        storageBenefit={storageBenefit}
        onReset={resetForm}
      />
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
              
              <StorageInfoForm form={form} />
              
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
              
              <ImageUploader 
                onImageUpload={handleImageUpload}
                onAiAnalysisComplete={handleAiAnalysisComplete}
              />
              
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

        <BatchSummary 
          items={items}
          onRemoveItem={removeItem}
          onSubmit={form.handleSubmit(handleSubmit)}
          isSubmitting={isSubmitting}
          form={form}
        />
      </div>
    </div>
  );
};

export default RetailDonationForm;
