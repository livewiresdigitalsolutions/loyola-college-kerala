// app/sys-ops/components/YearPicker.tsx
"use client";

import * as React from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface YearPickerProps {
  value: string;
  onChange: (year: string) => void;
  availableYears?: string[];
  className?: string;
}

export function YearPicker({
  value,
  onChange,
  availableYears = [],
  className,
}: YearPickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [displayYears, setDisplayYears] = React.useState<string[]>([]);
  const [startYear, setStartYear] = React.useState<number>(2020);

  // Generate a range of years centered around the current selection
  React.useEffect(() => {
    if (availableYears.length > 0) {
      setDisplayYears(availableYears);
      
      // Set start year to show current selection in view
      if (value) {
        const yearNum = parseInt(value);
        setStartYear(Math.floor(yearNum / 12) * 12);
      }
    } else {
      // Generate years from 2020 to 2030 if no available years
      const currentYear = new Date().getFullYear();
      const years = [];
      for (let i = currentYear - 5; i <= currentYear + 5; i++) {
        years.push(i.toString());
      }
      setDisplayYears(years);
      setStartYear(currentYear - 5);
    }
  }, [availableYears, value]);

  const yearsToShow = React.useMemo(() => {
    // Show 12 years at a time in a grid
    const years = [];
    for (let i = 0; i < 12; i++) {
      const year = (startYear + i).toString();
      years.push(year);
    }
    return years;
  }, [startYear]);

  const handlePrevious = () => {
    setStartYear((prev) => prev - 12);
  };

  const handleNext = () => {
    setStartYear((prev) => prev + 12);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[180px] justify-start text-left font-normal bg-white hover:bg-gray-50",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value || "Select year"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white" align="start">
        <div className="p-3 bg-white">
          {/* Header with navigation */}
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 bg-white hover:bg-gray-100"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-semibold text-gray-900">
              {startYear} - {startYear + 11}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 bg-white hover:bg-gray-100"
              onClick={handleNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Year grid */}
          <div className="grid grid-cols-3 gap-2">
            {yearsToShow.map((year) => {
              const isSelected = year === value;
              const isAvailable =
                availableYears.length === 0 || availableYears.includes(year);

              return (
                <Button
                  key={year}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  disabled={!isAvailable}
                  className={cn(
                    "h-9 bg-white hover:bg-gray-100",
                    isSelected && "bg-[#342D87] text-white hover:bg-[#2a2470]",
                    !isAvailable && "opacity-30 cursor-not-allowed bg-gray-50"
                  )}
                  onClick={() => {
                    if (isAvailable) {
                      onChange(year);
                      setIsOpen(false);
                    }
                  }}
                >
                  {year}
                </Button>
              );
            })}
          </div>

          {/* Available years indicator */}
          {availableYears.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200 bg-white">
              <p className="text-xs text-gray-500 text-center">
                {availableYears.length} year{availableYears.length !== 1 ? 's' : ''} available
              </p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
