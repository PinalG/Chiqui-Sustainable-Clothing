
import { useState } from "react";
import { FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ImagePlus, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import ImageAnalyzer from "@/components/ai/ImageAnalyzer";
import { ItemAnalysisResult } from "@/lib/geminiService";
import { useToast } from "@/hooks/use-toast";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "./donationFormSchema";

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string) => void;
  onAiAnalysisComplete: (result: ItemAnalysisResult) => void;
}

const ImageUploader = ({ onImageUpload, onAiAnalysisComplete }: ImageUploaderProps) => {
  const { toast } = useToast();
  const [showAiAnalyzer, setShowAiAnalyzer] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "The image must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Only JPG, PNG and WebP images are accepted",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const imageUrl = e.target.result as string;
        setCurrentImage(imageUrl);
        onImageUpload(imageUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAiAnalysisComplete = (result: ItemAnalysisResult) => {
    onAiAnalysisComplete(result);
    setShowAiAnalyzer(false);
    
    toast({
      title: "AI Analysis Applied",
      description: `Category: ${result.category}, Value: $${result.estimatedValue.toFixed(2)}, Condition: ${result.condition}`,
    });
  };

  return (
    <AnimatePresence>
      {!showAiAnalyzer && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-2"
        >
          <div className="flex justify-between items-center">
            <FormLabel>Item Image (Optional)</FormLabel>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => setShowAiAnalyzer(true)}
              className="gap-1.5 text-soft-pink"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Use AI Analysis
            </Button>
          </div>
          <div className="flex items-center space-x-4">
            <label className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-soft-pink transition-colors">
              <input
                type="file"
                className="hidden"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={handleImageUpload}
              />
              {currentImage ? (
                <img
                  src={currentImage}
                  alt="Item preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="flex flex-col items-center text-gray-500">
                  <ImagePlus className="w-8 h-8 mb-2" />
                  <span className="text-xs">Upload Image</span>
                </div>
              )}
            </label>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                Upload an image of the item (max 5MB). This helps in categorization and quality assessment.
              </p>
            </div>
          </div>
        </motion.div>
      )}
      
      {showAiAnalyzer && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border border-soft-pink/20 bg-soft-pink/5">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium flex items-center">
                  <Sparkles className="h-4 w-4 mr-2 text-soft-pink" />
                  AI Image Analysis
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowAiAnalyzer(false)}
                >
                  Cancel
                </Button>
              </div>
              <ImageAnalyzer onAnalysisComplete={handleAiAnalysisComplete} />
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageUploader;
