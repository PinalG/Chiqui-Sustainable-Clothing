
export interface DonationItem {
  id: string;
  userId: string;
  itemName: string;
  category: string;
  condition: string;
  description?: string;
  imageUrl?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'processed';
  createDate: number;
  updateDate: number;
  sustainabilityImpact?: {
    waterSaved?: number; // gallons
    co2Reduced?: number; // lbs
    wasteReduced?: number; // lbs
  };
}

export interface SocialInteraction {
  id: string;
  userId: string;
  type: 'share' | 'like' | 'comment';
  platform?: 'twitter' | 'facebook' | 'instagram' | 'linkedin';
  referenceId?: string; // ID of the content being interacted with
  createDate: number;
  content?: string; // For comments or custom share text
}

export interface UserInteraction {
  donations: DonationItem[];
  socialInteractions: SocialInteraction[];
  lastInteractionDate: number;
}
