
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  Phone, 
  FileText, 
  Search,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAnalytics } from '@/hooks/use-analytics';

// Define FAQ items
const faqItems = [
  {
    question: "How does the paper donation process work?",
    answer: "Our paper donation process allows retailers to donate inventory without physically moving items until a confirmed sale. This provides tax benefits for both the donated goods and storage space while optimizing logistics. When a purchase occurs, the item is shipped directly to the buyer using our AI-driven bidding system."
  },
  {
    question: "What tax benefits do retailers receive?",
    answer: "Retailers receive tax benefits for both the donated goods and the storage space used to house these items. Our platform automatically generates detailed reports for tax purposes, calculating benefits based on current tax regulations and the value of donated inventory."
  },
  {
    question: "How do I track my donation impact?",
    answer: "You can track your donation impact through your personalized dashboard. This includes environmental metrics, social impact data, and a breakdown of how your donations have contributed to various community initiatives, particularly programs supporting at-risk youth."
  },
  {
    question: "Can I donate clothing in any condition?",
    answer: "We accept clothing in various conditions, but our AI system categorizes items based on quality. Items that cannot be resold may be redirected to recycling partners. For best results, please ensure donations are clean and have minimal damage."
  },
  {
    question: "How secure is my personal data on the platform?",
    answer: "We implement end-to-end encryption, decentralized identity management, and adhere to strict compliance standards including GDPR and CCPA. Your personal data is never sold to third parties, and you have complete control over your privacy settings."
  },
  {
    question: "How are shipping costs determined?",
    answer: "Shipping costs are optimized through our AI-driven winning bid system, which selects the most cost-effective and environmentally friendly shipping option. The system considers distance, carbon footprint, and delivery timeframes to provide the best balance of efficiency and sustainability."
  }
];

// Contact form schema
const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters")
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const Support = () => {
  const { toast } = useToast();
  const analytics = useAnalytics();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFaqs, setFilteredFaqs] = useState(faqItems);

  // Contact form
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    }
  });

  // Handle FAQ item toggle
  const toggleFaq = (index: number) => {
    analytics.trackEvent({
      category: 'Support',
      action: 'Toggle FAQ',
      label: faqItems[index].question
    });
    
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.length > 0) {
      setIsSearching(true);
      const results = faqItems.filter(item => 
        item.question.toLowerCase().includes(term.toLowerCase()) || 
        item.answer.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredFaqs(results);
    } else {
      setIsSearching(false);
      setFilteredFaqs(faqItems);
    }
    
    analytics.trackEvent({
      category: 'Support',
      action: 'Search FAQ',
      label: term
    });
  };

  // Handle contact form submission
  const onSubmit = (data: ContactFormValues) => {
    analytics.trackEvent({
      category: 'Support',
      action: 'Submit Contact Form',
      label: data.subject
    });
    
    // In a real application, this would send the data to an API
    console.log('Form submitted:', data);
    
    toast({
      title: 'Message sent',
      description: 'Thank you for reaching out. Our team will get back to you shortly.',
    });
    
    form.reset();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-soft-pink mb-6">Support Center</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <Card className="hover-scale transition-transform duration-300">
          <CardHeader className="bg-soft-pink/10 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-soft-pink" />
              <span>Chat Support</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-sm mb-4">
              Get immediate assistance through our live chat support. Our team is available 9am-5pm ET, Monday through Friday.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Start Chat
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="hover-scale transition-transform duration-300">
          <CardHeader className="bg-soft-pink/10 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-soft-pink" />
              <span>Email Support</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-sm mb-4">
              Send us an email for less urgent issues. We typically respond within 24 hours during business days.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <a href="mailto:support@chiqui.org">Contact via Email</a>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="hover-scale transition-transform duration-300">
          <CardHeader className="bg-soft-pink/10 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-soft-pink" />
              <span>Phone Support</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-sm mb-4">
              Call our support line for immediate assistance with urgent matters. Available 9am-5pm ET, Monday through Friday.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <a href="tel:+18005550123">Call 1-800-555-0123</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <Tabs defaultValue="faq" className="mb-10">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="faq">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              <span>Frequently Asked Questions</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="contact">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span>Contact Form</span>
            </div>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Find quick answers to common questions about our platform
              </CardDescription>
              
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            
            <CardContent>
              {isSearching && filteredFaqs.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-2">No results found for "{searchTerm}"</p>
                  <p className="text-sm">Try a different search term or browse the questions below</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredFaqs.map((faq, index) => (
                    <div 
                      key={index} 
                      className="border rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFaq(index)}
                        className="flex justify-between items-center w-full p-4 text-left font-medium bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <span>{faq.question}</span>
                        {expandedFaq === index ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                      
                      {expandedFaq === index && (
                        <div className="p-4 bg-white">
                          <p>{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
              <CardDescription>
                Send us a message and we'll get back to you as soon as possible
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Your email address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="What is your message about?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Please provide details about your question or issue" 
                            className="min-h-32"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full md:w-auto">
                    Send Message
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-soft-pink" />
              <span>Documentation</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <ul className="space-y-3">
              <li>
                <a href="#" className="flex items-center gap-2 text-blue-600 hover:underline">
                  <span>User Manual</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 text-blue-600 hover:underline">
                  <span>Donation Process Guide</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 text-blue-600 hover:underline">
                  <span>Tax Benefits Explainer</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 text-blue-600 hover:underline">
                  <span>Privacy & Security Guide</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-soft-pink" />
              <span>Additional Resources</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <ul className="space-y-3">
              <li>
                <a href="#" className="flex items-center gap-2 text-blue-600 hover:underline">
                  <span>Video Tutorials</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 text-blue-600 hover:underline">
                  <span>Community Forum</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 text-blue-600 hover:underline">
                  <span>Blog & Updates</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 text-blue-600 hover:underline">
                  <span>Report a Bug</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Support;
