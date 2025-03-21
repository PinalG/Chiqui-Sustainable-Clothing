
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { DonationItem } from "./types";
import DonationItemList from "./DonationItemList";
import { calculateStorageBenefit, calculateTaxBenefit } from "./donationUtils";
import { DonationFormValues } from "./donationFormSchema";
import { useForm } from "react-hook-form";

interface BatchSummaryProps {
  items: DonationItem[];
  onRemoveItem: (index: number) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  form: ReturnType<typeof useForm<DonationFormValues>>;
}

const BatchSummary = ({ items, onRemoveItem, onSubmit, isSubmitting, form }: BatchSummaryProps) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = items.reduce((sum, item) => sum + item.value, 0);
  const taxBenefit = calculateTaxBenefit(totalValue);
  const storageBenefit = calculateStorageBenefit(form.getValues().storageArea);
  const totalBenefit = taxBenefit + storageBenefit;

  return (
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
          
          <DonationItemList items={items} onRemoveItem={onRemoveItem} />
          
          <div className="flex justify-end">
            <Button 
              onClick={onSubmit}
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
      ) : (
        <DonationItemList items={items} onRemoveItem={onRemoveItem} />
      )}
    </div>
  );
};

export default BatchSummary;
