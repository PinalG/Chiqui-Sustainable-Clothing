
import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> & {
    label?: string;
    description?: string;
  }
>(({ className, label, description, id, ...props }, ref) => {
  const descriptionId = description && id ? `${id}-description` : undefined;
  const groupLabelId = label && id ? `${id}-group-label` : undefined;
  
  return (
    <div className="space-y-2">
      {label && (
        <div id={groupLabelId} className="text-sm font-medium">
          {label}
        </div>
      )}
      {description && (
        <p id={descriptionId} className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
      <RadioGroupPrimitive.Root
        className={cn("grid gap-2", className)}
        {...props}
        ref={ref}
        id={id}
        aria-labelledby={groupLabelId}
        aria-describedby={descriptionId}
      />
    </div>
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & {
    itemLabel?: string;
    itemDescription?: string;
  }
>(({ className, itemLabel, itemDescription, id, ...props }, ref) => {
  const itemDescriptionId = itemDescription && id ? `${id}-item-description` : undefined;
  
  return (
    <div className="flex items-start space-x-2">
      <RadioGroupPrimitive.Item
        ref={ref}
        id={id}
        className={cn(
          "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        aria-describedby={itemDescriptionId}
        {...props}
      >
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
          <Circle className="h-2.5 w-2.5 fill-current text-current" aria-hidden="true" />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>
      {(itemLabel || itemDescription) && (
        <div className="grid gap-1.5 leading-none">
          {itemLabel && (
            <label
              htmlFor={id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {itemLabel}
            </label>
          )}
          {itemDescription && (
            <p
              id={itemDescriptionId}
              className="text-sm text-muted-foreground"
            >
              {itemDescription}
            </p>
          )}
        </div>
      )}
    </div>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
