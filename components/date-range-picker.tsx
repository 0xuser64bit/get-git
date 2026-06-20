"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRangePickerProps } from "@/utils/types";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  return (
    <div className="flex items-center gap-1">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-9 justify-start gap-2 border-border bg-card/70 font-mono text-xs font-normal"
          >
            <CalendarIcon className="h-3.5 w-3.5" />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "MMM d")} – {format(value.to, "MMM d, y")}
                </>
              ) : (
                format(value.from, "MMM d, y")
              )
            ) : (
              <span className="text-muted-foreground">Date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto border-border bg-popover p-0"
          align="end"
        >
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
      {value?.from && (
        <button
          type="button"
          onClick={() => onChange?.(undefined)}
          aria-label="Clear date range"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card/70 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
