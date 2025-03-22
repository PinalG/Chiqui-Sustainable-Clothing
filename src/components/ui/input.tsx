
import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  errorMessage?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, errorMessage, id, "aria-describedby": ariaDescribedby, ...props }, ref) => {
    const errorId = `${id}-error`;
    const combinedAriaDescribedby = error ? 
      (ariaDescribedby ? `${ariaDescribedby} ${errorId}` : errorId) : 
      ariaDescribedby;
    
    return (
      <div className="relative">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          ref={ref}
          id={id}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={combinedAriaDescribedby}
          {...props}
        />
        {error && errorMessage && (
          <p 
            id={errorId} 
            className="text-destructive text-sm mt-1"
            aria-live="polite"
          >
            {errorMessage}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
