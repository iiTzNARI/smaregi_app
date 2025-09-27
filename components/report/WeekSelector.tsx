// components/report/WeekSelector.tsx
"use client";

import { useState } from "react";
import { format, startOfWeek, endOfWeek } from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type WeekSelectorProps = {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  isLoading: boolean;
};

export const WeekSelector = ({
  currentDate,
  onDateChange,
  isLoading,
}: WeekSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      onDateChange(selectedDate);
      setIsOpen(false);
    }
  };

  // 週を変更する関数
  const changeWeekByArrow = (amount: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + amount * 7);
    onDateChange(newDate);
  };

  const displayRange = `${format(weekStart, "yyyy/MM/dd")} 〜 ${format(
    weekEnd,
    "yyyy/MM/dd"
  )}`;

  return (
    <div className="flex items-center justify-center gap-2">
      {/* 前週ボタン */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => changeWeekByArrow(-1)}
        disabled={isLoading}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn("w-[240px] justify-start text-left font-normal")}
            disabled={isLoading}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {displayRange}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={currentDate}
            onSelect={handleDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {/* 翌週ボタン */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => changeWeekByArrow(1)}
        disabled={isLoading}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
