
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  CheckCircle2, 
  Share2, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Copy, 
  Check, 
  MessageSquareShare, 
  ExternalLink,
  Mail
} from "lucide-react";
import { motion } from "framer-motion";
import { 
  generateShareableDonationSummary, 
  calculateDonationEnvironmentalImpact,
  generateDonationHashtags,
  generateSharingLink
} from "./donationUtils";
import { useToast } from "@/hooks/use-toast";
import analytics from "@/lib/analytics";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface DonationSuccessScreenProps {
  batchId: string;
  taxBenefit: number;
  storageBenefit: number;
  itemCount?: number;
  categories?: string[];
  estimatedValue?: number;
  onReset: () => void;
}

const DonationSuccessScreen = ({ 
  batchId, 
  taxBenefit, 
  storageBenefit, 
  itemCount = 1,
  categories = [], 
  estimatedValue = 0,
  onReset 
}: DonationSuccessScreenProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  
  // Generate sharing content
  const shareText = generateShareableDonationSummary(
    itemCount,
    categories,
    estimatedValue,
    taxBenefit,
    true // Assuming this is for retailers
  );
  
  // Calculate environmental impact
  const impact = calculateDonationEnvironmentalImpact(itemCount, categories);
  
  // Generate hashtags
  const hashtags = generateDonationHashtags(categories, true);
  
  // Handle social sharing
  const handleShare = (platform: string) => {
    const shareUrl = generateSharingLink(batchId, platform);
    
    let shareLink = "";
    switch(platform) {
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case "linkedin":
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(shareText)}`;
        break;
      case "whatsapp":
        shareLink = `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`;
        break;
      case "email":
        shareLink = `mailto:?subject=Paper Donation with Chiqui&body=${encodeURIComponent(shareText + " " + shareUrl)}`;
        break;
    }
    
    if (shareLink) {
      window.open(shareLink, "_blank");
      
      // Track the share event
      analytics.trackEvent({
        category: "Donation",
        action: "Share Success",
        label: platform,
      });
      
      toast({
        title: "Shared successfully!",
        description: `Your donation has been shared on ${platform}.`,
      });
    }
  };
  
  // Handle native sharing
  const handleNativeShare = () => {
    try {
      if (navigator.share) {
        navigator.share({
          title: 'Chiqui Paper Donation',
          text: shareText,
          url: generateSharingLink(batchId, 'native'),
        })
        .then(() => {
          analytics.trackEvent({
            category: "Donation",
            action: "Native Share",
          });
          
          toast({
            title: "Shared successfully!",
            description: "Your donation has been shared.",
          });
        })
        .catch((error) => console.log('Error sharing:', error));
      } else {
        toast({
          title: "Native Sharing Not Available",
          description: "Your browser doesn't support native sharing. Please use one of the other options.",
        });
      }
    } catch (err) {
      console.error("Native sharing error:", err);
    }
  };
  
  // Copy sharing link to clipboard
  const copyToClipboard = () => {
    const shareUrl = generateSharingLink(batchId, "copy");
    navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    setCopied(true);
    
    analytics.trackEvent({
      category: "Donation",
      action: "Copy Share Link",
    });
    
    toast({
      title: "Link copied!",
      description: "Share link has been copied to clipboard.",
    });
    
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };
  
  // Track sustainability impact
  const trackImpact = () => {
    analytics.trackSustainabilityImpact({
      co2Saved: impact.co2Saved,
      waterSaved: impact.waterSaved,
      energySaved: impact.energySaved,
      itemsRecycled: itemCount,
    });
  };
  
  // Track donation success on component mount
  useEffect(() => {
    analytics.trackEvent({
      category: "Donation",
      action: "Donation Success",
      label: batchId,
      value: Math.round(taxBenefit + storageBenefit),
    });
    
    trackImpact();
  }, [batchId, taxBenefit, storageBenefit]);

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center w-full max-w-2xl"
      >
        <div className="rounded-full bg-green-100 p-3 mb-4">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Retail Donation Registered!</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          Your items have been registered for donation without physically moving them. 
          They will remain in your storage location until sold.
        </p>
        <div className="bg-soft-pink/10 rounded-lg py-3 px-6 mb-6 w-full">
          <p className="font-medium text-soft-pink">Batch ID: {batchId}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 w-full">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Tax Benefit</p>
            <p className="text-xl font-bold">${taxBenefit.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Storage Benefit</p>
            <p className="text-xl font-bold">${storageBenefit.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">CO₂ Saved</p>
            <p className="text-xl font-bold">{impact.co2Saved.toFixed(1)} kg</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Water Saved</p>
            <p className="text-xl font-bold">{(impact.waterSaved / 1000).toFixed(1)}k L</p>
          </div>
        </div>
        
        <Card className="p-4 mb-6 w-full">
          <h3 className="text-lg font-medium mb-3 flex items-center justify-center">
            <Share2 className="mr-2 h-5 w-5 text-soft-pink" />
            Share Your Impact
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Let your network know about your contribution to sustainable fashion
          </p>
          
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            <Button
              onClick={() => handleShare("facebook")}
              className="bg-[#1877F2] hover:bg-[#1877F2]/90"
            >
              <Facebook className="mr-2 h-4 w-4" />
              Facebook
            </Button>
            <Button
              onClick={() => handleShare("twitter")}
              className="bg-[#1DA1F2] hover:bg-[#1DA1F2]/90"
            >
              <Twitter className="mr-2 h-4 w-4" />
              Twitter
            </Button>
            <Button
              onClick={() => handleShare("linkedin")}
              className="bg-[#0A66C2] hover:bg-[#0A66C2]/90"
            >
              <Linkedin className="mr-2 h-4 w-4" />
              LinkedIn
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            <Button
              onClick={() => handleShare("whatsapp")}
              className="bg-[#25D366] hover:bg-[#25D366]/90"
            >
              <MessageSquareShare className="mr-2 h-4 w-4" />
              WhatsApp
            </Button>
            <Button
              onClick={() => handleShare("email")}
              className="bg-[#B23121] hover:bg-[#B23121]/90"
            >
              <Mail className="mr-2 h-4 w-4" />
              Email
            </Button>
            <Button variant="outline" onClick={copyToClipboard}>
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4 text-green-500" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Link
                </>
              )}
            </Button>
          </div>
          
          <Button
            onClick={handleNativeShare}
            className="w-full bg-gradient-to-r from-soft-pink to-soft-pink/70 hover:opacity-90 mb-4"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Share on Device
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setPreviewOpen(true)}
            className="text-soft-pink text-xs mx-auto block mb-3"
          >
            Preview Post
          </Button>
          
          <div className="bg-soft-pink/5 rounded-lg p-3 text-left">
            <p className="text-xs font-medium mb-2">Recommended hashtags:</p>
            <div className="flex flex-wrap gap-2">
              {hashtags.map((tag, i) => (
                <span key={i} className="text-xs bg-soft-pink/10 text-soft-pink px-2 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </Card>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button onClick={onReset} className="flex-1">
            Register Another Donation
          </Button>
          <Button variant="outline" className="flex-1" onClick={() => {
            analytics.trackEvent({
              category: "Donation",
              action: "View Donation Details",
              label: batchId,
            });
            window.location.href = `/retail-donations/details/${batchId}`;
          }}>
            View Donation Details
          </Button>
        </div>
      </motion.div>
      
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Preview</DialogTitle>
            <DialogDescription>
              Here's how your post will look on social media
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="border rounded-md p-4">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-soft-pink/20 flex items-center justify-center text-soft-pink">
                  C
                </div>
                <div className="ml-2">
                  <p className="font-medium text-sm">Chiqui Retail</p>
                  <p className="text-xs text-muted-foreground">Just now</p>
                </div>
              </div>
              
              <p className="text-sm mb-3">{shareText}</p>
              
              <div className="bg-muted rounded-md p-2 mb-3">
                <p className="text-xs font-medium">Environmental Impact Stats:</p>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">CO₂ Saved</p>
                    <p className="text-sm font-medium">{impact.co2Saved.toFixed(1)} kg</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Water Saved</p>
                    <p className="text-sm font-medium">{(impact.waterSaved / 1000).toFixed(1)}k L</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {hashtags.map((tag, i) => (
                  <span key={i} className="text-xs text-blue-500">#{tag}</span>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setPreviewOpen(false)}>Close</Button>
              <Button onClick={() => {
                setPreviewOpen(false);
                handleShare("facebook");
              }}>
                Share Now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DonationSuccessScreen;
