
import { useState } from 'react';
import { analyzeClothingItem, ItemAnalysisResult } from '@/lib/geminiService';
import { useToast } from '@/hooks/use-toast';

interface UseGeminiOptions {
  onSuccess?: (result: ItemAnalysisResult) => void;
  onError?: (error: Error) => void;
}

export function useGemini(options?: UseGeminiOptions) {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ItemAnalysisResult | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const analyzeImage = async (imageData: string) => {
    setIsAnalyzing(true);
    setProgress(0);
    setError(null);

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 15;
        return newProgress >= 90 ? 90 : newProgress;
      });
    }, 300);

    try {
      // Call the Gemini service
      const analysisResult = await analyzeClothingItem(imageData);
      
      // Complete the progress bar
      clearInterval(progressInterval);
      setProgress(100);
      
      // Set the result
      setResult(analysisResult);
      
      // Call success callback if provided
      if (options?.onSuccess) {
        options.onSuccess(analysisResult);
      }

      toast({
        title: "Analysis complete",
        description: "AI analysis completed successfully",
      });

      return analysisResult;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error during analysis');
      
      setError(error);
      
      if (options?.onError) {
        options.onError(error);
      }

      toast({
        title: "Analysis failed",
        description: error.message,
        variant: "destructive",
      });

      clearInterval(progressInterval);
      setProgress(0);
      
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setResult(null);
    setError(null);
    setProgress(0);
  };

  return {
    analyzeImage,
    resetAnalysis,
    isAnalyzing,
    progress,
    result,
    error
  };
}
