// components/report/WeekSelector.tsx
"use client";

import { useState } from "react";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
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

  // 週の開始日（日曜日）と終了日（土曜日）を計算
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      onDateChange(selectedDate);
      setIsOpen(false);
    }
  };

  // 表示用の文字列をフォーマット
  const displayRange = `${format(weekStart, "yyyy/MM/dd")} 〜 ${format(
    weekEnd,
    "yyyy/MM/dd"
  )}`;

  return (
    <div className="flex items-center justify-center">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn("w-[280px] justify-start text-left font-normal")}
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
    </div>
  );
};
