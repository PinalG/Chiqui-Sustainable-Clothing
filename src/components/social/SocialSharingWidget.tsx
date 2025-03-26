
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Share, Twitter, Facebook, Instagram, Linkedin, Copy, Check, Award } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useUserInteractions } from "@/hooks/use-user-interactions";

interface SocialSharingProps {
  achievementType?: 'donation' | 'purchase' | 'impact' | 'custom';
  achievementTitle?: string;
  achievementDescription?: string;
  imageUrl?: string;
}

const SocialSharingWidget = ({
  achievementType = 'impact',
  achievementTitle = 'My Sustainability Impact',
  achievementDescription = "I've helped reduce textile waste and supported sustainable fashion!",
  imageUrl = '/placeholder.svg'
}: SocialSharingProps) => {
  const [activeTab, setActiveTab] = useState('social');
  const [customMessage, setCustomMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const { userData } = useAuth();
  const { addSocialInteraction } = useUserInteractions();
  
  // Define shareUrl here before using it
  const shareUrl = window.location.href;
  const shareTags = ['SustainableFashion', 'CircularEconomy', 'ReduceWaste'];
  
  const getShareMessage = () => {
    return customMessage || 
      `I just ${achievementType === 'donation' ? 'donated' : 
        achievementType === 'purchase' ? 'purchased' : 
        'made an impact'} through ACDRP! ${achievementDescription} #${shareTags.join(' #')}`;
  };
  
  const handleSocialShare = (platform: string) => {
    const message = encodeURIComponent(getShareMessage());
    const url = encodeURIComponent(shareUrl);
    let shareLink = '';
    
    switch (platform) {
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${message}&url=${url}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${message}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${message}`;
        break;
      case 'instagram':
        // Instagram doesn't support direct sharing via URL, show instructions instead
        toast.info("To share on Instagram, screenshot this achievement and post it to your story!");
        addSocialInteraction('share', 'instagram');
        return;
    }
    
    window.open(shareLink, '_blank', 'width=600,height=400');
    
    // Record the social interaction
    addSocialInteraction('share', platform as any, shareUrl, getShareMessage());
    
    toast.success(`Sharing on ${platform}!`);
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${getShareMessage()} ${shareUrl}`);
    setCopied(true);
    
    // Record the copy action as a share
    addSocialInteraction('share', undefined, shareUrl, getShareMessage());
    
    toast.success('Share text copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <Card className="glass-morphism">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Share className="h-5 w-5 text-soft-pink" />
          Share Your Impact
        </CardTitle>
        {userData?.sustainabilityScore && (
          <div className="flex items-center gap-1 text-sm bg-soft-pink/10 text-soft-pink px-2 py-1 rounded-full">
            <Award className="h-4 w-4" />
            <span>Impact Score: {userData.sustainabilityScore}</span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="customize">Customize</TabsTrigger>
          </TabsList>
          
          <TabsContent value="social" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center p-4 bg-muted/30 rounded-lg">
              <img 
                src={imageUrl} 
                alt={achievementTitle} 
                className="w-20 h-20 object-cover rounded-md"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{achievementTitle}</h3>
                <p className="text-sm text-muted-foreground">{achievementDescription}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex flex-col items-center justify-center h-16 gap-1 bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 border-[#1DA1F2]/30"
                onClick={() => handleSocialShare('twitter')}
              >
                <Twitter className="h-5 w-5 text-[#1DA1F2]" />
                <span className="text-xs">Twitter</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="flex flex-col items-center justify-center h-16 gap-1 bg-[#4267B2]/10 hover:bg-[#4267B2]/20 border-[#4267B2]/30"
                onClick={() => handleSocialShare('facebook')}
              >
                <Facebook className="h-5 w-5 text-[#4267B2]" />
                <span className="text-xs">Facebook</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="flex flex-col items-center justify-center h-16 gap-1 bg-[#C13584]/10 hover:bg-[#C13584]/20 border-[#C13584]/30"
                onClick={() => handleSocialShare('instagram')}
              >
                <Instagram className="h-5 w-5 text-[#C13584]" />
                <span className="text-xs">Instagram</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="flex flex-col items-center justify-center h-16 gap-1 bg-[#0077B5]/10 hover:bg-[#0077B5]/20 border-[#0077B5]/30"
                onClick={() => handleSocialShare('linkedin')}
              >
                <Linkedin className="h-5 w-5 text-[#0077B5]" />
                <span className="text-xs">LinkedIn</span>
              </Button>
            </div>
            
            <div className="relative mt-4">
              <Button
                variant="secondary"
                className="w-full flex items-center gap-2"
                onClick={handleCopyLink}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Share Link
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="customize" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="custom-message" className="block text-sm font-medium mb-1">
                  Customize your share message
                </label>
                <Textarea
                  id="custom-message"
                  placeholder="Share your sustainability journey with your followers..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <div>
                <label htmlFor="hashtags" className="block text-sm font-medium mb-1">
                  Hashtags
                </label>
                <Input
                  id="hashtags"
                  value={shareTags.map(tag => `#${tag}`).join(' ')}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Default hashtags will be added to your post
                </p>
              </div>
              
              <Button 
                className="w-full mt-2"
                onClick={() => setActiveTab('social')}
              >
                Preview & Share
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SocialSharingWidget;
