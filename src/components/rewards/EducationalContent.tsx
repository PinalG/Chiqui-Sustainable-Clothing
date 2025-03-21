
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, BookOpen, Video, FileText, ArrowRight, Check, Sparkles, Star, Award } from "lucide-react";
import { motion } from "framer-motion";

export const EducationalContent = () => {
  const [completedArticles, setCompletedArticles] = useState<string[]>([
    "fast-fashion-impact",
    "sustainable-materials"
  ]);
  
  const markAsComplete = (id: string) => {
    if (!completedArticles.includes(id)) {
      setCompletedArticles([...completedArticles, id]);
    }
  };
  
  // Content categories
  const contentCategories = [
    { id: "basics", label: "Sustainability Basics", icon: BookOpen },
    { id: "advanced", label: "Advanced Topics", icon: FileText },
    { id: "videos", label: "Video Tutorials", icon: Video },
  ];
  
  // Content items for each category
  const contentItems = {
    basics: [
      {
        id: "fast-fashion-impact",
        title: "The Impact of Fast Fashion",
        description: "Learn how fast fashion affects our planet and communities",
        timeToRead: "5 min read",
        image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        tags: ["beginner", "environment"],
        points: 15,
      },
      {
        id: "sustainable-materials",
        title: "Guide to Sustainable Materials",
        description: "Discover eco-friendly fabrics and materials",
        timeToRead: "8 min read",
        image: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        tags: ["beginner", "materials"],
        points: 20,
      },
      {
        id: "clothing-lifecycle",
        title: "Understanding Clothing Lifecycle",
        description: "Follow the journey of a garment from creation to disposal",
        timeToRead: "6 min read",
        image: "https://images.unsplash.com/photo-1507553532144-b9df5e38c8d1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        tags: ["beginner", "lifecycle"],
        points: 25,
      },
    ],
    advanced: [
      {
        id: "circular-economy",
        title: "Circular Economy in Fashion",
        description: "How circular business models are transforming the industry",
        timeToRead: "12 min read",
        image: "https://images.unsplash.com/photo-1527628217451-b2414a1ee733?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        tags: ["advanced", "business"],
        points: 30,
      },
      {
        id: "carbon-footprint",
        title: "Calculating Carbon Footprint",
        description: "Methods to measure and reduce your fashion carbon footprint",
        timeToRead: "10 min read",
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        tags: ["advanced", "carbon"],
        points: 35,
      },
      {
        id: "ethical-sourcing",
        title: "Ethical Sourcing Guide",
        description: "Understanding fair labor practices in clothing production",
        timeToRead: "9 min read",
        image: "https://images.unsplash.com/photo-1493957988430-a5f2e15f39a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        tags: ["advanced", "ethics"],
        points: 40,
      },
    ],
    videos: [
      {
        id: "upcycling-basics",
        title: "Upcycling Basics",
        description: "Simple techniques to transform old clothing items",
        timeToRead: "15 min video",
        image: "https://images.unsplash.com/photo-1558118720-fa5cdebe6b3a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        tags: ["video", "DIY"],
        points: 25,
      },
      {
        id: "sustainable-washing",
        title: "Sustainable Washing Techniques",
        description: "How to wash clothes to minimize environmental impact",
        timeToRead: "8 min video",
        image: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        tags: ["video", "care"],
        points: 20,
      },
      {
        id: "closet-organization",
        title: "Sustainable Closet Organization",
        description: "Build a capsule wardrobe and organize sustainably",
        timeToRead: "12 min video",
        image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        tags: ["video", "organization"],
        points: 30,
      },
    ],
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="mr-2 h-5 w-5 text-soft-pink" />
            Educational Resources
          </CardTitle>
          <CardDescription>
            Learn about sustainable fashion and earn points
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="bg-soft-pink/10 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-soft-pink/20 p-3 mt-1">
                <Sparkles className="h-6 w-6 text-soft-pink" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Learning Progress</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  You've completed {completedArticles.length} out of {Object.values(contentItems).flat().length} resources
                </p>
                <div className="w-full bg-muted rounded-full h-2 mb-2">
                  <div 
                    className="bg-soft-pink h-2 rounded-full" 
                    style={{ width: `${(completedArticles.length / Object.values(contentItems).flat().length) * 100}%` }} 
                  />
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Progress: {Math.round((completedArticles.length / Object.values(contentItems).flat().length) * 100)}%</span>
                  <span>Earned: {completedArticles.reduce((sum, id) => {
                    const item = Object.values(contentItems).flat().find(item => item.id === id);
                    return sum + (item?.points || 0);
                  }, 0)} points</span>
                </div>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="basics" className="w-full">
            <TabsList className="w-full grid grid-cols-3 mb-6">
              {contentCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    className="data-[state=active]:bg-soft-pink/10 data-[state=active]:text-soft-pink"
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {category.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>
            
            {Object.entries(contentItems).map(([category, items]) => (
              <TabsContent key={category} value={category} className="mt-0">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {items.map((item) => (
                    <motion.div key={item.id} variants={itemVariants}>
                      <Card className="h-full flex flex-col hover-lift overflow-hidden">
                        <div className="relative h-40 overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                          />
                          {completedArticles.includes(item.id) && (
                            <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                          )}
                        </div>
                        <CardContent className="py-4 flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium">{item.title}</h3>
                            <Badge variant="outline" className="flex items-center gap-1 bg-soft-pink/5">
                              <Star className="h-3 w-3 text-soft-pink" />
                              {item.points} pts
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                            <span>{item.timeToRead}</span>
                            <div className="flex gap-1">
                              {item.tags.map((tag) => (
                                <span key={tag} className="bg-muted rounded-full px-2 py-0.5">{tag}</span>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                          <Button 
                            variant={completedArticles.includes(item.id) ? "outline" : "default"}
                            className="w-full"
                            onClick={() => markAsComplete(item.id)}
                          >
                            {completedArticles.includes(item.id) ? (
                              <>
                                <Check className="mr-2 h-4 w-4" />
                                Completed
                              </>
                            ) : (
                              <>
                                Read Article
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </>
                            )}
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center text-base">
            <Award className="mr-2 h-5 w-5 text-soft-pink" />
            Sustainability Certification
          </CardTitle>
          <CardDescription>
            Complete all modules to earn your Sustainable Fashion Certificate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 border border-dashed rounded-lg border-muted flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-soft-pink/10 flex items-center justify-center mb-4">
              <Award className="h-8 w-8 text-soft-pink" />
            </div>
            <h3 className="font-medium mb-1">Sustainable Fashion Advocate</h3>
            <p className="text-sm text-muted-foreground mb-4">Complete 75% of all resources to earn this badge</p>
            <div className="w-full max-w-xs bg-muted rounded-full h-2 mb-4">
              <div 
                className="bg-soft-pink h-2 rounded-full" 
                style={{ width: `${(completedArticles.length / Object.values(contentItems).flat().length) * 100}%` }} 
              />
            </div>
            <Button variant="outline" disabled={completedArticles.length < 0.75 * Object.values(contentItems).flat().length}>
              {completedArticles.length >= 0.75 * Object.values(contentItems).flat().length ? (
                "Claim Certificate"
              ) : (
                `Complete ${Math.ceil(0.75 * Object.values(contentItems).flat().length) - completedArticles.length} more to unlock`
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
