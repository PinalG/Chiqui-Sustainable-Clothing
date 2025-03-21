
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface DonationSuccessScreenProps {
  batchId: string;
  taxBenefit: number;
  storageBenefit: number;
  onReset: () => void;
}

const DonationSuccessScreen = ({ 
  batchId, 
  taxBenefit, 
  storageBenefit, 
  onReset 
}: DonationSuccessScreenProps) => {
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
        <Button onClick={onReset}>
          Register Another Donation
        </Button>
      </motion.div>
    </div>
  );
};

export default DonationSuccessScreen;
