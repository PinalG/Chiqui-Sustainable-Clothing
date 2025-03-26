
// FAQ data types
export interface FaqItem {
  question: string;
  answer: string;
  category?: string;
  tags?: string[];
}

// Support article types
export interface SupportArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

// Predefined FAQ items
export const faqItems: FaqItem[] = [
  {
    question: "How does the paper donation process work?",
    answer: "Our paper donation process allows retailers to donate inventory without physically moving items until a confirmed sale. This provides tax benefits for both the donated goods and storage space while optimizing logistics. When a purchase occurs, the item is shipped directly to the buyer using our AI-driven bidding system.",
    category: "Donation Process",
    tags: ["paper donation", "tax benefits", "logistics"]
  },
  {
    question: "What tax benefits do retailers receive?",
    answer: "Retailers receive tax benefits for both the donated goods and the storage space used to house these items. Our platform automatically generates detailed reports for tax purposes, calculating benefits based on current tax regulations and the value of donated inventory.",
    category: "Tax Benefits",
    tags: ["tax benefits", "retailers", "reports"]
  },
  {
    question: "How do I track my donation impact?",
    answer: "You can track your donation impact through your personalized dashboard. This includes environmental metrics, social impact data, and a breakdown of how your donations have contributed to various community initiatives, particularly programs supporting at-risk youth.",
    category: "Impact Tracking",
    tags: ["impact", "dashboard", "metrics"]
  },
  {
    question: "Can I donate clothing in any condition?",
    answer: "We accept clothing in various conditions, but our AI system categorizes items based on quality. Items that cannot be resold may be redirected to recycling partners. For best results, please ensure donations are clean and have minimal damage.",
    category: "Donation Process",
    tags: ["clothing condition", "quality", "recycling"]
  },
  {
    question: "How secure is my personal data on the platform?",
    answer: "We implement end-to-end encryption, decentralized identity management, and adhere to strict compliance standards including GDPR and CCPA. Your personal data is never sold to third parties, and you have complete control over your privacy settings.",
    category: "Privacy & Security",
    tags: ["data security", "privacy", "encryption"]
  },
  {
    question: "How are shipping costs determined?",
    answer: "Shipping costs are optimized through our AI-driven winning bid system, which selects the most cost-effective and environmentally friendly shipping option. The system considers distance, carbon footprint, and delivery timeframes to provide the best balance of efficiency and sustainability.",
    category: "Logistics",
    tags: ["shipping", "costs", "AI bidding"]
  },
  {
    question: "How can I become a logistics partner?",
    answer: "To become a logistics partner, please complete the application form in the Partners section of our platform. We evaluate partners based on their sustainability practices, delivery efficiency, and geographic coverage. Approved partners gain access to our AI-driven shipping bid system.",
    category: "Partnerships",
    tags: ["logistics", "partners", "application"]
  },
  {
    question: "What happens to items that don't sell?",
    answer: "Items that don't sell within a specified timeframe are evaluated for recycling or donation to local community organizations. Retailers are notified before any action is taken and can choose to reclaim the items, extend the selling period, or approve the alternative disposition.",
    category: "Donation Process",
    tags: ["unsold items", "recycling", "community donation"]
  }
];

// Function to search FAQs
export const searchFaqs = (searchTerm: string): FaqItem[] => {
  if (!searchTerm.trim()) return faqItems;
  
  const term = searchTerm.toLowerCase();
  return faqItems.filter(faq => 
    faq.question.toLowerCase().includes(term) || 
    faq.answer.toLowerCase().includes(term) ||
    (faq.tags && faq.tags.some(tag => tag.toLowerCase().includes(term))) ||
    (faq.category && faq.category.toLowerCase().includes(term))
  );
};

// Mock function to submit a support ticket
export const submitSupportTicket = async (ticketData: any): Promise<{ success: boolean, ticketId?: string, error?: string }> => {
  // In a real application, this would call an API endpoint
  console.log('Submitting support ticket:', ticketData);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate successful response
  return {
    success: true,
    ticketId: `TICKET-${Math.floor(1000 + Math.random() * 9000)}`
  };
};

// Get support operating hours
export const getSupportHours = () => {
  return {
    chat: "9am-5pm ET, Monday through Friday",
    phone: "9am-5pm ET, Monday through Friday",
    email: "Responses within 24 hours during business days"
  };
};

// Export all support methods
const supportService = {
  getFaqs: () => faqItems,
  searchFaqs,
  submitSupportTicket,
  getSupportHours
};

export default supportService;
