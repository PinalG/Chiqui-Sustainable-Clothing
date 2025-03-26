
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useAnalytics } from '@/hooks/use-analytics';

interface FaqItemProps {
  question: string;
  answer: string;
  index: number;
  isExpanded: boolean;
  onToggle: (index: number) => void;
}

const FaqItem = ({ question, answer, index, isExpanded, onToggle }: FaqItemProps) => {
  const analytics = useAnalytics();
  
  const handleToggle = () => {
    analytics.trackEvent({
      category: 'Support',
      action: 'Toggle FAQ',
      label: question
    });
    
    onToggle(index);
  };
  
  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={handleToggle}
        className="flex justify-between items-center w-full p-4 text-left font-medium bg-muted/50 hover:bg-muted transition-colors"
      >
        <span>{question}</span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>
      
      {isExpanded && (
        <div className="p-4 bg-white">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

export default FaqItem;
