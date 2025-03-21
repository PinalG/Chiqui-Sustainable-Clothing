
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DonationFormValues } from "./donationFormSchema";
import { useForm } from "react-hook-form";

interface StorageInfoFormProps {
  form: ReturnType<typeof useForm<DonationFormValues>>;
}

const StorageInfoForm = ({ form }: StorageInfoFormProps) => {
  return (
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
  );
};

export default StorageInfoForm;
