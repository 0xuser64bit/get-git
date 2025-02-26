"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { DateRangePickerProps } from "@/utils/types";
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  return (
    <div className="relative w-full md:w-auto">
      {value?.from && value?.to && (
        <p className="absolute right-0 -top-6 flex items-center border rounded-full bg-slate-400/20 hover:bg-slate-400/10 px-2 py-0.5">
          <span className="text-xs">
            {format(value.from, "LLL dd, y")} - {format(value.to, "LLL dd, y")}
          </span>
          <Plus
            className="h-4 w-4 font-bold rotate-45 cursor-pointer hover:text-black/80"
            onClick={() => onChange?.(undefined)}
          />
        </p>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full md:w-[280px] justify-start text-left font-normal",
              !value && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "LLL dd, y")} -{" "}
                  {format(value.to, "LLL dd, y")}
                </>
              ) : (
                format(value.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value?.from}
            selected={value}
            onSelect={onChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
