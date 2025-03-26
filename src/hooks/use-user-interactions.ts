
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { doc, getDoc, setDoc, collection, addDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { DonationItem, SocialInteraction, UserInteraction } from '@/types/DonationTypes';
import { v4 as uuidv4 } from 'uuid';

export function useUserInteractions() {
  const { user, userData, isLoading } = useAuth();
  const [userInteractions, setUserInteractions] = useState<UserInteraction | null>(null);
  const [isLoadingInteractions, setIsLoadingInteractions] = useState(true);

  // Load user interactions from localStorage or mock data in development
  useEffect(() => {
    const loadUserInteractions = async () => {
      if (!user || isLoading) return;

      setIsLoadingInteractions(true);
      
      try {
        if (process.env.NODE_ENV === 'development') {
          // In development, load from localStorage
          const savedInteractions = localStorage.getItem(`userInteractions_${user.uid}`);
          
          if (savedInteractions) {
            setUserInteractions(JSON.parse(savedInteractions));
          } else {
            // Initialize with empty data
            const initialInteractions: UserInteraction = {
              donations: [],
              socialInteractions: [],
              lastInteractionDate: Date.now()
            };
            
            localStorage.setItem(`userInteractions_${user.uid}`, JSON.stringify(initialInteractions));
            setUserInteractions(initialInteractions);
          }
        } else {
          // In production, fetch from Firestore
          const interactionsDocRef = doc(db, "userInteractions", user.uid);
          const interactionsDoc = await getDoc(interactionsDocRef);
          
          if (interactionsDoc.exists()) {
            setUserInteractions(interactionsDoc.data() as UserInteraction);
          } else {
            // Initialize with empty data
            const initialInteractions: UserInteraction = {
              donations: [],
              socialInteractions: [],
              lastInteractionDate: Date.now()
            };
            
            await setDoc(interactionsDocRef, initialInteractions);
            setUserInteractions(initialInteractions);
          }
        }
      } catch (error) {
        console.error("Failed to load user interactions:", error);
        toast.error("Failed to load your activity data. Please try again.");
      } finally {
        setIsLoadingInteractions(false);
      }
    };

    loadUserInteractions();
  }, [user, isLoading]);

  // Calculate sustainability impact based on item category and condition
  const calculateSustainabilityImpact = (category: string, condition: string) => {
    // Base values
    let waterSaved = 0;
    let co2Reduced = 0;
    let wasteReduced = 0;
    
    // Adjust based on category
    switch (category.toLowerCase()) {
      case 'clothing':
        waterSaved = 700 + Math.random() * 300; // 700-1000 gallons
        co2Reduced = 10 + Math.random() * 5; // 10-15 lbs
        wasteReduced = 2 + Math.random() * 1; // 2-3 lbs
        break;
      case 'shoes':
        waterSaved = 500 + Math.random() * 200; // 500-700 gallons
        co2Reduced = 15 + Math.random() * 5; // 15-20 lbs
        wasteReduced = 3 + Math.random() * 1.5; // 3-4.5 lbs
        break;
      case 'accessories':
        waterSaved = 300 + Math.random() * 100; // 300-400 gallons
        co2Reduced = 5 + Math.random() * 3; // 5-8 lbs
        wasteReduced = 1 + Math.random() * 0.5; // 1-1.5 lbs
        break;
      default:
        waterSaved = 400 + Math.random() * 200; // 400-600 gallons
        co2Reduced = 8 + Math.random() * 4; // 8-12 lbs
        wasteReduced = 2 + Math.random() * 1; // 2-3 lbs
    }
    
    // Adjust based on condition (better condition means more reuse potential)
    const conditionMultiplier = 
      condition === 'new' ? 1.5 :
      condition === 'likenew' ? 1.3 :
      condition === 'good' ? 1.0 :
      condition === 'fair' ? 0.8 :
      0.5; // poor
    
    return {
      waterSaved: parseFloat((waterSaved * conditionMultiplier).toFixed(1)),
      co2Reduced: parseFloat((co2Reduced * conditionMultiplier).toFixed(1)),
      wasteReduced: parseFloat((wasteReduced * conditionMultiplier).toFixed(1))
    };
  };

  // Add a new donation
  const addDonation = async (donationData: Omit<DonationItem, 'id' | 'userId' | 'createDate' | 'updateDate' | 'status' | 'sustainabilityImpact'>) => {
    if (!user || !userInteractions) {
      toast.error("You must be logged in to donate");
      return null;
    }

    try {
      // Calculate sustainability impact
      const sustainabilityImpact = calculateSustainabilityImpact(
        donationData.category,
        donationData.condition
      );
      
      const newDonation: DonationItem = {
        id: uuidv4(),
        userId: user.uid,
        ...donationData,
        status: 'pending',
        createDate: Date.now(),
        updateDate: Date.now(),
        sustainabilityImpact
      };

      // Update local state
      const updatedInteractions = {
        ...userInteractions,
        donations: [...userInteractions.donations, newDonation],
        lastInteractionDate: Date.now()
      };
      
      setUserInteractions(updatedInteractions);

      // Persist to storage
      if (process.env.NODE_ENV === 'development') {
        localStorage.setItem(`userInteractions_${user.uid}`, JSON.stringify(updatedInteractions));
        
        // Also update user sustainability score
        if (userData) {
          const updatedUserData = {
            ...userData,
            rewardsPoints: (userData.rewardsPoints || 0) + 25, // Award 25 points for donating
            sustainabilityScore: (userData.sustainabilityScore || 0) + 5 // Increase sustainability score
          };
          
          localStorage.setItem(`userData_${user.uid}`, JSON.stringify(updatedUserData));
        }
      } else {
        // In production, update Firestore
        const interactionsDocRef = doc(db, "userInteractions", user.uid);
        await updateDoc(interactionsDocRef, {
          donations: arrayUnion(newDonation),
          lastInteractionDate: Date.now()
        });
        
        // Also update user rewards and sustainability score
        if (userData) {
          const userDocRef = doc(db, "users", user.uid);
          await updateDoc(userDocRef, {
            rewardsPoints: (userData.rewardsPoints || 0) + 25,
            sustainabilityScore: (userData.sustainabilityScore || 0) + 5
          });
        }
      }

      return newDonation;
    } catch (error) {
      console.error("Failed to add donation:", error);
      toast.error("Failed to submit donation. Please try again.");
      return null;
    }
  };

  // Update an existing donation
  const updateDonation = async (donationId: string, updates: Partial<DonationItem>) => {
    if (!user || !userInteractions) {
      toast.error("You must be logged in to update a donation");
      return false;
    }

    try {
      // Find the donation index
      const donationIndex = userInteractions.donations.findIndex(d => d.id === donationId);
      
      if (donationIndex === -1) {
        toast.error("Donation not found");
        return false;
      }
      
      // Create updated donation
      const updatedDonation = {
        ...userInteractions.donations[donationIndex],
        ...updates,
        updateDate: Date.now()
      };
      
      // Update donations array
      const updatedDonations = [...userInteractions.donations];
      updatedDonations[donationIndex] = updatedDonation;
      
      // Update local state
      const updatedInteractions = {
        ...userInteractions,
        donations: updatedDonations,
        lastInteractionDate: Date.now()
      };
      
      setUserInteractions(updatedInteractions);
      
      // Persist to storage
      if (process.env.NODE_ENV === 'development') {
        localStorage.setItem(`userInteractions_${user.uid}`, JSON.stringify(updatedInteractions));
      } else {
        // In production, update Firestore
        const interactionsDocRef = doc(db, "userInteractions", user.uid);
        await setDoc(interactionsDocRef, updatedInteractions);
      }
      
      return true;
    } catch (error) {
      console.error("Failed to update donation:", error);
      toast.error("Failed to update donation. Please try again.");
      return false;
    }
  };

  // Add a social interaction (share, like, comment)
  const addSocialInteraction = async (
    interactionType: 'share' | 'like' | 'comment',
    platform?: 'twitter' | 'facebook' | 'instagram' | 'linkedin',
    referenceId?: string,
    content?: string
  ) => {
    if (!user || !userInteractions) {
      toast.error("You must be logged in to share");
      return null;
    }

    try {
      const newInteraction: SocialInteraction = {
        id: uuidv4(),
        userId: user.uid,
        type: interactionType,
        platform,
        referenceId,
        content,
        createDate: Date.now()
      };

      // Update local state
      const updatedInteractions = {
        ...userInteractions,
        socialInteractions: [...userInteractions.socialInteractions, newInteraction],
        lastInteractionDate: Date.now()
      };
      
      setUserInteractions(updatedInteractions);

      // Persist to storage
      if (process.env.NODE_ENV === 'development') {
        localStorage.setItem(`userInteractions_${user.uid}`, JSON.stringify(updatedInteractions));
        
        // If this is a share, also update user rewards in localStorage
        if (interactionType === 'share' && userData) {
          const updatedUserData = {
            ...userData,
            rewardsPoints: (userData.rewardsPoints || 0) + 10, // Award 10 points for sharing
            sustainabilityScore: (userData.sustainabilityScore || 0) + 2 // Increase sustainability score
          };
          
          localStorage.setItem(`userData_${user.uid}`, JSON.stringify(updatedUserData));
        }
      } else {
        // In production, update Firestore
        const interactionsDocRef = doc(db, "userInteractions", user.uid);
        await updateDoc(interactionsDocRef, {
          socialInteractions: arrayUnion(newInteraction),
          lastInteractionDate: Date.now()
        });
        
        // If this is a share, also update user rewards
        if (interactionType === 'share' && userData) {
          const userDocRef = doc(db, "users", user.uid);
          await updateDoc(userDocRef, {
            rewardsPoints: (userData.rewardsPoints || 0) + 10,
            sustainabilityScore: (userData.sustainabilityScore || 0) + 2
          });
        }
      }

      if (interactionType === 'share') {
        toast.success("Shared successfully! +10 reward points");
      }
      
      return newInteraction;
    } catch (error) {
      console.error("Failed to record social interaction:", error);
      toast.error("Failed to complete action. Please try again.");
      return null;
    }
  };

  return {
    userInteractions,
    isLoadingInteractions,
    addDonation,
    updateDonation,
    addSocialInteraction
  };
}
