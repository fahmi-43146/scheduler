"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function DatePicker({
  className = "",
  onSelect,
}: {
  className?: string;
  onSelect?: (d: Date) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <Label htmlFor="date" className="sr-only">
        Date
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-44 justify-between font-medium cursor-pointer 
                       bg-white dark:bg-gray-900 text-slate-700 dark:text-slate-200
                       hover:bg-orange-600 hover:text-white transition-all duration-200 
                       focus-visible:ring-2 focus-visible:ring-orange-400"
          >
            {date ? date.toLocaleDateString() : "Select date"}
            <ChevronDownIcon className="w-4 h-4 ml-1 opacity-80" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-auto p-0 border border-orange-400/30 bg-white dark:bg-gray-900 rounded-lg shadow-md"
        >
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(d) => {
              setDate(d);
              if (d) onSelect?.(d);
              setOpen(false);
            }}
            className="p-2 rounded-md"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
