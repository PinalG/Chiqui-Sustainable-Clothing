
import { useState, useEffect, useRef } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DateRange {
  from: Date;
  to: Date;
}

interface DateRangePickerProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

export function DateRangePicker({ dateRange, onDateRangeChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRange>(dateRange);
  
  // Reset internal state when external dateRange changes
  useEffect(() => {
    setSelectedRange(dateRange);
  }, [dateRange]);
  
  // Apply current selection to parent component
  const applySelection = () => {
    onDateRangeChange(selectedRange);
    setIsOpen(false);
  };
  
  // Format the displayed date range
  const displayDateRange = () => {
    if (selectedRange.from && selectedRange.to) {
      return `${format(selectedRange.from, "MMM d, yyyy")} - ${format(selectedRange.to, "MMM d, yyyy")}`;
    }
    return "Select date range";
  };
  
  // Predefined date ranges
  const selectPredefinedRange = (days: number) => {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - days);
    setSelectedRange({ from, to });
  };
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayDateRange()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 border-b">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Select Date Range</h3>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => selectPredefinedRange(7)}
              className="text-xs"
            >
              Last 7 days
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => selectPredefinedRange(30)}
              className="text-xs"
            >
              Last 30 days
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => selectPredefinedRange(90)}
              className="text-xs"
            >
              Last 90 days
            </Button>
          </div>
        </div>
        <Calendar
          mode="range"
          selected={{ from: selectedRange.from, to: selectedRange.to }}
          onSelect={(range) => {
            if (range?.from && range?.to) {
              setSelectedRange({ from: range.from, to: range.to });
            }
          }}
          numberOfMonths={2}
          defaultMonth={selectedRange.from}
        />
        <div className="p-3 border-t flex justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={applySelection}
          >
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
