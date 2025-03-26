
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { analyzeClothingItem, ItemAnalysisResult } from '@/lib/geminiService';
import { createDefaultAnimate } from "@/lib/animations";

interface UseAiAnalysisOptions {
  onAnalysisStart?: () => void;
  onAnalysisComplete?: (result: ItemAnalysisResult) => void;
  onAnalysisError?: (error: Error) => void;
}

/**
 * Hook for handling AI image analysis with proper loading states and animations
 */
export function useAiAnalysis(options?: UseAiAnalysisOptions) {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ItemAnalysisResult | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [animationState, setAnimationState] = useState({
    isVisible: false,
    text: "Analyzing image..."
  });

  // Animation controller
  const animate = createDefaultAnimate();

  const startAnimation = (text: string) => {
    setAnimationState({
      isVisible: true,
      text
    });
  };

  const stopAnimation = () => {
    setAnimationState({
      ...animationState,
      isVisible: false
    });
  };

  /**
   * Analyze an image using the Gemini AI service
   */
  const analyzeImage = async (imageData: string) => {
    setIsAnalyzing(true);
    setProgress(0);
    setError(null);
    
    if (options?.onAnalysisStart) {
      options.onAnalysisStart();
    }

    // Start animation
    startAnimation("AI analyzing your image...");

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 15;
        return newProgress >= 90 ? 90 : newProgress;
      });
    }, 300);

    try {
      // Update animation text as analysis progresses
      setTimeout(() => {
        setAnimationState(prev => ({
          ...prev,
          text: "Identifying item features..."
        }));
      }, 800);

      setTimeout(() => {
        setAnimationState(prev => ({
          ...prev,
          text: "Calculating sustainability metrics..."
        }));
      }, 1600);

      // Call the Gemini service
      const analysisResult = await analyzeClothingItem(imageData);
      
      // Complete the progress bar
      clearInterval(progressInterval);
      setProgress(100);
      
      // Final animation text
      setAnimationState(prev => ({
        ...prev,
        text: "Analysis complete!"
      }));

      // Short delay to show completion state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Set the result
      setResult(analysisResult);
      
      // Call success callback if provided
      if (options?.onAnalysisComplete) {
        options.onAnalysisComplete(analysisResult);
      }

      toast({
        title: "Analysis complete",
        description: `Item identified as ${analysisResult.category} in ${analysisResult.condition} condition`,
      });

      // Stop animation after a short delay
      setTimeout(stopAnimation, 500);

      return analysisResult;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error during analysis');
      
      setError(error);
      
      if (options?.onAnalysisError) {
        options.onAnalysisError(error);
      }

      toast({
        title: "Analysis failed",
        description: error.message,
        variant: "destructive",
      });

      clearInterval(progressInterval);
      setProgress(0);
      stopAnimation();
      
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  };

  /**
   * Reset analysis state
   */
  const resetAnalysis = () => {
    setResult(null);
    setError(null);
    setProgress(0);
    stopAnimation();
  };

  return {
    analyzeImage,
    resetAnalysis,
    isAnalyzing,
    progress,
    result,
    error,
    animationState
  };
}
