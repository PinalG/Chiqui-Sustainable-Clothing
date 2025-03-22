
import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload,
  ImagePlus,
  Sparkles,
  Tag,
  Gauge,
  DollarSign,
  Leaf,
  RefreshCw,
  CheckCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ItemAnalysisResult } from "@/lib/geminiService";
import { useGemini } from "@/hooks/use-gemini";

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

interface ImageAnalyzerProps {
  onAnalysisComplete?: (result: ItemAnalysisResult) => void;
}

const ImageAnalyzer = ({ onAnalysisComplete }: ImageAnalyzerProps) => {
  const { toast } = useToast();
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { 
    analyzeImage,
    resetAnalysis,
    isAnalyzing,
    progress,
    result: analysisResult,
  } = useGemini({
    onSuccess: (result) => {
      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }
    }
  });

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
        setImage(e.target.result as string);
        resetAnalysis();
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    setImage(null);
    resetAnalysis();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAnalyzeImage = async () => {
    if (!image) return;
    await analyzeImage(image);
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        accept=".jpg,.jpeg,.png,.webp"
        onChange={handleImageUpload}
      />

      <AnimatePresence>
        {!image ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="glass-morphism cursor-pointer hover:shadow-md transition-all" onClick={triggerFileInput}>
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-20 h-20 bg-soft-pink/10 rounded-full flex items-center justify-center mb-4">
                    <ImagePlus className="w-10 h-10 text-soft-pink" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Upload Item Image</h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    Upload a clear image of the item for AI analysis and smart categorization
                  </p>
                  <Button className="relative overflow-hidden group">
                    <span className="absolute inset-0 bg-gradient-to-r from-soft-pink/20 to-soft-pink/40 group-hover:opacity-90 opacity-0 transition-opacity duration-300"></span>
                    <Upload className="mr-2" />
                    Select Image
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <Card className="glass-morphism overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={image}
                    alt="Item preview"
                    className="w-full h-60 object-cover"
                  />
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="bg-white/80 backdrop-blur-sm h-8 w-8"
                      onClick={handleReset}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {isAnalyzing && (
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Analyzing with Google Gemini 2.0...</span>
                      <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}

                {!isAnalyzing && !analysisResult && (
                  <div className="p-4 flex justify-center">
                    <Button 
                      onClick={handleAnalyzeImage} 
                      className="w-full max-w-xs hover:shadow-lg transition-all"
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Analyze with Gemini 2.0
                    </Button>
                  </div>
                )}

                {analysisResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="p-4"
                  >
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2 justify-between items-start">
                        <div>
                          <Badge className="bg-soft-pink/10 text-soft-pink border-soft-pink/20 mb-2">
                            {analysisResult.category}
                          </Badge>
                          <h3 className="text-lg font-medium">{analysisResult.condition}</h3>
                          <p className="text-sm text-muted-foreground">{analysisResult.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold flex items-center justify-end text-soft-pink">
                            <DollarSign className="h-5 w-5" />
                            {analysisResult.estimatedValue.toFixed(2)}
                          </div>
                          <p className="text-xs text-muted-foreground">Estimated Value</p>
                        </div>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center mb-1">
                            <Gauge className="h-4 w-4 mr-1.5 text-muted-foreground" />
                            <span className="text-sm font-medium">Condition Score</span>
                          </div>
                          <Progress value={analysisResult.conditionScore * 100} className="h-2 mb-1" />
                          <p className="text-xs text-right text-muted-foreground">
                            {(analysisResult.conditionScore * 100).toFixed(0)}%
                          </p>
                        </div>
                        
                        <div>
                          <div className="flex items-center mb-1">
                            <Leaf className="h-4 w-4 mr-1.5 text-muted-foreground" />
                            <span className="text-sm font-medium">Sustainability</span>
                          </div>
                          <Progress value={analysisResult.sustainabilityScore} className="h-2 mb-1" />
                          <p className="text-xs text-right text-muted-foreground">
                            {analysisResult.sustainabilityScore}/100
                          </p>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center mb-2">
                          <Tag className="h-4 w-4 mr-1.5 text-muted-foreground" />
                          <span className="text-sm font-medium">Tags</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.tags.map((tag, index) => (
                            <Badge key={index} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {analysisResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="flex justify-end"
              >
                <Button
                  onClick={() => {
                    if (onAnalysisComplete && analysisResult) {
                      onAnalysisComplete(analysisResult);
                      toast({
                        title: "Analysis applied",
                        description: "The AI analysis has been applied to your item",
                      });
                    }
                  }}
                  className="gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Apply Analysis
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageAnalyzer;
