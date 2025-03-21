
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Share2, Facebook, Twitter, Instagram, Link2, Copy, Check, Image as ImageIcon, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export const SocialSharing = () => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [shareText, setShareText] = useState("I just donated my 10th item on Chiqui and earned Silver tier! Join me in sustainable fashion.");
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  
  const shareTemplates = [
    {
      title: "My Donation",
      text: "I just donated my 10th item on Chiqui and earned Silver tier! Join me in sustainable fashion.",
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    },
    {
      title: "Sustainability Impact",
      text: "I've saved 128kg of CO₂ by shopping sustainable fashion on Chiqui! See how you can make a difference.",
      image: "https://images.unsplash.com/photo-1586285470073-d882ebd07b85?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    },
    {
      title: "My Purchase",
      text: "Just found this amazing second-hand item on Chiqui! Sustainable fashion never looked so good.",
      image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    },
  ];
  
  const handleShare = (platform: string) => {
    toast({
      title: "Shared successfully!",
      description: `Your post has been shared on ${platform}. You earned 10 points!`,
    });
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    toast({
      title: "Link copied!",
      description: "Share link has been copied to clipboard.",
    });
    
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };
  
  const selectTemplate = (index: number) => {
    setSelectedTemplate(index);
    setShareText(shareTemplates[index].text);
  };

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Share2 className="mr-2 h-5 w-5 text-soft-pink" />
            Social Sharing
          </CardTitle>
          <CardDescription>
            Share your sustainable journey and earn 10 points per share
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {shareTemplates.map((template, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                onClick={() => selectTemplate(index)}
              >
                <Card className={`cursor-pointer h-full ${index === selectedTemplate ? 'ring-2 ring-soft-pink border-soft-pink' : ''}`}>
                  <div className="overflow-hidden rounded-t-lg h-32">
                    <img 
                      src={template.image} 
                      alt={template.title} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-1 flex items-center text-sm">
                      {index === 0 && <Share2 className="mr-2 h-4 w-4 text-soft-pink" />}
                      {index === 1 && <Award className="mr-2 h-4 w-4 text-soft-pink" />}
                      {index === 2 && <ImageIcon className="mr-2 h-4 w-4 text-soft-pink" />}
                      {template.title}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">{template.text}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          <div className="space-y-4">
            <div>
              <Textarea
                value={shareText}
                onChange={(e) => setShareText(e.target.value)}
                placeholder="Write something to share..."
                className="mb-2"
              />
              <p className="text-xs text-muted-foreground">
                Personalize your message or use our template above
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => handleShare("Facebook")}
                className="flex-1 bg-[#1877F2] hover:bg-[#1877F2]/90"
              >
                <Facebook className="mr-2 h-4 w-4" />
                Facebook
              </Button>
              <Button
                onClick={() => handleShare("Twitter")}
                className="flex-1 bg-[#1DA1F2] hover:bg-[#1DA1F2]/90"
              >
                <Twitter className="mr-2 h-4 w-4" />
                Twitter
              </Button>
              <Button
                onClick={() => handleShare("Instagram")}
                className="flex-1 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] hover:opacity-90"
              >
                <Instagram className="mr-2 h-4 w-4" />
                Instagram
              </Button>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="border-t pt-4 flex justify-between">
          <div className="text-sm text-muted-foreground flex items-center">
            <Award className="mr-2 h-4 w-4 text-soft-pink" />
            Earn 10 points per share
          </div>
          <Button variant="outline" onClick={copyToClipboard} className="text-sm">
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4 text-green-500" />
                Copied
              </>
            ) : (
              <>
                <Link2 className="mr-2 h-4 w-4" />
                Copy Link
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center text-base">
            <ImageIcon className="mr-2 h-5 w-5 text-soft-pink" />
            Share Photos
          </CardTitle>
          <CardDescription>
            Upload photos of your donations or purchases to inspire others
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center mb-4">
            <ImageIcon className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-2">Drag & drop your photos here or click to browse</p>
            <Button variant="outline" size="sm">
              <ImageIcon className="mr-2 h-4 w-4" />
              Upload Photo
            </Button>
          </div>
          
          <div>
            <h4 className="font-medium text-sm mb-2">Photo Guidelines:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• High-quality images show your items best</li>
              <li>• Natural lighting works wonderfully</li>
              <li>• Show before/after of upcycled items</li>
              <li>• Respect privacy - no identifiable people without permission</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
