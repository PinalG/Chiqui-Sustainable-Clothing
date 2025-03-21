
import { ItemAnalysisResult } from "@/lib/geminiService";

export interface DonationItem {
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

export interface RetailDonationFormProps {
  onComplete?: () => void;
}

export interface DonationBatchSummary {
  batchId: string;
  batchName: string;
  items: DonationItem[];
  storageLocation: string;
  storageArea: number;
  storageType?: string;
  taxEntityName?: string;
  taxId?: string;
  registrationDate: string;
  status: string;
  totalItems: number;
  totalValue: number;
  taxBenefit: number;
  storageBenefit: number;
  notes?: string;
}
