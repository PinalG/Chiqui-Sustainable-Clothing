
import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Share2, 
  Facebook, 
  Twitter, 
  Instagram, 
  Link2, 
  Copy, 
  Check, 
  Image as ImageIcon, 
  Award,
  Linkedin,
  Mail,
  MessageCircle,
  Camera,
  Globe,
  Music,
  PlusCircle,
  MessageSquareShare,
  ExternalLink,
  WhatsApp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import analytics from "@/lib/analytics";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const SocialSharing = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [shareText, setShareText] = useState("I just donated my 10th item on Chiqui and earned Silver tier! Join me in sustainable fashion.");
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [sharePreviewOpen, setSharePreviewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("templates");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const shareTemplates = [
    {
      title: "My Donation",
      text: "I just donated my 10th item on Chiqui and earned Silver tier! Join me in sustainable fashion.",
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      hashtags: ["SustainableFashion", "EcoFriendly", "ChiquiDonation"]
    },
    {
      title: "Sustainability Impact",
      text: "I've saved 128kg of CO₂ by shopping sustainable fashion on Chiqui! See how you can make a difference.",
      image: "https://images.unsplash.com/photo-1586285470073-d882ebd07b85?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      hashtags: ["ClimateAction", "SustainableFashion", "ChiquiImpact"]
    },
    {
      title: "My Purchase",
      text: "Just found this amazing second-hand item on Chiqui! Sustainable fashion never looked so good.",
      image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      hashtags: ["StyleWithPurpose", "SustainableShopping", "ChiquiStyle"]
    },
    {
      title: "Paper Donation",
      text: "I just completed a paper donation with Chiqui, helping retailers reduce waste while getting great tax benefits!",
      image: "https://images.unsplash.com/photo-1607344645866-009c320c5ab0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      hashtags: ["SmartRetail", "SustainableInventory", "ChiquiPaperDonation"]
    },
  ];
  
  const handleShare = (platform: string) => {
    const shareUrl = "https://chiqui-app.com/share/" + Math.random().toString(36).substring(2, 8);
    let shareLink = "";
    
    switch(platform) {
      case "Facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case "Twitter":
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case "Instagram":
        // Instagram doesn't have a direct web share API, so we show instructions
        toast({
          title: "Instagram Sharing",
          description: "To share on Instagram, save the image and upload it via the Instagram app",
        });
        break;
      case "LinkedIn":
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(shareText)}`;
        break;
      case "Email":
        shareLink = `mailto:?subject=Check out Chiqui&body=${encodeURIComponent(shareText + " " + shareUrl)}`;
        break;
      case "WhatsApp":
        shareLink = `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`;
        break;
      case "Messenger":
        shareLink = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(shareUrl)}&app_id=123456789&redirect_uri=${encodeURIComponent(window.location.href)}`;
        break;
      case "Pinterest":
        shareLink = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(shareText)}`;
        break;
      case "NativeShare":
        if (navigator.share) {
          navigator.share({
            title: 'Chiqui Sustainable Fashion',
            text: shareText,
            url: shareUrl,
          })
          .then(() => console.log('Successful share'))
          .catch((error) => console.log('Error sharing:', error));
          return;
        } else {
          toast({
            title: "Native Sharing Not Available",
            description: "Your browser doesn't support native sharing. Please use one of the other options.",
          });
          return;
        }
        break;
    }
    
    if (shareLink) {
      window.open(shareLink, "_blank");
    }
    
    // Track the share event
    analytics.trackEvent({
      category: "Social",
      action: "Share",
      label: platform,
    });
    
    // Track sustainability impact of sharing
    analytics.trackSustainabilityImpact({
      co2Saved: 0.5, // Symbolic CO2 impact of digital sharing vs physical marketing
    });
    
    toast({
      title: "Shared successfully!",
      description: `Your post has been shared on ${platform}. You earned 10 points!`,
    });
  };
  
  const copyToClipboard = () => {
    const shareUrl = "https://chiqui-app.com/share/" + Math.random().toString(36).substring(2, 8);
    navigator.clipboard.writeText(shareText + " " + shareUrl);
    setCopied(true);
    
    analytics.trackEvent({
      category: "Social",
      action: "Copy Link",
    });
    
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
  
  const handleImageUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, this would upload the image to storage
      // For now, we'll just show a success message
      toast({
        title: "Image uploaded!",
        description: "Your image has been uploaded and is ready to share.",
      });
      
      analytics.trackEvent({
        category: "Social",
        action: "Upload Image",
      });
    }
  };

  const handleNativeShare = () => {
    try {
      if (navigator.share) {
        navigator.share({
          title: 'Chiqui Sustainable Fashion',
          text: shareText,
          url: "https://chiqui-app.com/share/" + Math.random().toString(36).substring(2, 8),
        })
        .then(() => {
          analytics.trackEvent({
            category: "Social",
            action: "Native Share",
          });
          
          toast({
            title: "Shared successfully!",
            description: "Your content has been shared. You earned 10 points!",
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
          <Tabs defaultValue="templates" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="templates" className="data-[state=active]:bg-soft-pink/10 data-[state=active]:text-soft-pink">
                <MessageCircle className="mr-2 h-4 w-4" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="upload" className="data-[state=active]:bg-soft-pink/10 data-[state=active]:text-soft-pink">
                <Camera className="mr-2 h-4 w-4" />
                Upload Media
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="templates" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                          {index === 3 && <Globe className="mr-2 h-4 w-4 text-soft-pink" />}
                          {template.title}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">{template.text}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              
              <div className="space-y-4 mt-6">
                <div>
                  <Textarea
                    value={shareText}
                    onChange={(e) => setShareText(e.target.value)}
                    placeholder="Write something to share..."
                    className="mb-2"
                  />
                  <div className="flex justify-between">
                    <p className="text-xs text-muted-foreground">
                      Personalize your message or use our template above
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSharePreviewOpen(true)}
                      className="text-soft-pink text-xs"
                    >
                      Preview Post
                    </Button>
                  </div>
                </div>
                
                {/* Primary sharing platforms */}
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
                
                {/* Secondary sharing platforms */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => handleShare("LinkedIn")}
                    className="flex-1 bg-[#0A66C2] hover:bg-[#0A66C2]/90"
                  >
                    <Linkedin className="mr-2 h-4 w-4" />
                    LinkedIn
                  </Button>
                  <Button
                    onClick={() => handleShare("WhatsApp")}
                    className="flex-1 bg-[#25D366] hover:bg-[#25D366]/90"
                  >
                    <MessageSquareShare className="mr-2 h-4 w-4" />
                    WhatsApp
                  </Button>
                  <Button
                    onClick={() => handleShare("Email")}
                    className="flex-1 bg-[#B23121] hover:bg-[#B23121]/90"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </Button>
                </div>
                
                {/* Native share button */}
                <div className="mt-3">
                  <Button
                    onClick={handleNativeShare}
                    className="w-full bg-gradient-to-r from-soft-pink to-soft-pink/70 hover:opacity-90"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Share on Device
                  </Button>
                </div>
                
                <div className="bg-soft-pink/5 rounded-lg p-3 mt-4">
                  <p className="text-xs font-medium mb-2">Recommended hashtags:</p>
                  <div className="flex flex-wrap gap-2">
                    {shareTemplates[selectedTemplate].hashtags.map((tag, i) => (
                      <span key={i} className="text-xs bg-soft-pink/10 text-soft-pink px-2 py-1 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="upload" className="mt-0">
              <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center mb-6">
                <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-3">Drag & drop your photos here or click to browse</p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={onFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
                <Button onClick={handleImageUpload}>
                  <Camera className="mr-2 h-4 w-4" />
                  Upload Photo
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-soft-pink/5">
                  <h4 className="font-medium text-sm mb-2 flex items-center">
                    <Camera className="mr-2 h-4 w-4 text-soft-pink" />
                    Photo Guidelines
                  </h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• High-quality images show your items best</li>
                    <li>• Natural lighting works wonderfully</li>
                    <li>• Show before/after of upcycled items</li>
                    <li>• Respect privacy - no identifiable people without permission</li>
                  </ul>
                </div>
                
                <div className="p-4 rounded-lg bg-soft-pink/5">
                  <h4 className="font-medium text-sm mb-2 flex items-center">
                    <Award className="mr-2 h-4 w-4 text-soft-pink" />
                    Sharing Benefits
                  </h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Earn 10 points per social share</li>
                    <li>• Get 25 bonus points when friends sign up using your link</li>
                    <li>• Sharing photos earns 15 points each</li>
                    <li>• Special badges for consistent sharers</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
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
            <Globe className="mr-2 h-5 w-5 text-soft-pink" />
            Share Your Story
          </CardTitle>
          <CardDescription>
            Create and share your sustainable fashion journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="cursor-pointer hover-lift">
              <div className="h-24 bg-gradient-to-r from-soft-pink/30 to-soft-pink/10 flex items-center justify-center">
                <Music className="h-10 w-10 text-soft-pink/70" />
              </div>
              <CardContent className="p-3">
                <h4 className="text-sm font-medium">Story Reel</h4>
                <p className="text-xs text-muted-foreground">Create a 15-second video about your sustainable choices</p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover-lift">
              <div className="h-24 bg-gradient-to-r from-blue-500/30 to-blue-500/10 flex items-center justify-center">
                <MessageCircle className="h-10 w-10 text-blue-500/70" />
              </div>
              <CardContent className="p-3">
                <h4 className="text-sm font-medium">Testimonial</h4>
                <p className="text-xs text-muted-foreground">Share your experience with Chiqui's donation process</p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover-lift">
              <div className="h-24 bg-gradient-to-r from-green-500/30 to-green-500/10 flex items-center justify-center">
                <PlusCircle className="h-10 w-10 text-green-500/70" />
              </div>
              <CardContent className="p-3">
                <h4 className="text-sm font-medium">Create Custom</h4>
                <p className="text-xs text-muted-foreground">Design your own unique content to share</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-soft-pink/5 rounded-lg p-4">
            <h4 className="font-medium text-sm mb-2 flex items-center">
              <Award className="mr-2 h-4 w-4 text-soft-pink" />
              Top Sharers This Month
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-soft-pink/20 flex items-center justify-center text-xs font-bold">1</div>
                  <span className="text-sm">Morgan S.</span>
                </div>
                <span className="text-xs font-medium">42 shares</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-heather-grey/20 flex items-center justify-center text-xs font-bold">2</div>
                  <span className="text-sm">Alex T.</span>
                </div>
                <span className="text-xs font-medium">39 shares</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-xs font-bold">3</div>
                  <span className="text-sm">Jamie L.</span>
                </div>
                <span className="text-xs font-medium">31 shares</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={sharePreviewOpen} onOpenChange={setSharePreviewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Preview</DialogTitle>
            <DialogDescription>
              Here's how your post will look on social media
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="rounded-md overflow-hidden">
              <img 
                src={shareTemplates[selectedTemplate].image} 
                alt="Preview" 
                className="w-full h-48 object-cover"
              />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Chiqui - Sustainable Fashion</h3>
              <p className="text-sm">{shareText}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {shareTemplates[selectedTemplate].hashtags.map((tag, i) => (
                  <span key={i} className="text-xs text-blue-500">#{tag}</span>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSharePreviewOpen(false)}>Close</Button>
              <Button onClick={() => {
                setSharePreviewOpen(false);
                handleShare("Facebook");
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
