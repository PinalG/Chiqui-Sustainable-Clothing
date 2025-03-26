
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SupportContactCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  buttonText: string;
  buttonAction: string;
  buttonType?: 'link' | 'button';
  buttonVariant?: 'default' | 'outline';
}

const SupportContactCard = ({
  icon: Icon,
  title,
  description,
  buttonText,
  buttonAction,
  buttonType = 'link',
  buttonVariant = 'outline'
}: SupportContactCardProps) => {
  return (
    <Card className="hover-scale transition-transform duration-300">
      <CardHeader className="bg-soft-pink/10 rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-soft-pink" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <p className="text-sm mb-4">{description}</p>
      </CardContent>
      <CardFooter>
        <Button variant={buttonVariant} className="w-full">
          {buttonType === 'link' ? (
            <a href={buttonAction}>{buttonText}</a>
          ) : (
            buttonText
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SupportContactCard;
