
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Minus, PackagePlus } from "lucide-react";
import { DonationItem } from "./types";

interface DonationItemListProps {
  items: DonationItem[];
  onRemoveItem: (index: number) => void;
}

const DonationItemList = ({ items, onRemoveItem }: DonationItemListProps) => {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-md border border-dashed">
        <PackagePlus className="w-12 h-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground text-center">No items added yet. Add items from the form to see them here.</p>
      </div>
    );
  }

  return (
    <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
      {items.map((item, index) => (
        <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
          <div className="flex items-center space-x-3">
            {item.image ? (
              <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover" />
            ) : (
              <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center">
                <PackagePlus className="w-6 h-6 text-gray-400" />
              </div>
            )}
            <div>
              <div className="flex items-center">
                <p className="font-medium">{item.category}</p>
                <Badge className="ml-2 bg-green-100 text-green-800 text-xs">
                  {item.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {item.quantity} items • ${item.value.toFixed(2)}
                {item.condition && ` • ${item.condition}`}
              </p>
              {item.tags && item.tags.length > 0 && (
                <div className="flex gap-1 mt-1">
                  {item.tags.slice(0, 2).map((tag, i) => (
                    <span key={i} className="px-1.5 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                      {tag}
                    </span>
                  ))}
                  {item.tags.length > 2 && (
                    <span className="px-1.5 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                      +{item.tags.length - 2}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemoveItem(index)}
            className="text-muted-foreground hover:text-destructive"
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default DonationItemList;
