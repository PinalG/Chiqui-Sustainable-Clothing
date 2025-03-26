
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

  // Add a new donation
  const addDonation = async (donationData: Omit<DonationItem, 'id' | 'userId' | 'createDate' | 'updateDate' | 'status'>) => {
    if (!user || !userInteractions) {
      toast.error("You must be logged in to donate");
      return null;
    }

    try {
      const newDonation: DonationItem = {
        id: uuidv4(),
        userId: user.uid,
        ...donationData,
        status: 'pending',
        createDate: Date.now(),
        updateDate: Date.now(),
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
      } else {
        // In production, update Firestore
        const interactionsDocRef = doc(db, "userInteractions", user.uid);
        await updateDoc(interactionsDocRef, {
          donations: arrayUnion(newDonation),
          lastInteractionDate: Date.now()
        });
      }

      toast.success("Donation submitted successfully!");
      return newDonation;
    } catch (error) {
      console.error("Failed to add donation:", error);
      toast.error("Failed to submit donation. Please try again.");
      return null;
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
    addSocialInteraction
  };
}
